/**
 * CROWN RUNTIME AUTHORITY (src/lib/crown-runtime-authority.ts)
 * -----------------------------------------------------------------
 * Autoridad canónica del camino runtime crítico (sovereign-pipeline,
 * constitutional gate, chat gateway): CROWN v6.0-fusion.
 *
 * `crown.ts` (CROWN_VERSION 2.0.0) queda como compatibility adapter de los
 * 5 módulos base (ISA/SOPHIA/ORION/ARGUS/CROWN): su lógica de evaluación se
 * reutiliza, pero la versión y los registros publicados por esta autoridad
 * son los de CROWN v6 (12 nodos).
 *
 * Auditoría P1-03: la documentación declara CROWN v6; el runtime debe
 * importar desde esta autoridad, no desde crown.ts directamente.
 */

export * from "./crown";
export { CROWN_V6, NODES_12, MODULES_12, EXTENDED_MODULES, MODULE_TO_NODE } from "./crown-v6";
export type { NodeId } from "./crown-v6";

/** Versión de la autoridad runtime canónica (CROWN v6). */
export const CROWN_RUNTIME_AUTHORITY = "CROWN_V6" as const;
export const CROWN_AUTHORITY_VERSION = "6.0.0-fusion" as const;
/** Versión del compatibility adapter de los 5 módulos base. */
export const CROWN_COMPAT_ADAPTER_VERSION = "2.0.0" as const;
