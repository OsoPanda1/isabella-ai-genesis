# HSM / KMS — Custodia de Claves y Firma Soberana

**Estado:** `implemented-parcial` — HSM lógico durable + KMS envelope real en producción; HSM hardware en roadmap Nodo Cero.

**Referencias canónicas:**
- `src/lib/authorization.ts:60` — `CryptoManager` con `hsm_signature_chain` + `pg_advisory_xact_lock` (fuente de verdad: Postgres, cache L1 memoria)
- `src/lib/kms-provider.ts:42` — `EnvKMSProvider` AES-256-GCM + HKDF-SHA3-512 (§4.1 Charter)
- **Rotación de JWT `kid`:** implementada en `src/lib/jwks-cache.ts` + `src/lib/jwt-verifier.ts` (allowlist de issuers + kid). Los módulos legados `keyring.ts` / `key-rotation.ts` fueron eliminados en el saneamiento 2026-09-24 por estar sin consumidores (0 refs).
- `src/lib/crypto/triangular-envelope.ts:31` — `tri-envelope-v1` (DEK efímera 256-bit + KEK wrap + HMAC-SHA3-512)
- `src/lib/crypto/triple-hardening-triangulation.ts` — `triangulation-v3-hardened` (AES-GCM · ChaCha20-Poly1305 · HMAC-SHA3-512 + checksum tripartito SHA-384) — test: `test/unit/triple-hardening-triangulation.test.ts`
- `src/lib/secrets.ts:18` + `src/lib/config.ts:1` — única vía `process.env` → `config()` → `secrets.*`
- `src/lib/secret-redactor.ts` — redacción `[REDACTED]` en logs/auditoría

---

## 1. Arquitectura

### 1.1 KMS Envelope (triangular)

```
plaintext → DEK (CSPRNG 32B) + nonce 12B
          → AES-256-GCM (AAD = tri-envelope-v1|keyId|tenantBinding)
          → { dek, nonce, ciphertext, tag, wrappedDek, checksum }
wrappedDek = KEK.wrap(DEK)   // AWS KMS GenerateDataKey | GCP encrypt | YubiHSM PKCS#11
checksum   = SHA-256(AAD|nonce|ciphertext|tag|wrappedDek)
tenantBinding = SHA-256(isabella|tenantId|purpose)   // aislamiento criptográfico por tenant
```

- `triangular-envelope.ts:38` genera DEK efímera por mensaje; KEK nunca sale del KMS.
- Derivación local (dev): `deriveLocalKmsKey()` HKDF-SHA256(master 32B, keyId) — solo fallback, no en prod.
- `kms-provider.ts:60` HKDF-SHA3-512 con `info = isabella-kms-v1|keyName` + AES-256-GCM `v1:iv:ct:tag`.

### 1.2 HSM Signature Chain

```
previous_hash (genesis_hash_... si vacío)
    │
    ▼
decisionHash = SHA3-512(canonical JSON payload)
signature    = ECDSA P-384 (SHA384) sobre payload
sigChain     = SHA3-512(previousSigChain + signature)   // cadena inmutable
```

- Tabla durable `hsm_signature_chain (tenant_id PK, last_hash, sigchain, updated_at)` creada idempotente en `authorization.ts:160`.
- Serialización por tenant: `pg_advisory_xact_lock(sha256(tenantId).readInt32BE)` + `SELECT ... FOR UPDATE` dentro de `BEGIN/COMMIT` (`authorization.ts:157`).
- Cache L1 en memoria (`signatureChainState`) solo para fast-path dev; fuente de verdad = Postgres en `ISABELLA_RUNTIME_MODE=production` + `DATABASE_URL`.
- Fallback automático a memoria con `console.warn` si `Pool` falla — fail-closed, nunca pierde decisión.

### 1.3 Keyring y rotación

- `Keyring` indexado por `kid` (8 hex de `sha256(label:nonce|master)`). Activa + históricas.
- `generateKeyMaterial()` usa `randomBytes(6)` — kid único, secret derivado HMAC-SHA512.
- Verificación acepta cualquier `kid` en keyring (tokens en vuelo tras rotación).

