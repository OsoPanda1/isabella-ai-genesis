# CSP Nonces — P1

**Objetivo:** migrar `unsafe-inline` → `nonces` + `hashes` + `report endpoint`.

**Estado:** `vercel.json` ya tiene `CSP default-src 'self'` + `script-src 'self'` en prod, `style-src 'unsafe-inline'` pendiente de nonces.

**Plan:**
- Generar `nonce` por request en `src/server.ts` `withSecurityHeaders` + `cspNonce` en `HeadContent`
- Añadir `Content-Security-Policy-Report-Only` con endpoint `/api/csp-report`
- Eliminar `unsafe-inline` para `script-src` en prod

**Evidencia:** `vercel.json` + `src/lib/security.ts` `injectSecureHeaders`
