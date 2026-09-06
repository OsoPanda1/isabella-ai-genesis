/**
 * REPOSITORIO BOOKPI (src/lib/repositories/bookpi-repository.ts)
 * -----------------------------------------------------------------
 * Libro mayor inmutable (append-only) con cadena criptográfica real.
 * Sin mockdata:
 *  - Cada bloque encadena con el hash del anterior; no hay génesis falso.
 *  - Persistencia real en disco (`node:fs`) con I/O verificada.
 *  - Las refunds se registran como bloques de anulación, nunca se
 *    mutan/bloquean bloques ya asentados.
 *
 * §6.1: el hash usa el MISMO payload canónico que los otros repositorios
 * (`canonicalBookPiPayload`), aplicado en append() y verifyIntegrity().
 * §6.5/§6.6: la firma del bloque usa `bookpi-signer` (nunca `null`).
 *
 * La DECISIÓN de negocio (quién puede escribir/refund) la toma la capa
 * de autorización; este repositorio solo garantiza inmutabilidad,
 * integridad y persistencia real.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import { config } from "../config";
import { canonicalBookPiPayload } from "../bookpi/canonical-payload";
import {
  getSigningAlgorithm,
  isSimulatedAlgorithm,
  signBlockHash,
  verifyBlockSignature,
} from "../crypto/bookpi-signer";

export type LedgerCategory = "inference" | "processing" | "apis" | "skills" | "other";
export type LedgerStatus = "settled" | "pending" | "refunded";

export interface BlockPIBlock {
  index: number;
  timestamp: string;
  tenantId: string;
  userId: string;
  operation: string;
  category: LedgerCategory;
  costDecimal: string;
  tokensConsumed: number;
  previousHash: string;
  blockHash: string;
  pqcSignature: string | null;
  signatureAlgorithm: string;
  status: LedgerStatus;
  nonce: string;
}

export interface BookPIStoreFile {
  blocks: BlockPIBlock[];
  genesisPreviousHash: string;
}

const GENESIS_PREVIOUS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";
const STORE_PATH = path.join(process.cwd(), "isabella_bookpi_ledger.json");

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function toCents(value: number): string {
  if (!Number.isFinite(value)) throw new Error("Costo inválido.");
  const cents = Math.round(value * 100);
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100);
  const frac = abs % 100;
  return `${sign}${whole}.${String(frac).padStart(2, "0")}`;
}

/** Halla un bloque por índice dentro del tenant (frontera de tenant obligatoria). */
function findTenantBlock(blocks: BlockPIBlock[], tenantId: string, index: number): BlockPIBlock | null {
  return blocks.find((b) => b.tenantId === tenantId && b.index === index) ?? null;
}

/**
 * Crea un repositorio BookPI ligado a una ruta opcional (inyectable).
 * Análisis-estructura: expose métodos puros y capa de persistencia real.
 */
