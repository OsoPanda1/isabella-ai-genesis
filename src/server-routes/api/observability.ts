import { createFileRoute } from "@tanstack/react-router";
import { ObservabilityService } from "../../lib/telemetry/observability";
import { getPersistedObservabilityOverview } from "../../lib/telemetry/observability-repository";

export const Route = createFileRoute("/api/observability")({
  server: {
    handlers: {
      GET: async () => {
        const snapshot = ObservabilityService.getSnapshot();
        const persisted = await getPersistedObservabilityOverview();
        return new Response(
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
            snapshot,
            persisted,
          }),
          { headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});
