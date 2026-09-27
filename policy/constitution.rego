# ==================================================================
# CONSTITUTION Isabella — política de operación (OPA / Gatekeeper)
# ==================================================================
# Absorbido de nodo genesis (`policy/constitution.rego`, paquete
# `yun.constitution`) y adaptado a los artefactos REALES de este
# repositorio: k8s/deployment.yaml (runAsNonRoot, readinessProbe en
# /api/health/ready) y k8s/qup-psp.yaml (MustRunAsNonRoot).
#
# Esta es la fuente declarativa para OPA/Gatekeeper en despliegues
# k8s. El espejo ejecutable en TypeScript (misma semántica, evaluado
# por pruebas) vive en `src/lib/policy/constitution.ts`.
#
# Honestidad (AGENTS.md §19): la evaluación con el binario de OPA
# todavía no corre en este entorno ni en CI (issue #66, billing);
# hasta esa evidencia esta política es EVIDENCE_GATED, no PASS.
# ==================================================================
package isabella.constitution

# El sellado híbrido exige un proveedor criptográfico auditado.
default seal_allowed = false

seal_allowed {
	input.provider_available == true
}

# Verificación con regla AND: clásica AND post-cuántica AND política
# AND hash. Todos los factores deben cumplir; cualquiera ausente ⇒ false.
default verify_allowed = false

verify_allowed {
	input.classical_ok == true
	input.post_quantum_ok == true
	input.policy_ok == true
	input.hash_ok == true
}

# El contenedor debe ejecutar como usuario no root (PSP + deployment).
default allow_run_as_non_root = false

allow_run_as_non_root {
	input.run_as_non_root == true
}

# El readinessProbe debe usar el endpoint de prontitud operativa
# declarado en k8s/deployment.yaml.
default allow_readiness_probe = false

allow_readiness_probe {
	input.readiness_probe == "/api/health/ready"
}

# Sensibilidades altas exigen sellado: sin sello no hay allow.
default allow_critical_sealed = false

allow_critical_sealed {
	input.sensitivity == "restricted"
	input.sealed == true
}

allow_critical_sealed {
	input.sensitivity == "critical"
	input.sealed == true
}

# Los eventos de federaciones no deben referir una federación concreta
# (fuga de dominio de federación): el hallazgo de la regla es DENY.
default deny_federation_domain_leak = false

deny_federation_domain_leak {
	input.domain == "federations"
	input.federation_id != null
}
