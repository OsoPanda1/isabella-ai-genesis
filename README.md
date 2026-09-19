# Isabella Villaseñor AI

## Infraestructura cognitiva híbrida, contextual y gobernada

**Repositorio:** `OsoPanda1/isabella-ai-genesis`  
**Arquitectura:** Isabella Villaseñor AI / Ecosistema TAMV ONLINE NETWORK  
**Autoría técnica y arquitectura:** Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)  
**Ecosistema:** TAMV ONLINE NETWORK · RDM Digital Hub · Nodo Cero · Real del Monte, Hidalgo, México  
**Versión del paquete:** `4.3.3`  
**Package manager:** pnpm `10.15.4`  
**Node soportado:** `>=22 <25`  
**Despliegue objetivo:** Vercel / Nitro / TanStack Start  
**Fuente de verdad:** GitHub `main`

> **Estado de certificación:** este README describe la arquitectura y los mecanismos de validación del repositorio. Los resultados de producción solo se consideran certificados cuando existen evidencias generadas por los gates y por el proveedor de despliegue. Este documento no convierte una capacidad implementada en una afirmación de producción.

---

## 1. Qué es Isabella

Isabella Villaseñor AI es una **arquitectura cognitiva híbrida, contextual, territorial y gobernada**. El proyecto coordina memoria, interpretación, gobernanza, herramientas, persistencia, identidad y trazabilidad dentro de un marco de soberanía humana.

No se define como un único modelo de lenguaje ni como un chatbot monolítico. Su arquitectura separa responsabilidades cognitivas y de gobierno para que una respuesta, una herramienta o una operación sensible pueda someterse a políticas explícitas, autorización y auditoría.

### Principios

1. **Soberanía humana:** las operaciones relevantes conservan aprobación y control humano.
2. **Zero Trust:** identidad, tenant, permisos, herramientas y recursos se validan explícitamente.
3. **Contexto territorial:** el conocimiento contextual puede incorporar territorio, patrimonio y memoria local bajo reglas de privacidad.
4. **Trazabilidad:** las operaciones relevantes deben generar evidencia auditable.
5. **Fail-closed:** configuraciones críticas ausentes o inválidas deben impedir operaciones sensibles.
6. **No falsa certeza:** incertidumbre y límites deben permanecer visibles.

---

## 2. Arquitectura cognitiva

La especificación maestra organiza Isabella en cinco nodos funcionales:

| Nodo | Responsabilidad |
|---|---|
| **CROWN** | Orquestación, ruteo, arbitraje y control de estado |
| **ISA** | Presencia, tono, empatía y modulación expresiva |
| **SOPHIA** | Epistemología, razonamiento, síntesis y análisis |
| **ORION** | Ejecución de tareas operativas, creativas y técnicas |
| **ARGUS** | Gobernanza, defensa, verificación y veto |

La autoridad está separada: los nodos cognitivos pueden proponer y procesar; las políticas determinan qué puede ejecutarse.

---

## 3. Pipeline operativo

El flujo canónico definido por la arquitectura es:

```text
Perceive
   ↓
Remember
   ↓
Policy Gate
   ↓
Decide
   ↓
Act
   ↓
Audit
```

### Perceive
Normaliza la entrada, sanitiza datos y genera contexto de correlación.

### Remember
Recupera únicamente memoria disponible para el scope y autoridad actuales.

### Policy Gate
ARGUS evalúa riesgo y restricciones. Los estados conceptuales son:

- `allowed`
- `requires_approval`
- `denied`

### Decide
CROWN determina el plan y la combinación de capacidades.

### Act
Solo se ejecutan herramientas y operaciones autorizadas.

### Audit
Las operaciones relevantes generan registros de decisión y evidencia.

---

## 4. Memoria

La arquitectura define cinco scopes:

- **Immediate**
- **Session**
- **Project**
- **Territorial**
- **Historical**

La memoria debe conservar procedencia, confianza, vigencia y fuente cuando estos metadatos existan. Los secretos y datos personales innecesarios no deben convertirse en memoria persistente.

---

## 5. Seguridad, identidad y multi-tenancy

La implementación incluye una capa de seguridad que integra identidad, contexto de tenant, autorización y políticas.

### Contratos fundamentales

- configuración centralizada;
- identidad server-side;
- tenant derivado de identidad;
- RBAC/ABAC y matriz de permisos;
- CROWN/constitutional gate;
- validación de entradas;
- rate limiting;
- auditoría;
- protección contra inyección;
- separación entre datos de usuario, sistema y telemetría.

### JWT y RLS

