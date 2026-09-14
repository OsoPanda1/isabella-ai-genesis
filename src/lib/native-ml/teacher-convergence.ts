import { createHash } from "node:crypto";

export interface TeacherObservation {
  teacherId: string;
  response: string;
  confidence: number;
  sourceModel?: string;
  knowledgeTimestamp?: string;
  provenance?: string[];
}

export interface TeacherConsensus {
  consensusText: string;
  teacherIds: string[];
  agreementScore: number;
  confidence: number;
  conflict: boolean;
  provenanceHash: string;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function normalize(text: string): string {
  return text.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("es-MX");
}

function hash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function similarity(a: string, b: string): number {
  const left = new Set(normalize(a).split(/\W+/u).filter(Boolean));
  const right = new Set(normalize(b).split(/\W+/u).filter(Boolean));
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
}

/**
 * Combines teacher outputs without importing proprietary weights or hidden state.
 * It is a governed knowledge-fusion layer: outputs remain attributable to their
 * original teacher and are never treated as authority by themselves.
 */
export function convergeTeacherObservations(
  observations: readonly TeacherObservation[],
): TeacherConsensus {
  if (observations.length < 2)
    throw new Error("teacher_convergence_requires_multiple_observations");
  if (observations.length > 16) throw new Error("teacher_convergence_observation_limit");

  const clean = observations.map((observation) => ({
    ...observation,
    teacherId: observation.teacherId.trim(),
    response: observation.response.trim(),
    confidence: clamp01(observation.confidence),
  }));
  if (clean.some((item) => !item.teacherId || !item.response))
    throw new Error("teacher_convergence_invalid_observation");

  const scores = clean.map((candidate) => {
    let similaritySum = 0;
    for (const peer of clean) {
      if (peer === candidate) continue;
      similaritySum += similarity(candidate.response, peer.response);
    }
    const agreement = similaritySum / (clean.length - 1);
    return { candidate, score: agreement * (0.5 + 0.5 * candidate.confidence) };
  });
  scores.sort((a, b) => b.score - a.score);
  const winner = scores[0]!;
  const agreementScore = clamp01(winner.score);
  const conflict = agreementScore < 0.35;
  const confidence = clamp01(
    (clean.reduce((sum, item) => sum + item.confidence, 0) / clean.length) * 0.5 +
      agreementScore * 0.5,
  );
  const provenanceHash = hash(
    clean.map((item) => ({
      teacherId: item.teacherId,
      sourceModel: item.sourceModel ?? null,
      responseHash: hash(item.response),
      knowledgeTimestamp: item.knowledgeTimestamp ?? null,
      provenance: item.provenance ?? [],
    })),
  );

  return {
    consensusText: winner.candidate.response,
    teacherIds: clean.map((item) => item.teacherId),
    agreementScore,
    confidence,
    conflict,
    provenanceHash,
  };
}
