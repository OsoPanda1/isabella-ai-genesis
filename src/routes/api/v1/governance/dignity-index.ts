import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { config } from "@/lib/config";
import { computeIDHD, idhdAppealRoute } from "@/lib/governance/idh-d";

export const Route = createFileRoute("/api/v1/governance/dignity-index")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async (ctx, req) => {
        const url = new URL(req.url);
        const autonomy = parseFloat(url.searchParams.get("autonomy") ?? "0.7");
        const privacy = parseFloat(url.searchParams.get("privacy") ?? "0.7");
        const value = parseFloat(url.searchParams.get("value") ?? "0.6");
        const cohesion = parseFloat(url.searchParams.get("cohesion") ?? "0.7");
        const delta = parseFloat(url.searchParams.get("delta") ?? "0.1");
        const appeal = url.searchParams.get("appeal")==="true";
        const result = computeIDHD({ autonomy, privacy, valueRetention:value, cohesion, delta });
        const headers = SecuritySystem.injectSecureHeaders(new Headers({ "content-type":"application/json; charset=utf-8"}));
        return new Response(JSON.stringify({
          schemaVersion:"v1", requestId: ctx.correlationId, traceId: ctx.traceId,
          tenantId: ctx.tenantId, timestamp: result.computedAt,
          policyVersion: result.policyVersion, implementation:"idh-d-v3", evidenceStatus: result.evidenceStatus,
          data: { ...result, appeal: appeal ? idhdAppealRoute(ctx.tenantId, result.score) : undefined, policy: config().CROWN_CONSTITUTION_VERSION, note:"IDH-D es indicador de gobernanza, no bloqueo automático sin revisión y apelación (Cap. IX)" },
          error: null,
        }), { status:200, headers });
      }),
      POST: withSovereignAuth("system", "execute", async (ctx, req) => {
        const body = await req.json().catch(()=> ({})) as Record<string,number>;
        const result = computeIDHD(body as any);
        const headers = SecuritySystem.injectSecureHeaders(new Headers({ "content-type":"application/json; charset=utf-8"}));
        return new Response(JSON.stringify({
          schemaVersion:"v1", requestId: ctx.correlationId, traceId: ctx.traceId,
          tenantId: ctx.tenantId, timestamp: result.computedAt,
          policyVersion: result.policyVersion, implementation:"idh-d-v3", evidenceStatus: result.evidenceStatus,
          data: result, error: null,
        }), { status:200, headers });
      }),
    },
  },
});
