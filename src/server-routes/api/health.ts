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
        const stage = url.searchParams.get("stage");
        if (path.endsWith("/live") || stage === "live" || url.searchParams.get("health") === "live") {
          return liveness();
        }
        if (path.endsWith("/ready") || stage === "ready" || url.searchParams.get("health") === "ready") {
          return readiness();
        }
        if (path.endsWith("/deep")) return deepReadiness();
        return readiness();
      },
    },
  },
});

async function liveness(): Promise<Response> {
  // Liveness is intentionally independent of config, DB, Redis, auth and AI.
  // If the process can execute this handler, the node is alive.
  return new Response(
    JSON.stringify({ status: "alive", service: "isabella-ai-genesis", timestamp: new Date().toISOString() }),
    { status: 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } },
  );
}

async function deepReadiness(): Promise<Response> {
  const base = await readiness();
  const body = (await base.json()) as { status: string; checks: Record<string, unknown>; timestamp: string };
  try {
    const cfg = config();
    body.checks.runtime = { ok: true, mode: resolveRuntimeMode(cfg.ISABELLA_RUNTIME_MODE) };
    body.checks.bookpi = { ok: Boolean(cfg.BOOKPI_SIGNING_KEY) };
  } catch {
    body.checks.runtime = { ok: false, error: "configuration_unavailable" };
    body.checks.bookpi = { ok: false, error: "configuration_unavailable" };
  }
  const ok = body.status === "ready" && (body.checks.bookpi as { ok?: boolean }).ok === true;
  return new Response(JSON.stringify({ ...body, status: ok ? "ready" : "not_ready" }), {
    status: ok ? 200 : 503,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

async function readiness(): Promise<Response> {
  const checks: Record<string, { ok: boolean; latencyMs?: number; error?: string }> = {};
  let overallOk = true;

  try {
    const repoHealth = await repositoryFactory.getTenantRepository().health();
    checks.repository = { ok: repoHealth.ok, latencyMs: repoHealth.latencyMs };
    if (!repoHealth.ok) overallOk = false;
  } catch {
    checks.repository = { ok: false, error: "repository_unavailable" };
    overallOk = false;
  }

  try {
    const cfg = config();
    const mode = resolveRuntimeMode(cfg.ISABELLA_RUNTIME_MODE);
    const hasDurableAuthority = Boolean(cfg.DATABASE_URL);
    checks.config = { ok: hasDurableAuthority };
    if (!hasDurableAuthority && isProductionLike(mode)) overallOk = false;
  } catch {
    checks.config = { ok: false, error: "configuration_unavailable" };
    overallOk = false;
  }

  try {
    const auditHealth = await repositoryFactory.getAuditRepository().health();
    checks.audit = { ok: auditHealth.ok, latencyMs: auditHealth.latencyMs };
    if (!auditHealth.ok) overallOk = false;
  } catch {
    checks.audit = { ok: false, error: "audit_unavailable" };
    overallOk = false;
  }

  try {
    const cfg = config();
    const isGenesisConfigured = Boolean(cfg.GEMINI_API_KEY && cfg.CROWN_POLICY_SIGNING_KEY);
    checks.isabella_genesis = { ok: isGenesisConfigured };
    if (!isGenesisConfigured && isProductionLike(resolveRuntimeMode(cfg.ISABELLA_RUNTIME_MODE))) {
      checks.isabella_genesis = { ok: false, error: "genesis_service_unconfigured" };
      overallOk = false;
    }
  } catch {
    checks.isabella_genesis = { ok: false, error: "genesis_service_unavailable" };
    overallOk = false;
  }

  return new Response(JSON.stringify({ status: overallOk ? "ready" : "not_ready", checks, timestamp: new Date().toISOString() }), {
    status: overallOk ? 200 : 503,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
