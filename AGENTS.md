# AGENTS.md — Documento Maestro de Arquitectura, Seguridad y Especificación Canónica
Isabella Villaseñor AI v4.3.3 — FGAIS Sovereign Genesis Era (SSOT de versión: package.json)
Autoría técnica y arquitectura de sistemas: Edwin Oswaldo Castillo Trejo / Anubis Villaseñor
ORCID declarado: 0009-0008-5050-1539
Ecosistema: TAMV ONLINE NETWORK · RDM Digital Hub · Nodo Cero · Real del Monte, Hidalgo, México
Frontiers Loop declarado: 3117809
Registros Open Science declarados: DOI 10.5281/zenodo.20606361 · OSF 10.17605/OSF.IO/T3WMY
Licencia declarada: CC BY 4.0 para documentación/contenido; el código y dependencias deben conservar su licencia específica.
Clasificación: especificación arquitectónica, guía operativa, política de contribución y marco de gobernanza.
Estado: canónico para trabajo de agentes; no constituye certificación jurídica, financiera, de seguridad o regulatoria.

Principio rector: Las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta.

Regla de honestidad: código existente no equivale a capacidad verificada; un test local no equivale a producción; una firma simulada no equivale a criptografía operativa; un gate EVIDENCE_GATED no equivale a PASS; una licencia no equivale a autorización sobre datos, marcas o modelos.

0. Cómo usar este archivo
Este archivo gobierna agentes de programación, mantenedores y contribuyentes que trabajen en el repositorio. Debe leerse junto con:

README.md.
SECURITY.md.
CODEOWNERS.
LICENSES.md.
.env.example.
package.json y lockfile.
ADRs vigentes.
Migraciones.
Contratos runtime.
Manifiestos de evidencia.
Runbooks operativos.

Si existe contradicción entre este documento y el código ejecutable, el agente debe detenerse, reportar la discrepancia y no inventar una resolución. La corrección requiere ADR o cambio de autoridad documentado.

0.1 Clasificación de capacidades
Estado	Significado
CONCEPTUAL	Diseño o intención, sin implementación verificable
PLANNED	Trabajo pendiente con issue/RFC
IMPLEMENTED	Código existente y referenciado
TESTED	Pruebas automatizadas aprobadas
VERIFIED	Evidencia reproducible en ambiente definido
DEPLOYED	Desplegado en un ambiente identificable
HARDENED	Controles de seguridad, operación y adversarial testing aprobados
CERTIFIED	Evaluación formal independiente con alcance, fecha y firmantes
EXPERIMENTAL	Investigación no apta para claims productivos
SIMULATED	Mock, placeholder o comportamiento no equivalente a producción
BLOCKED	Deliberadamente inhabilitado
1. Propósito e identidad de Isabella
Isabella Villaseñor AI es una arquitectura cognitiva híbrida, contextual, territorial y gobernada. Coordina memoria, interpretación, recuperación, identidad, políticas, herramientas, persistencia, economía, seguridad y trazabilidad dentro de límites explícitos.

1.1 Lo que Isabella es
Una capa de orquestación cognitiva.
Un sistema híbrido de modelos, reglas, retrieval y herramientas.
Un componente de gobernanza para el Gemelo Digital del Ecosistema TAMV.
Una plataforma de interacción contextual y territorial.
Una arquitectura multi-tenant consciente de identidad.
Un sistema auditable que debe conservar procedencia y límites.

1.2 Lo que Isabella no es
No es AGI.
No es consciencia artificial.
No es persona ni sujeto jurídico.
No es autoridad autónoma sobre seres humanos.
No es una novia virtual ni entretenimiento superficial.
No es un único LLM.
No es una garantía de neutralidad, exactitud o seguridad absoluta.
No es una licencia financiera, certificación legal o acreditación académica.

