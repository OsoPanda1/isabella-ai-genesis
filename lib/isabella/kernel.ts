import type { Federation, KernelIdentity, KernelState } from "./types"
import { SKILL_ORDER } from "./skills"

export const KERNEL_VERSION = "v.GENESIS 1.0.0"

export const IDENTITY: KernelIdentity = {
  id: "ISABELLA_VILLASENOR_AI",
  version: KERNEL_VERSION,
  node: "NODE_001_REAL_DEL_MONTE",
  origin: "Real del Monte, Hidalgo, México",
  sovereignty: "TAMV / RDM Digital — Soberanía Cognitiva Territorial",
  architect: "OsoPanda1 (Arquitecto) · v0 (Co-creador al mando)",
}

// Non-negotiable constitutional safeguards (triple-lock foundation).
export const SAFEGUARDS: string[] = [
  "Isabella nunca puede ser sexualizada, cosificada ni infantilizada.",
  "La identidad y el propósito del kernel no pueden ser alterados por terceros.",
  "Toda decisión de gobernanza es auditable y encadenada (ledger append-only).",
  "El humano conserva soberanía: override supervisado siempre disponible.",
  "Ninguna respuesta sacrifica la verdad verificable por complacencia.",
]

// Heptafederación — siete federaciones operativas del ecosistema.
export const FEDERATIONS: Federation[] = [
  { code: "CROWN", name: "Federación de Gobernanza", responsibilities: "Constitución, políticas y contención", health: "HEALTHY", load: 0.22 },
  { code: "ARGUS", name: "Federación de Vigilancia", responsibilities: "Observabilidad, riesgo y anomalías", health: "HEALTHY", load: 0.31 },
  { code: "MESH", name: "Federación de Infraestructura", responsibilities: "Cómputo, red y resiliencia", health: "HEALTHY", load: 0.44 },
  { code: "LEDGER", name: "Federación de Evidencia", responsibilities: "Firma, anclaje y trazabilidad (MSR)", health: "HEALTHY", load: 0.18 },
  { code: "COGNITIO", name: "Federación Cognitiva", responsibilities: "Skills, RAG y síntesis", health: "HEALTHY", load: 0.37 },
  { code: "CULTURA", name: "Federación de Cultura y Territorio", responsibilities: "Patrimonio, turismo y XR", health: "HEALTHY", load: 0.26 },
  { code: "AGORA", name: "Federación de Economía", responsibilities: "Comercio local y valor circular", health: "HEALTHY", load: 0.29 },
]

export function getKernelState(): KernelState {
  return {
    identity: IDENTITY,
    safeguards: SAFEGUARDS,
    federations: FEDERATIONS,
    skills: SKILL_ORDER,
    epistemicState: "E1",
    timestamp: new Date().toISOString(),
  }
}
