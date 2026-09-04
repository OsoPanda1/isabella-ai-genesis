import { v as resolveRoleChain } from "./router-9Xn1YNdI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privilege-validation-D1jdkzr0.js
/** Compara si el rol solicitado es estrictamente igual o menor que el rol del emisor. */
function isRoleSubset(requestedRole, issuerRole) {
	if (requestedRole === issuerRole) return true;
	return resolveRoleChain(issuerRole).includes(requestedRole);
}
/** Compara si los scopes solicitados están contenidos en los scopes del emisor. */
function isScopeSubset(requestedScopes, issuerScopes) {
	if (requestedScopes.length === 0) return true;
	const issuerSet = new Set(issuerScopes.flatMap((s) => s.split(/\s+/).filter(Boolean)));
	return requestedScopes.every((s) => issuerSet.has(s));
}
/** TTL máximo (en segundos) permitido para API keys por rol del emisor. */
function maxApiKeyTTLForRole(issuerRole) {
	switch (issuerRole) {
		case "SovereignOwner": return 31536e3;
		case "Operator":
		case "governance_admin": return 2592e3;
		default: return 86400;
	}
}
/**
* Valida la emisión de una credencial API Key contra el principal emisor.
* Todos los chequeos son fail-closed y devuelven la razón textual.
*/
function validateApiKeyIssue(input) {
	const { issuerRole, issuerScopes, issuerTenantId, requestedRole, requestedScopes, requestedTenantId, requestedTtlSeconds } = input;
	if (!isRoleSubset(requestedRole, issuerRole)) return {
		allowed: false,
		reason: "Cannot issue credential with higher role"
	};
	if (!isScopeSubset(requestedScopes, issuerScopes)) return {
		allowed: false,
		reason: "Cannot issue credential with broader scopes"
	};
	if (requestedTenantId && requestedTenantId !== issuerTenantId) return {
		allowed: false,
		reason: "Cannot issue credential for another tenant"
	};
	if (requestedTtlSeconds !== void 0) {
		const maxTTL = maxApiKeyTTLForRole(issuerRole);
		if (requestedTtlSeconds > maxTTL) return {
			allowed: false,
			reason: `API key TTL exceeds maximum of ${maxTTL}s`
		};
	}
	return { allowed: true };
}
//#endregion
export { validateApiKeyIssue };
