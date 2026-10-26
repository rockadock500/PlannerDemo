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

function chatPlan() {
  return state.plans.balanced_growth;
}

function chatEscape(text) {
  return String(text).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
}

function chatMonthTotals(plan) {
  const totals = {};
  plan.monthly_allocations.forEach((row) => {
    totals[row.month] = (totals[row.month] || 0) + row.budget_gbp;
  });
  return totals;
}

const chatMonthKey = (index) => `2026-${String(index + 1).padStart(2, "0")}`;
const chatMonthName = (index) => CHAT_MONTHS[index][0].toUpperCase() + CHAT_MONTHS[index].slice(1);

function chatChannelFrom(q, plan) {
  const aliases = { "ctv": "CTV & Streaming", "streaming": "CTV & Streaming", "display": "Programmatic Display", "programmatic": "Programmatic Display", "pmp": "Programmatic Display", "video": "Online Video", "meta": "Meta", "facebook": "Meta", "instagram": "Meta" };
  const hit = Object.keys(aliases).find((key) => new RegExp(`\\b${key}\\b`).test(q));
  return hit ? plan.channel_totals.find((c) => c.channel === aliases[hit]) : null;
}

function chatRule(channel) {
  return state.evidenceRules.channel_rules.find((rule) => rule.channel === channel);
}

