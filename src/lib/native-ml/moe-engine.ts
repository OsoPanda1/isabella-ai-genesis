import { createHash } from "node:crypto";

export interface MoeExpertArtifact {
  expertId: string;
  version: string;
  modelHash: string;
  datasetId: string;
  datasetVersion: string;
  license: string;
  capacity: number;
  execute: (input: number[]) => number[] | Promise<number[]>;
}

export interface MoeGateDecision {
  expertId: string;
  logit: number;
  weight: number;
  rank: number;
}

export interface MoeTrace {
  inputHash: string;
  selected: MoeGateDecision[];
  overflow: boolean;
  fallbackUsed: boolean;
  contributions: Array<{ expertId: string; weight: number; outputHash: string }>;
}

export interface MoeExecutionResult {
  output: number[];
  trace: MoeTrace;
}

export interface MoeRouteOptions {
  topK?: number;
  capacityFactor?: number;
  fallbackExpertId?: string;
}

function stableHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function softmax(logits: number[]): number[] {
  if (!logits.length) return [];
  const max = Math.max(...logits);
  const exps = logits.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
}

function validateArtifact(expert: MoeExpertArtifact): void {
  if (
    !expert.expertId ||
    !expert.version ||
    !expert.modelHash ||
    !expert.datasetId ||
    !expert.license
  ) {
    throw new Error(`moe_expert_artifact_invalid:${expert.expertId || "unknown"}`);
  }
  if (!Number.isInteger(expert.capacity) || expert.capacity < 1) {
    throw new Error(`moe_expert_capacity_invalid:${expert.expertId}`);
  }
}

export function createMoERoute(
  experts: readonly MoeExpertArtifact[],
  options: MoeRouteOptions = {},
) {
  const topK = Math.max(1, Math.min(options.topK ?? 2, experts.length));
  const capacityFactor = Math.max(0.1, options.capacityFactor ?? 1);
  if (!experts.length) throw new Error("moe_experts_required");
  for (const expert of experts) validateArtifact(expert);

  const registry = new Map(experts.map((expert) => [expert.expertId, expert]));
  if (options.fallbackExpertId && !registry.has(options.fallbackExpertId)) {
    throw new Error("moe_fallback_expert_not_registered");
  }

  return {
    topK,
    capacityFactor,
    experts: [...experts],
    route(input: number[], logits: number[]): MoeGateDecision[] {
      if (logits.length !== experts.length) throw new Error("moe_logit_count_mismatch");
      const weights = softmax(logits);
      return experts
        .map((expert, index) => ({
          expertId: expert.expertId,
          logit: logits[index]!,
          weight: weights[index]!,
          rank: index,
        }))
        .sort((a, b) => b.weight - a.weight || a.expertId.localeCompare(b.expertId))
        .slice(0, topK)
        .map((item, index) => ({ ...item, rank: index }));
    },
    registry,
  };
}

export async function executeMoE(
  route: ReturnType<typeof createMoERoute>,
  input: number[],
  logits: number[],
): Promise<MoeExecutionResult> {
  const selected = route.route(input, logits);
  const capacityByExpert = new Map(
    route.experts.map((expert) => [
      expert.expertId,
      Math.max(1, Math.floor(expert.capacity * route.capacityFactor)),
    ]),
  );
  let overflow = false;
  let fallbackUsed = false;
  const outputs: Array<{ expertId: string; weight: number; output: number[] }> = [];

  for (const decision of selected) {
    const expert = route.registry.get(decision.expertId)!;
    const capacity = capacityByExpert.get(expert.expertId) ?? 1;
    const expertOutputCount = outputs.filter((item) => item.expertId === expert.expertId).length;
    if (expertOutputCount >= capacity) {
      overflow = true;
      continue;
    }
    const output = await expert.execute(input);
    if (output.length !== input.length || output.some((value) => !Number.isFinite(value))) {
      throw new Error(`moe_expert_output_invalid:${expert.expertId}`);
    }
    outputs.push({ expertId: expert.expertId, weight: decision.weight, output });
  }

  if (!outputs.length) {
    const fallbackId = route.registry.has("fallback") ? "fallback" : undefined;
    if (!fallbackId) throw new Error("moe_capacity_exhausted_without_fallback");
    const fallback = route.registry.get(fallbackId)!;
    const output = await fallback.execute(input);
    outputs.push({ expertId: fallback.expertId, weight: 1, output });
    fallbackUsed = true;
  }

  const totalWeight = outputs.reduce((sum, item) => sum + item.weight, 0) || 1;
  const output = input.map((_, index) =>
    outputs.reduce((sum, item) => sum + (item.output[index] ?? 0) * (item.weight / totalWeight), 0),
  );

  return {
    output,
    trace: {
      inputHash: stableHash(input),
      selected,
      overflow,
      fallbackUsed,
      contributions: outputs.map((item) => ({
        expertId: item.expertId,
        weight: item.weight,
        outputHash: stableHash(item.output),
      })),
    },
  };
}

export function listModels(route: ReturnType<typeof createMoERoute>): MoeExpertArtifact[] {
  return [...route.experts];
}

export function recordIntelligenceMetric(trace: MoeTrace) {
  return {
    inputHash: trace.inputHash,
    selectedExperts: trace.selected.map((item) => item.expertId),
    utilization: trace.selected.reduce((sum, item) => sum + item.weight, 0),
    overflow: trace.overflow,
    fallbackUsed: trace.fallbackUsed,
  };
}
