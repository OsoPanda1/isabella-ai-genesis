import { createFileRoute } from "@tanstack/react-router";
import { loadConfig } from "@/lib/config";
import { SecuritySystem } from "@/lib/security";
import { ObservabilityService } from "@/lib/telemetry/observability";

interface IntroConfig {
  enabled: boolean;
  playbackId?: string;
  assetId?: string;
  metadata?: {
    title?: string;
    duration?: number;
    aspectRatio?: string;
  };
  fallback: {
    type: "static" | "procedural" | "none";
    url?: string;
  };
  cacheTtl: number;
}

const CACHE_TTL_SECONDS = 60;
const FALLBACK_URL = "/assets/isabella-intro-backdrop.png";
const INTRO_TITLE = "Isabella AI Genesis — Cinematic Introduction";
const PLAYBACK_ID_PATTERN = /^[A-Za-z0-9_-]{3,128}$/;
const ASSET_ID_PATTERN = /^[A-Za-z0-9_-]{3,128}$/;

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

function fallbackConfig(
  type: IntroConfig["fallback"]["type"],
  assetId?: string,
  metadata?: IntroConfig["metadata"],
): IntroConfig {
  return {
    enabled: type !== "none",
    assetId,
    metadata: {
      title: INTRO_TITLE,
      aspectRatio: "16:9",
      ...metadata,
    },
    fallback: {
      type,
      url: type === "static" ? FALLBACK_URL : undefined,
    },
    cacheTtl: CACHE_TTL_SECONDS,
  };
}

function recordIntroRequest(startTime: number, result: "mux" | "fallback" | "disabled" | "error") {
  try {
    ObservabilityService.recordEvent(performance.now() - startTime, result === "error" ? 1 : 0);
  } catch {
    // Observability must never change the intro media contract.
  }
}

async function resolveIntroConfig(): Promise<IntroConfig> {
  const cfg = loadConfig();
  const fallbackType = cfg.MUX_INTRO_FALLBACK_TYPE ?? "static";
  const configuredPlaybackId = cfg.MUX_PLAYBACK_ID?.trim();
  const requestedAssetId = cfg.MUX_INTRO_ASSET_ID?.trim();
  const tokenId = cfg.MUX_TOKEN_ID?.trim();
  const tokenSecret = cfg.MUX_TOKEN_SECRET?.trim();

  if (configuredPlaybackId && PLAYBACK_ID_PATTERN.test(configuredPlaybackId) && !requestedAssetId) {
    return {
      enabled: true,
      playbackId: configuredPlaybackId,
      metadata: { title: INTRO_TITLE, aspectRatio: "16:9" },
      fallback: {
        type: fallbackType,
        url: fallbackType === "static" ? FALLBACK_URL : undefined,
      },
      cacheTtl: CACHE_TTL_SECONDS,
    };
  }

  if (!tokenId || !tokenSecret || !requestedAssetId || !ASSET_ID_PATTERN.test(requestedAssetId)) {
    return fallbackConfig(fallbackType, requestedAssetId);
  }

  const endpoint = `https://api.mux.com/video/v1/assets/${encodeURIComponent(requestedAssetId)}`;
  const authorization = `Basic ${Buffer.from(`${tokenId}:${tokenSecret}`).toString("base64")}`;
  const response = await SecuritySystem.fetchSafeUpstream(endpoint, {
    headers: { authorization, accept: "application/json" },
    signal: AbortSignal.timeout(Math.min(cfg.LLM_UPSTREAM_TIMEOUT_MS, 5000)),
  });

  if (!response.ok) throw new Error(`mux_asset_http_${response.status}`);

  const payload = (await response.json()) as {
    data?: {
      id?: string;
      status?: string;
      duration?: number;
      aspect_ratio?: string;
      playback_ids?: Array<{ id?: string; policy?: string }>;
    };
  };
  const asset = payload.data;

  if (!asset || asset.id !== requestedAssetId || asset.status !== "ready") {
    return fallbackConfig(fallbackType, requestedAssetId, {
      aspectRatio: asset?.aspect_ratio,
      duration: asset?.duration,
    });
  }

  const playbackId = asset.playback_ids?.find((candidate) => candidate.policy === "public")?.id;
  if (!playbackId || !PLAYBACK_ID_PATTERN.test(playbackId)) {
    return fallbackConfig(fallbackType, requestedAssetId, {
      aspectRatio: asset.aspect_ratio,
      duration: asset.duration,
    });
  }

  return {
    enabled: true,
    playbackId,
    assetId: requestedAssetId,
    metadata: {
      title: INTRO_TITLE,
      aspectRatio: asset.aspect_ratio ?? "16:9",
      duration: asset.duration,
    },
    fallback: {
      type: fallbackType,
      url: fallbackType === "static" ? FALLBACK_URL : undefined,
    },
    cacheTtl: CACHE_TTL_SECONDS,
  };
}

export const Route = createFileRoute("/api/mux-intro")({
  server: {
    handlers: {
      GET: async () => {
        const startTime = performance.now();
        try {
          const resolved = await resolveIntroConfig();
          recordIntroRequest(
            startTime,
            resolved.playbackId ? "mux" : resolved.enabled ? "fallback" : "disabled",
          );
          return json(resolved);
        } catch {
          const cfg = loadConfig();
          const fallbackType = cfg.MUX_INTRO_FALLBACK_TYPE ?? "static";
          recordIntroRequest(startTime, "error");
          return json(fallbackConfig(fallbackType), 503);
        }
      },
    },
  },
});
