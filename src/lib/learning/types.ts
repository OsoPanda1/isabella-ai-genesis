export type DatasetStatus = "PROPOSED" | "VALIDATED" | "REJECTED" | "REVOKED";
export type TrainingStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED";

export interface DatasetIdentity {
  datasetId: string;
  version: string;
  territoryId: string;
  source: string;
  license: string;
  schemaHash: string;
  contentHash: string;
  status: DatasetStatus;
  createdAt: string;
}

export interface DatasetValidation {
  valid: boolean;
  reasons: string[];
  contentHash: string;
  schemaHash: string;
}

export interface TrainingPolicy {
  allowedLicenses: string[];
  requireHumanApproval: boolean;
  requireProvenance: boolean;
  requireEvaluation: boolean;
  maxDatasetSize: number;
}

export interface TrainingRun {
  runId: string;
  datasetIds: string[];
  baseModelId?: string;
  algorithm: string;
  hyperparameters: Record<string, unknown>;
  seed: number;
  status: TrainingStatus;
  sourceCommit: string;
  inputHash: string;
  outputHash?: string;
  createdAt: string;
  completedAt?: string;
}
