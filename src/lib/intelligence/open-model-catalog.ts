export interface OpenModelCandidate {
  modelId: string;
  family: string;
  license: "Apache-2.0";
  local: boolean;
  freeLocalInference: boolean;
  productionApproved: false;
  rationale: string;
}

/**
 * Curated candidates whose published weights/licenses were checked during the
 * 2026-09-09 hardening pass. This is a candidate catalog, not a safety
 * certification. Production approval remains a separate evidence-backed gate.
 */
export const OPEN_MODEL_CATALOG: readonly OpenModelCandidate[] = [
  {
    modelId: "Qwen/Qwen3-4B",
    family: "Qwen3",
    license: "Apache-2.0",
    local: true,
    freeLocalInference: true,
    productionApproved: false,
    rationale: "Small local evaluation target; Apache-2.0 published weights.",
  },
  {
    modelId: "Qwen/Qwen3-8B",
    family: "Qwen3",
    license: "Apache-2.0",
    local: true,
    freeLocalInference: true,
    productionApproved: false,
    rationale: "Balanced local evaluation target; Apache-2.0 published weights.",
  },
  {
    modelId: "Qwen/Qwen3-30B-A3B",
    family: "Qwen3",
    license: "Apache-2.0",
    local: true,
    freeLocalInference: true,
    productionApproved: false,
    rationale: "MoE reasoning/capability evaluation target; Apache-2.0 published weights.",
  },
  {
    modelId: "openai/gpt-oss-20b",
    family: "gpt-oss",
    license: "Apache-2.0",
    local: true,
    freeLocalInference: true,
    productionApproved: false,
    rationale: "Local/open-weight reasoning and agent evaluation target; Apache-2.0 published weights.",
  },
  {
    modelId: "mistral-small-2603",
    family: "Mistral Small 4",
    license: "Apache-2.0",
    local: true,
    freeLocalInference: true,
    productionApproved: false,
    rationale: "Multimodal/coding/reasoning evaluation target; Apache-2.0 weights.",
  },
  {
    modelId: "ministral-8b-2512",
    family: "Ministral 3",
    license: "Apache-2.0",
    local: true,
    freeLocalInference: true,
    productionApproved: false,
    rationale: "Efficient edge/local evaluation target; Apache-2.0 weights.",
  },
];

export function isCataloguedOpenModel(modelId: string): boolean {
  return OPEN_MODEL_CATALOG.some((candidate) => candidate.modelId === modelId);
}
