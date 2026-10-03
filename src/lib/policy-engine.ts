/**
 * Policy Engine (src/lib/policy-engine.ts)
 * -------------------------------------------------------------
 * Rule evaluation engine for CROWN / ARGUS governance gates.
 */
import { PolicyDecision, PolicyEffect } from "../contracts/isabella";
import { checkPermission, Role } from "./rbac";

export interface PolicyEvaluationRequest {
  tenantId: string;
  subjectId: string;
  role: Role;
  action: string;
  resource: string;
}

export function evaluatePolicy(request: PolicyEvaluationRequest): {
  allowed: boolean;
  effect: PolicyEffect;
  reason?: string;
} {
  const perm = `${request.resource}:${request.action}`;
  const rbac = checkPermission({ role: request.role }, perm);
  if (!rbac.allowed) {
    return {
      allowed: false,
      effect: "deny",
      reason: rbac.reason,
    };
  }
  return {
    allowed: true,
    effect: "allow",
  };
}

export default { evaluatePolicy };
