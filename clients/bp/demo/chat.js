// Planner Chat: a chat window about the base plan from Campaign Planning. Static
// demo: answers are assembled from the plan's own figures (no AI call) and keep to
// the boundary the real assistant would (no investor, customer or market-sensitive
// detail, no forward-looking financial claims). Reads plannerState and `state` at call time.

const CHAT_SUGGESTIONS = [
  "Why is February weighted above January?",
  "Which months fall short of the visitor target?",
  "Which evidence supports the CTV & Streaming share?",
  "What changes if Meta costs rise 15%?",
  "Which guardrails are binding?",
];

const CHAT_BOUNDARY = "I can explain the budget, channel and month choices in the base plan using its own figures. I won't use or guess at investor, shareholder or customer-level detail or market-sensitive information, and I don't make forward-looking financial claims.";

const chatState = { messages: [] };

const chatMoney = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const chatPence = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const chatNumber = new Intl.NumberFormat("en-GB");
const CHAT_MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
// bp's quarterly results windows in the demo phasing (Feb, Apr-May, Jul-Aug, Oct-Nov), by calendar month.
const CHAT_RESULTS_MONTHS = new Set([2, 4, 5, 7, 8, 10, 11]);
// Which delivery source backs each channel's history.
const CHAT_CHANNEL_SOURCE = { "CTV & Streaming": "t7s_bigquery_ctv", "Programmatic Display": "t7s_bigquery_display", "Online Video": "t7s_bigquery_video", "Meta": "t7s_bigquery_meta" };

function chatPlan() {
  return plannerState.basePlan;
}

function chatEscape(text) {
  return String(text).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
}

