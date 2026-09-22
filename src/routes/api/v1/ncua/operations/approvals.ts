import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { config } from "@/lib/config";
import { NcuaProtocolEngine, SubmitNcuaApprovalSchema } from "@/lib/ncua/ncua-protocol";

export const Route = createFileRoute("/api/v1/ncua/operations/approvals")({
  server: {
    handlers: {
      POST: withSovereignAuth("system", "execute", async (ctx, req) => {
        const rawBody = (await req.json().catch(() => ({}))) as unknown;
        const parseResult = SubmitNcuaApprovalSchema.safeParse(rawBody);

        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json; charset=utf-8" }),
        );

        if (!parseResult.success) {
          return new Response(
            JSON.stringify({
              schemaVersion: "v1",
              requestId: ctx.correlationId,
              traceId: ctx.traceId,
              tenantId: ctx.tenantId,
              timestamp: new Date().toISOString(),
              error: {
                code: "INVALID_APPROVAL_REQUEST",
                message: "Parámetros de aprobación NCUA inválidos.",
                details: parseResult.error.flatten(),
              },
            }),
            { status: 400, headers },
          );
        }

        const data = parseResult.data;

        try {
          const { operation, evidence } = NcuaProtocolEngine.submitApproval({
            operationId: data.operationId,
            tenantId: ctx.tenantId,
            node: data.node,
            decision: data.decision,
            reason: data.reason,
            customSignature: data.signature,
          });

          return new Response(
            JSON.stringify({
              schemaVersion: "v1",
              requestId: ctx.correlationId,
              traceId: ctx.traceId,
              tenantId: ctx.tenantId,
              timestamp: new Date().toISOString(),
              policyVersion: config().CROWN_CONSTITUTION_VERSION,
              implementation: "ncua-2de3-v3",
              evidenceStatus: evidence?.evidenceStatus ?? "E1",
              data: {
                operationId: operation.id,
                status: operation.status,
                quorum: operation.quorum,
                approvalsCount: operation.approvals.length,
                requiredApprovals: operation.requiredApprovals,
                approvals: operation.approvals.map((a) => ({
                  nodeId: a.nodeId,
                  shortId: a.shortId,
                  decision: a.decision,
                  timestamp: a.timestamp,
                  signatureFingerprint: a.publicKeyFingerprint,
                  verified: true,
                })),
                verifiableEvidence: evidence,
                expiresAt: operation.expiresAt,
              },
              error: null,
            }),
            { status: 200, headers },
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Error procesando aprobación NCUA";
          return new Response(
            JSON.stringify({
              schemaVersion: "v1",
              requestId: ctx.correlationId,
              traceId: ctx.traceId,
              tenantId: ctx.tenantId,
              timestamp: new Date().toISOString(),
              error: {
                code: "APPROVAL_REJECTED",
                message,
              },
            }),
            { status: 422, headers },
          );
        }
      }),
    },
  },
});
