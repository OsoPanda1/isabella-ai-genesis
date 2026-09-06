const fs = require('fs');
let code = fs.readFileSync('src/lib/secrets.ts', 'utf8');

code = code.replace(
  /function requireSecret\(kind: SecretKind, value: string \| undefined, label: string\): string \{/g,
  `function requireSecret(kind: SecretKind, value: string | undefined, label: string, isDev: boolean = false): string {
  if (!value || value.length === 0) {
    if (isDev) return "dev-fallback-secret-for-local-testing-only-1234567890";
    throw new Error(\`Secreto requerido no configurado: \${label} (\${kind})\`);
  }`
);

code = code.replace(
  /return requireSecret\("jwt", cfg\(\)\.AUTH_JWT_SECRET, "AUTH_JWT_SECRET \(ver \.env\.example\)"\);/g,
  `return requireSecret("jwt", cfg().AUTH_JWT_SECRET, "AUTH_JWT_SECRET (ver .env.example)", cfg().NODE_ENV === "development");`
);

code = code.replace(
  /return requireSecret\(\n        "encryption",\n        cfg\(\)\.ENCRYPTION_MASTER_KEY,\n        "ENCRYPTION_MASTER_KEY \(mín. 32 caracteres\)",\n      \);/g,
  `return requireSecret("encryption", cfg().ENCRYPTION_MASTER_KEY, "ENCRYPTION_MASTER_KEY (mín. 32 caracteres)", cfg().NODE_ENV === "development");`
);

code = code.replace(
  /return requireSecret\("bookpi", cfg\(\)\.BOOKPI_SIGNING_KEY, "BOOKPI_SIGNING_KEY"\);/g,
  `return requireSecret("bookpi", cfg().BOOKPI_SIGNING_KEY, "BOOKPI_SIGNING_KEY", cfg().NODE_ENV === "development");`
);

code = code.replace(
  /return requireSecret\("jwt", cfg\(\)\.API_KEY_HASH_SECRET, "API_KEY_HASH_SECRET"\);/g,
  `return requireSecret("jwt", cfg().API_KEY_HASH_SECRET, "API_KEY_HASH_SECRET", cfg().NODE_ENV === "development");`
);

fs.writeFileSync('src/lib/secrets.ts', code);
