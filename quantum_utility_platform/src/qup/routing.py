from __future__ import annotations

from .contracts import ExecutionConfig, ExecutionMode


def validate_execution_policy(
    *,
    allow_qpu: bool,
    requested_mode: ExecutionMode,
    circuit_depth: int,
    max_depth: int,
    baseline_available: bool,
) -> None:
    if requested_mode == ExecutionMode.QPU and not allow_qpu:
        raise PermissionError("La ejecución QPU no está autorizada")

    if circuit_depth > max_depth:
        raise ValueError("Circuito fuera del límite de profundidad")

    if not baseline_available:
        raise ValueError(
            "Se requiere una línea base clásica antes de publicar resultados"
        )


def choose_addons(
    *,
    objective: str,
    circuit_depth: int,
    qubit_count: int,
    expects_observables: bool,
    expects_samples: bool,
) -> list[str]:
    selected: list[str] = []

    if circuit_depth > 100:
        selected.append("aqc_tensor")

    if expects_observables and circuit_depth > 50:
        selected.append("operator_backpropagation")

    if expects_observables:
        selected.extend(
            [
                "propagated_noise_absorption",
                "shaded_lightcones",
            ]
        )

    if expects_samples:
        selected.extend(
            [
                "mthree",
                "postselection_bit_flip",
            ]
        )

    if qubit_count > 20 and objective == "hamiltonian_spectrum":
        selected.append("sqd")

    return selected
