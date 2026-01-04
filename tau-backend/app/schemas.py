from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ContactBase(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    is_primary: Optional[bool] = None

class ContactUpdate(ContactBase):
    pass

class ContactOut(ContactBase):
    id: int
    last_contact_date: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class OpportunityBase(BaseModel):
    name: Optional[str] = None
    stage: Optional[str] = None
    value: Optional[int] = None

class OpportunityUpdate(OpportunityBase):
    contact_id: Optional[int] = None

class OpportunityOut(OpportunityBase):
    id: int
    contact_id: Optional[int] = None
    contact: Optional[ContactOut] = None

    class Config:
        orm_mode = True
