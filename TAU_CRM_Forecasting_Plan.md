# TAU CRM Forecasting & Weighted Pipeline Plan

## Overview
Add forecasting capabilities to the CRM including weighted pipeline, temporal tracking, and procurement delay management.

---

## 1. Weighted Pipeline Stages (Confirmed)

| Stage | Probability | Purpose |
|-------|-------------|---------|
| Initial | **0%** | Leads/starters - shown in forecast but contributes £0 |
| Engaged | **25%** | Active conversations, qualified interest |
| Proposal | **50%** | Proposal sent, awaiting decision |
| Verbal | **80%** | Verbal agreement, pending paperwork |
| Signed | **100%** | Confirmed deal |

### Weighted Value Calculation
```
Weighted Value = Deal Value × Stage Probability
```

Example: £50,000 deal at "Verbal" stage = £40,000 weighted value

---

## 2. New Opportunity Fields

### Core Fields to Add
| Field | Type | Purpose |
|-------|------|---------|
| `expected_start_date` | DateTime | When work is forecast to begin |
| `duration_months` | Integer | Length of engagement (in months) |
| `procurement_delay` | Enum | "low" / "medium" / "high" |
| `expected_monthly_value` | Computed | value / duration_months |
| `created_at` | DateTime | Audit trail |
| `updated_at` | DateTime | Track modifications |

### Procurement Delay Impact (Timeline Only)
| Level | Description | Forecast Adjustment |
|-------|-------------|---------------------|
| Low | Standard process, reliable timeline | No adjustment |
| Medium | Some bureaucracy, may slip 1-2 months | Buffer +1 month |
| High | Complex procurement, likely delays | Buffer +3 months |

---

## 3. Forecasting Model

### Income Timeline View
For each opportunity, calculate:
- **Weighted monthly income** = (value / duration) × stage probability
- **Adjusted start date** = expected_start_date + procurement_delay_buffer
- **Income period** = adjusted_start to adjusted_start + duration

### Example Forecast Output
```
Q1 2026: £125,000 weighted pipeline
  - Acme Corp (Verbal, 80%): £40,000/mo × 3mo = £120,000
  - Beta Inc (Proposal, 50%): £10,000/mo × 1mo = £5,000

Q2 2026: £85,000 weighted pipeline
  ...
```

---

## 4. Implementation Changes

### Backend Model Changes (`models.py`)
```python
class Opportunity(Base):
    # Existing fields...

    # NEW: Temporal fields
    expected_start_date = Column(DateTime, nullable=True)
    duration_months = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # NEW: Procurement tracking
    procurement_delay = Column(String, default="low")  # low/medium/high
```

### Backend Schema Changes (`schemas.py`)
- Add new fields to OpportunityBase, OpportunityCreate, OpportunityUpdate, OpportunityOut
- Add computed field `weighted_value` in OpportunityOut

### New API Endpoints (`routes.py`)
1. `GET /api/forecast` - Returns weighted pipeline summary by month/quarter
2. `GET /api/forecast/summary` - Returns totals by stage with weighted values

### Frontend Changes (`Pipeline.jsx`)
1. Add stage probability display in column headers
2. Show weighted value alongside actual value on cards
3. Add expected_start_date and duration fields to edit modal
4. Add procurement_delay dropdown (Low/Medium/High)

### New Frontend Component
- `Forecast.jsx` - Timeline view showing income projection by month

---

## 5. Database Migration

Since you're using SQLite for dev and PostgreSQL for prod, you'll need to add columns:

```sql
ALTER TABLE opportunities ADD COLUMN expected_start_date DATETIME;
ALTER TABLE opportunities ADD COLUMN duration_months INTEGER DEFAULT 1;
ALTER TABLE opportunities ADD COLUMN procurement_delay VARCHAR(10) DEFAULT 'low';
ALTER TABLE opportunities ADD COLUMN created_at DATETIME;
ALTER TABLE opportunities ADD COLUMN updated_at DATETIME;
```

---

## 6. Files to Modify

