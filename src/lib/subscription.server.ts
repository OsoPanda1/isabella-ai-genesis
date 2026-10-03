/**
 * Isabella Subscription & Quota Engine.
 *
 * Production/staging quota state is authoritative in PostgreSQL. Local
 * development/test may use SQLite or memory stores.
 */
import { createHash } from "node:crypto";
import {
  getSubscriptionStore,
  getSubscriptionBucket,
  getSubscriptionPlan,
  saveSubscriptionPlan,
  type UsageLimits,
} from "./persistence/subscription-store";

export type IsabellaPlanId = "free" | "plus" | "premium" | "vip" | "enterprise" | "custom";
export type MeteredCapability = "chat" | "voice" | "image" | "tool" | "agent";

export interface IsabellaPlan {
  id: IsabellaPlanId;
  name: string;
  monthlyUsd: number | null;
  dailyMessages: number;
  dailyImages: number;
  dailyVoiceSeconds: number;
  maxAgentSessions: number;
  features: string[];
  stripePriceEnv?: string;
}

export interface UsageDecision {
  allowed: boolean;
  plan: IsabellaPlan;
  usage: UsageBucket;
  remaining: { messages: number; images: number; voiceSeconds: number; agentSessions: number };
  resetAt: string;
  upgradeRequired?: boolean;
  reason?: string;
}

export interface UsageBucket {
  userId: string;
  dayKey: string;
  messages: number;
  images: number;
  voiceSeconds: number;
  agentSessions: number;
  updatedAt: string;
}

export const ISABELLA_PLANS: IsabellaPlan[] = [
  {
    id: "free",
    name: "Isabella Free",
    monthlyUsd: 0,
    dailyMessages: 25,
    dailyImages: 3,
    dailyVoiceSeconds: 180,
    maxAgentSessions: 1,
    features: ["CROWN Gateway básico", "Memoria inmediata", "Voz Web Speech", "Trazabilidad ARGUS"],
  },
  {
    id: "plus",
    name: "Isabella Plus",
    monthlyUsd: 15,
    dailyMessages: 250,
    dailyImages: 40,
    dailyVoiceSeconds: 1800,
    maxAgentSessions: 3,
    stripePriceEnv: "STRIPE_PRICE_PLUS",
    features: [
      "Precio introductorio",
      "Gemini Flash federado",
      "Voice Studio ampliado",
      "Historial de sesión",
    ],
  },
  {
    id: "premium",
    name: "Isabella Premium",
    monthlyUsd: 22.49,
    dailyMessages: 600,
    dailyImages: 100,
    dailyVoiceSeconds: 5400,
    maxAgentSessions: 8,
    stripePriceEnv: "STRIPE_PRICE_PREMIUM",
    features: [
      "Prioridad CROWN",
      "Imagen Flux/Imagen",
      "Memoria de proyecto",
      "Exportación de auditoría",
    ],
  },
  {
    id: "vip",
    name: "Isabella VIP",
    monthlyUsd: 37.49,
    dailyMessages: 1500,
    dailyImages: 250,
    dailyVoiceSeconds: 14400,
    maxAgentSessions: 20,
    stripePriceEnv: "STRIPE_PRICE_VIP",
    features: [
      "Baja latencia",
      "Agentes programáticos",
      "Herramientas ORION",
      "Soporte prioritario",
    ],
  },
  {
    id: "enterprise",
    name: "Isabella Enterprise",
    monthlyUsd: 112.5,
    dailyMessages: 10000,
    dailyImages: 1000,
    dailyVoiceSeconds: 86400,
    maxAgentSessions: 100,
    stripePriceEnv: "STRIPE_PRICE_ENTERPRISE",
    features: [
      "Tenant dedicado",
      "SLA comercial",
      "SSO/API keys",
      "Retención y auditoría avanzada",
    ],
  },
  {
    id: "custom",
    name: "Isabella Custom Sovereign",
    monthlyUsd: null,
    dailyMessages: Number.MAX_SAFE_INTEGER,
    dailyImages: Number.MAX_SAFE_INTEGER,
    dailyVoiceSeconds: Number.MAX_SAFE_INTEGER,
    maxAgentSessions: Number.MAX_SAFE_INTEGER,
    features: [
      "Contrato a medida",
      "Despliegue soberano",
      "Modelos privados/locales",
      "Jurisdicción territorial",
    ],
  },
];

function todayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}
function resetAtIso(now = new Date()): string {
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return next.toISOString();
}
export function stableUserId(raw?: string): string {
  const candidate = raw?.trim() || "anonymous";
  return createHash("sha256").update(candidate).digest("hex").slice(0, 20);
}
export function planById(planId?: string): IsabellaPlan {
  return ISABELLA_PLANS.find((plan) => plan.id === planId) || ISABELLA_PLANS[0];
}

