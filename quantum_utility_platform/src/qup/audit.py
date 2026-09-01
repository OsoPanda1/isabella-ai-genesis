from __future__ import annotations

import hashlib
import json
import uuid
from datetime import datetime, timezone
from typing import Any


class AuditLogger:
    def __init__(self) -> None:
        self.events: list[dict[str, Any]] = []
        self.previous_hash = "GENESIS"

    def start(self, workflow: str) -> str:
        audit_id = f"aud_{uuid.uuid4().hex}"
        self._append(
            {
                "event": "workflow_started",
                "audit_id": audit_id,
                "workflow": workflow,
            }
        )
        return audit_id

    def success(self, audit_id: str, metadata: dict[str, Any]) -> None:
        self._append(
            {
                "event": "workflow_completed",
                "audit_id": audit_id,
                "metadata": metadata,
            }
        )

    def failure(self, audit_id: str, error: Exception) -> None:
        self._append(
            {
                "event": "workflow_failed",
                "audit_id": audit_id,
                "error_type": type(error).__name__,
                "error": str(error),
            }
        )

    def _append(self, event: dict[str, Any]) -> None:
        payload = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "previous_hash": self.previous_hash,
            **event,
        }

        encoded = json.dumps(
            payload,
            sort_keys=True,
            separators=(",", ":"),
        ).encode()

        event_hash = hashlib.sha256(encoded).hexdigest()
        payload["event_hash"] = event_hash
        self.previous_hash = event_hash
        self.events.append(payload)
