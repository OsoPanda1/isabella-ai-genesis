import { createFileRoute } from "@tanstack/react-router";
import { config } from "@/lib/config";

export const Route = createFileRoute("/api/health/live" as any)({
  server: {
    handlers: {
      GET: async () => {
        return new Response(
          JSON.stringify({
            status: "alive",
            version: config().CROWN_CONSTITUTION_VERSION ?? "v4.2.0",
            timestamp: new Date().toISOString(),
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});
