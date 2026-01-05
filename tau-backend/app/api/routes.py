from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import SessionLocal
from app.models.models import Contact, Opportunity, User
from app.schemas import (ContactOut, ContactUpdate, ContactCreate, 
                         OpportunityOut, OpportunityUpdate, OpportunityCreate, 
                         UserOut)

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------
# USERS (TAU EMPLOYEES)
# -----------------

@router.get("/users", response_model=List[UserOut])
def read_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    # Sort by name
    users.sort(key=lambda x: x.name or "")
    return users

# -----------------
# CONTACTS
# -----------------

@router.post("/contacts", response_model=ContactOut)
def create_contact(contact_in: ContactCreate, db: Session = Depends(get_db)):
    # Check dupes? Simple email check
    if contact_in.email:
        existing = db.query(Contact).filter(Contact.email == contact_in.email).first()
        if existing:
            # Just return existing? Or error? Error is safer for explicit create.
            raise HTTPException(status_code=400, detail="Contact with this email already exists")
            
    contact = Contact(**contact_in.dict())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

@router.get("/contacts", response_model=List[ContactOut])
def read_contacts(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    contacts = db.query(Contact).all()
    # Sort: Primary first, then internal score check logic is frontend concern
    contacts.sort(key=lambda x: (x.company or "", x.name or ""))
    return contacts

@router.put("/contacts/{contact_id}", response_model=ContactOut)
def update_contact(contact_id: int, contact_in: ContactUpdate, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    update_data = contact_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(contact, key, value)
    
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

# -----------------
# OPPORTUNITIES
# -----------------

@router.post("/opportunities", response_model=OpportunityOut)
def create_opportunity(opp_in: OpportunityCreate, db: Session = Depends(get_db)):
    # Optional Validation: linked contact exists?
    if opp_in.contact_id:
        contact = db.query(Contact).filter(Contact.id == opp_in.contact_id).first()
        if not contact:
             # If contact ID provided but not found, 404
             raise HTTPException(status_code=404, detail=f"Contact with id {opp_in.contact_id} not found")
             
    opp = Opportunity(**opp_in.dict())
    db.add(opp)
    db.commit()
    db.refresh(opp)
    return opp

@router.get("/opportunities", response_model=List[OpportunityOut])
def read_opportunities(db: Session = Depends(get_db)):
    opps = db.query(Opportunity).all()
    return opps

@router.put("/opportunities/{opp_id}", response_model=OpportunityOut)
def update_opportunity(opp_id: int, opp_in: OpportunityUpdate, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    update_data = opp_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(opp, key, value)
    
    db.add(opp)
    db.commit()
    db.refresh(opp)
    return opp
