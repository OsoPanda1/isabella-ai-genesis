import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
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

const simulationSchema = z.object({
  visitorInfluxDaily: z.number().min(100).max(50000).default(3500),
  activeMerchantsCount: z.number().min(10).max(2000).default(180),
  preservationFundingCredits: z.number().min(0).max(1000000).default(25000),
});

export const Route = createFileRoute("/api/v1/territorial-twin")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async (_ctx) => {
        return json({
          success: true,
          // Datos de referencia (hechos estáticos del territorio). Los índices
          // NO existen sin una fuente instrumentada: se devuelven null con
          // estado explícito en lugar de valores fabricados (ISA-448).
          territory: {
            name: "Real del Monte (Mineral del Monte)",
            state: "Hidalgo, México",
            elevationMeters: 2700,
            digitalTwinVersion: "v4.3-NodoCero",
            lastSimulationRun: null,
            sustainabilityIndex: null,
            heritageIntegrityScore: null,
            economicLocalRetentionPct: null,
            carbonFootprintMitigationPct: null,
            metricsStatus: "NO_DATA",
            metricsNote:
              "Sin telemetría territorial conectada no se declara ningún índice. Requiere fuente instrumentada.",
          },
        });
      }),

      POST: withSovereignAuth("system", "execute", async (context, request) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          body = {};
        }

        const parsed = simulationSchema.safeParse(body);
        if (!parsed.success) {
          return json(
            { error: "Parámetros de simulación inválidos.", details: parsed.error.issues },
            400,
          );
        }

        const { visitorInfluxDaily, activeMerchantsCount, preservationFundingCredits } =
          parsed.data;

        // Mathematical modeling for territorial twin simulation
        const carryingCapacityRatio = visitorInfluxDaily / 4500;
        const economicVibrancy = Math.min(1.0, (activeMerchantsCount * 12) / 2000);
        const preservationScore = Math.max(
          0.6,
          Math.min(
            1.0,
            0.95 -
              (carryingCapacityRatio > 1 ? (carryingCapacityRatio - 1) * 0.2 : 0) +
              (preservationFundingCredits / 100000) * 0.1,
          ),
        );
        const estimatedLocalImpactUsd = visitorInfluxDaily * 42.5;

        return json({
          success: true,
          traceId: context.traceId,
          // Modelo heurístico con parámetros del solicitante: NO es medición.
          simulation: {
            model: "heuristic-v1",
            evidenceStatus: "E3",
            dataSources: [],
            instrumented: false,
            carryingCapacityStatus:
              carryingCapacityRatio > 1.1
                ? "OVER_CAPACITY_ALERT"
                : carryingCapacityRatio > 0.85
                  ? "OPTIMAL_HIGH"
                  : "NORMAL",
            preservationIntegrityScore: Number(preservationScore.toFixed(3)),
            economicVibrancyScore: Number(economicVibrancy.toFixed(3)),
            estimatedDailyLocalRetentionUsd: Number(estimatedLocalImpactUsd.toFixed(2)),
            estimatedDailyLocalRetentionNote:
              "Heurística fija de 42.5 USD por visitante-día; no derivada de medición.",
            mitigationActions: [
              "Habilitar estacionamientos satélite en Peñas Cargadero para evitar colapso vial en Centro Histórico.",
              "Canalizar 5% de consumos turísticos hacia el fondo de mantenimiento del Panteón Inglés.",
              "Desplegar alertas geolocalizadas hacia Mina La Dificultad para redistribuir flujo de visitantes.",
            ],
            mitigationActionsNote:
              "Recomendaciones estáticas de catálogo, no generadas por simulación.",
          },
        });
      }),
    },
  },
});
