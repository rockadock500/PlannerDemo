"""
Cognito AI Agent API Routes
"""
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import SessionLocal
from app.schemas import CognitoMessage, CognitoResponse, CognitoConfirm
from app.services.cognito import chat_with_grok, CognitoService, pending_actions

router = APIRouter(prefix="/cognito", tags=["cognito"])

# API Key for external access (optional)
COGNITO_API_KEY = os.getenv("COGNITO_API_KEY", "")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """Optional API key verification for external access."""
    # If no API key is configured, allow all requests (internal use)
    if not COGNITO_API_KEY:
        return True

    # If API key is configured, verify it
    if x_api_key != COGNITO_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return True


@router.post("/chat", response_model=CognitoResponse)
async def chat(
    message: CognitoMessage,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_api_key)
):
    """
    Send a message to Cognito AI agent.

    The agent can:
    - Query and search CRM data (opportunities, contacts, companies)
    - Update opportunity stages and values
    - Provide pipeline summaries and forecasts
    - Require confirmation for destructive actions
    """
    # Generate session ID if not provided
    session_id = message.session_id or str(uuid.uuid4())

    try:
        result = await chat_with_grok(
            message=message.message,
            session_id=session_id,
            db=db
        )

        return CognitoResponse(
            response=result["response"],
            session_id=result["session_id"],
            pending_action=result.get("pending_action"),
            actions_taken=result.get("actions_taken", [])
        )

    except Exception as e:
        print(f"Cognito chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/confirm")
async def confirm_action(
    confirm: CognitoConfirm,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_api_key)
):
    """
    Confirm a pending destructive action (like delete).
    """
    service = CognitoService(db)
    result = service.confirm_action(confirm.confirmation_token)

    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])

    return {
        "response": result["message"],
        "session_id": confirm.session_id,
        "success": True
    }


@router.get("/health")
async def health_check():
    """Check if Cognito service is available."""
    from dotenv import load_dotenv
    from pathlib import Path
    env_path = Path(__file__).resolve().parent.parent.parent / '.env'
    load_dotenv(dotenv_path=env_path)
    grok_configured = bool(os.getenv("GROK_API_KEY"))
    return {
        "status": "healthy",
        "grok_configured": grok_configured,
        "fallback_available": True
    }
