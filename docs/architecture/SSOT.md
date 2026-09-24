# Isabella SSOT

This document identifies the canonical implementation paths. Historical and archived documents are informative only and cannot certify runtime behavior.

| Concern | Source of truth |
| --- | --- |
| Conversational execution | `src/lib/isabella-chat-gateway.ts` |
| Identity and request authorization | `src/lib/principal-context.ts` |
| PDP and authorization contracts | `src/lib/authorization.ts`, `src/lib/permission-matrix.ts` |
| Governance and kill switches | `src/lib/crown.ts`, `src/lib/governance/` |
| Persistence selection | `src/lib/persistence/repository-factory.ts` |
| Video capability | `src/lib/video-x/engine.ts`, `src/server-routes/api/video-engine-x.ts` |
| Production preflight | `scripts/production-preflight.mjs` |
| Database migrations | `supabase/migrations/` and the configured migration runner |

## Evidence rule

A capability is considered implemented only when its code path, tests, runtime configuration, and same-commit evidence agree. Documentation, generated matrices, names, and placeholder adapters are not execution evidence. Claims of HSM, durable distributed state, or production certification require an external verification record and must not be inferred from local abstractions.
