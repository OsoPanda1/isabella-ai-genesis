# ADR-001: Centralized Authorization Plane Integration

## Context

Prior to this architectural change, authorization checks (RBAC, ABAC, and tenant boundaries) were executed independently across various API route handlers. This decentralization increased the risk of access bypass, role-privilege escalation, and tenant leakages.

## Decision

We establish a centralized **Authorization Plane** that merges Tenant Isolation, standard Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC), and Credential Scopes validation into a single, cohesive decision pipeline. Every incoming authenticated request must pass through this single plane before invoking any functional handler.

## Consequences

- **Security Hardening**: Authorization decisions are unified and verifiable in one central logic point (`src/lib/authorization.ts`).
- **Performance**: Minimizes database round-trips by resolving tenant and principal boundaries simultaneously.
- **Auditing**: Emits unified audit logs directly connected to the cryptographic Ledger (BookPI).
