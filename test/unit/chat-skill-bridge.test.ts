import { describe, it, expect } from "vitest";
import { detectSkillInvocation, executeChatSkillBridge } from "@/lib/skills/chat-bridge";

describe("Chat-to-Skill Executor Bridge", () => {
  describe("detectSkillInvocation", () => {
    it("detects @skill:<id> format with text remainder", () => {
      const result = detectSkillInvocation("@skill:hepta consulta territorial");
      expect(result).not.toBeNull();
      expect(result?.canonicalName).toBe("HEPTA");
      expect(result?.parsedInput).toHaveProperty("query", "consulta territorial");
    });

    it("detects @skill <id> format with JSON payload", () => {
      const result = detectSkillInvocation('@skill hepta {"customParam": 123}');
      expect(result).not.toBeNull();
      expect(result?.canonicalName).toBe("HEPTA");
      expect(result?.parsedInput).toHaveProperty("customParam", 123);
    });

    it("detects direct @<name> invocation for known skills", () => {
      const result = detectSkillInvocation("@gaia reporte ambiental");
      expect(result).not.toBeNull();
      expect(result?.canonicalName).toBe("GAIA");
      expect(result?.parsedInput).toHaveProperty("query", "reporte ambiental");
    });

    it("returns null for ordinary conversational messages without skill tokens", () => {
      const result = detectSkillInvocation("Hola Isabella, ¿cómo estás hoy?");
      expect(result).toBeNull();
    });

    it("returns null for unknown @ handles", () => {
      const result = detectSkillInvocation("@usuario_no_existente mensaje");
      expect(result).toBeNull();
    });
  });

  describe("executeChatSkillBridge", () => {
    it("handles execution through CROWN pipeline and formats output or governed denial", async () => {
      const invocation = detectSkillInvocation("@skill:hepta prueba de puente");
      expect(invocation).not.toBeNull();
      if (!invocation) return;

      const context = {
        correlationId: "corr_test_bridge",
        traceId: "trace_test_bridge",
        userId: "usr_test_operator",
        tenantId: "tenant_nodo_cero",
        role: "Operator",
        ip: "127.0.0.1",
      };

      const result = await executeChatSkillBridge(invocation, context);
      // Either successfully executed or policy-gated, but always returns a structured object
      expect(result).toHaveProperty("skillId", "HEPTA");
      expect(result).toHaveProperty("content");
      expect(typeof result.content).toBe("string");
      expect(result.content.length).toBeGreaterThan(0);
    });
  });
});
