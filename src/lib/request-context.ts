/**
 * Request Context & Correlation (src/lib/request-context.ts)
 * -------------------------------------------------------------
 * Encapsulates immutable request identifiers, correlation IDs,
 * tenant scoping, and principal bindings for every turn.
 */
import { randomUUID } from "node:crypto";

export interface RequestContext {
  readonly traceId: string;
  readonly correlationId: string;
  readonly requestId: string;
  readonly tenantId: string;
  readonly principalId?: string;
  readonly timestamp: string;
  readonly ipAddress: string;
  readonly userAgent: string;
}

export function createRequestContext(init?: Partial<RequestContext>): RequestContext {
  return {
    traceId: init?.traceId || `isa-trace-${randomUUID()}`,
    correlationId: init?.correlationId || `corr-${randomUUID()}`,
    requestId: init?.requestId || `req-${randomUUID()}`,
    tenantId: init?.tenantId || "default-sovereign-tenant",
    principalId: init?.principalId,
    timestamp: init?.timestamp || new Date().toISOString(),
    ipAddress: init?.ipAddress || "127.0.0.1",
    userAgent: init?.userAgent || "isabella-sovereign-client",
  };
}

export default createRequestContext;
