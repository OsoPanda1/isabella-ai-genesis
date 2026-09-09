import { z } from "zod";

export const runtimeModeSchema = z.enum([
  "development",
  "staging",
  "production",
  "emergency",
  "maintenance",
]);
export type RuntimeMode = z.infer<typeof runtimeModeSchema>;
const coercedInt = (def: number) => z.coerce.number().int().nonnegative().default(def);
const optionalString = () =>
  z.preprocess(
    (v) =>
      typeof v === "string" && v.trim() && !["undefined", "null"].includes(v.trim())
        ? v.trim()
        : undefined,
    z.string().optional(),
  );
const optionalMinString = (min: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() ? v.trim() : undefined),
    z.string().min(min).optional(),
  );
const optionalUrl = () =>
  z.preprocess((v) => {
    if (typeof v !== "string" || !v.trim()) return undefined;
    try {
      new URL(v.trim());
      return v.trim();
    } catch {
      return undefined;
    }
  }, z.string().url().optional());
const bool = (def: boolean) =>
  z.preprocess(
    (v) =>
      typeof v === "boolean"
        ? v
        : typeof v === "string"
          ? v.trim().toLowerCase() === "true"
            ? true
            : v.trim().toLowerCase() === "false"
              ? false
              : undefined
          : undefined,
    z.boolean().default(def),
  );

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  ISABELLA_RUNTIME_MODE: runtimeModeSchema.default("development"),
  PUBLIC_URL: z.string().url().default("http://localhost:3000"),
  VERCEL_GIT_COMMIT_SHA: optionalString(),
  DATABASE_URL: optionalString(),
  DATABASE_DIRECT_URL: optionalString(),
  INTERNAL_ORIGIN: optionalUrl(),
  SUPABASE_URL: optionalUrl(),
  SUPABASE_ANON_KEY: optionalString(),
  SUPABASE_SERVICE_ROLE_KEY: optionalString(),
  SUPABASE_JWT_SECRET: optionalString(),
  AUTH_JWT_SECRET: optionalMinString(16),
  SESSION_SECRET: optionalMinString(32),
  AUTH_ISSUER: optionalUrl(),
  AUTH_AUDIENCE: z.string().default("isabella"),
  AUTH_ACCESS_TOKEN_TTL: coercedInt(3600),
  AUTH_REFRESH_TOKEN_TTL: coercedInt(604800),
  OIDC_JWKS_URL: optionalUrl(),
  JWKS_CACHE_TTL: coercedInt(3600),
  AUTH_DEV_SESSION_ENABLED: bool(false),
  ALLOW_GUEST_CHAT: bool(true),
  PROVISION_OWNER_TOKEN: optionalString(),
  ENCRYPTION_MASTER_KEY: optionalMinString(32),
  ENCRYPTION_ALGORITHM: z.string().default("aes-256-gcm"),
  CROWN_CONSTITUTION_VERSION: z.string().min(1).default("v4.2.0-sovereign"),
  CROWN_POLICY_SIGNING_KEY: optionalString(),
  AEGIS_AUDIT_SECRET: optionalMinString(32),
  CROWN_ENFORCEMENT_MODE: z.enum(["enforce", "dry-run"]).default("enforce"),
  BOOKPI_SIGNATURE_ALGORITHM: z
    .enum(["ML-DSA-87", "ECDSA-P384", "RSA-SHA256"])
    .default("ECDSA-P384"),
  BOOKPI_SIGNING_KEY: optionalMinString(32),
  STRIPE_SECRET_KEY: optionalMinString(16),
  STRIPE_WEBHOOK_SECRET: optionalMinString(16),
  QUP_ZNE_LEVEL: coercedInt(3),
  QUP_PEC_ENABLED: bool(true),
  QUP_QEC_DECODER: z
    .enum(["mwpm", "uf", "tensor-network", "neural-network"])
    .default("tensor-network"),
  QUP_STRICT_ISOLATION: bool(true),
  SANDBOX_ENABLED: bool(false),
  REDIS_URL: optionalString(),
  REDIS_TOKEN: optionalString(),
  REDIS_PREFIX: z.string().default("isabella"),
  KV_URL: optionalString(),
  KV_REST_API_TOKEN: optionalString(),
  UPSTASH_REDIS_TOKEN: optionalString(),
  TRUSTED_PROXY_MODE: optionalString(),
  RATE_LIMIT_DEFAULT_PER_MINUTE: coercedInt(120),
  RATE_LIMIT_INFERENCE_PER_MINUTE: coercedInt(40),
  RATE_LIMIT_VOICE_PER_MINUTE: coercedInt(20),
  GEMINI_API_KEY: optionalString(),
  GROQ_API_KEY: optionalString(),
  XAI_API_KEY: optionalString(),
  MUX_TOKEN_ID: optionalString(),
  MUX_TOKEN_SECRET: optionalString(),
  MUX_INTRO_ASSET_ID: optionalString(),
  LLM_DEFAULT_MODEL: z.string().default("google/gemini-3.8-flash"),
  LLM_VOICE_MODEL: z.string().default("openai/gpt-4o-mini-tts"),
  VOICE_API_URL: optionalUrl(),
  LLM_UPSTREAM_TIMEOUT_MS: coercedInt(8500),
  OTEL_EXPORTER_OTLP_ENDPOINT: optionalUrl(),
  OTEL_SERVICE_NAME: z.string().default("isabella-ai"),
  ISABELLA_FEATURE_FLAGS: z.string().default(""),
  REDACT_EXTRA_KEYS: z.string().default(""),
  INPUT_MAX_BODY_BYTES: coercedInt(262144),
  INPUT_MAX_MESSAGES: coercedInt(200),
  INPUT_MAX_ATTACHMENT_BYTES: coercedInt(10485760),
  INPUT_MAX_TOOLS_PER_REQUEST: coercedInt(20),
  API_KEY_HASH_SECRET: optionalMinString(16),
  API_KEY_PREFIX: z.string().default("isa_live"),
  API_KEY_DEFAULT_TTL: coercedInt(2592000),
  API_KEY_MAX_TTL: coercedInt(31536000),
  API_KEY_ROTATION_GRACE_SECONDS: coercedInt(300),
  API_KEY_RATE_LIMIT_DEFAULT: coercedInt(100),
  GENESIS_MAX_TEST_FILES: coercedInt(8),
  ISABELLA_STORAGE_PROVIDER: z
    .enum(["postgres", "neon", "supabase", "json", "memory"])
    .default("postgres"),
  DURABLE_JSON_ALLOWED: bool(false),
  ISABELLA_PAYOUT_CIRCUIT_CERTIFIED: bool(false),
});

