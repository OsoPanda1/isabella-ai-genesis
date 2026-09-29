# Security Policy — Isabella Villaseñor AI

**Contacto:** `security@tamvonlinenetwork-7731` + `https://github.com/OsoPanda1/isabella-ai-genesis/security/advisories/new`
**PGP:** ver `SECURITY-KEYS.md` (próximo)

## Reporte responsable
- No publiques secretos en issues públicos. Usa `Security Advisories` privado.
- Incluye `SHA`, `reproducción`, `impacto`, `mitigación propuesta`.

## Secretos
- `CROWN_POLICY_SIGNING_KEY` fue rotado después de un incidente histórico documentado. El valor comprometido no se reproduce en documentación ni código; el historial antiguo permanece tratado como comprometido hasta una eventual migración de historial coordinada. `Vercel Secret Manager` es la autoridad de secretos.

## Gates
- `gitleaks` + `CodeQL` en PRs (`secret-scan.yml`, `sast.yml`)
- `pnpm audit` + `SBOM` (`scripts/sbom.mjs`) por release
- `SLSA` provenance pendiente

## Estado
La preparación de producción se declara únicamente cuando exista evidencia ejecutable del commit, del entorno objetivo, de seguridad, de datos y de recuperación. Este documento no contiene porcentajes de certificación.