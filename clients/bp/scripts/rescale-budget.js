#!/usr/bin/env node
// Rescales the bp planner's synthetic data to a new annual budget, keeping every
// channel and month share. Money and volumes (engagements, impressions, targets)
// scale; rates (cost per engagement, shares, conversion) don't. Totals stay
// exact: months sum to the plan, channels to months, media owners to cells.
//
// Proportional on purpose: it keeps the evidence, guardrails and phasing
// consistent. It ignores diminishing returns (a smaller budget would in practice
// buy engagements a little more cheaply).
//
// Run with: node clients/bp/scripts/rescale-budget.js 200000

const fs = require("fs");
const path = require("path");

const DATA = path.join(__dirname, "..", "demo", "data");
const target = Number(process.argv[2]);
if (!Number.isInteger(target) || target <= 0) {
  console.error("Usage: node rescale-budget.js <annual budget in GBP>");
  process.exit(1);
}

const read = (file) => JSON.parse(fs.readFileSync(path.join(DATA, file), "utf8"));
const write = (file, data) => fs.writeFileSync(path.join(DATA, file), `${JSON.stringify(data, null, 2)}\n`);

const current = read("bp_synthetic_fixture_2026.json").annual_summary.total_media_budget_gbp;
const factor = target / current;
const scale = (n) => Math.round(n * factor);

// Split `total` across `weights` in proportion, as whole numbers that sum exactly (largest remainder).
function apportion(total, weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (sum ? (w / sum) * total : 0));
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

// Round a matrix so both its row totals and column totals hit given whole numbers.
// Floors every cell, then hands out the missing units to the cells with the largest
// remainders whose row and column both still need one.
function roundMatrix(values, rowTotals, colTotals) {
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
  if (rowNeed.some((n) => n !== 0) || colNeed.some((n) => n !== 0)) throw new Error("Could not round the month × channel matrix exactly.");
  return out;
}

const formatGbpK = (n) => `£${Math.round(n / 1000)}k`;
const formatCount = (n) => n.toLocaleString("en-GB");
const oldTarget = read("planning_evidence_rules_2026.json").objective.policy_sales_target;
const newTarget = scale(oldTarget);

// Text that quotes the target or the monthly saturation thresholds moves with them.
function rewriteText(value, thresholds) {
  if (typeof value === "string") {
    let s = value.split(formatCount(oldTarget)).join(formatCount(newTarget));
    thresholds.forEach((t) => {
      s = s.split(formatGbpK(t)).join(formatGbpK(t * factor));
    });
    return s;
  }
  if (Array.isArray(value)) return value.map((v) => rewriteText(v, thresholds));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewriteText(v, thresholds)]));
  return value;
}

function scaleCurve(curve) {
  if (curve && typeof curve.soft_saturation_threshold_monthly_gbp === "number") {
    curve.soft_saturation_threshold_monthly_gbp = scale(curve.soft_saturation_threshold_monthly_gbp);
  }
}

const thresholds = new Set();
const planFiles = fs.readdirSync(DATA).filter((f) => f.startsWith("generated_plan_"));
planFiles.forEach((file) => {
  read(file).channel_totals.forEach((c) => thresholds.add(c.response_curve?.soft_saturation_threshold_monthly_gbp));
});
thresholds.delete(undefined);

