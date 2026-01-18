"""
TAU CRM Database Migration Script
Adds forecasting fields and Company table for weighted pipeline functionality.

Usage:
    python migrations/migrate.py
"""

import os
import sys

# Add the parent directory to the path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text, inspect
from app.core.database import engine, Base
from app.models.models import Company, Contact, Opportunity, User, Activity


def column_exists(inspector, table_name, column_name):
    """Check if a column exists in a table."""
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns


def table_exists(inspector, table_name):
    """Check if a table exists."""
    return table_name in inspector.get_table_names()


def run_migration():
    """Run the database migration."""
    print("Starting TAU CRM database migration...")

    inspector = inspect(engine)
    is_sqlite = 'sqlite' in str(engine.url)

    with engine.connect() as conn:
        # Step 1: Create Companies table if it doesn't exist
        print("\n1. Checking companies table...")
        if not table_exists(inspector, 'companies'):
            print("   Creating companies table...")
            Base.metadata.tables['companies'].create(engine)
            print("   Companies table created.")
        else:
            print("   Companies table already exists.")

        # Step 2: Add new columns to opportunities
        print("\n2. Updating opportunities table...")
        opp_columns = {
            'expected_start_date': 'DATETIME' if is_sqlite else 'TIMESTAMP',
            'duration_months': 'INTEGER DEFAULT 1',
            'procurement_delay': "VARCHAR(10) DEFAULT 'low'",
            'company_id': 'INTEGER',
            'created_at': 'DATETIME DEFAULT CURRENT_TIMESTAMP' if is_sqlite else 'TIMESTAMP DEFAULT NOW()',
            'updated_at': 'DATETIME DEFAULT CURRENT_TIMESTAMP' if is_sqlite else 'TIMESTAMP DEFAULT NOW()'
        }

        for col_name, col_type in opp_columns.items():
            if not column_exists(inspector, 'opportunities', col_name):
                try:
                    print(f"   Adding column: {col_name}")
                    conn.execute(text(f"ALTER TABLE opportunities ADD COLUMN {col_name} {col_type}"))
                    conn.commit()
                except Exception as e:
                    print(f"   Warning: Could not add {col_name}: {e}")
            else:
                print(f"   Column {col_name} already exists.")

        # Step 3: Add company_id to contacts
        print("\n3. Updating contacts table...")
        if not column_exists(inspector, 'contacts', 'company_id'):
            try:
                print("   Adding column: company_id")
                conn.execute(text("ALTER TABLE contacts ADD COLUMN company_id INTEGER"))
                conn.commit()
            except Exception as e:
                print(f"   Warning: Could not add company_id: {e}")
        else:
            print("   Column company_id already exists.")

        # Step 4: Set default values for existing records
        print("\n4. Setting default values for existing records...")
        try:
            conn.execute(text("UPDATE opportunities SET duration_months = 1 WHERE duration_months IS NULL"))
            conn.execute(text("UPDATE opportunities SET procurement_delay = 'low' WHERE procurement_delay IS NULL"))
            conn.commit()
            print("   Default values set.")
        except Exception as e:
            print(f"   Warning: Could not set defaults: {e}")

    print("\n" + "=" * 50)
    print("Migration complete!")
    print("=" * 50)

    # Print summary
    print("\nNew features available:")
    print("  - Weighted pipeline with stage probabilities")
    print("  - Forecasting with expected_start_date and duration")
    print("  - Procurement delay tracking (low/medium/high)")
    print("  - Company management")
    print("  - Cognito AI Agent")


if __name__ == "__main__":
    run_migration()
