"""
Grant (or revoke) MCP connector access for a TAU email address.

The MCP server authenticates with Google OAuth but authorizes against this
allowlist: a `users` row whose email matches and whose mcp_authorized flag is
set. This script is the supported way to manage that — the REST /users endpoint
is unauthenticated and deliberately cannot set the flag.

Adding a user here does NOT make them the owner of any opportunity;
opportunities.owner_id is a nullable FK, so a row that nothing points at is
invisible in the CRM.

Usage (from tau-backend):
  python scripts/add_mcp_authorized_user.py --email ethan.buckley@taums.ai --name "Ethan Buckley"
  python scripts/add_mcp_authorized_user.py --email someone@taums.ai --revoke
  python scripts/add_mcp_authorized_user.py --list
  python scripts/add_mcp_authorized_user.py --email x@taums.ai --dry-run
"""
import argparse
import logging
import os
import sys

_BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(_BACKEND_ROOT)

# app.core.database reads DATABASE_URL at import time and silently falls back to
# a local sqlite file if it is unset — so .env must be loaded BEFORE that import,
# or this script quietly edits the wrong database.
from dotenv import load_dotenv  # noqa: E402

load_dotenv(os.path.join(_BACKEND_ROOT, ".env"))

from sqlalchemy import func  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402

from app.core.database import SQLALCHEMY_DATABASE_URL, SessionLocal  # noqa: E402
from app.models.models import User  # noqa: E402

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AddMcpAuthorizedUser")


def find_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(func.lower(User.email) == email).first()


def find_by_name(db: Session, name: str) -> User | None:
    """users.name is unique, so an existing row must be reused, not duplicated."""
    return db.query(User).filter(User.name == name).first()


def derive_name(email: str) -> str:
    """'ethan.buckley@taums.ai' -> 'Ethan Buckley'."""
    local = email.split("@", 1)[0]
    return " ".join(part.capitalize() for part in local.replace("_", ".").split(".") if part)


def list_authorized(db: Session) -> None:
    rows = db.query(User).filter(User.email.isnot(None)).order_by(User.name).all()
    if not rows:
        logger.info("No users have an email set.")
        return
    logger.info("%-28s %-34s %s", "NAME", "EMAIL", "MCP")
    for user in rows:
        logger.info("%-28s %-34s %s", user.name, user.email, "yes" if user.mcp_authorized else "no")


def apply_change(db: Session, email: str, name: str | None, authorized: bool, dry_run: bool) -> None:
    user = find_by_email(db, email)

    if user is None:
        display_name = name or derive_name(email)
        existing = find_by_name(db, display_name)
        if existing is not None:
            # Someone already in the CRM (an opportunity owner, say) — attach the
            # email to that row rather than creating a duplicate person.
            logger.info("Matched existing user by name: %s (id=%s)", existing.name, existing.id)
            user = existing
        else:
            if dry_run:
                logger.info("[dry-run] Would create user %r with email %s", display_name, email)
                return
            user = User(name=display_name, email=email, mcp_authorized=authorized)
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info("Created user %r (id=%s), mcp_authorized=%s", user.name, user.id, authorized)
            return

    if user.email == email and bool(user.mcp_authorized) == authorized:
        logger.info("No change needed: %s already mcp_authorized=%s", email, authorized)
        return

    if dry_run:
        logger.info(
            "[dry-run] Would set email=%s mcp_authorized=%s on user %r (id=%s)",
            email, authorized, user.name, user.id,
        )
        return

    user.email = email
    user.mcp_authorized = authorized
    db.commit()
    logger.info("Updated user %r (id=%s): mcp_authorized=%s", user.name, user.id, authorized)


def main() -> None:
    parser = argparse.ArgumentParser(description="Manage the MCP allowlist in the users table.")
    parser.add_argument("--email", help="Email address to authorize (case-insensitive).")
    parser.add_argument("--name", help="Display name for a new user row. Derived from the email if omitted.")
    parser.add_argument("--revoke", action="store_true", help="Clear mcp_authorized instead of setting it.")
    parser.add_argument("--list", action="store_true", help="Show every user that has an email set.")
    parser.add_argument("--dry-run", action="store_true", help="Report what would change without writing.")
    args = parser.parse_args()

    if not args.list and not args.email:
        parser.error("one of --email or --list is required")

    # Always say which database is about to be touched — the sqlite fallback is
    # silent otherwise.
    scheme, _, rest = SQLALCHEMY_DATABASE_URL.partition("://")
    host = rest.split("@")[-1] if "@" in rest else rest
    logger.info("Database: %s://%s", scheme, host)
    if scheme.startswith("sqlite"):
        logger.warning("This is a LOCAL sqlite database, not production.")

    db = SessionLocal()
    try:
        if args.list:
            list_authorized(db)
            return

        email = args.email.strip().lower()
        if "@" not in email:
            parser.error(f"not a valid email address: {args.email!r}")

        apply_change(db, email, args.name, authorized=not args.revoke, dry_run=args.dry_run)
    finally:
        db.close()


if __name__ == "__main__":
    main()
