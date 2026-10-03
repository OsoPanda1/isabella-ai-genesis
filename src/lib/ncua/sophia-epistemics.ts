/**
 * NCUA SOPHIA Epistemics (src/lib/ncua/sophia-epistemics.ts)
 * -------------------------------------------------------------
 * Canonical FGAIS NCUA v2.0 Epistemic Taxonomy:
 * E0 — Axiom / Definitional truth
 * E1 — Empirically verified fact with peer source
 * E2 — Contextual inference (logical deduction)
 * E3 — Synthetic hypothesis / conjecture
 * E4 — Unfounded or contradictory claim
 */

export type EpistemicLevel =
  | "E0_AXIOM"
  | "E1_VERIFIED"
  | "E2_INFERRED"
  | "E3_HYPOTHETICAL"
  | "E4_UNFOUNDED";

export interface EpistemicClassification {
  level: EpistemicLevel;
  confidence: number;
  sourcesCount: number;
  caveatRequired: boolean;
  citationRequired: boolean;
  notes?: string;
}

export function classifySophiaEpistemic(claim: string, sourcesCount: number = 0): EpistemicClassification {
  const normalized = claim.trim().toLowerCase();

  // E0: Axiomatic mathematical or definitional truths
  if (
    normalized.includes("por definición") ||
    normalized.includes("axioma") ||
    normalized.includes("identidad fundamental")
  ) {
    return {
      level: "E0_AXIOM",
      confidence: 1.0,
      sourcesCount,
      caveatRequired: false,
      citationRequired: false,
      notes: "Axiomatic baseline.",
    };
  }

  // E1: Verified with citations
  if (sourcesCount >= 2) {
    return {
      level: "E1_VERIFIED",
      confidence: 0.98,
      sourcesCount,
      caveatRequired: false,
      citationRequired: true,
      notes: "Verified with empirical sources.",
    };
  }

  // E2: Inferred with single source or structured deduction
  if (sourcesCount === 1 || normalized.includes("por lo tanto") || normalized.includes("concluye")) {
    return {
      level: "E2_INFERRED",
      confidence: 0.85,
      sourcesCount,
      caveatRequired: true,
      citationRequired: true,
      notes: "Contextual inference from available evidence.",
    };
  }

  // E3: Hypothesis
  if (normalized.includes("hipótesis") || normalized.includes("posiblemente") || normalized.includes("teoría")) {
    return {
      level: "E3_HYPOTHETICAL",
      confidence: 0.65,
      sourcesCount,
      caveatRequired: true,
      citationRequired: false,
      notes: "Hypothetical synthesis.",
    };
  }

  // E4: Unfounded / Conflict
  return {
    level: "E4_UNFOUNDED",
    confidence: 0.3,
    sourcesCount: 0,
    caveatRequired: true,
    citationRequired: false,
    notes: "Unverified claim without empirical support.",
  };
}

export default { classifySophiaEpistemic };
