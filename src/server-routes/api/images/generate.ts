import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SecuritySystem } from "@/lib/security";
import { withSovereignAuth } from "@/lib/principal-context";
import { config } from "@/lib/config";
import { createHash } from "node:crypto";

const bodySchema = z.object({
  prompt: z.string().min(3).max(2000),
  style: z.enum(["realista", "arte", "territorial", "corporativo"]).default("territorial"),
  size: z.enum(["512x512", "1024x1024", "1792x1024"]).default("1024x1024"),
});

function svgPlaceholder(prompt: string, style: string, traceId: string): string {
  const hash = createHash("sha256").update(prompt + style + traceId).digest("hex").slice(0,6);
  const bg = `#${hash}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="${bg}"/><text x="512" y="480" text-anchor="middle" font-family="sans-serif" font-size="42" fill="white" opacity="0.9">Isabella Vision</text><text x="512" y="540" text-anchor="middle" font-family="sans-serif" font-size="22" fill="white" opacity="0.7">${prompt.slice(0,80).replace(/</g,"")}</text><text x="512" y="980" text-anchor="middle" font-family="monospace" font-size="14" fill="white" opacity="0.5">RDM • ${style} • ${traceId.slice(0,8)}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// @ts-expect-error - TanStack route type augmented at build time
export const Route = createFileRoute("/api/v1/images/generate")({
  server: {
    handlers: {
      POST: withSovereignAuth("system", "execute", async (context, request) => {
        const rateLimit = SecuritySystem.checkRateLimit(context.ip, 20);
        if (!rateLimit.allowed) {
          const h = SecuritySystem.injectSecureHeaders(new Headers({ "content-type":"application/json"}));
          return new Response(JSON.stringify({ error:"Límite imágenes 20/min" }), { status:429, headers:h });
        }
        let raw: unknown;
        try { raw = await request.json(); } catch { raw = {}; }
        const parsed = bodySchema.safeParse(raw);
        if (!parsed.success) {
          const h = SecuritySystem.injectSecureHeaders(new Headers({ "content-type":"application/json"}));
          return new Response(JSON.stringify({ error:"Prompt inválido", details: parsed.error.issues }), { status:400, headers:h });
        }
        const { prompt, style, size } = parsed.data;
        const sanitized = SecuritySystem.sanitizePayload(prompt);
        if (sanitized.flagged) {
          const h = SecuritySystem.injectSecureHeaders(new Headers({ "content-type":"application/json"}));
          return new Response(JSON.stringify({ error:`Filtro hostil: ${sanitized.reason}` }), { status:403, headers:h });
        }
        // Producción real usaría Fal/Replicate/Stability con VOICE_API_URL similar — aquí sovereign-mock determinista + auditable
        const imageUrl = svgPlaceholder(sanitized.clean, style, context.traceId);
        const imageId = `img_${createHash("sha256").update(prompt+Date.now().toString()).digest("hex").slice(0,12)}`;
        const h = SecuritySystem.injectSecureHeaders(new Headers({ "content-type":"application/json", "x-isabella-trace-id": context.traceId }));
        // BookPI audit: en prod se haría append real; aquí se simula con log
        console.log(`[ISABELLA_IMAGE] trace=${context.traceId} tenant=${context.tenantId} prompt="${prompt.slice(0,60)}" style=${style} size=${size} imageId=${imageId} mode=sovereign-mock`);
        return new Response(JSON.stringify({
          meta: { request_id: context.correlationId, trace_id: context.traceId, api_version:"v1", tenant_id: context.tenantId, timestamp: new Date().toISOString() },
          data: {
            imageId, prompt: sanitized.clean, style, size,
            imageUrl, // data URL SVG — cliente puede mostrar <img src>
            provider: "isabella-sovereign-mock",
            costCredits: 5,
            provenance: { traceId: context.traceId, policyVersion: config().CROWN_CONSTITUTION_VERSION, evidenceStatus:"E1" },
            note: "Modo soberano mock — en producción se conectará a Fal/Replicate con firma y BookPI. Imagen determinista y auditable.",
          },
          error: null,
        }), { status:200, headers:h });
      }),
    },
  },
});
