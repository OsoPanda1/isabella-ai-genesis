import { SecuritySystem } from "@/lib/security";
import { localProviderConfig } from "./local-provider-config";
import type { IntelligenceProvider, IntelligenceRequest, IntelligenceResponse } from "./contracts";

/**
 * Local-only provider. No paid API is required and requests stay inside the
 * configured Ollama endpoint. Production authorization is still enforced by
 * the model registry/router; availability is not authority.
 */
export class OllamaProvider implements IntelligenceProvider {
  readonly providerId = "ollama-local";
  readonly modelId: string;
  readonly capabilities = new Set(["text"] as const);
  private readonly baseUrl: string;

  constructor(modelId?: string, baseUrl?: string) {
    const runtime = localProviderConfig();
    this.modelId = modelId ?? runtime.ollamaModel;
    this.baseUrl = (baseUrl ?? runtime.ollamaBaseUrl).replace(/\/$/, "");
  }

  async health(): Promise<boolean> {
    try {
      const response = await SecuritySystem.fetchSafeUpstream(`${this.baseUrl}/api/tags`, { method: "GET" });
      if (!response.ok) return false;
      const payload = (await response.json()) as { models?: Array<{ name?: string }> };
      return Boolean(payload.models?.some((model) => model.name === this.modelId));
    } catch {
      return false;
    }
  }

  async invoke(request: IntelligenceRequest): Promise<IntelligenceResponse> {
    const started = performance.now();
    const response = await SecuritySystem.fetchSafeUpstream(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: this.modelId,
        stream: false,
        messages: request.messages.map((message) => ({ role: message.role, content: message.content })),
        options: { temperature: request.temperature ?? 0.7, num_predict: request.maxTokens ?? 2048 },
      }),
    });
    if (!response.ok) throw new Error(`Ollama upstream returned ${response.status}`);
    const payload = (await response.json()) as { message?: { content?: string }; prompt_eval_count?: number; eval_count?: number };
    const text = payload.message?.content?.trim();
    if (!text) throw new Error("Ollama returned no text");
    return {
      requestId: request.requestId,
      modelId: this.modelId,
      providerId: this.providerId,
      text,
      latencyMs: performance.now() - started,
      degraded: true,
      risk: "LOW",
      usage: { inputTokens: payload.prompt_eval_count, outputTokens: payload.eval_count },
    };
  }
}
