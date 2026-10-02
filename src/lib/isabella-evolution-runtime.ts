import { createHash } from "node:crypto";
import { executeMoE, createMoERoute, type MoeExpertArtifact, type MoeTrace } from "./native-ml/moe-engine";
import { executeNativeSkill, type NativeSkillExecution } from "./native-ml/skill-fusion";
import { IsabellaLearningEngine, type LearningMemory } from "./isabella-learning";

export interface IsabellaEvolutionRequest {
  skillId: string;
  task: string;
  input?: Record<string, unknown>;
  tenantId: string;
  requestId: string;
  learn?: boolean;
  consent?: boolean;
}

export interface IsabellaEvolutionResult {
  version: "evolution-1";
  execution: NativeSkillExecution;
  routedVector: number[];
  moeTrace: MoeTrace;
  memories: LearningMemory[];
  learningAccepted: boolean;
  provenanceHash: string;
}

function hash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function boundedVector(values: readonly number[]): number[] {
  return values.map((value) => Math.max(-1, Math.min(1, Number(value) || 0)));
}

function buildExperts(width: number): MoeExpertArtifact[] {
  const project = (expertId: string, version: string, transform: (value: number, index: number) => number) => ({
    expertId,
    version,
    modelHash: hash({ expertId, version }),
    datasetId: "isabella-native-runtime",
    datasetVersion: "1",
    license: "internal-governed",
    capacity: 1,
    execute: (input: number[]) => input.map(transform),
  });
  return [
    project("reasoning", "1.0.0", (value) => Math.tanh(value)),
    project("safety", "1.0.0", (value) => Math.max(-0.75, Math.min(0.75, value))),
    project("synthesis", "1.0.0", (value, index) => value * (1 - index / Math.max(width, 1) * 0.15)),
    project("fallback", "1.0.0", (value) => value),
  ];
}

function logitsFor(execution: NativeSkillExecution): number[] {
  const risk = execution.risk.score;
  const domainSignal = execution.domain.length / 32;
  return [1 - risk + domainSignal, 1.25 - risk, 0.8 + domainSignal, 0.1];
}

export async function evolveIsabella(
  request: IsabellaEvolutionRequest,
  learning = new IsabellaLearningEngine(),
): Promise<IsabellaEvolutionResult> {
  if (!request.tenantId.trim() || !request.requestId.trim()) throw new Error("evolution_identity_required");
  if (!request.skillId.trim() || !request.task.trim()) throw new Error("evolution_task_required");

  const execution = executeNativeSkill({
    skillId: request.skillId,
    task: request.task,
    input: request.input ?? {},
    tenantId: request.tenantId,
    requestId: request.requestId,
  });
  const input = boundedVector(execution.features);
  const route = createMoERoute(buildExperts(input.length), {
    topK: 2,
    capacityFactor: 1,
    fallbackExpertId: "fallback",
  });
  const moe = await executeMoE(route, input, logitsFor(execution));

  let learningAccepted = false;
  if (request.learn) {
    const learningResult = learning.ingest({
      mode: "episodic",
      input: request.task,
      context: { skillId: request.skillId, tenantId: request.tenantId },
      outcome: execution.status === "SUCCESS" ? "success" : "partial",
      quality: Math.max(0, 1 - execution.risk.score),
      consent: request.consent === true,
      source: "isabella-evolution-runtime",
      skillIds: [request.skillId],
    });
    learningAccepted = learningResult.accepted;
  }

  const memories = learning.retrieve(request.task, 8);
  return {
    version: "evolution-1",
    execution,
    routedVector: moe.output,
    moeTrace: moe.trace,
    memories,
    learningAccepted,
    provenanceHash: hash({ request, executionHash: execution.provenanceHash, moe: moe.trace, memories: memories.map((item) => item.id) }),
  };
}

export function evolutionManifest() {
  return {
    id: "isabella-evolution-runtime",
    version: "evolution-1",
    layers: ["native-skill-fusion", "governed-moe", "auditable-learning", "provenance"],
    status: "IMPLEMENTED",
    claims: ["no autonomous weight mutation", "external effects require adapters", "learning requires explicit consent"],
  } as const;
}

export type { MoeTrace };
