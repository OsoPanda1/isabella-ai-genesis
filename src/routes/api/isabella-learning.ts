import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import {
  createNativeLearningApi,
  LearningEvaluateApiSchema,
  LearningIngestApiSchema,
  LearningQueryApiSchema,
} from "@/lib/isabella-learning-api";
import { createIsabellaLearningEngine } from "@/lib/isabella-learning";

/**
 * Native Isabella learning endpoint.
 *
 * Learning state is isolated by tenant inside the process and is never shared
 * between principals. Durable persistence must be added behind the LearningStore
 * contract before this state is treated as cross-process production authority.
 */
const engines = new Map<string, ReturnType<typeof createIsabellaLearningEngine>>();

function engineFor(tenantId: string) {
  let engine = engines.get(tenantId);
  if (!engine) {
    engine = createIsabellaLearningEngine();
    engines.set(tenantId, engine);
  }
  return engine;
}

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

export const Route = createFileRoute("/api/isabella-learning")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async (context, request) => {
        const url = new URL(request.url);
        const action = url.searchParams.get("action") ?? "snapshot";
        const api = createNativeLearningApi(engineFor(context.tenantId));

        if (action === "snapshot") return api.snapshot();
        if (action === "retrieve") {
          const parsed = LearningQueryApiSchema.safeParse({
            query: url.searchParams.get("query") ?? "",
            limit: Number(url.searchParams.get("limit") ?? 8),
          });
          if (!parsed.success) return json({ error: "VALIDATION_ERROR", issues: parsed.error.issues }, 400);
          return api.retrieve(parsed.data);
        }
        if (action === "evaluate") {
          const parsed = LearningEvaluateApiSchema.safeParse({ query: url.searchParams.get("query") ?? "" });
          if (!parsed.success) return json({ error: "VALIDATION_ERROR", issues: parsed.error.issues }, 400);
          return api.evaluate(parsed.data);
        }
        return json({ error: "UNKNOWN_ACTION", allowed: ["snapshot", "retrieve", "evaluate"] }, 400);
      }),

      POST: withSovereignAuth("system", "execute", async (context, request) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "INVALID_JSON" }, 400);
        }

        const action = typeof body === "object" && body !== null && "action" in body
          ? (body as { action?: unknown }).action
          : "ingest";
        const payload = typeof body === "object" && body !== null && "payload" in body
          ? (body as { payload?: unknown }).payload
          : body;
        const api = createNativeLearningApi(engineFor(context.tenantId));

        if (action === "ingest") {
          const parsed = LearningIngestApiSchema.safeParse(payload);
          if (!parsed.success) return json({ error: "VALIDATION_ERROR", issues: parsed.error.issues }, 400);
          return api.ingest(parsed.data);
        }
        if (action === "retrieve") {
          const parsed = LearningQueryApiSchema.safeParse(payload);
          if (!parsed.success) return json({ error: "VALIDATION_ERROR", issues: parsed.error.issues }, 400);
          return api.retrieve(parsed.data);
        }
        if (action === "evaluate") {
          const parsed = LearningEvaluateApiSchema.safeParse(payload);
          if (!parsed.success) return json({ error: "VALIDATION_ERROR", issues: parsed.error.issues }, 400);
          return api.evaluate(parsed.data);
        }
        if (action === "snapshot") return api.snapshot();
        return json({ error: "UNKNOWN_ACTION", allowed: ["ingest", "retrieve", "evaluate", "snapshot"] }, 400);
      }),
    },
  },
});
