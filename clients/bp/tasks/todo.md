# BP planner on Vercel: tasks

Spec: `../SPEC-vercel-v2.md`. One commit per task; verify before moving on.

- [x] 1. Self-contained and static
  - Move `clients/bp/data` to `clients/bp/demo/data`; app reads `./data/`.
  - Replace every live API call with stored data (base plan, data readiness, last plan, upload, calendar overview).
  - Acceptance: no request to the Railway API; every page loads with no console errors; fixture check passes.
  - Files: app.js, scripts/check_synthetic_fixture_reconciliation.js
- [x] 2. v2 shell
  - Banner, white header with Helios logo, top menu ("Plan Chat"), phone menu; remove sidebar; Inter; v2 colour tokens.
  - Acceptance: header matches Intelligence v2; menu switches views; works at 375px.
  - Files: index.html, styles.css, app.js (nav wiring only)
- [x] 3. v2 components
  - Cards, buttons, inputs, tables, badges, status strip, calendar restyled; wide tables scroll in their card; drop body min-width.
  - Acceptance: every page reads as v2 at 1440px; no sideways page scroll at 375px.
  - Files: styles.css
- [x] 4. Scenarios
  - New `scenarios.js`: engine (curves per channel, £200k base), five KPIs, sliders, response curve (SVG), outcomes table, Reset.
  - Acceptance: base spend £200k; slider moves KPIs, curve point and table; Reset restores base.
  - Files: scenarios.js, index.html, app.js (view hook), styles.css
- [x] 5. Plan Chat
  - New `chat.js`: chat window only; suggested questions in the empty state; static answers from the Blended plan.
  - Acceptance: every suggested question answers with plan figures; free-text questions get a sensible answer.
  - Files: chat.js, index.html, app.js (remove old chat render/API)
- [x] 6. Vercel
  - `build-vercel.sh`; middleware gate extended to `/client/demo/planner/BP`; README section.
  - Acceptance: local copy of the Vercel folder serves the planner at the sub-path.
- [ ] 7. Review and verify
  - agent-skills code reviewer; fix findings; full sweep at 1440px and 375px.
- [ ] 8. Deploy to Vercel (David asked for the move) and check live: password gate, all pages, Freemans and BP-v2 unaffected.
