export interface PhoenixAllocation {
  netProfit: number;
  phoenixFund: number;
  infrastructure: number;
  creatorAndPartners: number;
  retainedUnallocated: number;
}

/**
 * Proposed 20/30/50 allocation over verified net profit.
 * This is an accounting policy, not a promise of profitability or liquidity.
 */
export function calculatePhoenixAllocation(netProfit: number): PhoenixAllocation {
  if (!Number.isFinite(netProfit) || netProfit < 0) throw new Error("netProfit debe ser un número finito no negativo");
  const phoenixFund = netProfit * 0.20;
  const infrastructure = netProfit * 0.30;
  const creatorAndPartners = netProfit * 0.50;
  return { netProfit, phoenixFund, infrastructure, creatorAndPartners, retainedUnallocated: 0 };
}
