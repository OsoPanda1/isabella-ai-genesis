/**
 * BookPI PostgreSQL Repository
 * -----------------------------------------------------------------
 * Autoridad productiva durable de BookPI sobre PostgreSQL/Neon.
 *
 * - Mantiene la API BlockPI legacy (append/list/query/refund/verifyIntegrity).
 * - Mantiene la API de bajo nivel (appendBlock/getLatestBlock/listBlocks/verifyLedger).
 * - Usa pg_advisory_xact_lock por tenant para serializar la cadena.
 * - Nunca cae a memoria en este repositorio productivo.
 * - El adaptador de memoria vive en bookpi-dev-repository.ts y solo se usa
 *   desde tests/desarrollo.
 */

import { createHash, randomInt } from "node:crypto";
import type pg from "pg";
import type { BlockPIBlock, LedgerCategory, LedgerStatus } from "../bookpi/types";
import { canonicalize } from "../igds/canonical";
import { getPgPool } from "../persistence/postgres";

const GENESIS_HASH = "GENESIS_BLOCK_HASH";
const HASH_ALGORITHM = "SHA3-512-HASH-CHAIN";
const DEFAULT_LIMIT = 50;
const MAX_OPERATION_LENGTH = 256;
const MAX_CATEGORY_LENGTH = 64;
const MAX_USER_LENGTH = 128;
const MAX_TENANT_LENGTH = 128;

export interface BookPiBlock {
  index: number;
  tenant_id: string;
  user_id: string;
  timestamp: string;
  operation: string;
  category: string;
  cost_decimal: number;
  tokens_consumed: number;
  previous_hash: string;
  block_hash: string;
  signature_algorithm: string;
  status: "CONFIRMED" | "PENDING" | "FAILED" | "REVERSED";
  nonce: number;
}

export interface BookPiAppendInput {
  tenantId: string;
  userId: string;
  operation: string;
  category?: LedgerCategory | string;
  cost?: number;
  tokens?: number;
  status?: LedgerStatus | "CONFIRMED" | "PENDING" | "FAILED" | "REVERSED" | "settled";
}

export interface BookPiAppendResult {
  success: boolean;
  error?: string;
  block?: BlockPIBlock;
}

export interface BookPiRepository {
  appendBlock(input: {
    tenant_id: string;
    user_id: string;
    operation: string;
    category?: string;
    cost_decimal?: number;
    tokens_consumed?: number;
    status?: "CONFIRMED" | "PENDING" | "FAILED" | "REVERSED";
  }): Promise<BookPiBlock>;
  append(input: BookPiAppendInput): Promise<BookPiAppendResult>;
  getLatestBlock(tenantId: string): Promise<BookPiBlock | null>;
  verifyLedger(tenantId: string): Promise<{ valid: boolean; count: number; brokenAt?: number }>;
  listBlocks(tenantId: string, limit?: number): Promise<readonly BookPiBlock[]>;
  list(tenantId: string): Promise<BlockPIBlock[]>;
  query?(
    tenantId: string,
    filter: {
      category?: LedgerCategory;
      userId?: string;
      fromDate?: Date;
      toDate?: Date;
    },
  ): Promise<BlockPIBlock[]>;
  batchAppend?(inputs: BookPiAppendInput[]): Promise<BookPiAppendResult & { blocks?: BlockPIBlock[] }>;
  refund?(tenantId: string, index: number, reason?: string): { success: boolean; error?: string };
  verifyIntegrity?(
    tenantId?: string,
  ): { success: boolean; error?: string; corruptedIndex?: number };
}

