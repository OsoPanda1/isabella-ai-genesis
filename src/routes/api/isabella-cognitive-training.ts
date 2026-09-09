import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import {
  createIsabellaCognitiveTrainingEngine,
  type CognitiveTrainingSample,
  type CognitiveTrainingStrategy,
} from "@/lib/isabella-cognitive-training";
import { loadLearningRuntime, persistLearningRuntime } from "@/lib/isabella-learning-persistence";

const STRATEGIES = new Set<CognitiveTrainingStrategy>([
  "semantic",
  "procedural",
  "contrastive",
  "counterfactual",
  "retrieval",
  "reflection",
  "preference",
  "multimodal",
]);

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

function parseSample(value: unknown): CognitiveTrainingSample | null {
  if (!value || typeof value !== "object") return null;
  const sample = value as Record<string, unknown>;
  if (typeof sample.input !== "string" || typeof sample.source !== "string") return null;
  return {
    input: sample.input,
    target: typeof sample.target === "string" ? sample.target : undefined,
    negative: typeof sample.negative === "string" ? sample.negative : undefined,
    context: sample.context && typeof sample.context === "object"
      ? sample.context as Record<string, unknown>
      : undefined,
    source: sample.source,
    skillIds: Array.isArray(sample.skillIds) ? sample.skillIds.filter((id): id is string => typeof id === "string") : [],
    quality: typeof sample.quality === "number" ? sample.quality : 0.5,
    consent: sample.consent === true,
  };
}

export const Route = createFileRoute("/api/isabella-cognitive-training")({
  server: {
    handlers: {
      POST: withSovereignAuth("system", "execute", async (context, request) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "INVALID_JSON" }, 400);
        }
        if (!body || typeof body !== "object") return json({ error: "VALIDATION_ERROR" }, 400);
        const payload = body as Record<string, unknown>;
        const action = payload.action ?? "train";
        const runtime = await loadLearningRuntime(context.tenantId).catch((error: unknown) => ({
          error: error instanceof Error ? error.message : "LEARNING_RUNTIME_UNAVAILABLE",
        } as const));
        if ("error" in runtime) return json({ error: runtime.error }, 503);
        const engine = createIsabellaCognitiveTrainingEngine(runtime.engine);

        if (action === "train") {
          const strategy = payload.strategy;
          if (typeof strategy !== "string" || !STRATEGIES.has(strategy as CognitiveTrainingStrategy)) {
            return json({ error: "INVALID_STRATEGY", allowed: [...STRATEGIES] }, 400);
          }
          const sample = parseSample(payload.sample);
          if (!sample) return json({ error: "INVALID_SAMPLE", required: ["input", "source"] }, 400);
          const result = engine.train(strategy as CognitiveTrainingStrategy, sample);
          if (runtime.durable && result.accepted > 0) await persistLearningRuntime(context.tenantId, runtime.engine);
          return json(result);
        }

        if (action === "train-batch") {
          if (!Array.isArray(payload.samples) || payload.samples.length > 128) {
            return json({ error: "INVALID_BATCH", maxItems: 128 }, 400);
          }
          const samples = [] as Array<{ strategy: CognitiveTrainingStrategy; sample: CognitiveTrainingSample }>;
          for (const item of payload.samples) {
            if (!item || typeof item !== "object") return json({ error: "INVALID_BATCH_ITEM" }, 400);
            const row = item as Record<string, unknown>;
            const strategy = row.strategy;
            const sample = parseSample(row.sample);
            if (typeof strategy !== "string" || !STRATEGIES.has(strategy as CognitiveTrainingStrategy) || !sample) {
              return json({ error: "INVALID_BATCH_ITEM" }, 400);
            }
            samples.push({ strategy: strategy as CognitiveTrainingStrategy, sample });
          }
          const result = engine.trainBatch(samples);
          if (runtime.durable && result.accepted > 0) await persistLearningRuntime(context.tenantId, runtime.engine);
          return json(result);
        }

        if (action === "evaluate") {
          if (typeof payload.query !== "string" || !payload.query.trim()) return json({ error: "QUERY_REQUIRED" }, 400);
          return json(engine.evaluateUnderstanding(payload.query));
        }

        if (action === "retrieve") {
          if (typeof payload.query !== "string" || !payload.query.trim()) return json({ error: "QUERY_REQUIRED" }, 400);
          const limit = typeof payload.limit === "number" ? Math.max(1, Math.min(50, Math.trunc(payload.limit))) : 8;
          return json({ items: engine.retrieveRelevantKnowledge(payload.query, limit) });
        }

        if (action === "snapshot") return json(engine.snapshot());
        return json({ error: "UNKNOWN_ACTION", allowed: ["train", "train-batch", "evaluate", "retrieve", "snapshot"] }, 400);
      }),
    },
  },
});
