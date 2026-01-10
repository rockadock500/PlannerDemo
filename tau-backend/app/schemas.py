from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    role: Optional[str] = "Member"
    allocation: Optional[float] = 0.0

class UserOut(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class UserCreate(UserBase):
    pass

class ContactBase(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    is_primary: Optional[bool] = None

class ContactCreate(ContactBase):
    email: str # Email required for creation usually, but let's keep optional if user wants placeholder? No, let's make email required for better data quality. Actually, standard Base has it Optional. Let's keep it consistent.
    pass

class ContactUpdate(ContactBase):
    pass

class ContactOut(ContactBase):
    id: int
    last_contact_date: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class OpportunityBase(BaseModel):
    name: Optional[str] = None
    stage: Optional[str] = None
    value: Optional[int] = None

class OpportunityCreate(OpportunityBase):
    name: str
    stage: Optional[str] = "Initial"
    contact_id: Optional[int] = None
    owner_id: Optional[int] = None

class OpportunityUpdate(OpportunityBase):
    contact_id: Optional[int] = None
    owner_id: Optional[int] = None

class OpportunityOut(OpportunityBase):
    id: int
    contact_id: Optional[int] = None
    owner_id: Optional[int] = None
    contact: Optional[ContactOut] = None
    owner: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)
