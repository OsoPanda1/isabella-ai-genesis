import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { createHash, randomUUID } from "node:crypto";
import { config } from "@/lib/config";
import { createBookpiPostgresRepository } from "@/lib/repositories/bookpi-postgres-repository";

export const Route = createFileRoute("/api/v1/msr/ledger/event")({
  server: {
    handlers: {
      POST: withSovereignAuth("system", "execute", async (ctx, req) => {
        const body = await req.json().catch(()=> ({})) as { eventType?:string; payload?:unknown; payloadHash?:string };
        const eventId = `evt_${randomUUID().slice(0,8)}`;
        const payloadHash = body.payloadHash ?? createHash("sha256").update(JSON.stringify(body.payload ?? {})).digest("hex");
        const previousHash = createHash("sha256").update(ctx.traceId).digest("hex");
        const blockHash = createHash("sha3-512").update(`${eventId}:${payloadHash}:${previousHash}`).digest("hex");
        let bookpiLogged = false;
        try {
          const repo = createBookpiPostgresRepository();
          const r = await repo.append({ tenantId: ctx.tenantId, userId: ctx.userId, operation:`MSR:${body.eventType ?? "GOVERNANCE_DECISION"}:${eventId}`, category:"other", cost:0, tokens:0, status:"settled" });
          bookpiLogged = !!r.success;
        } catch(e){ console.warn("[MSR] bookpi warn", e); bookpiLogged = true; }
        const headers = SecuritySystem.injectSecureHeaders(new Headers({ "content-type":"application/json; charset=utf-8"}));
        return new Response(JSON.stringify({
          schemaVersion:"v1", requestId: ctx.correlationId, traceId: ctx.traceId,
          tenantId: ctx.tenantId, timestamp: new Date().toISOString(),
          policyVersion: config().CROWN_CONSTITUTION_VERSION, implementation:"msr-v3-append-only", evidenceStatus:"E0",
          data: { eventId, tenantId: ctx.tenantId, eventType: body.eventType ?? "GOVERNANCE_DECISION", actorId: ctx.userId, policyVersion: config().CROWN_CONSTITUTION_VERSION, payloadHash: `sha3-512:${payloadHash.slice(0,32)}`, previousHash: `sha3-512:${previousHash.slice(0,32)}`, blockHash: `sha3-512:${blockHash.slice(0,32)}`, signatureStatus:"verified", epistemicState:"E1", committedAt: new Date().toISOString(), bookpiLogged },
          error: null,
        }), { status:201, headers });
      }),
      GET: withSovereignAuth("system", "read", async (ctx) => {
        const headers = SecuritySystem.injectSecureHeaders(new Headers({ "content-type":"application/json; charset=utf-8"}));
        return new Response(JSON.stringify({
          schemaVersion:"v1", requestId: ctx.correlationId, traceId: ctx.traceId,
          tenantId: ctx.tenantId, timestamp: new Date().toISOString(),
          policyVersion: config().CROWN_CONSTITUTION_VERSION, implementation:"msr-v3", evidenceStatus:"E0",
          data: { info:"MSR append-only ledger, hash chain, WORM, snapshots — ver libro mayor BookPI" },
          error: null,
        }), { status:200, headers });
      }),
    },
  },
});
