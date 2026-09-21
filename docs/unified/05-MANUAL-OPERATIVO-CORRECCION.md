# MANUAL OPERATIVO DE CORRECCIÓN, FORTALECIMIENTO Y LIBERACIÓN
## Isabella AI Genesis — Ronda Hiper-Detallada de Corrección

**Repositorio:** `OsoPanda1/isabella-ai-genesis`  
**Rama objetivo:** `main`  
**Commit base:** `eea83b24cead58c9a5f9f9f53ef1b2675d646458`  
**Fecha de referencia:** 5 de septiembre de 2026  
**Naturaleza:** procedimiento técnico de corrección, endurecimiento, validación y liberación  
**Objetivo:** convertir el estado actual en una implementación coherente, verificable, reproducible y operacionalmente segura.

---

# 0. ORDEN DE OPERACIÓN

La ejecución deberá respetar este orden:

```text
0. CONGELACIÓN
        ↓
1. INVENTARIO
        ↓
2. CONTRATO DE DATOS
        ↓
3. PERSISTENCIA
        ↓
4. BOOKPI
        ↓
5. ECONOMÍA
        ↓
6. IDENTIDAD / TENANCY
        ↓
7. CROWN / AEGIS
        ↓
8. MEMORIA / COGNICIÓN
        ↓
9. API / INPUT
        ↓
10. CRYPTO
        ↓
11. CI/CD
        ↓
12. INFRAESTRUCTURA
        ↓
13. TESTS DE INVARIANTES
        ↓
14. CONCURRENCIA / CHAOS
        ↓
15. SEGURIDAD ADVERSARIAL
        ↓
16. OBSERVABILIDAD
        ↓
17. BACKUP / DR
        ↓
18. STAGING
        ↓
19. RELEASE CANDIDATE
        ↓
20. PRODUCCIÓN
        ↓
21. VERIFICACIÓN POST-RELEASE
```

**Regla:** no saltar fases porque una funcionalidad “parezca funcionar”.

---

# 1. FASE CERO — CONGELACIÓN DEL SISTEMA

## 1.1 Crear rama de reparación

Crear:

```text
repair/production-hardening-2026-09
```

La rama parte exactamente de:

```text
eea83b24cead58c9a5f9f9f53ef1b2675d646458
```

## 1.2 Congelar

Durante la ronda:

- no agregar funcionalidades no relacionadas;
- no modificar UI por estética;
- no cambiar arquitectura sin registrar ADR;
- no actualizar dependencias arbitrariamente;
- no introducir nuevas variables de entorno sin contrato;
- no crear nuevos proveedores de infraestructura;
- no introducir otro ORM;
- no introducir otro sistema de ledger;
- no introducir otro sistema de identidad.

## 1.3 Regla de cambios

Cada modificación deberá responder:

```text
¿Qué problema corrige?
¿Qué invariante protege?
¿Qué código toca?
¿Qué prueba demuestra que funciona?
¿Qué comportamiento anterior puede romper?
¿Cómo se revierte?
```

---

# 2. FASE UNO — INVENTARIO TOTAL

Crear:

```text
docs/operations/PRODUCTION_REPAIR_REGISTER.md
```

Registrar cada hallazgo:

| ID | Área | Severidad | Archivo | Problema | Corrección | Test |
|---|---|---:|---|---|---|---|
| REP-001 | DB | P0 | ... | ... | ... | ... |
| REP-002 | BookPI | P0 | ... | ... | ... | ... |
| REP-003 | Billing | P0 | ... | ... | ... | ... |

Estados permitidos:

```text
OPEN
IN_PROGRESS
FIXED
TESTED
VERIFIED
BLOCKED
REJECTED
```

No usar “DONE” sin prueba asociada.

---

# 3. FASE DOS — UNIFICACIÓN DEL CONTRATO DE DATOS

## 3.1 Problema crítico

Actualmente Prisma define `BookPiLedger` de una forma:

```text
id
tenantId
index
eventType
amount
idempotencyKey
hash
previousHash
createdAt
```

mientras el repositorio PostgreSQL trabaja con otra estructura:

```text
index
tenant_id
user_id
operation
category
cost_decimal
tokens_consumed
previous_hash
block_hash
status
nonce
signature_algorithm
pqc_signature
```

La definición Prisma actual puede verificarse directamente en el esquema del repositorio. 

## 3.2 Decisión obligatoria

Elegir **un único modelo canónico**.

Recomendación:

```text
PostgreSQL = autoridad
BookPI = ledger económico/integridad
Prisma = acceso ORM al mismo modelo
pg = acceso especializado únicamente cuando sea necesario
```

No mantener dos esquemas conceptuales diferentes.

---

# 4. NUEVO MODELO ECONÓMICO CANÓNICO

Agregar modelos equivalentes a:

```text
EconomicEvent
Payment
Subscription
Invoice
Refund
Chargeback
WebhookEvent
Payout
Settlement
BalanceProjection
AuditEvent
```

## 4.1 EconomicEvent

Debe contener como mínimo:

```text
id
tenant_id
actor_id
event_type
currency
amount_minor
direction
source
provider
provider_event_id
idempotency_key
correlation_id
metadata
created_at
```

Restricciones:

```sql
UNIQUE(provider, provider_event_id)
UNIQUE(tenant_id, idempotency_key)
```

## 4.2 Payment

Debe registrar:

```text
provider
provider_payment_id
tenant_id
user_id
amount
currency
status
captured_at
failed_at
metadata
```

