// Planning engine for the bp planner: turns dates, a budget, channel guardrails
// and a Strategic Index (Low / Medium / High by channel by month) into a
// channel × month budget plan with target visitors and forecast clicks.
// Static demo: every curve and cost below is a synthetic planning assumption.
// Pure functions; runs in the browser (globals) and in Node (module.exports) for checks.

const PE_CHANNELS = ["CTV & Streaming", "Programmatic Display", "Online Video", "Meta"];
const PE_REACH_CHANNELS = ["CTV & Streaming", "Online Video"];
const PE_SI = { L: 0.7, M: 1, H: 1.3 };
const PE_SI_LABELS = { L: "Low", M: "Medium", H: "High" };

// Diminishing-returns click curves: clicks = (ref ÷ cpc0) × (spend ÷ ref)^b, monthly.
// cpc0 is the cost per click at the reference monthly spend; b < 1 means each extra pound buys fewer clicks.
const PE_CURVES = {
  "CTV & Streaming": { cpc0: 2.4, ref: 6000, b: 0.8 },
  "Programmatic Display": { cpc0: 0.95, ref: 4000, b: 0.88 },
  "Online Video": { cpc0: 1.6, ref: 4000, b: 0.85 },
  "Meta": { cpc0: 0.7, ref: 2500, b: 0.75 },
};
const PE_TARGET_COST_PER_VISITOR = 1.3;
const PE_MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Stored scenarios reshape a base plan. reach / performance multiply reach channels
// (CTV, Online Video) and performance channels (Display, Meta); months multiplies
// calendar months (1–12) and `otherMonths` the rest; cost multiplies cost per click.
const PE_SCENARIOS = {
  balanced_growth: { label: "Blended", reach: 1, performance: 1, months: {}, otherMonths: 1, cost: 1,
    assumption: "Blended baseline: follows the base plan's split with no single objective overriding budget, brand-safety or audience guardrails." },
  brand_trust_build: { label: "Brand Awareness", reach: 1.25, performance: 0.8, months: {}, otherMonths: 1, cost: 1.04,
    assumption: "Weights premium CTV and video reach above precision display, accepting fewer clicks for broader reach." },
  pcw_conversion_defence: { label: "GBE Precision Reach", reach: 0.85, performance: 1.25, months: {}, otherMonths: 1, cost: 1.08,
    assumption: "Prioritises audience quality over scale, so cost per click rises as spend moves into premium PMP inventory." },
  multicar_household_growth: { label: "Results Season Burst", reach: 1, performance: 1.1, months: { 2: 1.35, 4: 1.35, 5: 1.35, 7: 1.35, 8: 1.35, 10: 1.35, 11: 1.35 }, otherMonths: 0.75, cost: 1.02,
    assumption: "Pulls budget into results months (Feb, Apr–May, Jul–Aug, Oct–Nov) and accepts thinner coverage in between." },
  young_driver_telematics: { label: "Energy Conference Moments", reach: 1, performance: 1.05, months: { 1: 1.35, 2: 1.35, 3: 1.35, 9: 1.35, 11: 1.35 }, otherMonths: 0.9, cost: 1.03,
    assumption: "Weights months with major energy and business conferences and uses contextual and social amplification around them." },
  ev_growth: { label: "AGM & Strategy Update", reach: 1.1, performance: 0.95, months: { 2: 1.5, 3: 1.5, 4: 1.5 }, otherMonths: 0.85, cost: 1.01,
    assumption: "Front-loads budget into February–April and uses longer-form video to explain strategy ahead of the AGM." },
};

// ── Helpers ────────────────────────────────────────────────────────────────

const peParseDate = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const peDaysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();

// Split `total` across `weights` as whole numbers that sum exactly (largest remainder).
function peApportion(total, weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (sum > 0 ? (w / sum) * total : total / weights.length));
  const out = raw.map(Math.floor);
  let left = total - out.reduce((a, b) => a + b, 0);
  raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => {
    if (left > 0) {
      out[i] += 1;
      left -= 1;
    }
  });
  return out;
}

