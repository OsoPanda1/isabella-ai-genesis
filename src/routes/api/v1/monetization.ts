import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import {
  economyCapabilityGate,
  resolveSubscriptionStatus,
} from "@/lib/monetization/economic-authority";

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

/**
 * Auditoría Fase 0 (P0-04): la ruta de monetización v1 estaba devolviendo
 * transacciones sintéticas (`success:true`, `ledgerVerification:RECORDED_IN_BOOKPI`,
 * saldo fijo 450, hash derivado de `audit-${tenantId}`) sin pago ni BookPI reales.
 *
 * Correcciones:
 * - Runtime staging/production ⇒ 503 CAPABILITY_NOT_CERTIFIED (gate enforceado
 *   en economic-authority, no en manos del desarrollador de la ruta).
 * - POST siempre 503: las transacciones sintéticas fueron eliminadas; hasta que
 *   exista EconomicAuthority canónico (Stripe → economic-events → BookPI) no se
 *   ejecuta ninguna operación económica por esta ruta.
 * - GET en development sirve solo el catálogo (tiers/skills) sin saldo ni hashes
 *   sintéticos; el estado de cuenta sale de la fuente durable cuando exista.
 */

const MONETIZATION_TIERS = [
  {
    id: "plan-visitor",
    name: "Turista Responsable (Nodo Cero Pass)",
    priceUsd: 5.0,
    credits: 50,
    description:
      "Acceso a rutas turísticas inteligentes, audioguías históricas y estado en tiempo real del clima en Real del Monte.",
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
    description:
      "Participación en la Asamblea Digital Comunitaria, votación de presupuestos y catálogo completo de habilidades cognitivas.",
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
    description:
      "Para artesanos, pasteerías, guías y hospedajes locales. Incluye Sello de Autenticidad Territorial y cobros sin intermediarios.",
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
    description:
      "Infraestructura completa para gobiernos locales, universidades y centros de investigación territorial.",
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

function capabilityNotCertifiedResponse(gate: ReturnType<typeof economyCapabilityGate>) {
  if (!gate.blocked) return null;
  return json(
    {
      success: false,
      error: gate.error,
      capability: gate.capability,
      notes: gate.notes,
      authority: "billing (src/server-routes/api/billing.ts) — única ruta económica viva",
    },
    503,
  );
}

export const Route = createFileRoute("/api/v1/monetization")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async (context) => {
        const gate = economyCapabilityGate();
        const blocked = capabilityNotCertifiedResponse(gate);
        if (blocked) return blocked;

        // Catálogo de solo lectura. Sin saldo sintético, sin hash sintético.
        return json({
          success: true,
          certification: "CAPABILITY_NOT_CERTIFIED",
          account: {
            tenantId: context.tenantId,
            userId: context.userId,
            currentTier: null,
            sovereignCreditsBalance: null,
            currency: "BOOKPI_CREDITS",
            lastLedgerAuditHash: null,
            note: "Saldo y auditoría requieren EconomicAuthority durable (Stripe → BookPI). Nunca se sirven valores sintéticos.",
          },
          subscription: resolveSubscriptionStatus(context.tenantId, context.userId),
          tiers: MONETIZATION_TIERS,
          marketplaceSkills: MARKETPLACE_SKILLS,
        });
      }),

      POST: withSovereignAuth("system", "execute", async () => {
        // Fase 0 (auditoría P0-04): toda operación económica sintética eliminada.
        return json(
          {
            success: false,
            error: "CAPABILITY_NOT_CERTIFIED",
            capability: "economy.ledger",
            notes:
              "Las transacciones sintéticas (purchase-tier/topup-credits/unlock-skill sin pago ni BookPI) fueron eliminadas. La liquidación real vive en billing.ts (Stripe + economic-events + BookPI idempotente). Esta ruta devolverá 503 hasta la certificación de EconomicAuthority.",
          },
          503,
        );
      }),
    },
  },
});
