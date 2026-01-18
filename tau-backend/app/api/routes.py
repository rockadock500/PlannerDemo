from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from dateutil.relativedelta import relativedelta
from collections import defaultdict

from app.core.database import SessionLocal
from app.models.models import Contact, Opportunity, User, Activity, Company, STAGE_PROBABILITIES, PROCUREMENT_DELAY_BUFFERS
from app.schemas import (ContactOut, ContactUpdate, ContactCreate,
                         OpportunityOut, OpportunityUpdate, OpportunityCreate,
                         UserOut, UserCreate,
                         ActivityOut, ActivityCreate, ActivityUpdate,
                         CompanyOut, CompanyCreate, CompanyUpdate,
                         ForecastSummary, ForecastPeriod, StageSummary)

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

@router.post("/users", response_model=UserOut)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if exists
    existing = db.query(User).filter(User.name == user_in.name).first()
    if existing:
         raise HTTPException(status_code=400, detail="User with this name already exists")

    user = User(**user_in.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/users/{user_id}", response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if user owns any opportunities
    owned_opps = db.query(Opportunity).filter(Opportunity.owner_id == user_id).count()
    if owned_opps > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete user: they own {owned_opps} opportunities. Reassign them first."
        )

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully", "id": user_id}


# -----------------
# COMPANIES
# -----------------

@router.get("/companies", response_model=List[CompanyOut])
def read_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Company)
    if search:
        query = query.filter(Company.name.ilike(f"%{search}%"))
    query = query.order_by(Company.name)
    return query.offset(skip).limit(limit).all()

