/**
 * Subscription Store (src/lib/persistence/subscription-store.ts)
 */
import { IsabellaPlanId } from "../subscription.server";

export interface UserSubscription {
  userId: string;
  planId: IsabellaPlanId;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: "active" | "canceled" | "past_due";
  updatedAt: string;
}

const subscriptionMap = new Map<string, UserSubscription>();

export const subscriptionStore = {
  getSubscription(userId: string): UserSubscription | null {
    return subscriptionMap.get(userId) || null;
  },
  setSubscription(userId: string, subscription: UserSubscription): void {
    subscriptionMap.set(userId, { ...subscription, updatedAt: new Date().toISOString() });
  },
};

export default subscriptionStore;
