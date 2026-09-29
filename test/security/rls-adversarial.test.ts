import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { SecuritySystem } from "@/lib/security";
import { resolveTenantContext, guardTenantBoundary, TenantBoundaryError } from "@/lib/tenant-guard";

// ---------------------------------------------------------------------------
// RLS Adversarial — Tenant A vs B
// Verifica aislamiento multi-tenant a nivel DB (Supabase RLS) y Firestore,
// además de rate limiting y quotas por tenant (P0-13).
// ---------------------------------------------------------------------------

describe("RLS Adversarial — Tenant A vs B (Supabase + Firestore)", () => {
  beforeEach(() => {
    SecuritySystem._clearTenantCachesForTests();
  });

  // Helper que simula la política RLS: tenant_id = current_tenant_id()
  function rlsFilter(
    rows: Array<{ id: string; tenant_id: string; data: string }>,
    currentTenantId: string,
  ): Array<{ id: string; tenant_id: string; data: string }> {
    if (!currentTenantId || currentTenantId === "system" || currentTenantId === "anon") {
      return [];
    }
    return rows.filter((r) => r.tenant_id === currentTenantId);
  }

  const fixtures = [
    { id: "row_1", tenant_id: "tenant_a", data: "secreto A1" },
    { id: "row_2", tenant_id: "tenant_a", data: "secreto A2" },
    { id: "row_3", tenant_id: "tenant_b", data: "secreto B1" },
  ];

  it("Tenant A solo ve filas de A (RLS tenant_id = current_tenant_id())", () => {
    const visible = rlsFilter(fixtures, "tenant_a");
    expect(visible).toHaveLength(2);
    expect(visible.every((r) => r.tenant_id === "tenant_a")).toBe(true);
    expect(visible.find((r) => r.tenant_id === "tenant_b")).toBeUndefined();
  });

  it("Tenant B solo ve filas de B — no hay crossover", () => {
    const visible = rlsFilter(fixtures, "tenant_b");
    expect(visible).toHaveLength(1);
    expect(visible[0].tenant_id).toBe("tenant_b");
  });

  it("Tenant A vs B vía tenant-guard: cross-tenant es DENY (403)", () => {
    const ctxA = resolveTenantContext({
      authenticated: true,
      subject: "alice",
      tenantId: "tenant_a",
      requestedTenantId: "tenant_b",
    });
    expect(ctxA.boundaryOk).toBe(false);
    expect(() => guardTenantBoundary(ctxA)).toThrow(TenantBoundaryError);

    const ctxB = resolveTenantContext({
      authenticated: true,
      subject: "bob",
      tenantId: "tenant_b",
      requestedTenantId: "tenant_a",
    });
    expect(ctxB.boundaryOk).toBe(false);
    expect(() => guardTenantBoundary(ctxB)).toThrow(TenantBoundaryError);
  });

  it("Tenant A -> datos A = ALLOW vía tenant-guard", () => {
    const ctx = resolveTenantContext({
      authenticated: true,
      subject: "alice",
      tenantId: "tenant_a",
      requestedTenantId: "tenant_a",
    });
    expect(ctx.boundaryOk).toBe(true);
    expect(() => guardTenantBoundary(ctx)).not.toThrow();
  });

  it("Usuario no autenticado no ve filas tenant-scoped (RLS fail-closed)", () => {
    const anon = rlsFilter(fixtures, "anon");
    expect(anon).toHaveLength(0);
    const empty = rlsFilter(fixtures, "");
    expect(empty).toHaveLength(0);
  });

  it("generateSupabaseRlsToken si existe env: embebe tenantId desigual por tenant", async () => {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      // Sin secreto no hay RLS posible — debe fallar fail-closed.
      expect(() => SecuritySystem.generateSupabaseRlsToken("user_a", "tenant_a", "scope")).toThrow(
        /SUPABASE_JWT_SECRET/,
      );
      return;
    }
    const tokenA = SecuritySystem.generateSupabaseRlsToken("user_a", "tenant_a", "isabella:chat");
    const tokenB = SecuritySystem.generateSupabaseRlsToken("user_b", "tenant_b", "isabella:chat");
    expect(tokenA).not.toBe(tokenB);
    // Decodificar payload sin verificar para inspeccionar claims
    const payloadA = JSON.parse(Buffer.from(tokenA.split(".")[1], "base64url").toString("utf8"));
    const payloadB = JSON.parse(Buffer.from(tokenB.split(".")[1], "base64url").toString("utf8"));
    expect(payloadA.tenantId).toBe("tenant_a");
    expect(payloadA.tenant_id).toBe("tenant_a");
    expect(payloadB.tenantId).toBe("tenant_b");
    expect(payloadB.tenant_id).toBe("tenant_b");
    expect(payloadA.tenantId).not.toBe(payloadB.tenantId);
  });
});

