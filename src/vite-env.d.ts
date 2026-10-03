/// <reference types="vite/client" />

declare module "*.mp3" {
  const source: string;
  export default source;
}

declare module "@tanstack/router-core" {
  interface IsabellaServerHandlerContext {
    request: Request;
    params?: Record<string, string>;
  }

  interface DefaultUpdatableRouteOptionsExtensions {
    server?: {
      handlers?: Record<
        string,
        (context: IsabellaServerHandlerContext) => Response | Promise<Response>
      >;
    };
  }

  interface UpdatableRouteOptionsExtensions {
    server?: {
      handlers?: Record<
        string,
        (context: IsabellaServerHandlerContext) => Response | Promise<Response>
      >;
    };
  }
}
