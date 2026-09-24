# HSM / KMS — Custodia de Claves y Firma Soberana (P1)

**Estado:** `implemented-parcial` — `src/lib/authorization.ts:60` `hsm_signature_chain + pg_advisory_xact_lock` + `src/lib/keyring.ts` envelope + `src/lib/crypto/triangular-envelope.ts` AES-256-GCM. `secret-redactor.ts` previene fuga en logs. Custodia actual `memory+KMS simulado` (no HSM hardware).

**Arquitectura canónica:**
- **KMS Envelope:** `DEK` efímera 256-bit (CSPRNG `crypto.randomBytes`) → envuelta con `KEK` del KMS (AWS KMS `GenerateDataKey` / GCP `encrypt` / YubiHSM `wrap`). `triangular-envelope.ts:40` `dek+nonce+ciphertext+tag+wrappedDek` con `HMAC-SHA3-512` en `triple-hardening-triangulation.ts`.
- **HSM Signature Chain:** `bookpi-postgres-repository.ts` `previous_hash→block_hash→nonce→signature_algorithm(pqc)` + `pg_advisory_xact_lock` para append serializable. Fallback dev: `bookpi-dev-repository.ts` HMAC local.
- **Keyring:** `keyring.ts:75` `deriveKeyId(label:nonce,master)` + rotación por `kid` versionado. `config.ts` única vía `process.env` → `AUTH_JWT_SECRET`, `ENCRYPTION_MASTER_KEY`, `BOOKPI_SIGNING_KEY`, `CROWN_POLICY_SIGNING_KEY` + `secrets.ts` vault.
- **Secret Redactor:** `secret-redactor.ts:45` `buildSecretPatterns` (literales ≥8 + `Bearer` + `querySecret` + `BUILTIN_KEYS`) → `[REDACTED]` en `src/server.ts` `redact(err.stack)` y `SecuritySystem.redactSecrets()`.

**Operación:**
- **Rotación:** `kid` nuevo → re-wrap DEKs; `rotation window 90d`; `revocación` vía `keyring revocation list` + `audit-repository.ts` append-only.
- **Custodia fuera del proceso (roadmap 100%):** `k8s/authz-runtime` sidecar con `KMS` + `envelope` + `LITe attestation` (SGX/SEV) — ninguna `KEK` en env del app. `vercel.json` headers + `security.ts` `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` garantizan transporte.
- **Verificación:** `pnpm security:scan` (`eslint.security.mjs` + `secret-scan.mjs`) 0 secretos; `docs/operations/CSP-NONCES.md` nonces plan; `supabase/migrations/*` RLS con `SUPABASE_JWT_SECRET` legacy.

**Falta para 100%:** `key custody` hardware (YubiHSM 2 / AWS KMS `External` + `CloudHSM` / GCP `HSM`) + `rotación automática` + `revocación en línea` + `audit HSM` con `SLSA provenance` (`docs/operations/SLSA-PROVENANCE.md`).

**Plan:**
- Fase 1: `k8s/authz-runtime` sidecar + `envelope` (actual) — done.
- Fase 2: migrar `KEK` a `AWS KMS` `alias/isabella-kek-prod` con `auto-rotation 90d` + `CloudTrail` audit.
- Fase 3: `HSM` físico en Nodo Cero (Real del Monte) con `PKCS#11` + `LITe attestation` + `SLSA L3` (`sbom.json` + `provenance`).

**Evidencia:** `src/lib/security.ts:generateCspNonce/buildCspHeader/getHstsHeader` + `src/lib/secret-redactor.ts` + `src/lib/crypto/*` + `vercel.json` HSTS preload.
