# Auditoría crítica TINA / Isabella — 2026-09-28

## Alcance

Auditoría del estado de `main` antes de esta corrección, con foco en:

- integridad de los gates de producción;
- CI/CD y reproducibilidad;
- seguridad de salida y gobernanza TINA;
- persistencia/BookPI;
- coherencia entre la infraestructura declarada y el contenido real del repositorio.

Commit auditado inicialmente: `10ad41ea40018133d101e7f23eb8555766bc26d3`.

## Hallazgos críticos corregidos en esta rama

### C1 — CI Cosign usaba un runtime incompatible

`.github/workflows/ci-cosign.yml` declaraba Node 22 aunque el contrato canónico del proyecto es Node 24.11.0 / pnpm 10.34.5.

**Corrección:** Node 24.11.0 y pnpm 10.34.5 se verifican explícitamente antes de instalar.

### C2 — Cadena de evidencia Cosign rota

El workflow de Cosign descargaba `node-production-artifacts`, pero ese artefacto no era producido por el job `build`; además, el output `image_ref` apuntaba al step equivocado.

**Corrección:** el job de build genera y publica el SBOM/evidencia; el job de firma consume ese artefacto; los outputs apuntan al step correcto; la firma y verificación son fail-closed.

### C3 — SBOM podía fallar silenciosamente

La generación anterior de CycloneDX utilizaba `|| true`, permitiendo continuar sin SBOM.

**Corrección:** se usa el comando canónico `pnpm sbom`, cuyo propio contrato falla si no genera un SBOM válido.

### C4 — Production Readiness contenía infraestructura inexistente

El workflow declaraba un Rust core y una cadena Kubernetes/Node Zero, pero el repositorio no contiene `Cargo.toml` y la ruta de despliegue canónica es Vercel.

**Corrección:** el workflow se redujo a gates que existen realmente en este repositorio: FGAIS, seguridad/dependencias, SBOM y contrato de despliegue Vercel.

### C5 — Ledger TINA omitía el timestamp del material firmado

El hash de `TinaBookPI` no incorporaba `timestamp`. Un cambio de timestamp no alteraba el hash.

**Corrección:** el timestamp forma parte de la serialización canónica firmada y existe una regresión que demuestra detección de mutación interna.

## Evidencia que permanece bloqueada por infraestructura

- GitHub Actions no proporciona evidencia ejecutable sobre el HEAD mientras permanezca el bloqueo de billing documentado en issue #66.
- La certificación live de DB/RLS, NCUA, Stripe, HSM y despliegue same-commit requiere infraestructura real y secretos de producción.
- La ausencia de evidencia live no se convierte en PASS por inferencia.

## Estado

Esta rama corrige defectos de implementación detectados en el auditado. No declara certificación de producción hasta que los gates ejecutables y la infraestructura viva proporcionen evidencia del mismo commit.
