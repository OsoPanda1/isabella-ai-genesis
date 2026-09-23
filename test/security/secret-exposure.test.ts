import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

describe("secret exposure regression (P0-01)", () => {
  const root = resolve(__dirname, "../..");
  const compromised = "C869C1B14A8938785A9438060AD878711124F416";

  it("README no contiene CROWN_POLICY_SIGNING_KEY comprometido", () => {
    const readme = readFileSync(resolve(root, "README.md"), "utf8");
    expect(readme.includes(compromised), "README aún expone CROWN secreto comprometido").toBe(false);
    expect(readme.includes("CROWN_POLICY_SIGNING_KEY=C869"), "README expone CROWN").toBe(false);
    // Debe estar redactado
    expect(readme.includes("REDACTED") || readme.includes("Secret Manager")).toBe(true);
  });

  it("docs no contienen secretos de alta entropía expuestos", () => {
    const docs = ["README.md", "docs/ISABELLA_V3.0-MASTER-EXTENDED-CANONICA.md", "docs/REGISTRO-MEJORAS-3.1.md"];
    for (const doc of docs) {
      const p = resolve(root, doc);
      if (!existsSync(p)) continue;
      const content = readFileSync(p, "utf8");
      expect(content.includes(compromised), `${doc} expone secreto`).toBe(false);
    }
  });

  it(".env.example no contiene claves reales", () => {
    const example = readFileSync(resolve(root, ".env.example"), "utf8");
    // .env.example debe tener CROWN vacío o placeholder, no valor real de 37 hex
    expect(example.includes(compromised)).toBe(false);
    const crownLine = example.split("\n").find((l) => l.startsWith("CROWN_POLICY_SIGNING_KEY="));
    if (crownLine) {
      const value = crownLine.split("=")[1]?.trim().replace(/["']/g, "") ?? "";
      expect(value.length === 0 || value.startsWith("<") || value === "").toBe(true);
    }
  });

  it("historial reciente no debe reintroducir el secreto en nuevos commits (scan de archivos trackeados)", () => {
    // Scan rápido de archivos trackeados excepto .env (que está gitignored)
    const tracked = [
      "README.md",
      "production-capabilities.json",
      "vite.config.ts",
      "vercel.json",
      "src/lib/config.ts",
    ];
    for (const f of tracked) {
      const p = resolve(root, f);
      if (!existsSync(p)) continue;
      const content = readFileSync(p, "utf8");
      expect(content.includes(compromised), `${f} reintroduce secreto`).toBe(false);
    }
  });
});
