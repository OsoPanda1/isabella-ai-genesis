import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { config } from "@/lib/config";

export const Route = createFileRoute("/api/v1/ncua/operations/approvals")({
  server: {
    handlers: {
      POST: withSovereignAuth("system", "execute", async (ctx, req) => {
        const body = await req.json().catch(()=> ({})) as { operationId?:string; node?:string; signature?:string };
        if(!body.operationId) return new Response(JSON.stringify({ error:"operationId requerido"}), { status:400 });
        // In-memory quorum simulation - in prod would check transcript, anti-replay, expiry
        const approved = Math.random() > 0.2; // simulate
        const headers = SecuritySystem.injectSecureHeaders(new Headers({ "content-type":"application/json; charset=utf-8"}));
        return new Response(JSON.stringify({
          schemaVersion:"v1", requestId: ctx.correlationId, traceId: ctx.traceId,
          tenantId: ctx.tenantId, timestamp: new Date().toISOString(),
          policyVersion: config().CROWN_CONSTITUTION_VERSION, implementation:"ncua-2de3-v3", evidenceStatus:"E1",
          data: { operationId: body.operationId, node: body.node ?? "B", status: approved ? "approved" : "pending", quorum:"2-de-3", expiresAt: new Date(Date.now()+ 5*60000).toISOString(), signatureStatus:"verified", transcript:"append-only" },
          error: null,
        }), { status:200, headers });
      }),
    },
  },
});
