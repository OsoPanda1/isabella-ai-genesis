# CSP Nonces — P1 (HSTS preload + nonces)

**Objetivo:** migrar `unsafe-inline` → `nonces` + `hashes` + `report endpoint` + `HSTS preload`.

**Estado:** `implemented` — `src/lib/security.ts:generateCspNonce/buildCspHeader/getHstsHeader/injectSecureHeaders({nonce})` + `src/server.ts:withSecurityHeaders({nonce})` generan `nonce` por-request (`crypto.randomBytes(16).base64` → `script-src 'self' 'nonce-<value>'` sin `unsafe-inline` en prod). `vercel.json` mantiene `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` + CSP fallback estático. `style-src 'unsafe-inline'` pendiente de hashes.

**Implementación:**
- **Nonce generation:** `SecuritySystem.generateCspNonce()` y `server.ts generateCspNonceForRequest()` → `16 bytes base64`.
- **CSP builder:** `buildCspHeader(nonce?)` → si `nonce` presente usa `'nonce-<value>'`, si no `prod:'self'` / `dev:'self' 'unsafe-inline'`.
- **Headers:** `injectSecureHeaders(headers,{nonce})` y `withSecurityHeaders(res,{nonce})` setean `Content-Security-Policy` + `X-CSP-Nonce` + `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` + `X-Frame-Options: DENY` + `Permissions-Policy` etc.
- **HSTS preload:** `vercel.json:10` + `security.ts:536` + `server.ts:159` — valor canónico `max-age=63072000; includeSubDomains; preload` (2 años, RFC6797). Ver `https://hstspreload.org`.
- **Rate limiting tenant:** `security.ts:206` `checkRateLimitByTenant` / `checkRateLimitByTenantDistributed` + `secret-redactor.ts` integración `SecuritySystem.redactSecrets()`.

**Plan restante:**
- Generar `nonce` por request en `src/server.ts:handleRequest` y propagar a `HeadContent` vía `x-csp-nonce`.
- Añadir `Content-Security-Policy-Report-Only` con endpoint `/api/csp-report`.
- Eliminar `unsafe-inline` para `style-src` vía hashes/nonces.

**Evidencia:** `vercel.json` + `src/lib/security.ts:508-560` + `src/server.ts:149-189` + `src/lib/secret-redactor.ts` + `docs/operations/HSM-KMS.md`.
