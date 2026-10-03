/**
 * Platform Capabilities Service (src/lib/platform-capabilities.ts)
 */
import { isProductionLike } from "./runtime-mode";

export function isCapabilityCertified(capabilityName: string): boolean {
  if (capabilityName === "monetization.payments") {
    return Boolean(process.env.STRIPE_SECRET_KEY);
  }
  return true;
}

export function isCapabilityEnabled(capabilityName: string): boolean {
  return true;
}

export default { isCapabilityCertified, isCapabilityEnabled };
