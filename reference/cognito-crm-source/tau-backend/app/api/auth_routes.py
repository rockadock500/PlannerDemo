"""
Web login routes for the CRM frontend.

Two routers, mounted separately in app/main.py, and the split matters:

  * web_auth_router  — /auth/web/*, mounted at the root because the callback path
    has to match exactly what is registered on the Google client. It cannot sit
    under /api.
  * auth_api_router  — /api/auth/*, mounted WITHOUT the session dependency that
    guards the rest of /api. /api/auth/me is how the frontend discovers whether it
    is signed in, so gating it would make the check impossible to perform.
"""
from __future__ import annotations

import logging
import secrets

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.auth_web import (
    SESSION_EMAIL_KEY,
    SESSION_STATE_KEY,
    authorize_email,
    build_authorize_url,
    exchange_code_for_email,
    frontend_url,
    is_web_login_configured,
)
# get_db is defined in routes.py rather than database.py; import it instead of
# adding a third copy of the same session dependency.
from app.api.routes import get_db
from app.models.models import User

logger = logging.getLogger(__name__)

web_auth_router = APIRouter(tags=["auth"])
auth_api_router = APIRouter(prefix="/auth", tags=["auth"])


def _back_to_frontend(error: str | None = None) -> RedirectResponse:
    """
    Always return the browser to the app, with a reason when refused.

    Redirecting back rather than rendering an error here keeps the failure visible
    in the UI instead of leaving the user on a bare backend page — and avoids a
    redirect loop when the frontend immediately retries.
    """
    target = frontend_url()
    if error:
        target = f"{target}/?auth_error={error}"
    return RedirectResponse(target, status_code=302)


@web_auth_router.get("/auth/web/login")
def web_login(request: Request):
    if not is_web_login_configured():
        # 503 rather than a redirect: this is a deployment fault, not a rejected
        # user, and it should look like one in the logs.
        raise HTTPException(
            status_code=503,
            detail="Web login is not configured (SESSION_SECRET / GOOGLE_OAUTH_* missing)",
        )

    state = secrets.token_urlsafe(32)
    request.session[SESSION_STATE_KEY] = state
    return RedirectResponse(build_authorize_url(state), status_code=302)


@web_auth_router.get("/auth/web/redirect")
async def web_redirect(request: Request):
    if not is_web_login_configured():
        raise HTTPException(status_code=503, detail="Web login is not configured")

    code = request.query_params.get("code")
    state = request.query_params.get("state")
    expected_state = request.session.pop(SESSION_STATE_KEY, None)

    if not code:
        # Google reports user-side refusals here (e.g. ?error=access_denied).
        logger.info("Web login: callback carried no code (%s)", request.query_params.get("error"))
        return _back_to_frontend("cancelled")

    # Compare in constant time and require the session value to exist — a missing
    # expected_state means the cookie was dropped, not that any state is fine.
    if not expected_state or not state or not secrets.compare_digest(state, expected_state):
        logger.warning("Web login denied: state mismatch")
        return _back_to_frontend("state_mismatch")

    email = await exchange_code_for_email(code)
    if not email:
        return _back_to_frontend("google_failed")

    if not authorize_email(email):
        # authorize_email logs which of the two conditions failed.
        return _back_to_frontend("not_authorised")

    request.session[SESSION_EMAIL_KEY] = email
    logger.info("Web login succeeded for %s", email)
    return _back_to_frontend()


@web_auth_router.post("/auth/web/logout")
def web_logout(request: Request):
    request.session.clear()
    return JSONResponse({"ok": True})


@auth_api_router.get("/me")
def read_current_user(request: Request, db: Session = Depends(get_db)):
    """
    Who is signed in, or 401. The frontend calls this on mount to decide between
    the app and the login screen.

    Re-checks authorization rather than trusting the cookie, so clearing someone's
    email revokes their session on their next request instead of whenever the
    cookie happens to expire.
    """
    email = request.session.get(SESSION_EMAIL_KEY)
    if not email:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not authorize_email(email):
        request.session.clear()
        raise HTTPException(status_code=401, detail="No longer authorised")

    user = db.query(User).filter(func.lower(User.email) == email).first()
    if user is None:
        # authorize_email passed, so this is a race with a concurrent edit.
        request.session.clear()
        raise HTTPException(status_code=401, detail="No longer authorised")

    return {"id": user.id, "name": user.name, "email": user.email}