export function setUserPlan(userId: string, planId: IsabellaPlanId): IsabellaPlan {
  const plan = planById(planId);
  void saveSubscriptionPlan(userId, plan.id);
  return plan;
}

export function getUserPlan(userId: string, explicitPlan?: string): IsabellaPlan {
  // Explicit plan may only be used when supplied by an already-authenticated
  // server-side principal. The billing middleware never trusts a client value.
  const plan = explicitPlan || undefined;
  if (plan) return planById(plan);
  // Synchronous API retained for local callers. Production plan resolution is
  // performed asynchronously by consumeUsage/getUsage before a quota mutation.
  const store = getSubscriptionStore();
  if (store.mode === "postgres") return ISABELLA_PLANS[0];
  return planById(store.getPlan(userId) || undefined);
}

export async function getUserPlanAsync(
  userId: string,
  explicitPlan?: string,
): Promise<IsabellaPlan> {
  if (explicitPlan) return planById(explicitPlan);
  return planById((await getSubscriptionPlan(userId)) || undefined);
}

export async function getUsage(userId: string): Promise<UsageBucket> {
  const dayKey = todayKey();
  const current = await getSubscriptionBucket(userId, dayKey);
  if (current) return current;
  return {
    userId,
    dayKey,
    messages: 0,
    images: 0,
    voiceSeconds: 0,
    agentSessions: 0,
    updatedAt: new Date().toISOString(),
  };
}

function decision(
  plan: IsabellaPlan,
  usage: UsageBucket,
  allowed = true,
  capability: MeteredCapability = "chat",
  reason?: string,
): UsageDecision {
  return {
    allowed,
    plan,
    usage,
    resetAt: resetAtIso(),
    remaining: {
      messages: Math.max(0, plan.dailyMessages - usage.messages),
      images: Math.max(0, plan.dailyImages - usage.images),
      voiceSeconds: Math.max(0, plan.dailyVoiceSeconds - usage.voiceSeconds),
      agentSessions: Math.max(0, plan.maxAgentSessions - usage.agentSessions),
    },
    upgradeRequired: !allowed,
    reason:
      reason ??
      (allowed ? undefined : `Límite diario ${capability} alcanzado para el plan ${plan.name}.`),
  };
}

export async function evaluateUsage(
  userId: string,
  capability: MeteredCapability,
  amount = 1,
  explicitPlan?: string,
): Promise<UsageDecision> {
  const plan = await getUserPlanAsync(userId, explicitPlan);
  const usage = await getUsage(userId);
  const next = { ...usage };
  const requested = Math.max(1, Math.ceil(amount));
  if (capability === "chat" || capability === "tool") next.messages += requested;
  if (capability === "image") next.images += requested;
  if (capability === "voice") next.voiceSeconds += requested;
  if (capability === "agent") next.agentSessions += requested;
  const allowed =
    next.messages <= plan.dailyMessages &&
    next.images <= plan.dailyImages &&
    next.voiceSeconds <= plan.dailyVoiceSeconds &&
    next.agentSessions <= plan.maxAgentSessions;
  return decision(plan, usage, allowed, capability);
}

export async function consumeUsage(
  userId: string,
  capability: MeteredCapability,
  amount = 1,
  explicitPlan?: string,
): Promise<UsageDecision> {
  const plan = await getUserPlanAsync(userId, explicitPlan);
  const limits: UsageLimits = {
    dailyMessages: plan.dailyMessages,
    dailyImages: plan.dailyImages,
    dailyVoiceSeconds: plan.dailyVoiceSeconds,
    maxAgentSessions: plan.maxAgentSessions,
  };
  const result = await getSubscriptionStore().tryConsume(
    userId,
    todayKey(),
    capability,
    amount,
    limits,
  );
  return decision(plan, result.usage, result.allowed, capability);
}

export function buildCheckoutUrl(planId: IsabellaPlanId, userId: string): string {
  const plan = planById(planId);
  const baseUrl =
    process.env.BILLING_CHECKOUT_BASE_URL || process.env.PUBLIC_APP_URL || "http://localhost:3000";
  const priceEnv = plan.stripePriceEnv ? process.env[plan.stripePriceEnv] : undefined;
  if (process.env.STRIPE_SECRET_KEY) {
    const url = new URL("/api/v1/billing/checkout/provider", baseUrl);
    url.searchParams.set("plan", plan.id);
    url.searchParams.set("user", stableUserId(userId));
    if (priceEnv) url.searchParams.set("price", priceEnv);
    return url.toString();
  }
  return `${baseUrl.replace(/\/$/, "")}/billing/contact?plan=${encodeURIComponent(plan.id)}`;
}
