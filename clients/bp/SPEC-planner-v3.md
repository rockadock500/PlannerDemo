# Spec: BP Planner v3 — new Campaign Planning flow, Scenarios back, Curves, Data Readiness page

Requested by David, 26 Oct 2026. Builds on `SPEC-vercel-v2.md` (static, Vercel, v2 look).

## Decisions (confirmed)

- Base plan table: **channels × months**, budget cells editable, then rows for target visitors (editable), forecast clicks, cost per click and clicks vs target.
- Original Scenarios page comes back, **built from the base plan** (no API).
- **Whole planner** uses the generated base plan: visitors are the target, clicks the KPI (Scenarios, Approval, Admin, Planner Chat).
- Dates are **exact start and end dates**; part months get a pro-rata share.

## Menu

Campaign Planning · Scenarios · Curves · Planner Chat · Events Calendar · Approval · Data Readiness · Admin

- **Curves** = the current Freemans-style what-if page, renamed (content unchanged).
- **Scenarios** = the original Scenario Centre, restored (see below).
- **Planner Chat** = renamed from Plan Chat.
- **Data Readiness** = the section moved out of Campaign Planning onto its own page, before Admin.

## Campaign Planning flow

1. **Brief and budget**: start date, end date, total budget (£), brief (free text, required). No file uploads.
   Prefilled with a demo brief (1 Jan–31 Dec 2026, £200,000) so every page has a plan on first visit.
2. **Channel guardrails**: Min % / Max % per channel (CTV & Streaming, Programmatic Display, Online Video, Meta).
   Defaults: the evidence-rule floors (25/15/15/8), max 100.
3. **Strategic Index**: channel × month grid, each cell Low / Medium / High (default Medium).
   Low ×0.7, Medium ×1.0, High ×1.3 on that channel's weight in that month.
4. **Generate base plan** → **Base plan**: KPI strip (budget, target visitors, forecast clicks, cost per click,
   clicks vs target) and the editable table. Editing a budget cell or a target recalculates totals and forecasts
   live; a banner shows if the edited total no longer matches the brief budget, with "Reset to generated".
   Export CSV and Download Excel stay.

### Planning engine (synthetic, documented in code)

- **Months** in the date range; each gets `fraction` = days covered / days in month.
- **Month budgets** ∝ bp phasing weight for that calendar month (fixture weights: results windows heavier) × fraction.
- **Channel shares** ∝ evidence-rule optimal share × Strategic Index multiplier averaged over the months (weighted by
  month budget), held inside the guardrails (solved for a scale factor, so feasible guardrails always hold).
  Guardrails with a minimum above its maximum, minimums over 100% or maximums under 100% block Generate.
- **Cells**: channel weight × Strategic Index multiplier for that month, fitted so months and channels both hit
  their totals (iterative proportional fitting), rounded to whole pounds with exact totals.
- **Forecast clicks** per cell from a per-channel diminishing-returns curve: clicks = (ref ÷ CPC₀) × (spend ÷ ref)^b.
- **Target visitors** default to month budget ÷ £1.30 target cost per visitor; editable.
- A click counts as one visitor when comparing forecast with target.

## Scenarios (restored)

Base-plan panel (which plan is used), stored scenario buttons (Blended, Brand Awareness, GBE Precision Reach,
Results Season Burst, Energy Conference Moments, AGM & Strategy Update), a free-text scenario box, comparison
cards (budget, forecast clicks, CPC, vs target, top channel moves, objective / constraints / risk facts),
Mark preferred, Remove, and View full plan (read-only channel × month table).

- A stored scenario reshapes the **base plan as edited**: channel multipliers (reach vs performance weights),
  month multipliers (results months, Feb–Apr, conference months) and a cost factor, rescaled to the same total.
- Free text picks the closest stored scenario (its name first, then keywords) and says so; a tie offers both.
- A scenario built from an earlier version of the base plan is flagged "out of date" with Rebuild.
- The preferred scenario is offered first on Approval.

## Other pages

- **Approval / Admin**: stored plans are the base plan and generated scenarios. Approval remembers exactly what
  was approved: a later edit shows "Edited since approval, re-approve", and a regenerated or removed approved plan
  is reported as replaced (with a confirmation before it happens). Approval shows clicks, CPC,
  target visitors, budget; QA checks (budget matches brief, guardrails respected, months covered); warnings
  (months below target, budget mismatch, synthetic-curve caveat). Admin lists and removes scenarios.
- **Planner Chat**: answers about the base plan in visitors and clicks (months, channels, Strategic Index,
  target gaps, cost changes, guardrails).
- Events Calendar, Admin users/sources, Logic and Architecture views: unchanged.

## Success criteria

1. Campaign Planning has dates, budget and brief inputs and no uploads; guardrails; a Low/Medium/High grid;
   Generate produces a channel × month table whose budget totals equal the input budget exactly.
2. Budget and target cells are editable; totals, clicks, CPC and vs-target update immediately; edits persist on reload.
3. Menu order and names as above; Data Readiness works on its own page.
4. Scenarios generates all six stored scenarios from the base plan, compares them, marks a preferred one and
   shows a full plan; Approval and Admin list the same plans.
5. Planner Chat answers in visitors and clicks from the base plan.
6. Every page passes the browser checks at 1440px and 375px; no API calls; no "GBE engagements" left on
   pages that now use clicks.

## Boundaries

- Always: static only; keep synthetic-data honesty; keep Events, Admin users/sources, Curves unchanged.
- Ask first: removing any other page or control.
- Never: call an API; present synthetic CPCs as real.

## Change, 26 Oct 2026: two tables

David asked for Campaign Planning to have two tables. The flow is now:

1. **Brief and budget**: dates, total budget, brief.
2. **Budget and targets by month**: the total budget spread across the months (phasing, pro rata) and target
   visitors per month. Totals only, no channels. Edited in the cell: text boxes with no spinner arrows.
   Editing a target updates the base plan at once; editing a budget asks for a regenerate. Changing the dates
   or budget re-spreads the table (with a confirmation if it was edited); "Reset to phasing" restores it.
3. **Strategic Index**: Low / Medium / High by channel for the months in the month table only.
4. **Channel guardrails**.
5. **Base plan**: each month's budget from step 2 allocated by channel (month totals equal the month table
   exactly); targets come from step 2; channel figures can still be fine-tuned.

