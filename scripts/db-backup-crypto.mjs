#!/usr/bin/env node
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const MAGIC = "ISABELLA-BACKUP-V1";
const ALGORITHM = "aes-256-gcm";
const SALT = Buffer.from("isabella/logical-backup/v1", "utf8");
const INFO = Buffer.from("backup-encryption", "utf8");

function keyFromEnv(env = process.env) {
  const raw = env.ENCRYPTION_MASTER_KEY;
  if (typeof raw !== "string" || Buffer.byteLength(raw, "utf8") < 32) {
    throw new Error("ENCRYPTION_MASTER_KEY must be at least 32 bytes for encrypted backups");
  }
  const secret = Buffer.from(raw, "utf8");
  return createHash("sha256").update(Buffer.concat([SALT, INFO, secret])).digest();
}

export function encryptBackup(plaintext, env = process.env) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, keyFromEnv(env), iv);
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(plaintext, "utf8")), cipher.final()]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({
    magic: MAGIC,
    version: 1,
    algorithm: ALGORITHM,
    createdAt: new Date().toISOString(),
    iv: iv.toString("base64url"),
    tag: tag.toString("base64url"),
    ciphertext: ciphertext.toString("base64url"),
  }) + "\n";
}

export function decryptBackup(envelopeText, env = process.env) {
  let envelope;
  try { envelope = JSON.parse(envelopeText); } catch { throw new Error("Encrypted backup envelope is invalid JSON"); }
  if (envelope?.magic !== MAGIC || envelope?.version !== 1 || envelope?.algorithm !== ALGORITHM) {
    throw new Error("Unsupported backup encryption envelope");
  }
  const iv = Buffer.from(String(envelope.iv ?? ""), "base64url");
  const tag = Buffer.from(String(envelope.tag ?? ""), "base64url");
  const ciphertext = Buffer.from(String(envelope.ciphertext ?? ""), "base64url");
  if (iv.length !== 12 || tag.length !== 16 || ciphertext.length === 0) throw new Error("Malformed backup encryption envelope");
  const decipher = createDecipheriv(ALGORITHM, keyFromEnv(env), iv);
  decipher.setAuthTag(tag);
  try {
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  } catch {
    throw new Error("Encrypted backup authentication failed");
  }
}

export function isEncryptedBackup(value) {
  try { return JSON.parse(value)?.magic === MAGIC; } catch { return false; }
}
