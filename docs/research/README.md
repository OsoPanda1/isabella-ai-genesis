# docs/research — Registro bibliográfico ORCID

`orcid-registry.json` es un **registro de metadatos públicos** del perfil ORCID
de Edwin Oswaldo Castillo Trejo (Anubis Villaseñor), generado desde la API
pública de ORCID (`pub.orcid.org/v3.0`) el **2026-09-27**.

## Contenido

- `identity`: nombre de crédito, otros nombres, keywords, researcher-urls y
  identificadores externos (Frontiers Loop `3117809`). Sin correos ni datos
  personales sensibles.
- `employment`: afiliaciones públicas del registro.
- `works`: 26 grupos / 47 works; **24 con DOI** y **38 DOI distintos**
  (Zenodo, Figshare, OSF), con `put_codes` y fuentes (DataCite, figshare…).
- `distinct_dois`: lista ordenada de los DOI para citado y verificación.

## Regla de honestidad (AGENTS.md §19)

Este registro es **metadata-only**: los DOI provienen de la API pública de
ORCID (espejo de DataCite/Zenodo/OSF). **No** se descargó ni verificó el
contenido de cada depósito en esta sesión, y la existencia de un DOI no
certifica el rigor del trabajo que describe. Nada aquí acredita capacidades
del sistema; solo procedencia bibliográfica citable.

## Regeneración

1. Descargar `works`, `person` y `employments` en JSON desde
   `https://pub.orcid.org/v3.0/0009-0008-5050-1539/<endpoint>` con
   `Accept: application/json` (decodificar la respuesta como UTF-8).
2. Producir el JSON con el mismo esquema (`schema:
   isabella-orcid-registry/v1`) manteniendo el orden determinista de claves.
3. Actualizar `generated_at` y volver a correr
   `pnpm vitest run test/unit/orcid-registry.test.ts`.
