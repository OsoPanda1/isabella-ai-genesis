import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { initializeIntelligencePlane, invokeIntelligence, listModels } from "@/lib/intelligence";

const requestSchema = z.object({
  messages: z.array(z.object({ role: z.enum(["system", "user", "assistant"]), content: z.string().min(1).max(12000) })).min(1).max(40),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(1).max(32768).optional(),
  preferredModel: z.string().max(160).optional(),
});

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: SecuritySystem.injectSecureHeaders(new Headers({ "content-type": "application/json" })) });
}

export const Route = createFileRoute("/api/intelligence")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async () => {
        initializeIntelligencePlane();
        return json({ models: listModels() });
      }),
      POST: withSovereignAuth("system", "execute", async (context, request) => {
        initializeIntelligencePlane();
        let body: unknown;
        try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
        const parsed = requestSchema.safeParse(body);
        if (!parsed.success) return json({ error: "invalid_request", details: parsed.error.flatten() }, 400);
        try {
          const result = await invokeIntelligence({
            tenantId: context.tenantId,
            actorId: context.userId,
            ...parsed.data,
          });
          return json(result);
        } catch (error) {
          const message = error instanceof Error ? error.message : "inference_unavailable";
          return json({ error: message.startsWith("inference_") ? message.split(":")[0] : "inference_unavailable", traceId: context.traceId }, 503);
        }
      }),
    },
  },
});
