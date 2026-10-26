// Campaign Planning: brief and budget → budget and targets by month (editable) →
// Strategic Index for those months → channel guardrails → base plan (each month's
// budget allocated by channel, with forecast clicks against the month's target).
// Also owns the planner state that Scenarios, Approval, Admin and Planner Chat read.
// Uses plan-engine.js; reads `state` from app.js at call time.

const PLANNER_STORE = "bp_planner_v3";
const PLANNER_DEFAULT_BRIEF = "Build awareness of bp's investment case with the Global Business Elite through 2026: premium financial-news CTV and video for reach, contextual display on financial publishers for precision, and Meta to amplify results, AGM and conference moments. Drive qualified visits to bp's investor pages.";

const plannerState = {
  inputs: { start: "2026-01-01", end: "2026-12-31", budget: 200000, brief: PLANNER_DEFAULT_BRIEF },
  monthly: null, // the budget-by-month table: { months, budgets: {monthKey: £}, targets: {monthKey: visitors} }
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
// Editable cells are text boxes (no spinner arrows) showing thousands separators; typing accepts digits only.
const plParse = (value) => Math.max(0, Math.round(Number(String(value).replace(/[^\d.]/g, "")) || 0));
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

const PLANNER_VERSION = 4;

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
    && plan.monthly_basis && typeof plan.monthly_basis === "object"
    && plan.inputs && Number.isFinite(Number(plan.inputs.budget));
}

function plannerTableIsValid(table) {
  return Boolean(table) && Array.isArray(table.months) && table.months.length > 0
    && table.months.every((m) => Number.isFinite(Number(table.budgets?.[m.key])) && Number.isFinite(Number(table.targets?.[m.key])));
}

// Restores saved work, or builds the demo plan from the prefilled brief so every page has a plan on first visit.
function plannerInit() {
  try {
    const saved = JSON.parse(localStorage.getItem(PLANNER_STORE) || "null");
    if (saved?.v === PLANNER_VERSION && plannerPlanIsValid(saved.basePlan) && plannerTableIsValid(saved.monthly)) {
      Object.assign(plannerState, saved);
      delete plannerState.v;
      plannerState.scenarios = Array.isArray(saved.scenarios) ? saved.scenarios.filter(plannerPlanIsValid) : [];
      [plannerState.basePlan, ...plannerState.scenarios].forEach(peRecalc); // forecasts follow the current curves
    }
  } catch {
    // Ignore unreadable saved state and start fresh.
  }
  if (!plannerState.guardrails) plannerState.guardrails = plannerDefaultGuardrails();
  if (!plannerTableIsValid(plannerState.monthly)) plannerState.monthly = pePhaseMonths(plannerState.inputs, plannerConfig());
  if (!plannerState.basePlan) {
    plannerState.basePlan = peGeneratePlan(plannerState.inputs, plannerConfig(), plannerState.guardrails, plannerState.strategicIndex, plannerState.monthly);
    plannerSave();
  }
}

/** The plans other pages work with: the base plan, then generated scenarios. */
function plannerPlans() {
  return [plannerState.basePlan, ...plannerState.scenarios].filter(Boolean);
}

const plannerTableTotal = (key) => plannerState.monthly.months.reduce((a, m) => a + (Number(plannerState.monthly[key][m.key]) || 0), 0);

/** True when the month table differs from bp's phasing of the brief budget across the dates. */
function plannerTableEdited() {
  const phased = pePhaseMonths(plannerState.inputs, plannerConfig());
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  return !same(phased.months.map((m) => m.key), plannerState.monthly.months.map((m) => m.key))
    || !same(phased.budgets, plannerState.monthly.budgets) || !same(phased.targets, plannerState.monthly.targets);
}

