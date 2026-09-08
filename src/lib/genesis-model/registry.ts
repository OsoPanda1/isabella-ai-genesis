import { NeonRepository } from "@/lib/persistence/adapters/neon-adapter";
import { evaluateModelRelease, type ReleaseCandidate } from "./release-gate";

export interface ModelReleaseRecord { id: string; tenantId: string; modelId: string; version: string; artifactHash: string; manifestHash: string; evidenceId: string; status: "CANDIDATE" | "APPROVED" | "REVOKED"; createdAt: string; }
const releases = new NeonRepository<ModelReleaseRecord>("fgais_model_releases");

export async function proposeModelRelease(tenantId: string, candidate: ReleaseCandidate): Promise<ModelReleaseRecord> {
  const decision = evaluateModelRelease(candidate);
  if (!decision.allowed) throw new Error(`model_release_blocked: ${decision.reasons.join("; ")}`);
  const record: ModelReleaseRecord = { id: `${candidate.modelId}:${candidate.version}`, tenantId, modelId: candidate.modelId, version: candidate.version, artifactHash: candidate.artifactHash, manifestHash: candidate.manifestHash, evidenceId: candidate.evidenceId, status: "CANDIDATE", createdAt: new Date().toISOString() };
  return releases.create(tenantId, record);
}
