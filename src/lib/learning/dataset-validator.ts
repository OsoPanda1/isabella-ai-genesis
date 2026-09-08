import type { DatasetIdentity, DatasetValidation } from "./types";

export interface DatasetValidationInput {
  dataset: DatasetIdentity;
  sampleCount: number;
  featureCount: number;
  missingValues: number;
  duplicateRows: number;
  licensed: boolean;
  provenanceComplete: boolean;
  schemaConsistent: boolean;
}

export function validateDataset(input: DatasetValidationInput): DatasetValidation {
  const checks = {
    positiveSamples: input.sampleCount > 0,
    positiveFeatures: input.featureCount > 0,
    noMissingValues: input.missingValues === 0,
    noDuplicateRows: input.duplicateRows === 0,
    licenseApproved: input.licensed,
    provenanceComplete: input.provenanceComplete,
    schemaConsistent: input.schemaConsistent,
  };
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!checks.positiveSamples) errors.push("Dataset vacío");
  if (!checks.positiveFeatures) errors.push("Dataset sin features");
  if (!checks.noMissingValues) errors.push("Contiene valores faltantes");
  if (!checks.noDuplicateRows) warnings.push("Contiene filas duplicadas");
  if (!checks.licenseApproved) errors.push("Licencia no aprobada");
  if (!checks.provenanceComplete) errors.push("Provenance incompleta");
  if (!checks.schemaConsistent) errors.push("Schema inconsistente");
  return { valid: errors.length === 0, checks, errors, warnings };
}
