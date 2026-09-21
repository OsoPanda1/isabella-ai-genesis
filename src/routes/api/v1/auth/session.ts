import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { config } from "@/lib/config";

export const Route = createFileRoute("/api/v1/auth/session")({
  server: {
    handlers: {
      POST: withSovereignAuth("system", "execute", async (ctx, req) => {
        const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json; charset=utf-8" }),
        );
        // IDH-D style: never trust tenantId from client, derive server-side
        return new Response(
          JSON.stringify({
            schemaVersion: "v1",
            requestId: ctx.correlationId,
            traceId: ctx.traceId,
            tenantId: ctx.tenantId,
            timestamp: new Date().toISOString(),
            policyVersion: config().CROWN_CONSTITUTION_VERSION,
            implementation: "session-v1",
            evidenceStatus: "E0",
            data: {
              sessionId: `sess_${ctx.traceId.slice(0, 8)}`,
              actorId: ctx.userId,
              tenantId: ctx.tenantId,
              role: ctx.role,
              scope: ctx.scope,
              expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
              bodyEcho: body,
            },
            error: null,
          }),
          { status: 200, headers },
        );
      }),
      GET: withSovereignAuth("system", "read", async (ctx) => {
        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json; charset=utf-8" }),
        );
        return new Response(
          JSON.stringify({
            schemaVersion: "v1",
            requestId: ctx.correlationId,
            traceId: ctx.traceId,
            tenantId: ctx.tenantId,
            timestamp: new Date().toISOString(),
            policyVersion: config().CROWN_CONSTITUTION_VERSION,
            implementation: "session-v1",
            evidenceStatus: "E0",
            data: {
              actorId: ctx.userId,
              tenantId: ctx.tenantId,
              role: ctx.role,
              authenticated: true,
            },
            error: null,
          }),
          { status: 200, headers },
        );
      }),
    },
  },
});
