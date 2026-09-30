import type { PipelineInput, PipelineResult } from "../sovereign-pipeline";
import type { IsabellaSkill } from "../skill-registry";

export type IsabellaModule = "crown" | "isa" | "sophia" | "orion" | "argus";

export type MemoryScope = "turn" | "session" | "project" | "territorial";

export interface IsabellaCoreRequest extends PipelineInput {
  module?: IsabellaModule;
  memoryScope?: MemoryScope;
}

export interface IsabellaCoreResponse extends PipelineResult {
  module: IsabellaModule;
  evidenceLevel: "E0" | "E1" | "E2" | "E3" | "E4";
}

export interface SkillContract extends IsabellaSkill {
  module: IsabellaModule;
  risk: "low" | "medium" | "high" | "critical";
  requiresHumanApproval: boolean;
}

export const CORE_MODULES: readonly IsabellaModule[] = ["crown", "isa", "sophia", "orion", "argus"];

export function resolveCoreModule(skill: Pick<IsabellaSkill, "capability">): IsabellaModule {
  switch (skill.capability) {
    case "memory":
    case "crown":
      return "crown";
    case "voice":
      return "isa";
    case "build":
    case "audit":
      return "sophia";
    case "tools":
    case "monetization":
      return "orion";
    case "bookpi":
      return "argus";
    default:
      return "crown";
  }
}
