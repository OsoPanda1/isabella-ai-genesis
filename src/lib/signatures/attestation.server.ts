/**
 * Evidence Attestation Engine (src/lib/signatures/attestation.server.ts)
 * -------------------------------------------------------------
 * RSA-2048 / PKCS#1 v1.5 evidence signing and verification.
 * Pre-redacts secrets using secret-redactor before signing.
 */
import { generateKeyPairSync, sign, verify, createHash } from "node:crypto";
import { canonicalize } from "../igds/canonical";
import { redactSecrets } from "../secret-redactor";

export interface AttestationRecord {
  attestationId: string;
  payloadHash: string;
  signature: string;
  publicKeyPem: string;
  algorithm: "RSA-SHA256";
  timestamp: string;
}

// Ephemeral operational keypair
let keyPair: { publicKey: string; privateKey: string } | null = null;

export function getAttestationKeyPair(): { publicKey: string; privateKey: string } {
  if (!keyPair) {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    keyPair = { publicKey, privateKey };
  }
  return keyPair;
}

export function signAttestation(payload: unknown, customPrivateKey?: string): AttestationRecord {
  const keys = getAttestationKeyPair();
  const privateKey = customPrivateKey || keys.privateKey;
  const canonicalJson = canonicalize(payload);
  const sanitized = redactSecrets(canonicalJson);
  const payloadHash = createHash("sha256").update(sanitized, "utf8").digest("hex");

  const signature = sign("RSA-SHA256", Buffer.from(payloadHash, "utf8"), privateKey).toString("base64");

  return {
    attestationId: `attest_${createHash("sha256").update(signature).digest("hex").substring(0, 16)}`,
    payloadHash,
    signature,
    publicKeyPem: keys.publicKey,
    algorithm: "RSA-SHA256",
    timestamp: new Date().toISOString(),
  };
}

export function verifyAttestation(
  payload: unknown,
  signatureBase64: string,
  publicKeyPem?: string,
): boolean {
  try {
    const keys = getAttestationKeyPair();
    const pubKey = publicKeyPem || keys.publicKey;
    const canonicalJson = canonicalize(payload);
    const sanitized = redactSecrets(canonicalJson);
    const payloadHash = createHash("sha256").update(sanitized, "utf8").digest("hex");

    return verify(
      "RSA-SHA256",
      Buffer.from(payloadHash, "utf8"),
      pubKey,
      Buffer.from(signatureBase64, "base64"),
    );
  } catch {
    return false;
  }
}

export default { signAttestation, verifyAttestation, getAttestationKeyPair };
