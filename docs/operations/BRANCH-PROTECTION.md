# Branch Protection — `main`

**Objetivo:** proteger `main` como fuente única de verdad (Vercel deploy) y garantizar calidad soberana. Compatible con `AGENTS.md §1` y `§13`.

## Reglas para `main`

| Regla | Valor |
|-------|-------|
| Branch protegida | `main` |
| Require pull request before merging | ✅ |
| Required reviewers (approving reviews) | **2** |
| Dismiss stale pull request approvals when new commits are pushed | ✅ |
| Require review from CODEOWNERS | ✅ (`.github/CODEOWNERS`) |
| Require status checks to pass before merging | ✅ |
| Require branches to be up to date before merging | ✅ |
| Required status checks | `typecheck`, `lint`, `test`, `build` (ver mapping abajo) |
| Require conversation resolution before merging | ✅ |
| Require linear history | ❌ (no obligatoria; se permite merge commit, pero no squash/rebase con force sobre historia publicada) |
| Allow force pushes | ❌ **prohibido** |
| Allow deletions | ❌ |
| Require signed commits | recomendado (no bloqueante) |
| Restrict who can push to matching branches | Solo `CODEOWNERS` / admins via PR |

### Mapping status checks → workflows

Los checks obligatorios corresponden a jobs de `.github/workflows/fgais-gate.yml` (canonical FGAIS gate) + `ci.yml`:

- `typecheck` → `FGAIS Production Gate / Typecheck` (`pnpm typecheck` → `tsc --noEmit`)
- `lint` → `FGAIS Production Gate / Lint` (`pnpm lint` → `eslint .`)
- `test` → `FGAIS Production Gate / Tests` (`pnpm test` → `vitest run`)
- `build` → `FGAIS Production Gate / Production build` (`pnpm build:production` / `pnpm build` con `NODE_ENV=production`)

> En `ci.yml` el job `production-gate` delega en `fgais-gate.yml`; ese workflow es la autoridad. Si se renombran jobs, actualizar esta tabla y la protección en GitHub.

Adicionalmente (no bloqueantes pero auditados):

- `Lockfile verification (pnpm --frozen-lockfile)` (`pnpm verify:lock`)
- `Security scan` (`pnpm security:scan`)
- `Capability contract` / `Route contract` / `DB verify` / `Production integrity` / `Production preflight`

## Configuración via `gh` CLI

```bash
# Requiere GH_TOKEN con admin:repo
OWNER=$(gh repo view --json nameWithOwner -q .nameWithOwner | cut -d/ -f1)
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner | cut -d/ -f2)

gh api -X PUT "repos/${OWNER}/${REPO}/branches/main/protection" \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["FGAIS Production Gate","Typecheck","Lint","Tests","Production build"],
    "checks": [
      {"context": "Typecheck"},
      {"context": "Lint"},
      {"context": "Tests"},
      {"context": "Production build"}
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 2,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true,
  "lock_branch": false
}
JSON

# Alternativa exacta con contexts del fgais-gate.yml (nombres visibles en Checks):
gh api repos/${OWNER}/${REPO}/branches/main/protection/required_status_checks \
  -f strict=true \
  -f contexts[]="Typecheck" -f contexts[]="Lint" -f contexts[]="Tests" -f contexts[]="Production build"
```

> **Nota:** Los nombres exactos de `contexts` deben coincidir con `jobs.<id>.name` del workflow que GitHub reporta. Verificar en la pestaña *Checks* tras el próximo PR. Si figuran como `FGAIS Production Gate / Typecheck`, usar esos strings completos en `contexts`.

## Configuración via UI

1. GitHub → `Settings` → `Branches` → `Add classic branch protection rule`
2. `Branch name pattern`: `main`
3. Marcar:
   - `Require a pull request before merging` → `Required approvals: 2` → `Dismiss stale PR approvals` → `Require review from Code Owners`
   - `Require status checks to pass before merging` → `Require branches to be up to date...` → Buscar y añadir `Typecheck`, `Lint`, `Tests`, `Production build`
   - `Require conversation resolution`
   - `Do not allow bypassing the above settings` (enforce for admins opcional pero recomendado)
   - **Desmarcar** `Allow force pushes` y `Allow deletions`
4. `Save changes`

## Política complementaria

- **No force push:** `git push --force` está prohibido en `main` por protección + por `AGENTS.md §1`. Reversión siempre con commit nuevo.
- **Vercel:** cada push a `main` dispara deploy. Mantener `main` compilable (`typecheck && lint && test && build` verdes).
- **CODEOWNERS:** todo PR a `main` requiere 2 aprobaciones, al menos 1 de CODEOWNERS si toca `src/lib/*`, `supabase/migrations/*`, `src/server.ts`.
- **Bypass:** solo admins en emergencia con justificación auditada (ADR).

## Verificación local antes de PR

```bash
pnpm typecheck   # 0 errors
pnpm lint        # 0 errors
pnpm test
pnpm build
```

## Evidencia

- `src/lib/security.ts:509` `injectSecureHeaders` (CSP + HSTS)
- `src/server.ts:149` `withSecurityHeaders` (mirror server entry)
- `.github/workflows/fgais-gate.yml` (gate canónico)
- `.github/workflows/ci.yml` → `production-gate`
