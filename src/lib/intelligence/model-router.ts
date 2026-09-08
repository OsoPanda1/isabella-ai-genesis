import type { ModelIdentity } from "./model-registry";

export interface ModelRequirement {
  task: string;
  territoryId?: string;
  allowedProviders?: string[];
  requireApproved?: boolean;
}

export class ModelRouter {
  constructor(private readonly registry: { list(): ModelIdentity[] }) {}

  select(requirement: ModelRequirement): ModelIdentity {
    const candidates = this.registry.list().filter(model =>
      model.task === requirement.task &&
      (!requirement.allowedProviders || requirement.allowedProviders.includes(model.provider)) &&
      (!requirement.requireApproved || model.status === "APPROVED" || model.status === "DEPLOYED")
    );
    if (candidates.length === 0) throw new Error("No existe un modelo autorizado para la capacidad solicitada");
    return candidates[0];
  }
}
