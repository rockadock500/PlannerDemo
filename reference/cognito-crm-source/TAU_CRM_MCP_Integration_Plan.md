# TAU CRM MCP Integration Plan

**Status:** Phase 1 + Phase 2 write tools implemented (API key auth). Railway deploy + Entra OAuth later.
**Author:** Ethan Buckley (drafted with Claude Code)
**Date:** 2026-08-08
**Updated:** 2026-08-10 — Phase 2 write tools (archive instead of delete)

## Overview

Give TAU team members (initially Jay and Paul) direct access to Cognito CRM data from
their own AI clients — Claude Code, Claude.ai, or ChatGPT — without a TAU engineer in the
loop. Mechanism: a remote **MCP (Model Context Protocol)** server, hosted alongside the
existing backend, authenticated per-user via TAU's Microsoft 365 tenant.

This is additive. No change to the existing frontend, database, models, or REST API.

---

## 1. Current State (Confirmed)

`app/services/cognito.py` already implements an AI-agent layer, wired to **Grok**, not to
MCP:

| Component | What it does |
|---|---|
| `CRM_FUNCTIONS` | 8 function definitions: `list_opportunities`, `get_opportunity`, `update_opportunity`, `delete_opportunity`, `get_pipeline_summary`, `get_forecast`, `list_contacts`, `list_companies` |
| `CognitoService.execute_function()` | Dispatches a function name + arguments to the matching private method, which queries the DB via SQLAlchemy |
| `POST /api/cognito/chat` | Public entry point — takes a free-text message, Grok picks a function, `execute_function` runs it |
| `POST /api/cognito/confirm` | Confirms pending destructive actions (currently: delete) |

**Implication:** the MCP build is mostly translation of an existing, working dispatcher —
not new CRM logic. Each MCP tool below maps directly onto a function that already exists
and is already exercised in production via the Grok chat path.

**Known issue found while mapping this (unrelated to MCP, flagging here so it isn't
lost):** `verify_api_key()` in `cognito_routes.py` allows all requests when
`COGNITO_API_KEY` is unset. Worth confirming that variable is actually set on Railway —
if not, `/api/cognito/chat` currently has no authentication at all.

---

## 2. Proposed Architecture

```
Claude / ChatGPT  →  HTTPS (Streamable HTTP / SSE)  →  /mcp on the existing FastAPI app
                                                              │
                                                    calls CognitoService (in-process)
                                                              │
                                                         same Postgres DB
```

**Hosted, not local.** Requirement: usable from a phone. A locally-run MCP subprocess
(what a laptop-based Claude Code session spins up) cannot satisfy that — the server must
be reachable over the internet. Both Claude (Customize → Connectors → Add Custom
Connector) and ChatGPT (Settings → Apps → Developer Mode) connect to a remote MCP server
the same way: paste the HTTPS URL, complete OAuth.

**Mounted inside the existing backend, not a new service.** The MCP layer is added to the
FastAPI app already deployed on Railway (`app.mount("/mcp", mcp_app)` in `app/main.py`),
calling `CognitoService` directly. No new deployable, no new network hop, no duplicated
validation logic.

**Auth: OAuth via TAU's existing Microsoft Entra ID tenant.** TAU staff already
authenticate against `taums.ai` on Microsoft 365 (confirmed 2026-08-08). Recommended flow
is **CIMD** (Client ID Metadata), not DCR:

- DCR would require this server to implement a full OAuth authorization server with
  dynamic client registration — real infrastructure to build.
- CIMD requires **one** Azure app registration in the `taums.ai` Entra tenant (an admin
  console action, not code). Every user then signs in with their existing Microsoft
  account and consents individually — same per-user outcome, far less to build.
- Each person authenticates as themselves. No shared secret to distribute or revoke.

---

## 3. Phased Build

### Phase 1 — Read-only tools

```
list_companies        → CognitoService._list_companies()
list_contacts          → CognitoService._list_contacts()
list_opportunities     → CognitoService._list_opportunities()
get_opportunity        → CognitoService._get_opportunity()
get_pipeline_summary   → CognitoService._get_pipeline_summary()
get_forecast           → CognitoService._get_forecast()
```

Every one of these already exists and is already used by the Grok chat path. This phase
is a translation exercise, not new development.