Nunca usar un texto arbitrario de `operation` como identidad del pago.

---

# 5. WEBHOOKS — IDEMPOTENCIA REAL

Crear:

```text
WebhookEvent
```

con:

```text
id
provider
provider_event_id
event_type
payload_hash
received_at
processed_at
status
error
```

Agregar:

```sql
UNIQUE(provider, provider_event_id)
```

Flujo obligatorio:

```text
Stripe
 ↓
verificar firma
 ↓
extraer event.id
 ↓
INSERT WebhookEvent
 ↓
si UNIQUE falla → evento duplicado
 ↓
BEGIN
 ↓
EconomicEvent
 ↓
BookPI
 ↓
BalanceProjection
 ↓
COMMIT
```

No:

```text
buscar texto parecido
→ decidir si ya ocurrió
```

---

# 6. BOOKPI — RECONSTRUCCIÓN COMPLETA

Esta es una de las zonas prioritarias.

El repositorio actual ya utiliza transacción PostgreSQL, bloqueo advisory por tenant y `SELECT ... FOR UPDATE`, lo cual es una mejora importante. 

Pero todavía deben corregirse varias inconsistencias.

---

## 6.1 CANONICAL PAYLOAD

Crear:

```text
src/lib/bookpi/canonical-payload.ts
```

Debe existir **una sola función**:

```text
canonicalBookPiPayload(block)
```

Todas estas operaciones deberán utilizarla:

```text
append()
verifyIntegrity()
audit()
export()
reconciliation()
billing()
refund()
```

---

# 6.2 NO HASHAR CAMPOS MUTABLES

El hash no deberá depender de:

```text
pqcSignature
```

si esa firma se incorpora después del cálculo.

El orden correcto debe ser definido explícitamente.

Ejemplo conceptual:

```text
canonical payload
        ↓
SHA-256
        ↓
blockHash
        ↓
firma del blockHash
        ↓
persistencia
```

O, si se requiere firma sobre el payload:

```text
canonical payload
        ↓
hash
        ↓
signature
        ↓
persistencia
```

Pero **no**:

```text
hash con signature = null
↓
agregar signature
↓
verificar hash incluyendo signature
```

---

# 6.3 TIMESTAMP CANÓNICO

El timestamp usado para calcular el hash debe ser exactamente el timestamp persistido.

No:

```text
new Date().toISOString()
```

para el hash y posteriormente:

```sql
created_at DEFAULT now()
```

Debe ser:

```text
timestamp = generated once
↓
hash(timestamp)
↓
INSERT(timestamp)
```

---

# 6.4 ALGORITMO DE FIRMA

Actualmente existe una contradicción:

```text
env:
ML-DSA-87
ECDSA-P384
```

pero el repositorio termina utilizando:

```text
RSA-SHA256
```

La configuración actual muestra explícitamente esa discrepancia. 

Debe existir:

```text
BOOKPI_SIGNATURE_ALGORITHM
```

y el runtime debe respetarlo.

No permitir:

```text
configuración dice A
código ejecuta B
```

---

# 6.5 FIRMA REAL

Separar:

```text
hashing
signing
verification
key management
```

Crear:

```text
src/lib/crypto/bookpi-signer.ts
```

con:

```text
signBlockHash()
verifyBlockSignature()
getSigningAlgorithm()
```

La función de firma no debe decidir silenciosamente otro algoritmo.

---

# 6.6 FALLA CRIPTOGRÁFICA

Eliminar comportamiento ambiguo.

Si:

```text
firma = null
```

y la política de producción exige firma:

```text
NO INSERT
```

Nunca:

```text
insert unsigned block
```

---

# 6.7 REFUNDS

Actualmente el refund busca previamente otro refund y después ejecuta append.

Eso debe sustituirse por una restricción de base de datos.

Crear:

```text
original_event_id
```

en el evento económico/refund.

Agregar:

```sql
UNIQUE(original_event_id, event_type)
```

Flujo:

```text
BEGIN
 ↓
SELECT original FOR UPDATE
 ↓
INSERT refund
 ↓
UNIQUE constraint
 ↓
COMMIT
```

Dos solicitudes simultáneas deberán producir:

```text
1 refund
1 rechazo por duplicate
```

Nunca:

```text
2 refunds
```

---

# 7. BOOKPI — PRUEBAS OBLIGATORIAS

Crear:

```text
tests/bookpi/
```

## Test 001

```text
append → verifyIntegrity = true
```

## Test 002

Modificar:

```text
cost
```

Debe fallar.

## Test 003

Modificar:

```text
previousHash
```

Debe fallar.

## Test 004

Modificar:

```text
blockHash
```

Debe fallar.

## Test 005

Modificar:

```text
signature
```

Debe fallar si la firma forma parte de la autoridad.

## Test 006

Dos append concurrentes:

```text
A
B
```

Resultado:

```text
index 0
index 1
```

Nunca:

```text
index 0
index 0
```

## Test 007

Dos refunds simultáneos:

```text
refund
refund
```

Resultado:

```text
1 accepted
1 rejected
```

---

# 8. SOVEREIGNDB

## Problema

El estado económico/operacional no debe depender de:

```text
memory
+
fire-and-forget persistence
```

El proceso correcto:

```text
request
 ↓
transaction
 ↓
PostgreSQL
 ↓
commit
 ↓
projection/cache
```

No:

```text
memory
 ↓
respuesta
 ↓
persistencia asíncrona
```

---

# 9. REGLA ABSOLUTA DE PERSISTENCIA

