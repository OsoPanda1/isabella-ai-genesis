# Rate Limiting — P1 (Tenant + IP)

**Estado:** `implemented` — `src/lib/security.ts` `checkRateLimitByTenant` + `checkTenantQuota`

- **IP:** `30/min` `RATE_LIMIT_WINDOW_MS 60000` + `Upstash Redis` distribuido `fail-closed` en `production`
- **Tenant:** `60/min` + `quotas 50k` con `tenantRateLimitCache` + `tenantQuotaCache` aislados por `tenantId`
- **Distributed:** `ratelimit:tenant:${tid}:${window}` en Redis, `expire 60`, `degraded` si Redis no disponible en prod
- **Verificación:** `test/security/rls-adversarial.test.ts` 14 tests — `Tenant A` agota `3/3` → `B` sigue `ALLOW`, `A` consume `60/100` → `B` intacto

**Falta para 100%:** `WAF` + `anti-bot` + `quotas` en `Vercel` + `k8s NetworkPolicy` ya en `k8s/networkpolicy.yaml`.