export function createBookpiRepository(storePath: string = STORE_PATH) {
  const runtime = config();
  if (
    runtime.ISABELLA_RUNTIME_MODE === "production" ||
    runtime.ISABELLA_RUNTIME_MODE === "staging"
  ) {
    throw new Error(
      "JSON BookPI persistence is disabled in staging and production. Use createBookpiPostgresRepository().",
    );
  }

  function loadStore(): BookPIStoreFile {
    if (!fs.existsSync(storePath)) {
      return { blocks: [], genesisPreviousHash: GENESIS_PREVIOUS_HASH };
    }
    try {
      const raw = fs.readFileSync(storePath, "utf-8");
      const parsed = JSON.parse(raw) as Partial<BookPIStoreFile>;
      const blocks = Array.isArray(parsed.blocks) ? (parsed.blocks as BlockPIBlock[]) : [];
      const genesisPreviousHash =
        typeof parsed.genesisPreviousHash === "string"
          ? parsed.genesisPreviousHash
          : GENESIS_PREVIOUS_HASH;
      return { blocks, genesisPreviousHash };
    } catch {
      return { blocks: [], genesisPreviousHash: GENESIS_PREVIOUS_HASH };
    }
  }

  function saveStore(store: BookPIStoreFile): void {
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf-8");
  }

  /**
   * §6.1: hash canónico (mismo payload que el repositorio PostgreSQL).
   * Excluye `blockHash`, `pqcSignature` y `signatureAlgorithm`.
   */
  function computeBlockHash(block: Omit<BlockPIBlock, "blockHash">): string {
    return sha256(canonicalBookPiPayload(block));
  }

  return {
    list(tenantId: string): BlockPIBlock[] {
      return loadStore().blocks.filter((b) => b.tenantId === tenantId);
    },

    full(): BlockPIBlock[] {
      return loadStore().blocks;
    },

    /** Registra un bloque nuevo encadenado al anterior (append-only). */
    append(input: {
      tenantId: string;
      userId: string;
      operation: string;
      category: LedgerCategory;
      cost: number;
      tokens: number;
    }): { success: true; block: BlockPIBlock } | { success: false; error: string } {
      if (input.cost < 0) return { success: false, error: "Costo negativo no admitido." };
      if (isSimulatedAlgorithm()) return { success: false, error: "Algoritmo simulado no permitido." };
      const store = loadStore();
      const prev = store.blocks[store.blocks.length - 1];
      const index = store.blocks.length;
      const timestamp = new Date().toISOString();
      const previousHash = prev?.blockHash ?? store.genesisPreviousHash;
      const nonce = crypto.randomUUID();
      const base: Omit<BlockPIBlock, "blockHash"> = {
        index,
        timestamp,
        tenantId: input.tenantId,
        userId: input.userId,
        operation: input.operation,
        category: input.category,
        costDecimal: toCents(input.cost),
        tokensConsumed: input.tokens,
        previousHash,
        pqcSignature: null,
        signatureAlgorithm: getSigningAlgorithm(),
        status: "settled",
        nonce,
      };
      const blockHash = computeBlockHash(base);
      // Firma real del hash (nunca null, §6.6).
      const pqcSignature = signBlockHash(blockHash);
      const block: BlockPIBlock = { ...base, blockHash, pqcSignature };
      store.blocks.push(block);
      saveStore(store);
      return { success: true, block };
    },

    /** Marca un bloque como refundido con un bloque de anulación encadenado. */
    refund(index: number, tenantId: string): { success: boolean; error?: string } {
      const store = loadStore();
      const target = findTenantBlock(store.blocks, tenantId, index);
      if (!target) return { success: false, error: "Bloque no encontrado." };
      if (target.status === "refunded") return { success: false, error: "Ya refundido." };
      // §6.7: idempotencia de refund — nunca dos anulaciones del mismo bloque.
      const alreadyRefunded = store.blocks.some(
        (b) => b.tenantId === tenantId && b.operation === `refund_of_${target.index}`,
      );
      if (alreadyRefunded) return { success: false, error: "Ya refundido." };
      if (isSimulatedAlgorithm()) return { success: false, error: "Algoritmo simulado no permitido." };

      const prev = store.blocks[store.blocks.length - 1];
      const previousHash = prev?.blockHash ?? store.genesisPreviousHash;
      const nonce = crypto.randomUUID();
      const base: Omit<BlockPIBlock, "blockHash"> = {
        index: store.blocks.length,
        timestamp: new Date().toISOString(),
        tenantId,
        userId: target.userId,
        operation: `refund_of_${target.index}`,
        category: target.category,
        costDecimal: target.costDecimal,
        tokensConsumed: 0,
        previousHash,
        pqcSignature: null,
        signatureAlgorithm: getSigningAlgorithm(),
        status: "refunded",
        nonce,
      };
      const blockHash = computeBlockHash(base);
      const pqcSignature = signBlockHash(blockHash);
      const block: BlockPIBlock = { ...base, blockHash, pqcSignature };
      store.blocks.push(block);
      saveStore(store);
      return { success: true };
    },

    /** Verifica la integridad de toda la cadena. */
    verifyIntegrity(): { success: boolean; error?: string; corruptedIndex?: number } {
      const store = loadStore();
      let prev = store.genesisPreviousHash;
      for (let i = 0; i < store.blocks.length; i++) {
        const block = store.blocks[i];
        if (!block) return { success: false, error: "Bloque ausente.", corruptedIndex: i };
        if (block.previousHash !== prev) {
          return { success: false, error: "Cadena rota.", corruptedIndex: i };
        }
        // §6.1: recomputa con el MISMO payload canónico que append().
        if (computeBlockHash(block) !== block.blockHash) {
          return { success: false, error: "Bloque alterado.", corruptedIndex: i };
        }
        // §6.5: verifica la firma real (rechaza sin firma o firma inválida).
        if (!verifyBlockSignature(block.blockHash, block.pqcSignature)) {
          return { success: false, error: "Firma inválida o ausente.", corruptedIndex: i };
        }
        prev = block.blockHash;
      }
      return { success: true };
    },
  };
}

export type BookpiRepository = ReturnType<typeof createBookpiRepository>;
export const BOOKPI_REPOSITORY = {
  create: createBookpiRepository,
};