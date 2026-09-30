# Isabella Data Classification

| Class | Examples | Default handling |
|---|---|---|
| Public | published documentation, public metadata | normal storage; integrity required |
| Internal | operational metrics, non-public configuration metadata | authenticated access; redact logs |
| Confidential | conversations, tenant data, internal prompts, audit metadata | tenant isolation, encryption at rest/provider control, least privilege |
| Restricted | credentials, JWT secrets, signing keys, payment secrets, recovery material | secret manager/KMS/HSM only; never application logs or repository |

## Retention

- Security/audit records: retain according to incident and compliance requirements; apply immutable/tamper-evident storage where available.
- User conversations: retain only for the configured product purpose and user-authorized period.
- Temporary uploads: expire and delete after their operational purpose.
- Secrets: never persist in ordinary database tables.

## Training-data rule

User content must not be treated as training data merely because it is stored. A training pipeline requires an explicit purpose, documented provenance, consent/legal basis where applicable, retention policy and opt-out/deletion path.
