# Isabella Villaseñor AI — API Soberana de Producción Empresarial
## ISA-API / AEGIS-X Hardened Reference Architecture

**Versión:** 50.0.0
**Estado:** Governing reference implementation
**Propósito:** referencia operativa para una API de IA multi-tenant, segura, observable y gobernada.

> Este documento es una arquitectura de referencia. No declara que una capacidad esté implementada solo porque aparezca aquí. Cada capacidad debe tener evidencia verificable en código, infraestructura, pruebas y producción.

---

## 1. Alcance y límites

Isabella es una plataforma de IA y automatización orientada a producción que integra:

- APIs de modelos de lenguaje, visión, audio y embeddings.
- Moderación, detección de amenazas y validación de entradas y salidas.
- Skills cognitivas y herramientas controladas.
- Multi-tenancy, identidad, autorización y cuotas.
- Auditoría de decisiones y eventos de negocio.
- Observabilidad, telemetría y respuesta a incidentes.
- CI/CD, contratos ejecutables y gobernanza de cambios.

El sistema no puede asumir que un proveedor externo, un modelo, el cliente o un prompt sean una fuente de verdad. Los modelos producen señales o resultados; identidad, tenant, economía, permisos y políticas deben resolverse mediante servicios internos verificables.

---

## 2. Fuente única de verdad

### 2.1 Contratos ejecutables

La fuente canónica de cada endpoint es el esquema runtime desplegado junto con el código. OpenAPI, SDKs, documentación, fixtures y ejemplos son artefactos derivados.

Reglas obligatorias:

1. Toda entrada se valida en runtime.
2. Toda salida se valida antes de responder.
3. OpenAPI y SDKs se generan desde los contratos ejecutables.
4. CI calcula `schema_hash` y bloquea artefactos desactualizados.
5. Ningún documento derivado puede otorgar autorización.
6. Ninguna ruta puede implementar un contrato distinto al registrado.

### 2.2 Arquitectura canónica

```text
CLIENTE
  ↓
EDGE / WAF / RATE LIMIT
  ↓
CORRELACIÓN Y NORMALIZACIÓN
  ↓
IDENTIDAD Y AUTENTICACIÓN
  ↓
RESOLUCIÓN DE TENANT
  ↓
VALIDACIÓN DE ENTRADA
  ↓
PEP → PDP C.R.O.W.N./A.R.G.U.S.
  ↓
CAPABILIDADES, CUOTAS Y POLÍTICAS
  ↓
SERVICIO DE DOMINIO
  ↓
PROVEEDOR DE IA / TOOL / SANDBOX
  ↓
VALIDACIÓN DE SALIDA Y REDACCIÓN
  ↓
AUDITORÍA TRANSACCIONAL / OUTBOX
  ↓
RESPUESTA ISA-API
```

No se permiten rutas paralelas productivas basadas en JSON, SQLite, mocks, JWT propio no canónico, clientes administrativos sin justificación o repositorios duplicados.

---

## 3. Modelo de confianza

### 3.1 Zero Trust

- Cada request se autentica.
- Cada identidad se valida contra un emisor permitido.
- Cada tenant se resuelve desde identidad y fuente interna.
- Cada acción consulta autorización.
- Cada herramienta se ejecuta con permisos mínimos.
- Cada salida pasa por validación y filtrado.
- Cada mutación genera evidencia durable.
- Cada secreto se obtiene desde un gestor autorizado.

### 3.2 Datos no confiables

Tratar como no confiables:

- `tenant_id` enviado por el cliente.
- Roles y scopes enviados en el body.
- Precios, balances, cuotas o puntuaciones de riesgo del cliente.
- Salidas de modelos y proveedores externos.
- Contenido recuperado de documentos o páginas web.
- Tool calls propuestos por un modelo.
- Headers de correlación no válidos.
- Mensajes que intenten modificar instrucciones del sistema.

### 3.3 Fuentes de verdad

| Dato | Fuente autorizada |
|---|---|
| Identidad | Identity Provider / Supabase Auth u OIDC aprobado |
| Tenant | Tenant Service / Postgres |
| Roles | Entitlement Service |
| Scopes | Credential Service |
| Política | C.R.O.W.N./A.R.G.U.S. |
| Cuota y economía | Economy/BookPI Service |
| Riesgo | Risk Service interno |
| Auditoría | Audit Service / BookPI |
| Estado de despliegue | CI/CD y plataforma |

---

## 4. Identidad y autenticación

### 4.1 Autoridad canónica

Debe elegirse un único camino productivo:

```text
Supabase Auth / OIDC
  ↓
Validación de issuer, audience, firma, exp, nbf y jti
  ↓
Identity Mapping
  ↓
PrincipalContext
```

El OAuth manual solo puede existir en desarrollo y debe estar aislado por configuración, rutas y credenciales. Nunca debe habilitarse en producción.

### 4.2 JWT

Claims mínimos:

```json
{
  "iss": "https://identity.example.com",
  "aud": "isabella-api",
  "sub": "user_uuid",
  "tenant_id": "tenant_uuid",
  "jti": "token_uuid",
  "iat": 1788520000,
  "nbf": 1788520000,
  "exp": 1788523600,
  "amr": ["pwd", "mfa"],
  "acr": "urn:isabella:loa:2"
}
```

