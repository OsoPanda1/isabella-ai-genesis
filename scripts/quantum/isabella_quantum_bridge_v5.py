#!/usr/bin/env python3
"""Isabella Villaseñor AI — Quantum Bridge v5.

Production-safe boundary:
- validates the canonical request contract;
- never claims quantum hardware unless an explicit adapter exists;
- provides a deterministic classical fallback for the reference path;
- distinguishes validation failures from recoverable backend failures;
- emits JSON only on stdout and keeps diagnostics on stderr.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import secrets
import sys
import time
from dataclasses import dataclass
from typing import Any

SCHEMA_VERSIONS = {"pennylane-request-v5"}
MAX_WIRES = 32
MAX_SHOTS = 500_000
MAX_VECTOR = 32
MAX_RUNTIME_SECONDS = 25.0
GENESIS = "isabella-quantum-bridge-v5"


class BridgeError(Exception):
    def __init__(self, code: str, message: str, federation: str, retryable: bool = False):
        super().__init__(message)
        self.code = code
        self.message = message
        self.federation = federation
        self.retryable = retryable


def finite_number(value: Any, field: str) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError) as exc:
        raise BridgeError("INVALID_NUMBER", f"{field} debe ser numérico", "POLICY") from exc
    if not math.isfinite(number):
        raise BridgeError("NON_FINITE_NUMBER", f"{field} debe ser finito", "POLICY")
    return number


def finite_vector(value: Any, field: str) -> list[float]:
    if value is None:
        return []
    if not isinstance(value, list):
        raise BridgeError("INVALID_VECTOR", f"{field} debe ser una lista", "POLICY")
    if len(value) > MAX_VECTOR:
        raise BridgeError("VECTOR_LIMIT_EXCEEDED", f"{field} excede {MAX_VECTOR}", "POLICY")
    return [finite_number(item, f"{field}[{i}]") for i, item in enumerate(value)]


def validate_request(raw: dict[str, Any]) -> dict[str, Any]:
    if raw.get("schema") not in SCHEMA_VERSIONS:
        raise BridgeError("UNSUPPORTED_SCHEMA", "Esquema no soportado", "POLICY")
    request_id = raw.get("requestId")
    tenant_id = raw.get("tenantId")
    if not isinstance(request_id, str) or not request_id.strip():
        raise BridgeError("INVALID_REQUEST_ID", "requestId es obligatorio", "POLICY")
    if not isinstance(tenant_id, str) or not tenant_id.strip():
        raise BridgeError("INVALID_TENANT_ID", "tenantId es obligatorio", "ARGUS")
    wires = raw.get("wires")
    if not isinstance(wires, int) or isinstance(wires, bool) or not 1 <= wires <= MAX_WIRES:
        raise BridgeError("INVALID_WIRES", f"wires debe estar entre 1 y {MAX_WIRES}", "POLICY")
    shots = raw.get("shots", 0)
    if not isinstance(shots, int) or isinstance(shots, bool) or not 0 <= shots <= MAX_SHOTS:
        raise BridgeError("INVALID_SHOTS", f"shots debe estar entre 0 y {MAX_SHOTS}", "POLICY")
    features = finite_vector(raw.get("features", []), "features")
    weights = finite_vector(raw.get("weights", []), "weights")
    scopes = raw.get("scopes")
    if not isinstance(scopes, list) or "quantum:execute" not in scopes:
        raise BridgeError("SCOPE_DENIED", "Falta quantum:execute", "ARGUS")
    nonce = raw.get("nonce")
    timestamp = raw.get("timestamp")
    if not isinstance(nonce, str) or len(nonce) < 16:
        raise BridgeError("INVALID_NONCE", "nonce insuficiente", "ARGUS")
    if not isinstance(timestamp, str) or not timestamp.strip():
        raise BridgeError("INVALID_TIMESTAMP", "timestamp obligatorio", "ARGUS")
    return {**raw, "features": features, "weights": weights}


def request_hash(request: dict[str, Any]) -> str:
    canonical = json.dumps(request, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha3_512(canonical.encode("utf-8")).hexdigest()


def classical_reference(request: dict[str, Any]) -> float:
    """Small deterministic reference, not a quantum measurement."""
    values = request["features"] or request["weights"] or [0.0]
    mean = sum(values) / len(values)
    return math.tanh(mean)


def execute(request: dict[str, Any]) -> dict[str, Any]:
    started = time.perf_counter()
    req_hash = request_hash(request)
    expectation = classical_reference(request)
    runtime_ms = (time.perf_counter() - started) * 1000.0
    return {
        "schema": "pennylane-response-v5",
        "status": "degraded",
        "implementation": "CLASSICAL_FALLBACK",
        "requestId": request["requestId"],
        "tenantId": request["tenantId"],
        "provider": request.get("provider", "reference-classical"),
        "expectation": expectation,
        "determinedEpistemicState": "E1",
        "requestHash": f"sha3-512:{req_hash}",
        "governanceCost": {"estimatedComputeUnits": 0.0, "estimatedCostUSD": 0.0},
        "fallback": {
            "reason": "NO_AUTHORIZED_QUANTUM_BACKEND",
            "confidenceAdjustment": -0.15,
            "requiresReview": True,
        },
        "telemetry": {"totalRuntimeMs": round(runtime_ms, 3), "spans": []},
        "provenance": {
            "bridgeVersion": "quantum-bridge-v5.1",
            "policyVersion": request.get("policyVersion", "unspecified"),
        },
    }


def process(raw: dict[str, Any]) -> dict[str, Any]:
    try:
        request = validate_request(raw)
        return execute(request)
    except BridgeError as exc:
        return {
            "schema": "pennylane-response-v5",
            "status": "error",
            "implementation": "NONE",
            "requestId": raw.get("requestId", "unknown"),
            "error": {
                "code": exc.code,
                "message": exc.message,
                "federation": exc.federation,
                "retryable": exc.retryable,
            },
        }
    except Exception as exc:
        return {
            "schema": "pennylane-response-v5",
            "status": "error",
            "implementation": "NONE",
            "requestId": raw.get("requestId", "unknown"),
            "error": {
                "code": "INTERNAL_BRIDGE_ERROR",
                "message": str(exc),
                "federation": "RESILIENCE",
                "retryable": False,
            },
        }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--stdio", action="store_true")
    args = parser.parse_args()
    if not args.stdio:
        parser.error("--stdio es obligatorio")
    raw = json.load(sys.stdin)
    if not isinstance(raw, dict):
        raise SystemExit("El payload raíz debe ser un objeto JSON")
    print(json.dumps(process(raw), separators=(",", ":"), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