### 1.4 Secret Redactor

- `buildSecretPatterns()` detecta literales ≥8 + `Bearer` + `querySecret` + `BUILTIN_KEYS` → `[REDACTED]` en `src/server.ts` y `SecuritySystem.redactSecrets()`.

---

## 2. Custodia

### 2.1 Principios

| Principio | Implementación |
|---|---|
| **Separación de dominios** | HKDF info distinto por `keyName`/`purpose`; nunca reutilizar KEK entre `jwt` / `encryption` / `bookpi` |
| **Separación de deberes** | `SovereignOwner` autoriza rotación; `Operator` no puede emitir `kid` fuera de su scope (`permission-matrix.ts`) |
| **Defensa en profundidad** | DEK efímera + KEK en KMS + HMAC checksum + GCM tag + advisory lock |
| **Trazabilidad** | Toda rotación/revocación → `audit-repository.ts` append-only + `traceId` |

### 2.2 Dónde viven las claves hoy

| Secreto | Origen actual | Custodia objetivo |
|---|---|---|
| `AUTH_JWT_SECRET` | `config.ts` ← `process.env` (validado ≥32 chars en prod `assertProductionCrypto`) | AWS KMS `alias/isabella-jwt-kek-prod` con auto-rotation 90d |
| `ENCRYPTION_MASTER_KEY` | `EnvKMSProvider.masterKey()` (≥32 chars) | YubiHSM 2 / AWS CloudHSM `External` + PKCS#11 |
| `BOOKPI_SIGNING_KEY` | `secrets.bookpiSigningKey()` | HSM físico Nodo Cero + `LITe attestation` (SGX/SEV) |
| `CROWN_POLICY_SIGNING_KEY` | `secrets.policySigningKey()` | K8s `authz-runtime` sidecar, nunca en env del app |
| `API_KEY_HASH_SECRET` | `secrets.apiKeyHashSecret()` | KMS dedicado, rotación independiente |

- **Regla de oro:** ningún `KEK` en `.env` del app en staging/prod. El `k8s/authz-runtime` sidecar hace `wrap/unwrap` vía `EnvelopeKms`.
- Transporte: `vercel.json` + `security.ts` `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` + `CSP nonces` (`docs/operations/CSP-NONCES.md`).

### 2.3 Acceso y permisos

- Solo `src/lib/config.ts` lee `process.env`; resto usa `config()` / `secrets.*`.
- `requiredEnvKeys(mode)` falla fast si falta secreto en prod/staging (`config.ts:99`).
- `pnpm security:scan` (`eslint.security.mjs` + `secret-scan.mjs`) debe dar 0 secretos en repo.
- `.env.example` actualizado, sin valores reales; `SOPS`/`Vault` para distribución a K8s.

### 2.4 Roadmap custodia 100%

- **Fase 1 (actual):** `k8s/authz-runtime` sidecar + envelope + `hsm_signature_chain` durable — done.
- **Fase 2:** migrar `KEK` a `AWS KMS alias/isabella-kek-prod` con `auto-rotation 90d` + `CloudTrail` audit + `GCP HSM` espejo.
- **Fase 3:** HSM físico en Nodo Cero (Real del Monte) con `PKCS#11` + `LITe attestation` + `SLSA L3` (`sbom.json` + `provenance`).

---

## 3. Rotación

### 3.1 Política

| Clave | Ventana | Gracia | Mecanismo |
|---|---|---|---|
| JWT `kid` | 90 días | determinado por `jwks-cache` allowlist + emisión de `kid` nuevo en `jwt-verifier` | Rotación manual: emitir secreto nuevo (`AUTH_JWT_SECRET`), actualizar `jwks-cache`, redeploy; tokens en vuelo con `kid` anterior se aceptan solo dentro de la ventana de gracia documentada en `jwks-cache.ts` |
| `ENCRYPTION_MASTER_KEY` | 90 días | re-wrap DEKs | nuevo `kid` → `re-wrap` vía `triangular-envelope` |
| `BOOKPI_SIGNING_KEY` | 90 días o tras incidente | inmediata si compromiso | rotar `BOOKPI_SIGNATURE_ALGORITHM` ECDSA-P384 + `kid` versionado |
| API Keys `isk_` | a demanda / 90d | inmediata | `POST /api/v1/api-keys/rotate` (ver `docs/operations/API-KEYS-ROTATION.md`) |

