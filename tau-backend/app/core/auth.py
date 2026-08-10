"""
Cognito authentication seam.

v1: shared API key via COGNITO_API_KEY.
  Accepts the same credentials Cognito REST uses:
    - X-API-Key: <key>
    - Authorization: Bearer <key>

Later: replace ApiKeyAuthProvider (or swap get_auth_provider()) with an
Entra OAuth provider without rewriting MCP tools or Cognito routes.
"""
from __future__ import annotations

import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional

from fastapi import Header, HTTPException


@dataclass(frozen=True)
class AuthPrincipal:
    """Authenticated caller identity. Expand later for Entra user claims."""

    subject: str
    auth_method: str  # "api_key" | "entra" (future)


class AuthProvider(ABC):
    """Pluggable auth backend. MCP and REST should depend on this interface."""

    @abstractmethod
    def authenticate(
        self,
        *,
        authorization: Optional[str] = None,
        x_api_key: Optional[str] = None,
    ) -> AuthPrincipal:
        """Validate credentials or raise HTTPException."""


def get_configured_api_key() -> str:
    return os.getenv("COGNITO_API_KEY", "").strip()


def extract_api_key(
    authorization: Optional[str] = None,
    x_api_key: Optional[str] = None,
) -> Optional[str]:
    """Extract key from X-API-Key or Authorization: Bearer (Cognito pattern)."""
    if x_api_key and x_api_key.strip():
        return x_api_key.strip()
    if authorization:
        parts = authorization.split(None, 1)
        if len(parts) == 2 and parts[0].lower() == "bearer" and parts[1].strip():
            return parts[1].strip()
    return None


class ApiKeyAuthProvider(AuthProvider):
    """
    Shared API key auth (Phase 1).

    fail_closed=True  → reject when COGNITO_API_KEY is unset (MCP must use this)
    fail_closed=False → allow when unset (legacy Cognito chat behavior)
    """

    def __init__(self, *, fail_closed: bool = True):
        self.fail_closed = fail_closed

    def authenticate(
        self,
        *,
        authorization: Optional[str] = None,
        x_api_key: Optional[str] = None,
    ) -> AuthPrincipal:
        expected = get_configured_api_key()
        provided = extract_api_key(authorization=authorization, x_api_key=x_api_key)

        if not expected:
            if self.fail_closed:
                raise HTTPException(
                    status_code=503,
                    detail="COGNITO_API_KEY is not configured",
                )
            return AuthPrincipal(subject="anonymous", auth_method="api_key")

        if not provided or provided != expected:
            raise HTTPException(status_code=401, detail="Invalid API key")

        return AuthPrincipal(subject="api_key", auth_method="api_key")


# Default providers — swap MCP_AUTH_PROVIDER later for Entra without tool changes.
REST_AUTH_PROVIDER = ApiKeyAuthProvider(fail_closed=False)
MCP_AUTH_PROVIDER = ApiKeyAuthProvider(fail_closed=True)


def get_mcp_auth_provider() -> AuthProvider:
    """Indirection point for future Entra OAuth swap-in."""
    return MCP_AUTH_PROVIDER


def verify_cognito_api_key(
    x_api_key: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None),
) -> AuthPrincipal:
    """FastAPI dependency for /api/cognito/* (fail-open when key unset)."""
    return REST_AUTH_PROVIDER.authenticate(
        authorization=authorization,
        x_api_key=x_api_key,
    )