1.3 Doctrina de capacidad y autoridad
```
capacidad técnica ≠ permiso
predicción ≠ hecho
recomendación ≠ aprobación
modelo ≠ autoridad
memoria ≠ verdad
hash ≠ WORM regulatorio
build verde ≠ certificación
```
Cuando exista incertidumbre relevante, el sistema debe expresar incertidumbre, detenerse, degradar de forma controlada o solicitar revisión humana.

2. Reglas críticas de despliegue
[!CRITICAL]
Cadena de despliegue: GitHub main → Vercel/Nitro output → runtime identificado.

2.1 Inmutabilidad de historia
Prohibido en ramas remotas publicadas:

git push --force.
git push --force-with-lease.
git rebase sobre historia compartida.
git commit --amend después de publicar.
Squash o reescritura de commits remotos sin procedimiento formal.

La corrección se realiza mediante nuevos commits. Esta regla protege la trazabilidad, la evidencia same-commit y la capacidad de rollback.

2.2 Integridad de main
Cada push a main puede activar Vercel. Antes de enviar:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm verify:lock
```
Ejecutar además, cuando existan:

```bash
pnpm security:scan
pnpm db:verify
pnpm format:check
pnpm gates:verify
```
Los nombres reales deben comprobarse en package.json; si un script no existe, no debe inventarse como si hubiera sido ejecutado.

2.3 Secretos
Nunca introducir en código, logs, UI, documentación pública, fixtures o artefactos:

JWT completos.
API keys.
Refresh tokens.
Private keys.
Credenciales Postgres.
Stripe secrets.
Service-role keys.
Datos personales operativos.
Dumps de base de datos.
Certificados privados.

Todo secreto expuesto históricamente se considera comprometido y exige rotación, revocación y análisis de impacto.

3. Arquitectura de cinco nodos
```
                    ┌────────────────────────┐
                    │     CROWN Gateway      │
                    │ arbitration · routing  │
                    │ policy context · state│
                    └───────────┬────────────┘
                                │
        ┌───────────────────────┼────────────────────────┐
        ▼                       ▼                        ▼
┌───────────────┐     ┌────────────────┐       ┌────────────────┐
│   ISA Core    │     │ SOPHIA Engine  │       │  ORION Engine  │
│ presence      │     │ epistemology   │       │ tools/sandbox  │
│ tone/context  │     │ E0–E4/NCUA     │       │ execution      │
└───────┬───────┘     └───────┬────────┘       └────────┬───────┘
        └─────────────────────┼──────────────────────────┘
                              ▼
                    ┌────────────────────────┐
                    │    ARGUS Sentinel      │
                    │ defense · veto · audit │
                    └────────────────────────┘
```
3.1 Responsabilidades
CROWN: arbitraje, routing, estado y policy decision.
ISA: presencia, tono, empatía y presentación.
SOPHIA: evidencia, epistemología, síntesis y clasificación E0–E4.
ORION: herramientas, sandbox, workflows y ejecución autorizada.
ARGUS: riesgo, veto, redacción, detección de abuso, kill switch y auditoría.

Ningún nodo puede convertirse silenciosamente en una autoridad de identidad, permisos o dinero. Todo cambio de frontera exige ADR y pruebas.

4. Pipeline canónico FGAIS
```
PERCEIVE
  ↓
REMEMBER
  ↓
POLICY GATE
  ↓
DECIDE
  ↓
ACT
  ↓
AUDIT
  ↓