El proyecto mantiene dos responsabilidades que no deben confundirse:

- **JWT soberano de aplicación:** autenticación/autorización interna.
- **JWT de Supabase RLS:** token firmado con el secreto compatible con PostgREST para transportar claims de tenant y scope hacia las políticas RLS.

La generación de tokens debe permanecer en la capa de seguridad; los adaptadores de persistencia no deben inventar mecanismos alternativos de autorización.

En producción, la ausencia de secretos críticos debe provocar fallo cerrado.

---

## 6. Persistencia y Sovereign Engine

El Sovereign Engine coordina estado cognitivo y persistencia.

El diseño diferencia:

- memoria de ejecución;
- persistencia durable;
- adaptadores de proveedor;
- repositorios;
- PostgreSQL/Supabase como fuente durable prevista para producción;
- JSON local únicamente bajo una política explícita y no como mecanismo silencioso de persistencia productiva.

Esto evita que un fallback de desarrollo se convierta accidentalmente en una fuente de verdad de producción.

---

## 7. BookPI

BookPI representa la capa de trazabilidad contable y de integridad de eventos del sistema.

La arquitectura del repositorio contempla:

- registros append-only;
- aislamiento por tenant;
- cadena criptográfica;
- evidencia de integridad;
- contabilidad de doble partida donde corresponda;
- repositorios específicos;
- auditoría separada de la lógica de aplicación.

La existencia de estos componentes no implica por sí sola que una prueba de integridad o una operación contable esté certificada. La certificación requiere ejecución y evidencia.

---

## 8. NCUA y pruebas de carga

El repositorio incorpora comandos específicos para NCUA:

```bash
pnpm ncua:benchmark
pnpm ncua:load
```

Estos mecanismos están destinados a medir comportamiento bajo concurrencia y a producir evidencia sobre latencia, transferencia, estabilidad del índice ERI y consistencia de operaciones.

**Importante:** la presencia de los scripts no equivale a una prueba ejecutada. Los resultados deben conservarse como evidencia con commit, configuración, dataset, concurrencia y métricas.

---

## 9. Contrato de producción

El proyecto contiene gates separados para diferentes clases de riesgo.

### Integridad

```bash
pnpm production:integrity
```

Comprueba patrones prohibidos de telemetría sintética, stubs, evidencia placeholder y requisitos críticos del boundary de producción.

### Preflight

```bash
pnpm production:preflight
```

Comprueba archivos críticos, contrato de paquetes, runtime, Vercel, rutas, gateway de Isabella, gobernanza de IA, persistencia y migraciones.

### Evidence

```bash
pnpm production:evidence
```

Genera artefactos de evidencia sin convertir resultados no ejecutados en falsos PASS.

### Gate completo

```bash
pnpm production:gate
```

Encadena:

```text
typecheck
  → lint
  → test
  → build
  → production:integrity
  → production:preflight
  → capabilities
  → audit:routes
```

---

## 10. Desarrollo y validación

Instalación reproducible:

```bash
pnpm install --frozen-lockfile
```

Validación base:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Seguridad:

```bash
pnpm security:scan
```

Base de datos:

```bash
pnpm db:migrate
pnpm db:verify
```

Auditoría de rutas:

```bash
pnpm audit:routes
```

---

## 11. Dependencias y reproducibilidad

El contrato actual del repositorio es:

```json
{
  "packageManager": "pnpm@10.15.4",
  "engines": {
    "node": ">=22 <25"
  }
}
```

La regla operativa es que `package.json`, `pnpm-lock.yaml`, CI y Vercel deben representar el mismo contrato.

Un error de resolución de dependencias durante instalación impide considerar el build de producción certificado.

---

## 12. CI/CD

Los workflows se dividen por responsabilidad:

- CI / gate de calidad;
- security scanning;
- release;
- validaciones de producción.

Las ramas de reparación deben pasar por gates antes de fusionarse con `main`.

La historia publicada no debe reescribirse mediante force-push, rebase o amend sobre commits remotos existentes.

---

## 13. Vercel

El proyecto está diseñado para desplegarse mediante Vercel y generar el runtime Nitro correspondiente.

La secuencia recomendada para un artefacto validado es:

```text
GitHub
  ↓
Install reproducible
  ↓
Typecheck / lint / tests
  ↓
Build
  ↓
Integrity / preflight
  ↓
Preview
  ↓
Smoke / E2E
  ↓
Production
  ↓
Runtime verification
```

Un deployment `READY` es necesario pero no suficiente para una certificación completa: también deben existir verificaciones posteriores al despliegue.

