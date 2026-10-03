/**
 * BookPI Development Repository
 * -----------------------------------------------------------------
 * In-memory adapter exclusively for development, tests and benchmarks.
 * It preserves the canonical BookPI contract without touching the
 * production PostgreSQL authority.
 */
import { createHash, randomInt } from "node:crypto";
import type { BlockPIBlock, LedgerCategory, LedgerStatus } from "../bookpi/types";

const GENESIS_HASH = "GENESIS_BLOCK_HASH";
const HASH_ALGORITHM = "DEV-SHA3-512-HASH-CHAIN";

export interface BookpiDevRepository {
  append(input: {
    tenantId: string;
    userId: string;
    operation: string;
    category: LedgerCategory;
    cost: number;
    tokens: number;
    status?: LedgerStatus;
  }): { success: boolean; error?: string; block?: BlockPIBlock };
  list(tenantId: string): BlockPIBlock[];
  query?(
    tenantId: string,
    filter: {
      category?: LedgerCategory;
      userId?: string;
      fromDate?: Date;
      toDate?: Date;
    },
  ): BlockPIBlock[];
  refund(tenantId: string, index: number, reason?: string): { success: boolean; error?: string };
  verifyIntegrity(
    tenantId: string,
  ): { success: boolean; error?: string; corruptedIndex?: number };
}

function hashBlock(block: Omit<BlockPIBlock, "blockHash">): string {
  return createHash("sha3-512")
    .update(
      JSON.stringify({
        ...block,
        costDecimal: block.costDecimal,
        nonce: block.nonce,
      }),
      "utf8",
    )
    .digest("hex");
}

class InMemoryBookpiDevRepository implements BookpiDevRepository {
  private readonly blocks = new Map<string, BlockPIBlock[]>();

  append(input: {
    tenantId: string;
    userId: string;
    operation: string;
    category: LedgerCategory;
    cost: number;
    tokens: number;
    status?: LedgerStatus;
  }): { success: boolean; error?: string; block?: BlockPIBlock } {
    if (!input.tenantId) return { success: false, error: "tenant_required" };
    if (!input.userId) return { success: false, error: "user_required" };
    if (!input.operation) return { success: false, error: "operation_required" };
    if (!Number.isFinite(input.cost) || input.cost < 0) return { success: false, error: "cost_invalid" };
    if (!Number.isFinite(input.tokens) || input.tokens < 0) return { success: false, error: "tokens_invalid" };

    const ledger = this.blocks.get(input.tenantId) ?? [];
    const previousHash = ledger.at(-1)?.blockHash ?? GENESIS_HASH;
    const blockWithoutHash: Omit<BlockPIBlock, "blockHash"> = {
      index: ledger.length,
      timestamp: new Date().toISOString(),
      tenantId: input.tenantId,
      userId: input.userId,
      operation: input.operation,
      category: input.category,
      costDecimal: input.cost.toFixed(6),
      tokensConsumed: Math.trunc(input.tokens),
      previousHash,
      pqcSignature: null,
      signatureAlgorithm: HASH_ALGORITHM,
      status: input.status ?? "settled",
      nonce: String(randomInt(0, 1_000_000_000)),
    };
    const block: BlockPIBlock = {
      ...blockWithoutHash,
      blockHash: hashBlock(blockWithoutHash),
    };
    ledger.push(block);
    this.blocks.set(input.tenantId, ledger);
    return { success: true, block };
  }

  list(tenantId: string): BlockPIBlock[] {
    return [...(this.blocks.get(tenantId) ?? [])];
  }

  query(tenantId: string, filter: {
    category?: LedgerCategory;
    userId?: string;
    fromDate?: Date;
    toDate?: Date;
  }): BlockPIBlock[] {
    return this.list(tenantId).filter((block) => {
      if (filter.category && block.category !== filter.category) return false;
      if (filter.userId && block.userId !== filter.userId) return false;
      if (filter.fromDate && new Date(block.timestamp) < filter.fromDate) return false;
      if (filter.toDate && new Date(block.timestamp) > filter.toDate) return false;
      return true;
    });
  }

  refund(tenantId: string, index: number, reason = "refund"): { success: boolean; error?: string } {
    const original = this.blocks.get(tenantId)?.find((block) => block.index === index);
    if (!original) return { success: false, error: "BOOKPI_BLOCK_NOT_FOUND" };
    const existing = this.blocks
      .get(tenantId)
      ?.some((block) => block.operation.startsWith(`REFUND_OF:${index}:`));
    if (existing) return { success: false, error: "BOOKPI_REFUND_DUPLICATE" };

    const result = this.append({
      tenantId,
      userId: original.userId,
      operation: `REFUND_OF:${index}:${reason.slice(0, 120)}`,
      category: "other",
      cost: 0,
      tokens: 0,
      status: "refunded",
    });
    return result.success ? { success: true } : { success: false, error: result.error };
  }

  verifyIntegrity(tenantId: string) {
    const ledger = this.blocks.get(tenantId) ?? [];
    let previous = GENESIS_HASH;
    for (const block of ledger) {
      if (block.previousHash !== previous) {
        return { success: false, error: "BOOKPI_CHAIN_BROKEN", corruptedIndex: block.index };
      }
      const { blockHash, ...withoutHash } = block;
      const expected = hashBlock(withoutHash);
      if (expected !== blockHash) {
        return { success: false, error: "BOOKPI_HASH_MISMATCH", corruptedIndex: block.index };
      }
      previous = blockHash;
    }
    return { success: true };
  }
}

export function createBookpiDevRepository(): BookpiDevRepository {
  return new InMemoryBookpiDevRepository();
}

export const bookpiDevRepository = createBookpiDevRepository();

export default bookpiDevRepository;
