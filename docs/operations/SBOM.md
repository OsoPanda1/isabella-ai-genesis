# SBOM — Software Bill of Materials (CycloneDX)

> **Lote Infra/SBOM — Isabella AI Genesis v4.3.3**
> Generación, verificación y publicación del SBOM por release. Formato canónico: **CycloneDX JSON** (`bomFormat: CycloneDX`).

## 1. Objetivo

Cada release publicado debe incluir un SBOM reproducible, verificable y trazable que enumere todas las dependencias (prod + dev en build) para auditoría, license compliance y respuesta a vulnerabilidades.

Artefacto canónico: `sbom.json` en raíz del repo (ignorado por git, generado on-demand). En release: `sbom-<version>.json` + hash `sha256`.

## 2. Herramientas

| Herramienta | Versión | Notas |
|---|---|---|
| `@cyclonedx/cyclonedx-npm` | latest vía `pnpm dlx` | Lee `pnpm-lock.yaml` + `package.json`. No requiere instalación persistente. |
| `scripts/sbom.mjs` | — | Wrapper fail-closed: `pnpm dlx @cyclonedx/cyclonedx-npm --output-file sbom.json` |
| `scripts/sbom-verify.mjs` | — | Validador fail-closed: `bomFormat`, `specVersion`, `metadata.component`, `components[]` |

Scripts en `package.json`:

```json
{
  "sbom": "node scripts/sbom.mjs",
  "sbom:verify": "node scripts/sbom-verify.mjs"
}
```

Requisito: `pnpm@10.34.5` (ver `packageManager`), `node >=22 <25`.

## 3. Generación local

```bash
pnpm sbom              # genera sbom.json (CycloneDX JSON)
pnpm sbom:verify       # fail-closed si falta/inválido
ls -lh sbom.json
cat sbom.json | head -c 500
```

`scripts/sbom.mjs` es fail-closed:
- Si `pnpm dlx` falla → `exit 1`, no deja artefacto corrupto.
- Si `sbom.json` no existe o está vacío → `exit 1` y borra artefacto vacío.
- Loga tamaño en bytes al éxito.

No versionar `sbom.json` por defecto (ver `.gitignore`: `sbom.json`, `sbom-*.json`, `*.sbom.json`, `cyclonedx-*.json`). Solo se adjunta al release.

## 4. Verificación

```bash
pnpm sbom:verify
# OK — sbom.json existe (XXX bytes)
# OK — bomFormat=CycloneDX
# OK — specVersion=1.6 (o 1.4/1.5 según versión de la lib)
# OK — metadata.component=tanamv-isabella-ai-genesis@4.3.3
# OK — components=NNN
```

Checks del verificador:
- Existencia y tamaño >0
- JSON parse válido
- `bomFormat === "CycloneDX"`
- `specVersion` presente
- `metadata.component` presente
- `components` es array (warn si 0)
- Cada componente con `name/version/purl` (warn si faltan)
- `serialNumber` recomendado (warn si falta)

Exit codes: `0` = válido, `1` = fail-closed.

## 5. Proceso por release (obligatorio)

Cada tag/release (`vX.Y.Z`) debe seguir este checklist — ver `docs/RELEASE-CHECKLIST.md` P0 `SBOM generado`:

### 5.1 Pre-release (en rama release o main)

1. Asegurar lockfile congelado: `pnpm verify:lock` (o `pnpm install --frozen-lockfile`)
2. Generar SBOM: `pnpm sbom`
3. Verificar: `pnpm sbom:verify`
4. (Opcional) Validar schema CycloneDX:

   ```bash
   npx @cyclonedx/cyclonedx-cli validate --input-file sbom.json --input-format json --input-version v1_6
   ```

### 5.2 Publicación del artefacto

5. Copiar con versión y hashear:

   ```bash
   cp sbom.json sbom-$npm_package_version.json
   sha256sum sbom-$npm_package_version.json > sbom-$npm_package_version.json.sha256
   # o: shasum -a 256 sbom-*.json
   ```

