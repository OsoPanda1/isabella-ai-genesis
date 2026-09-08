import { z } from "zod";
import { SecuritySystem } from "@/lib/security";
import { secrets } from "@/lib/secrets";
import { config } from "@/lib/config";
import {
  LatamAegisXFirewall,
  CentralizedTelemetryService,
  AutoAuditingSystem,
} from "@/lib/latam-aegis-x";
import { createSovereignPipeline } from "@/lib/sovereign-pipeline";
import { parseSafeJsonBody } from "@/lib/input-limits";

const bodySchema = z.object({
  system: z.string().max(8000).optional(),
  temperature: z.number().finite().min(0).max(2).default(0.8),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.union([
          z.string().min(1).max(12000),
          z
            .array(
              z.discriminatedUnion("type", [
                z.object({ type: z.literal("text"), text: z.string().min(1).max(12000) }),
                z.object({ type: z.literal("image_url"), image_url: z.object({ url: z.string().max(11_000_000) }) }),
                z.object({
                  type: z.literal("input_audio"),
                  input_audio: z.object({ data: z.string().max(11_000_000), format: z.enum(["m4a", "ogg", "wav", "mp3", "webm"]) }),
                }),
              ]),
            )
            .max(10),
        ]),
      }),
    )
    .min(1)
    .max(40),
});

type GatewayContext = {
  ip: string;
  traceId: string;
  correlationId: string;
  userId: string;
  tenantId: string;
  role: string;
  scope: string;
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: SecuritySystem.injectSecureHeaders(
      new Headers({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }),
    ),
  });
}

function sseHeaders(context: GatewayContext, remaining: number): Headers {
  return SecuritySystem.injectSecureHeaders(
    new Headers({
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-store",
      connection: "keep-alive",
      "x-accel-buffering": "no",
      "x-isabella-trace-id": context.traceId,
      "x-isabella-correlation-id": context.correlationId,
      "x-isabella-rate-remaining": String(remaining),
    }),
  );
}

function textFromContent(content: z.infer<typeof bodySchema>["messages"][number]["content"]): string {
  return typeof content === "string"
    ? content
    : content.map((block) => (block.type === "text" ? block.text : `[${block.type}]`)).join(" ");
}

function configuredGeminiModel(): string {
  const configured = config().LLM_DEFAULT_MODEL || "google/gemini-3.8-flash";
  const model = configured.split("/").at(-1) ?? "gemini-3.8-flash";
  if (!/^[a-zA-Z0-9._:-]+$/.test(model)) throw new Error("invalid_llm_model_configuration");
  return model;
}

function buildGeminiBody(
  messages: z.infer<typeof bodySchema>["messages"],
  temperature: number,
  system: string,
): Record<string, unknown> {
  return {
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts:
        typeof message.content === "string"
          ? [{ text: message.content }]
          : message.content.map((block) => {
              if (block.type === "text") return { text: block.text };
              if (block.type === "image_url") {
                const match = block.image_url.url.match(/^data:([^;]+);base64,(.+)$/);
                return match
                  ? { inlineData: { mimeType: match[1], data: match[2] } }
                  : { text: "[imagen adjunta no decodificable]" };
              }
              return { text: "[audio adjunto]" };
            }),
    })),
    generationConfig: { temperature, maxOutputTokens: 8192 },
  };
}

function geminiSseToOpenAi(upstream: Response, headers: Headers): Response {
  if (!upstream.body) return json({ error: "inference_empty_stream" }, 502);
  const source = upstream.body;
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = source.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let newline = buffer.indexOf("\n");
          while (newline >= 0) {
            const line = buffer.slice(0, newline).trim();
            buffer = buffer.slice(newline + 1);
            newline = buffer.indexOf("\n");
            if (!line || !line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const event = JSON.parse(payload) as {
                candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
              };
              const text = event.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
              if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`));
            } catch {
              // Ignore an incomplete SSE JSON frame; the next frame completes the stream.
            }
          }
        }
        buffer += decoder.decode();
        for (const line of buffer.split(/\r?\n/)) {
          if (!line.startsWith("data:")) continue;
          try {
            const event = JSON.parse(line.slice(5).trim()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
            const text = event.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
            if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`));
          } catch {
            // Ignore incomplete final frames.
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });
  return new Response(stream, { status: 200, headers });
}

