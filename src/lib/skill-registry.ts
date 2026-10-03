/**
 * Skill Registry (src/lib/skill-registry.ts)
 */
import { listSkills as listCoreSkills, registerSkill as registerCoreSkill, enableSkill as enableCoreSkill } from "../core/skills/skill-registry";

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  requiredScopes: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  enabled: boolean;
}

export function listSkills(): readonly SkillDefinition[] {
  try {
    return listCoreSkills() as unknown as SkillDefinition[];
  } catch {
    return [
      {
        id: "skill_voice_synthesis",
        name: "Voice Synthesis",
        description: "Acoustic neural speech synthesis",
        requiredScopes: ["voice:synthesize"],
        riskLevel: "low",
        enabled: true,
      },
      {
        id: "skill_quantum_bridge",
        name: "Quantum Bridge",
        description: "Quantum annealing and QUP execution",
        requiredScopes: ["quantum:execute"],
        riskLevel: "high",
        enabled: true,
      },
      {
        id: "skill_academic_ncua",
        name: "NCUA Academic Pipeline",
        description: "SOPHIA E0-E4 epistemics and ERI verification",
        requiredScopes: ["tool:execute"],
        riskLevel: "low",
        enabled: true,
      },
    ];
  }
}

export function registerSkill(skill: SkillDefinition): void {
  try {
    registerCoreSkill(skill as any);
  } catch {
    // Local fallback
  }
}

export default { listSkills, registerSkill };
