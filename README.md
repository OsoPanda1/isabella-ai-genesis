# Isabella Villaseñor AI — Genesis

> **El presente ha despertado.**
>
> **Capacidad no implica autoridad. La autoridad requiere evidencia. La ejecución requiere control. El aprendizaje requiere proveniencia.**

## Estado actual — 13 de septiembre de 2026

**Clasificación:** infraestructura cognitiva federada, gobernada y auditable para IA soberana.  
**Versión declarada:** Genesis 4.4.0 — arquitectura en evolución.  
**Estimación real actual de preparación para producción:** **76%**.  
**Estado de despliegue público general:** **BLOQUEADO** hasta completar los gates críticos descritos abajo.  
**Estado para desarrollo/staging controlado:** **APTO CON VERIFICACIÓN PENDIENTE**.

El 76% **no significa que el proyecto esté certificado para producción**. Es una estimación arquitectónica basada en capacidades implementadas y en la existencia de controles; no sustituye pruebas frescas de CI, build, integración con proveedores, carga, recuperación ni seguridad ofensiva. Ningún porcentaje debe interpretarse como evidencia de que todos los componentes funcionan en producción.

---

# ¿Qué es Isabella?

Isabella Villaseñor AI — Genesis no pretende ser un chatbot monolítico ni afirmar conciencia, acceso al conocimiento interno de otros proveedores o autonomía ilimitada.

Es una plataforma para construir una IA con cuatro propiedades centrales:

1. **Aprendizaje gobernado:** el conocimiento puede ingresar, evaluarse, converger, entrenarse y aprobarse sin confundir una respuesta con una verdad.
2. **Ejecución controlada:** capacidad y autoridad están separadas; una capacidad disponible no equivale a permiso para usarla.
3. **Seguridad de defensa en profundidad:** ningún componente de seguridad debe convertirse por sí solo en una autoridad absoluta.
4. **Trazabilidad:** decisiones, conocimiento y recuperación deben poder vincularse con evidencia, contexto, hashes, versiones y controles de gobernanza.

## Lo que Isabella no afirma

- No contiene ni fusiona pesos propietarios de Gemini, Claude, ChatGPT, Copilot, DeepSeek, Perplexity, Kimi u otros modelos.
- No considera que consenso entre modelos equivalga automáticamente a verdad.
- No convierte componentes experimentales en autoridad de producción.
- No permite que un nodo de seguridad único reinicie o destruya arbitrariamente la infraestructura.
- No debe ocultar la seguridad mediante oscuridad; su seguridad crítica debe ser auditable y basada en separación de autoridad.

---

# Arquitectura principal

```text
Solicitud / Evento
       │
       ▼
Identidad + Tenant + Correlación
       │
       ▼
CROWN / Política Constitucional
       │
       ├──────────────────────────────────────────────┐
       ▼                                              ▼
ARGUS Sentinel                                  AEGIS / Controles
       │                                              │
       ├───────────────┐                              │
       ▼               ▼                              │
ARGUS Shadow       Execution Authority ◄──────────────┘
       │               │
       ▼               ▼
ARGUS AION      Auditoría / BookPI
       │
       ├── Checkpoints limitados
       ├── Heartbeat / epoch / secuencia
       ├── Behavioral Sentinel
       └── Recovery Mesh por quorum
```

## Principio central

**ARGUS no debe ser un punto único de fallo.**

El sistema incorpora capas que pueden observar, vetar, aislar o impedir una recuperación insegura. ARGUS AION no se presenta como un segundo soberano del sistema: es un mecanismo de continuidad con autoridad limitada.

---

# Native Learning Fabric

El núcleo de aprendizaje nativo incluye:

- aprendizaje supervisado y clasificación determinista;
- artefactos versionados con hash;
- provenance y aprobación antes de promover modelos;
- convergencia de múltiples observaciones;
- aprendizaje federado con validación de actualizaciones;
- clasificación epistemológica;
- detección de conflicto y desacuerdo;
- estados de conocimiento `SUPPORTED`, `PROBABLE`, `CONTESTED` y `UNKNOWN`.

## Dominios de conocimiento

Las observaciones pueden categorizarse como:

- factual;
- technical;
- scientific;
- security;
- ethical;
- operational;
- creative;
- temporal.

## Niveles de evidencia

`E0 → E1 → E2 → E3 → E4`

