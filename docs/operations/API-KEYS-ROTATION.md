# API Keys Rotation — P1

**Formato:** `isk_<env>_<id>_<secret>` — solo se muestra una vez, DB guarda `v7.<salt>.<hash>`

**Rotación:** `POST /api/v1/api-keys/rotate` — genera nuevo `secret`, invalida anterior, `idempotencia` por `tenant_id + key_id`

**Prevención escalada:** `validateApiKeyIssue` verifica `issuerScopes` y `issuerRole` — no se puede delegar `SovereignOwner` si eres `Operator`.

**PowerShell:**
```powershell
$key = (Invoke-RestMethod -Method POST -Uri https://isabella-ai.visitarealdelmonte.online/api/v1/api-keys -Headers @{Authorization="Bearer $jwt"} -Body @{name="prod";role="Operator";scopes=@("isabella:chat")}).key
# Guarda $key solo una vez
```

**Test:** `test/security/api-key-contract.test.ts` 32 tests
