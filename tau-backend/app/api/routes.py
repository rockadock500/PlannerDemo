from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import SessionLocal
from app.models.models import Contact, Opportunity
from app.schemas import ContactOut, ContactUpdate, OpportunityOut, OpportunityUpdate

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------
# CONTACTS
# -----------------

@router.get("/contacts", response_model=List[ContactOut])
def read_contacts(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    contacts = db.query(Contact).all()
    # Sort: Primary first, then internal score check logic is frontend concern, 
    # but let's just return all.
    # Sorting by Company then Name
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

@router.get("/opportunities", response_model=List[OpportunityOut])
def read_opportunities(db: Session = Depends(get_db)):
    # Join with Contact to get contact details
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
