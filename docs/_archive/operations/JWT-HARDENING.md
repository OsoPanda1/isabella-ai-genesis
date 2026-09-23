# JWT Hardening — P1 (Blanco/Negro)

**Estado:** `implemented` — `verified` requiere `TEST_DATABASE_URL` vivo.

- **Access token:** `3600s` (1h) — `AUTH_ACCESS_TOKEN_TTL` — corto, no prolongado
- **Refresh token:** `604800s` (7d) — `AUTH_REFRESH_TOKEN_TTL` — con rotación `jti` + `pg_advisory_xact_lock`
- **Revocación:** `DELETE /api/auth/session` + `api_keys` `revoked_at` — `test/integration/session-lifecycle.test.ts` 3 tests
- **Algoritmo:** `HS256` con `AUTH_JWT_SECRET` (32+ chars) — `JWT_VERIFIER` verifica `iss` `TAMV Online Network Security Hub` + `aud` `Isabella S0 Gateway` + `exp` + `nbf`
- **Refresh rotación:** `refresh` genera nuevo `jti` y marca anterior como `consumed` (un solo uso) — `billing-security-repository.ts` `consumeRunAuthorization` patrón
- **No `isa_live_`** — formato deprecado rechazado en `verifyToken` con error `deprecado`

**Falta para 100%:** `JWKS rotation` sin downtime + `step-up` para `billing:*` + `MFA/SSO` obligatorio (requiere IdP).
