"""
Cognito AI Agent Service - Grok-powered conversational interface for CRM operations.
"""
import os
import json
import uuid
import httpx
from typing import Optional, Dict, Any, List
from datetime import datetime
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from pathlib import Path

# Load .env file from backend root
env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

from app.models.models import Contact, Opportunity, User, Company, Activity, STAGE_PROBABILITIES

# Grok API Configuration
def get_grok_api_key():
    return os.getenv("GROK_API_KEY", "")

GROK_API_URL = "https://api.x.ai/v1/chat/completions"
GROK_MODEL = "grok-4-1-fast-reasoning"

# Session storage for pending actions (in production, use Redis or similar)
pending_actions: Dict[str, Dict] = {}
session_contexts: Dict[str, List[Dict]] = {}


# CRM Function definitions for Grok
CRM_FUNCTIONS = [
    {
        "name": "list_opportunities",
        "description": "List all opportunities with optional filters by stage or owner",
        "parameters": {
            "type": "object",
            "properties": {
                "stage": {"type": "string", "description": "Filter by stage: Initial, Engaged, Proposal, Verbal, Signed"},
                "owner_name": {"type": "string", "description": "Filter by owner name"}
            }
        }
    },
    {
        "name": "get_opportunity",
        "description": "Get details of a specific opportunity by name or ID",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "The opportunity name to search for"},
                "id": {"type": "integer", "description": "The opportunity ID"}
            }
        }
    },
    {
        "name": "update_opportunity",
        "description": "Update an opportunity's stage, value, or other details",
        "parameters": {
            "type": "object",
            "properties": {
                "id": {"type": "integer", "description": "The opportunity ID"},
                "name": {"type": "string", "description": "New opportunity name"},
                "stage": {"type": "string", "description": "New stage: Initial, Engaged, Proposal, Verbal, Signed"},
                "value": {"type": "integer", "description": "New deal value"},
                "contact_id": {"type": "integer", "description": "Linked contact ID"},
                "owner_id": {"type": "integer", "description": "Owner user ID"},
                "company_id": {"type": "integer", "description": "Company ID"},
                "expected_start_date": {"type": "string", "description": "Expected start date (YYYY-MM-DD)"},
                "duration_months": {"type": "integer", "description": "Duration in months"},
                "procurement_delay": {"type": "string", "description": "low, medium, or high"}
            },
            "required": ["id"]
        }
    },
    {
        "name": "delete_opportunity",
        "description": "Delete an opportunity (requires confirmation)",
        "parameters": {
            "type": "object",
            "properties": {
                "id": {"type": "integer", "description": "The opportunity ID to delete"}
            },
            "required": ["id"]
        }
    },
    {
        "name": "archive_opportunity",
        "description": "Archive an opportunity (soft-remove from active pipeline; reversible via unarchive)",
        "parameters": {
            "type": "object",
            "properties": {
                "id": {"type": "integer", "description": "The opportunity ID to archive"}
            },
            "required": ["id"]
        }
    },
    {
        "name": "unarchive_opportunity",
        "description": "Restore an archived opportunity to the active pipeline",
        "parameters": {
            "type": "object",
            "properties": {
                "id": {"type": "integer", "description": "The opportunity ID to unarchive"}
            },
            "required": ["id"]
        }
    },
    {
        "name": "create_opportunity",
        "description": "Create a new opportunity in the pipeline",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Opportunity name"},
                "stage": {"type": "string", "description": "Stage: Initial, Engaged, Proposal, Verbal, Signed"},
                "value": {"type": "integer", "description": "Deal value"},
                "contact_id": {"type": "integer", "description": "Linked contact ID"},
                "owner_id": {"type": "integer", "description": "Owner user ID"},
                "company_id": {"type": "integer", "description": "Company ID"},
                "expected_start_date": {"type": "string", "description": "Expected start date (YYYY-MM-DD)"},
                "duration_months": {"type": "integer", "description": "Duration in months"},
                "procurement_delay": {"type": "string", "description": "low, medium, or high"}
            },
            "required": ["name"]
        }
    },
    {
        "name": "create_contact",
        "description": "Create a new contact",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Contact name"},
                "email": {"type": "string", "description": "Contact email"},
                "company": {"type": "string", "description": "Company name (legacy string field)"},
                "company_id": {"type": "integer", "description": "Company ID"},
                "phone": {"type": "string", "description": "Phone number"},
                "is_primary": {"type": "boolean", "description": "Whether this is the primary contact"}
            },
            "required": ["name", "email"]
        }
    },
    {
        "name": "update_contact",
        "description": "Update an existing contact",
        "parameters": {
            "type": "object",
            "properties": {
                "id": {"type": "integer", "description": "Contact ID"},
                "name": {"type": "string", "description": "Contact name"},
                "email": {"type": "string", "description": "Contact email"},
                "company": {"type": "string", "description": "Company name (legacy string field)"},
                "company_id": {"type": "integer", "description": "Company ID"},
                "phone": {"type": "string", "description": "Phone number"},
                "is_primary": {"type": "boolean", "description": "Whether this is the primary contact"}
            },
            "required": ["id"]
        }
    },
    {
        "name": "list_activities",
        "description": "List activities, optionally filtered by contact, opportunity, or type",
        "parameters": {
            "type": "object",
            "properties": {
                "contact_id": {"type": "integer", "description": "Filter by contact ID"},
                "opportunity_id": {"type": "integer", "description": "Filter by opportunity ID"},
                "activity_type": {"type": "string", "description": "Filter by type (Email, Call, Meeting, Note, etc.)"},
                "limit": {"type": "integer", "description": "Max records to return (default 20)"}
            }
        }
    },
    {
        "name": "create_activity",
        "description": "Create an activity (Email, Call, Meeting, Note, etc.) linked to a contact",
        "parameters": {
            "type": "object",
            "properties": {
                "type": {"type": "string", "description": "Activity type: Email, Call, Meeting, Note, etc."},
                "content": {"type": "string", "description": "Activity notes/content"},
                "contact_id": {"type": "integer", "description": "Contact ID (required)"},
                "opportunity_id": {"type": "integer", "description": "Optional linked opportunity ID"}
            },
            "required": ["type", "contact_id"]
        }
    },
    {
        "name": "update_activity",
        "description": "Update an existing activity's type, content, or links",
        "parameters": {
            "type": "object",
            "properties": {
                "id": {"type": "integer", "description": "Activity ID"},
                "type": {"type": "string", "description": "Activity type"},
                "content": {"type": "string", "description": "Activity notes/content"},
                "contact_id": {"type": "integer", "description": "Contact ID"},
                "opportunity_id": {"type": "integer", "description": "Opportunity ID"}
            },
            "required": ["id"]
        }
    },
    {
        "name": "get_pipeline_summary",
        "description": "Get weighted pipeline summary by stage",
        "parameters": {"type": "object", "properties": {}}
    },
    {
        "name": "get_forecast",
        "description": "Get revenue forecast for a specific period",
        "parameters": {
            "type": "object",
            "properties": {
                "period": {"type": "string", "description": "Period like Q1, Q2, 2026-01, etc."}
            }
        }
    },
    {
        "name": "list_contacts",
        "description": "List contacts with optional company filter",
        "parameters": {
            "type": "object",
            "properties": {
                "company": {"type": "string", "description": "Filter by company name"}
            }
        }
    },
    {
        "name": "list_companies",
        "description": "List all companies",
        "parameters": {"type": "object", "properties": {}}
    }
]