// Round a matrix so its row and column totals both hit given whole numbers.
function peRoundMatrix(values, rowTotals, colTotals) {
  const out = values.map((row) => row.map(Math.floor));
  const rowNeed = rowTotals.map((t, i) => t - out[i].reduce((a, b) => a + b, 0));
  const colNeed = colTotals.map((t, j) => t - out.reduce((a, row) => a + row[j], 0));
  const cells = [];
  values.forEach((row, i) => row.forEach((v, j) => cells.push([v - Math.floor(v), i, j])));
  cells.sort((a, b) => b[0] - a[0]);
  for (const [, i, j] of cells) {
    if (rowNeed[i] > 0 && colNeed[j] > 0) {
      out[i][j] += 1;
      rowNeed[i] -= 1;
      colNeed[j] -= 1;
    }
  }
  // Any leftover (rare, from rows and columns needing units in different places) goes to the
  // first column that still needs a unit.
  rowNeed.forEach((need, i) => {
    while (need > 0) {
      const j = colNeed.findIndex((n) => n > 0);
      if (j < 0) break;
      out[i][j] += 1;
      need -= 1;
      colNeed[j] -= 1;
    }
    rowNeed[i] = need;
  });
  return out;
}

// Fit a matrix to row and column totals by alternately rescaling rows and columns.
// Rows and columns whose total is 0 are pinned to 0 (so 0 ÷ 0 never spreads NaN); the
// others start from a small positive floor so a zero seed can still take budget.
function peFit(seed, rowTotals, colTotals, rounds = 60) {
  const m = seed.map((row, i) => row.map((v, j) => (rowTotals[i] > 0 && colTotals[j] > 0 ? Math.max(Number(v) || 0, 1e-6) : 0)));
  for (let k = 0; k < rounds; k++) {
    m.forEach((row, i) => {
      const s = row.reduce((a, b) => a + b, 0);
      row.forEach((_, j) => { row[j] = s > 0 ? row[j] * (rowTotals[i] / s) : 0; });
    });
    colTotals.forEach((t, j) => {
      const s = m.reduce((a, row) => a + row[j], 0);
      m.forEach((row) => { row[j] = s > 0 ? row[j] * (t / s) : 0; });
    });
  }
  return m;
}

// ── Building blocks ────────────────────────────────────────────────────────

/** Months touched by the date range, each with the share of its days covered. */
function peMonths(start, end) {
  const s = peParseDate(start);
  const e = peParseDate(end);
  if (!(s <= e)) return [];
  const multiYear = s.getUTCFullYear() !== e.getUTCFullYear();
  const months = [];
  let y = s.getUTCFullYear();
  let m = s.getUTCMonth() + 1;
  while (y < e.getUTCFullYear() || (y === e.getUTCFullYear() && m <= e.getUTCMonth() + 1)) {
    const days = peDaysInMonth(y, m);
    const first = y === s.getUTCFullYear() && m === s.getUTCMonth() + 1 ? s.getUTCDate() : 1;
    const last = y === e.getUTCFullYear() && m === e.getUTCMonth() + 1 ? e.getUTCDate() : days;
    const covered = last - first + 1;
    months.push({
      key: `${y}-${String(m).padStart(2, "0")}`,
      year: y,
      month: m,
      label: multiYear ? `${PE_MONTH_NAMES[m - 1]} ${String(y).slice(2)}` : PE_MONTH_NAMES[m - 1],
      days,
      covered,
      fraction: covered / days,
    });
    m += 1;
    if (m > 12) { m = 1; y += 1; }
  }
  return months;
}

/** Guardrails can all be met: each min ≤ max, minimums total ≤ 100% and maximums ≥ 100%. */
function peGuardrailsFeasible(guardrails) {
  const min = PE_CHANNELS.map((c) => Number(guardrails?.[c]?.min ?? 0));
  const max = PE_CHANNELS.map((c) => Number(guardrails?.[c]?.max ?? 100));
  return min.every((v, i) => v <= max[i]) && min.reduce((a, b) => a + b, 0) <= 100 && max.reduce((a, b) => a + b, 0) >= 100;
}

