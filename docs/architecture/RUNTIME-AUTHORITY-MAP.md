# Runtime Authority Map

## Canonical runtime

- **Application runtime:** TanStack Start + Nitro on Vercel.
- **Identity authority:** Supabase Auth / verified Isabella principal.
- **Authorization:** `PrincipalContext` → CROWN/ARGUS PDP → tenant-scoped repositories.
- **Storage authority:** the configured production repository adapter; JSON and in-memory stores are development/test only.
- **Audit authority:** BookPI/audit repository with correlation and trace identifiers.
- **AI entry point:** `src/lib/isabella-chat-gateway.ts`.
- **Video Engine X:** protected capability route; every mutation requires `isabella:tools` and server-side authorization.

## Request flow

`request → rate limit → identity → tenant → required scope → PDP → handler → audit`

No client-provided tenant, role, scope, or approval is trusted as an authority. Runtime claims are accepted only after server-side verification. The development fallback is permitted only under the explicit development configuration contract.

## Production caveats

The local cryptographic manager is not an HSM. It is a KMS/HSM integration boundary until an external key custody provider is configured and verified. Static preflight proves repository contracts only; it does not certify external services, latency, durability, or production deployment readiness.
