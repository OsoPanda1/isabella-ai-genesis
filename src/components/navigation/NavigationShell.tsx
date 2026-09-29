/**
 * NavigationShell
 *
 * Shell que envuelve toda la interfaz.
 * Contiene: barra superior, triggers, overlays, paneles.
 * Los paneles se despliegan desde sus lados correspondientes.
 */

import { Search, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { NavigationStateProvider } from "./NavigationStateProvider";
import { NavigationTrigger } from "./NavigationTrigger";
import { NavigationPanel } from "./NavigationPanel";
import { ContextNavbar } from "./ContextNavbar";
import { WorkspaceNavbar } from "./WorkspaceNavbar";
import { GovernanceNavbar } from "./GovernanceNavbar";
import { MonetizationNavbar } from "./MonetizationNavbar";

interface NavigationShellProps {
  children: ReactNode;
  projectName?: string;
  territory?: string;
  userName?: string;
}

export function NavigationShell({
  children,
  projectName = "Mineral del Monte",
  territory = "Hidalgo",
  userName = "Edwin",
}: NavigationShellProps) {
  return (
    <NavigationStateProvider>
      <div className="nav-shell">
        {/* Top bar */}
        <header className="sticky top-0 z-30 mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-background/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-amber-200/25 bg-amber-100/10 text-lg text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.15)]" aria-hidden="true">
              ◉
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[0.16em] text-foreground uppercase">Isabella</p>
              <p className="truncate text-[11px] tracking-wide text-muted-foreground">{projectName} · {territory}</p>
            </div>
          </div>

          <button className="group order-3 flex w-full items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-left text-sm text-muted-foreground transition hover:border-amber-200/30 hover:bg-white/[0.08] hover:text-foreground sm:order-none sm:max-w-xs" aria-label="Buscar">
            <Search className="size-4 shrink-0 transition group-hover:text-amber-100" aria-hidden="true" />
            <span className="flex-1">Buscar en Isabella</span>
            <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">⌘K</kbd>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/5 px-3 py-1.5 text-xs text-emerald-100 sm:flex">
              <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" aria-hidden="true" />
              Activo
            </span>
            <button className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 pr-3 transition hover:border-amber-200/30 hover:bg-white/[0.08]" aria-label={`Perfil de usuario: ${userName}`}>
              <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-500 text-sm font-semibold text-stone-950">{userName.charAt(0).toUpperCase()}</span>
              <span className="hidden text-sm text-foreground sm:inline">{userName}</span>
              <UserRound className="hidden size-3.5 text-muted-foreground transition group-hover:text-amber-100 sm:block" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Navigation triggers */}
        <div className="nav-triggers">
          <div className="nav-triggers-left">
            <NavigationTrigger navbarId="context" />
            <NavigationTrigger navbarId="workspace" badge={3} />
            <NavigationTrigger navbarId="governance" />
          </div>
          <div className="nav-triggers-right">
            <NavigationTrigger navbarId="monetization" badge={2} />
          </div>
        </div>

        {/* Navigation panels */}
        <NavigationPanel navbarId="context">
          <ContextNavbar />
        </NavigationPanel>

        <NavigationPanel navbarId="workspace">
          <WorkspaceNavbar />
        </NavigationPanel>

        <NavigationPanel navbarId="governance">
          <GovernanceNavbar />
        </NavigationPanel>

        <NavigationPanel navbarId="monetization">
          <MonetizationNavbar />
        </NavigationPanel>

        {/* Main content */}
        <main className="nav-main">{children}</main>

        {/* Accessible announcement region */}
        <div id="nav-announcement" className="sr-only" aria-live="polite" aria-atomic="true" />
      </div>
    </NavigationStateProvider>
  );
}
