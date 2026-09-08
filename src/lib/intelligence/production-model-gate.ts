import { isProductionLike, resolveRuntimeMode } from "@/lib/runtime-mode";
import { config } from "@/lib/config";
import { assertProductionModel, getDurableModel, upsertDurableModel } from "./durable-model-registry";
import type { IntelligenceProvider } from "./contracts";

/** Runtime authority for model selection. Registration in process memory is never production approval. */
export async function ensureModelRecord(tenantId: string, provider: IntelligenceProvider): Promise<void> {
  const existing = await getDurableModel(tenantId, provider.modelId, provider.modelId);
  if (existing) return;
  await upsertDurableModel({
    tenantId,
    modelId: provider.modelId,
    version: provider.modelId,
    providerId: provider.providerId,
    territoryId: "global",
    modalities: [...provider.capabilities],
    capabilities: [...provider.capabilities],
    enabled: true,
    productionApproved: false,
    status: "PROPOSED",
    artifactHash: `provider:${provider.providerId}:${provider.modelId}`,
    license: "provider-managed",
  });
}

export async function assertModelRuntimeAuthority(tenantId: string, provider: IntelligenceProvider): Promise<void> {
  const production = isProductionLike(resolveRuntimeMode(config().ISABELLA_RUNTIME_MODE));
  if (!production) return;
  const model = await getDurableModel(tenantId, provider.modelId, provider.modelId);
  if (!model) throw new Error("inference_unavailable: model-not-registered");
  await assertProductionModel(tenantId, provider.modelId, provider.modelId);
}
