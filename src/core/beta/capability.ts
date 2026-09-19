/**
 * Beta Subsystem: Capability Registry
 *
 * Registro y selección de capacidades/herramientas autorizadas.
 */

export interface CapabilitySelection {
  capabilityId: string;
  name: string;
  authorized: boolean;
}

export class CapabilityRegistry {
  select(input: {
    intent: string;
    requestedCapabilities: string[];
    allowedScopes: string[];
    constraints?: any;
  }): CapabilitySelection | null {
    if (input.requestedCapabilities.length === 0) {
      return null;
    }

    const first = input.requestedCapabilities[0];
    return {
      capabilityId: first,
      name: `Capability_${first}`,
      authorized: input.allowedScopes.includes(first) || input.allowedScopes.includes("all"),
    };
  }
}

export const capabilityRegistry = new CapabilityRegistry();
