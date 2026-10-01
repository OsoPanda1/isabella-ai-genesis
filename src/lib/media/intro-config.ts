import { loadConfig } from "../config";

export interface IntroMediaMetadata {
  title?: string;
  duration?: number;
  aspectRatio?: string;
}

export interface IntroConfig {
  enabled: boolean;
  playbackId?: string;
  assetId?: string;
  metadata?: IntroMediaMetadata;
  fallback: {
    type: "static" | "procedural" | "none";
    url?: string;
  };
  cacheTtl: number;
}

export const INTRO_CACHE_TTL_SECONDS = 60;
export const INTRO_FALLBACK_URL = "/assets/isabella-intro-backdrop.png";
export const INTRO_TITLE = "Isabella AI Genesis - Cinematic Introduction";
export const MUX_PLAYBACK_ID_PATTERN = /^[A-Za-z0-9_-]{3,128}$/;
export const MUX_ASSET_ID_PATTERN = /^[A-Za-z0-9_-]{3,128}$/;

export function fallbackIntroConfig(
  type: IntroConfig["fallback"]["type"],
  assetId?: string,
): IntroConfig {
  return {
    enabled: type !== "none",
    assetId,
    metadata: { title: INTRO_TITLE, aspectRatio: "16:9" },
    fallback: { type, url: type === "static" ? INTRO_FALLBACK_URL : undefined },
    cacheTtl: INTRO_CACHE_TTL_SECONDS,
  };
}

export function resolveIntroConfig(): IntroConfig {
  const cfg = loadConfig();
  const fallbackType = cfg.MUX_INTRO_FALLBACK_TYPE ?? "procedural";
  const playbackId = cfg.MUX_PLAYBACK_ID?.trim();
  const assetId = cfg.MUX_INTRO_ASSET_ID?.trim();

  if (!playbackId || !MUX_PLAYBACK_ID_PATTERN.test(playbackId)) {
    return fallbackIntroConfig(fallbackType, assetId);
  }
  if (assetId && !MUX_ASSET_ID_PATTERN.test(assetId)) {
    return fallbackIntroConfig(fallbackType);
  }

  return {
    enabled: true,
    playbackId,
    assetId,
    metadata: { title: INTRO_TITLE, aspectRatio: "16:9" },
    fallback: {
      type: fallbackType,
      url: fallbackType === "static" ? INTRO_FALLBACK_URL : undefined,
    },
    cacheTtl: INTRO_CACHE_TTL_SECONDS,
  };
}
