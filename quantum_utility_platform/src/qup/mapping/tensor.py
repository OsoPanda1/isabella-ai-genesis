from qiskit import QuantumCircuit


class TensorNetworkMapper:
    def map_tensor(self, circuit: QuantumCircuit) -> QuantumCircuit:
        return circuit.copy()
