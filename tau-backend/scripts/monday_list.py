import sys
import os
import logging
from typing import List

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.models import Contact, Opportunity

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MondayEmailList")

TARGETS = [
    "Tombola", "DVNT", "Experian", "Funnelfuel", "Conde Nast", "Multilocal"
]

def generate_email_list():
    db: Session = SessionLocal()
    
    print("\n" + "="*80)
    print(f"{'MONDAY MORNING HIT LIST':^80}")
    print("="*80)
    print(f"{'Company':<20} | {'Contact':<25} | {'Email':<30} | {'Owner'}")
    print("-" * 85)
    
    for company_key in TARGETS:
        # Search for contact
        # Specific overrides from prompt:
        # James at Tombola
        # Gareth at DVNT
        # Karl at Funnelfuel
        # Deb at Conde Nast
        # Fern at Multilocal
        
        # We try to smart match based on these hints + company Match
        
        # 1. Broad company search
        contacts = db.query(Contact).filter(Contact.company.ilike(f"%{company_key}%")).all()
        
        best_contact = None
        
        # Specific filtering logic
        normalized_key = company_key.lower()
        
        if normalized_key == "tombola":
            best_contact = next((c for c in contacts if "james" in c.name.lower()), None)
        elif normalized_key == "dvnt":
            # Prompt said "Gareth", do we have him? 
            # In previous step we imported DVNT as placeholder "info@dvnt.com".
            # We likely need to CREATE Gareth.
            pass
        elif normalized_key == "funnelfuel":
             best_contact = next((c for c in contacts if "karl" in c.name.lower() or "will" in c.name.lower()), None) 
             # Prompt said Karl.
        elif normalized_key == "conde nast":
             best_contact = next((c for c in contacts if "deb" in c.name.lower() or "deborah" in c.name.lower()), None)
        elif normalized_key == "multilocal":
             best_contact = next((c for c in contacts if "fern" in c.name.lower()), None)
             
        # Fallback to Primary
        if not best_contact and contacts:
            best_contact = next((c for c in contacts if c.is_primary), contacts[0])
            
        # If still null (e.g. Gareth missing), create him?
        # User said "Gareth at DVNT... gareth.i.owen@gmail.com" from image text? 
        # Actually image text had "gareth.i.owen@gmail.com". I missed parsing that text row!
        # I should manually fix Gareth here.
        if normalized_key == "dvnt" and (not best_contact or "placeholder" in best_contact.name.lower()):
            # Create Gareth
            gareth = Contact(name="Gareth Owen", email="gareth.i.owen@gmail.com", company="DVNT", is_primary=True)
            db.add(gareth)
            db.commit()
            best_contact = gareth
            
        if best_contact:
            # Get Owner from Opportunity
            opp = db.query(Opportunity).filter(Opportunity.contact_id == best_contact.id).first()
            if not opp:
                # Check ANY opp for company
                opp = db.query(Opportunity).join(Contact).filter(Contact.company == best_contact.company).first()
                
            owner_name = opp.owner.name if (opp and opp.owner) else "Unassigned"
            
            # Print row
            c_name = best_contact.name
            c_email = best_contact.email
            print(f"{company_key:<20} | {c_name:<25} | {c_email:<30} | {owner_name}")
        else:
            print(f"{company_key:<20} | {'MISSING':<25} | {'--':<30} | --")

    print("="*85 + "\n")
    db.close()

if __name__ == "__main__":
    generate_email_list()
