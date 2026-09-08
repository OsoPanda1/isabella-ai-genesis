import { createHash } from "node:crypto";
import type { DatasetIdentity, ModelIdentity, NativeMLHooks, PredictionResult, TrainingResult, MLTask } from "./types";

export interface BinaryDataset { dataset: DatasetIdentity; features: number[][]; labels: number[]; }

function hash(value: unknown): string { return createHash("sha256").update(JSON.stringify(value)).digest("hex"); }
function sigmoid(x: number): number { return 1 / (1 + Math.exp(-Math.max(-40, Math.min(40, x)))); }

export async function trainBinaryClassifier(input: BinaryDataset, ownerId: string, territoryId: string, hooks: NativeMLHooks = {}): Promise<TrainingResult> {
  if (input.features.length === 0 || input.features.length !== input.labels.length) throw new Error("invalid dataset cardinality");
  const width = input.features[0]?.length ?? 0;
  if (width === 0 || input.features.some((row) => row.length !== width || row.some((v) => !Number.isFinite(v)))) throw new Error("invalid feature matrix");
  if (input.labels.some((v) => v !== 0 && v !== 1)) throw new Error("binary labels required");
  if (!input.dataset.license || !input.dataset.contentHash || !input.dataset.schemaHash) throw new Error("dataset provenance required");
  const modelId = `native-logreg-${hash({ dataset: input.dataset.datasetId, version: input.dataset.version, ownerId }).slice(0, 16)}`;
  const decision = await hooks.authorize?.({ action: "native_ml.train", territoryId, modelId });
  if (decision && decision.decision !== "ALLOW") throw new Error(`native_ml_${decision.decision.toLowerCase()}`);
  const weights = Array.from({ length: width }, () => 0);
  let bias = 0;
  const lr = 0.05;
  for (let epoch = 0; epoch < 40; epoch++) {
    for (let i = 0; i < input.features.length; i++) {
      const row = input.features[i]!; const y = input.labels[i]!;
      const p = sigmoid(row.reduce((sum, x, j) => sum + x * weights[j]!, bias));
      const error = p - y;
      for (let j = 0; j < width; j++) weights[j] = weights[j]! - lr * error * row[j]!;
      bias -= lr * error;
    }
  }
  let correct = 0;
  let loss = 0;
  for (let i = 0; i < input.features.length; i++) {
    const p = sigmoid(input.features[i]!.reduce((sum, x, j) => sum + x * weights[j]!, bias));
    correct += (p >= 0.5 ? 1 : 0) === input.labels[i] ? 1 : 0;
    loss += -(input.labels[i]! * Math.log(Math.max(p, 1e-9)) + (1 - input.labels[i]!) * Math.log(Math.max(1 - p, 1e-9)));
  }
  const model: ModelIdentity = { modelId, version: "0.1.0", territoryId, ownerId, task: "classification", algorithm: "deterministic-logistic-sgd", datasetIds: [input.dataset.datasetId], modelHash: hash({ weights, bias }), createdAt: new Date().toISOString(), approvalStatus: "PENDING_REVIEW" };
  const trainingHash = hash({ dataset: input.dataset, weights, bias });
  const provenanceId = `prov_${hash({ dataset: input.dataset, trainingHash }).slice(0, 24)}`;
  await hooks.audit?.("native_ml.training_completed", { modelId, trainingHash, provenanceId });
  return { model, metrics: { accuracy: correct / input.features.length, logLoss: loss / input.features.length }, trainingHash, provenanceId, approvalRequired: true };
}

export async function predictBinary(model: ModelIdentity, weights: number[], bias: number, features: number[][], hooks: NativeMLHooks = {}): Promise<PredictionResult<number>> {
  if (model.approvalStatus !== "APPROVED") throw new Error("model_not_approved");
  if (features.some((row) => row.length !== weights.length || row.some((v) => !Number.isFinite(v)))) throw new Error("invalid features");
  const decision = await hooks.authorize?.({ action: "native_ml.predict", territoryId: model.territoryId, modelId: model.modelId });
  if (decision && decision.decision === "DENY") throw new Error("native_ml_denied");
  const probabilities = features.map((row) => sigmoid(row.reduce((sum, x, j) => sum + x * weights[j]!, bias)));
  const predictions = probabilities.map((p) => p >= 0.5 ? 1 : 0);
  const confidence = probabilities.map((p) => Math.max(p, 1 - p));
  return { model, predictions, confidence, explanation: { method: "linear_feature_contribution", featureCount: weights.length }, riskScore: Math.max(0, 1 - Math.min(...confidence, 1)), requiresReview: Boolean(decision?.decision === "REVIEW"), degraded: true };
}

export type { MLTask };
