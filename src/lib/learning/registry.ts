import { createHash } from "node:crypto";
import { NeonRepository } from "@/lib/persistence/adapters/neon-adapter";
import type { DatasetIdentity, TrainingRun } from "./types";

export interface RegisteredModel {
  id: string;
  tenantId: string;
  version: string;
  territoryId: string;
  ownerId: string;
  task: string;
  algorithm: string;
  datasetIds: string[];
  modelHash: string;
  approvalStatus: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "REVOKED";
  createdAt: string;
}

export interface EvaluationRun {
  id: string;
  tenantId: string;
  modelId: string;
  datasetId: string;
  protocolHash: string;
  metrics: Record<string, number>;
  baseline: Record<string, number>;
  artifactHash: string;
  status: "RUNNING" | "PASSED" | "FAILED";
  createdAt: string;
}

const datasets = new NeonRepository<DatasetIdentity>("fgais_datasets");
const models = new NeonRepository<RegisteredModel>("fgais_models");
const training = new NeonRepository<TrainingRun>("fgais_training_runs");
const evaluations = new NeonRepository<EvaluationRun>("fgais_evaluations");

function hashObject(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export async function registerDataset(tenantId: string, dataset: DatasetIdentity): Promise<DatasetIdentity> {
  if (dataset.status !== "VALIDATED") throw new Error("Only validated datasets may enter the training registry");
  if (!dataset.license.trim() || !dataset.contentHash || !dataset.schemaHash) throw new Error("Dataset provenance is incomplete");
  return datasets.create(tenantId, dataset, { idempotencyKey: `${dataset.datasetId}:${dataset.version}` });
}

export async function registerModel(tenantId: string, model: RegisteredModel): Promise<RegisteredModel> {
  if (model.approvalStatus !== "PENDING_REVIEW") throw new Error("New models must start PENDING_REVIEW");
  if (!model.modelHash || model.datasetIds.length === 0) throw new Error("Model provenance is incomplete");
  return models.create(tenantId, model, { idempotencyKey: `${model.id}:${model.version}` });
}

export async function createTrainingRun(tenantId: string, input: Omit<TrainingRun, "inputHash">): Promise<TrainingRun> {
  const run: TrainingRun = { ...input, inputHash: hashObject(input) };
  return training.create(tenantId, run, { idempotencyKey: run.runId });
}

export async function recordEvaluation(tenantId: string, evaluation: EvaluationRun): Promise<EvaluationRun> {
  if (!evaluation.protocolHash || !evaluation.artifactHash) throw new Error("Evaluation evidence is incomplete");
  return evaluations.create(tenantId, evaluation, { idempotencyKey: evaluation.id });
}

export { hashObject };