Crear:

```text
src/lib/persistence/
```

con:

```text
transaction.ts
repositories/
outbox/
```

Toda operación crítica deberá tener:

```text
BEGIN
operation
validation
COMMIT
```

Si PostgreSQL falla:

```text
NO SUCCESS
```

No:

```text
SUCCESS + intento posterior de persistencia
```

---

# 10. BALANCES

`balance` no debe ser autoridad contable.

Modelo:

```text
EconomicEvents
      ↓
ledger
      ↓
projection
      ↓
balance
```

El balance debe poder reconstruirse.

Crear:

```text
rebuildBalance(tenantId)
```

Resultado:

```text
projection == calculated ledger balance
```

Si no:

```text
ECONOMIC_INTEGRITY_FAILURE
```

---

# 11. IDENTIDAD

Auditar exhaustivamente:

```text
src/lib/auth/
src/lib/security/
src/routes/
```

Buscar cualquier:

```text
req.body.userId
req.body.tenantId
req.headers["x-tenant-id"]
req.headers["x-user-id"]
```

que pueda convertirse en autoridad.

Regla:

```text
IDENTIDAD = token/session verificado
TENANT = relación servidor → identidad
PERMISSIONS = policy engine
```

Nunca:

```text
body → autoridad
header → autoridad
query → autoridad
cookie no validada → autoridad
```

---

# 12. TENANT ISOLATION

Cada query sensible debe tener:

```text
tenant_id
```

como condición.

Auditar:

```text
SELECT
UPDATE
DELETE
INSERT
JOIN
aggregate
cache
vector search
memory search
BookPI
billing
admin
exports
```

Especialmente:

```text
Redis keys
Vector DB
memory
logs
files
uploads
webhooks
analytics
```

---

# 13. CROWN

CROWN debe convertirse en:

```text
DENY BY DEFAULT
```

Flujo:

```text
request
 ↓
identity
 ↓
tenant
 ↓
intent
 ↓
policy
 ↓
risk
 ↓
authorization
 ↓
action
```

Nunca:

```text
AI → tool
```

directamente.

---

# 14. PRINCIPIO DE NO-BYPASS

No debe existir:

```text
isFounder
isAdmin
isOwner
isInternal
```

que permita saltarse CROWN.

El propietario del sistema también atraviesa:

```text
identity
→ authorization
→ policy
→ risk
→ action
```

---

# 15. AEGIS

Aegis debe funcionar como control de riesgo independiente.

Debe poder producir:

```text
ALLOW
DENY
REVIEW
```

y registrar:

```text
risk_score
policy
decision
actor
tenant
resource
action
timestamp
correlation_id
```

---

# 16. FAIL-CLOSED

Para producción:

```text
CROWN unavailable → DENY
Aegis unavailable → DENY para acciones sensibles
tenant unknown → DENY
identity unknown → DENY
policy unknown → DENY
tool unknown → DENY
ledger unavailable → DENY economic action
signature invalid → DENY
database unavailable → DENY write
```

---

# 17. QUP / PQC

No presentar simulación criptográfica como criptografía real.

La configuración actual declara algoritmos PQC, pero debe distinguirse claramente entre:

```text
simulation
```

y:

```text
cryptographic authority
```

Si la implementación es simulada:

```text
simulation = telemetry/test only
```

Nunca:

```text
simulation → authorize payment
simulation → authorize privileged operation
simulation → validate sovereign identity
simulation → release production artifact
```

---

# 18. ENVIRONMENT SCHEMA

El archivo actual ya centraliza variables de entorno y convierte varios valores correctamente, pero `QUP_PEC_ENABLED` y `QUP_STRICT_ISOLATION` deben recibir el mismo tratamiento de coerción boolean que el resto. 

Crear una única política:

```text
string env
 ↓
schema
 ↓
typed config
 ↓
application
```

Nunca:

```text
process.env.X
```

disperso por el proyecto.

---

# 19. DATABASE AUTHORITY

Resolver explícitamente:

```text
DATABASE_URL
DATABASE_DIRECT_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Definir:

```text
PRIMARY_DATABASE
```

y documentar:

```text
qué escribe
qué lee
qué migra
qué replica
qué utiliza serverless
```

No permitir dos autoridades silenciosas.

---

# 20. SUPABASE / POSTGRES

Verificar:

```text
RLS
indexes
foreign keys
unique constraints
NOT NULL
CHECK constraints
transactions
timeouts
connection pool
statement timeout
idle timeout
backup
restore
migration order
```

---

# 21. MIGRACIONES

Cada migración debe ser:

```text
forward-compatible
repeatable where applicable
reviewable
transactional where possible
```

No modificar producción manualmente sin registrar migración equivalente.

Crear:

```text
docs/database/MIGRATION_POLICY.md
```

---

# 22. API

Auditar todas las rutas.

Para cada endpoint:

```text
authentication?
tenant?
authorization?
input schema?
rate limit?
body limit?
timeout?
audit?
idempotency?
error mapping?
```

Crear matriz:

| Endpoint | Auth | Tenant | CROWN | Validation | Rate | Audit |
|---|---|---|---|---|---|---|

No dejar endpoints “especiales” fuera de la matriz.

---

# 23. INPUT VALIDATION

Todos los inputs deben pasar por Zod o equivalente.

Validar:

```text
body
params
query
headers sensibles
files
JSON
arrays
nested objects
URLs
model names
tool names
metadata
```

Aplicar límites:

```text
body
messages
attachments
tools
tokens
metadata
```

---

# 24. PROMPT INJECTION

El modelo nunca debe recibir autoridad implícita de texto.

Separar:

```text
user content
system policy
developer policy
tool authority
memory
retrieved documents
external content
```

Un documento recuperado nunca puede convertirse en:

```text
instruction authority
```

---

# 25. TOOLS

Crear registro explícito:

```text
ToolRegistry
```

Cada tool:

```text
id
version
risk
requiredPermission
tenantScope
inputSchema
outputSchema
enabled
```

Unknown tool:

```text
DENY
```

---

# 26. MEMORY

Separar:

```text
memory
identity
policy
economic state
```

Nunca almacenar:

```text
authorization
```

dentro de memoria semántica.

Crear:

```text
memory provenance
memory owner
memory tenant
memory retention
memory deletion
memory version
```

---

# 27. MEMORY DELETION

Toda memoria debe poder responder:

```text
¿quién la creó?
¿por qué existe?
¿qué tenant posee?
¿cuándo expira?
¿cómo se elimina?
¿qué embeddings dependientes existen?
```

---

# 28. STRIPE

Webhook:

```text
raw body
 ↓
