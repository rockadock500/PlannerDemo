#!/usr/bin/env node
// Reconciliation check for data/admiral_synthetic_fixture_2026.json.
//
// Confirms:
//   1. cost per new policy sale = annual media budget / forecast new policy sales
//   2. monthly budget weights sum to 100%
//   3. channel annual shares sum to 100% (PCW distribution is deliberately
//      excluded from this split - it is not impression-based media)
//   4. the month x channel budget matrix sums exactly to the annual budget
//   5. forecast quote starts is consistent with the stated quote-to-policy
//      conversion rate
//
// Run with: node scripts/check_synthetic_fixture_reconciliation.js
// Exits non-zero if any check fails.

const fs = require("fs");
const path = require("path");

const fixturePath = path.join(__dirname, "..", "data", "admiral_synthetic_fixture_2026.json");
const f = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

let failed = false;
function check(label, cond) {
  console.log((cond ? "PASS" : "FAIL") + " - " + label);
  if (!cond) failed = true;
}

const { total_media_budget_gbp, forecast_new_policy_sales, cost_per_new_policy_sale_gbp } = f.annual_summary;

check(
  "cost_per_new_policy_sale_gbp == total_media_budget_gbp / forecast_new_policy_sales",
  cost_per_new_policy_sale_gbp === total_media_budget_gbp / forecast_new_policy_sales
);

const weightSum = Object.values(f.monthly_budget_weights_pct).reduce((a, b) => a + b, 0);
check("monthly_budget_weights_pct sums to 100", weightSum === 100);

const shareSum = Object.values(f.channel_annual_share_pct).reduce((a, b) => a + b, 0);
check("channel_annual_share_pct sums to 100 (distribution/PCW excluded by design)", shareSum === 100);

let grandTotal = 0;
Object.entries(f.monthly_channel_budget_gbp).forEach(([month, channels]) => {
  const monthSum = Object.values(channels).reduce((a, b) => a + b, 0);
  check(`month ${month} channel cells sum to its monthly_total_budget_gbp`, monthSum === f.monthly_total_budget_gbp[month]);
  grandTotal += monthSum;
});
check("sum of months x channels == total_media_budget_gbp", grandTotal === total_media_budget_gbp);

const monthlyTotalSum = Object.values(f.monthly_total_budget_gbp).reduce((a, b) => a + b, 0);
check("sum of monthly_total_budget_gbp == total_media_budget_gbp", monthlyTotalSum === total_media_budget_gbp);

const impliedConversion = (forecast_new_policy_sales / f.annual_summary.forecast_quote_starts) * 100;
check(
  "forecast_quote_starts implies quote_to_policy_conversion_pct (within rounding)",
  Math.abs(impliedConversion - f.annual_summary.quote_to_policy_conversion_pct) < 0.01
);

console.log(failed ? "\nRECONCILIATION FAILED" : "\nRECONCILIATION OK - all checks passed");
process.exit(failed ? 1 : 0);
