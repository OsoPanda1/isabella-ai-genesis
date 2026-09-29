// @ts-nocheck — interop con script .mjs sin tipos (verificado por sus propios tests).
import { describe, it, expect } from "vitest";

/**
 * Client env guard (test/unit/client-env.test.ts)
 * -----------------------------------------------------------------
 * Ningún secreto con prefijo VITE_* debe llegar al bundle del navegador.
 */

import { auditClientEnv } from "../../scripts/check-client-env.mjs";

describe("client env guard", () => {
  it("permite la clave pública oficial de Statsig", () => {
    const { errors, warnings } = auditClientEnv({
      VITE_STATSIG_CLIENT_KEY: "client-key",
      PATH: "/usr/bin",
    } as NodeJS.ProcessEnv);
    expect(errors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
  });

  it("falla ante patrones de secreto (SECRET/PRIVATE/SIGNING)", () => {
    const { errors } = auditClientEnv({
      VITE_API_SECRET: "x",
      VITE_PRIVATE_TOKEN: "y",
    } as NodeJS.ProcessEnv);
    expect(errors).toHaveLength(2);
  });

  it("permite las variables públicas oficiales", () => {
    const { errors, warnings } = auditClientEnv({
      VITE_PUBLIC_APP_URL: "https://x.example",
      VITE_STATSIG_CLIENT_KEY: "client-key",
    } as NodeJS.ProcessEnv);
    expect(errors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
  });

  it("entorno limpio pasa sin errores ni warnings", () => {
    const { errors, warnings } = auditClientEnv({
      PATH: "/usr/bin",
    } as NodeJS.ProcessEnv);
    expect(errors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
  });

  it("silencia vars de sistema VITE_VERCEL_* (plataforma, no operador)", () => {
    const { errors, warnings } = auditClientEnv({
      VITE_VERCEL_URL: "x.vercel.app",
      VITE_VERCEL_ENV: "production",
    } as NodeJS.ProcessEnv);
    expect(errors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
  });
});
