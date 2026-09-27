# ADR-012: Evidence Ledger — bitácora append-only encadenada por hash

## Estado: Aceptado

## Fecha: 26 de septiembre de 2026

## Contexto

Este repositorio realiza operaciones con significado auditable: decisiones de
autorización de ejecución, sellos NCUA/BookPI y eventos de auditoría que
respaldan la matriz de capacidades (`production-capabilities.json`). Un log
plano basta para observar, no para **probar**: las entradas podrían
reordenarse, insertarse o borrarse sin dejar rastro. No existía persistencia
de decisiones (issue #350: "no hay policy-as-code"); el ledger de decisiones
se añadió junto con policy-as-code (`20260926030000`).

Inspirado en ADR-0004 *Evidence Ledger* de `isabella-mexa-rh` (mismo autor),
reescrito para el stack real de aquí: PostgreSQL + fail-closed + SHA3-512.

## Decisión

Mantener **tres capas de evidencia** con responsabilidades distintas:

### 1. Ledger de decisiones — `public.isabella_decisions`

| Campo | Descripción |
|---|---|
| `tenant_id` | Dominio de la cadena (una cadena lógica por tenant). |
| `input_hash` | SHA3-512 del insumo de la decisión. |
| `output_hash` | SHA3-512 del detalle/salida asociada. |
| `previous_hash` | `record_hash` anterior del mismo tenant (`"GENESIS"` en el primero). |
| `record_hash` | SHA3-512 del registro; identidad idempotente. |
| `result` | `ALLOW` \| `DENY` \| `REVIEW` (CHECK). |
| `evidence_ids` | Array JSONB de evidencias referenciadas (CHECK array). |

- **Append-only por base**: triggers `BEFORE UPDATE`/`BEFORE DELETE` ejecutan
  `public.prevent_bookpi_mutation()` (heredado de BookPI).
- **Cadena verificada en escritura**: `append` exige
  `record.previous_hash === último record_hash` del tenant
  (`DECISION_CHAIN_MISMATCH` si no) — ver
  `src/lib/repositories/decision-repository.ts`.
- **Idempotencia**: `UNIQUE (tenant_id, record_hash)` + `ON CONFLICT DO NOTHING`.
- **Verificación**: `verifyChain(limit)` recomputa la cadena y reporta el
  primer quiebre.
- **Fail-closed**: sin `DATABASE_URL` o con la base ilegible, `append`/`latestHash`
  fallan; en el pipeline, un fallo de persistencia del **ALLOW estricto**
  degrada la decisión a `REVIEW` (stage `audit`), nunca a despacho silencioso.

### 2. Auditoría — `audit_events`

Registro operativo (quién, cuándo, qué) con sello soberano HMAC-SHA3-512
(`src/lib/sovereign-audit.ts`), fail-closed si falta `AEGIS_AUDIT_SECRET`.

### 3. Trajectory BookPI — `src/lib/ncua/bookpi-trajectory.ts`

Trayectoria académica/NCUA sellada con el mismo primitivo HMAC-SHA3-512.

## Consecuencias

- **Positivas**: cualquier alteración de un registro pasado rompe la cadena y
  `verifyChain` la detecta; la persistencia es idempotente ante reenvíos; el
  fail-closed impide decisiones ALLOW sin evidencia durable.
- **Negativas**: append-only corrige errores con entradas compensatorias, no
  con ediciones; sin `DATABASE_URL` el ledger no opera (hoy: bloqueo
  `BLOCKED_ENVIRONMENT`, capabilities `production_safe: false` hasta aplicar
  la migración).
- **Neutro**: aún no hay checkpoints periódicos (cada verificación recorre la
  cadena desde `GENESIS` o desde `limit`); se puede añadir sin romper esquema.

## Alternativas consideradas

| Alternativa | Descartada porque |
|---|---|
| Solo `audit_events` sin cadena | Auditoría modificable sin evidencia de alteración. |
| Árbol de Merkle | Complejidad sin beneficio proporcional a la escala actual. |
| Anclaje externo (blockchain/WORM) | Dependencia de red/costo; el repo debe operar degradado. |
| `UPDATE` de decisiones (correcciones in place) | Rompe la evidencia; las correcciones deben ser entradas nuevas. |
