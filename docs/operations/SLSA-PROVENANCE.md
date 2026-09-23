# SLSA Provenance — P1

**Estado:** `implemented` — `scripts/sbom.mjs` + `scripts/sbom-verify.mjs` + `sigstore` por release

**Por release:** `sbom.json` + `sbom.json.sha256` + `provenance.intoto.jsonl` + `rekor` + `cosign` verify

**CI:** `.github/workflows/release.yml` con `actions/attest-build-provenance@v2` + `slsa-framework/slsa-github-generator`