### Backend
- `tau-backend/app/models/models.py` - Add new fields
- `tau-backend/app/schemas.py` - Add new schemas with validation
- `tau-backend/app/api/routes.py` - Add forecast endpoints

### Frontend
- `tau-frontend/src/api.js` - Add forecast API calls
- `tau-frontend/src/components/Pipeline.jsx` - Add new fields to forms/display
- `tau-frontend/src/components/Forecast.jsx` - NEW: Timeline/forecast view
- `tau-frontend/src/App.js` - Add Forecast tab

---

## 7. Verification Plan

1. **Backend Testing**
   - Create opportunity with new fields via API
   - Verify weighted value calculation
   - Test forecast endpoint returns correct aggregations

2. **Frontend Testing**
   - Create new opportunity with start date, duration, procurement delay
   - Verify weighted values display correctly
   - Check forecast view shows timeline

3. **End-to-End**
   - Add 5 opportunities across different stages
   - Verify pipeline totals match weighted calculations
   - Confirm forecast timeline is accurate

---

## 8. Company & Contact Management

### Current State
- Contacts have a `company` field (string)
- No dedicated Company entity
- Contacts are flat - no hierarchy

### Recommended Approach: Add Company Entity

**New Company Model:**
```python
class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True)
    industry = Column(String, nullable=True)
    website = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    contacts = relationship("Contact", back_populates="company")
    opportunities = relationship("Opportunity", back_populates="company")
```

**Updated Contact Model:**
```python
class Contact(Base):
    company_id = Column(Integer, ForeignKey("companies.id"))  # NEW
    company = relationship("Company", back_populates="contacts")
    # Remove: company = Column(String)  -- migrate to relationship
```

### Frontend: Company View
- **Companies List** - Table of all companies with contact count
- **Company Detail** - Shows company info + list of contacts within it
- **Add Contact to Company** - From company detail page
- **Company CRUD** - Create, edit, delete companies

### Migration Path
1. Create Company table
2. Parse existing `contact.company` strings into Company records
3. Link contacts to companies via `company_id`
4. Keep `company` string field temporarily for backwards compat

---

## 9. Cognito AI Agent (Grok-powered)

### Overview
A conversational AI interface for CRM operations, powered by Grok API.

### Features
- Natural language queries ("Show me all Verbal stage deals")
- Make changes via chat ("Move Acme deal to Signed")
- Safety confirmations before destructive actions
- HTTP API for external agent access

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    TAU CRM Frontend                      │
│  ┌───────────┐  ┌───────────┐  ┌───────────────────┐   │
│  │ Pipeline  │  │ Forecast  │  │ Cognito Chat Tab  │   │
│  └───────────┘  └───────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    TAU CRM Backend                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │              /api/cognito/chat                     │  │
│  │   POST: { message, session_id }                   │  │
│  │   Returns: { response, actions_taken }            │  │
│  └───────────────────────────────────────────────────┘  │
│                           │                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Cognito Agent Service                    │  │
│  │   - Parses intent from user message               │  │
│  │   - Maps to CRM operations (CRUD)                 │  │
│  │   - Requires confirmation for: delete, bulk ops   │  │
│  └───────────────────────────────────────────────────┘  │
│                           │                              │
│                           ▼                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Grok API (X.AI)                       │  │
│  │   - Function calling for CRM operations           │  │
│  │   - Context: current user, CRM schema             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### API Endpoints

**Chat Endpoint (Internal + External):**
```
POST /api/cognito/chat
Headers: X-API-Key: <security_key>
Body: {
  "message": "What's our weighted pipeline for Q1?",
  "session_id": "abc123",
  "require_confirmation": true
}
Response: {
  "response": "Your Q1 weighted pipeline is £425,000...",
  "pending_action": null,
  "session_id": "abc123"
}
```

