/**
 * Safe Node.js dynamic require abstraction for ESM/Bundler environments
 */
import { createRequire } from "node:module";

let nodeRequire: NodeRequire | null = null;

export function safeRequire<T = unknown>(moduleName: string): T | null {
  try {
    if (!nodeRequire && typeof import.meta !== "undefined" && import.meta.url) {
      nodeRequire = createRequire(import.meta.url);
    }
    if (nodeRequire) {
      return nodeRequire(moduleName) as T;
    }
  } catch {
    // Dynamic fallback
  }
  return null;
}

export default safeRequire;
