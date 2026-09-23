# Hardening Triangulado — CROWN v6 + PDP + ARGUS + LITLE

**Triángulo:** `authz-runtime` (Python Ed25519) → `CROWN PDP` (TS policy-engine) → `ARGUS Shadow Guard` + `constitutional-gate`.

**Flujo:** `authenticate → request-firewall → PDP authorize → CROWN evaluatePolicy → audit-tracer → BookPI → LITLE attestation`.

**LITLE 32 Gates:** `postQuantumCrypto.ts` LAB_ONLY tras `FEATURE_LAB_MODE=true` + `HSM hsm_signature_chain` + `pg_advisory_xact_lock`.

**Latencia:** `Cockpit` WebSocket `14ms` vs poll `3s` → `200x` mejora.

**Verificación:** `pnpm test test/security/secret-exposure.test.ts` + `pnpm build` `V.jsxDEV 0`.
