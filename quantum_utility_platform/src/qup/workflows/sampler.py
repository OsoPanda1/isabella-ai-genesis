from qiskit import QuantumCircuit

from ..contracts import QuantumProblem


def build_sampler_problem(
    circuit: QuantumCircuit,
) -> QuantumProblem:
    measured = circuit.copy()

    if measured.num_clbits == 0:
        measured.measure_all()

    return QuantumProblem(
        name="sampler_workflow",
        circuits=[measured],
        metadata={
            "primitive": "sampler",
            "measurement": "bitstrings",
        },
    )
