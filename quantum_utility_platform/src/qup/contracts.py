from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum
from typing import Any, Protocol

from qiskit import QuantumCircuit
from qiskit.quantum_info import SparsePauliOp


class ExecutionMode(StrEnum):
    SIMULATOR = "simulator"
    QPU = "qpu"


class WorkflowStage(StrEnum):
    MAP = "map"
    OPTIMIZE = "optimize"
    EXECUTE = "execute"
    POSTPROCESS = "postprocess"


@dataclass
class QuantumProblem:
    name: str
    circuits: list[QuantumCircuit] = field(default_factory=list)
    observables: list[SparsePauliOp] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class OptimizationConfig:
    optimization_level: int = 3
    backend_name: str | None = None
    addons: list[str] = field(default_factory=list)
    max_depth: int | None = None
    seed_transpiler: int = 42


@dataclass
class ExecutionConfig:
    mode: ExecutionMode = ExecutionMode.SIMULATOR
    backend_name: str = "aer_simulator"
    shots: int = 1024
    session: bool = False
    resilience_level: int = 0
    max_latency_ms: int = 30_000


@dataclass
class PostprocessConfig:
    addons: list[str] = field(default_factory=list)
    postselect: bool = False
    mitigation: bool = False


@dataclass
class WorkflowResult:
    values: Any
    circuits: list[QuantumCircuit]
    metadata: dict[str, Any]
    audit_id: str


class Addon(Protocol):
    name: str

    def apply(
        self,
        circuits: list[QuantumCircuit],
        metadata: dict[str, Any],
    ) -> tuple[list[QuantumCircuit], dict[str, Any]]:
        ...
