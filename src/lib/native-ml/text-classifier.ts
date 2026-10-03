/**
 * Native Text Classifier (src/lib/native-ml/text-classifier.ts)
 */
import { ClassifierResult } from "./types";

export function classifyText(text: string): ClassifierResult {
  const tokens = text.toLowerCase().split(/\s+/).filter(Boolean);
  let intent = "general_query";
  const subIntents: string[] = [];

  if (text.includes("?") || tokens.includes("cómo") || tokens.includes("qué")) {
    intent = "question";
  }
  if (tokens.includes("crear") || tokens.includes("construir") || tokens.includes("implementar")) {
    intent = "creation_request";
    subIntents.push("engineering");
  }
  if (tokens.includes("voz") || tokens.includes("habla") || tokens.includes("audio")) {
    subIntents.push("acoustic_request");
  }

  return {
    intent,
    confidence: 0.92,
    tokens,
    subIntents,
  };
}

export default { classifyText };