La convergencia pondera acuerdo, evidencia, confianza y frescura. El motor no acepta simplemente una mayoría numérica como autoridad epistemológica.

La ruta crítica se mantiene local y determinista para conjuntos pequeños: no requiere invocar un LLM ni realizar una llamada de red para calcular una convergencia básica.

---

# ARGUS AION

**ARGUS AION** es un nodo de continuidad en segundo/tercer plano diseñado para observar la salud y el comportamiento de ARGUS sin participar como autoridad primaria durante el funcionamiento normal.

## Modos

```text
DORMANT → SHADOW → AION_ACTIVE → RECOVERY
                         │
                         └────────→ QUARANTINED
```

## Checkpoints

AION conserva un historial acotado de:

- secuencia;
- timestamp;
- digest de estado;
- versión de política;
- conjunto de nodos;
- puntuación de salud.

La recuperación conservadora evita seleccionar automáticamente el último estado observado. Cuando existe historial suficiente, el plan prefiere un checkpoint anterior para reducir el riesgo de restaurar el comienzo de una corrupción.

## Behavioral Sentinel

`src/lib/argus-aion-behavior.ts` aprende un baseline robusto y acotado del comportamiento observable de ARGUS usando:

- latencia;
- distribución de riesgo;
- tasa de veto;
- versión de política;
- secuencia;
- digest de decisión.

Su detección utiliza desviación robusta basada en mediana y MAD, evitando que un único outlier redefina fácilmente el baseline.

Estados:

`LEARNING | NORMAL | SUSPICIOUS | CRITICAL`

Esto permite preguntar no sólo **“¿ARGUS responde?”**, sino también **“¿ARGUS continúa comportándose dentro de su patrón esperado?”**.

## Recovery Mesh

`src/lib/argus-recovery-mesh.ts` añade:

- attestations por nodo;
- binding al `planId` y `planDigest`;
- HMAC-SHA-256 por attestation;
- comparación en tiempo constante;
- epoch vinculado al plan;
- ventana temporal limitada;
- quorum configurable;
- consumo de plan para evitar replay.

El Recovery Mesh **no reinicia infraestructura**. Sólo autoriza o rechaza un plan. La mutación posterior debe atravesar una autoridad de ejecución independiente.

---

# Hardening y principios de seguridad

1. **Zero Trust:** identidad y contexto deben verificarse.
2. **Fail Closed:** ausencia de evidencia no se convierte en permiso.
3. **Capability ≠ Authority:** tener una función no concede autorización para ejecutarla.
4. **AION never grants:** AION puede observar, escalar, planificar o solicitar recuperación; no se convierte en autoridad universal.
5. **Quorum before recovery:** una sola señal no debe ser suficiente para una recuperación distribuida sensible.
6. **Replay resistance:** decisiones y attestations se vinculan al contexto exacto.
7. **Bounded state:** memoria de seguridad y ventanas de aprendizaje están acotadas para reducir crecimiento y superficie de DoS.
8. **No security through obscurity:** los controles deben poder auditarse.
9. **Quarantine:** componentes sospechosos pueden aislarse en vez de recuperar autoridad automáticamente.
10. **Auditability:** cambios críticos deben dejar evidencia durable.

---

# Preparación para producción — estimación honesta

| Área | Estimación | Estado |
|---|---:|---|
| Gobernanza constitucional | 90% | Implementada, requiere verificación integrada fresca |
| Autenticación/autorización | 82% | Hardening avanzado; aún requiere revisión de rutas críticas |
| Seguridad ARGUS/AEGIS | 84% | Defensa en profundidad ampliada; integración completa pendiente |
| ARGUS AION | 70% | Núcleo, comportamiento y quorum implementados; falta cableado operativo end-to-end |
| Native ML | 78% | Convergencia y aprendizaje nativo presentes; faltan benchmarks y pipeline completo de promoción |
| Memoria/provenance | 80% | Arquitectura avanzada; requiere validación bajo carga |
| Billing/Stripe | 62% | Persisten gates críticos de autorización, idempotencia y flujo legado por cerrar/verificar |
| Observabilidad | 68% | Infraestructura existente; cobertura integral aún debe demostrarse |
| Resiliencia/DR | 66% | AION y recovery plan avanzan la arquitectura; falta ejercicio real de recuperación |
| CI/CD y release gates | 60% | Evidencia fresca requerida; no se declara verde sin ejecución actual |
| Performance | 65% | Fast paths locales añadidos; falta benchmark p50/p95/p99 |
| Producción global | **76%** | **NO CERTIFICADA** |