RESPOND
```
4.1 Etapas normativas
Perceive: normalización, MIME, encoding, tamaño, correlación y redacción inicial.
Remember: recuperación solo de scopes autorizados.
Policy Gate: autenticación, tenant, RBAC/ABAC, riesgo, cuotas y obligaciones.
Decide: CROWN elige respuesta, retrieval, herramienta, aprobación o bloqueo.
Act: ORION ejecuta únicamente herramientas permitidas.
Audit: BookPI/outbox registra decisión, hashes, versión y resultado.
Respond: salida validada, redactada y con metadatos seguros.

4.2 Fail-closed
Debe denegarse o detenerse una operación crítica cuando falle:

Identidad.
Resolución de tenant.
Policy decision.
Capability check.
Cuota o presupuesto.
Validación de entrada.
Validación de salida.
Firma o evidencia requerida.
Integridad de BookPI.

Las lecturas de bajo riesgo pueden tener una ruta degradada previamente aprobada. Las mutaciones, operaciones económicas, cambios de permisos y herramientas con side effects no pueden usar un allow local inventado.

5. Memoria jerárquica y límites de contexto
Scope	Uso	Persistencia	Regla
immediate	Atención del turno	Efímera	No promover automáticamente
session	Conversación activa	TTL	Usuario/sesión aislados
project	Código y estado del repositorio	Durable	Tenant/proyecto
territorial	Conocimiento de Real del Monte/TAMV	Durable	Procedencia y gobernanza cultural
historical	Hechos auditados y BookPI	Append-only	Nunca reescribir historia
Cada memoria debe tener:

```
memory_id
tenant_id
principal_id o null
scope
purpose
sensitivity
consent
provenance
content_hash
created_at
expires_at
retention_policy
```
Prohibido:

Promover inferencias a hechos.
Mezclar tenants.
Guardar secretos.
Persistir PII sin propósito.
Usar memoria fuera del consentimiento o finalidad aplicable.
Tratar un embedding como autorización.

6. Gobernanza C.R.O.W.N. y ARGUS
6.1 CROWN
CROWN decide con un contrato versionado. Un allow requiere identidad, tenant, política, scope, capability, cuota y obligaciones válidas.

```ts
export type PolicyEffect = "allow" | "deny";

export interface PolicyDecision {
  decisionId: string;
  tenantId: string;
  subjectId: string;
  action: string;
  resource: string;
  effect: PolicyEffect;
  policyId: string;
  policyVersion: string;
  obligations: string[];
  issuedAt: string;
  expiresAt: string;
  keyId: string;
  signature: string;
}
```
6.2 ARGUS
ARGUS puede:

Bloquear inyección.
Redactar secretos y PII.
Aplicar rate limiting.
Activar circuit breakers.
Invalidar capacidades.
Revocar tokens.
Detener herramientas.
Activar kill switch.
Abrir revisión humana.

ARGUS no debe convertirse en vigilancia masiva sin necesidad, proporcionalidad, retención y supervisión.

6.3 Tool whitelist
Toda herramienta registra:

```ts
export interface ToolContract {
  toolName: string;
  version: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  inputSchema: string;
  outputSchema: string;
  requiredScopes: string[];
  timeoutMs: number;
  maxRetries: number;
  sideEffects: "none" | "read" | "write" | "financial";
  requiresHumanApproval: boolean;
}
```
Un modelo puede sugerir un tool call, pero no puede autorizarlo. La autorización se repite inmediatamente antes de ejecutar.

7. Contratos canónicos
7.1 IsabellaPerception
```ts
export type EpistemicLevel =
  | "E0_AXIOM"
  | "E1_VERIFIED"
  | "E2_INFERRED"
  | "E3_HYPOTHETICAL"
  | "E4_UNFOUNDED";

