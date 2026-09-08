import { createHash, randomUUID } from "node:crypto";
import type {
  FederatedRound,
  FederatedUpdate,
  ModelIdentity,
  NativeMLHooks,
  PredictionResult,
  TrainingResult,
} from "./types";

export interface NativeMLConfig {
  territoryId: string;
  deterministic?: boolean;
  seed?: number;
  hooks?: NativeMLHooks;
}

type BinaryClassifier = {
  weights: number[];
  bias: number;
  classes: [number, number];
};

/** Small, dependency-light native learner. It intentionally does not claim LLM capability. */
export class IsabellaNativeMLEngine {
  private readonly territoryId: string;
  private readonly deterministic: boolean;
  private readonly seed: number;
  private readonly hooks?: NativeMLHooks;
  private readonly models = new Map<string, { identity: ModelIdentity; classifier: BinaryClassifier }>();

  constructor(config: NativeMLConfig) {
    if (!config.territoryId) throw new Error("territoryId requerido");
    this.territoryId = config.territoryId;
    this.deterministic = config.deterministic ?? true;
    this.seed = config.seed ?? 42;
    this.hooks = config.hooks;
  }

  async fitClassification(
    X: number[][],
    y: number[],
    datasetId: string,
    algorithm: "logistic_sgd" = "logistic_sgd",
    epochs = 100,
    learningRate = 0.05,
  ): Promise<TrainingResult> {
    this.validateDataset(X, y);
    await this.authorize("MODEL_TRAINING");
    const classes = [...new Set(y)].sort((a, b) => a - b);
    if (classes.length !== 2) throw new Error("El clasificador nativo requiere exactamente dos clases");
    if (algorithm !== "logistic_sgd") throw new Error(`Algoritmo no soportado: ${algorithm}`);

    const weights = new Array(X[0].length).fill(0);
    let bias = 0;
    for (let epoch = 0; epoch < epochs; epoch += 1) {
      const order = this.order(X.length, epoch);
      for (const i of order) {
        const p = sigmoid(dot(weights, X[i]) + bias);
        const target = y[i] === classes[1] ? 1 : 0;
        const error = p - target;
        for (let j = 0; j < weights.length; j += 1) weights[j] -= learningRate * error * X[i][j];
        bias -= learningRate * error;
      }
    }

    const classifier: BinaryClassifier = { weights, bias, classes: [classes[0], classes[1]] };
    const modelHash = sha256(JSON.stringify({ algorithm, classifier, seed: this.seed }));
    const modelId = `${this.territoryId}:native:${algorithm}:${modelHash.slice(0, 16)}`;
    const identity: ModelIdentity = {
      modelId,
      version: "1.0.0",
      territoryId: this.territoryId,
      ownerId: "isabella-native-ml",
      task: "classification",
      algorithm,
      datasetIds: [datasetId],
      modelHash,
      createdAt: new Date().toISOString(),
      approvalStatus: "PENDING_REVIEW",
    };
    this.models.set(modelId, { identity, classifier });
    const metrics = this.evaluateClassifier(classifier, X, y);
    const trainingHash = sha256(JSON.stringify({ modelHash, metrics, datasetId }));
    const provenanceId = randomUUID();
    await this.audit("ISABELLA_MODEL_TRAINED", { modelId, datasetId, modelHash, trainingHash, provenanceId, metrics });
    return { model: identity, metrics, trainingHash, provenanceId, approvalRequired: true };
  }

  async predict(modelId: string, X: number[][]): Promise<PredictionResult<number>> {
    this.validateFeatures(X);
    await this.authorize("MODEL_INFERENCE", modelId);
    const record = this.models.get(modelId);
    if (!record) throw new Error(`Modelo no encontrado: ${modelId}`);
    if (record.identity.approvalStatus !== "APPROVED") {
      throw new Error(`Modelo no aprobado para inferencia: ${modelId}`);
    }
    const probabilities = X.map(row => sigmoid(dot(record.classifier.weights, row) + record.classifier.bias));
    const predictions = probabilities.map(p => (p >= 0.5 ? record.classifier.classes[1] : record.classifier.classes[0]));
    const confidence = probabilities.map(p => Math.max(p, 1 - p));
    const riskScore = 1 - confidence.reduce((a, b) => a + b, 0) / Math.max(1, confidence.length);
    const requiresReview = riskScore >= 0.7;
    const auditId = await this.audit("ISABELLA_RESPONSE_GENERATED", {
      modelId,
      territoryId: this.territoryId,
      predictionHash: sha256(JSON.stringify(predictions)),
      riskScore,
      requiresReview,
    });
    return {
      model: record.identity,
      predictions,
      confidence,
      explanation: { method: "linear_logit", featureWeights: record.classifier.weights },
      riskScore,
      requiresReview,
      degraded: true,
      auditId,
    };
  }

