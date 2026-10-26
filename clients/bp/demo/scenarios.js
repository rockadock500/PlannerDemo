// Scenarios: move budget between channels and see the modelled effect on revenue,
// new customers, ROAS and cost per acquisition. An illustrative diminishing-returns
// engine on a £200k base; every ratio below is synthetic demo data.

const SC_TOTAL = 200000;

// share: of the £200k base. roas / cpa: at the base spend. curve: response
// exponent (lower = flattens faster).
const SC_CHANNELS = [
  { id: "search", name: "Google Search", colour: "#005800", share: 0.45, roas: 6.71, cpa: 42, curve: 0.58 },
  { id: "meta", name: "Meta", colour: "#009b00", share: 0.18, roas: 3.88, cpa: 94, curve: 0.74 },
  { id: "aff", name: "Affiliates", colour: "#7cb300", share: 0.12, roas: 9.37, cpa: 55, curve: 0.5 },
  { id: "ctv", name: "CTV", colour: "#1a6bb0", share: 0.1, roas: 1.9, cpa: 135, curve: 0.86 },
  { id: "youtube", name: "YouTube", colour: "#c8501f", share: 0.1, roas: 1.78, cpa: 135, curve: 0.8 },
  { id: "linkedin", name: "LinkedIn", colour: "#7a3e9d", share: 0.05, roas: 2.49, cpa: 100, curve: 0.78 },
].map((c) => {
  const s0 = SC_TOTAL * c.share;
  return { ...c, s0, r0: s0 * c.roas, n0: s0 / c.cpa };
});

const scState = {
  mult: Object.fromEntries(SC_CHANNELS.map((c) => [c.id, 1])),
  focus: "meta",
};

const scBaseMult = () => Object.fromEntries(SC_CHANNELS.map((c) => [c.id, 1]));

function scRun(mult) {
  let rev = 0;
  let nc = 0;
  let sp = 0;
  const per = SC_CHANNELS.map((c) => {
    const s = c.s0 * mult[c.id];
    const r = c.r0 * Math.pow(s / c.s0, c.curve);
    const n = c.n0 * Math.pow(s / c.s0, c.curve * 0.95);
    rev += r;
    nc += n;
    sp += s;
    return { ...c, s, r, n, mroas: (c.curve * r) / s };
  });
  return { rev, nc, sp, per, roas: rev / sp, cpa: sp / nc };
}

function scGbp(n) {
  if (n >= 999500) return `£${(n / 1e6).toFixed(2)}m`;
  if (n >= 9950) return `£${Math.round(n / 1e3)}k`;
  if (n >= 999.5) return `£${(n / 1e3).toFixed(1)}k`;
  return `£${Math.round(n)}`;
}

const scNum = (n) => Math.round(n).toLocaleString("en-GB");
const scX = (n) => `${n.toFixed(2)}x`;

// Change against the base. `good` says which direction is good news; spend is neutral.
function scDelta(now, base, good) {
  const d = base ? now / base - 1 : 0;
  const flat = Math.abs(d) < 0.0005;
  const tone = flat || good === "flat" ? "flat" : (d > 0) === (good === "up") ? "good" : "bad";
  const arrow = flat ? "→" : d > 0 ? "▲" : "▼";
  const sign = flat ? "" : d > 0 ? "+" : "−";
  return `<span class="sc-delta ${tone}">${arrow} ${sign}${Math.abs(d * 100).toFixed(1)}%<span class="sc-delta-vs"> vs base</span></span>`;
}

function scNiceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / p / 2) * 2 * p;
}