> **Nota de saneamiento (2026-09-24):** el módulo `KeyRotationService` / `keyring.ts` / `key-rotation.ts` fueron eliminados por 0 consumidores en runtime (`grep` confirmó). La rotación JWT real hoy se maneja en `jwks-cache.ts` + `jwt-verifier.ts` (rotación de `kid` por re-emisión de JWKS) y en el runbook operativo de este documento.

### 3.2 Procedimiento JWT (canónico — post-saneamiento)

```ts
// src/lib/jwt-verifier.ts + src/lib/jwks-cache.ts (runbook operativo)
// 1. Rotar AUTH_JWT_SECRET (o kid) en config.ts / env
// 2. Actualizar JWKS cache (jwks-cache.ts invalidación por kid)
// 3. Redeploy + smoke test de verify con kid nuevo
// 4. Auditoría: registrar kid nuevo + activeKid anterior en audit_events con obligations: ["pqc_signature_required"]
```

1. Emitir secreto/`kid` nuevo en `config.ts` (única vía `process.env`).
2. Invalidar `jwks-cache` y actualizar allowlist de `jwt-verifier` si aplica.
3. Verificar que `kid` histórico sigue aceptándose dentro de gracia (tokens en vuelo) hasta fin de ventana.
4. Auditoría: registrar `kid` nuevo + `activeKid` anterior en `audit_events` con `obligations: ["pqc_signature_required"]`.

### 3.3 Procedimiento Envelope KEK

```bash
# AWS KMS (fase 2)
aws kms create-key --description "isabella-kek-prod" --key-usage ENCRYPT_DECRYPT --origin AWS_KMS
aws kms create-alias --alias-name alias/isabella-kek-prod --target-key-id <key-id>
aws kms enable-key-rotation --key-id alias/isabella-kek-prod  # 90d automático
# Re-wrap DEKs existentes
for dek in $(list-wrapped-deks); do aws kms re-encrypt --ciphertext-blob $dek --destination-key-id alias/isabella-kek-prod; done
```

- En dev/local: `ENCRYPTION_MASTER_KEY` rotado manualmente → `deriveLocalKmsKey` cambia subclaves; re-cifrar con `encryptTriangularEnvelope`.

### 3.4 Verificación post-rotación

```bash
pnpm typecheck && pnpm build
pnpm test -- jwt jwks auth-verification    # cubre verify + kid allowlist
pnpm security:scan
# Validar que tokens viejos (kid histórico) aún verifican y tokens nuevos usan kid activo
```

---

## 4. Revocación

### 4.1 Cuándo revocar

- Compromiso sospechado de cualquier `KEK`/`kid`/`BOOKPI_SIGNING_KEY`.
- Empleado/rol con acceso a secreto sale del equipo.
- `secret-scan.mjs` detecta fuga en commit/log.
- Anomalía `behavior_score > 80` o `audit` detecta firma inválida.

### 4.2 Revocación inmediata (incident response)

```sql
-- 1. Bloquear kid comprometido (fail-closed)
INSERT INTO keyring_revocation (kid, reason, revoked_at, revoked_by)
VALUES ('a1b2c3d4', 'compromiso sospechado — rotación forzada', NOW(), 'SovereignOwner')
ON CONFLICT (kid) DO NOTHING;

-- 2. Invalidar cadena HSM afectada (opcional, si firma comprometida)
UPDATE hsm_signature_chain SET last_hash = 'revoked_' || last_hash WHERE tenant_id = '<tenant>';

-- 3. Auditar
INSERT INTO audit_events (trace_id, decision, obligations, metadata)
VALUES (gen_random_uuid(), 'deny', ARRAY['revoked-kid:a1b2c3d4'], '{"reason":"revocación inmediata"}'::jsonb);
```