@router.get("/companies/{company_id}", response_model=CompanyOut)
def read_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.post("/companies", response_model=CompanyOut)
def create_company(company_in: CompanyCreate, db: Session = Depends(get_db)):
    existing = db.query(Company).filter(Company.name == company_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Company with this name already exists")

    company = Company(**company_in.dict())
    db.add(company)
    db.commit()
    db.refresh(company)
    return company

@router.put("/companies/{company_id}", response_model=CompanyOut)
def update_company(company_id: int, company_in: CompanyUpdate, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    update_data = company_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(company, key, value)

    db.commit()
    db.refresh(company)
    return company

@router.delete("/companies/{company_id}")
def delete_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # Check for linked contacts
    linked_contacts = db.query(Contact).filter(Contact.company_id == company_id).count()
    if linked_contacts > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete company: {linked_contacts} contacts are linked. Unlink them first."
        )

    db.delete(company)
    db.commit()
    return {"message": "Company deleted successfully", "id": company_id}

@router.get("/companies/{company_id}/contacts", response_model=List[ContactOut])
def read_company_contacts(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return db.query(Contact).filter(Contact.company_id == company_id).all()

@router.get("/companies/{company_id}/opportunities", response_model=List[OpportunityOut])
def read_company_opportunities(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return db.query(Opportunity).filter(Opportunity.company_id == company_id).all()


# -----------------
# FORECAST
# -----------------

@router.get("/forecast/summary")
def get_forecast_summary(db: Session = Depends(get_db)):
    """Get weighted pipeline summary by stage."""
    opportunities = db.query(Opportunity).all()

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
            "probability": probability
        }

        total_value += stage_value
        total_weighted += stage_weighted

    return {
        "total_pipeline_value": total_value,
        "total_weighted_value": total_weighted,
        "by_stage": by_stage
    }

@router.get("/forecast/timeline")
def get_forecast_timeline(
    months_ahead: int = Query(12, ge=1, le=24),
    db: Session = Depends(get_db)
):
    """Get income forecast timeline by month."""
    opportunities = db.query(Opportunity).filter(
        Opportunity.expected_start_date.isnot(None)
    ).all()

    now = datetime.utcnow()
    periods = defaultdict(lambda: {"total_value": 0, "weighted_value": 0, "opportunities": []})

    for opp in opportunities:
        if not opp.expected_start_date:
            continue

        # Apply procurement delay buffer
        delay_months = PROCUREMENT_DELAY_BUFFERS.get(opp.procurement_delay or "low", 0)
        adjusted_start = opp.expected_start_date + relativedelta(months=delay_months)

        # Calculate monthly value
        duration = opp.duration_months or 1
        monthly_value = (opp.value or 0) / duration
        probability = STAGE_PROBABILITIES.get(opp.stage, 0)
        weighted_monthly = int(monthly_value * probability)

        # Distribute across months
        for month_offset in range(duration):
            income_month = adjusted_start + relativedelta(months=month_offset)

            # Only include future months within the forecast window
            if income_month < now:
                continue
            if income_month > now + relativedelta(months=months_ahead):
                continue

            period_key = income_month.strftime("%Y-%m")
            periods[period_key]["total_value"] += int(monthly_value)
            periods[period_key]["weighted_value"] += weighted_monthly
            periods[period_key]["opportunities"].append({
                "id": opp.id,
                "name": opp.name,
                "stage": opp.stage,
                "monthly_value": int(monthly_value),
                "weighted_monthly": weighted_monthly,
                "company": opp.contact.company if opp.contact else None
            })

    # Convert to sorted list
    timeline = []
    for period_key in sorted(periods.keys()):
        data = periods[period_key]
        timeline.append({
            "period": period_key,
            "total_value": data["total_value"],
            "weighted_value": data["weighted_value"],
            "opportunity_count": len(data["opportunities"]),
            "opportunities": data["opportunities"]
        })

    return {
        "months_ahead": months_ahead,
        "timeline": timeline,
        "total_forecast": sum(p["weighted_value"] for p in timeline)
    }

@router.get("/forecast/quarterly")
def get_forecast_quarterly(
    year: int = Query(None),
    db: Session = Depends(get_db)
):
    """Get income forecast by quarter."""
    if year is None:
        year = datetime.utcnow().year

    opportunities = db.query(Opportunity).filter(
        Opportunity.expected_start_date.isnot(None)
    ).all()

    quarters = {
        f"{year}-Q1": {"months": [1, 2, 3], "total_value": 0, "weighted_value": 0, "opportunities": []},
        f"{year}-Q2": {"months": [4, 5, 6], "total_value": 0, "weighted_value": 0, "opportunities": []},
        f"{year}-Q3": {"months": [7, 8, 9], "total_value": 0, "weighted_value": 0, "opportunities": []},
        f"{year}-Q4": {"months": [10, 11, 12], "total_value": 0, "weighted_value": 0, "opportunities": []},
    }

    for opp in opportunities:
        if not opp.expected_start_date:
            continue

        delay_months = PROCUREMENT_DELAY_BUFFERS.get(opp.procurement_delay or "low", 0)
        adjusted_start = opp.expected_start_date + relativedelta(months=delay_months)

        duration = opp.duration_months or 1
        monthly_value = (opp.value or 0) / duration
        probability = STAGE_PROBABILITIES.get(opp.stage, 0)
        weighted_monthly = int(monthly_value * probability)

        for month_offset in range(duration):
            income_month = adjusted_start + relativedelta(months=month_offset)

            if income_month.year != year:
                continue

            # Find which quarter this month belongs to
            for q_name, q_data in quarters.items():
                if income_month.month in q_data["months"]:
                    q_data["total_value"] += int(monthly_value)
                    q_data["weighted_value"] += weighted_monthly
                    # Add opp reference if not already there
                    if not any(o["id"] == opp.id for o in q_data["opportunities"]):
                        q_data["opportunities"].append({
                            "id": opp.id,
                            "name": opp.name,
                            "stage": opp.stage,
                            "value": opp.value,
                            "weighted_value": opp.weighted_value,
                            "company": opp.contact.company if opp.contact else None
                        })
                    break

    result = []
    for q_name in sorted(quarters.keys()):
        q_data = quarters[q_name]
        result.append({
            "period": q_name,
            "total_value": q_data["total_value"],
            "weighted_value": q_data["weighted_value"],
            "opportunity_count": len(q_data["opportunities"]),
            "opportunities": q_data["opportunities"]
        })

    return {"year": year, "quarters": result}


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
def read_contacts(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Max records to return"),
    search: Optional[str] = Query(None, description="Search in name, email, or company"),
    company: Optional[str] = Query(None, description="Filter by company name"),
    db: Session = Depends(get_db)
):
    query = db.query(Contact)

    # Apply search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Contact.name.ilike(search_term)) |
            (Contact.email.ilike(search_term)) |
            (Contact.company.ilike(search_term))
        )

    # Apply company filter
    if company:
        query = query.filter(Contact.company.ilike(f"%{company}%"))

    # Sort by company, then name
    query = query.order_by(Contact.company, Contact.name)

    # Apply pagination
    contacts = query.offset(skip).limit(limit).all()
    return contacts

@router.get("/contacts/{contact_id}", response_model=ContactOut)
def read_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

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

@router.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    # Check if contact has any opportunities
    linked_opps = db.query(Opportunity).filter(Opportunity.contact_id == contact_id).count()
    if linked_opps > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete contact: they are linked to {linked_opps} opportunities. Unlink them first."
        )

    # Delete related activities first
    db.query(Activity).filter(Activity.contact_id == contact_id).delete()

    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted successfully", "id": contact_id}

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
def read_opportunities(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Max records to return"),
    stage: Optional[str] = Query(None, description="Filter by stage"),
    owner_id: Optional[int] = Query(None, description="Filter by owner"),
    db: Session = Depends(get_db)
):
    query = db.query(Opportunity)

    if stage:
        query = query.filter(Opportunity.stage == stage)
    if owner_id:
        query = query.filter(Opportunity.owner_id == owner_id)

    opps = query.offset(skip).limit(limit).all()
    return opps

