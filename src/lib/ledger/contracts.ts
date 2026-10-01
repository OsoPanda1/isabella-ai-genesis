export type DataOrigin = "live" | "demo" | "cached" | "unavailable";

export interface LedgerBlock {
  seq: number;
  operation: string;
  signerId: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
  payload: Record<string, unknown>;
}

export interface LedgerSnapshot {
  blocks: LedgerBlock[];
  origin: DataOrigin;
  headHash?: string;
  totalBlocks?: number;
}

export interface IntegrityResult {
  valid: boolean;
  checkedCount: number;
  errorSeq?: number | null;
  reason?: string;
  verifiedAt: string;
}
