import { z } from "zod";
import { capabilityRegistry, type CapabilityState } from "./capability-registry";

export const SkillId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export type SkillStatus = Extract<CapabilityState, "implemented" | "verified" | "experimental" | "unavailable">;

export interface IsabellaSkill {
  id: string;
  name: string;
  description: string;
  folder: string;
  subfolder: string;
  capability: string;
  status: SkillStatus;
  requiredScopes: readonly string[];
}

export const ISABELLA_SKILLS: readonly IsabellaSkill[] = [
  { id: "crown-routing", name: "CROWN Routing", description: "Clasifica intención y enruta la percepción entre los núcleos cognitivos.", folder: "Orquestación", subfolder: "CROWN", capability: "crown", status: "implemented", requiredScopes: ["isabella:chat"] },
  { id: "argus-policy", name: "ARGUS Policy Gate", description: "Evalúa riesgo, permisos, datos sensibles y escalamiento humano antes de actuar.", folder: "Gobernanza", subfolder: "ARGUS", capability: "crown", status: "verified", requiredScopes: ["isabella:chat"] },
  { id: "territorial-memory", name: "Memoria territorial", description: "Consulta memoria contextual con procedencia, alcance y trazabilidad territorial.", folder: "Memoria", subfolder: "Territorial", capability: "memory", status: "implemented", requiredScopes: ["isabella:chat"] },
  { id: "audit-bundle", name: "Audit Bundle", description: "Construye evidencia auditable de decisiones, correlación y resultado del pipeline.", folder: "Gobernanza", subfolder: "Auditoría", capability: "audit", status: "implemented", requiredScopes: ["isabella:chat"] },
  { id: "voice-synthesis", name: "Voz de Isabella", description: "Solicita síntesis vocal segura y la reproduce progresivamente en el navegador.", folder: "Interfaces", subfolder: "Voz", capability: "voice", status: "implemented", requiredScopes: ["isabella:voice"] },
  { id: "api-contracts", name: "APIs nativas", description: "Expone contratos registrados con validación de entrada y control de autoridad.", folder: "Orquestación", subfolder: "Contratos", capability: "build", status: "verified", requiredScopes: ["isabella:chat"] },
  { id: "monetization-ledger", name: "Ledger de monetización", description: "Registra consumo y movimientos económicos sin hacer saldos escribibles desde cliente.", folder: "Economía", subfolder: "BookPI", capability: "bookpi", status: "implemented", requiredScopes: ["isabella:chat"] },
  { id: "sovereign-tools", name: "Herramientas soberanas", description: "Registra herramientas autorizables para ejecución controlada; requiere handler operativo.", folder: "Ejecución", subfolder: "Herramientas", capability: "tools", status: "experimental", requiredScopes: ["isabella:tools"] },
];

export interface SkillInvocation { skill: IsabellaSkill; prompt: string; invocation: string; }

export function parseSkillInvocation(input: string): { requestedId: string; prompt: string; invocation: string } | null {
  const match = input.match(/^\s*@([a-z0-9]+(?:-[a-z0-9]+)*)(?:\s+|$)([\s\S]*)$/i);
  if (!match) return null;
  return { requestedId: match[1].toLowerCase(), prompt: match[2]?.trim() ?? "", invocation: match[0].trim() };
}

export function resolveSkillInvocation(input: string): SkillInvocation | { error: string; code: string } | null {
  const parsed = parseSkillInvocation(input);
  if (!parsed) return null;
  const skill = ISABELLA_SKILLS.find((item) => item.id === parsed.requestedId);
  if (!skill) return { error: `Skill no registrado: @${parsed.requestedId}`, code: "SKILL_NOT_FOUND" };
  if (!capabilityRegistry.isOperational(skill.capability) && skill.status !== "experimental") {
    return { error: `Skill no operativo: @${skill.id}`, code: "SKILL_UNAVAILABLE" };
  }
  return { skill, prompt: parsed.prompt, invocation: parsed.invocation };
}

export function skillGroups(): Array<{ folder: string; items: IsabellaSkill[] }> {
  const groups = new Map<string, IsabellaSkill[]>();
  for (const skill of ISABELLA_SKILLS) groups.set(skill.folder, [...(groups.get(skill.folder) ?? []), skill]);
  return [...groups.entries()].map(([folder, items]) => ({ folder, items }));
}
