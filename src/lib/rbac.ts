/**
 * RBAC — Control de Acceso Basado en Roles (src/lib/rbac.ts)
 * -------------------------------------------------------------
 * Catálogo canónico de roles soberanos y verificación jerárquica
 * de permisos del plano de gobernanza Isabella AI Genesis.
 */

export const ROLES = [
  "Guest",
  "Operator",
  "Auditor",
  "SovereignOwner",
  "governance_admin",
  "member",
  "creator",
  "collaborator",
  "system",
] as const;

export type Role = (typeof ROLES)[number];

export interface RbacSubject {
  role: Role;
  scopes?: readonly string[];
}

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Mapeo de permisos base por rol soberano
 */
const ROLE_PERMISSIONS: Record<Role, ReadonlySet<string>> = {
  SovereignOwner: new Set([
    "*",
    "admin:all",
    "governance:manage",
    "governance:read",
    "policy:write",
    "policy:read",
    "tool:execute",
    "tool:read",
    "memory:write",
    "memory:read",
    "memory:delete",
    "audit:read",
    "audit:write",
    "quantum:execute",
    "quantum:read",
    "billing:manage",
    "billing:read",
    "marketplace:publish",
    "marketplace:read",
    "ai:inference",
    "voice:synthesize",
  ]),
  governance_admin: new Set([
    "governance:manage",
    "governance:read",
    "policy:write",
    "policy:read",
    "tool:execute",
    "tool:read",
    "memory:write",
    "memory:read",
    "audit:read",
    "audit:write",
    "billing:manage",
    "billing:read",
    "marketplace:publish",
    "marketplace:read",
    "ai:inference",
    "voice:synthesize",
  ]),
  system: new Set([
    "*",
    "audit:write",
    "memory:write",
    "memory:read",
    "tool:execute",
    "ai:inference",
  ]),
  Auditor: new Set([
    "governance:read",
    "policy:read",
    "audit:read",
    "memory:read",
    "billing:read",
    "marketplace:read",
    "quantum:read",
  ]),
  Operator: new Set([
    "tool:execute",
    "tool:read",
    "memory:write",
    "memory:read",
    "quantum:execute",
    "quantum:read",
    "ai:inference",
    "voice:synthesize",
    "marketplace:read",
    "billing:read",
  ]),
  creator: new Set([
    "tool:execute",
    "tool:read",
    "memory:write",
    "memory:read",
    "ai:inference",
    "voice:synthesize",
    "marketplace:publish",
    "marketplace:read",
    "billing:read",
  ]),
  collaborator: new Set([
    "tool:read",
    "memory:write",
    "memory:read",
    "ai:inference",
    "voice:synthesize",
    "marketplace:read",
  ]),
  member: new Set([
    "memory:read",
    "ai:inference",
    "voice:synthesize",
    "marketplace:read",
  ]),
  Guest: new Set([
    "ai:inference",
    "voice:synthesize",
    "marketplace:read",
  ]),
};

export function checkPermission(
  subject: RbacSubject,
  permission: string,
): PermissionCheckResult {
  if (!subject || !subject.role) {
    return { allowed: false, reason: "missing_subject_or_role" };
  }

  const role = subject.role;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) {
    return { allowed: false, reason: `unknown_role:${role}` };
  }

  // Wildcard match
  if (permissions.has("*")) {
    return { allowed: true };
  }

  // Direct permission match
  if (permissions.has(permission)) {
    return { allowed: true };
  }

  // Domain wildcard match (e.g. "audit:*" matching "audit:read")
  const [domain] = permission.split(":");
  if (domain && permissions.has(`${domain}:*`)) {
    return { allowed: true };
  }

  // Check custom granted scopes if present
  if (subject.scopes && subject.scopes.includes(permission)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `role_${role}_lacks_permission_${permission}`,
  };
}

export default { ROLES, checkPermission };
