from pydantic import BaseModel, ConfigDict, Field, computed_field
from typing import Optional, List, Literal
from datetime import datetime
from enum import Enum


class ProcurementDelay(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


# Stage probabilities for weighted pipeline
STAGE_PROBABILITIES = {
    "Initial": 0.0,
    "Engaged": 0.25,
    "Proposal": 0.50,
    "Verbal": 0.80,
    "Signed": 1.0
}

class UserBase(BaseModel):
    name: str
    role: Optional[str] = "Member"
    allocation: Optional[float] = 0.0

class UserOut(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class UserCreate(UserBase):
    pass


# -----------------
# COMPANIES
# -----------------

class CompanyBase(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    notes: Optional[str] = None

class CompanyCreate(CompanyBase):
    name: str

class CompanyUpdate(CompanyBase):
    pass

class CompanyOut(CompanyBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# -----------------
# CONTACTS
# -----------------

class ContactBase(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None  # Legacy string field
    company_id: Optional[int] = None
    phone: Optional[str] = None
    is_primary: Optional[bool] = None

class ContactCreate(ContactBase):
    email: str

class ContactUpdate(ContactBase):
    pass

class ContactOut(ContactBase):
    id: int
    last_contact_date: Optional[datetime] = None
    company_rel: Optional[CompanyOut] = None

    model_config = ConfigDict(from_attributes=True)

class OpportunityBase(BaseModel):
    name: Optional[str] = None
    stage: Optional[str] = None
    value: Optional[int] = None
    expected_start_date: Optional[datetime] = None
    duration_months: Optional[int] = None
    procurement_delay: Optional[str] = None  # low/medium/high

class OpportunityCreate(OpportunityBase):
    name: str
    stage: Optional[str] = "Initial"
    contact_id: Optional[int] = None
    owner_id: Optional[int] = None
    company_id: Optional[int] = None
    duration_months: Optional[int] = 1
    procurement_delay: Optional[str] = "low"

class OpportunityUpdate(OpportunityBase):
    contact_id: Optional[int] = None
    owner_id: Optional[int] = None
    company_id: Optional[int] = None

class OpportunityOut(OpportunityBase):
    id: int
    contact_id: Optional[int] = None
    owner_id: Optional[int] = None
    company_id: Optional[int] = None
    contact: Optional[ContactOut] = None
    owner: Optional[UserOut] = None
    company_rel: Optional[CompanyOut] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    # Computed fields for weighted pipeline
    weighted_value: Optional[int] = None
    stage_probability: Optional[float] = None
    expected_monthly_value: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


# -----------------
# ACTIVITIES
# -----------------

class ActivityBase(BaseModel):
    type: str  # Email, Call, Meeting, Note, etc.
    content: Optional[str] = None

class ActivityCreate(ActivityBase):
    contact_id: int
    opportunity_id: Optional[int] = None

class ActivityUpdate(BaseModel):
    type: Optional[str] = None
    content: Optional[str] = None
    contact_id: Optional[int] = None
    opportunity_id: Optional[int] = None

class ActivityOut(ActivityBase):
    id: int
    contact_id: int
    opportunity_id: Optional[int] = None
    timestamp: datetime
    contact: Optional[ContactOut] = None

    model_config = ConfigDict(from_attributes=True)


# -----------------
# FORECAST
# -----------------

class ForecastPeriod(BaseModel):
    period: str  # e.g., "2026-Q1", "2026-01"
    total_value: int
    weighted_value: int
    opportunity_count: int
    opportunities: List[OpportunityOut] = []

class ForecastSummary(BaseModel):
    total_pipeline_value: int
    total_weighted_value: int
    by_stage: dict  # stage -> {count, value, weighted_value}
    periods: List[ForecastPeriod] = []

class StageSummary(BaseModel):
    stage: str
    probability: float
    count: int
    total_value: int
    weighted_value: int


# -----------------
# COGNITO AI AGENT
# -----------------

class CognitoMessage(BaseModel):
    message: str
    session_id: Optional[str] = None
    require_confirmation: bool = True

class CognitoPendingAction(BaseModel):
    type: str
    id: Optional[int] = None
    details: Optional[dict] = None
    confirmation_token: str

class CognitoResponse(BaseModel):
    response: str
    session_id: str
    pending_action: Optional[CognitoPendingAction] = None
    actions_taken: List[str] = []

class CognitoConfirm(BaseModel):
    confirmation_token: str
    session_id: str
