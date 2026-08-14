"""
Google OAuth for the Cognito CRM MCP server.

Two separate concerns, deliberately kept apart:

  * Authentication — *who is this?*  Handled by FastMCP's GoogleProvider, which
    proxies the OAuth handshake to Google, verifies the resulting token against
    Google's tokeninfo endpoint, and resolves the caller's email claim.
  * Authorization — *are they allowed?*  Handled here by check_mcp_allowlist(),
    which looks the email up in the existing `users` table and requires the
    explicit `mcp_authorized` flag. Unknown emails are rejected; there is no
    auto-provisioning.

Replaces the shared-COGNITO_API_KEY middleware that previously guarded /mcp*.
COGNITO_API_KEY is still used by /api/cognito/* — see app/core/auth.py.
"""
from __future__ import annotations

import logging
import os
import time
from typing import Optional

from sqlalchemy import func

from app.core.database import SessionLocal
from app.models.models import User

logger = logging.getLogger(__name__)

DEFAULT_PUBLIC_BASE_URL = "https://tau-crm-production.up.railway.app"

# Jack registered this path on the Google client; GoogleProvider defaults to
# /auth/callback, so it must be passed explicitly.
GOOGLE_REDIRECT_PATH = "/auth/redirect"

# The allowlist is checked once per component per listing — 16 tools means 16
# checks on a single tools/list. Cache the DB answer briefly so that is one
# query rather than sixteen. Short enough that revoking access takes effect
# within seconds.
_ALLOWLIST_CACHE_TTL_SECONDS = 30
_allowlist_cache: dict[str, tuple[bool, float]] = {}


def build_google_auth_provider():
    """
    Build the GoogleProvider, or return None if it isn't configured.

    Deliberately does NOT raise. app/main.py imports app.mcp.server at module
    load, so raising here would take the whole backend down — REST API and
    frontend included — over a missing MCP variable. Returning None degrades
    only the MCP surface.
    """
    client_id = os.getenv("GOOGLE_OAUTH_CLIENT_ID", "").strip()
    client_secret = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET", "").strip()

    if not client_id or not client_secret:
        logger.critical(
            "GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET are not set — "
            "the MCP server at /mcp will serve no tools. The REST API is unaffected."
        )
        return None

    base_url = os.getenv("MCP_PUBLIC_BASE_URL", DEFAULT_PUBLIC_BASE_URL).rstrip("/")

    try:
        # Imported lazily, and guarded: this module is reached from app.main at
        # import time, so an ImportError or bad config here would otherwise take
        # the REST API down with it.
        from fastmcp.server.auth.providers.google import GoogleProvider

        provider = GoogleProvider(
            client_id=client_id,
            client_secret=client_secret,
            base_url=base_url,
            redirect_path=GOOGLE_REDIRECT_PATH,
            required_scopes=["openid", "email", "profile"],
            # Steers Google's account chooser towards TAU accounts. A hint only —
            # it is not a security control, which is why the allowlist exists.
            extra_authorize_params={"hd": "taums.ai"},
        )
    except Exception:
        logger.critical(
            "Failed to initialise Google OAuth — /mcp will serve no tools. "
            "The REST API is unaffected.",
            exc_info=True,
        )
        return None

    logger.info("Google OAuth enabled for MCP at %s%s", base_url, GOOGLE_REDIRECT_PATH)
    return provider


def is_email_authorized(email: str) -> bool:
    """True if `email` belongs to a user row explicitly flagged for MCP access."""
    normalized = (email or "").strip().lower()
    if not normalized:
        return False

    db = SessionLocal()
    try:
        user = (
            db.query(User)
            .filter(
                func.lower(User.email) == normalized,
                User.mcp_authorized.is_(True),
            )
            .first()
        )
        return user is not None
    finally:
        db.close()


def _is_email_authorized_cached(email: str) -> bool:
    now = time.monotonic()
    cached = _allowlist_cache.get(email)
    if cached is not None and cached[1] > now:
        return cached[0]

    allowed = is_email_authorized(email)
    _allowlist_cache[email] = (allowed, now + _ALLOWLIST_CACHE_TTL_SECONDS)
    return allowed


def check_mcp_allowlist(ctx) -> bool:
    """
    FastMCP AuthCheck: gate every tool/resource/prompt on the users allowlist.

    Google having authenticated someone is not enough — any Google account can
    complete the handshake. Access requires a matching row in `users` with
    mcp_authorized set.

    run_auth_checks() treats a raised exception as denial, so failures here fail
    closed by default.
    """
    token = getattr(ctx, "token", None)
    if token is None:
        return False

    claims = getattr(token, "claims", None) or {}

    email: Optional[str] = claims.get("email")
    if not email:
        logger.warning("MCP auth denied: token carried no email claim")
        return False

    # Google will happily issue a token for an unverified address; treat those
    # as untrusted since the allowlist is keyed on email.
    if claims.get("email_verified") is False:
        logger.warning("MCP auth denied for %s: email not verified by Google", email)
        return False

    normalized = email.strip().lower()
    allowed = _is_email_authorized_cached(normalized)
    if not allowed:
        logger.warning("MCP auth denied for %s: not on the users allowlist", normalized)
    return allowed
