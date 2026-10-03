/**
 * Skill Chat Bridge (src/lib/skills/chat-bridge.ts)
 */
import { skillRegistry } from "./registry";

export interface SkillMatch {
  matched: boolean;
  skillId?: string;
  parameters?: Record<string, unknown>;
}

export function detectSkillFromPrompt(prompt: string): SkillMatch {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("voz") || normalized.includes("sintetiz") || normalized.includes("audio")) {
    return { matched: true, skillId: "skill_voice_synthesis", parameters: { text: prompt } };
  }
  if (normalized.includes("quantum") || normalized.includes("cuantico")) {
    return { matched: true, skillId: "skill_quantum_bridge", parameters: { operation: "state_vector" } };
  }
  if (normalized.includes("ncua") || normalized.includes("epistemic") || normalized.includes("eri")) {
    return { matched: true, skillId: "skill_academic_ncua", parameters: { text: prompt } };
  }
  return { matched: false };
}

export default { detectSkillFromPrompt };
