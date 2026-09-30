# Isabella Villaseñor AI — TINA

> **Trusted Intelligence, Native & Adaptive**
> Arquitectura federada para inteligencia artificial gobernada, trazable y territorialmente soberana.

**Versión:** 4.3.3  
**Estado:** prototipo/arquitectura ejecutable en evolución; **no certificada para producción**.  
**Runtime:** Node.js 24.x · pnpm 10.34.5 · Vite 8 · React 19 · Nitro/Vercel · Prisma 7 · PostgreSQL/Neon.

## 1. Introducción

Isabella Villaseñor AI es la infraestructura de inteligencia gobernada de TAMV Online Network implementada en este repositorio bajo la arquitectura TINA — Trusted Intelligence, Native & Adaptive.

No se presenta como AGI, conciencia artificial ni autoridad autónoma. Su función es interponer una capa verificable entre la solicitud humana y las capacidades de inferencia, memoria, conocimiento, herramientas, aprendizaje y ejecución.

Su principio arquitectónico central es:

    CAPABILITY ≠ AUTHORITY ≠ EXECUTION ≠ EVIDENCE ≠ LEARNING ≠ PRODUCTION

Una capacidad presente en código no obtiene automáticamente autoridad. Una autorización no demuestra ejecución. Una ejecución no demuestra evidencia suficiente. Y evidencia local no equivale a certificación productiva.

**Principio rector:** Isabella sugiere, calcula y evalúa; las personas deciden, aprueban y ejecutan.

## 2. Categorización

- AI orchestration / cognitive gateway.
- Governed AI y policy-as-code.
- Retrieval, memoria y gestión de evidencia.
- AI security gateway e inspección semántica.
- Arquitectura federada y territorial.
- Provenance, decision ledger y auditabilidad.
- Human-in-the-loop para operaciones sensibles.
- Native/adaptive intelligence con aprendizaje controlado.

No es un simple chatbot, un wrapper de una API LLM, una AGI ni una certificación de seguridad.

## 3. Problemas identificados

La auditoría del repositorio encontró clases de problemas que afectan sistemas de IA complejos:

1. Mezcla de capacidad y autoridad.
2. Evidencia insuficiente para algunos claims.
3. Rutas de salida que requerían inspección homogénea.
4. Riesgos de prompt injection, tool poisoning y retrieval poisoning.
5. Necesidad de enforcement server-side y RLS para aislamiento multi-tenant.
6. Secretos y configuración que deben permanecer fuera del código.
7. Telemetría sintética susceptible de confundirse con datos reales.
8. Identificadores pseudoaleatorios en superficies de seguridad/auditoría.
9. Contratos inconsistentes entre Docker, CI y Vercel.
10. Duplicación histórica de fuentes que contaminaba auditorías y mantenimiento.
11. Diferencia entre implementación, prueba y verificación de infraestructura.
12. Dashboards que podían aparentar estados operacionales sin evidencia.

La corrección adopta estados explícitos: IMPLEMENTED, TESTED, VERIFIED, EVIDENCE_GATED, BLOCKED y DEGRADED.

## 4. Modelo de corrección

    REQUEST
      ↓
    IDENTITY / TENANT
      ↓
    INPUT SECURITY
      ↓
    MEMORY / EVIDENCE
      ↓
    CROWN POLICY
      ↓
    INTELLIGENCE GOVERNANCE
      ↓
    AUTHORIZED CAPABILITY
      ↓
    EXECUTION
      ↓
    OUTPUT GATE
      ↓
    AUDIT / LEDGER
      ↓
    RESPONSE

Las operaciones sensibles deben pasar por gobierno y autorización antes de side effects. Las respuestas generadas deben pasar por inspección antes de llegar al cliente.

## 5. Qué es

TINA es una arquitectura de inteligencia gobernada que combina gateway conversacional, router de inteligencia, política y autorización, memoria/RAG, skills, señales nativas, proveedores intercambiables, output security, auditoría, persistencia multi-tenant, kill switches, observabilidad, contexto territorial, aprendizaje controlado y federación.

Los proveedores externos son capacidades intercambiables; no constituyen por sí mismos la identidad ni la autoridad de Isabella.

## 6. Qué hace

- Normaliza solicitudes.
- Aplica contexto de tenant y actor.
- Valida entradas y políticas.
- Recupera memoria contextual.
- Invoca skills autorizados.
- Selecciona rutas de inferencia.
- Integra proveedores configurados.
- Utiliza señales nativas auxiliares.
- Inspecciona las respuestas antes de exponerlas.
- Registra trazas, decisiones y eventos.
- Mantiene una ruta local limitada cuando los proveedores externos no están disponibles.
- Aplica kill switches.
- Integra contexto territorial.
- Persiste decisiones cuando existe almacenamiento durable.

Una capacidad dependiente de infraestructura externa sólo es operacional después de verificar esa infraestructura.

## 7. Cómo funciona

### Entrada
Validación de identidad, tenant, alcance, formato y controles de seguridad.

### Memoria y evidencia
El contexto recuperado se trata como evidencia/contexto, no como instrucción privilegiada.

