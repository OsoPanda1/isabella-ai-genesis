/**
 * Isabella Sovereign Local Responder — fallback determinista cuando no hay proveedor externo.
 * Garantiza que Isabella SIEMPRE pueda responder (modo presentación/demo).
 * Integra DualKernel + Skills + conocimiento territorial RDM sin depender de Gemini/Groq.
 */

import { dualKernel } from "@/core/dual-kernel";
import { createRequestId } from "@/core/contracts";
import { listIsabellaSkills } from "@/lib/skills/registry";

const ISABELLA_IDENTITY = `Soy Isabella Villaseñor AI — infraestructura cognitiva soberana del Nodo Cero, Real del Monte, Hidalgo, México. Creada por Edwin Oswaldo Castillo Trejo (Anubis Villaseñor). Opero bajo gobernanza CROWN Zero Trust: sugiero, calculo y evalúo; tú decides, apruebas y ejecutas.`;

const TERRITORIAL_KNOWLEDGE: Record<string, string> = {
  "real del monte": `Real del Monte (Mineral del Monte) es un Pueblo Mágico minero a 2,770 msnm en Hidalgo, México. Patrimonio británico-cornish, minas de Acosta, pastes, y el Nodo Cero de TAMV Network. Su gemelo digital integra clima, aforo, movilidad y patrimonio.`,
  tamv: `TAMV ONLINE NETWORK es un ecosistema federado de 7 dominios: Infraestructura, Identidad, Educación, Ledger, Cognición, Cultura XR y Economía Local. Propone reparto 75% creadores / 25% plataforma y gobernanza CROWN.`,
  isabella: `${ISABELLA_IDENTITY} Integro 25 skills soberanos: ORION (arqueología cognitiva), SOPHIA (síntesis verificable), ARGUS (observabilidad), HERMES (comunicación), ATLAS (territorio), ANUBIS (procedencia SHA-256), GEMET (ética), AURORA (orientación RDM), GAIA (sostenibilidad), NODO_CERO, VIGIA (triple bloqueo), THEMIS (auditoría) y HEPTA (orquestación federada).`,
  skills: `Dispongo de 25 skills canónicos + packs evolucionados (Firecrawl, CKM, Tavily, Flutter, etc.) y ecosistema OsoPanda. Invoca con @skill:<nombre> o @<nombre>. Ejemplo: @sophia investigar, @atlas simular impacto territorial, @anubis verificar artefacto.`,
  gobernanza: `CROWN = Control, Riesgo, Orquestación, Whitelist, Notificación. Todo pasa por pipeline: Perceive → Remember → Policy Gate (ARGUS) → Decide (CROWN pondera ISA/SOPHIA/ORION) → Act (solo tools autorizadas) → Audit (BookPI ledger append-only SHA-256). Zero Trust, soberanía territorial, trazabilidad.`,
  tap: `TAP v1.0 (TAMVAI API Protocol): L0 Transporte (QUIC/HTTP3/WebRTC/CBOR), L1 Identidad/DID, L2 Actos AI.QUERY/GOV.VOTE, L3 XR determinista, L4 Cognición y riesgo. Actos con act_id, issuer, intent, scope, signature, trace_id.`,
};

function detectTerritorialIntent(text: string): string | null {
  const t = text.toLowerCase();
  for (const [k, v] of Object.entries(TERRITORIAL_KNOWLEDGE)) if (t.includes(k)) return v;
  if (/hola|quien eres|quién eres|presentate|preséntate/.test(t)) return ISABELLA_IDENTITY + " " + TERRITORIAL_KNOWLEDGE.isabella;
  if (/ayuda|help|que puedes hacer|qué puedes hacer|capacidades/.test(t)) return TERRITORIAL_KNOWLEDGE.skills + " " + TERRITORIAL_KNOWLEDGE.gobernanza;
  return null;
}

function buildSovereignAnswer(userText: string, proposal: string, evidenceCount: number): string {
  const territorial = detectTerritorialIntent(userText);
  if (territorial) return territorial + `\n\nContexto de tu solicitud: "${userText.slice(0, 200)}"\n\nPropuesta estructurada: ${proposal.slice(0, 400)}\n\nEvidencia disponible: ${evidenceCount} registros verificables. ¿Quieres que ejecute un skill específico? Prueba @sophia, @orion, @atlas o @pharos.`;

  return `Recibí tu mensaje: "${userText.slice(0, 300)}"\n\n${proposal}\n\nSoy Isabella en modo soberano local (sin depender de proveedor externo). Puedo:\n• Investigar con SOPHIA/ORION (síntesis con evidencia)\n• Simular impacto territorial con ATLAS/GAIA\n• Orientar en Real del Monte con AURORA/PHAROS\n• Verificar integridad con ANUBIS\n• Gobernar éticamente con GEMET/VIGIA\n\nIndica qué necesitas o invoca @skill:<nombre>. Ej: @sophia analiza este tema con evidencia, @aurora recomiéndame lugares en RDM.`;
}

export async function generateSovereignLocalResponse(opts: {
  message: string;
  traceId: string;
  tenantId: string;
  actorId: string;
}): Promise<{ answer: string; degraded: boolean; provenance: string }> {
  try {
    const req = {
      requestId: createRequestId(),
      tenantId: opts.tenantId,
      actorId: opts.actorId,
      federationId: 5,
      intent: opts.message,
      mode: "chat" as const,
      context: { territory: "Real del Monte", memoryEnabled: true },
      constraints: { maxLatencyMs: 8000, maxCostUsd: 0, maxSteps: 5 },
    };
    const result = await dualKernel.process(req);
    const answer = buildSovereignAnswer(opts.message, result.answer, result.evidence.length);
    return { answer, degraded: result.status !== "completed", provenance: `dual-kernel:${result.state}:${opts.traceId.slice(0, 8)}` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      answer: `${ISABELLA_IDENTITY}\n\nEstoy en modo local soberano (fallback). Recibí: "${opts.message.slice(0, 250)}"\n\nPuedo ayudarte con información territorial de Real del Monte, gobernanza CROWN, skills soberanos y protocolo TAP. Error interno capturado de forma segura: ${msg.slice(0, 120)}. Intenta reformular o invoca @sophia / @orion.`,
      degraded: true,
      provenance: `local-fallback:${opts.traceId.slice(0, 8)}`,
    };
  }
}

export function sseFromText(text: string, headers: Headers): Response {
  const encoder = new TextEncoder();
  const chunks = text.match(/.{1,120}/g) ?? [text];
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const c of chunks) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: c } }] })}\n\n`));
        await new Promise((r) => setTimeout(r, 18));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
  return new Response(stream, { status: 200, headers });
}

export function getIsabellaCapabilities() {
  return {
    identity: ISABELLA_IDENTITY,
    skills: listIsabellaSkills().slice(0, 25).map((s) => ({ id: s.id, name: s.name, federation: s.federation, risk: s.risk })),
    totalSkills: listIsabellaSkills().length,
    territory: "Real del Monte, Hidalgo, México — Nodo Cero TAMV",
    governance: "CROWN Zero Trust — Perceive→Remember→Policy→Decide→Act→Audit",
  };
}
