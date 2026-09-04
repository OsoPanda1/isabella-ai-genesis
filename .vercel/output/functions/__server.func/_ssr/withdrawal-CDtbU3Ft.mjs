import { t as MINIMUM_WITHDRAWAL_CENTS } from "./eligibility-BJbp6INm.mjs";
import { randomUUID } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/withdrawal-CDtbU3Ft.js
var WithdrawalService = class {
	deps;
	constructor(deps) {
		this.deps = deps;
	}
	async request(userId, opts) {
		const idempotencyKey = opts?.idempotencyKey ?? randomUUID();
		if (await this.deps.isIdempotent(idempotencyKey)) return {
			ok: false,
			code: "IDEMPOTENCY_REPLAY"
		};
		await this.deps.markIdempotent(idempotencyKey);
		const eligibility = await this.deps.getEligibility(userId);
		if (!eligibility.eligible) return {
			ok: false,
			code: "MONETIZATION_NOT_ELIGIBLE",
			reasons: eligibility.blockedReasons
		};
		if (eligibility.availableBalanceCents < 5e3) return {
			ok: false,
			code: "MINIMUM_WITHDRAWAL_NOT_REACHED",
			minimumCents: MINIMUM_WITHDRAWAL_CENTS,
			availableCents: eligibility.availableBalanceCents
		};
		const review = await this.deps.runRiskReview(userId);
		await this.deps.appendBookPI({
			type: review.status === "hold" ? "withdrawal.held" : "withdrawal.review.passed",
			userId,
			riskScore: review.score,
			idempotencyKey
		});
		if (review.status === "hold") return {
			ok: false,
			code: "WITHDRAWAL_UNDER_REVIEW",
			reviewId: review.reviewId
		};
		const payout = await this.deps.createPayout({
			userId,
			amountCents: eligibility.availableBalanceCents,
			idempotencyKey
		});
		await this.deps.appendBookPI({
			type: "withdrawal.requested",
			userId,
			payoutId: payout.payoutId,
			amountCents: eligibility.availableBalanceCents,
			idempotencyKey
		});
		return {
			ok: true,
			payoutId: payout.payoutId,
			status: payout.status
		};
	}
};
//#endregion
export { WithdrawalService };
