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
GROK_MODEL = "grok-beta"

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
                "stage": {"type": "string", "description": "New stage: Initial, Engaged, Proposal, Verbal, Signed"},
                "value": {"type": "integer", "description": "New deal value"}
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
            return self._list_opportunities(arguments.get("stage"), arguments.get("owner_name"))

        elif function_name == "get_opportunity":
            return self._get_opportunity(arguments.get("id"), arguments.get("name"))

        elif function_name == "update_opportunity":
            return self._update_opportunity(
                arguments["id"],
                arguments.get("stage"),
                arguments.get("value")
            )

        elif function_name == "delete_opportunity":
            # This returns a pending action, not executed immediately
            return self._prepare_delete_opportunity(arguments["id"])

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

    def _list_opportunities(self, stage: Optional[str] = None, owner_name: Optional[str] = None) -> Dict:
        query = self.db.query(Opportunity)

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
                    "company": o.contact.company if o.contact else None
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

        return {
            "id": opp.id,
            "name": opp.name,
            "stage": opp.stage,
            "value": opp.value,
            "weighted_value": opp.weighted_value,
            "probability": f"{int(STAGE_PROBABILITIES.get(opp.stage, 0) * 100)}%",
            "owner": opp.owner.name if opp.owner else None,
            "company": opp.contact.company if opp.contact else None,
            "expected_start_date": str(opp.expected_start_date) if opp.expected_start_date else None,
            "duration_months": opp.duration_months
        }

    def _update_opportunity(self, opp_id: int, stage: Optional[str] = None, value: Optional[int] = None) -> Dict:
        opp = self.db.query(Opportunity).filter(Opportunity.id == opp_id).first()
        if not opp:
            return {"error": "Opportunity not found"}

        changes = []
        if stage:
            old_stage = opp.stage
            opp.stage = stage
            changes.append(f"stage: {old_stage} -> {stage}")
        if value is not None:
            old_value = opp.value
            opp.value = value
            changes.append(f"value: £{old_value:,} -> £{value:,}")

        self.db.commit()
        self.db.refresh(opp)

        return {
            "success": True,
            "message": f"Updated '{opp.name}': {', '.join(changes)}",
            "opportunity": {
                "id": opp.id,
                "name": opp.name,
                "stage": opp.stage,
                "value": opp.value,
                "weighted_value": opp.weighted_value
            }
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
        opportunities = self.db.query(Opportunity).all()

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
