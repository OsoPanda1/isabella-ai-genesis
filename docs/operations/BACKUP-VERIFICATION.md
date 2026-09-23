# Backup Verification — P1

**RPO ≤15m / RTO ≤60m** — `scripts/db-backup.mjs` + `scripts/db-restore.mjs` + `scripts/db-snapshot-lib.mjs`

**Verificación:**
```bash
pnpm db:backup ./backups/isabella-$(date +%s).json
# destroy/simulate loss
pnpm db:restore ./backups/isabella-*.json
pnpm db:verify
```

**Evidencia:** `test/unit/dr-backup.test.ts` + `CAPABILITY_MATRIX` `real`.

**Falta para 100%:** `DR cross-region` + `cifrado backups` + `restore` en `Neon` vivo.
