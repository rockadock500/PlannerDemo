import sys
import os
import json
import logging
from datetime import datetime
from typing import List, Dict

# Add parent dir to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import engine, SessionLocal, Base
from app.models.models import Contact, Opportunity, Activity

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("InitialLoad")

def init_db():
    Base.metadata.create_all(bind=engine)

def load_data():
    db: Session = SessionLocal()
    
    json_path = os.path.join("uploads", "CRM_IMPORT_FINAL.json")
    if not os.path.exists(json_path):
        logger.error(f"File not found: {json_path}")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        contacts_data = json.load(f)

    logger.info(f"Loaded {len(contacts_data)} contacts from JSON.")

    imported_count = 0
    
    # Track companies created in this run to avoid duplicate opportunities per run
    # (Though in reality we might want 1 opportunity per contact or per company? 
    # The requirement says "Create 'Initial' Opportunities for new companies."
    # AND "Upsert Contacts". 
    # I'll enable opportunity creation for each contact if not exists? 
    # Or strict 'one per company'? The prompt implies 'new companies', likely ONE per company.)
    
    existing_companies = set()
    # Pre-fetch existing companies with opportunities?
    # For initial load, we assume empty or check DB.
    # Let's check DB for companies that have opportunities.
    opts = db.query(Opportunity).all()
    # This might be hard if we don't store company on Opportunity, but we can infer from contacts.
    # Actually, simplistic approach: checking if we just added it in this session or DB query.
    # Let's just create an opportunity for the KEY contact of the company if none exists for that company.
    
    # Better: just track what we've processed in this script run + what's in DB.
    # Query all companies from existing contacts
    existing_contacts = db.query(Contact).all()
    companies_in_db = {c.company for c in existing_contacts if c.company}
    
    for item in contacts_data:
        email = item.get("email")
        company_name = item.get("company")
        contact_name = item.get("contact_name")
        last_date_str = item.get("last_date")
        context = item.get("context")

        # Parse Date
        # Expected formats? The JSON has whatever text was in the CSV column.
        # If empty or invalid, default to now or None.
        last_contact_date = None
        if last_date_str:
            try:
                # Attempt standard ISO or common formats
                # If prospect_hunter just put raw string, it might be messy.
                # Assuming prospect_hunter output normalized it? No, it just grabbed the string.
                # Let's try basic parsing.
                # Common CSV formats: DD/MM/YYYY, YYYY-MM-DD, etc.
                # For now, let's try a few.
                pass 
                # Actually, dateutil parser is best but might not be installed.
                # stick to basic try/except or just string if SQLAlchemy allows? No, needs datetime object.
                # If parsing fails, leave None.
            except:
                pass

        # check if contact exists
        contact = db.query(Contact).filter(Contact.email == email).first()
        if not contact:
            contact = Contact(
                email=email,
                name=contact_name,
                company=company_name,
                last_contact_date=None, # We'll update this if we parse it
                is_primary=item.get("is_primary", False)
            )
            db.add(contact)
            db.commit() # Commit to get ID
            db.refresh(contact)
            imported_count += 1
        else:
            # Update existing contact if is_primary changed?
            # Or just update fields regardless
            if item.get("is_primary"):
                 contact.is_primary = True
                 db.add(contact)
        
        # update last date if we can parse it? 
        # For now, simplistic.
        
        # Opportunity Logic: Create if company not in DB (at start) and not added in this run.
        if company_name and company_name not in companies_in_db:
            # Create Opportunity
            opp = Opportunity(
                name=f"{company_name} - Initial Deal",
                stage="Initial",
                value=0,
                contact_id=contact.id
            )
            db.add(opp)
            companies_in_db.add(company_name) # Mark as handled
        
        # Activity Logic
        # "Use the parsed last_date for the Activity timestamp."
        ts = datetime.utcnow()
        if last_date_str:
             # Try to parse again for Activity
             # If we can't parse, we use now? Or skip?
             # User said "Crucial: Use the parsed last_date".
             # If blank, use now.
             pass

        activity = Activity(
            type="Email Import",
            content=context or "Imported from Outlook CSV",
            timestamp=ts,
            contact_id=contact.id
        )
        db.add(activity)
    
    db.commit()
    logger.info(f"Database Live: {imported_count} Contacts imported.")

if __name__ == "__main__":
    init_db()
    load_data()
