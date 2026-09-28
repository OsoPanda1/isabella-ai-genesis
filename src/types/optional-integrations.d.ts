declare module "better-sqlite3";

declare module "@idlen/chat-sdk/server";
declare module "@idlen/chat-sdk";

declare module "@lovable.dev/cloud-auth-js" {
  export function createLovableAuth(): {
    signInWithOAuth: (provider: string, options?: Record<string, unknown>) => Promise<{
      redirected?: boolean;
      error?: unknown;
      tokens?: { access_token: string; refresh_token: string };
    }>;
  };
}

declare module "@idlen/chat-sdk" {
  export function idlen(...args: unknown[]): void;
}

declare module "@idlen/chat-sdk/server" {
  export function createIdlenClient(...args: unknown[]): unknown;
}

declare global {
  interface Window {
    idlen?: (event: "impression", adId: string) => void;
  }
}

export {};
