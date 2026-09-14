import { createHash } from "node:crypto";

export type AionBehaviorStatus = "LEARNING" | "NORMAL" | "SUSPICIOUS" | "CRITICAL";

export interface ArgusBehaviorSample {
  sequence: number;
  capturedAt: string;
  latencyMs: number;
  riskScore: number;
  vetoRate: number;
  policyVersion: string;
  decisionDigest: string;
}

export interface AionBehaviorAssessment {
  status: AionBehaviorStatus;
  anomalyScore: number;
  latencyDeviation: number;
  riskDeviation: number;
  vetoDeviation: number;
  policyChanged: boolean;
  sampleCount: number;
  assessmentDigest: string;
}

export interface AionBehaviorConfig {
  baselineWindow?: number;
  minimumSamples?: number;
  suspiciousThreshold?: number;
  criticalThreshold?: number;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));

function digest(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2;
}

function robustDeviation(value: number, values: readonly number[]): number {
  const center = median(values);
  const absoluteDeviations = values.map((item) => Math.abs(item - center));
  const mad = median(absoluteDeviations);
  const scale = Math.max(Math.abs(center) * 0.05, mad * 1.4826, 1e-6);
  return clamp(Math.abs(value - center) / (scale * 6));
}

/**
 * Dependency-free behavioral sentinel. It learns a bounded robust baseline from
 * recent valid ARGUS observations and detects distribution shifts without an
 * LLM, network call, or unbounded history.
 */
export class ArgusAionBehaviorSentinel {
  private readonly samples: ArgusBehaviorSample[] = [];
  private readonly baselineWindow: number;
  private readonly minimumSamples: number;
  private readonly suspiciousThreshold: number;
  private readonly criticalThreshold: number;
  private lastSequence = 0;

  constructor(config: AionBehaviorConfig = {}) {
    this.baselineWindow = Math.max(8, Math.min(512, config.baselineWindow ?? 64));
    this.minimumSamples = Math.max(4, Math.min(this.baselineWindow, config.minimumSamples ?? 12));
    this.suspiciousThreshold = clamp(config.suspiciousThreshold ?? 0.55);
    this.criticalThreshold = clamp(config.criticalThreshold ?? 0.82);
    if (this.criticalThreshold <= this.suspiciousThreshold) throw new Error("aion_invalid_thresholds");
  }

  observe(sample: ArgusBehaviorSample): AionBehaviorAssessment {
    if (!Number.isInteger(sample.sequence) || sample.sequence <= this.lastSequence)
      throw new Error("aion_behavior_invalid_sequence");
    if (!Number.isFinite(sample.latencyMs) || sample.latencyMs < 0 || sample.latencyMs > 60_000)
      throw new Error("aion_behavior_invalid_latency");
    for (const value of [sample.riskScore, sample.vetoRate]) {
      if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error("aion_behavior_invalid_score");
    }
    if (!sample.policyVersion || !/^[a-f0-9]{64}$/u.test(sample.decisionDigest))
      throw new Error("aion_behavior_invalid_integrity");

    const baseline = this.samples.slice(-this.baselineWindow);
    this.lastSequence = sample.sequence;

    const assessment = baseline.length < this.minimumSamples
      ? this.learningAssessment(sample)
      : this.assessAgainstBaseline(sample, baseline);

    this.samples.push({ ...sample });
    while (this.samples.length > this.baselineWindow) this.samples.shift();
    return assessment;
  }

  private learningAssessment(sample: ArgusBehaviorSample): AionBehaviorAssessment {
    const assessmentCore = {
      status: "LEARNING" as const,
      anomalyScore: 0,
      latencyDeviation: 0,
      riskDeviation: 0,
      vetoDeviation: 0,
      policyChanged: false,
      sampleCount: this.samples.length + 1,
      sequence: sample.sequence,
    };
    return { ...assessmentCore, assessmentDigest: digest(assessmentCore) };
  }

  private assessAgainstBaseline(sample: ArgusBehaviorSample, baseline: readonly ArgusBehaviorSample[]): AionBehaviorAssessment {
    const latencyDeviation = robustDeviation(sample.latencyMs, baseline.map((item) => item.latencyMs));
    const riskDeviation = robustDeviation(sample.riskScore, baseline.map((item) => item.riskScore));
    const vetoDeviation = robustDeviation(sample.vetoRate, baseline.map((item) => item.vetoRate));
    const dominantPolicy = baseline.reduce((counts, item) => {
      counts.set(item.policyVersion, (counts.get(item.policyVersion) ?? 0) + 1);
      return counts;
    }, new Map<string, number>());
    const expectedPolicy = [...dominantPolicy.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? sample.policyVersion;
    const policyChanged = sample.policyVersion !== expectedPolicy;
    const anomalyScore = clamp(
      0.34 * latencyDeviation +
      0.31 * riskDeviation +
      0.25 * vetoDeviation +
      (policyChanged ? 0.1 : 0),
    );
    const status: AionBehaviorStatus = anomalyScore >= this.criticalThreshold
      ? "CRITICAL"
      : anomalyScore >= this.suspiciousThreshold
        ? "SUSPICIOUS"
        : "NORMAL";
    const assessmentCore = {
      status,
      anomalyScore,
      latencyDeviation,
      riskDeviation,
      vetoDeviation,
      policyChanged,
      sampleCount: baseline.length + 1,
      sequence: sample.sequence,
    };
    return { ...assessmentCore, assessmentDigest: digest(assessmentCore) };
  }
}
