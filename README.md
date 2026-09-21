# Isabella Villaseñor AI™

## Infraestructura cognitiva soberana, híbrida y territorial para TAMV

> **"Las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta."**

**Isabella Villaseñor AI™** es el núcleo cognitivo, motor de orquestación ética e interfaz territorial del Gemelo Digital de Real del Monte dentro del ecosistema **TAMV ONLINE NETWORK / RDM Digital Hub / Nodo Cero** (Real del Monte, Hidalgo, México), creado y diseñado por **Edwin Oswaldo Castillo Trejo · Anubis Villaseñor** (ORCID: 0009-0008-5050-1539).

No es un chatbot comercial ni un simple wrapper de LLMs. Es una arquitectura distribuida para coordinar **inteligencia artificial, identidad soberana, memoria pentacapa, epistemología, gobernanza Zero Trust (CROWN), habilidades nativas (Skills), economía inmutable (BookPI), auditoría criptográfica, observabilidad y proveedores intercambiables**, preservando siempre la soberanía humana sobre toda decisión crítica.

---

## 0. Ficha Técnica

- **Repositorio:** `OsoPanda1/isabella-ai-genesis`
- **Versión:** `4.3.3`
- **Node.js:** `24.11.0`
- **Gestor:** `pnpm 10.15.4`
- **Runtime objetivo:** TanStack Start + Nitro + Vercel
- **Licencia:** Creative Commons Attribution 4.0 International (CC BY 4.0) / Open Science
- **Suite de pruebas:** 93 suites ejecutadas, **501 tests pasando (0 fallos)**

---

## 0.1 Estado de Producción y Despliegue — Auditoría 2026-09-21

> Los porcentajes son índices de madurez técnica, no certificaciones externas. **100% solo se declara cuando existe evidencia reproducible en el mismo commit de release.**

| Indicador | Estado actual auditado | Objetivo |
|---|---:|---:|
| Implementación funcional | ~78% | 100% |
| Preparación para producción | ~50% | 100% |
| Preparación para despliegue | ~29% | 100% |
| Producción certificada | NO | SÍ |
| Despliegue certificado | NO | SÍ |

La ruta canónica de cierre es:

`package → lockfile → frozen install → typecheck → lint → tests → security → DB → BookPI → NCUA 50/100/250/500 → Vercel prebuilt → production smoke → evidence → rollback`

Los archivos `docs/release/PRODUCTION-100-GATE.md`, `scripts/verify-lock-contract.mjs`, `scripts/production-smoke.mjs` y `scripts/production-certification.mjs` formalizan este proceso.

## 1. Principios Fundamentales

Toda interacción, endpoint y componente en Isabella opera bajo cuatro pilares irrenunciables:

1. **Soberanía humana:** La inferencia propone hipótesis y cálculos; la autoridad y ejecución final reside siempre en el humano.
2. **Gobernanza Zero Trust (C.R.O.W.N.):** Ninguna herramienta, skill o recurso sensible se ejecuta sin una evaluación explícita de política y contexto de identidad.
3. **Soberanía territorial:** El contexto local, cultural y geográfico del territorio (Nodo Cero / Real del Monte) prevalece sobre la abstracción genérica de modelos centralizados.
4. **Trazabilidad auditable (BookPI):** Toda acción, decisión relevante y evento económico queda sellado en un libro mayor criptográfico inmutable antes de considerarse completado.

---

## 2. Arquitectura del Sistema

### 2.1 Los Tres Planos