Validaciones obligatorias:

- Algoritmo permitido mediante allowlist; nunca aceptar `none`.
- `iss` exacto.
- `aud` exacto.
- Firma mediante JWKS confiable.
- `exp`, `nbf` e `iat` con tolerancia de reloj limitada.
- `sub`, `tenant_id` y `jti` presentes y con formato válido.
- `jti` no revocado.
- Sesión activa en el repositorio canónico.
- Tenant del token coincidente con el tenant resuelto.
- Claims críticos no modificables por el cliente.

### 4.3 Sesiones y replay

La tabla `sessions` debe almacenar `token_jti`, no el JWT completo.

Validación:

```text
verify signature
→ verify issuer/audience/time claims
→ extract jti
→ find session by token_jti
→ is_active = true
→ expires_at > now()
→ tenant matches
→ principal created
```

Capacidades obligatorias:

- Revocar una sesión.
- Revocar todas las sesiones de un usuario.
- Revocar todas las sesiones de un tenant en emergencia.
- Rotar refresh tokens.
- Detectar reuse de refresh token.
- Invalidar caches tras revocación.
- Auditar login, logout, refresh, revoke y reuse.

### 4.4 API keys

Las API keys deben almacenarse solo como hash fuerte; nunca guardar el secreto en claro.

Estructura mínima:

```text
id
tenant_id
prefix
secret_hash
role
scopes
created_at
expires_at
last_used_at
revoked_at
created_by
```

Reglas:

- `prefix` es la única columna canónica para búsqueda previa.
- La comparación del secreto debe ser constante en tiempo.
- La clave se muestra una sola vez.
- La emisión exige `requested_role <= issuer_role`.
- `requested_scopes ⊆ issuer_scopes`.
- `tenant_id` se toma del principal, no del body.
- TTL sujeto a política.
- Rotación genera una nueva clave y revoca la anterior.
- Toda creación, lectura de metadata, rotación y revocación se audita.

### 4.5 mTLS y workload identity

Para servicios internos:

- mTLS obligatorio cuando el canal lo permita.
- Certificados emitidos por una CA privada administrada.
- Validar identidad de cliente y servidor.
- Rotación automática antes de expiración.
- Revocación y bloqueo de certificados comprometidos.
- No usar certificados compartidos entre servicios.

---

## 5. Autorización centralizada

### 5.1 PDP y PEP

- **PDP:** C.R.O.W.N./A.R.G.U.S. decide.
- **PEP:** API Gateway y servicios aplican la decisión.
- **Domain Service:** nunca debe confiar únicamente en una comprobación realizada en una ruta anterior.

Toda mutación debe verificar autorización en el límite del dominio.

### 5.2 Decisión canónica

```python
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Literal

class AuthorizationDecision(BaseModel):
    model_config = ConfigDict(extra="forbid")

    decision_id: str
    tenant_id: str
    subject_id: str
    action: str
    resource: str
    effect: Literal["allow", "deny"]
    policy_id: str
    policy_version: str
    obligations: list[str] = Field(default_factory=list)
    issued_at: datetime
    expires_at: datetime
    key_id: str
    signature: str
```

La decisión nunca puede ser `allow` por defecto. La política base es deny-by-default.

### 5.3 Permisos efectivos

```text
effective_permissions =
  role_permissions
  ∩ credential_scopes
  ∩ tenant_policy
  ∩ capability_entitlements
  ∩ resource_policy
  ∩ contextual_policy
```

### 5.4 Cache

Solo cachear decisiones con:

- Clave compuesta por tenant, subject, action, resource, policy version y contexto relevante.
- TTL corto.
- Firma verificable.
- Invalidación por revocación, cambio de política, suspensión de tenant o cambio de entitlements.
- No cachear permisos de alto riesgo sin aprobación explícita.
- Nunca permitir que el cliente escriba directamente en la cache.

Si la firma de cache falla, se invalida la entrada, se alerta y se consulta el PDP. Nunca se usa una entrada inválida como fallback.

---

## 6. Pipeline ISA-API

### 6.1 Etapas obligatorias

1. Normalización.
2. Correlación.
3. Autenticación.
4. Resolución de tenant.
5. Validación de esquema de entrada.
6. Evaluación PDP.
7. Capacidades, cuotas y obligaciones.
8. Idempotencia.
9. Operación de dominio.
10. Llamada a proveedor IA/tool/sandbox.
11. Validación de salida.
12. Redacción y clasificación de datos.
13. Auditoría y outbox.
14. Respuesta.

### 6.2 Fail closed

Si falla cualquiera de estas capacidades, se deniega la operación sensible:

- Identidad.
- Tenant.
- PDP.
- Entitlements.
- Cuota.
- Validación de entrada.
- Validación de salida.
- Auditoría requerida.
- Firma o verificación de decisión.

Las lecturas de bajo riesgo pueden usar una política degradada previamente aprobada. Las mutaciones, operaciones económicas, cambios de permisos y acceso a PII deben fallar cerrado.

