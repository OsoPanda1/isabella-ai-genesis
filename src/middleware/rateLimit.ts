import type { NextFunction, Request, Response } from "express";
import {
  buildCheckoutUrl,
  consumeUsage,
  stableUserId,
  type MeteredCapability,
} from "../lib/subscription.server";
import { currentPrincipal } from "../lib/auth.server";
import { nodeRequire } from "../lib/node-require";

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60_000;
const DEFAULT_LIMIT = 120;
const MEMORY_BUCKETS = new Map<string, Bucket>();
const UPSTASH_URL =
  process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "") ||
  process.env.KV_REST_API_URL?.replace(/\/$/, "");
const UPSTASH_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_TOKEN;
const REDIS_URL = process.env.REDIS_URL;
const REDIS_ENABLED = Boolean(REDIS_URL || (UPSTASH_URL && UPSTASH_TOKEN));

function productionLike(): boolean {
  const mode = String(process.env.ISABELLA_RUNTIME_MODE ?? "")
    .trim()
    .toLowerCase();
  return (
    process.env.NODE_ENV === "production" ||
    mode === "production" ||
    mode === "staging" ||
    process.env.REQUIRE_DISTRIBUTED_RATE_LIMIT === "true"
  );
}

function requireDistributed(): boolean {
  return productionLike();
}

type RedisLike = {
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
  ttl(key: string): Promise<number>;
};

let directClient: RedisLike | null = null;
let directClientError: unknown = null;

function getDirectRedis(): RedisLike | null {
  if (!REDIS_URL || directClientError) return null;
  if (directClient) return directClient;
  try {
    const RedisCtor = nodeRequire("ioredis") as unknown as new (
      url: string,
      opts: Record<string, unknown>,
    ) => RedisLike;
    directClient = new RedisCtor(REDIS_URL, {
      lazyConnect: true,
      connectTimeout: 3000,
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      retryStrategy: () => null,
    });
    return directClient;
  } catch (error) {
    directClientError = error;
    return null;
  }
}

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of MEMORY_BUCKETS) {
    if (bucket.resetAt <= now) MEMORY_BUCKETS.delete(key);
  }
}, 120_000).unref?.();

function clientKey(req: Request): string {
  let principal: ReturnType<typeof currentPrincipal> | null = null;
  try {
    principal = currentPrincipal(req);
  } catch {
    // Anonymous requests are keyed by the socket/proxy-normalized Express IP.
  }
  const tenant = principal?.tenantId || "anonymous";
  const subject =
    principal?.sub ||
    (typeof req.ip === "string" && req.ip.trim()
      ? req.ip.trim()
      : req.socket.remoteAddress || "unknown");
  return `rl:v2:${tenant}:${subject}`;
}

async function directRedisIncrement(key: string): Promise<Bucket | null> {
  const client = getDirectRedis();
  if (!client) return null;
  const count = await client.incr(key);
  if (count === 1) await client.expire(key, 60);
  const ttl = await client.ttl(key).catch(() => 60);
  return { count, resetAt: Date.now() + Math.max(1, ttl) * 1000 };
}

async function upstashIncrement(key: string): Promise<Bucket | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  const encoded = encodeURIComponent(key);
  const auth = { Authorization: `Bearer ${UPSTASH_TOKEN}` };
  const incrResponse = await fetch(`${UPSTASH_URL}/incr/${encoded}`, { headers: auth });
  if (!incrResponse.ok) throw new Error("Redis rate-limit backend unavailable");
  const incr = (await incrResponse.json()) as { result?: number };
  if (incr.result === 1) {
    const expireResponse = await fetch(`${UPSTASH_URL}/expire/${encoded}/60`, { headers: auth });
    if (!expireResponse.ok) throw new Error("Redis expiry configuration failed");
  }
  const ttlResponse = await fetch(`${UPSTASH_URL}/ttl/${encoded}`, { headers: auth });
  if (!ttlResponse.ok) throw new Error("Redis TTL lookup failed");
  const ttl = ((await ttlResponse.json()) as { result?: number }).result ?? 60;
  return { count: incr.result ?? 1, resetAt: Date.now() + Math.max(1, ttl) * 1000 };
}

