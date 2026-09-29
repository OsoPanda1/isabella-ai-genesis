/**
 * Minimal application DLP boundary.
 * Detects high-confidence credential/PII patterns and blocks output crossing
 * a governed application boundary. It is deliberately conservative: it does
 * not claim to replace provider-side DLP.
 */
import const DLP_PATTERNS = {
  privateKey: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/i,
  jwt: /\beyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\b/,
  stripeSecret: /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{12,}\b/,
  stripeWebhook: /\bwhsec_[A-Za-z0-9]{12,}\b/,
  googleApiKey: /\bAIza[0-9A-Za-z_-]{30,}\b/,
  githubToken: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/i,
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  phone: /(?<!\d)(?:\+?52\s?)?(?:\d[\s.-]?){10,13}(?!\d)/,
  card: /\b(?:\d[ -]*?){13,19}\b/,
  curp: /\b[A-Z]{4}\d{6}[A-Z]{6}[A-Z0-9]\d\b/i,
  rfc: /\b[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}\b/i,
} as const;

export type DlpSeverity = "high" | "critical";
export interface DlpFinding { type: keyof typeof DLP_PATTERNS; severity: DlpSeverity; }

export function inspectDlp(value: unknown, maxBytes = 2_000_000): DlpFinding[] {
  let textValue: string;
  try { textValue = typeof value === "string" ? value : JSON.stringify(value); }
  catch { return [{ type: "privateKey", severity: "critical" }]; }
  if (Buffer.byteLength(textValue, "utf8") > maxBytes) {
    return [{ type: "privateKey", severity: "critical" }];
  }
  const findings: DlpFinding[] = [];
  for (const [type, pattern] of Object.entries(DLP_PATTERNS) as Array<[keyof typeof DLP_PATTERNS, RegExp]>) {
    if (pattern.test(textValue)) {
      findings.push({ type, severity: ["privateKey","jwt","stripeSecret","stripeWebhook","googleApiKey","githubToken"].includes(type) ? "critical" : "high" });
    }
  }
  return findings;
}

export function assertDlpSafe(value: unknown, context = "output"): void {
  const findings = inspectDlp(value);
  if (!findings.length) return;
  throw new Error(`DLP_BLOCKED:${context}:${findings.map((f) => f.type).join(",")}`);
}