```text
┌──────────────────────────────────────────────────────────────┐
│                    PLANO DE EXPERIENCIA                      │
│     Web UI, Chat Stream, Paneles Territoriales, Atlas, APIs  │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                      PLANO COGNITIVO                         │
│   ISA (Presencia) · SOPHIA (Epistemología) · ORION (Acción)  │
│      GraphRAG · Memoria Pentacapa · Fallback Multimodelo     │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                      PLANO SOBERANO                          │
│     CROWN (Gobernanza) · ARGUS (Seguridad & Veto)            │
│     BookPI (Ledger PostgreSQL) · HSM/KMS · RLS Postgres      │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Los Cinco Nodos Cognitivos

- **CROWN Gateway:** Orquestación, ruteo, arbitraje central de políticas y evaluación Zero Trust.
- **ISA Core:** Presencia empática, tonalidad humana y modulación contextual de salida.
- **SOPHIA Engine:** Análisis epistemológico, síntesis de evidencia (E0-E4) y verificación lógica.
- **ORION Engine:** Ejecución de herramientas, generación técnica y soporte operativo.
- **ARGUS Sentinel:** Vigilancia continua, validación de identidad, prevención de inyección y veto vinculante.

---

## 3. Chat-to-Skill Stream Bridge (`@skill`)

El ecosistema integra un **puente de streaming endurecido** (`src/lib/skills/chat-bridge.ts`) que conecta directamente las invocaciones de habilidades en el chat stream con el runtime canónico `runIsabellaSkill()`.

### 3.1 Sintaxis de Invocación
Los usuarios u operadores pueden invocar habilidades soberanas mediante:
- `@skill:<nombre> [parámetros|json]` (ej. `@skill:hepta balance territorial`)
- `@skill <nombre> [parámetros|json]` (ej. `@skill gaia {"region": "hidalgo", "metric": "water"}`)
- `@<nombre> [parámetros|json]` (ej. `@sophia investigar archivos mineros del siglo XIX`)

### 3.2 Pipeline de Ejecución Endurecido
Cada invocación atraviesa obligatoriamente el siguiente flujo:

```text
Mensaje de chat con @skill
            ↓
  detectSkillInvocation()
            ↓
  Validación de Identidad & Auth (actorId, tenantId, role, authenticated)
            ↓
  Validación de Esquema de Entrada (Zod)
            ↓
  Evaluación de Política CROWN (Zero Trust Gate)
            ├── DENY  → Respuesta 403 Gobernanza con código y trazabilidad
            └── ALLOW
                  ↓
  Ejecución en Runtime Aislado (skill.run)
            ↓
  Validación de Esquema de Salida (Zod)
            ↓
  Sellado de Evidencia en BookPI (PostgreSQL Ledger inmutable)
            ↓
  Streaming SSE en Tiempo Real (OpenAI/Gemini-compatible chunks + [DONE])
