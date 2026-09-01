from qiskit import QuantumCircuit


class OptimizationMapper:
    def map_layout(self, circuit: QuantumCircuit) -> QuantumCircuit:
        return circuit.copy()
