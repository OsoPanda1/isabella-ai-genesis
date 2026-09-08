import { createHash } from "node:crypto";
import type { DatasetIdentity, DatasetStatus, DatasetValidation } from "./types";

export interface DatasetRegistrationInput {
  datasetId: string;
  version: string;
  territoryId: string;
  source: string;
  license: string;
  schema: unknown;
  content: unknown;
}

/** In-memory registry for development/tests. Production persistence belongs in the canonical DB. */
export class DatasetRegistry {
  private readonly datasets = new Map<string, DatasetIdentity>();

  register(input: DatasetRegistrationInput): DatasetIdentity {
    if (!input.datasetId || !input.version || !input.territoryId || !input.license) {
      throw new Error("datasetId, version, territoryId y license son obligatorios");
    }
    const key = `${input.datasetId}@${input.version}`;
    if (this.datasets.has(key)) throw new Error(`Dataset ya registrado: ${key}`);

    const schemaHash = hash(input.schema);
    const contentHash = hash(input.content);
    const dataset: DatasetIdentity = {
      datasetId: input.datasetId,
      version: input.version,
      territoryId: input.territoryId,
      source: input.source,
      license: input.license,
      schemaHash,
      contentHash,
      status: "PROPOSED",
      createdAt: new Date().toISOString(),
    };
    this.datasets.set(key, dataset);
    return dataset;
  }

  validate(datasetId: string, version: string, validation: DatasetValidation): DatasetIdentity {
    const key = `${datasetId}@${version}`;
    const dataset = this.datasets.get(key);
    if (!dataset) throw new Error(`Dataset no encontrado: ${key}`);
    const status: DatasetStatus = validation.valid ? "VALIDATED" : "REJECTED";
    const updated = { ...dataset, status };
    this.datasets.set(key, updated);
    return updated;
  }

  approve(datasetId: string, version: string): DatasetIdentity {
    return this.transition(datasetId, version, "APPROVED", ["VALIDATED"]);
  }

  revoke(datasetId: string, version: string): DatasetIdentity {
    return this.transition(datasetId, version, "REVOKED", ["APPROVED", "VALIDATED"]);
  }

  get(datasetId: string, version: string): DatasetIdentity | undefined {
    return this.datasets.get(`${datasetId}@${version}`);
  }

  list(): DatasetIdentity[] { return [...this.datasets.values()]; }

  private transition(datasetId: string, version: string, status: DatasetStatus, allowed: DatasetStatus[]) {
    const key = `${datasetId}@${version}`;
    const dataset = this.datasets.get(key);
    if (!dataset) throw new Error(`Dataset no encontrado: ${key}`);
    if (!allowed.includes(dataset.status)) throw new Error(`Transición inválida: ${dataset.status} -> ${status}`);
    const updated = { ...dataset, status };
    this.datasets.set(key, updated);
    return updated;
  }
}

function hash(value: unknown): string {
  return `sha3-512:${createHash("sha3-512").update(stableSerialize(value)).digest("hex")}`;
}

function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
  return `{${Object.keys(value as Record<string, unknown>).sort().map(k => `${JSON.stringify(k)}:${stableSerialize((value as Record<string, unknown>)[k])}`).join(",")}}`;
}