```ts
// 4. Código: invalidar kid revocado en allowlist (jwt-verifier / jwks-cache)
const revokedKid = "a1b2c3d4";
// Remover de jwksCache allowlist + deny en verify si kid en lista de revocación
// O forzar invalidación de cache completa: jwksCache.invalidate();
```

- Toda verificación con `kid` revocado → `deny:revoked-kid` (check `hasRevoked(kid)` antes de `kid` match en `jwt-verifier`).
- `api-keys`: `DELETE /api/v1/api-keys/:id` + `revocation list` en `audit-repository.ts` append-only.

### 4.3 Lista de revocación

- Tabla `keyring_revocation (kid PK, reason, revoked_at, revoked_by)` — consultada en cada `verify` (o equivalente en `audit-repository` si no existe tabla dedicada).
- Cache L1 con TTL 60s; invalidación por `NOTIFY` en Postgres si se usa.
- Nunca borrar de `audit_events`; revocación es append-only.

### 4.4 Rotación forzada tras revocación

1. Revocar `kid` comprometido (arriba).
2. Rotación inmediata: emitir `kid`/secreto nuevo en `config.ts` + `jwks-cache` invalidación + redeploy.
3. Re-wrap todos los `wrappedDek` con nuevo `KEK` (`triangular-envelope`).
4. Re-emitir `BOOKPI_SIGNING_KEY` / `CROWN_POLICY_SIGNING_KEY` si afectados; actualizar `config.ts` env + redeploy.
5. `SLSA provenance` nuevo + `sbom.json` con nuevo `kid` fingerprint.

---

## 5. Operación diaria

### 5.1 Checks

```bash
pnpm typecheck && pnpm build
pnpm security:scan                          # 0 secretos
pnpm db:verify                              # migraciones + hsm_signature_chain existe
pnpm test -- jwt jwks kms triangular         # unit (post-saneamiento)
# Prod:
SELECT tenant_id, updated_at FROM hsm_signature_chain ORDER BY updated_at DESC LIMIT 10;
-- (keyring_state eliminado junto con key-rotation.ts — ver nota §3.1)
```

### 5.2 Monitoreo

- Métrica `hsm_chain_lag_seconds` (updated_at vs now) — alerta si >5m.
- Métrica `kms_wrap_errors_total` — alerta si >0 en 5m.
- Log `[CryptoManager] Durable HSM enabled` en boot prod; `[Durable fallback a memoria]` → investigar Pool/DB.

### 5.3 Backup y recuperación

- `hsm_signature_chain` incluido en `scripts/db-backup.mjs` (ver `docs/operations/BACKUP-VERIFICATION.md`); `keyring_state` eliminado con `key-rotation.ts`.
- Restauración: replay `audit_events` + verificar `sigchain` con `SHA3-512`; mismatch → incidente.

---

## 6. Evidencia y cumplimiento

- `src/lib/authorization.ts:60` `hsm_signature_chain + pg_advisory_xact_lock` + `src/lib/crypto/triangular-envelope.ts` (keyring.ts eliminado — ver §3.1)
- `src/lib/secret-redactor.ts` + `src/lib/security.ts` `generateCspNonce/buildCspHeader/getHstsHeader` + `vercel.json` HSTS preload
- `supabase/migrations/*` RLS con `SUPABASE_JWT_SECRET` legacy; `prisma/schema.prisma` autoridad durable
- Falta para 100%: `key custody` hardware (YubiHSM 2 / AWS KMS `External` + `CloudHSM` / GCP `HSM`) + `rotación automática` + `revocación en línea` + `audit HSM` con `SLSA provenance` (`docs/operations/SLSA-PROVENANCE.md`).

## 7. Referencias

- `docs/operations/API-KEYS-ROTATION.md` — rotación `isk_` idempotente
- `docs/operations/BACKUP-VERIFICATION.md` — verificación de backups
- `docs/operations/SLSA-PROVENANCE.md` — provenance por release
- `AGENTS.md:12` — módulos de autoridad y prohibiciones
