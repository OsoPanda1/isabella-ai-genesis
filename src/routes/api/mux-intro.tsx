import { createFileRoute } from "@tanstack/react-router";
import { SecuritySystem } from "@/lib/security";
import { ObservabilityService } from "@/lib/telemetry/observability";
import {
  fallbackIntroConfig,
  resolveIntroConfig,
  type IntroConfig,
} from "@/lib/media/intro-config";

function json(data: IntroConfig, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: SecuritySystem.injectSecureHeaders(
      new Headers({
        "content-type": "application/json; charset=utf-8",
        "cache-control": `private, max-age=${data.cacheTtl}, stale-while-revalidate=300`,
        "x-cache-status": "MISS",
      }),
    ),
  });
}

function recordIntroRequest(startTime: number, result: "mux" | "fallback" | "disabled" | "error") {
  try {
    ObservabilityService.recordEvent(performance.now() - startTime, result === "error" ? 1 : 0);
  } catch {
    // Observability never changes the media response contract.
  }
}

export const Route = createFileRoute("/api/mux-intro")({
  server: {
    handlers: {
      GET: async () => {
        const startTime = performance.now();
        try {
          const resolved = resolveIntroConfig();
          recordIntroRequest(
            startTime,
            resolved.playbackId ? "mux" : resolved.enabled ? "fallback" : "disabled",
          );
          return json(resolved);
        } catch {
          recordIntroRequest(startTime, "error");
          return json(fallbackIntroConfig("procedural"), 503);
        }
      },
    },
  },
});