  approve(modelId: string): ModelIdentity {
    const record = this.models.get(modelId);
    if (!record) throw new Error(`Modelo no encontrado: ${modelId}`);
    record.identity = { ...record.identity, approvalStatus: "APPROVED" };
    return record.identity;
  }

  createFederatedUpdate(modelId: string, baseModelVersion: string, deltaWeights: number[], deltaBias: number, sampleCount: number): FederatedUpdate {
    const updateId = randomUUID();
    const body = { updateId, nodeId: this.territoryId, territoryId: this.territoryId, modelId, baseModelVersion, deltaWeights, deltaBias, sampleCount };
    return {
      ...body,
      metrics: { loss: 0 },
      updateHash: sha256(JSON.stringify(body)),
      signature: "UNSIGNED_PENDING_TRUSTED_KEY",
      createdAt: new Date().toISOString(),
    };
  }

  static aggregateFedAvg(updates: FederatedUpdate[], expectedModelId: string, baseVersion: string): FederatedRound {
    if (!updates.length) throw new Error("La ronda no contiene actualizaciones");
    if (updates.some(u => u.modelId !== expectedModelId || u.baseModelVersion !== baseVersion || u.sampleCount <= 0)) {
      throw new Error("Actualización federada incompatible");
    }
    const total = updates.reduce((s, u) => s + u.sampleCount, 0);
    const width = updates[0].deltaWeights.length;
    if (updates.some(u => u.deltaWeights.length !== width || u.deltaWeights.some(v => !Number.isFinite(v)))) throw new Error("Delta federado inválido");
    const weighted = new Array(width).fill(0);
    let bias = 0;
    for (const u of updates) {
      const factor = u.sampleCount / total;
      u.deltaWeights.forEach((v, i) => { weighted[i] += v * factor; });
      bias += u.deltaBias * factor;
    }
    return {
      roundId: randomUUID(), modelId: expectedModelId, baseVersion,
      participants: updates.map(u => u.nodeId), updateHashes: updates.map(u => u.updateHash),
      aggregation: "FEDAVG", status: "COMMITTED", nextVersion: `${baseVersion}-fedavg`,
    };
  }

  private evaluateClassifier(model: BinaryClassifier, X: number[][], y: number[]): Record<string, number> {
    const predictions = X.map(row => sigmoid(dot(model.weights, row) + model.bias) >= 0.5 ? model.classes[1] : model.classes[0]);
    return { accuracy: predictions.filter((p, i) => p === y[i]).length / y.length };
  }
  private validateDataset(X: number[][], y: number[]): void {
    if (!Array.isArray(X) || !X.length || X.length !== y.length) throw new Error("Dataset inválido");
    const width = X[0].length;
    if (!width) throw new Error("Dataset sin features");
    if (X.some(r => r.length !== width || r.some(v => !Number.isFinite(v))) || y.some(v => !Number.isFinite(v))) throw new Error("Dataset contiene valores no finitos o dimensiones inconsistentes");
  }
  private validateFeatures(X: number[][]): void {
    if (!Array.isArray(X) || X.some(r => r.some(v => !Number.isFinite(v)))) throw new Error("Features inválidas");
  }
  private order(n: number, epoch: number): number[] {
    const out = Array.from({ length: n }, (_, i) => i);
    if (this.deterministic) return out;
    let state = (this.seed + epoch) >>> 0;
    for (let i = out.length - 1; i > 0; i -= 1) { state = (1664525 * state + 1013904223) >>> 0; const j = state % (i + 1); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }
  private async authorize(action: string, modelId?: string): Promise<void> {
    const decision = await this.hooks?.authorize?.({ action, territoryId: this.territoryId, modelId });
    if (decision && decision.decision === "DENY") throw new Error(`CROWN DENY: ${decision.reasons.join("; ")}`);
    if (decision && decision.decision === "REVIEW") throw new Error("CROWN REVIEW: aprobación humana requerida");
  }
  private async audit(event: string, payload: Record<string, unknown>): Promise<string | undefined> {
    return this.hooks?.audit?.(event, payload) as Promise<string | undefined> | string | undefined;
  }
}

function sigmoid(x: number): number { return x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x)); }
function dot(a: number[], b: number[]): number { if (a.length !== b.length) throw new Error("Dimensión incompatible"); return a.reduce((s, v, i) => s + v * b[i], 0); }
function sha256(value: string): string { return createHash("sha256").update(value).digest("hex"); }