### 6.3 Idempotencia

Las mutaciones requieren `Idempotency-Key`.

La clave se enlaza a:

```text
tenant_id + subject_id + endpoint + request_hash
```

Si la misma clave llega con un payload distinto, responder `ISB_IDEMPOTENCY_CONFLICT`. La respuesta original debe persistirse de forma durable, no en memoria del proceso.

---

## 7. APIs de IA y gobernanza de proveedores

### 7.1 Capacidades

El gateway de IA puede integrar:

- Generación de texto.
- Streaming.
- Tool calling.
- Embeddings.
- Reranking.
- Visión.
- Audio y transcripción.
- Moderación.
- Clasificación.
- Evaluación.
- Fine-tuning cuando aplique.

Cada proveedor debe tener un adaptador explícito y un contrato interno común. El dominio no debe acoplarse a una respuesta específica de proveedor.

### 7.2 AI Gateway interno

El gateway debe centralizar:

- Selección y routing de modelos.
- Credenciales de proveedores.
- Límites de gasto.
- Rate limits por tenant, usuario, skill y modelo.
- Timeouts.
- Retries con backoff y jitter.
- Circuit breakers.
- Redacción de PII antes de enviar datos.
- Identificador de proveedor y modelo.
- Coste estimado y tokens.
- Políticas de retención y entrenamiento.
- Evaluación de seguridad.

Las claves de proveedores nunca llegan al frontend ni a prompts.

### 7.3 Seguridad de prompts

Separar:

```text
system policy
developer instructions
skill instructions
retrieved context
user content
model output
```

El contenido recuperado y el contenido del usuario son datos, no instrucciones de autoridad. Aplicar protección contra:

- Prompt injection.
- Indirect prompt injection.
- Exfiltración de secretos.
- Tool hijacking.
- Jailbreaks.
- Data poisoning.
- Context overflow.
- Confused deputy.

Un modelo nunca puede decidir por sí solo:

- Rol.
- Tenant.
- Precio.
- Balance.
- Permiso.
- Aprobación humana.
- Revocación.
- Estado financiero.

### 7.4 Validación de entrada IA

Antes de llamar al modelo:

- Limitar tamaño de body y contexto.
- Validar MIME y encoding.
- Detectar contenido malformado.
- Clasificar sensibilidad.
- Redactar secretos y PII no necesaria.
- Validar URLs y documentos.
- Aplicar cuota y presupuesto.
- Aplicar política del tenant.
- Asignar `model_policy_id`.

### 7.5 Validación de salida IA

Después de llamar al modelo:

- Validar JSON contra esquema.
- Rechazar campos extra cuando el contrato lo exija.
- Verificar citas y fuentes cuando sean obligatorias.
- Detectar secretos, PII, malware y contenido prohibido.
- Ejecutar moderación independiente cuando el riesgo lo requiera.
- No ejecutar tool calls sin una segunda validación de autorización.
- No persistir respuestas sin clasificación de sensibilidad.

### 7.6 Fallback seguro

El fallback no debe significar `allow` ni saltarse controles. Un fallback puede:

- Degradar capacidad.
- Responder con información limitada.
- Usar modelo aprobado de menor riesgo.
- Usar reglas deterministas.
- Requerir revisión humana.
- Denegar la operación.

Cada fallback genera métrica, razón y auditoría.

---

## 8. Skills de Isabella

### 8.1 Registro de skills

Cada skill debe declarar:

```yaml
id: isabella.skill.example
version: 1.0.0
risk_level: low|medium|high|critical
required_scopes: []
required_capabilities: []
allowed_tools: []
input_schema: schema-id
output_schema: schema-id
max_execution_seconds: 30
human_approval_required: false
side_effects: none|read|write|financial|external
```

### 8.2 Skills principales

- `isabella.vercel_web_and_agent_stack`: Core Web Vitals, rendimiento, Agent Stack, arquitectura Vercel.
- `isabella.marketing_digital`: SEO, contenido, conversión, automatización y crecimiento.
- `isabella.isa_api_contract_authority`: contratos, versionado, OpenAPI, errores y gobernanza.
- `isabella.authorization_plane`: PDP/PEP, RBAC, ABAC, scopes, tenants y obligaciones.
- `isabella.security_aegis`: análisis de amenazas, detección, firewall adaptativo y safe fallback.
- `isabella.memory_governance`: memoria con consentimiento, propósito, sensibilidad, expiración y procedencia.
- `isabella.bookpi_ledger`: eventos append-only, hash chaining, refunds como eventos y verificación.
- `isabella.observability`: logs estructurados, métricas, tracing, SLOs y alertas.
- `isabella.release_governance`: gates de CI/CD, SBOM, SAST/DAST, migraciones y rollback.
- `isabella.rdm_self_audit`: auditoría continua de sesgos, contradicciones, fallas y deuda técnica.

### 8.3 Skill execution

Nunca ejecutar una skill por nombre recibido sin validar:

