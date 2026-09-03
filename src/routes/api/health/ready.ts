import { createFileRoute } from "@tanstack/react-router";
import { repositoryFactory } from "@/lib/persistence/repository-factory";
import { config } from "@/lib/config";

export const Route = createFileRoute("/api/health/ready" as any)({
  server: {
    handlers: {
      GET: async () => {
        const checks: Record<string, { ok: boolean; latencyMs?: number; error?: string }> = {};
        let overallOk = true;
        try {
          const repoHealth = await repositoryFactory.getTenantRepository().health();
          checks.repository = { ok: repoHealth.ok, latencyMs: repoHealth.latencyMs };
          if (!repoHealth.ok) overallOk = false;
        } catch (e) {
          checks.repository = { ok: false, error: e instanceof Error ? e.message : String(e) };
          overallOk = false;
        }
        try {
          const auditHealth = await repositoryFactory.getAuditRepository().health();
          checks.audit = { ok: auditHealth.ok, latencyMs: auditHealth.latencyMs };
        } catch (e) {
          checks.audit = { ok: false, error: e instanceof Error ? e.message : String(e) };
        }
        try {
          const cfg = config();
          checks.config = { ok: !!cfg.SUPABASE_URL && !!cfg.AUTH_JWT_SECRET };
          if (cfg.NODE_ENV === "production" && !checks.config.ok) overallOk = false;
        } catch (e) {
          checks.config = { ok: false, error: e instanceof Error ? e.message : String(e) };
          overallOk = false;
        }
        const status = overallOk ? 200 : 503;
        return new Response(JSON.stringify({ status: overallOk ? "ready" : "not_ready", checks, timestamp: new Date().toISOString() }), {
          status,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
