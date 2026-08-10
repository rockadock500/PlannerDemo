"""
Cognito CRM MCP server — Phase 1 read-only tools.

Served at /mcp on the FastAPI app (Streamable HTTP).
Tools call CognitoService.execute_function(); no duplicated CRM logic.

Auth: applied in app.main via CognitoAPIKeyMiddleware (fail-closed).
OAuth/Entra can replace ApiKeyAuthProvider without changing these tools.
"""
from __future__ import annotations

import logging
from typing import Any, Dict, Optional

from fastmcp import FastMCP
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.core.auth import get_mcp_auth_provider
from app.core.database import SessionLocal
from app.services.cognito import CognitoService

logger = logging.getLogger(__name__)

# Phase 1 allowlist — write functions exist on CognitoService but are not exposed.
READ_ONLY_FUNCTIONS = frozenset(
    {
        "list_companies",
        "list_contacts",
        "list_opportunities",
        "get_opportunity",
        "get_pipeline_summary",
        "get_forecast",
    }
)


class CognitoAPIKeyMiddleware(BaseHTTPMiddleware):
    """
    HTTP-layer auth for /mcp* — fail closed if COGNITO_API_KEY is unset.

    Attached on the parent FastAPI app (not only the MCP ASGI sub-app) so auth
    still applies when MCP routes are merged into the main app.
    """

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if not (path == "/mcp" or path.startswith("/mcp/")):
            return await call_next(request)

        # Allow CORS preflight through; CORSMiddleware handles headers.
        if request.method == "OPTIONS":
            return await call_next(request)

        provider = get_mcp_auth_provider()
        try:
            provider.authenticate(
                authorization=request.headers.get("authorization"),
                x_api_key=request.headers.get("x-api-key"),
            )
        except Exception as exc:
            status = getattr(exc, "status_code", 401)
            detail = getattr(exc, "detail", "Unauthorized")
            return JSONResponse({"detail": detail}, status_code=status)

        return await call_next(request)


mcp = FastMCP(
    name="Cognito CRM",
    instructions=(
        "Read-only Cognito CRM tools for TAU pipeline data. "
        "Query companies, contacts, opportunities, pipeline summary, and forecast. "
        "No write operations are available in v1."
    ),
)


def _execute(function_name: str, arguments: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    if function_name not in READ_ONLY_FUNCTIONS:
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
) -> Dict[str, Any]:
    """List opportunities, optionally filtered by stage or owner name."""
    args: Dict[str, Any] = {}
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
    """Get weighted pipeline summary by stage."""
    return _execute("get_pipeline_summary")


@mcp.tool
def get_forecast(period: Optional[str] = None) -> Dict[str, Any]:
    """Get revenue forecast for a period (e.g. Q1, Q2, 2026-01)."""
    args: Dict[str, Any] = {}
    if period is not None:
        args["period"] = period
    return _execute("get_forecast", args)


# path="/mcp" — merged into FastAPI routes in main.py (avoids Mount /mcp → /mcp/ redirect)
mcp_app = mcp.http_app(
    path="/mcp",
    transport="http",
)
