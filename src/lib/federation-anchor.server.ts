/**
 * Federation Anchor Service — server-only.
 *
 * 7 federaciones, quórum mínimo 4/7, Merkle root por anclaje.
 * Cada federación firma con HMAC-SHA-256 (placeholder de Ed25519/PQC);
 * el servicio emite federations.anchored y federations.consistency_checked.
 */

import { createHash, createHmac, randomUUID } from "node:crypto";
import { config } from "./config";
import { publish } from "./eventbus.server";
import { metrics, recordAudit } from "./atlas-kernel.server";

export const FEDERATIONS = ["F1", "F2", "F3", "F4", "F5", "F6", "F7"] as const;
export type FederationId = (typeof FEDERATIONS)[number];

interface AnchorRecord {
  anchor_id: string;
  document_uid: string;
  merkle_root: string;
  signatures: Array<{
    federation_id: FederationId;
    hash: string;
    signature: string;
    timestamp: string;
  }>;
  quorum: { achieved: number; required: number };
  status: "consistent" | "divergent";
  created_at: string;
}

const ANCHORS: AnchorRecord[] = [];
const MAX_ANCHORS = 200;

function merkleRoot(leaves: string[]): string {
  if (leaves.length === 0) return "0".repeat(64);
  let layer = leaves.map((l) => createHash("sha256").update(l).digest("hex"));
  while (layer.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const a = layer[i];
      const b = layer[i + 1] ?? a;
      next.push(
        createHash("sha256")
          .update(a + b)
          .digest("hex"),
      );
    }
    layer = next;
  }
  return layer[0];
}

export async function anchorDocument(input: {
  document_uid: string;
  hash: string;
}): Promise<AnchorRecord> {
  const ts = new Date().toISOString();
  const signatures: AnchorRecord["signatures"] = [];

  const rawKeys = config().FEDERATION_SIGNING_KEYS_JSON;
  if (!rawKeys)
    throw new Error("FEDERATION_SIGNING_KEYS_JSON is required for federation anchoring");
  let keys: Partial<Record<FederationId, string>>;
  try {
    keys = JSON.parse(rawKeys) as Partial<Record<FederationId, string>>;
  } catch {
    throw new Error("FEDERATION_SIGNING_KEYS_JSON must be valid JSON");
  }
  for (const fed of FEDERATIONS) {
    const key = keys[fed];
    if (!key) throw new Error(`Missing signing key for ${fed}`);
    const sig = createHmac("sha256", key).update(input.hash).digest("hex");
    signatures.push({
      federation_id: fed,
      hash: input.hash,
      signature: `hmac-sha256:${sig}`,
      timestamp: ts,
    });
  }

  const required = 4;
  const root = merkleRoot(signatures.map((s) => s.signature));
  const anchor: AnchorRecord = {
    anchor_id: `ANCH-${randomUUID()}`,
    document_uid: input.document_uid,
    merkle_root: root,
    signatures,
    quorum: { achieved: signatures.length, required },
    status: signatures.length >= required ? "consistent" : "divergent",
    created_at: ts,
  };

  ANCHORS.push(anchor);
  if (ANCHORS.length > MAX_ANCHORS) ANCHORS.splice(0, ANCHORS.length - MAX_ANCHORS);

  metrics.gauge("atlas_federations_active").set(signatures.length);
  metrics.counter("atlas_anchors_total").inc({ status: anchor.status });

  recordAudit({
    actor: "federation-anchor-service",
    action: "anchor.create",
    policy: "consensus.4-of-7",
    payload: { anchor_id: anchor.anchor_id, quorum: anchor.quorum, status: anchor.status },
  });

  await publish({
    type: "federations.anchored",
    payload: {
      anchor_id: anchor.anchor_id,
      document_uid: input.document_uid,
      merkle_root: root,
      federations: signatures,
      quorum: anchor.quorum,
    },
  });

  await publish({
    type: "federations.consistency_checked",
    payload: {
      anchor_id: anchor.anchor_id,
      status: anchor.status,
      mismatches:
        anchor.status === "divergent"
          ? FEDERATIONS.filter((f) => !signatures.some((s) => s.federation_id === f))
          : [],
    },
  });

  return anchor;
}

export function listAnchors(limit = 50): AnchorRecord[] {
  return ANCHORS.slice(-limit).reverse();
}

export function anchorStats() {
  return {
    total: ANCHORS.length,
    consistent: ANCHORS.filter((a) => a.status === "consistent").length,
    divergent: ANCHORS.filter((a) => a.status === "divergent").length,
    last_root: ANCHORS[ANCHORS.length - 1]?.merkle_root ?? null,
  };
}
