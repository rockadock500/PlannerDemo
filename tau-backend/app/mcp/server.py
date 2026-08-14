"""
Cognito CRM MCP server — Phase 1 read + Phase 2 write tools.

Served at /mcp on the FastAPI app (Streamable HTTP).
Tools call CognitoService.execute_function(); no duplicated CRM logic.

Auth: Google OAuth (FastMCP GoogleProvider) for authentication, plus an
allowlist check against the `users` table for authorization — both wired up in
app.core.auth_google. The old shared-COGNITO_API_KEY middleware is gone.

Hard deletes are intentionally NOT exposed via MCP (use archive_opportunity).
"""
from __future__ import annotations

import logging
from typing import Any, Dict, Optional

from fastmcp import FastMCP
from fastmcp.server.middleware.authorization import AuthMiddleware

from app.core.auth_google import build_google_auth_provider, check_mcp_allowlist
from app.core.database import SessionLocal
from app.services.cognito import CognitoService

logger = logging.getLogger(__name__)

# MCP allowlist — delete_opportunity exists on CognitoService but is never exposed here.
MCP_ALLOWED_FUNCTIONS = frozenset(
    {
        # Phase 1 — read
        "list_companies",
        "list_contacts",
        "list_opportunities",
        "get_opportunity",
        "get_pipeline_summary",
        "get_forecast",
        "list_activities",
        # Phase 2 — write / create / archive (no hard delete)
        "update_opportunity",
        "create_opportunity",
        "archive_opportunity",
        "unarchive_opportunity",
        "create_contact",
        "update_contact",
        "create_activity",
        "update_activity",
    }
)


def _deny_all(ctx) -> bool:
    """Used when OAuth is unconfigured — refuse every component."""
    return False


# None when GOOGLE_OAUTH_* is unconfigured. In that case the server still
# imports cleanly (so the REST API keeps running) but exposes no tools.
_auth_provider = build_google_auth_provider()

mcp = FastMCP(
    name="Cognito CRM",
    instructions=(
        "Cognito CRM tools for TAU pipeline data. "
        "Read companies, contacts, opportunities, activities, pipeline summary, and forecast. "
        "Write: create/update contacts, opportunities, and activities; "
        "archive/unarchive opportunities (soft-remove from pipeline — no hard delete). "
        "Archive applies to opportunities only."
    ),
    auth=_auth_provider,
    # Fail closed: with no OAuth provider there is no identity to check, so deny
    # everything rather than leaving /mcp open.
    middleware=[
        AuthMiddleware(auth=check_mcp_allowlist if _auth_provider else _deny_all)
    ],
)