---

## 14. Evidence-first production

La producción se considera certificable únicamente cuando existe evidencia reproducible.

El paquete de evidencia debe poder responder:

- ¿qué commit fue evaluado?
- ¿qué versión de Node y pnpm se utilizó?
- ¿qué lockfile se utilizó?
- ¿qué gates pasaron?
- ¿qué pruebas se ejecutaron?
- ¿qué métricas NCUA se obtuvieron?
- ¿qué estado tuvo BookPI?
- ¿qué entorno de base de datos fue validado?
- ¿qué deployment de Vercel se generó?
- ¿qué smoke test se ejecutó?
- ¿qué errores aparecieron después del deployment?
- ¿existe rollback verificable?

El sistema de evidencia existente evita marcar como PASS comprobaciones que no fueron ejecutadas.

---

## 15. Checklist canónico de liberación

La rama no debe fusionarse a `main` hasta obtener:

```text
Git conflicts       = 0
typecheck            = PASS
lint                 = PASS
tests                = PASS
build                = PASS
security scan        = PASS
production integrity = PASS
production preflight = PASS
route audit          = PASS
Vercel build         = PASS
runtime smoke        = PASS
```

Para una certificación más completa deben agregarse:

```text
BookPI integrity     = PASS
tenant isolation     = PASS
NCUA load             = PASS
database verification = PASS
rollback verification = PASS
production evidence  = COMPLETE
```

**No se utilizará un porcentaje inventado para sustituir estas evidencias.**

---

## 16. Estructura de autoridad

Los módulos de autoridad definidos por la especificación incluyen:

```text
src/server.ts
src/lib/config.ts
src/lib/env-schema.ts
src/lib/principal-context.ts
src/lib/tenant-guard.ts
src/lib/tenant-context.ts
src/lib/authorization.ts
src/lib/rbac.ts
src/lib/abac.ts
src/lib/permission-matrix.ts
src/lib/crown.ts
src/lib/constitutional-gate.ts
src/lib/sovereign-engine.ts
src/lib/sovereign-pipeline.ts
src/lib/memory-engine.ts
src/lib/repositories/memory-repository.ts
src/lib/bookpi*.ts
src/lib/repositories/bookpi-repository.ts
src/lib/repositories/audit-repository.ts
src/lib/tool-registry.ts
src/lib/orion-engine.ts
src/lib/sovereign-sandbox.ts
supabase/migrations/*
src/routes/api/*
```

Los handlers de API deben permanecer delgados y delegar autoridad a estas capas.

---

## 17. Principios de contribución

Antes de modificar una pieza crítica:

1. identifica la autoridad existente;
2. evita crear una segunda implementación paralela;
3. añade o actualiza pruebas;
4. valida tipos;
5. valida seguridad si corresponde;
6. verifica migraciones si afecta persistencia;
7. genera evidencia cuando el cambio afecte producción.

No se deben introducir secretos, tokens, dumps ni credenciales en Git.

---

## 18. Estado de esta rama

Esta rama corresponde a una **reparación de integración y endurecimiento de producción**.

No debe interpretarse este README como una declaración de que todos los gates ya pasaron. Los estados deben proceder de:

- GitHub Actions;
- pruebas reproducibles;
- artefactos de evidencia;
- validación de base de datos;
- deployment de Vercel;
- smoke/E2E posterior al deployment.

La regla es simple:

> **La arquitectura se documenta. La funcionalidad se prueba. La producción se demuestra.**

---

## 19. Licenciamiento y atribución

La especificación arquitectónica del proyecto declara Creative Commons Attribution 4.0 International (CC BY 4.0) para el material al que dicha licencia resulte aplicable. Los componentes de terceros conservan sus respectivas licencias.

La atribución técnica y arquitectónica declarada para este proyecto es:

**Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)**  
**TAMV ONLINE NETWORK · RDM Digital Hub · Nodo Cero**  
**Real del Monte, Hidalgo, México**

---

## 20. Regla final

Isabella no se considera lista porque una interfaz se vea terminada.

Se considera lista cuando:

```text
el código compila
+ las políticas gobiernan
+ la identidad se verifica
+ los tenants permanecen aislados
+ la persistencia es durable
+ BookPI conserva integridad
+ las pruebas reproducen el comportamiento
+ la carga demuestra estabilidad
+ CI reproduce el resultado
+ Vercel despliega el mismo artefacto
+ runtime confirma el comportamiento
+ existe evidencia auditable
```

**No te pedimos que nos creas. Te pedimos que lo pruebes.**
