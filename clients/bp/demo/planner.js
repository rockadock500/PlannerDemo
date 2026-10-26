// Campaign Planning: brief and budget → channel guardrails → Strategic Index →
// generated base plan (editable channel × month table with target visitors and
// forecast clicks). Also owns the planner state that Scenarios, Approval, Admin
// and Planner Chat read. Uses plan-engine.js; reads `state` from app.js at call time.

const PLANNER_STORE = "bp_planner_v3";
const PLANNER_DEFAULT_BRIEF = "Build awareness of bp's investment case with the Global Business Elite through 2026: premium financial-news CTV and video for reach, contextual display on financial publishers for precision, and Meta to amplify results, AGM and conference moments. Drive qualified visits to bp's investor pages.";

const plannerState = {
  inputs: { start: "2026-01-01", end: "2026-12-31", budget: 200000, brief: PLANNER_DEFAULT_BRIEF },
  guardrails: null,
  strategicIndex: {},
  basePlan: null,
  scenarios: [],
  preferredScenarioId: null,
  status: null,
};

const plGbp = (n) => `£${Math.round(n).toLocaleString("en-GB")}`;
const plNum = (n) => Math.round(n).toLocaleString("en-GB");
const plCpc = (n) => (n == null ? "–" : `£${n.toFixed(2)}`);
const plDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const PE_SI_SHORT = { L: "Low", M: "Med", H: "High" };
const plEscape = (text) => String(text).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

function plannerConfig() {
  return {
    rules: Object.fromEntries(state.evidenceRules.channel_rules.map((r) => [r.channel, { optimal: r.mmm_optimal_share_pct, floor: r.strategic_floor_pct }])),
    phasing: Object.fromEntries(Object.entries(state.syntheticFixture.monthly_budget_weights_pct).map(([k, v]) => [Number(k.slice(5)), v])),
  };
}

function plannerDefaultGuardrails() {
  return Object.fromEntries(state.evidenceRules.channel_rules.map((r) => [r.channel, { min: r.strategic_floor_pct, max: 100 }]));
}

const PLANNER_VERSION = 3;

function plannerSave() {
  const { status, ...rest } = plannerState;
  try {
    localStorage.setItem(PLANNER_STORE, JSON.stringify({ v: PLANNER_VERSION, ...rest }));
  } catch {
    // Storage can be unavailable (private mode); the planner still works for this visit.
  }
}

// A saved plan is usable only if its shape is intact (older or hand-edited saves are discarded).
function plannerPlanIsValid(plan) {
  return Boolean(plan)
    && Array.isArray(plan.months) && plan.months.length > 0
    && Array.isArray(plan.channels) && plan.channels.length === PE_CHANNELS.length
    && Array.isArray(plan.monthly_allocations) && plan.monthly_allocations.length === plan.months.length * plan.channels.length
    && plan.monthly_allocations.every((r) => Number.isFinite(r.budget_gbp) && r.budget_gbp >= 0)
    && plan.monthly_targets && typeof plan.monthly_targets === "object"
    && plan.inputs && Number.isFinite(Number(plan.inputs.budget));
}

// Restores saved work, or builds the demo plan from the prefilled brief so every page has a plan on first visit.
function plannerInit() {
  try {
    const saved = JSON.parse(localStorage.getItem(PLANNER_STORE) || "null");
    if (saved?.v === PLANNER_VERSION && plannerPlanIsValid(saved.basePlan)) {
      Object.assign(plannerState, saved);
      delete plannerState.v;
      plannerState.scenarios = Array.isArray(saved.scenarios) ? saved.scenarios.filter(plannerPlanIsValid) : [];
      [plannerState.basePlan, ...plannerState.scenarios].forEach(peRecalc); // forecasts follow the current curves
    }
  } catch {
    // Ignore unreadable saved state and start fresh.
  }
  if (!plannerState.guardrails) plannerState.guardrails = plannerDefaultGuardrails();
  if (!plannerState.basePlan) {
    plannerState.basePlan = peGeneratePlan(plannerState.inputs, plannerConfig(), plannerState.guardrails, plannerState.strategicIndex);
    plannerSave();
  }
}

