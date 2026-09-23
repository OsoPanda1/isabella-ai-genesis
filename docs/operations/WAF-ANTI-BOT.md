# WAF + Anti-Bot — P1

**Estado:** `implemented` — `vercel.json` `headers` + `src/lib/security.ts` `sanitizePayload` + `checkRateLimitByTenant`

- **WAF:** Vercel Firewall (managed) + `CSP` `frame-ancestors 'none'` + `X-Frame DENY`
- **Anti-bot:** `Upstash Ratelimit` por `IP` + `tenantId` + `quotas` + `WAF` rules (challenge)
- **Egress:** `isUpstreamAllowed` allowlist (`generativelanguage`, `groq`, `x.ai`, `stripe`, `mux`, `supabase`)

**Falta para 100%:** `WAF` custom rules en `Vercel` dashboard + `anti-bot` challenge en `api/isabella` + `quotas` en `k8s`.
