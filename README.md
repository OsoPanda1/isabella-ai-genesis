# Isabella Villaseñor AI™ — Genesis

### Infraestructura cognitiva territorial, gobernada y auditable — TAMV Online Network · Nodo Cero

> **"Las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta."**
> **Blanco o negro. Sin grises. Si no se corrige, no se engaña.**

Isabella es el núcleo cognitivo y de gobernanza de **TAMV Online Network / CITEMESH** en **Real del Monte, Hidalgo, México (2,770 msnm)**. No es chatbot ni AGI: es **arquitectura coordinadora** de identidad, memoria, políticas, herramientas, economía, seguridad y decisión asistida.

**Autoría:** Edwin Oswaldo Castillo Trejo / Anubis Villaseñor — ORCID `0009-0008-5050-1539` — Real del Monte, Hidalgo  
**Licencia:** CC BY 4.0 (docs/contenido) + Apache-2.0 + ISC — ver `LICENSE`, `LICENSE-*`, `SECURITY.md`  
**Documentación canónica:** [`docs/INDEX.md`](docs/INDEX.md) → `AGENTS.md` + `docs/01..06`

---

## Declaración de orgullo latinoamericano

> ¡A huevo que somos latinoamericanos! 🇲🇽🇧🇷🇦🇷🇨🇴🇵🇪🇨🇱  
> *Construido en Real del Monte, Hidalgo — Nodo Cero — para Latinoamérica y el mundo.*

---

## Ficha verificada (SSOT = `package.json` + gates locales)

| Campo | Valor verificable |
|---|---|
| **Repo** | `OsoPanda1/isabella-ai-genesis` — rama `main` |
| **Versión** | **`4.3.3`** |
| **Node / pnpm** | `>=22 <25` · `pnpm@10.34.5` · `.nvmrc` `24.11.0` |
| **Runtime** | TanStack Start `1.168.32` + Nitro `3.0.260603-beta` + Vite `8.2` + Vercel `iad1` |
| **UI / datos** | React `19.2` · Tailwind `4` · Prisma `5.22` · `pg` · Neon/Postgres · Supabase IdP |
| **Pagos** | Stripe `22.6` · BookPI WORM · Cattleya · x402 (ECDSA P-384 real) |
| **Typecheck / Lint** | Se exigen en `pnpm production:gate` y en CI FGAIS |
| **Tests** | `pnpm test` (Vitest 4) — ver `production-capabilities.json` `test_summary` |
| **Economía** | Rutas monetization/x402 → **`503 CAPABILITY_NOT_CERTIFIED`** en staging/production |
| **Readiness global** | **`81%`** = 100% implementación verificable + 62% despliegue vivo / 2 |

> **No es 100% global.** `100%` de certificación exige Neon RLS live, Stripe live, HSM, Vercel health same-commit, evidence runner de los 500 gates y rollback demostrado. `EVIDENCE_GATED` no cuenta como PASS (`AGENTS.md` §19).

---

## 1. Qué es / Qué no es

**Es:** pipeline FGAIS + CROWN v6 (12 nodos) + BookPI + NCUA + ML gobernado + HDC + skills + economía fail-closed + **categoría TINA**.  
**No es:** AGI autónoma, persona digital, certificación legal/financiera, ni sistema que oculte el nivel epistémico `E0–E4`.

### Categoría TINA — Trusted Intelligence, Native & Adaptive

**Isabella Villaseñor AI es la primera AI declarada en la categoría TINA** (spec `0.1.0-genesis`).  
Módulo real: `src/lib/tina/` · skill `TINA` · capability `category.tina` (`implemented`, **no** productionSafe).  
Detalle: [`docs/07-TINA-CATEGORIA.md`](docs/07-TINA-CATEGORIA.md). Declaración de categoría ≠ certificación de producción.

---

## 2. Arquitectura — 4 planos · CROWN v6 · 7 federaciones

