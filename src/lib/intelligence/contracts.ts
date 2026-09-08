/** Model-agnostic intelligence contracts. Capability does not imply authority. */
export type Modality = "text" | "image" | "audio";
export type IntelligenceDecision = "ALLOW" | "DENY" | "REVIEW" | "MODIFY";

export interface EmbeddingRequest {
  modality: Modality;
  contentHash: string;
  content: string | Uint8Array;
  modelId: string;
  territoryId: string;
}

export interface EmbeddingResult {
  modelId: string;
  modality: Modality;
  dimensions: number;
  vectorHash: string;
  embedding: number[];
}

export interface PlanStep {
  id: string;
  action: string;
  requiresAuthorization: boolean;
  riskScore: number;
}

export interface ReasoningPlan {
  planId: string;
  objectiveHash: string;
  steps: PlanStep[];
  modelId: string;
  policyId: string;
}

export interface GovernanceDecision {
  decision: IntelligenceDecision;
  riskScore: number;
  policyIds: string[];
  reasons: string[];
  auditId: string;
}

export interface ReasoningRequest {
  objective: string;
  territoryId: string;
  contextHashes: string[];
  modelId: string;
  governance: GovernanceDecision;
}
