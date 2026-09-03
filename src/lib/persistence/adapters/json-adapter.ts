import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import type {
  IRepository,
  AuditEntry,
  ApiKey,
  Tenant,
  Session,
  RepositoryError,
  RepositoryFactory,
  ReadOptions,
  WriteOptions,
} from "../repository";

const PERSISTENCE_DIR = path.join(process.cwd(), "isabella_data");
const FILES: Record<string, string> = {
  tenant: "tenants.json",
  session: "sessions.json",
  apiKey: "apiKeys.json",
  audit: "auditLogs.json",
};

function ensureDir() {
  if (!fs.existsSync(PERSISTENCE_DIR)) {
    fs.mkdirSync(PERSISTENCE_DIR, { recursive: true });
  }
}

function filePath(type: string): string {
  return path.join(PERSISTENCE_DIR, FILES[type as keyof typeof FILES] ?? "");
}

function load<T>(type: string): T[] {
  try {
    ensureDir();
    const fp = filePath(type);
    if (fs.existsSync(fp)) {
      return JSON.parse(fs.readFileSync(fp, "utf8")) as T[];
    }
  } catch {
    // fail-open to empty
  }
  return [];
}

function save<T>(type: string, items: T[]): void {
  ensureDir();
  const fp = filePath(type);
  const tmp = fp + ".tmp." + crypto.randomUUID().slice(0, 8);
  fs.writeFileSync(tmp, JSON.stringify(items, null, 2), "utf8");
  fs.renameSync(tmp, fp);
}

function toRepositoryError(err: unknown): RepositoryError {
  const e = err instanceof Error ? err : new Error(String(err));
  const rep: RepositoryError = Object.assign(e, {
    code: "REPOSITORY_ERROR",
    statusCode: 500,
    retryable: true,
  });
  return rep;
}

export class JsonFileRepository<T extends { id: string }> implements IRepository<T> {
  private readonly type: string;

  constructor(type: string) {
    this.type = type;
  }

  async create(
    _tenantId: string,
    data: Partial<T>,
    _options?: WriteOptions,
  ): Promise<T> {
    const items = load<T>(this.type);
    const record = {
      ...data,
      id: (data as Record<string, unknown>).id ?? crypto.randomUUID(),
    } as T;
    items.push(record);
    save(this.type, items);
    return record;
  }

  async read(
    _tenantId: string,
    id: string,
    _options?: ReadOptions,
  ): Promise<T | null> {
    const items = load<T>(this.type);
    const found = items.find((r) => r.id === id) ?? null;
    return found;
  }

  async list(
    _tenantId: string,
    _filters?: Record<string, unknown>,
    limit?: number,
    offset?: number,
  ): Promise<{ items: T[]; total: number }> {
    const items = load<T>(this.type);
    let result = items;
    if (_filters) {
      result = result.filter((r) =>
        Object.entries(_filters).every(([k, v]) => (r as Record<string, unknown>)[k] === v),
      );
    }
    const total = result.length;
    const sliced = offset !== undefined ? result.slice(offset, offset + (limit ?? total)) : result;
    return { items: sliced, total };
  }

  async update(
    _tenantId: string,
    id: string,
    data: Partial<T>,
    _options?: WriteOptions,
  ): Promise<T> {
    const items = load<T>(this.type);
    const idx = items.findIndex((r) => r.id === id);
    if (idx < 0) {
      throw toRepositoryError(new Error(`Record ${id} not found`));
    }
    items[idx] = { ...items[idx], ...data } as T;
    save(this.type, items);
    return items[idx];
  }

  async delete(_tenantId: string, id: string): Promise<boolean> {
    const items = load<T>(this.type);
    const idx = items.findIndex((r) => r.id === id);
    if (idx < 0) return false;
    items.splice(idx, 1);
    save(this.type, items);
    return true;
  }

  async audit(entry: AuditEntry): Promise<void> {
    const items = load<AuditEntry>("audit");
    items.unshift(entry);
    save("audit", items);
  }

  async health(): Promise<{ ok: boolean; latencyMs: number }> {
    const start = performance.now();
    try {
      ensureDir();
      fs.accessSync(filePath(this.type));
      return { ok: true, latencyMs: performance.now() - start };
    } catch {
      return { ok: false, latencyMs: performance.now() - start };
    }
  }
}

export class JsonRepositoryFactory implements RepositoryFactory {
  private readonly adapters = new Map<string, JsonFileRepository<any>>();

  private adapter<T extends { id: string }>(type: string): JsonFileRepository<T> {
    const existing = this.adapters.get(type) as unknown as JsonFileRepository<T> | undefined;
    if (existing) return existing;
    const a = new JsonFileRepository<T>(type);
    this.adapters.set(type, a as unknown as JsonFileRepository<any>);
    return a;
  }

  getAdapter<T extends { id: string }>(type: "supabase" | "neon" | "redis", _schema?: string): IRepository<T> {
    return new JsonFileRepository<T>(type);
  }

  getApiKeyRepository(): IRepository<ApiKey> {
    return this.adapter<ApiKey>("apiKey");
  }

  getAuditRepository(): IRepository<AuditEntry> {
    return this.adapter<AuditEntry>("audit");
  }

  getTenantRepository(): IRepository<Tenant> {
    return this.adapter<Tenant>("tenant");
  }

  getSessionRepository(): IRepository<Session> {
    return this.adapter<Session>("session");
  }
}

export const repositoryFactory = new JsonRepositoryFactory();
