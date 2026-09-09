# P0 Implementation Status — 2026-09-09

## Current commit

`3412012e960295d463bdbdc94ccf5709800171ff`

## Completed in this pass

### Genesis evidence integrity

- `ClaimEngine` derives `dependencyLockHash` from the actual `pnpm-lock.yaml` using SHA3-512.
- The previous all-zero placeholder producer has been removed.
- The production integrity gate continues to reject placeholder lock hashes and malformed committed Genesis manifests.

### Isabella learning and cognitive runtime

- Provider-neutral learning core is implemented beyond token accumulation.
- Eight cognitive training strategies are implemented: semantic, procedural, contrastive, counterfactual, retrieval, reflection, preference and multimodal.
- Native executable learning API is exposed at `/api/isabella-learning`.
- Native executable cognitive-training API is exposed at `/api/isabella-cognitive-training`.
- Learning and cognitive-training runtime state is isolated by tenant within the process; no tenant shares another tenant's in-memory learning state.
- The API catalog now points to the executable routes instead of documentation-only `/v1/...` paths.
- Durable cross-process learning persistence remains a separate implementation target; the current process-scoped state is not represented as production-durable authority.

### Isabella inference

- Primary Gemini model remains `gemini-3.8-flash`, currently a generally available production model according to Google's Gemini API documentation. The gateway also supports Groq and xAI fallback providers when configured.
- The inference gateway preserves tenant authentication, policy checks, kill-switch checks, provider failover, SSE streaming and trace metadata.

## CI evidence status

The latest FGAIS run still terminates with `failure` while GitHub exposes `steps: null` and no logs. This cannot be attributed to a source-level test/build failure and is not evidence of a green gate.

## Remaining P0 blockers

1. **Executable CI evidence:** GitHub Actions must expose real job steps/logs and complete the FGAIS gate successfully for the exact candidate commit.
2. **Durable learning persistence:** Move the tenant-scoped learning store behind the authoritative PostgreSQL/Neon persistence layer so learning survives process restarts and serverless instance rotation.
3. **Production deployment evidence:** Vercel/Nitro deployment must complete successfully from the same candidate commit.
4. **Database evidence:** Migration replay/verification, backup and restore must execute against the real authoritative production database.
5. **Runtime smoke evidence:** Production HTTP liveness/readiness/inference and learning endpoints must be exercised successfully.
6. **Provider/secrets evidence:** Gemini (and at least one fallback provider where intended), BookPI signing key, authentication secrets, database and Stripe configuration must be verified in the actual deployment environment without exposing secrets.
7. **Rollback evidence:** A real rollback must be executed and verified against the deployment target.
8. **Remaining production-path simulation:** Any simulation that can reach an authoritative production path must be replaced by a real provider or kept strictly outside production authority.

## Certification rule

The repository is **functionally implemented in code but NOT Production-Verified** until code, tests, build, database, deployment, runtime smoke, secrets/configuration and rollback evidence are all reproducibly green.
