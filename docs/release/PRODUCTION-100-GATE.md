# Production 100% closure plan

## Definition of 100%

The project can report 100% production/release readiness only when every gate below has real evidence on the same release commit:

1. package.json and pnpm-lock.yaml are synchronized.
2. pnpm 10.15.4 and Node 24.11.0 are deterministic.
3. typecheck passes.
4. lint passes.
5. full test suite passes.
6. security scan, dependency audit, TruffleHog and Trivy/CodeQL pass.
7. capability and route contracts pass.
8. database migrations and post-migration invariants pass against the target database.
9. production integrity gate passes.
10. production preflight passes.
11. production build passes.
12. staging NCUA live load passes at 50/100/250/500 concurrency.
13. Vercel prebuilt deployment reports a deployment URL.
14. production root and /api/health/ready return 2xx.
15. rollback procedure is documented and periodically drilled.
16. release evidence is bound to the exact Git SHA.

## Required external configuration

The repository cannot fabricate these values:

- GitHub Actions secrets: DATABASE_URL, ISABELLA_STORAGE_PROVIDER, AUTH_JWT_SECRET, BOOKPI_SIGNING_KEY, AEGIS_AUDIT_SECRET.
- Staging secrets: NCUA_LIVE_BASE_URL, NCUA_AUTHORIZATION.
- Vercel secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID.
- Production provider keys: at least one authorized inference provider.
- Production observability endpoint: OTEL_EXPORTER_OTLP_ENDPOINT.
- Payment secrets when billing is enabled: STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET.

A missing external secret is a configuration gap, not a code feature to simulate.

## Release sequence

quality -> database migration -> staging load -> Vercel prebuilt deploy -> production smoke -> evidence.

The repository deliberately fails closed instead of reporting a synthetic 100%.
<!-- lockfile regeneration bootstrap trigger -->
