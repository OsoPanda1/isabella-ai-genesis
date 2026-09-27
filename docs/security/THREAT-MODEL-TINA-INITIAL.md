# Threat model — Isabella AI Genesis / TINA

**Status:** initial repository-level threat model; not a substitute for a deployment-specific assessment.  
**Version:** 1.0-draft  
**Scope:** web/API runtime, governed intelligence routing, retrieval and memory, tools, tenant boundaries, economic operations, audit/decision ledger, CI/CD and deployment.

## Security objectives

1. Enforce the invariant **CAPABILITY ≠ AUTHORITY ≠ EXECUTION ≠ EVIDENCE ≠ LEARNING ≠ PRODUCTION**.
2. Prevent cross-tenant access, unauthorized side effects, secret/PII disclosure, and unreviewed policy/model promotion.
3. Fail closed when a required authorization, durable ledger, policy, or security dependency is unavailable.
4. Make security-relevant decisions attributable, tamper-evident, and reproducible against a specific commit and policy version.
5. Preserve user/territorial control over retention, processing region, and permitted actions.

## Assets and trust boundaries

| Asset | Boundary / trust assumption |
|---|---|
| Identity, sessions, API keys, JWT/OIDC claims | External identity provider → server authentication layer |
| Tenant, owner, role, ABAC attributes | Untrusted request → server-derived authorization context |
| Prompts, retrieved documents, uploaded files | User/provider/corpus content is untrusted data, never policy |
| Model output and tool arguments | Model/provider → output inspection → authorization → executor |
| Memory, embeddings, learning datasets | Tenant-scoped storage; provenance and consent required |
| BookPI, billing, run capabilities | Client request → durable transactional repositories |
| Policy and decision ledger | Reviewed policy source → durable persistence → runtime enforcement |
| Secrets, provider credentials, signing keys | Deployment secret manager → server-only processes |
| CI artifacts and deployments | Source commit → checks/SBOM → protected deployment environment |

## Threat scenarios and required controls

### T1 — Prompt injection / retrieval poisoning
**Threat:** malicious user content or retrieved text attempts to override system policy, exfiltrate data, or trigger tools.  
**Controls:** treat retrieved text as evidence only; preserve provenance; isolate instructions from data; scan input and retrieved chunks; apply output/tool policy after generation; adversarial tests for direct, indirect, multilingual, and encoded injection.  
**Release evidence:** tests demonstrate deny/contain behavior for each supported execution path, including streaming.

### T2 — Unsafe model output and streaming bypass
**Threat:** uninspected output, partial SSE chunks, tool calls, or error paths disclose PII/secrets or harmful instructions.  
**Controls:** one mandatory output gate for buffered and streaming responses; inspect complete semantic units before release; redact or terminate on violation; do not allow alternate paths to write directly to the response; audit decisions without logging sensitive payloads.  
**Release evidence:** route-level tests cover normal, streaming, tool, exception, cancellation, and partial-chunk paths.

### T3 — Authorization confused deputy / dead governance path
**Threat:** a gateway invokes a model/tool without traversing the canonical CROWN/TINA decision path, or treats capability as permission.  
**Controls:** single authoritative orchestration seam; server-derived tenant/owner context; explicit action, resource, risk, and scope checks; human approval for configured high-impact actions; deny on policy/ledger unavailability.  
**Release evidence:** call-graph tests prove every executable path reaches the authority gate and denied decisions cannot reach providers or tools.

### T4 — Cross-tenant access and data lifecycle failure
**Threat:** IDOR, weak tenant binding, incomplete deletion, orphaned embeddings, logs, backups, or economic records.  
**Controls:** tenant/owner predicates at repository boundaries; RLS plus application checks; deletion workflow with dependency inventory, tombstone/job state, retries, and completion evidence; legal/audit retention separated from user content and documented.  
**Release evidence:** adversarial tenant-isolation tests and deletion tests verify all stores, derived data, and retry behavior.

