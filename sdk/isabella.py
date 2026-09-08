"""Minimal Python client for Isabella FGAIS APIs.

The server remains the authority: this SDK never grants permissions locally.
"""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from typing import Any


class IsabellaAPIError(RuntimeError):
    pass


class IsabellaSDK:
    def __init__(self, base_url: str, api_key: str, timeout: float = 10.0) -> None:
        if not (base_url.startswith("https://") or base_url.startswith("http://localhost")):
            raise ValueError("base_url must use HTTPS outside localhost")
        if not api_key:
            raise ValueError("api_key is required")
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout = timeout

    def register_plugin(self, meta: dict[str, Any]) -> None:
        self._request("POST", "/plugins/register", meta)

    def invoke_plugin(self, plugin_id: str, context: dict[str, Any]) -> dict[str, Any]:
        return self._request("POST", "/plugins/invoke", {"pluginId": plugin_id, "context": context})

    def list_plugins(self) -> list[dict[str, Any]]:
        return self._request("GET", "/plugins/catalog")

    def embed(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._request("POST", "/ml/embed", payload)

    def reason(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._request("POST", "/ml/reason", payload)

    def economic_integrity(self) -> dict[str, Any]:
        return self._request("GET", "/economic-integrity")

    def _request(self, method: str, path: str, payload: Any = None) -> Any:
        data = None if payload is None else json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            f"{self.base_url}{path}",
            data=data,
            method=method,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                **({"Content-Type": "application/json"} if data is not None else {}),
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                raw = response.read().decode("utf-8")
                return json.loads(raw) if raw else None
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")[:500]
            raise IsabellaAPIError(f"Isabella API {exc.code}: {detail}") from exc
        except urllib.error.URLError as exc:
            raise IsabellaAPIError(f"Isabella API unavailable: {exc.reason}") from exc