## Gates que bloquean declarar 100%

No se debe publicar como producción general hasta demostrar, con evidencia fresca:

- [ ] `pnpm lint` limpio, incluyendo errores previamente identificados.
- [ ] `pnpm typecheck` limpio.
- [ ] pruebas unitarias/integración/seguridad actuales en verde.
- [ ] build reproducible en el entorno real de despliegue.
- [ ] cableado de los scopes específicos de billing en todos los handlers financieros.
- [ ] idempotencia durable de checkout verificada end-to-end.
- [ ] autorización `authorize-run` persistente, expirable y de un solo uso validada en ejecución.
- [ ] sanitización completa de errores de autenticación hacia clientes.
- [ ] límites de tamaño y consumo validados antes de rutas costosas.
- [ ] integración AION → alerta → plan → quorum → execution authority → verificación post-recovery.
- [ ] simulación de caída total de ARGUS.
- [ ] simulación de comportamiento ARGUS comprometido pero con heartbeat activo.
- [ ] prueba de compromiso de AION y confirmación de que no puede concederse autoridad universal.
- [ ] prueba de replay, partición de red y corrupción de checkpoint.
- [ ] benchmark p50/p95/p99 antes/después de las nuevas rutas.
- [ ] smoke test de staging con proveedores y base de datos reales.
- [ ] ejercicio de disaster recovery.
- [ ] revisión de seguridad ofensiva independiente.

**Sin esos resultados, 100% sería una afirmación falsa.**

---

# Desarrollo

## Requisitos

- Node.js 22+
- pnpm compatible con el lockfile del repositorio
- PostgreSQL 16+ o proveedor compatible para staging
- credenciales y secretos únicamente mediante configuración segura

## Instalación

```bash
git clone https://github.com/OsoPanda1/isabella-ai-genesis.git
cd isabella-ai-genesis
pnpm install
cp .env.example .env.local
```

No copies secretos de producción a `.env.local`.

## Gates habituales

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

El repositorio también puede incluir gates adicionales como:

```bash
pnpm production:integrity
pnpm production:preflight
pnpm capabilities
pnpm audit:routes
pnpm audit:repository
pnpm production:evidence
pnpm production:gate
```

Los comandos sólo constituyen evidencia cuando se ejecutan sobre el commit que se pretende desplegar y sus resultados se conservan.

---

# Archivos principales

```text
src/lib/
├── native-ml/
│   ├── convergence-engine.ts
│   ├── teacher-convergence.ts
│   └── federated.ts
├── argus-shadow-guard.ts
├── argus-aion.ts
├── argus-aion-behavior.ts
├── argus-recovery-mesh.ts
├── sovereign-pipeline.ts
├── latam-aegis-x.ts
└── repositories/

test/unit/
├── argus-shadow-guard.test.ts
├── argus-aion.test.ts
├── argus-aion-behavior.test.ts
└── argus-recovery-mesh.test.ts

docs/security/
└── ARGUS-DEFENSE-ARCHITECTURE.md
```

---

# Transparencia como propiedad de seguridad

Isabella busca que las personas puedan inspeccionar:

- qué componente actuó;
- qué política participó;
- qué evidencia se utilizó;
- qué nivel de confianza y desacuerdo existía;
- qué versión produjo una decisión;
- qué controles podían vetarla;
- y qué condiciones permitieron o impidieron la ejecución.

La transparencia no significa exponer secretos, claves, credenciales ni instrucciones que permitan evadir los controles. Significa hacer verificable la cadena de autoridad sin convertir la superficie de ataque en documentación para un adversario.

---

# Autoría y propósito

**Arquitecto y fundador:** Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)  
**Ecosistema:** TAMV Online Network  
**Origen:** Real del Monte, Hidalgo, México

Isabella se desarrolla bajo una premisa: la tecnología puede ser avanzada sin ser opaca, y poderosa sin recibir autoridad ilimitada.

> **ARGUS observa. AION preserva la continuidad. Isabella aprende con evidencia. La autoridad permanece gobernada.**

## Licencias

- Código: Apache 2.0, según los archivos de licencia del repositorio.
- Contenido/documentación: CC BY 4.0 donde corresponda.
- Controles de gobernanza: sujetos a la licencia y políticas específicas del proyecto.