describe("Rate Limiting por Tenant — aislamiento", () => {
  beforeEach(() => {
    SecuritySystem._clearTenantCachesForTests();
  });

  it("checkRateLimitByTenant: Tenant A agota su límite, Tenant B sigue ALLOW", () => {
    const limit = 3;
    // Tenant A: 3 requests OK, 4ta DENY
    expect(SecuritySystem.checkRateLimitByTenant("tenant_a", limit).allowed).toBe(true);
    expect(SecuritySystem.checkRateLimitByTenant("tenant_a", limit).allowed).toBe(true);
    expect(SecuritySystem.checkRateLimitByTenant("tenant_a", limit).allowed).toBe(true);
    const deniedA = SecuritySystem.checkRateLimitByTenant("tenant_a", limit);
    expect(deniedA.allowed).toBe(false);
    expect(deniedA.reason).toBe("tenant-rate-limit-exceeded");

    // Tenant B: independiente, debe permitir
    const allowedB = SecuritySystem.checkRateLimitByTenant("tenant_b", limit);
    expect(allowedB.allowed).toBe(true);
    expect(allowedB.remaining).toBe(limit - 1);
  });

  it("checkRateLimitByTenant fail-closed con tenant vacío/inválido", () => {
    expect(SecuritySystem.checkRateLimitByTenant("", 10).allowed).toBe(false);
    expect(SecuritySystem.checkRateLimitByTenant("   ", 10).allowed).toBe(false);
    // formato inválido (inyección)
    expect(SecuritySystem.checkRateLimitByTenant("tenant/../etc", 10).allowed).toBe(false);
  });

  it("checkRateLimitByTenant respeta remaining decreciente", () => {
    const limit = 5;
    const r1 = SecuritySystem.checkRateLimitByTenant("tenant_quota_test", limit);
    expect(r1.remaining).toBe(4);
    const r2 = SecuritySystem.checkRateLimitByTenant("tenant_quota_test", limit);
    expect(r2.remaining).toBe(3);
  });
});

describe("Quotas por Tenant — aislamiento diario", () => {
  beforeEach(() => {
    SecuritySystem._clearTenantCachesForTests();
  });

  it("Tenant A consume cuota sin afectar a Tenant B", () => {
    const quota = 100;
    // A consume 60
    expect(SecuritySystem.consumeTenantQuota("tenant_a", 60, quota).allowed).toBe(true);
    expect(SecuritySystem.checkTenantQuota("tenant_a", quota).consumed).toBe(60);
    expect(SecuritySystem.checkTenantQuota("tenant_a", quota).remaining).toBe(40);

    // B intacto
    expect(SecuritySystem.checkTenantQuota("tenant_b", quota).consumed).toBe(0);
    expect(SecuritySystem.checkTenantQuota("tenant_b", quota).remaining).toBe(100);
    expect(SecuritySystem.consumeTenantQuota("tenant_b", 10, quota).allowed).toBe(true);
    expect(SecuritySystem.checkTenantQuota("tenant_b", quota).consumed).toBe(10);
  });

  it("Quota excedida es DENY y no consume", () => {
    const quota = 50;
    expect(SecuritySystem.consumeTenantQuota("tenant_c", 40, quota).allowed).toBe(true);
    const denied = SecuritySystem.consumeTenantQuota("tenant_c", 20, quota);
    expect(denied.allowed).toBe(false);
    expect(denied.reason).toBe("quota-exceeded");
    // consumo permanece 40
    expect(SecuritySystem.checkTenantQuota("tenant_c", quota).consumed).toBe(40);
  });

  it("Quotas fail-closed con tenant vacío", () => {
    expect(SecuritySystem.consumeTenantQuota("", 10, 100).allowed).toBe(false);
    expect(SecuritySystem.checkTenantQuota("", 100).allowed).toBe(false);
  });

  it("getTenantQuotaStatus y resetTenantQuota funcionan", () => {
    SecuritySystem.consumeTenantQuota("tenant_d", 25, 100);
    const status = SecuritySystem.getTenantQuotaStatus("tenant_d");
    expect(status).not.toBeNull();
    expect(status!.consumed).toBe(25);
    SecuritySystem.resetTenantQuota("tenant_d");
    expect(SecuritySystem.getTenantQuotaStatus("tenant_d")).toBeNull();
    expect(SecuritySystem.checkTenantQuota("tenant_d", 100).consumed).toBe(0);
  });
});

describe("Firestore Rules — fail-closed", () => {
  it("firestore.rules contiene global deny y no permite allow sin auth", () => {
    const path = resolve(process.cwd(), "firestore.rules");
    const content = readFileSync(path, "utf8");
    // Global safety net: debe existir match /{document=**} con allow false
    expect(content).toMatch(/match\s+\/\{document=\*\*\}\s*\{\s*allow\s+read,\s*write:\s*if\s+false;/);
    // Debe exigir isVerified() o isSignedIn() en reglas de users/memories
    expect(content).toContain("isVerified()");
    // No debe contener allow true incondicional
    expect(content).not.toMatch(/allow\s+read,\s*write:\s*if\s+true/);
    // Debe prevenir self-escalation de role
    expect(content).toContain("incoming().role == 'citizen'");
  });
});
