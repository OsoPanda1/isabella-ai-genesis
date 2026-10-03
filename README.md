# Isabella Villaseñor AI

## Estado operativo

Isabella es una plataforma federada de **orquestación cognitiva gobernada** para TAMV ONLINE, RDM Digital Hub y Nodo Cero. No es AGI, consciencia artificial ni autoridad autónoma: genera análisis y recomendaciones; las decisiones sensibles requieren autorización y revisión humana.

- **Versión canónica:** `4.3.3` (`package.json`)
- **Runtime:** Node 24, pnpm 10.34.5, Vite 8, React 19, TypeScript 6
- **Categoría:** TINA — Trusted Intelligence, Native & Adaptive (`declared_not_certified`)
- **Entrada de desarrollo:** Vite + TanStack Router
- **Producción:** artefacto Vite/Nitro (`pnpm build`, `pnpm start`)

## Arquitectura real

```text
Request → CROWN → memory/evidence → ARGUS → ORION/skills → SOPHIA → ISA → BookPI
```

- **CROWN:** arbitraje, routing, identidad, tenant, policy y fail-closed.
- **ISA:** presencia, contexto y entrega.
- **SOPHIA:** evidencia, epistemología E0–E4 y síntesis.
- **ORION:** herramientas y ejecución aislada autorizada.
- **ARGUS:** riesgo, redacción, observabilidad, kill-switch y veto.
- **MNEMOS:** memoria con scopes y procedencia.
- **BookPI:** ledger append-only, hashes, auditoría y evidencia.

El flujo canónico es `PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND`. Las mutaciones sensibles no usan un allow local: identidad, capability, cuota, validación y auditoría deben resolverse antes de ejecutar.

## Capacidades implementadas

- Gateway de chat validado con Zod, rate limiting, firewall semántico y kill-switch.
- RBAC/ABAC, aislamiento por tenant y rutas versionadas `/api/v1`.
- Memoria jerárquica, aprendizaje supervisado y digest de procedencia.
- Skills gobernadas con identidad, schema, autorización, ejecución y BookPI.
- IGDS: JCS, Ed25519, Merkle y manifiestos de procedencia.
- NCUA: clasificación epistemológica, evidencia y trayectorias HMAC.
- Observabilidad con métricas de latencia, salud de pipelines y endpoints de health.
- Criptografía de aplicación AES-256-GCM/HKDF; no se declara HSM hardware.
- Runtime MoE real en `src/lib/native-ml/moe-engine.ts`: artifacts obligatorios, top-k, capacity, fallback, validación de salida y trazas hash.

## Skills

Los packs viven en `src/lib/skills/` y se exponen mediante `GET/POST /api/v1/skills`.

| Pack | Skills principales | Función |
|---|---|---|
| Core | ORION, SOPHIA, ARGUS, HERMES, ATLAS, ANUBIS, GEMET | herramientas, evidencia, seguridad, comunicación, territorio, procedencia y ética |
| Territorio | AURORA, GAIA, NODO_CERO, PHAROS | orientación, sostenibilidad, operaciones y descubrimiento responsable |
| Infraestructura | CITEMESH, HEPHAESTUS | coordinación federada y arquitectura soberana |
| Memoria | MNEMOSYNE, CHRONOS, PROMETEO | archivo, continuidad temporal y compilación civilizatoria |
| Ética y soberanía | VIGIA, LYRA, EIRENE, THEMIS, SENTINEL | seguridad humana, coherencia, mediación, auditoría y abuso |
| Economía y educación | HELIOS, KAIROS, UTAMV | analítica, priorización y rutas de aprendizaje |
| Orquestación | HEPTA, TINA | composición federada y declaración de categoría |
| Ecosistema | nodo-cero-twin, rdm-sovereign-commerce, rdm-community-assembly | gemelo territorial, comercio y deliberación; estados explícitos cuando requieren telemetría o firmas |

Cada skill debe declarar riesgo y estado. `SIMULATED`, `BLOCKED`, `REVIEW` y `EVIDENCE_GATED` nunca se presentan como PASS.

## Machine learning

El entrenamiento nativo verificable es un clasificador binario con procedencia y aprobación. El motor MoE implementa routing y ejecución de artifacts; no afirma que existan pesos neuronales profundos entrenados. ONNX, PyTorch, HSM y telemetría territorial sólo son capacidades productivas cuando existe el artifact, proveedor y evidencia correspondientes.

## Seguridad y gobernanza

La aplicación aplica headers, sanitización, límites de payload, secretos fuera del código, auditoría y políticas fail-closed. No se incluyen claves, dumps, tokens ni credenciales. Las afirmaciones regulatorias, jurídicas, científicas o de certificación requieren validación independiente y no se derivan del código por sí solas.

## Verificación

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm production:preflight -- --json
```

La suite actual contiene una prueba operativa del runtime MoE y debe crecer junto con cada capability. La ausencia de evidencia de CI, infraestructura de pago, HSM hardware, migraciones aplicadas o proveedor territorial vivo mantiene esas capacidades fuera de producción.

## Avance honesto

**54 % global declarado** en `production-capabilities.json` como referencia de implementación y despliegue. Es una métrica de estado del repositorio, no certificación de producción. La promoción real requiere tests, CI same-commit, migraciones verificadas, revisión humana y evidencia operacional.

## Estructura

- `src/lib/`: gobernanza, skills, ML, memoria, seguridad, observabilidad y persistencia.
- `src/routes/` y `src/server-routes/`: superficies web y API.
- `prisma/` y `supabase/migrations/`: persistencia y migraciones.
- `.github/workflows/`: CI, seguridad, SBOM y despliegue.
- `test/`: pruebas Vitest por dominio.
- `AGENTS.md`: autoridad operativa y clasificación de capacidades.

## Licencias

Consulta `LICENSE`, `LICENSE-APACHE`, `LICENSE-CONTENT`, `LICENSE-ISCL` y `LICENSE-SOVEREIGN.md`. El código, contenido, marcas, datos y modelos conservan sus licencias y autorizaciones específicas.
