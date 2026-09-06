import { createFileRoute } from "@tanstack/react-router";
import { config } from "@/lib/config";
import { SecuritySystem } from "@/lib/security";

function json(headers: Headers, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...Object.fromEntries(SecuritySystem.injectSecureHeaders(new Headers()).entries()),
      "content-type": "application/json",
    },
  });
}

async function dbReachable(): Promise<boolean> {
  try {
    const { Pool } = await import("pg");
    const url = config().DATABASE_URL;
    if (!url) return false;
    const pool = new Pool({ connectionString: url, max: 1 });
    try {
      await pool.query("SELECT 1");
      return true;
    } finally {
      await pool.end();
    }
  } catch {
    return false;
  }
}

async function bookpiValid(): Promise<boolean> {
  try {
    const { createBookpiPostgresRepository } = await import("@/lib/repositories/bookpi-postgres-repository");
    const repo = createBookpiPostgresRepository();
    const result = await repo.verifyIntegrity();
    return result.success;
  } catch {
    return false;
  }
}

async function aiProviderReachable(): Promise<boolean> {
  return Boolean(config().GEMINI_API_KEY);
}

export const Route = createFileRoute("/api/health")({
  async loader({ request }) {
    try {
      const url = new URL(request.url);
      const stage = url.searchParams.get("stage") ?? "live";
      const headers = new Headers({ "content-type": "application/json" });

      switch (stage) {
        case "live": {
          return json(headers, { status: "ok", live: true, stage: "live" });
        }
        case "ready": {
          const db = config().DATABASE_URL ? await dbReachable() : false;
          const ready = db;
          return json(headers, {
            status: ready ? "ok" : "not_ready",
            ready,
            dependencies: { database: db },
          }, ready ? 200 : 503);
        }
        case "deep": {
          const [db, bookpi, ai] = await Promise.all([dbReachable(), bookpiValid(), aiProviderReachable()]);
          const ready = db && bookpi && ai;
          return json(headers, {
            status: ready ? "ok" : "not_ready",
            ready,
            dependencies: { database: db, bookpiLedger: bookpi, aiProvider: ai },
          }, ready ? 200 : 503);
        }
        default:
          return json(headers, { status: "unknown_stage" }, 400);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      return json(new Headers({ "content-type": "application/json" }), { status: "error", message: msg }, 500);
    }
  },
  async action({ request }) {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  },
});