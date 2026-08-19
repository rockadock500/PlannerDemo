// Planner Demo server — serves the static per-client planner demo(s) and their
// data trees. Modeled on the live FanDuel Planning OS demo, which is a plain
// static HTML/CSS/vanilla-JS bundle with no build step.
//
// No chat/LLM backend yet (intentionally skipped for now — see runtime-config.js
// in each client's demo/ folder, which has the chat flag turned off). No
// database either: the planner reads directly from the JSON files on disk under
// clients/<name>/{data,config,output,plans,actuals}/, so swapping in a new
// client's numbers for now is just replacing those JSON files.
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

// Every client's demo + its data/config/output/plans/actuals folders live under
// clients/<name>/ and are served as-is, matching the live site's URL layout
// (e.g. /clients/fanduel/demo/).
app.use("/clients", express.static(path.join(ROOT_DIR, "clients")));

// Convenience redirect so the root URL lands somewhere useful during local dev
// and on a fresh Railway deploy, instead of a bare 404.
app.get("/", (_req, res) => {
  res.redirect("/clients/fanduel/demo/");
});

app.listen(PORT, () => {
  console.log(`Planner Demo server listening on port ${PORT}`);
  console.log(`  → http://localhost:${PORT}/clients/fanduel/demo/`);
});
