/**
 * NCUA Concept Engine (src/lib/ncua/concept-engine.ts)
 * -------------------------------------------------------------
 * Tokenless concept extractor and representation model.
 */
import { createHash } from "node:crypto";

export interface ConceptFrame {
  conceptId: string;
  name: string;
  dimensions: number[];
  axiomHash: string;
  epistemicWeight: number;
}

export function extractConcept(text: string): ConceptFrame {
  const normalized = text.trim();
  const hash = createHash("sha3-512").update(normalized, "utf8").digest("hex");

  // Deterministic 16-dimensional concept projection derived from SHA3-512
  const dimensions: number[] = [];
  for (let i = 0; i < 16; i++) {
    const chunk = hash.substring(i * 4, i * 4 + 4);
    const val = parseInt(chunk, 16) / 65535.0;
    dimensions.push(Number(val.toFixed(4)));
  }

  return {
    conceptId: `concept_${hash.substring(0, 16)}`,
    name: normalized.substring(0, 64),
    dimensions,
    axiomHash: hash,
    epistemicWeight: Number((dimensions.reduce((a, b) => a + b, 0) / 16).toFixed(4)),
  };
}

export default { extractConcept };
