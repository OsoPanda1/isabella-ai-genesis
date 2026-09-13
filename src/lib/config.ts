import { envSchema, requiredEnvKeys, type Env, type RuntimeMode } from "./env-schema";

type RawEnv = NodeJS.ProcessEnv;

let cached: Env | undefined;
let loadError: string | null = null;

function resolveEnv(source: RawEnv): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Configuración de entorno inválida: ${issues}`);
  }
  return parsed.data;
}

function assertRequired(mode: RuntimeMode, source: RawEnv): void {
  const required = requiredEnvKeys(mode);
  for (const key of required) {
    const raw = source[key];
    if (raw === undefined || raw === null || raw === "") {
      throw new Error(
        `Variable de entorno obligatoria no definida en modo "${mode}": ${String(key)}`,
      );
    }
  }
}

function assertProductionCrypto(mode: RuntimeMode, parsed: Env): void {
  if (
    (mode === "production" || mode === "staging") &&
    parsed.BOOKPI_SIGNATURE_ALGORITHM === "ML-DSA-87"
  ) {
    throw new Error(
      "CRITICAL_SECURITY_ERROR: ML-DSA-87 no es un proveedor criptográfico productivo en este runtime. " +
        "Producción y staging requieren ECDSA-P384 o RSA-SHA256 hasta integrar un proveedor ML-DSA real.",
    );
  }
}

function assertProductionStorageProvider(mode: RuntimeMode, source: RawEnv, parsed: Env): void {
  if (mode !== "production" && mode !== "staging") return;
  const rawProvider = source.ISABELLA_STORAGE_PROVIDER;
  if (typeof rawProvider !== "string" || rawProvider.trim() === "") {
    throw new Error(
      "ISABELLA_STORAGE_PROVIDER debe declararse explícitamente como postgres o neon en staging/production.",
    );
  }
  const provider = rawProvider.trim().toLowerCase();
  if (provider !== "postgres" && provider !== "neon") {
    throw new Error(
      `ISABELLA_STORAGE_PROVIDER=\"${provider}\" no es una autoridad durable válida en staging/production. Permitidos: postgres|neon.`,
    );
  }
  if (parsed.ISABELLA_STORAGE_PROVIDER !== provider) {
    throw new Error("ISABELLA_STORAGE_PROVIDER no coincide con el proveedor normalizado.");
  }
}

export function loadConfig(source: RawEnv = process.env): Env {
  if (cached) return cached;

  const isProductionLikeRaw =
    source.ISABELLA_RUNTIME_MODE === "production" ||
    source.ISABELLA_RUNTIME_MODE === "staging" ||
    source.NODE_ENV === "production";

  const effectiveSource: RawEnv = {
    ...source,
    ISABELLA_RUNTIME_MODE:
      source.ISABELLA_RUNTIME_MODE?.trim() ||
      (source.NODE_ENV === "production" ? "production" : "development"),
    AUTH_DEV_SESSION_ENABLED:
      source.AUTH_DEV_SESSION_ENABLED?.trim() ||
      (source.NODE_ENV === "production" ? "false" : "true"),
    ALLOW_GUEST_CHAT:
      source.ALLOW_GUEST_CHAT?.trim() ||
      (source.NODE_ENV === "production" ? "false" : "true"),
    DATABASE_URL:
      source.DATABASE_URL ??
      source.NEON_DATABASE_POSTGRES_URL ??
      source.NEON_DATABASE_DATABASE_URL ??
      source.SUPABASE_DATABASE_POSTGRES_URL,
    AUTH_JWT_SECRET:
      source.AUTH_JWT_SECRET?.trim() ||
      source.SUPABASE_DATABASE_SUPABASE_JWT_SECRET?.trim() ||
      source.SUPABASE_DATABASE_SUPABASE_SECRET_KEY?.trim() ||
      source.SUPABASE_DATABASE_SUPABASE_SERVICE_ROLE_KEY?.trim(),
    SUPABASE_URL:
      source.SUPABASE_URL?.trim() || source.SUPABASE_DATABASE_SUPABASE_URL?.trim(),
    SUPABASE_ANON_KEY:
      source.SUPABASE_ANON_KEY?.trim() || source.SUPABASE_DATABASE_SUPABASE_ANON_KEY?.trim(),
    SUPABASE_JWT_SECRET:
      source.SUPABASE_JWT_SECRET?.trim() || source.SUPABASE_DATABASE_SUPABASE_JWT_SECRET?.trim(),
    TURSO_AUTH_TOKEN: source.TURSO_AUTH_TOKEN ?? source.TURSO_AUTH_TOKEN_3,
    TURSO_DATABASE_URL: source.TURSO_DATABASE_URL ?? source.TURSO_DATABASE_URL_3,
    // Mux credentials may be provisioned under a numbered slot. Normalize them
    // here so server routes never need to know which slot supplied the secret.
    MUX_TOKEN_ID: source.MUX_TOKEN_ID ?? source.MUX_TOKEN_ID_3,
    MUX_TOKEN_SECRET: source.MUX_TOKEN_SECRET ?? source.MUX_TOKEN_SECRET_3,
    MUX_INTRO_ASSET_ID:
      source.MUX_INTRO_ASSET_ID ?? source.MUX_ASSET_ID,
    ISABELLA_STORAGE_PROVIDER:
      source.ISABELLA_STORAGE_PROVIDER ??
      ((source.DATABASE_URL ??
        source.NEON_DATABASE_POSTGRES_URL ??
        source.POSTGRES_PRISMA_URL ??
        source.POSTGRES_URL_NON_POOLING) && isProductionLikeRaw
        ? "neon"
        : !isProductionLikeRaw &&
            (source.DATABASE_URL ?? source.NEON_DATABASE_POSTGRES_URL)
          ? "postgres"
          : undefined),
  };

  const parsed = resolveEnv(effectiveSource);
  const mode: RuntimeMode = parsed.ISABELLA_RUNTIME_MODE;

  try {
    assertRequired(mode, effectiveSource);
    assertProductionCrypto(mode, parsed);
    assertProductionStorageProvider(mode, effectiveSource, parsed);

    if (mode === "production" || mode === "staging") {
      if (parsed.NODE_ENV !== "production") {
        throw new Error(
          `NODE_ENV=\"${parsed.NODE_ENV}\" es incompatible con ISABELLA_RUNTIME_MODE=\"${mode}\". Producción/staging requieren NODE_ENV=production.`,
        );
      }
      if (parsed.DURABLE_JSON_ALLOWED) {
        throw new Error("DURABLE_JSON_ALLOWED debe ser false en modos no locales");
      }
      if (parsed.AUTH_DEV_SESSION_ENABLED) {
        throw new Error("AUTH_DEV_SESSION_ENABLED debe estar desactivado");
      }
      if (parsed.ALLOW_GUEST_CHAT) {
        throw new Error("ALLOW_GUEST_CHAT debe estar desactivado en staging/production");
      }
      if (!parsed.DATABASE_URL && !(parsed.SUPABASE_URL && parsed.AUTH_JWT_SECRET)) {
        throw new Error(
          "Se requiere autoridad durable: DATABASE_URL o Supabase con AUTH_JWT_SECRET",
        );
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
