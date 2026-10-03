/**
 * IGDS Genesis Document Seal Route (src/server-routes/api/igds.ts)
 * -------------------------------------------------------------
 * Native document sealing endpoint implementing:
 * - JCS RFC 8785 canonicalization
 * - Ed25519 digital signature
 * - Merkle inclusion RFC 6962
 * - RFC 3161 Time-Stamp Authority verification
 */
import type { Request, Response } from "express";
import { canonicalize } from "../../lib/igds/canonical";
import { computeMerkleRoot } from "../../lib/igds/merkle";
import { signGenesisSeal } from "../../lib/igds/seal";
import { verifyGenesisSeal } from "../../lib/igds/verify";
import { igdsGenesisRepository } from "../../lib/repositories/igds-genesis-repository";

export async function handleIgdsSeal(req: Request, res: Response): Promise<void> {
  const { document, metadata } = req.body || {};
  if (!document) {
    res.status(400).json({ error: "Missing required document object" });
    return;
  }

  try {
    const seal = await signGenesisSeal(document, metadata);
    await igdsGenesisRepository.saveSeal(seal);

    res.status(200).json({
      success: true,
      seal,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      error: "SEAL_GENERATION_FAILED",
      details: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function handleIgdsVerify(req: Request, res: Response): Promise<void> {
  const { seal, document } = req.body || {};
  if (!seal || !document) {
    res.status(400).json({ error: "Missing seal or document in verify request" });
    return;
  }

  try {
    const verification = await verifyGenesisSeal(seal, document);
    res.status(200).json(verification);
  } catch (err) {
    res.status(500).json({
      valid: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export default { handleIgdsSeal, handleIgdsVerify };
