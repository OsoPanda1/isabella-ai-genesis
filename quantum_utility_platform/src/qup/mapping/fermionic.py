from qiskit import QuantumCircuit


class FermionicMapper:
    def map_fermions(self, circuit: QuantumCircuit) -> QuantumCircuit:
        return circuit.copy()