function scCurveSvg(c, mult) {
  const w = 640;
  const h = 260;
  const pad = { l: 68, r: 16, t: 14, b: 30 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const maxS = c.s0 * 2;
  const maxR = scNiceMax(c.r0 * Math.pow(2, c.curve) * 1.05);
  const X = (s) => pad.l + (s / maxS) * iw;
  const Y = (r) => pad.t + ih - (r / maxR) * ih;
  const f = (s) => c.r0 * Math.pow(s / c.s0, c.curve);
  const points = [];
  for (let k = 1; k <= 60; k++) {
    const s = (maxS * k) / 60;
    points.push(`${X(s).toFixed(1)},${Y(f(s)).toFixed(1)}`);
  }
  let grid = "";
  for (let k = 0; k <= 4; k++) {
    grid += `<line x1="${pad.l}" x2="${w - pad.r}" y1="${Y((maxR * k) / 4)}" y2="${Y((maxR * k) / 4)}" />`;
    grid += `<text x="${pad.l - 8}" y="${Y((maxR * k) / 4) + 4}" text-anchor="end">${scGbp((maxR * k) / 4)}</text>`;
    grid += `<text x="${X((maxS * k) / 4)}" y="${h - 8}" text-anchor="middle">${scGbp((maxS * k) / 4)}</text>`;
  }
  const s1 = c.s0 * mult;
  return `
    <svg class="sc-curve" viewBox="0 0 ${w} ${h}" role="img" aria-label="${c.name} response curve: spend on the x-axis, attributed revenue on the y-axis">
      <g class="sc-axis">${grid}</g>
      <polyline fill="none" stroke="${c.colour}" stroke-width="2.5" points="${points.join(" ")}" />
      <circle cx="${X(c.s0)}" cy="${Y(f(c.s0))}" r="6" fill="#fff" stroke="#1a1a17" stroke-width="2"><title>Base: ${scGbp(c.s0)} → ${scGbp(f(c.s0))}</title></circle>
      <circle cx="${X(s1)}" cy="${Y(f(s1))}" r="7" fill="${c.colour}" stroke="#fff" stroke-width="2"><title>Scenario: ${scGbp(s1)} → ${scGbp(f(s1))}</title></circle>
    </svg>
  `;
}

// The page is drawn once; while a slider moves only the numbers, table and curve
// are redrawn, so the slider being dragged is never replaced.
function renderScenarioStudio() {
  const root = document.querySelector("#scenarioStudio");
  if (!root) return;
  root.innerHTML = `
    <div class="status-strip sc-kpis" id="scKpis"></div>
    <div class="sc-split">
      <section class="panel">
        <div class="section-heading compact">
          <div>
            <p class="eyebrow" id="scName">Base plan</p>
            <h2>Budget by channel</h2>
          </div>
          <button class="secondary-button" type="button" id="scReset">Reset</button>
        </div>
        <div class="sc-sliders">
          ${SC_CHANNELS.map((c) => `
            <div class="sc-row">
              <label for="sc-${c.id}"><span class="sc-swatch" style="background:${c.colour}"></span>${c.name}</label>
              <input type="range" id="sc-${c.id}" min="0.5" max="2" step="0.01" value="${scState.mult[c.id]}" data-sc="${c.id}" />
              <strong class="sc-spend" data-sc-spend="${c.id}"></strong>
              <span data-sc-change="${c.id}"></span>
            </div>
          `).join("")}
        </div>
        <div class="sc-table-wrap">
          <table class="sc-table">
            <thead><tr><th>Channel</th><th>Revenue</th><th>vs base</th><th>New customers</th><th>Marginal ROAS</th></tr></thead>
            <tbody id="scTableBody"></tbody>
          </table>
        </div>
        <p class="table-hint">Marginal ROAS is what the next pound returns. When one channel's marginal ROAS is well above another's, moving money between them pays. CTV and YouTube build reach and brand, so judge them on more than attributed revenue.</p>
      </section>
      <section class="panel">
        <div class="section-heading compact">
          <div>
            <p class="eyebrow">Response curve</p>
            <h2 id="scFocusName"></h2>
          </div>
          <select id="scFocus" aria-label="Channel to show">
            ${SC_CHANNELS.map((c) => `<option value="${c.id}" ${c.id === scState.focus ? "selected" : ""}>${c.name}</option>`).join("")}
          </select>
        </div>
        <div class="sc-legend"><span><i class="sc-dot-base"></i>Base</span><span><i class="sc-dot-scenario" id="scLegendDot"></i>Scenario</span></div>
        <div id="scCurve"></div>
        <p class="table-hint" id="scCurveNote"></p>
      </section>
    </div>
    <p class="table-hint sc-footnote"><span class="status-pill">Sample</span> Scenario outputs are planning estimates from synthetic response curves, not guarantees. The approved plan of record lives in Campaign Planning and Approval.</p>
  `;

  root.querySelectorAll("[data-sc]").forEach((input) => {
    input.addEventListener("input", () => {
      scState.mult[input.dataset.sc] = Number(input.value);
      scState.focus = input.dataset.sc;
      root.querySelector("#scFocus").value = scState.focus;
      scUpdate();
    });
  });
  root.querySelector("#scReset").addEventListener("click", () => {
    scState.mult = scBaseMult();
    root.querySelectorAll("[data-sc]").forEach((input) => {
      input.value = "1";
    });
    scUpdate();
  });
  root.querySelector("#scFocus").addEventListener("change", (event) => {
    scState.focus = event.target.value;
    scUpdate();
  });
  scUpdate();
}

function scUpdate() {
  const root = document.querySelector("#scenarioStudio");
  const base = scRun(scBaseMult());
  const s = scRun(scState.mult);
  const isBase = SC_CHANNELS.every((c) => Math.abs(scState.mult[c.id] - 1) < 0.001);

  root.querySelector("#scName").textContent = isBase ? "Base plan" : "Your scenario";
  root.querySelector("#scKpis").innerHTML = [
    ["Total spend", scGbp(s.sp), scDelta(s.sp, base.sp, "flat")],
    ["Attributed revenue", scGbp(s.rev), scDelta(s.rev, base.rev, "up")],
    ["New customers", scNum(s.nc), scDelta(s.nc, base.nc, "up")],
    ["ROAS", scX(s.roas), scDelta(s.roas, base.roas, "up")],
    ["CPA", scGbp(s.cpa), scDelta(s.cpa, base.cpa, "down")],
  ].map(([label, value, delta]) => `<div><span>${label}</span><strong>${value}</strong>${delta}</div>`).join("");

  s.per.forEach((c) => {
    const input = root.querySelector(`#sc-${c.id}`);
    input.setAttribute("aria-valuetext", scGbp(c.s));
    root.querySelector(`[data-sc-spend="${c.id}"]`).textContent = scGbp(c.s);
    root.querySelector(`[data-sc-change="${c.id}"]`).innerHTML = scDelta(c.s, c.s0, "flat");
  });

  root.querySelector("#scTableBody").innerHTML = s.per.map((c, i) => {
    const b = base.per[i];
    const tone = c.mroas > 3 ? "good" : c.mroas < 1.5 ? "bad" : "";
    return `<tr><td>${c.name}</td><td>${scGbp(c.r)}</td><td>${scDelta(c.r, b.r, "up")}</td><td>${scNum(c.n)}</td><td><span class="sc-tag ${tone}">${scX(c.mroas)}</span></td></tr>`;
  }).join("");

  const focus = s.per.find((c) => c.id === scState.focus);
  root.querySelector("#scFocusName").textContent = focus.name;
  root.querySelector("#scLegendDot").style.background = focus.colour;
  root.querySelector("#scCurve").innerHTML = scCurveSvg(SC_CHANNELS.find((c) => c.id === scState.focus), scState.mult[scState.focus]);
  root.querySelector("#scCurveNote").textContent = `Spend on the x-axis, attributed revenue on the y-axis. ${focus.name} returns ${scX(focus.mroas)} on the next pound at ${scGbp(focus.s)}.${focus.id === "aff" ? " Affiliates flatten quickly because partner commission caps bite." : ""}`;
}
