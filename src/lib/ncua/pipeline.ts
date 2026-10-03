/**
 * NCUA Pipeline Index (src/lib/ncua/pipeline.ts)
 */
export * from "./academic-pipeline";
export * from "./sophia-epistemics";
export * from "./eri";
export * from "./entropy-patcher";
export * from "./concept-engine";
export * from "./quantum-align";
export * from "./bookpi-trajectory";

import { runAcademicPipeline } from "./academic-pipeline";
export const ncuaPipeline = { run: runAcademicPipeline };
export default ncuaPipeline;
