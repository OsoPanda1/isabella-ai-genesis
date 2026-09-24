# Índice canónico de documentación — Isabella AI Genesis v4.3.3

> **Regla:** este índice es el único punto de entrada a la documentación viva.
> Todo lo demás en `docs/_archive/` es histórico: no citar como autoridad sin revisar vigencia.
> Cifras y versiones: `package.json` (SSOT) + `production-capabilities.json` + `AGENTS.md`.

## Canon vivo (leer en este orden)

| # | Documento | Contenido |
|---|-----------|-----------|
| 0 | `AGENTS.md` | Arquitectura, seguridad, gobernanza, contratos canónicos, reglas de agentes |
| 1 | `docs/01-ISABELLA-CANONICA-UNIFICADA.md` | Identidad, 4 planos, CROWN v6, pipeline FGAIS |
| 2 | `docs/02-ISABELLA-OPERACIONES-PRODUCCION.md` | Gates, DB, Vercel, SLO, capacidades |
| 3 | `docs/03-ISABELLA-SEGURIDAD-PRIVACIDAD.md` | Zero Trust, auth, crypto triangulado, privacidad |
| 4 | `docs/04-ISABELLA-ECONOMIA-BOOKPI.md` | BookPI, Stripe, Cattleya, x402 |
| 5 | `docs/05-ISABELLA-INTELIGENCIA-ML.md` | ML gobernado, HDC, NCUA, quantum, skills |
| 6 | `docs/06-ISABELLA-DESARROLLO-CONTRIBUCION.md` | Stack, comandos, contribución, licencias |
| 7 | `docs/07-TINA-CATEGORIA.md` | Categoría TINA — Isabella primera AI declarada |

## Raíz del repo

| Documento | Rol |
|-----------|-----|
| `README.md` | Presentación operativa y ficha verificada (se reescribe con evidencia real) |
| `SECURITY.md` | Reporte responsable, rotación de claves, gates de seguridad |
| `AGENTS.md` | SSOT arquitectónica para agentes y contribuidores |
| `LICENSE` / `LICENSE-*` / `NOTICE` | Licencias software/docs/marca |

## Áreas de soporte (vivas)

- `docs/architecture/SSOT.md` — SSoT por dominio
- `docs/architecture/RUNTIME-AUTHORITY-MAP.md` — mapa de autoridades runtime
- `docs/operations/` — runbooks operativos (SLO, CSP, rate limit, backups, HSM, etc.)
- `docs/runbooks/incident.md` — respuesta a incidentes P0/P1
- `docs/security/ISABELLA-API-KEYS.md` — contrato de API keys
- `docs/evidence/` — manifiestos de evidencia same-commit
- `docs/ml/DRIFT.md` — drift y fairness ML
- `docs/governance/01-FGAIS-Governance-Constitution.md` — charter FGAIS

## Archivo histórico

`docs/_archive/**` conserva ADRs, auditorías, unificaciones previas y documentos
absorbidos por `docs/01..06`. No borrar sin política de retención; no usar como fuente de cifras actuales.

## Unificación aplicada (2026-09-24)

- Eliminados duplicados exactos de archive (governance, CAPABILITY_MATRIX, SLO, incident runbook).
- Movidos a archive: `PRODUCTION-READINESS-2026-09-13.md`, `ISABELLA_VILLASENOR_AI_PRESENTACION_Y_AUDITORIA_v1.0.0.md`.
- `README.md` reescrito solo con datos verificables del repo en la fecha de emisión.
