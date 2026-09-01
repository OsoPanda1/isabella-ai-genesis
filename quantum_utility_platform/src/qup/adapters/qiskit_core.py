from qiskit import QuantumCircuit


class QiskitCoreAdapter:
    def transpile(self, circuit: QuantumCircuit, backend: Any) -> Any:
        from qiskit import transpile
        return transpile(circuit, backend)
