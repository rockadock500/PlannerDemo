// Scenarios: reshape the base plan into the stored strategic options and compare
// them. Static demo: each stored scenario is a fixed set of channel, month and cost
// multipliers applied to the base plan (plan-engine.js); free text picks the closest
// stored scenario by keywords. Reads plannerState (planner.js) at call time.

const SC_FACTS = {
  balanced_growth: {
    objective: "Balance GBE reach, brand awareness and precision targeting across the plan, timed to results season, the AGM and the major energy conferences.",
    constraints: "None beyond the guardrails and Strategic Index already set in Campaign Planning.",
    channels: "No channel deliberately over- or under-weighted.",
    risk: "Read this as an evidence-led balance, not a lack of a point of view.",
  },
  brand_trust_build: {
    objective: "Maximise awareness of bp's equity story among the Global Business Elite, shifting weight into premium CTV and online video.",
    constraints: "Reach channels weighted up; precision display and Meta held back.",
    channels: "Up: CTV & Streaming, Online Video. Down: Programmatic Display, Meta.",
    risk: "Fewer, dearer clicks; needs brand-lift evidence to justify sustaining it.",
  },
  pcw_conversion_defence: {
    objective: "Concentrate spend on the most precisely targetable GBE inventory: financial publisher PMPs and professional social audiences.",
    constraints: "Performance channels weighted up; cost per click allowed to rise for premium inventory.",
    channels: "Up: Programmatic Display, Meta. Down: CTV & Streaming, Online Video.",
    risk: "Precision is capped by PMP supply; spend spilling into open exchange dilutes audience quality.",
  },
  multicar_household_growth: {
    objective: "Concentrate budget around bp's quarterly results, when investor and analyst attention is highest.",
    constraints: "Results months (Feb, Apr–May, Jul–Aug, Oct–Nov) weighted up; months between reduced to a light presence.",
    channels: "All channels phased into results windows.",
    risk: "Results dates in the demo are illustrative; re-run once bp's financial calendar is confirmed.",
  },
  young_driver_telematics: {
    objective: "Align activity with Davos, International Energy Week, CERAWeek, Gastech, ADIPEC and COP31.",
    constraints: "Conference months weighted up; performance channels raised for contextual and social amplification.",
    channels: "Up: Programmatic Display, Meta. Steady: CTV & Streaming, Online Video.",
    risk: "Conference coverage carries policy sensitivity; brand-safety and compliance review are essential around COP31.",
  },
  ev_growth: {
    objective: "Support the full-year results and strategy update in February through to the AGM in April.",
    constraints: "February to April weighted up; longer-form video raised to explain strategy.",
    channels: "Up: CTV & Streaming, Online Video. Down: Meta.",
    risk: "Must stay within approved disclosure language; no forward-looking financial claims.",
  },
};

// Words that point a free-text request at a stored scenario.
const SC_KEYWORDS = {
  brand_trust_build: ["brand", "awareness", "reach", "ctv", "video", "premium", "trust", "recall"],
  pcw_conversion_defence: ["precision", "precise", "quality", "pmp", "display", "contextual", "targeting", "professional"],
  multicar_household_growth: ["results", "earnings", "quarterly", "quarter", "burst", "q1", "q2", "q3", "q4"],
  young_driver_telematics: ["conference", "conferences", "ceraweek", "davos", "cop31", "cop", "adipec", "gastech", "events"],
  ev_growth: ["agm", "strategy", "front-load", "frontload", "february", "march", "april", "shareholders"],
  balanced_growth: ["balanced", "blended", "even", "steady", "baseline"],
};

const scCentre = { proposal: null, drilldownId: null, status: null };

function scClosestScenario(text) {
  const words = String(text).toLowerCase().match(/[a-z0-9-]+/g) || [];
  let best = { id: "balanced_growth", hits: [] };
  Object.entries(SC_KEYWORDS).forEach(([id, keys]) => {
    const hits = [...new Set(words.filter((w) => keys.includes(w)))];
    if (hits.length > best.hits.length) best = { id, hits };
  });
  return best;
}

