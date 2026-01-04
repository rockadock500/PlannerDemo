from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    company = Column(String, index=True)
    phone = Column(String, nullable=True)
    last_contact_date = Column(DateTime, nullable=True)
    is_primary = Column(Boolean, default=False)
    
    opportunities = relationship("Opportunity", back_populates="contact")
    activities = relationship("Activity", back_populates="contact")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    role = Column(String, default="Member")
    allocation = Column(Integer, default=0) # e.g. 40, 20
    
    opportunities = relationship("Opportunity", back_populates="owner")

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    stage = Column(String, default="Initial") # Initial, Engaged, Proposal, Verbal, Signed
    value = Column(Integer, default=0)
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    contact = relationship("Contact", back_populates="opportunities")
    owner = relationship("User", back_populates="opportunities")
    activities = relationship("Activity", back_populates="opportunity")

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
