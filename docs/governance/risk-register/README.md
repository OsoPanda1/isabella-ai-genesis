# AI Risk Register — Isabella AI Genesis

Registro versionado de riesgos de IA (**AI-RISK-0001** y siguientes) de
isabella-ai-genesis, adaptado a los módulos **reales** de este repositorio.

> **Proveniencia.** Semillas inspiradas en el registro de
> `isabella-mexa-rh/governance/risk-register/` (mismo autor, Anubis Villaseñor),
> reescritas por completo para los componentes de este repo. La numeración es
> **independiente por repositorio**: un `AI-RISK-000N` de allá no es
> necesariamente el mismo riesgo que el `AI-RISK-000N` de aquí.

## Clasificación (niveles de intervención humana)

| Tier | Significado |
|------|-------------|
| `LOW` | Impacto mínimo; automatización permitida (H0). |
| `MEDIUM` | Riesgo gestionable; revisión posterior (H1). |
| `HIGH` | Requiere aprobación humana (H2) y owner con autoridad. |
| `CRITICAL` | Requiere aprobación doble (H3); bloquea producción si está abierto. |
| `PROHIBITED` | No se ejecuta de forma autónoma (H4): decisión exclusivamente humana. |

## Regla de cierre (anti-evidencia-vacía)

Un riesgo **no** se cierra por tener una política escrita. Solo cierra con
**evidencia técnica** registrada en `evidence_refs` (prueba automatizada,
gate ejecutado, evidencia versionada). `residual_risk` **no baja** sin esa
evidencia — mismo principio que `AGENTS.md` §19 (`EVIDENCE_GATED` ≠ PASS).

## Convención

- Un archivo YAML por riesgo: `AI-RISK-0001.yaml`, `AI-RISK-0002.yaml`, …
- `owner` DEBE ser una persona o rol con autoridad (nunca "el sistema").
- `existing_controls` solo enumera controles que **existen como código hoy**;
  los pendientes van en `mitigations` con su ítem de auditoría (`ISA-…`).
- Los campos siguen el esquema de los YAML de origen
  (`risk_id, title, system, component, owner, status, likelihood, impact,
  inherent_risk, residual_risk, tier, human_rights, prohibited,
  requires_human_approval, existing_controls, mitigations,
  acceptance_criteria, evidence_refs, notes`).

## Índice

| Archivo | Riesgo | Tier | Estado |
|---------|--------|------|--------|
| `AI-RISK-0001.yaml` | Fuga de secretos o identificadores en la salida del modelo | CRITICAL | open |
| `AI-RISK-0002.yaml` | Alucinación presentada como hecho verificado | HIGH | mitigating |
| `AI-RISK-0003.yaml` | Evasión de políticas por inyección de prompt (entrada/salida) | HIGH | mitigating |
| `AI-RISK-0004.yaml` | Acción de alto impacto sin aprobación humana | PROHIBITED | mitigating |
| `AI-RISK-0005.yaml` | Despliegue sin verificación de CI/gates | CRITICAL | open |

## Marco de referencia

Los marcos UNESCO / ONU / WEF se usan como **referencias de diseño**, no como
certificación (ver `docs/governance/01-FGAIS-Governance-Constitution.md`).
