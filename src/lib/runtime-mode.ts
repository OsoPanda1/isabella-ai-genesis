/**
 * Runtime Mode Resolution & Environment Determination
 * Part of Sovereign Genesis Enterprise Architecture
 */

export type RuntimeMode = "development" | "test" | "staging" | "production";

export function resolveRuntimeMode(): RuntimeMode {
  const env = (process.env.NODE_ENV || "development").toLowerCase();
  if (env === "production" || process.env.VERCEL === "1") {
    return "production";
  }
  if (env === "test" || process.env.VITEST === "true") {
    return "test";
  }
  if (env === "staging") {
    return "staging";
  }
  return "development";
}

export function isProductionLike(): boolean {
  const mode = resolveRuntimeMode();
  return mode === "production" || mode === "staging";
}

export function isDevMode(): boolean {
  return resolveRuntimeMode() === "development";
}

export function isTestMode(): boolean {
  return resolveRuntimeMode() === "test";
}
