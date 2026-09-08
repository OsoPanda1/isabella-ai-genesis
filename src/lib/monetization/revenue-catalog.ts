export type RevenueFrequency = "monthly" | "annual" | "transactional" | "event" | "usage" | "one_time";
export type RevenueStatus = "DESIGNED" | "IMPLEMENTED" | "TESTED" | "VERIFIED" | "PRODUCTION_VERIFIED" | "BLOCKED";

export interface RevenueStream {
  id: string;
  name: string;
  frequency: RevenueFrequency;
  pricingModel: string;
  status: RevenueStatus;
  requiresPaymentProvider: boolean;
  requiresRegulatoryReview: boolean;
  requiresHumanReview: boolean;
  notes: string[];
}

/**
 * Canonical catalog. Economic capability never implies authorization to move money.
 * Prices/margins from proposals are intentionally not encoded as production facts.
 */
export const REVENUE_STREAMS: readonly RevenueStream[] = [
  { id: "M-01", name: "Membresías de Creadores", frequency: "monthly", pricingModel: "subscription", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: false, requiresHumanReview: false, notes: [] },
  { id: "M-02", name: "Membresías VIP", frequency: "monthly", pricingModel: "high-ticket subscription", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: false, requiresHumanReview: false, notes: [] },
  { id: "M-03", name: "Comisión por Venta de Activos", frequency: "transactional", pricingModel: "percentage commission", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: false, notes: [] },
  { id: "M-04", name: "Activación de Tarjeta", frequency: "one_time", pricingModel: "fixed fee", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: true, notes: ["Sujeto a disponibilidad y cumplimiento del proveedor de emisión"] },
  { id: "M-05", name: "Diseños Especiales de Tarjetas", frequency: "one_time", pricingModel: "fixed fee", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: false, notes: [] },
  { id: "M-06", name: "Diseños Coleccionables de Tarjeta", frequency: "one_time", pricingModel: "fixed fee", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: false, notes: [] },
  { id: "M-07", name: "Canales Privados", frequency: "monthly", pricingModel: "subscription", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: false, requiresHumanReview: false, notes: [] },
  { id: "M-08", name: "Conversación 1-1", frequency: "transactional", pricingModel: "dynamic micro-payment", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: false, notes: ["No autoriza cargos sin consentimiento verificable"] },
  { id: "M-09", name: "V-Gifts Legendarios", frequency: "event", pricingModel: "event activation", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: false, requiresHumanReview: false, notes: [] },
  { id: "M-10", name: "V-Gifts Épicos", frequency: "event", pricingModel: "event activation", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: false, requiresHumanReview: false, notes: [] },
  { id: "M-11", name: "V-Gifts Raros", frequency: "event", pricingModel: "event activation", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: false, requiresHumanReview: false, notes: [] },
  { id: "M-12", name: "Marketplace de Dreamspaces", frequency: "transactional", pricingModel: "marketplace commission", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: false, notes: ["Requiere reglas de seller onboarding, refunds y disputes"] },
  { id: "M-13", name: "Licencias Enterprise", frequency: "annual", pricingModel: "enterprise SaaS/license", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: true, notes: [] },
  { id: "M-14", name: "Auditoría/registro como servicio", frequency: "monthly", pricingModel: "service subscription", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: true, notes: ["No afirmar certificación legal sin autoridad competente"] },
  { id: "M-15", name: "Renderizado 4D", frequency: "usage", pricingModel: "GPU usage", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: false, requiresHumanReview: false, notes: [] },
  { id: "M-16", name: "Auditoría Legal Avanzada", frequency: "transactional", pricingModel: "report/event", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: true, notes: ["Producto de tooling; dictamen jurídico requiere profesional habilitado"] },
  { id: "M-17", name: "Franquicia/Whitelabel", frequency: "annual", pricingModel: "territorial license", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: true, notes: [] },
  { id: "M-18", name: "Merchandise y hardware", frequency: "transactional", pricingModel: "direct sale", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: false, notes: [] },
  { id: "M-19", name: "Becas y cofinanciación", frequency: "annual", pricingModel: "grant/contribution", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: true, notes: ["No tratar subvenciones como ingresos garantizados"] },
  { id: "M-20", name: "Cursos y Diplomados", frequency: "one_time", pricingModel: "course/certification fee", status: "DESIGNED", requiresPaymentProvider: true, requiresRegulatoryReview: true, requiresHumanReview: true, notes: ["La validez de una certificación depende de la entidad emisora"] },
];

export function getRevenueStream(id: string): RevenueStream | undefined {
  return REVENUE_STREAMS.find(stream => stream.id === id);
}
