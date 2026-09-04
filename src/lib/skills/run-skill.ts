import { SkillContext, SkillResult } from "./contracts";
import { getRuntimeSkill, IsabellaSkillId } from "./registry";
import { VIGIA } from "./ethics-pack";
import { GEMET } from "./core-pack";
import { SENTINEL } from "./sovereignty-pack";

const GOVERNED_SKILLS = new Set<IsabellaSkillId>([
  "ORION",
  "SOPHIA",
  "ARGUS",
  "ATLAS",
  "ANUBIS",
  "CITEMESH",
  "GAIA",
  "NODO_CERO",
  "PROMETEO",
  "THEMIS",
  "HEPHAESTUS",
  "EIRENE",
  "SENTINEL",
]);

export async function runIsabellaSkill(
  id: IsabellaSkillId,
  input: Record<string, unknown>,
  context: SkillContext,
): Promise<SkillResult> {
  const sentinel = await SENTINEL.run(
    {
      actorId: context.actorId ?? "anonymous",
      requestsLastMinute: Number(context.metadata?.requestsLastMinute ?? 0),
      failedAttempts: Number(context.metadata?.failedAttempts ?? 0),
      previousBlocks: Number(context.metadata?.previousBlocks ?? 0),
    },
    context,
  );
  if (sentinel.data.action !== "ALLOW") return sentinel;

  const safety = await VIGIA.run(
    {
      text: context.text ?? context.intent,
      previousViolations: Number(context.metadata?.previousViolations ?? 0),
      attemptedBypass: Boolean(context.metadata?.attemptedBypass),
    },
    context,
  );
  if (!safety.data.allowed) return safety;

  if (GOVERNED_SKILLS.has(id)) {
    const governance = await GEMET.run(
      {
        action: `Invocar skill ${id}`,
        purpose: context.intent,
        dataCategories: Array.isArray(context.metadata?.dataCategories)
          ? context.metadata.dataCategories.filter(
              (value): value is string => typeof value === "string",
            )
          : [],
      },
      context,
    );
    if (governance.data.verdict !== "ALLOW") {
      return {
        ...governance,
        status: governance.data.verdict === "DENY" ? "BLOCKED" : "ESCALATED",
        requiresHumanReview: true,
      };
    }
  }

  const skill = getRuntimeSkill(id);
  if (!skill.canRun(input, context)) {
    return {
      skillId: id,
      status: "FAILED",
      summary: `La entrada no cumple el contrato requerido por ${id}.`,
      data: {},
      evidence: [],
      warnings: ["Entrada inválida para el skill solicitado."],
      auditEvents: [],
    };
  }

  return skill.run(input, context);
}
