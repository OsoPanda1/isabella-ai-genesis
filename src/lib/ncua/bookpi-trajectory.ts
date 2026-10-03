/**
 * BookPI Trajectory Ledger (src/lib/ncua/bookpi-trajectory.ts)
 * -------------------------------------------------------------
 * Append-only academic trajectory ledger sealed with HMAC-SHA3-512.
 */
import { createAuditSeal, AuditSeal } from "../sovereign-audit";

export interface TrajectoryEntry {
  trajectoryId: string;
  conceptId: string;
  epistemicLevel: string;
  eriScore: number;
  timestamp: string;
  seal: AuditSeal;
}

const trajectoryEntries: TrajectoryEntry[] = [];

export function recordTrajectory(input: {
  conceptId: string;
  epistemicLevel: string;
  eriScore: number;
}): TrajectoryEntry {
  const trajectoryId = `traj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  const seal = createAuditSeal({
    trajectoryId,
    conceptId: input.conceptId,
    epistemicLevel: input.epistemicLevel,
    eriScore: input.eriScore,
    timestamp,
  });

  const entry: TrajectoryEntry = {
    trajectoryId,
    conceptId: input.conceptId,
    epistemicLevel: input.epistemicLevel,
    eriScore: input.eriScore,
    timestamp,
    seal,
  };

  trajectoryEntries.push(entry);
  return entry;
}

export function listTrajectories(): readonly TrajectoryEntry[] {
  return [...trajectoryEntries];
}

export default { recordTrajectory, listTrajectories };
