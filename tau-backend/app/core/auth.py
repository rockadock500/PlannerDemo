"""
Cognito REST authentication seam.

Shared API key via COGNITO_API_KEY, for /api/cognito/* only:
    - X-API-Key: <key>
    - Authorization: Bearer <key>

The MCP server no longer uses this — it authenticates per user via Google
OAuth and authorizes against the users table (app/core/auth_google.py).
"""
from __future__ import annotations

import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Mapping, Optional

from fastapi import Header, HTTPException, Request


@dataclass(frozen=True)
class AuthPrincipal:
    """Authenticated caller identity. Expand later for Entra user claims."""

    subject: str
    auth_method: str  # "api_key" | "google_session" | "entra" (future)


class AuthProvider(ABC):
    """Pluggable auth backend. MCP and REST should depend on this interface."""

    @abstractmethod
    def authenticate(
        self,
        *,
        authorization: Optional[str] = None,
        x_api_key: Optional[str] = None,
        session: Optional[Mapping[str, Any]] = None,
    ) -> AuthPrincipal:
        """
        Validate credentials or raise HTTPException.

        `session` carries the signed-cookie contents for browser callers. Header
        credentials alone cannot express a cookie session, so the parameter is on
        the interface; providers that do not use it ignore it.
        """


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
        session: Optional[Mapping[str, Any]] = None,
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


class SessionAuthProvider(AuthProvider):
    """
    Browser session set by the web Google login (app/core/auth_web.py).

    Re-checks the caller against the users table on every request rather than
    trusting the cookie, so clearing someone's email revokes access on their next
    request instead of whenever the cookie happens to expire. The lookup is served
    from auth_google's short-lived cache, so this is not a query per request.
    """

    def authenticate(
        self,
        *,
        authorization: Optional[str] = None,
        x_api_key: Optional[str] = None,
        session: Optional[Mapping[str, Any]] = None,
    ) -> AuthPrincipal:
        # Imported here, not at module scope: app.core.auth is imported very early
        # and auth_google opens a DB session on import of its own dependencies.
        from app.core.auth_google import _is_email_authorized_cached
        from app.core.auth_web import SESSION_EMAIL_KEY

        email = (session or {}).get(SESSION_EMAIL_KEY)
        if not email:
            raise HTTPException(status_code=401, detail="Not authenticated")

        if not _is_email_authorized_cached(email):
            raise HTTPException(status_code=401, detail="No longer authorised")

        return AuthPrincipal(subject=email, auth_method="google_session")


# REST only. The MCP server moved to Google OAuth — see app/core/auth_google.py.
REST_AUTH_PROVIDER = ApiKeyAuthProvider(fail_closed=False)
SESSION_AUTH_PROVIDER = SessionAuthProvider()


def require_session(request: Request) -> AuthPrincipal:
    """
    FastAPI dependency guarding /api/* for browser callers.

    Attached to the router in app/main.py rather than to each route, so a new
    endpoint is protected by default instead of by remembering to decorate it.
    """
    return SESSION_AUTH_PROVIDER.authenticate(session=request.session)


def verify_cognito_api_key(
    x_api_key: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None),
) -> AuthPrincipal:
    """FastAPI dependency for /api/cognito/* (fail-open when key unset)."""
    return REST_AUTH_PROVIDER.authenticate(
        authorization=authorization,
        x_api_key=x_api_key,
    )
