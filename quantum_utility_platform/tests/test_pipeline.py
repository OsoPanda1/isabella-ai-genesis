from qiskit import QuantumCircuit
from qup.adapters import register_default_addons
from qup.audit import AuditLogger
from qup.contracts import (
    ExecutionConfig,
    OptimizationConfig,
    PostprocessConfig,
    QuantumProblem,
)
from qup.pipeline import QuantumPipeline
from qup.registry import AddonRegistry


def test_pipeline_simulation():
    circuit = QuantumCircuit(2, 2)
    circuit.h(0)
    circuit.cx(0, 1)
    circuit.measure([0, 1], [0, 1])

    problem = QuantumProblem(
        name="test_bell",
        circuits=[circuit],
        metadata={"domain": "benchmark"},
    )

    registry = AddonRegistry()
    register_default_addons(registry)

    pipeline = QuantumPipeline(
        registry=registry,
        audit=AuditLogger(),
    )

    result = pipeline.run(
        problem=problem,
        optimization=OptimizationConfig(
            optimization_level=1,
            addons=["aqc_tensor"],
        ),
        execution=ExecutionConfig(
            shots=10,
        ),
        postprocess=PostprocessConfig(
            addons=["mthree"],
        ),
    )

    assert result.audit_id.startswith("aud_")
    assert "backend" in result.metadata
