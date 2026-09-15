# ISABELLA AI GENESIS

## Governed Cognitive Infrastructure

**Isabella AI Genesis** is a sovereign-oriented software platform for governed interaction with artificial intelligence. Its architecture brings identity, authorization, tenant isolation, security controls, native machine-learning primitives, memory, auditability, economic accounting, external providers and operational evidence into one governed execution path.

The project is developed from **Real del Monte, Hidalgo, México** and is published as inspectable software. The repository is the authoritative technical source for what Isabella actually implements. Marketing language, diagrams and conceptual documents do not override the behavior that can be verified in code.

> **No pedir que el mundo crea. Publicar para que el mundo pueda comprobar.**

---

## What Isabella is

Isabella is not presented here as artificial general intelligence, machine consciousness or an autonomous authority over people. It is a software system designed to make AI-enabled operations more explicit, governable and auditable.

The platform is built around a simple principle:

**The model proposes. Policy evaluates. The user authorizes. The system records evidence.**

This principle is implemented through a combination of request context, authentication, authorization, tenant policy, skills, native ML, persistence and audit pathways.

The project is intentionally provider-agnostic. External model and infrastructure providers may be used where they deliver specialized capabilities, while Isabella retains its own application-level identity, policy, security and orchestration layers.

---

## Why the architecture exists

AI applications become infrastructure as soon as they move beyond a single prompt-and-response interaction.

Once an AI system can remember information, operate on behalf of an identity, access organizational data, call tools, initiate economic operations or modify durable state, the important engineering question is no longer only whether the generated answer is useful. The system must also answer who acted, what was permitted, what policy was applied, which tenant was affected, what evidence exists, whether the action was reversible, and whether the same state can be reconstructed after a failure.

Isabella therefore treats governance as a runtime property rather than a page of terms and conditions.

---

## Architectural model

The intended execution chain is:

```text
Request
  ↓
Authentication
  ↓
Principal Context
  ↓
Tenant Resolution
  ↓
Policy Decision Point
  ├─ RBAC
  ├─ ABAC
  ├─ Credential Scopes
  ├─ Tenant Policy
  └─ Contextual Risk
  ↓
Policy Enforcement
  ↓
C.R.O.W.N. Governance
  ↓
Skill / Native ML / Tool
  ↓
Durable Repository
  ↓
Audit + Evidence + Telemetry
```

A security interceptor such as AEGIS is treated as a defense layer, not as an undocumented second authorization authority.

The objective is to prevent individual routes from becoming independent security universes.

---

## Native Machine Learning

The repository contains a native ML layer under `src/lib/native-ml/` together with the NCUA processing substrate.

The current native implementation includes deterministic and inspectable primitives for:

- binary logistic classification and prediction;
- provenance-aware model artifacts;
- input validation and bounded data structures;
- text risk classification;
- semantic representations derived from byte n-gram hashing;
- similarity and cosine operations;
- SimHash-compatible signatures;
- intent classification;
- knowledge convergence;
- teacher/model evidence structures;
- federated-update contracts;
- skill-domain classification and native skill fusion.

The native ML implementation is intentionally explicit about its limits. Deterministic local inference is not described as equivalent to a frontier foundation model. A native fallback is not described as AGI. Capability is not authority.

### NCUA substrate

`src/lib/ncua/` provides the continuous/byte-oriented representation layer used by several native capabilities. It includes UTF-8 byte processing, hashed dense embeddings, approximate similarity primitives, tensor-lite numerical operations, intent classification, a sovereign knowledge graph, privacy computations and a twelve-stage processing pipeline.

The embedding implementation is deterministic and uses byte n-gram hashing into a fixed-dimensional vector. This provides a local semantic substrate without requiring an external tokenizer.

### Native skill fusion

`src/lib/native-ml/skill-fusion.ts` provides the canonical fusion layer for skill families. External skill collections are treated as **capability specifications and source families**, not as executable code copied into Isabella.

The fusion layer provides:

1. domain classification;
2. deterministic semantic representation;
3. text risk scoring;
4. execution planning;
5. provenance hashing;
6. evidence envelopes;
7. explicit detection of tasks that require external side effects;
8. registry-compatible skill wrappers.

This architecture is deliberately conservative: an external effect such as deployment, payment, browsing, messaging or a connector operation is not simulated merely to report success. It requires an explicit, authorized adapter.

---

## Integrated capability families

The current native fusion catalog represents the capability families requested from the following public skill ecosystems:

- `anthropics/skills`
- `anthropics/knowledge-work-plugins`
- `anthropics/claude-code`
- `anthropics/claude-plugins-official`
- `anthropics/financial-services`
- `anthropics/claude-for-legal`
- `anthropics/defending-code-reference-harness`
- `anthropics/claude-plugins-community`
- `anthropics/healthcare`
- `anthropics/claude-cookbooks`
- `anthropics/claude-agent-sdk-demos`
- `anthropics/life-sciences`
- `anthropics/claude-tag-plugins`
- `anthropics/cwc-workshops`
- `anthropics/k12-teacher-skills`
- `anthropics/launch-your-agent`
- `anthropics/claude-quickstarts`
- `anthropics/commerce-agents`
- `anthropics/code-migration-kit-with-claude-code`
- `anthropics/claude-agent-sdk-python`

