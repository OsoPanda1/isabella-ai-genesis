# Isabella AI Tina — Mass Hardening Register (112 open issues)

**Scope:** all 112 currently open repository issues as observed from GitHub on 2026-09-29.

This register deliberately separates **code-remediable controls** from controls that require a GitHub, Vercel, Neon, cloud, legal, or organizational configuration change. An issue is not considered closed merely because documentation exists.

## Evidence contract

Every remediation must produce one or more of:

- source commit SHA;
- automated test result;
- GitHub Actions run and artifact;
- migration verification result;
- deployment/runtime evidence;
- external control evidence when the repository cannot enforce the control itself.

## Parallel remediation streams

| Stream | Issue families | Repository action |
|---|---|---|
| Supply chain | CVEs, lockfile, SBOM, provenance, signed releases, Docker | CI gates, pinned actions, SBOM verification, image hardening |
| Identity | RBAC, JWT, refresh/revocation, cookies, MFA/SSO | fail-closed auth contracts + external identity controls |
| Application security | CSRF, CSP, sanitization, payload/upload limits | centralized request limits, security headers, route validation |
| Data | classification, DLP, retention, encryption | schemas, redaction, policy and provider controls |
| Persistence | migration integrity, rollback, backups, failover | deterministic DB gates and recovery tests |
| Observability | SLO/SLI, alerts, immutable/tamper-evident audit | telemetry, integrity chain and operational runbooks |
| AI/ML | model stress, prompt safety, training consent | model gates, load tests, provenance and consent controls |
| CI/CD governance | forks, reviewers, CODEOWNERS, branch protection | repository policy + CODEOWNERS + workflow isolation |
| Secrets | rotation, least privilege, recovery, compromise detection | secret catalog, redaction, rotation playbooks, external KMS controls |
| Infrastructure | network segmentation, DNS failover, runtime policy | deployment manifests and provider-side controls |

## Implemented in this remediation branch

- Vercel CSP and browser isolation headers hardened.
- Security workflow now performs dependency review on pull requests.
- Security workflow now produces and verifies SBOM evidence.
- Security scans and CodeQL have bounded execution time.
- Conditional staging DAST workflow added using a verified ZAP action commit.
- CODEOWNERS expanded to identity, persistence, migrations, financial state, CI/CD and deployment surfaces.
- Existing request-size infrastructure remains the canonical transport control; no duplicate input-limit implementation is introduced.

## Controls that cannot honestly be closed by source changes alone

The following require external evidence: GitHub Actions billing/runner availability, organization MFA/SSO, branch protection and required reviewers, Vercel log visibility and environment configuration, Neon/provider encryption and backup restoration, KMS/HSM key rotation, network segmentation, DNS failover, legal contracts and data-processing agreements.

These remain **evidence-required**, not falsely marked complete.
