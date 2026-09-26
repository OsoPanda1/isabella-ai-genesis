import { createFileRoute } from "@tanstack/react-router";
import { randomUUID } from "node:crypto";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { listIsabellaSkills, getRuntimeSkill, type IsabellaSkillId } from "@/lib/skills/registry";
import { parseSkillInput } from "@/lib/skills/input-schemas";
import { z } from "zod";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: SecuritySystem.injectSecureHeaders(
      new Headers({
        "content-type": "application/json; charset=utf-8",
      }),
    ),
  });
}

const executeSkillSchema = z.object({
  skillId: z.string().min(1).max(64),
  input: z.record(z.string(), z.unknown()).default({}),
  intent: z.string().max(256).optional(),
});

export const Route = createFileRoute("/api/v1/skills")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async (_context, request) => {
        const url = new URL(request.url);
        const federation = url.searchParams.get("federation");
        const allSkills = listIsabellaSkills();

        const filtered = federation
          ? allSkills.filter((s) => s.federation.toLowerCase() === federation.toLowerCase())
          : allSkills;

        return json({
          success: true,
          count: filtered.length,
          skills: filtered,
        });
      }),

      POST: withSovereignAuth("system", "execute", async (context, request) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "Cuerpo JSON inválido." }, 400);
        }

        const parsed = executeSkillSchema.safeParse(body);
        if (!parsed.success) {
          return json(
            { error: "Datos de ejecución no válidos.", details: parsed.error.issues },
            400,
          );
        }

        const { skillId, input, intent } = parsed.data;

        let skill: ReturnType<typeof getRuntimeSkill> | undefined;
        try {
          skill = getRuntimeSkill(skillId as IsabellaSkillId);
        } catch {
          return json(
            { error: `La habilidad '${skillId}' no está registrada en el ecosistema.` },
            404,
          );
        }

        if (!skill) {
          return json({ error: `La habilidad '${skillId}' no fue encontrada.` }, 404);
        }

        // Schema validation
        const inputCheck = parseSkillInput(skillId as IsabellaSkillId, input);
        if (!inputCheck.success) {
          return json(
            {
              error: "Esquema de entrada de habilidad no válido.",
              details: inputCheck.error.issues,
            },
            400,
          );
        }

        const skillContext = {
          requestId: context.traceId,
          actorId: context.userId,
          locale: "es-MX",
          federation: skill.federation,
          intent: intent ?? `EXECUTE_SKILL_${skill.id}`,
        };

        if (typeof skill.canRun === "function" && !skill.canRun(input, skillContext)) {
          return json(
            {
              error: `La habilidad '${skillId}' rechazó la ejecución debido a precondiciones no cumplidas.`,
            },
            422,
          );
        }

        try {
          const result = await skill.run(input, skillContext);
          return json({
            success: result.status === "SUCCESS" || result.status === "PARTIAL",
            traceId: context.traceId,
            result,
          });
        } catch (error) {
          const internalId = randomUUID().slice(0, 12);
          console.error(
            `[skills:${skill.name}:${internalId}]`,
            error instanceof Error ? error.message : String(error),
          );
          return json(
            {
              success: false,
              traceId: context.traceId,
              error: "skill_execution_failed",
              internalId,
            },
            500,
          );
        }
      }),
    },
  },
});
