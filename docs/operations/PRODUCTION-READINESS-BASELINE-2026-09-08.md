# Production Readiness Baseline — 2026-09-08

## Status

**Current classification: NOT Production-Verified.**

This document is an evidence ledger, not a declaration of readiness. A capability is only considered production-verified after a reproducible green gate and runtime evidence exist.

## Current commit

`9c3ffffc036b9fcae22e2554911fe97361b09020`

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
| CI production gate | Configured | `.github/workflows/fgais-gate.yml` plus canonical `ci.yml` |
| Supabase baseline migration | Corrected | Canonical `audit_events` table is now used by immutability controls |
| Supabase corrective migration | Implemented | `supabase/migrations/20260908180000_audit_immutability_correction.sql` |
| Supabase preview after corrective migration | Pending | Latest check was still `in_progress` at capture time |
| GitHub validation workflows | **Failing / unresolved** | Latest jobs terminate before executable steps; this is currently an external CI execution blocker, not a reported code-step failure |
| Vercel deployment | Pending | Latest commit status remained pending at capture time |
| Production HTTP smoke test | Not verified | No successful production endpoint evidence yet |
| Production secrets/configuration | Not verified | Secrets are intentionally not inspectable through repository tooling |
| Database backup/restore drill | Not verified | Requires real environment evidence |
| Disaster recovery drill | Not verified | Requires real environment evidence |
| External provider failure drill | Not verified | Requires live environment evidence |

## Defects corrected during this pass

1. Supabase baseline migration had pre-table destructive trigger references; those were removed from the initial schema.
2. Application RLS helper functions were moved out of Supabase's protected `auth` schema into `public`, with explicit policy references.
3. JWT tenant/role helpers accept both repository camelCase claims and conventional snake_case claim names.
4. The BookPI immutability migration referenced a non-existent `audit_logs` table while the canonical schema defines `audit_events`. The migration now targets `audit_events`.
5. An additive corrective migration was added so already-migrated databases receive the canonical audit immutability triggers without rewriting migration history.
6. Production package/lockfile alignment was previously corrected for the Radix dependencies and missing `@radix-ui/react-popover` entry.
7. The production gate includes the real Vite build and artifact validation rather than treating typecheck/lint alone as deploy evidence.

## Remaining blockers

### P0 — must close before Production-Verified

1. Obtain a green Supabase Preview migration run from the latest commit.
2. Obtain a green GitHub validation run with executable steps and passing typecheck/lint/test/build/integrity/preflight/capability/route gates. Current Actions runs fail before steps execute, so repository code cannot resolve that runner-level failure directly.
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
9. Remove or explicitly classify remaining non-authoritative UI/demo randomness; it must never feed production authority, security, billing or evidence paths.
10. Reconcile documentation references that still use legacy `server-routes` paths where the canonical runtime has moved to `src/routes`/`src/lib`.

## Scoring method

The percentage is a **gate-weighted engineering readiness score**, not a code-completion percentage. Runtime implementation receives less weight than reproducible production evidence.

Current evidence supports the following conservative estimate:

- Runtime implementation: **~92%**
- Security/governance controls: **~89%**
- Test/CI evidence: **~45%**
- Database production evidence: **~68%**
- Deployment evidence: **~55%**
- Operations/DR evidence: **~45%**

**Overall production readiness estimate: ~71%.**

**Overall deployment readiness estimate: ~61%.**

These values must not be promoted to 100% until all P0 evidence gates are green. The increase from the prior baseline reflects corrected database authority and migration coverage; it is not a claim of live production verification.

## Certification rule

`Production-Verified` requires:

`code implemented` + `tests green` + `build green` + `database green` + `deployment green` + `runtime smoke green` + `rollback evidence` + `secrets/config verified`.

Until then, the correct status is `Implemented/Tested` or `Partial`, never `Production-Verified`.
