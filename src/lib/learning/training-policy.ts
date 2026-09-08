import type { DatasetIdentity, TrainingPolicy } from "./types";

export interface TrainingPolicyDecision {
  allowed: boolean;
  reasons: string[];
}

export function evaluateTrainingPolicy(
  policy: TrainingPolicy,
  datasets: DatasetIdentity[],
  requestedEpochs: number,
): TrainingPolicyDecision {
  const reasons: string[] = [];
  if (datasets.length === 0) reasons.push("Se requiere al menos un dataset");
  for (const dataset of datasets) {
    if (dataset.status !== "APPROVED") reasons.push(`Dataset no aprobado: ${dataset.datasetId}@${dataset.version}`);
    if (!policy.allowedLicenses.includes(dataset.license)) reasons.push(`Licencia no permitida: ${dataset.license}`);
    if (policy.requireProvenance && (!dataset.contentHash || !dataset.schemaHash)) reasons.push(`Provenance incompleta: ${dataset.datasetId}`);
  }
  if (policy.requireContaminationCheck) reasons.push("Contamination check requerido antes de iniciar el entrenamiento");
  if (policy.maxEpochs !== undefined && requestedEpochs > policy.maxEpochs) reasons.push("Epochs exceden el límite de la política");
  return { allowed: reasons.length === 0, reasons };
}
