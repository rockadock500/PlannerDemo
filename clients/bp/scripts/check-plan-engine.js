#!/usr/bin/env node
// Checks the planning engine (demo/plan-engine.js) against the spec's rules.
// Run with: node clients/bp/scripts/check-plan-engine.js   (exits non-zero on failure)

const fs = require("fs");
const path = require("path");
const pe = require("../demo/plan-engine.js");

const DATA = path.join(__dirname, "..", "demo", "data");
const rulesFile = JSON.parse(fs.readFileSync(path.join(DATA, "planning_evidence_rules_2026.json"), "utf8"));
const fixture = JSON.parse(fs.readFileSync(path.join(DATA, "bp_synthetic_fixture_2026.json"), "utf8"));
const config = {
  rules: Object.fromEntries(rulesFile.channel_rules.map((r) => [r.channel, { optimal: r.mmm_optimal_share_pct, floor: r.strategic_floor_pct }])),
  phasing: Object.fromEntries(Object.entries(fixture.monthly_budget_weights_pct).map(([k, v]) => [Number(k.slice(5)), v])),
};
const guardrails = Object.fromEntries(rulesFile.channel_rules.map((r) => [r.channel, { min: r.strategic_floor_pct, max: 100 }]));

let failed = 0;
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"} - ${label}${detail ? ` (${detail})` : ""}`);
  if (!ok) failed += 1;
};
const sum = (xs) => xs.reduce((a, b) => a + b, 0);

const inputs = { start: "2026-01-01", end: "2026-12-31", budget: 200000, brief: "demo" };
const base = pe.peGeneratePlan(inputs, config, guardrails, {});
check("12 months for a calendar year", base.months.length === 12);
check("cells sum to the budget exactly", sum(base.monthly_allocations.map((r) => r.budget_gbp)) === 200000);
check("every cell is a whole, non-negative pound", base.monthly_allocations.every((r) => Number.isInteger(r.budget_gbp) && r.budget_gbp >= 0));
check("month totals follow the phasing (Feb > Jan)", base.month_totals[1].budget_gbp > base.month_totals[0].budget_gbp);
check("default shares match the optimal shares", base.channel_totals.map((c) => Math.round(c.share_pct)).join("/") === "35/25/25/15", base.channel_totals.map((c) => c.share_pct.toFixed(1)).join("/"));
check("guardrails respected", base.qa.guardrails_respected);
check("budget matches brief", base.qa.budget_matches_brief && !base.edited);

const partial = pe.peGeneratePlan({ ...inputs, start: "2026-01-16", end: "2026-03-31" }, config, guardrails, {});
check("part month is pro rata (Jan half-weighted)", partial.months[0].fraction > 0.5 && partial.months[0].fraction < 0.55 && partial.month_totals[0].budget_gbp < partial.month_totals[2].budget_gbp);
check("part-month plan still sums exactly", partial.total_budget_gbp === 200000);
const crossYear = pe.peMonths("2026-11-01", "2027-02-28");
check("cross-year range labels years", crossYear.length === 4 && crossYear[0].label === "Nov 26" && crossYear[3].label === "Feb 27");
check("end before start gives no months", pe.peMonths("2026-05-01", "2026-04-01").length === 0);

const allHighCtv = { "CTV & Streaming": Object.fromEntries(base.months.map((m) => [m.key, "H"])) };
const ctvHigh = pe.peGeneratePlan(inputs, config, guardrails, allHighCtv);
check("High Strategic Index raises a channel's share", ctvHigh.channel_totals[0].share_pct > base.channel_totals[0].share_pct, `${base.channel_totals[0].share_pct.toFixed(1)}% → ${ctvHigh.channel_totals[0].share_pct.toFixed(1)}%`);
const febMetaHigh = { Meta: { "2026-02": "H" } };
const metaFeb = pe.peGeneratePlan(inputs, config, guardrails, febMetaHigh);
const metaCell = (p, m) => p.monthly_allocations.find((r) => r.channel === "Meta" && r.month === m).budget_gbp;
check("High in one month moves that channel's money into it", metaCell(metaFeb, "2026-02") > metaCell(base, "2026-02"));
check("month totals unchanged by the Strategic Index", metaFeb.month_totals.every((m, i) => m.budget_gbp === base.month_totals[i].budget_gbp));

