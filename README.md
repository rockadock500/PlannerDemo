# Planner Demo

A client-facing media planner dashboard, built fresh for customization — separate from
[David OS App](https://github.com/rockadock500/David-OS-App), but using the same tooling
(Claude Code, Vercel, Railway).

## Status: working demo, running locally

```bash
npm install
npm run dev:server
# → http://localhost:4000/clients/fanduel/demo/
```

This serves the full FanDuel Planning OS reconstruction end to end — Planning OS, Flightpath,
Calendar, Reporting, Recommendations, Attribution & Incrementality, Insights, Creative
Intelligence, Audience, Regulation — all reading real data files, no database required. The one
thing intentionally not built yet is the AI chat backend (see below) — everything else works.

## Structure

```
apps/server/          # Express app — serves the static client tree below. No DB, no chat yet.
clients/fanduel/       # The live demo content (currently FanDuel's, as reconstructed placeholder data)
  demo/                #   index.html, app.js, styles.css, etc. — static, no build step
  data/                #   working data: curves, calendars, benchmarks, recommendations, etc.
  config/              #   engine capabilities, planning modes, connector manifests
  output/              #   generated_plan_*.json — pre-computed plan scenarios
  plans/                #   plan manifest + one folder per plan_id (plan.json + meta.json)
  actuals/             #   actuals manifest + monthly summary + coherence report
universal/             # Shared cross-client reference data (US regulation, media minimums, etc.)
reference/
  cognito-crm-source/  # Old COGNITO CRM code — not active, kept in case any of it is reusable
```

Swapping in a real client's numbers later is mostly a matter of replacing the JSON under
`clients/<name>/` — the frontend has no build step, so there's nothing to recompile.

## Where this repo came from

This repo started as a clone of [`TAURob-1/COGNITO`](https://github.com/TAURob-1/COGNITO), on
the assumption that repo held the architecture behind the media planner demo. It didn't —
COGNITO is a sales CRM (pipeline, forecasting, companies), unrelated in domain and in stack. That
code now lives in `reference/cognito-crm-source/` rather than being deleted, in case any of the
plumbing (Docker setup, Google OAuth + session-cookie login pattern, config-per-agent loader) is
useful later. None of it is wired up or active.

The real target is the FanDuel Planning OS demo:
`https://web-production-f21d6.up.railway.app/clients/fanduel/demo/`. No source repo for it was
available, so `clients/fanduel/` and `universal/` were reconstructed by pulling every static
asset and data file the live app's `app.js` references (including the plan-store files it
fetches dynamically per `plans/manifest.json`).

One clue surfaced during reconstruction worth chasing: `actuals/manifest.json` records its
origin as `.../projects/planner-template-v2/sde/out/fanduel`, and the app's own error message
(when data is missing) says *"Serve this folder from the planner-template-v2 root"* — meaning a
complete real source repo called `planner-template-v2` likely exists (built by Rob per the file
path). A few guessed repo names under `TAURob-1` weren't found — worth asking Rob directly if
that repo can be located, since it would include the actual chat backend implementation we're
currently missing.

## What's genuinely reusable from COGNITO

- `reference/cognito-crm-source/tau-backend/Dockerfile` / `tau-frontend/Dockerfile` — generic
  container recipes.
- `reference/cognito-crm-source/tau-backend/app/core/auth_web.py` +
  `auth_routes.py` — Google OAuth + signed session-cookie login pattern (currently coupled to
  the CRM's `users` table; would need adapting, not copying as-is).
- `DEVELOPMENT_PRINCIPLES.md` (root) — TAU's general engineering rules (config-per-agent, split
  frontend/backend, modularize), not CRM-specific.

## Deliberately not built yet

- **Chat backend** (`/api/chat`, `/api/sessions`) — `runtime-config.js` has the LLM flag turned
  off, so the UI falls back to its deterministic/local narration mode instead of erroring. Flip
  `enabled` back to `true` once a real endpoint exists.
- **Real client data** — everything currently under `clients/fanduel/` is FanDuel's reconstructed
  placeholder data, standing in until the actual client's numbers are ready.
- **Deployment** — runs locally only so far; Railway/Vercel wiring is next.

## Next steps

1. Deploy `apps/server` to Railway (root directory `apps/server`, no env vars required yet).
2. Decide the real client name and rename `clients/fanduel/` → `clients/<real-client>/` when its
   data is ready.
3. Build the chat backend when that becomes a priority.
4. Try to track down `planner-template-v2` (see above) — a real source repo would save a lot of
   rebuilding, and includes the chat implementation.