async function redisIncrement(key: string): Promise<Bucket | null> {
  if (!REDIS_ENABLED) return null;
  if (REDIS_URL) {
    const direct = await directRedisIncrement(key);
    if (direct) return direct;
  }
  return upstashIncrement(key);
}

function memoryIncrement(key: string): Bucket {
  const now = Date.now();
  const bucket = MEMORY_BUCKETS.get(key) || { count: 0, resetAt: now + WINDOW_MS };
  if (bucket.resetAt <= now) {
    bucket.count = 0;
    bucket.resetAt = now + WINDOW_MS;
  }
  bucket.count += 1;
  MEMORY_BUCKETS.set(key, bucket);
  return bucket;
}

export async function rateLimit(req: Request, res: Response, next: NextFunction) {
  const parsedLimit = Number(process.env.RATE_LIMIT_PER_MINUTE || DEFAULT_LIMIT);
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.floor(parsedLimit) : DEFAULT_LIMIT;
  try {
    const bucket = await redisIncrement(clientKey(req));
    if (!bucket && requireDistributed()) {
      res.setHeader("X-RateLimit-Backend", "redis-required");
      return res.status(503).json({
        ok: false,
        error: {
          code: "RATE_LIMIT_BACKEND_REQUIRED",
          message: "Distributed rate limiting is unavailable.",
        },
      });
    }
    const effective = bucket ?? memoryIncrement(clientKey(req));
    res.setHeader("X-RateLimit-Backend", bucket ? "distributed" : "memory");
    res.setHeader("X-RateLimit-Limit", String(limit));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, limit - effective.count)));
    res.setHeader("X-RateLimit-Reset", new Date(effective.resetAt).toISOString());
    if (effective.count > limit) {
      return res.status(429).json({
        ok: false,
        error: {
          code: "RATE_LIMITED",
          message: "Rate limit ARGUS activado. Intenta nuevamente en menos de un minuto.",
        },
      });
    }
    return next();
  } catch {
    if (requireDistributed()) {
      res.setHeader("X-RateLimit-Backend", "redis-unavailable");
      return res.status(503).json({
        ok: false,
        error: {
          code: "RATE_LIMIT_BACKEND_UNAVAILABLE",
          message: "Distributed rate limiting is required and currently unavailable.",
        },
      });
    }
    const effective = memoryIncrement(clientKey(req));
    res.setHeader("X-RateLimit-Backend", "memory-fallback");
    res.setHeader("X-RateLimit-Limit", String(limit));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, limit - effective.count)));
    res.setHeader("X-RateLimit-Reset", new Date(effective.resetAt).toISOString());
    return next();
  }
}

export function quotaGate(capability: MeteredCapability, amountFactory?: (req: Request) => number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const principal = currentPrincipal(req);
    const userId = stableUserId(`${principal.tenantId}:${principal.sub}`);
    const plan = principal.plan;
    const amount = amountFactory ? amountFactory(req) : 1;
    try {
      const decision = await consumeUsage(userId, capability, amount, plan);
      res.setHeader("X-Isabella-Plan", decision.plan.id);
      res.setHeader("X-Isabella-Usage-Reset", decision.resetAt);
      res.setHeader("X-Isabella-Remaining-Messages", String(decision.remaining.messages));
      if (!decision.allowed) {
        return res.status(402).json({
          ok: false,
          error: { code: "QUOTA_EXCEEDED", message: decision.reason },
          upgradeRequired: true,
          plan: decision.plan,
          usage: decision.usage,
          remaining: decision.remaining,
          resetAt: decision.resetAt,
          checkout: buildCheckoutUrl("plus", userId),
        });
      }
      req.isabellaBilling = { userId, decision };
      return next();
    } catch {
      return res.status(503).json({
        ok: false,
        error: { code: "QUOTA_BACKEND_UNAVAILABLE", message: "Quota authority unavailable." },
      });
    }
  };
}

export function getBillingIdentity(req: Request): { userId: string; plan?: string } {
  const principal = currentPrincipal(req);
  return { userId: stableUserId(`${principal.tenantId}:${principal.sub}`), plan: principal.plan };
}