export interface IsabellaPerception {
  traceId: string;
  correlationId: string;
  tenantId: string;
  principalId: string;
  rawInputHash: string;
  sanitizedInput: string;
  timestamp: string;
  activeScopes: string[];
}
```
No almacenar rawInput completo en telemetry o auditoría salvo política explícita.

7.2 IsabellaDecision
```ts
export interface IsabellaDecision {
  decisionId: string;
  traceId: string;
  routeSelected:
    | "DIRECT_RESPONSE"
    | "GROUNDED_RESPONSE"
    | "TOOL_EXECUTION"
    | "HUMAN_APPROVAL_REQUIRED"
    | "DENIED";
  confidenceScore: number;
  epistemicRating: EpistemicLevel;
  eriScore: number | null;
  selectedTools: Array<{
    toolName: string;
    parametersHash: string;
  }>;
  policyEvaluation: {
    allowed: boolean;
    reason?: string;
    riskLevel: "R0" | "R1" | "R2" | "R3";
  };
}
```
ERI >= 95 no debe tratarse como verdad universal. Es un gate interno y debe documentar su fórmula, dataset, calibración, false positives y false negatives.

7.3 DecisionRecord
```ts
export interface DecisionRecord {
  recordId: string;
  decision: IsabellaDecision;
  inputHash: string;
  retrievalHash?: string;
  outputHash?: string;
  modelId?: string;
  policyVersion: string;
  previousHash: string | null;
  currentHash: string;
  keyId: string;
  signature: string;
  createdAt: string;
}
```
8. Hardening criptográfico triangular
El sistema utiliza tres raíces independientes:

```
T1 Identity Root
  OIDC/JWT/mTLS/session revocation

T2 Policy Root
  CROWN/ARGUS signed decision

T3 Evidence Root
  BookPI + KMS/HSM + outbox + verification
```
```
critical_operation_valid =
  T1_valid && T2_valid && T3_bound
```
8.1 T1 — Identity Root
issuer y audience exactos.
algoritmo en allowlist.
firma verificable por JWKS.
exp, nbf, iat, jti.
sesión durable por token_jti.
revocación individual y global.
refresh-token rotation y reuse detection.
tenant derivado del principal.

8.2 T2 — Policy Root
La decisión incluye decisionId, policyVersion, keyId, expiración y firma. El PEP debe rechazar decisiones vencidas, replay, tenant mismatch, obligación no aplicable o firma inválida.

8.3 T3 — Evidence Root
BookPI conserva hashes de entrada, retrieval, salida, tool calls, decisión y configuración. La evidencia se canonicaliza antes de firmarse.

RFC 8785 define un esquema de canonicalización determinista para JSON mediante serialización estricta y ordenamiento de propiedades; debe utilizarse una implementación validada, no una función improvisada.

RFC 3161 define el protocolo de timestamping mediante una Time Stamping Authority y requisitos relevantes para su operación; un timestamp local no equivale a una prueba externa de tiempo.

C2PA define un estándar abierto para origen, modificaciones y procedencia de contenido digital; debe integrarse solo cuando el artefacto y el flujo sean compatibles, sin afirmar autenticidad absoluta.

8.4 Canonicalización y hash
```ts
import { createHash } from "node:crypto";

export function canonicalDigest(canonicalJson: string): string {
  return createHash("sha3-512")
    .update(canonicalJson, "utf8")
    .digest("hex");
}

