import { z } from "zod";
import { assertBoundedJsonValue } from "@/lib/request-limits";
import type { IsabellaSkillId } from "./registry";

const BOUNDED_SKILL_INPUT = z
  .record(z.string().min(1).max(128), z.unknown())
  .superRefine((value, ctx) => {
    try {
      assertBoundedJsonValue(value, { maxDepth: 6, maxObjectKeys: 64, maxArrayItems: 64 });
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error instanceof Error ? error.message : "SKILL_INPUT_TOO_LARGE",
      });
    }
  });

export const skillInputSchemas: Record<IsabellaSkillId, typeof BOUNDED_SKILL_INPUT> = {
  ORION: BOUNDED_SKILL_INPUT,
  SOPHIA: BOUNDED_SKILL_INPUT,
  ARGUS: BOUNDED_SKILL_INPUT,
  HERMES: BOUNDED_SKILL_INPUT,
  ATLAS: BOUNDED_SKILL_INPUT,
  ANUBIS: BOUNDED_SKILL_INPUT,
  GEMET: BOUNDED_SKILL_INPUT,
  AURORA: BOUNDED_SKILL_INPUT,
  CITEMESH: BOUNDED_SKILL_INPUT,
  MNEMOSYNE: BOUNDED_SKILL_INPUT,
  HELIOS: BOUNDED_SKILL_INPUT,
  GAIA: BOUNDED_SKILL_INPUT,
  NODO_CERO: BOUNDED_SKILL_INPUT,
  CHRONOS: BOUNDED_SKILL_INPUT,
  VIGIA: BOUNDED_SKILL_INPUT,
  LYRA: BOUNDED_SKILL_INPUT,
  PROMETEO: BOUNDED_SKILL_INPUT,
  THEMIS: BOUNDED_SKILL_INPUT,
  PHAROS: BOUNDED_SKILL_INPUT,
  KAIROS: BOUNDED_SKILL_INPUT,
  HEPHAESTUS: BOUNDED_SKILL_INPUT,
  EIRENE: BOUNDED_SKILL_INPUT,
  SENTINEL: BOUNDED_SKILL_INPUT,
  UTAMV: BOUNDED_SKILL_INPUT,
  HEPTA: BOUNDED_SKILL_INPUT,
};

export function parseSkillInput(skillId: IsabellaSkillId, value: unknown) {
  return skillInputSchemas[skillId].safeParse(value);
}
