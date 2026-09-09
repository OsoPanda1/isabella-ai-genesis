export interface LocalProviderConfig {
  ollamaBaseUrl: string;
  ollamaModel: string;
  openaiCompatibleBaseUrl: string;
  openaiCompatibleModel: string;
  openaiCompatibleApiKey?: string;
}

function cleanUrl(value: string, fallback: string): string {
  try {
    const url = new URL(value || fallback);
    if (!['http:', 'https:'].includes(url.protocol)) return fallback;
    return url.toString().replace(/\/$/, '');
  } catch {
    return fallback;
  }
}

export function localProviderConfig(): LocalProviderConfig {
  return {
    ollamaBaseUrl: cleanUrl(process.env.OLLAMA_BASE_URL ?? '', 'http://127.0.0.1:11434'),
    ollamaModel: process.env.OLLAMA_MODEL?.trim() || 'qwen3:8b',
    openaiCompatibleBaseUrl: cleanUrl(process.env.OPENAI_COMPATIBLE_BASE_URL ?? '', 'http://127.0.0.1:8000/v1'),
    openaiCompatibleModel: process.env.OPENAI_COMPATIBLE_MODEL?.trim() || 'Qwen/Qwen3-8B',
    openaiCompatibleApiKey: process.env.OPENAI_COMPATIBLE_API_KEY?.trim() || undefined,
  };
}
