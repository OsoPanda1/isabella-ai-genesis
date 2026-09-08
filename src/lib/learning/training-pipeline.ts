import { createHash } from "node:crypto";
import type { DatasetIdentity, TrainingPolicy, TrainingRun } from "./types";
import { evaluateTrainingPolicy } from "./training-policy";

export interface TrainingExecutor {
  fit(input: { datasets: DatasetIdentity[]; algorithm: string; hyperparameters: Record<string, unknown>; seed: number }): Promise<{ outputHash: string }>;
}

export class GovernedTrainingPipeline {
  constructor(private readonly executor: TrainingExecutor) {}

  async run(input: {
    runId: string;
    datasets: DatasetIdentity[];
    policy: TrainingPolicy;
    algorithm: string;
    hyperparameters?: Record<string, unknown>;
    seed?: number;
    epochs?: number;
    baseModelId?: string;
    sourceCommit?: string;
  }): Promise<TrainingRun> {
    const hyperparameters = input.hyperparameters ?? {};
    const seed = input.seed ?? 0;
    const policy = evaluateTrainingPolicy(input.policy, input.datasets, input.epochs ?? Number(hyperparameters.epochs ?? 1));
    const inputHash = hash({ datasetIds: input.datasets.map(d => `${d.datasetId}@${d.version}`), algorithm: input.algorithm, hyperparameters, seed });
    const base: TrainingRun = {
      runId: input.runId,
      datasetIds: input.datasets.map(d => `${d.datasetId}@${d.version}`),
      baseModelId: input.baseModelId,
      algorithm: input.algorithm,
      hyperparameters,
      seed,
      status: policy.allowed ? "QUEUED" : "REJECTED",
      sourceCommit: input.sourceCommit,
      inputHash,
      createdAt: new Date().toISOString(),
    };
    if (!policy.allowed) return base;
    try {
      const result = await this.executor.fit({ datasets: input.datasets, algorithm: input.algorithm, hyperparameters, seed });
      return { ...base, status: "COMPLETED", outputHash: result.outputHash };
    } catch {
      return { ...base, status: "FAILED" };
    }
  }
}

function hash(value: unknown): string {
  return `sha3-512:${createHash("sha3-512").update(JSON.stringify(value)).digest("hex")}`;
}
