import type Stripe from "stripe";
import type { IsabellaPlanId } from "../subscription.server";
import { setUserPlan, saveSubscriptionPlan } from "../subscription.server";
import { nodeRequire } from "../node-require";
import { claimWebhookEvent, markWebhookFailed, markWebhookProcessed } from "../economic-events";
import { createHash } from "node:crypto";

type StripeClient = Stripe | null;
type PriceObject = Stripe.Price;

export interface BillingAmount {
  label: string;
  amountCents: number;
  envVar: string;
}

export const STRIPE_CATALOG: Record<"plus" | "premium" | "vip" | "enterprise", BillingAmount> = {
  plus: { label: "Isabella Plus", amountCents: 1500, envVar: "STRIPE_PRICE_PLUS" },
  premium: { label: "Isabella Premium", amountCents: 2249, envVar: "STRIPE_PRICE_PREMIUM" },
  vip: { label: "Isabella VIP", amountCents: 3749, envVar: "STRIPE_PRICE_VIP" },
  enterprise: { label: "Isabella Enterprise", amountCents: 11250, envVar: "STRIPE_PRICE_ENTERPRISE" },
};

const PAID_PLANS: Array<keyof typeof STRIPE_CATALOG> = ["plus", "premium", "vip", "enterprise"];
let stripeClient: StripeClient = null;
let catalogReady = false;

export function getStripe(): StripeClient {
  if (stripeClient) return stripeClient;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  try {
    const StripeModule = nodeRequire("stripe") as unknown as new (apiKey: string, opts?: Record<string, unknown>) => NonNullable<StripeClient>;
    stripeClient = new StripeModule(secret, { apiVersion: "2024-06-20" });
  } catch {
    stripeClient = null;
  }
  return stripeClient;
}

export function stripeEnabled(): boolean { return Boolean(process.env.STRIPE_SECRET_KEY && getStripe()); }

function priceFromEnv(planId: keyof typeof STRIPE_CATALOG): PriceObject | null {
  const client = getStripe();
  if (!client) return null;
  const priceId = process.env[STRIPE_CATALOG[planId].envVar];
  return priceId ? ({ id: priceId } as PriceObject) : null;
}

export async function ensureStripeCatalog(): Promise<boolean> {
  const client = getStripe();
  if (!client) return false;
  if (catalogReady) return true;

  let allReady = true;
  for (const planId of PAID_PLANS) {
    const spec = STRIPE_CATALOG[planId];
    try {
      const products = await client.products.list({ active: true, limit: 100 });
      let product = products.data.find((p) => p.name === spec.label) ?? null;
      if (!product) product = await client.products.create({ name: spec.label, active: true });
      const prices = await client.prices.list({ product: product.id, active: true, limit: 100 });
      let price = prices.data.find(
        (p) => p.unit_amount === spec.amountCents && p.currency === "usd" && p.recurring?.interval === "month",
      ) ?? null;
      if (!price) {
        price = await client.prices.create({
          product: product.id,
          unit_amount: spec.amountCents,
          currency: "usd",
          recurring: { interval: "month" },
        });
      }
      process.env[spec.envVar] = price.id;
    } catch {
      allReady = false;
    }
  }

  catalogReady = allReady;
  return allReady;
}

export async function createStripeCheckoutSession(
  planId: IsabellaPlanId,
  clientReferenceId: string,
  idempotencyKey?: string,
): Promise<{ url: string } | null> {
  const client = getStripe();
  if (!client || planId === "free" || planId === "custom" || !(planId in STRIPE_CATALOG)) return null;
  if (!(await ensureStripeCatalog())) return null;
  const price = priceFromEnv(planId as keyof typeof STRIPE_CATALOG);
  if (!price) return null;

  const base = process.env.BILLING_CHECKOUT_BASE_URL || process.env.VITE_PUBLIC_APP_URL || "http://localhost:3000";
  const stableIdempotencyKey =
    idempotencyKey?.trim() ||
    `checkout:${createHash("sha256").update(`${clientReferenceId}:${planId}`).digest("hex")}`;
  try {
    const session = await client.checkout.sessions.create(
      {
        mode: "subscription",
        line_items: [{ price: price.id, quantity: 1 }],
        client_reference_id: clientReferenceId,
        metadata: { planId, userId: clientReferenceId },
        success_url: `${base}/billing/result?session_id={CHECKOUT_SESSION_ID}&status=success`,
        cancel_url: `${base}/billing/result?status=cancelled`,
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        payment_method_collection: "if_required",
      },
      { idempotencyKey: stableIdempotencyKey },
    );
    return session.url ? { url: session.url } : null;
  } catch {
    return null;
  }
}

export async function handleStripeWebhook(
  rawBody: string | Buffer,
  signature: string,
): Promise<{ received: boolean; error?: string }> {
  const client = getStripe();
  if (!client) return { received: false, error: "stripe_not_configured" };
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return { received: false, error: "STRIPE_WEBHOOK_SECRET not configured" };

  let event: Stripe.Event;
  try {
    event = client.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return { received: false, error: "webhook_signature_invalid" };
  }

  const claim = await claimWebhookEvent({
    provider: "stripe",
    providerEventId: event.id,
    eventType: event.type,
    payloadHash: createHash("sha256").update(Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody)).digest("hex"),
  });
  if (claim.status === "duplicate" || claim.status === "in_progress") return { received: true };
  if (claim.status === "error") return { received: false, error: "webhook_claim_failed" };

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const planId = (session.metadata?.planId ?? session.client_reference_id) as IsabellaPlanId | undefined;
      const userId = (session.client_reference_id ?? session.metadata?.userId) as string | undefined;
      if (
        userId &&
        planId &&
        (planId === "plus" || planId === "premium" || planId === "vip" || planId === "enterprise")
      ) {
        setUserPlan(userId, planId);\n        await saveSubscriptionPlan(userId, planId);
      }
    }
    await markWebhookProcessed(claim.id);
    return { received: true };
  } catch {
    await markWebhookFailed(claim.id, "stripe_webhook_processing_failed").catch(() => undefined);
    return { received: false, error: "webhook_processing_failed" };
  }
}
