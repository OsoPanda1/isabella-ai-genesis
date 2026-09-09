import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { runIsabellaSkill } from "@/lib/skills/run-skill";
import { listIsabellaSkills, type IsabellaSkillId } from "@/lib/skills/registry";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: SecuritySystem.injectSecureHeaders(
      new Headers({
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      }),
    ),
  });
}

export const Route = createFileRoute("/api/isabella-skills")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async () => json({ skills: listIsabellaSkills() })),

      POST: withSovereignAuth("system", "execute", async (context, request) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "INVALID_JSON" }, 400);
        }
        if (!body || typeof body !== "object") return json({ error: "VALIDATION_ERROR" }, 400);
        const payload = body as Record<string, unknown>;
        const skillId = typeof payload.skillId === "string" ? payload.skillId : "";
        const input = payload.input;
        const known = listIsabellaSkills().some((skill) => skill.id === skillId);
        if (!known) return json({ error: "SKILL_NOT_FOUND", skills: listIsabellaSkills() }, 404);
        if (!input || typeof input !== "object" || Array.isArray(input)) {
          return json({ error: "INPUT_OBJECT_REQUIRED" }, 400);
        }

        const result = await runIsabellaSkill(skillId as IsabellaSkillId, input, {
          requestId: context.correlationId,
          actorId: context.userId,
          tenantId: context.tenantId,
          role: context.role,
          authenticated: context.role !== "Guest",
          ipAddress: context.ip,
          intent: typeof payload.intent === "string" ? payload.intent : "API skill execution",
          locale: typeof payload.locale === "string" ? payload.locale : "es-MX",
        });
        const status = result.error ? (result.error.code === "CROWN_POLICY_DENY" ? 403 : 422) : 200;
        return json(result, status);
      }),
    },
  },
});
