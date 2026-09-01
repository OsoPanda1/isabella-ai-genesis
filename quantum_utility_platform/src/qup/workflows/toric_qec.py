from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ToricConfig:
    lattice_size: int
    syndrome_rounds: int = 3
    decoder: str = "mwpm"

    @property
    def physical_qubits(self) -> int:
        return 2 * self.lattice_size**2

    @property
    def logical_qubits(self) -> int:
        return 2

    @property
    def distance(self) -> int:
        return self.lattice_size


def torus_distance(
    a: tuple[int, int],
    b: tuple[int, int],
    size: int,
) -> int:
    dx = min(abs(a[0] - b[0]), size - abs(a[0] - b[0]))
    dy = min(abs(a[1] - b[1]), size - abs(a[1] - b[1]))
    return dx + dy


def validate_toric_config(config: ToricConfig) -> None:
    if config.lattice_size < 2:
        raise ValueError("La retícula toric requiere L >= 2")

    if config.decoder not in {"mwpm", "union_find"}:
        raise ValueError("Decodificador toric no soportado")