/**
 * Channel shares (%) from the optimal shares tilted by the Strategic Index (mean multiplier,
 * weighted by each month's weight), held inside the guardrails. Clamping finds the scale λ
 * where clamp(λ × raw, min, max) sums to 100, which always exists when the guardrails are feasible.
 */
function peChannelShares(rules, strategicIndex, guardrails, months, monthWeights) {
  const weights = monthWeights || months.map(() => 1);
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
  const raw = PE_CHANNELS.map((c) => {
    const optimal = rules[c]?.optimal ?? 25;
    const mean = months.reduce((a, mo, i) => a + PE_SI[strategicIndex?.[c]?.[mo.key] || "M"] * weights[i], 0) / totalWeight;
    return optimal * (months.length ? mean : 1);
  });
  const rawSum = raw.reduce((a, b) => a + b, 0) || 1;
  const base = raw.map((r) => (r / rawSum) * 100);
  const feasible = peGuardrailsFeasible(guardrails);
  if (!feasible) return { shares: base, feasible };
  const min = PE_CHANNELS.map((c) => Number(guardrails?.[c]?.min ?? 0));
  const max = PE_CHANNELS.map((c) => Number(guardrails?.[c]?.max ?? 100));
  const at = (lambda) => base.map((b, i) => Math.min(max[i], Math.max(min[i], lambda * b)));
  let lo = 0;
  let hi = 1;
  while (at(hi).reduce((a, b) => a + b, 0) < 100 && hi < 1e6) hi *= 2;
  for (let k = 0; k < 100; k++) {
    const mid = (lo + hi) / 2;
    if (at(mid).reduce((a, b) => a + b, 0) < 100) lo = mid;
    else hi = mid;
  }
  const shares = at(hi);
  const sum = shares.reduce((a, b) => a + b, 0);
  return { shares: shares.map((v) => (v / sum) * 100), feasible };
}

/** Forecast clicks for one channel's monthly spend. costFactor > 1 makes clicks dearer. */
function peClicks(channel, spend, costFactor = 1) {
  if (!(spend > 0)) return 0;
  const { cpc0, ref, b } = PE_CURVES[channel];
  return (ref / (cpc0 * costFactor)) * Math.pow(spend / ref, b);
}

// ── Plans ──────────────────────────────────────────────────────────────────

/**
 * The budget-by-month table: the brief budget spread across the months in the date range by bp's
 * phasing (pro rata for part months), with default target visitors. Returns { months, budgets, targets }.
 */
function pePhaseMonths(inputs, config) {
  const months = peMonths(inputs.start, inputs.end);
  const budget = Math.max(0, Math.round(Number(inputs.budget) || 0));
  const amounts = peApportion(budget, months.map((mo) => (config.phasing?.[mo.month] ?? 1) * mo.fraction));
  return {
    months,
    budgets: Object.fromEntries(months.map((mo, i) => [mo.key, amounts[i]])),
    targets: Object.fromEntries(months.map((mo, i) => [mo.key, Math.round(amounts[i] / PE_TARGET_COST_PER_VISITOR)])),
  };
}

/**
 * Generates a base plan: each month's budget (from the budget-by-month table) allocated by channel.
 * inputs: { start, end, budget, brief }. config: { rules: {channel: {optimal}}, phasing: {1..12: weight} }.
 * guardrails: {channel: {min, max}}. strategicIndex: {channel: {monthKey: "L"|"M"|"H"}}.
 * monthly: the budget-by-month table ({ months, budgets, targets }); defaults to pePhaseMonths(inputs).
 */
