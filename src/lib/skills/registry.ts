/**
 * Skills Registry (src/lib/skills/registry.ts)
 */
import { listSkills, registerSkill } from "../skill-registry";

export const skillRegistry = {
  list: listSkills,
  register: registerSkill,
  get: (id: string) => listSkills().find((s) => s.id === id) || null,
};

export default skillRegistry;
