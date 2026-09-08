/** FGAIS Intelligence Plane contracts. Capability does not imply authority. */
export type Modality = "text" | "image" | "audio";
export type IntelligenceRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface IntelligenceMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface IntelligenceRequest {
  requestId: string;
  tenantId: string;
  actorId: string;
  messages: IntelligenceMessage[];
  modality?: Modality;
  temperature?: number;
  maxTokens?: number;
  preferredModel?: string;
}

export interface IntelligenceResponse {
  requestId: string;
  modelId: string;
  providerId: string;
  text: string;
  latencyMs: number;
  degraded: boolean;
  risk: IntelligenceRisk;
  usage?: { inputTokens?: number; outputTokens?: number };
}

export interface GovernanceDecision {
  decision: "ALLOW" | "DENY" | "REVIEW";
  reasons: string[];
  risk: IntelligenceRisk;
}

export interface IntelligenceProvider {
  readonly providerId: string;
  readonly modelId: string;
  readonly capabilities: ReadonlySet<Modality>;
  health(): Promise<boolean>;
  invoke(request: IntelligenceRequest): Promise<IntelligenceResponse>;
}
