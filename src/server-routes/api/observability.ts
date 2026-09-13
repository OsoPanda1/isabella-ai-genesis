import { createFileRoute } from "@tanstack/react-router";
import { ObservabilityService } from "../../lib/telemetry/observability";

export const Route = createFileRoute("/api/observability")({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          JSON.stringify({
            schema: "isabella.observability.v1",
            status: "ok",
            capabilities: [
              "overview",
              "query",
              "notebooks",
              "alerts",
              "custom-metrics",
              "compute",
              "functions",
              "agent-runs",
              "sandboxes",
              "cron-jobs",
              "external-apis",
              "middleware",
              "runtime-cache",
            ],
            snapshot: ObservabilityService.getSnapshot(),
          }),
          { headers: { "content-type": "application/json" } },
        ),
    },
  },
});