def _execute(function_name: str, arguments: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    if function_name not in MCP_ALLOWED_FUNCTIONS:
        return {"error": f"Function not available via MCP: {function_name}"}

    db = SessionLocal()
    try:
        service = CognitoService(db)
        return service.execute_function(function_name, arguments or {})
    except Exception as e:
        logger.exception("MCP tool %s failed", function_name)
        return {"error": str(e)}
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Phase 1 — read
# ---------------------------------------------------------------------------


@mcp.tool
def list_companies() -> Dict[str, Any]:
    """List companies in Cognito CRM."""
    return _execute("list_companies")


@mcp.tool
def list_contacts(company: Optional[str] = None) -> Dict[str, Any]:
    """List contacts, optionally filtered by company name."""
    args: Dict[str, Any] = {}
    if company is not None:
        args["company"] = company
    return _execute("list_contacts", args)


@mcp.tool
def list_opportunities(
    stage: Optional[str] = None,
    owner_name: Optional[str] = None,
    include_archived: bool = False,
) -> Dict[str, Any]:
    """List opportunities (excludes archived by default). Filter by stage or owner name."""
    args: Dict[str, Any] = {"include_archived": include_archived}
    if stage is not None:
        args["stage"] = stage
    if owner_name is not None:
        args["owner_name"] = owner_name
    return _execute("list_opportunities", args)


@mcp.tool
def get_opportunity(
    id: Optional[int] = None,
    name: Optional[str] = None,
) -> Dict[str, Any]:
    """Get a single opportunity by ID or name."""
    args: Dict[str, Any] = {}
    if id is not None:
        args["id"] = id
    if name is not None:
        args["name"] = name
    return _execute("get_opportunity", args)


@mcp.tool
def get_pipeline_summary() -> Dict[str, Any]:
    """Get weighted pipeline summary by stage (active opportunities only)."""
    return _execute("get_pipeline_summary")


@mcp.tool
def get_forecast(period: Optional[str] = None) -> Dict[str, Any]:
    """Get revenue forecast for a period (e.g. Q1, Q2, 2026-01)."""
    args: Dict[str, Any] = {}
    if period is not None:
        args["period"] = period
    return _execute("get_forecast", args)


@mcp.tool
def list_activities(
    contact_id: Optional[int] = None,
    opportunity_id: Optional[int] = None,
    activity_type: Optional[str] = None,
    limit: Optional[int] = None,
) -> Dict[str, Any]:
    """List activities, optionally filtered by contact, opportunity, or type (Email, Call, etc.)."""
    args: Dict[str, Any] = {}
    if contact_id is not None:
        args["contact_id"] = contact_id
    if opportunity_id is not None:
        args["opportunity_id"] = opportunity_id
    if activity_type is not None:
        args["activity_type"] = activity_type
    if limit is not None:
        args["limit"] = limit
    return _execute("list_activities", args)


# ---------------------------------------------------------------------------
# Phase 2 — write / create / archive (no hard delete)
# ---------------------------------------------------------------------------


@mcp.tool
def update_opportunity(
    id: int,
    name: Optional[str] = None,
    stage: Optional[str] = None,
    value: Optional[int] = None,
    contact_id: Optional[int] = None,
    owner_id: Optional[int] = None,
    company_id: Optional[int] = None,
    expected_start_date: Optional[str] = None,
    duration_months: Optional[int] = None,
    procurement_delay: Optional[str] = None,
) -> Dict[str, Any]:
    """Update an opportunity (stage, value, name, links, forecast fields)."""
    args: Dict[str, Any] = {"id": id}
    for key, val in {
        "name": name,
        "stage": stage,
        "value": value,
        "contact_id": contact_id,
        "owner_id": owner_id,
        "company_id": company_id,
        "expected_start_date": expected_start_date,
        "duration_months": duration_months,
        "procurement_delay": procurement_delay,
    }.items():
        if val is not None:
            args[key] = val
    return _execute("update_opportunity", args)


@mcp.tool
def create_opportunity(
    name: str,
    stage: Optional[str] = None,
    value: Optional[int] = None,
    contact_id: Optional[int] = None,
    owner_id: Optional[int] = None,
    company_id: Optional[int] = None,
    expected_start_date: Optional[str] = None,
    duration_months: Optional[int] = None,
    procurement_delay: Optional[str] = None,
) -> Dict[str, Any]:
    """Create a new opportunity in the pipeline."""
    args: Dict[str, Any] = {"name": name}
    for key, val in {
        "stage": stage,
        "value": value,
        "contact_id": contact_id,
        "owner_id": owner_id,
        "company_id": company_id,
        "expected_start_date": expected_start_date,
        "duration_months": duration_months,
        "procurement_delay": procurement_delay,
    }.items():
        if val is not None:
            args[key] = val
    return _execute("create_opportunity", args)


@mcp.tool
def archive_opportunity(id: int) -> Dict[str, Any]:
    """Archive an opportunity (soft-remove from active pipeline; reversible via unarchive_opportunity)."""
    return _execute("archive_opportunity", {"id": id})


@mcp.tool
def unarchive_opportunity(id: int) -> Dict[str, Any]:
    """Restore an archived opportunity to the active pipeline."""
    return _execute("unarchive_opportunity", {"id": id})


@mcp.tool
def create_contact(
    name: str,
    email: str,
    company: Optional[str] = None,
    company_id: Optional[int] = None,
    phone: Optional[str] = None,
    is_primary: Optional[bool] = None,
) -> Dict[str, Any]:
    """Create a new contact."""
    args: Dict[str, Any] = {"name": name, "email": email}
    for key, val in {
        "company": company,
        "company_id": company_id,
        "phone": phone,
        "is_primary": is_primary,
    }.items():
        if val is not None:
            args[key] = val
    return _execute("create_contact", args)


@mcp.tool
def update_contact(
    id: int,
    name: Optional[str] = None,
    email: Optional[str] = None,
    company: Optional[str] = None,
    company_id: Optional[int] = None,
    phone: Optional[str] = None,
    is_primary: Optional[bool] = None,
) -> Dict[str, Any]:
    """Update an existing contact."""
    args: Dict[str, Any] = {"id": id}
    for key, val in {
        "name": name,
        "email": email,
        "company": company,
        "company_id": company_id,
        "phone": phone,
        "is_primary": is_primary,
    }.items():
        if val is not None:
            args[key] = val
    return _execute("update_contact", args)


@mcp.tool
def create_activity(
    type: str,
    contact_id: int,
    content: Optional[str] = None,
    opportunity_id: Optional[int] = None,
) -> Dict[str, Any]:
    """Create an activity (Email, Call, Meeting, Note, etc.) linked to a contact."""
    args: Dict[str, Any] = {"type": type, "contact_id": contact_id}
    if content is not None:
        args["content"] = content
    if opportunity_id is not None:
        args["opportunity_id"] = opportunity_id
    return _execute("create_activity", args)


@mcp.tool
def update_activity(
    id: int,
    type: Optional[str] = None,
    content: Optional[str] = None,
    contact_id: Optional[int] = None,
    opportunity_id: Optional[int] = None,
) -> Dict[str, Any]:
    """Update an existing activity's type, content, or contact/opportunity links."""
    args: Dict[str, Any] = {"id": id}
    for key, val in {
        "type": type,
        "content": content,
        "contact_id": contact_id,
        "opportunity_id": opportunity_id,
    }.items():
        if val is not None:
            args[key] = val
    return _execute("update_activity", args)


# path="/mcp" — merged into FastAPI routes in main.py (avoids Mount /mcp → /mcp/ redirect)
mcp_app = mcp.http_app(
    path="/mcp",
    transport="http",
)
