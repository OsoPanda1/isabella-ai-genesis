/**
 * IGDS Genesis Repository (src/lib/repositories/igds-genesis-repository.ts)
 */
import type { IGDSGenesisSeal } from "../contracts/isabella";

class InMemoryIgdsGenesisRepository {
  private seals = new Map<string, any>();

  async saveSeal(seal: any): Promise<void> {
    const id = seal.sealId || seal.id || `seal_${Date.now()}`;
    this.seals.set(id, { ...seal });
  }

  async getSeal(id: string): Promise<any | null> {
    return this.seals.get(id) || null;
  }

  async listSeals(): Promise<readonly any[]> {
    return Array.from(this.seals.values());
  }
}

export const igdsGenesisRepository = new InMemoryIgdsGenesisRepository();
export default igdsGenesisRepository;
