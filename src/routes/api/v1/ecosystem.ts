import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { listIsabellaSkills } from "@/lib/skills/registry";
import metadata from "@/../metadata.json";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: SecuritySystem.injectSecureHeaders(
      new Headers({
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=60",
      }),
    ),
  });
}

export const Route = createFileRoute("/api/v1/ecosystem")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async (context) => {
        const skills = listIsabellaSkills();
        const territorialSkills = skills.filter((s) => s.federation === "TERRITORY");
        const economicSkills = skills.filter((s) => s.federation === "ECONOMY");
        const sovereigntySkills = skills.filter((s) => s.federation === "SOVEREIGNTY");

        return json({
          success: true,
          ecosystem: {
            name: "TAMV ONLINE NETWORK — Isabella Villaseñor AI",
            version: metadata.operational.version,
            author: {
              name: "Edwin Oswaldo Castillo Trejo",
              alias: "Anubis Villaseñor",
              github: "https://github.com/OsoPanda1",
              orcid: "0009-0008-5050-1539",
              organization: "RDM Digital Hub / Nodo Cero",
              territory: "Real del Monte (Mineral del Monte), Hidalgo, México",
            },
            license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
            classification: "Especificación Arquitectónica Soberana de Dominio Público / Open Science",
            foundationalDoctrine: [
              "Soberanía humana: el humano decide, aprueba y ejecuta.",
              "Gobernanza Zero Trust: nada sensible se ejecuta sin política explícita.",
              "Soberanía territorial: el contexto local prevalece sobre la abstracción genérica.",
              "Trazabilidad auditable: toda decisión relevante debe poder auditarse en BookPI.",
            ],
            cognitiveNodes: [
              { id: "CROWN", name: "CROWN Gateway", role: "Orquestación, ruteo y arbitraje de estado" },
              { id: "ISA", name: "ISA Core", role: "Presencia, tono humano, empatía y modulación expresiva" },
              { id: "SOPHIA", name: "SOPHIA Engine", role: "Epistemología, razonamiento, síntesis y análisis" },
              { id: "ORION", name: "ORION Engine", role: "Ejecución técnica, transpilaciones y soporte de herramientas" },
              { id: "ARGUS", name: "ARGUS Sentinel", role: "Gobernanza constitucional, defensa, verificación y veto" },
            ],
            federatedRepositories: [
              {
                name: "isabella-ai-genesis",
                owner: "OsoPanda1",
                role: "Core de gobernanza de IA, LLM Evals (EU AI Act, ISO 42001, NIST AI RMF) y motor FGAIS",
              },
              {
                name: "nodo-cero",
                owner: "OsoPanda1",
                role: "Plataforma Territorial Inteligente pionera en América Latina en un Pueblo Mágico (Real del Monte)",
              },
              {
                name: "rdm-digital-hub-ldtocs",
                owner: "OsoPanda1",
                role: "Hub digital de soberanía latinoamericana en movimiento, tokenomía y asamblea comunitaria",
              },
              {
                name: "qstash-broker-integration",
                role: "Mensajería serverless/edge y enrutamiento reactivo de eventos sin estado",
              },
              {
                name: "pyDownload-parallel-streaming",
                role: "Ingesta segmentada en paralelo para acervos patrimoniales y memoria oral",
              },
              {
                name: "docs-searchbar-integration",
                role: "Búsqueda semántica instantánea e indexación documental de patrimonio",
              },
            ],
            skillsMetrics: {
              totalRegistered: skills.length,
              territorial: territorialSkills.length,
              economic: economicSkills.length,
              sovereignty: sovereigntySkills.length,
            },
            operationalState: {
              status: "OPERATIONAL",
              ledger: "BookPI Immutable Ledger",
              quantumBridge: "v5 Bridge Connected (Qiskit / Classical Fallback)",
              traceId: context.traceId,
              correlationId: context.correlationId,
            },
          },
        });
      }),
    },
  },
});