function plannerValidate(inputs) {
  const errors = {};
  if (!inputs.start) errors.start = "Choose a start date.";
  if (!inputs.end) errors.end = "Choose an end date.";
  if (inputs.start && inputs.end && inputs.end < inputs.start) errors.end = "End date must be on or after the start date.";
  if (inputs.start && inputs.end && peMonths(inputs.start, inputs.end).length > 24) errors.end = "Plan up to 24 months at a time.";
  if (!(Number(inputs.budget) >= 1000)) errors.budget = "Enter a budget of at least £1,000.";
  if (!String(inputs.brief || "").trim()) errors.brief = "Describe the brief so the plan has a strategy.";
  if (plannerState.monthly && !(plannerTableTotal("budgets") > 0)) errors.monthly = "Give at least one month a budget.";
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

// True when the month budgets, guardrails or Strategic Index differ from those the current base plan
// was built from. Targets and the brief text don't change the channel split, so they don't ask for a regenerate.
function plannerInputsChanged() {
  const plan = plannerState.basePlan;
  if (!plan) return true;
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const months = plannerState.monthly.months.map((m) => m.key);
  const budgets = Object.fromEntries(months.map((k) => [k, Math.round(Number(plannerState.monthly.budgets[k]) || 0)]));
  const si = (src) => Object.fromEntries(PE_CHANNELS.map((c) => [c, months.map((k) => src?.[c]?.[k] || "M")]));
  return !same(budgets, plan.monthly_basis) || Number(plannerState.inputs.budget) !== Number(plan.inputs.budget)
    || !same(plannerState.guardrails, plan.guardrails) || !same(si(plannerState.strategicIndex), si(plan.strategic_index));
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
        ${field("plBudget", "Total budget", `<div class="pl-money"><span aria-hidden="true">£</span><input type="text" id="plBudget" inputmode="numeric" autocomplete="off" value="${plNum(Number(i.budget) || 0)}" ${errors.budget ? 'aria-invalid="true" aria-describedby="plBudget-error"' : ""} /></div>`, errors.budget)}
      </div>
      ${field("plBrief", "Brief", `<textarea id="plBrief" rows="5" placeholder="Objectives, audience, priorities and anything the plan must respect." ${errors.brief ? 'aria-invalid="true" aria-describedby="plBrief-error"' : ""}>${plEscape(i.brief)}</textarea>`, errors.brief)}
      <p class="pl-summary">${months.length ? `${months.length} month${months.length > 1 ? "s" : ""} · ${days} days · ${plGbp(Number(i.budget) || 0)}` : "Choose valid dates to see the months covered."}</p>
    </section>
  `;
}

function plannerMonthlyStep() {
  const table = plannerState.monthly;
  const readonly = canGeneratePlans() ? "" : "readonly";
  return `
    <section class="panel" id="pl-step-months">
      ${plannerStepHead(2, "Budget and targets by month", `The total budget spread across the months by bp's phasing (results windows weigh more, part months pro rata), with a target number of visitors for each month. Edit any figure.`, `<button class="secondary-button" type="button" id="plResetMonthly">Reset to phasing</button>`)}
      <div class="pl-banner" id="plMonthlyBanner" hidden></div>
      <div class="table-wrap">
        <table class="pl-table pl-months" aria-describedby="plMonthsCaption">
          <thead><tr><th scope="col">Month</th>${table.months.map((m) => `<th scope="col">${m.label}${m.fraction < 1 ? `<span class="pl-part">${m.covered}/${m.days} days</span>` : ""}</th>`).join("")}<th scope="col">Total</th></tr></thead>
          <tbody>
            <tr><th scope="row">Budget (£)</th>${table.months.map((m) => `<td><input type="text" inputmode="numeric" autocomplete="off" value="${plNum(table.budgets[m.key])}" data-pl-mbudget="${m.key}" ${readonly} aria-label="Budget, ${m.label}" /></td>`).join("")}<td class="pl-total" data-pl-mt="budget"></td></tr>
            <tr><th scope="row">Target visitors</th>${table.months.map((m) => `<td><input type="text" inputmode="numeric" autocomplete="off" value="${plNum(table.targets[m.key])}" data-pl-mtarget="${m.key}" ${readonly} aria-label="Target visitors, ${m.label}" /></td>`).join("")}<td class="pl-total" data-pl-mt="target"></td></tr>
            <tr class="pl-row-kpi"><th scope="row">Cost per visitor</th>${table.months.map((m) => `<td data-pl-mcpv="${m.key}"></td>`).join("")}<td data-pl-mt="cpv"></td></tr>
          </tbody>
        </table>
      </div>
      <p class="pl-caption" id="plMonthsCaption">Targets start at each month's budget ÷ £${PE_TARGET_COST_PER_VISITOR.toFixed(2)} per visitor (a demo assumption). Changing a target updates the base plan straight away; changing a budget needs a regenerate.</p>
    </section>
  `;
}

// Refreshes the month table's totals and its brief-mismatch banner in place.
function plannerUpdateMonthly() {
  const root = document.querySelector("#pl-step-months");
  if (!root) return;
  const table = plannerState.monthly;
  const budget = plannerTableTotal("budgets");
  const target = plannerTableTotal("targets");
  root.querySelector('[data-pl-mt="budget"]').textContent = plGbp(budget);
  root.querySelector('[data-pl-mt="target"]').textContent = plNum(target);
  root.querySelector('[data-pl-mt="cpv"]').textContent = target ? plCpc(budget / target) : "–";
  table.months.forEach((m) => {
    const b = Number(table.budgets[m.key]) || 0;
    const t = Number(table.targets[m.key]) || 0;
    root.querySelector(`[data-pl-mcpv="${m.key}"]`).textContent = t ? plCpc(b / t) : "–";
  });
  const brief = Number(plannerState.inputs.budget) || 0;
  const banner = root.querySelector("#plMonthlyBanner");
  banner.hidden = budget === brief;
  banner.className = "pl-banner warn";
  banner.textContent = budget === brief ? "" : `Month budgets add up to ${plGbp(budget)}, ${plGbp(Math.abs(budget - brief))} ${budget > brief ? "over" : "under"} the ${plGbp(brief)} brief. Edit the months or reset them to the phasing.`;
}

function plannerGuardrailStep() {
  const rules = plannerConfig().rules;
  const g = plannerState.guardrails;
  return `
    <section class="panel" id="pl-step-guardrails">
      ${plannerStepHead(4, "Channel guardrails", "The minimum and maximum share of budget each channel may take in the base plan, whatever the model would otherwise do.", `<button class="secondary-button" type="button" id="plResetGuardrails">Reset</button>`)}
      <div class="table-wrap">
        <table class="pl-table pl-guardrails">
          <thead><tr><th scope="col">Channel</th><th scope="col">Starting share</th><th scope="col">Min %</th><th scope="col">Max %</th></tr></thead>
          <tbody>
            ${PE_CHANNELS.map((c) => `
              <tr>
                <th scope="row">${c}</th>
                <td>${rules[c]?.optimal ?? "–"}%</td>
                <td><input type="text" inputmode="numeric" autocomplete="off" value="${g[c]?.min ?? 0}" data-pl-guard="${c}" data-pl-guard-field="min" aria-label="${c} minimum share, %" aria-describedby="plGuardErrors" /></td>
                <td><input type="text" inputmode="numeric" autocomplete="off" value="${g[c]?.max ?? 100}" data-pl-guard="${c}" data-pl-guard-field="max" aria-label="${c} maximum share, %" aria-describedby="plGuardErrors" /></td>
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

function plannerStrategicStep() {
  const si = plannerState.strategicIndex;
  const months = plannerState.monthly.months;
  return `
    <section class="panel" id="pl-step-si">
      ${plannerStepHead(3, "Strategic Index", "For the months in the table above: a strategist's view of each channel's value, Low, Medium or High. It tilts how each month's budget is split between channels (Low ×0.7, High ×1.3) rather than forcing an outcome, and comes from agency planning experience, not cost data.", `<button class="secondary-button" type="button" id="plResetSi">All Medium</button>`)}
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
    </section>
  `;
}

function plannerNoteText() {
  if (!canGeneratePlans()) return "Viewers can review the plan but not generate or edit one.";
  if (Object.keys(plannerValidate(plannerState.inputs)).length) return "Fix the highlighted inputs above first.";
  if (plannerInputsChanged()) return "The month budgets, Strategic Index or guardrails have changed since this plan was generated. Regenerate to apply them.";
  return plannerState.status || "The plan below reflects the current inputs.";
}

function plannerSetFieldErrors(errors) {
  const root = document.querySelector("#campaignPlanning");
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
}

// After an input change: refresh only what depends on it, so focus and the next click aren't lost.
// rebuildMonths swaps in the month table and Strategic Index for a new month list.
function plannerRefreshInputs({ rebuildMonths = false } = {}) {
  const root = document.querySelector("#campaignPlanning");
  if (!root) return;
  const errors = plannerValidate(plannerState.inputs);
  plannerSetFieldErrors(errors);
  const i = plannerState.inputs;
  const months = errors.start || errors.end ? [] : peMonths(i.start, i.end);
  const days = months.reduce((a, m) => a + m.covered, 0);
  root.querySelector(".pl-summary").textContent = months.length ? `${months.length} month${months.length > 1 ? "s" : ""} · ${days} days · ${plGbp(Number(i.budget) || 0)}` : "Choose valid dates to see the months covered.";
  if (rebuildMonths) {
    root.querySelector("#pl-step-months").outerHTML = plannerMonthlyStep();
    root.querySelector("#pl-step-si").outerHTML = plannerStrategicStep();
  }
  plannerUpdateMonthly();
  root.querySelector("#plGuardErrors").innerHTML = plannerGuardrailErrorsHtml();
  const button = root.querySelector("#plGenerate");
  button.disabled = Boolean(Object.keys(errors).length) || !canGeneratePlans();
  root.querySelector("#plGenerateNote").textContent = plannerNoteText();
}

function plannerOutputStep() {
  const plan = plannerState.basePlan;
  const canGenerate = !Object.keys(plannerValidate(plannerState.inputs)).length && canGeneratePlans();
  const readonly = canGeneratePlans() ? "" : "readonly";
  const head = plannerStepHead(5, "Base plan", "Each month's budget allocated by channel, with forecast clicks against the month's target. Fine-tune any channel figure; totals and forecasts update as you type.", `
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
      <p class="pl-caption" id="plPlanCaption">Budgets in £. Targets come from the month table in step 2.</p>
      <div class="table-wrap">
        <table class="pl-table pl-plan" id="plPlanTable" aria-describedby="plPlanCaption">
          <thead><tr><th scope="col">Channel</th>${plan.months.map((m) => `<th scope="col">${m.label}${m.fraction < 1 ? `<span class="pl-part">${m.covered}/${m.days} days</span>` : ""}</th>`).join("")}<th scope="col">Total</th></tr></thead>
          <tbody>
            ${plan.channels.map((c) => `
              <tr>
                <th scope="row">${c}<span class="pl-share" data-pl-share="${c}"></span></th>
                ${plan.months.map((m) => {
                  const cell = plan.monthly_allocations.find((r) => r.month === m.key && r.channel === c);
                  return `<td><input type="text" inputmode="numeric" autocomplete="off" value="${plNum(cell.budget_gbp)}" data-pl-cell="${m.key}|${c}" ${readonly} aria-label="${c} budget, ${m.label}" /></td>`;
                }).join("")}
                <td class="pl-total" data-pl-ctotal="${c}"></td>
              </tr>
            `).join("")}
            <tr class="pl-row-total"><th scope="row">Budget</th>${plan.months.map((m) => `<td data-pl-mtotal="${m.key}"></td>`).join("")}<td data-pl-gtotal="budget"></td></tr>
            <tr class="pl-row-kpi"><th scope="row">Target visitors</th>${plan.months.map((m) => `<td data-pl-mtarget-out="${m.key}"></td>`).join("")}<td data-pl-gtotal="target"></td></tr>
            <tr class="pl-row-kpi"><th scope="row">Forecast clicks</th>${plan.months.map((m) => `<td data-pl-mclicks="${m.key}"></td>`).join("")}<td data-pl-gtotal="clicks"></td></tr>
            <tr class="pl-row-kpi"><th scope="row">Cost per click</th>${plan.months.map((m) => `<td data-pl-mcpc="${m.key}"></td>`).join("")}<td data-pl-gtotal="cpc"></td></tr>
            <tr class="pl-row-kpi"><th scope="row">Clicks vs target</th>${plan.months.map((m) => `<td data-pl-mvs="${m.key}"></td>`).join("")}<td data-pl-gtotal="vs"></td></tr>
          </tbody>
        </table>
      </div>
      <details class="pl-how">
        <summary>How the plan is built</summary>
        <ul>
          <li>Each month's budget comes from the month table in step 2.</li>
          <li>Channel shares start from the evidence rules' optimal shares, tilted by the Strategic Index and held inside the guardrails.</li>
          <li>Within each month, the Strategic Index moves money between channels; budgets are whole pounds and add up exactly to each month.</li>
          <li>Forecast clicks come from synthetic diminishing-returns curves per channel; each extra pound buys fewer clicks.</li>
          <li>A click counts as one visitor when comparing the forecast with the target.</li>
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
    ["Cost per click", plCpc(plan.cost_per_click), plan.target_visitors ? `Target £${(plan.total_budget_gbp / plan.target_visitors).toFixed(2)} per visitor` : "No target set"],
    ["Clicks vs target", totalVs == null ? "–" : `${totalVs >= 0 ? "+" : "−"}${Math.abs(totalVs * 100).toFixed(1)}%`, plan.qa.months_short.length ? `${plan.qa.months_short.length} month${plan.qa.months_short.length > 1 ? "s" : ""} short` : "Every month on target"],
  ].map(([label, value, sub]) => `<div><span>${label}</span><strong>${value}</strong><em>${sub}</em></div>`).join("");
  plan.channel_totals.forEach((c) => {
    root.querySelector(`[data-pl-ctotal="${CSS.escape(c.channel)}"]`).textContent = plGbp(c.budget_gbp);
    root.querySelector(`[data-pl-share="${CSS.escape(c.channel)}"]`).textContent = `${c.share_pct.toFixed(1)}%`;
  });
  plan.month_totals.forEach((m) => {
    root.querySelector(`[data-pl-mtotal="${m.month}"]`).textContent = plGbp(m.budget_gbp);
    root.querySelector(`[data-pl-mtarget-out="${m.month}"]`).textContent = plNum(m.target_visitors);
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
  const offMonths = plan.month_totals.filter((m) => m.budget_gbp !== plan.monthly_basis?.[m.month]);
  banner.hidden = !plan.edited;
  banner.className = `pl-banner ${offMonths.length ? "warn" : ""}`;
  banner.innerHTML = plan.edited ? `
    <span>${offMonths.length ? `Your channel edits change ${offMonths.length} month total${offMonths.length > 1 ? "s" : ""} away from the month table, so the plan is now ${plGbp(plan.total_budget_gbp)}.` : "You've edited the channel split; month totals still match the month table."}</span>
    <button class="secondary-button" type="button" id="plResetEdits">Reset to generated</button>
  ` : "";
}

function renderCampaignPlanning() {
  const root = document.querySelector("#campaignPlanning");
  if (!root) return;
  const errors = plannerValidate(plannerState.inputs);
  root.innerHTML = `
    <nav class="pl-steps" aria-label="Planning steps">
      <a href="#pl-step-brief"><span>1</span>Brief and budget</a>
      <a href="#pl-step-months"><span>2</span>Budget by month</a>
      <a href="#pl-step-si"><span>3</span>Strategic Index</a>
      <a href="#pl-step-guardrails"><span>4</span>Guardrails</a>
      <a href="#pl-step-plan"><span>5</span>Base plan</a>
    </nav>
    ${plannerBriefStep(errors)}
    ${plannerMonthlyStep()}
    ${plannerStrategicStep()}
    ${plannerGuardrailStep()}
    ${plannerOutputStep()}
  `;
  plannerUpdateMonthly();
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
    plannerState.basePlan?.edited ? "your channel edits to the base plan" : "",
    plannerState.scenarios.length ? `${plannerState.scenarios.length} scenario${plannerState.scenarios.length > 1 ? "s" : ""}` : "",
    plannerPlans().some((p) => state.currentApprovedVersionId === `plan_version_${p.plan_id}`) ? "the approved plan (its approval record is kept)" : "",
  ].filter(Boolean);
  if (losses.length && !window.confirm(`Regenerating replaces ${losses.join(", ")}. Continue?`)) return;
  plannerState.basePlan = peGeneratePlan(plannerState.inputs, plannerConfig(), plannerState.guardrails, plannerState.strategicIndex, plannerState.monthly);
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
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
    ["Month", ...plan.months.map((m) => m.label), "Total"],
    ["Budget (GBP)", ...plan.months.map((m) => plan.monthly_basis[m.key]), Object.values(plan.monthly_basis).reduce((a, b) => a + b, 0)],
    ["Target visitors", ...plan.months.map((m) => plan.monthly_targets[m.key]), plan.target_visitors],
  ]), "Budget by month");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(plannerExportRows()), "Base plan by channel");
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
    if (t.dataset.plMbudget) {
      plannerState.monthly.budgets[t.dataset.plMbudget] = plParse(t.value);
      plannerUpdateMonthly();
      root.querySelector("#plGenerateNote").textContent = plannerNoteText();
      root.querySelector("#plGenerate").disabled = Boolean(Object.keys(plannerValidate(plannerState.inputs)).length) || !canGeneratePlans();
    } else if (t.dataset.plMtarget) {
      // Targets don't change the channel split, so the base plan picks them up straight away.
      const value = plParse(t.value);
      plannerState.monthly.targets[t.dataset.plMtarget] = value;
      plannerUpdateMonthly();
      if (plan && t.dataset.plMtarget in plan.monthly_targets) {
        plan.monthly_targets[t.dataset.plMtarget] = value;
        if (plan.generated) plan.generated.targets[t.dataset.plMtarget] = value;
        peRecalc(plan);
        plannerUpdateOutputs();
      }
    } else if (t.dataset.plCell && plan) {
      const [month, channel] = t.dataset.plCell.split("|");
      plan.monthly_allocations.find((r) => r.month === month && r.channel === channel).budget_gbp = plParse(t.value);
      peRecalc(plan);
      plannerUpdateOutputs();
    }
  });
  root.addEventListener("change", (event) => {
    const t = event.target;
    const plan = plannerState.basePlan;
    if (t.dataset.plMbudget) {
      t.value = plNum(plannerState.monthly.budgets[t.dataset.plMbudget]);
      plannerSave();
      return;
    }
    if (t.dataset.plMtarget) {
      t.value = plNum(plannerState.monthly.targets[t.dataset.plMtarget]);
      plannerSave();
      return;
    }
    if (t.dataset.plCell && plan) {
      const [month, channel] = t.dataset.plCell.split("|");
      t.value = plNum(plan.monthly_allocations.find((r) => r.month === month && r.channel === channel).budget_gbp);
      plannerSave();
      return;
    }
    if (t.id === "plStart" || t.id === "plEnd" || t.id === "plBudget" || t.id === "plBrief") {
      const key = { plStart: "start", plEnd: "end", plBudget: "budget", plBrief: "brief" }[t.id];
      const value = key === "budget" ? plParse(t.value) : t.value;
      if (key === "budget") t.value = plNum(value);
      // New dates or budget re-spread the month table, which would replace any edits made to it.
      if (key !== "brief" && plannerTableEdited() && !window.confirm("Changing the dates or budget re-spreads the month table and replaces your edits to it. Continue?")) {
        t.value = key === "budget" ? plNum(plannerState.inputs.budget) : plannerState.inputs[key];
        return;
      }
      plannerState.inputs[key] = value;
      plannerState.status = null;
      let rebuildMonths = false;
      if (key !== "brief") {
        const errors = plannerValidate(plannerState.inputs);
        if (!errors.start && !errors.end && !errors.budget) {
          plannerState.monthly = pePhaseMonths(plannerState.inputs, plannerConfig());
          rebuildMonths = true;
        }
      }
      plannerSave();
      plannerRefreshInputs({ rebuildMonths });
      return;
    }
    if (t.dataset.plGuard) {
      const value = Math.min(100, plParse(t.value));
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
      plannerState.strategicIndex[channel] = Object.fromEntries(plannerState.monthly.months.map((m) => [m.key, t.value]));
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
    if (t.id === "plResetMonthly") {
      plannerState.monthly = pePhaseMonths(plannerState.inputs, plannerConfig());
      plannerSave();
      plannerRefreshInputs({ rebuildMonths: true });
      root.querySelector("#plResetMonthly")?.focus();
    }
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
      peRecalc(plan);
      plannerSave();
      renderAll();
      document.querySelector("#plGenerate")?.focus();
    }
  });
}
