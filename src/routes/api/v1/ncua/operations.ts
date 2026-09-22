import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { config } from "@/lib/config";
import { CreateNcuaOperationSchema, NcuaProtocolEngine } from "@/lib/ncua/ncua-protocol";

export const Route = createFileRoute("/api/v1/ncua/operations")({
  server: {
    handlers: {
      POST: withSovereignAuth("system", "execute", async (ctx, req) => {
        const rawBody = (await req.json().catch(() => ({}))) as unknown;
        const parseResult = CreateNcuaOperationSchema.safeParse(rawBody);
        if (!parseResult.success) {
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
              error: {
                code: "INVALID_REQUEST_PAYLOAD",
                message: "Esquema de operación NCUA inválido.",
                details: parseResult.error.flatten(),
              },
            }),
            { status: 400, headers },
          );
        }

        const data = parseResult.data;
        const op = NcuaProtocolEngine.createOperation({
          tenantId: ctx.tenantId,
          userId: ctx.userId,
          operation: data.operation,
          category: data.category,
          payload: data.payload as Record<string, unknown>,
          ttlMinutes: data.ttlMinutes,
        });

        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json; charset=utf-8" }),
        );
        return new Response(
          JSON.stringify({
            schemaVersion: "v1",
            requestId: ctx.correlationId,
            traceId: ctx.traceId,
            tenantId: ctx.tenantId,
            timestamp: op.createdAt,
            policyVersion: config().CROWN_CONSTITUTION_VERSION,
            implementation: "ncua-2de3-v3",
            evidenceStatus: "E1",
            data: {
              ...op,
              quorum: "2-de-3",
              nodes: [
                { id: "node_a_crown", short: "A", name: "CROWN Gateway" },
                { id: "node_b_sophia", short: "B", name: "SOPHIA Engine" },
                { id: "node_c_argus", short: "C", name: "ARGUS Sentinel" },
              ],
              governanceNote:
                "Protocolo 2-de-3 activo. Se requieren al menos dos firmas soberanas válidas antes de la expiración para que la evidencia pase a estado E2/E3.",
            },
            error: null,
          }),
          { status: 201, headers },
        );
      }),
      GET: withSovereignAuth("system", "read", async (ctx) => {
        const ops = NcuaProtocolEngine.listOperations(ctx.tenantId);
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
            implementation: "ncua-2de3-v3",
            evidenceStatus: "E0",
            data: { operations: ops, count: ops.length },
            error: null,
          }),
          { status: 200, headers },
        );
      }),
    },
  },
});
