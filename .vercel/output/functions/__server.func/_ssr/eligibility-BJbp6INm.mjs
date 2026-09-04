//#region node_modules/.nitro/vite/services/ssr/assets/eligibility-BJbp6INm.js
var MINIMUM_WITHDRAWAL_CENTS = 5e3;
/**
* EVALUACIÓN DE ELEGIBILIDAD (src/lib/monetization/eligibility.ts)
* -----------------------------------------------------------------
* Implementación real de las reglas del protocolo de monetización:
*   suscripción activa + identidad verificada + cuenta de retiro
*   validada + perfil completo + formación antifraude + actividad real
*   + sin sanciones/fraude.
*
* El umbral de saldo ($50) se evalúa en tiempo de retiro y se reporta
* como dato, sin bloquear la elegibilidad base del programa.
*/
function evaluateEligibility(input) {
	const reasons = [];
	const passedReasons = input.blockedReasons ?? [];
	if (!input.subscriptionActive) reasons.push("NO_SUBSCRIPTION");
	if (!input.identityVerified) reasons.push("IDENTITY_UNVERIFIED");
	if (!input.paymentAccountVerified) reasons.push("PAYMENT_ACCOUNT_UNVERIFIED");
	if (!input.profileComplete) reasons.push("PROFILE_INCOMPLETE");
	if (!input.trainingCompleted) reasons.push("TRAINING_REQUIRED");
	if (input.sanctioned) reasons.push("SANCTIONED_ACCOUNT");
	if (input.underFraudReview) reasons.push("FRAUD_REVIEW");
	const activityRequirementMet = input.qualifiedUses >= input.minimumQualifiedUses || input.approvedContributions >= input.requiredContributions;
	if (!activityRequirementMet) reasons.push("ACTIVITY_REQUIREMENT_MISSING");
	for (const reason of passedReasons) if (!reasons.includes(reason)) reasons.push(reason);
	const balanceRequirementMet = input.availableBalanceCents >= Math.max(input.withdrawalMinimumCents, MINIMUM_WITHDRAWAL_CENTS);
	const eligible = reasons.length === 0;
	return {
		...input,
		eligible,
		blockedReasons: reasons,
		activityRequirementMet,
		balanceRequirementMet
	};
}
//#endregion
export { evaluateEligibility, MINIMUM_WITHDRAWAL_CENTS as t };