The integration is intentionally not a vendor-code dump. Isabella retains a native execution model and uses adapters only when an operation actually needs an external system.

---

## Skill execution contract

Every governed skill execution is expected to pass through the hardened skill runner in `src/lib/skills/run-skill.ts`.

The runner requires explicit identity context, validates input, evaluates authorization, resolves the registered skill, runs its contract, validates output and records the operation through the durable economic/audit path.

The implementation rejects anonymous execution for privileged skills. Missing actor, tenant, role or authentication state is not silently replaced by an administrative default.

This is a critical invariant: **a skill cannot become privileged merely because someone knows its identifier.**

---

## Governance: C.R.O.W.N.

C.R.O.W.N. — **Constitutional Runtime for Orchestration, Witnessing and Normative Governance** — is the project's deterministic governance layer.

Its contracts model:

- action kind;
- intent category;
- risk level;
- identity assessment;
- decision state;
- response mode;
- evidence requirements;
- memory scope;
- sensitivity level.

C.R.O.W.N. is not an autonomous sovereign authority. It exists to make runtime decisions explicit and reviewable.

---

## Security architecture

Security controls exist at several layers rather than in one function.

### Trusted proxy handling

The server recognizes explicit proxy modes and validates the resulting client IP as IPv4 or IPv6. Incoming forwarding headers are sanitized before routing so an arbitrary client cannot simply define its own forwarded address.

### Content Security Policy

The application uses explicit connection allowlists for external providers instead of a broad `connect-src https:` policy. This reduces the outbound browser surface and makes new destinations deliberate configuration changes.

### Sensitive endpoint protection

Stripe top-up intent creation is rate-limited using a distributed limiter keyed by tenant, user and resolved client address. Production/staging paths fail closed when the distributed limiter is unavailable.

### Development authentication

Development session recovery requires explicit development mode, runtime mode and an explicit enable flag. `NODE_ENV` by itself is not intended to grant privileged recovery behavior.

### Cryptography

The application includes AES-256-GCM, ChaCha20-Poly1305, PBKDF2-HMAC-SHA512 and HMAC-SHA256 based mechanisms. Production key management is expected to use a secret manager/KMS with rotation and controlled access.

Cryptography in the code is not presented as a guarantee of absolute security or as evidence of post-quantum production readiness.

---

## Identity, tenants and authorization

The system uses a principal context to carry the resolved identity through protected operations.

The target security model is:

```text
Credential
  → validated identity
  → principal context
  → tenant
  → policy decision
  → effective permissions
```

Effective permissions are intended to be constrained by the intersection of role permissions, credential scopes, tenant policy and contextual policy.

API credentials are not supposed to mint privileges that exceed the authority of their issuer.

Tenant isolation is reinforced at application level and intended to be reinforced at database level with PostgreSQL RLS.

---

## Persistence and memory

Production persistence is PostgreSQL-oriented. The system contains repositories for durable application data and a dedicated PostgreSQL memory implementation.

Memory is treated as governed durable state rather than as a browser cache. Production memory records should carry sufficient context for isolation, purpose, consent, provenance, retention and deletion policies.

The project has historically contained JSON stores and legacy persistence paths. These are considered migration/development concerns, not a second production authority. The long-term production invariant is a single canonical durable source of truth.

---

## Audit and evidence

An AI operation is valuable only when the system can explain what happened afterward.

Isabella therefore carries request, trace and decision identifiers through important flows and records evidence hashes and provenance metadata where applicable.

The evidence model distinguishes between:

- source data;
- model/artifact identity;
- policy decisions;
- execution results;
- provenance hashes;
- operational evidence.

A hash is evidence of integrity for the content it covers. It is not, by itself, evidence that the underlying claim is true.

---

## BookPI and economic operations

BookPI is the project's economic/ledger layer.

The production design treats the frontend as a presentation surface, never as the monetary authority.

The intended flow is:

```text
Client
  → Monetization API
  → Authorization
  → Payment provider
  → Signed webhook
  → Idempotent event
  → Canonical ledger
  → Projection / balance
  → Audit
```

Payment-intent creation is rate-limited and idempotency is part of the expected contract.

Refunds and reversals should be recorded as new financial events rather than silently rewriting the original transaction.

---

## External providers and adapters

Isabella can operate with external model, infrastructure and integration providers. Current repository contracts include integrations around providers such as Stripe, Supabase/Neon, Vercel Connect and external AI endpoints.

The architectural rule is simple:

**integration does not equal authority.**

A connector may execute an operation, but authorization remains local to Isabella and the operation must be attributable to an identity and tenant.

External side effects in the native skill layer are therefore blocked until a corresponding adapter is explicitly authorized.

---

## Vercel deployment model

The project is integrated with Vercel and currently uses Vite/TanStack Start rather than Next.js App Router.

The Vercel deployment contract is governed by the repository's CI and production scripts. The expected installation path is:

