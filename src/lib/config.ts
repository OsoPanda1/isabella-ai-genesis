import { envSchema, requiredEnvKeys, type Env, type RuntimeMode } from "./env-schema";

type RawEnv = NodeJS.ProcessEnv;

let cached: Env | undefined;
let loadError: string | null = null;

function resolveEnv(source: RawEnv): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Configuración de entorno inválida: ${issues}`);
  }
  return parsed.data;
}

function assertRequired(mode: RuntimeMode, source: RawEnv): void {
  const required = requiredEnvKeys(mode);
  for (const key of required) {
    const raw = source[key];
    if (raw === undefined || raw === null || raw === "") {
      throw new Error(`Variable de entorno obligatoria no definida en modo "${mode}": ${String(key)}`);
    }
  }
}

function assertProductionCrypto(mode: RuntimeMode, parsed: Env): void {
  if ((mode === "production" || mode === "staging") && parsed.BOOKPI_SIGNATURE_ALGORITHM === "ML-DSA-87") {
    throw new Error(
      "CRITICAL_SECURITY_ERROR: ML-DSA-87 no es un proveedor criptográfico productivo en este runtime. " +
        "Producción y staging requieren ECDSA-P384 o RSA-SHA256 hasta integrar un proveedor ML-DSA real.",
    );
  }
}

export function loadConfig(source: RawEnv = process.env): Env {
  if (cached) return cached;

  const effectiveSource: RawEnv = {
    ...source,
    DATABASE_URL:
      source.DATABASE_URL ??
      source.NEON_DATABASE_POSTGRES_URL ??
      source.NEON_DATABASE_DATABASE_URL ??
      source.SUPABASE_DATABASE_POSTGRES_URL,
    ISABELLA_STORAGE_PROVIDER:
      source.ISABELLA_STORAGE_PROVIDER ??
      ((source.DATABASE_URL ?? source.NEON_DATABASE_POSTGRES_URL) ? "postgres" : undefined),
  };
  const parsed = resolveEnv(effectiveSource);
  const mode: RuntimeMode = parsed.ISABELLA_RUNTIME_MODE;

  try {
    assertRequired(mode, effectiveSource);
    assertProductionCrypto(mode, parsed);
    if (mode === "production" || mode === "staging") {
      if (parsed.DURABLE_JSON_ALLOWED) {
        throw new Error("DURABLE_JSON_ALLOWED debe ser false en modos no locales");
      }
      if (parsed.AUTH_DEV_SESSION_ENABLED) {
        throw new Error("AUTH_DEV_SESSION_ENABLED debe estar desactivado");
      }
      if (!parsed.DATABASE_URL && !(parsed.SUPABASE_URL && parsed.AUTH_JWT_SECRET)) {
        throw new Error("Se requiere autoridad durable: DATABASE_URL o Supabase con AUTH_JWT_SECRET");
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    loadError = msg;
    if (mode === "production" || mode === "staging") {
      throw new Error(`[SovereignConfig Fail-Fast] ${msg}`);
    }
  }

  cached = parsed;
  return parsed;
}

export function getConfigLoadError(): string | null {
  return loadError;
}

export function isStorageProviderExplicitlyDeclared(source: RawEnv = process.env): boolean {
  const raw = source.ISABELLA_STORAGE_PROVIDER;
  return typeof raw === "string" && raw.trim() !== "";
}

export function isCiEnvironment(source: RawEnv = process.env): boolean {
  return source.GITHUB_ACTIONS === "true" || source.CI === "true";
}

export function getCiRunId(source: RawEnv = process.env): string {
  return source.GITHUB_RUN_ID ?? "local";
}

export function isPayoutCircuitCertified(source: RawEnv = process.env): boolean {
  const raw = source.ISABELLA_PAYOUT_CIRCUIT_CERTIFIED;
  if (typeof raw === "boolean") return raw;
  if (typeof raw !== "string") return false;
  return raw.trim().toLowerCase() === "true";
}

export function resetConfigCache(): void {
  cached = undefined;
  loadError = null;
}

export function config(): Env {
  if (!cached) return loadConfig();
  return cached;
}

export type { Env, RuntimeMode } from "./env-schema";
