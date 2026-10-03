/**
 * Sovereign Audit Seal Engine (src/lib/sovereign-audit.ts)
 * -------------------------------------------------------------
 * Hardened audit sealing using HMAC-SHA3-512.
 * Enforces fail-closed secret acquisition: in production, missing
 * AEGIS_AUDIT_SECRET immediately throws and refuses sealing.
 *
 * ML-DSA is documented as SIMULATION-ONLY (post-quantum research flag);
 * HMAC-SHA3-512 is the live, operational cryptographic seal.
 */
import { createHmac, createHash } from "node:crypto";
import { canonicalize } from "./igds/canonical";
import { isProductionLike } from "./runtime-mode";

export interface AuditSeal {
  algorithm: "HMAC-SHA3-512" | "ML-DSA-65-SIMULATED";
  hash: string;
  signature: string;
  timestamp: string;
  keyId: string;
}

export function getAuditSecret(): string {
  const secret = process.env.AEGIS_AUDIT_SECRET;
  if (secret && secret.trim().length >= 16) {
    return secret.trim();
  }
  if (isProductionLike()) {
    throw new Error(
      "FAIL_CLOSED_SECURITY: AEGIS_AUDIT_SECRET is required in production and must be at least 16 characters.",
    );
  }
  // Deterministic local development secret
  return "aegis-sovereign-dev-audit-secret-512-bit-length-key-override";
}

export function computePayloadHash(payload: unknown): string {
  const canonical = canonicalize(payload);
  return createHash("sha3-512").update(canonical, "utf8").digest("hex");
}

export function createAuditSeal(
  payload: unknown,
  secretOverride?: string,
  keyId: string = "k_sovereign_audit_v1",
): AuditSeal {
  const secret = secretOverride ?? getAuditSecret();
  const hash = computePayloadHash(payload);
  const signature = createHmac("sha3-512", secret)
    .update(`${keyId}:${hash}`, "utf8")
    .digest("hex");

  return {
    algorithm: "HMAC-SHA3-512",
    hash,
    signature,
    timestamp: new Date().toISOString(),
    keyId,
  };
}

export function verifyAuditSeal(
  payload: unknown,
  signature: string,
  secretOverride?: string,
  keyId: string = "k_sovereign_audit_v1",
): boolean {
  try {
    const secret = secretOverride ?? getAuditSecret();
    const hash = computePayloadHash(payload);
    const expected = createHmac("sha3-512", secret)
      .update(`${keyId}:${hash}`, "utf8")
      .digest("hex");

    return expected === signature;
  } catch {
    return false;
  }
}

export default {
  createAuditSeal,
  verifyAuditSeal,
  computePayloadHash,
};
