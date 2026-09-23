# SSoT — Single Source of Truth por Dominio (P1-01)

> **Blanco o negro.** Un dominio, una autoridad. No hay dualidad ambigua.

| Dominio | Autoridad Durable | Adaptador / Réplica | Notas |
|---|---|---|---|
| **Identidad / Auth** | `Neon Postgres` `tenants` + `sessions` + `api_keys` ( `DATABASE_URL` ) | Supabase Auth es **IdP externo** — no autoridad de sesión | `src/lib/persistence/repository-factory.ts` `isProduction()` → `NeonRepository` |
| **BookPI / Ledger** | `Neon` `bookpi_ledger` WORM `SHA3-512` + `ECDSA P-384` | `bookpi.test-adapter.ts` solo `test/dev` | `src/lib/repositories/bookpi-postgres-repository.ts` `hashBlock()` |
| **Billing / Pagos** | `Neon` `economic_events` + `billing-security` | Stripe es **proveedor** — no autoridad de saldo | `src/lib/economic-events.ts` + `claimWebhookEvent` |
| **Memoria** | `Neon` `memories` + `audit_events` `pg_advisory_xact_lock` | `memory-repository.ts` `InMemory` solo `test` | `src/lib/repositories/memory-repository.ts` |
| **Embeddings / Vector** | `Neon` `vector` ext `pgvector` | Upstash Vector es **cache** | `supabase/migrations` `vector` |
| **Telemetría / OTel** | `Neon` `observability_events` + OTLP collector | Upstash Redis es **rate limit** | `src/lib/telemetry/observability.ts` |
| **Governance / CROWN** | `Neon` `policy_version` + `CROWN_POLICY_SIGNING_KEY` (64 hex) | — | `src/lib/crown.ts` |

**Regla P1-02:** `Prisma` solo genera client (`src/generated/prisma`), `Drizzle` no se usa en runtime crítico, `pg` (`Pool`) es driver. Migraciones solo vía `supabase/migrations/*.sql` — no `prisma migrate` en prod.

**Regla P1-03:** `Nitro 3.0.260603-beta` pineado en `pnpm-lock.yaml` — justificado por `TanStack Start 1.168` + `Vercel preset`. `SBOM` por release + `rollback` test requerido antes de stable.

**Verificación:** `pnpm db:verify` + `test/security/isolation-evidence.test.ts` (20 writers concurrentes) + `test/security/secret-exposure.test.ts`.
