import { config } from "@/lib/config";
import { GeminiProvider } from "./gemini-provider";
import { addProvider, invokeIntelligence, governIntelligence } from "./router";

let initialized = false;

export function initializeIntelligencePlane(): void {
  if (initialized) return;
  const model = config().LLM_DEFAULT_MODEL || "google/gemini-3.6-flash";
  const normalized = model.includes("/") ? model.split("/").at(-1) ?? "gemini-3-flash" : model;
  addProvider(new GeminiProvider(normalized), true);
  initialized = true;
}

export { invokeIntelligence, governIntelligence };
export * from "./contracts";
export * from "./model-registry";
