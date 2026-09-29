export function createLogger(namespace: string) {
  return {
    info: (msg: string, meta?: unknown) => console.log(`[${namespace}] INFO:`, msg, meta ?? ""),
    warn: (msg: string, meta?: unknown) => console.warn(`[${namespace}] WARN:`, msg, meta ?? ""),
    error: (msg: string, meta?: unknown) => console.error(`[${namespace}] ERROR:`, msg, meta ?? ""),
    debug: (msg: string, meta?: unknown) => console.debug(`[${namespace}] DEBUG:`, msg, meta ?? ""),
  };
}
