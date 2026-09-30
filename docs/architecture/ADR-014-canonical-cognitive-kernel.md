# ADR-014: Consolidación del kernel cognitivo canónico

- **Estado:** Propuesto — **Fecha:** 2026-09-30
- **Prioridad:** P0 de diseño / P2 de ejecución
- **Clasificación:** deuda de arquitectura — **no** se ejecuta en la fase de saneamiento

## Contexto

`src/core/` y `src/lib/cognition/` contienen responsabilidades cognitivas
**superpuestas y ambas vivas**. Medidas sobre los pares principales:

| Par | Similitud | ¿Ambos consumidos? |
| --- | --- | --- |
| `src/core/index.ts` ↔ `src/lib/cognition/index.ts` | 74 % | sí |
| `src/core/contracts.ts` ↔ `src/lib/cognition/contracts.ts` | 82 % | sí |
| `src/core/dual-kernel/index.ts` ↔ `src/lib/cognition/dual-kernel.ts` | 58 % | sí |

La convivencia crea:

- **deriva semántica**: dos definiciones del mismo contrato,
- **dos fuentes de autoridad** para un mismo concepto,
- **fronteras de seguridad duplicadas** que pueden aplicar controles distintos,
- propiedad incierta y coste de revisión elevado.

## Decisión

**No habrá consolidación masiva durante la fase de saneamiento del repositorio.**

En una arquitectura de gobernanza, un refactor prematuro puede provocar
precisamente lo que la arquitectura busca evitar: *bypass* de policy, cambio de
comportamiento no auditado, pérdida de trazabilidad o regresiones en aislamiento.
Dejar la duplicación visible y documentada es menos peligroso que consolidarla sin
mapa de llamadas.

Se congela la creación de nuevas abstracciones paralelas entre ambos árboles.

## Programa de migración

1. **Congelar** nuevas abstracciones duplicadas entre `src/core/` y `src/lib/cognition/`.
2. **Inventariar** responsabilidades, imports, exports, contratos, *side effects*,
   consumidores de rutas, cobertura de pruebas y propiedad.
3. **Definir** cuál de los dos árboles es el kernel canónico y fijar contratos.
4. **Introducir adaptadores de compatibilidad** en lugar de movimientos masivos.
5. **Migrar una capacidad acotada por vez** — por dominio: identidad, política,
   memoria, *tools*, auditoría.
6. **Validar** en cada capacidad: rutas, seguridad, aislamiento de tenant y regresión.
7. **Eliminar** la implementación deprecada solo cuando se verifique **cero
   consumidores** y las pruebas estén verdes.

## Consecuencias

- A corto plazo la duplicación permanece visible y documentada.
- A largo plazo el arquitectura se consolida **sin cambio de comportamiento no
  auditado**.
- El saneamiento de esta fase no contará la eliminación de estas líneas como
  "código muerto": son árboles vivos y su métrica de duplicación se retira solo
  cuando la migración avance.

## Fuente

Redactado a partir de la resolución de saneamiento del repositorio (2026-09-30),
que prioriza *integridad del repositorio, verdad operacional y reversibilidad*.