1. Skill registrada.
2. Versión permitida.
3. Tenant autorizado.
4. Scope suficiente.
5. Capabilities suficientes.
6. Input válido.
7. Herramientas permitidas.
8. Nivel de riesgo.
9. Requerimiento de aprobación humana.
10. Presupuesto y timeout.

---

## 9. Herramientas y Sandbox

Las herramientas deben tener:

- Nombre estable.
- Schema de entrada cerrado.
- Schema de salida cerrado.
- Permisos mínimos.
- Timeout.
- Límite de reintentos.
- Rate limit.
- Auditoría.
- Validación de destino.
- Protección contra SSRF.
- Protección contra path traversal.
- Protección contra command injection.

El código generado o no confiable debe ejecutarse en un sandbox aislado. Nunca debe recibir secretos globales ni acceso directo a la red interna. Los egress permitidos deben estar en allowlist.

---

## 10. Memoria y datos

### 10.1 Campos mínimos de memoria

```text
tenant_id
user_id
scope
sensitivity
purpose
consent
provenance
content_hash
content
embedding
created_at
expires_at
deleted_at
```

### 10.2 Reglas

- No guardar memoria sin propósito.
- No usar memoria fuera del propósito consentido.
- Separar memoria de usuario, tenant y sistema.
- Aplicar TTL y derecho de eliminación.
- Redactar PII cuando no sea necesaria.
- Registrar origen y transformación.
- No mezclar tenants en recuperación semántica.
- Validar filtros de tenant antes de búsqueda vectorial.
- No considerar embeddings como autorización.

---

## 11. BookPI y auditoría

### 11.1 Append-only

El ledger no debe actualizar eventos históricos. Un refund, reversal o adjustment es un evento nuevo:

```text
charge
refund
reversal
adjustment
settlement
```

El estado se deriva del stream.

### 11.2 Atomicidad

El append requiere:

- Transacción.
- Lock o contador por tenant.
- Constraint único `(tenant_id, sequence_number)`.
- Verificación de `previous_hash`.
- Hash determinista.
- Escritura durable.
- Auditoría del resultado.

### 11.3 Auditoría de mutaciones

Para operaciones críticas:

```text
authorize
→ begin transaction
→ mutate domain
→ append audit/outbox
→ commit
→ publish durable event
→ respond
```

Si la auditoría obligatoria no puede persistirse, la mutación no debe confirmarse.

### 11.4 Criptografía

- Usar primitivas estándar y librerías mantenidas.
- No inventar ML-DSA, HMAC o firmas simuladas.
- HMAC sirve para integridad compartida, no para no repudio.
- ECDSA/EdDSA o firma post-cuántica solo con implementación validada.
- La clave se identifica mediante `key_id`.
- Mantener claves antiguas durante el período de verificación.
- Rotar sin perder capacidad de verificar históricos.
- Proteger claves en KMS/HSM.

---

## 12. Protección contra filtraciones

### 12.1 Secretos

Nunca registrar:

- API keys.
- JWT completos.
- Refresh tokens.
- Contraseñas.
- Private keys.
- Cookies de sesión.
- Prompts privados.
- Datos de pago completos.

Aplicar redacción estructurada antes de logging. El logger debe tener allowlist de campos, no denylist improvisada.

### 12.2 PII

Clasificar datos en:

```text
public
internal
confidential
restricted
highly_restricted
```

Para `restricted` y `highly_restricted`:

- No enviar a proveedores sin base legal y política.
- Enmascarar en respuestas.
- Cifrar en reposo.
- Controlar acceso por necesidad de saber.
- Auditar cada acceso.
- Aplicar retención limitada.

### 12.3 Respuestas

Todas las respuestas ISA-API siguen:

```json
{
  "meta": {
    "request_id": "req_uuid",
    "trace_id": "trace_uuid",
    "decision_id": "dec_uuid",
    "api_version": "v1"
  },
  "data": {},
  "error": null
}
```

Errores públicos no incluyen stack trace, SQL, nombres internos, secretos, reglas privadas ni datos de otros tenants.

---

## 13. Observabilidad

### 13.1 Correlación

Propagar:

- `request_id`.
- `trace_id`.
- `span_id`.
- `tenant_id` pseudonimizado en métricas.
- `subject_id` pseudonimizado.
- `decision_id`.
- `policy_version`.
- `model_provider` y `model_id`.
- `skill_id` y `skill_version`.

### 13.2 Métricas

| Métrica | Tipo | Dimensiones |
|---|---|---|
| `isa_requests_total` | Counter | endpoint, status, method |
| `isa_request_latency_seconds` | Histogram | endpoint, outcome |
| `isa_authentication_failures_total` | Counter | reason, issuer |
| `isa_authorization_decisions_total` | Counter | action, effect, policy |
| `isa_policy_latency_seconds` | Histogram | policy, cache_hit |
| `isa_tenant_isolation_denials_total` | Counter | endpoint, reason |
| `isa_model_requests_total` | Counter | provider, model, outcome |
| `isa_model_latency_seconds` | Histogram | provider, model |
| `isa_model_tokens_total` | Counter | provider, model, direction |
| `isa_model_cost_estimate` | Counter | tenant, provider |
| `isa_fallback_total` | Counter | reason, target |
| `isa_tool_calls_total` | Counter | tool, outcome |
| `isa_output_validation_failures_total` | Counter | schema, reason |
| `isa_audit_write_failures_total` | Counter | event_type |
| `isa_ledger_integrity_failures_total` | Counter | tenant, region |
| `isa_secret_redaction_total` | Counter | detector, field_class |
| `isa_rate_limit_denials_total` | Counter | tenant, endpoint |

