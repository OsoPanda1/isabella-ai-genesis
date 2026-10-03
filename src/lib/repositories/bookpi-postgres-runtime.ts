/**
 * BookPI PostgreSQL Runtime
 * -----------------------------------------------------------------
 * Implementación durable para producción. No sustituye ni elimina
 * el repositorio legacy: lo complementa y lo hace verdaderamente
 * persistente sobre la tabla append-only `bookpi_ledger`.
 */
import { createHash, randomInt } from "node:crypto";
import pg from "pg";
import type {
  BookPiBlock,
  BookPiRepository,
} from "./bookpi-postgres-repository";
import type {
  BlockPIBlock,
  LedgerCategory,
  LedgerStatus,
} from "../bookpi/types";
import { canonicalize } from "../igds/canonical";
import { getPgPool } from "../persistence/postgres";

const GENESIS_HASH = "GENESIS_BLOCK_HASH";
const HASH_ALGORITHM = "SHA3-512-HASH-CHAIN";
const MAX_TENANT_LENGTH = 128;
const MAX_USER_LENGTH = 128;
const MAX_OPERATION_LENGTH = 512;
const MAX_CATEGORY_LENGTH = 64;

export interface DurableBookPiRepository extends BookPiRepository {
  append(input: {
    tenantId: string;
    userId: string;
    operation: string;
    category?: LedgerCategory | string;
    cost?: number;
    tokens?: number;
    status?: LedgerStatus | "CONFIRMED" | "PENDING" | "FAILED" | "REVERSED";
  }): Promise<{ success: boolean; error?: string; block?: BlockPIBlock }>;
}

function text(value: string, field: string, max: number): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field}_required`);
  if (normalized.length > max) throw new Error(`${field}_too_long`);
  return normalized;
}

function nonNegative(value: number, field: string): number {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${field}_invalid`);
  return value;
}

function normalizeStatus(
  status: LedgerStatus | "CONFIRMED" | "PENDING" | "FAILED" | "REVERSED" | undefined,
): BookPiBlock["status"] {
  if (status === "pending" || status === "PENDING") return "PENDING";
  if (status === "refunded" || status === "REVERSED") return "REVERSED";
  if (status === "pruned" || status === "FAILED") return "FAILED";
  return "CONFIRMED";
}

function legacyStatus(status: BookPiBlock["status"]): LedgerStatus {
  if (status === "PENDING") return "pending";
  if (status === "REVERSED") return "refunded";
  if (status === "FAILED") return "pruned";
  return "settled";
}

function toLegacy(block: BookPiBlock): BlockPIBlock {
  return {
    index: block.index,
    timestamp: block.timestamp,
    tenantId: block.tenant_id,
    userId: block.user_id,
    operation: block.operation,
    category: (["inference", "processing", "apis", "skills", "other"] as const).includes(
      block.category as LedgerCategory,
    )
      ? (block.category as LedgerCategory)
      : "other",
    costDecimal: block.cost_decimal.toFixed(6),
    tokensConsumed: block.tokens_consumed,
    previousHash: block.previous_hash,
    blockHash: block.block_hash,
    pqcSignature: null,
    signatureAlgorithm: block.signature_algorithm,
    status: legacyStatus(block.status),
    nonce: String(block.nonce),
  };
}

function hashPayload(input: Omit<BookPiBlock, "block_hash">): string {
  return createHash("sha3-512")
    .update(
      canonicalize({
        index: input.index,
        tenant_id: input.tenant_id,
        user_id: input.user_id,
        timestamp: input.timestamp,
        operation: input.operation,
        category: input.category,
        cost_decimal: input.cost_decimal,
        tokens_consumed: input.tokens_consumed,
        previous_hash: input.previous_hash,
        signature_algorithm: input.signature_algorithm,
        status: input.status,
        nonce: input.nonce,
      }),
      "utf8",
    )
    .digest("hex");
}

function fromRow(row: Record<string, unknown>): BookPiBlock {
  return {
    index: Number(row.index),
    tenant_id: String(row.tenant_id),
    user_id: String(row.user_id),
    timestamp: new Date(String(row.timestamp)).toISOString(),
    operation: String(row.operation),
    category: String(row.category),
    cost_decimal: Number(row.cost_decimal),
    tokens_consumed: Number(row.tokens_consumed),
    previous_hash: String(row.previous_hash),
    block_hash: String(row.block_hash),
    signature_algorithm: String(row.signature_algorithm),
    status: String(row.status) as BookPiBlock["status"],
    nonce: Number(row.nonce),
  };
}

function lockId(tenantId: string): number {
  return createHash("sha256").update(tenantId, "utf8").digest().readInt32BE(0);
}

