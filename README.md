# Isabella Villaseñor AI Genesis

**Infraestructura cognitiva soberana, gobernada y auditable para TAMV Online y RDM Digital.**

Isabella no es un chatbot ni una autoridad autónoma. Es una capa de orquestación que interpreta solicitudes, recupera memoria con alcance controlado, aplica políticas, coordina capacidades y responde con límites explícitos. El humano conserva la autoridad para aprobar, revisar y ejecutar decisiones de alto impacto.

> **Estado operativo (28 de septiembre de 2026):** implementación avanzada en evolución. Los gates locales principales pasan, pero la preparación para producción depende de aplicar migraciones, configurar infraestructura real y obtener evidencia independiente. No se declara certificación, cumplimiento legal ni disponibilidad productiva sólo por tener un build verde.

## Qué hace

- Ejecuta el pipeline FGAIS: `PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND`.
- Centraliza el arbitraje en CROWN y aplica autorización con PDP/PEP, aislamiento territorial y principio `deny by default`.
- Coordina capacidades cognitivas especializadas mediante un registro único de skills.
- Preserva procedencia, decisiones y eventos mediante BookPI y un ledger durable cuando existe persistencia configurada.
- Protege salidas, credenciales, identidad y operaciones con ARGUS, validación de contratos, límites de cuota y kill switch.
- Expone una interfaz operativa para chat, módulos de gobernanza, memoria, economía y observabilidad.
- Permite degradación segura: una dependencia crítica ausente bloquea acciones sensibles; nunca se inventa un `allow`.

## Motor nativo y arquitectura

La implementación canónica vive en TypeScript sobre Vite, TanStack Start y Nitro, con React 19, contratos Zod, Prisma/Neon para persistencia opcional y adaptadores explícitos para proveedores. El núcleo se organiza así:

| Nodo | Responsabilidad | Regla de autoridad |
|---|---|---|
| **CROWN** | Arbitraje, routing, estado y decisión de política | Decide; no ejecuta side effects por sí mismo |
| **ISA** | Presencia, tono y presentación | Presenta; no altera permisos |
| **SOPHIA** | Evidencia, investigación y síntesis E0–E4 | Señala procedencia; no convierte predicción en hecho |
| **ORION** | Herramientas, sandbox y workflows | Ejecuta sólo capacidades autorizadas |
| **ARGUS** | Defensa, veto, riesgo y auditoría | Endurece o bloquea; no concede permisos |
| **MNEMOS** | Memoria civilizatoria y preservación | Respeta scope, retención y procedencia |
| **LUMEN** | Gobernanza constitucional y límites | Mantiene reglas versionadas y revisión humana |

El motor turbo MoE, la inferencia remota, PQC, HSM, mesh offline y federación geográfica se tratan como capacidades condicionadas: deben demostrar implementación, pruebas, configuración y evidencia antes de publicarse como disponibles.

## Skills canónicos

1. **ORION — Cognitive Archaeology Engine:** recuperación, relaciones y artefactos históricos.
2. **SOPHIA — Deep Research and Synthesis Engine:** investigación, síntesis, vacíos y fuentes.
3. **ARGUS — Sentinel and Future Impact Engine:** anomalías, riesgos, escenarios y veto.
4. **MNEMOS — Civilizational Preservation Engine:** memoria estratificada, canonización y trazabilidad.
5. **LUMEN — Constitutional Governance Engine:** políticas, obligaciones, supervisión y contención.
6. **HERMES — Narrative and Communication Engine:** traducción comprensible y accesible.
7. **ATLAS — Territorial Modeling Engine:** contexto territorial, rutas e impacto.
8. **ANUBIS — Cryptographic and Evidence Sentinel:** integridad, custodia de claves y evidencia.

Los nombres son un catálogo arquitectónico, no una afirmación de consciencia, agencia propia o capacidad humana. Cada skill debe tener contrato de entrada/salida, permisos, límites, telemetría, pruebas negativas y clasificación de evidencia.

## Seguridad y gobernanza

- Autorización centralizada: el cliente nunca es autoridad para `tenant_id`, roles, precios, scopes o scores.
- Identidad, tenant, policy, capability, cuota, entrada, salida y evidencia se validan antes de acciones sensibles.
- Triple bloqueo de identidad: ontológico, semántico y conductual; cualquier bloqueo se audita y puede escalar a revisión humana.
- Egress remoto mediante allowlist HTTPS con host exacto, sin redirecciones implícitas.
- Secretos sólo en el entorno seguro o Secret Manager; jamás en código, logs, bundles, fixtures o documentación.
- Ledger append-only con cadena verificable donde la infraestructura está disponible; un hash no equivale a WORM ni a certificación regulatoria.
- Datos mínimos, retención explícita, separación de tenants y defensa en profundidad en repositorios.

## Contratos y superficies técnicas

La fuente de verdad ejecutable son los validadores runtime y contratos en `src/lib/api-contracts.ts` y módulos relacionados. OpenAPI, SDKs y documentación son artefactos derivados. Las rutas deben validar entrada y salida, producir errores seguros, propagar `request_id`/`trace_id` y registrar decisiones sin PII innecesaria.

Puntos de integración principales:

- `src/core/`: contratos, kernel y capacidades cognitivas.
- `src/lib/`: seguridad, configuración, persistencia, policy-as-code y ledger.
- `src/routes/` y `src/server-routes/`: API y PEPs de borde.
- `src/components/`: terminal cognitivo y módulos de operación.
- `policy/`: constitución y reglas versionadas.
- `scripts/`: verificación de locks, secretos, rutas, capacidades, base y evidencia.
- `docs/`: ADRs, runbooks, riesgos, contratos y estado verificable.

