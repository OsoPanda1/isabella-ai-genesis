/**
 * BOOKPI — MOTOR DEL LIBRO MAYOR (src/lib/bookpi.ts) [DEV/TEST ADAPTER]
 * -----------------------------------------------------------------
 * ADAPTADOR DE TEST Y DESARROLLO LOCAL AISLADO.
 * Para producción y entornos distribuidos, la única fuente autoritativa
 * y duradera de persistencia es `createBookpiPostgresRepository()`
 * (src/lib/repositories/bookpi-postgres-repository.ts).
 *
 * Este adaptador se mantiene estrictamente para pruebas unitarias, benchmarks
 * locales y entornos de desarrollo desacoplados de PostgreSQL.
 */

import {
  createBookpiRepository,
  type BlockPIBlock,
  type BookpiRepository,
  type LedgerCategory,
} from "./repositories/bookpi-repository";

export interface BookpiWriteRequest {
  tenantId: string;
  userId: string;
  operation: string;
  category: LedgerCategory;
  cost: number;
  tokens: number;
}

export interface BookpiRefundRequest {
  index: number;
  tenantId: string;
}

/**
 * Crea el motor BookPI con un repositorio inyectable (para test/aislamiento).
 */
export function createBookpiEngine(repository: BookpiRepository = createBookpiRepository()) {
  return {
    list(tenantId: string): BlockPIBlock[] {
      return repository.list(tenantId);
    },

    record(request: BookpiWriteRequest): {
      success: boolean;
      error?: string;
      block?: BlockPIBlock;
    } {
      if (!request.tenantId) return { success: false, error: "Tenant requerido." };
      if (!request.userId) return { success: false, error: "Usuario requerido." };
      if (request.cost < 0) return { success: false, error: "Costo negativo no admitido." };
      const write = repository.append({
        tenantId: request.tenantId,
        userId: request.userId,
        operation: request.operation,
        category: request.category,
        cost: request.cost,
        tokens: request.tokens,
      });
      if (!write.success) return { success: false, error: write.error };
      return { success: true, block: write.block };
    },

    batchAppend(requests: BookpiWriteRequest[]): {
      success: boolean;
      error?: string;
      blocks?: BlockPIBlock[];
    } {
      if (requests.length === 0) return { success: true, blocks: [] };
      for (const req of requests) {
        if (!req.tenantId) return { success: false, error: "Tenant requerido en batch." };
        if (!req.userId) return { success: false, error: "Usuario requerido en batch." };
        if (req.cost < 0) return { success: false, error: "Costo negativo no admitido." };
      }

      // Ensure the repository has batchAppend, otherwise fallback to sequential
      if (typeof repository.batchAppend === "function") {
        const write = repository.batchAppend(requests);
        if (!write.success) return { success: false, error: write.error };
        return { success: true, blocks: write.blocks };
      } else {
        const blocks: BlockPIBlock[] = [];
        for (const req of requests) {
          const write = repository.append(req);
          if (!write.success) return { success: false, error: write.error };
          blocks.push(write.block);
        }
        return { success: true, blocks };
      }
    },

    query(
      tenantId: string,
      filter: {
        category?: LedgerCategory;
        userId?: string;
        fromDate?: Date;
        toDate?: Date;
      },
    ): BlockPIBlock[] | Promise<BlockPIBlock[]> {
      if (typeof repository.query === "function") {
        return repository.query(tenantId, filter);
      }
      // Fallback for repositories without query
      let blocks = repository.list(tenantId);
      // Handle promises from list if postgres
      if (blocks instanceof Promise) {
        return blocks.then((b) => {
          if (filter.category) b = b.filter((x: BlockPIBlock) => x.category === filter.category);
          if (filter.userId) b = b.filter((x: BlockPIBlock) => x.userId === filter.userId);
          if (filter.fromDate)
            b = b.filter((x: BlockPIBlock) => new Date(x.timestamp) >= filter.fromDate!);
          if (filter.toDate)
            b = b.filter((x: BlockPIBlock) => new Date(x.timestamp) <= filter.toDate!);
          return b;
        });
      }

      if (filter.category) blocks = blocks.filter((b) => b.category === filter.category);
      if (filter.userId) blocks = blocks.filter((b) => b.userId === filter.userId);
      if (filter.fromDate) blocks = blocks.filter((b) => new Date(b.timestamp) >= filter.fromDate!);
      if (filter.toDate) blocks = blocks.filter((b) => new Date(b.timestamp) <= filter.toDate!);
      return blocks;
    },

    exportLedger(tenantId: string): string | Promise<string> {
      const blocks = repository.list(tenantId);

      const formatResult = (b: BlockPIBlock[]) => {
        const latestBlock = b.length > 0 ? b[b.length - 1] : null;

        // Simple hash of all block hashes for a naive summary (real summary would use Merkle root)
        const cryptoSummary = b.reduce((acc, block) => acc + block.blockHash, "");
        const summaryHash =
          b.length > 0
            ? Array.from(
                new Uint8Array(
                  // simple pseudo hash for the summary just as an example
                  Buffer.from(cryptoSummary).slice(0, 32),
                ),
              )
                .map((byte) => byte.toString(16).padStart(2, "0"))
                .join("")
            : null;

        const payload = {
          tenantId,
          exportedAt: new Date().toISOString(),
          recordCount: b.length,
          cryptographicSummary: {
            latestBlockHash: latestBlock ? latestBlock.blockHash : null,
            chainSummaryHash: summaryHash,
          },
          ledger: b,
        };
        return JSON.stringify(payload, null, 2);
      };

      if (blocks instanceof Promise) {
        return blocks.then(formatResult);
      }

      return formatResult(blocks);
    },

    prune(
      tenantId: string,
      maxAgeMs: number,
    ):
      | { success: boolean; prunedCount?: number; error?: string }
      | Promise<{ success: boolean; prunedCount?: number; error?: string }> {
      if (maxAgeMs < 0) return { success: false, error: "maxAgeMs debe ser >= 0" };
      if (typeof repository.prune === "function") {
        return repository.prune(tenantId, maxAgeMs);
      }
      return {
        success: false,
        error: "prune no soportado en este repositorio",
      };
    },

    pruneInactiveTenants(inactiveDays: number):
      | { success: boolean; prunedTenants?: string[]; error?: string }
      | Promise<{
          success: boolean;
          prunedTenants?: string[];
          error?: string;
        }> {
      if (inactiveDays <= 0) return { success: false, error: "inactiveDays must be > 0" };
      if (typeof repository.pruneInactive === "function") {
        return repository.pruneInactive(inactiveDays);
      }
      return {
        success: false,
        error: "pruneInactive not supported by this repository",
      };
    },

    refund(request: BookpiRefundRequest): { success: boolean; error?: string } {
      return repository.refund(request.index, request.tenantId);
    },

    verifyIntegrity(): {
      success: boolean;
      error?: string;
      corruptedIndex?: number;
    } {
      return repository.verifyIntegrity();
    },
  };
}

export type BookpiEngine = ReturnType<typeof createBookpiEngine>;

export const BOOKPI_ENGINE = {
  create: createBookpiEngine,
};
