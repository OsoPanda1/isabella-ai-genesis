/**
 * Epistemic Reliability Index (ERI) Gate (src/lib/ncua/eri.ts)
 * -------------------------------------------------------------
 * Evaluates the epistemic reliability of knowledge representations.
 * Strict Gate: ERI >= 95.0 required for verified academic status.
 */

export interface EriEvaluationInput {
  sourceCount: number;
  peerReviewedSources: number;
  directEvidenceRatio: number; // 0..1
  contradictionDetected: boolean;
  citationPrecision: number;   // 0..1
  temporalFreshnessScore: number; // 0..1
}

export interface EriEvaluationResult {
  eriScore: number;
  passedGate95: boolean;
  formulaVersion: string;
  sourceCoverage: number;
  penaltiesApplied: string[];
}

export function computeEriScore(input: EriEvaluationInput): EriEvaluationResult {
  const penalties: string[] = [];

  // Base score
  let score = 50.0;

  // Source contribution
  score += Math.min(input.sourceCount * 10, 25);
  score += Math.min(input.peerReviewedSources * 10, 15);

  // Evidence quality
  score += input.directEvidenceRatio * 10;
  score += input.citationPrecision * 10;

  // Contradiction penalty
  if (input.contradictionDetected) {
    score -= 30;
    penalties.push("CONTRADICTION_PENALTY_30");
  }

  // Bound score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return {
    eriScore: Number(score.toFixed(2)),
    passedGate95: score >= 95.0,
    formulaVersion: "NCUA-ERI-v2.1",
    sourceCoverage: Math.min(1.0, (input.sourceCount + input.peerReviewedSources) / 4),
    penaltiesApplied: penalties,
  };
}

export default { computeEriScore };
