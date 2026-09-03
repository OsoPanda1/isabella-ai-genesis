import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SecuritySystem } from "@/lib/security";
import { secrets } from "@/lib/secrets";
import { withSovereignAuth } from "@/lib/principal-context";
import {
  LatamAegisXFirewall,
  CentralizedTelemetryService,
  AutoAuditingSystem,
} from "@/lib/latam-aegis-x";
import { nativeInference } from "@/lib/isabella-native-ml";

const bodySchema = z.object({
  system: z.string().min(1).max(8000),
  temperature: z.number().min(0).max(2).default(0.8),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.union([
          z.string().min(1).max(12000),
          z.array(z.discriminatedUnion("type", [
            z.object({ type: z.literal("text"), text: z.string().min(1).max(12000) }),
            z.object({ type: z.literal("image_url"), image_url: z.object({ url: z.string().max(11_000_000) }) }),
            z.object({ type: z.literal("input_audio"), input_audio: z.object({ data: z.string().max(11_000_000), format: z.enum(["m4a", "ogg", "wav", "mp3", "webm"]) }) }),
          ])).max(10),
        ]),
      }),
    )
    .min(1)
    .max(40),
});

export const Route = createFileRoute("/api/isabella")({
  server: {
    handlers: {
      POST: withSovereignAuth("system", "execute", async (context, request) => {
        // --- LAYER 2: Rate Limiting ---
        const rateLimit = SecuritySystem.checkRateLimit(context.ip, 40);
        if (!rateLimit.allowed) {
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({ "content-type": "application/json" }),
          );
          return new Response(
            JSON.stringify({ error: "Límite de solicitudes de inferencia excedido (40/min)." }),
            { status: 429, headers },
          );
        }

        // --- LAYER 3.5: Upstream API configuration validation ---
        let apiKey: string;
        try {
          apiKey = secrets.aiGatewayKey();
        } catch {
          apiKey = "";
        }
        if (!apiKey) {
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({ "content-type": "application/json" }),
          );
          return new Response(
            JSON.stringify({ error: "El núcleo de inferencia no está configurado." }),
            { status: 500, headers },
          );
        }

        // Parse Request Body safely
        let rawBody;
        try {
          rawBody = await request.json();
        } catch {
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({ "content-type": "application/json" }),
          );
          return new Response(JSON.stringify({ error: "Percepción corrupta." }), {
            status: 400,
            headers,
          });
        }

        // --- LAYER 1: Input Integrity Validation ---
        const validation = SecuritySystem.validateInput(bodySchema, rawBody);
        if (!validation.success) {
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({ "content-type": "application/json" }),
          );
          return new Response(JSON.stringify({ error: validation.error }), {
            status: 400,
            headers,
          });
        }

        const { system, messages, temperature } = validation.data;

        // --- LAYER 7: Hostile Content Filtering & Prompt Injection Shield ---
        const sanitizedSystem = SecuritySystem.sanitizePayload(system);
        if (sanitizedSystem.flagged) {
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({ "content-type": "application/json" }),
          );
          return new Response(
            JSON.stringify({
              error: `Filtro de Contenido Hostil Activo: ${sanitizedSystem.reason}`,
            }),
            { status: 403, headers },
          );
        }

        for (const msg of messages) {
          const contentText = typeof msg.content === "string" ? msg.content : msg.content.map((block) => block.type === "text" ? block.text : `[${block.type}]`).join(" ");
          const sanitizedMsg = SecuritySystem.sanitizePayload(contentText);
          if (sanitizedMsg.flagged) {
            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({ "content-type": "application/json" }),
            );
            return new Response(
              JSON.stringify({
                error: `Filtro de Contenido Hostil Activo: ${sanitizedMsg.reason}`,
              }),
              { status: 403, headers },
            );
          }
        }

        // --- LAYER 6: Auditable Telemetry ---
        const telemetry = SecuritySystem.generateTelemetry(context.ip, "allowed");

        // --- CENTRALIZED TELEMETRY SECURE LOGGING ---
        CentralizedTelemetryService.logEvent(
          "CROWN_GATEWAY",
          "CROWN_ROUTER",
          "InferenceRequestReceived",
          { ip: context.ip, messagesCount: messages.length, temperature },
          "info",
          telemetry.traceId,
          telemetry.correlationId,
        );

        // --- LATAM-AEGIS-X FIREWALL INTERCEPTOR ---
        const lastContent = messages[messages.length - 1]?.content;
        const lastUserMessage = typeof lastContent === "string" ? lastContent : lastContent?.map((block) => block.type === "text" ? block.text : `[${block.type}]`).join(" ") || "";
        const interceptResult = LatamAegisXFirewall.interceptRequest(
          lastUserMessage,
          { qecErrorRate: 0.02 },
          telemetry.traceId,
          telemetry.correlationId,
        );

        if (!interceptResult.allowed) {
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({ "content-type": "application/json" }),
          );

          // Asynchronously audit the blocking event as a governance deviation log
          void AutoAuditingSystem.auditExecutionFlow(
            "CROWN",
            "OrchestratePrompt",
            {
              targetWeight: 0.0,
              violationType: "AegisFirewallBlock",
              reason: interceptResult.reason,
            },
            telemetry.traceId,
          );

          return new Response(
            JSON.stringify({
              error: `LATAM-AEGIS-X Cortafuegos: Acción Bloqueada. ${interceptResult.reason}`,
            }),
            { status: 403, headers },
          );
        }

        // Audit the allowed transaction signature compliance flow
        void AutoAuditingSystem.auditExecutionFlow(
          "CROWN",
          "OrchestratePrompt",
          {
            targetWeight: 0.85,
            anomalyScore: interceptResult.anomalyScore,
          },
          telemetry.traceId,
        );

        // Track a simulated monetization split contability ledger audit
        void AutoAuditingSystem.auditExecutionFlow(
          "ORION",
          "DebitTransaction",
          {
            amount: 0.0025,
            pqcSignature: `sig_pqc_${telemetry.traceId}`,
          },
          telemetry.traceId,
        );

        // --- LAYER 5: Upstream Safe Fallback & Circuit Breaker — Gemini (Lovable eliminado) ---
        try {
          const upstream = await SecuritySystem.fetchSafeUpstream(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:streamGenerateContent?key=${encodeURIComponent(apiKey)}`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  { role: "user", parts: [{ text: sanitizedSystem.clean }] },
                  ...messages.map((m) => ({
                    role: m.role === "assistant" ? "model" : "user",
                    parts: [{ text: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }],
                  })),
                ],
                generationConfig: { temperature, maxOutputTokens: 8192 },
              }),
            },
          );

          if (!upstream.ok || !upstream.body) {
            const detail = await upstream.text().catch(() => "");
            console.error(`Isabella gateway error [${upstream.status}]: ${detail}`);
            // Fallback soberano nativo 100% español LATAM — garantiza respuesta incluso sin Gemini
            const native = nativeInference({ text: lastUserMessage, locale: "es-MX", tenantId: context.tenantId, history: messages as Array<{ role: "user" | "assistant"; content: string }> });
            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({
                "content-type": "text/event-stream",
                "cache-control": "no-cache",
                connection: "keep-alive",
                "x-isabella-trace-id": telemetry.traceId,
                "x-isabella-correlation-id": telemetry.correlationId,
                "x-isabella-rate-remaining": rateLimit.remaining.toString(),
                "x-isabella-native-intent": native.intent,
                "x-isabella-native-confidence": String(native.confidence),
              }),
            );
            const sseBody = `data: ${JSON.stringify({ choices: [{ delta: { content: native.text } }] })}\n\ndata: [DONE]\n\n`;
            return new Response(sseBody, { headers });
          }

          // --- LAYER 4: Hardened OWASP Secure Headers + Gemini→OpenAI SSE translation ---
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({
              "content-type": "text/event-stream",
              "cache-control": "no-cache",
              connection: "keep-alive",
              "x-isabella-trace-id": telemetry.traceId,
              "x-isabella-correlation-id": telemetry.correlationId,
              "x-isabella-rate-remaining": rateLimit.remaining.toString(),
            }),
          );

          CentralizedTelemetryService.logEvent(
            "CROWN_GATEWAY",
            "CROWN_CONSTITUTION",
            "UpstreamInferenceAuthorized",
            { status: upstream.status },
            "info",
            telemetry.traceId,
            telemetry.correlationId,
          );

          // Translate Gemini stream (candidates) → OpenAI delta format expected by useIsabella
          const contentType = upstream.headers.get("content-type") ?? "";
          if (contentType.includes("text/event-stream") || contentType.includes("text/plain")) {
            const geminiStream = upstream.body as ReadableStream<Uint8Array>;
            const openAIStream = new ReadableStream<Uint8Array>({
              async start(controller) {
                const reader = geminiStream.getReader();
                const decoder = new TextDecoder();
                const encoder = new TextEncoder();
                let buffer = "";
                try {
                  for (;;) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    let nl: number;
                    while ((nl = buffer.indexOf("\n")) !== -1) {
                      const line = buffer.slice(0, nl).trim();
                      buffer = buffer.slice(nl + 1);
                      if (!line) continue;
                      // Gemini SSE: data: {"candidates":[{"content":{"parts":[{"text":"..."}]}}]}
                      // OpenAI SSE: data: {"choices":[{"delta":{"content":"..."}}]}
                      const jsonStr = line.startsWith("data:") ? line.slice(5).trim() : line.trim();
                      if (!jsonStr || jsonStr === "[DONE]") continue;
                      try {
                        const gem = JSON.parse(jsonStr);
                        const text: string | undefined =
                          gem.candidates?.[0]?.content?.parts?.[0]?.text ??
                          gem.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("") ??
                          gem.text ??
                          undefined;
                        if (text) {
                          const openAIChunk = `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;
                          controller.enqueue(encoder.encode(openAIChunk));
                        }
                      } catch {
                        // ignore partial JSON
                      }
                    }
                  }
                  // Flush remaining buffer
                  const remaining = buffer.trim();
                  if (remaining) {
                    try {
                      const gem = JSON.parse(remaining.startsWith("data:") ? remaining.slice(5).trim() : remaining);
                      const text: string | undefined = gem.candidates?.[0]?.content?.parts?.[0]?.text;
                      if (text) {
                        const openAIChunk = `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;
                        controller.enqueue(new TextEncoder().encode(openAIChunk));
                      }
                    } catch {}
                  }
                  controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
                  controller.close();
                } catch (e) {
                  controller.error(e);
                }
              },
            });
            return new Response(openAIStream, { headers });
          }
          // Fallback: Gemini non-stream JSON → convert to single SSE delta
          try {
            const gemJson = (await upstream.json()) as {
              candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
              text?: string;
            };
            const fullText =
              gemJson.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ??
              gemJson.text ??
              "Isabella: respuesta generada en modo soberano — Nodo Cero.";
            const sseBody = `data: ${JSON.stringify({ choices: [{ delta: { content: fullText } }] })}\n\ndata: [DONE]\n\n`;
            return new Response(sseBody, { headers });
          } catch {
            return new Response(upstream.body, { headers });
          }
        } catch (err) {
          console.error("Critical gateway failure:", err);
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({
              "content-type": "text/event-stream",
              "cache-control": "no-cache",
              connection: "keep-alive",
              "x-isabella-trace-id": telemetry.traceId,
              "x-isabella-correlation-id": telemetry.correlationId,
            }),
          );
          const native = nativeInference({ text: lastUserMessage, locale: "es-MX", tenantId: context.tenantId, history: messages as Array<{ role: "user" | "assistant"; content: string }> });
          const sseBody = `data: ${JSON.stringify({ choices: [{ delta: { content: native.text } }] })}\n\ndata: [DONE]\n\n`;
          return new Response(sseBody, { headers });
        }
      }),
    },
  },
});
