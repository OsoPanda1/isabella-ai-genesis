# HSM/KMS — P1

**Estado:** `hsm_signature_chain + pg_advisory_xact_lock` durable en `src/lib/authorization.ts:60` — `memory+KMS` simulado, no custodia hardware.

**Falta para 100%:** `key custody` fuera del proceso + `rotación` + `revocación` + `audit` en `HSM` real (YubiHSM/AWS KMS).

**Plan:** `k8s/authz-runtime` sidecar + `KMS` con `envelope` + `LITLE` attestation.