const chatPct = (n) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n * 100).toFixed(1)}%`;
const chatMonthName = (index) => CHAT_MONTHS[index][0].toUpperCase() + CHAT_MONTHS[index].slice(1);

// Calendar months (0–11) in the order the question names them, full or short ("Feb").
// "May" only counts with a capital M, so "how much more may we spend" isn't read as a month.
function chatMonthsIn(question) {
  const found = [];
  CHAT_MONTHS.forEach((month, i) => {
    const pattern = month === "may" ? /\bMay\b/ : new RegExp(`\\b(${month}|${month.slice(0, 3)}${month === "september" ? "t?" : ""})\\b`, "i");
    const at = question.search(pattern);
    if (at >= 0) found.push({ i, at });
  });
  return found.sort((x, y) => x.at - y.at).map((m) => m.i);
}

function chatChannelFrom(q, plan) {
  const aliases = { "ctv": "CTV & Streaming", "streaming": "CTV & Streaming", "display": "Programmatic Display", "programmatic": "Programmatic Display", "pmp": "Programmatic Display", "video": "Online Video", "meta": "Meta", "facebook": "Meta", "instagram": "Meta" };
  const hit = Object.keys(aliases).find((key) => new RegExp(`\\b${key}\\b`).test(q));
  return hit ? plan.channel_totals.find((c) => c.channel === aliases[hit]) : null;
}

function chatRule(channel) {
  return state.evidenceRules.channel_rules.find((rule) => rule.channel === channel);
}

const chatSiOf = (plan, channel, monthKey) => plan.strategic_index?.[channel]?.[monthKey] || "M";
const chatCpc = (c) => (c.forecast_clicks ? c.budget_gbp / c.forecast_clicks : Infinity);

function chatAnswer(question) {
  const plan = chatPlan();
  if (!plan) return { text: "There's no base plan yet. Generate one in Campaign Planning first." };
  const q = question.toLowerCase();
  const months = chatMonthsIn(question).map((i) => plan.months.find((m) => m.month === i + 1)).filter(Boolean);
  const channel = chatChannelFrom(q, plan);
  const monthTotal = (key) => plan.month_totals.find((m) => m.month === key);
  const sources = (ids) => [...new Set(ids.filter(Boolean))].slice(0, 4).map(sourceLabel);
  const cheapest = (exclude) => plan.channel_totals.filter((c) => c.channel !== exclude && c.budget_gbp > 0).sort((a, b) => chatCpc(a) - chatCpc(b))[0];

  if (/\b(share price|shareholders?|investor names?|individual investors?|customer data|insider|earnings guidance|financial guidance|dividends?)\b/.test(q)) {
    return { text: `That's outside what I can answer. ${CHAT_BOUNDARY}` };
  }

  // A cost change on one channel: at the same budget, its clicks move in proportion.
  const costChange = q.match(/(\d+(?:\.\d+)?)\s*%/);
  if (costChange && /\b(prices?|costs?|cpcs?|cpms?|rates?)\b/.test(q)) {
    const falling = /\b(fall|falls|drop|drops|cut|cuts|decrease|decreases|cheaper|lower|down)\b/.test(q);
    const change = (falling ? -1 : 1) * Number(costChange[1]) / 100;
    if (change <= -0.99) return { text: "A cost can't fall by 100% or more. Try a smaller change, such as 20%." };
    const target = channel || plan.channel_totals.find((c) => c.channel === "Programmatic Display");
    const delta = target.forecast_clicks / (1 + change) - target.forecast_clicks;
    const clicks = plan.forecast_clicks + delta;
    const vs = plan.target_visitors ? clicks / plan.target_visitors - 1 : 0;
    const best = cheapest(target.channel);
    const next = falling
      ? `${target.channel} would become better value, so it could take more budget within its guardrails.`
      : best
        ? `${best.channel} is the cheapest of the other channels at ${chatPence.format(chatCpc(best))} a click, so moving some ${target.channel} budget there would recover part of the loss.`
        : "";
    return {
      text: `If ${target.channel} costs ${falling ? "fall" : "rise"} ${Math.abs(Math.round(change * 100))}% and its ${chatMoney.format(target.budget_gbp)} stays the same, it buys about ${chatNumber.format(Math.round(Math.abs(delta)))} ${delta < 0 ? "fewer" : "more"} clicks. The plan moves from ${chatNumber.format(plan.forecast_clicks)} to about ${chatNumber.format(Math.round(clicks))} clicks, ${chatPct(vs)} against the ${chatNumber.format(plan.target_visitors)} visitor target, and cost per click from ${chatPence.format(plan.cost_per_click)} to ${chatPence.format(plan.total_budget_gbp / clicks)}. ${next}`,
      sources: sources(["bp_response_curve_priors_2026", CHAT_CHANNEL_SOURCE[target.channel]]),
    };
  }

  if (/\b(targets?|visitors?|short|on track|gap|behind|miss)\b/.test(q)) {
    const short = plan.month_totals.filter((m) => m.forecast_clicks < m.target_visitors);
    const label = (key) => plan.months.find((m) => m.key === key).label;
    const best = cheapest();
    const vs = plan.target_visitors ? plan.forecast_clicks / plan.target_visitors - 1 : 0;
    return {
      text: [
        `The plan forecasts ${chatNumber.format(plan.forecast_clicks)} clicks against ${chatNumber.format(plan.target_visitors)} target visitors (${chatPct(vs)}), counting each click as one visit.`,
        short.length
          ? `${short.length} of ${plan.months.length} months fall short:\n${short.map((m) => `• ${label(m.month)}: ${chatNumber.format(m.forecast_clicks)} clicks vs ${chatNumber.format(m.target_visitors)} (${chatNumber.format(m.target_visitors - m.forecast_clicks)} short)`).join("\n")}\nThe bigger the month, the fewer clicks each extra pound buys.${best ? ` Shifting some of their budget to ${best.channel} (${chatPence.format(chatCpc(best))} a click) or lowering their targets would close the gap.` : ""}`
          : "Every month meets its target.",
        `Targets start at each month's budget ÷ £${PE_TARGET_COST_PER_VISITOR.toFixed(2)} per visitor (a demo assumption) unless you've edited them.`,
      ].join("\n"),
      sources: sources(["synthetic_bp_ic_demo", "bp_response_curve_priors_2026"]),
    };
  }

  if (months.length) {
    const [a, b] = months.length >= 2 ? months : [months[0], plan.months[Math.max(0, plan.months.indexOf(months[0]) - 1)]];
    const ta = monthTotal(a.key);
    const tb = monthTotal(b.key);
    const phasing = plannerConfig().phasing;
    const weight = (m) => phasing[m.month] ?? 1;
    const highs = (m) => plan.channels.filter((c) => chatSiOf(plan, c, m.key) === "H");
    const partNote = (m) => (m.fraction < 1 ? ` (${m.covered} of ${m.days} days in the plan)` : "");
    const figures = a === b
      ? `${chatMonthName(a.month - 1)} has ${chatMoney.format(ta.budget_gbp)}${partNote(a)}.`
      : ta.budget_gbp === tb.budget_gbp
        ? `${chatMonthName(a.month - 1)} and ${chatMonthName(b.month - 1)} get the same budget, ${chatMoney.format(ta.budget_gbp)} each.`
        : `${chatMonthName(a.month - 1)} has ${chatMoney.format(ta.budget_gbp)}${partNote(a)} and ${chatMonthName(b.month - 1)} ${chatMoney.format(tb.budget_gbp)}${partNote(b)} (${chatPct(ta.budget_gbp / tb.budget_gbp - 1)}).`;
    const reasons = [];
    if (a !== b) {
      const [heavy, light] = weight(a) >= weight(b) ? [a, b] : [b, a];
      const windowNote = CHAT_RESULTS_MONTHS.has(heavy.month) && !CHAT_RESULTS_MONTHS.has(light.month) ? `, because ${chatMonthName(heavy.month - 1)} has a results window` : "";
      reasons.push(weight(a) === weight(b)
        ? `Both carry the same weight (${weight(a)}) in the monthly phasing.`
        : `In the monthly phasing ${chatMonthName(heavy.month - 1)} carries a weight of ${weight(heavy)} against ${weight(light)} for ${chatMonthName(light.month - 1)}${windowNote}.`);
      if (a.fraction < 1 || b.fraction < 1) reasons.push("Part months are budgeted pro rata.");
    } else {
      reasons.push(`It carries a weight of ${weight(a)} in the monthly phasing${CHAT_RESULTS_MONTHS.has(a.month) ? ", which includes a results window" : ""}.`);
    }
    [a, b].filter((m, i, arr) => arr.indexOf(m) === i).forEach((m) => {
      if (highs(m).length) reasons.push(`The Strategic Index is High for ${highs(m).join(" and ")} in ${chatMonthName(m.month - 1)}, which moves those channels' money into it.`);
    });
    return {
      text: `${figures} ${reasons.join(" ")} The monthly weights are a synthetic planning assumption in this demo, not bp's actual phasing.`,
      sources: sources(["bp_results_calendar_2026", "bp_media_budget", "synthetic_bp_ic_demo"]),
    };
  }

  if (/\b(strategic index|index)\b/.test(q)) {
    const lines = plan.channels.map((c) => {
      const set = plan.months.map((m) => [m, chatSiOf(plan, c, m.key)]).filter(([, v]) => v !== "M");
      return set.length ? `• ${c}: ${set.map(([m, v]) => `${m.label} ${PE_SI_LABELS[v]}`).join(", ")}` : null;
    }).filter(Boolean);
    return {
      text: lines.length
        ? ["The Strategic Index tilts these channel months away from Medium (High ×1.3, Low ×0.7 on that channel's weight):", ...lines, "Change it in step 3 of Campaign Planning and regenerate."].join("\n")
        : "Every channel is Medium in every month, so the shares follow the starting shares from the evidence rules. Set High or Low in step 3 of Campaign Planning to tilt them.",
    };
  }

  if (/\b(guardrails?|binding|floors?|caps?|constraints?|minimum|maximum)\b/.test(q)) {
    const lines = plan.channel_totals.map((c) => {
      const g = plan.guardrails?.[c.channel] || {};
      const min = g.min ?? 0;
      const max = g.max ?? 100;
      const binding = c.share_pct <= min + 0.5 ? " (floor binding)" : max < 100 && c.share_pct >= max - 0.5 ? " (cap binding)" : "";
      return `• ${c.channel}: ${c.share_pct.toFixed(1)}% of budget, floor ${min}%${max < 100 ? `, cap ${max}%` : ""}${binding}.`;
    });
    const binding = lines.filter((l) => l.includes("binding")).length;
    return {
      text: [`${binding ? `${binding} guardrail${binding > 1 ? "s bind" : " binds"}.` : "No guardrail is binding: every channel sits between its floor and cap."}`, ...lines].join("\n"),
      sources: sources(["bp_planning_evidence_rules_2026"]),
    };
  }

  if (channel) {
    const rule = chatRule(channel.channel);
    const starting = rule?.mmm_optimal_share_pct;
    const gap = starting == null ? 0 : channel.share_pct - starting;
    const versus = Math.abs(gap) < 1 ? "in line with" : gap > 0 ? `${gap.toFixed(1)} points above` : `${(-gap).toFixed(1)} points below`;
    const tilted = plan.months.filter((m) => chatSiOf(plan, channel.channel, m.key) !== "M");
    return {
      text: `${channel.channel} gets ${chatMoney.format(channel.budget_gbp)}, ${channel.share_pct.toFixed(1)}% of the plan, ${versus} its ${starting}% starting share in the evidence rules (synthetic demo). ${rule?.planning_role || ""} It's forecast to deliver ${chatNumber.format(channel.forecast_clicks)} clicks at ${chatPence.format(chatCpc(channel))} each.${tilted.length ? ` The Strategic Index tilts it in ${tilted.map((m) => `${m.label} (${PE_SI_LABELS[chatSiOf(plan, channel.channel, m.key)]})`).join(", ")}.` : ""}`,
      sources: sources(["bp_planning_evidence_rules_2026", "bp_response_curve_priors_2026", CHAT_CHANNEL_SOURCE[channel.channel]]),
    };
  }

  if (/\b(reach|precision|audiences?|balance)\b/.test(q)) {
    const share = (names) => plan.channel_totals.filter((c) => names.includes(c.channel)).reduce((a, c) => a + c.share_pct, 0);
    return {
      text: [`The plan puts ${share(["CTV & Streaming", "Online Video"]).toFixed(1)}% into reach (CTV and online video) and ${share(["Programmatic Display", "Meta"]).toFixed(1)}% into precision and amplification (display on financial publishers and Meta):`, ...plan.channel_totals.map((c) => `• ${c.channel}: ${c.share_pct.toFixed(1)}%, ${chatMoney.format(c.budget_gbp)}, ${chatNumber.format(c.forecast_clicks)} clicks`)].join("\n"),
      sources: sources(["bp_planning_evidence_rules_2026"]),
    };
  }

  if (/\b(warnings?|risks?|worry|confidence)\b/.test(q)) {
    return { text: ["The plan carries these warnings:", ...plan.qa.warnings.map((w) => `• ${w}`)].join("\n") };
  }

  return {
    text: [`The base plan spends ${chatMoney.format(plan.total_budget_gbp)} from ${plDate(plan.inputs.start)} to ${plDate(plan.inputs.end)} across ${plan.channels.length} channels, for ${chatNumber.format(plan.forecast_clicks)} forecast clicks at ${chatPence.format(plan.cost_per_click)} against ${chatNumber.format(plan.target_visitors)} target visitors:`, ...plan.channel_totals.map((c) => `• ${c.channel}: ${chatMoney.format(c.budget_gbp)} (${c.share_pct.toFixed(1)}%)`), "Ask about a channel, a month, the visitor target, the Strategic Index, the guardrails or a cost change."].join("\n"),
    sources: sources(["synthetic_bp_ic_demo"]),
  };
}

