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
          territory: {
            name: "Real del Monte (Mineral del Monte)",
            state: "Hidalgo, México",
            elevationMeters: 2700,
            digitalTwinVersion: "v4.3-NodoCero",
            lastSimulationRun: new Date().toISOString(),
            sustainabilityIndex: 0.94,
            heritageIntegrityScore: 0.96,
            economicLocalRetentionPct: 88.5,
            carbonFootprintMitigationPct: 79.2,
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
          simulation: {
            carryingCapacityStatus:
              carryingCapacityRatio > 1.1
                ? "OVER_CAPACITY_ALERT"
                : carryingCapacityRatio > 0.85
                  ? "OPTIMAL_HIGH"
                  : "NORMAL",
            preservationIntegrityScore: Number(preservationScore.toFixed(3)),
            economicVibrancyScore: Number(economicVibrancy.toFixed(3)),
            estimatedDailyLocalRetentionUsd: Number(estimatedLocalImpactUsd.toFixed(2)),
            mitigationActions: [
              "Habilitar estacionamientos satélite en Peñas Cargadero para evitar colapso vial en Centro Histórico.",
              "Canalizar 5% de consumos turísticos hacia el fondo de mantenimiento del Panteón Inglés.",
              "Desplegar alertas geolocalizadas hacia Mina La Dificultad para redistribuir flujo de visitantes.",
            ],
          },
        });
      }),
    },
  },
});
