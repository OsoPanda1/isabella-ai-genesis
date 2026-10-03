/**
 * Tenant Isolation Guard (src/lib/tenant-guard.ts)
 * -------------------------------------------------------------
 * Enforces cross-tenant isolation boundaries.
 * No principal may access, mutate, or observe resources belonging to
 * another tenant without explicit global authorization.
 */
import { PrincipalContext } from "./principal-context";
import { SecurityError } from "./security";

export function assertTenantIsolation(
  principal: PrincipalContext,
  resourceTenantId: string,
  operation: string = "access",
): void {
  if (!resourceTenantId) {
    return; // Global un-partitioned resource
  }

  if (principal.tenantId === resourceTenantId) {
    return; // Same tenant
  }

  // Only SovereignOwner or system role may perform cross-tenant operations
  if (
    principal.role === "SovereignOwner" ||
    principal.roles.includes("SovereignOwner") ||
    principal.role === "system" ||
    principal.roles.includes("system")
  ) {
    return;
  }

  throw new SecurityError(
    "TENANT_ISOLATION_VIOLATION",
    `Principal ${principal.sub} from tenant '${principal.tenantId}' is forbidden from ${operation} on tenant '${resourceTenantId}'.`,
    403,
  );
}

export default { assertTenantIsolation };
