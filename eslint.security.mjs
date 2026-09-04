import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";

const SECRET_PATTERN =
  /\b(?:sk|pk|secret|token|password|passwd|api[_-]?key|access[_-]?key|private[_-]?key|isabella_sovereign_security_secret)[-\w]*\b\s*[:=]\s*['"][A-Za-z0-9_\-\.\/\+]{16,}['"]/i;

export default tseslint.config(
  {
    ignores: [
      "dist",
      ".output",
      ".vinxi",
      "routeTree.gen.ts",
      "coverage",
      "node_modules",
      "test",
      "test/**/*",
      "src/tests/**/*",
      "**/*.js",
      "**/*.mjs",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx,js,mjs}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { security },
    rules: {
      ...security.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-empty": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "security/detect-possible-timing-attacks": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-unsafe-regex": "error",
      // Dynamic indexing is used only after allowlisted key validation in UI/config maps.
      "security/detect-object-injection": "off",
      "security/detect-non-literal-regexp": "off",
      // File paths are constrained by the application manifest boundary before reads.
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-pseudoRandomBytes": "error",
    },
  },
);