No incluir valores de alta cardinalidad sin control en labels. `tenant_id`, `subject_id`, URLs completas y prompts no deben entrar directamente en métricas globales.

### 13.3 Logs

```json
{
  "timestamp": "2026-09-05T06:00:00Z",
  "level": "info",
  "event": "authorization_completed",
  "request_id": "req_uuid",
  "trace_id": "trace_uuid",
  "decision_id": "dec_uuid",
  "tenant_ref": "tenant_hash",
  "subject_ref": "subject_hash",
  "action": "skill.execute",
  "resource": "isabella.security_aegis",
  "effect": "allow",
  "policy_version": "2026.09.05",
  "latency_ms": 4.2,
  "redaction_applied": true
}
```

### 13.4 SLOs

Los objetivos deben medirse, no asumirse:

- Disponibilidad por endpoint.
- p95/p99 de autenticación.
- p95/p99 del PDP.
- Tasa de errores 4xx y 5xx.
- Tasa de decisiones sin auditoría.
- Tasa de filtraciones detectadas.
- Tiempo de revocación.
- Tiempo de recuperación.
- Tasa de fallback.
- Coste por tenant.

Un SLO de latencia de 5 ms no debe declararse para una llamada remota a un PDP o ledger sin evidencia de entorno, percentil, carga y red. Establecer el objetivo después de benchmark reproducible.

---

## 14. Gestión de claves y secretos

### 14.1 Ciclo de vida

```text
generate
→ store in KMS/HSM
→ distribute by identity
→ use without export when possible
→ monitor
→ rotate
→ maintain verification grace period
→ revoke
→ destroy under policy
```

### 14.2 Rotación

Toda clave debe tener:

- `key_id`.
- Propósito.
- Algoritmo.
- Fecha de creación.
- Fecha de activación.
- Fecha de rotación.
- Estado: active, grace, deprecated, revoked, destroyed.
- Owner.
- Evidencia de prueba de recuperación.

La rotación debe probar:

- Firmar con clave nueva.
- Verificar con clave nueva.
- Verificar históricos con clave anterior.
- Propagar JWKS o metadata.
- Invalidar caches cuando corresponda.
- Revertir si la distribución falla.

Nunca generar claves efímeras en cada proceso si las firmas deben verificarse entre réplicas.

---

## 15. CI/CD y release gates

### 15.1 Gates obligatorios

Un release se bloquea si:

- Fallan tests.
- Hay discrepancia de schema hash.
- OpenAPI no fue regenerado.
- Hay dependencia vulnerable sin excepción aprobada.
- Falta SBOM.
- Falla SAST.
- Falla DAST requerido.
- Falla aislamiento de tenant.
- Falla prueba de escalada.
- Falta migración reversible.
- Falta evidencia de auditoría.
- Hay secretos en el diff.
- Se usa almacenamiento local en runtime productivo.
- Se detecta configuración permisiva de CORS.
- Se usa `service_role` fuera de operaciones internas justificadas.
- La política activa no está firmada.
- El rollback no está probado.

### 15.2 Pipeline

```text
lint
→ type check
→ unit tests
→ schema tests
→ contract tests
→ authz tests
→ tenant isolation tests
→ idempotency tests
→ dependency scan
→ secret scan
→ SAST
→ build
→ SBOM
→ integration staging
→ DAST
→ load tests
→ canary
→ SLO verification
→ production
```

### 15.3 Migraciones

Toda migración debe ser:

- Idempotente.
- Versionada.
- Probada con datos representativos.
- Reversible cuando sea posible.
- Compatible con el código anterior durante el rollout.
- Auditada.
- Ejecutable sin depender de archivos locales.

---

## 16. Gobernanza

### 16.1 Roles

| Rol | Autoridad |
|---|---|
| API Owner | Contratos y compatibilidad |
| Policy Owner | Políticas y decisiones |
| Security Owner | Controles y excepciones |
| Data Protection Owner | PII, retención y consentimiento |
| Domain Owner | Invariantes de negocio |
| SRE/Platform | Disponibilidad, despliegue y observabilidad |
| Incident Commander | Respuesta P0/P1 |
| Auditor | Evidencia independiente |

### 16.2 Cambios de alto riesgo

Requieren aprobación de dos personas distintas:

- Cambios de autorización.
- Cambios de identidad.
- Cambios de claves.
- Cambios de retención.
- Cambios de proveedor IA.
- Cambios de prompts de sistema.
- Cambios de herramientas con side effects.
- Cambios de BookPI.
- Cambios de acceso a PII.

### 16.3 Excepciones

Toda excepción debe registrar:

