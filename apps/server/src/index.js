// Planner Demo server — serves the static per-client planner demo(s) and their
// data trees. The primary client (admiral) is a plain static HTML/CSS/
// vanilla-JS bundle with no build step, rebuilt from the PPL (Postcode
// Lottery) prototype's actual source — that layout/engine is domain-neutral
// (channels, scenarios, calendar, evidence) with almost no hardcoded client
// content, unlike the earlier FanDuel-based attempt (kept in
// reference/fanduel-attempt/, not served).
//
// No live planning/chat API yet (intentionally skipped for now). No database
// either: the planner reads directly from the JSON files on disk under
// clients/<name>/data/, so swapping in a new client's numbers for now is just
// replacing those JSON files.
const path = require("path");
const express = require("express");

const ROOT_DIR = path.join(__dirname, "..", "..", "..");
const PORT = process.env.PORT || 4000;

const app = express();

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Cross-client shared reference data (regulation, media minimums, etc.) —
// resolved by each client's app.js via "../../../universal/..." from its demo/ dir.
app.use("/universal", express.static(path.join(ROOT_DIR, "universal")));

// Every client's demo + its data folder live under clients/<name>/ and are
// served as-is (e.g. /clients/admiral/demo/, /clients/admiral/data/).
app.use("/clients", express.static(path.join(ROOT_DIR, "clients")));

// Convenience redirect so the root URL lands somewhere useful during local dev
// and on a fresh Railway deploy, instead of a bare 404.
app.get("/", (_req, res) => {
  res.redirect("/clients/admiral/demo/");
});

app.listen(PORT, () => {
  console.log(`Planner Demo server listening on port ${PORT}`);
  console.log(`  → http://localhost:${PORT}/clients/admiral/demo/`);
});