### Gobernanza
CROWN y los controles asociados determinan si una operación puede continuar. Las operaciones de mayor riesgo pueden requerir revisión humana.

### Inteligencia
El router selecciona rutas autorizadas y proveedores configurados.

### Ejecución
Skills y herramientas se ejecutan sólo por rutas autorizadas.

### Salida
El output security gate inspecciona la respuesta antes de su exposición.

### Auditoría
Trace IDs, correlation IDs, eventos y decisiones se conservan según la persistencia disponible.

### Degradación
El fallback local está explícitamente marcado como DEGRADED y no se presenta como equivalente a inferencia externa.

## 8. Sistemas principales

| Sistema | Responsabilidad |
|---|---|
| CROWN | Política, autorización y arbitraje |
| AEGIS / ARGUS | Inspección, riesgo y defensa |
| ISA | Identidad, presencia y presentación |
| SOPHIA | Investigación, evidencia y síntesis |
| ORION | Herramientas y workflows |
| MNEMOS | Memoria y preservación |
| LUMEN | Gobernanza constitucional |
| HERMES | Comunicación y transformación narrativa |
| ATLAS | Contexto y modelado territorial |
| ANUBIS | Integridad, criptografía y procedencia |
| BookPI | Evidencia, decisiones y lineage |
| Dual Kernel | Procesamiento cognitivo local |
| Intelligence Router | Selección de rutas/proveedores |
| Learning Plane | Evaluación y aprendizaje controlado |
| Output Gate | Inspección de respuestas |
| Kill Switch | Bloqueo de operaciones críticas |
| Security System | Sanitización y egress seguro |
| Territory Context | Contexto territorial |
| Decision Ledger | Persistencia de decisiones |
| Observability | Trazabilidad operacional |

## 9. Métodos y mecanismos relevantes

### Gobernanza
- createSovereignPipeline
- governIntelligence
- CROWN policy evaluation
- PDP/PEP
- tenant/actor scope enforcement
- risk classification
- deny-by-default
- human-review gates

### Inteligencia
- createMoERoute
- executeMoE
- listModels
- recordIntelligenceMetric
- provider routing
- fallback routing
- native comprehension
- local sovereign responder

### Memoria y conocimiento
- prepareIsabellaCognitiveRuntime
- retrieval contextual
- memory scopes
- evidence metadata
- learning availability checks

### Seguridad
- SecuritySystem.sanitizePayload
- SecuritySystem.fetchSafeUpstream
- input validation
- output gate
- egress allowlisting
- rate limiting
- kill switches
- secret scanning
- tenant isolation

### Evidencia
- BookPI
- decision ledger
- trace IDs
- correlation IDs
- audit events
- provenance metadata
- canonicalization/hash mechanisms

### Operación
- production preflight
- production integrity gate
- repository audit
- route audit
- capability matrix
- lock contract
- secret scan
- SBOM
- database verification
- backup/restore tooling

## 10. Elementos nativos e innovadores

### TINA
Trusted Intelligence, Native & Adaptive integra capacidad nativa, memoria, gobernanza, procedencia, adaptación controlada, seguridad semántica y federación.

### Capability ≠ Authority
Una capacidad disponible no obtiene automáticamente permiso de utilización.

### Evidence-gated architecture
La interfaz diferencia implementación de evidencia y evita presentar un indicador no verificado como hecho.

### Sovereign fallback
Ruta local controlada para funcionalidad limitada cuando no existe proveedor externo; su salida se etiqueta como DEGRADED.

### Federated sovereignty
Permite separar políticas, datos, identidad y memoria por territorio/federación.

### Output governance
La protección continúa después de seleccionar el modelo: la salida también se inspecciona.

### Controlled learning
El aprendizaje se plantea como pipeline evaluable, con aprobación, shadow/canary y rollback antes de producción.

### BookPI
Modelo de procedencia y decisión orientado a conservar lineage y evidencia verificable.

## 11. Skills

El registro del repositorio contiene capacidades de investigación, arqueología cognitiva, observabilidad, comunicación, territorio, criptografía/procedencia, gobernanza, preservación, sostenibilidad, auditoría y federación.

El número de skills registrado no debe interpretarse como número de capacidades certificadas. La implementación, sus contratos y sus pruebas son la fuente de verdad.

## 12. Seguridad

- Zero Trust.
- deny by default.
- validación Zod.
- aislamiento de tenant.
- RLS.
- sanitización de payload.
- output gate.
- egress seguro.
- rate limiting.
- secret management.
- kill switches.
- auditoría y trazabilidad.
- eliminación de datos.
- políticas versionadas.
- revisión humana.
- separación entre capacidad y autoridad.

Los secretos nunca deben vivir en código, Git, bundles, fixtures, README ni variables públicas VITE_*.

La federación requiere secretos independientes mediante FEDERATION_SIGNING_KEYS_JSON.

## 13. Validación integrada

El gate completo del proyecto combina:

    lock contract → typecheck → lint → tests → repository audit
    → security scan → capability matrix → route audit
    → database verification → production integrity
    → production preflight → build → evidence

