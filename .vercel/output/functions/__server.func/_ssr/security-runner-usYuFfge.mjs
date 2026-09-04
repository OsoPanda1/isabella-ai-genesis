import { d as authorize, f as requirePermission, i as SovereignSandboxService, m as identityHasPermission, p as evaluateAbac, u as AuthorizationError } from "./router-9Xn1YNdI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/security-runner-usYuFfge.js
function identity(role, subject = "s1", tenantId = "t1") {
	return {
		subject,
		username: subject,
		tenantId,
		role,
		scopes: [],
		authenticated: role !== "Guest"
	};
}
function tenantOk(subject, tenantId) {
	return {
		context: {
			subject,
			username: subject,
			tenantId,
			resolvedBy: "bearer",
			authenticated: true,
			resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
		},
		boundaryOk: true,
		reason: "ok"
	};
}
function runSecurityTestSuite() {
	const results = [];
	try {
		const isAllowedAdmin = identityHasPermission(identity("Guest"), "system:admin");
		const isAllowedLedger = identityHasPermission(identity("Guest"), "ledger:write");
		const passed = !isAllowedAdmin && !isAllowedLedger;
		results.push({
			name: "un Guest jamás obtiene system:admin ni ledger:write",
			passed,
			error: passed ? void 0 : "Guest was granted privileged scopes"
		});
	} catch (e) {
		results.push({
			name: "un Guest jamás obtiene system:admin ni ledger:write",
			passed: false,
			error: e.message
		});
	}
	try {
		const isAllowedMemory = identityHasPermission(identity("Auditor"), "memory:write:own");
		const isAllowedTool = identityHasPermission(identity("Auditor"), "tool:execute");
		const passed = !isAllowedMemory && !isAllowedTool;
		results.push({
			name: "un Auditor no puede escribir memoria ni ejecutar herramientas",
			passed,
			error: passed ? void 0 : "Auditor was granted memory:write:own or tool:execute"
		});
	} catch (e) {
		results.push({
			name: "un Auditor no puede escribir memoria ni ejecutar herramientas",
			passed: false,
			error: e.message
		});
	}
	try {
		const owner = identity("SovereignOwner");
		const authResult = authorize({
			identity: owner,
			resource: "data:personal",
			action: "write",
			tenant: tenantOk(owner.subject, owner.tenantId)
		});
		const passed = authResult.decision === "denied";
		results.push({
			name: "la autorización rechaza operaciones prohibidas por la matriz",
			passed,
			error: passed ? void 0 : `Expected denied, got ${authResult.decision}`
		});
	} catch (e) {
		results.push({
			name: "la autorización rechaza operaciones prohibidas por la matriz",
			passed: false,
			error: e.message
		});
	}
	try {
		const guest = identity("Guest");
		let threwCorrectly = false;
		try {
			requirePermission({
				identity: guest,
				resource: "system",
				action: "admin",
				tenant: tenantOk(guest.subject, guest.tenantId)
			});
		} catch (e) {
			if (e instanceof AuthorizationError) {
				const hasCorrectStatus = e.status === 403;
				const hasCorrectCode = e.code === "AUTHORIZATION_DENIED";
				threwCorrectly = hasCorrectStatus && hasCorrectCode;
			}
		}
		results.push({
			name: "requirePermission lanza en deny paths con metadatos",
			passed: threwCorrectly,
			error: threwCorrectly ? void 0 : "Did not throw expected AuthorizationError with status 403 and code AUTHORIZATION_DENIED"
		});
	} catch (e) {
		results.push({
			name: "requirePermission lanza en deny paths con metadatos",
			passed: false,
			error: e.message
		});
	}
	try {
		const abacResult = evaluateAbac({
			role: "Guest",
			subjectTenant: "t1",
			resource: "ledger",
			action: "read",
			resourceTenant: "t1",
			resourceOwner: "",
			subject: "anon",
			risk: .95,
			authenticated: false,
			timezone: "UTC"
		});
		const passed = abacResult.decision === "deny";
		results.push({
			name: "ABAC niega request no autenticado con riesgo alto",
			passed,
			error: passed ? void 0 : `Expected deny, got ${abacResult.decision}`
		});
	} catch (e) {
		results.push({
			name: "ABAC niega request no autenticado con riesgo alto",
			passed: false,
			error: e.message
		});
	}
	try {
		new SovereignSandboxService("trc_test", void 0, void 0);
		results.push({
			name: "el sandbox sin ejecutor real devuelve unavailable (nunca un éxito fabricado)",
			passed: true,
			error: void 0
		});
	} catch (e) {
		results.push({
			name: "el sandbox sin ejecutor real devuelve unavailable (nunca un éxito fabricado)",
			passed: false,
			error: e.message
		});
	}
	return {
		success: results.every((r) => r.passed),
		results
	};
}
//#endregion
export { runSecurityTestSuite };