/** The plans other pages work with: the base plan, then generated scenarios. */
function plannerPlans() {
  return [plannerState.basePlan, ...plannerState.scenarios].filter(Boolean);
}

function plannerValidate(inputs) {
  const errors = {};
  if (!inputs.start) errors.start = "Choose a start date.";
  if (!inputs.end) errors.end = "Choose an end date.";
  if (inputs.start && inputs.end && inputs.end < inputs.start) errors.end = "End date must be on or after the start date.";
  if (inputs.start && inputs.end && peMonths(inputs.start, inputs.end).length > 24) errors.end = "Plan up to 24 months at a time.";
  if (!(Number(inputs.budget) >= 1000)) errors.budget = "Enter a budget of at least £1,000.";
  if (!String(inputs.brief || "").trim()) errors.brief = "Describe the brief so the plan has a strategy.";
  const guardrailErrors = plannerGuardrailErrors(plannerState.guardrails);
  if (guardrailErrors.length) errors.guardrails = guardrailErrors;
  return errors;
}

function plannerGuardrailErrors(g) {
  const errors = PE_CHANNELS.filter((c) => Number(g?.[c]?.min ?? 0) > Number(g?.[c]?.max ?? 100)).map((c) => `${c}: the minimum is above the maximum.`);
  const minSum = PE_CHANNELS.reduce((a, c) => a + Number(g?.[c]?.min ?? 0), 0);
  const maxSum = PE_CHANNELS.reduce((a, c) => a + Number(g?.[c]?.max ?? 100), 0);
  if (minSum > 100) errors.push(`The minimums add up to ${minSum}%, more than the whole budget.`);
  if (maxSum < 100) errors.push(`The maximums add up to ${maxSum}%, so the budget can't all be placed.`);
  return errors;
}

// True when the dates, budget, guardrails or Strategic Index differ from those the current base plan
// was built from. The brief text isn't read by the engine, so editing it doesn't ask for a regenerate.
function plannerInputsChanged() {
  const plan = plannerState.basePlan;
  if (!plan) return true;
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const pick = (i) => ({ start: i.start, end: i.end, budget: Math.round(Number(i.budget)) });
  const inputs = pick(plannerState.inputs);
  const months = peMonths(inputs.start, inputs.end).map((m) => m.key);
  const si = (src) => Object.fromEntries(PE_CHANNELS.map((c) => [c, months.map((k) => src?.[c]?.[k] || "M")]));
  return !same(inputs, pick(plan.inputs)) || !same(plannerState.guardrails, plan.guardrails) || !same(si(plannerState.strategicIndex), si(plan.strategic_index));
}

// ── Rendering ──────────────────────────────────────────────────────────────

function plannerStepHead(step, title, hint, actions = "") {
  return `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Step ${step}</p>
        <h2>${title}</h2>
        ${hint ? `<p class="table-hint pl-hint">${hint}</p>` : ""}
      </div>
      ${actions}
    </div>
  `;
}

function plannerBriefStep(errors) {
  const i = plannerState.inputs;
  const months = !errors.start && !errors.end ? peMonths(i.start, i.end) : [];
  const days = months.reduce((a, m) => a + m.covered, 0);
  const field = (id, label, control, error) => `
    <div class="pl-field">
      <label class="field-label" for="${id}">${label}</label>
      ${control}
      ${error ? `<p class="pl-error" id="${id}-error">${error}</p>` : ""}
    </div>
  `;
  return `
    <section class="panel" id="pl-step-brief">
      ${plannerStepHead(1, "Brief and budget", "Set the campaign dates and total budget, and describe what the plan needs to achieve.")}
      <div class="pl-brief-grid">
        ${field("plStart", "Start date", `<input type="date" id="plStart" value="${i.start}" ${errors.start ? 'aria-invalid="true" aria-describedby="plStart-error"' : ""} />`, errors.start)}
        ${field("plEnd", "End date", `<input type="date" id="plEnd" value="${i.end}" ${errors.end ? 'aria-invalid="true" aria-describedby="plEnd-error"' : ""} />`, errors.end)}
        ${field("plBudget", "Total budget", `<div class="pl-money"><span aria-hidden="true">£</span><input type="number" id="plBudget" min="1000" step="1000" inputmode="numeric" value="${i.budget}" ${errors.budget ? 'aria-invalid="true" aria-describedby="plBudget-error"' : ""} /></div>`, errors.budget)}
      </div>
      ${field("plBrief", "Brief", `<textarea id="plBrief" rows="5" placeholder="Objectives, audience, priorities and anything the plan must respect." ${errors.brief ? 'aria-invalid="true" aria-describedby="plBrief-error"' : ""}>${plEscape(i.brief)}</textarea>`, errors.brief)}
      <p class="pl-summary">${months.length ? `${months.length} month${months.length > 1 ? "s" : ""} · ${days} days · ${plGbp(Number(i.budget) || 0)}` : "Choose valid dates to see the months covered."}</p>
    </section>
  `;
}

