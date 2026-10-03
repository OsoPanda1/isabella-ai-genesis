/**
 * Tool Registry (src/lib/tool-registry.ts)
 * -------------------------------------------------------------
 * Canonical Registry of authorized agent tools and contracts.
 */
import { ToolContract } from "../contracts/isabella";

const toolRegistry = new Map<string, ToolContract>();

// Seed default tools
const defaultTools: ToolContract[] = [
  {
    toolName: "web_search",
    version: "1.0.0",
    riskLevel: "low",
    inputSchema: "{}",
    outputSchema: "{}",
    requiredScopes: ["tool:execute"],
    timeoutMs: 5000,
    maxRetries: 2,
    sideEffects: "none",
    requiresHumanApproval: false,
  },
  {
    toolName: "memory_query",
    version: "1.0.0",
    riskLevel: "low",
    inputSchema: "{}",
    outputSchema: "{}",
    requiredScopes: ["memory:read"],
    timeoutMs: 3000,
    maxRetries: 1,
    sideEffects: "none",
    requiresHumanApproval: false,
  },
  {
    toolName: "quantum_bridge_execute",
    version: "1.0.0",
    riskLevel: "high",
    inputSchema: "{}",
    outputSchema: "{}",
    requiredScopes: ["quantum:execute"],
    timeoutMs: 10000,
    maxRetries: 0,
    sideEffects: "read",
    requiresHumanApproval: false,
  },
];

for (const tool of defaultTools) {
  toolRegistry.set(tool.toolName, tool);
}

export function registerTool(tool: ToolContract): void {
  toolRegistry.set(tool.toolName, tool);
}

export function getTool(name: string): ToolContract | null {
  return toolRegistry.get(name) || null;
}

export function listTools(): readonly ToolContract[] {
  return Array.from(toolRegistry.values());
}

export default { registerTool, getTool, listTools };
