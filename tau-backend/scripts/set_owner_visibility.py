"""
Hide (or unhide) a user from the frontend's owner pickers.

Rows that exist only to hold an MCP identity clutter the owner dropdowns in the
pipeline view. Setting users.hidden_from_owners omits them from those pickers.
It is presentation only: a hidden user who already owns opportunities still
resolves and renders normally on them, and nothing about MCP access changes —
that is users.mcp_authorized, managed by add_mcp_authorized_user.py.

Like that script, this is the supported way to set the flag: hidden_from_owners
is exposed read-only on UserOut and deliberately absent from UserCreate, because
POST /api/users is unauthenticated.

Usage (from tau-backend):
  python scripts/set_owner_visibility.py --email ethan.buckley@taums.ai --hide
  python scripts/set_owner_visibility.py --name "Jack Bicknell" --hide
  python scripts/set_owner_visibility.py --email someone@taums.ai --show
  python scripts/set_owner_visibility.py --list
  python scripts/set_owner_visibility.py --email x@taums.ai --hide --dry-run
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
logger = logging.getLogger("SetOwnerVisibility")


def list_users(db: Session) -> None:
    rows = db.query(User).order_by(User.name).all()
    if not rows:
        logger.info("No users.")
        return
    logger.info("%-28s %-34s %s", "NAME", "EMAIL", "HIDDEN FROM OWNERS")
    for user in rows:
        logger.info(
            "%-28s %-34s %s",
            user.name,
            user.email or "-",
            "yes" if user.hidden_from_owners else "no",
        )


def apply_change(db: Session, email: str | None, name: str | None, hidden: bool, dry_run: bool) -> None:
    if email:
        user = db.query(User).filter(func.lower(User.email) == email).first()
        label = email
    else:
        user = db.query(User).filter(User.name == name).first()
        label = name

    if user is None:
        logger.error("No user found matching %r — nothing changed.", label)
        return

    if bool(user.hidden_from_owners) == hidden:
        logger.info("No change needed: %r already hidden_from_owners=%s", user.name, hidden)
        return

    if dry_run:
        logger.info(
            "[dry-run] Would set hidden_from_owners=%s on user %r (id=%s)",
            hidden, user.name, user.id,
        )
        return

    user.hidden_from_owners = hidden
    db.commit()
    logger.info("Updated user %r (id=%s): hidden_from_owners=%s", user.name, user.id, hidden)


def main() -> None:
    parser = argparse.ArgumentParser(description="Manage users.hidden_from_owners.")
    parser.add_argument("--email", help="Identify the user by email (case-insensitive).")
    parser.add_argument("--name", help="Identify the user by exact name. Use when the row has no email.")
    parser.add_argument("--hide", action="store_true", help="Hide from the owner pickers.")
    parser.add_argument("--show", action="store_true", help="Return to the owner pickers.")
    parser.add_argument("--list", action="store_true", help="Show every user and their current visibility.")
    parser.add_argument("--dry-run", action="store_true", help="Report what would change without writing.")
    args = parser.parse_args()

    if not args.list:
        if not args.email and not args.name:
            parser.error("one of --email, --name or --list is required")
        if args.hide == args.show:
            parser.error("pass exactly one of --hide or --show")

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
            list_users(db)
            return

        email = args.email.strip().lower() if args.email else None
        apply_change(db, email, args.name, hidden=args.hide, dry_run=args.dry_run)
    finally:
        db.close()


if __name__ == "__main__":
    main()
