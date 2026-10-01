import { createFileRoute } from "@tanstack/react-router";
import { resolveIntroConfig, type IntroConfig } from "@/lib/media/intro-config";
import { SecuritySystem } from "@/lib/security";
import { ObservabilityService } from "@/lib/telemetry/observability";

function json(data: IntroConfig, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: SecuritySystem.injectSecureHeaders(
      new Headers({
        "content-type": "application/json; charset=utf-8",
        "cache-control": "private, max-age=" + data.cacheTtl + ", stale-while-revalidate=300",
        "x-cache-status": "MISS",
      }),
    ),
  });
}

export const Route = createFileRoute("/api/mux-intro")({
  server: {
    handlers: {
      GET: async () => {
        const started = performance.now();
        try {
          const resolved = resolveIntroConfig();
          ObservabilityService.recordEvent(
            performance.now() - started,
            resolved.playbackId ? 0 : resolved.enabled ? 0 : 1,
          );
          return json(resolved);
        } catch {
          try {
            ObservabilityService.recordEvent(performance.now() - started, 1);
          } catch {
            // Observability is non-blocking for media configuration.
          }
          return json(
            {
              enabled: false,
              fallback: { type: "procedural" },
              cacheTtl: 60,
            },
            503,
          );
        }
      },
    },
  },
});
