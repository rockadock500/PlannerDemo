// Plan Chat: a chat window about the stored Blended plan. Static demo: answers
// are assembled from the plan's own figures, rationale and sources (no AI call),
// and keep to the boundary the real assistant would (no investor, customer or
// market-sensitive detail, no forward-looking financial claims).
// Reads `state` from app.js at call time.

const CHAT_SUGGESTIONS = [
  "Why is February weighted above January?",
  "Which evidence supports the CTV & Streaming share?",
  "How does the plan balance GBE reach and precision?",
  "What changes if financial publisher PMP prices rise 15%?",
  "Which guardrails are binding?",
];

const CHAT_BOUNDARY = "I can explain the budget, channel and month choices in this plan using the figures and sources stored against it. I won't use or guess at investor, shareholder or customer-level detail or market-sensitive information, and I don't make forward-looking financial claims.";

const chatState = { messages: [] };

const chatMoney = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const chatPence = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const chatNumber = new Intl.NumberFormat("en-GB");
const CHAT_MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
// bp's quarterly results windows in this demo's phasing (Feb, Apr-May, Jul-Aug, Oct-Nov), from the synthetic fixture note.
const CHAT_RESULTS_MONTHS = new Set([1, 3, 4, 6, 7, 9, 10]);
// Which delivery source backs each channel's history.
const CHAT_CHANNEL_SOURCE = { "CTV & Streaming": "t7s_bigquery_ctv", "Programmatic Display": "t7s_bigquery_display", "Online Video": "t7s_bigquery_video", "Meta": "t7s_bigquery_meta" };

function chatPlan() {
  return state.plans.balanced_growth;
}

function chatEscape(text) {
  return String(text).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
}

