from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.config_loader import ConfigEngine
import os
import secrets
import sys
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.api.routes import router as api_router
from app.api.cognito_routes import router as cognito_router
from app.api.auth_routes import auth_api_router, web_auth_router
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
                    'CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users (email)',
                    # NOTE: users.mcp_authorized was dropped from production by a
                    # one-shot 'ALTER TABLE ... DROP COLUMN' that lived here in
                    # 7bde814 and was removed once it had run. MCP access is
                    # users.email plus the domain floor in auth_google.py. A database
                    # restored from before that commit will keep a vestigial
                    # mcp_authorized column; nothing reads it, so it is harmless.
                    # Hides MCP-only rows from the frontend's owner pickers. Same
                    # reasoning as above: the User model selects this column, so it
                    # must exist before any users query runs.
                    'ALTER TABLE users ADD COLUMN IF NOT EXISTS hidden_from_owners BOOLEAN DEFAULT FALSE',
                    'UPDATE users SET hidden_from_owners = FALSE WHERE hidden_from_owners IS NULL',
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


# Merge MCP routes at /mcp (avoids Mount redirect /mcp -> /mcp/ that can drop auth headers).
# mcp_app's middleware must come across with its routes: FastMCP installs the
# bearer-token authentication middleware at the app level, while the /mcp route
# itself only carries the require-auth guard. Copying routes alone keeps the guard
# but loses the verifier, so every authenticated request 401s with invalid_token
# before check_mcp_allowlist is ever reached.
app = FastAPI(
    title="Tau CRM Backend",
    lifespan=lifespan,
    routes=[*mcp_app.routes],
    middleware=[*mcp_app.user_middleware],
)

# CORS Configuration
# No "*" here, deliberately: allow_credentials=True below, and browsers refuse to
# send credentials to a wildcard origin. The web login's session cookie is
# cross-site (frontend and backend are different hosts), so a wildcard would break
# sign-in while looking like a server fault.
origins = [
    "http://localhost:5173", # Vite Default
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://tau-crm-frontend-production.up.railway.app", # Production Frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Signed-cookie session for the web login. same_site="none" because the frontend
# and backend are different hosts (and up.railway.app is a public suffix, so a
# shared parent-domain cookie is impossible) — the cookie belongs to this host and
# travels on credentialed XHR. A missing SESSION_SECRET must not stop the app from
# booting, so fall back to an ephemeral key and let auth_web's
# is_web_login_configured() refuse logins instead: sessions would not survive a
# restart, and silently signing them with a throwaway key is worse than a 503.
_session_secret = os.getenv("SESSION_SECRET", "").strip()
if not _session_secret:
    logger.critical(
        "SESSION_SECRET is not set — the web login at /auth/web/login will return 503. "
        "The REST API and MCP are unaffected."
    )
    _session_secret = secrets.token_urlsafe(32)

app.add_middleware(
    SessionMiddleware,
    secret_key=_session_secret,
    same_site="none",
    https_only=True,
)
# NOTE: /mcp* auth is no longer an HTTP middleware here. FastMCP's GoogleProvider
# guards the MCP routes itself, and a blanket middleware would 401 its own
# /authorize, /token, /register and /.well-known/* endpoints before they ran.

app.include_router(api_router, prefix="/api")
app.include_router(cognito_router, prefix="/api")
# Web login. /auth/web/* sits at the root so the callback matches the URI
# registered on the Google client; /api/auth/* is mounted separately so it stays
# reachable when /api gets its session guard — it is how the frontend checks
# whether it is signed in.
app.include_router(web_auth_router)
app.include_router(auth_api_router, prefix="/api")

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