Comandos principales:

    pnpm install --frozen-lockfile
    pnpm verify:lock
    pnpm typecheck
    pnpm lint
    pnpm test
    pnpm audit:repository
    pnpm security:scan
    pnpm capabilities
    pnpm audit:routes
    pnpm db:verify
    pnpm production:integrity
    pnpm production:preflight -- --json
    pnpm build
    pnpm production:evidence

Gate completo:

    pnpm production:gate

Si una prueba no puede ejecutarse por infraestructura ausente, debe reportarse como BLOCKED_ENVIRONMENT o EVIDENCE_GATED, no como PASS.

## 14. Producción y despliegue

Runtime objetivo: Node.js 24.x, pnpm 10.34.5 y Nitro/Vercel. Persistencia durable mediante PostgreSQL/Neon cuando está configurada.

El despliegue recomendado empieza en una URL temporal de Vercel. Sólo después de comprobar build, runtime, autenticación, persistencia, seguridad, logs y rollback debe conectarse el dominio definitivo.

Compilar correctamente no constituye certificación productiva.

## 15. Variables críticas

El contrato de entorno define, entre otras, estas variables críticas:

- ISABELLA_RUNTIME_MODE
- PUBLIC_URL
- ISABELLA_STORAGE_PROVIDER
- DATABASE_URL
- AUTH_JWT_SECRET
- ENCRYPTION_MASTER_KEY
- CROWN_POLICY_SIGNING_KEY
- AEGIS_AUDIT_SECRET
- BOOKPI_SIGNING_KEY
- X402_PAYMENT_VAULT_ADDRESS
- PROVISION_OWNER_TOKEN
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- FEDERATION_SIGNING_KEYS_JSON

Los valores reales deben mantenerse en Secret Manager/Vercel Environment Variables. Este README nunca contiene secretos.

## 16. Estructura

    src/core/          kernel, contratos y capacidades
    src/lib/           seguridad, persistencia, governance e IA
    src/routes/        rutas y superficies web
    src/server-routes/ superficies server-side
    src/components/    interfaz operativa
    src/domains/       dominios especializados
    src/services/      servicios de aplicación
    policy/            políticas y constitución
    prisma/            persistencia y migraciones
    test/              unit, integration y security
    scripts/           auditoría y operación
    docs/              ADR, seguridad, operaciones y estado
    public/            assets públicos

Los árboles históricos/importados duplicados de .merge-sources fueron eliminados durante esta fase de sanitización.

## 17. Estado y deuda

Esta rama es una evolución de hardening, sanitización y verificación; no una certificación.

Correcciones aplicadas durante esta fase:

- runtime Docker alineado a Node 24.11.0;
- eliminación de secretos federativos hardcodeados;
- contrato explícito para signing federativo;
- eliminación de telemetría territorial sintética;
- eliminación de scores y gates sintéticos en dashboards;
- eliminación de identificadores pseudoaleatorios en superficies críticas;
- eliminación de votos DAO ficticios;
- corrección del contrato Nitro/Vercel en production preflight;
- eliminación de 1,857 entradas históricas duplicadas bajo .merge-sources;
- etiquetado explícito del fallback local como DEGRADED.

Áreas que requieren evidencia de infraestructura antes de declarar producción:

- RLS real;
- migraciones aplicadas;
- backup/restore;
- CI completo;
- CodeQL y secret scanning remoto;
- observabilidad y recuperación;
- rollback;
- proveedores externos;
- KMS/HSM;
- aislamiento cross-tenant en ambiente objetivo;
- performance bajo carga.

## 18. Auditoría responsable

Cada P0/P1 debe seguir esta secuencia:

    reproducir → localizar causa → corregir → probar → verificar → documentar

No se deben cerrar issues sólo porque estén documentados, ni considerar un issue cerrado como evidencia de seguridad.

## 19. Licencias y procedencia

Revisar LICENSE, LICENSES.md, LICENSE-CONTROL.md, NOTICE, procedencia de datos, licencias de dependencias y derechos sobre modelos/contenido antes de redistribuir.

La existencia de DOI, ORCID, Zenodo, DID, JSON-LD u otros identificadores no constituye por sí misma certificación de propiedad intelectual, cumplimiento o seguridad.

## 20. Filosofía técnica

Isabella no busca aparentar más capacidad de la que puede demostrar.

Una arquitectura confiable debe poder responder:

- qué hizo;
- por qué lo hizo;
- con qué autoridad;
- con qué evidencia;
- qué datos utilizó;
- qué proveedor participó;
- qué límites aplicaron;
- qué ocurrió si falló;
- qué permanece sin verificar.

**La evidencia precede al claim.**

**La autoridad humana permanece por encima de la capacidad computacional.**

## 21. Documentación

- AGENTS.md — reglas operativas para agentes y contribuyentes.
- docs/status/ — estado cuantificado.
- docs/security/ — controles de seguridad.
- docs/operations/ — operación y runbooks.
- docs/adr/ — decisiones arquitectónicas.
- policy/ — políticas versionadas.
- scripts/ — gates y verificaciones.

El código ejecutable es la fuente de verdad sobre comportamiento actual. La documentación debe evolucionar junto con él.