VALID_STAGES = frozenset(STAGE_PROBABILITIES.keys())
VALID_PROCUREMENT_DELAYS = frozenset({"low", "medium", "high"})


def _parse_optional_datetime(value: Any) -> Optional[datetime]:
    """Parse YYYY-MM-DD or ISO datetime strings; pass through datetime; None for empty."""
    if value is None or value == "":
        return None
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        value = value.strip()
        if not value:
            return None
        if "T" not in value and len(value) == 10:
            return datetime.fromisoformat(value + "T00:00:00")
        return datetime.fromisoformat(value)
    return value


def get_system_prompt() -> str:
    """Generate the system prompt for Cognito."""
    return """You are Cognito, an AI assistant for TAU CRM. You help users manage their sales pipeline, contacts, and companies.

Your capabilities:
- Query and search opportunities, contacts, and companies
- Update opportunity stages and values
- Provide pipeline summaries and forecasts
- Answer questions about CRM data

Rules:
1. Always be concise and helpful
2. When asked about pipeline or deals, use the appropriate functions
3. For destructive actions (delete), always confirm first
4. Format currency values with pound symbol (£)
5. Use friendly but professional tone

Pipeline Stages (with probabilities):
- Initial (0%): New leads
- Engaged (25%): Active conversations
- Proposal (50%): Proposal sent
- Verbal (80%): Verbal agreement
- Signed (100%): Confirmed deal

Weighted Value = Deal Value x Stage Probability"""


