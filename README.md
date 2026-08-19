# Planner Demo

A client-facing media planner dashboard, built fresh for customization — separate from
[David OS App](https://github.com/rockadock500/David-OS-App), but using the same tooling
(Claude Code, Vercel, Railway).

## Where this repo came from

This repo started as a clone of [`TAURob-1/COGNITO`](https://github.com/TAURob-1/COGNITO), on
the assumption that repo held the architecture behind the media planner demo. It didn't —
COGNITO is a sales CRM (pipeline, forecasting, companies), unrelated in domain and in stack. That
code has been moved to `reference/cognito-crm-source/` rather than deleted, in case any of the
plumbing (Docker setup, Google OAuth + session-cookie login pattern, config-per-agent loader) is
useful later. None of it is wired up or active.

## What we're actually emulating

The real target is the FanDuel Planning OS demo:
`https://web-production-f21d6.up.railway.app/clients/fanduel/demo/`

No source repo for it was available, so it was reconstructed by pulling the live static assets
and every data file `app.js` references. That reconstruction lives in
`reference/fanduel-demo-source/`, laid out to match the real site structure:

```
reference/fanduel-demo-source/
  clients/fanduel/
    demo/      # index.html, app.js, styles.css, reasons.js, runtime-config.js, vendor/, assets/
    data/      # working data: curves, calendars, benchmarks, recommendations, etc.
    config/    # engine capabilities, planning modes, connector manifests
    output/    # generated_plan_*.json — pre-computed plan scenarios
    plans/     # plan manifest
    actuals/   # actuals manifest + monthly summary
  universal/   # shared cross-client reference data (US regulation, media minimums, etc.)
```

Key findings from that reconstruction:
- The frontend is **hand-built static HTML/CSS/vanilla JS** — no React, no build step. `app.js`
  is ~17k lines of readable (unminified) source.
- It's served per-client at `/clients/<client>/demo/`, suggesting the real system serves
  multiple client demos off one app, sharing the `universal/` reference data.
- `runtime-config.js` shows the one piece we *can't* reconstruct from static files — an AI chat
  backend at `/api/chat` (model: `claude-haiku-4-5-20251001`) and `/api/sessions`. That's server
  code, not static assets, and needs to be built new.

## What's genuinely reusable from COGNITO

- `reference/cognito-crm-source/tau-backend/Dockerfile` / `tau-frontend/Dockerfile` — generic
  container recipes.
- `reference/cognito-crm-source/tau-backend/app/core/auth_web.py` +
  `auth_routes.py` — Google OAuth + signed session-cookie login pattern (currently coupled to
  the CRM's `users` table; would need adapting, not copying as-is).
- `DEVELOPMENT_PRINCIPLES.md` (root) — TAU's general engineering rules (config-per-agent, split
  frontend/backend, modularize), not CRM-specific.

## Next steps

1. Decide the real client/demo name this repo will serve (currently modeled on `fanduel` as the
   reference — rename for the actual client).
2. Stand up a minimal backend: serve the static `clients/<client>/demo/` tree, plus `/api/chat`
   and `/api/sessions` proxying to Anthropic.
3. Swap FanDuel-specific data/copy/branding for the real client's.
4. Wire up Railway (backend) + Vercel or static hosting (frontend) — see `DEPLOY.md` (TODO) once
   the stack is decided.
