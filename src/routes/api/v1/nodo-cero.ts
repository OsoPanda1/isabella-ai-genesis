import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { NODO_CERO_TWIN, RDM_SOVEREIGN_COMMERCE } from "@/lib/skills/osopanda-ecosystem-pack";
import { z } from "zod";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: SecuritySystem.injectSecureHeaders(
      new Headers({
        "content-type": "application/json; charset=utf-8",
      }),
    ),
  });
}

const merchantSchema = z.object({
  action: z.enum(["register-merchant", "telemetry"]),
  merchantName: z.string().min(2).max(100).optional(),
  category: z
    .enum([
      "PASTES_TRADICIONALES",
      "PLATERIA_ARTESANAL",
      "GUIA_COMUNITARIO",
      "HOSPEDAJE_TIPICO",
      "CAFE_GASTRONOMIA",
    ])
    .optional(),
  localIngredientsVerified: z.boolean().optional(),
  fairLaborVerified: z.boolean().optional(),
  zone: z
    .enum([
      "CENTRO_HISTORICO",
      "MINA_ACOSTA",
      "MINA_DIFICULTAD",
      "PANTEON_INGLES",
      "PENAS_CARGADERO",
    ])
    .optional(),
});

export const Route = createFileRoute("/api/v1/nodo-cero")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async (context, request) => {
        const url = new URL(request.url);
        const zoneParam = url.searchParams.get("zone") as
          | "CENTRO_HISTORICO"
          | "MINA_ACOSTA"
          | "MINA_DIFICULTAD"
          | "PANTEON_INGLES"
          | "PENAS_CARGADERO"
          | null;

        const result = await NODO_CERO_TWIN.run(
          { zone: zoneParam ?? undefined, includeSensors: true, includeHeritageStatus: true },
          {
            requestId: context.traceId,
            actorId: context.userId,
            locale: "es-MX",
            federation: "TERRITORY",
            intent: "QUERY_TERRITORIAL_TWIN",
          },
        );

        return json({
          success: true,
          traceId: context.traceId,
          ...result.data,
        });
      }),

      POST: withSovereignAuth("system", "execute", async (context, request) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "JSON inválido en el cuerpo de la petición." }, 400);
        }

        const parsed = merchantSchema.safeParse(body);
        if (!parsed.success) {
          return json({ error: "Datos no válidos", details: parsed.error.issues }, 400);
        }

        if (parsed.data.action === "register-merchant") {
          if (!parsed.data.merchantName || !parsed.data.category) {
            return json({ error: "Nombre de comercio y categoría requeridos." }, 400);
          }

          const result = await RDM_SOVEREIGN_COMMERCE.run(
            {
              merchantName: parsed.data.merchantName,
              category: parsed.data.category,
              localIngredientsVerified: parsed.data.localIngredientsVerified ?? false,
              fairLaborVerified: parsed.data.fairLaborVerified ?? false,
            },
            {
              requestId: context.traceId,
              actorId: context.userId,
              locale: "es-MX",
              federation: "ECONOMY",
              intent: "REGISTER_SOVEREIGN_MERCHANT",
            },
          );

          return json({
            success: result.status === "SUCCESS" || result.status === "PARTIAL",
            traceId: context.traceId,
            result: result.data,
            summary: result.summary,
            warnings: result.warnings,
          });
        }

        // Action telemetry
        const twinResult = await NODO_CERO_TWIN.run(
          { zone: parsed.data.zone, includeSensors: true },
          {
            requestId: context.traceId,
            actorId: context.userId,
            locale: "es-MX",
            federation: "TERRITORY",
            intent: "QUERY_TERRITORIAL_TWIN",
          },
        );

        return json({
          success: true,
          traceId: context.traceId,
          ...twinResult.data,
        });
      }),
    },
  },
});
