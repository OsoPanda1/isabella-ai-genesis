from __future__ import annotations

from collections.abc import Sequence
from typing import Protocol

import numpy as np


class Detector(Protocol):
    version: str

    def score(self, features: Sequence[float]) -> float:
        ...


class SafeFallbackDetector:
    version = "fallback-v1"

    def score(self, features: Sequence[float]) -> float:
        if not features:
            return 0.0

        values = [
            max(0.0, min(1.0, float(value)))
            for value in features
        ]

        return sum(values) / len(values)


class NumpyDetector:
    def __init__(self, model: object, version: str) -> None:
        self._model = model
        self.version = version

    def score(self, features: Sequence[float]) -> float:
        matrix = np.asarray([list(features)], dtype=float)

        if hasattr(self._model, "predict_proba"):
            return float(self._model.predict_proba(matrix)[0][-1])

        if hasattr(self._model, "decision_function"):
            raw = float(self._model.decision_function(matrix)[0])
            return float(1 / (1 + np.exp(-raw)))

        raise TypeError("Modelo no compatible.")
