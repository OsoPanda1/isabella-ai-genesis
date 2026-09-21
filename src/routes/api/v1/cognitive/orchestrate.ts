import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { config } from "@/lib/config";
import { dualKernel } from "@/core/dual-kernel";
import { createRequestId } from "@/core/contracts";

export const Route = createFileRoute("/api/v1/cognitive/orchestrate")({
  server: {
    handlers: {
      POST: withSovereignAuth("system", "execute", async (ctx, req) => {
        const body = (await req.json().catch(() => ({}))) as {
          intent?: string;
          mode?: string;
          context?: Record<string, unknown>;
        };
        const intent = (body.intent ?? "").toString().slice(0, 2000);
        if (!intent)
          return new Response(JSON.stringify({ error: "intent requerido" }), { status: 400 });
        const sanitized = SecuritySystem.sanitizePayload(intent);
        if (sanitized.flagged)
          return new Response(JSON.stringify({ error: "policy rejected" }), { status: 403 });
        const result = await dualKernel.process({
          requestId: createRequestId(),
          tenantId: ctx.tenantId,
          actorId: ctx.userId,
          federationId: 5,
          intent,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mode: (body.mode as any) ?? "chat",
          context: { ...body.context, memoryEnabled: true },
          constraints: { maxLatencyMs: 8000 },
        });
        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json; charset=utf-8" }),
        );
        return new Response(
          JSON.stringify({
            schemaVersion: "v1",
            requestId: result.requestId,
            traceId: result.telemetry.traceId,
            tenantId: ctx.tenantId,
            timestamp: result.createdAt,
            policyVersion: config().CROWN_CONSTITUTION_VERSION,
            implementation: "cognitive-core-v3",
            evidenceStatus:
              result.evidence.length >= 2 ? "E0" : result.evidence.length ? "E1" : "E2",
            data: {
              answer: result.answer,
              proposal: result.proposal,
              evidence: result.evidence,
              provenance: result.provenance,
              telemetry: result.telemetry,
              state: result.state,
              governance: result.governance,
            },
            error: null,
          }),
          { status: result.status === "review_required" ? 202 : 200, headers },
        );
      }),
    },
  },
});