export type Env = z.infer<typeof envSchema>;
export const PUBLIC_ENV_KEYS = [] as const;
export type EnvVarCriticality = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type EnvVarVisibility = "secret" | "public";
export type EnvVarProvider =
  | "postgres"
  | "neon"
  | "supabase"
  | "stripe"
  | "gemini"
  | "openai"
  | "redis"
  | "upstash"
  | "crown"
  | "bookpi"
  | "otel"
  | "oidc"
  | "vercel"
  | "self";
export interface EnvVarDescriptor {
  name: keyof Env;
  visibility: EnvVarVisibility;
  required: RuntimeMode[];
  forbidden: RuntimeMode[];
  provider?: EnvVarProvider;
  criticality: EnvVarCriticality;
  rotation?: string;
  description?: string;
}
export const ENV_VAR_CATALOG: EnvVarDescriptor[] = [
  {
    name: "NODE_ENV",
    visibility: "public",
    required: [],
    forbidden: [],
    provider: "vercel",
    criticality: "HIGH",
  },
  {
    name: "ISABELLA_RUNTIME_MODE",
    visibility: "public",
    required: ["staging", "production"],
    forbidden: [],
    provider: "self",
    criticality: "CRITICAL",
  },
  {
    name: "PUBLIC_URL",
    visibility: "public",
    required: ["staging", "production"],
    forbidden: [],
    provider: "vercel",
    criticality: "HIGH",
  },
  {
    name: "ISABELLA_STORAGE_PROVIDER",
    visibility: "public",
    required: ["staging", "production"],
    forbidden: [],
    provider: "postgres",
    criticality: "CRITICAL",
  },
  {
    name: "DATABASE_URL",
    visibility: "secret",
    required: ["staging", "production"],
    forbidden: [],
    provider: "postgres",
    criticality: "CRITICAL",
  },
  {
    name: "AUTH_JWT_SECRET",
    visibility: "secret",
    required: ["staging", "production"],
    forbidden: [],
    provider: "self",
    criticality: "CRITICAL",
  },
  {
    name: "ENCRYPTION_MASTER_KEY",
    visibility: "secret",
    required: ["staging", "production"],
    forbidden: [],
    provider: "self",
    criticality: "CRITICAL",
  },
  {
    name: "CROWN_POLICY_SIGNING_KEY",
    visibility: "secret",
    required: ["staging", "production"],
    forbidden: [],
    provider: "crown",
    criticality: "CRITICAL",
  },
  {
    name: "AEGIS_AUDIT_SECRET",
    visibility: "secret",
    required: ["staging", "production"],
    forbidden: [],
    provider: "crown",
    criticality: "CRITICAL",
  },
  {
    name: "BOOKPI_SIGNING_KEY",
    visibility: "secret",
    required: ["staging", "production"],
    forbidden: [],
    provider: "bookpi",
    criticality: "CRITICAL",
  },
  {
    name: "GEMINI_API_KEY",
    visibility: "secret",
    required: ["staging", "production"],
    forbidden: [],
    provider: "gemini",
    criticality: "CRITICAL",
  },
  {
    name: "PROVISION_OWNER_TOKEN",
    visibility: "secret",
    required: ["staging", "production"],
    forbidden: [],
    provider: "self",
    criticality: "CRITICAL",
  },
  {
    name: "STRIPE_SECRET_KEY",
    visibility: "secret",
    required: ["staging", "production"],
    forbidden: [],
    provider: "stripe",
    criticality: "CRITICAL",
  },
  {
    name: "STRIPE_WEBHOOK_SECRET",
    visibility: "secret",
    required: ["staging", "production"],
    forbidden: [],
    provider: "stripe",
    criticality: "CRITICAL",
  },
  {
    name: "AUTH_DEV_SESSION_ENABLED",
    visibility: "public",
    required: [],
    forbidden: ["staging", "production"],
    provider: "self",
    criticality: "CRITICAL",
  },
  {
    name: "ALLOW_GUEST_CHAT",
    visibility: "public",
    required: [],
    forbidden: [],
    provider: "self",
    criticality: "HIGH",
  },
  {
    name: "CROWN_ENFORCEMENT_MODE",
    visibility: "public",
    required: [],
    forbidden: ["staging", "production"],
    provider: "crown",
    criticality: "CRITICAL",
  },
  {
    name: "DURABLE_JSON_ALLOWED",
    visibility: "public",
    required: [],
    forbidden: ["staging", "production"],
    provider: "self",
    criticality: "CRITICAL",
  },
  {
    name: "SANDBOX_ENABLED",
    visibility: "public",
    required: [],
    forbidden: ["emergency", "maintenance"],
    provider: "self",
    criticality: "CRITICAL",
  },
  {
    name: "BOOKPI_SIGNATURE_ALGORITHM",
    visibility: "public",
    required: [],
    forbidden: [],
    provider: "bookpi",
    criticality: "HIGH",
  },
  {
    name: "REDIS_URL",
    visibility: "secret",
    required: [],
    forbidden: [],
    provider: "redis",
    criticality: "HIGH",
  },
  {
    name: "REDIS_TOKEN",
    visibility: "secret",
    required: [],
    forbidden: [],
    provider: "redis",
    criticality: "HIGH",
  },
  {
    name: "OTEL_EXPORTER_OTLP_ENDPOINT",
    visibility: "secret",
    required: [],
    forbidden: [],
    provider: "otel",
    criticality: "MEDIUM",
  },
  {
    name: "LLM_DEFAULT_MODEL",
    visibility: "public",
    required: [],
    forbidden: [],
    provider: "gemini",
    criticality: "HIGH",
  },
  {
    name: "LLM_UPSTREAM_TIMEOUT_MS",
    visibility: "public",
    required: [],
    forbidden: [],
    provider: "self",
    criticality: "MEDIUM",
  },
  {
    name: "RATE_LIMIT_INFERENCE_PER_MINUTE",
    visibility: "public",
    required: [],
    forbidden: [],
    provider: "self",
    criticality: "MEDIUM",
  },
  {
    name: "INPUT_MAX_BODY_BYTES",
    visibility: "public",
    required: [],
    forbidden: [],
    provider: "self",
    criticality: "MEDIUM",
  },
  {
    name: "INPUT_MAX_ATTACHMENT_BYTES",
    visibility: "public",
    required: [],
    forbidden: [],
    provider: "self",
    criticality: "MEDIUM",
  },
];
export function requiredEnvKeys(mode: RuntimeMode): Array<keyof Env> {
  return ENV_VAR_CATALOG.filter((item) => item.required.includes(mode)).map((item) => item.name);
}
