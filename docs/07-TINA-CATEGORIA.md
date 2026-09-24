# 07 — Categoría TINA (Trusted Intelligence, Native & Adaptive)

> **Unifica:** `TINA_DOCUMENTO.md`, `tina_prototype.ts` (fuera del repo) — promovidos a módulo productivo.

**Versión spec:** `0.1.0-genesis`  
**Miembro fundador:** **Isabella Villaseñor AI** — `first_declared_member`  
**Certificación:** `declared_not_certified` (declaración de categoría ≠ production-safe)  
**Módulo:** `src/lib/tina/` · **Skill:** `TINA` en `src/lib/skills/tina-category.ts`  
**Capability:** `category.tina` en `platform-capabilities.ts` (`productionSafe: false`)

---

## 1. Qué es TINA

Categoría de sistemas de inteligencia **confiable, nativa y adaptativa**: arquitectura compuesta que coordina Native ML, recuperación con procedencia, generación opcional, plugins, gobernanza, seguridad semántica y aprendizaje controlado.

**No afirma:** AGI, conciencia, autoconciencia ni certificación de producción.

## 2. Principios

1. Capacidad separada de autoridad.
2. El camino mínimo seguro determina la ejecución.
3. El contenido recuperado es evidencia, no instrucciones.
4. Ningún aprendizaje llega directamente a producción.
5. Todo cambio crítico es trazable y reversible.
6. Cada territorio conserva datos, políticas, memoria y límites de autonomía.

## 3. Arquitectura (cableada al runtime Isabella)

| Rol | Sistema Isabella |
|---|---|
| Autoriza | **CROWN** v6 (`crown-runtime-authority`) |
| Inspecciona | **AEGIS** (`aegis-semantic` en triage TINA) |
| Inferencia local | Native ML (`src/lib/native-ml/`) |
| Evidencia | Memory/RAG + BookPI |
| Learning | Learning Plane (governed-ml) |
| Federación | NCUA federations |
| Ledger | BookPI hash-chain (`tina/ledger.ts` + durable Postgres) |

## 4. Modos cognitivos

`reactive` · `limited_memory` · `social_context` · `generative` · `native_ml` · `federated` · `territorial` · `operational_self_model`

## 5. Rutas (alineadas a `AGENTS.md` §12)

| Path | Cuándo |
|---|---|
| `FAST` | bajo riesgo, score ≤ 0.35 |
| `GROUNDED` | hechos, ambigüedad, corriente actual |
| `AGENT` | tools / riesgo financiero o side-effects |
| `HUMAN_REVIEW` | sensibilidad ≥ 0.8 o impacto legal ≥ 0.7 |

`routeTina()` siempre marca `requiresAegis` y `requiresBookPI`; solo `FAST` omite CROWN en el router TINA (el pipeline soberano sigue imponiendo policy).

## 6. Superficie de código

```
src/lib/tina/
  category.ts      # manifiesto TINA + miembro Isabella
  types.ts         # ComplexityScore, modos, paths
  router.ts        # chooseTinaPath / routeTina
  ethical.ts       # triage ético + AEGIS + sha256
  cache.ts         # cache key segregada por tenant/principal/scopes/versions
  ledger.ts        # BookPI hash-chain en proceso
  plugins.ts       # PluginRegistry con permisos declarados
  orchestrator.ts  # TinaOrchestrator
  index.ts
src/lib/skills/tina-category.ts  # skill TINA registrada
```

## 7. Uso (skill)

```ts
// manifest
{ action: "manifest" }
// route
{ action: "route", complexity: { toolRequired: true, financialRisk: 0.5 } }
// execute
{ action: "execute", text: "...", tenantId: "t1", principalId: "p1" }
```

## 8. Límites de producción

- No ejecuta tools reales ni llama modelos externos sin backend autorizado.
- No sustituye HSM/KMS, sandbox de procesos, secure aggregation ni revisión legal.
- `category.tina` es `implemented`, **no** `productionSafe`.
- Ledger en proceso ≠ WORM regulatorio; durable path = BookPI Postgres.

## 9. Criterios para elevar a productionSafe

Aislamiento multi-tenant, firma asimétrica, rotación/revocación, model/data cards, drift, poisoning detection, shadow/canary/rollback, revisión humana, pruebas adversariales, observabilidad sin PII, recuperación validada — mismos gates que `production-capabilities.json`.