6. Adjuntar al GitHub Release como assets:
   - `sbom-<version>.json`
   - `sbom-<version>.json.sha256`
   - (Futuro) `sbom-<version>.json.sig` / attestation Sigstore si se habilita `actions/attest-sbom`.

7. (CI) Subir también como artifact de workflow `release.yml` para retención 90 días.

### 5.3 Post-release

8. Archivar SBOM en `release/` solo si es evidencia de `production:evidence` (no versionar `sbom.json` en raíz).
9. Registrar en `docs/evidence/` el hash y `serialNumber` para trazabilidad BookPI si aplica.

## 6. CI / GitHub Actions

Añadir al job `release` (o `ci` para `pull_request`):

```yaml
- name: Generate SBOM
  run: pnpm sbom
- name: Verify SBOM
  run: pnpm sbom:verify
- name: Upload SBOM artifact
  uses: actions/upload-artifact@v4
  with:
    name: sbom
    path: sbom.json
    retention-days: 90
- name: Attest SBOM (optional, Sigstore)
  uses: actions/attest-sbom@v2
  with:
    subject-path: sbom.json
```

Para PRs, `sbom:verify` debe pasar si `sbom.json` fue generado; para push a `main`, generar siempre.

## 7. Docker / Supply Chain

- `Dockerfile` es multi-stage `node:22-alpine` (minimal), non-root `isabella`, `HEALTHCHECK`, labels `org.cyclonedx.sbom=sbom.json`.
- Seccomp: `k8s/deployment.yaml` `securityContext.seccompProfile.type=RuntimeDefault` + `k8s/networkpolicy.yaml` least-privilege; Docker standalone usar `--security-opt seccomp=... --security-opt no-new-privileges:true`.
- SBOM del contenedor: reutilizar `sbom.json` del host (mismo lockfile) o generar dentro del build con `pnpm dlx @cyclonedx/cyclonedx-npm` en stage `base` si se requiere attestation por imagen.

## 8. Consumo del SBOM

- **Vulnerabilidades:** `grype sbom:sbom.json`, `trivy sbom sbom.json`, o ` Dependency-Track` importando CycloneDX.
- **Licencias:** campo `components[].licenses` — revisar en cada release (ver `LICENSE*`, `NOTICE`).
- **Diff entre releases:** `cyclonedx-cli diff sbom-v1.json sbom-v2.json` para detectar cambios de dependencia no aprobados.

## 9. Retención y rotación

- SBOM por release se conserva mientras el tag exista (GitHub Release assets = fuente de verdad).
- Artifact de CI: 90 días.
- No rotar `serialNumber` manualmente — es UUID por generación (CycloneDX).

## 10. Troubleshooting

| Síntoma | Causa | Fix |
|---|---|---|
| `sbom.json no encontrado` | No se ejecutó `pnpm sbom` | `pnpm sbom && pnpm sbom:verify` |
| `bomFormat` inválido | Versión antigua de la lib o file corrupto | Borrar `sbom.json`, re-ejecutar, actualizar `@cyclonedx/cyclonedx-npm` |
| `components=0` | Lockfile vacío o `pnpm install` no ejecutado | `pnpm install --frozen-lockfile && pnpm sbom` |
| `pnpm dlx` timeout en CI | Red o registry caído | Reintentar, cachear `pnpm store`, usar `pnpm --offline` si aplica |

## 11. Referencias

- CycloneDX spec: https://cyclonedx.org/specification/overview/
- `@cyclonedx/cyclonedx-npm`: https://www.npmjs.com/package/@cyclonedx/cyclonedx-npm
- Release checklist: `docs/RELEASE-CHECKLIST.md`
- Dockerfile hardening: `Dockerfile`
- K8s hardening: `k8s/deployment.yaml`, `k8s/networkpolicy.yaml`, `k8s/qup-psp.yaml`
- Supply chain scripts: `scripts/supply-chain.mjs`, `scripts/verify-lock-contract.mjs`
