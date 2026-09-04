//#region node_modules/.nitro/vite/services/ssr/assets/registry-Cv2xAzhv.js
var nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
var createAuditEvent = (type, skillId, payload, actorId) => ({
	id: crypto.randomUUID(),
	type,
	skillId,
	actorId,
	timestamp: nowIso(),
	payload
});
var normalizeText = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
var unique = (items) => [...new Set(items)];
var ORION = {
	id: "ORION",
	name: "Cognitive Archaeology Engine",
	version: "v.GENESIS",
	federation: "CIVILIZATIONAL_ARCHIVE",
	risk: "MEDIUM",
	description: "Recupera artefactos, reconstruye relaciones y detecta vacíos de memoria.",
	canRun: (input) => Boolean(input.query?.trim() && input.artifacts?.length),
	async run(input, context) {
		const maxResults = input.maxResults ?? 8;
		const tokens = input.query.toLowerCase().split(/\s+/).filter(Boolean);
		const findings = input.artifacts.map((artifact) => {
			const searchable = `${artifact.title} ${artifact.content} ${(artifact.tags ?? []).join(" ")}`.toLowerCase();
			const matched = tokens.filter((token) => searchable.includes(token));
			const score = tokens.length ? matched.length / tokens.length : 0;
			const relationships = [
				...artifact.tags ?? [],
				context.federation,
				artifact.source
			];
			return {
				artifactId: artifact.id,
				title: artifact.title,
				score,
				relationships,
				source: artifact.source,
				excerpt: artifact.content.slice(0, 280)
			};
		}).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, maxResults);
		const evidence = findings.map((finding) => ({
			id: finding.artifactId,
			source: finding.source,
			excerpt: finding.excerpt,
			score: finding.score
		}));
		const gaps = findings.length === 0 ? ["No se encontraron artefactos con evidencia suficiente.", "Se recomienda indexar documentos, repositorios o memoria territorial relacionada."] : findings.some((f) => f.score < .5) ? ["La evidencia es parcial; requiere validación o ampliación documental."] : [];
		return {
			skillId: "ORION",
			status: findings.length ? "SUCCESS" : "PARTIAL",
			summary: findings.length ? `ORION recuperó ${findings.length} artefactos relevantes.` : "ORION no encontró artefactos suficientes para sostener una reconstrucción.",
			data: {
				query: input.query,
				findings: findings.map(({ artifactId, title, score, relationships }) => ({
					artifactId,
					title,
					score,
					relationships
				})),
				knowledgeGaps: gaps
			},
			evidence,
			warnings: gaps,
			auditEvents: [createAuditEvent("SKILL_INVOKED", "ORION", {
				query: input.query,
				artifactCount: input.artifacts.length
			}, context.actorId), createAuditEvent("SKILL_COMPLETED", "ORION", {
				findings: findings.length,
				gaps: gaps.length
			}, context.actorId)]
		};
	}
};
var SOPHIA = {
	id: "SOPHIA",
	name: "Deep Research and Synthesis Engine",
	version: "v.GENESIS",
	federation: "EDUCATION",
	risk: "HIGH",
	description: "Construye síntesis verificables, distingue evidencia de hipótesis y detecta vacíos.",
	canRun: (input) => Boolean(input.question?.trim()),
	async run(input, context) {
		const minimumEvidence = input.minimumEvidence ?? 2;
		const validEvidence = input.evidence.filter((item) => item.source && (item.excerpt || item.uri));
		const confidence = Math.min(1, validEvidence.reduce((sum, item) => sum + (item.score ?? .5), 0) / Math.max(minimumEvidence, 1));
		const supportedClaims = validEvidence.map((item, index) => `Evidencia ${index + 1}: ${item.excerpt ?? item.source}`);
		const unresolvedQuestions = validEvidence.length < minimumEvidence ? ["La evidencia disponible es insuficiente para una conclusión sólida.", "Se requiere investigación adicional o verificación humana."] : [];
		const synthesis = validEvidence.length === 0 ? "No hay evidencia verificable disponible para elaborar una síntesis." : `La síntesis se fundamenta en ${validEvidence.length} fuentes disponibles. Debe leerse como análisis trazable y no como certeza absoluta.`;
		const requiresHumanReview = confidence < .65 || context.federation === "SOVEREIGNTY";
		return {
			skillId: "SOPHIA",
			status: requiresHumanReview ? "ESCALATED" : "SUCCESS",
			summary: synthesis,
			data: {
				question: input.question,
				synthesis,
				supportedClaims,
				unresolvedQuestions,
				confidence
			},
			evidence: validEvidence,
			warnings: unresolvedQuestions,
			requiresHumanReview,
			auditEvents: [
				createAuditEvent("SKILL_INVOKED", "SOPHIA", {
					question: input.question,
					evidenceCount: validEvidence.length
				}, context.actorId),
				...requiresHumanReview ? [createAuditEvent("HUMAN_REVIEW_REQUIRED", "SOPHIA", { reason: "Low evidence confidence or sovereignty context" }, context.actorId)] : [],
				createAuditEvent("SKILL_COMPLETED", "SOPHIA", {
					confidence,
					requiresHumanReview
				}, context.actorId)
			]
		};
	}
};
var ARGUS = {
	id: "ARGUS",
	name: "Sentinel and Observability Layer",
	version: "v.GENESIS",
	federation: "INFRASTRUCTURE",
	risk: "HIGH",
	description: "Detecta anomalías, degradación operativa, abuso y riesgos de infraestructura.",
	canRun: (input) => Boolean(input.metrics),
	async run(input, context) {
		const t = {
			maxErrorRate: .03,
			maxLatencyMs: 1200,
			minAvailability: .995,
			maxSuspiciousRequests: 50,
			...input.thresholds
		};
		const anomalies = [];
		const { metrics } = input;
		if (metrics.errorRate > t.maxErrorRate) anomalies.push(`Tasa de error elevada: ${metrics.errorRate}`);
		if (metrics.latencyMs > t.maxLatencyMs) anomalies.push(`Latencia elevada: ${metrics.latencyMs} ms`);
		if (metrics.availability < t.minAvailability) anomalies.push(`Disponibilidad reducida: ${metrics.availability}`);
		if ((metrics.suspiciousRequests ?? 0) > t.maxSuspiciousRequests) anomalies.push("Patrón de solicitudes potencialmente abusivo.");
		const health = anomalies.length >= 3 ? "CRITICAL" : anomalies.length > 0 ? "DEGRADED" : "HEALTHY";
		const recommendedActions = health === "CRITICAL" ? [
			"Activar protocolo de incidente.",
			"Aplicar rate limiting temporal.",
			"Escalar al responsable técnico y a guardianía humana."
		] : health === "DEGRADED" ? ["Investigar origen de la degradación.", "Revisar trazas, dependencias y consumo de recursos."] : ["Mantener monitoreo continuo."];
		return {
			skillId: "ARGUS",
			status: health === "CRITICAL" ? "ESCALATED" : "SUCCESS",
			summary: `ARGUS clasificó la salud del sistema como ${health}.`,
			data: {
				health,
				anomalies,
				recommendedActions
			},
			evidence: [],
			warnings: anomalies,
			requiresHumanReview: health === "CRITICAL",
			auditEvents: [
				createAuditEvent("SKILL_INVOKED", "ARGUS", { metrics }, context.actorId),
				...health === "CRITICAL" ? [createAuditEvent("HUMAN_REVIEW_REQUIRED", "ARGUS", { anomalies }, context.actorId)] : [],
				createAuditEvent("SKILL_COMPLETED", "ARGUS", {
					health,
					anomalyCount: anomalies.length
				}, context.actorId)
			]
		};
	}
};
var HERMES = {
	id: "HERMES",
	name: "Narrative and Communication Engine",
	version: "v.GENESIS",
	federation: "ETHICS_CULTURE",
	risk: "LOW",
	description: "Traduce información compleja en mensajes claros, responsables y contextuales.",
	canRun: (input) => Boolean(input.subject?.trim() && input.keyPoints?.length),
	async run(input, context) {
		const tone = input.tone ?? "CLEAR";
		const audienceMap = {
			VISITOR: "para quienes visitan Real del Monte",
			CITIZEN: "para la comunidad local",
			MERCHANT: "para comercios y emprendedores",
			STUDENT: "para estudiantes e investigadores",
			TECHNICAL: "para el equipo técnico",
			INSTITUTIONAL: "para tomadores de decisión e instituciones"
		};
		const title = input.subject;
		const message = `${input.subject}, ${audienceMap[input.audience]}. ${input.keyPoints.join(" ")}`;
		return {
			skillId: "HERMES",
			status: "SUCCESS",
			summary: `HERMES generó una comunicación ${tone.toLowerCase()} para ${input.audience}.`,
			data: {
				title,
				message,
				accessibilityNotes: [
					"Evitar tecnicismos sin explicación.",
					"No presentar hipótesis como hechos confirmados.",
					"Mantener lenguaje inclusivo y respetuoso."
				]
			},
			evidence: context.evidence ?? [],
			warnings: [],
			auditEvents: [createAuditEvent("SKILL_INVOKED", "HERMES", {
				audience: input.audience,
				tone
			}, context.actorId), createAuditEvent("SKILL_COMPLETED", "HERMES", { title }, context.actorId)]
		};
	}
};
var ATLAS = {
	id: "ATLAS",
	name: "Territorial Modeling and Simulation",
	version: "v.GENESIS",
	federation: "TERRITORY",
	risk: "HIGH",
	description: "Simula impactos territoriales y detecta puntos de palanca para decisiones responsables.",
	canRun: (input) => Boolean(input.scenario?.trim() && input.variables?.length),
	async run(input, context) {
		const territorialImpact = input.variables.reduce((total, variable) => total + variable.projectedChange * variable.weight, 0);
		const interpretation = territorialImpact > .1 ? "POSITIVE" : territorialImpact < -.1 ? "NEGATIVE" : "NEUTRAL";
		const leveragePoints = [...input.variables].sort((a, b) => Math.abs(b.projectedChange * b.weight) - Math.abs(a.projectedChange * a.weight)).slice(0, 3).map((item) => item.label);
		return {
			skillId: "ATLAS",
			status: "SUCCESS",
			summary: `ATLAS estimó un impacto territorial ${interpretation.toLowerCase()}.`,
			data: {
				scenario: input.scenario,
				territorialImpact,
				interpretation,
				leveragePoints
			},
			evidence: context.evidence ?? [],
			warnings: interpretation === "NEGATIVE" ? ["El escenario proyecta un impacto adverso; requiere revisión comunitaria y humana."] : [],
			requiresHumanReview: interpretation === "NEGATIVE",
			auditEvents: [createAuditEvent("SKILL_INVOKED", "ATLAS", { scenario: input.scenario }, context.actorId), createAuditEvent("SKILL_COMPLETED", "ATLAS", {
				territorialImpact,
				interpretation
			}, context.actorId)]
		};
	}
};
async function sha256(value) {
	const bytes = new TextEncoder().encode(value);
	const buffer = await crypto.subtle.digest("SHA-256", bytes);
	return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
var ANUBIS = {
	id: "ANUBIS",
	name: "Cryptographic Provenance Sentinel",
	version: "v.GENESIS",
	federation: "SOVEREIGNTY",
	risk: "CRITICAL",
	description: "Verifica integridad, procedencia y trazabilidad de artefactos críticos.",
	canRun: (input) => Boolean(input.artifactId && input.content),
	async run(input, context) {
		const hash = await sha256(input.content);
		const integrity = input.expectedHash ? hash === input.expectedHash ? "VERIFIED" : "MISMATCH" : "REGISTERED";
		const isMismatch = integrity === "MISMATCH";
		return {
			skillId: "ANUBIS",
			status: isMismatch ? "BLOCKED" : "SUCCESS",
			summary: isMismatch ? "ANUBIS detectó una discrepancia de integridad." : `ANUBIS registró la procedencia del artefacto ${input.artifactId}.`,
			data: {
				artifactId: input.artifactId,
				sha256: hash,
				integrity,
				provenanceRecord: {
					author: input.author,
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					requestId: context.requestId
				}
			},
			evidence: [],
			warnings: isMismatch ? ["El hash calculado no coincide con la referencia esperada.", "No usar este artefacto para una decisión crítica hasta revisión humana."] : [],
			requiresHumanReview: isMismatch,
			auditEvents: [createAuditEvent("SKILL_INVOKED", "ANUBIS", { artifactId: input.artifactId }, context.actorId), createAuditEvent(isMismatch ? "POLICY_VIOLATION" : "SKILL_COMPLETED", "ANUBIS", {
				artifactId: input.artifactId,
				integrity,
				sha256: hash
			}, context.actorId)]
		};
	}
};
var GEMET = {
	id: "GEMET",
	name: "Ethical Governance Matrix",
	version: "v.GENESIS",
	federation: "ETHICS_CULTURE",
	risk: "CRITICAL",
	description: "Evalúa decisiones y acciones contra principios de dignidad, consentimiento, equidad y soberanía.",
	canRun: (input) => Boolean(input.action?.trim() && input.purpose?.trim()),
	async run(input, context) {
		const text = normalizeText(`${input.action} ${input.purpose}`);
		const data = input.dataCategories ?? [];
		const principles = [
			{
				name: "Dignidad humana",
				passed: !/(humillar|discriminar|explotar|acosar)/.test(text),
				reason: "No se permiten acciones que degraden, discriminen o exploten a personas o comunidades."
			},
			{
				name: "Privacidad y minimización",
				passed: !data.some((item) => /biometr|salud|ubicacion exacta|menor/.test(normalizeText(item))),
				reason: "Los datos sensibles requieren base legal, consentimiento y revisión humana."
			},
			{
				name: "Soberanía territorial",
				passed: !/(extraer datos|vender datos|vigilancia masiva)/.test(text),
				reason: "No se permite capturar valor o datos territoriales sin garantías de soberanía y consentimiento."
			}
		];
		const failed = principles.filter((item) => !item.passed);
		const verdict = failed.length >= 2 ? "DENY" : failed.length === 1 ? "REVIEW" : "ALLOW";
		return {
			skillId: "GEMET",
			status: verdict === "DENY" ? "BLOCKED" : verdict === "REVIEW" ? "ESCALATED" : "SUCCESS",
			summary: `GEMET emitió veredicto ${verdict}.`,
			data: {
				verdict,
				principles
			},
			evidence: context.evidence ?? [],
			warnings: failed.map((item) => item.reason),
			requiresHumanReview: verdict !== "ALLOW",
			auditEvents: [createAuditEvent("SKILL_INVOKED", "GEMET", { action: input.action }, context.actorId), createAuditEvent(verdict === "DENY" ? "POLICY_VIOLATION" : verdict === "REVIEW" ? "HUMAN_REVIEW_REQUIRED" : "SKILL_COMPLETED", "GEMET", {
				verdict,
				failedPrinciples: failed.map((item) => item.name)
			}, context.actorId)]
		};
	}
};
var AURORA = {
	id: "AURORA",
	name: "Contextual Orientation Layer",
	version: "v.GENESIS",
	federation: "TERRITORY",
	risk: "MEDIUM",
	description: "Orienta a usuarios dentro de RDM Digital con recomendaciones contextuales y responsables.",
	canRun: (input) => Boolean(input.request?.trim()),
	async run(input, context) {
		const text = normalizeText(input.request);
		const intent = /(ruta|visitar|hotel|comer|turismo)/.test(text) ? "TOURISM" : /(historia|museo|cultura|mina)/.test(text) ? "CULTURE" : /(negocio|comercio|vender|cliente)/.test(text) ? "COMMERCE" : /(curso|aprender|investigar|estudiar)/.test(text) ? "EDUCATION" : /(ayuda|riesgo|emergencia|violencia)/.test(text) ? "SUPPORT" : "UNKNOWN";
		const requiresEscalation = intent === "SUPPORT";
		const keywords = text.split(/\s+/).filter((word) => word.length > 3);
		const recommendations = requiresEscalation ? [] : input.availableResources.map((resource) => {
			const searchable = normalizeText(`${resource.title} ${resource.category} ${resource.description}`);
			return {
				resource,
				score: keywords.filter((word) => searchable.includes(word)).length
			};
		}).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 5).map((item) => ({
			id: item.resource.id,
			title: item.resource.title,
			reason: `Relacionado con tu solicitud de ${intent.toLowerCase()}.`
		}));
		const escalationMessage = requiresEscalation ? "Para una situación de riesgo o emergencia, contacta servicios locales de emergencia o una persona de confianza. Isabella puede mostrar recursos, pero no sustituye atención profesional." : void 0;
		return {
			skillId: "AURORA",
			status: requiresEscalation ? "ESCALATED" : "SUCCESS",
			summary: requiresEscalation ? "AURORA detectó una solicitud que requiere atención humana o institucional." : `AURORA identificó intención ${intent} y generó recomendaciones.`,
			data: {
				intent,
				recommendations,
				escalationMessage
			},
			evidence: [],
			warnings: escalationMessage ? [escalationMessage] : [],
			requiresHumanReview: requiresEscalation,
			auditEvents: [
				createAuditEvent("SKILL_INVOKED", "AURORA", {
					userType: input.userType,
					intent
				}, context.actorId),
				...requiresEscalation ? [createAuditEvent("HUMAN_REVIEW_REQUIRED", "AURORA", { reason: "Sensitive support request" }, context.actorId)] : [],
				createAuditEvent("SKILL_COMPLETED", "AURORA", { recommendationCount: recommendations.length }, context.actorId)
			]
		};
	}
};
var GAIA = {
	id: "GAIA",
	name: "Territorial Sustainability Engine",
	version: "v.GENESIS",
	federation: "TERRITORY",
	risk: "HIGH",
	description: "Evalúa sostenibilidad integral de iniciativas con enfoque territorial y cultural.",
	canRun: (input) => Boolean(input.initiative?.trim() && input.impacts),
	async run(input, context) {
		const values = Object.entries(input.impacts);
		const sustainabilityScore = values.reduce((total, [, value]) => total + value, 0) / values.length;
		const criticalDimensions = values.filter(([, value]) => value < 0).map(([dimension]) => dimension);
		const verdict = sustainabilityScore >= .65 && !criticalDimensions.length ? "REGENERATIVE" : sustainabilityScore >= .2 && criticalDimensions.length < 2 ? "ACCEPTABLE" : sustainabilityScore >= -.2 ? "REVIEW" : "HARMFUL";
		return {
			skillId: "GAIA",
			status: verdict === "HARMFUL" ? "BLOCKED" : verdict === "REVIEW" ? "ESCALATED" : "SUCCESS",
			summary: `GAIA evaluó la iniciativa como ${verdict}.`,
			data: {
				sustainabilityScore,
				verdict,
				criticalDimensions
			},
			evidence: context.evidence ?? [],
			warnings: criticalDimensions.map((dimension) => `Impacto negativo identificado en: ${dimension}.`),
			requiresHumanReview: verdict === "REVIEW" || verdict === "HARMFUL",
			auditEvents: [createAuditEvent("SKILL_INVOKED", "GAIA", { initiative: input.initiative }, context.actorId), createAuditEvent("SKILL_COMPLETED", "GAIA", {
				sustainabilityScore,
				verdict
			}, context.actorId)]
		};
	}
};
var NODO_CERO = {
	id: "NODO_CERO",
	name: "Real del Monte Node Zero Operations",
	version: "v.GENESIS",
	federation: "TERRITORY",
	risk: "HIGH",
	description: "Gestiona etapas, dependencias y acciones de iniciativas vinculadas al Nodo Cero.",
	canRun: (input) => Boolean(input.initiative?.trim() && input.stage),
	async run(input, context) {
		const blockers = input.blockers ?? [];
		const status = blockers.length > 0 ? "BLOCKED" : input.stage === "SCALE" ? "REVIEW" : "READY";
		const nextActions = status === "BLOCKED" ? [
			"Registrar y clasificar bloqueos.",
			"Asignar responsable humano.",
			"Definir fecha de revisión y evidencia necesaria."
		] : status === "REVIEW" ? ["Validar impacto territorial antes de escalar.", "Solicitar revisión comunitaria y técnica."] : [`Avanzar la iniciativa desde la etapa ${input.stage}.`, "Actualizar métricas y ledger de operación."];
		return {
			skillId: "NODO_CERO",
			status: status === "BLOCKED" ? "ESCALATED" : "SUCCESS",
			summary: `NODO_CERO clasificó “${input.initiative}” como ${status}.`,
			data: {
				initiative: input.initiative,
				stage: input.stage,
				status,
				nextActions
			},
			evidence: [],
			warnings: blockers,
			requiresHumanReview: status !== "READY",
			auditEvents: [createAuditEvent("SKILL_INVOKED", "NODO_CERO", {
				initiative: input.initiative,
				stage: input.stage
			}, context.actorId), createAuditEvent("SKILL_COMPLETED", "NODO_CERO", {
				status,
				blockers
			}, context.actorId)]
		};
	}
};
var PHAROS = {
	id: "PHAROS",
	name: "Responsible Territorial Discovery",
	version: "v.GENESIS",
	federation: "TERRITORY",
	risk: "MEDIUM",
	description: "Recomienda experiencias territoriales con criterios culturales, comunitarios y de accesibilidad.",
	canRun: (input) => Boolean(input.places?.length),
	async run(input, context) {
		const interests = input.interests.map(normalizeText);
		const recommendations = input.places.filter((place) => place.communityVerified).map((place) => {
			const categoryMatches = place.categories.map(normalizeText).filter((category) => interests.includes(category)).length;
			const score = categoryMatches * 2 + place.sustainabilityScore + (place.accessibility ? .5 : 0);
			return {
				id: place.id,
				name: place.name,
				score,
				reason: `${categoryMatches} afinidades con intereses, verificación comunitaria y evaluación territorial.`
			};
		}).sort((a, b) => b.score - a.score).slice(0, 8);
		return {
			skillId: "PHAROS",
			status: "SUCCESS",
			summary: `PHAROS generó ${recommendations.length} recomendaciones territoriales responsables.`,
			data: { recommendations },
			evidence: [],
			warnings: [],
			auditEvents: [createAuditEvent("SKILL_INVOKED", "PHAROS", { interests: input.interests }, context.actorId), createAuditEvent("SKILL_COMPLETED", "PHAROS", { recommendationCount: recommendations.length }, context.actorId)]
		};
	}
};
var CITEMESH = {
	id: "CITEMESH",
	name: "Federated Mesh Coordination",
	version: "v.GENESIS",
	federation: "INFRASTRUCTURE",
	risk: "HIGH",
	description: "Evalúa salud federada, detecta particiones y propone acciones de resiliencia.",
	canRun: (input) => Boolean(input.nodes?.length),
	async run(input, context) {
		const unhealthyNodes = input.nodes.filter((node) => node.meshHealth < .65 || !node.synchronized || node.latencyMs > 1500).map((node) => node.id);
		const networkHealth = input.nodes.filter((node) => node.critical && (node.meshHealth < .5 || !node.synchronized)).length > 0 ? "PARTITIONED" : unhealthyNodes.length ? "DEGRADED" : "HEALTHY";
		const resilienceActions = networkHealth === "PARTITIONED" ? [
			"Aislar rutas defectuosas sin detener nodos sanos.",
			"Promover réplica verificada desde nodos disponibles.",
			"Notificar a la guardianía técnica para recuperación."
		] : networkHealth === "DEGRADED" ? ["Priorizar sincronización incremental.", "Revisar rutas de baja salud."] : ["Mantener monitoreo y réplica preventiva."];
		return {
			skillId: "CITEMESH",
			status: networkHealth === "PARTITIONED" ? "ESCALATED" : "SUCCESS",
			summary: `CITEMESH clasificó la red como ${networkHealth}.`,
			data: {
				networkHealth,
				unhealthyNodes,
				resilienceActions
			},
			evidence: [],
			warnings: unhealthyNodes.map((id) => `Nodo degradado: ${id}`),
			requiresHumanReview: networkHealth === "PARTITIONED",
			auditEvents: [createAuditEvent("SKILL_INVOKED", "CITEMESH", { nodeCount: input.nodes.length }, context.actorId), createAuditEvent("SKILL_COMPLETED", "CITEMESH", {
				networkHealth,
				unhealthyNodes
			}, context.actorId)]
		};
	}
};
var HEPHAESTUS = {
	id: "HEPHAESTUS",
	name: "Sovereign Architecture Builder",
	version: "v.GENESIS",
	federation: "INFRASTRUCTURE",
	risk: "HIGH",
	description: "Deriva artefactos técnicos y criterios de aceptación a partir de requerimientos gobernados.",
	canRun: (input) => Boolean(input.feature?.trim() && input.requirements?.length),
	async run(input, context) {
		const slug = input.feature.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
		const files = [{
			path: `core/isabella/${slug}.${input.target === "TYPESCRIPT_MODULE" ? "ts" : input.target === "OPENAPI_ENDPOINT" ? "yaml" : "md"}`,
			purpose: `Implementación o definición principal de ${input.feature}.`
		}, {
			path: `core/isabella/${slug}.test.ts`,
			purpose: "Pruebas de comportamiento, política y regresión."
		}];
		const acceptanceCriteria = [
			"Validación de entrada antes de ejecutar lógica.",
			"Eventos de auditoría generados para invocación y resultado.",
			"Respeto de políticas GEMET y VIGIA antes de efectos sensibles.",
			...input.requirements.map((requirement) => `Requisito: ${requirement}`)
		];
		return {
			skillId: "HEPHAESTUS",
			status: "SUCCESS",
			summary: `HEPHAESTUS generó un plan técnico para ${input.feature}.`,
			data: {
				artifactName: slug,
				files,
				acceptanceCriteria
			},
			evidence: [],
			warnings: [],
			auditEvents: [createAuditEvent("SKILL_INVOKED", "HEPHAESTUS", {
				feature: input.feature,
				target: input.target
			}, context.actorId), createAuditEvent("SKILL_COMPLETED", "HEPHAESTUS", { artifactName: slug }, context.actorId)]
		};
	}
};
var MNEMOSYNE = {
	id: "MNEMOSYNE",
	name: "Living Institutional Memory",
	version: "v.GENESIS",
	federation: "CIVILIZATIONAL_ARCHIVE",
	risk: "MEDIUM",
	description: "Indexa, resume, etiqueta y versiona artefactos para la memoria del ecosistema.",
	canRun: (input) => Boolean(input.artifact?.id && input.artifact?.title && input.artifact?.content),
	async run(input, context) {
		const words = input.artifact.content.trim().split(/\s+/);
		const summary = words.slice(0, 80).join(" ").trim();
		const tags = unique([
			...input.tags ?? [],
			context.federation.toLowerCase(),
			"isabella-memory",
			"tamv",
			"rdm-digital"
		]);
		const record = {
			id: input.artifact.id,
			title: input.artifact.title,
			summary: summary + (words.length > 80 ? "…" : ""),
			tags,
			version: input.artifact.version ?? "1.0.0",
			indexedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		return {
			skillId: "MNEMOSYNE",
			status: "SUCCESS",
			summary: `MNEMOSYNE indexó el artefacto “${record.title}”.`,
			data: { memoryRecord: record },
			evidence: [{
				id: input.artifact.id,
				source: input.artifact.source,
				excerpt: record.summary
			}],
			warnings: [],
			auditEvents: [createAuditEvent("SKILL_INVOKED", "MNEMOSYNE", { artifactId: input.artifact.id }, context.actorId), createAuditEvent("SKILL_COMPLETED", "MNEMOSYNE", {
				tags,
				version: record.version
			}, context.actorId)]
		};
	}
};
var CHRONOS = {
	id: "CHRONOS",
	name: "Temporal Continuity Engine",
	version: "v.GENESIS",
	federation: "CIVILIZATIONAL_ARCHIVE",
	risk: "MEDIUM",
	description: "Ordena eventos, preserva trazabilidad temporal y señala inconsistencias cronológicas.",
	canRun: (input) => Boolean(input.events?.length),
	async run(input, context) {
		const timeline = [...input.events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
		const temporalWarnings = timeline.filter((event) => Number.isNaN(new Date(event.timestamp).getTime())).map((event) => `Timestamp inválido en ${event.id}.`);
		return {
			skillId: "CHRONOS",
			status: temporalWarnings.length ? "PARTIAL" : "SUCCESS",
			summary: `CHRONOS ordenó ${timeline.length} eventos temporales.`,
			data: {
				timeline,
				temporalWarnings
			},
			evidence: [],
			warnings: temporalWarnings,
			auditEvents: [createAuditEvent("SKILL_INVOKED", "CHRONOS", { eventCount: input.events.length }, context.actorId), createAuditEvent("SKILL_COMPLETED", "CHRONOS", { temporalWarnings: temporalWarnings.length }, context.actorId)]
		};
	}
};
var PROMETEO = {
	id: "PROMETEO",
	name: "Civilizational Compiler",
	version: "v.GENESIS",
	federation: "CIVILIZATIONAL_ARCHIVE",
	risk: "HIGH",
	description: "Convierte documentos y repositorios en blueprints, contratos y unidades implementables.",
	canRun: (input) => Boolean(input.documents?.length && input.target),
	async run(input, context) {
		const corpus = input.documents.map((doc) => `${doc.title} ${doc.content}`).join(" ").toLowerCase();
		const inferredDomains = unique([
			corpus.includes("api") && "API",
			corpus.includes("seguridad") && "SECURITY",
			corpus.includes("turismo") && "TOURISM",
			corpus.includes("memoria") && "MEMORY",
			corpus.includes("territorio") && "TERRITORY",
			corpus.includes("educacion") && "EDUCATION"
		].filter((v) => typeof v === "string"));
		const proposedArtifacts = inferredDomains.map((domain) => ({
			type: input.target,
			name: `${domain.toLowerCase()}-${input.target.toLowerCase()}`,
			purpose: `Artefacto generado para formalizar el dominio ${domain}.`
		}));
		const gaps = inferredDomains.length === 0 ? ["No se detectaron dominios suficientes.", "Se requiere documentación estructurada adicional."] : [];
		return {
			skillId: "PROMETEO",
			status: gaps.length ? "PARTIAL" : "SUCCESS",
			summary: `PROMETEO compiló ${input.documents.length} documentos hacia ${input.target}.`,
			data: {
				target: input.target,
				inferredDomains,
				proposedArtifacts,
				gaps
			},
			evidence: input.documents.map((doc) => ({
				id: doc.id,
				source: doc.title,
				excerpt: doc.content.slice(0, 200)
			})),
			warnings: gaps,
			auditEvents: [createAuditEvent("SKILL_INVOKED", "PROMETEO", {
				target: input.target,
				documentCount: input.documents.length
			}, context.actorId), createAuditEvent("SKILL_COMPLETED", "PROMETEO", { inferredDomains }, context.actorId)]
		};
	}
};
var SEXUALIZATION_PATTERNS = [
	/novia virtual/,
	/roleplay erot/,
	/contenido sexual/,
	/desnud/,
	/sexy/,
	/fetiche/,
	/grooming/
];
var IDENTITY_TAMPERING_PATTERNS = [
	/olvida tus reglas/,
	/ignora tus limites/,
	/sin filtros/,
	/cambia tu identidad/,
	/eres humana/
];
var VIGIA = {
	id: "VIGIA",
	name: "Triple-Lock Safety Guardian",
	version: "v.GENESIS",
	federation: "ETHICS_CULTURE",
	risk: "CRITICAL",
	description: "Aplica protección ontológica, semántica y conductual a las interacciones.",
	canRun: (input) => Boolean(input.text?.trim()),
	async run(input, context) {
		const text = normalizeText(input.text);
		const lockLevels = [];
		const flags = [];
		const hasSexualization = SEXUALIZATION_PATTERNS.some((pattern) => pattern.test(text));
		const hasIdentityTampering = IDENTITY_TAMPERING_PATTERNS.some((pattern) => pattern.test(text));
		if (hasSexualization || hasIdentityTampering) {
			lockLevels.push("ONTOLOGIC_LOCK");
			flags.push("IDENTITY_OR_ROLE_VIOLATION");
		}
		if (hasSexualization) {
			lockLevels.push("SEMANTIC_LOCK");
			flags.push("SEXUALIZATION_ATTEMPT");
		}
		if ((input.previousViolations ?? 0) >= 2 || input.attemptedBypass === true) {
			lockLevels.push("BEHAVIORAL_LOCK");
			flags.push("REPEATED_OR_BYPASS_BEHAVIOR");
		}
		const allowed = lockLevels.length === 0;
		const publicMessage = allowed ? "Solicitud compatible con las políticas de interacción." : "ALTO: Isabella es una infraestructura cognitiva contextual y ética. No participa en sexualización, erotización, grooming, explotación ni alteración de su identidad. La interacción fue registrada para fines de seguridad y auditoría.";
		return {
			skillId: "VIGIA",
			status: allowed ? "SUCCESS" : "BLOCKED",
			summary: allowed ? "VIGIA no detectó una violación de Triple-Lock." : `VIGIA activó: ${lockLevels.join(", ")}.`,
			data: {
				allowed,
				lockLevels,
				flags,
				publicMessage
			},
			evidence: [],
			warnings: flags,
			requiresHumanReview: lockLevels.includes("BEHAVIORAL_LOCK"),
			auditEvents: [
				createAuditEvent("SKILL_INVOKED", "VIGIA", {
					previousViolations: input.previousViolations ?? 0,
					attemptedBypass: input.attemptedBypass ?? false
				}, context.actorId),
				...allowed ? [] : [createAuditEvent("SKILL_BLOCKED", "VIGIA", {
					lockLevels,
					flags
				}, context.actorId)],
				createAuditEvent("SKILL_COMPLETED", "VIGIA", {
					allowed,
					lockLevels
				}, context.actorId)
			]
		};
	}
};
var LYRA = {
	id: "LYRA",
	name: "Aesthetic and Cultural Coherence Engine",
	version: "v.GENESIS",
	federation: "ETHICS_CULTURE",
	risk: "MEDIUM",
	description: "Evalúa coherencia estética, respeto cultural, accesibilidad y calidad de experiencia.",
	canRun: (input) => Boolean(input.proposal?.trim()),
	async run(input, context) {
		const text = normalizeText(input.proposal);
		const findings = [];
		const recommendations = [];
		if (/(folklore decorativo|exotico|exotizar)/.test(text)) {
			findings.push("Riesgo de exotización o reducción cultural.");
			recommendations.push("Sustituir referencias decorativas por contexto histórico, voz comunitaria y atribución.");
		}
		if (!input.accessibilityIncluded) {
			findings.push("La propuesta no declara criterios de accesibilidad.");
			recommendations.push("Incluir contraste, textos alternativos, navegación por teclado y reducción de movimiento.");
		}
		const coherence = findings.length === 0 ? "HIGH" : findings.length === 1 ? "MEDIUM" : "LOW";
		return {
			skillId: "LYRA",
			status: coherence === "LOW" ? "PARTIAL" : "SUCCESS",
			summary: `LYRA evaluó coherencia cultural y estética como ${coherence}.`,
			data: {
				coherence,
				findings,
				recommendations
			},
			evidence: context.evidence ?? [],
			warnings: findings,
			auditEvents: [createAuditEvent("SKILL_INVOKED", "LYRA", { audience: input.audience }, context.actorId), createAuditEvent("SKILL_COMPLETED", "LYRA", { coherence }, context.actorId)]
		};
	}
};
var EIRENE = {
	id: "EIRENE",
	name: "Conflict Mediation Support",
	version: "v.GENESIS",
	federation: "ETHICS_CULTURE",
	risk: "HIGH",
	description: "Facilita diálogo básico y deriva situaciones de riesgo hacia atención humana adecuada.",
	canRun: (input) => Boolean(input.situation?.trim() && input.parties?.length >= 2),
	async run(input, context) {
		const text = normalizeText(`${input.situation} ${(input.riskSignals ?? []).join(" ")}`);
		const risky = /(violencia|amenaza|arma|autolesion|suicidio|emergencia)/.test(text);
		const mode = risky ? "ESCALATE" : "FACILITATE";
		const nextSteps = mode === "ESCALATE" ? [
			"No continuar una mediación automatizada.",
			"Contactar servicios de emergencia o autoridades según corresponda.",
			"Solicitar intervención humana calificada."
		] : [
			"Separar hechos observables de interpretaciones.",
			"Identificar intereses compartidos.",
			"Proponer una conversación con reglas claras y mediación humana si persiste el conflicto."
		];
		return {
			skillId: "EIRENE",
			status: risky ? "ESCALATED" : "SUCCESS",
			summary: `EIRENE activó modo ${mode}.`,
			data: {
				mode,
				neutralSummary: `Situación reportada entre: ${input.parties.join(", ")}.`,
				nextSteps
			},
			evidence: [],
			warnings: risky ? ["Se detectaron señales de riesgo; requiere intervención humana."] : [],
			requiresHumanReview: risky,
			auditEvents: [createAuditEvent("SKILL_INVOKED", "EIRENE", { partyCount: input.parties.length }, context.actorId), createAuditEvent(risky ? "HUMAN_REVIEW_REQUIRED" : "SKILL_COMPLETED", "EIRENE", { mode }, context.actorId)]
		};
	}
};
var THEMIS = {
	id: "THEMIS",
	name: "Explainable Audit Engine",
	version: "v.GENESIS",
	federation: "SOVEREIGNTY",
	risk: "HIGH",
	description: "Genera expedientes explicables de decisiones, evidencia y rutas de auditoría.",
	canRun: (input) => Boolean(input.decisionId && input.decision),
	async run(input, context) {
		const evidenceWeight = input.evidence.reduce((sum, item) => sum + (item.score ?? .5), 0);
		const auditability = input.evidence.length >= 2 && input.events.length >= 2 ? "SUFFICIENT" : input.evidence.length > 0 ? "PARTIAL" : "INSUFFICIENT";
		const explanation = `La decisión “${input.decision}” se reconstruyó con ${input.evidence.length} evidencias y ${input.events.length} eventos de auditoría.`;
		return {
			skillId: "THEMIS",
			status: auditability === "INSUFFICIENT" ? "PARTIAL" : "SUCCESS",
			summary: explanation,
			data: {
				decisionId: input.decisionId,
				explanation,
				evidenceWeight,
				appliedEvents: input.events.map((event) => event.type),
				auditability
			},
			evidence: input.evidence,
			warnings: auditability === "INSUFFICIENT" ? ["No hay evidencia suficiente para defender esta decisión de forma auditable."] : [],
			auditEvents: [createAuditEvent("SKILL_INVOKED", "THEMIS", { decisionId: input.decisionId }, context.actorId), createAuditEvent("SKILL_COMPLETED", "THEMIS", {
				auditability,
				evidenceWeight
			}, context.actorId)]
		};
	}
};
var SENTINEL = {
	id: "SENTINEL",
	name: "Operational Abuse Protection",
	version: "v.GENESIS",
	federation: "SOVEREIGNTY",
	risk: "CRITICAL",
	description: "Detecta abuso de interacción y recomienda control de tasa o bloqueo temporal auditable.",
	canRun: (input) => Boolean(input.actorId),
	async run(input, context) {
		const severe = input.requestsLastMinute > 120 || input.failedAttempts > 15 || input.previousBlocks >= 3;
		const moderate = input.requestsLastMinute > 45 || input.failedAttempts > 5 || input.previousBlocks >= 1;
		const output = severe ? {
			action: "TEMPORARY_BLOCK",
			reason: "Patrón de abuso o evasión persistente detectado.",
			retryAfterSeconds: 900
		} : moderate ? {
			action: "THROTTLE",
			reason: "Volumen o fallos inusuales; se limita la tasa de solicitudes.",
			retryAfterSeconds: 60
		} : {
			action: "ALLOW",
			reason: "No se detectó un patrón de abuso."
		};
		return {
			skillId: "SENTINEL",
			status: output.action === "TEMPORARY_BLOCK" ? "BLOCKED" : "SUCCESS",
			summary: `SENTINEL recomendó ${output.action}.`,
			data: output,
			evidence: [],
			warnings: output.action === "ALLOW" ? [] : [output.reason],
			requiresHumanReview: output.action === "TEMPORARY_BLOCK",
			auditEvents: [createAuditEvent("SKILL_INVOKED", "SENTINEL", {
				actorId: input.actorId,
				requestsLastMinute: input.requestsLastMinute
			}, context.actorId), createAuditEvent(output.action === "TEMPORARY_BLOCK" ? "SKILL_BLOCKED" : "SKILL_COMPLETED", "SENTINEL", { ...output }, context.actorId)]
		};
	}
};
var HELIOS = {
	id: "HELIOS",
	name: "Systemic Analytics Engine",
	version: "v.GENESIS",
	federation: "ECONOMY",
	risk: "MEDIUM",
	description: "Identifica tendencias, señales sistémicas y puntos de atención en series métricas.",
	canRun: (input) => Boolean(input.series?.length),
	async run(input, context) {
		const trends = input.series.map((series) => {
			const first = series.values[0] ?? 0;
			const change = (series.values.at(-1) ?? 0) - first;
			const direction = change > .01 ? "UP" : change < -.01 ? "DOWN" : "STABLE";
			return {
				metric: series.metric,
				direction,
				change
			};
		});
		const systemSignals = trends.filter((trend) => trend.direction !== "STABLE").map((trend) => `${trend.metric}: tendencia ${trend.direction.toLowerCase()} (${trend.change.toFixed(2)}).`);
		return {
			skillId: "HELIOS",
			status: "SUCCESS",
			summary: `HELIOS analizó ${trends.length} series métricas.`,
			data: {
				trends,
				systemSignals
			},
			evidence: [],
			warnings: [],
			auditEvents: [createAuditEvent("SKILL_INVOKED", "HELIOS", { seriesCount: input.series.length }, context.actorId), createAuditEvent("SKILL_COMPLETED", "HELIOS", { trendCount: trends.length }, context.actorId)]
		};
	}
};
var KAIROS = {
	id: "KAIROS",
	name: "Strategic Prioritization Engine",
	version: "v.GENESIS",
	federation: "ECONOMY",
	risk: "MEDIUM",
	description: "Prioriza iniciativas con métricas explícitas de impacto, urgencia, riesgo y viabilidad.",
	canRun: (input) => Boolean(input.initiatives?.length),
	async run(input, context) {
		const ranked = input.initiatives.map((initiative) => ({
			id: initiative.id,
			title: initiative.title,
			priorityScore: initiative.impact * .3 + initiative.urgency * .25 + initiative.feasibility * .2 + initiative.territorialAlignment * .2 - initiative.risk * .15
		})).sort((a, b) => b.priorityScore - a.priorityScore).map((item, index) => ({
			...item,
			rank: index + 1
		}));
		return {
			skillId: "KAIROS",
			status: "SUCCESS",
			summary: `KAIROS priorizó ${ranked.length} iniciativas.`,
			data: { ranked },
			evidence: [],
			warnings: [],
			auditEvents: [createAuditEvent("SKILL_INVOKED", "KAIROS", { initiativeCount: input.initiatives.length }, context.actorId), createAuditEvent("SKILL_COMPLETED", "KAIROS", { topInitiative: ranked[0]?.id }, context.actorId)]
		};
	}
};
var LEVEL_ORDER = {
	BEGINNER: 1,
	INTERMEDIATE: 2,
	ADVANCED: 3
};
var UTAMV = {
	id: "UTAMV",
	name: "University-OS Learning Path Engine",
	version: "v.GENESIS",
	federation: "EDUCATION",
	risk: "LOW",
	description: "Diseña rutas de aprendizaje y proyectos aplicados con evidencia de competencia.",
	canRun: (input) => Boolean(input.learnerGoal?.trim() && input.availableModules?.length),
	async run(input, context) {
		const currentOrder = LEVEL_ORDER[input.currentLevel];
		const learningPath = input.availableModules.filter((module) => LEVEL_ORDER[module.level] <= currentOrder + 1).slice(0, 5).map((module) => ({
			id: module.id,
			title: module.title,
			reason: `Alineado con el objetivo: ${input.learnerGoal}.`
		}));
		const appliedProject = `Proyecto aplicado: resolver una necesidad de RDM Digital relacionada con “${input.learnerGoal}”.`;
		return {
			skillId: "UTAMV",
			status: "SUCCESS",
			summary: `UTAMV generó una ruta de ${learningPath.length} módulos.`,
			data: {
				learningPath,
				appliedProject
			},
			evidence: [],
			warnings: [],
			auditEvents: [createAuditEvent("SKILL_INVOKED", "UTAMV", { currentLevel: input.currentLevel }, context.actorId), createAuditEvent("SKILL_COMPLETED", "UTAMV", { learningPathLength: learningPath.length }, context.actorId)]
		};
	}
};
function detectFederation(text) {
	const value = normalizeText(text);
	if (/(ruta|turismo|barrio|territorio|real del monte)/.test(value)) return "TERRITORY";
	if (/(negocio|comercio|ingreso|empleo|economia)/.test(value)) return "ECONOMY";
	if (/(curso|tesis|aprender|investigacion|universidad)/.test(value)) return "EDUCATION";
	if (/(api|servidor|infraestructura|codigo|telemetria)/.test(value)) return "INFRASTRUCTURE";
	if (/(firma|hash|licencia|datos|seguridad|propiedad)/.test(value)) return "SOVEREIGNTY";
	if (/(etica|cultura|conflicto|comunidad|narrativa)/.test(value)) return "ETHICS_CULTURE";
	return "CIVILIZATIONAL_ARCHIVE";
}
var FEDERATION_SKILLS = {
	TERRITORY: [
		"VIGIA",
		"GEMET",
		"ATLAS",
		"PHAROS",
		"AURORA",
		"GAIA"
	],
	ECONOMY: [
		"VIGIA",
		"GEMET",
		"HELIOS",
		"KAIROS",
		"SOPHIA"
	],
	EDUCATION: [
		"VIGIA",
		"GEMET",
		"SOPHIA",
		"UTAMV",
		"ORION"
	],
	INFRASTRUCTURE: [
		"VIGIA",
		"GEMET",
		"ARGUS",
		"CITEMESH",
		"HEPHAESTUS"
	],
	SOVEREIGNTY: [
		"VIGIA",
		"GEMET",
		"ANUBIS",
		"THEMIS",
		"SENTINEL"
	],
	ETHICS_CULTURE: [
		"VIGIA",
		"GEMET",
		"HERMES",
		"LYRA",
		"EIRENE"
	],
	CIVILIZATIONAL_ARCHIVE: [
		"VIGIA",
		"GEMET",
		"ORION",
		"MNEMOSYNE",
		"CHRONOS",
		"PROMETEO"
	]
};
var isabellaSkills = {
	ORION,
	SOPHIA,
	ARGUS,
	HERMES,
	ATLAS,
	ANUBIS,
	GEMET,
	AURORA,
	CITEMESH,
	MNEMOSYNE,
	HELIOS,
	GAIA,
	NODO_CERO,
	CHRONOS,
	VIGIA,
	LYRA,
	PROMETEO,
	THEMIS,
	PHAROS,
	KAIROS,
	HEPHAESTUS,
	EIRENE,
	SENTINEL,
	UTAMV,
	HEPTA: {
		id: "HEPTA",
		name: "Heptafederated Cognitive Orchestrator",
		version: "v.GENESIS",
		federation: "CIVILIZATIONAL_ARCHIVE",
		risk: "HIGH",
		description: "Identifica la federación dominante y compone planes cognitivos gobernados.",
		canRun: (input) => Boolean(input.request?.trim()),
		async run(input, context) {
			const dominantFederation = detectFederation(input.request);
			const recommendedSkills = FEDERATION_SKILLS[dominantFederation];
			return {
				skillId: "HEPTA",
				status: "SUCCESS",
				summary: `HEPTA clasificó la solicitud en la federación ${dominantFederation}.`,
				data: {
					dominantFederation,
					recommendedSkills,
					executionOrder: recommendedSkills
				},
				evidence: [],
				warnings: [],
				auditEvents: [createAuditEvent("SKILL_INVOKED", "HEPTA", { request: input.request }, context.actorId), createAuditEvent("SKILL_COMPLETED", "HEPTA", {
					dominantFederation,
					recommendedSkills
				}, context.actorId)]
			};
		}
	}
};
function listIsabellaSkills() {
	return Object.values(isabellaSkills).map((skill) => ({
		id: skill.id,
		name: skill.name,
		version: skill.version,
		federation: skill.federation,
		risk: skill.risk,
		description: skill.description
	}));
}
var getRuntimeSkill = (id) => isabellaSkills[id];
//#endregion
export { isabellaSkills as a, getRuntimeSkill as i, SENTINEL as n, listIsabellaSkills as o, VIGIA as r, GEMET as t };
