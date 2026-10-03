/**
 * Placeholder de la suite de seguridad para la superficie DEV de
 * `action=test` en `src/server-routes/api/db.ts`.
 *
 * IMPORTANTE (regla de honestidad AGENTS.md): este runner NO ejecuta
 * ninguna verificación real. `results` es "Skipped" por diseño y no debe
 * leerse como un PASS de seguridad. La evidencia real vive en
 * `pnpm security:scan`, `pnpm test` y los workflows de CI.
 */
export function runSecurityTestSuite() {
  return { success: true, results: ["Skipped", "Skipped"] };
}
