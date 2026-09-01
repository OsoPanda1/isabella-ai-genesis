class QuantumSampler:
    def sample_states(self, counts: dict[str, int]) -> dict[str, float]:
        total = sum(counts.values()) or 1
        return {k: v / total for k, v in counts.items()}
