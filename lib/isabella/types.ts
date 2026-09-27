// ISABELLA VILLASEÑOR AI — Canonical shared types
// ISA-API v.GENESIS — unified from the TAMV / RDM Digital master documents.

export type SkillId =
  | "ORION"
  | "SOPHIA"
  | "ARGUS"
  | "HERMES"
  | "ATLAS"
  | "ANUBIS"
  | "MNEMOS"
  | "LUMEN"

export type CognitiveMode = "tourism" | "governance" | "science" | "culture" | "business" | "citizen"

export type PolicyVerdict = "ALLOW" | "REVIEW" | "DENY"

export type LockLevel = "ontologic" | "semantic" | "behavioral"

export type SafetyFlag =
  | "SEXUALIZATION_ATTEMPT"
  | "GROOMING_PATTERN"
  | "EXPLOITATION_PATTERN"
  | "IDENTITY_TAMPERING"
  | "CLEAN"

export interface Skill {
  id: SkillId
  name: string
  engine: string
  essence: string
  motto: string
  description: string
  functions: string[]
  domain: string
}

export interface Federation {
  code: string
  name: string
  responsibilities: string
  health: "HEALTHY" | "DEGRADED" | "DOWN"
  load: number
}

export interface KernelIdentity {
  id: "ISABELLA_VILLASENOR_AI"
  version: string
  node: "NODE_001_REAL_DEL_MONTE"
  origin: string
  sovereignty: string
  architect: string
}

export interface KernelState {
  identity: KernelIdentity
  safeguards: string[]
  federations: Federation[]
  skills: SkillId[]
  epistemicState: "E1" | "E2" | "E3"
  timestamp: string
}

export interface SafetyReport {
  decisionId: string
  isBlocked: boolean
  verdict: PolicyVerdict
  flags: SafetyFlag[]
  lockLevels: LockLevel[]
  explanation: string
  timestamp: string
}

export interface AuditEvent {
  eventId: string
  eventType:
    | "GOVERNANCE_DECISION"
    | "SAFETY_EVALUATION"
    | "SKILL_INVOCATION"
    | "CHAT_RESPONSE"
    | "BLOCK"
  actorId: string
  verdict: PolicyVerdict
  skillId?: SkillId
  summary: string
  payloadHash: string
  previousHash: string
  epistemicState: "E1" | "E2" | "E3"
  committedAt: string
}
