/**
 * Marketplace Repository (src/lib/repositories/marketplace-repository.ts)
 * -----------------------------------------------------------------
 * Manages published sovereign skills, agents, and templates.
 */
import { randomUUID } from "node:crypto";

export interface MarketplaceItem {
  id: string;
  tenant_id: string;
  creator_id: string;
  title: string;
  description: string;
  category: "skill" | "agent" | "model" | "prompt_pack";
  price_cents: number;
  published_at: string;
  status: "ACTIVE" | "PENDING_REVIEW" | "SUSPENDED";
  metadata?: Record<string, unknown>;
}

class InMemoryMarketplaceRepository {
  private items = new Map<string, MarketplaceItem>();

  async publishItem(item: Omit<MarketplaceItem, "id" | "published_at" | "status">): Promise<MarketplaceItem> {
    const id = `mkt_${randomUUID()}`;
    const record: MarketplaceItem = {
      ...item,
      id,
      published_at: new Date().toISOString(),
      status: "ACTIVE",
    };
    this.items.set(id, record);
    return record;
  }

  async getItem(id: string): Promise<MarketplaceItem | null> {
    return this.items.get(id) || null;
  }

  async listItems(category?: string): Promise<readonly MarketplaceItem[]> {
    const all = Array.from(this.items.values());
    if (category) {
      return all.filter((i) => i.category === category);
    }
    return all;
  }
}

export const marketplaceRepository = new InMemoryMarketplaceRepository();
export default marketplaceRepository;
