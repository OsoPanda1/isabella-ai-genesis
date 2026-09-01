from __future__ import annotations

from fastapi import FastAPI, HTTPException

from latam_aegis.audit import AuditLedger
from latam_aegis.config import Settings
from latam_aegis.domain import DetectionResult, SecurityEvent
from latam_aegis.ml import SafeFallbackDetector
from latam_aegis.pipeline import SecurityPipeline
from latam_aegis.wall import AdaptiveWall


def create_app() -> FastAPI:
    settings = Settings()

    pipeline = SecurityPipeline(
        settings=settings,
        model=SafeFallbackDetector(),
        wall=AdaptiveWall(),
        ledger=AuditLedger(
            settings.audit_secret.get_secret_value()
        ),
    )

    app = FastAPI(
        title="LATAM AEGIS-X",
        version="0.1.0",
    )

    @app.get("/health")
    def health() -> dict[str, object]:
        return {
            "status": "ok",
            "environment": settings.environment,
            "quantum_enabled": settings.allow_quantum,
            "qesem_enabled": settings.allow_qesem,
        }

    @app.post(
        "/v1/security/events",
        response_model=DetectionResult,
    )
    def ingest(
        event: SecurityEvent,
    ) -> DetectionResult:
        try:
            return pipeline.process(event)
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail="No fue posible procesar el evento.",
            ) from exc

    return app
