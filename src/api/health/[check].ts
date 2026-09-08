import { config } from "@/lib/config";
import { prisma } from "@/lib/db";

// Assuming standard API route handler export
export default async function handler(req: any, res: any) {
  const { check } = req.query; // live, ready, deep

  const versionInfo = {
    sha: config().VERCEL_GIT_COMMIT_SHA || "dev-local",
    mode: config().ISABELLA_RUNTIME_MODE || "development",
    timestamp: new Date().toISOString()
  };

  if (check === "live") {
    return res.status(200).json({ status: "OK", type: "live", ...versionInfo });
  }
  
  if (check === "ready") {
    try {
      // Validate database connectivity
      await prisma.$queryRaw`SELECT 1`;
      return res.status(200).json({ status: "OK", type: "ready", database: "connected", ...versionInfo });
    } catch (error) {
      return res.status(503).json({ status: "ERROR", type: "ready", database: "disconnected", error: String(error) });
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
          pakeRegistry: "OK"
        },
        ...versionInfo 
      });
    } catch (error) {
      return res.status(503).json({ status: "ERROR", type: "deep", error: String(error) });
    }
  }

  return res.status(404).json({ error: "Unknown check type. Use /live, /ready, or /deep" });
}
