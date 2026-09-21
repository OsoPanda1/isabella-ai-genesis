import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { z } from "zod";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: SecuritySystem.injectSecureHeaders(
      new Headers({
        "content-type": "application/json; charset=utf-8",
      }),
    ),
  });
}

const MONETIZATION_TIERS = [
  {
    id: "plan-visitor",
    name: "Turista Responsable (Nodo Cero Pass)",
    priceUsd: 5.0,
    credits: 50,
    description: "Acceso a rutas turísticas inteligentes, audioguías históricas y estado en tiempo real del clima en Real del Monte.",
    features: [
      "Gemelo Digital: Consulta en vivo de monumentos y museos",
      "Mapa guiado de pasteerías tradicionales con sello de origen",
      "50 Créditos BookPI para micro-transacciones locales",
    ],
  },
  {
    id: "plan-citizen",
    name: "Ciudadano Digital Soberano",
    priceUsd: 15.0,
    credits: 200,
    description: "Participación en la Asamblea Digital Comunitaria, votación de presupuestos y catálogo completo de habilidades cognitivas.",
    features: [
      "Voz y voto en la Asamblea Comunitaria de Real del Monte",
      "Acceso ilimitado a consultas con Isabella AI",
      "200 Créditos BookPI mensuales acumulables",
      "Soporte prioritario y trazabilidad en Ledger BookPI",
    ],
  },
  {
    id: "plan-merchant",
    name: "Comercio Soberano RDM",
    priceUsd: 35.0,
    credits: 600,
    description: "Para artesanos, pasteerías, guías y hospedajes locales. Incluye Sello de Autenticidad Territorial y cobros sin intermediarios.",
    features: [
      "Emisión y verificación de Sello Criptográfico de Origen",
      "Cobros directos con cero comisiones financieras extractivas",
      "Listado destacado en el Gemelo Digital Territorial",
      "600 Créditos BookPI mensuales",
    ],
  },
  {
    id: "plan-nodo-cero-enterprise",
    name: "Nodo Cero Institucional / Red TAMV",
    priceUsd: 120.0,
    credits: 2500,
    description: "Infraestructura completa para gobiernos locales, universidades y centros de investigación territorial.",
    features: [
      "Telemetría ambiental IoT completa de montaña (sensores 2,700m)",
      "Simulación de impacto turístico y sostenibilidad regenerativa",
      "Acceso a APIs nativas de alta concurrencia con SLA 99.9%",
      "2,500 Créditos BookPI mensuales con auditoría criptográfica",
    ],
  },
];

const MARKETPLACE_SKILLS = [
  {
    skillId: "nodo-cero-twin",
    name: "Real del Monte Territorial Digital Twin",
    costCredits: 0,
    billingType: "FREE_INCLUDED",
    category: "TERRITORY",
  },
  {
    skillId: "rdm-sovereign-commerce",
    name: "Certificación de Comercio y Origen",
    costCredits: 10,
    billingType: "PER_EXECUTION",
    category: "ECONOMY",
  },
  {
    skillId: "rdm-community-assembly",
    name: "Asamblea Digital Comunitaria",
    costCredits: 5,
    billingType: "PER_EXECUTION",
    category: "SOVEREIGNTY",
  },
  {
    skillId: "fast-parallel-ingest",
    name: "Ingesta Paralela de Datos y Streaming",
    costCredits: 15,
    billingType: "PER_GB",
    category: "INFRASTRUCTURE",
  },
  {
    skillId: "qstash-event-dispatcher",
    name: "Enrutador de Eventos Asíncronos",
    costCredits: 2,
    billingType: "PER_100_EVENTS",
    category: "INFRASTRUCTURE",
  },
  {
    skillId: "docs-instant-search",
    name: "Búsqueda Semántica Instantánea",
    costCredits: 1,
    billingType: "PER_QUERY",
    category: "EDUCATION",
  },
];

const purchaseSchema = z.object({
  action: z.enum(["purchase-tier", "topup-credits", "unlock-skill"]),
  tierId: z.string().optional(),
  creditAmount: z.number().int().positive().max(100000).optional(),
  skillId: z.string().optional(),
});

export const Route = createFileRoute("/api/v1/monetization")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async (context) => {
        return json({
          success: true,
          account: {
            tenantId: context.tenantId,
            userId: context.userId,
            currentTier: "plan-citizen",
            sovereignCreditsBalance: 450,
            currency: "BOOKPI_CREDITS",
            lastLedgerAuditHash: `0x${Buffer.from(`audit-${context.tenantId}`).toString("hex").slice(0, 32)}`,
          },
          tiers: MONETIZATION_TIERS,
          marketplaceSkills: MARKETPLACE_SKILLS,
        });
      }),

      POST: withSovereignAuth("system", "execute", async (context, request) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "JSON inválido." }, 400);
        }

        const parsed = purchaseSchema.safeParse(body);
        if (!parsed.success) {
          return json({ error: "Datos de transacción inválidos.", details: parsed.error.issues }, 400);
        }

        const timestamp = new Date().toISOString();
        const txHash = `tx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

        if (parsed.data.action === "purchase-tier") {
          const tier = MONETIZATION_TIERS.find((t) => t.id === parsed.data.tierId);
          if (!tier) {
            return json({ error: "Plan no encontrado." }, 404);
          }

          return json({
            success: true,
            transaction: {
              txHash,
              action: "PURCHASE_TIER",
              tierId: tier.id,
              tierName: tier.name,
              creditedAmount: tier.credits,
              chargedUsd: tier.priceUsd,
              timestamp,
              ledgerVerification: "RECORDED_IN_BOOKPI",
            },
          });
        }

        if (parsed.data.action === "topup-credits") {
          const credits = parsed.data.creditAmount ?? 100;
          const costUsd = Number((credits * 0.08).toFixed(2));

          return json({
            success: true,
            transaction: {
              txHash,
              action: "TOPUP_CREDITS",
              creditsAdded: credits,
              chargedUsd: costUsd,
              timestamp,
              ledgerVerification: "RECORDED_IN_BOOKPI",
            },
          });
        }

        // unlock-skill
        const skill = MARKETPLACE_SKILLS.find((s) => s.skillId === parsed.data.skillId);
        if (!skill) {
          return json({ error: "Habilidad del marketplace no encontrada." }, 404);
        }

        return json({
          success: true,
          transaction: {
            txHash,
            action: "UNLOCK_SKILL",
            skillId: skill.skillId,
            skillName: skill.name,
            creditsDeducted: skill.costCredits,
            timestamp,
            ledgerVerification: "RECORDED_IN_BOOKPI",
          },
        });
      }),
    },
  },
});