function plannerGuardrailStep() {
  const rules = plannerConfig().rules;
  const g = plannerState.guardrails;
  return `
    <section class="panel" id="pl-step-guardrails">
      ${plannerStepHead(2, "Channel guardrails", "The minimum and maximum share of budget each channel may take, whatever the model would otherwise do.", `<button class="secondary-button" type="button" id="plResetGuardrails">Reset</button>`)}
      <div class="table-wrap">
        <table class="pl-table pl-guardrails">
          <thead><tr><th scope="col">Channel</th><th scope="col">Starting share</th><th scope="col">Min %</th><th scope="col">Max %</th></tr></thead>
          <tbody>
            ${PE_CHANNELS.map((c) => `
              <tr>
                <th scope="row">${c}</th>
                <td>${rules[c]?.optimal ?? "–"}%</td>
                <td><input type="number" min="0" max="100" step="1" value="${g[c]?.min ?? 0}" data-pl-guard="${c}" data-pl-guard-field="min" aria-label="${c} minimum share" aria-describedby="plGuardErrors" /></td>
                <td><input type="number" min="0" max="100" step="1" value="${g[c]?.max ?? 100}" data-pl-guard="${c}" data-pl-guard-field="max" aria-label="${c} maximum share" aria-describedby="plGuardErrors" /></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div id="plGuardErrors">${plannerGuardrailErrorsHtml()}</div>
    </section>
  `;
}

function plannerGuardrailErrorsHtml() {
  return plannerGuardrailErrors(plannerState.guardrails).map((e) => `<p class="pl-error">${e}</p>`).join("");
}

function plannerStrategicStep(months) {
  const si = plannerState.strategicIndex;
  return `
    <section class="panel" id="pl-step-si">
      ${plannerStepHead(3, "Strategic Index", "A strategist's view of each channel's value by month: Low, Medium or High. It tilts the model's weighting (Low ×0.7, High ×1.3) rather than forcing an outcome, and is entered from agency planning experience, not derived from cost data.", `<button class="secondary-button" type="button" id="plResetSi">All Medium</button>`)}
      ${months.length ? `
        <div class="table-wrap">
          <table class="pl-table pl-si">
            <thead><tr><th scope="col">Channel</th>${months.map((m) => `<th scope="col">${m.label}</th>`).join("")}<th scope="col">Set row</th></tr></thead>
            <tbody>
              ${PE_CHANNELS.map((c) => `
                <tr>
                  <th scope="row">${c}</th>
                  ${months.map((m) => {
                    const v = si[c]?.[m.key] || "M";
                    return `<td><select class="pl-si-select si-${v}" data-pl-si="${c}" data-pl-si-month="${m.key}" aria-label="${c}, ${m.label}">${["L", "M", "H"].map((o) => `<option value="${o}" ${o === v ? "selected" : ""}>${PE_SI_SHORT[o]}</option>`).join("")}</select></td>`;
                  }).join("")}
                  <td><select class="pl-si-row" data-pl-si-row="${c}" aria-label="Set every month for ${c}"><option value="">…</option>${["L", "M", "H"].map((o) => `<option value="${o}">All ${PE_SI_LABELS[o]}</option>`).join("")}</select></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      ` : `<p class="table-hint">Choose valid dates in step 1 to set the Strategic Index by month.</p>`}
    </section>
  `;
}

function plannerNoteText() {
  if (!canGeneratePlans()) return "Viewers can review the plan but not generate or edit one.";
  if (Object.keys(plannerValidate(plannerState.inputs)).length) return "Fix the highlighted inputs above first.";
  if (plannerInputsChanged()) return "Inputs have changed since this plan was generated. Regenerate to apply them.";
  return plannerState.status || "The plan below reflects the current inputs.";
}

// After a step 1–3 change: refresh only what depends on it, so focus and the next click aren't lost.
function plannerRefreshInputs({ monthsChanged = false } = {}) {
  const root = document.querySelector("#campaignPlanning");
  if (!root) return;
  const errors = plannerValidate(plannerState.inputs);
  [["plStart", "start"], ["plEnd", "end"], ["plBudget", "budget"], ["plBrief", "brief"]].forEach(([id, key]) => {
    const input = root.querySelector(`#${id}`);
    const field = input?.closest(".pl-field");
    if (!field) return;
    let message = field.querySelector(".pl-error");
    if (errors[key]) {
      if (!message) {
        message = document.createElement("p");
        message.className = "pl-error";
        message.id = `${id}-error`;
        field.appendChild(message);
      }
      message.textContent = errors[key];
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", message.id);
    } else {
      message?.remove();
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  });
  const i = plannerState.inputs;
  const months = errors.start || errors.end ? [] : peMonths(i.start, i.end);
  const days = months.reduce((a, m) => a + m.covered, 0);
  root.querySelector(".pl-summary").textContent = months.length ? `${months.length} month${months.length > 1 ? "s" : ""} · ${days} days · ${plGbp(Number(i.budget) || 0)}` : "Choose valid dates to see the months covered.";
  root.querySelector("#plGuardErrors").innerHTML = plannerGuardrailErrorsHtml();
  if (monthsChanged) root.querySelector("#pl-step-si").outerHTML = plannerStrategicStep(months);
  const button = root.querySelector("#plGenerate");
  button.disabled = Boolean(Object.keys(errors).length) || !canGeneratePlans();
  root.querySelector("#plGenerateNote").textContent = plannerNoteText();
}

function plannerOutputStep() {
  const plan = plannerState.basePlan;
  const canGenerate = !Object.keys(plannerValidate(plannerState.inputs)).length && canGeneratePlans();
  const readonly = canGeneratePlans() ? "" : "readonly";
  const head = plannerStepHead(4, "Base plan", "Budget by channel and month, with target visitors and forecast clicks. Edit any budget or target; totals and forecasts update as you type.", `
    <div class="pl-actions">
      <button class="secondary-button" type="button" id="plExportCsv">Export CSV</button>
      <button class="secondary-button" type="button" id="plExportXlsx">Download Excel</button>
    </div>
  `);
  const generateBar = `
    <div class="pl-generate">
      <button class="primary-button" type="button" id="plGenerate" ${canGenerate ? "" : "disabled"}>${plan ? "Regenerate base plan" : "Generate base plan"}</button>
      <p class="table-hint" id="plGenerateNote" role="status">${plannerNoteText()}</p>
    </div>
  `;
  if (!plan) return `<section class="panel" id="pl-step-plan">${head}${generateBar}</section>`;
  return `
    <section class="panel" id="pl-step-plan">
      ${head}
      ${generateBar}
      <div class="status-strip pl-kpis" id="plKpis"></div>
      <div class="pl-banner" id="plEditBanner" hidden></div>
      <p class="pl-caption" id="plPlanCaption">Budgets in £. Click any budget or target to edit it.</p>
      <div class="table-wrap">
        <table class="pl-table pl-plan" id="plPlanTable" aria-describedby="plPlanCaption">
          <thead><tr><th scope="col">Channel</th>${plan.months.map((m) => `<th scope="col">${m.label}${m.fraction < 1 ? `<span class="pl-part">${m.covered}/${m.days} days</span>` : ""}</th>`).join("")}<th scope="col">Total</th></tr></thead>
          <tbody>
            ${plan.channels.map((c) => `
              <tr>
                <th scope="row">${c}<span class="pl-share" data-pl-share="${c}"></span></th>
                ${plan.months.map((m) => {
                  const cell = plan.monthly_allocations.find((r) => r.month === m.key && r.channel === c);
                  return `<td><input type="number" min="0" step="100" inputmode="numeric" value="${cell.budget_gbp}" data-pl-cell="${m.key}|${c}" ${readonly} aria-label="${c} budget, ${m.label}" /></td>`;
                }).join("")}
                <td class="pl-total" data-pl-ctotal="${c}"></td>
              </tr>
            `).join("")}
            <tr class="pl-row-total"><th scope="row">Budget</th>${plan.months.map((m) => `<td data-pl-mtotal="${m.key}"></td>`).join("")}<td data-pl-gtotal="budget"></td></tr>
            <tr class="pl-row-target"><th scope="row">Target visitors</th>${plan.months.map((m) => `<td><input type="number" min="0" step="100" inputmode="numeric" value="${plan.monthly_targets[m.key]}" data-pl-target="${m.key}" ${readonly} aria-label="Target visitors, ${m.label}" /></td>`).join("")}<td data-pl-gtotal="target"></td></tr>
            <tr class="pl-row-kpi"><th scope="row">Forecast clicks</th>${plan.months.map((m) => `<td data-pl-mclicks="${m.key}"></td>`).join("")}<td data-pl-gtotal="clicks"></td></tr>
            <tr class="pl-row-kpi"><th scope="row">Cost per click</th>${plan.months.map((m) => `<td data-pl-mcpc="${m.key}"></td>`).join("")}<td data-pl-gtotal="cpc"></td></tr>
            <tr class="pl-row-kpi"><th scope="row">Clicks vs target</th>${plan.months.map((m) => `<td data-pl-mvs="${m.key}"></td>`).join("")}<td data-pl-gtotal="vs"></td></tr>
          </tbody>
        </table>
      </div>
      <details class="pl-how">
        <summary>How the plan is built</summary>
        <ul>
          <li>Month budgets follow bp's phasing (results windows weigh more), pro rata for part months.</li>
          <li>Channel shares start from the evidence rules' optimal shares, tilted by the Strategic Index and held inside the guardrails.</li>
          <li>Within each month, the Strategic Index moves money between channels; budgets are whole pounds and add up exactly.</li>
          <li>Forecast clicks come from synthetic diminishing-returns curves per channel; each extra pound buys fewer clicks.</li>
          <li>Target visitors start at the month's budget ÷ £${PE_TARGET_COST_PER_VISITOR.toFixed(2)}; a click counts as one visitor when comparing.</li>
        </ul>
      </details>
    </section>
  `;
}

// Updates every derived figure in place, so the input being typed in keeps focus.
function plannerUpdateOutputs() {
  const plan = plannerState.basePlan;
  const root = document.querySelector("#pl-step-plan");
  if (!plan || !root?.querySelector("#plKpis")) return;
  const vs = (clicks, target) => (target ? clicks / target - 1 : null);
  const vsHtml = (v) => (v == null ? "–" : `<span class="pl-vs ${v >= 0 ? "good" : "bad"}">${v >= 0 ? "+" : "−"}${Math.abs(v * 100).toFixed(1)}%</span>`);
  const totalVs = vs(plan.forecast_clicks, plan.target_visitors);
  root.querySelector("#plKpis").innerHTML = [
    ["Budget", plGbp(plan.total_budget_gbp), plan.qa.budget_matches_brief ? "Matches the brief" : `Brief: ${plGbp(plan.inputs.budget)}`],
    ["Target visitors", plNum(plan.target_visitors), `${plan.months.length} months`],
    ["Forecast clicks", plNum(plan.forecast_clicks), "Synthetic curves"],
    ["Cost per click", plCpc(plan.cost_per_click), `Target £${(plan.target_visitors ? plan.total_budget_gbp / plan.target_visitors : 0).toFixed(2)} per visitor`],
    ["Clicks vs target", totalVs == null ? "–" : `${totalVs >= 0 ? "+" : "−"}${Math.abs(totalVs * 100).toFixed(1)}%`, plan.qa.months_short.length ? `${plan.qa.months_short.length} month${plan.qa.months_short.length > 1 ? "s" : ""} short` : "Every month on target"],
  ].map(([label, value, sub]) => `<div><span>${label}</span><strong>${value}</strong><em>${sub}</em></div>`).join("");
  plan.channel_totals.forEach((c) => {
    root.querySelector(`[data-pl-ctotal="${CSS.escape(c.channel)}"]`).textContent = plGbp(c.budget_gbp);
    root.querySelector(`[data-pl-share="${CSS.escape(c.channel)}"]`).textContent = `${c.share_pct.toFixed(1)}%`;
  });
  plan.month_totals.forEach((m) => {
    root.querySelector(`[data-pl-mtotal="${m.month}"]`).textContent = plGbp(m.budget_gbp);
    root.querySelector(`[data-pl-mclicks="${m.month}"]`).textContent = plNum(m.forecast_clicks);
    root.querySelector(`[data-pl-mcpc="${m.month}"]`).textContent = plCpc(m.forecast_clicks ? m.budget_gbp / m.forecast_clicks : null);
    root.querySelector(`[data-pl-mvs="${m.month}"]`).innerHTML = vsHtml(vs(m.forecast_clicks, m.target_visitors));
  });
  root.querySelector('[data-pl-gtotal="budget"]').textContent = plGbp(plan.total_budget_gbp);
  root.querySelector('[data-pl-gtotal="target"]').textContent = plNum(plan.target_visitors);
  root.querySelector('[data-pl-gtotal="clicks"]').textContent = plNum(plan.forecast_clicks);
  root.querySelector('[data-pl-gtotal="cpc"]').textContent = plCpc(plan.cost_per_click);
  root.querySelector('[data-pl-gtotal="vs"]').innerHTML = vsHtml(totalVs);
  const banner = root.querySelector("#plEditBanner");
  const mismatch = !plan.qa.budget_matches_brief;
  banner.hidden = !plan.edited;
  banner.className = `pl-banner ${mismatch ? "warn" : ""}`;
  banner.innerHTML = plan.edited ? `
    <span>${mismatch ? `Edited budget is ${plGbp(plan.total_budget_gbp)}, ${plan.total_budget_gbp > plan.inputs.budget ? "over" : "under"} the ${plGbp(plan.inputs.budget)} brief by ${plGbp(Math.abs(plan.total_budget_gbp - plan.inputs.budget))}.` : "You've edited the generated plan."}</span>
    <button class="secondary-button" type="button" id="plResetEdits">Reset to generated</button>
  ` : "";
}

function renderCampaignPlanning() {
  const root = document.querySelector("#campaignPlanning");
  if (!root) return;
  const errors = plannerValidate(plannerState.inputs);
  const months = errors.start || errors.end ? [] : peMonths(plannerState.inputs.start, plannerState.inputs.end);
  root.innerHTML = `
    <nav class="pl-steps" aria-label="Planning steps">
      <a href="#pl-step-brief"><span>1</span>Brief and budget</a>
      <a href="#pl-step-guardrails"><span>2</span>Guardrails</a>
      <a href="#pl-step-si"><span>3</span>Strategic Index</a>
      <a href="#pl-step-plan"><span>4</span>Base plan</a>
    </nav>
    ${plannerBriefStep(errors)}
    ${plannerGuardrailStep()}
    ${plannerStrategicStep(months)}
    ${plannerOutputStep()}
  `;
  plannerUpdateOutputs();
}

// Re-renders the page but puts focus back on the control that was being used.
function plannerRerender() {
  const active = document.activeElement;
  const id = active?.id;
  // Match on every data-pl-* attribute, so a cell is found by both its channel and its month.
  const data = active ? [...active.attributes].filter((a) => a.name.startsWith("data-pl-")) : [];
  renderCampaignPlanning();
  const selector = data.map((a) => `[${a.name}="${CSS.escape(a.value)}"]`).join("");
  const target = id ? document.getElementById(id) : selector ? document.querySelector(selector) : null;
  target?.focus();
}

// ── Actions ────────────────────────────────────────────────────────────────

function plannerGenerate() {
  const errors = plannerValidate(plannerState.inputs);
  if (Object.keys(errors).length || !canGeneratePlans()) return;
  const losses = [
    plannerState.basePlan?.edited ? "your edits to the base plan" : "",
    plannerState.scenarios.length ? `${plannerState.scenarios.length} scenario${plannerState.scenarios.length > 1 ? "s" : ""}` : "",
    plannerPlans().some((p) => state.currentApprovedVersionId === `plan_version_${p.plan_id}`) ? "the approved plan (its approval record is kept)" : "",
  ].filter(Boolean);
  if (losses.length && !window.confirm(`Regenerating replaces ${losses.join(", ")}. Continue?`)) return;
  plannerState.basePlan = peGeneratePlan(plannerState.inputs, plannerConfig(), plannerState.guardrails, plannerState.strategicIndex);
  const hadScenarios = plannerState.scenarios.length;
  plannerState.scenarios = [];
  plannerState.preferredScenarioId = null;
  plannerState.status = `Generated ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}.${hadScenarios ? " Scenarios built on the previous plan were cleared." : ""}`;
  plannerSave();
  renderAll();
  document.querySelector("#plGenerate")?.focus();
}

function plannerExportRows() {
  const plan = plannerState.basePlan;
  const header = ["Channel", ...plan.months.map((m) => m.label), "Total"];
  const rows = plan.channels.map((c) => [c, ...plan.months.map((m) => plan.monthly_allocations.find((r) => r.month === m.key && r.channel === c).budget_gbp), plan.channel_totals.find((t) => t.channel === c).budget_gbp]);
  rows.push(["Budget", ...plan.month_totals.map((m) => m.budget_gbp), plan.total_budget_gbp]);
  rows.push(["Target visitors", ...plan.month_totals.map((m) => m.target_visitors), plan.target_visitors]);
  rows.push(["Forecast clicks", ...plan.month_totals.map((m) => m.forecast_clicks), plan.forecast_clicks]);
  rows.push(["Cost per click", ...plan.month_totals.map((m) => (m.forecast_clicks ? +(m.budget_gbp / m.forecast_clicks).toFixed(2) : "")), plan.cost_per_click ? +plan.cost_per_click.toFixed(2) : ""]);
  return [header, ...rows];
}

function plannerExportCsv() {
  const rows = [...plannerExportRows(), [], ["Synthetic demo data: click curves, costs per click and default targets are planning assumptions."]];
  const csv = rows.map((row) => row.map((v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v)).join(",")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = "bp-base-plan.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function plannerExportXlsx() {
  const plan = plannerState.basePlan;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
    ["Plan", plan.scenario.label],
    ["Dates", `${plan.inputs.start} to ${plan.inputs.end}`],
    ["Brief budget (GBP)", plan.inputs.budget],
    ["Planned budget (GBP)", plan.total_budget_gbp],
    ["Target visitors", plan.target_visitors],
    ["Forecast clicks", plan.forecast_clicks],
    ["Cost per click (GBP)", plan.cost_per_click ? +plan.cost_per_click.toFixed(2) : ""],
    [],
    ["Brief", plan.inputs.brief],
    [],
    ["Synthetic demo data: click curves and costs are planning assumptions."],
  ]), "Summary");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(plannerExportRows()), "Plan by month");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
    ["Channel", ...plan.months.map((m) => m.label)],
    ...plan.channels.map((c) => [c, ...plan.months.map((m) => PE_SI_LABELS[plan.strategic_index?.[c]?.[m.key] || "M"])]),
  ]), "Strategic Index");
  XLSX.writeFile(wb, "bp-base-plan.xlsx");
}

