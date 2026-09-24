# LICENSES.md — Matriz de licencias Isabella AI Genesis

SSOT de categorías. Los textos íntegros están en los archivos root `LICENSE*`.  
`package.json` gobierna dependencias npm; no reemplaza este mapa de categorías propias.

| Categoría | Archivo / ruta | Licencia | Alcance |
|---|---|---|---|
| **Software (root)** | `LICENSE` | Apache-2.0 (o el texto en `LICENSE`) | Código fuente del monorepo salvo indicación |
| **Contribuciones ISC** | `LICENSE-ISCL` | ISC | Componentes declarados ISC en `package.json` / subdirs |
| **Contenido / docs** | `LICENSE-CONTENT` | CC BY 4.0 | `docs/**`, README, whitepapers, textos de gobernanza |
| **Marca / identidad** | `LICENSE-SOVEREIGN.md` + `LICENSE-CONTROL.md` | Control soberano (no open source) | Nombre, logo, arte, personalidad, datos territoriales |
| **Control de release** | `LICENSE-CONTROL.md` | Process control | Requisitos de inventario SBOM y revisión de licencias |

## Reglas

1. **Software ≠ marca ≠ docs.** Apache-2.0 no otorga derechos de trademark, likeness ni datos territoriales.
2. **Terceros:** dependencias, modelos, fonts y datasets conservan su propia licencia; ver inventario SBOM del release.
3. **Contribuciones:** solo material que el autor pueda ceder bajo la categoría destino (CLA pendiente — ver `docs/06`).
4. **Datos y PII:** ninguna licencia de código autoriza por sí sola procesamiento de datos personales (ver `SECURITY.md` y `AGENTS.md` §22).

## Estado

- Documento creado durante saneamiento 2026-09-24 (antes solo referenciado sin existir).
- No constituye asesoría legal.
