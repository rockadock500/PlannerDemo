import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Check for DATABASE_URL (Railway/Prod) or fallback to SQLite (Local)
# Treat empty string as unset (common when .env has DATABASE_URL= placeholder)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./tau.db"

import logging
logger = logging.getLogger(__name__)
logger.info(f"Database URL detected: {SQLALCHEMY_DATABASE_URL.split('://')[0]}://...")


connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # Fix for Postgres URLs in SQLAlchemy < 1.4/2.0 compat (Railway returns postgres:// sometimes)
    if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    # Force SSL for Postgres (required by many cloud providers including Railway)
    connect_args = {"sslmode": "require"}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
