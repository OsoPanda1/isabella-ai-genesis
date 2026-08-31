import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SecuritySystem } from "@/lib/security";
import { SovereignDB } from "@/lib/sovereign-engine";

const bodySchema = z.object({
  system: z.string().min(1).max(8000),
  temperature: z.number().min(0).max(2).default(0.8),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(12000),
      }),
    )
    .min(1)
    .max(40),
});

export const Route = createFileRoute("/api/isabella")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // --- LAYER 0: Secure IP Resolver (Anti-Spoofing proxy guard) ---
        const ip = SecuritySystem.resolveClientIp(request);

        // --- LAYER 2: Rate Limiting ---
        const rateLimit = SecuritySystem.checkRateLimit(ip, 40);
        if (!rateLimit.allowed) {
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({ "content-type": "application/json" }),
          );
          return new Response(
            JSON.stringify({ error: "Límite de solicitudes de inferencia excedido (40/min)." }),
            { status: 429, headers },
          );
        }

        // --- LAYER 3: Sovereign Authorization & Multi-tenant Session Gate ---
        const token = request.headers.get("Authorization")?.replace("Bearer ", "") || null;
        if (!token) {
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({ "content-type": "application/json" }),
          );
          return new Response(
            JSON.stringify({
              error: "No Autorizado OIDC: Falta token de sesión en la cabecera Authorization.",
            }),
            { status: 401, headers },
          );
        }

        const session = SovereignDB.getSessionByToken(token);
        if (!session) {
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({ "content-type": "application/json" }),
          );
          return new Response(
            JSON.stringify({ error: "No Autorizado OIDC: Token inválido o sesión expirada." }),
            { status: 401, headers },
          );
        }

        // --- LAYER 3.5: Upstream API configuration validation ---
        const apiKey = process.env["LOVABLE_API_KEY"];
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
          const sanitizedMsg = SecuritySystem.sanitizePayload(msg.content);
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
        const telemetry = SecuritySystem.generateTelemetry(ip, "allowed");

        // --- LAYER 5: Upstream Safe Fallback & Circuit Breaker ---
        try {
          const upstream = await SecuritySystem.fetchSafeUpstream(
            "https://ai.gateway.lovable.dev/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "Lovable-API-Key": apiKey,
                "X-Lovable-AIG-SDK": "fetch",
              },
              body: JSON.stringify({
                model: "google/gemini-3.6-flash",
                stream: true,
                temperature,
                messages: [{ role: "system", content: sanitizedSystem.clean }, ...messages],
              }),
            },
          );

          if (!upstream.ok || !upstream.body) {
            const detail = await upstream.text().catch(() => "");
            console.error(`Isabella gateway error [${upstream.status}]: ${detail}`);
            const message =
              upstream.status === 429
                ? "Límite de inferencia alcanzado. Reintenta en unos instantes."
                : upstream.status === 402
                  ? "Créditos de IA agotados en el espacio de trabajo."
                  : `Fallo del núcleo de inferencia [${upstream.status}].`;

            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({ "content-type": "application/json" }),
            );
            return new Response(JSON.stringify({ error: message }), {
              status: upstream.status,
              headers,
            });
          }

          // --- LAYER 4: Hardened OWASP Secure Headers ---
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

          return new Response(upstream.body, { headers });
        } catch (err) {
          console.error("Critical gateway failure:", err);
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({ "content-type": "application/json" }),
          );
          return new Response(
            JSON.stringify({
              error: "Fallo crítico en el túnel de comunicación del gateway cognitivo.",
            }),
            { status: 502, headers },
          );
        }
      },
    },
  },
});
