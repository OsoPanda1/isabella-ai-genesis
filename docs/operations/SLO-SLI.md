# Isabella Production SLI/SLO

## Service objectives

| SLI | Target | Alert threshold |
|---|---:|---:|
| HTTP availability for health/read APIs | >= 99.9% monthly | < 99.5% over 15 min |
| Successful authenticated API requests | >= 99.5% | < 99% over 10 min |
| P95 API latency | <= 1.5 s | > 2.5 s for 10 min |
| P95 model first-token latency | <= 4 s | > 8 s for 10 min |
| Database availability | >= 99.95% | any sustained failure > 2 min |
| Queue/event processing success | >= 99.9% | retry/error ratio > 1% |
| Security gate success | 100% for release candidates | any critical/high finding |

## Error budget

For a 30-day period, a 99.9% availability SLO permits approximately 43m 12s of unavailability. Security-critical releases do not consume this budget to justify bypassing a security gate.

## Required telemetry

- request count, status and latency;
- tenant-scoped rate-limit decisions;
- model/provider latency and error class;
- DB query/connection failures without secrets;
- migration and deployment identifiers;
- security-policy denials;
- backup/restore verification results.

No secret, credential, raw authorization header, payment token or full user prompt should be emitted into ordinary application logs.