### Phase 2 — Write tools (implemented 2026-08-10)

Ethan go-ahead: shared `COGNITO_API_KEY` OK for now (OAuth later). **No hard delete on MCP.**

```
update_opportunity      → CognitoService._update_opportunity()
create_opportunity      → CognitoService._create_opportunity()      [new]
archive_opportunity     → CognitoService._archive_opportunity()     [new; uses existing is_archived]
unarchive_opportunity   → CognitoService._unarchive_opportunity()   [new]
create_contact         → CognitoService._create_contact()         [new]
update_contact         → CognitoService._update_contact()         [new]
list_activities        → CognitoService._list_activities()        [new]
create_activity        → CognitoService._create_activity()        [new]
update_activity        → CognitoService._update_activity()        [new]
```

**Not on MCP:** `delete_opportunity` (and any other hard deletes). Use `archive_opportunity` /
`unarchive_opportunity` instead — soft-remove from the active pipeline via existing
`opportunities.is_archived` / `archived_at` (no new migration). Archive applies to
**opportunities only**; activities have create/update but no archive/delete via MCP.

---

## 4. File-Level Changes

| File | Change |
|---|---|
| `requirements.txt` | Add an MCP server library (e.g. `fastmcp`) |
| `app/mcp/server.py` | **New.** One `@mcp.tool()` function per item in Phase 1/2, each calling the matching `CognitoService` method |
| `app/main.py` | Two lines: import and mount the MCP app at `/mcp` |
| `app/core/auth_entra.py` | **New.** Validates the bearer token on `/mcp/*` against the Entra ID tenant |
| *(external, not a file)* | One Azure App Registration in the `taums.ai` Entra tenant |

Nothing else in the repo changes. The existing `/api/...` routes, the frontend, and the
Grok chat feature are untouched.

---

## 5. Open Decisions — needed before Phase 2, some before Phase 1

1. **Read-only or read-write for v1?** ✅ Confirmed: Phase 1 read-only only.
2. **Who administers the `taums.ai` Entra ID tenant?** Needed to register the OAuth app (after key auth).
3. **Confirm `COGNITO_API_KEY` is set on Railway** — set locally first; set the same var on Railway before deploy.
4. **Which clients will actually be used** — ✅ Claude Code only for v1 (key auth). Entra OAuth later for others.

### Phase 1 local setup (API key auth)

Code: `tau-backend/app/mcp/` mounted at `/mcp`. Auth seam: `app/core/auth.py`.

1. Copy `tau-backend/.env.example` → `.env`
2. Set `COGNITO_API_KEY` (`python -c "import secrets; print(secrets.token_urlsafe(32))"`)
3. Set `DATABASE_URL` to the Railway Postgres URL
4. From `tau-backend`: `uvicorn app.main:app --reload --host 127.0.0.1 --port 8000`
5. Claude Code:

```bash
claude mcp add --transport http cognito-crm http://127.0.0.1:8000/mcp \
  --header "Authorization: Bearer <COGNITO_API_KEY>"
```

Or JSON (`type: http` / `streamable-http`):

```json
{
  "mcpServers": {
    "cognito-crm": {
      "type": "http",
      "url": "http://127.0.0.1:8000/mcp",
      "headers": {
        "Authorization": "Bearer ${COGNITO_API_KEY}"
      }
    }
  }
}
```

Also accepted: `X-API-Key` (same as `/api/cognito/*`). MCP fails closed if the key env var is unset.

**Railway (later):** set `COGNITO_API_KEY` on the backend service, deploy, point Claude Code at `https://<railway-host>/mcp`.

---

## 6. Acceptance Criteria (proposed)

- Jay and Paul can query pipeline data (Phase 1 tools) from their own Claude or ChatGPT
  client, authenticated as themselves, without a TAU engineer setting anything up per
  request.
- No shared credential exists — every access is attributable to an individual user via
  Entra ID login.
- The existing REST API, frontend and Grok chat feature behave identically after this
  ships — this is additive, not a refactor.

## How Impact Will Be Measured (proposed)

Frequency of pipeline updates/queries via the MCP path, compared against how often Cognito
is used today. Rob's stated problem is that Cognito isn't used often enough — this is the
honest measure of whether the integration solved that.