signature
 ↓
event.id
 ↓
dedupe
 ↓
transaction
 ↓
economic event
 ↓
BookPI
 ↓
projection
```

Nunca acreditar por:

```text
success_url
client callback
frontend confirmation
```

---

# 29. STRIPE REFUNDS / CHARGEBACKS

Implementar eventos independientes:

```text
PAYMENT_CREATED
PAYMENT_CAPTURED
PAYMENT_FAILED
REFUND_CREATED
CHARGEBACK_OPENED
CHARGEBACK_WON
CHARGEBACK_LOST
```

No mutar retrospectivamente el evento original.

---

# 30. MARKETPLACE

Eliminar:

```text
DEFAULT_MARKETPLACE_LISTINGS
```

como fuente económica de producción.

Debe existir:

```text
MarketplaceListing
```

en DB.

Estados:

```text
DRAFT
ACTIVE
SUSPENDED
SOLD
ARCHIVED
```

---

# 31. API KEYS

Toda API key:

```text
hash
prefix
created_at
expires_at
revoked_at
last_used_at
tenant_id
scopes
```

Nunca almacenar la clave completa.

---

# 32. SESIONES

Implementar:

```text
session_id
user_id
tenant_id
issued_at
expires_at
revoked_at
rotation
device metadata
```

Revocación debe ser efectiva.

---

# 33. RATE LIMITING

Separar:

```text
anonymous
authenticated
inference
voice
admin
billing
webhook
auth
```

Billing y auth necesitan límites independientes.

---

# 34. ERROR HANDLING

Nunca devolver:

```text
stack trace
database error
provider secret
internal path
SQL
token
signature
```

Producción:

```text
generic public error
correlation_id
internal detailed log
```

---

# 35. OBSERVABILIDAD

Cada request sensible debe tener:

```text
request_id
correlation_id
tenant_id
actor_id
route
decision
latency
provider
status
```

Nunca registrar:

```text
API keys
JWT
passwords
raw payment secrets
private keys
full sensitive payloads
```

---

# 36. AUDIT LOG

Audit event mínimo:

```text
id
timestamp
actor
tenant
action
resource
decision
reason
request_id
ip_hash
metadata
```

Audit log no debe ser editable por la aplicación normal.

---

# 37. CI/CD

Unificar:

```text
Node
pnpm
lockfile
build
test
security
artifact
signature
provenance
release
```

El proyecto declara:

```text
pnpm@10.15.0
```

por lo que CI debe utilizar exactamente esa versión. El commit actual ya incorpora esa declaración. 

---

# 38. NODE VERSION

Alinear:

```text
package.json
.nvmrc
CI
Docker
Vercel
release matrix
```

No ejecutar CI con Node incompatible con:

```text
engines.node
```

---

# 39. CI SECURITY JOB

El job de seguridad debe instalar explícitamente:

```text
Node
pnpm
dependencies
```

antes de:

```text
pnpm audit
```

No depender del runner.

---

# 40. SUPPLY CHAIN

Eliminar:

```text
curl ... | bash
```

sin pinning/verificación.

Preferir:

```text
pinned version
checksum
official action
verified binary
```

Registrar:

```text
tool version
checksum
source
```

---

# 41. RELEASE ATTESTATION

Pipeline correcto:

```text
SOURCE
 ↓
BUILD
 ↓
TEST
 ↓
SBOM
 ↓
SIGN
 ↓
VERIFY
 ↓
PROVENANCE
 ↓
POLICY CHECK
 ↓
RELEASE
```

No:

```text
SIGN
 ↓
