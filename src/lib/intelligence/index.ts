import { config } from "@/lib/config";
import { GeminiProvider } from "./gemini-provider";
import { addProvider, invokeIntelligence, governIntelligence } from "./router";

let initialized = false;

export function initializeIntelligencePlane(): void {
  if (initialized) return;
  const configured = config().LLM_DEFAULT_MODEL || "google/gemini-3-flash";
  const model = configured.includes("gemini-3.6-flash") ? "gemini-3-flash" : (configured.split("/").at(-1) ?? "gemini-3-flash");
  addProvider(new GeminiProvider(model), true);
  initialized = true;
}

export { invokeIntelligence, governIntelligence };
export * from "./contracts";
export * from "./model-registry";
