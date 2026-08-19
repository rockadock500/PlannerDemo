-- TAU CRM Database Migration: Add Forecasting Fields
-- Run this migration to add the new fields for weighted pipeline and forecasting

-- ============================================
-- STEP 1: Create Companies Table
-- ============================================

CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR UNIQUE NOT NULL,
    industry VARCHAR,
    website VARCHAR,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_companies_name ON companies (name);

-- ============================================
-- STEP 2: Add New Columns to Opportunities
-- ============================================

-- Add forecasting fields (SQLite syntax)
-- Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE
-- These will fail silently if columns already exist

-- For SQLite: Run each separately and ignore errors for existing columns
ALTER TABLE opportunities ADD COLUMN expected_start_date DATETIME;
ALTER TABLE opportunities ADD COLUMN duration_months INTEGER DEFAULT 1;
ALTER TABLE opportunities ADD COLUMN procurement_delay VARCHAR(10) DEFAULT 'low';
ALTER TABLE opportunities ADD COLUMN company_id INTEGER REFERENCES companies(id);
ALTER TABLE opportunities ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE opportunities ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- ============================================
-- STEP 3: Add New Columns to Contacts
-- ============================================

ALTER TABLE contacts ADD COLUMN company_id INTEGER REFERENCES companies(id);

-- ============================================
-- STEP 4: Set Default Values for Existing Records
-- ============================================

UPDATE opportunities SET duration_months = 1 WHERE duration_months IS NULL;
UPDATE opportunities SET procurement_delay = 'low' WHERE procurement_delay IS NULL;
UPDATE opportunities SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;
UPDATE opportunities SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL;

-- ============================================
-- PostgreSQL Version (for production)
-- ============================================
/*
-- Create Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    industry VARCHAR,
    website VARCHAR,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_companies_name ON companies (name);

-- Add columns to opportunities (PostgreSQL syntax with IF NOT EXISTS workaround)
DO $$
BEGIN
    BEGIN
        ALTER TABLE opportunities ADD COLUMN expected_start_date TIMESTAMP;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE opportunities ADD COLUMN duration_months INTEGER DEFAULT 1;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE opportunities ADD COLUMN procurement_delay VARCHAR(10) DEFAULT 'low';
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE opportunities ADD COLUMN company_id INTEGER REFERENCES companies(id);
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE opportunities ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE opportunities ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;
END $$;

-- Add company_id to contacts
DO $$
BEGIN
    BEGIN
        ALTER TABLE contacts ADD COLUMN company_id INTEGER REFERENCES companies(id);
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;
END $$;

-- Set default values
UPDATE opportunities SET duration_months = 1 WHERE duration_months IS NULL;
UPDATE opportunities SET procurement_delay = 'low' WHERE procurement_delay IS NULL;
UPDATE opportunities SET created_at = NOW() WHERE created_at IS NULL;
UPDATE opportunities SET updated_at = NOW() WHERE updated_at IS NULL;
*/
