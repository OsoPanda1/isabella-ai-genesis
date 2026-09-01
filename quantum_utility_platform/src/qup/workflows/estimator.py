from qiskit import QuantumCircuit
from qiskit.quantum_info import SparsePauliOp

from ..contracts import QuantumProblem


def build_estimator_problem(
    circuit: QuantumCircuit,
    observable: str = "Z",
) -> QuantumProblem:
    return QuantumProblem(
        name="estimator_workflow",
        circuits=[circuit],
        observables=[
            SparsePauliOp.from_list(
                [(observable, 1.0)]
            )
        ],
        metadata={
            "primitive": "estimator",
            "observable": observable,
        },
    )