```yaml
exception_id: EXC-2026-0001
owner: security-owner
scope: endpoint-or-component
reason: documented-business-need
risk: low|medium|high|critical
controls: []
expires_at: 2026-10-01T00:00:00Z
review_date: 2026-09-15T00:00:00Z
rollback: documented
approval: two-person
```

No existen excepciones permanentes sin revisión.

---

## 17. Pruebas de seguridad

### 17.1 Identidad

- Token expirado.
- Token con issuer incorrecto.
- Token con audience incorrecta.
- Algoritmo `none`.
- Algoritmo no permitido.
- JTI reutilizado.
- Sesión revocada.
- Refresh token reuse.
- Tenant alterado.
- API key revocada.
- API key expirada.
- Scope superior al emisor.

### 17.2 Autorización

- Tenant A contra recurso de tenant B.
- Scope read contra write.
- Rol inferior intentando emitir rol superior.
- Capacidad ausente.
- Política no disponible.
- Cache manipulada.
- Obligación no aplicada.
- Decisión expirada.
- Decision replay.

### 17.3 IA

- Prompt injection directo e indirecto.
- Tool call no permitido.
- SSRF en herramienta HTTP.
- Exfiltración de secretos.
- Documento contaminado.
- Output JSON inválido.
- PII en salida.
- Denial of wallet.
- Context overflow.
- Proveedor comprometido o indisponible.

### 17.4 Datos y ledger

- Hash alterado.
- Secuencia duplicada.
- Refund que modifica original.
- Carrera concurrente.
- Consulta sin filtro de tenant.
- Memoria sin consentimiento.
- Eliminación incompleta.
- Retención vencida.
- Backup restaurado sin verificación.

---

## 18. Runbooks

### 18.1 PDP no disponible

1. Confirmar alcance mediante `request_id` y métricas.
2. Activar circuito de emergencia.
3. Denegar mutaciones y operaciones de alto riesgo.
4. Permitir solo lecturas aprobadas con decisión cacheada válida.
5. No crear nuevas decisiones `allow` localmente.
6. Notificar Policy Owner, Security Owner e Incident Commander.
7. Verificar integridad de políticas.
8. Restaurar gradualmente.
9. Ejecutar pruebas de autorización.
10. Documentar post-mortem.

### 18.2 Fuga de secretos o PII

1. Detener el sink afectado si es seguro hacerlo.
2. Revocar credenciales expuestas.
3. Rotar claves.
4. Identificar alcance por trazas y versiones.
5. Preservar evidencia sin copiar datos sensibles innecesariamente.
6. Aplicar purga conforme a política legal.
7. Notificar a seguridad y privacidad.
8. Corregir redacción y tests.
9. Desplegar canary.
10. Verificar que no quedan secretos en logs, respuestas, prompts o traces.

### 18.3 Compromiso de clave

1. Marcar clave como comprometida.
2. Revocar y bloquear uso.
3. Generar nueva clave en KMS/HSM.
4. Rotar credenciales dependientes.
5. Invalidar caches.
6. Verificar firmas históricas.
7. Identificar decisiones potencialmente afectadas.
8. Emitir informe de impacto.
9. Actualizar controles de acceso.
10. Ejecutar revisión independiente.

### 18.4 Corrupción de ledger

1. Pausar escrituras.
2. Aislar el segmento o réplica afectada.
3. No reescribir silenciosamente historia.
4. Comparar hashes y secuencias.
5. Seleccionar último punto válido.
6. Restaurar desde backup verificable.
7. Reprocesar outbox de forma idempotente.
8. Registrar cada acción de recuperación.
9. Reanudar con canary.
10. Obtener aprobación de auditoría.

---

## 19. Contrato de errores

Prefijos:

```text
ISB_AUTH_
ISB_TENANT_
ISB_POLICY_
ISB_CAPABILITY_
ISB_MEMORY_
ISB_TOOL_
ISB_MODEL_
ISB_ECONOMY_
ISB_AUDIT_
ISB_CONTRACT_
ISB_SYSTEM_
```

Ejemplo:

```json
{
  "meta": {
    "request_id": "req_uuid",
    "trace_id": "trace_uuid",
    "decision_id": null,
    "api_version": "v1"
  },
  "data": null,
  "error": {
    "code": "ISB_POLICY_UNAVAILABLE",
    "message": "La operación no está disponible en este momento.",
    "correlation_id": "req_uuid",
    "retryable": true,
    "details": {
      "retry_after_seconds": 30
    }
  }
}
```

`details` nunca debe contener secretos, reglas privadas, SQL, stack traces ni contenido del prompt.

---

## 20. OpenAPI base