release
```

El pipeline debe demostrar que el artefacto liberado es el artefacto verificado.

---

# 42. SBOM

Generar:

```text
SBOM
```

en formato estándar.

Guardar:

```text
artifact
artifact.sha256
sbom
signature
provenance
verification result
```

---

# 43. DEPLOYMENT

La configuración actual cambió Nitro a:

```text
preset: "vercel"
```

por lo que debe comprobarse que el artefacto generado, runtime y configuración de producción sean coherentes con ese target. 

Validar:

```text
build
output
server entry
runtime
environment
headers
functions
timeouts
database connectivity
```

---

# 44. HEALTH CHECKS

Crear:

```text
/health/live
/health/ready
/health/deep
```

## live

Proceso vivo.

## ready

Dependencias mínimas disponibles.

## deep

Comprueba:

```text
DB
cache
CROWN
Aegis
BookPI
AI provider
```

Sin exponer secretos.

---

# 45. READINESS ECONÓMICA

Crear un health específico interno:

```text
/economic-integrity
```

Debe verificar:

```text
DB reachable
BookPI chain valid
economic tables valid
webhook dedupe valid
projection consistent
crypto signer available
```

---

# 46. TESTS DE INVARIANTES

Crear:

```text
tests/invariants/
```

Obligatorios:

```text
DB unavailable => write denied
invalid signature => ledger denied
duplicate webhook => one event
duplicate payment => one event
duplicate refund => one refund
negative balance => impossible
cross-tenant read => denied
cross-tenant write => denied
revoked key => denied
expired session => denied
unknown tool => denied
unknown policy => denied
CROWN unavailable => sensitive action denied
BookPI corruption => economic writes halted
```

---

# 47. TEST DE TENANT ESCAPE

Crear dos tenants:

```text
TENANT_A
TENANT_B
```

Usuario A debe intentar:

```text
read B
write B
delete B
search B memory
read B ledger
read B billing
invoke B tool
```

Todos deben fallar.

---

# 48. TEST DE PRIVILEGIO

Crear:

```text
guest
user
creator
admin
owner
```

Verificar cada endpoint.

No asumir que:

```text
role = admin
```

implica acceso universal.

Cada acción debe tener permiso explícito.

---

# 49. TEST DE CONCURRENCIA

Ejecutar:

```text
100 append concurrentes
100 payments concurrentes
100 refunds concurrentes
100 webhook deliveries
100 balance updates
```

Verificar:

```text
no duplicate index
no duplicate event
no negative balance
no broken chain
no lost update
```

---

# 50. TEST DE CAÍDA DE BASE DE DATOS

Durante:

```text
append
payment
refund
memory write
admin action
```

interrumpir DB.

Resultado obligatorio:

```text
operation failed
```

Nunca:

```text
success
```

con persistencia posterior incierta.

---

# 51. TEST DE RESTART

Secuencia:

```text
write
restart
read
verify
```

Debe conservarse exactamente:

```text
economic state
ledger
memory
sessions according to policy
audit
```

---

# 52. TEST MULTI-INSTANCE

Levantar:

```text
instance A
instance B
instance C
```

Enviar operaciones simultáneas.

Verificar que no exista estado soberano divergente.

---

# 53. CHAOS TEST

Simular:

```text
DB timeout
Redis unavailable
Stripe timeout
AI provider timeout
network partition
DNS failure
slow upstream
process crash
cold start
duplicate webhook
reordered webhook
malformed webhook
```

Cada dependencia debe tener comportamiento definido.

---

# 54. AI PROVIDER FAILURE

Si Gemini/LLM falla:

```text
retry limitado
timeout
circuit breaker
fallback permitido
```

Pero nunca:

```text
fallback model → privilege escalation
```

---

# 55. TOOL FAILURE

Una tool fallida debe producir:

```text
failed action
audit
correlation_id
```

No:

```text
partial economic success
```

---

# 56. TRANSACTIONAL ECONOMIC ACTION

Toda operación monetaria deberá seguir:

```text
validate identity
 ↓
validate tenant
 ↓
CROWN
 ↓
Aegis
 ↓
idempotency
 ↓
DB transaction
 ↓
economic event
 ↓
BookPI
 ↓
projection
 ↓
COMMIT
```

---

# 57. OUTBOX

Para integraciones externas crear:

```text
OutboxEvent
```

Patrón:

```text
DB transaction
 ├── economic event
 └── outbox event
        ↓
worker
        ↓