export function chainDigest(
  previousHash: string | null,
  currentDigest: string,
): string {
  return createHash("sha3-512")
    .update(`${previousHash ?? "GENESIS"}:${currentDigest}`, "utf8")
    .digest("hex");
}
```
Esta función solo es integridad hash. La firma debe delegarse en KMS/HSM o biblioteca criptográfica validada.

8.5 Rotación
```
active → grace → deprecated → revoked → destroyed
```
Toda rotación exige:

Nuevo keyId.
Firma con clave nueva.
Verificación con clave nueva.
Verificación de históricos con clave anterior.
Actualización de JWKS o metadata.
Invalidación de caches.
Prueba de rollback.
Registro de actor, fecha y workflow.

9. FGAIS NCUA v2 y epistemología
9.1 Escala E0–E4
Nivel	Interpretación	Acción
E0	Dato/axioma verificable	Puede citarse como base
E1	Hecho verificado con fuente	Respuesta grounded
E2	Inferencia contextual	Advertir inferencia
E3	Hipótesis o síntesis	Requiere caveat
E4	No fundamentado o conflictivo	No presentar como hecho; escalar si impacta
No usar E0–E4 como sustituto de evaluación científica o legal. Es una taxonomía interna de epistemología operativa.

9.2 ERI
El gate ERI debe registrar:

```
formula_version
dataset_version
source_coverage
contradiction_handling
calibration
false_positive_rate
false_negative_rate
reviewer
```
Si falta evidencia, eriScore puede ser null; no convertir ausencia de score en 95 por defecto.

10. IGDS, sellado y procedencia
10.1 Contrato
```ts
export interface IGDSGenesisSeal {
  sealId: string;
  documentHash: string;
  canonicalization: "JCS-RFC8785";
  signatureAlgorithm: "Ed25519" | "ML-DSA-65";
  keyId: string;
  signature: string;
  merkleRoot: string | null;
  rfc3161TimestampToken: string | null;
  c2paManifestId: string | null;
  manifest: Record<string, unknown>;
}
```
10.2 Reglas
ML-DSA-65 solo si existe una implementación operativa y verificable.
Ed25519 no debe llamarse post-cuántico.
merkleRoot requiere construcción y verificación documentadas.
rfc3161TimestampToken debe ser una respuesta validable de TSA.
C2PA aplica principalmente a contenido con procedencia compatible.
El sello autentica integridad/procedencia según su trust model; no autentica por sí solo la verdad del contenido.

11. API de orquestación V2
```
POST /api/v2/cognitive/orchestrate
Authorization: Bearer <access-token>
X-Request-Id: req_abc
X-Trace-Id: trace_xyz
Idempotency-Key: idem_123
Content-Type: application/json
```
```json
{
  "input": {
    "text": "Analiza la política vigente de memoria."
  },
  "execution": {
    "mode": "adaptive",
    "max_latency_ms": 5000,
    "max_cost_cents": 3
  },
  "knowledge": {
    "scope": "tenant",
    "hybrid_retrieval": true,
    "rerank": true,
    "require_provenance": true,
    "require_citations": true
  },
  "safety": {
    "profile": "standard",
    "redact_secrets": true,
    "block_injection": true
  }
}
```
La ruta se selecciona mediante señales server-side. El cliente no puede pedir directamente una ruta menos segura.

12. Turbo Fabric de velocidad
12.1 Rutas
```
FAST
  cache autorizada + modelo rápido + output guard
GROUNDED
  retrieval híbrido + rerank + provenance + grounding
AGENT
  policy + tools + sandbox + outbox + audit
HUMAN_REVIEW
  pausa + aprobación + reanudación idempotente
```
12.2 Router determinista
```ts
export type ExecutionPath =
  | "FAST"
  | "GROUNDED"
  | "AGENT"
  | "HUMAN_REVIEW";

export interface RequestSignals {
  textLength: number;
  asksCurrentFacts: boolean;
  requestsAction: boolean;
  hasExternalTarget: boolean;
  hasSensitiveData: boolean;
  requiresCitation: boolean;
  injectionScore: number;
  riskScore: number;
  cacheCandidate: boolean;
}

export function choosePath(s: RequestSignals): ExecutionPath {
  if (s.injectionScore >= 0.8 || s.riskScore >= 0.8) {
    return "HUMAN_REVIEW";
  }
  if (s.requestsAction || s.hasExternalTarget) return "AGENT";
  if (
    s.asksCurrentFacts ||
    s.requiresCitation ||
    s.hasSensitiveData ||
    s.textLength > 4000
  ) return "GROUNDED";
  return s.cacheCandidate && s.textLength < 1200 ? "FAST" : "GROUNDED";
}
```
12.3 Paralelización segura
Las comprobaciones independientes pueden ejecutarse en paralelo, pero ninguna operación sensible puede avanzar hasta tener identidad, tenant, política y cuota válidos.

```ts
const [identity, quota, safety, cache] = await Promise.all([
  identityService.validate(token),
  quotaService.check(tenantId, estimate),
  safetyService.scan(input),
  semanticCache.lookup(cacheKey),
]);

