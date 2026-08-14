from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

# Stage probability mapping for weighted pipeline
STAGE_PROBABILITIES = {
    "Initial": 0.0,
    "Engaged": 0.25,
    "Proposal": 0.50,
    "Verbal": 0.80,
    "Signed": 1.0
}

# Procurement delay buffers (in months)
PROCUREMENT_DELAY_BUFFERS = {
    "low": 0,
    "medium": 1,
    "high": 3
}


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    industry = Column(String, nullable=True)
    website = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    contacts = relationship("Contact", back_populates="company_rel")
    opportunities = relationship("Opportunity", back_populates="company_rel")


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)  # Removed unique constraint - allow duplicate/empty emails
    company = Column(String, index=True)  # Legacy string field for backwards compat
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    phone = Column(String, nullable=True)
    last_contact_date = Column(DateTime, nullable=True)
    is_primary = Column(Boolean, default=False)

    company_rel = relationship("Company", back_populates="contacts")
    opportunities = relationship("Opportunity", back_populates="contact")
    activities = relationship("Activity", back_populates="contact")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    role = Column(String, default="Member")
    allocation = Column(Integer, default=0) # e.g. 40, 20

    # Google OAuth identity for the MCP server. Nullable — existing rows predate
    # this and have no email. Store lowercased; Postgres allows many NULLs under
    # a unique index.
    email = Column(String, unique=True, index=True, nullable=True)
    # Explicit opt-in for MCP access. Kept separate from `email` so backfilling
    # emails later never silently grants anyone the connector.
    mcp_authorized = Column(Boolean, nullable=False, server_default="false", default=False)

    opportunities = relationship("Opportunity", back_populates="owner")

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    stage = Column(String, default="Initial")  # Initial, Engaged, Proposal, Verbal, Signed
    value = Column(Integer, default=0)
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)

    # Forecasting fields
    expected_start_date = Column(DateTime, nullable=True)
    duration_months = Column(Integer, default=1)
    procurement_delay = Column(String, default="low")  # low/medium/high

    # Archive fields
    is_archived = Column(Boolean, default=False)
    archived_at = Column(DateTime, nullable=True)

    # Audit fields
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    contact = relationship("Contact", back_populates="opportunities")
    owner = relationship("User", back_populates="opportunities")
    company_rel = relationship("Company", back_populates="opportunities")
    activities = relationship("Activity", back_populates="opportunity")

    @property
    def stage_probability(self):
        """Get probability for current stage."""
        return STAGE_PROBABILITIES.get(self.stage, 0.0)

    @property
    def weighted_value(self):
        """Calculate weighted value based on stage probability."""
        return int((self.value or 0) * self.stage_probability)

    @property
    def expected_monthly_value(self):
        """Calculate expected monthly value."""
        if self.duration_months and self.duration_months > 0:
            return int((self.value or 0) / self.duration_months)
        return self.value or 0

    @property
    def procurement_delay_months(self):
        """Get delay buffer in months based on procurement delay level."""
        return PROCUREMENT_DELAY_BUFFERS.get(self.procurement_delay, 0)

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String) # Email, Call, etc.
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"), nullable=True)
    
    contact = relationship("Contact", back_populates="activities")
    opportunity = relationship("Opportunity", back_populates="activities")