class CognitoService:
    def __init__(self, db: Session):
        self.db = db

    def execute_function(self, function_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a CRM function and return results."""

        if function_name == "list_opportunities":
            return self._list_opportunities(
                arguments.get("stage"),
                arguments.get("owner_name"),
                include_archived=bool(arguments.get("include_archived", False)),
            )

        elif function_name == "get_opportunity":
            return self._get_opportunity(arguments.get("id"), arguments.get("name"))

        elif function_name == "update_opportunity":
            return self._update_opportunity(arguments["id"], arguments)

        elif function_name == "delete_opportunity":
            # This returns a pending action, not executed immediately
            return self._prepare_delete_opportunity(arguments["id"])

        elif function_name == "archive_opportunity":
            return self._archive_opportunity(arguments["id"])

        elif function_name == "unarchive_opportunity":
            return self._unarchive_opportunity(arguments["id"])

        elif function_name == "create_opportunity":
            return self._create_opportunity(arguments)

        elif function_name == "create_contact":
            return self._create_contact(arguments)

        elif function_name == "update_contact":
            return self._update_contact(arguments["id"], arguments)

        elif function_name == "list_activities":
            return self._list_activities(
                arguments.get("contact_id"),
                arguments.get("opportunity_id"),
                arguments.get("activity_type"),
                arguments.get("limit"),
            )

        elif function_name == "create_activity":
            return self._create_activity(arguments)

        elif function_name == "update_activity":
            return self._update_activity(arguments["id"], arguments)

        elif function_name == "get_pipeline_summary":
            return self._get_pipeline_summary()

        elif function_name == "get_forecast":
            return self._get_forecast(arguments.get("period"))

        elif function_name == "list_contacts":
            return self._list_contacts(arguments.get("company"))

        elif function_name == "list_companies":
            return self._list_companies()

        else:
            return {"error": f"Unknown function: {function_name}"}

    def _opportunity_payload(self, opp: Opportunity) -> Dict[str, Any]:
        return {
            "id": opp.id,
            "name": opp.name,
            "stage": opp.stage,
            "value": opp.value,
            "weighted_value": opp.weighted_value,
            "owner": opp.owner.name if opp.owner else None,
            "owner_id": opp.owner_id,
            "contact_id": opp.contact_id,
            "company_id": opp.company_id,
            "company": (
                opp.company_rel.name if opp.company_rel
                else (opp.contact.company if opp.contact else None)
            ),
            "expected_start_date": str(opp.expected_start_date) if opp.expected_start_date else None,
            "duration_months": opp.duration_months,
            "procurement_delay": opp.procurement_delay,
            "is_archived": bool(opp.is_archived),
            "archived_at": str(opp.archived_at) if opp.archived_at else None,
        }

    def _list_opportunities(
        self,
        stage: Optional[str] = None,
        owner_name: Optional[str] = None,
        include_archived: bool = False,
    ) -> Dict:
        query = self.db.query(Opportunity)

        if not include_archived:
            query = query.filter(
                (Opportunity.is_archived == False) | (Opportunity.is_archived == None)  # noqa: E712
            )

        if stage:
            query = query.filter(Opportunity.stage == stage)

        if owner_name:
            user = self.db.query(User).filter(User.name.ilike(f"%{owner_name}%")).first()
            if user:
                query = query.filter(Opportunity.owner_id == user.id)

        opportunities = query.all()
        return {
            "count": len(opportunities),
            "opportunities": [
                {
                    "id": o.id,
                    "name": o.name,
                    "stage": o.stage,
                    "value": o.value,
                    "weighted_value": o.weighted_value,
                    "owner": o.owner.name if o.owner else None,
                    "company": o.contact.company if o.contact else None,
                    "is_archived": bool(o.is_archived),
                }
                for o in opportunities
            ]
        }

    def _get_opportunity(self, opp_id: Optional[int] = None, name: Optional[str] = None) -> Dict:
        if opp_id:
            opp = self.db.query(Opportunity).filter(Opportunity.id == opp_id).first()
        elif name:
            opp = self.db.query(Opportunity).filter(Opportunity.name.ilike(f"%{name}%")).first()
        else:
            return {"error": "Please provide either an ID or name"}

        if not opp:
            return {"error": "Opportunity not found"}

        payload = self._opportunity_payload(opp)
        payload["probability"] = f"{int(STAGE_PROBABILITIES.get(opp.stage, 0) * 100)}%"
        return payload

    def _update_opportunity(self, opp_id: int, fields: Dict[str, Any]) -> Dict:
        opp = self.db.query(Opportunity).filter(Opportunity.id == opp_id).first()
        if not opp:
            return {"error": "Opportunity not found"}

        allowed = {
            "name", "stage", "value", "contact_id", "owner_id", "company_id",
            "expected_start_date", "duration_months", "procurement_delay",
        }
        # Skip None so optional MCP args don't wipe fields; value=0 is still applied.
        provided = {k: fields[k] for k in allowed if k in fields and fields[k] is not None}
        if "value" in fields and fields["value"] is not None:
            provided["value"] = fields["value"]
        changes = []

        for key, new_val in provided.items():
            if key == "stage":
                if new_val not in VALID_STAGES:
                    return {
                        "error": f"Invalid stage '{new_val}'. Must be one of: {', '.join(sorted(VALID_STAGES))}"
                    }
                old = opp.stage
                opp.stage = new_val
                changes.append(f"stage: {old} -> {new_val}")
            elif key == "value":
                old = opp.value
                opp.value = new_val
                changes.append(f"value: £{old or 0:,} -> £{new_val:,}")
            elif key == "name":
                old = opp.name
                opp.name = new_val
                changes.append(f"name: {old} -> {new_val}")
            elif key == "expected_start_date":
                try:
                    parsed = _parse_optional_datetime(new_val)
                except ValueError as e:
                    return {"error": f"Invalid expected_start_date: {e}"}
                old = opp.expected_start_date
                opp.expected_start_date = parsed
                changes.append(f"expected_start_date: {old} -> {parsed}")
            elif key == "procurement_delay":
                if new_val not in VALID_PROCUREMENT_DELAYS:
                    return {
                        "error": (
                            f"Invalid procurement_delay '{new_val}'. "
                            f"Must be one of: {', '.join(sorted(VALID_PROCUREMENT_DELAYS))}"
                        )
                    }
                old = opp.procurement_delay
                opp.procurement_delay = new_val
                changes.append(f"procurement_delay: {old} -> {new_val}")
            elif key == "contact_id":
                contact = self.db.query(Contact).filter(Contact.id == new_val).first()
                if not contact:
                    return {"error": f"Contact with id {new_val} not found"}
                old = opp.contact_id
                opp.contact_id = new_val
                changes.append(f"contact_id: {old} -> {new_val}")
            elif key == "owner_id":
                user = self.db.query(User).filter(User.id == new_val).first()
                if not user:
                    return {"error": f"User with id {new_val} not found"}
                old = opp.owner_id
                opp.owner_id = new_val
                changes.append(f"owner_id: {old} -> {new_val}")
            elif key == "company_id":
                company = self.db.query(Company).filter(Company.id == new_val).first()
                if not company:
                    return {"error": f"Company with id {new_val} not found"}
                old = opp.company_id
                opp.company_id = new_val
                changes.append(f"company_id: {old} -> {new_val}")
            elif key == "duration_months":
                old = opp.duration_months
                opp.duration_months = new_val
                changes.append(f"duration_months: {old} -> {new_val}")

        if not changes:
            return {"error": "No valid fields provided to update"}

        opp.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(opp)

        return {
            "success": True,
            "message": f"Updated '{opp.name}': {', '.join(changes)}",
            "opportunity": self._opportunity_payload(opp),
        }

    def _create_opportunity(self, fields: Dict[str, Any]) -> Dict:
        name = fields.get("name")
        if not name:
            return {"error": "name is required"}

        stage = fields.get("stage") or "Initial"
        if stage not in VALID_STAGES:
            return {"error": f"Invalid stage '{stage}'. Must be one of: {', '.join(sorted(VALID_STAGES))}"}

        contact_id = fields.get("contact_id")
        if contact_id is not None:
            contact = self.db.query(Contact).filter(Contact.id == contact_id).first()
            if not contact:
                return {"error": f"Contact with id {contact_id} not found"}

        owner_id = fields.get("owner_id")
        if owner_id is not None:
            user = self.db.query(User).filter(User.id == owner_id).first()
            if not user:
                return {"error": f"User with id {owner_id} not found"}

        company_id = fields.get("company_id")
        if company_id is not None:
            company = self.db.query(Company).filter(Company.id == company_id).first()
            if not company:
                return {"error": f"Company with id {company_id} not found"}

        procurement_delay = fields.get("procurement_delay") or "low"
        if procurement_delay not in VALID_PROCUREMENT_DELAYS:
            return {
                "error": (
                    f"Invalid procurement_delay '{procurement_delay}'. "
                    f"Must be one of: {', '.join(sorted(VALID_PROCUREMENT_DELAYS))}"
                )
            }

        try:
            expected_start_date = _parse_optional_datetime(fields.get("expected_start_date"))
        except ValueError as e:
            return {"error": f"Invalid expected_start_date: {e}"}

        opp = Opportunity(
            name=name,
            stage=stage,
            value=fields.get("value") or 0,
            contact_id=contact_id,
            owner_id=owner_id,
            company_id=company_id,
            expected_start_date=expected_start_date,
            duration_months=fields.get("duration_months") or 1,
            procurement_delay=procurement_delay,
            is_archived=False,
        )
        self.db.add(opp)
        self.db.commit()
        self.db.refresh(opp)

        return {
            "success": True,
            "message": f"Created opportunity '{opp.name}'",
            "opportunity": self._opportunity_payload(opp),
        }

    def _archive_opportunity(self, opp_id: int) -> Dict:
        """Soft-remove an opportunity from the active pipeline (reversible)."""
        opp = self.db.query(Opportunity).filter(Opportunity.id == opp_id).first()
        if not opp:
            return {"error": "Opportunity not found"}

        if opp.is_archived:
            return {
                "success": True,
                "message": f"Opportunity '{opp.name}' is already archived",
                "entity": "opportunity",
                "opportunity": self._opportunity_payload(opp),
            }

        opp.is_archived = True
        opp.archived_at = datetime.utcnow()
        opp.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(opp)

        return {
            "success": True,
            "message": (
                f"Archived opportunity '{opp.name}'. "
                "It is hidden from the active pipeline; use unarchive_opportunity to restore."
            ),
            "entity": "opportunity",
            "opportunity": self._opportunity_payload(opp),
        }

    def _unarchive_opportunity(self, opp_id: int) -> Dict:
        """Restore an archived opportunity to the active pipeline."""
        opp = self.db.query(Opportunity).filter(Opportunity.id == opp_id).first()
        if not opp:
            return {"error": "Opportunity not found"}

        if not opp.is_archived:
            return {
                "success": True,
                "message": f"Opportunity '{opp.name}' is not archived",
                "entity": "opportunity",
                "opportunity": self._opportunity_payload(opp),
            }

        opp.is_archived = False
        opp.archived_at = None
        opp.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(opp)

        return {
            "success": True,
            "message": f"Unarchived opportunity '{opp.name}'. It is back in the active pipeline.",
            "entity": "opportunity",
            "opportunity": self._opportunity_payload(opp),
        }

    def _create_contact(self, fields: Dict[str, Any]) -> Dict:
        name = fields.get("name")
        email = fields.get("email")
        if not name:
            return {"error": "name is required"}
        if not email:
            return {"error": "email is required"}

        company_id = fields.get("company_id")
        if company_id is not None:
            company = self.db.query(Company).filter(Company.id == company_id).first()
            if not company:
                return {"error": f"Company with id {company_id} not found"}

        contact = Contact(
            name=name,
            email=email,
            company=fields.get("company"),
            company_id=company_id,
            phone=fields.get("phone"),
            is_primary=bool(fields.get("is_primary", False)),
        )
        self.db.add(contact)
        self.db.commit()
        self.db.refresh(contact)

        return {
            "success": True,
            "message": f"Created contact '{contact.name}'",
            "contact": {
                "id": contact.id,
                "name": contact.name,
                "email": contact.email,
                "company": contact.company,
                "company_id": contact.company_id,
                "phone": contact.phone,
                "is_primary": contact.is_primary,
            },
        }

    def _update_contact(self, contact_id: int, fields: Dict[str, Any]) -> Dict:
        contact = self.db.query(Contact).filter(Contact.id == contact_id).first()
        if not contact:
            return {"error": "Contact not found"}

        allowed = {"name", "email", "company", "company_id", "phone", "is_primary"}
        provided = {k: fields[k] for k in allowed if k in fields and fields[k] is not None}
        if "is_primary" in fields and fields["is_primary"] is not None:
            provided["is_primary"] = bool(fields["is_primary"])
        changes = []

        for key, new_val in provided.items():
            if key == "company_id":
                company = self.db.query(Company).filter(Company.id == new_val).first()
                if not company:
                    return {"error": f"Company with id {new_val} not found"}

            old = getattr(contact, key)
            setattr(contact, key, new_val)
            changes.append(f"{key}: {old} -> {new_val}")

        if not changes:
            return {"error": "No valid fields provided to update"}

        self.db.commit()
        self.db.refresh(contact)

        return {
            "success": True,
            "message": f"Updated contact '{contact.name}': {', '.join(changes)}",
            "contact": {
                "id": contact.id,
                "name": contact.name,
                "email": contact.email,
                "company": contact.company,
                "company_id": contact.company_id,
                "phone": contact.phone,
                "is_primary": contact.is_primary,
            },
        }

    def _activity_payload(self, activity: Activity) -> Dict[str, Any]:
        return {
            "id": activity.id,
            "type": activity.type,
            "content": activity.content,
            "timestamp": str(activity.timestamp) if activity.timestamp else None,
            "contact_id": activity.contact_id,
            "opportunity_id": activity.opportunity_id,
        }

    def _list_activities(
        self,
        contact_id: Optional[int] = None,
        opportunity_id: Optional[int] = None,
        activity_type: Optional[str] = None,
        limit: Optional[int] = None,
    ) -> Dict:
        query = self.db.query(Activity)

        if contact_id is not None:
            query = query.filter(Activity.contact_id == contact_id)
        if opportunity_id is not None:
            query = query.filter(Activity.opportunity_id == opportunity_id)
        if activity_type:
            query = query.filter(Activity.type == activity_type)

        query = query.order_by(Activity.timestamp.desc())
        cap = min(max(limit or 20, 1), 100)
        activities = query.limit(cap).all()

        return {
            "count": len(activities),
            "activities": [self._activity_payload(a) for a in activities],
        }

    def _create_activity(self, fields: Dict[str, Any]) -> Dict:
        activity_type = fields.get("type")
        contact_id = fields.get("contact_id")
        if not activity_type:
            return {"error": "type is required"}
        if contact_id is None:
            return {"error": "contact_id is required"}

        contact = self.db.query(Contact).filter(Contact.id == contact_id).first()
        if not contact:
            return {"error": f"Contact with id {contact_id} not found"}

        opportunity_id = fields.get("opportunity_id")
        if opportunity_id is not None:
            opp = self.db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
            if not opp:
                return {"error": f"Opportunity with id {opportunity_id} not found"}

        activity = Activity(
            type=activity_type,
            content=fields.get("content"),
            contact_id=contact_id,
            opportunity_id=opportunity_id,
        )
        self.db.add(activity)
        self.db.commit()
        self.db.refresh(activity)

        return {
            "success": True,
            "message": f"Created {activity.type} activity (id={activity.id})",
            "activity": self._activity_payload(activity),
        }

    def _update_activity(self, activity_id: int, fields: Dict[str, Any]) -> Dict:
        activity = self.db.query(Activity).filter(Activity.id == activity_id).first()
        if not activity:
            return {"error": "Activity not found"}

        allowed = {"type", "content", "contact_id", "opportunity_id"}
        changes = []

        for key in allowed:
            if key not in fields or fields[key] is None:
                continue

            if key == "contact_id":
                contact = self.db.query(Contact).filter(Contact.id == fields["contact_id"]).first()
                if not contact:
                    return {"error": f"Contact with id {fields['contact_id']} not found"}
            elif key == "opportunity_id":
                opp = self.db.query(Opportunity).filter(Opportunity.id == fields["opportunity_id"]).first()
                if not opp:
                    return {"error": f"Opportunity with id {fields['opportunity_id']} not found"}

            old = getattr(activity, key)
            setattr(activity, key, fields[key])
            changes.append(f"{key}: {old} -> {fields[key]}")

        if not changes:
            return {"error": "No valid fields provided to update"}

        self.db.commit()
        self.db.refresh(activity)

        return {
            "success": True,
            "message": f"Updated activity id={activity.id}: {', '.join(changes)}",
            "activity": self._activity_payload(activity),
        }

    def _prepare_delete_opportunity(self, opp_id: int) -> Dict:
        opp = self.db.query(Opportunity).filter(Opportunity.id == opp_id).first()
        if not opp:
            return {"error": "Opportunity not found"}

        # Create a confirmation token
        token = str(uuid.uuid4())
        pending_actions[token] = {
            "type": "delete_opportunity",
            "id": opp_id,
            "name": opp.name,
            "created_at": datetime.utcnow()
        }

        return {
            "requires_confirmation": True,
            "message": f"Are you sure you want to delete '{opp.name}'? This cannot be undone.",
            "confirmation_token": token,
            "action_type": "delete_opportunity"
        }

    def confirm_action(self, token: str) -> Dict:
        """Execute a pending action after confirmation."""
        if token not in pending_actions:
            return {"error": "Invalid or expired confirmation token"}

        action = pending_actions.pop(token)

        if action["type"] == "delete_opportunity":
            opp = self.db.query(Opportunity).filter(Opportunity.id == action["id"]).first()
            if opp:
                # Delete related activities
                self.db.query(Activity).filter(Activity.opportunity_id == opp.id).delete()
                self.db.delete(opp)
                self.db.commit()
                return {"success": True, "message": f"Deleted '{action['name']}' successfully."}
            return {"error": "Opportunity no longer exists"}

        return {"error": "Unknown action type"}

    def _get_pipeline_summary(self) -> Dict:
        opportunities = self.db.query(Opportunity).filter(
            (Opportunity.is_archived == False) | (Opportunity.is_archived == None)  # noqa: E712
        ).all()

        by_stage = {}
        total_value = 0
        total_weighted = 0

        for stage, probability in STAGE_PROBABILITIES.items():
            stage_opps = [o for o in opportunities if o.stage == stage]
            stage_value = sum(o.value or 0 for o in stage_opps)
            stage_weighted = int(stage_value * probability)

            by_stage[stage] = {
                "count": len(stage_opps),
                "value": stage_value,
                "weighted_value": stage_weighted,
                "probability": f"{int(probability * 100)}%"
            }

            total_value += stage_value
            total_weighted += stage_weighted

        return {
            "total_pipeline_value": total_value,
            "total_weighted_value": total_weighted,
            "by_stage": by_stage
        }

    def _get_forecast(self, period: Optional[str] = None) -> Dict:
        summary = self._get_pipeline_summary()

        # For now, return the summary as the forecast
        # A more sophisticated implementation would filter by expected_start_date
        return {
            "period": period or "Current Pipeline",
            "weighted_forecast": summary["total_weighted_value"],
            "total_pipeline": summary["total_pipeline_value"],
            "breakdown": summary["by_stage"]
        }

    def _list_contacts(self, company: Optional[str] = None) -> Dict:
        query = self.db.query(Contact)
        if company:
            query = query.filter(Contact.company.ilike(f"%{company}%"))

        contacts = query.limit(20).all()
        return {
            "count": len(contacts),
            "contacts": [
                {
                    "id": c.id,
                    "name": c.name,
                    "email": c.email,
                    "company": c.company,
                    "is_primary": c.is_primary
                }
                for c in contacts
            ]
        }

    def _list_companies(self) -> Dict:
        companies = self.db.query(Company).limit(20).all()
        return {
            "count": len(companies),
            "companies": [
                {
                    "id": c.id,
                    "name": c.name,
                    "industry": c.industry,
                    "website": c.website
                }
                for c in companies
            ]
        }


async def chat_with_grok(
    message: str,
    session_id: str,
    db: Session
) -> Dict[str, Any]:
    """Send a message to Grok and process the response."""

    # Initialize session context if needed
    if session_id not in session_contexts:
        session_contexts[session_id] = []

    # Add user message to context
    session_contexts[session_id].append({"role": "user", "content": message})

    # Keep only last 10 messages for context
    if len(session_contexts[session_id]) > 10:
        session_contexts[session_id] = session_contexts[session_id][-10:]

    # Prepare messages for Grok
    messages = [
        {"role": "system", "content": get_system_prompt()},
        *session_contexts[session_id]
    ]

    # If no API key, use fallback processing
    api_key = get_grok_api_key()
    if not api_key:
        return await fallback_processing(message, session_id, db)

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GROK_API_URL,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": GROK_MODEL,
                    "messages": messages,
                    "tools": [{"type": "function", "function": f} for f in CRM_FUNCTIONS],
                    "tool_choice": "auto"
                },
                timeout=30.0
            )

            if response.status_code != 200:
                return await fallback_processing(message, session_id, db)

            result = response.json()
            choice = result.get("choices", [{}])[0]
            assistant_message = choice.get("message", {})

            # Check for function calls
            tool_calls = assistant_message.get("tool_calls", [])

            if tool_calls:
                service = CognitoService(db)
                actions_taken = []
                function_results = []

                for tool_call in tool_calls:
                    func_name = tool_call["function"]["name"]
                    func_args = json.loads(tool_call["function"]["arguments"])

                    result = service.execute_function(func_name, func_args)
                    function_results.append({
                        "tool_call_id": tool_call["id"],
                        "role": "tool",
                        "content": json.dumps(result)
                    })

                    if result.get("requires_confirmation"):
                        # Store pending action and return confirmation request
                        session_contexts[session_id].append(assistant_message)
                        return {
                            "response": result["message"],
                            "session_id": session_id,
                            "pending_action": {
                                "type": result["action_type"],
                                "id": result.get("id"),
                                "confirmation_token": result["confirmation_token"],
                                "details": None
                            },
                            "actions_taken": []
                        }

                    actions_taken.append(f"{func_name}: {result.get('message', 'executed')}")

                # Make a follow-up call to get natural language response
                messages.append(assistant_message)
                messages.extend(function_results)

                follow_up = await client.post(
                    GROK_API_URL,
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": GROK_MODEL,
                        "messages": messages
                    },
                    timeout=30.0
                )

                if follow_up.status_code == 200:
                    follow_result = follow_up.json()
                    final_response = follow_result["choices"][0]["message"]["content"]
                else:
                    final_response = f"Action completed: {', '.join(actions_taken)}"

                session_contexts[session_id].append({"role": "assistant", "content": final_response})

                return {
                    "response": final_response,
                    "session_id": session_id,
                    "pending_action": None,
                    "actions_taken": actions_taken
                }
            else:
                # No function calls, just a text response
                content = assistant_message.get("content", "I'm not sure how to help with that.")
                session_contexts[session_id].append({"role": "assistant", "content": content})

                return {
                    "response": content,
                    "session_id": session_id,
                    "pending_action": None,
                    "actions_taken": []
                }

    except Exception as e:
        print(f"Grok API error: {e}")
        return await fallback_processing(message, session_id, db)


async def fallback_processing(message: str, session_id: str, db: Session) -> Dict[str, Any]:
    """Simple pattern matching fallback when Grok is unavailable."""
    service = CognitoService(db)
    message_lower = message.lower()

    response = ""
    actions_taken = []
    pending_action = None

    # Pipeline/forecast queries
    if any(word in message_lower for word in ["pipeline", "summary", "weighted", "total"]):
        result = service._get_pipeline_summary()
        response = f"Your pipeline summary:\n"
        response += f"- Total Pipeline: £{result['total_pipeline_value']:,}\n"
        response += f"- Weighted Value: £{result['total_weighted_value']:,}\n\n"
        response += "By stage:\n"
        for stage, data in result["by_stage"].items():
            if data["count"] > 0:
                response += f"- {stage} ({data['probability']}): {data['count']} deals, £{data['value']:,} (W: £{data['weighted_value']:,})\n"
        actions_taken.append("get_pipeline_summary")

    # List opportunities
    elif any(word in message_lower for word in ["opportunities", "deals", "opps"]):
        stage = None
        for s in ["initial", "engaged", "proposal", "verbal", "signed"]:
            if s in message_lower:
                stage = s.capitalize()
                break

        result = service._list_opportunities(stage=stage)
        if result["count"] == 0:
            response = f"No opportunities found" + (f" in {stage} stage" if stage else "") + "."
        else:
            response = f"Found {result['count']} opportunities" + (f" in {stage} stage" if stage else "") + ":\n\n"
            for opp in result["opportunities"][:10]:
                response += f"- {opp['name']} ({opp['stage']}): £{opp['value']:,} (W: £{opp['weighted_value']:,})\n"
        actions_taken.append("list_opportunities")

    # List contacts
    elif "contact" in message_lower:
        result = service._list_contacts()
        response = f"Found {result['count']} contacts:\n\n"
        for c in result["contacts"][:10]:
            response += f"- {c['name']} ({c['company']}): {c['email']}\n"
        actions_taken.append("list_contacts")

    # List companies
    elif "compan" in message_lower:
        result = service._list_companies()
        response = f"Found {result['count']} companies:\n\n"
        for c in result["companies"][:10]:
            response += f"- {c['name']}"
            if c.get("industry"):
                response += f" ({c['industry']})"
            response += "\n"
        actions_taken.append("list_companies")

    # Default response
    else:
        response = """I can help you with:
- **Pipeline**: "Show me the pipeline summary" or "What's our weighted pipeline?"
- **Opportunities**: "List all opportunities" or "Show verbal stage deals"
- **Contacts**: "List contacts"
- **Companies**: "Show companies"

What would you like to know?"""

    return {
        "response": response,
        "session_id": session_id,
        "pending_action": pending_action,
        "actions_taken": actions_taken
    }