external provider
```

No ejecutar llamadas externas irreversibles en medio de una transacción esperando que nunca fallen.

---

# 58. RECONCILIACIÓN

Crear:

```text
jobs/reconcile-economic-state.ts
```

Debe comparar:

```text
Stripe
vs
EconomicEvent
vs
BookPI
vs
BalanceProjection
```

Discrepancias:

```text
ALERT
FREEZE ECONOMIC WRITE
```

según severidad.

---

# 59. BALANCE REBUILD

Debe existir una operación administrativa:

```text
rebuild balance from ledger
```

Nunca modificar manualmente el balance para “arreglarlo”.

---

# 60. SECRETS

Rotar:

```text
JWT secrets
encryption master key
BookPI signing key
CROWN signing key
Aegis secret
Stripe secrets
AI keys
API key hashing secret
```

Documentar:

```text
rotation date
owner
storage
rotation procedure
rollback
```

---

# 61. ENCRYPTION

Verificar:

```text
AES-256-GCM
unique nonce
authenticated tag
key version
key rotation
```

Nunca reutilizar nonce con la misma clave.

---

# 62. KEY VERSIONING

Toda información cifrada debe permitir:

```text
key_version
```

para rotación.

---

# 63. BACKUP

Definir:

```text
RPO
RTO
backup frequency
retention
encryption
restore owner
restore procedure
```

No considerar “hay backups” suficiente.

---

# 64. RESTORE TEST

Ejecutar restauración real en entorno aislado.

Comprobar:

```text
DB
BookPI
economic events
audit
users
tenants
memory
```

---

# 65. DISASTER RECOVERY

Simular:

```text
primary DB unavailable
```

Procedimiento:

```text
detect
freeze economic writes
failover
validate
reconcile
resume
```

---

# 66. LOGGING

Aplicar redacción automática.

Bloquear:

```text
authorization
cookie
api_key
secret
password
private_key
stripe_signature
database_url
jwt
```

---

# 67. SECURITY HEADERS

Validar:

```text
CSP
HSTS
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
frame protection
secure cookies
```

---

# 68. CORS

Definir allowlist explícita.

Nunca:

```text
*
```

en endpoints sensibles.

---

# 69. COOKIE POLICY

Verificar:

```text
Secure
HttpOnly
SameSite
domain
path
expiration
rotation
```

---

# 70. FILE UPLOADS

Validar:

```text
size
MIME
extension
magic bytes
storage path
tenant
virus/malware scanning where applicable
```

Nunca utilizar nombre proporcionado por usuario directamente como path.

---

# 71. SSRF

Toda URL externa proporcionada por usuario debe pasar por:

```text
scheme allowlist
host validation
private IP blocking
redirect validation
DNS rebinding defense
timeout
response size limit
```

---

# 72. SQL

Nunca concatenar input.

Usar:

```text
parameterized queries
Prisma
safe query builder
```

---

# 73. ADMIN

Todas las operaciones administrativas deben registrar:

```text
actor
tenant
resource
old state
new state
reason
request
timestamp
```

---

# 74. EMERGENCY MODE

Debe existir:

```text
NORMAL
SAFE
EMERGENCY
MAINTENANCE
```

En emergencia:

```text
disable economic writes
disable privileged tools
preserve read-only diagnostics
preserve audit
```

---

# 75. KILL SWITCH

Debe existir capacidad operacional para:

```text
freeze billing
freeze payouts
freeze BookPI writes
disable tool
disable model
disable tenant
disable public API
```

Cada switch debe estar auditado.

---

# 76. FEATURE FLAGS

Toda funcionalidad de alto riesgo:

```text
billing
payout
external tool
experimental model
memory write
admin automation
```

debe poder desactivarse.

---

# 77. RATE LIMIT + CIRCUIT BREAKER

Combinar:

```text
rate limit
timeout
retry budget
circuit breaker
bulkhead
```

---

# 78. DEPENDENCY MATRIX

Crear:

```text
docs/operations/DEPENDENCY_MATRIX.md
```

| Dependencia | Critical | Timeout | Retry | Fallback | Failure mode |
|---|---:|---:|---:|---|---|
| PostgreSQL | Sí | X | limitado | No | fail closed |
| Stripe | Sí | X | seguro | No | pending |
| LLM | Sí | X | limitado | sí | degraded |
| Redis | No/según función | X | limitado | sí | degraded |
| CROWN | Sí | X | limitado | No | deny |

---

# 79. DEPLOYMENT STAGING

Antes de producción:

```text
build
deploy staging
migration
smoke
security
economic tests
load
chaos
rollback
```

---

# 80. SMOKE TEST

Automatizar:

```text
GET /
GET /health/live
GET /health/ready
auth
tenant creation/test
AI inference
memory
BookPI append test
BookPI verify
billing webhook fixture
admin authorization
```

---

# 81. BILLING TEST

Nunca probar directamente con dinero real inicialmente.

Utilizar:

```text
Stripe test mode
```

para:

```text
payment
duplicate webhook
refund
failure
retry
out-of-order event
invalid signature
```

---

# 82. RELEASE CANDIDATE

Crear tag:

```text
isabella-vX.Y.Z-rc.1
```

Registrar:

```text
commit
dependencies
migration
SBOM
hash
signature
tests
environment
deployment artifact
```

---

# 83. RELEASE GATE

Debe ser:

```text
typecheck = PASS
lint = PASS
unit = PASS
integration = PASS
security = PASS
BookPI = PASS
economic invariants = PASS
tenant isolation = PASS
build = PASS
artifact verification = PASS
provenance = PASS
```

Cualquier:

```text
FAIL
```

impide release.

---

# 84. PRODUCCIÓN

Secuencia:

```text
freeze
 ↓
backup
 ↓
migration
 ↓
deploy
 ↓
health
 ↓
smoke
 ↓
economic-integrity
 ↓
enable traffic
 ↓
