import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CATALOG_ENTRIES } from "@/lib/api-catalog";
import { routeRequest } from "@/lib/crown";

const searchSchema = z.object({
  domain: z.string().optional(),
  query: z.string().optional(),
});

const executeSchema = z.object({
  id: z.string(),
  method: z.string(),
  path: z.string(),
  params: z.any().optional(),
});

export const Route = createFileRoute("/api/catalog")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const domain = url.searchParams.get("domain") || undefined;
        const query = url.searchParams.get("query") || undefined;

        let items = CATALOG_ENTRIES;

        if (domain) {
          items = items.filter((i) => i.domain === domain);
        }

        if (query) {
          const lower = query.toLowerCase();
          items = items.filter(
            (i) =>
              i.id.toLowerCase().includes(lower) ||
              i.path.toLowerCase().includes(lower) ||
              i.description.toLowerCase().includes(lower),
          );
        }

        return new Response(
          JSON.stringify({
            schema: "isabella.api.catalog.v1",
            total: CATALOG_ENTRIES.length,
            count: items.length,
            items,
          }),
          {
            headers: { "content-type": "application/json" },
          },
        );
      },

      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const parsed = executeSchema.safeParse(body);
          if (!parsed.success) {
            return new Response(JSON.stringify({ error: "Contrato de ejecución inválido." }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const { id, method, path, params } = parsed.data;
          const entry = CATALOG_ENTRIES.find((e) => e.id === id);

          if (!entry) {
            return new Response(
              JSON.stringify({ error: "Contrato no registrado en el catálogo de Isabella." }),
              {
                status: 404,
                headers: { "content-type": "application/json" },
              },
            );
          }

          // Evaluate the request constitutionally using our deterministic C.R.O.W.N. router!
          const mockInput = `Invocación nativa del contrato ${id} [${method} ${path}] con parámetros: ${JSON.stringify(params || {})}`;
          const { decision, auditEvents } = routeRequest(mockInput);

          const traceId = decision.traceId;
          const latencyMs = Math.floor(Math.random() * 85) + 12;

          return new Response(
            JSON.stringify({
              traceId,
              contractId: id,
              method,
              path,
              governanceScore: decision.policy.risk === "none" ? 1.0 : 0.8,
              decisionStatus: decision.policy.status,
              riskLevel: decision.policy.risk,
              allowedTools: decision.allowedTools,
              latencyMs,
              auditTrail: auditEvents,
              responsePayload: entry.mockResponse || { status: "simulated_success", resource: id },
            }),
            {
              headers: { "content-type": "application/json" },
            },
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ error: "Error en simulación nativa de contrato." }),
            {
              status: 500,
              headers: { "content-type": "application/json" },
            },
          );
        }
      },
    },
  },
});