| Plano | Componentes | Estado |
|---|---|---|
| **Experiencia** | `IsabellaClientApp`, cockpit, monitor de transparencia | Operativo (UI) |
| **Cognitivo** | dual kernel / language core / ML gobernado / skills | Implementado |
| **Gobernanza** | CROWN v6, ARGUS, RBAC/ABAC, BookPI, IGDS, NCUA | Implementado |
| **Infra** | Neon Postgres, Supabase IdP, Upstash, Nitro/Vercel, QPU bridge | Implementado / parcial live |

**Pipeline canónico:** `Perceive → Remember → Policy Gate → Decide (CROWN v6) → Act → Audit → Respond`  
**Autoridad runtime:** `src/lib/crown-runtime-authority.ts` (v6) — `crown.ts` es compatibility adapter v2.

---

## 3. Seguridad — hardening triangular

Tres raíces independientes; una operación crítica solo es válida si las tres cierran:

```
T1 Identity  → JWT/JWKS/OIDC, sesión, revocación, API keys   (jwt-verifier, auth-verification-layer)
T2 Policy    → CROWN/ARGUS PDP+PEP, RBAC/ABAC, capabilities  (crown-runtime-authority, authorization)
T3 Evidence  → BookPI WORM + IGDS seal + audit append-only    (bookpi-*, igds/*, sovereign-audit)
```

- **Envelope AES-256-GCM + KMS wrap:** `src/lib/crypto/triangular-envelope.ts`
- **Triple vértice (AES-GCM · ChaCha20-Poly1305 · HMAC-SHA3-512/BookPI):** `src/lib/crypto/triple-hardening-triangulation.ts` (fail-closed)
- **Firma ledger:** `src/lib/crypto/bookpi-signer.ts` — `ECDSA-P384` / `RSA-SHA256`; `ML-DSA-87` **solo** simulación (aborta en prod/staging)
- **Headers:** HSTS + CSP con nonce fail-closed + `X-Frame-Options: DENY` + `nosniff`
- **Secretos:** jamás en logs/docs/tests (`test/security/secret-exposure.test.ts`); valores históricos comprometidos **REDACTED**; rotación documentada en `SECURITY.md`

---

## 4. Economía — honesta

```
idempotency-key → BEGIN → debit → credit → BookPI WORM → COMMIT | ROLLBACK
```

- Planes y cuotas definidos en código; sin `STRIPE_SECRET_KEY` → **fail-closed 503**
- x402: firma ECDSA P-384 real, bindings amount/resource/tenant, anti-replay, TTL 5 min
- Refunds = eventos nuevos (append-only); sin mutación silenciosa del ledger

---

## 5. Comandos

```bash
pnpm install --frozen-lockfile
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm verify:lock
pnpm production:gate          # cadena completa same-commit
pnpm capabilities             # matriz de capacidades
pnpm security:scan            # eslint security + secret scan
```

Deploy: push a `main` → Vercel/Nitro. **Prohibido** `--force` en historia publicada (`AGENTS.md` §2.1).

---

## 6. Estructura del repo

```
AGENTS.md                 # SSOT arquitectónica para agentes
docs/INDEX.md             # índice canónico de documentación
docs/01..06               # dominios unificados (canónicos)
docs/_archive/            # histórico (no usar como cifra actual)
src/lib/                  # núcleo (crown, auth, bookpi, igds, crypto, pipeline)
src/routes/api/           # HTTP delgado
src/server-routes/api/    # handlers de alto riesgo (billing, etc.)
scripts/quantum/          # quantum bridge Python (boundary)
supabase/migrations/      # esquema y RLS
test/                     # unit · security · integration · bookpi
production-capabilities.json  # manifiesto de readiness
```

---

## 7. Contribución

`feat|fix|docs/<scope>` → typecheck + lint + test + build → PR con evidencia → `main` sin force.  
CODEOWNERS y plantilla de PR en `.github/`.

---

## 8. Licencia y contacto

**Edwin Oswaldo Castillo Trejo / Anubis Villaseñor** — ORCID `0009-0008-5050-1539`  
Seguridad: ver `SECURITY.md` (Security Advisories, no issues públicos para secretos).  
Readiness y gates: `production-capabilities.json` + `docs/evidence/`.
