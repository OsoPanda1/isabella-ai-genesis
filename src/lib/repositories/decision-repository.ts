/**
 * LEDGER DE DECISIONES POSTGRES (src/lib/repositories/decision-repository.ts)
 * -----------------------------------------------------------------
 * Implementación durable de `LedgerStore` sobre `isabella_decisions`
 * (migración 20260926030000_isabella_policy_as_code.sql), con las reglas de
 * este repositorio:
 *  - process.env sólo vía `config()` (§21),
 *  - fail-closed: sin DATABASE_URL o con la base ilegible, `append`/`latestHash`
 *    lanzan; nadie inventa una cadena local (§4.2),
 *  - integridad: `append` exige que `record.previousHash` coincida con el
 *    último `record_hash` del tenant (la tabla además es append-only por
 *    trigger y tiene UNIQUE (tenant_id, record_hash)),
 *  - `pg` se importa dinámicamente para no arrastrarlo al bundle cliente.
 *
 * `deps.query` existe como punto de inyección para tests (la misma técnica
 * que los repositorios con cliente inyectado); en runtime se usa el pool real.
 */

import { config } from "../config";
import { hashRecord } from "../governance/decision-ledger";
import type { DecisionRecord, LedgerStore } from "../governance/decision-ledger";

export type DecisionQuery = (
  text: string,
  values?: unknown[],
) => Promise<{ rows: Array<Record<string, unknown>> }>;

export interface DecisionLedgerDeps {
  query?: DecisionQuery;
  close?: () => Promise<void>;
}

let poolQuery: DecisionQuery | null = null;
let poolClose: (() => Promise<void>) | null = null;
let poolInit: Promise<DecisionQuery> | null = null;

async function resolveQuery(deps?: DecisionLedgerDeps): Promise<DecisionQuery> {
  if (deps?.query) return deps.query;
  if (poolQuery) return poolQuery;
  if (poolInit) return poolInit;

  poolInit = (async () => {
    const url = config().DATABASE_URL;
    if (!url) {
      throw new Error(
        "DECISION_LEDGER_UNAVAILABLE: DATABASE_URL ausente; isabella_decisions no es alcanzable.",
      );
    }
    const { Pool } = await import("pg");
    const candidate = new Pool({ connectionString: url, max: 2 });
    const query: DecisionQuery = (text, values) => candidate.query(text, values);
    const close = async () => {
      await candidate.end();
    };
    poolQuery = query;
    poolClose = close;
    poolInit = null;
    return query;
  })().catch((error) => {
    poolInit = null;
    throw error;
  });

  return poolInit;
}

/** Cierra el pool (sólo para shutdown/tests). */
export async function closeDecisionPool(): Promise<void> {
  const close = poolClose;
  poolQuery = null;
  poolClose = null;
  poolInit = null;
  if (close) await close().catch(() => undefined);
}

function mapRow(row: Record<string, unknown>): DecisionRecord {
  const evidence = row.evidence_ids;
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id),
    actorId: String(row.actor_id),
    authority: String(row.authority),
    capability: String(row.capability),
    policy: String(row.policy),
    risk: String(row.risk) as DecisionRecord["risk"],
    ...(row.model_id == null ? {} : { modelId: String(row.model_id) }),
    inputHash: String(row.input_hash),
    outputHash: String(row.output_hash),
    result: String(row.result) as DecisionRecord["result"],
    timestamp: new Date(String(row.recorded_at)).toISOString(),
    previousHash: String(row.previous_hash),
    recordHash: String(row.record_hash),
    evidenceIds: Array.isArray(evidence)
      ? evidence.map((item) => String(item))
      : typeof evidence === "string"
        ? (JSON.parse(evidence) as string[]).map((item) => String(item))
        : [],
  };
}

/**
 * Ledger durable. `append` verifica la cadena antes de insertar y es
 * idempotente ante reenvíos del mismo registro (UNIQUE tenant+record_hash).
 */