async function inTenantTransaction<T>(
  pool: pg.Pool,
  tenantId: string,
  fn: (client: pg.PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [lockId(tenantId)]);
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

class DurableBookPiRepositoryImpl implements DurableBookPiRepository {
  constructor(private readonly pool: pg.Pool) {}

  async appendBlock(input: {
    tenant_id: string;
    user_id: string;
    operation: string;
    category?: string;
    cost_decimal?: number;
    tokens_consumed?: number;
    status?: "CONFIRMED" | "PENDING" | "FAILED" | "REVERSED";
  }): Promise<BookPiBlock> {
    const tenantId = text(input.tenant_id, "tenant_id", MAX_TENANT_LENGTH);
    const userId = text(input.user_id, "user_id", MAX_USER_LENGTH);
    const operation = text(input.operation, "operation", MAX_OPERATION_LENGTH);
    const category = text(String(input.category ?? "other"), "category", MAX_CATEGORY_LENGTH);
    const cost = nonNegative(input.cost_decimal ?? 0, "cost_decimal");
    const tokens = Math.trunc(nonNegative(input.tokens_consumed ?? 0, "tokens_consumed"));

    return inTenantTransaction(this.pool, tenantId, async (client) => {
      const latest = await client.query(
        "SELECT index, block_hash FROM bookpi_ledger WHERE tenant_id = $1 ORDER BY index DESC LIMIT 1",
        [tenantId],
      );

      const previousHash = latest.rows[0]?.block_hash
        ? String(latest.rows[0].block_hash)
        : GENESIS_HASH;
      const index =
        latest.rows[0]?.index === undefined ? 0 : Number(latest.rows[0].index) + 1;

      const payload: Omit<BookPiBlock, "block_hash"> = {
        index,
        tenant_id: tenantId,
        user_id: userId,
        timestamp: new Date().toISOString(),
        operation,
        category,
        cost_decimal: cost,
        tokens_consumed: tokens,
        previous_hash: previousHash,
        signature_algorithm: HASH_ALGORITHM,
        status: input.status ?? "CONFIRMED",
        nonce: randomInt(0, 1_000_000_000),
      };

      const blockHash = hashPayload(payload);
      const result = await client.query(
        `INSERT INTO bookpi_ledger
          (index, tenant_id, user_id, timestamp, operation, category, cost_decimal, tokens_consumed,
           previous_hash, block_hash, signature_algorithm, status, nonce)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         RETURNING *`,
        [
          payload.index,
          payload.tenant_id,
          payload.user_id,
          payload.timestamp,
          payload.operation,
          payload.category,
          payload.cost_decimal,
          payload.tokens_consumed,
          payload.previous_hash,
          blockHash,
          payload.signature_algorithm,
          payload.status,
          payload.nonce,
        ],
      );
      return fromRow(result.rows[0] as Record<string, unknown>);
    });
  }

  async append(input: {
    tenantId: string;
    userId: string;
    operation: string;
    category?: LedgerCategory | string;
    cost?: number;
    tokens?: number;
    status?: LedgerStatus | "CONFIRMED" | "PENDING" | "FAILED" | "REVERSED";
  }) {
    try {
      const block = await this.appendBlock({
        tenant_id: input.tenantId,
        user_id: input.userId,
        operation: input.operation,
        category: input.category,
        cost_decimal: input.cost ?? 0,
        tokens_consumed: input.tokens ?? 0,
        status: normalizeStatus(input.status),
      });
      return { success: true, block: toLegacy(block) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "BOOKPI_APPEND_FAILED",
      };
    }
  }

  async getLatestBlock(tenantId: string): Promise<BookPiBlock | null> {
    const safeTenant = text(tenantId, "tenantId", MAX_TENANT_LENGTH);
    const result = await this.pool.query(
      "SELECT * FROM bookpi_ledger WHERE tenant_id = $1 ORDER BY index DESC LIMIT 1",
      [safeTenant],
    );
    return result.rows[0]
      ? fromRow(result.rows[0] as Record<string, unknown>)
      : null;
  }

  async listBlocks(tenantId: string, limit = 50): Promise<readonly BookPiBlock[]> {
    const safeTenant = text(tenantId, "tenantId", MAX_TENANT_LENGTH);
    const safeLimit = Math.max(1, Math.min(Math.trunc(limit), 5000));
    const result = await this.pool.query(
      "SELECT * FROM bookpi_ledger WHERE tenant_id = $1 ORDER BY index ASC LIMIT $2",
      [safeTenant, safeLimit],
    );
    return result.rows.map((row) => fromRow(row as Record<string, unknown>));
  }

  async list(tenantId: string): Promise<BlockPIBlock[]> {
    return (await this.listBlocks(tenantId, 5000)).map(toLegacy);
  }

  async query(
    tenantId: string,
    filter: {
      category?: LedgerCategory;
      userId?: string;
      fromDate?: Date;
      toDate?: Date;
    },
  ): Promise<BlockPIBlock[]> {
    let rows = await this.list(tenantId);
    if (filter.category) rows = rows.filter((row) => row.category === filter.category);
    if (filter.userId) rows = rows.filter((row) => row.userId === filter.userId);
    if (filter.fromDate) rows = rows.filter((row) => new Date(row.timestamp) >= filter.fromDate!);
    if (filter.toDate) rows = rows.filter((row) => new Date(row.timestamp) <= filter.toDate!);
    return rows;
  }

  async batchAppend(inputs: Array<{
    tenantId: string;
    userId: string;
    operation: string;
    category?: LedgerCategory | string;
    cost?: number;
    tokens?: number;
    status?: LedgerStatus | "CONFIRMED" | "PENDING" | "FAILED" | "REVERSED";
  }>) {
    const blocks: BlockPIBlock[] = [];
    for (const input of inputs) {
      const result = await this.append(input);
      if (!result.success) return { success: false, error: result.error, blocks };
      if (result.block) blocks.push(result.block);
    }
    return { success: true, blocks };
  }

  async refund(tenantId: string, index: number, reason = "refund") {
    const original = await this.getLatestOrByIndex(tenantId, index);
    if (!original) return { success: false, error: "BOOKPI_BLOCK_NOT_FOUND" };

    const existing = await this.pool.query(
      "SELECT 1 FROM bookpi_ledger WHERE tenant_id = $1 AND operation LIKE $2 LIMIT 1",
      [tenantId, `REFUND_OF:${index}:%`],
    );
    if (existing.rows[0]) return { success: false, error: "BOOKPI_REFUND_DUPLICATE" };

    const result = await this.append({
      tenantId,
      userId: original.user_id,
      operation: `REFUND_OF:${index}:${reason.slice(0, 120)}`,
      category: "other",
      cost: 0,
      tokens: 0,
      status: "refunded",
    });
    return result.success
      ? { success: true }
      : { success: false, error: result.error };
  }

  private async getLatestOrByIndex(tenantId: string, index: number) {
    const result = await this.pool.query(
      "SELECT * FROM bookpi_ledger WHERE tenant_id = $1 AND index = $2 LIMIT 1",
      [tenantId, index],
    );
    return result.rows[0]
      ? fromRow(result.rows[0] as Record<string, unknown>)
      : null;
  }

  async verifyLedger(
    tenantId: string,
  ): Promise<{ valid: boolean; count: number; brokenAt?: number }> {
    const safeTenant = text(tenantId, "tenantId", MAX_TENANT_LENGTH);
    const result = await this.pool.query(
      "SELECT * FROM bookpi_ledger WHERE tenant_id = $1 ORDER BY index ASC",
      [safeTenant],
    );
    let previous = GENESIS_HASH;
    for (const row of result.rows) {
      const block = fromRow(row as Record<string, unknown>);
      if (block.previous_hash !== previous) {
        return {
          valid: false,
          count: result.rows.length,
          brokenAt: block.index,
        };
      }
      if (hashPayload(block) !== block.block_hash) {
        return {
          valid: false,
          count: result.rows.length,
          brokenAt: block.index,
        };
      }
      previous = block.block_hash;
    }
    return { valid: true, count: result.rows.length };
  }

  async verifyIntegrity(tenantId?: string) {
    if (!tenantId) {
      return {
        success: false,
        error: "tenantId_required_for_integrity_verification",
      };
    }
    const verification = await this.verifyLedger(tenantId);
    return {
      success: verification.valid,
      ...(verification.brokenAt === undefined
        ? {}
        : { corruptedIndex: verification.brokenAt }),
      ...(verification.valid ? {} : { error: "BOOKPI_CHAIN_INVALID" }),
    };
  }

  async prune() {
    return {
      success: false,
      error: "BOOKPI_PRUNE_FORBIDDEN_APPEND_ONLY_LEDGER",
    };
  }

  async pruneInactive() {
    return {
      success: false,
      error: "BOOKPI_PRUNE_INACTIVE_FORBIDDEN_APPEND_ONLY_LEDGER",
    };
  }
}

export function createBookpiPostgresRepository(): DurableBookPiRepository {
  const pool = getPgPool();
  if (!pool) {
    throw new Error(
      "BOOKPI_POSTGRES_UNAVAILABLE: DATABASE_URL is required for durable BookPI.",
    );
  }
  return new DurableBookPiRepositoryImpl(pool);
}
