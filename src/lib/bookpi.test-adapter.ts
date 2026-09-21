/**
 * MOTOR BOOKPI [TEST/DEV ADAPTER] (src/lib/bookpi.test-adapter.ts)
 * -----------------------------------------------------------------
 * @deprecated Este módulo ha sido renombrado a `src/lib/bookpi.test-adapter.ts`.
 * ES ESTRICTAMENTE UN ADAPTADOR DE TEST Y DESARROLLO LOCAL AISLADO.
 *
 * REMOVIDO DEL FLUJO FINANCIERO DE PRODUCCIÓN:
 * Para producción y flujos financieros reales, la única fuente autoritativa
 * y duradera de persistencia es `createBookpiPostgresRepository()`
 * (src/lib/repositories/bookpi-postgres-repository.ts).
 */

export * from "./bookpi-dev-adapter";
export * from "./bookpi/types";