const capped = pe.peGeneratePlan(inputs, config, { ...guardrails, "CTV & Streaming": { min: 25, max: 30 } }, {});
check("max guardrail caps a channel", capped.channel_totals[0].share_pct <= 30.5, capped.channel_totals[0].share_pct.toFixed(1));
const impossible = pe.peGeneratePlan(inputs, config, { ...guardrails, Meta: { min: 60, max: 100 } }, {});
check("infeasible guardrails are flagged", impossible.guardrails_feasible === false && impossible.qa.warnings.some((w) => w.includes("can't all be met")));

const edited = JSON.parse(JSON.stringify(base));
edited.monthly_allocations[0].budget_gbp += 1000;
edited.monthly_targets["2026-01"] = 1;
pe.peRecalc(edited);
check("editing a cell updates the total and flags the mismatch", edited.total_budget_gbp === 201000 && !edited.qa.budget_matches_brief && edited.edited);
check("editing a cell updates its forecast", edited.monthly_allocations[0].forecast_clicks > base.monthly_allocations[0].forecast_clicks);
check("editing a target updates the target total", edited.target_visitors === base.target_visitors - base.monthly_targets["2026-01"] + 1);

Object.keys(pe.PE_SCENARIOS).forEach((id) => {
  const s = pe.peScenarioFromPlan(base, id);
  check(`${pe.PE_SCENARIOS[id].label}: same total budget`, s.total_budget_gbp === base.total_budget_gbp);
});
const brand = pe.peScenarioFromPlan(base, "brand_trust_build");
check("Brand Awareness moves money to CTV and video", brand.channel_totals[0].budget_gbp > base.channel_totals[0].budget_gbp && brand.channel_totals[3].budget_gbp < base.channel_totals[3].budget_gbp);
const results = pe.peScenarioFromPlan(base, "multicar_household_growth");
check("Results Season Burst raises results months", results.month_totals[1].budget_gbp > base.month_totals[1].budget_gbp && results.month_totals[0].budget_gbp < base.month_totals[0].budget_gbp);
const precision = pe.peScenarioFromPlan(base, "pcw_conversion_defence");
check("Precision Reach raises cost per click", precision.cost_per_click > base.cost_per_click);

// ── Edge cases ─────────────────────────────────────────────────────────────
const finite = (p) => p.monthly_allocations.every((r) => Number.isFinite(r.budget_gbp) && r.budget_gbp >= 0 && Number.isFinite(r.forecast_clicks)) && Number.isFinite(p.total_budget_gbp);
const maxZero = pe.peGeneratePlan(inputs, config, { ...guardrails, Meta: { min: 0, max: 0 } }, {});
check("Max 0 gives the channel nothing and no NaN", finite(maxZero) && maxZero.total_budget_gbp === 200000 && maxZero.channel_totals[3].budget_gbp === 0);
const pinned = pe.peGeneratePlan(inputs, config, { ...guardrails, "CTV & Streaming": { min: 40, max: 40 } }, {});
check("min = max pins the share", Math.abs(pinned.channel_totals[0].share_pct - 40) < 0.5, pinned.channel_totals[0].share_pct.toFixed(1));
const crossed = pe.peGeneratePlan(inputs, config, { ...guardrails, "CTV & Streaming": { min: 40, max: 20 } }, {});
check("min above max is infeasible", crossed.guardrails_feasible === false && finite(crossed));
check("reviewer's example is now held inside the guardrails", (() => {
  const g = { "CTV & Streaming": { min: 0, max: 25 }, "Programmatic Display": { min: 26, max: 100 }, "Online Video": { min: 31, max: 100 }, Meta: { min: 29, max: 100 } };
  const p = pe.peGeneratePlan(inputs, config, g, {});
  return p.qa.guardrails_respected;
})());
let seed = 7;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
let sweepFails = 0;
let sweepRuns = 0;
for (let k = 0; k < 2000; k++) {
  const g = Object.fromEntries(pe.PE_CHANNELS.map((c) => {
    const min = Math.floor(rand() * 40);
    return [c, { min, max: min + Math.floor(rand() * (100 - min + 1)) }];
  }));
  if (!pe.peGuardrailsFeasible(g)) continue;
  sweepRuns += 1;
  const si = Object.fromEntries(pe.PE_CHANNELS.map((c) => [c, Object.fromEntries(base.months.map((m) => [m.key, ["L", "M", "H"][Math.floor(rand() * 3)]]))]));
  const p = pe.peGeneratePlan({ ...inputs, budget: 1000 + Math.floor(rand() * 500000) }, config, g, si);
  if (!finite(p) || p.total_budget_gbp !== p.inputs.budget || !p.qa.guardrails_respected) sweepFails += 1;
}
check("random feasible guardrails and Strategic Index: exact totals, inside guardrails", sweepFails === 0, `${sweepRuns} plans, ${sweepFails} failures`);