function peGeneratePlan(inputs, config, guardrails, strategicIndex, monthly) {
  const table = monthly || pePhaseMonths(inputs, config);
  const months = table.months;
  const monthTotals = months.map((mo) => Math.max(0, Math.round(Number(table.budgets[mo.key]) || 0)));
  const budget = monthTotals.reduce((a, b) => a + b, 0);
  const monthWeights = monthTotals.some((v) => v > 0) ? monthTotals : months.map((mo) => mo.fraction);
  const { shares, feasible } = peChannelShares(config.rules, strategicIndex, guardrails, months, monthWeights);
  const channelTotals = peApportion(budget, shares);
  const seed = months.map((mo, i) => PE_CHANNELS.map((c, j) => monthTotals[i] * shares[j] * PE_SI[strategicIndex?.[c]?.[mo.key] || "M"]));
  const cells = peRoundMatrix(peFit(seed, monthTotals, channelTotals), monthTotals, channelTotals);
  const monthly_allocations = months.flatMap((mo, i) => PE_CHANNELS.map((c, j) => ({ month: mo.key, channel: c, budget_gbp: cells[i][j] })));
  const monthly_targets = Object.fromEntries(months.map((mo, i) => [mo.key, Math.max(0, Math.round(Number(table.targets?.[mo.key] ?? monthTotals[i] / PE_TARGET_COST_PER_VISITOR) || 0))]));
  const plan = {
    plan_id: `bp_base_plan_${Date.now()}`,
    kind: "base",
    created_at: new Date().toISOString(),
    scenario: { scenario_id: "base", label: "Base plan", scenario_assumption: "Generated from the brief, channel guardrails and Strategic Index." },
    inputs: { ...inputs, budget: Math.round(Number(inputs.budget)) },
    monthly_basis: Object.fromEntries(months.map((mo, i) => [mo.key, monthTotals[i]])),
    guardrails: JSON.parse(JSON.stringify(guardrails || {})),
    strategic_index: JSON.parse(JSON.stringify(strategicIndex || {})),
    guardrails_feasible: feasible,
    months,
    channels: [...PE_CHANNELS],
    cost_factor: 1,
    monthly_allocations,
    monthly_targets,
  };
  plan.generated = { allocations: monthly_allocations.map((r) => r.budget_gbp), targets: { ...monthly_targets } };
  return peRecalc(plan);
}

/** Recomputes forecasts, totals, QA and warnings from the plan's budget cells and targets (after any edit). */
function peRecalc(plan) {
  const cf = plan.cost_factor || 1;
  plan.monthly_allocations.forEach((r) => {
    r.forecast_clicks = Math.round(peClicks(r.channel, r.budget_gbp, cf));
    r.cpc = r.forecast_clicks ? r.budget_gbp / r.forecast_clicks : null;
  });
  const sumBy = (key, filter) => plan.monthly_allocations.filter(filter).reduce((a, r) => a + r[key], 0);
  plan.total_budget_gbp = sumBy("budget_gbp", () => true);
  plan.forecast_clicks = sumBy("forecast_clicks", () => true);
  plan.target_visitors = Object.values(plan.monthly_targets).reduce((a, b) => a + (Number(b) || 0), 0);
  plan.cost_per_click = plan.forecast_clicks ? plan.total_budget_gbp / plan.forecast_clicks : null;
  plan.channel_totals = plan.channels.map((c) => {
    const budget = sumBy("budget_gbp", (r) => r.channel === c);
    return { channel: c, budget_gbp: budget, share_pct: plan.total_budget_gbp ? (budget / plan.total_budget_gbp) * 100 : 0, forecast_clicks: sumBy("forecast_clicks", (r) => r.channel === c) };
  });
  plan.month_totals = plan.months.map((mo) => ({
    month: mo.key,
    budget_gbp: sumBy("budget_gbp", (r) => r.month === mo.key),
    forecast_clicks: sumBy("forecast_clicks", (r) => r.month === mo.key),
    target_visitors: Number(plan.monthly_targets[mo.key]) || 0,
  }));

  const outside = plan.channel_totals.filter((c) => {
    const g = plan.guardrails?.[c.channel] || {};
    return c.share_pct < (g.min ?? 0) - 0.5 || c.share_pct > (g.max ?? 100) + 0.5;
  });
  const short = plan.month_totals.filter((m) => m.forecast_clicks < m.target_visitors);
  const label = (key) => plan.months.find((mo) => mo.key === key)?.label || key;
  const warnings = [];
  if (plan.total_budget_gbp !== plan.inputs.budget) {
    warnings.push(`Edited budget is £${plan.total_budget_gbp.toLocaleString("en-GB")}, ${plan.total_budget_gbp > plan.inputs.budget ? "over" : "under"} the £${plan.inputs.budget.toLocaleString("en-GB")} brief budget.`);
  }
  if (!plan.guardrails_feasible) warnings.push("The channel guardrails can't all be met (a minimum above its maximum, minimums over 100% or maximums under 100%); shares were left unclamped.");
  outside.forEach((c) => {
    const g = plan.guardrails?.[c.channel] || {};
    warnings.push(`${c.channel} is at ${c.share_pct.toFixed(1)}% of budget, outside its ${g.min ?? 0}–${g.max ?? 100}% guardrail.`);
  });
  if (short.length) warnings.push(`${short.length} of ${plan.months.length} months forecast fewer clicks than target visitors: ${short.map((m) => label(m.month)).join(", ")}.`);
  warnings.push("Click curves and costs per click are synthetic planning assumptions until campaign history is connected.");
  plan.qa = {
    budget_matches_brief: plan.total_budget_gbp === plan.inputs.budget,
    guardrails_respected: outside.length === 0 && plan.guardrails_feasible !== false,
    clears_visitor_target: plan.forecast_clicks >= plan.target_visitors,
    months_short: short.map((m) => m.month),
    warnings,
  };
  plan.edited = plan.generated
    ? plan.monthly_allocations.some((r, i) => r.budget_gbp !== plan.generated.allocations[i]) || Object.keys(plan.monthly_targets).some((k) => Number(plan.monthly_targets[k]) !== plan.generated.targets[k])
    : false;
  return plan;
}

