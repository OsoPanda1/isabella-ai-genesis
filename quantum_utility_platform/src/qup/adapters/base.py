from typing import Any, Protocol


class Adapter(Protocol):
    def initialize(self) -> None:
        ...
