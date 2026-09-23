# Pre-commit Hooks — P1

**Estado:** `implemented` — `husky` + `lint-staged` en `package.json`

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.md": ["prettier --write"]
}
```

**Verificación:** `pnpm exec lint-staged` en `pre-commit` + `pnpm run lint` en CI.
