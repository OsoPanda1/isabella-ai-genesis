# Plan por Fases — Cierre Deuda Técnica 92% → 100% Producción

**Fecha:** 2026-09-21T21:45Z
**Base:** Auditoría máxima grado 21 archivos, 30+ hallazgos críticos (C1-C9, A1-A6, S1-S8, IG1-IG9, PC1-PC8, B1-B8, DK1-DK5)
**Objetivo:** Isabella 100% lista para producción y despliegue Vercel sin 500, con flujo de datos íntegro, tenant isolation real y auditoría durable.

## Fase 0 — Saneamiento Inmediato (0.5 días) — 92% → 94%
- Unificar `pnpm@10.34.5` ya hecho (A). Verificar `pnpm install --frozen-lockfile` ✅
- `VITE_STATSIG_CLIENT_KEY` allowlist ya hecho (B). Verificar `Vercel` `prebuild` ✅
- `production-capabilities.json` SHA `68c3a88` → `c9d13b9` ya hecho, pero regenerar con SHA actual `ebc97fb` y evidencia real `Vercel READY` (C).
- **Gate:** `pnpm typecheck 0`, `pnpm build 747KB`, `pnpm test 501/511`.

## Fase 1 — P0 Zero Trust / Tenant Isolation (1.5 días) — 94% → 97%
**Hallazgos:** C1, C2, A3, S1, PC1, PC2, B1, B2, DK1
- **C1 `crown.ts:1271`:** `isApprovalValid` fail-closed si `approval.tenantId` ausente y `expectedContext.tenantId` presente. Usar `timingSafeEqual`, exigir `tenantId`, `actorId`, `requestId`, `policyVersion`.
- **C2 `crown.ts:834`:** Añadir `tenantId` obligatorio a `MemoryRecord` + `canAccessMemory` comparar `memory.tenantId === context.tenantId` + RLS.
- **A3 `authorization.ts:185`:** `resourceTenant` extraer de DB/recurso, no de `ctx.tenant_id`. ABAC `subjectTenant == resourceTenant` debe poder fallar.
- **S1 `security.ts:227`:** Unificar `tenantId`/`tenant_id` en RLS, eliminar `role: authenticated` fijo, rotar `SUPABASE_JWT_SECRET` con `kid`, `JWKS` distribuido.
- **PC1 `principal-context.ts:186`:** Cambiar `read(tenantId, tenantId)` tautológico → `read(subjectTenant, resourceTenant)` con verificación `principal.tenantId === session.tenantId`.
- **PC2 `principal-context.ts:438`:** Eliminar bypass `isGuestChat ? allow:true` — Guest debe pasar por PDP con `scope: isabella:chat` limitado, no `allow:true`.
- **B1 `core/beta/identity.ts:27`:** Eliminar fallback `anonymous`/`default-tenant` — `IdentityResolver` debe validar JWT/DB o `deny`.
- **DK1 `dual-kernel/index.ts:94`:** Propagar `tenantId` a `alphaMemory.retrieve({tenantId, ...})` y usar `memory-engine.ts` real con RLS, no `alpha/memory.ts` ficticia.
- **Gate:** `test/security/tenant-isolation` + `test/integration/runtime-chain` con `Tenant A vs B` deben pasar sin `anonymous`.

## Fase 2 — P0 Crypto y Auditoría Durable (1 día) — 97% → 98.5%
**Hallazgos:** A1, A2, DK2, S2, AR1, AR2
- **A1 `authorization.ts:60`:** Migrar `CryptoManager` de `Map` en memoria a `Postgres` (`advisory lock` por `tenantId`) o `Redis` con `HSM/KMS` (Vault). Persistir `signatureChainState` y `keyId` con rotación `grace 24h`, `revoked 90d`.
- **A2 `authorization.ts:79`:** Usar `fast-json-stable-stringify` para `calculateHash`/`signPayload` (orden recursivo) en lugar de `Object.keys(payload).sort()` shallow.
- **DK2 `dual-kernel/index.ts:347`:** Reemplazar `hashString` `djb` (8 hex) por `SHA256` (`createHash("sha256").update(canonicalBookPiPayload(...))`) para `requestHash`/`outputHash`/`policyHash`.
- **S2 `security.ts:13`:** `securitySecret()` debe capturar `throw` y retornar `503 degraded` en lugar de `500`.
- **AR1/AR2 `argus-recovery-mesh.ts:88`:** Unificar `verify` y `verifyAndAuthorize` con `timingSafeEqual` y persistir `consumed Set` en `DB` con `UNIQUE(planId, approver)`.
- **Gate:** `test/bookpi/bookpi-integrity` debe verificar cadena con `SHA256` y `verifySignature` exportado.

## Fase 3 — P0 Chat Gateway Orden y Prompt Injection (1 día) — 98.5% → 100%
**Hallazgos:** IG1, IG2, IG4, C3, C4, S3, S4, S6
- **IG2 `isabella-chat-gateway.ts:438`:** Mover `isKilled("inference")` **antes** de `executeChatSkillBridge` — kill-switch primero.
- **IG1 `isabella-chat-gateway.ts:418`:** Eliminar `isGuestLowRisk` bypass — `governance.denied` siempre `403`, incluso Guest. Guest debe recibir `403` con `evidenceStatus: E4` y opción de `appeal`, no fallback silencioso.
- **IG4 `isabella-chat-gateway.ts:382`:** Sanitizar `skillEvidence` con `allowlist` de campos (`skillId`, `status`, `summary`) y `JSON.stringify` con `stable-stringify`, no `JSON.stringify(result)` crudo. Añadir delimitadores `### SKILL_EVIDENCE ###` y sanitizar `systemInstruction` con `sanitizePayload` estricto.
- **C3 `crown.ts:561`:** Envolver `makeTraceId()` en `try/catch` y retornar `degraded` con `traceId: crypto.randomUUID().slice(0,8) + "-degraded"`.
- **S3 `security.ts:146`:** `checkRateLimitDistributed` con `Redis` obligatorio en prod, fallback a `429` con `retryAfter`, no `allow:true`. `resolveClientIp` debe validar `X-Forwarded-For` con `TRUSTED_PROXIES`.
- **Gate:** `test/security/aegis-adversarial` + `test/unit/chat-skill-bridge` con `kill-switch` activo deben dar `503`, no `200`.

## Fase 4 — Verificación Final y Entrega (0.5 días)
- `pnpm typecheck`, `pnpm build` (`740KB`), `pnpm test` (`501/511`), `pnpm security:scan`, `pnpm capabilities` (`100%`), `pnpm audit:routes`, `pnpm db:verify` con `DATABASE_URL` vivo, `pnpm production:preflight --json` (`static_ready`), `pnpm production:evidence` con `Vercel` `READY` + `smoke` (`curl /api/health` `200`).
- **Push y commit en `main`:** `git add -A && git commit -m "feat(production): 100% hardening total"` + `git push origin main` → `Vercel` `iad1` `pnpm@10.34.5` `frozen-lockfile` verde.
- **Entrega:** `isabella-ai.visitarealdelmonte.online` `200` sin `500`, flujo de datos íntegro, `BookPI` `hashChain` verificable, `NCUA` `50/500` con `hash`, `IDH-D` `auditIDHDBias` sin `disparateImpact`.

**Riesgos si no se hace:** Tenant isolation decorativa → filtración cross-tenant; auditoría reescribible → no `CERTIFIED`; Guest bypass → escalación; cache colisionada → datos de otro tenant; `500` por `crypto.randomUUID` o `memory.expiresAt` NaN.