```

---

## 4. Arquitectura de Persistencia BookPI

Para garantizar la integridad financiera y evitar derivas entre entornos de pruebas y producción, la arquitectura desacopla estrictamente los componentes:

### 4.1 Autoridad Financiera Canónica (Producción)
- **`src/lib/repositories/bookpi-postgres-repository.ts`**:
  - **Única autoridad financiera** válida para producción, facturación real, Marketplace y liquidación.
  - Persistencia durable en PostgreSQL con aislamiento RLS por tenant.
  - Cadena criptográfica append-only: cada bloque enlaza con el hash SHA-256 canónico del bloque anterior (`canonicalBookPiPayload`).
  - Firma digital criptográfica de cada bloque mediante algoritmo verificado (`bookpi-signer`).
  - Reembolsos registrados exclusivamente como bloques de contrapartida (los bloques asentados son estrictamente inmutables).
  - Rechazo en tiempo de ejecución de adaptadores efímeros si `NODE_ENV === "production"` o si se declara `ISABELLA_STORAGE_PROVIDER=postgres|neon`.

### 4.2 Adaptadores Aislados de Test / Desarrollo
- **`src/lib/bookpi-dev-adapter.ts`** y **`src/lib/repositories/bookpi-dev-repository.ts`**:
  - Estrictamente limitados a pruebas unitarias en memoria/disco local (`isabella_bookpi_ledger.json`).
  - **Removidos completamente de las rutas financieras de producción** (`api/billing`, `api/db`, `skills/run-skill`, etc.).
  - Lanzan excepciones de protección si se intenta inicializarlos en entornos productivos.

### 4.3 Tipos Canónicos Compartidos
- **`src/lib/bookpi/types.ts`**:
  - Define las interfaces fundamentales (`BlockPIBlock`, `BookPIStoreFile`, `LedgerCategory`, `LedgerStatus`) consumidas uniformemente por el repositorio PostgreSQL y los adaptadores de pruebas.

---

## 5. Ecosistema de Habilidades Soberanas (Skills)

El registro unificado (`src/lib/skills/registry.ts`) consolida las capacidades fusionadas del ecosistema:

| Paquete | Habilidades Integradas | Propósito |
|---|---|---|
| **Core Pack** | `ORION`, `SOPHIA`, `ARGUS`, `HERMES`, `ATLAS`, `ANUBIS`, `GEMET` | Inferencia, investigación epistemológica, seguridad perimetral, ruteo y telemetría. |
| **Territorial Pack** | `AURORA`, `GAIA`, `NODO_CERO`, `PHAROS` | Monitoreo ambiental, modelado territorial, identidad minero-cultural de Real del Monte. |
| **Infrastructure Pack** | `CITEMESH`, `HEPHAESTUS` | Topología de red soberana, compilación de artefactos y auto-reparación. |
| **Archive & Memory Pack** | `MNEMOSYNE`, `CHRONOS`, `PROMETEO` | Memoria histórica inmutable, recuperación temporal y preservación de patrimonio. |
| **Ethics & Sovereignty Pack** | `VIGIA`, `LYRA`, `EIRENE`, `THEMIS`, `SENTINEL` | Gobernanza ética, desescalamiento de conflictos, justicia algorítmica y contramedidas. |
| **Economy Pack** | `HELIOS`, `KAIROS` | Asignación de recursos, gestión de balances y liquidación de cuotas. |
| **Education Pack** | `UTAMV` | Capacitación contextual, pedagogía soberana y certificación descentralizada. |
| **Especializado** | `HEPTA` | Diagnóstico multidimensional, síntesis territorial y balances de siete capas. |
| **Evolved Pack** | Habilidades nativas compiladas | Optimización federada, compresión semántica y transformadores nativos de baja latencia. |
| **OsoPanda1 Ecosystem** | Capacidades fusionadas de repositorios | Agentes de visión territorial, motores de síntesis audiovisual e interoperabilidad de nodos. |

---

## 6. Epistemología y Manejo de Incertidumbre

Isabella no enmascara la ignorancia con alucinaciones ni asume certeza sin fundamento. Las respuestas se estructuran con niveles epistémicos explícitos:

- **E0 (Evidencia Suficiente):** Respaldado por fuentes primarias, registros territoriales o bloques verificados.
- **E1 (Hipótesis):** Deducción lógica plausible sujeta a validación empírica.
- **E2 (Incertidumbre):** Falta de datos en memoria o contexto insuficiente; se declara explícitamente.
- **E3 (Conflicto):** Fuentes contradictorias detectadas; se expone la divergencia sin forzar consenso artificial.
- **E4 (Acción Requerida):** Decisión crítica o de alto riesgo que detiene el flujo para aprobación humana.

---

## 7. Quantum Utility Platform (QUP)

- Ubicación: `quantum_utility_platform/`, `scripts/quantum/`, `src/lib/quantum-bridge-client.ts`.
- **Política de honestidad cuántica:**
  - El sistema distingue explícitamente entre ejecución clásica, simulación cuántica y algoritmos híbridos.
  - Cuando no existe hardware cuántico físico disponible, el bridge aplica un `CLASSICAL_FALLBACK` transparente con etiqueta de degradación.
  - No se anuncian ventajas cuánticas sin evidencia benchmarkeada reproducible contra líneas base clásicas.

---

## 8. Verificación, Testing y Despliegue

### Comandos de Validación Local
```bash
# Verificación de tipos TypeScript estricto
npm run typecheck

# Validación de código y calidad
npm run lint

# Ejecución de la suite completa de pruebas unitarias y de integración
npm test

# Compilación de producción
npm run build
```

### Resultados de la Suite Actual
- **Tests unitarios y funcionales:** 501 tests ejecutados con éxito.
- **Pruebas de integridad BookPI:** Cadenas de hashes SHA-256, inmutabilidad y firmas verificadas.
- **Pruebas de aislamiento de tenant:** Verificación de barreras de datos cruzados entre tenants en memoria y PostgreSQL.
- **Pruebas de gobernanza CROWN:** Denegaciones automáticas ante violaciones de roles, scopes o políticas.

---

## 9. Autoría y Licencia

- **Arquitectura y Dirección Técnica:** Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
- **Nodo de Emisión:** Nodo Cero, Real del Monte, Hidalgo, México.
- **Ecosistema:** TAMV ONLINE NETWORK / RDM Digital Hub
- **ORCID:** [0009-0008-5050-1539](https://orcid.org/0009-0008-5050-1539)
- **Licencia:** Creative Commons Attribution 4.0 International ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/))

---

*Isabella Villaseñor AI™ es soberanía cognitiva construida desde el territorio y gobernada por humanos.*
