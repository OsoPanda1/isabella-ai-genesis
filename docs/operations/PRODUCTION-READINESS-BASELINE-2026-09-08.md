# Production Readiness Baseline — 2026-09-08

## Status

**Current classification: NOT Production-Verified.**

This document is an evidence ledger, not a declaration of readiness. A capability is only considered production-verified after a reproducible green gate and runtime evidence exist.

## Current commit

`fe2a68edf9bc087b36db81f7a5a41bb8e67bd7ae`

## Evidence observed

| Gate | State | Evidence |
|---|---|---|
| Canonical Isabella gateway | Implemented | `src/lib/isabella-chat-gateway.ts` |
| Canonical `/api/isabella` | Implemented | `src/routes/api/isabella.ts` |
| Compatibility `/api/v1/isabella` | Implemented | `src/routes/api/v1/isabella.ts` |
| Duplicate legacy Isabella route | Removed | `src/server-routes/api/isabella.ts` absent by design |
| Governance / CROWN | Implemented | Canonical gateway and principal context |
| Distributed rate limiting | Implemented | Production gateway path |
| Kill switch | Implemented | Production gateway path |
| Gemini provider | Implemented | Streaming REST gateway |
| Standard API envelope | Implemented | `src/lib/api-contracts.ts` |
| Production integrity gate | Implemented | `scripts/production-integrity-gate.mjs` |
| Production preflight | Implemented | `scripts/production-preflight.mjs` |
| CI production gate | Configured | `.github/workflows/fgais-gate.yml` |
| Supabase baseline migration | **Fixed** | Fresh-preview failures corrected in commit `fe2a68e...` |
| Supabase preview after latest fix | Pending | Check `102243513331` was still in progress at capture time |
| GitHub validation workflows | **Failing / unresolved** | Recent jobs terminate before steps; no executable step evidence was produced |
| Vercel deployment | Pending | Deployment status `HTcc7rYPePd1Gj5371aqDk7j8K5C` pending at capture time |
| Production HTTP smoke test | Not verified | No successful production endpoint evidence yet |
| Production secrets/configuration | Not verified | Secrets are intentionally not inspectable through repository tooling |
| Database backup/restore drill | Not verified | Requires real environment evidence |
| Disaster recovery drill | Not verified | Requires real environment evidence |
| External provider failure drill | Not verified | Requires live environment evidence |

## Known defects fixed during this pass

1. Supabase baseline migration referenced `tenants` and `profiles` before they existed through `DROP TRIGGER` statements. Those destructive pre-table references were removed.
2. The migration attempted to create application functions inside Supabase's protected `auth` schema. RLS helper functions now live in `public` and policies reference them explicitly.
3. JWT tenant/role helpers accept both the repository's camelCase claims and conventional snake_case claim names.

## Remaining blockers

### P0 — must close before Production-Verified

1. Obtain a green Supabase Preview migration run from the latest commit.
2. Obtain a green GitHub validation run with executable steps and passing typecheck/lint/test/build/integrity/preflight/capability/route gates.
3. Obtain a successful Vercel deployment for the same commit.
4. Run production HTTP smoke tests for liveness, readiness and Isabella inference.
5. Verify production environment variables and provider connectivity without exposing secrets.
6. Execute database backup/restore evidence.
7. Execute rollback evidence.

### P1 — required for mature production operation

1. Verify alerting and incident response ownership.
2. Verify rate-limit capacity and failure behavior under load.
3. Verify Gemini upstream timeout/cancellation behavior under sustained streaming.
4. Verify audit-chain integrity across restart/failover.
5. Verify tenant isolation with adversarial cross-tenant tests.
6. Verify multimodal input limits and abuse controls.
7. Verify billing/BookPI settlement against real provider usage.
8. Verify dependency vulnerability and license gates on the production lockfile.

## Scoring method

The percentage is a **gate-weighted engineering readiness score**, not a code-completion percentage. Runtime implementation receives less weight than reproducible production evidence.

At this baseline:

- Runtime implementation: **~90%**
- Security/governance controls: **~88%**
- Test/CI evidence: **~45%**
- Database production evidence: **~65%**
- Deployment evidence: **~55%**
- Operations/DR evidence: **~45%**

**Overall production readiness estimate: ~70%.**

**Overall deployment readiness estimate: ~60%.**

These values must not be promoted to 100% until all P0 evidence gates are green.

## Certification rule

`Production-Verified` requires:

`code implemented` + `tests green` + `build green` + `database green` + `deployment green` + `runtime smoke green` + `rollback evidence` + `secrets/config verified`.

Until then, the correct status is `Implemented/Tested` or `Partial`, never `Production-Verified`.
