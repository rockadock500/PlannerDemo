import sys
import os
import logging
from sqlalchemy.orm import Session

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine, Base
from app.models.models import Contact, Opportunity, User

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AssignOwners")

# Resource Allocation Data
# Name, Allocation Score, Role (Default 'Member')
RESOURCES = [
    ("Rob", 40, "Lead"),
    ("David", 20, "Lead"),
    ("Andy", 10, "Senior"),
    ("James", 10, "Senior"),
    ("Jill", 2.5, "Member"),
    ("Greg", 2.5, "Member"),
    ("Rowly", 2.5, "Member"),
    ("Ross", 2, "Member"),
    ("Jack", 2, "Member"),
    ("Jay", 2, "Member"),
    ("TAUT", 0.5, "System"),
    ("SD", 2, "Member"),
    ("New Senior", 2, "Senior") # Will appear twice in DB if name unique? No, unique constraint.
]

# Client Ownership Map (Explicit assignments)
# If not here, use default logic (Round robin or default to Rob/David?)
# Prompt says: "IF in doubt put me (Rob) for now."
CLIENT_OWNER_MAP = {
    "Proofpoint": "David",
    "The 7Stars": "David", # User requested David for 7Stars, but Pipeline image said Andy? 
                           # User said: "Some should be David Wiltshire (Proofpoint, 7Stars)"
                           # I will follow these latest instructions over the image.
    "Sainsburys": "Jill",
    "Expedia": "Jill",
    "Intermedia": "Ruarri", # Ruarri not in resource list? need to add him.
    "Tombola": "James",
    "DVNT": "Gareth", # Wait, email implies contact "Gareth", not internal owner?
                      # "I also want you to give me a list of companies I should email... Gareth at DVNT"
                      # Means Gareth is the CLIENT CONTACT. Owner is likely Rob (default).
    "Experian": "Rob", # Default? Or "Experian" in list "I should email next week".
    "Funnelfuel": "Rob", # "Karl at funnelfuel" is contact.
    "Condenast": "Rob", # "Deb at Condenast" is contact.
    "Multilocal": "Rob", # "Fern at multilocal" is contact.
    "Project 5": "David", # From image
    "Awaze": "James", # From image
    "Fanduel": "Greg", # From image "fanduel: Greg"
    "Vodafone": "Rowly", # From image
    "Lloyds": "Ross",
    "Radius": "Jack",
    "Holley": "TAUT", # From image
    "Harvest": "SD",
    "Lumen": "New Senior"
}

# New Internal Users to Add implicitly
# "Ruarri" (Intermedia)
# "David Wiltshire" -> Map "David" to "David Wiltshire" for full name display? or keep simple "David"?
# Start with simple "David" to match image, but Ruarri needs adding.

def init_users(db: Session):
    logger.info("Initializing Users...")
    
    # helper
    def upsert_user(name, points, role="Member"):
        u = db.query(User).filter(User.name == name).first()
        if not u:
            u = User(name=name, allocation=points, role=role)
            db.add(u)
        else:
            u.allocation = points
            u.role = role
        return u

    # Load standard list
    for name, pts, role in RESOURCES:
        upsert_user(name, pts, role)
        
    # Add extras mentioned
    upsert_user("Ruarri", 0, "Member") # Points unknown
    upsert_user("Zuzanna", 0, "Member") # Mentioned in prompt "Zuz Gierlinska"
    
    db.commit()

def assign_owners(db: Session):
    logger.info("Assigning Owners to Opportunities...")
    
    # Get Rob as Default
    default_user = db.query(User).filter(User.name == "Rob").first()
    
    # Iterate all opportunities
    opps = db.query(Opportunity).all()
    
    for opp in opps:
        # Determine Company Name
        # Access via contact
        if not opp.contact or not opp.contact.company:
            continue
            
        comp = opp.contact.company
        
        # Check explicit map
        # Fuzzy match key?
        owner_name = "Rob" # Default
        
        # 1. Exact/Partial Match in Map
        assigned = False
        for key, val in CLIENT_OWNER_MAP.items():
            if key.lower() in comp.lower():
                owner_name = val
                assigned = True
                break
        
        # 2. If not assigned, check pipeline image logic if achievable?
        # The image had "Owner" column.
        # We imported that into Pipeline script but didn't save owner because model didn't exist.
        # We can't re-read the variable from the other script easily unless we re-run it or import list.
        # But User's "latest instructions" override. 
        # "IF in doubt put me for now." -> So Rob is safe fallback.
        
        # Find User object
        # Handle "David" vs "David Wiltshire" mapping if needed? 
        # We created "David".
        owner = db.query(User).filter(User.name == owner_name).first()
        
        if not owner:
            # Maybe full name issue? "Andy Stevens"?
            # Try splitting?
            pass
            
        if owner:
            opp.owner_id = owner.id
        else:
            # Fallback to Rob
            opp.owner_id = default_user.id
            
    db.commit()

def run_assignments():
    # Re-create tables to add columns safely (SQLite doesn't support complex ALTERS easily without migration tool)
    # We added User table and added owner_id to Opportunity.
    # We should run alembic but we haven't configured it fully with revisions. 
    # Quick dirty way for "V1":
    # 1. Existing data is precious? Yes. 
    # 2. SQLite 'ALTER TABLE opportunities ADD COLUMN owner_id INTEGER REFERENCES users(id)' is valid.
    # 3. 'CREATE TABLE users ...' is valid.
    # SQLAlchemy `create_all` will create missing tables (User).
    # But it won't add column to existing Opportunity table.
    
    # Manual Migration for Column
    # We will try to add column via raw SQL if it fails/missing.
    
    db = SessionLocal()
    
    # Check if User table exists
    # If not, create all (should create User)
    Base.metadata.create_all(bind=engine)
    
    # Check if 'owner_id' in 'opportunities'
    try:
        db.execute("SELECT owner_id FROM opportunities LIMIT 1")
    except Exception:
        logger.info("Migrating DB: Adding owner_id column to opportunities")
        # Add column
        try:
             # SQLite specific
             # We need to use connection directly or text()
             from sqlalchemy import text
             with engine.connect() as conn:
                 conn.execute(text("ALTER TABLE opportunities ADD COLUMN owner_id INTEGER REFERENCES users(id)"))
                 conn.commit()
        except Exception as e:
            logger.error(f"Migration failed: {e}")

    init_users(db)
    assign_owners(db)
    
    logger.info("Ownership Assignment Complete.")
    db.close()

if __name__ == "__main__":
    run_assignments()
