from typing import Any


class QiskitRuntimeAdapter:
    def __init__(self, token: str | None = None) -> None:
        self.token = token

    def get_service(self) -> Any:
        try:
            from qiskit_ibm_runtime import QiskitRuntimeService
            return QiskitIBMService()
        except ImportError:
            return None


class QiskitIBMService:
    pass
