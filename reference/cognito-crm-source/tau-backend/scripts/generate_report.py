import sys
import os
import logging
from typing import List

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.models import Contact, Opportunity

def generate_report():
    db: Session = SessionLocal()
    
    # ---------------------------------------------------------
    # TABLE 1: CONTACTS BY COMPANY
    # ---------------------------------------------------------
    contacts = db.query(Contact).order_by(Contact.company, Contact.is_primary.desc(), Contact.name).all()
    
    print("\n" + "="*80)
    print(f"{'CONTACTS REPORT':^80}")
    print("="*80)
    print(f"{'Company':<20} | {'Name':<25} | {'Email':<35} | {'Primary'}")
    print("-" * 88)
    
    for c in contacts:
        primary_mark = "YES" if c.is_primary else ""
        # Truncate for display if needed
        comp = (c.company[:18] + '..') if c.company and len(c.company) > 20 else (c.company or "Unknown")
        name = (c.name[:23] + '..') if c.name and len(c.name) > 25 else (c.name or "Unknown")
        email = (c.email[:33] + '..') if c.email and len(c.email) > 35 else (c.email or "")
        
        print(f"{comp:<20} | {name:<25} | {email:<35} | {primary_mark}")
    
    print("="*88 + "\n")

    # ---------------------------------------------------------
    # TABLE 2: DEALS & OPPORTUNITIES
    # ---------------------------------------------------------
    opportunities = db.query(Opportunity).all()
    
    print("\n" + "="*80)
    print(f"{'OPPORTUNITIES & LEADS':^80}")
    print("="*80)
    print(f"{'Opportunity Name':<30} | {'Company':<20} | {'Stage':<10} | {'Value':<10} | {'Primary Contact'}")
    print("-" * 100)
    
    if not opportunities:
        print("No opportunities found.")
    
    for op in opportunities:
        # Get associated contact info
        contact_name = op.contact.name if op.contact else "N/A"
        company_name = op.contact.company if op.contact else "N/A"
        
        op_name = (op.name[:28] + '..') if op.name and len(op.name) > 30 else (op.name or "Untitled")
        comp = (company_name[:18] + '..') if len(company_name) > 20 else company_name
        
        print(f"{op_name:<30} | {comp:<20} | {op.stage:<10} | {op.value:<10} | {contact_name}")

    print("="*100 + "\n")
    db.close()

if __name__ == "__main__":
    generate_report()
