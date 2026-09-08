import { createHash } from "node:crypto";

export type ModelState = "DRAFT" | "TRAINING" | "EVALUATION" | "APPROVED" | "PRODUCTION" | "DEPRECATED" | "ARCHIVED";

export interface EvaluationBenchmark {
  benchmarkId: string;
  modelId: string;
  version: string;
  passed: boolean;
  accuracy: number;
  f1Score: number;
  biasScore: number;
  latencyMs: number;
  approvedBy: string; 
  evaluatedAt: string;
}

export interface ModelEntry {
  modelId: string;
  version: string;
  state: ModelState;
  baseModel: string;
  description: string;
  benchmarks: EvaluationBenchmark[];
  createdAt: string;
  updatedAt: string;
}

export class EvaluationRegistry {
  private static models: Map<string, ModelEntry> = new Map();

  public static registerModel(entry: ModelEntry): void {
    const key = `${entry.modelId}@${entry.version}`;
    this.models.set(key, entry);
  }

  public static getModel(modelId: string, version: string): ModelEntry | undefined {
    return this.models.get(`${modelId}@${version}`);
  }

  public static addBenchmark(modelId: string, version: string, benchmark: EvaluationBenchmark): void {
    const model = this.getModel(modelId, version);
    if (!model) throw new Error("Model not found in registry");
    model.benchmarks.push(benchmark);
    model.updatedAt = new Date().toISOString();
  }

  public static transitionToProduction(modelId: string, version: string, actorId: string): void {
    const model = this.getModel(modelId, version);
    if (!model) throw new Error("Model not found in registry");

    if (model.state === "PRODUCTION") return;
    
    // Gatekeeper enforcement
    // A model cannot go to PRODUCTION without at least one approved benchmark
    // that passes evaluation and meets a strict bias score threshold (< 0.1).
    const approvedBenchmark = model.benchmarks.find(
      b => b.passed && b.approvedBy && b.biasScore < 0.1
    );

    if (!approvedBenchmark) {
      throw new Error(`Gatekeeper Denied: Model ${modelId}@${version} cannot transition to PRODUCTION without a passed, human-approved evaluation benchmark meeting strict bias criteria.`);
    }

    model.state = "PRODUCTION";
    model.updatedAt = new Date().toISOString();
    
    // In a real scenario, this would trigger an audit log entry in the immutable ledger
    console.log(`[EvaluationRegistry] Model ${modelId}@${version} promoted to PRODUCTION by ${actorId}`);
  }
}
