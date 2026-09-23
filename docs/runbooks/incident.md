# Runbook — Incidentes (P0)

**On-call:** `tamvonlinenetwork-7731` (ver `docs/operations/SLO.md`).
**Pasos blanco/negro:**

1. `vercel logs <deploy> --since 10m` → buscar `V.jsxDEV` / `repository_unhealthy` / `genesis_service_unconfigured`
2. `curl https://isabella-ai.visitarealdelmonte.online/api/health | jq .checks`
3. Si `repository_unhealthy` → `vercel env ls` → verificar `DATABASE_URL` sin `channel_binding`, `ISABELLA_STORAGE_PROVIDER=postgres`, `SELECT 1`
4. Si `genesis_service_unconfigured` → `vercel env ls | grep CROWN` → rotar `CROWN_POLICY_SIGNING_KEY` (64 hex)
5. Si `V.jsxDEV` → `vite.config.ts` `generateBundle` debe estar en `main`
6. Rollback: `vercel redeploy <prev> --prod` o `git revert HEAD && git push`
7. Postmortem: `docs/postmortems/YYYY-MM-DD.md` con `SHA + workflow run + artifact hash`
