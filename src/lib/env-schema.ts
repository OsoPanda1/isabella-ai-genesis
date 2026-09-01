import { z } from "zod";

/**
 * ESQUEMA CANÓNICO DE ENTORNO (src/lib/env-schema.ts)
 * -----------------------------------------------------------------
 * Define y valida TODAS las variables de entorno que Isabella lee.
 * El arranque (runtime-integrity) falla si falta una variable
 * obligatoria según el modo de ejecución.
 *
 * Nunca accedas a `process.env` directamente desde otro archivo:
 * usa `src/lib/config.ts`, que valida contra este esquema.
 */

export const runtimeModeSchema = z.enum([
  "development",
  "staging",
  "production",
  "emergency",
  "maintenance",
]);

export type RuntimeMode = z.infer<typeof runtimeModeSchema>;

const coercedInt = (def: number) => z.coerce.number().int().nonnegative().default(def);

const emptyToUndefined = (schema: z.ZodTypeAny) =>
  z.preprocess((val) => {
    if (typeof val !== "string") return undefined;
    const trimmed = val.trim();
    if (trimmed === "" || trimmed === "undefined" || trimmed === "null") {
      return undefined;
    }
    return trimmed;
  }, schema);

const optionalUrl = () =>
  z.preprocess((val) => {
    if (typeof val !== "string") return undefined;
    const trimmed = val.trim();
    if (trimmed === "" || trimmed === "undefined" || trimmed === "null") {
      return undefined;
    }
    try {
      new URL(trimmed);
      return trimmed;
    } catch {
      return undefined;
    }
  }, z.string().url().optional());

const optionalString = () => emptyToUndefined(z.string().optional());
const optionalMinString = (min: number) => emptyToUndefined(z.string().min(min).optional());

export const envSchema = z.object({
  // --- ENVIRONMENT ---
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  ISABELLA_RUNTIME_MODE: runtimeModeSchema.default("development"),
  PUBLIC_URL: z.string().url().default("http://localhost:3000"),

  // --- SUPABASE ---
  SUPABASE_URL: optionalUrl(),
  SUPABASE_ANON_KEY: optionalString(),
  SUPABASE_SERVICE_ROLE_KEY: optionalString(),
  SUPABASE_JWT_SECRET: optionalString(),

  // --- JWT / OIDC ---
  AUTH_JWT_SECRET: optionalMinString(16),
  AUTH_ISSUER: optionalUrl(),
  AUTH_AUDIENCE: z.string().default("isabella"),
  AUTH_ACCESS_TOKEN_TTL: coercedInt(3600),
  AUTH_REFRESH_TOKEN_TTL: coercedInt(604800),
  OIDC_JWKS_URL: optionalUrl(),
  JWKS_CACHE_TTL: coercedInt(3600),

  // --- CRYPTO ---
  ENCRYPTION_MASTER_KEY: optionalMinString(32),
  ENCRYPTION_ALGORITHM: z.string().default("aes-256-gcm"),

  // --- CROWN ---
  CROWN_CONSTITUTION_VERSION: z.string().default("v4.2.0"),
  CROWN_POLICY_SIGNING_KEY: optionalString(),
  CROWN_ENFORCEMENT_MODE: z.enum(["enforce", "warn", "dry-run"]).default("enforce"),

  // --- BOOKPI ---
  BOOKPI_SIGNATURE_ALGORITHM: z.string().default("NOT_IMPLEMENTED"),
  BOOKPI_SIGNING_KEY: optionalString(),

  // --- REDIS ---
  REDIS_URL: optionalString(),
  REDIS_PREFIX: z.string().default("isabella"),

  // --- RATE LIMIT ---
  RATE_LIMIT_DEFAULT_PER_MINUTE: coercedInt(120),
  RATE_LIMIT_INFERENCE_PER_MINUTE: coercedInt(40),
  RATE_LIMIT_VOICE_PER_MINUTE: coercedInt(20),

  // --- AI GATEWAY ---
  LOVABLE_API_KEY: optionalString(),
  GEMINI_API_KEY: optionalString(),
  LLM_DEFAULT_MODEL: z.string().default("google/gemini-3.6-flash"),
  LLM_VOICE_MODEL: z.string().default("openai/gpt-4o-mini-tts"),
  LLM_UPSTREAM_TIMEOUT_MS: coercedInt(8500),

  // --- TELEMETRY ---
  OTEL_EXPORTER_OTLP_ENDPOINT: optionalUrl(),
  OTEL_SERVICE_NAME: z.string().default("isabella-ai"),

  // --- REDACTION ---
  REDACT_EXTRA_KEYS: z.string().default(""),

  // --- INPUT LIMITS ---
  INPUT_MAX_BODY_BYTES: coercedInt(262144),
  INPUT_MAX_MESSAGES: coercedInt(200),
  INPUT_MAX_ATTACHMENT_BYTES: coercedInt(10485760),
  INPUT_MAX_TOOLS_PER_REQUEST: coercedInt(20),
});

export type Env = z.infer<typeof envSchema>;

/** Variables de entorno que SÍ se exponen de forma segura al navegador. */
export const PUBLIC_ENV_KEYS = [] as const;

/**
 * Variables obligatorias por modo de ejecución.
 * development → sólo lo necesario para que el servidor arranque local.
 * production  → exige la infraestructura completa de datos + IA.
 */
export function requiredEnvKeys(mode: RuntimeMode): (keyof Env)[] {
  switch (mode) {
    case "development":
      return ["NODE_ENV", "PUBLIC_URL"];
    case "staging":
    case "production":
      return [
        "NODE_ENV",
        "PUBLIC_URL",
        "SUPABASE_URL",
        "SUPABASE_ANON_KEY",
        "AUTH_JWT_SECRET",
        "LOVABLE_API_KEY",
        "ENCRYPTION_MASTER_KEY",
      ];
    case "emergency":
    case "maintenance":
      return ["NODE_ENV", "PUBLIC_URL", "AUTH_JWT_SECRET"];
  }
}
