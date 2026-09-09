import { createHash, randomBytes } from "node:crypto";

export interface CapabilityTokenClaims {
  jti: string;
  tool: string;
  actorId: string;
  tenantId: string;
  expiresAt: number;
  nonce: string;
}

const MAX_TTL_MS = 5 * 60_000;
const consumed = new Map<string, number>();

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function cleanup(now: number): void {
  for (const [jti, expiresAt] of consumed) if (expiresAt <= now) consumed.delete(jti);
}

export function issueCapabilityToken(input: Omit<CapabilityTokenClaims, "jti" | "nonce" | "expiresAt"> & { ttlMs?: number }): string {
  const now = Date.now();
  const ttl = Math.min(Math.max(input.ttlMs ?? 60_000, 1_000), MAX_TTL_MS);
  const claims: CapabilityTokenClaims = {
    tool: input.tool,
    actorId: input.actorId,
    tenantId: input.tenantId,
    expiresAt: now + ttl,
    jti: randomBytes(18).toString("base64url"),
    nonce: randomBytes(18).toString("base64url"),
  };
  const payload = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
  const mac = digest(payload);
  return `${payload}.${mac}`;
}

export function consumeCapabilityToken(token: string, expected: { tool: string; actorId: string; tenantId: string }): CapabilityTokenClaims {
  cleanup(Date.now());
  const [payload, mac] = token.split(".");
  if (!payload || !mac || digest(payload) !== mac) throw new Error("capability_token_invalid");
  let claims: CapabilityTokenClaims;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as CapabilityTokenClaims;
  } catch {
    throw new Error("capability_token_invalid");
  }
  if (!claims.jti || !claims.nonce || claims.tool !== expected.tool || claims.actorId !== expected.actorId || claims.tenantId !== expected.tenantId) {
    throw new Error("capability_token_scope_mismatch");
  }
  if (!Number.isFinite(claims.expiresAt) || claims.expiresAt <= Date.now()) throw new Error("capability_token_expired");
  if (consumed.has(claims.jti)) throw new Error("capability_token_replayed");
  consumed.set(claims.jti, claims.expiresAt);
  return claims;
}
