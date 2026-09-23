# 04 — ISABELLA ECONOMÍA Y BOOKPI

> **Unifica:** `adr-002-bookpi-ledger`, `adr-004-bookpi-integrity`, `adr-004-economic-events`, `adr-006-webhook-idempotency`, `adr-007-refund-immutability`, `MIGRATION_POLICY`, `CATTLEYA` docs (`BLUEPRINT_TECNICO`, `MANIFIESTO_LEGAL`, `MARCO_JURIDICO`, `PRESENTACION`), `catalogo-apis`, `mapa-dominios`, `reconciliation-protocol`

**Flujo:** `idempotency-key → BEGIN → lock → debit → credit → BookPI WORM SHA3-512 + ECDSA P-384 → COMMIT` / `ROLLBACK` (Cattleya inactiva tarjeta si BookPI falla)

**Planes:** `visitor 5/50` · `citizen 15/200` · `merchant 35/600` · `enterprise` — `fail-closed` `503` sin `STRIPE_SECRET_KEY`

**Cattleya:** `70/20/5/5` + `reputation ≥900` — `supabase/migrations/20260922000000_cattleya_virtual_cards.sql` (RLS, PCI DSS, `stripe_card_id/last4` sin PAN)

**BookPI:** `hashBlock()` `SHA3-512` + `canonicalBookPiPayload` + `sequence_number` único + `refund` compensatorio — `src/lib/repositories/bookpi-postgres-repository.ts:18`

**Stripe:** `checkout.session.completed` → `claimWebhookEvent` (UNIQUE provider/event) → `recordEconomicEvent` → `BookPI` → `Cattleya` — `x402` `HTTP 402` `5min TTL` `USDC`

**Falta para 100%:** `Stripe event real` + `webhook autenticado` + `doble entrega` + `refund concurrente` + `reconciliación` con `Neon` vivo