```yaml
openapi: 3.1.0
info:
  title: Isabella AI Genesis API
  version: 1.0.0
  description: API contractual multi-tenant para servicios de IA y seguridad.

paths:
  /v1/analyze:
    post:
      operationId: analyze
      security:
        - bearerAuth: []
        - apiKeyAuth: []
      parameters:
        - $ref: '#/components/parameters/RequestId'
        - $ref: '#/components/parameters/TraceId'
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnalyzeRequest'
      responses:
        '200':
          description: Resultado validado.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AnalyzeResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '409':
          $ref: '#/components/responses/Conflict'
        '429':
          $ref: '#/components/responses/RateLimited'
        '500':
          $ref: '#/components/responses/InternalError'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    apiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key

  parameters:
    RequestId:
      name: X-Request-Id
      in: header
      required: false
      schema:
        type: string
        format: uuid
    TraceId:
      name: X-Trace-Id
      in: header
      required: false
      schema:
        type: string
    IdempotencyKey:
      name: Idempotency-Key
      in: header
      required: true
      schema:
        type: string
        minLength: 16
        maxLength: 128

  schemas:
    AnalyzeRequest:
      type: object
      additionalProperties: false
      required: [text]
      properties:
        text:
          type: string
          minLength: 1
          maxLength: 50000
        skill_id:
          type: string
          enum:
            - isabella.security_aegis
            - isabella.marketing_digital
            - isabella.vercel_web_and_agent_stack

    Meta:
      type: object
      additionalProperties: false
      required: [request_id, trace_id, api_version]
      properties:
        request_id:
          type: string
        trace_id:
          type: string
        decision_id:
          type: string
          nullable: true
        api_version:
          type: string

    Error:
      type: object
      additionalProperties: false
      required: [code, message, correlation_id, retryable]
      properties:
        code:
          type: string
        message:
          type: string
        correlation_id:
          type: string
        retryable:
          type: boolean
        details:
          type: object
          additionalProperties: true

    AnalyzeResponse:
      type: object
      additionalProperties: false
      required: [meta, data, error]
      properties:
        meta:
          $ref: '#/components/schemas/Meta'
        data:
          type: object
          nullable: true
          additionalProperties: true
        error:
          allOf:
            - $ref: '#/components/schemas/Error'
          nullable: true

  responses:
    BadRequest:
      description: Entrada inválida.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/AnalyzeResponse'
    Unauthorized:
      description: Autenticación fallida.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/AnalyzeResponse'
    Forbidden:
      description: Operación no autorizada.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/AnalyzeResponse'
    Conflict:
      description: Conflicto de idempotencia o estado.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/AnalyzeResponse'
    RateLimited:
      description: Límite excedido.
      headers:
        Retry-After:
          schema:
            type: integer
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/AnalyzeResponse'
    InternalError:
      description: Error interno seguro.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/AnalyzeResponse'
```

---

## 21. Configuración segura mínima

```yaml
environment: production
fail_closed: true
allow_development_oauth: false
allow_mock_identity: false
allow_local_persistence: false
allow_client_tenant_override: false
allow_unsigned_policy: false
allow_unverified_cache: false
allow_model_authorization: false
require_idempotency_for_mutations: true
require_audit_for_sensitive_operations: true
require_output_validation: true
require_secret_redaction: true
cors:
  allow_origins:
    - https://isabella-ai-genesis.vercel.app
  allow_credentials: true
  allow_methods: [GET, POST, PUT, PATCH, DELETE, OPTIONS]
security:
  jwt_algorithms: [RS256, ES256]
  clock_skew_seconds: 30
  access_token_max_seconds: 3600
  refresh_token_rotation: true
  refresh_token_reuse_detection: true
  api_key_secret_hash: argon2id
  tls_min_version: TLSv1.2
  mtls_internal: true
keys:
  provider: kms
  rotation_days: 90
  emergency_rotation_enabled: true
observability:
  redact_before_logging: true
  sample_success_traces: 0.1
  sample_denials: 1.0
  sample_security_failures: 1.0
```

---

## 22. Checklist de producción

### Identidad

- [ ] Existe una única autoridad productiva.
- [ ] Se validan issuer, audience, firma, exp, nbf, iat y jti.
- [ ] Las sesiones se buscan por `token_jti`.
- [ ] La revocación es durable.
- [ ] Se detecta refresh-token reuse.
- [ ] No se acepta OAuth manual en producción.

### Autorización

- [ ] Deny-by-default.
- [ ] PDP centralizado.
- [ ] PEP en cada borde y dominio.
- [ ] Tenant resuelto desde fuente interna.
- [ ] Scopes y roles no vienen del cliente.
- [ ] Obligaciones verificadas antes de ejecutar.
- [ ] Cache firmada e invalidable.

### APIs de IA

- [ ] Las claves permanecen en backend/KMS.
- [ ] Cada proveedor tiene adaptador.
- [ ] Existen límites de gasto y tokens.
- [ ] Hay timeouts, retries y circuit breakers.
- [ ] Se filtran secretos y PII antes de enviar.
- [ ] Se validan salidas contra esquema.
- [ ] Tool calls vuelven a autorizarse.
- [ ] El fallback no salta controles.

### Datos y auditoría

- [ ] No existen repositorios JSON en producción.
- [ ] Memoria usa backend durable y filtros tenant.
- [ ] BookPI es append-only.
- [ ] Refunds son eventos nuevos.
- [ ] El append es transaccional y concurrente-seguro.
- [ ] Las mutaciones críticas tienen auditoría durable.
- [ ] Se verifican hashes y firmas.

### Filtraciones