monitor
```

No realizar:

```text
migration + code + billing activation
```

sin observación intermedia.

---

# 85. ROLLBACK

Debe existir rollback independiente para:

```text
application
database migration
feature flags
billing
external integrations
```

Importante:

**No hacer rollback ciego de una base de datos que ya recibió eventos económicos.**

En economía, normalmente:

```text
compensating event
```

es más seguro que:

```text
database rewind
```

---

# 86. POST-DEPLOY — PRIMEROS 15 MINUTOS

Observar:

```text
5xx
latency
DB connections
DB errors
auth failures
CROWN denies
Aegis decisions
BookPI failures
Stripe events
webhook duplicates
memory errors
AI provider errors
```

---

# 87. PRIMERA HORA

Ejecutar:

```text
BookPI verify
economic reconciliation
balance consistency
webhook reconciliation
audit event sampling
tenant isolation probe
error-rate review
```

---

# 88. PRIMERAS 24 HORAS

Ejecutar:

```text
full integrity verification
DB performance review
slow query analysis
security log review
dependency error review
AI token/cost review
billing reconciliation
backup confirmation
```

---

# 89. CRITERIOS DE DETENCIÓN

Detener operaciones económicas si aparece cualquiera de:

```text
BookPI corruption
balance mismatch
duplicate payment
duplicate payout
tenant isolation failure
signature failure
unknown economic event
webhook integrity failure
database inconsistency
unauthorized privileged action
CROWN bypass
critical secret exposure
```

---

# 90. AUDITORÍA FINAL DE CÓDIGO

Ejecutar búsqueda exhaustiva de:

```text
TODO
FIXME
HACK
TEMP
MOCK
FAKE
SIMULATION
BYPASS
DISABLE
SKIP
ADMIN
FOUNDER
OWNER
MASTER
DEV
DEBUG
process.env
console.log
any
as any
@ts-ignore
eslint-disable
```

Cada aparición deberá clasificarse:

```text
legitimate
technical debt
security risk
production blocker
```

---

# 91. AUDITORÍA DE MOCKS

Buscar:

```text
mock
fallback
fake
synthetic
in-memory
default data
hardcoded
```

En producción deben desaparecer de:

```text
billing
identity
authorization
BookPI
database
economic state
audit
```

---

# 92. AUDITORÍA DE HARDCODED DATA

Buscar:

```text
DEFAULT_
ADMIN_
OWNER_
TEST_
DEMO_
STATIC_
```

Todo dato económico, identidad o permiso hardcodeado debe justificar su existencia.

---

# 93. AUDITORÍA DE AUTORIDAD

Para cada función sensible preguntar:

```text
¿Quién puede llamarla?
¿Quién decide?
¿Quién verifica?
¿Dónde se persiste?
¿Puede repetirse?
¿Puede falsificarse?
¿Puede ejecutarse simultáneamente?
¿Puede cruzar tenant?
```

---

# 94. AUDITORÍA DE ESTADO

Todo estado debe clasificarse:

```text
source of truth
projection
cache
ephemeral
derived
```

Nunca permitir que:

```text
cache
```

se convierta accidentalmente en:

```text
authority
```

---

# 95. AUDITORÍA DE EVENTOS

Cada evento económico debe responder:

```text
who
tenant
what
why
when
amount
currency
source
provider
idempotency
previous state
new state
correlation
signature
```

---

# 96. AUDITORÍA DE INTEGRIDAD

Construir:

```text
IntegrityVerifier
```

que valide:

```text
BookPI
economic events
balance projection
webhooks
audit chain
artifact provenance
```

---

# 97. DOCUMENTACIÓN OBLIGATORIA

Crear:

```text
docs/
├── architecture/
├── security/
├── database/
├── operations/
├── billing/
├── bookpi/
├── identity/
├── crown/
├── aegis/
├── memory/
├── deployment/
├── disaster-recovery/
└── incident-response/
```

---

# 98. ADRs OBLIGATORIOS

Crear:

```text
ADR-001-database-authority.md
ADR-002-economic-ledger.md
ADR-003-bookpi-canonical-hashing.md
ADR-004-economic-idempotency.md
ADR-005-tenant-isolation.md
ADR-006-crown-enforcement.md
ADR-007-pqc-boundaries.md
ADR-008-production-runtime.md
ADR-009-release-attestation.md
ADR-010-disaster-recovery.md
```

---

# 99. INCIDENT RESPONSE

Definir niveles:

```text
SEV-0
SEV-1
SEV-2
SEV-3
SEV-4
```

SEV-0:

```text
economic corruption
identity compromise
cross-tenant exposure
critical signing compromise
```

Respuesta:

```text
freeze
isolate
preserve evidence
rotate secrets
reconcile
patch
verify
restore
resume
```

---

# 100. RONDA FINAL — ORDEN EXACTO DE IMPLEMENTACIÓN

## BLOQUE A — INMEDIATO

```text
[ ] branch de reparación
[ ] inventario
[ ] unificar Prisma/PostgreSQL
[ ] definir DB authority
[ ] eliminar estado económico efímero
[ ] canonical BookPI payload
[ ] timestamp persistido exacto
[ ] algoritmo de firma único
[ ] firma obligatoria
[ ] refund idempotente por DB
```

## BLOQUE B — ECONOMÍA

```text
[ ] EconomicEvent
[ ] Payment
[ ] WebhookEvent
[ ] Refund
[ ] Chargeback
[ ] Payout
[ ] Settlement
[ ] BalanceProjection
[ ] unique provider event
[ ] unique idempotency
[ ] atomic transaction
[ ] reconciliation
```

## BLOQUE C — SEGURIDAD

```text
[ ] identity
[ ] tenant
[ ] authorization
[ ] CROWN
[ ] Aegis
[ ] API keys
[ ] sessions
[ ] rate limits
[ ] input validation
[ ] SSRF
[ ] uploads
[ ] headers
[ ] CORS
[ ] secret rotation
```

## BLOQUE D — IA

```text
[ ] prompt isolation
[ ] tool registry
[ ] tool permissions
[ ] memory provenance
[ ] memory deletion
[ ] model allowlist
[ ] provider timeout
[ ] circuit breaker
[ ] cost limits
```

## BLOQUE E — CRYPTO

```text
[ ] BookPI signer
[ ] BookPI verifier
[ ] key versioning
[ ] algorithm consistency
[ ] PQC simulation isolation
[ ] production cryptographic authority
```

## BLOQUE F — CI/CD

```text
[ ] Node version unified
[ ] pnpm version unified
[ ] lockfile
[ ] install deterministic
[ ] audit deterministic
[ ] SBOM
[ ] signing
[ ] signature verification
[ ] provenance
[ ] least privilege
[ ] artifact verification
```

## BLOQUE G — INFRAESTRUCTURA

```text
[ ] health endpoints
[ ] readiness
[ ] DB pool
[ ] timeouts
[ ] Cloudflare
[ ] Vercel
[ ] secrets
[ ] logs
[ ] metrics
[ ] traces
[ ] alerts
```

## BLOQUE H — RESILIENCIA

```text
[ ] backup
[ ] restore
[ ] DR
[ ] chaos
[ ] restart
[ ] multi-instance
[ ] provider failure
[ ] DB failure
```

## BLOQUE I — VALIDACIÓN

```text
[ ] unit
[ ] integration
[ ] E2E
[ ] invariant
[ ] concurrency
[ ] security
[ ] red-team
[ ] economic reconciliation
```

---

# 101. MATRIZ DE CORRECCIÓN PRIORITARIA

| Prioridad | Corrección |
|---|---|
| P0 | Prisma/PostgreSQL contract mismatch |
| P0 | BookPI canonical hash |
| P0 | BookPI signature algorithm mismatch |
| P0 | Timestamp/hash inconsistency |
| P0 | Economic source of truth |
| P0 | Stripe webhook atomic idempotency |
| P0 | Refund race |
| P0 | No production mock/fallback |
| P0 | Tenant isolation |
| P0 | CROWN fail-closed |
| P0 | Balance reconstruction |
| P0 | Cryptographic authority |
| P1 | Outbox |
| P1 | Reconciliation |
| P1 | Session/API-key revocation |
| P1 | CI version consistency |
| P1 | Artifact verification |
| P1 | Supply-chain hardening |
| P1 | Backup/restore |
| P1 | Chaos testing |
| P2 | UX hardening |
| P2 | Documentation expansion |
| P2 | Performance optimization |

---

# 102. DEFINICIÓN DE TERMINADO

Una corrección no está terminada porque:

```text
compila
```

Está terminada cuando:

```text
código corregido
+
test
+
test de regresión
+
migración validada
+
observabilidad
+
documentación
+
rollback
+
verificación
```

---

# 103. ESTADO FINAL ESPERADO

La arquitectura final deberá poder representarse así:

```text
                 INTERNET
                    │
             CLOUDFLARE/WAF
                    │
             REQUEST BOUNDARY
                    │
          ┌─────────▼─────────┐
          │ IDENTITY / TENANT │
          └─────────┬─────────┘
                    │
               CROWN/PDP
                    │
                 AEGIS
                    │
              ACTION GATE
                    │
        ┌───────────┼───────────┐
        │           │           │
      MEMORY      TOOLS        AI
        │           │           │
        └───────────┼───────────┘
                    │
             ECONOMIC GATE
                    │
             POSTGRESQL TX
                    │
        ┌───────────┼───────────┐
        │           │           │
     ECONOMIC     BOOKPI      AUDIT
      EVENTS       LEDGER       │
        │           │           │
        └───────────┼───────────┘
                    │
              PROJECTIONS
                    │
               OUTBOX/JOBS
                    │
          EXTERNAL PROVIDERS