function plannerAttachEvents() {
  const root = document.querySelector("#campaignPlanning");
  if (!root) return;
  root.addEventListener("input", (event) => {
    const t = event.target;
    const plan = plannerState.basePlan;
    if (t.dataset.plCell && plan) {
      const [month, channel] = t.dataset.plCell.split("|");
      plan.monthly_allocations.find((r) => r.month === month && r.channel === channel).budget_gbp = Math.max(0, Math.round(Number(t.value) || 0));
      peRecalc(plan);
      plannerUpdateOutputs();
    } else if (t.dataset.plTarget && plan) {
      plan.monthly_targets[t.dataset.plTarget] = Math.max(0, Math.round(Number(t.value) || 0));
      peRecalc(plan);
      plannerUpdateOutputs();
    }
  });
  root.addEventListener("change", (event) => {
    const t = event.target;
    const plan = plannerState.basePlan;
    if (t.dataset.plCell && plan) {
      const [month, channel] = t.dataset.plCell.split("|");
      t.value = plan.monthly_allocations.find((r) => r.month === month && r.channel === channel).budget_gbp; // show the clamped value
      plannerSave();
      return;
    }
    if (t.dataset.plTarget && plan) {
      t.value = plan.monthly_targets[t.dataset.plTarget];
      plannerSave();
      return;
    }
    if (t.id === "plStart" || t.id === "plEnd" || t.id === "plBudget" || t.id === "plBrief") {
      const key = { plStart: "start", plEnd: "end", plBudget: "budget", plBrief: "brief" }[t.id];
      const monthKeys = () => peMonths(plannerState.inputs.start, plannerState.inputs.end).map((m) => m.key).join();
      const before = monthKeys();
      plannerState.inputs[key] = key === "budget" ? Number(t.value) : t.value;
      plannerState.status = null;
      plannerSave();
      plannerRefreshInputs({ monthsChanged: monthKeys() !== before });
      return;
    }
    if (t.dataset.plGuard) {
      const value = Math.min(100, Math.max(0, Math.round(Number(t.value) || 0)));
      plannerState.guardrails[t.dataset.plGuard][t.dataset.plGuardField] = value;
      t.value = value;
      plannerSave();
      plannerRefreshInputs();
      return;
    }
    if (t.dataset.plSi) {
      plannerState.strategicIndex[t.dataset.plSi] = { ...(plannerState.strategicIndex[t.dataset.plSi] || {}), [t.dataset.plSiMonth]: t.value };
      t.className = `pl-si-select si-${t.value}`;
      plannerSave();
      plannerRefreshInputs();
      return;
    }
    if (t.dataset.plSiRow && t.value) {
      const channel = t.dataset.plSiRow;
      const months = peMonths(plannerState.inputs.start, plannerState.inputs.end);
      plannerState.strategicIndex[channel] = Object.fromEntries(months.map((m) => [m.key, t.value]));
      root.querySelectorAll(`[data-pl-si="${CSS.escape(channel)}"]`).forEach((select) => {
        select.value = t.value;
        select.className = `pl-si-select si-${t.value}`;
      });
      t.value = "";
      plannerSave();
      plannerRefreshInputs();
    }
  });
  root.addEventListener("click", (event) => {
    const t = event.target.closest("button");
    if (!t) return;
    if (t.id === "plGenerate") plannerGenerate();
    if (t.id === "plExportCsv") plannerExportCsv();
    if (t.id === "plExportXlsx") plannerExportXlsx();
    if (t.id === "plResetGuardrails") {
      plannerState.guardrails = plannerDefaultGuardrails();
      plannerSave();
      plannerRerender();
    }
    if (t.id === "plResetSi") {
      plannerState.strategicIndex = {};
      plannerSave();
      plannerRerender();
    }
    if (t.id === "plResetEdits") {
      const plan = plannerState.basePlan;
      plan.monthly_allocations.forEach((r, i) => { r.budget_gbp = plan.generated.allocations[i]; });
      plan.monthly_targets = { ...plan.generated.targets };
      peRecalc(plan);
      plannerSave();
      renderAll();
      document.querySelector("#plGenerate")?.focus();
    }
  });
}