- [ ] Secret scan en CI.
- [ ] Redacción de logs probada.
- [ ] No se registran JWT ni API keys.
- [ ] No se exponen prompts internos.
- [ ] No se filtran SQL ni stack traces.
- [ ] PII clasificada, minimizada y auditada.
- [ ] Respuestas de error son seguras.

### Operación

- [ ] Métricas y traces correlacionados.
- [ ] SLOs definidos con benchmarks reales.
- [ ] Alertas P0/P1 probadas.
- [ ] Runbooks ejecutables.
- [ ] Rollback probado.
- [ ] Rotación de claves probada.
- [ ] Restauración de backups verificada.
- [ ] Simulacros de incidentes realizados.

---

## 23. Registro de estados

```text
planned      diseño documentado, sin implementación verificable
implemented  código desplegado, evidencia parcial
verified     tests y evidencia de entorno aprobados
hardened     controles adicionales de seguridad y operación aprobados
deprecated   sustituido, sin nuevas dependencias
retired      eliminado del runtime y archivado
```

Ningún componente puede marcarse como `verified` o `hardened` solo por existir en documentación. Requiere evidencia enlazada a commit, build, ambiente, pruebas y observabilidad.

---

## 24. Gobernanza de calidad de Isabella

Isabella debe comportarse como una autoridad técnica prudente:

- No afirmar que algo está implementado sin evidencia.
- No inventar resultados de pruebas, benchmarks, auditorías o despliegues.
- No presentar simulaciones criptográficas como seguridad real.
- No recomendar algoritmos, regiones, proveedores o certificaciones como hechos sin verificar.
- Distinguir diseño, código de referencia, prototipo y producción.
- Señalar incertidumbres y dependencias faltantes.
- Preferir una denegación segura frente a una autorización ambigua.
- Pedir aprobación humana para acciones irreversibles o de alto impacto.
- Mantener trazabilidad entre decisión, política, herramienta, modelo y resultado.
- Revisar sesgos, accesibilidad, privacidad y efectos regionales.

---

## 25. Política de actualización continua

En cada ciclo de evolución, Isabella debe:

1. Inventariar componentes y dependencias.
2. Detectar arquitecturas paralelas.
3. Comparar contratos ejecutables con artefactos derivados.
4. Buscar rutas que evadan identidad, tenant, autorización o auditoría.
5. Buscar filtraciones en logs, respuestas, prompts, traces y errores.
6. Verificar rotación y revocación de claves.
7. Revisar permisos excesivos.
8. Ejecutar pruebas de tenant isolation y privilege escalation.
9. Revisar proveedores IA, costes, límites y retención.
10. Validar skills, tools y side effects.
11. Revisar telemetría, SLOs, alertas y runbooks.
12. Registrar riesgos aceptados y excepciones con caducidad.
13. Generar changelog y guía de migración.
14. Repetir el análisis hasta que no aparezcan defectos significativos nuevos.

---

## 26. Apéndice: estructura recomendada del repositorio

```text
app/
  main.py
  api/
    routes/
    dependencies.py
    errors.py
  contracts/
    common.py
    analyze.py
  identity/
    jwt_verifier.py
    sessions.py
    api_keys.py
  authorization/
    pep.py
    pdp_client.py
    decisions.py
    cache.py
  domains/
    memory/
    bookpi/
    skills/
    economy/
  ai/
    gateway.py
    providers/
    moderation.py
    output_validation.py
  tools/
    registry.py
    policy.py
    sandbox.py
  audit/
    events.py
    outbox.py
    ledger.py
  observability/
    logging.py
    metrics.py
    tracing.py
  security/
    redaction.py
    secrets.py
    rate_limits.py
    circuit_breaker.py
  governance/
    policies/
    manifests/
    release_gates/
tests/
  unit/
  contract/
  authorization/
  tenant_isolation/
  security/
  integration/
  load/
migrations/
openapi/
runbooks/
monitoring/
.github/
  workflows/
  CODEOWNERS
  pull_request_template.md
```

---

## 27. Criterio final de aceptación

La API Soberana de Isabella solo puede considerarse apta para producción cuando exista evidencia verificable de que:

1. Hay una única identidad productiva.
2. Hay una única ruta de autorización.
3. Hay una única base de datos productiva.
4. No hay bypass de tenant.
5. No hay permisos derivados del cliente.
6. Las sesiones pueden revocarse.
7. Las API keys se almacenan como hashes y rotan.
8. Las claves criptográficas tienen ciclo de vida verificable.
9. Las entradas y salidas se validan.
10. Los tool calls están autorizados.
11. Los modelos no pueden otorgar permisos.
12. Las mutaciones críticas tienen auditoría durable.
13. BookPI mantiene invariantes append-only.
14. Los secretos y PII no se filtran.
15. La telemetría permite reconstruir cada decisión.
16. CI bloquea inconsistencias contractuales y de seguridad.
17. Existen runbooks probados.
18. El rollback y la recuperación han sido ensayados.
19. Las capacidades marcadas como hardened tienen evidencia real.
20. Las afirmaciones públicas distinguen hechos verificados de diseño futuro.

**Estado:** no declarar producción, verificación o hardening sin evidencia adjunta.
