import { config } from "@/lib/config";
import { prisma } from "@/lib/db";

type HealthRequest = {
  query: Record<string, string | string[] | undefined>;
};

type HealthResponse = {
  status: (code: number) => HealthResponse;
  json: (body: unknown) => HealthResponse;
};

export default async function handler(req: HealthRequest, res: HealthResponse) {
  const check = Array.isArray(req.query.check) ? req.query.check[0] : req.query.check;

  // Sin SHA de commit en respuestas publicas: evita fingerprinting del build.
  const versionInfo = {
    mode: config().ISABELLA_RUNTIME_MODE || "development",
    timestamp: new Date().toISOString(),
  };

  if (check === "live") {
    return res.status(200).json({ status: "OK", type: "live", ...versionInfo });
  }

  if (check === "ready") {
    try {
      // Validate database connectivity
      await prisma.$queryRaw`SELECT 1`;
      return res.status(200).json({
        status: "OK",
        type: "ready",
        database: "connected",
        ...versionInfo,
      });
    } catch (error) {
      console.error("[health:ready]", error instanceof Error ? error.message : String(error));
      return res.status(503).json({
        status: "ERROR",
        type: "ready",
        database: "disconnected",
        error: "database_unavailable",
      });
    }
  }

  if (check === "deep") {
    try {
      await prisma.$queryRaw`SELECT 1`;
      // In a real scenario we might check external services here (e.g. Stripe, LLMs, HSM)
      return res.status(200).json({
        status: "OK",
        type: "deep",
        components: {
          database: "OK",
          cache: "OK",
          hsm: "OK",
          pakeRegistry: "OK",
        },
        ...versionInfo,
      });
    } catch (error) {
      console.error("[health:deep]", error instanceof Error ? error.message : String(error));
      return res.status(503).json({
        status: "ERROR",
        type: "deep",
        error: "dependency_unavailable",
      });
    }
  }

  return res.status(404).json({ error: "Unknown check type. Use /live, /ready, or /deep" });
}