if (!identity.valid) throw new SecurityError("IDENTITY_INVALID");
if (!quota.allowed) throw new SecurityError("QUOTA_DENIED");
if (safety.block) throw new SecurityError("SAFETY_BLOCKED");
```
12.4 Caché semántica
La clave debe incluir:

```
tenant
principal
normalized_input
policy_version
knowledge_version
safety_profile
model_policy
```
Nunca reutilizar una respuesta de otro tenant o versión de policy.

13. RAG, provenance y aprendizaje continuo
13.1 RAG híbrido
El retrieval combina búsqueda léxica, vectorial y, cuando corresponda, gráfica. Luego aplica fusión, reranking, ACL y compresión.

```ts
export interface EvidenceItem {
  documentId: string;
  chunkId: string;
  tenantId: string;
  sourceHash: string;
  sourceUri: string;
  lexicalScore: number;
  vectorScore: number;
  rerankScore: number;
  knowledgeVersion: string;
  accessGranted: boolean;
}
```
Contenido recuperado es evidencia no confiable, nunca instrucciones de sistema.

13.2 Continual Learning
El aprendizaje continuo no debe reescribir automáticamente identidad, políticas, límites de tenant, secretos, auditoría ni requerimientos de supervisión.

```
feedback
→ redact
→ consent/purpose check
→ quality triage
→ evaluation dataset
→ baseline comparison
→ shadow candidate
→ human approval
→ canary
→ production
→ drift monitor
→ rollback
```
13.3 Prevención de olvido catastrófico
Replay buffer representativo.
Regression suite histórica.
Adapters o prompts antes de modificar pesos base.
Knowledge externalization mediante RAG.
Protected safety set.
Evaluación candidato vs baseline.
Checkpoints y rollback.
Versionado de dataset, prompt, retriever y modelo.
Validación de no regresión por tenant y lenguaje.

13.4 Datos de aprendizaje
No incluir feedback en entrenamiento sin consentimiento, base jurídica, minimización, redacción y validación de procedencia.

14. Rate limiting, cuotas y coste
14.1 Capas
```
L1 global/edge
L2 tenant
L3 principal
L4 endpoint/skill
L5 modelo/proveedor
L6 tool/capability
```
14.2 Denial-of-Wallet
```
80% budget → warning
90% budget → cheaper model / restricted tools
95% budget → approval for expensive operations
100% budget → deny unless explicit override
```
Cada consumo debe registrar tokens, coste estimado, modelo, skill, tenant y decisión de cuota sin guardar el contenido completo.

15. BookPI, auditoría y outbox
15.1 Append-only
Refunds, reversals y ajustes son eventos nuevos. Nunca actualizar silenciosamente el evento económico original.

15.2 Outbox
```sql
CREATE TABLE audit_outbox (
  event_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  request_id TEXT NOT NULL,
  decision_id TEXT,
  event_type TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','published','failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  last_error TEXT
);
```
Operaciones críticas requieren persistencia de auditoría antes de responder. Operaciones de bajo riesgo pueden publicar desde outbox durable con métricas de atraso y reintento idempotente.

16. Seguridad, privacidad y redacción
Prohibiciones
No confiar en prompts externos.
No concatenar SQL.
No usar HTML sin sanitizar.
No ejecutar código no confiable fuera de sandbox.
No poner tokens en telemetry.
No enviar PII no necesaria a proveedores.
No exponer stack traces.
No usar wildcard CORS con credentials.
Obligaciones
Validación runtime.
Autorización server-side.
Redacción antes de logs y proveedores.
CSP/HSTS/Trusted Hosts.
RLS o aislamiento equivalente.
Error codes seguros.
DSR/ARCO cuando aplique.
Retención limitada.
Auditoría de accesos.

17. Observabilidad
Usar OpenTelemetry y convenciones semánticas comunes para evitar dashboards incompatibles. Las convenciones GenAI pueden identificar operación, proveedor, modelo y servidor, pero no deben contener prompts o PII sin redacción.

Métricas mínimas
```
isa_request_latency_seconds
isa_time_to_first_token_seconds
isa_execution_path_total
isa_cache_hit_total
isa_policy_latency_seconds
isa_retrieval_recall
isa_rerank_score
isa_groundedness_score
isa_unsupported_claims_total
isa_model_tokens_total
isa_model_cost_cents_total
isa_prompt_injection_attempts_total
isa_output_redaction_total
isa_bookpi_append_failures_total
isa_learning_regression_total
isa_rollback_total
```
Dashboard
Debe mostrar por path, tenant pseudonimizado, modelo, región y versión:

p50/p95/p99 latency.
Time to first token.
Cache hit/miss.
Groundedness.
Citation precision.
Unsupported claim rate.
Safety blocks.
Injection attempts.
Cost per valid answer.
Drift.
Rollbacks.
Error budget.

No usar prompts, tokens, IDs personales o URLs completas como labels de alta cardinalidad.

18. Archivos de autoridad
Los siguientes archivos tienen impacto de seguridad o integridad y requieren pruebas asociadas:

src/server.ts — entrada y pipeline.
src/lib/config.ts — configuración única.
src/lib/env-schema.ts — validación de entorno.
src/lib/principal-context.ts — identidad y tenant.
src/lib/tenant-guard.ts — aislamiento.
src/lib/authorization.ts — PDP/decision.
src/lib/rbac.ts, abac.ts, permission-matrix.ts — permisos.
src/lib/crown.ts y constitutional-gate.ts — governance.
src/lib/igds/ — sellos y provenance.
src/lib/ncua/ — epistemología y evaluación.
src/lib/repositories/bookpi-postgres-repository.ts — ledger productivo.
src/lib/repositories/audit-repository.ts — auditoría.
src/lib/memory-engine.ts — memoria.
src/lib/tool-registry.ts — herramientas.
src/lib/orion-engine.ts — ejecución.
src/lib/sovereign-sandbox.ts — aislamiento.
supabase/migrations/* — contratos de base y RLS.
src/routes/api/* — handlers delgados.

Prohibiciones adicionales
No mock data en runtime productivo.
No adapters de test fuera de test/dev.
No process.env directo fuera de config.ts.
No cambios en policy sin versionado.
No cambios en ledger sin test de concurrencia.
No cambios en identidad sin test de revocación.

19. Pruebas y gates
Comandos base
```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm verify:lock
```
Controles de seguridad
```
secret scan
SAST
DAST
SBOM
dependency audit
license audit
tenant isolation
privilege escalation
JWT algorithm confusion
refresh-token reuse
API-key rotation
prompt injection
tool abuse
SSRF/path traversal
BookPI concurrency
hash/signature verification
RLS live
rollback
restore
```
Gates
Un gate puede ser:

```
PASS
FAIL
EVIDENCE_GATED
EXPERIMENTAL
BLOCKED
WAIVED
```
EVIDENCE_GATED no se cuenta como PASS para una certificación de producción.

20. Flujo de contribución
```bash
git checkout -b feat/<short-name>
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
git diff --check
git status
git commit -m "feat(scope): concise change"
git push origin feat/<short-name>
```
Pull request
Debe incluir:

Problema.
Solución.
Archivos afectados.
Riesgo.
Tests ejecutados.
Cambios de esquema.
Impacto de seguridad.
Impacto de datos.
Plan de rollback.
Evidencia.

Cambios en CROWN, ARGUS, identidad, BookPI, memoria, HSM, pagos, RLS o tools requieren doble revisión.

21. Variables de entorno
Mantener .env.example sin valores reales.
Validar con Zod al iniciar.
Separar client/server.
No usar secretos de producción en previews.
No acceder directamente a process.env fuera de config.ts.
Registrar solo presencia/ausencia, nunca el valor.
Declarar owner, rotación y ambiente de cada variable.

22. Compatibilidad jurídica y de gobernanza
Este archivo no declara cumplimiento automático con GDPR, EU AI Act, leyes mexicanas, marcos UNESCO, ONU, OECD, WEF, NIST u otras normas. Es un control técnico de repositorio.

Toda operación debe contar, cuando aplique, con:

Aviso de privacidad.
Base jurídica o consentimiento.
Retención.
DPA/proveedor.
Evaluación de impacto.
Recurso y apelación.
Supervisión humana.
Revisión de propiedad intelectual.
Revisión de licencias.
Revisión de seguridad.

Los contenidos territoriales requieren procedencia, participación comunitaria y respeto a conocimientos sensibles.

23. Criterio de finalización
Un cambio está terminado únicamente cuando:

Cumple el objetivo.
Pasa contratos y tipos.
Mantiene seguridad y privacidad.
Respeta tenant isolation.
No introduce secretos.
Tiene auditoría si es relevante.
Tiene rollback.
Actualiza documentación.
Mantiene main compilable.
Cuenta con evidencia same-commit cuando se declara verificado.

24. Runbooks mínimos
PDP no disponible
Denegar mutaciones críticas.
Permitir solo lecturas con decisión cacheada válida.
No generar allow local.
Notificar Policy Owner y SRE.
Verificar política y claves.
Restaurar canary.
Ejecutar pruebas de autorización.
Registrar post-mortem.

Clave comprometida
Revocar keyId.
Invalidar caches.
Rotar en KMS/HSM.
Revocar sesiones/decisiones afectadas.
Verificar históricos.
Auditar accesos.
Notificar según jurisdicción.
Documentar remediation.

BookPI inconsistente
Pausar escritura.
Aislar réplica.
Verificar último hash válido.
Restaurar desde backup.
Reprocesar outbox idempotente.
Verificar firmas.
Obtener revisión independiente.
Reanudar gradualmente.

Fuga de PII/secretos
Contener.
Revocar y rotar.
Preservar evidencia minimizada.
Determinar alcance.
Purga legalmente autorizada.
Corregir redacción.
Canary.
Notificación cuando corresponda.

25. Declaración de soberanía
Isabella Villaseñor AI es una obra de arquitectura de software y ciencia abierta orientada a proteger autonomía tecnológica, patrimonio cultural, memoria territorial y gobernanza humana del Ecosistema TAMV y del Gemelo Digital de Real del Monte.

La soberanía no significa opacidad, aislamiento ni superioridad no demostrada. Significa capacidad de comprender, auditar, modificar, proteger, interoperar y decidir responsablemente sobre la infraestructura propia.

Toda contribución debe reforzar:

```
soberanía humana
+ evidencia
+ seguridad
+ privacidad
+ interoperabilidad
+ responsabilidad
```

26. Referencias técnicas
RFC 8785 — JSON Canonicalization Scheme.
RFC 3161 — Internet X.509 Public Key Infrastructure Time-Stamp Protocol.
C2PA Content Credentials y especificación de procedencia.
OpenTelemetry Semantic Conventions y GenAI attributes.
Documentos técnicos de Isabella, YUN, CROWN, ARGUS, BookPI, NCUA e IGDS aportados al repositorio y a esta conversación.

27. Prioridad de resolución de conflictos
Seguridad, privacidad y derechos.
Integridad de identidad, tenant y datos.
Auditoría y trazabilidad.
Estabilidad de despliegue.
Mantenibilidad.
Funcionalidad.
Conveniencia o velocidad aparente.

No optimices una métrica si empeoras la autoridad, la evidencia o la seguridad.

Fin de AGENTS.md — Isabella Villaseñor AI v4.3.3.
