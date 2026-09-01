from collections.abc import Callable
from typing import Any


class AddonRegistry:
    def __init__(self) -> None:
        self._factories: dict[str, Callable[..., Any]] = {}

    def register(self, name: str, factory: Callable[..., Any]) -> None:
        self._factories[name] = factory

    def create(self, name: str, **kwargs: Any) -> Any:
        if name not in self._factories:
            raise KeyError(f"Addon no registrado: {name}")
        return self._factories[name](**kwargs)

    def available(self) -> list[str]:
        return sorted(self._factories)
