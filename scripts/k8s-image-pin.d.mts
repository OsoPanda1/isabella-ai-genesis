export interface ImagePinVerdict {
  status: "PASS" | "EVIDENCE_GATED" | "FAIL";
  reason: "IMAGEN_NO_DEFINIDA" | "TAG_LATEST_CON_DIGEST" | "PIN_POR_DIGEST" | "SIN_TAG_NI_DIGEST" | "TAG_LATEST" | "TAG_VERSIONADO_SIN_DIGEST";
  image: string;
  hasDigest: boolean;
}

export function evaluateImagePin(image: string): ImagePinVerdict;
export function extractImages(yamlText: string): string[];
