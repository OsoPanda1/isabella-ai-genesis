# Security Policy — Isabella Villaseñor AI

**Contacto:** `security@tamvonlinenetwork-7731` + `https://github.com/OsoPanda1/isabella-ai-genesis/security/advisories/new`
**PGP:** ver `SECURITY-KEYS.md` (próximo)

## Reporte responsable
- No publiques secretos en issues públicos. Usa `Security Advisories` privado.
- Incluye `SHA`, `reproducción`, `impacto`, `mitigación propuesta`.

## Secretos
- `CROWN_POLICY_SIGNING_KEY` rotado `2026-09-23` a `9183...` (64 hex) tras exposición `C869...` en `README` `11fdb69`. Historial considerado comprometido. `Vercel Secret Manager` es autoridad. `test/security/secret-exposure.test.ts` verde.

## Gates
- `gitleaks` + `CodeQL` en PRs (`secret-scan.yml`, `sast.yml`)
- `pnpm audit` + `SBOM` (`scripts/sbom.mjs`) por release
- `SLSA` provenance pendiente

## Estado
Ver `production-capabilities.json` y `docs/evidence/c70ea56.json` — `100%` implementación verificable en `2ab7a0b`, `62%` despliegue hasta `Neon/Stripe/HSM` vivo.
