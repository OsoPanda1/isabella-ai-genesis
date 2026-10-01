export type CognitiveModuleId =
  | "CROWN_GATEWAY"
  | "ISA_CORE"
  | "SOPHIA_DIALECTIC"
  | "ORION_ACTION"
  | "ARGUS_SENTINEL";

export interface CognitiveModule {
  id: CognitiveModuleId;
  name: string;
  acronym: string;
  fullName: string;
  role: string;
  description: string;
}

export type PresetProfileId =
  | "prime"
  | "empathic"
  | "strategic"
  | "sentinel"
  | "executor"
  | "synergistic";

export interface PresetProfile {
  id: PresetProfileId;
  name: string;
  tagline: string;
  description: string;
  weights: {
    isa: number;
    sophia: number;
    orion: number;
    argus: number;
    crown: number;
  };
}

export type InferenceMode = "DIRECT" | "GROUNDED" | "TOOL" | "SOVEREIGN";
export type IsabellaArchetype = "prime" | "sentinel" | "muse" | "sovereign";
export type SecurityGovernanceLevel = "R0" | "R1" | "R2" | "R3";

export interface RoutingDecision {
  route: string;
  confidence: number;
  epistemicLevel: string;
  reason?: string;
}

export interface InferenceTransitionEvent {
  fromMode: InferenceMode;
  toMode: InferenceMode;
  timestamp: string;
}

export type MessageFeedbackRating = "up" | "down";

export interface QualitativeModelFeedback {
  rating: MessageFeedbackRating;
  category?: string;
  notes?: string;
  timestamp: string;
}

export interface TerminalMessage {
  id: string;
  role: "user" | "assistant" | "system" | "argus_alert" | "isabella";
  content: string;
  timestamp: string;
  moduleId?: CognitiveModuleId;
  routingDecision?: {
    primaryModule?: CognitiveModuleId;
    routingRationale?: string;
    moduleWeights?: {
      isa: number;
      sophia: number;
      orion: number;
      argus: number;
      crown: number;
    };
    [key: string]: unknown;
  };
  isabellaState?: {
    mood?: string;
    feminineEleganceIndex?: number;
    emotionalArchetype?: string;
    cognitiveLoad?: number;
    presenceIndex?: number;
    presentationQuality?: number;
    [key: string]: unknown;
  };
  latencyMs?: number;
  engine?: string;
  generatedImage?: {
    url: string;
    prompt: string;
    style?: string;
    timestamp?: string;
  };
  sponsoredContent?: {
    type?: string;
    adId?: string;
    publisherId?: string;
    requestId?: string;
    advertiserName?: string;
    title?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
  cognitiveTelemetry?: {
    argusSafety?: {
      status?: string;
      guardrailCheck?: string;
      integrityScore?: number;
    };
    isaResonance?: {
      emotionalTone?: string;
      coreFocus?: string;
      empathyValence?: number;
    };
    sophiaReasoning?: {
      logicDepth?: number;
      heuristicInsight?: string;
      epistemicCertainty?: number;
    };
    orionExecution?: {
      actionType?: string;
      resourceUtilization?: string;
      executionSteps?: string[];
    };
  };
  feedback?: MessageFeedbackRating | null;
  feedbackTimestamp?: string;
  feedbackCategory?: string;
  feedbackNotes?: string;
  meta?: Record<string, unknown>;
}

export interface GeneratedImageItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
}

export interface VoiceSettings {
  enabled: boolean;
  volume: number;
  pitch: number;
  rate: number;
  voiceName?: string;
}

export interface CrownSystemState {
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  activePreset: PresetProfileId;
  activeModuleId: CognitiveModuleId | null;
  governanceLevel: SecurityGovernanceLevel;
  quantumMeshStatus: "SYNCED" | "STANDBY" | "ERROR";
}

export interface IsabellaState {
  archetype: IsabellaArchetype;
  resonance: number;
  activeContext: string;
}
