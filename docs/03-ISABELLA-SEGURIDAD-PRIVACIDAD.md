# 03 — ISABELLA SEGURIDAD Y PRIVACIDAD

> **Unifica:** `SECURITY.md`, `ARGUS-DEFENSE-ARCHITECTURE`, `JWT-HARDENING`, `HARDENING-TRIANGULADO`, `PRIVACY-AND-DATA-GOVERNANCE`, `AI-DECISION-DISCLOSURE`, `THIRD-PARTY-LICENSE-POLICY`, `REGULATORY-AND-GOVERNANCE-MATRIX`, `adr-001-authorization-plane`, `adr-002-api-key-plane`, `adr-003-aegis-integration`, `adr-005-sandbox-execution`, `adr-008-env-fail-fast`, `adr-009-health-checks`, `SECURITY-KEYS`, `ARCs`, `audits`

**Incidente P0-01:** `README 11fdb69` expuso `CROWN` `C869...` → rotado `9183...` (64 hex) + `test/security/secret-exposure.test.ts` 4 verde + `Vercel env rm/add` + `BFG` pendiente — `SECURITY.md`

## 1. Zero Trust
`tenant_id` nunca del cliente (`tenant-guard.ts` + `principal-context.ts` + `isExplicitDevelopmentAuth`) — `PDP` `CROWN/POLICY` + `PEP` `withSovereignAuth`

**Headers:** `HSTS 63072000` + `CSP default-src 'self'` + `X-Frame DENY` + `nosniff` (`vercel.json` + `security.ts` + `server.ts`)

**Sanitización:** `sanitizePayload` en `local-responder`/`connect`/`isabella-chat-gateway` + `secret-redactor` antes de logs

## 2. Auth — Identidad Unificada
**Autoridad canónica:** `Supabase Auth/OIDC` → `PrincipalContext` → `RBAC/ABAC` → `CROWN`

`UserAuthService` **bloqueado en `production/staging`** (`fail-closed`, `role: Operator` fijo, `PBKDF2 100k` legacy → `Argon2id` recomendado) — `src/lib/user-auth-service.ts:66`

`JWT HS256 3600s` + `refresh 7d` con `jti` rotación, `isa_live_` deprecado — `docs/operations/JWT-HARDENING.md`

`JWKS` rotation + `step-up` para `billing:*` + `MFA/SSO` obligatorio (pendiente IdP)

## 3. Crypto — Hardening Triangulado
`ML-KEM/ML-DSA/SLH-DSA` + `AEAD` + `HSM hsm_signature_chain + pg_advisory_xact_lock` — `quantum-bridge-client.ts` allowlist `PATH/PYTHONPATH` — nunca `...process.env`

**LITLE 32 Gates:** `postQuantumCrypto.ts` `LAB_ONLY` tras `FEATURE_LAB_MODE`

## 4. Privacidad
Minimizar, cifrar, TTL, borrado — `data:personal:process` requiere permiso — `Right to correction` — `firestore.rules` `allow false` + `RLS` `tenant_id = current_tenant_id()`

---

*Unifica 20+ docs de seguridad. Ver `02` para operaciones, `04` para economía.*