export async function handleIsabellaChat(context: GatewayContext, request: Request): Promise<Response> {
  const rateLimit = await SecuritySystem.checkRateLimitDistributed(context.ip, 40);
  if (!rateLimit.allowed) {
    if (rateLimit.degraded) {
      return json({
        error: "rate-limit-infrastructure-unavailable",
        message: "El control distribuido de concurrencia no está disponible; Isabella permanece cerrada para evitar saltarse el límite global.",
        traceId: context.traceId,
      }, 503);
    }
    return json({ error: "rate_limit_exceeded", traceId: context.traceId }, 429);
  }

  let rawBody: unknown;
  try {
    rawBody = await parseSafeJsonBody(request);
  } catch {
    return json({ error: "invalid_json", traceId: context.traceId }, 400);
  }
  const validation = SecuritySystem.validateInput(bodySchema, rawBody);
  if (!validation.success) return json({ error: "invalid_request", traceId: context.traceId }, 400);
  const { messages, temperature } = validation.data;

  let apiKey: string;
  try {
    apiKey = secrets.aiGatewayKey();
  } catch {
    return json({ error: "inference_provider_unconfigured", message: "GEMINI_API_KEY no está configurada; Isabella no puede emitir una respuesta cognitiva real.", traceId: context.traceId }, 503);
  }

  const serverSystem = [
    "Eres Isabella Villaseñor AI, interfaz cognitiva soberana del Nodo Cero.",
    "Responde en español latinoamericano claro, preciso y útil. Declara incertidumbre cuando corresponda.",
    "No ejecutes acciones ni reveles secretos. Las decisiones sensibles requieren aprobación humana explícita y trazabilidad.",
  ].join(" ");
  const sanitizedSystem = SecuritySystem.sanitizePayload(serverSystem);
  if (sanitizedSystem.flagged) return json({ error: "governance_policy_rejected", traceId: context.traceId }, 403);

  for (const message of messages) {
    const sanitized = SecuritySystem.sanitizePayload(textFromContent(message.content));
    if (sanitized.flagged) return json({ error: "input_policy_rejected", traceId: context.traceId }, 403);
  }

  const lastUserMessage = textFromContent(messages[messages.length - 1]?.content ?? "");
  const intercept = LatamAegisXFirewall.interceptRequest(
    lastUserMessage,
    { qecErrorRate: 0 },
    context.traceId,
    context.correlationId,
  );
  if (!intercept.allowed) {
    void AutoAuditingSystem.auditExecutionFlow("CROWN", "OrchestratePrompt", { targetWeight: 0, violationType: "AegisFirewallBlock", reason: intercept.reason }, context.traceId);
    return json({ error: "aegis_policy_rejected", message: intercept.reason, traceId: context.traceId }, 403);
  }

  const pipeline = createSovereignPipeline();
  const governance = await pipeline.execute({
    requestId: context.correlationId,
    traceId: context.traceId,
    actorId: context.userId,
    actorIp: context.ip,
    tenantId: context.tenantId,
    input: lastUserMessage,
    identity: {
      authenticated: context.role !== "Guest",
      actorId: context.userId,
      roles: [context.role],
      permissions: context.scope.split(/\s+/).filter(Boolean),
      dataScopes: ["turn", "session"],
      authenticationMethod: "sovereign-gateway",
    },
    evidence: { level: "weak", verified: false, sources: ["user_input"], limitations: ["No external source verification requested."] },
    timestamp: new Date().toISOString(),
  });
  if (governance.denied) return json({ error: "governance_denied", message: governance.denialReason, traceId: context.traceId }, 403);

  try {
    const { createMemoryKillSwitchStore, createPostgresKillSwitchStore } = await import("@/lib/kill-switch");
    const store = config().DATABASE_URL ? createPostgresKillSwitchStore() : createMemoryKillSwitchStore();
    if (await store.isKilled("inference")) return json({ error: "inference_killed", traceId: context.traceId }, 503);
  } catch {
    return json({ error: "kill_switch_unavailable", message: "No fue posible leer el estado del interruptor de emergencia; inferencia bloqueada.", traceId: context.traceId }, 503);
  }

  const model = configuredGeminiModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
  const upstream = await SecuritySystem.fetchSafeUpstream(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify(buildGeminiBody(messages, temperature, sanitizedSystem.clean)),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error(`[ISABELLA_GEMINI] upstream=${upstream.status} model=${model} trace=${context.traceId} detail=${detail.slice(0, 500)}`);
    return json({ error: "inference_upstream_unavailable", provider: "google-gemini", model, traceId: context.traceId }, 503);
  }

  CentralizedTelemetryService.logEvent(
    "CROWN_GATEWAY",
    "CROWN_CONSTITUTION",
    "UpstreamInferenceAuthorized",
    { provider: "google-gemini", model, status: upstream.status },
    "info",
    context.traceId,
    context.correlationId,
  );

  return geminiSseToOpenAi(upstream, sseHeaders(context, rateLimit.remaining));
}
