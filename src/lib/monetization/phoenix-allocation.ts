export interface PhoenixAllocation { netProfitCents: number; phoenixFundCents: number; infrastructureCents: number; creatorPartnersCents: number; }

export function calculatePhoenixAllocation(netProfitCents: number): PhoenixAllocation {
  if (!Number.isInteger(netProfitCents) || netProfitCents < 0) throw new Error("netProfitCents must be a non-negative integer");
  const phoenixFundCents = Math.floor(netProfitCents * 0.20);
  const infrastructureCents = Math.floor(netProfitCents * 0.30);
  const creatorPartnersCents = netProfitCents - phoenixFundCents - infrastructureCents;
  return { netProfitCents, phoenixFundCents, infrastructureCents, creatorPartnersCents };
}
