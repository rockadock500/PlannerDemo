"""
Google OAuth for the CRM web app (the React frontend).

Deliberately separate from app/core/auth_google.py, which serves the MCP
connector. That module hands the handshake to FastMCP's GoogleProvider, which
owns /auth/redirect and issues MCP access tokens — not what a browser session
needs. This module runs the plain authorization-code flow against
/auth/web/redirect (the second URI Jack registered on the Google client) and puts
the result in a signed session cookie.

Authorization is NOT re-implemented here. It reuses ALLOWED_EMAIL_DOMAIN and the
`users` lookup from auth_google.py, so the web app and the connector cannot drift
apart on who is allowed in. Changing the rule in one place changes both.
"""
from __future__ import annotations

import logging
import os
from typing import Optional
from urllib.parse import urlencode

import httpx

from app.core.auth_google import (
    ALLOWED_EMAIL_DOMAIN,
    DEFAULT_PUBLIC_BASE_URL,
    is_email_authorized,
)

logger = logging.getLogger(__name__)

# The path Jack registered on the Google client for the web flow. Distinct from
# auth_google.GOOGLE_REDIRECT_PATH ("/auth/redirect"), which FastMCP owns.
WEB_REDIRECT_PATH = "/auth/web/redirect"

DEFAULT_FRONTEND_URL = "https://tau-crm-frontend-production.up.railway.app"

GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo"

SESSION_EMAIL_KEY = "email"
SESSION_STATE_KEY = "oauth_state"


def public_base_url() -> str:
    return os.getenv("MCP_PUBLIC_BASE_URL", DEFAULT_PUBLIC_BASE_URL).rstrip("/")


def frontend_url() -> str:
    return os.getenv("FRONTEND_URL", DEFAULT_FRONTEND_URL).rstrip("/")


def redirect_uri() -> str:
    return f"{public_base_url()}{WEB_REDIRECT_PATH}"


def is_web_login_configured() -> bool:
    """
    True when the web login can actually work.

    Checked by the routes rather than raised at import: app/main.py imports this
    module at module load, so raising here would take the REST API down over a
    missing variable — the same reasoning as build_google_auth_provider().
    """
    return bool(
        os.getenv("GOOGLE_OAUTH_CLIENT_ID", "").strip()
        and os.getenv("GOOGLE_OAUTH_CLIENT_SECRET", "").strip()
        and os.getenv("SESSION_SECRET", "").strip()
    )


def build_authorize_url(state: str) -> str:
    """Google consent URL for the web flow. `state` guards against CSRF."""
    params = {
        "client_id": os.getenv("GOOGLE_OAUTH_CLIENT_ID", "").strip(),
        "redirect_uri": redirect_uri(),
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        # Steers Google's account chooser towards TAU accounts. A hint only — the
        # enforced check is ALLOWED_EMAIL_DOMAIN in is_email_authorized().
        "hd": ALLOWED_EMAIL_DOMAIN,
        # Always land on a fresh consent/selection rather than silently reusing a
        # personal account the browser happens to be signed into.
        "prompt": "select_account",
    }
    return f"{GOOGLE_AUTH_ENDPOINT}?{urlencode(params)}"


async def exchange_code_for_email(code: str) -> Optional[str]:
    """
    Swap an authorization code for the caller's verified Google address.

    Returns the lowercased email, or None if the exchange fails or Google has not
    verified the address. Verification matters because authorization is keyed on
    the email — Google will issue tokens for unverified addresses.
    """
    client_id = os.getenv("GOOGLE_OAUTH_CLIENT_ID", "").strip()
    client_secret = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET", "").strip()

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            token_response = await client.post(
                GOOGLE_TOKEN_ENDPOINT,
                data={
                    "code": code,
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "redirect_uri": redirect_uri(),
                    "grant_type": "authorization_code",
                },
            )
            if token_response.status_code != 200:
                logger.warning(
                    "Web login: Google token exchange failed (%s)", token_response.status_code
                )
                return None

            access_token = token_response.json().get("access_token")
            if not access_token:
                logger.warning("Web login: token response carried no access_token")
                return None

            # Ask Google who this is rather than decoding the id_token ourselves —
            # one extra call, no JWT handling to get wrong.
            userinfo_response = await client.get(
                GOOGLE_USERINFO_ENDPOINT,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if userinfo_response.status_code != 200:
                logger.warning(
                    "Web login: userinfo lookup failed (%s)", userinfo_response.status_code
                )
                return None

            info = userinfo_response.json()
    except Exception:
        logger.warning("Web login: Google exchange raised", exc_info=True)
        return None

    email = (info.get("email") or "").strip().lower()
    if not email:
        logger.warning("Web login denied: Google returned no email claim")
        return None

    if info.get("email_verified") is False:
        logger.warning("Web login denied for %s: email not verified by Google", email)
        return None

    return email


def authorize_email(email: str) -> bool:
    """Same gate as the MCP connector: TAU domain, then a matching users row."""
    return is_email_authorized(email)