```

---

# 104. PRINCIPIOS NO NEGOCIABLES

```text
1. PostgreSQL es autoridad de persistencia.
2. El ledger económico es autoridad económica.
3. Balance es proyección.
4. CROWN decide autorización.
5. Aegis controla riesgo.
6. Identidad nunca proviene del body.
7. Tenant nunca proviene del usuario sin verificación.
8. Guest no obtiene privilegios.
9. Founder no obtiene bypass.
10. Unknown = deny.
11. DB down = no economic write.
12. Signature failure = no ledger write.
13. Duplicate webhook = un solo evento.
14. Duplicate refund = un solo refund.
15. Negative balance = imposible.
16. Cross-tenant access = imposible.
17. Simulated PQC = no autoridad criptográfica.
18. Unsigned artifact = no release.
19. Unverified provenance = no release.
20. BookPI corruption = economic freeze.
21. Every critical action is auditable.
22. Every critical mutation is idempotent.
23. Every projection is reconstructible.
24. Every production dependency has a failure mode.
25. Every release has rollback.
```

---

# 105. CERTIFICACIÓN OPERATIVA FINAL

Antes de declarar Isabella lista:

```text
[ ] código auditado
[ ] dependencias auditadas
[ ] DB schema coherente
[ ] migraciones verificadas
[ ] BookPI íntegro
[ ] firmas verificadas
[ ] economía reconciliable
[ ] Stripe idempotente
[ ] refunds atómicos
[ ] identidad validada
[ ] tenant isolation validado
[ ] CROWN enforced
[ ] Aegis enforced
[ ] PQC correctamente delimitado
[ ] memoria aislada
[ ] tools autorizadas
[ ] API endurecida
[ ] secrets rotados
[ ] CI reproducible
[ ] artifact firmado
[ ] artifact verificado
[ ] provenance verificada
[ ] SBOM generado
[ ] staging probado
[ ] carga probada
[ ] concurrencia probada
[ ] chaos probado
[ ] backup probado
[ ] restore probado
[ ] rollback probado
[ ] monitoring activo
[ ] alertas activas
[ ] documentación completa
[ ] runbook de incidentes
[ ] reconciliación económica
[ ] smoke test
[ ] post-deployment verification
```

**La liberación debe producir un estado demostrable, no una declaración de confianza.**

El resultado final buscado es:

```text
CORRECTO
+
PERSISTENTE
+
IDEMPOTENTE
+
AUDITABLE
+
MULTI-TENANT
+
FAIL-CLOSED
+
CRIPTOGRÁFICAMENTE COHERENTE
+
REPRODUCIBLE
+
OBSERVABLE
+
RECUPERABLE
+
VERIFICABLE
```