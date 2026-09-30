# ADR-013: Propiedad canónica del generador JDR

- **Estado:** Aceptado — **Fecha:** 2026-09-30
- **Alcance:** repositorio (no runtime)
- **Clasificación:** P1 — duplicación inequívoca

## Contexto

El repositorio mantenía **dos copias idénticas** del mismo subproyecto:

- `jdr-generator/` (raíz) — 64 archivos
- `contrib/jdr-generator/` — 64 archivos

Verificación previa a la decisión:

```bash
git diff --no-index jdr-generator contrib/jdr-generator   # sin diferencias
git ls-files jdr-generator | wc -l                        # 64
git ls-files contrib/jdr-generator | wc -l                # 64
git grep -n "jdr-generator"                               # ver §Control de referencias
```

Ambas copias eran **byte a byte idénticas**. Ninguna compilación, workflow de CI,
Dockerfile, script de `package.json` o manifiesto de despliegue referenciaba la copia
de raíz. Los dos únicos apuntadores de configuración del repo ya apuntaban a `contrib/`:

- `.gitignore:102` → `contrib/jdr-generator/api/target/`
- `.gitleaks.toml:15` → `^contrib/jdr-generator/.*`

Con dos copias conviviendo existía riesgo real de:

- **drift**: parches aplicados solo a una ruta,
- **propiedad ambigua**: dos localizaciones con commits de fechas distintas
  (raíz `1846af5` 2026-09-27, contrib `417882a` 2026-09-23),
- **falsos hallazgos** en auditoría de superficie y en duplicación.

## Decisión

Se conserva **únicamente** `contrib/jdr-generator/` como localización canónica y se
elimina la copia de la raíz.

`contrib/` comunica correctamente que el artefacto es una contribución o utilidad
auxiliar **no perteneciente al runtime central**.

## Control de referencias antes de eliminar

| Origen | Referencia | Acción |
| --- | --- | --- |
| `.gitignore:102` | `contrib/jdr-generator/api/target/` | ya correcta |
| `.gitleaks.toml:15` | `^contrib/jdr-generator/.*` | ya correcta |
| `actualizacion.txt:162,186` | `jdr-generator/openapi/…` | **reescrita** a `contrib/…` en este commit |
| `docs/_archive/unified/README-UNIFICACION.md:16` | `jdr-generator` | **intocable**: documento histórico bajo política de retención (`docs/INDEX.md`) |
| `.github/`, `package.json`, `Dockerfile*` | — | sin coincidencias |

## Consecuencias

- `jdr-generator/.github/workflows/ci.yml` desaparece; era **inérgico** porque GitHub
  solo lee `.github/workflows/` en la raíz del repositorio.
- Historia preservada: el contenido no cambia, solo su ruta (`git log --follow`).
- Si en el futuro el JDR pasara a formar del runtime, deberá salir de `contrib/`
  mediante un ADR nuevo que declare su estatus de componente canónico.
