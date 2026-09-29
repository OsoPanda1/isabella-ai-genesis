import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export type LifecyclePhase = "running" | "exited";
export type RuntimeHealth = "healthy" | "degraded" | "unknown";

export interface LifecycleRecord {
  phase: LifecyclePhase;
  pid: number;
  startedAt: string;
  startTime: number;
  priorUncleanExit?: boolean;
  priorSuspectedOom?: boolean;
  exitCode?: number | null;
  exitReason?: string;
  exitedAt?: string;
}

export interface MemorySnapshot {
  rssBytes: number;
  heapUsedBytes: number;
  heapTotalBytes: number;
  externalBytes: number;
  availableBytes?: number;
  totalBytes?: number;
}

export interface RuntimeStatus {
  health: RuntimeHealth;
  pid: number;
  startedAt: string;
  codeFingerprint?: string;
  memory?: MemorySnapshot;
  previousUncleanExit?: boolean;
  previousSuspectedOom?: boolean;
}

export interface NativeIntegrationOptions {
  stateDirectory?: string;
  codeRoot?: string;
  memoryHighMb?: number;
}

const lifecycleFile = "isabella.lifecycle.json";
const diagnosticFile = "isabella-runtime.ndjson";

function now(): string {
  return new Date().toISOString();
}

function safeNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function readMemorySnapshot(): MemorySnapshot {
  const usage = process.memoryUsage();
  const snapshot: MemorySnapshot = {
    rssBytes: usage.rss,
    heapUsedBytes: usage.heapUsed,
    heapTotalBytes: usage.heapTotal,
    externalBytes: usage.external,
  };
  try {
    const raw = readFileSync("/proc/meminfo", "utf8");
    const values = Object.fromEntries(
      raw.split("\n").flatMap((line) => {
        const match = /^(MemTotal|MemAvailable):\\s+(\\d+)/.exec(line);
        return match ? [[match[1], Number(match[2]) * 1024]] : [];
      }),
    );
    snapshot.totalBytes = safeNumber(values.MemTotal);
    snapshot.availableBytes = safeNumber(values.MemAvailable);
  } catch {
    // /proc is Linux-specific; process memory remains valid on other runtimes.
  }
  return snapshot;
}

export function resolveMemoryBudgetMb(setting: unknown, totalBytes?: number): number | undefined {
  if (typeof setting === "number" && Number.isFinite(setting) && setting > 0)
    return Math.floor(setting);
  if (typeof setting === "string") {
    const normalized = setting.trim().toLowerCase();
    if (["", "off", "none", "false", "disabled"].includes(normalized)) return undefined;
    if (normalized !== "auto") {
      const parsed = Number(normalized);
      return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : undefined;
    }
  }
  if (!totalBytes || totalBytes <= 0) return undefined;
  const budget = Math.floor((totalBytes * 0.65) / (1024 * 1024));
  return budget >= 512 ? budget : undefined;
}

export function resolveTerminalCwd(
  configuredCwd: string | undefined,
  messagingCwd: string | undefined,
  backend = "local",
): string | undefined {
  const placeholders = new Set(["", ".", "auto", "cwd"]);
  if (configuredCwd && !placeholders.has(configuredCwd.trim().toLowerCase())) return configuredCwd;
  if (backend.trim().toLowerCase() === "local") return messagingCwd?.trim() || process.cwd();
  if (
    backend.trim().toLowerCase() === "docker" &&
    messagingCwd &&
    !placeholders.has(messagingCwd.trim().toLowerCase())
  ) {
    return messagingCwd.trim();
  }
  return undefined;
}

export function fingerprintSource(root = process.cwd()): string | undefined {
  try {
    const packageJson = readFileSync(resolve(root, "package.json"), "utf8");
    const manifest = JSON.parse(packageJson) as { version?: string };
    const commit = process.env.VERCEL_GIT_COMMIT_SHA;
    return `isabella:${manifest.version ?? "unknown"}:${commit ?? createHash("sha256").update(packageJson).digest("hex").slice(0, 12)}`;
  } catch {
    return undefined;
  }
}

export class IsabellaNativeIntegration {
  private readonly stateDirectory: string;
  private readonly startedAt = now();
  private readonly startTime = Date.now();
  private readonly codeFingerprint?: string;
  private previous?: LifecycleRecord;

  constructor(options: NativeIntegrationOptions = {}) {
    this.stateDirectory = options.stateDirectory ?? resolve(process.cwd(), ".isabella-state");
    this.codeFingerprint = fingerprintSource(options.codeRoot);
  }

  private get lifecyclePath(): string {
    return resolve(this.stateDirectory, lifecycleFile);
  }
  private get diagnosticPath(): string {
    return resolve(this.stateDirectory, diagnosticFile);
  }

  async start(): Promise<RuntimeStatus> {
    this.previous = await this.readLifecycle();
    const priorUncleanExit = this.previous?.phase === "running";
    const priorSuspectedOom = Boolean(this.previous?.priorSuspectedOom);
    if (priorUncleanExit)
      await this.appendDiagnostic({ type: "previous_unclean_exit", previous: this.previous });
    await this.writeLifecycle({
      phase: "running",
      pid: process.pid,
      startedAt: this.startedAt,
      startTime: this.startTime,
      ...(priorUncleanExit ? { priorUncleanExit: true, priorSuspectedOom } : {}),
    });
    return this.status(priorUncleanExit, priorSuspectedOom);
  }

  async stop(exitCode: number | null = 0, reason = "graceful_shutdown"): Promise<void> {
    const current = await this.readLifecycle();
    if (current && current.pid !== process.pid) return;
    await this.writeLifecycle({
      phase: "exited",
      pid: process.pid,
      startedAt: this.startedAt,
      startTime: this.startTime,
      exitCode,
      exitReason: reason,
      exitedAt: now(),
    });
  }

  status(previousUncleanExit = false, previousSuspectedOom = false): RuntimeStatus {
    const memory = readMemorySnapshot();
    const budget = resolveMemoryBudgetMb(
      process.env.ISABELLA_MEMORY_HIGH_MB ?? "auto",
      memory.totalBytes,
    );
    const overBudget = budget !== undefined && memory.rssBytes > budget * 1024 * 1024;
    return {
      health: overBudget ? "degraded" : "healthy",
      pid: process.pid,
      startedAt: this.startedAt,
      codeFingerprint: this.codeFingerprint,
      memory,
      previousUncleanExit,
      previousSuspectedOom,
    };
  }

  private async readLifecycle(): Promise<LifecycleRecord | undefined> {
    try {
      return JSON.parse(await readFile(this.lifecyclePath, "utf8")) as LifecycleRecord;
    } catch {
      return undefined;
    }
  }

  private async writeLifecycle(record: LifecycleRecord): Promise<void> {
    await mkdir(this.stateDirectory, { recursive: true, mode: 0o700 });
    const temporary = `${this.lifecyclePath}.${process.pid}.tmp`;
    await writeFile(temporary, JSON.stringify(record), { mode: 0o600 });
    await rename(temporary, this.lifecyclePath);
  }

  private async appendDiagnostic(event: Record<string, unknown>): Promise<void> {
    await mkdir(dirname(this.diagnosticPath), { recursive: true, mode: 0o700 });
    await appendFile(this.diagnosticPath, `${JSON.stringify({ at: now(), ...event })}\n`, {
      mode: 0o600,
    });
  }
}

export function createNativeIntegration(
  options?: NativeIntegrationOptions,
): IsabellaNativeIntegration {
  return new IsabellaNativeIntegration(options);
}

export function hasReadableStateDirectory(path: string): boolean {
  return existsSync(path);
}
