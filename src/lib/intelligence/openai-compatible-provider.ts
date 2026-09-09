import { config } from "@/lib/config";
import { SecuritySystem } from "@/lib/security";
import type { IntelligenceProvider, IntelligenceRequest, IntelligenceResponse } from "./contracts";

/** Adapter for self-hosted vLLM/llama.cpp/LM Studio and similar OpenAI-compatible runtimes. */
export class OpenAICompatibleLocalProvider implements IntelligenceProvider {
  readonly providerId = "openai-compatible-local";
  readonly modelId: string;
  readonly capabilities = new Set(["text"] as const);
  private readonly baseUrl: string;
  private readonly apiKey?: string;

  constructor(modelId?: string, baseUrl?: string, apiKey?: string) {
    const runtime = config();
    this.modelId = modelId ?? runtime.OPENAI_COMPATIBLE_MODEL ?? "Qwen/Qwen3-8B";
    this.baseUrl = (baseUrl ?? runtime.OPENAI_COMPATIBLE_BASE_URL ?? "http://127.0.0.1:8000/v1").replace(/\/$/, "");
    this.apiKey = apiKey ?? runtime.OPENAI_COMPATIBLE_API_KEY;
  }

  async health(): Promise<boolean> {
    try {
      const response = await SecuritySystem.fetchSafeUpstream(`${this.baseUrl}/models`, {
        method: "GET",
        headers: this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : undefined,
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async invoke(request: IntelligenceRequest): Promise<IntelligenceResponse> {
    const started = performance.now();
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (this.apiKey) headers.authorization = `Bearer ${this.apiKey}`;
    const response = await SecuritySystem.fetchSafeUpstream(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: this.modelId,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
        stream: false,
      }),
    });
    if (!response.ok) throw new Error(`OpenAI-compatible upstream returned ${response.status}`);
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("OpenAI-compatible upstream returned no text");
    return {
      requestId: request.requestId,
      modelId: this.modelId,
      providerId: this.providerId,
      text,
      latencyMs: performance.now() - started,
      degraded: true,
      risk: "LOW",
      usage: { inputTokens: payload.usage?.prompt_tokens, outputTokens: payload.usage?.completion_tokens },
    };
  }
}