let blended = null;
planFiles.forEach((file) => {
  const plan = read(file);
  const months = [...new Set(plan.monthly_allocations.map((r) => r.month))];
  const channels = plan.channel_totals.map((c) => c.channel);
  const cell = (m, c) => plan.monthly_allocations.find((r) => r.month === m && r.channel === c);

  // Budget: plan → month and channel totals → cells → media owners.
  const total = scale(plan.total_budget_gbp);
  const monthTotals = apportion(total, months.map((m) => channels.reduce((a, c) => a + (cell(m, c)?.budget_gbp || 0), 0)));
  const channelTotals = apportion(total, plan.channel_totals.map((c) => c.budget_gbp));
  const cells = roundMatrix(
    months.map((m) => channels.map((c) => (cell(m, c)?.budget_gbp || 0) * factor)),
    monthTotals,
    channelTotals,
  );
  months.forEach((m, mi) => {
    channels.forEach((c, ci) => {
      const row = cell(m, c);
      if (!row) return;
      const owners = plan.media_owner_allocations.filter((o) => o.month === m && o.channel === c);
      apportion(cells[mi][ci], owners.map((o) => o.budget_gbp)).forEach((b, oi) => {
        owners[oi].budget_gbp = b;
      });
      row.budget_gbp = cells[mi][ci];
      scaleCurve(row.response_curve);
    });
  });

  // Engagements: plan → channels → months.
  const engagements = scale(plan.forecast_new_policy_sales);
  const channelEngagements = apportion(engagements, plan.channel_totals.map((c) => c.forecast_new_policy_sales));
  plan.channel_totals.forEach((c, ci) => {
    const rows = plan.monthly_allocations.filter((r) => r.channel === c.channel);
    apportion(channelEngagements[ci], rows.map((r) => r.forecast_new_policy_sales)).forEach((n, ri) => {
      rows[ri].forecast_new_policy_sales = n;
    });
    c.forecast_new_policy_sales = channelEngagements[ci];
    c.budget_gbp = rows.reduce((a, r) => a + r.budget_gbp, 0);
    scaleCurve(c.response_curve);
  });

  plan.total_budget_gbp = total;
  plan.total_allocated_gbp = plan.monthly_allocations.reduce((a, r) => a + r.budget_gbp, 0);
  plan.forecast_new_policy_sales = engagements;
  plan.forecast_quote_starts = scale(plan.forecast_quote_starts);
  plan.brief_test.forecast_new_policy_sales = engagements;
  plan.brief_test.policy_sales_target = newTarget;
  plan.brief_test.clears_policy_sales_target = engagements >= newTarget;

  const updated = rewriteText(plan, thresholds);
  write(file, updated);
  if (file === "generated_plan_balanced_growth.json") blended = updated;
});

// Fixture: headline numbers and the month × channel matrix follow the Blended plan.
const fixture = read("bp_synthetic_fixture_2026.json");
fixture.annual_summary.total_media_budget_gbp = blended.total_budget_gbp;
fixture.annual_summary.forecast_new_policy_sales = blended.forecast_new_policy_sales;
fixture.annual_summary.forecast_quote_starts = blended.forecast_quote_starts;
Object.keys(fixture.monthly_channel_budget_gbp).forEach((m) => {
  Object.keys(fixture.monthly_channel_budget_gbp[m]).forEach((c) => {
    fixture.monthly_channel_budget_gbp[m][c] = blended.monthly_allocations.find((r) => r.month === m && r.channel === c).budget_gbp;
  });
  fixture.monthly_total_budget_gbp[m] = Object.values(fixture.monthly_channel_budget_gbp[m]).reduce((a, b) => a + b, 0);
});
write("bp_synthetic_fixture_2026.json", fixture);

const brief = read("annual_brief_2026.json");
brief.total_budget_gbp = scale(brief.total_budget_gbp);
brief.brief_stated_budget_gbp = scale(brief.brief_stated_budget_gbp);
brief.total_new_policy_sales_target = newTarget;
write("annual_brief_2026.json", rewriteText(brief, thresholds));

const priorities = read("brief_priorities_2026.json");
priorities.brief_budget_gbp = scale(priorities.brief_budget_gbp);
priorities.policy_sales_target = newTarget;
write("brief_priorities_2026.json", rewriteText(priorities, thresholds));

const rules = read("planning_evidence_rules_2026.json");
rules.objective.policy_sales_target = newTarget;
write("planning_evidence_rules_2026.json", rewriteText(rules, thresholds));

const revision = read("monthly_revision_fixture_2026.json");
revision.revision_months.forEach((m) => {
  const a = m.sales_actuals;
  a.new_policy_sales = scale(a.new_policy_sales);
  a.target_new_policy_sales = scale(a.target_new_policy_sales);
  a.quote_starts = scale(a.quote_starts);
});
write("monthly_revision_fixture_2026.json", rewriteText(revision, thresholds));

write("agent_demo_traces.json", rewriteText(read("agent_demo_traces.json"), thresholds));

console.log(`Rescaled from £${current.toLocaleString("en-GB")} to £${target.toLocaleString("en-GB")} (×${factor.toFixed(6)}). Target ${formatCount(oldTarget)} → ${formatCount(newTarget)}.`);
