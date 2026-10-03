/**
 * BookPI Development Repository (src/lib/repositories/bookpi-dev-repository.ts)
 */
import { BookPiRepository, bookpiPostgresRepository } from "./bookpi-postgres-repository";

export const bookpiDevRepository: BookPiRepository = bookpiPostgresRepository;
export default bookpiDevRepository;


import type { BlockPIBlock, LedgerCategory } from "../bookpi/types";

export interface BookpiDevRepository {
  append(input: { tenantId: string; userId: string; operation: string; category: LedgerCategory; cost: number; tokens: number; status?: "settled" | "pending" | "refunded" | "pruned" }): { success: boolean; error?: string; block?: BlockPIBlock };
  list(tenantId: string): BlockPIBlock[];
  refund(tenantId: string, index: number, reason?: string): { success: boolean; error?: string };
  verifyIntegrity(tenantId: string): { success: boolean; error?: string; corruptedIndex?: number };
}

class InMemoryBookpiDevRepository implements BookpiDevRepository {
  private readonly blocks = new Map<string, BlockPIBlock[]>();
  append(input: { tenantId: string; userId: string; operation: string; category: LedgerCategory; cost: number; tokens: number; status?: "settled" | "pending" | "refunded" | "pruned" }): { success: boolean; error?: string; block?: BlockPIBlock } {
    if (!input.tenantId) return { success: false, error: "tenant_required" };
    if (!input.userId) return { success: false, error: "user_required" };
    if (!input.operation) return { success: false, error: "operation_required" };
    if (!Number.isFinite(input.cost) || input.cost < 0) return { success: false, error: "cost_invalid" };
    if (!Number.isFinite(input.tokens) || input.tokens < 0) return { success: false, error: "tokens_invalid" };
    const ledger = this.blocks.get(input.tenantId) ?? [];
    const previousHash = ledger.at(-1)?.blockHash ?? "GENESIS_BLOCK_HASH";
    const blockWithoutHash = {
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
      signatureAlgorithm: "DEV-SHA3-512-HASH-CHAIN",
      status: input.status ?? "settled",
      nonce: String(Date.now() ^ Math.floor(Math.random() * 1_000_000)),
    } satisfies Omit<BlockPIBlock, "blockHash">;
    const block: BlockPIBlock = {
      ...blockWithoutHash,
      blockHash: createHash("sha3-512").update(JSON.stringify(blockWithoutHash), "utf8").digest("hex"),
    };
    ledger.push(block);
    this.blocks.set(input.tenantId, ledger);
    return { success: true, block };
  }
  list(tenantId: string): BlockPIBlock[] { return [...(this.blocks.get(tenantId) ?? [])]; }
  refund(tenantId: string, index: number, reason = "refund"): { success: boolean; error?: string } {
    const original = this.blocks.get(tenantId)?.find((block) => block.index === index);
    if (!original) return { success: false, error: "BOOKPI_BLOCK_NOT_FOUND" };
    return this.append({ tenantId, userId: original.userId, operation: `REFUND_OF:${index}:${reason.slice(0, 120)}`, category: "other", cost: 0, tokens: 0, status: "refunded" }).success ? { success: true } : { success: false, error: "BOOKPI_REFUND_FAILED" };
  }
  verifyIntegrity(tenantId: string) {
    let previous = "GENESIS_BLOCK_HASH";
    for (const block of this.list(tenantId)) {
      if (block.previousHash !== previous) return { success: false, error: "BOOKPI_CHAIN_BROKEN", corruptedIndex: block.index };
      const { blockHash, ...withoutHash } = block;
      const expected = createHash("sha3-512").update(JSON.stringify(withoutHash), "utf8").digest("hex");
      if (expected !== blockHash) return { success: false, error: "BOOKPI_HASH_MISMATCH", corruptedIndex: block.index };
      previous = blockHash;
    }
    return { success: true };
  }
}

import { createHash } from "node:crypto";
export function createBookpiDevRepository(): BookpiDevRepository { return new InMemoryBookpiDevRepository(); }
