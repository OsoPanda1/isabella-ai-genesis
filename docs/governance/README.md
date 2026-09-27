# Gobernanza — Isabella AI Genesis

Marco de gobernanza de IA **nativo del repositorio**: artefactos versionados +
controles en código. Inspirado en el marco de `isabella-mexa-rh/governance/`
(mismo autor), adaptado a los módulos reales de aquí. Los marcos UNESCO / ONU /
WEF se usan como **referencias de diseño, no como certificación**
(`docs/governance/01-FGAIS-Governance-Constitution.md` es el charter maestro).

## Artefactos

| Ruta | Qué contiene |
|------|--------------|
| `01-FGAIS-Governance-Constitution.md` | Charter maestro de gobernanza (Génesis 2.0). |
| `risk-register/README.md` | Reglas del registro: tiers, cierre por evidencia. |
| `risk-register/AI-RISK-*.yaml` | Riesgos versionados (un YAML por riesgo). |

## Controles en código (equivalente "runtime" del marco)

| Módulo | Qué hace |
|--------|----------|
| `src/lib/db-policy-gate.ts` | Overlay de policy-as-code desde `isabella_policies`; monótono y fail-closed. |
| `src/lib/execution-authority.ts` | Autoridad de ejecución: `requiresApproval` → `requires_approval`; persiste ALLOW estricto en el ledger antes de despachar. |
| `src/lib/repositories/decision-repository.ts` | Ledger durable `isabella_decisions`: cadena SHA3-512, append-only, `verifyChain`. |
| `src/lib/repositories/policy-repository.ts` | Carga de políticas desde BD; indisponibilidad ⇒ gate unavailable fail-closed. |
| `src/lib/governance/decision-ledger.ts` | Contrato `LedgerStore` + `MemoryLedger` (tamper-evident) del que cuelga el Postgres real. |
| `src/lib/governance/ai-disclosure.ts` | Divulgación de riesgo L0–L4 y revisión humana por decisión. |
| `src/lib/governance/ai-vault.ts` | Cofre de credenciales/segredos de gobierno. |
| `src/lib/governance/500-gates.ts` | 20 dominios × 25 controles = 500 gates auditables (PASS/FAIL). |
| `src/lib/crown.ts` | `isApprovalValid`: aprobación con intento + TTL + contexto esperado. |
| `src/lib/aegis-semantic.ts` | AEGIS semántico (veredictos `allow`/`flag`/`deny`, umbrales 0.45/0.8). |
| `src/lib/secret-redactor.ts` | Redacción de secretos en peticiones y logs (entrada). |
| `src/lib/sovereign-audit.ts` | Sello de auditoría HMAC-SHA3-512 (fail-closed sin secreto). |
| `scripts/capability-matrix.mjs` | Manifiesto de capacidades: `evidence-gated` ≠ PASS (`last_verified` obligatorio). |

## Principios

1. **Bloqueo por defecto**: sin evidencia, la capacidad queda `evidence-gated`.
2. **Supervisión humana real**: acciones de alto impacto exigen aprobación
   verificable (token + TTL + contexto), no un botón.
3. **Cierre por evidencia**: un riesgo no baja su residual sin `evidence_refs`
   verificable (misma regla que `AGENTS.md` §19).
4. **Registro auditable**: toda decisión ALLOW estricta queda en el ledger
   con cadena verificable; toda denegación, en telemetría/auditoría.
5. **Honestidad de estado**: los conteos de la auditoría ISA-500 son SSOT y no
   se re-contan sin un nuevo sweep.
