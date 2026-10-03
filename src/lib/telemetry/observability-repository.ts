/**
 * Observability Repository (src/lib/telemetry/observability-repository.ts)
 */
import { TelemetryEvent, observability } from "./observability";

export interface ObservabilityRepository {
  save(event: TelemetryEvent): Promise<void>;
  listRecent(limit?: number): Promise<readonly TelemetryEvent[]>;
}

export class InMemoryObservabilityRepository implements ObservabilityRepository {
  async save(event: TelemetryEvent): Promise<void> {
    observability.recordEvent(event);
  }

  async listRecent(limit: number = 50): Promise<readonly TelemetryEvent[]> {
    return observability.getRecentEvents(limit);
  }
}

export const observabilityRepository = new InMemoryObservabilityRepository();
export default observabilityRepository;
