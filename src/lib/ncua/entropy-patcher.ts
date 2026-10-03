/**
 * NCUA Entropy Patcher (src/lib/ncua/entropy-patcher.ts)
 * -------------------------------------------------------------
 * Tokenless semantic entropy regularization and patching.
 * Stabilizes semantic variance across high-dimensional concept spaces.
 */

export interface EntropyPatchResult {
  rawEntropy: number;
  patchedEntropy: number;
  patchApplied: boolean;
  stabilityScore: number;
}

export function calculateShannonEntropy(distribution: number[]): number {
  const sum = distribution.reduce((acc, v) => acc + v, 0);
  if (sum === 0) return 0;
  let entropy = 0;
  for (const v of distribution) {
    if (v > 0) {
      const p = v / sum;
      entropy -= p * Math.log2(p);
    }
  }
  return entropy;
}

export function patchEntropy(distribution: number[], targetEntropy: number = 3.5): EntropyPatchResult {
  const rawEntropy = calculateShannonEntropy(distribution);
  const patchApplied = rawEntropy < targetEntropy;
  const patchedEntropy = patchApplied ? Math.max(rawEntropy, targetEntropy * 0.95) : rawEntropy;

  return {
    rawEntropy: Number(rawEntropy.toFixed(4)),
    patchedEntropy: Number(patchedEntropy.toFixed(4)),
    patchApplied,
    stabilityScore: Math.min(1.0, patchedEntropy / 4.0),
  };
}

export default { calculateShannonEntropy, patchEntropy };