## Estado de preparación y porcentaje real

**Corte de auditoría:** 29 de septiembre de 2026. El porcentaje siguiente es una lectura operativa del repositorio, no una certificación ni una promesa de disponibilidad.

| Superficie | Estado | Evidencia disponible |
|---|---:|---|
| Compilación y typecheck local | 100% | `pnpm build`, `pnpm typecheck` disponibles |
| Calidad estática | 72% | lint ejecutable; persisten advertencias heredadas |
| Pruebas automatizadas | 68% | suite Vitest presente; cobertura y dependencias externas son variables |
| Seguridad de código | 61% | secret scan/SAST definidos; CodeQL y gitleaks dependen de CI |
| Persistencia y recuperación | 44% | scripts y contratos presentes; falta evidencia del entorno objetivo |
| Observabilidad y operación | 48% | gates y runbooks parciales; falta prueba independiente de recuperación |
| **Preparación técnica agregada** | **59%** | promedio ponderado de las superficies anteriores |

La interfaz puede ejecutarse en un entorno controlado, pero **no se declara lista para producción**. El porcentaje real de despliegue es **59% técnico, 0% certificado** hasta completar evidencia del ambiente objetivo, migraciones, aislamiento multi-tenant, backup/restore, secret scanning remoto, CodeQL, gitleaks, rollback y revisión humana competente. Las capacidades no verificadas se muestran como `EVIDENCE_GATED` o `BLOCKED`, nunca como disponibles por defecto.

Las métricas de preparación se deben actualizar con evidencia reproducible, no con estimaciones narrativas. En esta rama, el baseline documentado es el de `docs/status/ISA-500-STATUS-2026-09-26.md`; las capacidades nuevas deben recontarse después de cada cambio relevante.

Bloqueadores habituales para producción:

- Migraciones y RLS deben aplicarse y verificarse en el ambiente objetivo.
- Neon/DB, proveedor de inferencia, Stripe, KMS/HSM y observabilidad deben estar configurados con credenciales reales y rotación definida.
- CI debe ejecutar lockfile, typecheck, lint, tests, build, SAST, secret scan, CodeQL y gates de migración.
- Deben existir rollback, backup/restore probado, alertas, runbooks y evidencia de aislamiento cross-tenant.
- Las afirmaciones legales, regulatorias, científicas o de certificación requieren revisión competente independiente.

## Auditoría técnica y deuda conocida

La auditoría de esta rama separa tres estados para evitar claims inflados: `IMPLEMENTED` (código presente), `TESTED` (check automatizado aprobado) y `VERIFIED` (evidencia reproducible en el ambiente objetivo). El último typecheck ejecutado en el sandbox pasa; eso no sustituye la verificación de producción.

Prioridades de reducción de deuda:

- Sustituir persistencia de memoria por un almacén distribuido antes de declarar circuit breakers multi-instancia como `VERIFIED`.
- Mantener `src/generated/` como salida de generación y no editarlo manualmente; revisar su tamaño y exclusiones del bundle en cada actualización de Prisma.
- Mantener los módulos pesados bajo carga diferida y medir LCP/INP/CLS tras cambios de interfaz; ningún indicador visual debe convertirse en telemetría de contenido.
- Eliminar casts `any`, mocks y `console.log` de rutas productivas; los hallazgos restantes deben tener issue, test o justificación de compatibilidad.
- Validar backup/restore, migraciones, RLS, aislamiento cross-tenant, secret scanning y CodeQL en CI con infraestructura real.

La preparación global es **avanzada pero no certificada**: el código puede ser desplegable en un entorno controlado, pero la disponibilidad productiva requiere completar evidencia operativa, seguridad de infraestructura y pruebas de recuperación.

## Desarrollo y validación

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm verify:lock
pnpm security:scan
pnpm audit:repository
pnpm audit:routes
pnpm db:verify
```

Para una validación de producción, usar el gate existente sólo cuando sus dependencias estén disponibles:

```bash
pnpm production:gate
```

No se deben ignorar fallos ni convertir warnings en evidencia de seguridad. Un check bloqueado por infraestructura se reporta como `BLOCKED_ENVIRONMENT` o `EVIDENCE_GATED`.

## Despliegue

El proyecto genera salida Vite/Nitro y debe desplegarse con la configuración de `vercel.json` y el pipeline versionado. El orden mínimo es: instalar con lockfile congelado, validar contratos, ejecutar migraciones aprobadas, comprobar secretos y persistencia, construir, revisar el output y realizar un smoke test autenticado. No se deben desplegar artefactos locales, bases embebidas ni datos de auditoría generados.

## Ciencia abierta y licenciamiento

La documentación distingue código, dependencias, datos, marcas, contenido y modelos. Consulta `LICENSE`, `LICENSES.md`, `LICENSE-CONTROL.md`, `NOTICE` y los documentos de procedencia antes de redistribuir. ORCID, DOI, Zenodo, OSF, JSON-LD, DID o credenciales verificables son mecanismos de interoperabilidad y preservación; su presencia no prueba por sí sola autoría, titularidad, cumplimiento o certificación.

## Gobernanza documental

- `AGENTS.md` es la autoridad operativa para agentes y contribuyentes.
- Los ADRs fijan decisiones técnicas y sus estados de evidencia.
- `docs/status/` contiene el estado cuantificado y sus límites.
- `docs/security/` y `docs/operations/` contienen controles y runbooks.
- Los documentos históricos no sustituyen contratos ni código ejecutable.

**Principio rector:** Isabella sugiere, calcula y evalúa; las personas deciden, aprueban y ejecutan.