export function createPostgresDecisionLedger(deps?: DecisionLedgerDeps): LedgerStore & {
  verifyChain(tenantId: string, limit?: number): Promise<{ ok: boolean; checked: number }>;
} {
  async function latestHash(tenantId: string): Promise<string | undefined> {
    const run = await resolveQuery(deps);
    const { rows } = await run(
      `SELECT record_hash
         FROM public.isabella_decisions
        WHERE tenant_id = $1
          AND record_hash IS NOT NULL
        ORDER BY append_seq DESC
        LIMIT 1`,
      [tenantId],
    );
    return rows[0] ? String(rows[0].record_hash) : undefined;
  }

  async function append(record: DecisionRecord): Promise<void> {
    const run = await resolveQuery(deps);

    /*
     * Un único statement = una única transacción implícita en PostgreSQL.
     * El advisory lock se adquiere antes de leer la punta de la cadena y se
     * mantiene durante la inserción, evitando forks por escritores concurrentes.
     */
    const { rows } = await run(
      `WITH tenant_lock AS (
         SELECT pg_advisory_xact_lock(hashtextextended($1, 0))
       ),
       latest AS (
         SELECT record_hash
           FROM public.isabella_decisions
          WHERE tenant_id = $1
            AND record_hash IS NOT NULL
          ORDER BY append_seq DESC
          LIMIT 1
       )
       INSERT INTO public.isabella_decisions
         (id, tenant_id, actor_id, authority, capability, policy, risk, model_id,
          input_hash, output_hash, result, previous_hash, record_hash, evidence_ids, recorded_at)
       SELECT $2, $1, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb, $15
         FROM tenant_lock
        WHERE $12 = COALESCE((SELECT record_hash FROM latest), 'GENESIS')
       ON CONFLICT (tenant_id, record_hash) DO NOTHING
       RETURNING id`,
      [
        record.tenantId,
        record.id,
        record.actorId,
        record.authority,
        record.capability,
        record.policy,
        record.risk,
        record.modelId ?? null,
        record.inputHash,
        record.outputHash,
        record.result,
        record.previousHash,
        record.recordHash,
        JSON.stringify(record.evidenceIds),
        record.timestamp,
      ],
    );

    /*
     * La ausencia de RETURNING puede significar idempotencia por conflicto o
     * rechazo por mismatch de cadena. Se distingue para no ocultar corrupción.
     */
    if (rows[0]) return;
    const duplicate = await run(
      `SELECT 1
         FROM public.isabella_decisions
        WHERE tenant_id = $1 AND record_hash = $2
        LIMIT 1`,
      [record.tenantId, record.recordHash],
    );
    if (duplicate.rows[0]) return;

    const expected = (await latestHash(record.tenantId)) ?? "GENESIS";
    throw new Error(
      `DECISION_CHAIN_MISMATCH: previousHash ${record.previousHash} no coincide con el último record_hash ${expected}.`,
    );
  }

  async function verifyChain(
    tenantId: string,
    limit = 100,
  ): Promise<{ ok: boolean; checked: number }> {
    const run = await resolveQuery(deps);
    const { rows } = await run(
      `SELECT * FROM (
         SELECT * FROM public.isabella_decisions
          WHERE tenant_id = $1
            AND record_hash IS NOT NULL
          ORDER BY append_seq DESC
          LIMIT $2
       ) recent
       ORDER BY append_seq ASC`,
      [tenantId, limit],
    );
    let previous = "GENESIS";
    let checked = 0;
    for (const row of rows) {
      const record = mapRow(row);
      const { recordHash, ...base } = record;
      if (record.previousHash !== previous) return { ok: false, checked };
      if (hashRecord(base) !== recordHash) return { ok: false, checked };
      previous = recordHash;
      checked += 1;
    }
    return { ok: true, checked };
  }

  return { append, latestHash, verifyChain };
}