function chatAnswer(question) {
  const plan = chatPlan();
  const q = question.toLowerCase();
  // Months in the order the question names them ("February above January" compares February first).
  const months = CHAT_MONTHS.map((m, i) => ({ i, at: q.search(new RegExp(`\\b${m}\\b`)) }))
    .filter((m) => m.at >= 0)
    .sort((x, y) => x.at - y.at)
    .map((m) => m.i);
  const channel = chatChannelFrom(q, plan);
  const totals = chatMonthTotals(plan);
  const sources = (ids) => [...new Set(ids)].slice(0, 4).map(sourceLabel);

  if (/\b(share price|shareholder|investor names?|individual investor|customer data|insider|guidance|dividend)\b/.test(q)) {
    return { text: `That's outside what I can answer. ${CHAT_BOUNDARY}` };
  }

  // Price change on display inventory: engagements fall in proportion to the price rise.
  const priceRise = q.match(/(\d+(?:\.\d+)?)\s*%/);
  if (priceRise && /(price|cost|cpm|rise|increase)/.test(q)) {
    const rise = Number(priceRise[1]) / 100;
    const target = channel || plan.channel_totals.find((c) => c.channel === "Programmatic Display");
    const lost = target.forecast_new_policy_sales - target.forecast_new_policy_sales / (1 + rise);
    const engagements = plan.forecast_new_policy_sales - lost;
    const cpe = plan.total_budget_gbp / engagements;
    const brief = plan.brief_test.brief_cost_per_policy_gbp;
    return {
      text: `If ${target.channel} prices rise ${Math.round(rise * 100)}% and its ${chatMoney.format(target.budget_gbp)} stays the same, it buys about ${chatNumber.format(Math.round(lost))} fewer GBE engagements. The plan total falls from ${chatNumber.format(plan.forecast_new_policy_sales)} to about ${chatNumber.format(Math.round(engagements))}, and cost per engagement moves from ${chatPence.format(plan.forecast_cost_per_policy_gbp)} to ${chatPence.format(cpe)}, ${cpe <= brief ? "still inside" : "above"} the ${chatPence.format(brief)} brief limit. Moving some of that budget to CTV & Streaming, which is below its efficient ceiling, would recover part of the loss.`,
      sources: sources(["bp_planning_evidence_rules_2026", "bp_response_curve_priors_2026", "media_owner_benchmarks_v1"]),
    };
  }

  if (months.length >= 2 || (months.length === 1 && /(weight|phas|why|more|less|above|below)/.test(q))) {
    const [a, b] = months.length >= 2 ? months : [months[0], months[0] === 0 ? 1 : months[0] - 1];
    const ta = totals[chatMonthKey(a)];
    const tb = totals[chatMonthKey(b)];
    const note = state.syntheticFixture?.monthly_budget_weights_note || "";
    return {
      text: `${chatMonthName(a)} has ${chatMoney.format(ta)} and ${chatMonthName(b)} ${chatMoney.format(tb)} (${ta >= tb ? "+" : ""}${Math.round((ta / tb - 1) * 100)}%). The phasing follows bp's results calendar: ${note.replace(/ The weights are .*$/, "")} Months with a results window get more budget so investment messaging is visible when investors and the financial press are paying attention.`,
      sources: sources(["bp_results_calendar_2026", "bp_media_budget", "synthetic_bp_ic_demo"]),
    };
  }

  if (/guardrail|binding|floor|cap|constraint/.test(q)) {
    const lines = plan.channel_totals.map((c) => {
      const rule = chatRule(c.channel);
      const floor = rule?.strategic_floor_pct ?? 0;
      const binding = c.share_pct <= floor + 0.5;
      return `• ${c.channel}: ${c.share_pct}% of budget against a ${floor}% floor${binding ? " (binding)" : ", so the floor isn't binding"}.`;
    });
    const anyBinding = lines.some((line) => line.includes("(binding)"));
    return {
      text: [`${anyBinding ? "Some guardrails bind." : "None of the channel floors is binding in this plan; every channel sits above its minimum."} No maximum caps are set.`, ...lines].join("\n"),
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
    return {
      text: `${channel.channel} gets ${chatMoney.format(channel.budget_gbp)}, ${channel.share_pct}% of the plan, in line with the ${channel.mmm_optimal_share_pct}% the response curve suggests. Its role: ${rule?.planning_role || "see the channel rules"} The share rests on ${evidence}, with ${channel.confidence} confidence. It's forecast to deliver ${chatNumber.format(channel.forecast_new_policy_sales)} GBE engagements.${topOwners.length ? ` Largest media owners: ${topOwners.join(" and ")}.` : ""}`,
      sources: sources(["bp_planning_evidence_rules_2026", "bp_response_curve_priors_2026", "t7s_bigquery_ctv", "media_owner_benchmarks_v1"]),
    };
  }

  if (/reach|precision|gbe|audience|balance/.test(q)) {
    const groups = { brand_reach: "reach", precision_targeting: "precision", video_consideration: "consideration", social_amplification: "amplification" };
    const lines = plan.channel_totals.map((c) => `• ${c.channel} (${groups[c.channel_group] || c.channel_group}): ${c.share_pct}%, ${chatMoney.format(c.budget_gbp)}`);
    return {
      text: [`The plan puts ${plan.channel_totals.filter((c) => c.channel_group === "brand_reach" || c.channel_group === "video_consideration").reduce((a, c) => a + c.share_pct, 0)}% into reach and consideration (CTV and video) and ${plan.channel_totals.filter((c) => c.channel_group === "precision_targeting").reduce((a, c) => a + c.share_pct, 0)}% into precision display on financial publishers, with Meta as a measured amplification layer:`, ...lines, "GBE audience sizing is still a synthetic placeholder until IPSOS IGI data is connected."].join("\n"),
      sources: sources(["bp_planning_evidence_rules_2026", "ipsos_igi_gbe_2026"]),
    };
  }

  if (/target|brief|cpe|cost per|engagement|clear/.test(q)) {
    const t = plan.brief_test;
    return {
      text: `The plan forecasts ${chatNumber.format(t.forecast_new_policy_sales)} GBE engagements against a ${chatNumber.format(t.policy_sales_target)} target, so it ${t.clears_policy_sales_target ? "clears" : "falls short of"} the target by ${chatNumber.format(Math.abs(t.policy_sales_target - t.forecast_new_policy_sales))}. Cost per engagement is ${chatPence.format(t.forecast_cost_per_policy_gbp)}, ${t.clears_brief_cost_per_policy ? "inside" : "above"} the ${chatPence.format(t.brief_cost_per_policy_gbp)} brief limit.`,
      sources: sources(["bp_planning_evidence_rules_2026", "bp_annual_media_brief"]),
    };
  }

  if (/warning|risk|worry|confiden|gap/.test(q)) {
    return { text: ["The plan carries these warnings:", ...plan.qa.warnings.map((w) => `• ${w}`)].join("\n"), sources: sources(["bp_planning_evidence_rules_2026"]) };
  }

  return {
    text: [`The Blended plan spends ${chatMoney.format(plan.total_budget_gbp)} across four channels for ${chatNumber.format(plan.forecast_new_policy_sales)} forecast GBE engagements at ${chatPence.format(plan.forecast_cost_per_policy_gbp)} each:`, ...plan.channel_totals.map((c) => `• ${c.channel}: ${chatMoney.format(c.budget_gbp)} (${c.share_pct}%)`), "Ask about a channel, a month, the guardrails, the brief target or a price change."].join("\n"),
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

function chatAsk(text) {
  const question = text.trim();
  if (!question) return;
  chatState.messages.push({ role: "user", text: question }, { role: "assistant", ...chatAnswer(question) });
  renderChatLog();
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
    <div class="chat-log" id="chatLog" role="log" aria-live="polite"></div>
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
    }
  });
  renderChatLog();
}
