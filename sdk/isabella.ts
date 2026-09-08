export interface PluginMeta {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
}

export interface PluginContext {
  tenantId: string;
  subjectId: string;
  traceId: string;
  payload: Record<string, unknown>;
}

export interface PluginResult {
  pluginId: string;
  output: Record<string, unknown>;
  signature: string;
}

export interface IsabellaSDKOptions {
  baseUrl: string;
  apiKey: string;
  timeoutMs?: number;
}

export class IsabellaSDK {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;

  constructor(options: IsabellaSDKOptions) {
    if (!options.baseUrl.startsWith("https://") && !options.baseUrl.startsWith("http://localhost")) {
      throw new Error("baseUrl must use HTTPS outside localhost");
    }
    if (!options.apiKey) throw new Error("apiKey is required");
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs ?? 10_000;
  }

  async registerPlugin(meta: PluginMeta): Promise<void> {
    await this.request<void>("POST", "/plugins/register", meta);
  }

  async invokePlugin(pluginId: string, context: PluginContext): Promise<PluginResult> {
    return this.request<PluginResult>("POST", "/plugins/invoke", { pluginId, context });
  }

  async listPlugins(): Promise<PluginMeta[]> {
    return this.request<PluginMeta[]>("GET", "/plugins/catalog");
  }

  async embed(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>("POST", "/ml/embed", input);
  }

  async reason(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>("POST", "/ml/reason", input);
  }

  async economicIntegrity(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>("GET", "/economic-integrity");
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
      const text = await response.text();
      if (!response.ok) throw new Error(`Isabella API ${response.status}: ${text.slice(0, 500)}`);
      return (text ? JSON.parse(text) : undefined) as T;
    } finally {
      clearTimeout(timer);
    }
  }
}
