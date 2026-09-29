import { describe, expect, it } from "vitest";
import { decryptBackup, encryptBackup, isEncryptedBackup } from "../../scripts/db-backup-crypto.mjs";

describe("encrypted logical backup envelope", () => {
  const env = { ENCRYPTION_MASTER_KEY: "a".repeat(64) };

  it("round-trips plaintext with authenticated AES-256-GCM", () => {
    const plaintext = JSON.stringify({ manifest: { totalRows: 2 }, tables: { tenants: [{ id: "t1" }] } });
    const encrypted = encryptBackup(plaintext, env);
    expect(isEncryptedBackup(encrypted)).toBe(true);
    expect(decryptBackup(encrypted, env)).toBe(plaintext);
  });

  it("rejects tampering", () => {
    const encrypted = JSON.parse(encryptBackup("sensitive", env)) as { ciphertext: string };
    encrypted.ciphertext = encrypted.ciphertext.slice(0, -1) + (encrypted.ciphertext.endsWith("A") ? "B" : "A");
    expect(() => decryptBackup(JSON.stringify(encrypted), env)).toThrow("authentication failed");
  });

  it("rejects a missing/weak master key", () => {
    expect(() => encryptBackup("x", { ENCRYPTION_MASTER_KEY: "short" })).toThrow("at least 32 bytes");
  });
});
