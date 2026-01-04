Product Requirements Document: Tau CRM
Version: 1.0 (Build Ready) Date: January 1, 2026 Objective: Build a scalable, self-hosted, AI-native CRM on Google Cloud. Core Philosophy: "Configuration as Code" — Logic resides in JSON text files, not just Python code.

1. System Architecture
Frontend (The Face): React + Vite + Tailwind CSS.

Port: 3000 (Dev: 5173).

Role: Lightweight SPA. No logic, just display.

Backend (The Engine): Python FastAPI.

Port: 5001.

Role: Loads configs, talks to DB, runs Agents.

Database: PostgreSQL (Google Cloud SQL).

Dev: SQLite (tau.db) for speed.

Storage: Google Cloud Storage (for Voice Memos).

Dev: Local uploads/ folder.

Intelligence:

CEO Brain: Gemini 3 Pro (Data analysis).

Sales Coach: Gemini 1.5 Pro (Multimodal audio analysis).

2. Directory Structure (Strict)
The build must adhere to this "Config-Driven" structure:

Plaintext

/tau-backend
├── /app
│   ├── main.py            # FastAPI Entrypoint
│   ├── /core              # ConfigLoader, AgentFactory, Storage
│   ├── /api               # Endpoints
│   └── /models            # Database Tables (SQLAlchemy)
├── /configs               # THE CONTROL CENTER (JSON Files)
│   ├── /agents            # AI Personalities (ceo.json, coach.json)
│   ├── /workflows         # Logic Flows (import_flow.json)
│   └── /validation        # Data Schemas (contact_schema.json)
├── /logs                  # Text logs
└── /uploads               # Local dev storage for audio
3. Database Schema
Users: id, email, role (CEO/Sales), ms_refresh_token.

Contacts: id, name, email, company, phone, owner_id.

Opportunities: id, contact_id, stage (Initial, Engaged, Proposal, Verbal, Signed), value, owner_id, notes.

Actions: id, task_name, due_date, assigned_to_id, contact_id, status.

Activities: id, contact_id, type (Email/Call/Voice_Memo), content (Text or GCS Link), media_type (text/audio), timestamp.

4. Key Features & Logic
A. The "Fail-Safe" Ingestion (Manual Override)
Endpoint: POST /api/ingest-json

Logic: Accepts a JSON list of emails/notes (formatted by Copilot).

Process:

Validate against configs/validation/import_schema.json.

Check if Contact exists (by email). If not, create it.

Log the Activity.

B. The Intelligence Engine (Configurable)
Agent Factory: Code reads configs/agents/*.json.

Example: sales_coach.json defines "Scan for patterns in lost deals."

Voice Analysis:

Upload audio -> Save to Cloud Storage -> Pass URI to Gemini 1.5 Pro.

Prompt: "Listen to this call. Identify objections and coaching moments."

C. Microsoft Sync (Future-Proofing)
Architecture ready for ms_refresh_token storage.

Background worker (Python script) to poll Graph API.

⬇️ COPY THIS PROMPT TO ANTIGRAVITY ⬇️
Phase 1: The Engine Build

I am building the backend for 'Tau CRM'. We are using a strict 'Configuration as Code' architecture.

Goal: Initialize the project structure and build the Config Loader Engine.

Tech Stack: Python 3.11+, FastAPI, Pydantic.

Requirements:

Project Structure: Create the folders app/core, app/api, configs/agents, configs/validation, and logs.

The Config Engine (app/core/config_loader.py):

Write a class ConfigEngine that loads ALL JSON files from the configs/ directory into a global dictionary on startup.

Crucial: If a JSON file has a syntax error, the server must REFUSE to start and print a clear error to the console.

The Agent Factory (app/core/agent_factory.py):

Create a function get_agent_config(agent_id) that retrieves the loaded JSON config.

Create a sample config file configs/agents/ceo_brain.json with fields: agent_id, model (gemini-3-pro), temperature (0.2), and system_prompt.

FastAPI Setup (app/main.py):

Initialize the FastAPI app.

run the ConfigEngine.load() on the "startup" event.

Add a simple health check endpoint GET /health that returns {"status": "active", "configs_loaded": [list_of_config_names]}.

Please generate the file structure and the code.