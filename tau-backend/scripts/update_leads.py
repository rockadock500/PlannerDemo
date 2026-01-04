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
logger = logging.getLogger("LeadsUpdate")

LEADS_LIST = [
    "Project 5", "Experian", "Awaze", "Funnelfuel", "Fanduel", 
    "Vodafone", "Lloyds", "Radius", "Multilocal", "Holley", 
    "Harvest", "Lumen", "DVNT", "Conde Nast"
]

def update_data():
    db: Session = SessionLocal()
    logger.info("Starting Data Cleanup and Leads Update...")

    # ---------------------------------------------------------
    # 1. SPECIFIC CORRECTIONS
    # ---------------------------------------------------------
    
    # Expedia: Rory Paterson
    # Check if exists (by email)
    rory_email = "rpaterson@expediagroup.com"
    rory = db.query(Contact).filter(Contact.email == rory_email).first()
    if not rory:
        # Check if he exists with another email in DB? 
        # In the report we saw "stefan.bardega@idx.inc;rpaterson@.." in one field? 
        # No, let's just create/update him cleanly.
        rory = Contact(
            name="Rory Paterson",
            email=rory_email,
            company="Expedia",
            is_primary=True
        )
        db.add(rory)
        logger.info("Created Rory Paterson (Expedia)")
    else:
        rory.name = "Rory Paterson"
        rory.company = "Expedia"
        rory.is_primary = True
        logger.info("Updated Rory Paterson (Expedia)")
    
    # Set others at Expedia to not primary
    db.query(Contact).filter(Contact.company == "Expedia", Contact.email != rory_email).update({"is_primary": False})
    
    # Conde Nast: Deborah Bret
    deb_email = "deb@condenast.com"
    deb = db.query(Contact).filter(Contact.email == deb_email).first()
    if deb:
        deb.name = "Deborah Bret"
        deb.is_primary = True # Ensure
        logger.info("Updated Deborah Bret (Conde Nast)")
    
    # Vodafone: James Diba
    james_email = "james.diba@vodafone.com"
    james = db.query(Contact).filter(Contact.email == james_email).first()
    if james:
        james.is_primary = True
        logger.info("Updated James Diba (Vodafone) to Primary")
    else:
        # Create if missing
        james = Contact(name="James Diba", email=james_email, company="Vodafone", is_primary=True)
        db.add(james)
        logger.info("Created James Diba (Vodafone)")

    # Set others at Vodafone to not primary
    db.query(Contact).filter(Contact.company == "Vodafone", Contact.email != james_email).update({"is_primary": False})

    # Sainsburys: Heni Hazbay -> Argos
    heni_email = "Heni.Hazbay@sainsburys.co.uk" # Check casing from previous output or use ilike
    heni = db.query(Contact).filter(Contact.email.ilike(heni_email)).first()
    if heni:
        heni.company = "Argos"
        logger.info("Moved Heni Hazbay to company 'Argos'")
        
        # Determine new primary for Sainsburys if Heni was it? 
        # Previous primary was Isabelle.Piqueras, so we are good.
        
        # Check if Argos needs an Opportunity? Probably.
        # Check if Argos deal exists
        argos_deal = db.query(Opportunity).filter(Opportunity.name.ilike("Argos - %")).first()
        if not argos_deal:
             # Create one
             new_opp = Opportunity(name="Argos - Initial Deal", stage="Initial", value=0, contact_id=heni.id)
             db.add(new_opp)
             logger.info("Created Argos Initial Deal")

    # ---------------------------------------------------------
    # 2. PROCESS LEADS LIST
    # ---------------------------------------------------------
    for company_name in LEADS_LIST:
        # find matching contacts
        # Use simple ILIKE
        contacts = db.query(Contact).filter(Contact.company.ilike(company_name)).all()
        
        if not contacts:
            # Create Placeholder
            logger.info(f"Creating placeholder for Lead: {company_name}")
            placeholder = Contact(
                name=f"Placeholder ({company_name})",
                email=f"info@{company_name.lower().replace(' ', '')}.com",
                company=company_name,
                is_primary=True
            )
            db.add(placeholder)
            db.commit() # commit to get ID
            db.refresh(placeholder)
            target_contact = placeholder
        else:
            # Find primary
            target_contact = next((c for c in contacts if c.is_primary), contacts[0])
            
        # Ensure Opportunity Exists
        # We look for ANY opportunity for this company
        existing_opps = db.query(Opportunity).join(Contact).filter(Contact.company.ilike(company_name)).all()
        
        if not existing_opps:
            logger.info(f"Creating Initial Deal for Lead: {company_name}")
            opp = Opportunity(
                name=f"{company_name} - Initial Deal",
                stage="Initial", 
                value=0,
                contact_id=target_contact.id
            )
            db.add(opp)
        else:
            # Maybe ensure at least one is "Initial" if no others exist? 
            # The prompt says "These all need to be there... All of these are leads."
            # If we already have a Deal (e.g. from pipeline import, stage=Signed/Verbal), that supersedes "Lead".
            # We don't want to downgrade a Signed deal to Initial.
            # So we only act if NO deal exists.
            pass

    db.commit()
    logger.info("Updates Completed.")
    db.close()

if __name__ == "__main__":
    update_data()
