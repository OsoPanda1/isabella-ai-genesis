import { randomUUID } from "node:crypto";
import { config } from "@/lib/config";
import { isProductionLike, resolveRuntimeMode } from "@/lib/runtime-mode";
import type { GovernanceDecision, IntelligenceProvider, IntelligenceRequest, IntelligenceResponse } from "./contracts";
import { getModel, registerProvider } from "./model-registry";

const providers = new Map<string, IntelligenceProvider>();

export function addProvider(provider: IntelligenceProvider, productionApproved = false): void {
  providers.set(provider.modelId, provider);
  registerProvider(provider);
  if (productionApproved) {
    const model = getModel(provider.modelId);
    if (model) {
      // Registry remains immutable-by-copy; approval is intentionally explicit.
      const { approveModel } = requireModelRegistry();
      approveModel(model.modelId);
    }
  }
}

function requireModelRegistry() {
  // Kept isolated so the router has one governance seam and no circular imports.
  return require("./model-registry") as typeof import("./model-registry");
}

export function governIntelligence(request: IntelligenceRequest): GovernanceDecision {
  if (!request.tenantId || !request.actorId) return { decision: "DENY", reasons: ["tenant-and-actor-required"], risk: "CRITICAL" };
  if (request.messages.length === 0 || request.messages.length > 40) return { decision: "DENY", reasons: ["invalid-message-count"], risk: "HIGH" };
  const temperature = request.temperature ?? 0.7;
  if (temperature < 0 || temperature > 2) return { decision: "DENY", reasons: ["temperature-out-of-range"], risk: "MEDIUM" };
  return { decision: "ALLOW", reasons: [], risk: "LOW" };
}

export async function invokeIntelligence(input: Omit<IntelligenceRequest, "requestId"> & { requestId?: string }): Promise<IntelligenceResponse> {
  const request: IntelligenceRequest = { ...input, requestId: input.requestId ?? randomUUID() };
  const governance = governIntelligence(request);
  if (governance.decision !== "ALLOW") throw new Error(`intelligence_${governance.decision.toLowerCase()}`);

  const preferred = request.preferredModel;
  const candidates = preferred ? [preferred] : [...providers.keys()];
  const production = isProductionLike(resolveRuntimeMode(config().ISABELLA_RUNTIME_MODE));
  let lastError: unknown;
  for (const modelId of candidates) {
    const provider = providers.get(modelId);
    const descriptor = getModel(modelId);
    if (!provider || !descriptor || !descriptor.enabled) continue;
    if (production && !descriptor.productionApproved) continue;
    try {
      if (!(await provider.health())) continue;
      return await provider.invoke(request);
    } catch (error) {
      lastError = error;
    }
  }
  if (production) throw new Error("inference_unavailable: no production-approved healthy model");
  if (lastError) throw lastError;
  throw new Error("inference_unavailable: no registered model");
}
