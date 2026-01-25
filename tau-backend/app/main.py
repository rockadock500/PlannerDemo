from fastapi import FastAPI
from app.core.config_loader import ConfigEngine
import sys
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.api.cognito_routes import router as cognito_router

app = FastAPI(title="Tau CRM Backend")

# CORS Configuration
origins = [
    "http://localhost:5173", # Vite Default
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://tau-crm-frontend-production.up.railway.app", # Production Frontend
    "*" # For local dev ease
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.include_router(cognito_router, prefix="/api")

@app.on_event("startup")
def startup_event():
    logger.info("Starting up Tau CRM Backend...")
    try:
        # Create Tables if they don't exist
        from app.core.database import engine, Base
        # Explicitly import models to register them
        from app.models.models import Contact, Opportunity, User, Activity, Company
        
        logger.info(f"Registered tables: {list(Base.metadata.tables.keys())}")
        
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created.")

        # Run migrations for new columns
        from sqlalchemy import text
        with engine.connect() as conn:
            try:
                # Add all potentially missing columns
                migrations = [
                    'ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS company_id INTEGER',
                    'ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE',
                    'ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP',
                    'ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS expected_start_date TIMESTAMP',
                    'ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS duration_months INTEGER DEFAULT 1',
                    'ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS procurement_delay VARCHAR(10) DEFAULT \'low\'',
                ]
                for sql in migrations:
                    try:
                        conn.execute(text(sql))
                    except Exception as e:
                        logger.warning(f"Migration skipped: {e}")
                conn.commit()
                logger.info("Database migrations applied.")
            except Exception as e:
                logger.warning(f"Migration note: {e}")

        # Load configs from the 'configs' directory relative to where the app is run
        # Expecting to run from 'tau-backend' root
        ConfigEngine.load("configs")
    except Exception as e:
        logger.critical(f"Startup failed due to config error: {e}")
        # In a real deployment, we might let the exception bubble up to crash the worker
        # But we can also sys.exit to be explicit
        sys.exit(1)

@app.get("/health")
def health_check():
    return {
        "status": "active",
        "configs_loaded": ConfigEngine.get_all_config_names()
    }

@app.get("/version")
def get_version():
    return {"version": "2025-01-25-v2", "deployed": True}

@app.get("/debug-env")
def debug_env():
    import os
    db_url = os.getenv("DATABASE_URL", "Not Set")
    return {
        "database_url_prefix": db_url.split("://")[0] if "://" in db_url else db_url,
        "is_sqlite": "sqlite" in db_url,
        "cwd": os.getcwd()
    }

@app.get("/debug-contacts")
def debug_contacts():
    """Debug endpoint to catch contact loading errors."""
    try:
        from app.core.database import SessionLocal
        from app.models.models import Contact
        from sqlalchemy.orm import joinedload

        db = SessionLocal()
        try:
            contacts = db.query(Contact).options(joinedload(Contact.company_rel)).limit(5).all()
            return {"status": "ok", "count": len(contacts), "first": contacts[0].name if contacts else None}
        finally:
            db.close()
    except Exception as e:
        import traceback
        return {"status": "error", "error": str(e), "traceback": traceback.format_exc()}
