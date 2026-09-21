import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { config } from "@/lib/config";
import { randomUUID, createHash } from "node:crypto";

type Op = { id:string; tenantId:string; operation:string; status:"pending"|"approved"|"rejected"|"executed"; approvals:string[]; nonce:string; timestamp:string; policyHash:string; payloadHash:string };
const store = new Map<string, Op>();

export const Route = createFileRoute("/api/v1/ncua/operations")({
  server: {
    handlers: {
      POST: withSovereignAuth("system", "execute", async (ctx, req) => {
        const body = await req.json().catch(()=> ({})) as { operation?:string; payload?:unknown };
        const id = `op_${randomUUID().slice(0,8)}`;
        const nonce = randomUUID().slice(0,16);
        const payloadHash = createHash("sha256").update(JSON.stringify(body.payload ?? body.operation ?? "")).digest("hex");
        const policyHash = createHash("sha256").update(config().CROWN_CONSTITUTION_VERSION).digest("hex");
        const op: Op = { id, tenantId: ctx.tenantId, operation: body.operation ?? "protected_action", status:"pending", approvals:[], nonce, timestamp:new Date().toISOString(), policyHash, payloadHash };
        store.set(id, op);
        const headers = SecuritySystem.injectSecureHeaders(new Headers({ "content-type":"application/json; charset=utf-8"}));
        return new Response(JSON.stringify({
          schemaVersion:"v1", requestId: ctx.correlationId, traceId: ctx.traceId,
          tenantId: ctx.tenantId, timestamp: op.timestamp,
          policyVersion: config().CROWN_CONSTITUTION_VERSION, implementation:"ncua-2de3-v3", evidenceStatus:"E1",
          data: { ...op, quorum:"2-de-3", nodes:["A","B","C"], note:"ML-KEM/ML-DSA no threshold por Shamir directo — requiere DKG/MPC (Cap. XII). Aprobaciones expiran, sin reconstrucción de clave privada." },
          error: null,
        }), { status:201, headers });
      }),
      GET: withSovereignAuth("system", "read", async (ctx) => {
        const ops = [...store.values()].filter(o=>o.tenantId===ctx.tenantId);
        const headers = SecuritySystem.injectSecureHeaders(new Headers({ "content-type":"application/json; charset=utf-8"}));
        return new Response(JSON.stringify({
          schemaVersion:"v1", requestId: ctx.correlationId, traceId: ctx.traceId,
          tenantId: ctx.tenantId, timestamp: new Date().toISOString(),
          policyVersion: config().CROWN_CONSTITUTION_VERSION, implementation:"ncua-2de3-v3", evidenceStatus:"E0",
          data: { operations: ops, count: ops.length },
          error: null,
        }), { status:200, headers });
      }),
    },
  },
});
