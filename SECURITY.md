# Security Policy — Isabella AI Genesis

## Responsible disclosure
Do not publish an undisclosed vulnerability in a public issue.

Use GitHub Security Advisories for private reporting:
https://github.com/OsoPanda1/isabella-ai-tina/security/advisories/new

Include the affected component, reproducible steps, impact, and proposed mitigation when available. Never include live credentials, tokens, private keys, personal data, or production secrets in the report.

## Secret compromise
A credential exposed in source control, logs, CI output, or an external integration is treated as compromised. Revoke or rotate it immediately, invalidate dependent sessions where applicable, and review relevant audit events.

## Security controls
- Dependency audit and dependency review
- Secret scanning and CodeQL
- Trivy filesystem/container scanning
- SBOM generation and verification
- Signed release/image artifacts
- Production preflight and integrity gates
- Authentication, authorization, tenant isolation and rate/quota controls
- Webhook signature verification and durable event claims

## Fix lifecycle
1. Reproduce and classify the issue.
2. Contain affected functionality when necessary.
3. Implement and test the remediation.
4. Verify the fix with the relevant gate.
5. Rotate credentials if exposure occurred.
6. Publish remediation details when disclosure is appropriate.

Security status is not certified merely by this document; production claims require executable evidence from the target environment.