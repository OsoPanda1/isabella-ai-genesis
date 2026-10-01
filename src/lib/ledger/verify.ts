import type { LedgerBlock, IntegrityResult } from "./contracts";

export async function verifyLedger(blocks: LedgerBlock[]): Promise<IntegrityResult> {
  if (!blocks || blocks.length === 0) {
    return {
      valid: true,
      checkedCount: 0,
      verifiedAt: new Date().toISOString(),
    };
  }

  for (let i = 0; i < blocks.length; i++) {
    const current = blocks[i];
    if (i > 0) {
      const prev = blocks[i - 1];
      if (current.previousHash && prev.currentHash && current.previousHash !== prev.currentHash) {
        return {
          valid: false,
          checkedCount: i + 1,
          errorSeq: current.seq,
          reason: `Ruptura de cadena en bloque #${current.seq}: previousHash no coincide con bloque #${prev.seq}`,
          verifiedAt: new Date().toISOString(),
        };
      }
    }
  }

  return {
    valid: true,
    checkedCount: blocks.length,
    verifiedAt: new Date().toISOString(),
  };
}
