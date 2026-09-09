# P0 Implementation Status — 2026-09-09

## Current commit

`82a7f6731a8486a28ba69152b37224c54c78fe5a`

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
- Tenant learning state is now persisted as a versioned, SHA3-512 integrity-checked PostgreSQL snapshot when `DATABASE_URL` is configured.
- Learning snapshots are canonicalized before hashing so PostgreSQL JSONB key ordering cannot invalidate integrity verification.
- The learning migration is part of the repository's ordered SQL migration set and is applied by the existing PostgreSQL migration path.
- The API catalog now points to executable routes instead of documentation-only `/v1/...` paths.

### Isabella governed skill execution

- Native `/api/isabella-skills` endpoint exposes the registered skill catalog.
- Skill execution is routed through `runIsabellaSkill`, including identity validation, CROWN/ARGUS authorization, input/output validation and BookPI audit settlement.
- Unknown skills remain deny-by-default.

### Isabella inference

- Primary Gemini model remains `gemini-3.8-flash`, currently a generally available production model according to Google's Gemini API documentation. The gateway also supports Groq and xAI fallback providers when configured.
- The inference gateway preserves tenant authentication, policy checks, kill-switch checks, provider failover, SSE streaming and trace metadata.

## CI evidence status

The latest FGAIS runs still terminate with `failure` while GitHub exposes `steps: null` and no logs. This cannot be attributed to a source-level test/build failure and is not evidence of a green gate.

## Remaining P0 blockers

1. **Executable CI evidence:** GitHub Actions must expose real job steps/logs and complete the FGAIS gate successfully for the exact candidate commit.
2. **Production deployment evidence:** Vercel/Nitro deployment must complete successfully from the same candidate commit.
3. **Database evidence:** Migration replay/verification, backup and restore must execute against the real authoritative production database.
4. **Runtime smoke evidence:** Production HTTP liveness/readiness/inference, skill execution and learning endpoints must be exercised successfully.
5. **Provider/secrets evidence:** Gemini (and at least one fallback provider where intended), BookPI signing key, authentication secrets, database and Stripe configuration must be verified in the actual deployment environment without exposing secrets.
6. **Rollback evidence:** A real rollback must be executed and verified against the deployment target.
7. **Remaining production-path simulation:** Any simulation that can reach an authoritative production path must be replaced by a real provider or kept strictly outside production authority.

## Certification rule

The repository is **functionally implemented in code but NOT Production-Verified** until code, tests, build, database, deployment, runtime smoke, secrets/configuration and rollback evidence are all reproducibly green.