/** A short fingerprint of a plan's budgets and targets, to tell when it has changed. */
function peFingerprint(plan) {
  const text = JSON.stringify([plan.monthly_allocations.map((r) => r.budget_gbp), Object.values(plan.monthly_targets), plan.inputs?.budget]);
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}

/** A stored scenario applied to a (possibly edited) base plan: same total budget, same targets and brief. */
function peScenarioFromPlan(base, scenarioId) {
  const def = PE_SCENARIOS[scenarioId];
  const months = base.months;
  const values = months.map((mo) => base.channels.map((c) => {
    const cell = base.monthly_allocations.find((r) => r.month === mo.key && r.channel === c)?.budget_gbp || 0;
    const channelFactor = PE_REACH_CHANNELS.includes(c) ? def.reach : def.performance;
    const monthFactor = def.months[mo.month] ?? def.otherMonths;
    return cell * channelFactor * monthFactor;
  }));
  const total = base.total_budget_gbp;
  const scaled = (() => {
    const sum = values.flat().reduce((a, b) => a + b, 0) || 1;
    return values.map((row) => row.map((v) => (v / sum) * total));
  })();
  const rowTotals = peApportion(total, scaled.map((row) => row.reduce((a, b) => a + b, 0)));
  const colTotals = peApportion(total, base.channels.map((_, j) => scaled.reduce((a, row) => a + row[j], 0)));
  const cells = peRoundMatrix(peFit(scaled, rowTotals, colTotals), rowTotals, colTotals);
  const plan = {
    ...JSON.parse(JSON.stringify(base)),
    plan_id: `bp_scenario_${scenarioId}_${Date.now()}`,
    kind: "scenario",
    created_at: new Date().toISOString(),
    scenario: { scenario_id: scenarioId, label: def.label, scenario_assumption: def.assumption },
    cost_factor: def.cost,
    generated: null,
  };
  plan.base_fingerprint = peFingerprint(base);
  plan.monthly_allocations = months.flatMap((mo, i) => base.channels.map((c, j) => ({ month: mo.key, channel: c, budget_gbp: cells[i][j] })));
  return peRecalc(plan);
}

if (typeof module !== "undefined") {
  module.exports = { PE_CHANNELS, PE_SI, PE_SI_LABELS, PE_CURVES, PE_SCENARIOS, PE_TARGET_COST_PER_VISITOR, peMonths, pePhaseMonths, peChannelShares, peGuardrailsFeasible, peClicks, peGeneratePlan, peRecalc, peScenarioFromPlan, peFingerprint, peApportion, peRoundMatrix };
}
