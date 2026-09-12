import { Pool, PoolClient } from "pg";
import type {
  IRepository,
  AuditEntry,
  RepositoryError,
  WriteOptions,
} from "../repository";
import { config } from "../../config";

const TABLE_MAP: Record<string, string> = {
  tenant: "tenants",
  session: "sessions",
  apiKey: "api_keys",
  audit: "audit_events",
};
function toRepositoryError(
  message: string,
  statusCode = 500,
  tenantId?: string,
): RepositoryError {
  const err = new Error(message) as RepositoryError;
  err.code = "REPOSITORY_ERROR";
  err.statusCode = statusCode;
  if (tenantId !== undefined) err.tenantId = tenantId;
  err.retryable = statusCode >= 500;
  return err;
}
let pgPool: Pool | null = null;
function getPgPool(): Pool {
  if (!pgPool) {
    const url = config().DATABASE_URL;
    if (!url) throw toRepositoryError("DATABASE_URL not configured", 500);
    pgPool = new Pool({ connectionString: url, max: 10 });
    pgPool.on("error", (err) =>
      console.error("Unexpected error on idle Neon pool", err),
    );
  }
  return pgPool;
}
function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    out[toSnakeKey(k)] = v;
  }
  return out;
}
function toSnakeKey(key: string): string {
  return key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}
function toCamel<T>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) out[toCamelKey(k)] = v;
  return out as T;
}
function toCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export class NeonRepository<T extends object> implements IRepository<T> {
  private readonly table: string;
  private readonly type: string;
  constructor(type: string) {
    this.type = type;
    this.table = TABLE_MAP[type] ?? type;
  }
  async create(
    tenantId: string,
    data: Partial<T>,
    options?: WriteOptions,
  ): Promise<T> {
    if (!tenantId) throw toRepositoryError("tenantId required for create", 400);
    const pool = getPgPool();
    const payload = { ...data, tenant_id: tenantId } as Record<string, unknown>;
    const row = toSnake(payload);
    if (options?.idempotencyKey && !row.id) row.id = options.idempotencyKey;
    const cols = Object.keys(row).join(", ");
    const vals = Object.values(row);
    const placeholders = vals.map((_, i) => `$${i + 1}`).join(", ");
    const { rows } = await pool.query(
      `INSERT INTO ${this.table} (${cols}) VALUES (${placeholders}) RETURNING *`,
      vals,
    );
    if (!rows[0])
      throw toRepositoryError("Neon insert returned no row", 500, tenantId);
    return toCamel<T>(rows[0]);
  }
  async read(tenantId: string, id: string): Promise<T | null> {
    if (!tenantId) throw toRepositoryError("tenantId required for read", 400);
    const { rows } = await getPgPool().query(
      `SELECT * FROM ${this.table} WHERE id = $1 AND tenant_id = $2 LIMIT 1`,
      [id, tenantId],
    );
    return rows[0] ? toCamel<T>(rows[0]) : null;
  }
  async list(
    tenantId: string,
    filters?: Record<string, unknown>,
    limit?: number,
    offset?: number,
  ): Promise<{ items: T[]; total: number }> {
    if (!tenantId) throw toRepositoryError("tenantId required for list", 400);
    const pool = getPgPool();
    let where = "WHERE tenant_id = $1";
    const params: unknown[] = [tenantId];
    let paramIdx = 2;
    if (filters)
      for (const [k, v] of Object.entries(filters))
        if (v !== undefined) {
          where += ` AND ${toSnakeKey(k)} = $${paramIdx++}`;
          params.push(v);
        }
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM ${this.table} ${where}`,
      params,
    );
    const total = parseInt(countRows[0]?.count ?? "0", 10);
    let query = `SELECT * FROM ${this.table} ${where} ORDER BY created_at DESC`;
    if (limit !== undefined) {
      query += ` LIMIT $${paramIdx++}`;
      params.push(limit);
    }
    if (offset !== undefined) {
      query += ` OFFSET $${paramIdx++}`;
      params.push(offset);
    }
    const { rows } = await pool.query(query, params);
    return { items: rows.map(toCamel<T>), total };
  }
  async update(tenantId: string, id: string, data: Partial<T>): Promise<T> {
    if (!tenantId) throw toRepositoryError("tenantId required for update", 400);
    const row = toSnake(data as Record<string, unknown>);
    const sets = Object.keys(row)
      .map((k, i) => `${k} = $${i + 3}`)
      .join(", ");
    const vals = [id, tenantId, ...Object.values(row)];
    const { rows } = await getPgPool().query(
      `UPDATE ${this.table} SET ${sets} WHERE id = $1 AND tenant_id = $2 RETURNING *`,
      vals,
    );
    if (!rows[0])
      throw toRepositoryError(`Record ${id} not found`, 404, tenantId);
    return toCamel<T>(rows[0]);
  }
  async delete(tenantId: string, id: string): Promise<boolean> {
    if (!tenantId) throw toRepositoryError("tenantId required for delete", 400);
    const { rowCount } = await getPgPool().query(
      `DELETE FROM ${this.table} WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId],
    );
    return (rowCount ?? 0) > 0;
  }

  /** Serialize each tenant's audit chain in one DB transaction. */
  async audit(entry: AuditEntry): Promise<void> {
    const pool = getPgPool();
    const { createHash, randomUUID } = await import("node:crypto");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
        [entry.tenantId],
      );
      const { rows: lastRows } = await client.query(
        `SELECT verification_hash FROM audit_events WHERE tenant_id = $1 ORDER BY timestamp DESC, id DESC LIMIT 1 FOR UPDATE`,
        [entry.tenantId],
      );
      const previousLogHash =
        (lastRows[0]?.verification_hash as string) ?? "0".repeat(64);
      const timestamp = entry.timestamp ?? new Date().toISOString();
      const id = entry.id ?? `audit_${randomUUID().slice(0, 8)}`;
      const details = JSON.stringify(entry.details ?? {});
      const payload = `${id}|${timestamp}|${entry.traceId}|${entry.action}|${entry.resource}|${entry.actor}|${entry.result}|${details}|${entry.severity}|${entry.tenantId}|${previousLogHash}`;
      const verificationHash = createHash("sha256")
        .update(payload)
        .digest("hex");
      await client.query(
        `INSERT INTO audit_events (id, tenant_id, trace_id, correlation_id, actor_ip, event, severity, details, remediated, verification_hash, previous_log_hash)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          id,
          entry.tenantId,
          entry.traceId,
          entry.traceId,
          "",
          entry.action,
          entry.severity,
          details,
          false,
          verificationHash,
          previousLogHash,
        ],
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async health(): Promise<{ ok: boolean; latencyMs: number }> {
    const start = performance.now();
    try {
      await getPgPool().query("SELECT 1");
      return { ok: true, latencyMs: performance.now() - start };
    } catch {
      return { ok: false, latencyMs: performance.now() - start };
    }
  }
  async findByPrefix(prefix: string): Promise<T | null> {
    const { rows } = await getPgPool().query(
      `SELECT * FROM ${this.table} WHERE prefix = $1 LIMIT 1`,
      [prefix],
    );
    return rows[0] ? toCamel<T>(rows[0]) : null;
  }
  async withTransaction<R>(fn: (client: PoolClient) => Promise<R>): Promise<R> {
    const client = await getPgPool().connect();
    try {
      await client.query("BEGIN");
      const result = await fn(client);
      await client.query("COMMIT");
      return result;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
}
