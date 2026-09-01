from __future__ import annotations

import numpy as np
from qiskit import QuantumCircuit


def feature_map(features: list[float]) -> QuantumCircuit:
    n = len(features)
    circuit = QuantumCircuit(n, n)

    for index, value in enumerate(features):
        circuit.h(index)
        circuit.rz(float(value), index)

    for index in range(n - 1):
        circuit.cx(index, index + 1)

    return circuit


def build_qml_circuit(
    features: list[float],
    weights: np.ndarray,
) -> QuantumCircuit:
    circuit = feature_map(features)

    for qubit, weight in enumerate(weights):
        circuit.ry(float(weight), qubit)

    circuit.measure(range(circuit.num_qubits), range(circuit.num_clbits))
    return circuit
