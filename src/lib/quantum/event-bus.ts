/**
 * Quantum Event Bus (src/lib/quantum/event-bus.ts)
 */
import { EventEmitter } from "node:events";

export interface QuantumEvent {
  id: string;
  type: string;
  channel: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

class QuantumEventBus extends EventEmitter {
  public publish(type: string, payload: Record<string, unknown>, channel: string = "default"): void {
    const event: QuantumEvent = {
      id: `qevt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      channel,
      payload,
      timestamp: new Date().toISOString(),
    };
    this.emit(type, event);
    this.emit("*", event);
  }
}

export const quantumEventBus = new QuantumEventBus();
export default quantumEventBus;
