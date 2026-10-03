/**
 * ISABELLA — canonical runtime provider registry.
 *
 * One provider boundary for the Dual Kernel and optional external models.
 * Runtime configuration is read only through config(); no direct process.env
 * access is allowed outside the configuration boundary.
 */

import { GoogleGenAI } from "@google/genai";
import { config } from "../../lib/config";
import { dualKernel } from "../dual-kernel";
import { createRequestId } from "../contracts";

export interface InferenceRequest {
  readonly systemPrompt: string;
  readonly messages: Array<{ role: string; content: string }>;
  readonly tools?: string[];
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly tenantId?: string;
  readonly actorId?: string;
}

export interface InferenceResult {
  readonly text: string;
  readonly tokensUsed: number;
  readonly model: string;
  readonly provider: string;
  readonly degraded?: boolean;
  readonly toolCalls?: Array<{
    readonly name: string;
    readonly arguments: Record<string, unknown>;
  }>;
}

export interface RuntimeProvider {
  readonly name: string;
  readonly model: string;
  readonly contextWindowLimit: number;
  readonly supportsTools: boolean;
  readonly requiresApiKey: boolean;
  infer(req: InferenceRequest): Promise<InferenceResult>;
}

function lastUserMessage(req: InferenceRequest): string {
  return (
    req.messages
      .filter((message) => message.role === "user")
      .at(-1)
      ?.content?.trim() ?? ""
  );
}

function estimateTokens(req: InferenceRequest, output: string): number {
  const inputChars =
    req.systemPrompt.length +
    req.messages.reduce((sum, message) => sum + message.content.length, 0);
  return Math.max(0, Math.ceil((inputChars + output.length) / 3.5));
}

function boundedTemperature(value: number | undefined): number {
  if (value === undefined) return 0.7;
  if (!Number.isFinite(value)) throw new Error("INVALID_TEMPERATURE");
  return Math.min(2, Math.max(0, value));
}

function boundedTokens(value: number | undefined): number {
  if (value === undefined) return 4096;
  if (!Number.isInteger(value) || value < 1 || value > 32000) throw new Error("INVALID_MAX_TOKENS");
  return value;
}

class CognitionIsabellaProvider implements RuntimeProvider {
  readonly name = "isabella-cognition";
  readonly model = "isabella-dual-kernel-v1";
  readonly contextWindowLimit = 32000;
  readonly supportsTools = true;
  readonly requiresApiKey = false;

  async infer(req: InferenceRequest): Promise<InferenceResult> {
    const input = lastUserMessage(req);
    const result = await dualKernel.process({
      requestId: createRequestId(),
      tenantId: req.tenantId ?? "tenant-dev",
      actorId: req.actorId ?? "runtime",
      federationId: 5,
      intent: input,
      mode: "chat",
      context: { memoryEnabled: true },
      requestedCapabilities: req.tools ?? [],
    });
    return {
      text: result.answer,
      tokensUsed: estimateTokens(req, result.answer),
      model: this.model,
      provider: this.name,
      degraded: result.status === "degraded",
    };
  }
}

class GeminiProvider implements RuntimeProvider {
  readonly name = "gemini";
  readonly model = "gemini-3.7-flash";
  readonly contextWindowLimit = 1000000;
  readonly supportsTools = true;
  readonly requiresApiKey = true;

  async infer(req: InferenceRequest): Promise<InferenceResult> {
    const apiKey = config().GEMINI_API_KEY;
    if (!apiKey) {
      return {
        text: "Gemini no disponible (API key no configurada).",
        tokensUsed: 0,
        model: this.model,
        provider: this.name,
        degraded: true,
      };
    }

    const genai = new GoogleGenAI({ apiKey });
    try {
      const response = await genai.models.generateContent({
        model: this.model,
        contents: req.messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        config: {
          systemInstruction: req.systemPrompt,
          temperature: boundedTemperature(req.temperature),
          maxOutputTokens: boundedTokens(req.maxTokens),
        },
      });
      const text = response.text?.trim() ?? "";
      return {
        text,
        tokensUsed: estimateTokens(req, text),
        model: this.model,
        provider: this.name,
        degraded: false,
      };
    } catch {
      return {
        text: "Gemini no está disponible en este momento.",
        tokensUsed: 0,
        model: this.model,
        provider: this.name,
        degraded: true,
      };
    }
  }
}

const providers: RuntimeProvider[] = [new CognitionIsabellaProvider(), new GeminiProvider()];

export function registerProvider(provider: RuntimeProvider): void {
  const existing = providers.findIndex((candidate) => candidate.name === provider.name);
  if (existing >= 0) providers[existing] = provider;
  else providers.unshift(provider);
}

export function resolveRuntimeProvider(preferred?: string): RuntimeProvider {
  if (preferred) {
    const match = providers.find((provider) => provider.name === preferred);
    if (match && (!match.requiresApiKey || isProviderAvailable(match))) return match;
  }

  const cognition = providers.find((provider) => provider.name === "isabella-cognition");
  if (cognition) return cognition;

  const available = providers.find(isProviderAvailable);
  if (available) return available;
  throw new Error("NO_RUNTIME_PROVIDER_AVAILABLE");
}

function isProviderAvailable(provider: RuntimeProvider): boolean {
  if (!provider.requiresApiKey) return true;
  return provider.name === "gemini" ? Boolean(config().GEMINI_API_KEY) : false;
}

export function listProviders(): Array<{ name: string; model: string; available: boolean }> {
  return providers.map((provider) => ({
    name: provider.name,
    model: provider.model,
    available: isProviderAvailable(provider),
  }));
}
