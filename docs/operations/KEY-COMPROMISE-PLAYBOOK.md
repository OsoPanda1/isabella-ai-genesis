# Secret Compromise / Emergency Rotation Playbook

## Trigger

Use this playbook when a credential, signing key, API key, JWT secret, database credential or CI token may have been exposed.

## Immediate containment

1. Disable/revoke the exposed credential at its provider.
2. Block affected API scopes or tenant access where applicable.
3. Put financial and privileged mutation paths into fail-closed mode if integrity is uncertain.
4. Preserve the incident identifier and timestamps without storing the secret value.

## Rotation order

1. CI/GitHub credentials.
2. Vercel deployment and environment credentials.
3. Database credentials.
4. AI provider keys.
5. JWT/session signing material.
6. CROWN/BookPI signing material.
7. KMS/HSM keys according to provider recovery procedure.

## Verification

- Run secret scan against the complete repository history.
- Run `pnpm security:scan`.
- Run `pnpm production:preflight -- --json`.
- Verify revoked credentials fail authentication.
- Verify newly issued credentials work only within their declared scope.
- Record rotation timestamp and evidence identifier.

## Recovery rule

Never paste secret values into issues, logs, commits, chat transcripts or test fixtures. A historical exposure is treated as compromised even after the value has been rotated.
