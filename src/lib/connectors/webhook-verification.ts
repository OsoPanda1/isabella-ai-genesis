/**
 * Verificación de firmas de webhooks de conectores (ISA-199, ISA-201,
 * ISA-205, ISA-206, ISA-211, ISA-212, ISA-213, ISA-217).
 *
 * Reglas:
 * - La firma se calcula siempre sobre los bytes exactos recibidos (raw body),
 *   nunca sobre un objeto re-serializado (ISA-205).
 * - Sin secreto configurado no se acepta nada: fail-closed (ISA-199).
 * - Un proveedor sin esquema de firma documentado se rechaza en lugar de
 *   confiar en su payload (ISA-213).
 * - La firma recibida jamás se propaga en logs, errores o respuestas (ISA-217).
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export type WebhookProvider = "github" | "slack" | "linear";

export const WEBHOOK_MAX_BYTES = 256 * 1024;
export const WEBHOOK_REPLAY_WINDOW_SECONDS = 300;

export type WebhookFailureCode =
  | "WEBHOOK_SECRET_NOT_CONFIGURED"
  | "WEBHOOK_SIGNATURE_MISSING"
  | "WEBHOOK_SIGNATURE_INVALID"
  | "WEBHOOK_SIGNATURE_UNSUPPORTED"
  | "WEBHOOK_ALGORITHM_DOWNGRADE"
  | "WEBHOOK_TIMESTAMP_REPLAY"
  | "WEBHOOK_PAYLOAD_TOO_LARGE";

export type WebhookVerificationResult =
  | { ok: true; scheme: "hmac-sha256-gh" | "hmac-sha256-slack-v0" | "hmac-sha256-linear"; timestampSeconds?: number }
  | { ok: false; code: WebhookFailureCode };

interface VerificationInput {
  provider: WebhookProvider;
  rawBody: string;
  byteLength: number;
  headers: Headers;
  secret: string | undefined;
  nowSeconds?: number;
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length || a.length === 0) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

function header(headers: Headers, name: string): string {
  return (headers.get(name) ?? "").trim();
}

function verifyGithub(input: VerificationInput): WebhookVerificationResult {
  const { rawBody, headers, secret } = input;
  if (!secret) return { ok: false, code: "WEBHOOK_SECRET_NOT_CONFIGURED" };

  const legacy = header(headers, "x-hub-signature");
  const signature = header(headers, "x-hub-signature-256");
  if (!signature) {
    if (legacy) return { ok: false, code: "WEBHOOK_ALGORITHM_DOWNGRADE" };
    return { ok: false, code: "WEBHOOK_SIGNATURE_MISSING" };
  }
  // Downgrade: se ignora y se marca inválido el uso de sha1 como única firma.
  if (!signature.startsWith("sha256=")) {
    if (legacy) return { ok: false, code: "WEBHOOK_ALGORITHM_DOWNGRADE" };
    return { ok: false, code: "WEBHOOK_SIGNATURE_INVALID" };
  }

  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const provided = signature.slice("sha256=".length).trim().toLowerCase();
  if (!safeEqualHex(expected, provided)) return { ok: false, code: "WEBHOOK_SIGNATURE_INVALID" };
  return { ok: true, scheme: "hmac-sha256-gh" };
}

function verifySlack(input: VerificationInput): WebhookVerificationResult {
  const { rawBody, headers, secret, nowSeconds } = input;
  if (!secret) return { ok: false, code: "WEBHOOK_SECRET_NOT_CONFIGURED" };

  const signature = header(headers, "x-slack-signature");
  const timestamp = header(headers, "x-slack-request-timestamp");
  if (!signature || !timestamp) return { ok: false, code: "WEBHOOK_SIGNATURE_MISSING" };
  if (!/^\d{1,12}$/.test(timestamp)) return { ok: false, code: "WEBHOOK_SIGNATURE_INVALID" };

  const sentAt = Number(timestamp);
  const now = nowSeconds ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - sentAt) > WEBHOOK_REPLAY_WINDOW_SECONDS)
    return { ok: false, code: "WEBHOOK_TIMESTAMP_REPLAY" };

  const base = `v0:${timestamp}:${rawBody}`;
  const expected = `v0=${createHmac("sha256", secret).update(base, "utf8").digest("hex")}`;
  const provided = signature.toLowerCase();
  if (!safeEqualHex(expected.replace("v0=", ""), provided.replace("v0=", "")))
    return { ok: false, code: "WEBHOOK_SIGNATURE_INVALID" };
  return { ok: true, scheme: "hmac-sha256-slack-v0" };
}

function verifyLinear(input: VerificationInput): WebhookVerificationResult {
  const { rawBody, headers, secret, nowSeconds } = input;
  if (!secret) return { ok: false, code: "WEBHOOK_SECRET_NOT_CONFIGURED" };

  const signature = header(headers, "linear-signature");
  const headerTimestamp = header(headers, "linear-timestamp");
  if (!signature) return { ok: false, code: "WEBHOOK_SIGNATURE_MISSING" };
  if (!/^[0-9a-f]{64}$/i.test(signature)) {
    return { ok: false, code: "WEBHOOK_SIGNATURE_INVALID" };
  }

  let bodyTimestampMs: number | null = null;
  try {
    const parsed = JSON.parse(rawBody) as Record<string, unknown>;
    const value = parsed.webhookTimestamp;
    if (typeof value === "number" && Number.isFinite(value)) bodyTimestampMs = value;
    else if (typeof value === "string" && /^\\d{10,16}$/.test(value)) bodyTimestampMs = Number(value);
  } catch {
    return { ok: false, code: "WEBHOOK_SIGNATURE_INVALID" };
  }

  const headerTimestampMs = /^\\d{10,16}$/.test(headerTimestamp)
    ? Number(headerTimestamp)
    : null;
  if (bodyTimestampMs === null) bodyTimestampMs = headerTimestampMs;
  if (bodyTimestampMs === null) return { ok: false, code: "WEBHOOK_TIMESTAMP_REPLAY" };

  if (headerTimestampMs !== null && Math.abs(headerTimestampMs - bodyTimestampMs) > 1000) {
    return { ok: false, code: "WEBHOOK_SIGNATURE_INVALID" };
  }

  const now = nowSeconds ?? Math.floor(Date.now() / 1000);
  const sentAtSeconds = bodyTimestampMs / 1000;
  if (Math.abs(now - sentAtSeconds) > 60) {
    return { ok: false, code: "WEBHOOK_TIMESTAMP_REPLAY" };
  }

  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  if (!safeEqualHex(expected, signature.toLowerCase())) {
    return { ok: false, code: "WEBHOOK_SIGNATURE_INVALID" };
  }

  return { ok: true, scheme: "hmac-sha256-linear", timestampSeconds: sentAtSeconds };
}

export function verifyWebhookSignature(input: VerificationInput): WebhookVerificationResult {
  if (input.byteLength > WEBHOOK_MAX_BYTES) return { ok: false, code: "WEBHOOK_PAYLOAD_TOO_LARGE" };
  switch (input.provider) {
    case "github":
      return verifyGithub(input);
    case "slack":
      return verifySlack(input);
    case "linear":
      return verifyLinear(input);
    default:
      return { ok: false, code: "WEBHOOK_SIGNATURE_UNSUPPORTED" };
  }
}

/** Event id del proveedor o, en su defecto, el de Vercel Connect. */
export function resolveWebhookEventId(headers: Headers): string {
  return (
    header(headers, "x-github-delivery") ||
    header(headers, "x-slack-request-id") ||
    header(headers, "x-vercel-connect-event-id") ||
    header(headers, "linear-delivery") ||
    ""
  );
}

export function webhookSecretFor(
  provider: WebhookProvider,
  env: Record<string, string | undefined>,
): string | undefined {
  const name =
    provider === "github"
      ? "GITHUB_WEBHOOK_SECRET"
      : provider === "slack"
        ? "SLACK_SIGNING_SECRET"
        : "LINEAR_WEBHOOK_SECRET";
  const value = env[name];
  return value && value.trim() ? value.trim() : undefined;
}
