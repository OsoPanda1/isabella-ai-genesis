# Data Erasure and Immutable Evidence Retention

Mutable personal and operational data is deleted through the durable erasure procedure. BookPI and audit rows are append-only by design and therefore are not rewritten or deleted; their retention is explicitly counted and bound to an erasure request. This avoids silently breaking the evidence chain.

The erasure procedure is transactional and tenant-locked. It deletes memories, economic events, sessions, API keys and approval grants and records the number of immutable evidence rows retained.

Legal retention requirements must be evaluated per jurisdiction before enabling tenant-wide destruction.
