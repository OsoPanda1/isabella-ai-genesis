# Third-Party Dependency Risk Register

| Dependency class | Example | Primary risk | Repository control |
|---|---|---|---|
| LLM provider | Google Gemini | provider outage, prompt/data exposure | gateway, timeout, policy gate, secret redaction |
| Payments | Stripe | fraudulent event injection, duplicate billing | signature verification, durable event claim, idempotency |
| Database | Neon/PostgreSQL / Supabase | persistence outage, tenant isolation | durable repositories, RLS, migrations, health checks |
| Cache/rate limit | Redis / Upstash | quota bypass or outage | distributed limiter, production fail-closed |
| Deployment | Vercel | runtime/configuration drift | frozen lockfile, production preflight, health probes |
| Source control/CI | GitHub Actions | supply-chain compromise | pinned actions, read-only PR permissions, security gates |
| Container registry | GHCR | image tampering | keyless signing, SBOM, vulnerability scan |
| Connectors | GitHub / Slack / Linear | spoofed events | HMAC verification and durable event claims |

Review this register whenever a new production dependency, provider, or connector is introduced.
