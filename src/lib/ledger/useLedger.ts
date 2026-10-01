import { useState, useEffect, useCallback } from "react";
import type { LedgerSnapshot, LedgerBlock, DataOrigin } from "./contracts";
import { authFetch } from "../auth-client";

const FALLBACK_BLOCKS: LedgerBlock[] = [
  {
    seq: 1,
    operation: "SYSTEM_BOOT",
    signerId: "KMS-SOVEREIGN-NODO-CERO",
    timestamp: "2026-09-30 08:00:00",
    previousHash: "GENESIS",
    currentHash: "a7f3b89012cd4e5f67a89b01c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1",
    payload: {
      constitutionVersion: "4.3.3",
      territory: "Real del Monte, Hidalgo",
      jurisdiction: "FGAIS Sovereign Era",
    },
  },
  {
    seq: 2,
    operation: "MODEL_INVOCATION",
    signerId: "CROWN-GATEWAY-AUTH",
    timestamp: "2026-09-30 08:15:22",
    previousHash: "a7f3b89012cd4e5f67a89b01c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1",
    currentHash: "b8c4d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8",
    payload: {
      model: "isabella-sovereign-v4.3.3",
      route: "GROUNDED_RESPONSE",
      epistemicRating: "E1_VERIFIED",
    },
  },
  {
    seq: 3,
    operation: "REVENUE_SPLIT_SETTLE",
    signerId: "BOOKPI-SETTLEMENT-HSM",
    timestamp: "2026-09-30 08:30:10",
    previousHash: "b8c4d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8",
    currentHash: "c9d5e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0",
    payload: {
      splitRule: "creator_first_80_20",
      assetId: "art-prompt-genesis-01",
      settledAmountCents: 2500,
    },
  },
  {
    seq: 4,
    operation: "DATA_RIGHTS_EXPORT",
    signerId: "ARGUS-AUDIT-SENTINEL",
    timestamp: "2026-09-30 08:45:00",
    previousHash: "c9d5e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0",
    currentHash: "d0e6f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1",
    payload: {
      purpose: "ARCO_DATA_AUDIT",
      status: "COMPLIANT_HASH_VERIFIED",
    },
  },
];

export function useLedger() {
  const [snapshot, setSnapshot] = useState<LedgerSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLedger = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/v1/isabella/ledger");
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.blocks)) {
          setSnapshot({
            blocks: data.blocks,
            origin: "live",
            totalBlocks: data.blocks.length,
          });
          return;
        }
      }
      // Fallback to demo snapshot
      setSnapshot({
        blocks: FALLBACK_BLOCKS,
        origin: "demo",
        totalBlocks: FALLBACK_BLOCKS.length,
      });
    } catch {
      setSnapshot({
        blocks: FALLBACK_BLOCKS,
        origin: "demo",
        totalBlocks: FALLBACK_BLOCKS.length,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  return {
    snapshot,
    loading,
    error,
    refresh: fetchLedger,
  };
}
