/**
 * Health & Readiness Endpoint (src/server-routes/api/health.ts)
 */
import type { Request, Response } from "express";
import { evaluateProductionAuthorities } from "../../lib/production-authority";
import { checkRuntimeIntegrity } from "../../lib/runtime-integrity";

export async function handleHealthCheck(req: Request, res: Response): Promise<void> {
  const authorities = evaluateProductionAuthorities();
  const integrity = checkRuntimeIntegrity();

  const isHealthy = authorities.ready && integrity.ok;
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "HEALTHY" : "DEGRADED",
    timestamp: new Date().toISOString(),
    uptimeSeconds: integrity.uptimeSeconds,
    memoryUsageMb: integrity.memoryUsageMb,
    authorities: authorities.authorities.map((a) => ({ name: a.name, status: a.status })),
  });
}

export default { handleHealthCheck };