function chatMessageHtml(message) {
  if (message.role === "user") return `<div class="chat-msg user"><p>${chatEscape(message.text)}</p></div>`;
  return `
    <div class="chat-msg assistant">
      <p>${chatEscape(message.text)}</p>
      ${message.sources?.length ? `<p class="chat-sources">Sources: ${message.sources.map(chatEscape).join(" · ")}</p>` : ""}
    </div>
  `;
}

function renderChatLog() {
  const log = document.querySelector("#chatLog");
  if (!log) return;
  document.querySelector("#chatNew").hidden = chatState.messages.length === 0;
  if (!chatState.messages.length) {
    log.innerHTML = `
      <div class="chat-empty">
        <img src="./assets/bp-helios.svg" alt="" width="36" height="36" />
        <p class="chat-empty-title">Ask about the plan</p>
        <p class="table-hint">${CHAT_BOUNDARY}</p>
        <div class="chat-suggestions">
          ${CHAT_SUGGESTIONS.map((q) => `<button class="secondary-button" type="button" data-chat-ask="${chatEscape(q)}">${chatEscape(q)}</button>`).join("")}
        </div>
      </div>
    `;
    return;
  }
  log.innerHTML = chatState.messages.map(chatMessageHtml).join("");
  log.scrollTop = log.scrollHeight;
}