const zeroMonth = JSON.parse(JSON.stringify(base));
zeroMonth.monthly_allocations.filter((r) => r.month === "2026-08").forEach((r) => { r.budget_gbp = 0; });
zeroMonth.monthly_allocations.filter((r) => r.channel === "Meta").forEach((r) => { r.budget_gbp = 0; });
pe.peRecalc(zeroMonth);
const fromZero = pe.peScenarioFromPlan(zeroMonth, "brand_trust_build");
check("scenario from a base with a zeroed month and channel has no NaN", finite(fromZero) && fromZero.total_budget_gbp === zeroMonth.total_budget_gbp);
const offBrief = JSON.parse(JSON.stringify(base));
offBrief.monthly_allocations[0].budget_gbp += 50000;
pe.peRecalc(offBrief);
const fromOff = pe.peScenarioFromPlan(offBrief, "multicar_household_growth");
check("scenario from an off-brief base still flags the brief mismatch", fromOff.qa.budget_matches_brief === false);
check("scenario records the base it was built from", fromOff.base_fingerprint === pe.peFingerprint(offBrief) && fromOff.base_fingerprint !== pe.peFingerprint(base));
const oneDay = pe.peMonths("2026-03-15", "2026-03-15");
check("one-day range", oneDay.length === 1 && oneDay[0].covered === 1);
const leap = pe.peMonths("2028-02-01", "2028-02-29");
check("leap-year February is whole", leap.length === 1 && leap[0].fraction === 1);
const crossPartial = pe.peGeneratePlan({ ...inputs, start: "2026-12-20", end: "2027-03-10" }, config, guardrails, {});
check("cross-year partial plan sums exactly", crossPartial.total_budget_gbp === 200000 && crossPartial.months.length === 4 && finite(crossPartial));

console.log(`\nBase plan: £${base.total_budget_gbp.toLocaleString("en-GB")} · ${base.forecast_clicks.toLocaleString("en-GB")} clicks · £${base.cost_per_click.toFixed(2)} CPC · target ${base.target_visitors.toLocaleString("en-GB")} visitors · months short: ${base.qa.months_short.length}`);
console.log(base.channel_totals.map((c) => `${c.channel} £${c.budget_gbp} ${c.forecast_clicks} clicks £${(c.budget_gbp / c.forecast_clicks).toFixed(2)}`).join("\n"));
console.log(base.month_totals.map((m) => `${m.month} £${m.budget_gbp} clicks ${m.forecast_clicks} target ${m.target_visitors}`).join("\n"));
console.log(failed ? `\n${failed} CHECK(S) FAILED` : "\nALL CHECKS PASSED");
process.exit(failed ? 1 : 0);
