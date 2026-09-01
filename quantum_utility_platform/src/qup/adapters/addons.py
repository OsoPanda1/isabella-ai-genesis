from __future__ import annotations

import importlib.util
from typing import Any

from qiskit import QuantumCircuit


class OptionalAddon:
    def __init__(self, name: str) -> None:
        self.name = name

    def available(self, package: str) -> bool:
        return importlib.util.find_spec(package) is not None

    def apply(
        self,
        circuits: list[QuantumCircuit],
        metadata: dict[str, Any],
    ) -> tuple[list[QuantumCircuit], dict[str, Any]]:
        metadata.setdefault("addons", []).append(
            {
                "name": self.name,
                "status": "adapter_registered",
            }
        )
        return circuits, metadata

    def postprocess(
        self,
        values: Any,
        metadata: dict[str, Any],
    ) -> tuple[Any, dict[str, Any]]:
        metadata.setdefault("postprocess_addons", []).append(
            {
                "name": self.name,
                "status": "postprocess_registered",
            }
        )
        return values, metadata
