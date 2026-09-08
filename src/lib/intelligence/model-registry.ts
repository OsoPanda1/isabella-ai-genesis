import { createHash } from "node:crypto";

export type ModelStatus = "PROPOSED" | "EVALUATED" | "APPROVED" | "DEPLOYED" | "REVOKED";

export interface ModelIdentity {
  modelId: string;
  version: string;
  provider: string;
  family: string;
  task: string;
  artifactHash: string;
  license: string;
  status: ModelStatus;
  createdAt: string;
}

export class ModelRegistry {
  private readonly models = new Map<string, ModelIdentity>();

  register(input: Omit<ModelIdentity, "artifactHash" | "status" | "createdAt"> & { artifact: unknown }): ModelIdentity {
    const key = `${input.modelId}@${input.version}`;
    if (this.models.has(key)) throw new Error(`Modelo ya registrado: ${key}`);
    const model: ModelIdentity = {
      modelId: input.modelId,
      version: input.version,
      provider: input.provider,
      family: input.family,
      task: input.task,
      artifactHash: `sha3-512:${createHash("sha3-512").update(stableSerialize(input.artifact)).digest("hex")}`,
      license: input.license,
      status: "PROPOSED",
      createdAt: new Date().toISOString(),
    };
    this.models.set(key, model);
    return model;
  }

  setStatus(modelId: string, version: string, status: ModelStatus): ModelIdentity {
    const key = `${modelId}@${version}`;
    const current = this.models.get(key);
    if (!current) throw new Error(`Modelo no encontrado: ${key}`);
    const updated = { ...current, status };
    this.models.set(key, updated);
    return updated;
  }

  get(modelId: string, version: string) { return this.models.get(`${modelId}@${version}`); }
  list() { return [...this.models.values()]; }
}

function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
  return `{${Object.keys(value as Record<string, unknown>).sort().map(k => `${JSON.stringify(k)}:${stableSerialize((value as Record<string, unknown>)[k])}`).join(",")}}`;
}
