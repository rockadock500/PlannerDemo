# Spec: BP Media Planner on Vercel, restyled to match BP Intelligence v2

## Objective

Move the bp Investment Comms media planner from Railway (`/clients/bp/demo/`, currently returning 502) to
`https://taums.vercel.app/client/demo/planner/BP/`, and bring its look in line with the BP Intelligence v2
dashboard so the two read as one product family.

Requested by David (26 Oct 2026). Decisions confirmed:
- **Restyle in place.** Keep the existing static HTML/JS planner and every page. Rebuild only Scenarios and Plan Chat.
- **Password.** Same gate and credentials as Intelligence v2 (`bp-uat`, Vercel env vars `BP_V2_USER` / `BP_V2_PASSWORD`).

### Page changes

| Page | Change |
| --- | --- |
| Campaign Planning | Restyle only. Content unchanged. |
| Scenarios | Replace with the Freemans copilot Scenarios page, without its page header or "Start from" preset row. Show five KPIs (total spend, attributed revenue, new customers, ROAS, CPA), then budget-by-channel sliders, the response curve and the outcomes table. Total spend £200k. Channels: Google Search, Meta, Affiliates, **CTV** (was Linear Radio), YouTube, **LinkedIn** (was Pinterest). Keep Reset. Styled like the rest of the planner, not like Freemans. |
| Plan Chat (was "Planner Chat"/"Plan Interrogation") | Rename. Remove the scenario selector and plan overview at the top. A chat window only (suggested questions inside the empty state); a one-line header names the plan it answers about. |
| Events Calendar, Approval, Admin | Restyle only. |

### Static only

The live planner API (`ppl-planner-api-production.up.railway.app`) is down and the BP demos are static.
Every call to it is replaced with stored data:
- Generate base plan → shows the stored Blended plan on Campaign Planning and says so (it is not added as a separate stored plan).
- Data readiness → reads `source_registry.json`; green only for client-supplied or official data, amber for synthetic or third-party stand-ins.
- "Use last created plan" and "Upload base plan" went with the old Scenario Centre.
- Calendar "Generate AI overview" → "Summarise this month", built from the calendar entries.
- Plan Chat → answers built from the stored Blended plan (like Ask in Intelligence v2). No AI call.

## Look (from BP Intelligence v2)

- Green prototype banner, then a white sticky header: bp Helios logo, "BP Planner", top menu. No sidebar.
- Inter font; colours `--bp-green #009b00`, `--bp-green-dark`, `--bp-green-deeper #005800`, `--bp-yellow #ffe600`,
  `--bp-tint #eef7e8`, background `#fafaf7`, borders `#e5e5df`, radius 0.5rem.
- White cards with thin borders, uppercase-free section titles, outline badges, green primary buttons, active menu item in tint.
- Max content width 1280px. Phone width (375px): menu collapses to a button; wide tables scroll inside their card; no sideways page scroll.

## Tech stack

Unchanged: static `index.html` + `app.js` (vanilla JS) + `styles.css`, Lucide icons and SheetJS from unpkg. New code:
`scenarios.js` (the scenarios engine and page) and `chat.js` (static Plan Chat), loaded before `app.js`.

## Commands

```
npm run dev:server                                   # http://localhost:4000/clients/bp/demo/
node clients/bp/scripts/check_synthetic_fixture_reconciliation.js
bash clients/bp/scripts/build-vercel.sh              # copies the demo into the Vercel folder
cd ~/Desktop/Freemans/copilot-demo-vercel && npx vercel@latest deploy --prod --yes
```

## Project structure

```
clients/bp/demo/          index.html, app.js, scenarios.js, chat.js, styles.css, assets/, favicon.svg
clients/bp/demo/data/     all JSON the planner reads (moved from clients/bp/data so the demo folder is self-contained)
clients/bp/scripts/       fixture check, build-vercel.sh
```

On Vercel the demo folder is served as-is at `/client/demo/planner/BP/`.

## Code style

Match `app.js`: two-space indent, double quotes, template-literal HTML, `state` object, `render*` functions,
small pure helpers. Comments only where the reason isn't obvious.

## Testing strategy

No test framework exists. Verification per slice:
- Load every page in the browser at 1440px and 375px; no console errors, no sideways scroll, no "undefined"/"NaN".
- Scenarios: base KPIs total £200k; moving a slider changes KPIs and the curve; Reset restores the base.
- Plan Chat: each suggested question gets an answer that quotes plan figures.
- Fixture check script still passes.
- Independent review by the agent-skills code reviewer before deploy.
- After deploy: 401 without password, 200 with it; Freemans and BP-v2 unaffected.

## Boundaries

- Always: keep every existing page and feature that works without the API; keep synthetic-data notices.
- Ask first: removing any page or control not named above; changes to the Freemans demo or BP-v2.
- Never: call live APIs; copy Freemans branding into the planner; commit credentials.

## Success criteria

1. `https://taums.vercel.app/client/demo/planner/BP/` serves the planner behind the BP password.
2. Header, menu, colours, type and cards visibly match BP Intelligence v2.
3. Scenarios shows the five KPIs (spend £200k), sliders for the six channels named above, the response curve and the outcomes table, with no Freemans header or presets.
4. The menu says "Plan Chat" and that page is a chat window only, which answers from plan data.
5. No request goes to the Railway API; no page shows an API error.
6. All six pages pass the browser checks at 1440px and 375px.

## Assumptions

- "Remove the header" also removes the Freemans "Start from" preset buttons and "Suggest a better split"; Reset stays.
- Scenario channel shares follow the Freemans base split (45/18/12/10/10/5), scaled to £200k. The Scenarios headline calls it an illustrative what-if, since its six channels differ from the plan's four.
- The old Railway planner is left as it is.

## Change, 26 Oct 2026: £200k plan budget

David asked for the Campaign Planning budget to be £200k (was £4.8m) with the channel spread adjusted to match.
`clients/bp/scripts/rescale-budget.js 200000` rescaled all six stored plans and the fixtures proportionally:
every channel and month keeps its share (Blended: CTV £70k, Display £50k, Online Video £50k, Meta £30k);
engagements, impressions and the brief target scale with the budget (target 141,667); rates such as cost per
engagement and the £1.55 brief limit don't. Proportional scaling ignores diminishing returns.