const chatPct = (n) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(Math.round(n * 100))}%`;

function chatMonthTotals(plan) {
  const totals = {};
  plan.monthly_allocations.forEach((row) => {
    totals[row.month] = (totals[row.month] || 0) + row.budget_gbp;
  });
  return totals;
}

const chatMonthKey = (index) => `2026-${String(index + 1).padStart(2, "0")}`;
const chatMonthName = (index) => CHAT_MONTHS[index][0].toUpperCase() + CHAT_MONTHS[index].slice(1);

// Months in the order the question names them, full or short ("Feb"). "May" only
// counts with a capital M, so "how much more may we spend" isn't read as a month.
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

// The guardrails in force: Step 2 overrides on Campaign Planning, else the rule's floor and no cap.
function chatGuardrail(channel) {
  const override = state.channelGuardrailOverrides?.[channel] || {};
  return { floor: override.min_pct ?? chatRule(channel)?.strategic_floor_pct ?? 0, cap: override.max_pct ?? 100 };
}

function chatAnswer(question) {
  const plan = chatPlan();
  const q = question.toLowerCase();
  const months = chatMonthsIn(question);
  const channel = chatChannelFrom(q, plan);
  const totals = chatMonthTotals(plan);
  const sources = (ids) => [...new Set(ids)].slice(0, 4).map(sourceLabel);
  const efficiency = (c) => c.forecast_new_policy_sales / c.budget_gbp;

  if (/\b(share price|shareholders?|investor names?|individual investors?|customer data|insider|earnings guidance|financial guidance|dividends?)\b/.test(q)) {
    return { text: `That's outside what I can answer. ${CHAT_BOUNDARY}` };
  }

  // A price change on one channel: at the same budget, engagements move in proportion.
  const priceChange = q.match(/(\d+(?:\.\d+)?)\s*%/);
  if (priceChange && /\b(prices?|costs?|cpms?|rates?)\b/.test(q)) {
    const falling = /\b(fall|falls|drop|drops|cut|cuts|decrease|decreases|cheaper|lower|down)\b/.test(q);
    const change = (falling ? -1 : 1) * Number(priceChange[1]) / 100;
    const target = channel || plan.channel_totals.find((c) => c.channel === "Programmatic Display");
    const delta = target.forecast_new_policy_sales / (1 + change) - target.forecast_new_policy_sales;
    const engagements = plan.forecast_new_policy_sales + delta;
    const cpe = plan.total_budget_gbp / engagements;
    const brief = plan.brief_test.brief_cost_per_policy_gbp;
    const best = plan.channel_totals.filter((c) => c.channel !== target.channel).sort((a, b) => efficiency(b) - efficiency(a))[0];
    const next = falling
      ? `${target.channel} would become better value, so it could take more budget within its guardrails.`
      : `${best.channel} delivers the most engagements per pound of the other channels, so moving some ${target.channel} budget there would recover part of the loss.`;
    return {
      text: `If ${target.channel} prices ${falling ? "fall" : "rise"} ${Math.abs(Math.round(change * 100))}% and its ${chatMoney.format(target.budget_gbp)} stays the same, it buys about ${chatNumber.format(Math.round(Math.abs(delta)))} ${delta < 0 ? "fewer" : "more"} GBE engagements. The plan total moves from ${chatNumber.format(plan.forecast_new_policy_sales)} to about ${chatNumber.format(Math.round(engagements))}, and cost per engagement from ${chatPence.format(plan.forecast_cost_per_policy_gbp)} to ${chatPence.format(cpe)}, ${cpe <= brief ? "inside" : "above"} the ${chatPence.format(brief)} brief limit. ${next}`,
      sources: sources(["bp_planning_evidence_rules_2026", "bp_response_curve_priors_2026", "media_owner_benchmarks_v1"]),
    };
  }

  if (/\b(target|cpe|cost per|clears?|on track)\b/.test(q)) {
    const t = plan.brief_test;
    return {
      text: `The plan forecasts ${chatNumber.format(t.forecast_new_policy_sales)} GBE engagements against a ${chatNumber.format(t.policy_sales_target)} target, so it ${t.clears_policy_sales_target ? "clears" : "falls short of"} the target by ${chatNumber.format(Math.abs(t.policy_sales_target - t.forecast_new_policy_sales))}. Cost per engagement is ${chatPence.format(t.forecast_cost_per_policy_gbp)}, ${t.clears_brief_cost_per_policy ? "inside" : "above"} the ${chatPence.format(t.brief_cost_per_policy_gbp)} brief limit.`,
      sources: sources(["bp_planning_evidence_rules_2026", "bp_annual_media_brief"]),
    };
  }

  if (months.length) {
    const [a, b] = months.length >= 2 ? months : [months[0], months[0] === 0 ? 1 : months[0] - 1];
    const ta = totals[chatMonthKey(a)];
    const tb = totals[chatMonthKey(b)];
    const window = (i) => (CHAT_RESULTS_MONTHS.has(i) ? "has a results window" : "has no results window");
    const fits = (ta > tb && CHAT_RESULTS_MONTHS.has(a) && !CHAT_RESULTS_MONTHS.has(b)) || (tb > ta && CHAT_RESULTS_MONTHS.has(b) && !CHAT_RESULTS_MONTHS.has(a));
    const figures = ta === tb
      ? `${chatMonthName(a)} and ${chatMonthName(b)} get the same budget, ${chatMoney.format(ta)} each.`
      : `${chatMonthName(a)} has ${chatMoney.format(ta)} and ${chatMonthName(b)} ${chatMoney.format(tb)} (${chatPct(ta / tb - 1)}).`;
    const reason = ta === tb
      ? "."
      : fits
        ? ", which is why the busier month gets more: the plan raises spend so investment messaging is visible when investors and the financial press are paying attention."
        : "; the difference here comes from the monthly weights rather than the results calendar.";
    return {
      text: `${figures} ${chatMonthName(a)} ${window(a)} and ${chatMonthName(b)} ${window(b)}${reason} In this demo the monthly weights are a synthetic planning assumption, not bp's actual phasing.`,
      sources: sources(["bp_results_calendar_2026", "bp_media_budget", "synthetic_bp_ic_demo"]),
    };
  }

  if (/\b(guardrails?|binding|floors?|caps?|constraints?|minimum|maximum)\b/.test(q)) {
    const lines = plan.channel_totals.map((c) => {
      const { floor, cap } = chatGuardrail(c.channel);
      const atFloor = c.share_pct <= floor + 0.5;
      const atCap = cap < 100 && c.share_pct >= cap - 0.5;
      return `• ${c.channel}: ${c.share_pct}% of budget, floor ${floor}%${cap < 100 ? `, cap ${cap}%` : ""}${atFloor ? " (floor binding)" : atCap ? " (cap binding)" : ""}.`;
    });
    const binding = lines.filter((line) => line.includes("binding")).length;
    const anyCap = plan.channel_totals.some((c) => chatGuardrail(c.channel).cap < 100);
    return {
      text: [`${binding ? `${binding} guardrail${binding > 1 ? "s bind" : " binds"}.` : "No guardrail is binding: every channel sits between its floor and cap."} ${anyCap ? "Caps are set in Step 2 on Campaign Planning." : "No channel is capped below 100%."}`, ...lines].join("\n"),
      sources: sources(["bp_planning_evidence_rules_2026", "bp_media_budget"]),
    };
  }

  if (channel) {
    const rule = chatRule(channel.channel);
    const owners = {};
    plan.media_owner_allocations.filter((row) => row.channel === channel.channel).forEach((row) => {
      owners[row.owner] = (owners[row.owner] || 0) + row.budget_gbp;
    });
    const topOwners = Object.entries(owners).sort((x, y) => y[1] - x[1]).slice(0, 2).map(([owner, budget]) => `${owner} (${chatMoney.format(budget)})`);
    const evidence = { primary_mmm: "history-based modelling", test_required: "a measured test, because the history is short", brief_required_gap: "a brief requirement, with weaker targeting evidence" }[channel.evidence_strength] || channel.evidence_strength;
    const gap = channel.share_pct - channel.mmm_optimal_share_pct;
    const versusCurve = Math.abs(gap) < 1 ? "in line with" : gap > 0 ? `${Math.round(gap)} points above` : `${Math.round(-gap)} points below`;
    return {
      text: `${channel.channel} gets ${chatMoney.format(channel.budget_gbp)}, ${channel.share_pct}% of the plan, ${versusCurve} the ${channel.mmm_optimal_share_pct}% the response curve suggests. Its role: ${rule?.planning_role || "see the channel rules"} The share rests on ${evidence}, with ${channel.confidence} confidence. It's forecast to deliver ${chatNumber.format(channel.forecast_new_policy_sales)} GBE engagements.${topOwners.length ? ` Largest media owners: ${topOwners.join(" and ")}.` : ""}`,
      sources: sources(["bp_planning_evidence_rules_2026", "bp_response_curve_priors_2026", CHAT_CHANNEL_SOURCE[channel.channel], "media_owner_benchmarks_v1"].filter(Boolean)),
    };
  }

  if (/\b(reach|precision|audiences?|balance)\b/.test(q)) {
    const groups = { brand_reach: "reach", precision_targeting: "precision", video_consideration: "consideration", social_amplification: "amplification" };
    const share = (ids) => plan.channel_totals.filter((c) => ids.includes(c.channel_group)).reduce((a, c) => a + c.share_pct, 0);
    const lines = plan.channel_totals.map((c) => `• ${c.channel} (${groups[c.channel_group] || c.channel_group}): ${c.share_pct}%, ${chatMoney.format(c.budget_gbp)}`);
    return {
      text: [`The plan puts ${share(["brand_reach", "video_consideration"])}% into reach and consideration (CTV and video), ${share(["precision_targeting"])}% into precision display on financial publishers, and ${share(["social_amplification"])}% into Meta as a measured amplification layer:`, ...lines, "GBE audience sizing is still a synthetic placeholder until IPSOS IGI data is connected."].join("\n"),
      sources: sources(["bp_planning_evidence_rules_2026", "ipsos_igi_gbe_2026"]),
    };
  }

  if (/\b(warnings?|risks?|worry|confidence|gaps?)\b/.test(q)) {
    return { text: ["The plan carries these warnings:", ...plan.qa.warnings.map((w) => `• ${w}`)].join("\n"), sources: sources(["bp_planning_evidence_rules_2026"]) };
  }

  return {
    text: [`The ${plan.scenario.label} plan spends ${chatMoney.format(plan.total_budget_gbp)} across ${plan.channel_totals.length} channels for ${chatNumber.format(plan.forecast_new_policy_sales)} forecast GBE engagements at ${chatPence.format(plan.forecast_cost_per_policy_gbp)} each:`, ...plan.channel_totals.map((c) => `• ${c.channel}: ${chatMoney.format(c.budget_gbp)} (${c.share_pct}%)`), "Ask about a channel, a month, the guardrails, the brief target or a price change."].join("\n"),
    sources: sources(["bp_media_budget", "bp_planning_evidence_rules_2026"]),
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

function renderPlanChat() {
  const root = document.querySelector("#planChat");
  if (!root || root.dataset.ready) return;
  const plan = chatPlan();
  root.dataset.ready = "true";
  root.innerHTML = `
    <div class="chat-head">
      <div>
        <h2>${plan.scenario.label} plan</h2>
        <p class="table-hint">${chatMoney.format(plan.total_budget_gbp)} across ${plan.channel_totals.length} channels in 2026. Answers use the plan's own figures and sources.</p>
      </div>
      <button class="secondary-button" type="button" id="chatNew" hidden>New chat</button>
    </div>
    <div class="chat-log" id="chatLog" role="log" aria-live="polite" aria-label="Conversation"></div>
    <form class="chat-form" id="chatForm">
      <input id="chatInput" type="text" autocomplete="off" placeholder="Ask about a channel, a month, the guardrails…" aria-label="Your question" />
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
