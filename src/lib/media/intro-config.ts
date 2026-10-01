import { loadConfig } from "@/lib/config";

export interface IntroConfig {
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

function fallbackConfig(type: IntroConfig["fallback"]["type"], assetId?: string): IntroConfig {
  return {
    enabled: type !== "none",
    ...(assetId ? { assetId } : {}),
    metadata: { title: INTRO_TITLE, aspectRatio: "16:9" },
    fallback: { type, ...(type === "static" ? { url: FALLBACK_URL } : {}) },
    cacheTtl: CACHE_TTL_SECONDS,
  };
}

export function resolveIntroConfig(): IntroConfig {
  const cfg = loadConfig();
  const fallbackType = cfg.MUX_INTRO_FALLBACK_TYPE ?? "procedural";
  const playbackId = cfg.MUX_PLAYBACK_ID?.trim();
  const assetId = cfg.MUX_INTRO_ASSET_ID?.trim();

  if (!playbackId || !PLAYBACK_ID_PATTERN.test(playbackId)) {
    return fallbackConfig(fallbackType, assetId);
  }
  if (assetId && !ASSET_ID_PATTERN.test(assetId)) {
    return fallbackConfig(fallbackType);
  }

  return {
    enabled: true,
    playbackId,
    ...(assetId ? { assetId } : {}),
    metadata: { title: INTRO_TITLE, aspectRatio: "16:9" },
    fallback: {
      type: fallbackType,
      ...(fallbackType === "static" ? { url: FALLBACK_URL } : {}),
    },
    cacheTtl: CACHE_TTL_SECONDS,
  };
}
