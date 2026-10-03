import type { LedgerBlock, IntegrityResult } from "./contracts";

export async function verifyLedger(blocks: LedgerBlock[]): Promise<IntegrityResult> {
  if (!blocks || blocks.length === 0) {
    return {
      valid: true,
      state: "verified",
      checked: 0,
      total: 0,
      code: "LEDGER_EMPTY",
      message: "Ledger vacío: no hay bloques que verificar.",
    };
  }

  for (let i = 0; i < blocks.length; i++) {
    const current = blocks[i];
    if (i > 0) {
      const prev = blocks[i - 1];
      if (current.previousHash && prev.currentHash && current.previousHash !== prev.currentHash) {
        return {
          valid: false,
          state: "invalid",
          checked: i + 1,
          total: blocks.length,
          invalidSeq: current.seq,
          code: "HASH_CHAIN_BROKEN",
          message: `Ruptura de cadena en bloque #${current.seq}: previousHash no coincide con bloque #${prev.seq}`,
        };
      }
    }
  }

  return {
    valid: true,
    state: "verified",
    checked: blocks.length,
    total: blocks.length,
    code: "HASH_CHAIN_OK",
    message: `Cadena continua en ${blocks.length} bloques: previousHash coincide con el currentHash previo.`,
  };
}
