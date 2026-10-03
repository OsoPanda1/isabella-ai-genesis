/**
 * Node VM Executor (src/lib/sandbox/node-vm-executor.ts)
 * -------------------------------------------------------------
 * Isolated execution context for tools, scripts, and sandboxed computations.
 */
import vm from "node:vm";

export interface SandboxExecutionOptions {
  timeoutMs?: number;
  memoryLimitMb?: number;
}

export interface SandboxExecutionResult {
  success: boolean;
  result?: unknown;
  error?: string;
  executionTimeMs: number;
}

export async function executeInSandbox(
  code: string,
  contextValues: Record<string, unknown> = {},
  options: SandboxExecutionOptions = {},
): Promise<SandboxExecutionResult> {
  const timeoutMs = options.timeoutMs || 2000;
  const start = performance.now();

  try {
    const sandbox = {
      ...contextValues,
      console: {
        log: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
      },
      Math,
      Date,
      JSON,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
    };

    const context = vm.createContext(sandbox);
    const script = new vm.Script(code);
    const result = script.runInContext(context, { timeout: timeoutMs });

    return {
      success: true,
      result,
      executionTimeMs: Number((performance.now() - start).toFixed(2)),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
      executionTimeMs: Number((performance.now() - start).toFixed(2)),
    };
  }
}

export default { executeInSandbox };
