/**
 * Secret Redactor (src/lib/secret-redactor.ts)
 * -------------------------------------------------------------
 * Provides deterministic redaction of API keys, private keys, JWTs,
 * database connection strings, and sensitive credentials prior to
 * logging, telemetry, and external LLM dispatch.
 */

const SENSITIVE_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // JWT tokens: header.payload.signature
  {
    pattern: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
    replacement: "[REDACTED_JWT]",
  },
  // Private keys (RSA, EC, Ed25519)
  {
    pattern: /-----BEGIN[ A-Z0-9_-]*PRIVATE KEY-----[\s\S]*?-----END[ A-Z0-9_-]*PRIVATE KEY-----/g,
    replacement: "[REDACTED_PRIVATE_KEY]",
  },
  // Bearer tokens in headers or strings
  {
    pattern: /Bearer\s+[A-Za-z0-9_.\-~+/=]+/gi,
    replacement: "Bearer [REDACTED_TOKEN]",
  },
  // Postgres / database connection strings
  {
    pattern: /postgres(?:ql)?:\/\/[^:]+:[^@]+@[^/]+\/[^\s"']+/gi,
    replacement: "postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[REDACTED_HOST]/[REDACTED_DB]",
  },
  // Stripe secrets / API keys
  {
    pattern: /(?:sk|rk)_(?:live|test)_[0-9a-zA-Z]{24,}/g,
    replacement: "[REDACTED_STRIPE_KEY]",
  },
  // Generic API keys (isa_live, sk-, ai-studio, etc.)
  {
    pattern: /(?:isa_(?:live|test)_[a-f0-9]{32,}|AIza[0-9A-Za-z\\-_]{35})/g,
    replacement: "[REDACTED_API_KEY]",
  },
  // Passwords / secrets in JSON strings
  {
    pattern: /"(password|secret|token|apiKey|api_key|access_token|refresh_token)":\s*"[^"]+"/gi,
    replacement: '"$1":"[REDACTED]"',
  },
];

export function redactSecrets(text: string): string {
  if (!text || typeof text !== "string") return text;
  let redacted = text;
  for (const { pattern, replacement } of SENSITIVE_PATTERNS) {
    redacted = redacted.replace(pattern, replacement);
  }
  return redacted;
}

export function redactObject<T>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;
  try {
    const jsonStr = JSON.stringify(obj);
    const sanitized = redactSecrets(jsonStr);
    return JSON.parse(sanitized) as T;
  } catch {
    return obj;
  }
}

export default { redactSecrets, redactObject };