**Confirmation Flow:**
```
POST /api/cognito/chat
Body: { "message": "Delete the Acme opportunity" }
Response: {
  "response": "Are you sure you want to delete 'Acme Corp Website'? This cannot be undone.",
  "pending_action": {
    "type": "delete_opportunity",
    "id": 42,
    "confirmation_token": "xyz789"
  }
}

POST /api/cognito/confirm
Body: { "confirmation_token": "xyz789" }
Response: { "response": "Deleted 'Acme Corp Website' successfully." }
```

### Backend Implementation

**New Files:**
- `app/services/cognito.py` - Grok integration & CRM function definitions
- `app/api/cognito_routes.py` - Chat endpoints

**Function Calling Schema for Grok:**
```python
functions = [
    {
        "name": "list_opportunities",
        "description": "List opportunities with optional filters",
        "parameters": { "stage": "string", "owner": "string" }
    },
    {
        "name": "update_opportunity",
        "description": "Update an opportunity's details",
        "parameters": { "id": "int", "stage": "string", "value": "int" }
    },
    {
        "name": "get_forecast",
        "description": "Get weighted pipeline forecast",
        "parameters": { "period": "Q1/Q2/Q3/Q4 or month" }
    },
    # ... more functions
]
```

### Security
- `X-API-Key` header required for all requests
- Key stored in environment variable: `COGNITO_API_KEY`
- Rate limiting on external access
- Audit log of all agent actions

### Frontend: Cognito Chat Tab
- Chat-style interface (message bubbles)
- Input field at bottom
- Shows confirmation dialogs inline
- History of conversation persisted per session

---

## 10. Updated File List

### Backend (New/Modified)
- `app/models/models.py` - Add Company model, update Contact/Opportunity
- `app/schemas.py` - Add Company schemas, Cognito request/response schemas
- `app/api/routes.py` - Add Company CRUD endpoints, Forecast endpoints
- `app/api/cognito_routes.py` - NEW: Cognito chat endpoints
- `app/services/cognito.py` - NEW: Grok API integration

### Frontend (New/Modified)
- `src/components/Pipeline.jsx` - Add weighted values, new fields
- `src/components/Forecast.jsx` - NEW: Timeline/forecast view
- `src/components/Companies.jsx` - NEW: Company list view
- `src/components/CompanyDetail.jsx` - NEW: Company with contacts
- `src/components/Cognito.jsx` - NEW: Chat interface
- `src/App.js` - Add new tabs (Forecast, Companies, Cognito)

---

## 11. Agent Architecture Recommendation

### Recommended: Single Cognito Agent + Tool Calling

For a small company CRM, use the **single agent with function calling** pattern:

```
User Message → Cognito Agent (Grok) → Function Calls → CRM Database
```

**Why this over multi-agent swarms:**
- **Simplicity** - One agent to debug, maintain, and understand
- **Cost** - Fewer API calls (swarms multiply costs)
- **Speed** - No agent coordination overhead
- **Reliability** - Less chance of agent miscommunication
- **Grok's strength** - Function calling is well-suited to CRUD operations

### Cognito's Tool Functions
Instead of sub-agents, Cognito gets a rich set of tools:
- `search_companies`, `get_company`, `create_company`
- `search_contacts`, `get_contact`, `create_contact`
- `search_opportunities`, `update_opportunity`, `delete_opportunity`
- `get_forecast`, `get_pipeline_summary`
- `log_activity`, `get_activities`

---

## 12. Implementation Order

1. **Phase 1: Data Model** - Add fields to Opportunity, create Company model
2. **Phase 2: Backend APIs** - Forecast endpoint, Company CRUD
3. **Phase 3: Frontend Views** - Forecast view, Company management
4. **Phase 4: Cognito Agent** - Grok integration, chat UI

---

## 12. Verification Plan

1. **Weighted Pipeline**
   - Create opportunities at each stage, verify weighted totals

2. **Forecast View**
   - Add deals with start dates, verify timeline display

3. **Company Management**
   - Create company, add contacts, verify relationships

4. **Cognito Agent**
   - Chat: "Show me all Verbal deals" → verify list
   - Chat: "Delete opportunity X" → verify confirmation required
   - External API call with API key → verify access
