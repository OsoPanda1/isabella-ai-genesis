import { config, getConfigLoadError, resetConfigCache } from "./config";
import { buildManifest } from "./build-manifest";
import { capabilityRegistry } from "./capability-registry";
import { resolveRuntimeMode } from "./runtime-mode";
import { evaluateProductionAuthorities } from "./production-authority";

/**
 * INTEGRIDAD DEL RUNTIME (src/lib/runtime-integrity.ts)
 * -----------------------------------------------------------------
 * Verifica versión/schema/config y el registro de capacidades ANTES
 * de arrancar. Aborta (o degrada a modo conservador) si la
 * configuración es inválida o faltan dependencias obligatorias.
 */

export type IntegrityStatus = "ok" | "degraded" | "failed";

export interface IntegrityResult {
  status: IntegrityStatus;
  mode: string;
  configError: string | null;
  manifestValid: boolean;
  requiredCapabilities: Record<string, string>;
  checkedAt: string;
}

export function verifyRuntimeIntegrity(options?: {
  strict?: boolean;
  reloadConfig?: boolean;
}): IntegrityResult {
  const strict = options?.strict ?? false;
  if (options?.reloadConfig) {
    resetConfigCache();
    config();
  } else {
    config(); // fuerza carga
  }

  const configError = getConfigLoadError();
  // config() ya forzó la carga arriba; el modo sale del contrato (§12).
  const mode = resolveRuntimeMode(config().NODE_ENV);

  let status: IntegrityStatus = "ok";
  if (configError) status = "failed";

  const required = ["auth", "tenancy", "audit", "memory", "bookpi", "crown"];
  const requiredCapabilities: Record<string, string> = {};
  for (const cap of required) {
    const state = capabilityRegistry.stateOf(cap);
    requiredCapabilities[cap] = state;
    // En modo estricto/producción, las capacidades clave deben estar operativas.
    if (strict && !capabilityRegistry.isOperational(cap)) {
      status = status === "failed" ? "failed" : "degraded";
    }
  }

  const manifest = buildManifest("server");
  const manifestValid = manifest.sourceHash.length === 64;

  // Autoridades de producción: un fallo crítico degrada (nunca aborta el
  // arranque aquí; /ready reporta 503 y el operador decide el rollout).
  try {
    const authorities = evaluateProductionAuthorities();
    if (authorities.criticalFailed) {
      status = status === "failed" ? "failed" : "degraded";
    }
  } catch {
    status = status === "failed" ? "failed" : "degraded";
  }

  return {
    status,
    mode,
    configError,
    manifestValid,
    requiredCapabilities,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Comprueba que el runtime puede arrancar; lanza si no en modo estricto.
 */
export function ensureRuntimeReady(strict = false): IntegrityResult {
  const result = verifyRuntimeIntegrity({ strict });
  if (result.status === "failed" && strict) {
    throw new Error(
      `Runtime no listo: ${result.configError ?? "capacidades faltantes"}`,
    );
  }
  return result;
}
