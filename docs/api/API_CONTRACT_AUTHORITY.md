# ISA-API Contract Authority

## Canonical source

`src/lib/api-contracts.ts` and the runtime Zod schemas used by routes are the canonical executable contract. OpenAPI documents, SDKs, examples, and route catalogs are generated or reviewed artifacts; they are not authorization sources.

## Request pipeline

Every request must cross: normalization → correlation → identity → tenant resolution → schema validation → CROWN/ARGUS policy decision → capability check → domain operation → output validation → audit.

A model/provider never grants authorization. Client-supplied tenant IDs, scopes, policy decisions, prices, balances, and risk scores are untrusted input.

## Stable response metadata

Responses should expose non-sensitive `request_id`, `trace_id`, `decision_id` and API version. Never expose tokens, stack traces, internal prompts, SQL, private policy material, or provider credentials.

## Error vocabulary

Use stable prefixes: `ISB_AUTH_*`, `ISB_TENANT_*`, `CROWN_*`, `MEMORY_*`, `TOOL_*`, `ECONOMY_*`, `AUDIT_*`, `SYSTEM_*`. Errors must include a correlation identifier, retryability, and a safe public message.

## Versioning and compatibility

- Additive fields are backward compatible.
- Removing or changing meaning requires a new API version and migration note.
- Deprecated fields remain accepted only for a documented sunset period.
- Contract tests must cover request validation, response shape, authorization, tenant isolation, and idempotency.

## Production status vocabulary

`implemented` means code exists; `verified` means automated evidence exists; `experimental` means behavior is bounded but not production-approved; `planned` means documentation only. Documentation must never elevate a capability's status.

## Review gate

A release is blocked when executable schemas, authorization scopes, OpenAPI artifacts, or documentation disagree. A release is also blocked when a production path depends on JSON/SQLite state, mock data, client authority, or an unverified external connector.