function scGenerate(scenarioId) {
  const base = plannerState.basePlan;
  if (!base) return;
  const plan = peScenarioFromPlan(base, scenarioId);
  const existing = plannerState.scenarios.find((p) => p.scenario.scenario_id === scenarioId);
  plannerState.scenarios = [...plannerState.scenarios.filter((p) => p.scenario.scenario_id !== scenarioId), plan];
  if (existing && plannerState.preferredScenarioId === existing.plan_id) plannerState.preferredScenarioId = plan.plan_id;
  scCentre.status = `${plan.scenario.label} ${existing ? "rebuilt" : "added"} from the current base plan.`;
  plannerSave();
}

function scDeltaList(plan, base) {
  return plan.channel_totals
    .map((c) => ({ channel: c.channel, delta: c.budget_gbp - (base.channel_totals.find((b) => b.channel === c.channel)?.budget_gbp || 0) }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 3);
}

function scCard(plan, base) {
  const isBase = plan.kind === "base";
  const preferred = plannerState.preferredScenarioId === plan.plan_id;
  const vs = plan.target_visitors ? plan.forecast_clicks / plan.target_visitors - 1 : 0;
  const facts = SC_FACTS[plan.scenario.scenario_id];
  const pill = preferred ? ["good", "Preferred"] : isBase ? ["", "Base plan"] : vs >= 0 ? ["good", "On target"] : ["warning", "Short of target"];
  return `
    <article class="sc-card ${preferred ? "preferred" : ""}" aria-label="${plEscape(plan.scenario.label)}">
      <div class="sc-card-head">
        <h3>${plEscape(plan.scenario.label)}</h3>
        <span class="status-pill ${pill[0]}">${pill[1]}</span>
      </div>
      <dl class="sc-metrics">
        <div><dt>Budget</dt><dd>${plGbp(plan.total_budget_gbp)}</dd></div>
        <div><dt>Forecast clicks</dt><dd>${plNum(plan.forecast_clicks)}</dd></div>
        <div><dt>Cost per click</dt><dd>${plCpc(plan.cost_per_click)}</dd></div>
        <div><dt>vs target</dt><dd class="${vs >= 0 ? "good" : "bad"}">${vs >= 0 ? "+" : "−"}${Math.abs(vs * 100).toFixed(1)}%</dd></div>
      </dl>
      <p class="sc-assumption">${plEscape(plan.scenario.scenario_assumption)}</p>
      ${isBase ? "" : `
        <ul class="sc-deltas" aria-label="Largest budget moves against the base plan">
          ${scDeltaList(plan, base).map((d) => `<li><span>${d.channel}</span><strong class="${d.delta > 0 ? "good" : d.delta < 0 ? "bad" : ""}">${d.delta > 0 ? "+" : d.delta < 0 ? "−" : ""}${plGbp(Math.abs(d.delta))}</strong></li>`).join("")}
        </ul>
      `}
      ${facts && !isBase ? `
        <details class="sc-facts">
          <summary>Objective, constraints and risk</summary>
          <dl>
            <div><dt>Objective</dt><dd>${facts.objective}</dd></div>
            <div><dt>Changed constraints</dt><dd>${facts.constraints}</dd></div>
            <div><dt>Affected channels</dt><dd>${facts.channels}</dd></div>
            <div><dt>Key risk</dt><dd>${facts.risk}</dd></div>
          </dl>
        </details>
      ` : ""}
      <div class="sc-card-actions">
        <button class="secondary-button" type="button" data-sc-view="${plan.plan_id}">View full plan</button>
        ${isBase ? "" : `
          <button class="secondary-button" type="button" data-sc-prefer="${plan.plan_id}" aria-pressed="${preferred}">${preferred ? "Preferred" : "Mark preferred"}</button>
          <button class="secondary-button" type="button" data-sc-remove="${plan.plan_id}" aria-label="Remove ${plEscape(plan.scenario.label)}">Remove</button>
        `}
      </div>
    </article>
  `;
}

function scDrilldown(plan) {
  return `
    <section class="panel" id="scDrilldown" tabindex="-1" aria-label="${plEscape(plan.scenario.label)} full plan">
      <div class="section-heading compact">
        <div>
          <p class="eyebrow">Full plan</p>
          <h2>${plEscape(plan.scenario.label)}</h2>
        </div>
        <button class="secondary-button" type="button" id="scCloseDrilldown">Close</button>
      </div>
      <div class="table-wrap">
        <table class="pl-table pl-plan pl-readonly">
          <thead><tr><th scope="col">Channel</th>${plan.months.map((m) => `<th scope="col">${m.label}</th>`).join("")}<th scope="col">Total</th></tr></thead>
          <tbody>
            ${plan.channels.map((c) => `<tr><th scope="row">${c}</th>${plan.months.map((m) => `<td>${plGbp(plan.monthly_allocations.find((r) => r.month === m.key && r.channel === c).budget_gbp)}</td>`).join("")}<td class="pl-total">${plGbp(plan.channel_totals.find((t) => t.channel === c).budget_gbp)}</td></tr>`).join("")}
            <tr class="pl-row-total"><th scope="row">Budget</th>${plan.month_totals.map((m) => `<td>${plGbp(m.budget_gbp)}</td>`).join("")}<td>${plGbp(plan.total_budget_gbp)}</td></tr>
            <tr class="pl-row-kpi"><th scope="row">Target visitors</th>${plan.month_totals.map((m) => `<td>${plNum(m.target_visitors)}</td>`).join("")}<td>${plNum(plan.target_visitors)}</td></tr>
            <tr class="pl-row-kpi"><th scope="row">Forecast clicks</th>${plan.month_totals.map((m) => `<td>${plNum(m.forecast_clicks)}</td>`).join("")}<td>${plNum(plan.forecast_clicks)}</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderScenarioCentre() {
  const root = document.querySelector("#scenarioCentre");
  if (!root) return;
  const base = plannerState.basePlan;
  if (!base) {
    root.innerHTML = `<section class="panel"><p class="table-hint">Generate a base plan in Campaign Planning first.</p></section>`;
    return;
  }
  const preferred = plannerState.scenarios.find((p) => p.plan_id === plannerState.preferredScenarioId);
  const drill = plannerPlans().find((p) => p.plan_id === scCentre.drilldownId);
  const proposal = scCentre.proposal;
  root.innerHTML = `
    <section class="panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Base plan</p>
          <h2>${plGbp(base.total_budget_gbp)} · ${base.months[0].label} to ${base.months[base.months.length - 1].label}</h2>
          <p class="table-hint pl-hint">${plNum(base.forecast_clicks)} forecast clicks at ${plCpc(base.cost_per_click)} against ${plNum(base.target_visitors)} target visitors. Scenarios reshape this plan, including any edits you've made, and keep its total budget.</p>
        </div>
        <button class="secondary-button" type="button" data-sc-goto="annual">Edit in Campaign Planning</button>
      </div>
      <div class="sc-builder">
        <div>
          <p class="field-label" id="scStoredLabel">Stored scenarios</p>
          <div class="stored-scenario-buttons" role="group" aria-labelledby="scStoredLabel">
            ${Object.entries(PE_SCENARIOS).map(([id, def]) => {
              const made = plannerState.scenarios.some((p) => p.scenario.scenario_id === id);
              return `<button class="secondary-button ${made ? "active" : ""}" type="button" data-sc-generate="${id}">${made ? "✓ " : ""}${def.label}</button>`;
            }).join("")}
          </div>
        </div>
        <div>
          <label class="field-label" for="scFreeText">Describe a scenario</label>
          <textarea id="scFreeText" rows="3" placeholder="e.g. Go heavier on financial news CTV around results weeks and keep Meta light."></textarea>
          <button class="secondary-button" type="button" id="scPropose">Find the closest scenario</button>
        </div>
      </div>
      ${proposal ? `
        <div class="pl-banner">
          <span>Closest stored scenario: <strong>${PE_SCENARIOS[proposal.id].label}</strong>${proposal.hits.length ? ` (matched on ${proposal.hits.map((h) => `“${plEscape(h)}”`).join(", ")})` : " (no strong match, so the blended option)"}. Free-text scenarios need the planning engine; this demo uses the closest stored one.</span>
          <span class="sc-proposal-actions">
            <button class="primary-button" type="button" data-sc-generate="${proposal.id}">Add ${PE_SCENARIOS[proposal.id].label}</button>
            <button class="secondary-button" type="button" id="scCancelProposal">Cancel</button>
          </span>
        </div>
      ` : ""}
      <p class="table-hint" role="status">${scCentre.status ? plEscape(scCentre.status) : ""}</p>
      <div class="sc-preferred">
        ${preferred ? `<strong>Preferred:</strong> ${plEscape(preferred.scenario.label)} <button class="secondary-button" type="button" id="scClearPreferred">Clear</button>` : `<span class="table-hint">No preferred scenario yet. The preferred one is offered first on Approval.</span>`}
      </div>
    </section>
    <div class="sc-grid">
      ${[base, ...plannerState.scenarios].map((p) => scCard(p, base)).join("")}
    </div>
    ${drill ? scDrilldown(drill) : ""}
    <p class="table-hint sc-footnote"><span class="status-pill">Sample</span> Scenario forecasts use synthetic click curves; the approved plan is chosen on Approval.</p>
  `;
}

function scenarioCentreAttachEvents() {
  const root = document.querySelector("#scenarioCentre");
  if (!root) return;
  root.addEventListener("click", (event) => {
    const t = event.target.closest("button");
    if (!t) return;
    if (t.dataset.scGenerate) {
      scGenerate(t.dataset.scGenerate);
      scCentre.proposal = null;
      renderAll();
      document.querySelector(`[data-sc-generate="${t.dataset.scGenerate}"]`)?.focus();
      return;
    }
    if (t.id === "scPropose") {
      const text = root.querySelector("#scFreeText").value.trim();
      if (!text) return;
      scCentre.proposal = scClosestScenario(text);
      renderScenarioCentre();
      root.querySelector(".sc-proposal-actions .primary-button")?.focus();
      return;
    }
    if (t.id === "scCancelProposal") {
      scCentre.proposal = null;
      renderScenarioCentre();
      root.querySelector("#scPropose")?.focus();
      return;
    }
    if (t.dataset.scPrefer) {
      plannerState.preferredScenarioId = plannerState.preferredScenarioId === t.dataset.scPrefer ? null : t.dataset.scPrefer;
      plannerSave();
      renderAll();
      document.querySelector(`[data-sc-prefer="${t.dataset.scPrefer}"]`)?.focus();
      return;
    }
    if (t.id === "scClearPreferred") {
      plannerState.preferredScenarioId = null;
      plannerSave();
      renderAll();
      return;
    }
    if (t.dataset.scRemove) {
      plannerState.scenarios = plannerState.scenarios.filter((p) => p.plan_id !== t.dataset.scRemove);
      if (plannerState.preferredScenarioId === t.dataset.scRemove) plannerState.preferredScenarioId = null;
      if (scCentre.drilldownId === t.dataset.scRemove) scCentre.drilldownId = null;
      scCentre.status = "Scenario removed.";
      plannerSave();
      renderAll();
      root.querySelector("[data-sc-generate]")?.focus();
      return;
    }
    if (t.dataset.scView) {
      scCentre.drilldownId = t.dataset.scView;
      renderScenarioCentre();
      root.querySelector("#scDrilldown")?.focus();
      return;
    }
    if (t.id === "scCloseDrilldown") {
      const id = scCentre.drilldownId;
      scCentre.drilldownId = null;
      renderScenarioCentre();
      root.querySelector(`[data-sc-view="${id}"]`)?.focus();
      return;
    }
    if (t.dataset.scGoto) document.querySelector(`.nav-item[data-view="${t.dataset.scGoto}"]`)?.click();
  });
}
