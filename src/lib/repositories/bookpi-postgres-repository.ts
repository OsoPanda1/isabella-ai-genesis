import { neon } from "@neondatabase/serverless";
import { createHash, randomUUID } from "node:crypto";
import { config } from "../config";
import type { BlockPIBlock, LedgerCategory, LedgerStatus } from "./bookpi-repository";

const GENESIS_PREVIOUS_HASH = "0".repeat(64);

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
  const sql = neon(cfg.DATABASE_URL as string);

  return {
    async list(tenantId: string): Promise<BlockPIBlock[]> {
      const rows =
        await sql`SELECT * FROM public.bookpi_ledger WHERE tenant_id = ${tenantId} ORDER BY index ASC`;
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
      const previous =
        await sql`SELECT * FROM public.bookpi_ledger WHERE tenant_id = ${input.tenantId} ORDER BY index DESC LIMIT 1`;
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
      const rows = await sql`INSERT INTO public.bookpi_ledger
        (index, tenant_id, user_id, operation, category, cost_decimal, tokens_consumed, previous_hash, block_hash, status)
        VALUES (${base.index}, ${base.tenantId}, ${base.userId}, ${base.operation}, ${base.category}, ${base.costDecimal}, ${base.tokensConsumed}, ${base.previousHash}, ${blockHash}, ${status})
        RETURNING *`;
      return { success: true as const, block: mapRow(rows[0]!) };
    },
    async refund(
      originalEventId: string,
      requestor: { tenantId: string; userId: string },
      reason: string,
    ) {
      // FASE 3: refunds como nuevo evento, nunca UPDATE del original.
      const byId =
        await sql`SELECT * FROM public.bookpi_ledger WHERE tenant_id = ${requestor.tenantId} AND id = ${originalEventId} LIMIT 1`;
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
      const rows = tenantId
        ? await sql`SELECT * FROM public.bookpi_ledger WHERE tenant_id = ${tenantId} ORDER BY index ASC`
        : await sql`SELECT * FROM public.bookpi_ledger ORDER BY tenant_id ASC, index ASC`;
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
