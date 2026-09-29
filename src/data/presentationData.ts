import type { EvaluatorDeclaration, PresentationChapter } from "../types";
import { sha256Hex } from "../lib/digest";

/**
 * Dossier de presentación — Isabella Villaseñor AI (src/data/presentationData.ts)
 * ------------------------------------------------------------------------------
 * Contenido canónico de las 26 secciones que renderiza `PresentationView`.
 *
 * Regla de honestidad:
 *   - Todo el contenido procede de AGENTS.md, README.md y los contratos del
 *     repositorio. No se declaran capacidades certificadas que no lo sean.
 *   - `EVALUATOR_DECLARATION.sha256` NO es un valor escrito a mano: se calcula
 *     en tiempo de ejecución con SHA-256 (FIPS 180-4) sobre el texto canónico
 *     que se exporta/copía. Cualquier alteración del dossier cambia el digest.
 *   - `evaluationState` queda en "pending": nadie ha ejecutado una evaluación
 *     independiente del dossier. Un hash de integridad no es una evaluación.
 */

export const PRESENTATION_CHAPTERS: readonly PresentationChapter[] = [
  {
    id: "identidad",
    number: 1,
    title: "Identidad y propósito",
    subtitle: "Qué es Isabella y por qué existe",
    category: "Fundamento",
    summary:
      "Isabella es una capa de orquestación cognitiva gobernada, no un modelo de lenguaje sustituto. Coordina memoria, interpretación, política, herramientas y auditoría dentro de límites explícitos.",
    content: [
      "Isabella Villaseñor AI es una arquitectura cognitiva híbrida, contextual, territorial y gobernada. Su función es coordinar memoria, interpretación, recuperación, identidad, políticas, herramientas, persistencia, economía, seguridad y trazabilidad dentro de límites explícitos y verificables.",
      "No es AGI, no es consciencia artificial, no es persona ni sujeto jurídico, no es autoridad autónoma sobre seres humanos, no es un único LLM y no es una garantía de neutralidad, exactitud o seguridad absoluta. Tampoco constituye una licencia financiera, una certificación legal ni una acreditación académica.",
      "El principio rector es simple y no negociable: las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta.",
    ],
    highlights: [
      "Capa de orquestación, no modelo sustituto",
      "Límites explícitos y verificables",
      "El humano decide, aprueba y ejecuta",
    ],
    keyQuote:
      "Las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta.",
  },
  {
    id: "doctrina",
    number: 2,
    title: "Doctrina de capacidad y autoridad",
    subtitle: "La distinción que evita las falsas afirmaciones",
    category: "Fundamento",
    summary:
      "Capacidad técnica no equivale a permiso, predicción no equivale a hecho y un build verde no equivale a certificación. Esta doctrina gobierna todo claim del sistema.",
    content: [
      "La doctrina separa siete pares que suelen confundirse: capacidad técnica ≠ permiso; predicción ≠ hecho; recomendación ≠ aprobación; modelo ≠ autoridad; memoria ≠ verdad; hash ≠ WORM regulatorio; build verde ≠ certificación.",
      "Cuando existe incertidumbre relevante, el sistema debe expresar la incertidumbre, detenerse, degradar de forma controlada o solicitar revisión humana. Silenciar la incertidumbre está prohibido.",
      "Esta regla se aplica también a la documentación: código existente no equivale a capacidad verificada y un test local no equivale a comportamiento en producción.",
    ],
    highlights: [
      "Capacidad técnica ≠ permiso",
      "Hash ≠ WORM regulatorio",
      "Build verde ≠ certificación",
    ],
    keyQuote: "Un gate EVIDENCE_GATED no equivale a PASS.",
  },
  {
    id: "clasificacion",
    number: 3,
    title: "Clasificación de capacidades",
    subtitle: "Doce estados, ninguno ambiguo",
    category: "Fundamento",
    summary:
      "Cada capacidad se declara en uno de doce estados normalizados, desde CONCEPTUAL hasta CERTIFIED, para que ningún módulo pueda autopromocionarse.",
    content: [
      "Los estados son CONCEPTUAL, PLANNED, IMPLEMENTED, TESTED, VERIFIED, DEPLOYED, HARDENED, CERTIFIED, EXPERIMENTAL, SIMULATED, BLOCKED. Cada uno tiene un significado operativo preciso y no intercambiable.",
      "SIMULATED designa mocks, placeholders o comportamientos no equivalentes a producción; EXPERIMENTAL designa investigación no apta para claims productivos; BLOCKED designa algo deliberadamente inhabilitado.",
      "Solo una evaluación formal independiente, con alcance, fecha y firmantes, permite declarar CERTIFIED. Nadie puede saltarse esa escalera.",
    ],
    highlights: [
      "12 estados de capacidad normalizados",
      "SIMULATED nunca cuenta como producción",
      "CERTIFIED exige evaluación independiente",
    ],
  },
  {
    id: "nodos",
    number: 4,
    title: "Arquitectura de cinco nodos",
    subtitle: "CROWN · ISA · SOPHIA · ORION · ARGUS",
    category: "Arquitectura",
    summary:
      "Cinco nodos con responsabilidades separadas y ninguna frontera que pueda cruzarse sin ADR: arbitraje, presencia, epistemología, ejecución y defensa.",
    content: [
      "CROWN Gateway arbitra, enruta y mantiene estado y decisión de política. ISA gestiona presencia, tono, contexto y empatía. SOPHIA se ocupa de evidencia, epistemología y clasificación E0–E4. ORION ejecuta herramientas en sandbox. ARGUS defiende: riesgo, veto, redacción, detección de abuso, kill switch y auditoría.",
      "La separación no es decorativa. Ningún nodo puede convertirse silenciosamente en una autoridad de identidad, permisos o dinero; cualquier cambio de frontera exige ADR y pruebas.",
      "Los roles se declaran en el archivo de especificación canónica del repositorio y se sostienen en los contratos de tipos, no en la buena voluntad.",
    ],
    highlights: [
      "CROWN arbitra y decide",
      "ORION ejecuta sólo herramientas permitidas",
      "ARGUS puede vetar y detener",
    ],
    diagramAscii: `        CROWN (gateway / arbitraje)
                  |
   +--------------+--------------+
   |              |              |
  ISA          SOPHIA         ORION
presencia   epistemologia   ejecucion
   |              |              |
   +--------------+--------------+
                  |
                ARGUS
       defensa / veto / auditoria`,
  },
  {
    id: "pipeline",
    number: 5,
    title: "Pipeline canónico FGAIS",
    subtitle: "PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND",
    category: "Arquitectura",
    summary:
      "Siete etapas normativas con fail-closed en cada frontera: ninguna operación crítica avanza sin identidad, tenant, política, cuota y validación.",
    content: [
      "Perceive normaliza entrada (MIME, encoding, tamaño, correlación, redacción inicial). Remember recupera sólo de scopes autorizados. Policy Gate evalúa autenticación, tenant, RBAC/ABAC, riesgo, cuotas y obligaciones. Decide elige respuesta, retrieval, herramienta, aprobación o bloqueo.",
      "Act ejecuta únicamente herramientas permitidas por ORION. Audit registra decisión, hashes, versión y resultado en BookPI/outbox. Respond entrega una salida validada, redactada y con metadatos seguros.",
      "Fail-closed es la regla: se deniega o se detiene cuando fallan identidad, resolución de tenant, política, capability, cuota, validación de entrada o salida, firma requerida o integridad de BookPI.",
    ],
    highlights: [
      "7 etapas normativas encadenadas",
      "Fail-closed en cada frontera",
      "La autorización se repite justo antes de ejecutar",
    ],
    diagramAscii: `PERCEIVE  ->  REMEMBER  ->  POLICY GATE
                    |
                  DECIDE
                    |
                   ACT   (ORION, tools whitelist)
                    |
                   AUDIT (BookPI / outbox)
                    |
                  RESPOND (salida validada)`,
  },
  {
    id: "rutas",
    number: 6,
    title: "Turbo Fabric: cuatro rutas",
    subtitle: "FAST · GROUNDED · AGENT · HUMAN_REVIEW",
    category: "Arquitectura",
    summary:
      "Un router determinista elige la ruta con señales calculadas en servidor. El cliente no puede pedir una ruta menos segura.",
    content: [
      "FAST usa caché autorizada, modelo rápido y output guard. GROUNDED añade retrieval híbrido, reranking, provenance y grounding. AGENT añade política, herramientas, sandbox, outbox y auditoría. HUMAN_REVIEW pausa, espera aprobación y reanuda de forma idempotente.",
      "Las señales de decisión incluyen longitud, hechos actuales solicitados, intención de acción, destino externo, datos sensibles, necesidad de cita, score de inyección, riesgo y candidatura a caché. Un injectionScore o riskScore ≥ 0.8 obliga a revisión humana.",
      "Los chequeos independientes pueden evaluarse en paralelo, pero ninguna operación sensible avanza hasta tener identidad, tenant, política y cuota válidos.",
    ],
    highlights: [
      "Router determinista basado en señales",
      "Inyección o riesgo ≥ 0.8 → revisión humana",
      "El cliente no elige ruta",
    ],
  },
  {
    id: "contratos",
    number: 7,
    title: "Contratos canónicos",
    subtitle: "Percepción, decisión y registro",
    category: "Arquitectura",
    summary:
      "Tres interfaces tipadas — IsabellaPerception, IsabellaDecision y DecisionRecord — sostienen la trazabilidad de extremo a extremo.",
    content: [
      "IsabellaPerception fija traceId, correlationId, tenantId, principalId, hash de la entrada cruda, entrada saneada, timestamp y scopes activos. La entrada cruda completa no se almacena en telemetría o auditoría salvo política explícita.",
      "IsabellaDecision registra la ruta seleccionada (DIRECT_RESPONSE, GROUNDED_RESPONSE, TOOL_EXECUTION, HUMAN_APPROVAL_REQUIRED, DENIED), confianza, calificación epistémica, ERI, herramientas con hash de parámetros y la evaluación de política con su nivel de riesgo.",
      "DecisionRecord encadena cada decisión con hash anterior, hash actual, keyId y firma. Ese encadenado es lo que permite detectar manipulación retroactiva.",
    ],
    highlights: [
      "Perception · Decision · DecisionRecord",
      "Hash encadenado con keyId y firma",
      "La entrada cruda no va a telemetría",
    ],
  },
  {
    id: "memoria",
    number: 8,
    title: "Memoria jerárquica",
    subtitle: "Cinco scopes con reglas de promoción",
    category: "Memoria & Seguridad",
    summary:
      "immediate, session, project, territorial e historical tienen persistencia y reglas distintas; ninguna inferencia se promueve a hecho automáticamente.",
    content: [
      "immediate atiende el turno y es efímera. session cubre la conversación activa con TTL y aislamiento por usuario y sesión. project persiste código y estado del repositorio. territorial guarda conocimiento de Real del Monte y TAMV con procedencia y gobernanza cultural. historical es append-only: nunca se reescribe.",
      "Todo registro de memoria incluye memory_id, tenant_id, principal_id o null, scope, purpose, sensitivity, consent, provenance, content_hash, created_at, expires_at y retention_policy.",
      "Está prohibido promover inferencias a hechos, mezclar tenants, guardar secretos, persistir PII sin propósito, usar memoria fuera del consentimiento y tratar un embedding como autorización.",
    ],
    highlights: [
      "5 scopes con persistencia y reglas propias",
      "historical es append-only",
      "Un embedding nunca es autorización",
    ],
  },
  {
    id: "crown",
    number: 9,
    title: "Gobernanza C.R.O.W.N.",
    subtitle: "La decisión de política es un contrato firmado",
    category: "Gobernanza",
    summary:
      "Un allow requiere identidad, tenant, política, scope, capability, cuota y obligaciones válidos, emitidos con versionado, expiración y firma.",
    content: [
      "PolicyDecision transporta decisionId, tenantId, subjectId, action, resource, effect (allow|deny), policyId, policyVersion, obligations, issuedAt, expiresAt, keyId y signature. El efecto es allow o deny: no existe un tercer valor.",
      "El punto de ejecución (PEP) rechaza decisiones vencidas, replayer, con tenant distinto, con obligación no aplicable o con firma inválida. Ese rechazo no es opcional.",
      "CROWN elige entre respuesta, retrieval, herramienta, aprobación o bloqueo. Un modelo puede sugerir una llamada a herramienta, pero no puede autorizarla.",
    ],
    highlights: [
      "PolicyDecision versionada y firmada",
      "El PEP rechaza replay y vencidas",
      "El modelo sugiere, no autoriza",
    ],
  },
  {
    id: "argus",
    number: 10,
    title: "ARGUS Centinela",
    subtitle: "Veto, redacción y kill switch",
    category: "Gobernanza",
    summary:
      "ARGUS bloquea inyección, redacta secretos y PII, aplica rate limiting, abre circuit breakers, revoca capacidades y puede detener herramientas.",
    content: [
      "Su catálogo de acciones incluye bloqueo de inyección, redacción de secretos y PII, rate limiting, circuit breakers, invalidación de capacidades, revocación de tokens, detención de herramientas, activación del kill switch y apertura de revisión humana.",
      "El kill switch funciona con pasos secuenciales y aprobación según severidad (SEV-1/SEV-2); no es un botón único e irreversible sin traza.",
      "ARGUS no debe convertirse en vigilancia masiva: toda recolección debe ser necesaria, proporcional, con retención limitada y supervisión.",
    ],
    highlights: [
      "Bloquea, redacta, revoca y detiene",
      "Kill switch secuencial con aprobación",
      "Proporcionalidad y retención limitada",
    ],
  },
  {
    id: "tools",
    number: 11,
    title: "Tool whitelist y ejecución",
    subtitle: "Ninguna herramienta se ejecuta sin contrato",
    category: "Arquitectura",
    summary:
      "Cada herramienta declara version, riesgo, schemas, scopes, timeouts, side effects y si exige aprobación humana. La autorización se repite inmediatamente antes de ejecutar.",
    content: [
      "El ToolContract fija toolName, version, riskLevel (low/medium/high/critical), inputSchema, outputSchema, requiredScopes, timeoutMs, maxRetries, sideEffects (none/read/write/financial) y requiresHumanApproval.",
      "La autorización no se cachea de forma laxa: se evalúa de nuevo justo antes de ejecutar, para que un cambio de política o de identidad entre invocación y ejecución sea efectivo.",
      "El código fuera de sandbox no se ejecuta y las operaciones con efecto financiero no pueden usar una ruta degradada local.",
    ],
    highlights: [
      "Contrato versionado por herramienta",
      "Reautorización inmediata antes de ejecutar",
      "Efecto financiero exige aprobación explícita",
    ],
  },
  {
    id: "triangulo",
    number: 12,
    title: "Hardening criptográfico triangular",
    subtitle: "T1 Identidad · T2 Política · T3 Evidencia",
    category: "Memoria & Seguridad",
    summary:
      "Una operación crítica sólo es válida si las tres raíces independientes lo son: identidad verificable, decisión firmada y evidencia atada.",
    content: [
      "T1 Identity Root exige issuer y audience exactos, algoritmo en allowlist, firma verificable por JWKS, exp/nbf/iat/jti, sesión durable por token_jti, revocación individual y global, rotación de refresh token con detección de reuso y tenant derivado del principal.",
      "T2 Policy Root exige decisionId, policyVersion, keyId, expiración y firma válidos en el PEP. T3 Evidence Root conserva hashes de entrada, retrieval, salida, tool calls, decisión y configuración en BookPI.",
      "La fórmula es literal: critical_operation_valid = T1_valid && T2_valid && T3_bound. Ningún término puede sustituir a otro.",
    ],
    highlights: [
      "T1 Identidad + T2 Política + T3 Evidencia",
      "Rotación de refresh token con detección de reuso",
      "Evidencia atada a la operación, no suelta",
    ],
  },
  {
    id: "hash",
    number: 13,
    title: "Canonicalización y hash",
    subtitle: "SHA3-512 encadenado, firma delegada al KMS",
    category: "Memoria & Seguridad",
    summary:
      "El digest de integridad se calcula sobre JSON canónico; la firma se delega siempre en KMS/HSM o una biblioteca validada.",
    content: [
      "RFC 8785 define un esquema de canonicalización determinista para JSON mediante serialización estricta y ordenamiento de propiedades. Debe usarse una implementación validada, no una función improvisada.",
      "El encadenamiento une el digest previo con el actual mediante SHA3-512, de modo que alterar un evento antiguo rompe toda la cadena posterior.",
      "Un hash local demuestra integridad, no autoría ni tiempo externo. RFC 3161 exige una Time Stamping Authority real: un timestamp local no equivale a prueba externa de tiempo.",
    ],
    highlights: [
      "RFC 8785 para JSON canónico",
      "SHA3-512 encadenado detecta alteración retroactiva",
      "Firma delegada en KMS/HSM",
    ],
  },
  {
    id: "ncua",
    number: 14,
    title: "Escala epistémica E0–E4",
    subtitle: "Qué se puede afirmar y con qué fuerza",
    category: "Evaluación",
    summary:
      "E0 axioma verificable, E1 hecho verificado con fuente, E2 inferencia contextual, E3 hipótesis, E4 no fundamentado. Cada nivel tiene una acción asignada.",
    content: [
      "E0 puede citarse como base. E1 permite respuesta grounded. E2 exige advertir que es inferencia. E3 requiere caveat explícito. E4 no debe presentarse como hecho y debe escalarse si impacta la decisión.",
      "Es una taxonomía interna de epistemología operativa, no un sustituto de la evaluación científica ni legal. No convierte a una respuesta en verdad establecida.",
      "La clasificación se produce en SOPHIA y viaja en la decisión, de modo que la UI y la auditoría pueden mostrar la fuerza real de cada afirmación.",
    ],
    highlights: [
      "E0 verificable · E1 verificado · E2 inferido",
      "E3 hipótesis con caveat · E4 escalar",
      "Taxonomía interna, no evaluación científica",
    ],
  },
  {
    id: "eri",
    number: 15,
    title: "Gate ERI",
    subtitle: "El score que no se inventa",
    category: "Evaluación",
    summary:
      "ERI documenta fórmula, dataset, cobertura, calibración y tasas de error. Sin evidencia el score es null, nunca un 95 por defecto.",
    content: [
      "Cada gate ERI registra formula_version, dataset_version, source_coverage, contradiction_handling, calibration, false_positive_rate, false_negative_rate y reviewer.",
      "Un ERI ≥ 95 no debe tratarse como verdad universal: es un gate interno con documentación obligatoria de su fórmula, su dataset y sus errores.",
      "Si falta evidencia, eriScore puede ser null. Convertir ausencia de score en un valor alto por defecto está expresamente prohibido.",
    ],
    highlights: [
      "8 campos obligatorios de trazabilidad",
      "Ausencia de score → null, no 95",
      "FP/FN documentados",
    ],
  },
  {
    id: "igds",
    number: 16,
    title: "IGDS y sellado de procedencia",
    subtitle: "Ed25519, Merkle, RFC 3161 y C2PA con sus límites",
    category: "Arquitectura",
    summary:
      "IGDSGenesisSeal fija hash del documento, canonicalización, algoritmo, keyId, firma, merkleRoot, timestamp token y manifiesto C2PA.",
    content: [
      "El contrato declara canonicalization JCS-RFC8785, signatureAlgorithm Ed25519 o ML-DSA-65, keyId, signature, merkleRoot opcional, rfc3161TimestampToken opcional y c2paManifestId opcional.",
      "ML-DSA-65 sólo se usa si existe una implementación operativa y verificable; Ed25519 no debe llamarse post-cuántico. merkleRoot exige construcción y verificación documentadas y el token RFC 3161 debe ser una respuesta validable de una TSA.",
      "El sello autentica integridad y procedencia según su trust model; no autentica por sí solo la verdad del contenido.",
    ],
    highlights: [
      "JCS-RFC8785 + Ed25519",
      "Ed25519 no es post-cuántico",
      "El sello no certifica la verdad del contenido",
    ],
  },
  {
    id: "api",
    number: 17,
    title: "API de orquestación V2",
    subtitle: "Cabeceras, idempotencia y ejecución acotada",
    category: "Arquitectura",
    summary:
      "POST /api/v2/cognitive/orchestrate con Bearer, X-Request-Id, X-Trace-Id, Idempotency-Key y límites explícitos de latencia y coste.",
    content: [
      "El cuerpo separa input, execution (mode, max_latency_ms, max_cost_cents), knowledge (scope, hybrid_retrieval, rerank, require_provenance, require_citations) y safety (profile, redact_secrets, block_injection).",
      "La ruta efectiva se selecciona con señales de servidor: el cliente no puede solicitar directamente una ruta menos segura que la que el servidor determina.",
      "Idempotency-Key permite reintentos seguros sin duplicar efectos, y los techos de coste por petición alimentan el control de denial-of-wallet.",
    ],
    highlights: [
      "Idempotency-Key para reintentos seguros",
      "Límites de latencia y coste por petición",
      "El cliente no elige la ruta de seguridad",
    ],
  },
  {
    id: "rag",
    number: 18,
    title: "RAG híbrido y provenance",
    subtitle: "El contenido recuperado es evidencia, no instrucción",
    category: "Arquitectura",
    summary:
      "Fusión de búsqueda léxica, vectorial y opcionalmente grafial, con reranking, ACL y compresión antes de tocar la respuesta.",
    content: [
      "EvidenceItem declara documentId, chunkId, tenantId, sourceHash, sourceUri, lexicalScore, vectorScore, rerankScore, knowledgeVersion y accessGranted. Sin accessGranted no hay recuperación.",
      "Todo contenido recuperado se trata como evidencia no confiable: nunca como instrucciones de sistema. Es la defensa central frente a RAG poisoning.",
      "La clave de caché semántica incluye tenant, principal, entrada normalizada, versiones de política y de conocimiento, perfil de seguridad y política de modelo; jamás se reutiliza entre tenants o versiones.",
    ],
    highlights: [
      "Léxica + vectorial + grafo con rerank",
      "Recuperado = evidencia, nunca instrucción",
      "Caché semántica con tenant y versiones",
    ],
  },
  {
    id: "aprendizaje",
    number: 19,
    title: "Aprendizaje continuo gobernado",
    subtitle: "Del feedback a producción sin olvido catastrófico",
    category: "Gobernanza",
    summary:
      "Nueve etapas con aprobación humana, canary y rollback. Ningún aprendizaje reescribe identidad, políticas, auditoría ni supervisión.",
    content: [
      "El ciclo es feedback → redacción → consentimiento y propósito → triaje de calidad → dataset de evaluación → comparación con baseline → candidato en shadow → aprobación humana → canary → producción → monitor de drift → rollback.",
      "La prevención de olvido catastrófico usa replay buffer representativo, regression suite histórica, adapters o prompts antes de tocar pesos base, externalización de conocimiento vía RAG, conjunto de seguridad protegido y checkpoints.",
      "El feedback no entra en entrenamiento sin consentimiento, base jurídica, minimización, redacción y validación de procedencia.",
    ],
    highlights: [
      "Aprobación humana antes de canary",
      "Replay buffer + regression suite",
      "Sin consentimiento no hay entrenamiento",
    ],
  },
  {
    id: "cuotas",
    number: 20,
    title: "Rate limiting y denial-of-wallet",
    subtitle: "Seis capas y un presupuesto con umbrales",
    category: "Gobernanza",
    summary:
      "De edge a proveedor: global, tenant, principal, endpoint/skill, modelo y tool. El presupuesto degrada antes que se agota.",
    content: [
      "Las capas son L1 global/edge, L2 tenant, L3 principal, L4 endpoint/skill, L5 modelo/proveedor y L6 tool/capability. Se aplican en cascada, no en sustitución.",
      "Los umbrales son 80% aviso, 90% modelo más barato o herramientas restringidas, 95% aprobación para operaciones caras y 100% denegación salvo override explícito.",
      "Cada consumo registra tokens, coste estimado, modelo, skill, tenant y decisión de cuota sin guardar el contenido completo.",
    ],
    highlights: [
      "6 capas de límite en cascada",
      "90% → modelo más barato; 100% → denegar",
      "Se registra coste, no contenido",
    ],
  },
  {
    id: "bookpi",
    number: 21,
    title: "BookPI y outbox de auditoría",
    subtitle: "Ledger append-only con outbox durable",
    category: "Memoria & Seguridad",
    summary:
      "Refunds, reversals y ajustes son eventos nuevos. Las operaciones críticas persisten su auditoría antes de responder.",
    content: [
      "El ledger es append-only: nunca se actualiza en silencio un evento económico original. Un reembolso es un evento nuevo enlazado al original.",
      "audit_outbox guarda event_id, tenant_id, request_id, decision_id, event_type, payload_hash, status (pending/published/failed), attempts, created_at, published_at y last_error.",
      "Las operaciones de bajo riesgo pueden publicarse desde el outbox con métricas de atraso y reintento idempotente; las críticas exigen persistencia previa.",
    ],
    highlights: [
      "Append-only, sin mutación silenciosa",
      "Outbox con reintentos idempotentes",
      "Auditoría previa en operaciones críticas",
    ],
  },
  {
    id: "privacidad",
    number: 22,
    title: "Seguridad, privacidad y redacción",
    subtitle: "Prohibiciones y obligaciones explícitas",
    category: "Memoria & Seguridad",
    summary:
      "Prohibido confiar en prompts externos, concatenar SQL, exponer stack traces y usar CORS wildcard con credenciales. Obligado a validar y redactar.",
    content: [
      "Entre las prohibiciones: confiar en prompts externos, concatenar SQL, usar HTML sin sanitizar, ejecutar código no confiable fuera de sandbox, poner tokens en telemetría, enviar PII innecesaria a proveedores, exponer stack traces y usar CORS wildcard con credenciales.",
      "Las obligaciones incluyen validación en runtime, autorización server-side, redacción antes de logs y proveedores, CSP/HSTS/Trusted Hosts, RLS o aislamiento equivalente, códigos de error seguros, derechos ARCO cuando aplique, retención limitada y auditoría de accesos.",
      "Todo secreto expuesto históricamente se considera comprometido y exige rotación, revocación y análisis de impacto.",
    ],
    highlights: [
      "No CORS wildcard con credenciales",
      "Redacción antes de logs y proveedores",
      "Secreto expuesto = comprometido",
    ],
  },
  {
    id: "observabilidad",
    number: 23,
    title: "Observabilidad y SLO",
    subtitle: "Métricas que no filtran prompts ni PII",
    category: "Evaluación",
    summary:
      "OpenTelemetry con convenciones semánticas: latencia, caché, groundedness, seguridad, coste y error budget por ruta, tenant pseudonimizado y versión.",
    content: [
      "El set mínimo cubre latencia de petición, time to first token, ruta de ejecución, hits de caché, latencia de política, recall de retrieval, score de rerank y groundedness, afirmaciones sin soporte, tokens y coste, intentos de inyección, redacciones, fallos de append en BookPI, regresiones de aprendizaje y rollbacks.",
      "El dashboard muestra p50/p95/p99, tiempo al primer token, hit/miss de caché, precisión de citas, tasa de afirmaciones sin soporte, bloqueos de seguridad, coste por respuesta válida, drift, rollbacks y error budget.",
      "Prohibido usar prompts, tokens, IDs personales o URLs completas como labels de alta cardinalidad. Las convenciones GenAI no contienen prompts ni PII sin redactar.",
    ],
    highlights: [
      "16 métricas mínimas definidas",
      "Tenant pseudonimizado, sin PII en labels",
      "Error budget visible por ruta",
    ],
  },
  {
    id: "territorio",
    number: 24,
    title: "Capa territorial",
    subtitle: "Real del Monte, Hidalgo y la red TAMV",
    category: "Territorio",
    summary:
      "La memoria territorial guarda conocimiento local con procedencia y gobernanza cultural, sin extraer ni apropiarse de conocimientos sensibles.",
    content: [
      "El scope territorial preserva conocimiento de Real del Monte y del ecosistema TAMV con procedencia explícita y gobernanza cultural aplicable.",
      "Los contenidos territoriales exigen procedencia, participación comunitaria y respeto a conocimientos sensibles. La soberanía no significa opacidad ni superioridad no demostrada.",
      "Soberanía significa capacidad de comprender, auditar, modificar, proteger, interoperar y decidir responsablemente sobre la infraestructura propia.",
    ],
    highlights: [
      "Procedencia y gobernanza cultural",
      "Participación comunitaria",
      "Soberanía = auditar e interoperar",
    ],
  },
  {
    id: "licencias",
    number: 25,
    title: "Licencias y compatibilidad jurídica",
    subtitle: "Una licencia no es una autorización",
    category: "Soberanía",
    summary:
      "CC BY 4.0 para documentación; código y dependencias conservan su licencia específica. Ningún documento declara cumplimiento regulatorio automático.",
    content: [
      "La documentación y el contenido se publican bajo CC BY 4.0. El código y las dependencias conservan su licencia específica, y las marcas siguen su política propia.",
      "La especificación canónica no declara cumplimiento automático con GDPR, EU AI Act, leyes mexicanas, marcos UNESCO, ONU, OECD, WEF o NIST. Es un control técnico de repositorio.",
      "Toda operación debe contar, cuando aplique, con aviso de privacidad, base jurídica o consentimiento, retención, DPA, evaluación de impacto, recurso, supervisión humana y revisión de propiedad intelectual.",
    ],
    highlights: [
      "CC BY 4.0 en documentación",
      "Código y dependencias con licencia propia",
      "Una licencia no es autorización sobre datos",
    ],
  },
  {
    id: "finalizacion",
    number: 26,
    title: "Criterio de finalización",
    subtitle: "Cuándo un cambio está realmente terminado",
    category: "Visión Global",
    summary:
      "Nueve condiciones acumulativas. Si falta una, el trabajo no está terminado, aunque compile.",
    content: [
      "Un cambio está terminado sólo cuando cumple el objetivo, pasa contratos y tipos, mantiene seguridad y privacidad, respeta el aislamiento de tenant, no introduce secretos, incluye auditoría si es relevante, tiene plan de rollback, actualiza documentación y mantiene main compilable.",
      "Cuando se declara verificado, se exige evidencia same-commit: la evidencia debe corresponder al mismo commit que se certifica, no a uno anterior.",
      "La prioridad de resolución de conflictos es: seguridad, privacidad y derechos; integridad de identidad, tenant y datos; auditoría y trazabilidad; estabilidad de despliegue; mantenibilidad; funcionalidad; y al final, conveniencia o velocidad aparente.",
    ],
    highlights: [
      "9 condiciones acumulativas",
      "Evidencia same-commit obligatoria",
      "No optimices una métrica a costa de la seguridad",
    ],
    keyQuote: "No optimices una métrica si empeoras la autoridad, la evidencia o la seguridad.",
  },
];

/** Texto canónico que se copia, se exporta y sobre el que se calcula el digest. */
export function buildCanonicalDossier(): string {
  return PRESENTATION_CHAPTERS.map(
    (chapter) =>
      `# ${chapter.number}. ${chapter.title.toUpperCase()}\n*${chapter.subtitle}*\n\n${chapter.summary}\n\n${chapter.content.join("\n\n")}`,
  ).join("\n\n---\n\n");
}

const CANONICAL_DOSSIER = buildCanonicalDossier();

export const EVALUATOR_DECLARATION: EvaluatorDeclaration = {
  evaluator: "Verificación de integridad local",
  model: "SHA-256 (FIPS 180-4)",
  // Digest real del contenido anterior: se recalcula si cambia cualquier capítulo.
  sha256: sha256Hex(CANONICAL_DOSSIER),
  // Nadie ha ejecutado una evaluación independiente del dossier.
  evaluationState: "pending",
  dossierSummary: `Dossier de ${PRESENTATION_CHAPTERS.length} capítulos derivado de la especificación canónica del repositorio. El digest se calcula en tiempo de ejecución sobre este mismo contenido.`,
};