@router.get("/opportunities/{opp_id}", response_model=OpportunityOut)
def read_opportunity(opp_id: int, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opp

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

@router.delete("/opportunities/{opp_id}")
def delete_opportunity(opp_id: int, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    # Delete related activities first
    db.query(Activity).filter(Activity.opportunity_id == opp_id).delete()

    db.delete(opp)
    db.commit()
    return {"message": "Opportunity deleted successfully", "id": opp_id}


# -----------------
# ACTIVITIES
# -----------------

@router.get("/activities", response_model=List[ActivityOut])
def read_activities(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Max records to return"),
    contact_id: Optional[int] = Query(None, description="Filter by contact"),
    opportunity_id: Optional[int] = Query(None, description="Filter by opportunity"),
    activity_type: Optional[str] = Query(None, description="Filter by type (Email, Call, etc.)"),
    db: Session = Depends(get_db)
):
    query = db.query(Activity)

    if contact_id:
        query = query.filter(Activity.contact_id == contact_id)
    if opportunity_id:
        query = query.filter(Activity.opportunity_id == opportunity_id)
    if activity_type:
        query = query.filter(Activity.type == activity_type)

    # Order by most recent first
    query = query.order_by(Activity.timestamp.desc())

    activities = query.offset(skip).limit(limit).all()
    return activities

@router.get("/activities/{activity_id}", response_model=ActivityOut)
def read_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity

@router.post("/activities", response_model=ActivityOut)
def create_activity(activity_in: ActivityCreate, db: Session = Depends(get_db)):
    # Validate contact exists
    contact = db.query(Contact).filter(Contact.id == activity_in.contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail=f"Contact with id {activity_in.contact_id} not found")

    # Validate opportunity exists if provided
    if activity_in.opportunity_id:
        opp = db.query(Opportunity).filter(Opportunity.id == activity_in.opportunity_id).first()
        if not opp:
            raise HTTPException(status_code=404, detail=f"Opportunity with id {activity_in.opportunity_id} not found")

    activity = Activity(**activity_in.dict())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

@router.put("/activities/{activity_id}", response_model=ActivityOut)
def update_activity(activity_id: int, activity_in: ActivityUpdate, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    update_data = activity_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(activity, key, value)

    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

@router.delete("/activities/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    db.delete(activity)
    db.commit()
    return {"message": "Activity deleted successfully", "id": activity_id}
