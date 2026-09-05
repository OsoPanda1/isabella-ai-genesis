import { createFileRoute } from "@tanstack/react-router";
import { repositoryFactory } from "@/lib/persistence/repository-factory";
import { config } from "@/lib/config";
import { isProductionLike, resolveRuntimeMode } from "@/lib/runtime-mode";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const path = url.pathname;

        if (path.endsWith("/live")) {
          return liveness();
        }
        if (path.endsWith("/ready")) {
          return readiness();
        }
        // Default health
        return readiness();
      },
    },
  },
});

async function liveness(): Promise<Response> {
  // Liveness: process alive, no external dependencies
  return new Response(
    JSON.stringify({
      status: "alive",
      version: config().CROWN_CONSTITUTION_VERSION ?? "v4.2.0",
      timestamp: new Date().toISOString(),
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

async function readiness(): Promise<Response> {
  const checks: Record<string, { ok: boolean; latencyMs?: number; error?: string }> = {};
  let overallOk = true;

  // Repository health
  try {
    const repoHealth = await repositoryFactory.getTenantRepository().health();
    checks.repository = { ok: repoHealth.ok, latencyMs: repoHealth.latencyMs };
    if (!repoHealth.ok) overallOk = false;
  } catch (e) {
    checks.repository = { ok: false, error: "repository_unavailable" };
    overallOk = false;
  }

  // Config health
  try {
    const cfg = config();
    const mode = resolveRuntimeMode(cfg.ISABELLA_RUNTIME_MODE);
    const hasDurableAuthority = Boolean(
      (cfg.SUPABASE_URL && cfg.AUTH_JWT_SECRET) || cfg.DATABASE_URL,
    );
    checks.config = { ok: hasDurableAuthority };
    if (!hasDurableAuthority && isProductionLike(mode)) overallOk = false;
  } catch (e) {
    checks.config = { ok: false, error: "configuration_unavailable" };
    overallOk = false;
  }

  // Audit repository
  try {
    const auditHealth = await repositoryFactory.getAuditRepository().health();
    checks.audit = { ok: auditHealth.ok, latencyMs: auditHealth.latencyMs };
  } catch (e) {
    checks.audit = { ok: false, error: "audit_unavailable" };
  }

  const status = overallOk ? 200 : 503;
  return new Response(
    JSON.stringify({
      status: overallOk ? "ready" : "not_ready",
      checks,
      timestamp: new Date().toISOString(),
    }),
    { status, headers: { "content-type": "application/json" } },
  );
}
