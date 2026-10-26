# BP Planner v3: tasks

Spec: `../SPEC-planner-v3.md`. One commit per task; verify in the browser before moving on.

- [ ] 1. Planning engine (`demo/plan-engine.js`)
  - Months with pro-rata fractions, month budgets, channel shares with Strategic Index and guardrails,
    fitted and exactly rounded cells, click curves, default targets, totals, QA and warnings; scenario transforms.
  - Verify: node check script (totals exact, shares inside guardrails, SI High raises a channel, edits recalc).
- [ ] 2. Campaign Planning UI (`demo/planner.js`, index.html, styles.css)
  - Steps 1–4 as specced; editable table; persistence; export CSV / Excel. Remove uploads and the old
    status strip, plan table, evidence inspector and channel summary; remove their app.js code.
  - Verify: browser at 1440 and 375; generate; edit cells; reload keeps edits.
- [ ] 3. Menu and pages
  - Scenarios → Curves; restored Scenarios view; Data Readiness view before Admin; Planner Chat name.
- [ ] 4. Restored Scenarios (`demo/scenario-centre.js`)
  - Stored scenario buttons, free text → closest scenario, cards with facts, preferred, remove, full plan.
- [ ] 5. Approval, Admin, Planner Chat on the base plan (visitors / clicks).
- [ ] 6. Independent review (agent-skills code reviewer); fix findings.
- [ ] 7. Full sweep, commit, deploy, check live.
