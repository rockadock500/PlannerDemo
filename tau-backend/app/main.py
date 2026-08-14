from contextlib import asynccontextmanager
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
from app.mcp.server import mcp_app

def _run_startup():
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
                    'ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()',
                    'ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()',
                    'ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company_id INTEGER',
                    'ALTER TABLE contacts ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE',
                    'DROP INDEX IF EXISTS ix_contacts_email',  # Remove unique email constraint
                    'ALTER TABLE contacts DROP CONSTRAINT IF EXISTS contacts_email_key',  # Remove PG unique constraint
                    'ALTER TABLE contacts DROP CONSTRAINT IF EXISTS uq_contacts_email',  # Alternative constraint name
                    # Google OAuth identity + MCP allowlist flag. Must run here (not
                    # only in migrations/migrate.py, which nothing invokes on deploy) —
                    # the User model selects these columns, so a boot without them
                    # breaks every users query, not just MCP.
                    'ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR',
                    'ALTER TABLE users ADD COLUMN IF NOT EXISTS mcp_authorized BOOLEAN DEFAULT FALSE',
                    'UPDATE users SET mcp_authorized = FALSE WHERE mcp_authorized IS NULL',
                    'CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users (email)',
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Existing DB/config startup, then FastMCP session manager lifespan
    _run_startup()
    async with mcp_app.lifespan(app):
        yield


# Merge MCP routes at /mcp (avoids Mount redirect /mcp -> /mcp/ that can drop auth headers)
app = FastAPI(
    title="Tau CRM Backend",
    lifespan=lifespan,
    routes=[*mcp_app.routes],
)

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
# NOTE: /mcp* auth is no longer an HTTP middleware here. FastMCP's GoogleProvider
# guards the MCP routes itself, and a blanket middleware would 401 its own
# /authorize, /token, /register and /.well-known/* endpoints before they ran.

app.include_router(api_router, prefix="/api")
app.include_router(cognito_router, prefix="/api")

@app.get("/health")
def health_check():
    return {
        "status": "active",
        "configs_loaded": ConfigEngine.get_all_config_names()
    }

@app.get("/version")
def get_version():
    return {"version": "2025-01-25-v3", "deployed": True}

@app.get("/run-migrations")
def run_migrations():
    """Manually run migrations and report results."""
    from app.core.database import engine
    from sqlalchemy import text, inspect

    results = []
    inspector = inspect(engine)

    # Get current columns
    opp_cols = [c['name'] for c in inspector.get_columns('opportunities')]
    results.append(f"Current opportunity columns: {opp_cols}")

    migrations = [
        'ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()',
        'ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()',
    ]

    with engine.connect() as conn:
        for sql in migrations:
            try:
                conn.execute(text(sql))
                results.append(f"OK: {sql[:50]}...")
            except Exception as e:
                results.append(f"FAIL: {sql[:50]}... - {e}")
        conn.commit()

    # Check again
    inspector = inspect(engine)
    opp_cols_after = [c['name'] for c in inspector.get_columns('opportunities')]
    results.append(f"After migration columns: {opp_cols_after}")

    return {"results": results}

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