// New messages are appended (not the whole log redrawn) so screen readers announce just them.
function chatAsk(text) {
  const question = text.trim();
  if (!question) return;
  const pair = [{ role: "user", text: question }, { role: "assistant", ...chatAnswer(question) }];
  const first = chatState.messages.length === 0;
  chatState.messages.push(...pair);
  if (first) {
    renderChatLog();
  } else {
    const log = document.querySelector("#chatLog");
    log.insertAdjacentHTML("beforeend", pair.map(chatMessageHtml).join(""));
    log.scrollTop = log.scrollHeight;
  }
  document.querySelector("#chatInput").focus();
}

function chatHeadText() {
  const plan = chatPlan();
  return plan
    ? `${chatMoney.format(plan.total_budget_gbp)} from ${plDate(plan.inputs.start)} to ${plDate(plan.inputs.end)} across ${plan.channels.length} channels. Answers use the plan's own figures.`
    : "No base plan yet. Generate one in Campaign Planning.";
}

function renderPlanChat() {
  const root = document.querySelector("#planChat");
  if (!root) return;
  if (root.dataset.ready) {
    root.querySelector("#chatHeadText").textContent = chatHeadText();
    return;
  }
  root.dataset.ready = "true";
  root.innerHTML = `
    <div class="chat-head">
      <div>
        <h2>Base plan</h2>
        <p class="table-hint" id="chatHeadText">${chatHeadText()}</p>
      </div>
      <button class="secondary-button" type="button" id="chatNew" hidden>New chat</button>
    </div>
    <div class="chat-log" id="chatLog" role="log" aria-live="polite" aria-label="Conversation"></div>
    <form class="chat-form" id="chatForm">
      <input id="chatInput" type="text" autocomplete="off" placeholder="Ask about a channel, a month, the visitor target…" aria-label="Your question" />
      <button class="primary-button" type="submit">Send</button>
    </form>
    <p class="table-hint chat-note">Prototype: answers are built from the plan's own figures and sources, with no AI call.</p>
  `;
  root.querySelector("#chatForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = root.querySelector("#chatInput");
    chatAsk(input.value);
    input.value = "";
  });
  root.addEventListener("click", (event) => {
    const suggestion = event.target.closest("[data-chat-ask]");
    if (suggestion) chatAsk(suggestion.dataset.chatAsk);
    if (event.target.closest("#chatNew")) {
      chatState.messages = [];
      renderChatLog();
      root.querySelector("#chatInput").focus();
    }
  });
  renderChatLog();
}
