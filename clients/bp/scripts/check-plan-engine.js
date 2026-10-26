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

console.log(`\nBase plan: £${base.total_budget_gbp.toLocaleString("en-GB")} · ${base.forecast_clicks.toLocaleString("en-GB")} clicks · £${base.cost_per_click.toFixed(2)} CPC · target ${base.target_visitors.toLocaleString("en-GB")} visitors · months short: ${base.qa.months_short.length}`);
console.log(base.channel_totals.map((c) => `${c.channel} £${c.budget_gbp} ${c.forecast_clicks} clicks £${(c.budget_gbp / c.forecast_clicks).toFixed(2)}`).join("\n"));
console.log(base.month_totals.map((m) => `${m.month} £${m.budget_gbp} clicks ${m.forecast_clicks} target ${m.target_visitors}`).join("\n"));
console.log(failed ? `\n${failed} CHECK(S) FAILED` : "\nALL CHECKS PASSED");
process.exit(failed ? 1 : 0);
