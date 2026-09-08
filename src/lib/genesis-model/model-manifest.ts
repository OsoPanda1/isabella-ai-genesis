export interface ModelManifest {
  modelId: string;
  version: string;
  family: string;
  stage: "GENESIS-0" | "GENESIS-1" | "GENESIS-2" | "GENESIS-3" | "GENESIS-4";
  architecture: string;
  parameterCount?: number;
  tokenizerId?: string;
  datasetIds: string[];
  trainingRunId: string;
  artifactHash: string;
  license: string;
  sourceCommit: string;
  evaluationRunIds: string[];
  safetyPolicyId: string;
  status: "CANDIDATE" | "APPROVED" | "REVOKED";
}

export function validateModelManifest(manifest: ModelManifest): void {
  const required: Array<keyof ModelManifest> = [
    "modelId", "version", "family", "stage", "architecture", "datasetIds",
    "trainingRunId", "artifactHash", "license", "sourceCommit", "evaluationRunIds", "safetyPolicyId", "status",
  ];
  for (const field of required) {
    const value = manifest[field];
    if (value === undefined || value === null || value === "") throw new Error(`Model manifest incompleto: ${String(field)}`);
  }
  if (!manifest.artifactHash.startsWith("sha3-512:")) throw new Error("artifactHash debe ser SHA3-512");
  if (manifest.datasetIds.length === 0) throw new Error("El modelo debe declarar datasets");
  if (manifest.evaluationRunIds.length === 0) throw new Error("El modelo debe declarar evaluaciones");
}
