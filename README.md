# Planner Demo

A client-facing media planner dashboard for **Admiral** (car insurance), built for customization —
separate from [David OS App](https://github.com/rockadock500/David-OS-App), but using the same
tooling (Claude Code, Vercel, Railway).

## Status: working demo, running locally and deployed

```bash
npm install
npm run dev:server
# → http://localhost:4000/clients/admiral/demo/
```

Deployed at `https://planner-demo-production.up.railway.app/clients/admiral/demo/` (Railway,
auto-deploys on push to `main`).

## Foundation: rebuilt from the PPL prototype, not FanDuel

This went through two false starts before landing on the current foundation:

1. Cloned `TAURob-1/COGNITO` (a sales CRM, unrelated domain and stack) — moved to
   `reference/cognito-crm-source/`.
2. Reconstructed the FanDuel Planning OS demo from its live static assets — worked, but its
   `app.js` turned out to have ~250+ hardcoded sportsbook/gambling-specific strings baked
   directly into the data layer (product labels, state betting-availability tables, source
   registry notes). Too much to rebrand cleanly. Moved to `reference/fanduel-attempt/`.
3. **Current foundation**: reconstructed from the live PPL (Postcode Lottery) prototype at
   `https://ppl-planner-web-production.up.railway.app/prototype/`, the same way — pulling every
   static asset and data file. This one is domain-neutral: its ~4,500-line `app.js` has only 2
   incidental PPL-specific strings in the entire file (an API URL and a download filename), both
   fixed. Its views — Current Plan, Annual Planning, Scenarios, Monthly Revision, Plan
   Interrogation, Events Calendar, Approval, Briefing Forms, Admin — are generic media-planning
   concepts that apply to any client.

## Structure

```
apps/server/            # Express app — serves the static client tree below. No DB, no live API.
clients/admiral/         # The live demo
  demo/                  #   index.html, app.js, styles.css — static, no build step
  data/                  #   PPL's bundled data files (plan scenarios, calendar, evidence rules,
                         #   source registry) — still PPL's placeholder numbers, not Admiral's
reference/
  cognito-crm-source/    # Old CRM code — inactive, kept in case any of it is reusable
  fanduel-attempt/       # First working demo, superseded — kept for reference only
```

## Branding

Colors and logo pulled directly from admiral.com:
- **Magenta `#C20060`** and **navy `#0045A0`** — lifted from Admiral's own logo SVG.
- The layout's `--red`/`--red-dark` variables (in `clients/admiral/demo/styles.css`) keep their
  original names from the PPL layout — only the hex values changed, to Admiral's magenta. This is
  the single primary-brand-color variable driving the sidebar masthead, active nav item, primary
  buttons, and status pills — one change cascades everywhere, so future re-brands are a two-line
  edit.
- Admiral's real logo (white-recolored for the colored masthead) sits in
  `clients/admiral/demo/assets/admiral-logo-white.svg`.
- TAU's logo appears as the "in partnership with" credit in the top-right of the workspace header
  (swapped in for PPL's original the7stars credit).

## Deliberately not built yet

- **Live planning/chat API** — the real PPL prototype calls out to a separate live backend
  (`ppl-planner-api-production.up.railway.app`) for scenario generation, chat, and plan import.
  That's real generative logic, not just static data, and isn't replicated here. The static views
  render fully without it; only the interactive/generative actions (e.g. "Generate base plan",
  chat) would need it.
- **Real Admiral data** — everything under `clients/admiral/data/` is still PPL's reconstructed
  placeholder data (UK lottery draw calendars, PPL scenario names, etc.), standing in until
  Admiral's actual numbers are ready.
- **Deployment auth** — the Railway URL is public with no password gate. Worth adding before this
  goes anywhere near an actual client review.

## Next steps

1. Swap `clients/admiral/data/*.json` for Admiral's real planning data.
2. Add a password gate before sharing the link externally.
3. Decide whether the live planning/chat API is worth building, and if so, scope it separately —
   it's a real backend service, not a small addition.
