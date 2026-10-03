/**
 * Principal Context & Session Authority (src/lib/principal-context.ts)
 * -------------------------------------------------------------
 * Enforces identity derivation strictly from authenticated tokens,
 * session validity check with active status and expiration verification,
 * and tenant isolation boundaries.
 */
import { Role } from "./rbac";
import { resolveRuntimeMode } from "./runtime-mode";

export type PrincipalKind = "jwt" | "api-key" | "system" | "guest";

export interface PrincipalContext {
  readonly sub: string;
  readonly tenantId: string;
  readonly role: Role;
  readonly roles: readonly string[];
  readonly scopes: readonly string[];
  readonly kind: PrincipalKind;
  readonly apiKeyId?: string;
  readonly token_jti?: string;
  readonly is_active: boolean;
  readonly expiresAt?: number;
}

export interface SessionRecord {
  id: string;
  user_id: string;
  tenant_id: string;
  token_jti: string;
  is_active: boolean;
  expires_at: number | string;
  created_at?: string;
}

// In-memory session store (backed by Postgres sessions table in production)
const sessionStore = new Map<string, SessionRecord>();

export function registerSession(session: SessionRecord): void {
  sessionStore.set(session.token_jti, { ...session });
}

export function revokeSession(token_jti: string): void {
  const session = sessionStore.get(token_jti);
  if (session) {
    session.is_active = false;
    sessionStore.set(token_jti, session);
  }
}

export function validateSession(session: {
  is_active?: boolean;
  expires_at?: number | string;
  expiresAt?: number | string;
}): { valid: boolean; reason?: string } {
  if (session.is_active === false) {
    return { valid: false, reason: "SESSION_INACTIVE" };
  }

  const expVal = session.expires_at ?? session.expiresAt;
  if (expVal !== undefined) {
    const expTime = typeof expVal === "number" ? expVal * 1000 : new Date(expVal).getTime();
    if (Date.now() > expTime) {
      return { valid: false, reason: "SESSION_EXPIRED" };
    }
  }

  return { valid: true };
}

/**
 * Determines whether explicit development authentication mode is allowed.
 * Strictly forbidden in production.
 */
export function isExplicitDevelopmentAuth(): boolean {
  return resolveRuntimeMode() === "development" && process.env.ISABELLA_DEV_AUTH === "true";
}

/**
 * Evaluates whether guest chat is permitted under current policy.
 * Fail-closed: Never permitted in production.
 */
export function canUseGuestChat(): boolean {
  if (resolveRuntimeMode() === "production") {
    return false;
  }
  return process.env.ALLOW_GUEST_CHAT === "true";
}

export function createPrincipalContext(input: {
  sub: string;
  tenantId?: string;
  tenant_id?: string;
  role?: string;
  roles?: readonly string[];
  scopes?: readonly string[];
  kind?: PrincipalKind;
  apiKeyId?: string;
  token_jti?: string;
  is_active?: boolean;
  expires_at?: number | string;
  expiresAt?: number;
}): PrincipalContext {
  const tenantId = input.tenantId ?? input.tenant_id ?? "default-sovereign-tenant";
  const role = (input.role as Role) || "Guest";
  const roles = input.roles ? [...input.roles] : [role];
  const scopes = input.scopes ? [...input.scopes] : ["ai:inference"];
  const is_active = input.is_active !== false;

  return {
    sub: input.sub,
    tenantId,
    role,
    roles: Object.freeze(roles),
    scopes: Object.freeze(scopes),
    kind: input.kind ?? "jwt",
    apiKeyId: input.apiKeyId,
    token_jti: input.token_jti,
    is_active,
    expiresAt: typeof input.expires_at === "number" ? input.expires_at : input.expiresAt,
  };
}

export function isSystemPrincipal(ctx: PrincipalContext): boolean {
  return ctx.roles.includes("system") || ctx.role === "system";
}

export function hasRole(ctx: PrincipalContext, role: string): boolean {
  return ctx.roles.includes(role) || ctx.role === role;
}

export function hasScope(ctx: PrincipalContext, scope: string): boolean {
  if (ctx.scopes.includes("*")) return isSystemPrincipal(ctx);
  return ctx.scopes.includes(scope);
}

export default createPrincipalContext;
