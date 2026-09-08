import type { IntelligenceProvider, Modality } from "./contracts";

export interface ModelDescriptor {
  modelId: string;
  providerId: string;
  modalities: Modality[];
  enabled: boolean;
  productionApproved: boolean;
  maxContextTokens?: number;
  dataResidency?: string;
  capabilities: string[];
}

const registry = new Map<string, ModelDescriptor>();

export function registerModel(model: ModelDescriptor): void {
  if (!/^[a-zA-Z0-9._:/-]{2,160}$/.test(model.modelId)) throw new Error("Invalid modelId");
  registry.set(model.modelId, Object.freeze({ ...model, modalities: [...model.modalities], capabilities: [...model.capabilities] }));
}

export function getModel(modelId: string): ModelDescriptor | undefined { return registry.get(modelId); }
export function listModels(): ModelDescriptor[] { return [...registry.values()].map((m) => ({ ...m, modalities: [...m.modalities], capabilities: [...m.capabilities] })); }

export function registerProvider(provider: IntelligenceProvider): void {
  registerModel({
    modelId: provider.modelId,
    providerId: provider.providerId,
    modalities: [...provider.capabilities],
    enabled: true,
    productionApproved: false,
    capabilities: [...provider.capabilities],
  });
}

export function approveModel(modelId: string): void {
  const model = registry.get(modelId);
  if (!model) throw new Error(`Unknown model: ${modelId}`);
  registry.set(modelId, { ...model, productionApproved: true });
}

export function disableModel(modelId: string): void {
  const model = registry.get(modelId);
  if (!model) return;
  registry.set(modelId, { ...model, enabled: false });
}
