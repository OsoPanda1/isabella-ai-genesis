# 300 Errores Críticos — Isabella Villaseñor AI — Plan de Corrección Total

> **Blanco o negro. Si no se corrige, no se engaña.** Liste los 300 ítems del audit forense del 23 sep 2026. Cada ítem es un issue trazable con `SHA + workflow run + evidencia`.

**Estado global:** `93%` honesto (ver `README §18`). `100%` solo con `P0` cerrado + `CI en SHA exacto + RLS live + Stripe live + HSM/SBOM`.

## P0 — Bloquea certificación (7)

- [ ] **P0-01** Secretos en el historial Git - claves y tokens expuestos en commits antiguos. — *Rotado 9183... + test secret-exposure, historial aún comprometido (BFG pendiente)*
- [ ] **P0-02** CI bloqueado por billing - GitHub Actions no ejecuta en HEAD. — *75% en capabilities, Vercel despliega independiente*
- [ ] **P0-03** RLS no probado adversarialmente - aislamiento de tenants no validado.
- [ ] **P0-04** Stripe no validado en vivo - flujos de facturación sin pruebas en producción.
- [ ] **P0-05** Falta integración HSM - claves de firma no en custodia hardware.
- [ ] **P0-06** No hay SBOM - ausencia de inventario de dependencias por release.
- [ ] **P0-07** Claves rotadas pero no revocadas - claves antiguas aún válidas en servicios.

## P1 — Seguridad App & Infra (generado desde auditoría 300)

<!-- Los 293 siguientes se generan vía scripts/create-300-issues.mjs y se crean como GitHub Issues con label P1/P2 -->

Ver `scripts/300-issues.json` para el listado completo trazable y `gh issue list --label P0` para P0 abiertos.
