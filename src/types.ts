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

export interface TerminalMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  moduleId?: CognitiveModuleId;
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
