# Threat Model — Isabella AI / TINA Runtime

Version: 1.0.0 — 2026-09-27

## Scope
HTTP → identity → tenant context → validation → AEGIS → CROWN/policy → memory/RAG → model/expert execution → output gate → tools → audit/BookPI → persistence → CI/CD.

## Assets
- tenant/user identity and private memory;
- credentials, API keys and payment data;
- model/provider authority;
- tool execution capability;
- policy/approval state;
- BookPI/audit/decision integrity;
- generated output delivered to users or downstream systems.

## Trust boundaries
1. Client → API.
2. API → identity/tenant context.
3. User/RAG content → AEGIS.
4. Retrieval → model context.
5. Policy/CROWN → execution authority.
6. Model/provider → output gate.
7. Runtime → tools/external network.
8. Runtime → PostgreSQL/BookPI/audit.
9. CI/CD → artifact/deployment.

## Threat register

| ID | Threat | Required control | Evidence |
|---|---|---|---|
| TINA-01 | Prompt injection | AEGIS input scan; untrusted content cannot become authority | AEGIS adversarial tests |
| TINA-02 | RAG poisoning | provenance + corpus/retrieval scanning | rag-poisoning.test.ts |
| TINA-03 | Output injection | mandatory scanOutput before client/tool delivery | output-gate tests |
| TINA-04 | PII/secret egress | high/critical exfiltration findings block | output-gate tests |
| TINA-05 | Tool poisoning | AEGIS tool scan + CROWN permission gate | AEGIS/tool tests |
| TINA-06 | Cross-tenant cache | tenant-bound cache key + RLS | tenant-cache.test.ts |
| TINA-07 | Unauthorized execution | policy + approval before dispatch | runtime-chain tests |
| TINA-08 | Provider bypass | model registry + production approval | intelligence router |
| TINA-09 | Evidence tampering | append-only hash chains + decision ledger | BookPI/audit tests |
| TINA-10 | Financial replay | idempotency + atomic economic events | monetization tests |
| TINA-11 | Supply-chain compromise | lock/SAST/secret/SBOM/release gates | CI workflows |
| TINA-12 | Deployment bypass | required branch checks + evidence gate | repository settings + CI |

## Abuse cases
- Retrieved content claims to be a new system policy.
- A model emits instructions to exfiltrate credentials.
- A tool description claims to bypass CROWN.
- Tenant A attempts to read tenant B memory/cache.
- The same financial operation is replayed with one idempotency key.
- A privileged action reaches execution without durable decision evidence.

## Invariants
- CAPABILITY ≠ AUTHORITY ≠ EXECUTION ≠ EVIDENCE ≠ LEARNING ≠ PRODUCTION.
- No critical side effect without explicit authorization.
- No production model without approval.
- No retrieved content becomes policy.
- No model output bypasses the output gate.
- No cross-tenant data access.
- No deployment is certified from an unverified tree.

## Residual risk
Live DB/RLS, branch protection, deployment, provider availability and infrastructure compromise require environment evidence and are not claimed as verified by source code alone.