```bash
pnpm install --frozen-lockfile
```

The production validation sequence includes:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm security:scan
pnpm capabilities
pnpm audit:routes
pnpm db:verify
pnpm production:integrity
pnpm production:preflight -- --json
pnpm build
```

A deployment that fails before dependency installation is not a runtime failure: it is a supply-chain/build configuration failure and must be corrected at that layer.

---

## Vercel failure class currently observed

The most recent Vercel production failures were stopping at dependency installation with:

```text
ERR_PNPM_OUTDATED_LOCKFILE
Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/package.json
```

This means Vercel was not reaching the TypeScript compilation or application runtime. The correct fix is lockfile synchronization, not another application workaround.

The repository now includes an explicit lockfile synchronization workflow using the project's declared pnpm version. Once the synchronized lockfile is committed, Vercel can return to the actual build/test gates.

---

## Development

Requirements:

- Node.js 22 or newer;
- pnpm 10.15.x;
- PostgreSQL/Neon/Supabase when durable persistence is required;
- appropriate provider credentials only for features that actually need external services.

Install:

```bash
pnpm install --frozen-lockfile
```

Run locally:

```bash
pnpm dev
```

Validate:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Run the consolidated production gate:

```bash
pnpm production:gate
```

---

## Repository structure

The repository is organized around several major technical areas:

```text
src/
├── lib/
│   ├── native-ml/        Native ML, skill fusion and convergence
│   ├── ncua/             Byte/continuous cognitive substrate
│   ├── skills/           Governed skill registry and execution
│   ├── security/         Security controls and policy enforcement
│   ├── repositories/     Durable data access
│   ├── crypto/           Cryptographic primitives
│   ├── governance/       Governance and evidence
│   └── intelligence/     Provider abstraction / model access
├── routes/               HTTP routes
├── server-routes/        Canonical server handlers
└── components/           Product and interface layer

test/                     Unit, integration and security verification
scripts/                  Build, integrity, database and release gates
docs/                     Technical audit and architecture records
.github/workflows/        CI/CD and production verification
```

The exact source of truth remains the repository itself; this diagram is intentionally conceptual.

---

## Evidence discipline

Isabella follows a strict distinction between capability and proof.

**Implemented** means that the corresponding behavior exists in source code.

**Verified** means that the behavior has been exercised by a reproducible automated or operational test.

**Production-safe** means that the capability has survived deployment, configuration, failure-mode and operational checks in the intended environment.

The project does not use these terms interchangeably.

That distinction prevents a documented interface, a mock endpoint or an unexecuted branch from being presented as an operational production capability.

---

## What Isabella does not claim

The repository does not provide evidence to justify claims that Isabella is:

- AGI;
- conscious;
- infallible;
- absolutely secure;
- post-quantum secure in production;
- a military-certified system;
- a replacement for every frontier AI provider;
- a production deployment of hundreds of external APIs merely because contracts or catalog entries exist.

Those are not failures of communication. They are boundaries of technical evidence.

---

## Current engineering posture

The project is in an advanced hardening phase rather than a finished certification state.

The codebase already contains substantial implementation across governance, security, native ML, skill orchestration, persistence, audit and integration layers. The remaining gap to a fully certified global production posture is primarily operational: reproducible CI, canonical dependency state, live database verification, complete end-to-end isolation tests, durable memory, production payment/reconciliation testing, observability, backup/restore drills and deployment smoke/rollback evidence.

For that reason the project should be evaluated by passing gates and reproducible behavior, not by a marketing percentage alone.

A target of **90% general production readiness** is therefore treated as an engineering milestone: enough of the system must be operationally verified that remaining work is concentrated in the final production controls rather than in missing architecture.

---

## Responsible use

This software can be used to orchestrate AI-assisted analysis, engineering, documentation, research, business workflows and other governed tasks. High-impact domains such as healthcare, finance and legal work require additional domain-specific controls and qualified human oversight.

The system should not be treated as an autonomous decision maker where the consequences exceed the evidence available to it.

---

## License

The repository's licensing model is defined by its license files. Code, documentation and branding are not assumed to have identical terms. Always inspect the applicable license before redistributing a specific asset.

---

## Project identity

**ISABELLA AI GENESIS**  
Governed Cognitive Infrastructure  
Real del Monte, Hidalgo, México

**Repository:** https://github.com/OsoPanda1/isabella-ai-genesis

**Primary engineering principle:**

> Build what can be demonstrated. Measure what can be executed. Refuse to claim what cannot be proved.

---

## Final statement

The strategic value of Isabella is not that a repository can be made to sound revolutionary.

Its value is that a complex AI system can be designed so that identity, policy, memory, security, economic operations and evidence are treated as first-class runtime concerns.

That architecture can be criticized.

Its code can be inspected.

Its claims can be tested.

Its failures can be reproduced.

And its progress can be measured by the evidence it produces.

**Isabella AI Genesis is therefore not a promise that the future is finished. It is an engineering position: the future of governed AI can be designed, implemented and challenged from anywhere capable of producing verifiable software.**