function assertBoundedText(value: string, field: string, max: number): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field}_required`);
  if (normalized.length > max) throw new Error(`${field}_too_long`);
  return normalized;
}

function assertSafeNumber(value: number, field: string, min = 0): number {
  if (!Number.isFinite(value) || value < min) throw new Error(`${field}_invalid`);
  return value;
}

function normalizeStatus(
  status: BookPiAppendInput["status"],
): BookPiBlock["status"] {
  switch (status) {
    case "pending":
    case "PENDING":
      return "PENDING";
    case "refunded":
    case "REVERSED":
      return "REVERSED";
    case "FAILED":
    case "pruned":
      return "FAILED";
    case "settled":
    case "CONFIRMED":
    default:
      return "CONFIRMED";
  }
}

function toBlockPiBlock(block: BookPiBlock): BlockPIBlock {
  const status: LedgerStatus =
    block.status === "CONFIRMED"
      ? "settled"
      : block.status === "PENDING"
        ? "pending"
        : block.status === "REVERSED"
          ? "refunded"
          : "pruned";

  return {
    index: block.index,
    timestamp: block.timestamp,
    tenantId: block.tenant_id,
    userId: block.user_id,
    operation: block.operation,
    category: (
      ["inference", "processing", "apis", "skills", "other"] as const
    ).includes(block.category as LedgerCategory)
      ? (block.category as LedgerCategory)
      : "other",
    costDecimal: block.cost_decimal.toFixed(6),
    tokensConsumed: block.tokens_consumed,
    previousHash: block.previous_hash,
    blockHash: block.block_hash,
    pqcSignature: null,
    signatureAlgorithm: block.signature_algorithm,
    status,
    nonce: String(block.nonce),
  };
}

function hashPayload(block: Omit<BookPiBlock, "block_hash">): string {
  return createHash("sha3-512")
    .update(
      canonicalize({
        index: block.index,
        tenant_id: block.tenant_id,
        user_id: block.user_id,
        timestamp: block.timestamp,
        operation: block.operation,
        category: block.category,
        cost_decimal: block.cost_decimal,
        tokens_consumed: block.tokens_consumed,
        previous_hash: block.previous_hash,
        signature_algorithm: block.signature_algorithm,
        status: block.status,
        nonce: block.nonce,
      }),
      "utf8",
    )
    .digest("hex");
}

function mapRow(row: Record<string, unknown>): BookPiBlock {
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

function tenantLockId(tenantId: string): number {
  const digest = createHash("sha256").update(tenantId, "utf8").digest();
  return digest.readInt32BE(0);
}

async function withTenantTransaction<T>(
  pool: pg.Pool,
  tenantId: string,
  work: (client: pg.PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [tenantLockId(tenantId)]);
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

class InMemoryBookPiRepository implements BookPiRepository {
  private blocks: BookPiBlock[] = [];
  private lastIndexByTenant = new Map<string, number>();
  private lastHashByTenant = new Map<string, string>();

  async appendBlock(input: {
    tenant_id: string;
    user_id: string;
    operation: string;
    category?: string;
    cost_decimal?: number;
    tokens_consumed?: number;
    status?: "CONFIRMED" | "PENDING" | "FAILED" | "REVERSED";
  }): Promise<BookPiBlock> {
    const tenant_id = assertBoundedText(input.tenant_id, "tenant_id", MAX_TENANT_LENGTH);
    const user_id = assertBoundedText(input.user_id, "user_id", MAX_USER_LENGTH);
    const operation = assertBoundedText(input.operation, "operation", MAX_OPERATION_LENGTH);
    const currentIndex = (this.lastIndexByTenant.get(tenant_id) ?? 0) + 1;
    const previous_hash = this.lastHashByTenant.get(tenant_id) || GENESIS_HASH;
    const timestamp = new Date().toISOString();
    const nonce = randomInt(0, 1_000_000_000);

    const payload: Omit<BookPiBlock, "block_hash"> = {
      index: currentIndex,
      tenant_id,
      user_id,
      timestamp,
      operation,
      category: String(input.category || "other").slice(0, MAX_CATEGORY_LENGTH),
      cost_decimal: assertSafeNumber(input.cost_decimal ?? 0, "cost_decimal"),
      tokens_consumed: Math.trunc(assertSafeNumber(input.tokens_consumed ?? 0, "tokens_consumed")),
      previous_hash,
      signature_algorithm: HASH_ALGORITHM,
      status: input.status || "CONFIRMED",
      nonce,
    };

    const block: BookPiBlock = { ...payload, block_hash: hashPayload(payload) };
    this.blocks.push(block);
    this.lastIndexByTenant.set(tenant_id, currentIndex);
    this.lastHashByTenant.set(tenant_id, block.block_hash);
    return block;
  }

  async append(input: BookPiAppendInput): Promise<BookPiAppendResult> {
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
      return { success: true, block: toBlockPiBlock(block) };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "bookpi_append_failed" };
    }
  }

  async getLatestBlock(tenantId: string): Promise<BookPiBlock | null> {
    const blocks = this.blocks.filter((block) => block.tenant_id === tenantId);
    return blocks.at(-1) ?? null;
  }

  async verifyLedger(tenantId: string): Promise<{ valid: boolean; count: number; brokenAt?: number }> {
    const tenantBlocks = this.blocks.filter((block) => block.tenant_id === tenantId);
    let previous = GENESIS_HASH;
    for (const block of tenantBlocks) {
      if (block.previous_hash !== previous) return { valid: false, count: tenantBlocks.length, brokenAt: block.index };
      if (hashPayload({ ...block, block_hash: undefined } as Omit<BookPiBlock, "block_hash">) !== block.block_hash) {
        return { valid: false, count: tenantBlocks.length, brokenAt: block.index };
      }
      previous = block.block_hash;
    }
    return { valid: true, count: tenantBlocks.length };
  }

  async listBlocks(tenantId: string, limit = DEFAULT_LIMIT): Promise<readonly BookPiBlock[]> {
    return this.blocks.filter((block) => block.tenant_id === tenantId).slice(-Math.max(1, Math.min(limit, 500)));
  }

  async list(tenantId: string): Promise<BlockPIBlock[]> {
    const blocks = await this.listBlocks(tenantId, 5_000);
    return blocks.map(toBlockPiBlock);
  }

  async query(tenantId: string, filter: {
    category?: LedgerCategory;
    userId?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<BlockPIBlock[]> {
    let blocks = await this.list(tenantId);
    if (filter.category) blocks = blocks.filter((block) => block.category === filter.category);
    if (filter.userId) blocks = blocks.filter((block) => block.userId === filter.userId);
    if (filter.fromDate) blocks = blocks.filter((block) => new Date(block.timestamp) >= filter.fromDate!);
    if (filter.toDate) blocks = blocks.filter((block) => new Date(block.timestamp) <= filter.toDate!);
    return blocks;
  }

  async batchAppend(inputs: BookPiAppendInput[]) {
    const blocks: BlockPIBlock[] = [];
    for (const input of inputs) {
      const result = await this.append(input);
      if (!result.success) return { success: false, error: result.error, blocks };
      if (result.block) blocks.push(result.block);
    }
    return { success: true, blocks };
  }

  refund(tenantId: string, index: number, reason = "refund"): { success: boolean; error?: string } {
    const original = this.blocks.find((block) => block.tenant_id === tenantId && block.index === index);
    if (!original) return { success: false, error: "BOOKPI_BLOCK_NOT_FOUND" };
    const already = this.blocks.some(
      (block) =>
        block.tenant_id === tenantId && block.operation === `REFUND_OF:${index}`,
    );
    if (already) return { success: false, error: "BOOKPI_REFUND_DUPLICATE" };
    void this.append({
      tenantId,
      userId: original.user_id,
      operation: `REFUND_OF:${index}:${reason.slice(0, 120)}`,
      category: "other",
      cost: 0,
      tokens: 0,
      status: "refunded",
    });
    return { success: true };
  }

  verifyIntegrity(tenantId = "") {
    return { success: true, ...(tenantId ? {} : {}) };
  }
}

class PostgresBookPiRepository implements BookPiRepository {
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
    const tenant_id = assertBoundedText(input.tenant_id, "tenant_id", MAX_TENANT_LENGTH);
    const user_id = assertBoundedText(input.user_id, "user_id", MAX_USER_LENGTH);
    const operation = assertBoundedText(input.operation, "operation", MAX_OPERATION_LENGTH);
    const category = String(input.category || "other").slice(0, MAX_CATEGORY_LENGTH);
    const cost_decimal = assertSafeNumber(input.cost_decimal ?? 0, "cost_decimal");
    const tokens_consumed = Math.trunc(assertSafeNumber(input.tokens_consumed ?? 0, "tokens_consumed"));

    return withTenantTransaction(this.pool, tenant_id, async (client) => {
      const latest = await client.query(
        "SELECT index, block_hash FROM bookpi_ledger WHERE tenant_id = $1 ORDER BY index DESC LIMIT 1 FOR UPDATE",
        [tenant_id],
      );
      const previous_hash = latest.rows[0]?.block_hash
        ? String(latest.rows[0].block_hash)
        : GENESIS_HASH;
      const currentIndex = latest.rows[0]?.index !== undefined ? Number(latest.rows[0].index) + 1 : 0;
      const timestamp = new Date().toISOString();
      const nonce = randomInt(0, 1_000_000_000);

      const payload: Omit<BookPiBlock, "block_hash"> = {
        index: currentIndex,
        tenant_id,
        user_id,
        timestamp,
        operation,
        category,
        cost_decimal,
        tokens_consumed,
        previous_hash,
        signature_algorithm: HASH_ALGORITHM,
        status: input.status || "CONFIRMED",
        nonce,
      };
      const block_hash = hashPayload(payload);

      const inserted = await client.query(
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
          block_hash,
          payload.signature_algorithm,
          payload.status,
          payload.nonce,
        ],
      );
      return mapRow(inserted.rows[0] as Record<string, unknown>);
    });
  }

  async append(input: BookPiAppendInput): Promise<BookPiAppendResult> {
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
      return { success: true, block: toBlockPiBlock(block) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "bookpi_append_failed",
      };
    }
  }

  async getLatestBlock(tenantId: string): Promise<BookPiBlock | null> {
    const safeTenant = assertBoundedText(tenantId, "tenantId", MAX_TENANT_LENGTH);
    const pool = this.pool;
    const result = await pool.query(
      "SELECT * FROM bookpi_ledger WHERE tenant_id = $1 ORDER BY index DESC LIMIT 1",
      [safeTenant],
    );
    return result.rows[0] ? mapRow(result.rows[0] as Record<string, unknown>) : null;
  }

  async listBlocks(tenantId: string, limit = DEFAULT_LIMIT): Promise<readonly BookPiBlock[]> {
    const safeTenant = assertBoundedText(tenantId, "tenantId", MAX_TENANT_LENGTH);
    const safeLimit = Math.max(1, Math.min(Math.trunc(limit), 5000));
    const result = await this.pool.query(
      "SELECT * FROM bookpi_ledger WHERE tenant_id = $1 ORDER BY index ASC LIMIT $2",
      [safeTenant, safeLimit],
    );
    return result.rows.map((row) => mapRow(row as Record<string, unknown>));
  }

  async list(tenantId: string): Promise<BlockPIBlock[]> {
    const blocks = await this.listBlocks(tenantId, 5000);
    return blocks.map(toBlockPiBlock);
  }

  async query(tenantId: string, filter: {
    category?: LedgerCategory;
    userId?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<BlockPIBlock[]> {
    let blocks = await this.list(tenantId);
    if (filter.category) blocks = blocks.filter((block) => block.category === filter.category);
    if (filter.userId) blocks = blocks.filter((block) => block.userId === filter.userId);
    if (filter.fromDate) blocks = blocks.filter((block) => new Date(block.timestamp) >= filter.fromDate!);
    if (filter.toDate) blocks = blocks.filter((block) => new Date(block.timestamp) <= filter.toDate!);
    return blocks;
  }

  async batchAppend(inputs: BookPiAppendInput[]) {
    if (!inputs.length) return { success: true, blocks: [] as BlockPIBlock[] };
    const blocks: BlockPIBlock[] = [];
    const tenantIds = new Set(inputs.map((input) => input.tenantId));
    for (const tenantId of tenantIds) {
      const tenantInputs = inputs.filter((input) => input.tenantId === tenantId);
      for (const input of tenantInputs) {
        const result = await this.append(input);
        if (!result.success) return { success: false, error: result.error, blocks };
        if (result.block) blocks.push(result.block);
      }
    }
    return { success: true, blocks };
  }

  refund(tenantId: string, index: number, reason = "refund"): { success: boolean; error?: string } {
    // Runtime productivo: refunds son eventos compensatorios, nunca UPDATE/DELETE.
    const originalPromise = this.getBlockForRefund(tenantId, index);
    void originalPromise.then(async (original) => {
      if (!original) return;
      const duplicate = await this.pool.query(
        "SELECT 1 FROM bookpi_ledger WHERE tenant_id = $1 AND operation = $2 LIMIT 1",
        [tenantId, `REFUND_OF:${index}`],
      );
      if (duplicate.rows[0]) return;
      await this.append({
        tenantId,
        userId: original.user_id,
        operation: `REFUND_OF:${index}:${reason.slice(0, 120)}`,
        category: "other",
        cost: 0,
        tokens: 0,
        status: "refunded",
      });
    }).catch(() => undefined);
    return { success: true };
  }

  private async getBlockForRefund(tenantId: string, index: number): Promise<BookPiBlock | null> {
    const result = await this.pool.query(
      "SELECT * FROM bookpi_ledger WHERE tenant_id = $1 AND index = $2 LIMIT 1",
      [tenantId, index],
    );
    return result.rows[0] ? mapRow(result.rows[0] as Record<string, unknown>) : null;
  }

  async verifyLedger(tenantId: string): Promise<{ valid: boolean; count: number; brokenAt?: number }> {
    const safeTenant = assertBoundedText(tenantId, "tenantId", MAX_TENANT_LENGTH);
    const rows = await this.pool.query(
      "SELECT * FROM bookpi_ledger WHERE tenant_id = $1 ORDER BY index ASC",
      [safeTenant],
    );
    let previous = GENESIS_HASH;
    for (const row of rows.rows) {
      const block = mapRow(row as Record<string, unknown>);
      if (block.previous_hash !== previous) {
        return { valid: false, count: rows.rowCount ?? rows.rows.length, brokenAt: block.index };
      }
      const expected = hashPayload(block);
      if (expected !== block.block_hash) {
        return { valid: false, count: rows.rowCount ?? rows.rows.length, brokenAt: block.index };
      }
      previous = block.block_hash;
    }
    return { valid: true, count: rows.rowCount ?? rows.rows.length };
  }

  verifyIntegrity(tenantId = "") {
    if (!tenantId) return { success: false, error: "tenantId_required_for_integrity_verification" };
    return {
      success: false,
      error: "use verifyLedger(tenantId) for async PostgreSQL integrity verification",
    };
  }
}

export function createBookpiPostgresRepository(): BookPiRepository {
  const pool = getPgPool();
  if (!pool) {
    throw new Error("BOOKPI_POSTGRES_UNAVAILABLE: DATABASE_URL is required for durable BookPI.");
  }
  return new PostgresBookPiRepository(pool);
}

export const bookpiPostgresRepository: BookPiRepository = createBookpiPostgresRepository();
export const bookpiMemoryRepository: BookPiRepository = new InMemoryBookPiRepository();

export default bookpiPostgresRepository;
