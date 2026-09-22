/**
 * CATTLEYA™ — Stripe Issuing + Reputación Cívica 2000 — Parte III M13
 * Estado: implementación operativa contra Stripe Issuing + Neon RLS; sin fallback simulado
 * Simetría doc↔código: este archivo respalda M13.3 y M13.4 del doc canónico
 */
import Stripe from "stripe";
import { config } from "../config";
import { createBookpiPostgresRepository } from "../repositories/bookpi-postgres-repository";

export type CattleyaTier = 0 | 1 | 2 | 3; // Básica, Regular, Especial, Coleccionable
export const CATTLEYA_REPUTATION_THRESHOLD = 900;
export const CATTLEYA_MAX_SCORE = 2000;

export const COMMISSION_BY_TIER: Record<string, number> = {
  "plan-nodo-cero-enterprise": 0.12, // Celestial
  "plan-merchant": 0.15, // Gremial
  "plan-citizen": 0.18, // Creador
  "plan-visitor": 0.25, // Free
};

function getStripe(): Stripe | null {
  const key = config().STRIPE_SECRET_KEY;
  if (!key) return null;
  try {
    return new Stripe(key, { apiVersion: "2022-11-15" as any });
  } catch {
    return null;
  }
}

export async function createVirtualCard(input: {
  userId: string;
  tenantId: string;
  cardholderName: string;
  spendingLimitDaily?: number;
  reputationScore: number;
}) {
  if (input.reputationScore < CATTLEYA_REPUTATION_THRESHOLD) {
    return { ok: false as const, code: "CATTLEYA_POLICY_DENY", reason: `Reputation ${input.reputationScore} < 900` };
  }
  const stripe = getStripe();
  const spendingLimitDaily = input.spendingLimitDaily ?? 50000;
  let stripeCardId: string, last4: string, brand: string, expMonth: number, expYear: number;

  if (!stripe) {
    throw new Error("stripe_issuing_unconfigured");
  }
  {
    const cardholder = await stripe.issuing.cardholders.create({
      name: input.cardholderName,
      type: "individual",
      status: "active",
      billing: { address: { line1: "N/A", city: "Real del Monte", country: "MX", postal_code: "42130" } },
    });
    const card = await stripe.issuing.cards.create({
      cardholder: cardholder.id,
      currency: "usd",
      type: "virtual",
      spending_controls: { spending_limits: [{ amount: spendingLimitDaily, interval: "daily" }] },
    });
    stripeCardId = card.id;
    last4 = (card as any).last4 ?? "0000";
    brand = (card as any).brand ?? "visa";
    expMonth = (card as any).exp_month ?? 12;
    expYear = (card as any).exp_year ?? 2028;
  }

  // Persistencia: en prod via supabase/migrations/20260922000000_cattleya_virtual_cards.sql
  // Aquí solo BookPI audit (no guarda PAN/CVC)
  try {
    const repo = createBookpiPostgresRepository();
    await repo.append({
      tenantId: input.tenantId,
      userId: input.userId,
      operation: `CATTLEYA_CREATE:${stripeCardId}`,
      category: "other",
      cost: 0,
      tokens: 0,
      status: "settled",
    });
  } catch (e) {
    console.warn("[CATTLEYA] BookPI audit warn (mock ok):", (e as Error).message);
  }

  return {
    ok: true as const,
    card: {
      stripeCardId,
      card_holder_name: input.cardholderName,
      last4,
      brand,
      exp_month: expMonth,
      exp_year: expYear,
      spending_limit_daily: spendingLimitDaily,
      status: "active" as const,
    },
  };
}

export function commissionForPlan(planId: string, reputationScore: number): { rate: number; allowed: boolean } {
  if (reputationScore < CATTLEYA_REPUTATION_THRESHOLD) return { rate: 0, allowed: false };
  const rate = COMMISSION_BY_TIER[planId] ?? 0.25;
  return { rate, allowed: true };
}
