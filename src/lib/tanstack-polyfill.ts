/**
 * Polyfill for TanStack Start / React useServerFn in client-side SPA mode
 */
export function useServerFn<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn> | TReturn,
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    try {
      return await fn(...args);
    } catch (err) {
      console.warn("[tanstack-polyfill] server function fallback:", err);
      throw err;
    }
  };
}

export function createServerFn<TArgs extends any[], TReturn>(
  _options: Record<string, unknown>,
  handler: (...args: TArgs) => Promise<TReturn> | TReturn,
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    return await handler(...args);
  };
}
