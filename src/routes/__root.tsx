import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Component, useEffect, type ErrorInfo, type ReactNode } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Página no encontrada
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La ruta solicitada no existe.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Volver a Isabella
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("[Isabella] root error", error);
  const router = useRouter();
  useEffect(() => {
    console.error("[Isabella] root error detail", {
      message: error.message,
      stack: error.stack,
    });
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="glass-strong w-full max-w-xl rounded-3xl p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-electric">
          C.R.O.W.N. Recovery
        </p>
        <h1 className="mt-4 text-2xl font-semibold">
          Isabella encontró un error de montaje
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          El servidor respondió, pero la ruta o uno de sus módulos no pudo
          montarse. El detalle técnico permanece en los logs del runtime.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              void router.invalidate();
              reset();
            }}
            className="rounded-xl bg-primary px-5 py-3 font-mono text-xs uppercase tracking-wider text-primary-foreground"
          >
            Reintentar
          </button>
          <a
            href="/api/health/live"
            className="rounded-xl border border-border px-5 py-3 font-mono text-xs uppercase tracking-wider"
          >
            Health
          </a>
        </div>
        <p className="mt-5 font-mono text-[10px] text-muted-foreground">
          CROWN-RENDER-01
        </p>
      </section>
    </main>
  );
}

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Isabella Villaseñor AI" },
      {
        name: "description",
        content:
          "Isabella Villaseñor AI — sistema federado de inteligencia artificial gobernada.",
      },
      { property: "og:title", content: "Isabella Villaseñor AI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="bg-background">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <SpeedInsights />
        <Scripts />
      </body>
    </html>
  );
}

class ClientErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  override state = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message:
        error instanceof Error
          ? error.message
          : "Error de renderizado del cliente",
    };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[Isabella] client render failure", {
      error,
      componentStack: info.componentStack,
    });
  }

  override render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
          <section className="glass-strong w-full max-w-xl rounded-3xl p-8 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-electric">
              C.R.O.W.N. Recovery
            </p>
            <h1 className="mt-4 text-2xl font-semibold">
              La interfaz encontró un error
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              El backend permanece protegido. Recarga la interfaz para
              reintentar el montaje.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-primary px-5 py-3 font-mono text-xs uppercase tracking-wider text-primary-foreground"
            >
              Reintentar interfaz
            </button>
            <p className="mt-4 font-mono text-[10px] text-muted-foreground">
              CROWN-RENDER-01
            </p>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

function RootComponent() {
  return (
    <ClientErrorBoundary>
      <Outlet />
    </ClientErrorBoundary>
  );
}
