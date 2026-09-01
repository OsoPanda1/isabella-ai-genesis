import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";

const SECRET_PATTERN =
  /\b(?:sk|pk|secret|token|password|passwd|api[_-]?key|access[_-]?key|private[_-]?key|isabella_sovereign_security_secret)[-\w]*\b\s*[:=]\s*['"][A-Za-z0-9_\-\.\/\+]{16,}['"]/i;

export default tseslint.config(
  { ignores: ["dist", ".output", ".vinxi", "routeTree.gen.ts", "coverage", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx,js,mjs}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { security },
    rules: {
      ...security.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "security/detect-possible-timing-attacks": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-pseudoRandomBytes": "error",
    },
  },
  {
    files: ["**/*.{ts,tsx,js,mjs}"],
    name: "isabella/secret-literal",
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal",
          message:
            "Hardcoded secret-like literals are prohibited in source. Load secrets through src/lib/config.ts at runtime from env variables only.",
        },
      ],
    },
  },
);
