import sys
import os
import logging
from sqlalchemy.orm import Session

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.models import Contact, Opportunity

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("PipelineImport")

# Data extracted from the image
# Format: (Client, Workstream, Confirmed %, Owner)
PIPELINE_DATA = [
    ("The 7Stars", "Media Planner (Digital)", 100, "Andy"),
    ("The 7Stars", "Gravity Planner", 100, "Andy"),
    ("The 7Stars", "Paid Media", 100, "Andy"),
    ("Intermedia", "Discovery > Paid Media", 100, "Ruarri"),
    ("PPL", "Discovery > Media Planner", 100, "David"),
    ("Midnite", "CRM", 100, "David"),
    ("SMG", "Automation", 100, "David"),
    ("Proofpoint", "Custom GPTs", 100, "Jill"),
    ("Sainsburys", "Chatbot", 100, "Jill"),
    ("Zepz", "Data Consultancy", 100, "Rob"),
    ("Tombola", "Data Consultancy", 100, "Rob"),
    ("RGE", "Automation", 100, "Jill"),
    ("MIQ", "Media Planner", 100, "Zuzanna"),
    ("Howden", "Data Consultancy > Automation", 100, "Rob"),
    ("Bountiful Cow", "Automation", 80, "David"),
    ("Midnite", "Paid Media", 80, "David"),
    ("Midnite", "Affiliate", 80, "David"),
    ("Sainsburys", "SKU Project (Scoping)", 80, "Jill"),
    ("Sainsburys", "Insights Generator (Scoping)", 80, "Jill"),
    ("Expedia", "Automation", 80, "Jill"),
    ("Proofpoint", "Data Consultancy", 80, "Ruarri"),
    ("Rover", "Paid Media", 80, "Andy"),
    ("Legend", "Automation", 80, "David"),
    ("Holley", "Paid Media", 80, "Andy"),
    ("MediaMath", "Media Planner", 80, "Rob"),
    ("Amplifyd", "Paid Media", 80, "Rob"),
    ("William Grant & Sons", "Discovery > Media Planner", 80, "Rob"),
    ("Goodstuff", "Workshop", 40, "Rob"),
    ("Experian", "Data Consultancy > Media Optimiser", 80, "Andy"),
    ("Sainsburys", "Training - Vibe-coding part 2", 80, "Jill")
]

def get_stage(confirmed_pct):
    if confirmed_pct == 100:
        return "Signed"
    elif confirmed_pct >= 80:
        return "Verbal"
    else:
        return "Proposal"

def import_pipeline():
    db: Session = SessionLocal()
    
    logger.info("Starting Pipeline Import...")
    
    imported_count = 0
    
    for client_name, workstream, confirmed, owner in PIPELINE_DATA:
        # 1. Find or Create Company/Contact
        # We try to find ANY contact for this company to attach the deal to.
        # If none exists, we create a placeholder: "Unknown [Client] Contact"
        
        # Normalize Name lookup (simple case insensitive)
        # Note: The DB has "The 7Stars" but list might have "The7Stars" (ignoring spaces helps)
        # We'll use ILIKE logic or python check
        
        # Search for existing contact by company name
        # We grab the first one found (ideally Primary)
        contact = db.query(Contact).filter(Contact.company.ilike(f"%{client_name}%")).order_by(Contact.is_primary.desc()).first()
        
        if not contact:
            # Create Placeholder
            logger.info(f"Creating placeholder contact for {client_name}")
            contact = Contact(
                name=f"Placeholder ({client_name})",
                email=f"placeholder@{client_name.replace(' ', '').lower()}.com", # Fake email
                company=client_name,
                is_primary=True
            )
            db.add(contact)
            db.commit()
            db.refresh(contact)
            
        # 2. Create/Update Opportunity
        # Check if this specific workstream exists for this contact/company?
        # A simple check: Name + Contact match
        opp_name = f"{client_name} - {workstream}"
        
        existing_opp = db.query(Opportunity).filter(
            Opportunity.name == opp_name,
            Opportunity.contact_id == contact.id
        ).first()
        
        stage = get_stage(confirmed)
        
        if existing_opp:
            existing_opp.stage = stage
            existing_opp.value = 0 # Placeholder value
            # Assuming 'Owner' logic needs a User model which we don't have yet. 
            # We'll skip assigning internal owner for now or put in notes if we had a notes field.
        else:
            # Check if we have a generic "Initial Deal" for this company and recycle it?
            # If we just created the DB, we have "[Company] - Initial Deal".
            # Let's rename the "Initial Deal" if it exists and is unused, OR just create new ones.
            # Renaming avoids clutter.
            generic_opp = db.query(Opportunity).filter(
                Opportunity.name == f"{client_name} - Initial Deal",
                Opportunity.contact_id == contact.id
            ).first()
            
            if generic_opp:
                generic_opp.name = opp_name
                generic_opp.stage = stage
            else:
                new_opp = Opportunity(
                    name=opp_name,
                    stage=stage,
                    value=0,
                    contact_id=contact.id
                )
                db.add(new_opp)
        
        imported_count += 1
        
    db.commit()
    logger.info(f"Pipeline Import Complete. Processed {imported_count} deals.")
    db.close()

if __name__ == "__main__":
    import_pipeline()
