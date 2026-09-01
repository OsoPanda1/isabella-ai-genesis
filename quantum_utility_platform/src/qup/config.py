from pydantic import BaseModel, Field


class Settings(BaseModel):
    project_name: str = "quantum-utility-platform"
    environment: str = "development"
    default_shots: int = Field(default=1024, ge=1, le=1_000_000)
    max_circuit_depth: int = Field(default=500, ge=1)
    allow_qpu: bool = False
    require_baseline: bool = True
    require_audit: bool = True
    fallback_to_simulator: bool = True
    fallback_to_classical: bool = True
    max_cost_units: float = 100.0
