from __future__ import annotations

import time
from typing import Any, Callable

from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

from .audit import AuditLogger
from .contracts import (
    ExecutionConfig,
    OptimizationConfig,
    PostprocessConfig,
    QuantumProblem,
    WorkflowResult,
)
from .registry import AddonRegistry


class QuantumPipeline:
    def __init__(
        self,
        registry: AddonRegistry,
        audit: AuditLogger,
        classical_fallback: Callable[[QuantumProblem], Any] | None = None,
    ) -> None:
        self.registry = registry
        self.audit = audit
        self.classical_fallback = classical_fallback

    def run(
        self,
        problem: QuantumProblem,
        optimization: OptimizationConfig,
        execution: ExecutionConfig,
        postprocess: PostprocessConfig,
    ) -> WorkflowResult:
        audit_id = self.audit.start(problem.name)
        started = time.perf_counter()

        try:
            circuits = list(problem.circuits)
            metadata = dict(problem.metadata)

            circuits, metadata = self._apply_addons(
                circuits,
                metadata,
                optimization.addons,
            )

            backend = self._resolve_backend(execution)
            isa_circuits = transpile(
                circuits,
                backend=backend,
                optimization_level=optimization.optimization_level,
                seed_transpiler=optimization.seed_transpiler,
            )

            self._validate_circuits(isa_circuits, optimization)

            raw_result = backend.run(
                isa_circuits,
                shots=execution.shots,
            ).result()

            values = raw_result.get_counts()

            values, metadata = self._postprocess(
                values,
                metadata,
                postprocess,
            )

            elapsed_ms = (time.perf_counter() - started) * 1000

            metadata.update(
                {
                    "backend": backend.name,
                    "shots": execution.shots,
                    "latency_ms": elapsed_ms,
                    "circuit_depths": [
                        circuit.depth() for circuit in isa_circuits
                    ],
                    "circuit_sizes": [
                        circuit.size() for circuit in isa_circuits
                    ],
                }
            )

            self.audit.success(audit_id, metadata)

            return WorkflowResult(
                values=values,
                circuits=isa_circuits,
                metadata=metadata,
                audit_id=audit_id,
            )

        except Exception as exc:
            self.audit.failure(audit_id, exc)

            if self.classical_fallback is not None:
                fallback = self.classical_fallback(problem)
                return WorkflowResult(
                    values=fallback,
                    circuits=[],
                    metadata={
                        "fallback_used": True,
                        "fallback_reason": type(exc).__name__,
                    },
                    audit_id=audit_id,
                )

            raise

    def _resolve_backend(self, config: ExecutionConfig) -> Any:
        if config.backend_name == "aer_simulator":
            return AerSimulator()
        return AerSimulator()

    def _apply_addons(
        self,
        circuits: list[QuantumCircuit],
        metadata: dict[str, Any],
        names: list[str],
    ) -> tuple[list[QuantumCircuit], dict[str, Any]]:
        for name in names:
            addon = self.registry.create(name)
            circuits, metadata = addon.apply(circuits, metadata)
        return circuits, metadata

    def _postprocess(
        self,
        values: Any,
        metadata: dict[str, Any],
        config: PostprocessConfig,
    ) -> tuple[Any, dict[str, Any]]:
        for name in config.addons:
            addon = self.registry.create(name)
            values, metadata = addon.postprocess(values, metadata)
        return values, metadata

    def _validate_circuits(
        self,
        circuits: list[QuantumCircuit],
        config: OptimizationConfig,
    ) -> None:
        if config.max_depth is None:
            return

        for circuit in circuits:
            if circuit.depth() > config.max_depth:
                raise ValueError(
                    f"Circuit depth {circuit.depth()} excede "
                    f"el máximo {config.max_depth}"
                )
