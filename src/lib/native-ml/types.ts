/**
 * Native ML Types (src/lib/native-ml/types.ts)
 */
export interface ClassifierResult {
  intent: string;
  confidence: number;
  tokens: string[];
  subIntents: string[];
}

export interface ExpertRoute {
  expertId: string;
  name: string;
  weight: number;
  domain: string;
}

export interface MoeRoutingDecision {
  selectedExperts: ExpertRoute[];
  routingConfidence: number;
  routingLatencyMs: number;
}
