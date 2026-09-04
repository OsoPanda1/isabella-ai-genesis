import { Pool } from "pg";
import { createHash, randomUUID } from "node:crypto";
import { config } from "../config";
import type { BlockPIBlock, LedgerCategory, LedgerStatus } from "./bookpi-repository";

const GENESIS_PREVIOUS_HASH = "0".repeat(64);

let pool: Pool | null = null;
function getPool(url: string) {
  if (!pool) {
    try {
      pool = new Pool({ connectionString: url });
    } catch {
      console.warn('[AI Studio] DB not connected — mock active');
      pool = {
        query: async () => ({ rows: [] }),
        connect: async () => ({
          query: async () => ({ rows: [] }),
          release: () => {}
        })
      } as unknown as Pool;
    }
  }
  return pool;
}

function hashBlock(block: Omit<BlockPIBlock, "blockHash">): string {
  return createHash("sha256")
    .update(
      [
        block.index,
        block.timestamp,
        block.tenantId,
        block.userId,
        block.operation,
        block.category,
        block.costDecimal,
        block.tokensConsumed,
        block.previousHash,
        block.signatureAlgorithm,
        block.status,
        block.nonce,
      ].join("|"),
    )
    .digest("hex");
}

function mapRow(row: Record<string, unknown>): BlockPIBlock {
  return {
    index: Number(row.block_index ?? row.index),
    timestamp: new Date(String(row.created_at ?? row.timestamp)).toISOString(),
    tenantId: String(row.tenant_id),
    userId: String(row.user_id),
    operation: String(row.operation),
    category: String(row.category) as LedgerCategory,
    costDecimal: String(row.cost_decimal),
    tokensConsumed: Number(row.tokens_consumed ?? row.tokens),
    previousHash: String(row.previous_hash),
    blockHash: String(row.block_hash ?? row.hash),
    pqcSignature: (row.pqc_signature as string) ?? null,
    signatureAlgorithm: String(row.signature_algorithm ?? "SHA-256"),
    status: (String(row.status) === "refunded" ? "refunded" : "settled") as LedgerStatus,
    nonce: String(row.id ?? randomUUID()),
  };
}

/**
 * Repositorio BookPI contra la tabla canónica `bookpi_ledger` (FASE 3 / P0-10).
 * Append-only: los refunds se registran como eventos nuevos, nunca como UPDATE
 * del bloque original.
 */
export function createBookpiPostgresRepository() {
  const cfg = config();
  const pool = getPool(cfg.DATABASE_URL as string);

  return {
    async list(tenantId: string): Promise<BlockPIBlock[]> {
      const { rows } = await pool.query("SELECT * FROM public.bookpi_ledger WHERE tenant_id = $1 ORDER BY index ASC", [tenantId]);
      return rows.map(mapRow);
    },
    async append(input: {
      tenantId: string;
      userId: string;
      operation: string;
      category: LedgerCategory;
      cost: number;
      tokens: number;
      status?: LedgerStatus;
      metadata?: Record<string, unknown>;
    }) {
      if (!Number.isFinite(input.cost) || input.cost < 0)
        return { success: false as const, error: "Costo inválido." };
      if (!Number.isInteger(input.tokens) || input.tokens < 0)
        return { success: false as const, error: "Tokens inválidos." };

      // P1: Concurrency and Transactionality fix using Postgres Transactions
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        // SELECT FOR UPDATE avoids race conditions for previous block
        const { rows: previous } = await client.query(
          "SELECT * FROM public.bookpi_ledger WHERE tenant_id = $1 ORDER BY index DESC LIMIT 1 FOR UPDATE",
          [input.tenantId]
        );
        const previousBlock = previous[0] ? mapRow(previous[0]) : null;

        const index = previousBlock ? previousBlock.index + 1 : 0;
        const timestamp = new Date().toISOString();
        const costDecimal = input.cost.toFixed(2);
        const status: LedgerStatus = input.status ?? "settled";

        const base: Omit<BlockPIBlock, "blockHash"> = {
          index,
          timestamp,
          tenantId: input.tenantId,
          userId: input.userId,
          operation: input.operation.slice(0, 200),
          category: input.category,
          costDecimal,
          tokensConsumed: input.tokens,
          previousHash: previousBlock?.blockHash ?? GENESIS_PREVIOUS_HASH,
          pqcSignature: null,
          signatureAlgorithm: "SHA-256",
          status,
          nonce: randomUUID(),
        };
        const blockHash = hashBlock(base);
        const { rows } = await client.query(`
          INSERT INTO public.bookpi_ledger
          (index, tenant_id, user_id, operation, category, cost_decimal, tokens_consumed, previous_hash, block_hash, status, nonce, signature_algorithm)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING *`,
          [base.index, base.tenantId, base.userId, base.operation, base.category, base.costDecimal, base.tokensConsumed, base.previousHash, blockHash, status, base.nonce, base.signatureAlgorithm]
        );
        await client.query("COMMIT");
        return { success: true as const, block: mapRow(rows[0]!) };
      } catch (err) {
        await client.query("ROLLBACK");
        return { success: false as const, error: "Fallo transaccional" };
      } finally {
        client.release();
      }
    },
    async refund(
      originalEventId: string,
      requestor: { tenantId: string; userId: string },
      reason: string,
    ) {
      // FASE 3: refunds como nuevo evento, nunca UPDATE del original.
      const { rows: byId } = await pool.query(
        "SELECT * FROM public.bookpi_ledger WHERE tenant_id = $1 AND id = $2 LIMIT 1",
        [requestor.tenantId, originalEventId]
      );
      const original = byId[0] ? mapRow(byId[0]) : null;
      if (!original) return { success: false as const, error: "Evento original no encontrado." };
      if (original.status === "refunded")
        return { success: false as const, error: "Evento ya refundido." };
      return this.append({
        tenantId: requestor.tenantId,
        userId: requestor.userId,
        operation: `refund_of_${original.index}_${reason}`,
        category: original.category,
        cost: original.costDecimal ? Number(original.costDecimal) : 0,
        tokens: 0,
        status: "refunded",
      });
    },
    async verifyIntegrity(tenantId?: string) {
      let rows;
      if (tenantId) {
        const res = await pool.query("SELECT * FROM public.bookpi_ledger WHERE tenant_id = $1 ORDER BY index ASC", [tenantId]);
        rows = res.rows;
      } else {
        const res = await pool.query("SELECT * FROM public.bookpi_ledger ORDER BY tenant_id ASC, index ASC");
        rows = res.rows;
      }
      let previousTenant = "";
      let previousHash = GENESIS_PREVIOUS_HASH;
      for (const row of rows) {
        const block = mapRow(row);
        if (block.tenantId !== previousTenant) {
          previousTenant = block.tenantId;
          previousHash = GENESIS_PREVIOUS_HASH;
        }
        if (block.previousHash !== previousHash || hashBlock(block) !== block.blockHash) {
          return {
            success: false as const,
            error: "Cadena BookPI alterada.",
            corruptedIndex: block.index,
          };
        }
        previousHash = block.blockHash;
      }
      return { success: true as const };
    },
  };
}

export type BookpiPostgresRepository = ReturnType<typeof createBookpiPostgresRepository>;
