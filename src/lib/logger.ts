export interface Logger {
  info: (message: string, context?: Record<string, unknown>) => void;
  warn: (message: string, context?: Record<string, unknown>) => void;
  error: (message: string, context?: Record<string, unknown>) => void;
  debug: (message: string, context?: Record<string, unknown>) => void;
}

export function createLogger(moduleName: string): Logger {
  return {
    info: (msg, ctx) => {
      if (ctx) {
        console.info(`[${moduleName}] ${msg}`, ctx);
      } else {
        console.info(`[${moduleName}] ${msg}`);
      }
    },
    warn: (msg, ctx) => {
      if (ctx) {
        console.warn(`[${moduleName}] ${msg}`, ctx);
      } else {
        console.warn(`[${moduleName}] ${msg}`);
      }
    },
    error: (msg, ctx) => {
      if (ctx) {
        console.error(`[${moduleName}] ${msg}`, ctx);
      } else {
        console.error(`[${moduleName}] ${msg}`);
      }
    },
    debug: (msg, ctx) => {
      if (ctx) {
        console.debug(`[${moduleName}] ${msg}`, ctx);
      } else {
        console.debug(`[${moduleName}] ${msg}`);
      }
    },
  };
}
