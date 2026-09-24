# Backup Encryption — P1

**Estado:** `implemented` — `scripts/db-backup.mjs` + `scripts/db-restore.mjs` generan `snapshot.json` con `sha256` por tabla, `ON CONFLICT DO NOTHING`.

**Falta para 100%:**
- `cifrado backups` — `AES-256-GCM` + `KMS` `ENCRYPTION_MASTER_KEY` antes de `S3`/`R2`
- `DR cross-region` — replicación `Neon` `read replica` + `restore` en `us-east-1` → `eu-west-1`
- `verificación` — `restore` + `integrity` + `application recovery` con `RPO 15m/RTO 60m` medido

**Evidencia:** `test/unit/dr-backup.test.ts` + `CAPABILITY_MATRIX` `real`.
