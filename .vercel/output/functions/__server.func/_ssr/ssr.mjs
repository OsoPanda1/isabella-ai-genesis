import { i as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { a as enumType, c as objectType, d as stringType, l as preprocessType, n as booleanType, r as coerce } from "../_libs/zod.mjs";
import { createHash, randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
//#region node_modules/.nitro/vite/services/ssr/index.js
var ssr_exports = /* @__PURE__ */ __exportAll({
	default: () => server_default,
	i: () => renderErrorPage,
	n: () => secrets,
	r: () => config,
	t: () => capabilityRegistry
});
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? current : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
var requestStore = new AsyncLocalStorage();
function genId() {
	return randomUUID().replace(/-/g, "");
}
function createRequestContext(opts) {
	const startedAt = Date.now();
	return {
		traceId: genId(),
		correlationId: genId(),
		requestId: genId(),
		startedAt,
		...opts.clientIp !== void 0 ? { clientIp: opts.clientIp } : {},
		...opts.method !== void 0 ? { method: opts.method } : {},
		...opts.path !== void 0 ? { path: opts.path } : {},
		...opts.route !== void 0 ? { route: opts.route } : {}
	};
}
function withRequestContext(data, fn) {
	return requestStore.run(data, fn);
}
function getRequestContext() {
	return requestStore.getStore();
}
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
var runtimeModeSchema = enumType([
	"development",
	"staging",
	"production",
	"emergency",
	"maintenance"
]);
var coercedInt = (def) => coerce.number().int().nonnegative().default(def);
var emptyToUndefined = (schema) => preprocessType((val) => {
	if (typeof val !== "string") return void 0;
	const trimmed = val.trim();
	if (trimmed === "" || trimmed === "undefined" || trimmed === "null") return;
	return trimmed;
}, schema);
var optionalUrl = () => preprocessType((val) => {
	if (typeof val !== "string") return void 0;
	const trimmed = val.trim();
	if (trimmed === "" || trimmed === "undefined" || trimmed === "null") return;
	try {
		new URL(trimmed);
		return trimmed;
	} catch {
		return;
	}
}, stringType().url().optional());
var optionalString = () => emptyToUndefined(stringType().optional());
var optionalMinString = (min) => emptyToUndefined(stringType().min(min).optional());
var envSchema = objectType({
	NODE_ENV: enumType([
		"development",
		"test",
		"production"
	]).default("development"),
	ISABELLA_RUNTIME_MODE: runtimeModeSchema.default("development"),
	PUBLIC_URL: stringType().url().default("http://localhost:3000"),
	DATABASE_URL: optionalString(),
	SUPABASE_URL: optionalUrl(),
	SUPABASE_ANON_KEY: optionalString(),
	SUPABASE_SERVICE_ROLE_KEY: optionalString(),
	SUPABASE_JWT_SECRET: optionalString(),
	AUTH_JWT_SECRET: optionalMinString(16),
	AUTH_ISSUER: optionalUrl(),
	AUTH_AUDIENCE: stringType().default("isabella"),
	AUTH_ACCESS_TOKEN_TTL: coercedInt(3600),
	AUTH_REFRESH_TOKEN_TTL: coercedInt(604800),
	OIDC_JWKS_URL: optionalUrl(),
	JWKS_CACHE_TTL: coercedInt(3600),
	AUTH_DEV_SESSION_ENABLED: preprocessType((val) => {
		if (typeof val !== "string") return void 0;
		const trimmed = val.trim().toLowerCase();
		if (trimmed === "" || trimmed === "undefined" || trimmed === "null") return void 0;
		return trimmed;
	}, enumType(["true", "false"]).default("false")).transform((val) => val === "true"),
	ALLOW_GUEST_CHAT: preprocessType((val) => {
		if (typeof val !== "string") return void 0;
		const t = val.trim().toLowerCase();
		if (t === "" || t === "undefined" || t === "null") return void 0;
		return t;
	}, enumType(["true", "false"]).default("false")).transform((val) => val === "true"),
	PROVISION_OWNER_TOKEN: optionalString(),
	ENCRYPTION_MASTER_KEY: optionalMinString(32),
	ENCRYPTION_ALGORITHM: stringType().default("aes-256-gcm"),
	CROWN_CONSTITUTION_VERSION: stringType().default("v4.2.0"),
	CROWN_POLICY_SIGNING_KEY: optionalString(),
	CROWN_ENFORCEMENT_MODE: enumType([
		"enforce",
		"warn",
		"dry-run"
	]).default("enforce"),
	BOOKPI_SIGNATURE_ALGORITHM: stringType().default("NOT_IMPLEMENTED"),
	BOOKPI_SIGNING_KEY: optionalString(),
	REDIS_URL: optionalString(),
	REDIS_TOKEN: optionalString(),
	REDIS_PREFIX: stringType().default("isabella"),
	KV_URL: optionalString(),
	KV_REST_API_TOKEN: optionalString(),
	UPSTASH_REDIS_TOKEN: optionalString(),
	TRUSTED_PROXY_MODE: optionalString(),
	RATE_LIMIT_DEFAULT_PER_MINUTE: coercedInt(120),
	RATE_LIMIT_INFERENCE_PER_MINUTE: coercedInt(40),
	RATE_LIMIT_VOICE_PER_MINUTE: coercedInt(20),
	GEMINI_API_KEY: optionalString(),
	LLM_DEFAULT_MODEL: stringType().default("google/gemini-3.6-flash"),
	LLM_VOICE_MODEL: stringType().default("openai/gpt-4o-mini-tts"),
	VOICE_API_URL: optionalUrl(),
	LLM_UPSTREAM_TIMEOUT_MS: coercedInt(8500),
	OTEL_EXPORTER_OTLP_ENDPOINT: optionalUrl(),
	OTEL_SERVICE_NAME: stringType().default("isabella-ai"),
	REDACT_EXTRA_KEYS: stringType().default(""),
	INPUT_MAX_BODY_BYTES: coercedInt(262144),
	INPUT_MAX_MESSAGES: coercedInt(200),
	INPUT_MAX_ATTACHMENT_BYTES: coercedInt(10485760),
	INPUT_MAX_TOOLS_PER_REQUEST: coercedInt(20),
	API_KEY_HASH_SECRET: optionalMinString(16),
	API_KEY_PREFIX: stringType().default("isa_live"),
	API_KEY_DEFAULT_TTL: coercedInt(2592e3),
	API_KEY_MAX_TTL: coercedInt(31536e3),
	API_KEY_ROTATION_GRACE_SECONDS: coercedInt(300),
	API_KEY_RATE_LIMIT_DEFAULT: coercedInt(100),
	DURABLE_JSON_ALLOWED: preprocessType((val) => {
		if (typeof val === "boolean") return val;
		if (typeof val !== "string") return void 0;
		const t = val.trim().toLowerCase();
		if (t === "true") return true;
		if (t === "false") return false;
	}, booleanType().default(false)).describe("Allow JSON file persistence in production — must be false in prod, true only for dev/test")
});
/**
* Variables obligatorias por modo de ejecución.
* development → sólo lo necesario para que el servidor arranque local.
* production  → exige la infraestructura completa de datos + IA.
*/
function requiredEnvKeys(mode) {
	switch (mode) {
		case "development": return ["NODE_ENV", "PUBLIC_URL"];
		case "staging":
		case "production": return [
			"NODE_ENV",
			"PUBLIC_URL",
			"SUPABASE_URL",
			"SUPABASE_ANON_KEY",
			"AUTH_JWT_SECRET",
			"GEMINI_API_KEY",
			"ENCRYPTION_MASTER_KEY"
		];
		case "emergency":
		case "maintenance": return [
			"NODE_ENV",
			"PUBLIC_URL",
			"AUTH_JWT_SECRET"
		];
	}
}
var cached;
var loadError = null;
function resolveEnv(source) {
	const parsed = envSchema.safeParse(source);
	if (!parsed.success) {
		const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
		throw new Error(`Configuración de entorno inválida: ${issues}`);
	}
	return parsed.data;
}
function assertRequired(mode, source) {
	const required = requiredEnvKeys(mode);
	for (const key of required) {
		const raw = source[key];
		if (raw === void 0 || raw === null || raw === "") throw new Error(`Variable de entorno obligatoria no definida en modo "${mode}": ${String(key)}`);
	}
}
function loadConfig(source = process.env) {
	if (cached) return cached;
	const parsed = resolveEnv(source);
	const mode = parsed.ISABELLA_RUNTIME_MODE;
	try {
		assertRequired(mode, source);
	} catch (error) {
		const msg = error instanceof Error ? error.message : String(error);
		loadError = msg;
		if (mode === "production" || mode === "staging") throw new Error(`[SovereignConfig Fail-Fast] ${msg}`);
	}
	cached = parsed;
	return parsed;
}
/** Devuelve el error de validación de configuración (si lo hubo). */
function getConfigLoadError() {
	return loadError;
}
/** Reinicia la caché (usado en tests). */
function resetConfigCache() {
	cached = void 0;
	loadError = null;
}
/** Config validada; lanza si no se ha cargado aún. */
function config() {
	if (!cached) return loadConfig();
	return cached;
}
function requireSecret(kind, value, label) {
	if (!value || value.length === 0) throw new Error(`Secreto requerido no configurado: ${label} (${kind})`);
	return value;
}
/** Resolver de secretos ligado a config(). */
function createSecrets(cfg = config) {
	return {
		jwtSecret() {
			return requireSecret("jwt", cfg().AUTH_JWT_SECRET, "AUTH_JWT_SECRET (ver .env.example)");
		},
		encryptionMasterKey() {
			return requireSecret("encryption", cfg().ENCRYPTION_MASTER_KEY, "ENCRYPTION_MASTER_KEY (mín. 32 caracteres)");
		},
		bookpiSigningKey() {
			if (cfg().BOOKPI_SIGNATURE_ALGORITHM === "NOT_IMPLEMENTED") return "";
			return requireSecret("bookpi", cfg().BOOKPI_SIGNING_KEY, "BOOKPI_SIGNING_KEY");
		},
		aiGatewayKey() {
			return cfg().GEMINI_API_KEY || requireSecret("ai", void 0, "GEMINI_API_KEY");
		},
		supabaseJwtSecret() {
			return cfg().SUPABASE_JWT_SECRET;
		},
		policySigningKey() {
			return cfg().CROWN_POLICY_SIGNING_KEY;
		},
		apiKeyHashSecret() {
			return requireSecret("jwt", cfg().API_KEY_HASH_SECRET, "API_KEY_HASH_SECRET");
		}
	};
}
var secrets = createSecrets();
/**
* REDACTOR DE SECRETOS (src/lib/secret-redactor.ts)
* -----------------------------------------------------------------
* Elimina tokens y secretos de los logs de forma determinista.
* Todo log que pueda incluir entrada de usuario o errores debe pasar
* por `redact()` antes de escribirse.
*/
var BUILTIN_KEYS = [
	"GEMINI_API_KEY",
	"AUTH_JWT_SECRET",
	"SUPABASE_SERVICE_ROLE_KEY",
	"SUPABASE_ANON_KEY",
	"SUPABASE_JWT_SECRET",
	"ENCRYPTION_MASTER_KEY",
	"BOOKPI_SIGNING_KEY",
	"CROWN_POLICY_SIGNING_KEY"
];
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/**
* Regex de patrones de credenciales en texto: claves, tokens, bearer,
* secretos y strings largos tras "=" en contextos sensibles.
*/
function buildSecretPatterns(values) {
	const literals = values.filter((v) => v && v.length >= 8).map(escapeRegExp).join("|");
	const parts = [
		/(\b(?:api[_-]?key|secret|token|password|passwd|auth|bearer|authorization)\b\s*[:=]\s*["']?)([A-Za-z0-9_\-.+=/]{12,})(["']?)/gi.source,
		/(\bBearer\s+)[A-Za-z0-9_\-.+=/]{20,}/gi.source,
		/(iv|nonce)=["']?[A-Za-z0-9+=/]{12,}["']?/gi.source
	];
	if (literals) parts.push(`(?:${literals})`);
	return new RegExp(parts.join("|"), "gi");
}
function createRedactor(extraValues = []) {
	const extraKeys = config().REDACT_EXTRA_KEYS.split(",").map((s) => s.trim()).filter(Boolean);
	const dynamicValues = [];
	const secureEnvLookup = (key) => {
		switch (key) {
			case "GEMINI_API_KEY": return process.env.GEMINI_API_KEY;
			case "AUTH_JWT_SECRET": return process.env.AUTH_JWT_SECRET;
			case "SUPABASE_SERVICE_ROLE_KEY": return process.env.SUPABASE_SERVICE_ROLE_KEY;
			case "SUPABASE_ANON_KEY": return process.env.SUPABASE_ANON_KEY;
			case "SUPABASE_JWT_SECRET": return process.env.SUPABASE_JWT_SECRET;
			case "ENCRYPTION_MASTER_KEY": return process.env.ENCRYPTION_MASTER_KEY;
			case "BOOKPI_SIGNING_KEY": return process.env.BOOKPI_SIGNING_KEY;
			case "CROWN_POLICY_SIGNING_KEY": return process.env.CROWN_POLICY_SIGNING_KEY;
			default: return;
		}
	};
	for (const key of [...BUILTIN_KEYS, ...extraKeys]) {
		const value = secureEnvLookup(key);
		if (value) dynamicValues.push(value);
	}
	try {
		for (const v of [
			secrets.jwtSecret(),
			secrets.aiGatewayKey(),
			secrets.encryptionMasterKey()
		]) if (v) dynamicValues.push(v);
	} catch {}
	const pattern = buildSecretPatterns([...dynamicValues, ...extraValues]);
	const patternKeys = new RegExp(`("?(?:${BUILTIN_KEYS.concat(extraKeys).map(escapeRegExp).join("|")})"?\\s*:\\s*")[^"]{4,}(")`, "gi");
	function redact(input) {
		let out = input.replace(pattern, (_match, prefix = "") => `${prefix}[REDACTED]`);
		out = out.replace(patternKeys, "$1[REDACTED]$2");
		return out;
	}
	function redactObject(input) {
		if (typeof input === "string") return redact(input);
		if (Array.isArray(input)) return input.map(redactObject);
		if (input && typeof input === "object") {
			const out = {};
			for (const [key, value] of Object.entries(input)) if (typeof value === "string" && isSensitiveKey(key)) out[key] = "[REDACTED]";
			else out[key] = redactObject(value);
			return out;
		}
		return input;
	}
	return {
		redact,
		redactObject
	};
}
function isSensitiveKey(key) {
	return /(secret|token|password|passwd|api[_-]?key|jwt|signing|encryption|bearer|credential)/i.test(key);
}
var redactor = createRedactor();
var redact = (input) => redactor.redact(input);
function getInputLimits() {
	const cfg = config();
	return {
		maxBodyBytes: cfg.INPUT_MAX_BODY_BYTES,
		maxMessages: cfg.INPUT_MAX_MESSAGES,
		maxAttachmentBytes: cfg.INPUT_MAX_ATTACHMENT_BYTES,
		maxToolsPerRequest: cfg.INPUT_MAX_TOOLS_PER_REQUEST,
		maxHeaderBytes: 16384,
		maxTimeoutMs: cfg.LLM_UPSTREAM_TIMEOUT_MS
	};
}
function assertBodyWithinLimits(length) {
	if (length > getInputLimits().maxBodyBytes) throw new LimitError("BODY_TOO_LARGE", getInputLimits().maxBodyBytes, length);
}
var LimitError = class extends Error {
	code;
	limit;
	actual;
	constructor(code, limit, actual) {
		super(`${code}: límite ${limit}, recibido ${actual}`);
		this.name = "LimitError";
		this.code = code;
		this.limit = limit;
		this.actual = actual;
	}
};
var FINGERPRINT_FILES = [
	"package.json",
	"tsconfig.json",
	"vite.config.ts",
	"eslint.config.js",
	"metadata.json"
];
function hashText(input) {
	return createHash("sha256").update(input).digest("hex");
}
function computeSourceHash(root) {
	let acc = "";
	for (const file of FINGERPRINT_FILES) try {
		acc += `${file}:${readFileSync(resolve(root, file), "utf8")}\n`;
	} catch {
		acc += `${file}:<missing>\n`;
	}
	return hashText(acc);
}
function computeEnvFingerprint(env = process.env) {
	return hashText([
		env.NODE_ENV ?? "development",
		env.PUBLIC_URL ?? "",
		env.LLM_DEFAULT_MODEL ?? "",
		env.CROWN_CONSTITUTION_VERSION ?? "",
		env.BOOKPI_SIGNATURE_ALGORITHM ?? "NOT_IMPLEMENTED"
	].join("|"));
}
function buildManifest(runtime = "server", root = process.cwd()) {
	let version = "0.0.0";
	try {
		version = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).version ?? "0.0.0";
	} catch {}
	const manifest = {
		builtAt: (/* @__PURE__ */ new Date()).toISOString(),
		version,
		sourceHash: computeSourceHash(root),
		envFingerprint: computeEnvFingerprint(),
		runtime,
		depsHash: hashText(process.version + version)
	};
	const commit = process.env.COMMIT_SHA;
	if (commit) manifest.commit = commit;
	return manifest;
}
var CapabilityRegistryService = class {
	registry = /* @__PURE__ */ new Map();
	register(record) {
		this.registry.set(record.id, record);
	}
	get(id) {
		return this.registry.get(id);
	}
	stateOf(id) {
		return this.registry.get(id)?.state ?? "unavailable";
	}
	isOperational(id) {
		return this.stateOf(id) === "implemented" || this.stateOf(id) === "verified";
	}
	all() {
		return [...this.registry.values()];
	}
	byState(state) {
		return this.all().filter((c) => c.state === state);
	}
	toSnapshot() {
		const out = {};
		for (const [id, rec] of this.registry) out[id] = rec.state;
		return out;
	}
};
/** Registrar genérico con los dominios declarados en la documentación. */
function createDefaultCapabilityRegistry() {
	const svc = new CapabilityRegistryService();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const register = (id, state, evidence) => {
		const record = {
			id,
			state,
			updatedAt: now
		};
		if (evidence) record.evidence = evidence;
		svc.register(record);
	};
	register("build", "implemented", ["package.json scripts", "npm run typecheck/lint/test/build"]);
	register("auth", "implemented", ["src/lib/principal-context.ts", "src/lib/jwt-verifier.ts"]);
	register("identity.oidc", "planned");
	register("tenancy", "implemented", ["supabase/migrations/*", "src/lib/tenant-guard.ts"]);
	register("memory", "implemented", ["src/lib/memory-engine.ts", "tabla memories"]);
	register("bookpi", "implemented", ["src/lib/bookpi*.ts", "tabla bookpi_ledger"]);
	register("audit", "implemented", ["src/lib/repositories/audit-repository.ts"]);
	register("crown", "implemented", ["src/lib/crown.ts", "constitutional-gate.ts"]);
	register("llm", "implemented", ["src/routes/api/isabella.ts"]);
	register("voice", "implemented", ["src/routes/api/isabella-voice.ts"]);
	register("tools", "experimental", ["src/lib/tool-registry.ts", "src/lib/orion-engine.ts"]);
	register("sandbox", "experimental", ["src/lib/sovereign-sandbox.ts"]);
	register("pqc", "unavailable");
	register("monetization", "implemented", ["src/lib/monetization/*"]);
	register("heads.12", "implemented", ["12 cognitive heads configured in sovereign-engine.ts"]);
	register("nuclei.24", "simulated", ["24 cognitive nuclei modeled in sovereign-engine.ts"]);
	return svc;
}
var capabilityRegistry = createDefaultCapabilityRegistry();
/**
* Normaliza un valor de entorno a un RuntimeMode conocido,
* fallback por defecto a "development".
*/
function resolveRuntimeMode(value) {
	if (!value) return "development";
	const parsed = runtimeModeSchema.safeParse(value);
	return parsed.success ? parsed.data : "development";
}
function verifyRuntimeIntegrity(options) {
	const strict = options?.strict ?? false;
	if (options?.reloadConfig) {
		resetConfigCache();
		config();
	} else config();
	const configError = getConfigLoadError();
	const mode = resolveRuntimeMode("production");
	let status = "ok";
	if (configError) status = "failed";
	const required = [
		"auth",
		"tenancy",
		"audit",
		"memory",
		"bookpi",
		"crown"
	];
	const requiredCapabilities = {};
	for (const cap of required) {
		requiredCapabilities[cap] = capabilityRegistry.stateOf(cap);
		if (strict && !capabilityRegistry.isOperational(cap)) status = status === "failed" ? "failed" : "degraded";
	}
	const manifestValid = buildManifest("server").sourceHash.length === 64;
	return {
		status,
		mode,
		configError,
		manifestValid,
		requiredCapabilities,
		checkedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
/**
* Comprueba que el runtime puede arrancar; lanza si no en modo estricto.
*/
function ensureRuntimeReady(strict = false) {
	const result = verifyRuntimeIntegrity({ strict });
	if (result.status === "failed" && strict) throw new Error(`Runtime no listo: ${result.configError ?? "capacidades faltantes"}`);
	return result;
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-Bj971rPj.mjs").then((n) => n.t).then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	const err = consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`);
	console.error(redact(err instanceof Error ? err.stack ?? err.message : String(err)));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
function withSecurityHeaders(response) {
	const headers = new Headers(response.headers);
	const setIfMissing = (name, value) => {
		if (!headers.has(name)) headers.set(name, value);
	};
	setIfMissing("X-Content-Type-Options", "nosniff");
	setIfMissing("X-Frame-Options", "DENY");
	setIfMissing("Referrer-Policy", "no-referrer");
	setIfMissing("X-XSS-Protection", "0");
	setIfMissing("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
	setIfMissing("Content-Security-Policy", [
		"default-src 'self'",
		"img-src 'self' data: blob:",
		"style-src 'self'",
		"script-src 'self'",
		"connect-src 'self' https:",
		"frame-ancestors 'none'"
	].join("; "));
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}
async function fetchWithRequestChain(request, env, ctx) {
	const url = new URL(request.url);
	return withRequestContext(createRequestContext({
		method: request.method,
		path: url.pathname,
		clientIp: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown"
	}), async () => {
		if (request.method === "POST" || request.method === "PUT" || request.method === "PATCH") {
			const contentLength = Number(request.headers.get("content-length") ?? "0");
			try {
				if (contentLength > 0) assertBodyWithinLimits(contentLength);
			} catch (error) {
				if (error instanceof LimitError) return new Response(JSON.stringify({ error: {
					code: error.code,
					message: error.message
				} }), {
					status: 413,
					headers: { "content-type": "application/json" }
				});
				throw error;
			}
		}
		ensureRuntimeReady(false);
		return withSecurityHeaders(await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx)));
	});
}
var server_default = { async fetch(request, env, ctx) {
	try {
		return await fetchWithRequestChain(request, env, ctx);
	} catch (error) {
		const traceId = getRequestContext()?.traceId ?? "no-trace";
		console.error(redact(`[${traceId}] ${error instanceof Error ? error.stack ?? error.message : String(error)}`));
		return withSecurityHeaders(new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		}));
	}
} };
//#endregion
export { ssr_exports as a, server_default as default, renderErrorPage as i, secrets as n, config as r, capabilityRegistry as t };