### T5 — Economic abuse / replay / race
**Threat:** capability replay, altered amount/skill/tenant, duplicate webhook, concurrent spending, refund abuse, or inconsistent ledger state.  
**Controls:** one-time durable capability bound to user, tenant, action, amount, expiry and idempotency key; transactional balance/ledger update; verified provider signatures; reconciliation and anomaly alerts; no in-memory production fallback.  
**Release evidence:** concurrency, replay, provider-failure, duplicate-event, and reconciliation tests against a real test database/provider sandbox.

### T6 — Secret or personal-data egress
**Threat:** provider calls, logs, telemetry, error messages, or client bundles expose secrets or personal data.  
**Controls:** server-only secret boundary; explicit provider allowlist and data minimization; redaction before logs/telemetry; egress policy by data class/region; safe errors; secret scanning and bundle inspection.  
**Release evidence:** tests inspect logs, errors, outbound payloads, and built client artifacts with seeded canary secrets/PII.

### T7 — Supply-chain / CI / deployment bypass
**Threat:** vulnerable dependency, mutable image, compromised action, missing required check, or direct deployment bypass.  
**Controls:** frozen lockfile, pinned actions/images, SBOM and vulnerability policy, secret/SAST gates, least-privilege workflow permissions, protected branch and required checks, signed/provenanced artifacts, environment approval and rollback.  
**Release evidence:** repository settings export/screenshots or API evidence confirms required checks; CI runs on the exact commit; deployment artifact digest matches tested artifact.

### T8 — Policy/model/learning drift
**Threat:** unreviewed model, prompt, skill, or learning update gains authority or changes behavior without evaluation.  
**Controls:** capability does not imply authority; immutable versioned policy; evaluation/shadow/canary stages; human approval; rollback; dataset license/consent/provenance; drift monitoring.  
**Release evidence:** promotion is blocked without passing evaluation and approval records; rollback is exercised.

### T9 — Audit evidence forgery or incompleteness
**Threat:** a descriptive path, seeded metric, stale report, or mismatched commit is presented as proof.  
**Controls:** evidence generated by trusted runners; bind commit, workflow run, artifact digest, test identity and timestamp; distinguish PASS/FAIL/BLOCKED/EVIDENCE_GATED; never convert missing evidence into PASS.  
**Release evidence:** same-commit verification and negative tests for missing, stale, malformed, or mismatched evidence.

## Severity and release policy

- **P0 / release blocker:** any path bypassing authorization/output inspection; cross-tenant exposure; secret/PII exfiltration; unbounded or replayable economic side effect; fail-open behavior at a required trust boundary.
- **P1 / release blocker for affected capability:** missing auditability, recovery, deletion proof, provider-region controls, or required operational alerts.
- **P2:** hardening and usability issues that do not weaken a trust boundary; must have an owner and target release.

A finding is **not closed** by adding a comment, listing a file path, or creating a test that does not exercise the real boundary. Closure requires implementation, regression test, fresh execution evidence, and review of the integrated diff.

## Explicit non-claims

This document does not certify the current repository or deployment as secure. It does not establish that every route is protected, that deletion is complete, that providers meet a particular jurisdictional requirement, or that branch protections and production secrets are configured. Those require runtime and environment evidence.

## Immediate verification backlog

- [ ] Wire the canonical intelligence governance decision into every gateway path.
- [ ] Add mandatory output inspection for buffered, SSE, tool, and error paths.
- [ ] Generate a route inventory that checks auth, rate limiting, and schema validation per handler; manually review ambiguous cases.
- [ ] Implement and test user/tenant deletion across primary, derived, audit, and economic stores.
- [ ] Add TINA runtime, output injection, PII egress, and economic-isolation adversarial suites.
- [ ] Verify branch protection, required checks, deployment environment approvals, and artifact provenance.
- [ ] Re-run the ISA-500 checklist against the exact release commit; preserve BLOCKED_ENVIRONMENT and EVIDENCE_GATED states.
