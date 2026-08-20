const MONTHS = [
  "2026-01",
  "2026-02",
  "2026-03",
  "2026-04",
  "2026-05",
  "2026-06",
  "2026-07",
  "2026-08",
  "2026-09",
  "2026-10",
  "2026-11",
  "2026-12",
];

const CHANNEL_ORDER = [
  "AV",
  "OOH",
  "Direct Mail",
  "CTV/YouTube",
  "Paid Search",
  "Paid Social",
  "Audio",
  "Display/Programmatic",
];

// Admiral scenario library (research brief section 5). Each id has a
// matching data/generated_plan_<id>.json fixture with the full month x
// channel plan for that scenario.
const SCENARIOS = ["balanced_growth", "brand_trust_build", "pcw_conversion_defence", "multicar_household_growth", "young_driver_telematics", "ev_growth"];

// Qualitative scenario card facts (research brief section 5): objective,
// what's changed vs the baseline guardrails, which channels move, the
// EXPECTED DIRECTION (not a number) of brand and sales outcomes, and the key
// risk a marketing approver should hold in mind. These are deliberately
// directional/plain-English, not modelled figures - see brief section 2 on
// avoiding false precision.
const SCENARIO_META = {
  balanced_growth: {
    objective: "Base plan balancing brand building, quote demand and new policy sales across the year, within every commercial guardrail.",
    changed_constraints: "None beyond the approved Step 2 guardrails - baseline floors, caps and Strategic Index carry forward unchanged.",
    affected_channels: "No channel is deliberately over- or under-weighted; the MMM-derived channel prior is followed closely.",
    expected_brand_direction: "Steady - no deliberate shift up or down.",
    expected_sales_direction: "Steady - in line with the approved base plan.",
    key_risk: "Read this as an evidence-led balance, not a lack of a point of view - the strongest evidence still gets the most weight.",
  },
  brand_trust_build: {
    objective: "Build trust and consideration around 'Always Looking Out For You', shifting weight from pure demand capture towards brand-building channels.",
    changed_constraints: "Raised floors/weighting on brand-reach channels; paid search and paid social performance weighting held back within their existing guardrail ranges.",
    affected_channels: "Up: Linear TV, BVOD/CTV, OOH, radio/digital audio, online video. Held back: paid search, paid social performance.",
    expected_brand_direction: "Up - broader reach and stronger consideration/trust signal expected.",
    expected_sales_direction: "Flat to slightly down near-term - less budget is chasing active quote shoppers while brand investment builds.",
    key_risk: "Needs brand-tracker and consideration evidence to justify sustaining this over multiple months, not just an assumption that brand spend works.",
  },
  pcw_conversion_defence: {
    objective: "Protect new-business quote and policy volumes if price-comparison-site competition or paid-search CPC rises.",
    changed_constraints: "Paid search and journey-conversion channels weighted up; forecast cost-per-policy factor allowed to flex upward to reflect a tougher CPC environment.",
    affected_channels: "Up: paid search, retargeting/programmatic. Distribution: PCW visibility monitored separately, not folded into the media mix.",
    expected_brand_direction: "Broadly unchanged.",
    expected_sales_direction: "Quote-to-policy conversion defended, but likely at a higher cost per new policy sale than the balanced plan.",
    key_risk: "PCW economics are distribution, not reach media - any 'improvement' shown here is visibility/conversion, never an unsupported price or savings claim.",
  },
  multicar_household_growth: {
    objective: "Grow qualified demand from households with more than one vehicle or risk (Multi), supporting retention and customer lifetime value.",
    changed_constraints: "CRM/email kept as an owned-activation overlay (not counted as paid media spend); household-relevant reach and search weighted up.",
    affected_channels: "Up: household-relevant TV/BVOD/OOH, paid search. Overlay: CRM/email (owned, unpaid unless explicitly costed).",
    expected_brand_direction: "Modest uplift in relevance among family/household audiences.",
    expected_sales_direction: "Gradual growth in qualified Multi quote starts and retention-linked policy sales, not an immediate spike.",
    key_risk: "Must use only approved aggregate household segments - never infer specific household composition or other sensitive attributes.",
  },
  young_driver_telematics: {
    objective: "Grow qualified demand for telematics and young-driver cover using safety-led, creator-style content (see 'Your Ride Your Rules').",
    changed_constraints: "Creator/social content and online video weighted up; strict data, consent and vulnerability controls apply to this audience.",
    affected_channels: "Up: creators/partnerships content, online video, paid search (young-driver terms).",
    expected_brand_direction: "Improved relevance and trust with under-25s.",
    expected_sales_direction: "Gradual growth in qualified young-driver/telematics quote starts - not an immediate volume spike.",
    key_risk: "Under-24 audience needs careful consent and vulnerability handling; safety-first creative must not read as a price promotion.",
  },
  ev_growth: {
    objective: "Support Admiral's stated EV strength around switching moments and the March/September plate-change peaks.",
    changed_constraints: "Search, online video and social weighted up around EV-relevant and plate-change windows; contextual partnerships considered.",
    affected_channels: "Up: paid search, online video, paid social, contextual partnerships/content.",
    expected_brand_direction: "Reinforces perception of Admiral's EV leadership.",
    expected_sales_direction: "Higher EV-related quote starts expected around plate-change peaks.",
    key_risk: "Must explain EV cover accurately without greenwashing, and must not present estimated market share as a guarantee of future performance.",
  },
};
const LIVE_API_BASE = "https://ppl-planner-api-production.up.railway.app";

// Admiral planning taxonomy (research brief section 4). This groups each
// engine channel by MEDIA ROLE - reach vs consideration vs demand capture,
// etc - which is a different axis from the display-hierarchy CHANNEL_GROUPS
// further down (parent/child labelling like "AV" -> "TV / BVOD / Cinema").
// Distribution (PCW) deliberately has no engine channel here: it is measured
// and reported separately (plan.distribution_summary) rather than folded
// into the channel budget/media-mix chart, per the brief.
const CHANNEL_ROLE_GROUP_LABELS = {
  brand_reach: "Brand reach",
  video_consideration: "Video and consideration",
  demand_capture: "Demand capture",
  partnerships_content: "Partnerships and content",
  owned_activation: "Owned activation",
  distribution: "Distribution (PCW - reported separately from media)",
};
const CHANNEL_ROLE_GROUP = {
  "AV": "brand_reach",
  "OOH": "brand_reach",
  "Audio": "brand_reach",
  "CTV/YouTube": "video_consideration",
  "Display/Programmatic": "video_consideration",
  "Paid Search": "demand_capture",
  "Paid Social": "demand_capture",
  // Direct Mail isn't one of section 4's named examples; mapped here as the
  // closest addressable/CRM-adjacent analogue in this demo's 8-channel model.
  "Direct Mail": "owned_activation",
};

// Data-readiness groups (research brief section 4) - used to classify
// data/source_registry.json entries via each source's `readiness_group`
// field. Admin/registry-driven counts should read source_registry.json
// directly rather than hard-coding totals here.
const DATA_READINESS_GROUP_LABELS = {
  effectiveness_modelling: "Effectiveness & Modelling",
  quote_policy_renewal: "Quote, Policy & Renewal Performance",
  pcw_distribution: "PCW & Distribution Performance",
  customer_vehicle_audience: "Customer, Vehicle & Audience Data",
  pricing_risk_guardrails: "Pricing, Risk & Commercial Guardrails",
  plans_budgets_creative_approvals: "Plans, Budgets, Creative & Approvals",
  digital_crm_platform: "Digital, CRM & Platform Data",
  market_competitor_context: "Market, Competitor & Context Signals",
  media_owner_channel: "Media Owner & Channel Data",
};

// Plan Interrogation seed questions (research brief section 3) - a starting
// point for planners who aren't sure what to ask yet. Clicking one fills the
// question box and asks it straight away against whichever plan is selected.
const PLAN_INTERROGATION_SEED_QUESTIONS = [
  "Why is September weighted above August?",
  "Which evidence supports the paid-search share?",
  "How does the plan balance trust and demand capture?",
  "What changes if paid-search CPC rises 15%?",
  "Which guardrails are binding?",
];

// Plain-English boundary copy for the chat assistant (brief section 3): what
// it can explain from the configured plan evidence, and what it must refuse
// regardless of how the question is phrased. Written for a marketing
// approver to act on, not as technical confidence language.
const PLAN_INTERROGATION_BOUNDARY_COPY = "This assistant can explain the budget, channel and month choices already in the selected plan, using the sources and rationale stored against it. It will not use, reveal or guess at any customer-level data, individual risk or pricing/underwriting detail, and it will not make savings or 'cheapest price' claims. It also won't share confidential model or prompt details - if a question needs any of that, it will say so instead of guessing.";

const CALENDAR_FILTER_DEFS = [
  { key: "bank_holiday", label: "Bank holidays", color: "var(--blue)" },
  { key: "school_holiday", label: "School holidays", color: "var(--gold)" },
  { key: "sport", label: "Sport", color: "var(--green)" },
  { key: "weather", label: "Weather", color: "var(--amber)" },
  { key: "campaign", label: "Competitor campaigns", color: "var(--red-dark)" },
  { key: "manual", label: "Planner-added context", color: "var(--purple)" },
  { key: "other", label: "Other context", color: "var(--muted)" },
];

const logicChallenges = [
  {
    area: "Objective Function",
    title: "What is the plan really optimising?",
    body: "V1 balances new policy sales, cost per policy, CLV proxy and strategic audience weight. Admiral needs to confirm whether final optimisation is new policy sales, cost per policy, CLV-weighted value, quote-to-policy conversion or a blended score.",
    status: "big",
  },
  {
    area: "Scenario Logic",
    title: "Are Balanced Growth, Brand Trust Build and the other stored scenarios templates or freeform strategies?",
    body: "The prototype treats them as strategy weights. The final planner may need locked scenario templates, freeform prompts, or both with approval controls.",
    status: "big",
  },
  {
    area: "Evidence Standard",
    title: "What evidence is enough for sign-off?",
    body: "Every cell has named sources and rationale, but real confidence depends on Kanso, Roivenue, Redshift, Snowflake, Mosaic and ratecard quality.",
    status: "big",
  },
  {
    area: "Media Owner Depth",
    title: "How deep should the default UI go?",
    body: "The system stores owner/platform splits now, but the first view stays at channel/month level. We need to decide when planners drill down and when briefing forms take over.",
    status: "medium",
  },
  {
    area: "Revision Rules",
    title: "What can change once the year starts?",
    body: "V1 assumes future months can be revised while past months freeze. Real governance needs rules for budget movement, version history and approval.",
    status: "medium",
  },
  {
    area: "Agent Expansion",
    title: "Which agents earn their keep?",
    body: "V1 uses a light graph. Channel agents should be added only where specialist judgement materially improves the plan or rationale.",
    status: "medium",
  },
];

const agentNodes = [
  {
    name: "Brief Intake",
    type: "LLM + rules",
    body: "Validates required annual brief fields and asks once for missing essentials.",
  },
  {
    name: "Evidence Pack",
    type: "code",
    body: "Loads scoped budget, calendar, geo, BARB, benchmark and source context.",
  },
  {
    name: "Scenario Interpreter",
    type: "LLM",
    body: "Turns freeform strategy into weights and constraints.",
  },
  {
    name: "Deterministic Planner",
    type: "code",
    body: "Allocates budget, rescales totals, forecasts cost-per-policy ranges and validates arithmetic.",
  },
  {
    name: "Rationale Agent",
    type: "LLM",
    body: "Writes evidence-led explanations from structured plan rows.",
  },
  {
    name: "QA Agent",
    type: "LLM + rules",
    body: "Finds missing evidence, contradictions, low-confidence areas and risky assumptions.",
  },
  {
    name: "Approval",
    type: "state",
    body: "Tracks Admiral sign-off now, with room for finance or the media agency later.",
  },
  {
    name: "Future Channel Agents",
    type: "expandable",
    body: "AV, OOH, Search, Social, DM and MMM agents can be added when data depth justifies them.",
  },
];

const state = {
  plans: {},
  brief: null,
  sources: null,
  briefPriorities: null,
  enrichedCalendar: null,
  bankHolidays: null,
  curatedSportsEvents: null,
  compositeSchoolHolidays: null,
  competitorCampaignSignals: null,
  liveWeatherWarnings: null,
  calendarMonth: "2026-07",
  calendarFilters: { bank_holiday: true, school_holiday: true, sport: true, weather: true, campaign: true, manual: true, other: true },
  manualCalendarEvents: [],
  manualEventFormError: null,
  calendarOverviewAi: {},
  calendarGenerateStatus: null,
  weather: null,
  monthlyRevisionData: null,
  agentConfig: null,
  agentConfigOverrides: {},
  agentTraces: null,
  logicEval: null,
  planVersions: [],
  approvalEvents: [],
  approvalSelectedKey: null,
  currentApprovedVersionId: null,
  preferredScenario: null,
  baselinePlanId: null,
  baselineVersionId: null,
  baselinePlan: null,
  baselineBudgetTargets: null,
  generatedScenarios: [],
  scenarioProposal: null,
  scenarioGenerateStatus: null,
  scenarioDrilldown: null,
  scenarioDrilldownKey: null,
  scenarioDrilldownSelected: null,
  briefingDrafts: {},
  briefingDraftsMonthly: {},
  briefingFormMode: "annual",
  briefingFormMonth: null,
  sourceOverrides: {},
  logicFeedback: {},
  selectedRevisionMonth: "2026-07",
  revisionDraft: null,
  revisionPlanNames: {},
  monthlyRevisionContext: {},
  monthlyRevisionSubmissions: [],
  chatMessages: [],
  chatInterrogationKey: null,
  scenario: "balanced_growth",
  demoMode: "deterministic",
  tableMode: "budget",
  summaryChartMode: "monthly",
  selected: null,
  currentPlanTableMode: "budget",
  currentPlanSelected: null,
  annualUploadedPlan: null,
  annualChannelGrouping: null,
  annualCompleteness: null,
  annualBriefPreview: null,
  annualBriefFilename: null,
  annualGenerateStatus: "idle",
  annualGenerateError: null,
  viewingAs: "Admiral Planner",
  liveSources: null,
  liveSourcesLoading: false,
  liveSourcesError: null,
  dataSourceDictionary: null,
  syntheticFixture: null,
  dataReadinessExpanded: {},
  dataReadinessSourceExpanded: {},
  rolePeople: null,
  qaWarningOverrides: {},
  adminWarningsSelectedKey: null,
};

// Confirmed channel hierarchy (client-provided breakdown, 2026-07-22): 8
// parent groups, each with named leaf channels. The engine still only
// allocates budget at the old 8-channel granularity (CHANNEL_ORDER above),
// so each group's `rows` map its pictured leaf channels to whichever old
// engine channel actually backs them, with a `share` of that channel's
// real budget (defaults to 1 = the whole thing). Three old channels each
// had to cover two new leaves since the engine only produces one number
// for each - per client instruction, these are split an even 50/50 rather
// than assigning the whole number to one side and zeroing the other:
// CTV/YouTube -> AV's SVOD/CTV + Brand Digital's YouTube (50/50);
// Display/Programmatic -> Brand Digital's OLV/Display Upper + Performance
// Digital's Display & OLV Retargeting (50/50, also finally giving this
// channel a home instead of "Unmapped"); Direct Mail -> Mail's own line +
// Print's Inserts/Press Ads (50/50, Print's only budget line at all).
// This 50/50 split is a display convention, not a real measured split -
// the engine has no actual upper-funnel/retargeting or CTV/YouTube-only
// breakdown to draw on yet.
const CHANNEL_GROUPS = [
  {
    parent: "AV",
    rows: [
      { label: "TV / BVOD / Cinema", engineChannel: "AV", share: 1 },
      { label: "SVOD / CTV", engineChannel: "CTV/YouTube", share: 0.5 },
    ],
    note: "TV, BVOD and Cinema are not yet split within AV. SVOD/CTV is an even 50/50 display split of the CTV/YouTube channel total with Brand Digital's YouTube line below - the engine doesn't track these as separate budgets.",
  },
  {
    parent: "Brand Digital",
    rows: [
      { label: "YouTube", engineChannel: "CTV/YouTube", share: 0.5 },
      { label: "OLV / Display (Upper)", engineChannel: "Display/Programmatic", share: 0.5 },
    ],
    note: "YouTube is an even 50/50 display split of the CTV/YouTube channel total with AV's SVOD/CTV line above. OLV/Display (Upper) is an even 50/50 display split of the Display/Programmatic channel total with Performance Digital's Display & OLV Retargeting line below.",
  },
  {
    parent: "OOH",
    rows: [{ label: "OOH", engineChannel: "OOH", share: 1 }],
    note: null,
  },
  {
    parent: "Audio",
    rows: [{ label: "Radio / Digital Audio", engineChannel: "Audio", share: 1 }],
    note: "Radio and Digital Audio are not yet split.",
  },
  {
    parent: "Mail",
    rows: [{ label: "Door Drops / Direct Mail", engineChannel: "Direct Mail", share: 0.5 }],
    note: "Door Drops and Direct Mail are not yet split within this line. It's an even 50/50 display split of the Direct Mail channel total with Print below.",
  },
  {
    parent: "Print",
    rows: [{ label: "Inserts / Press Ads (Print Display)", engineChannel: "Direct Mail", share: 0.5 }],
    note: "An even 50/50 display split of the Direct Mail channel total with Mail above - the engine doesn't track Print as its own budget line.",
  },
  {
    parent: "Social",
    rows: [{ label: "Upper Funnel / Boosting / Conversion", engineChannel: "Paid Social", share: 1 }],
    note: "Upper funnel, boosting and conversion stages are not yet split.",
  },
  {
    parent: "Performance Digital",
    rows: [
      { label: "Search", engineChannel: "Paid Search", share: 1 },
      { label: "Display & OLV Retargeting", engineChannel: "Display/Programmatic", share: 0.5 },
    ],
    note: "Display & OLV Retargeting is an even 50/50 display split of the Display/Programmatic channel total with Brand Digital's OLV/Display (Upper) line above.",
  },
].map((group) => ({
  ...group,
  rows: group.rows.map((row) => ({ ...row, share: row.share ?? 1 })),
  sourceChannels: [...new Set(group.rows.map((row) => row.engineChannel).filter(Boolean))],
}));
const MAPPED_SOURCE_CHANNELS = new Set(CHANNEL_GROUPS.flatMap((g) => g.sourceChannels));


// Per PL_Weekly_Update_260626_v1.pdf "Proposed User Permissions" - the latest
// agreed scope, which supersedes the scope doc's PL/Channel-Heads/the7stars
// model. No visible switcher in this prototype - state.viewingAs is fixed to
// an Admin so the demo always shows full functionality. The role data and
// gating (currentRole/canGeneratePlans) stay wired up so that when real
// login exists, setting state.viewingAs to the logged-in person's name is
// all that's needed to get the right functionality for their role.
const ROLE_PEOPLE_DEFAULT = [
  { name: "Admiral Planner", org: "Admiral", role: "user" },
  { name: "Admiral Approver", org: "Admiral", role: "admin" },
  { name: "Media Agency Strategist", org: "Media Agency", role: "user" },
  { name: "Data Steward", org: "Admiral", role: "admin" },
  { name: "Read-only Viewer", org: "Admiral", role: "viewer" },
];
const ROLE_LABELS = { admin: "Admin", user: "User", viewer: "Viewer" };
state.rolePeople = ROLE_PEOPLE_DEFAULT.map((person) => ({ ...person }));

function currentRole() {
  const person = state.rolePeople.find((p) => p.name === state.viewingAs);
  return person ? person.role : "admin";
}

function canGeneratePlans() {
  return currentRole() !== "viewer";
}

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

// Cost-per-new-policy-sale figures need pence precision (£62.50, not £62 or
// £62.5) - the whole-pound `money` formatter above is for large budget totals.
const costPerPolicyMoney = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const number = new Intl.NumberFormat("en-GB");

function formatMonth(month) {
  return new Date(`${month}-01T00:00:00`).toLocaleString("en-GB", { month: "short" });
}

function sourceLabel(sourceId) {
  const source = state.sources?.sources?.find((item) => item.source_id === sourceId);
  return source ? source.name : sourceId;
}

function currentOrDefaultCalendarMonth() {
  const todayMonth = new Date().toISOString().slice(0, 7);
  return MONTHS.includes(todayMonth) ? todayMonth : MONTHS[0];
}

function formatDateShort(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function classifyEventType(eventType) {
  // event_type strings compose as "primary_and_secondary" (e.g.
  // "sport_and_school_holiday" is fundamentally a sport event with a school-
  // holiday side note) - so the category whose keyword appears earliest in
  // the string is the one this event should be grouped and tagged under.
  // categories still lists every matching category, so a filter toggle for
  // any of them keeps the event visible; only display picks one.
  const matches = CALENDAR_FILTER_DEFS
    .filter((filterDef) => filterDef.key !== "other")
    .map((filterDef) => ({ key: filterDef.key, index: eventType.indexOf(filterDef.key) }))
    .filter((match) => match.index !== -1)
    .sort((a, b) => a.index - b.index);
  if (!matches.length) return { categories: ["other"], primary: "other" };
  return { categories: matches.map((match) => match.key), primary: matches[0].key };
}

function categoryColor(category) {
  return CALENDAR_FILTER_DEFS.find((filterDef) => filterDef.key === category)?.color || "var(--muted)";
}

const CALENDAR_ALL_FILTERS_ON = Object.fromEntries(CALENDAR_FILTER_DEFS.map((filterDef) => [filterDef.key, true]));

// filters defaults to the Events Calendar page's own toggle state, but callers
// outside that page (e.g. Monthly Revision) should pass CALENDAR_ALL_FILTERS_ON
// explicitly - this list of "what's happening this month" shouldn't silently
// drop categories just because a planner left a filter switched off elsewhere.
function calendarItemsForMonth(monthStr, filters = state.calendarFilters) {
  const items = [];

  (state.bankHolidays?.holidays || []).forEach((holiday) => {
    if (!holiday.date.startsWith(monthStr) || !filters.bank_holiday) return;
    items.push({
      date: holiday.date,
      endDate: holiday.date,
      category: "bank_holiday",
      title: holiday.name,
      detail: `UK bank holiday (${holiday.nations.map((nation) => nation.replace(/_/g, " ")).join(", ")}).`,
      sourceIds: ["gov_uk_bank_holidays_2026"],
    });
  });

  (state.enrichedCalendar?.events || []).forEach((event) => {
    const classification = classifyEventType(event.event_type);
    const isActive = classification.categories.some((category) => filters[category]);
    if (!isActive) return;
    if (event.date_start > `${monthStr}-31` || event.date_end < `${monthStr}-01`) return;
    items.push({
      date: event.date_start,
      endDate: event.date_end,
      category: classification.primary,
      title: event.name,
      detail: event.planning_implication,
      confidence: event.confidence,
      sourceIds: event.source_ids,
    });
  });

  (state.curatedSportsEvents?.events || []).forEach((event) => {
    if (!filters.sport) return;
    if (event.date_start > `${monthStr}-31` || event.date_end < `${monthStr}-01`) return;
    items.push({
      date: event.date_start,
      endDate: event.date_end,
      category: "sport",
      title: event.name,
      detail: event.planning_implication,
      sourceIds: event.source_ids,
    });
  });

  (state.compositeSchoolHolidays?.holiday_windows || []).forEach((window) => {
    if (!filters.school_holiday) return;
    if (window.date_start > `${monthStr}-31` || window.date_end < `${monthStr}-01`) return;
    items.push({
      date: window.date_start,
      endDate: window.date_end,
      category: "school_holiday",
      title: window.name,
      detail: `Regions: ${window.regions.map((region) => region.replace(/_/g, " ")).join(", ")}.`,
      confidence: window.confidence,
      sourceIds: window.source_ids,
    });
  });

  const monthlyWeather = (state.weather?.monthly_averages || []).find((entry) => entry.month === monthStr);
  if (monthlyWeather && filters.weather && (monthlyWeather.temperature_band === "warm" || monthlyWeather.rainfall_band === "wet")) {
    const [year, month] = monthStr.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    const riskLabel = monthlyWeather.temperature_band === "warm"
      ? "Heat risk window (climate average)"
      : "Wet/storm risk window (climate average)";
    items.push({
      date: `${monthStr}-01`,
      endDate: `${monthStr}-${String(lastDay).padStart(2, "0")}`,
      category: "weather",
      title: riskLabel,
      detail: `${monthlyWeather.planning_read} Recommended: ${monthlyWeather.recommended_actions.join(", ")}. Long-term climate average, not a live forecast - a live near-term warnings feed is a separate future phase.`,
      sourceIds: monthlyWeather.source_ids,
    });
  }

  (state.liveWeatherWarnings?.warnings || []).forEach((warning) => {
    if (!filters.weather) return;
    const startDate = warning.valid_from_date || warning.issued_at?.slice(0, 10);
    const endDate = warning.valid_to_date || startDate;
    if (!startDate) return;
    if (startDate > `${monthStr}-31` || endDate < `${monthStr}-01`) return;
    const titleCase = (value) => value.charAt(0) + value.slice(1).toLowerCase();
    items.push({
      date: startDate,
      endDate,
      category: "weather",
      title: `${titleCase(warning.level)} warning: ${titleCase(warning.type)} (${warning.regions.join(", ")})`,
      detail: `Live Met Office warning, valid ${warning.valid_from_text} to ${warning.valid_to_text}. Covers: ${warning.areas.join(", ")}. This is a live warning, not the climate average used elsewhere on this calendar.`,
      sourceIds: ["met_office_live_warnings"],
      link: warning.link,
    });
  });

  (state.competitorCampaignSignals?.notable_campaigns || []).forEach((signal) => {
    if (!filters.campaign || !signal.published) return;
    const parsedDate = new Date(signal.published);
    if (Number.isNaN(parsedDate.getTime())) return;
    const dateStr = parsedDate.toISOString().slice(0, 10);
    if (!dateStr.startsWith(monthStr)) return;
    items.push({
      date: dateStr,
      endDate: dateStr,
      category: "campaign",
      title: signal.title,
      detail: `${signal.reason || ""}${signal.source ? ` (${signal.source})` : ""} Unverified news signal - worth a quick human glance, not a confirmed fact.`.trim(),
      sourceIds: ["competitor_campaign_news_monitor"],
      link: signal.link,
    });
  });

  // Planner-added events: manually entered context the tool has no
  // automated feed for (e.g. a streaming launch, a rate-card change) - see
  // conversation with the team, this is a form input, not a data source.
  (state.manualCalendarEvents || []).forEach((event) => {
    if (!filters.manual) return;
    if (event.date_start > `${monthStr}-31` || event.date_end < `${monthStr}-01`) return;
    items.push({
      date: event.date_start,
      endDate: event.date_end,
      category: "manual",
      title: event.name,
      detail: event.impact,
      sourceIds: [],
      manualEventId: event.id,
    });
  });

  return items;
}

function buildCalendarDays(monthStr, items) {
  const [year, month] = monthStr.split("-").map(Number);
  const firstWeekday = (new Date(`${monthStr}-01T00:00:00`).getDay() + 6) % 7;
  const totalDays = new Date(year, month, 0).getDate();
  const todayStr = new Date().toISOString().slice(0, 10);
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${monthStr}-${String(day).padStart(2, "0")}`;
    cells.push({
      date: dateStr,
      day,
      isToday: dateStr === todayStr,
      items: items.filter((item) => dateStr >= item.date && dateStr <= item.endDate),
    });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function renderCalendarOverviewGroups(monthItems) {
  const groups = CALENDAR_FILTER_DEFS
    .map((filterDef) => ({
      key: filterDef.key,
      label: filterDef.label,
      items: monthItems.filter((item) => item.category === filterDef.key),
    }))
    .filter((group) => group.items.length);

  if (!groups.length) {
    return `<p class="table-hint warning-text">No events match the active filters for this month.</p>`;
  }

  return groups.map((group) => `
    <div class="calendar-overview-group">
      <h4>${group.label}</h4>
      ${group.items.map((item) => `
        <div class="calendar-overview-item">
          <strong>${formatDateShort(item.date)}${item.date !== item.endDate ? ` – ${formatDateShort(item.endDate)}` : ""} · ${item.title}</strong>
          ${item.detail ? `<p>${item.detail}</p>` : ""}
          ${item.link ? `<p><a href="${item.link}" target="_blank" rel="noopener">Read source</a></p>` : ""}
          ${item.confidence ? `<div class="source-tags"><span class="source-tag">${item.confidence}</span></div>` : ""}
        </div>
      `).join("")}
    </div>
  `).join("");
}

function loadLocalJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function saveLocalJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function currentVersionId() {
  return `plan_version_${state.scenario}`;
}

function nowStamp() {
  return new Date().toISOString();
}

function planSummary(plan) {
  return {
    scenario_id: plan.scenario.scenario_id,
    scenario_label: plan.scenario.label,
    forecast_new_policy_sales: plan.forecast_new_policy_sales,
    forecast_cost_per_policy_gbp: plan.forecast_cost_per_policy_gbp,
    total_budget_gbp: plan.total_budget_gbp,
    status: plan.state_model?.status || "warning",
  };
}

function seedPlanVersions(plansByScenario) {
  const seeded = Object.values(plansByScenario).map((plan, index) => ({
    version_id: `plan_version_${plan.scenario.scenario_id}`,
    version_number: index + 1,
    plan_id: plan.plan_id,
    scenario_id: plan.scenario.scenario_id,
    label: `${plan.scenario.label} scenario`,
    created_at: "2026-06-26T00:00:00.000Z",
    created_by: "deterministic_planner",
    approval_status: "draft",
    change_summary: index === 0 ? "Baseline generated from brief, MMM extract and calendar assumptions." : `Scenario comparison generated for ${plan.scenario.label}.`,
    summary: planSummary(plan),
  }));
  const local = loadLocalJson("admiral_plan_versions", []);
  const merged = [...seeded];
  local.forEach((version) => {
    if (!merged.some((item) => item.version_id === version.version_id)) merged.push(version);
  });
  return merged;
}

function approvalEventsForVersion(versionId = currentVersionId()) {
  return state.approvalEvents.filter((event) => event.version_id === versionId);
}

function statusFromApprovalEvent(eventType) {
  if (eventType === "approved") return "approved";
  if (eventType === "returned") return "draft";
  return "review";
}

function applyApprovalStatusToVersions() {
  const latestEvents = state.approvalEvents.reduce((eventsByVersion, event) => {
    const current = eventsByVersion[event.version_id];
    if (!current || event.created_at > current.created_at) eventsByVersion[event.version_id] = event;
    return eventsByVersion;
  }, {});

  state.planVersions = state.planVersions.map((version) => {
    const latest = latestEvents[version.version_id];
    return latest
      ? { ...version, approval_status: statusFromApprovalEvent(latest.event_type), updated_at: latest.created_at }
      : version;
  });
}

function isFixtureVersionId(versionId) {
  return SCENARIOS.some((scenario) => versionId === `plan_version_${scenario}`);
}

function persistPlanVersions() {
  // Fixture versions are reconstructed fresh every load by seedPlanVersions(),
  // so only versions it wouldn't otherwise recreate need to survive a reload.
  saveLocalJson("admiral_plan_versions", state.planVersions.filter((version) => !isFixtureVersionId(version.version_id)));
}

// Every option chatInterrogationOptions() surfaces (the live baseline, a
// generated scenario, or one of the 6 fixture demo plans) needs a stable
// version_id to record approval events against. Live options already carry
// a real backend-issued version id; fixtures never got one from the API, so
// this falls back to the same synthetic id seedPlanVersions() gave them.
function approvalVersionId(option) {
  return option.versionId || `plan_version_${option.plan.scenario.scenario_id}`;
}

// Live plans (baseline/generated scenarios) don't automatically get a
// planVersions entry the way the 6 fixtures do at bootstrap - this lazily
// creates one the first time a plan is looked at on the Approval page, so
// approval events always have a version record to attach to.
function ensurePlanVersion(option) {
  const versionId = approvalVersionId(option);
  const existing = state.planVersions.find((version) => version.version_id === versionId);
  if (existing) return existing;
  const created = {
    version_id: versionId,
    version_number: state.planVersions.length + 1,
    plan_id: option.plan.plan_id,
    scenario_id: option.plan.scenario.scenario_id,
    label: option.label,
    created_at: nowStamp(),
    created_by: option.kind === "fixture" ? "deterministic_planner" : "planner_generated",
    approval_status: "draft",
    change_summary: option.kind === "fixture" ? "Demo fixture scenario." : "Live generated or uploaded plan.",
    summary: planSummary(option.plan),
  };
  state.planVersions = [...state.planVersions, created];
  persistPlanVersions();
  return created;
}

function recordApprovalEvent(versionId, type, comment = "") {
  const version = state.planVersions.find((item) => item.version_id === versionId);
  const event = {
    event_id: `approval_${Date.now()}`,
    version_id: versionId,
    plan_id: version?.plan_id || currentPlan().plan_id,
    scenario_id: version?.scenario_id || state.scenario,
    event_type: type,
    actor: state.viewingAs,
    role: ROLE_LABELS[currentRole()] || currentRole(),
    comment,
    created_at: nowStamp(),
  };
  state.approvalEvents = [event, ...state.approvalEvents];
  saveLocalJson("admiral_approval_events", state.approvalEvents);
  state.planVersions = state.planVersions.map((item) => item.version_id === event.version_id
    ? { ...item, approval_status: statusFromApprovalEvent(type), updated_at: event.created_at }
    : item);
  persistPlanVersions();
}

async function loadData() {
  const cacheBust = `v=${Date.now()}`;
  const load = (path) => fetch(`${path}?${cacheBust}`, { cache: "no-store" }).then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} for ${path}`);
    }
    return response.json();
  });
  const loadOptional = (path, fallback) => fetch(`${path}?${cacheBust}`, { cache: "no-store" })
    .then((response) => (response.ok ? response.json() : fallback))
    .catch(() => fallback);
  // The live-weather endpoint needs the FastAPI backend, which (unlike every
  // other file loaded here) might not be running - this must never block or
  // break the rest of the app's bootstrap, so it gets its own short timeout
  // and a silent fallback to null rather than joining the strict `load`s above.
  const loadOptionalFromApi = (path, fallback, timeoutMs = 5000) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(`${LIVE_API_BASE}${path}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : fallback))
      .catch(() => fallback)
      .finally(() => clearTimeout(timeout));
  };

  const [plans, brief, sources, briefPriorities, enrichedCalendar, bankHolidays, curatedSportsEvents, compositeSchoolHolidays, competitorCampaignSignals, liveWeatherWarnings, weather, monthlyRevisionData, agentConfig, agentTraces, logicEval, evidenceRules, dataSourceDictionary, syntheticFixture] = await Promise.all([
    Promise.all(SCENARIOS.map((scenario) => load(`../data/generated_plan_${scenario}.json`))),
    load("../data/annual_brief_2026.json"),
    load("../data/source_registry.json"),
    load("../data/brief_priorities_2026.json"),
    load("../data/admiral_enriched_calendar_2026.json"),
    load("../data/uk_bank_holidays_2026.json"),
    load("../data/uk_sports_events_2026.json"),
    load("../data/uk_school_holidays_2026.json"),
    loadOptional("../data/competitor_campaign_signals_2026.json", null),
    loadOptionalFromApi("/api/weather/live-warnings", null),
    load("../data/admiral_weather_intelligence_2026.json"),
    load("../data/monthly_revision_fixture_2026.json"),
    load("../data/agent_logic_config.json"),
    loadOptional("../data/agent_demo_traces.json", null),
    loadOptional("../output/evals/logic_option_eval_latest.json", null),
    load("../data/planning_evidence_rules_2026.json"),
    load("../data/data_source_dictionary.json"),
    load("../data/admiral_synthetic_fixture_2026.json"),
  ]);

  state.plans = Object.fromEntries(SCENARIOS.map((scenario, index) => [scenario, plans[index]]));
  state.brief = brief;
  state.sources = sources;
  state.evidenceRules = evidenceRules;
  state.dataSourceDictionary = dataSourceDictionary;
  state.syntheticFixture = syntheticFixture;
  state.channelGuardrailOverrides = loadLocalJson("admiral_channel_guardrail_overrides", {});
  state.briefPriorities = briefPriorities;
  state.enrichedCalendar = enrichedCalendar;
  state.bankHolidays = bankHolidays;
  state.curatedSportsEvents = curatedSportsEvents;
  state.compositeSchoolHolidays = compositeSchoolHolidays;
  state.competitorCampaignSignals = competitorCampaignSignals;
  state.liveWeatherWarnings = liveWeatherWarnings;
  state.calendarMonth = loadLocalJson("admiral_calendar_month", null) || currentOrDefaultCalendarMonth();
  state.calendarFilters = { ...state.calendarFilters, ...loadLocalJson("admiral_calendar_filters", {}) };
  state.calendarOverviewAi = loadLocalJson("admiral_calendar_overview_ai", {});
  state.manualCalendarEvents = loadLocalJson("admiral_manual_calendar_events", []);
  state.weather = weather;
  state.monthlyRevisionData = monthlyRevisionData;
  state.agentConfig = agentConfig;
  state.agentConfigOverrides = loadLocalJson("admiral_agent_config_overrides", {});
  state.agentTraces = agentTraces;
  state.logicEval = logicEval;
  state.planVersions = seedPlanVersions(state.plans);
  state.approvalEvents = loadLocalJson("admiral_approval_events", []);
  applyApprovalStatusToVersions();
  state.approvalSelectedKey = loadLocalJson("admiral_approval_selected_key", null);
  state.currentApprovedVersionId = loadLocalJson("admiral_current_approved_version_id", null);
  state.preferredScenario = loadLocalJson("admiral_preferred_scenario", null);
  // Scenario Centre state (baseline + generated scenarios) persists across
  // reloads like everything else here - a planner mid-way through comparing
  // several scenarios shouldn't lose that work to an accidental refresh.
  state.baselinePlanId = loadLocalJson("admiral_baseline_plan_id", null);
  state.baselineVersionId = loadLocalJson("admiral_baseline_version_id", null);
  state.baselinePlan = loadLocalJson("admiral_baseline_plan", null);
  state.baselineBudgetTargets = loadLocalJson("admiral_baseline_budget_targets", null);
  state.generatedScenarios = loadLocalJson("admiral_generated_scenarios", []);
  state.briefingDrafts = loadLocalJson("admiral_briefing_drafts", {});
  state.briefingDraftsMonthly = loadLocalJson("admiral_briefing_drafts_monthly", {});
  state.sourceOverrides = loadLocalJson("admiral_source_overrides", {});
  state.rolePeople = loadLocalJson("admiral_role_people", ROLE_PEOPLE_DEFAULT);
  state.qaWarningOverrides = loadLocalJson("admiral_qa_warning_overrides", {});
  state.adminWarningsSelectedKey = loadLocalJson("admiral_admin_warnings_selected_key", null);
  state.logicFeedback = loadLocalJson("admiral_logic_feedback", {});
  state.selectedRevisionMonth = loadLocalJson("admiral_selected_revision_month", "2026-07");
  // A persisted/default selection can point at a month that's no longer
  // eligible (e.g. it was current when last selected, but time has since
  // moved on) - fall back to the first eligible fixture month instead of
  // silently showing a revision the UI would no longer let you submit.
  if (!isRevisionMonthEligible(state.selectedRevisionMonth)) {
    const firstEligible = (state.monthlyRevisionData?.revision_months || []).find((item) => isRevisionMonthEligible(item.month));
    if (firstEligible) state.selectedRevisionMonth = firstEligible.month;
  }
  state.revisionDraft = loadLocalJson("admiral_revision_draft", null);
  state.revisionPlanNames = loadLocalJson("admiral_revision_plan_names", {});
  state.monthlyRevisionContext = loadLocalJson("admiral_monthly_revision_context", {});
  state.monthlyRevisionSubmissions = loadLocalJson("admiral_monthly_revision_submissions", []);
  state.chatMessages = loadLocalJson("admiral_plan_chat_messages_v2", []);
  state.chatInterrogationKey = loadLocalJson("admiral_chat_interrogation_key", null);
}

function currentPlan() {
  return state.annualUploadedPlan || state.plans[state.scenario];
}

function renderStatus() {
  const plan = currentPlan();
  const policySales = plan.channel_totals.reduce((sum, row) => sum + row.forecast_new_policy_sales, 0);
  const briefPassed = plan.brief_test?.clears_policy_sales_target && plan.brief_test?.clears_brief_cost_per_policy;
  const agentLive = state.agentTraces?.traces?.some((trace) => trace.mode === "live_llm");
  document.querySelector("#totalBudget").textContent = money.format(plan.total_budget_gbp);
  document.querySelector("#totalPolicySales").textContent = number.format(policySales);
  document.querySelector("#forecastCostPerPolicy").textContent = `${costPerPolicyMoney.format(plan.forecast_cost_per_policy_gbp)}`;
  document.querySelector("#budgetCheck").textContent = plan.qa.budget_balanced && plan.qa.months_balanced ? "Balanced" : "Needs review";
  document.querySelector("#briefTest").textContent = state.demoMode === "agent" ? (agentLive ? "Live agent" : "Agent fallback") : (briefPassed ? "Pass" : "Needs work");
}

function briefInputsStatus() {
  const hasBudget = document.querySelector("#budgetFileInput")?.files.length > 0;
  const hasBriefFile = document.querySelector("#briefFileInput")?.files.length > 0;
  const hasBriefText = document.querySelector("#briefTextContext")?.value.trim().length > 0;
  return { hasBudget, hasStrategy: hasBriefFile || hasBriefText };
}

function renderBrief() {
  const allowed = canGeneratePlans();
  document.querySelector("#uploadControls").style.display = allowed ? "" : "none";
  document.querySelector("#viewerRestrictedNotice").style.display = allowed ? "none" : "";
  const generateControls = document.querySelector("#generateControls");
  if (generateControls) generateControls.style.display = allowed ? "" : "none";

  // The pill is the single status indicator for Step 1 - no separate
  // instructional text underneath it. It's live (checks the actual file
  // inputs/textarea), not just the last generation's reported completeness,
  // and only reads "Complete" once both the budget and a strategy (brief
  // file or typed context) are present - budget alone is enough to
  // generate a plan, but not enough for Step 1 to read as done.
  const { hasBudget, hasStrategy } = briefInputsStatus();
  const providedCount = (hasBudget ? 1 : 0) + (hasStrategy ? 1 : 0);
  const pill = document.querySelector("#briefStatusPill");
  if (providedCount === 2) {
    pill.textContent = "Complete";
    pill.className = "status-pill good";
  } else if (providedCount === 1) {
    pill.textContent = "Partial";
    pill.className = "status-pill warning";
  } else {
    pill.textContent = "Awaiting upload";
    pill.className = "status-pill warning";
  }

  const checks = [
    ["Budget by month", hasBudget, "required"],
    ["Strategy (brief file or typed context)", hasStrategy, "required"],
  ];
  document.querySelector("#briefChecks").innerHTML = checks
    .map(([label, ok, kind]) => {
      const statusText = ok === null ? "known once generated" : (ok ? "provided" : kind);
      const dotClass = ok === null ? "unknown" : (ok ? "" : (kind === "required" ? "warning" : "unknown"));
      return `<li><span class="check-dot ${dotClass}"></span>${label} <span class="muted">(${statusText})</span></li>`;
    })
    .join("");

  const contextBox = document.querySelector("#briefContextBox");
  if (state.annualBriefPreview) {
    contextBox.style.display = "";
    const prefix = state.annualBriefFilename ? `${state.annualBriefFilename}: ` : "Typed context: ";
    document.querySelector("#briefTextPreview").textContent = `${prefix}${state.annualBriefPreview}`;
  } else {
    contextBox.style.display = "none";
  }
}

async function fetchLiveSources() {
  state.liveSourcesLoading = true;
  state.liveSourcesError = null;
  renderDataReadiness();
  try {
    const response = await fetch(`${LIVE_API_BASE}/api/sources`);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    state.liveSources = await response.json();
  } catch (error) {
    state.liveSourcesError = error.message;
  } finally {
    state.liveSourcesLoading = false;
    renderDataReadiness();
  }
}

function formatDate(isoString) {
  if (!isoString) return "Not tracked";
  return new Date(isoString).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function matchLiveSources(canonicalSource, liveSources) {
  const hints = [...(canonicalSource.match_hints || []), canonicalSource.name.toLowerCase().trim()];
  return liveSources.filter((live) => {
    const haystack = `${live.name} ${live.filename}`.toLowerCase();
    return hints.some((hint) => hint && haystack.includes(hint));
  });
}

// A canonical source's overall colour is the best (greenest) rag among its
// matched live datasets, since one strong live feed makes the source usable
// even if other documents behind it are stale - matches the per-source
// grouped-row dot logic used lower in renderDataReadiness().
function sourceEffectiveRag(source) {
  if (!source.matches.length) return "red";
  if (source.matches.some((l) => l.rag === "green")) return "green";
  if (source.matches.some((l) => l.rag === "amber")) return "amber";
  return "red";
}

function renderDataReadiness() {
  const wrap = document.querySelector("#dataReadinessTableWrap");
  if (!wrap) return;

  if (state.liveSourcesLoading && !state.liveSources) {
    wrap.innerHTML = `<p class="table-hint">Loading data sources…</p>`;
    return;
  }
  if (state.liveSourcesError) {
    wrap.innerHTML = `<p class="table-hint warning-text">Could not reach the live source registry (${state.liveSourcesError}). Is the API running at ${LIVE_API_BASE}?</p>`;
    return;
  }
  if (!state.liveSources) {
    wrap.innerHTML = `<p class="table-hint">No sources ingested yet.</p>`;
    return;
  }

  // Zero live sources in this environment's database looks, row for row,
  // identical to "this specific source hasn't been matched yet" - every
  // category shows all-red either way. Surfaced this distinctly after a
  // report that Railway's environment (a separate DB from local dev, never
  // populated by scripts/ingest_documents.py) showed every source as "not
  // yet connected" and read as a matching bug rather than an empty database.
  const emptyEnvironmentBanner = state.liveSources.length === 0
    ? `<p class="table-hint warning-text">This environment's database has 0 sources ingested (checked at ${LIVE_API_BASE}) - every row below will show "not yet connected" until <code>scripts/ingest_documents.py</code> is run against it. This is a data/ops gap, not a matching problem, if other environments show these as connected.</p>`
    : "";

  // The canonical list (all 33 known data sources, grouped by type) is the
  // client's own data dictionary, not just whatever happens to be ingested -
  // most rows will show as not yet connected, which is the honest picture.
  const categories = state.dataSourceDictionary.categories.map((category) => {
    const sources = category.sources.map((source) => ({
      ...source,
      matches: matchLiveSources(source, state.liveSources),
    }));
    return { ...category, sources, connectedCount: sources.filter((s) => s.matches.length).length };
  });

  // At-a-glance overall status, requested so a planner doesn't have to open
  // every category to gauge readiness - counts every canonical source once
  // by its best matched rag, and an overall dot that's only green when
  // everything is, only red when nothing is connected, amber otherwise.
  const allSources = categories.flatMap((c) => c.sources);
  const ragCounts = allSources.reduce(
    (acc, source) => {
      acc[sourceEffectiveRag(source)] += 1;
      return acc;
    },
    { green: 0, amber: 0, red: 0 }
  );
  const overallRag = ragCounts.green === allSources.length ? "green" : ragCounts.green + ragCounts.amber === 0 ? "red" : "amber";
  const overallSummary = `
    <div class="data-readiness-overall">
      <span class="rag-dot rag-${overallRag}"></span>
      <strong>${ragCounts.green + ragCounts.amber} of ${allSources.length} sources connected</strong>
      <span class="data-readiness-overall-breakdown">${ragCounts.green} green &middot; ${ragCounts.amber} amber &middot; ${ragCounts.red} red</span>
    </div>
  `;

  wrap.innerHTML = overallSummary + emptyEnvironmentBanner + categories.map((category) => {
    const expanded = !!state.dataReadinessExpanded[category.category_id];
    return `
      <div class="source-category ${expanded ? "expanded" : ""}">
        <button class="source-category-head" type="button" data-toggle-category="${category.category_id}">
          <span class="source-category-chevron">${expanded ? "▾" : "▸"}</span>
          <strong>${category.label}</strong>
          <span class="source-category-count">${category.connectedCount} of ${category.sources.length} connected</span>
        </button>
        ${expanded ? `
          <div class="source-table-wrap">
            <table class="source-table data-readiness-table">
              <thead><tr><th class="rag-col"></th><th>Source</th><th>Status</th><th>Last Updated</th></tr></thead>
              <tbody>
                ${category.sources.map((source) => {
                  if (!source.matches.length) {
                    return `
                      <tr>
                        <td class="rag-col"><span class="rag-dot rag-red" title="Not yet connected"></span></td>
                        <td><strong>${source.name}</strong>${source.description ? `<span>${source.description}</span>` : ""}</td>
                        <td>not yet connected</td>
                        <td>Not tracked</td>
                      </tr>
                    `;
                  }
                  // A single canonical source (e.g. Kanso) commonly matches
                  // several ingested datasets/documents - group those under
                  // one summary row with its own expand arrow, rather than
                  // always listing every dataset inline.
                  if (source.matches.length === 1) {
                    const live = source.matches[0];
                    return `
                      <tr>
                        <td class="rag-col"><span class="rag-dot rag-${live.rag}" title="${live.status}"></span></td>
                        <td><strong>${source.name}</strong><span>${live.filename}</span></td>
                        <td>${live.status.replace(/_/g, " ")}</td>
                        <td>${formatDate(live.last_updated)}</td>
                      </tr>
                    `;
                  }
                  const sourceKey = `${category.category_id}::${source.name}`;
                  const sourceExpanded = !!state.dataReadinessSourceExpanded[sourceKey];
                  const bestRag = sourceEffectiveRag(source);
                  const summaryRow = `
                    <tr class="source-group-row">
                      <td class="rag-col"><span class="rag-dot rag-${bestRag}"></span></td>
                      <td colspan="3">
                        <button class="source-group-toggle" type="button" data-toggle-source="${sourceKey}">
                          <span class="source-category-chevron">${sourceExpanded ? "▾" : "▸"}</span>
                          <strong>${source.name}</strong>
                          <span class="source-category-count">${source.matches.length} datasets connected</span>
                        </button>
                      </td>
                    </tr>
                  `;
                  const detailRows = sourceExpanded ? source.matches.map((live) => `
                    <tr class="source-group-detail">
                      <td class="rag-col"><span class="rag-dot rag-${live.rag}" title="${live.status}"></span></td>
                      <td><span>${live.filename}</span></td>
                      <td>${live.status.replace(/_/g, " ")}</td>
                      <td>${formatDate(live.last_updated)}</td>
                    </tr>
                  `).join("") : "";
                  return summaryRow + detailRows;
                }).join("")}
              </tbody>
            </table>
          </div>
        ` : ""}
      </div>
    `;
  }).join("");
}

function tableCellValue(row, share = 1) {
  if (state.tableMode === "cost_per_policy") return `${costPerPolicyMoney.format(row.forecast_cost_per_policy_gbp)}`;
  if (state.tableMode === "share") return `${Math.round(row.budget_share_pct * share * 100) / 100}%`;
  if (state.tableMode === "confidence") return "";
  return money.format(row.budget_gbp * share);
}

function tableChannelGroups() {
  // Same category -> sub-category grouping as the Annual Channel Summary
  // panel (agreed v1 channel granularity), applied here so the detailed
  // table reads as category-then-sub-category instead of a flat list.
  // Every leaf now has a real engineChannel (some shared 50/50 between two
  // groups, see CHANNEL_GROUPS comment), so there's no longer an
  // "Unmapped" catch-all needed here.
  return CHANNEL_GROUPS.map((group) => ({
    ...group,
    rows: group.rows.filter((row) => CHANNEL_ORDER.includes(row.engineChannel)),
  })).filter((group) => group.rows.length);
}

function renderTable() {
  const plan = currentPlan();
  const labelAndMonthsColumnCount = MONTHS.length + 1;
  const channelTotalMap = Object.fromEntries(plan.channel_totals.map((row) => [row.channel, row]));

  const rows = tableChannelGroups().map((group) => {
    const channelRows = group.rows.map((leafRow) => {
      const channel = leafRow.engineChannel;
      const share = leafRow.share;
      const cells = MONTHS.map((month) => {
        const row = plan.monthly_allocations.find((item) => item.month === month && item.channel === channel);
        const selected = state.selected?.month === month && state.selected?.channel === channel;
        const confidenceClass = state.tableMode === "confidence" ? `confidence-${row.confidence.replace(" ", "-")}` : "";
        const confidenceTitle = state.tableMode === "confidence" ? ` title="Confidence: ${row.confidence}"` : "";
        return `<td class="${selected ? "selected" : ""}">
          <button class="${confidenceClass}" type="button" data-month="${month}" data-channel="${channel}"${confidenceTitle}>
            ${tableCellValue(row, share)}
          </button>
        </td>`;
      }).join("");
      const channelTotal = channelTotalMap[channel];
      const rowLabel = share < 1 ? `${leafRow.label} <span class="table-hint">(50% of ${channel})</span>` : leafRow.label;
      return `<tr class="sub-category-row"><td title="${channel}">${rowLabel}</td>${cells}<td class="total-cell">${money.format(channelTotal.budget_gbp * share)}</td></tr>`;
    }).join("");

    const groupTotal = group.rows.reduce((sum, leafRow) => sum + channelTotalMap[leafRow.engineChannel].budget_gbp * leafRow.share, 0);
    return `<tr class="category-row"><td colspan="${labelAndMonthsColumnCount}">${group.parent}</td><td class="total-cell category-total">${money.format(groupTotal)}</td></tr>${channelRows}`;
  }).join("");

  // Answers "if I'm giving you this budget, how are you optimising that by
  // month?" directly in the table, rather than only as a single annual
  // figure elsewhere on the page - always shows budget £ regardless of
  // the current Budget/Cost per Policy/Confidence/Share % toggle, since
  // summing a cost-per-policy figure or a confidence label across channels
  // isn't meaningful.
  const monthTotals = MONTHS.map((month) =>
    plan.monthly_allocations.filter((item) => item.month === month).reduce((sum, item) => sum + item.budget_gbp, 0)
  );

  document.querySelector("#planTable").innerHTML = `
    <thead>
      <tr>
        <th>Category / Channel</th>
        ${MONTHS.map((month) => `<th>${formatMonth(month)}</th>`).join("")}
        <th>Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr class="table-total-row">
        <td>Total (Budget)</td>
        ${monthTotals.map((total) => `<td class="total-cell">${money.format(total)}</td>`).join("")}
        <td class="total-cell grand-total">${money.format(plan.total_budget_gbp)}</td>
      </tr>
    </tfoot>
  `;
}

function groupChannelTotals(channelTotals) {
  const byChannel = Object.fromEntries(channelTotals.map((row) => [row.channel, row]));
  // Groups with no backing engine channel yet still appear, at £0, rather
  // than being silently dropped - the confirmed channel hierarchy is shown
  // in full even where the engine has no data behind a group yet. Where a
  // row's engine channel is shared with another group's row (see
  // CHANNEL_GROUPS comment), `share` scales its contribution so the two
  // groups split that channel's real total rather than double-counting it.
  const groups = CHANNEL_GROUPS.map((group) => {
    const members = group.rows
      .filter((row) => row.engineChannel && byChannel[row.engineChannel])
      .map((row) => {
        const source = byChannel[row.engineChannel];
        return {
          channel: row.engineChannel,
          label: row.label,
          share: row.share,
          budget_gbp: source.budget_gbp * row.share,
          forecast_new_policy_sales: source.forecast_new_policy_sales * row.share,
        };
      });
    return {
      parent: group.parent,
      note: group.note,
      budget_gbp: members.reduce((sum, m) => sum + m.budget_gbp, 0),
      forecast_new_policy_sales: members.reduce((sum, m) => sum + m.forecast_new_policy_sales, 0),
      members,
    };
  });
  const unmapped = channelTotals.filter((row) => !MAPPED_SOURCE_CHANNELS.has(row.channel));
  return { groups, unmapped };
}

function summaryChartRows(channelTotals) {
  const { groups, unmapped } = groupChannelTotals(channelTotals);
  const rows = groups.map((g) => ({ label: g.parent, spend: g.budget_gbp, policySales: g.forecast_new_policy_sales, note: g.note }));
  unmapped.forEach((u) => rows.push({
    label: u.channel,
    spend: u.budget_gbp,
    policySales: u.forecast_new_policy_sales,
    note: "Unmapped: not yet placed in the v1 channel granularity, flagged rather than dropped.",
    unmapped: true,
  }));
  return rows.sort((a, b) => b.spend - a.spend);
}

function renderBubbleChart(plan) {
  const rows = summaryChartRows(plan.channel_totals);

  const labelWidth = 190;
  const rightPadding = 56;
  const chartWidth = 700;
  const viewBoxWidth = labelWidth + chartWidth + rightPadding;
  const rowHeight = 56;
  const topPadding = 14;
  const axisHeight = 30;
  const viewBoxHeight = topPadding + rows.length * rowHeight + axisHeight;

  const maxSpend = Math.max(...rows.map((r) => r.spend)) * 1.1;
  const maxAcq = Math.max(...rows.map((r) => r.policySales));
  const minR = 8;
  const maxR = 26;

  const xScale = (value) => labelWidth + (value / maxSpend) * chartWidth;
  const rScale = (value) => minR + Math.sqrt(value / maxAcq) * (maxR - minR);

  const axisY = topPadding + rows.length * rowHeight + 2;
  const tickValues = Array.from({ length: 5 }, (_, i) => (maxSpend * i) / 4);

  const rowEls = rows.map((row, i) => {
    const y = topPadding + i * rowHeight + rowHeight / 2;
    const x = xScale(row.spend);
    const r = rScale(row.policySales);
    const tooltip = `${row.label}: ${money.format(row.spend)} annual spend, ${number.format(row.policySales)} forecast new policy sales.${row.note ? " " + row.note : ""}`;
    return `
      <g>
        <line x1="${labelWidth}" y1="${y}" x2="${viewBoxWidth - rightPadding}" y2="${y}" class="bubble-guide" />
        <text x="${labelWidth - 12}" y="${y}" class="bubble-label" text-anchor="end" dominant-baseline="middle">${row.label}</text>
        <circle cx="${x}" cy="${y}" r="${r}" class="bubble-dot${row.unmapped ? " unmapped" : ""}"><title>${tooltip}</title></circle>
        <text x="${x + r + 8}" y="${y}" class="bubble-value" dominant-baseline="middle">${number.format(row.policySales)}</text>
      </g>
    `;
  }).join("");

  const axisEls = tickValues.map((tick) => {
    const x = xScale(tick);
    return `
      <line x1="${x}" y1="${topPadding - 6}" x2="${x}" y2="${axisY}" class="bubble-axis-grid" />
      <text x="${x}" y="${axisY + 16}" class="bubble-axis-label" text-anchor="middle">${money.format(tick)}</text>
    `;
  }).join("");

  return `
    <p class="table-hint">Bubble position (left to right) shows annual spend. Bubble size shows forecast new policy sales. Hover a bubble for exact figures.</p>
    <svg viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" class="bubble-chart" role="img" aria-label="Annual spend and forecast new policy sales by channel">
      ${rowEls}
      ${axisEls}
    </svg>
  `;
}

// Colour-per-group palette for the monthly stacked bar, reusing the brand
// palette from styles.css :root so this chart matches the rest of the app;
// a separate grey covers "Unmapped" (channels not yet placed in the v1
// channel granularity - currently always Display/Programmatic).
const SUMMARY_CHART_COLORS = ["#e30027", "#005fb8", "#49a300", "#f7941d", "#9e001b", "#6b5ca5", "#f9b000", "#1f8a8a"];
const SUMMARY_CHART_UNMAPPED_COLOR = "#8a94a6";

function monthlyStackedBarSeries(plan) {
  const { groups, unmapped } = groupChannelTotals(plan.channel_totals);
  const series = groups.map((g, i) => ({
    label: g.parent,
    rows: CHANNEL_GROUPS.find((cg) => cg.parent === g.parent).rows.filter((row) => row.engineChannel),
    color: SUMMARY_CHART_COLORS[i % SUMMARY_CHART_COLORS.length],
  }));
  if (unmapped.length) {
    series.push({ label: "Unmapped", rows: unmapped.map((u) => ({ engineChannel: u.channel, share: 1 })), color: SUMMARY_CHART_UNMAPPED_COLOR });
  }
  return series;
}

function renderMonthlyStackedBar(plan) {
  const series = monthlyStackedBarSeries(plan);
  const monthData = MONTHS.map((month) => {
    // A row's `share` scales its contribution when its engine channel is
    // split across two groups (see CHANNEL_GROUPS comment) - without this,
    // a split channel's monthly budget would be double-counted across
    // both groups' bars instead of split 50/50 between them.
    const values = series.map((s) =>
      s.rows.reduce((sum, row) => {
        const allocation = plan.monthly_allocations.find((item) => item.month === month && item.channel === row.engineChannel);
        return sum + (allocation ? allocation.budget_gbp * row.share : 0);
      }, 0)
    );
    return { month, values, total: values.reduce((a, b) => a + b, 0) };
  });

  const leftMargin = 64;
  const rightPadding = 16;
  const topPadding = 16;
  const chartHeight = 260;
  const axisHeight = 30;
  const viewBoxWidth = 900;
  const viewBoxHeight = topPadding + chartHeight + axisHeight;
  const plotWidth = viewBoxWidth - leftMargin - rightPadding;
  const slot = plotWidth / MONTHS.length;
  const barWidth = slot * 0.62;

  const maxTotal = Math.max(...monthData.map((m) => m.total)) * 1.08 || 1;
  const yScale = (value) => (value / maxTotal) * chartHeight;

  const tickValues = Array.from({ length: 5 }, (_, i) => (maxTotal * i) / 4);
  const axisEls = tickValues.map((tick) => {
    const y = topPadding + chartHeight - yScale(tick);
    return `
      <line x1="${leftMargin}" y1="${y}" x2="${viewBoxWidth - rightPadding}" y2="${y}" class="bar-axis-grid" />
      <text x="${leftMargin - 8}" y="${y}" class="bar-axis-label" text-anchor="end" dominant-baseline="middle">${money.format(tick)}</text>
    `;
  }).join("");

  const barEls = monthData.map((m, i) => {
    const x = leftMargin + i * slot + (slot - barWidth) / 2;
    let cursorY = topPadding + chartHeight;
    const segments = m.values.map((value, si) => {
      if (!value) return "";
      const h = yScale(value);
      cursorY -= h;
      const pct = m.total ? Math.round((value / m.total) * 100) : 0;
      const tooltip = `${series[si].label}, ${formatMonth(m.month)}: ${money.format(value)} (${pct}% of that month's budget)`;
      return `<rect x="${x}" y="${cursorY}" width="${barWidth}" height="${h}" fill="${series[si].color}"><title>${tooltip}</title></rect>`;
    }).join("");
    return `
      <g>
        ${segments}
        <text x="${x + barWidth / 2}" y="${topPadding + chartHeight + 18}" class="bar-axis-label" text-anchor="middle">${formatMonth(m.month)}</text>
      </g>
    `;
  }).join("");

  const legendEls = series.map((s) => `<span><i style="background:${s.color}"></i>${s.label}</span>`).join("");

  return `
    <p class="table-hint">Each bar is one month's total budget, split by channel group. Hover a segment for exact spend and share.</p>
    <svg viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" class="stacked-bar-chart" role="img" aria-label="Monthly budget split by channel group">
      ${axisEls}
      ${barEls}
    </svg>
    <div class="bar-legend">${legendEls}</div>
  `;
}

function renderSummary() {
  const plan = currentPlan();
  document.querySelector("#channelSummary").innerHTML = state.summaryChartMode === "monthly"
    ? renderMonthlyStackedBar(plan)
    : renderBubbleChart(plan);
  document.querySelectorAll("#summaryChartToggle .toggle").forEach((button) => {
    button.classList.toggle("active", button.dataset.summaryChartMode === state.summaryChartMode);
  });
}

// Plain-English glossary for the response-curve-provenance fields, since
// "MMM point"/"external shape prior"/"soft saturation" etc. are internal
// the7stars modelling shorthand that a client-side viewer won't know.
const CURVE_PROVENANCE_GLOSSARY = {
  "Type": "The shape of this channel's diminishing-returns curve (e.g. how quickly extra spend stops paying back as well).",
  "Anchor": "What kind of evidence this curve is pinned to - a real data point, a benchmark, or a planning assumption.",
  "MMM point": "The data point taken from Marketing Mix Modelling (MMM) - our statistical read of how this channel has actually performed historically.",
  "External shape": "A benchmark curve shape from outside data (e.g. industry studies), used to fill in where our own MMM data is thin.",
  "Conflict status": "Whether the MMM data and the external benchmark agree on this channel's shape, or point in different directions.",
  "Soft saturation": "The monthly spend level above which this channel's returns start to taper off noticeably.",
  "Carryover prior": "How many weeks a burst of spend keeps having an effect (adstock/carryover), before it fades out.",
};

function curveProvenanceField(label, value) {
  const help = CURVE_PROVENANCE_GLOSSARY[label] || "";
  return `<div><dt title="${help}">${label}</dt><dd>${value}</dd></div>`;
}

// If a channel is one of the three split 50/50 across two groups in the
// plan table (see CHANNEL_GROUPS comment), the Evidence Inspector shows the
// channel's real, unhalved total - flag that so it doesn't look
// inconsistent with the halved number shown in the table cell clicked.
function splitChannelNoteHtml(channel) {
  const splitRows = CHANNEL_GROUPS.flatMap((group) => group.rows.filter((r) => r.engineChannel === channel && r.share < 1).map((r) => ({ group: group.parent, label: r.label })));
  return splitRows.length
    ? `<p class="table-hint">This is the real, full ${channel} total. The plan table splits it 50/50 for display between ${splitRows.map((s) => `${s.group} (${s.label})`).join(" and ")}.</p>`
    : "";
}

function renderEvidence() {
  const target = state.selected;
  const inspector = document.querySelector("#evidenceInspector");
  const label = document.querySelector("#selectedCellLabel");

  if (!target) {
    label.textContent = "No cell selected";
    inspector.className = "empty-state";
    inspector.textContent = "Select a month/channel cell to see the rationale.";
    return;
  }

  const plan = currentPlan();
  const row = plan.monthly_allocations.find((item) => item.month === target.month && item.channel === target.channel);
  const channelTotal = plan.channel_totals.find((item) => item.channel === target.channel);
  const curve = row.response_curve;
  label.textContent = `${formatMonth(target.month)} / ${target.channel}`;
  inspector.className = "evidence-block";
  inspector.innerHTML = `
    ${splitChannelNoteHtml(target.channel)}
    <div class="evidence-metrics">
      <div class="metric"><span>Monthly Budget</span><strong>${money.format(row.budget_gbp)}</strong></div>
      <div class="metric"><span>Annual Channel Budget</span><strong>${channelTotal ? money.format(channelTotal.budget_gbp) : "Not available"}</strong></div>
      <div class="metric"><span>% of Monthly Spend</span><strong>${row.budget_share_pct}%</strong></div>
      <div class="metric"><span>Forecast Cost per Policy</span><strong>${costPerPolicyMoney.format(row.forecast_cost_per_policy_gbp)}</strong></div>
      <div class="metric"><span>Confidence</span><strong class="confidence-${row.confidence.replace(" ", "-")}">${row.confidence}</strong></div>
    </div>
    <div>
      <strong>Rationale</strong>
      <p class="table-hint">${row.rationale}</p>
    </div>
    ${curve ? `
      <div class="curve-provenance">
        <div class="curve-heading">
          <strong>Response curve provenance</strong>
          <span class="source-tag">${curve.confidence}</span>
        </div>
        <p class="table-hint">Where this channel's diminishing-returns curve came from, and how confident we are in it. Hover any label below for a plain-English explanation.</p>
        <dl>
          ${curveProvenanceField("Type", curve.curve_type)}
          ${curveProvenanceField("Anchor", curve.classification)}
          ${curveProvenanceField("MMM point", curve.mmm_anchor)}
          ${curveProvenanceField("External shape", curve.external_shape_prior)}
          ${curveProvenanceField("Conflict status", `${curve.agree_conflict}: ${curve.conflict_note}`)}
          ${curveProvenanceField("Soft saturation", `${money.format(curve.soft_saturation_threshold_monthly_gbp)} monthly`)}
          ${curveProvenanceField("Carryover prior", curve.adstock_half_life_weeks)}
        </dl>
      </div>
    ` : ""}
    <div>
      <strong>Brief hooks</strong>
      <div class="source-tags">${(row.brief_hooks || []).map((hook) => `<span class="source-tag">${hook}</span>`).join("")}</div>
    </div>
    <div>
      <strong>Sources</strong>
      <div class="source-tags">${row.source_ids.map((id) => `<span class="source-tag" title="${sourceLabel(id)}">${id}</span>`).join("")}</div>
    </div>
  `;
}

function renderLogicChallenges() {
  const logicEval = state.logicEval;
  const harness = document.querySelector("#logicHarness");
  if (logicEval) {
    const feasibility = logicEval.feasibility;
    const rankedOptions = (logicEval.ranked_options || []).map((option) => {
      const feedback = state.logicFeedback[option.logic_id] || { useful: 0, risky: 0 };
      const adjustedScore = Math.max(0, Math.min(100, Number(option.score) + (feedback.useful * 2) - (feedback.risky * 3)));
      return { ...option, feedback, adjustedScore };
    }).sort((a, b) => b.adjustedScore - a.adjustedScore);
    const top = rankedOptions[0];
    harness.innerHTML = `
      <div class="logic-eval-summary">
        <div>
          <span>Target feasibility</span>
          <strong>${feasibility.feasibility_state.replaceAll("_", " ")}</strong>
          <p>${feasibility.explanation}</p>
        </div>
        <div>
          <span>Best achievable forecast</span>
          <strong>${number.format(feasibility.best_new_policy_sales)} at ${costPerPolicyMoney.format(feasibility.best_cost_per_policy_gbp)}</strong>
          <p>Gap: ${number.format(feasibility.policy_sales_gap)} new policy sales and £${feasibility.cost_per_policy_gap_gbp} cost per policy.</p>
        </div>
        <div>
          <span>Current top logic</span>
          <strong>${top?.label || "No option ranked"}</strong>
          <p>${top ? `Adjusted score ${top.adjustedScore}. ${top.hypothesis}` : "Run the logic option evaluator to rank options."}</p>
        </div>
      </div>
      <div class="logic-score-grid">
        ${Object.entries(logicEval.component_scores || {}).map(([label, score]) => `
          <div>
            <span>${label.replaceAll("_", " ")}</span>
            <strong>${score}</strong>
          </div>
        `).join("")}
      </div>
      <div class="logic-option-grid">
        ${rankedOptions.map((option, index) => `
          <div class="logic-option-card ${index === 0 ? "best" : ""}" data-logic-option="${option.logic_id}">
            <div class="scenario-card-head">
              <strong>${option.label}</strong>
              <span class="status-pill ${index === 0 ? "good" : "warning"}">${option.adjustedScore}</span>
            </div>
            <p>${option.hypothesis}</p>
            <div class="source-tags">
              <span class="source-tag">${option.planning_posture}</span>
              <span class="source-tag">base ${option.score}</span>
              <span class="source-tag">useful ${option.feedback.useful}</span>
              <span class="source-tag">risky ${option.feedback.risky}</span>
              ${(option.bonuses || []).slice(0, 1).map((bonus) => `<span class="source-tag">${bonus}</span>`).join("")}
              ${(option.penalties || []).slice(0, 1).map((penalty) => `<span class="source-tag">${penalty}</span>`).join("")}
            </div>
            <div class="logic-feedback-actions">
              <button class="secondary-button" type="button" data-logic-feedback="useful">Useful</button>
              <button class="secondary-button" type="button" data-logic-feedback="risky">Risky</button>
              <button class="secondary-button" type="button" data-logic-feedback="reset">Reset</button>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="browser-flow-grid">
        ${(logicEval.browser_test_flows || []).map((flow) => `
          <div>
            <strong>${flow.label}</strong>
            <ol>${flow.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
          </div>
        `).join("")}
      </div>
      <div class="logic-warning-strip">
        ${(logicEval.warnings || []).slice(0, 4).map((warning) => `<span>${warning}</span>`).join("") || "<span>No logic harness warnings.</span>"}
      </div>
    `;
  } else {
    harness.innerHTML = `
      <div class="empty-state">
        Run <code>python3 scripts/evaluate_logic_options.py</code> to create ranked logic options and browser-flow checks.
      </div>
    `;
  }

  const priorityChallenges = (state.briefPriorities?.planning_priorities || []).map((priority) => ({
    area: "Brief Priority",
    title: priority.label,
    body: priority.brief_text_summary,
    status: ["april_december_tentpoles", "greater_london_growth", "channel_role_clarity"].includes(priority.priority_id) ? "big" : "medium",
  }));

  document.querySelector("#logicChallenges").innerHTML = [...logicChallenges, ...priorityChallenges]
    .map((item) => `
      <div class="challenge-row">
        <strong>${item.area}</strong>
        <div>
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </div>
        <span class="challenge-status ${item.status}">${item.status === "big" ? "Big choice" : "Workshop question"}</span>
      </div>
    `)
    .join("");
}

function renderArchitecture() {
  renderAgentModeSummary();
  renderAgentConfigurator();
  document.querySelector("#agentFlow").innerHTML = agentNodes
    .map((node) => `
      <div class="agent-node">
        <b>${node.type}</b>
        <h2>${node.name}</h2>
        <p>${node.body}</p>
      </div>
    `)
    .join("");
}

function renderAgentModeSummary() {
  const traceSet = state.agentTraces;
  const traces = traceSet?.traces || [];
  const liveCount = traces.filter((trace) => trace.mode === "live_llm").length;
  const modeCopy = state.demoMode === "agent"
    ? "Agent mode is active. The LLM layer can explain, critique and ask questions against the stored plan object."
    : "Deterministic mode is active. The plan object owns budget, forecasts, source IDs, state and approval truth.";
  document.querySelector("#agentModeSummary").innerHTML = `
    <div class="mode-card ${state.demoMode === "agent" ? "agent-on" : ""}">
      <strong>${state.demoMode === "agent" ? "Experimental LLM agent demo" : "Deterministic planner demo"}</strong>
      <p>${modeCopy}</p>
      <div class="source-tags">
        <span class="source-tag">${liveCount} live LLM traces</span>
        <span class="source-tag">${traces.length - liveCount} structured fallback traces</span>
        <span class="source-tag">${traceSet?.prompt_version || traces[0]?.prompt_version || "prompt contract ready"}</span>
      </div>
    </div>
    <div class="guardrail-list">
      ${(traceSet?.one_way_door_guards || [
        "LLM agents cannot mutate numeric state",
        "Suggested changes require deterministic re-planning",
        "Warnings are terminal and must not loop",
      ]).map((guard) => `<div><i data-lucide="lock"></i><span>${guard}</span></div>`).join("")}
    </div>
  `;

  document.querySelector("#agentTracePanel").innerHTML = traces.length ? traces.map((trace) => `
    <div class="agent-trace-card">
      <div class="scenario-card-head">
        <strong>${trace.agent_id.replaceAll("_", " ")}</strong>
        <span class="status-pill ${trace.status === "complete" ? "good" : "warning"}">${trace.mode}</span>
      </div>
      <p>${trace.summary}</p>
      <div class="agent-findings">
        ${(trace.findings || []).slice(0, 4).map((finding) => `
          <div>
            <span>${finding.type} / ${finding.source_status}</span>
            <strong>${finding.title}</strong>
            <p>${finding.detail}</p>
            <div class="source-tags">${(finding.source_ids || []).map((id) => `<span class="source-tag">${id}</span>`).join("")}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("") : `
    <div class="empty-state">Run <code>python3 scripts/run_agent_demo.py balanced_growth</code> to create live or fallback agent traces.</div>
  `;
}

function currentAgentConfig(agent) {
  return { ...agent, ...(state.agentConfigOverrides[agent.agent_id] || {}) };
}

function renderAgentConfigurator() {
  const agents = state.agentConfig?.agents || [];
  document.querySelector("#agentLogicConfigurator").innerHTML = agents.map((agent) => {
    const config = currentAgentConfig(agent);
    const unsafe = /budget|approval|state/i.test(config.owns) && !/explain|critique|asks|turns/i.test(config.owns);
    return `
      <div class="agent-config-card ${unsafe ? "unsafe" : ""}" data-agent-config="${agent.agent_id}">
        <div class="scenario-card-head">
          <strong>${agent.label}</strong>
          <span class="status-pill ${unsafe ? "warning" : "good"}">${agent.mode}</span>
        </div>
        <label class="field-label" for="owns-${agent.agent_id}">Owns</label>
        <textarea id="owns-${agent.agent_id}" rows="3" data-config-field="owns">${config.owns}</textarea>
        <label class="field-label" for="must-${agent.agent_id}">Must not do</label>
        <textarea id="must-${agent.agent_id}" rows="3" data-config-field="must_not">${config.must_not}</textarea>
        <div class="config-controls">
          <label>
            <span>Max findings</span>
            <input type="number" min="1" max="8" value="${config.max_findings}" data-config-field="max_findings" />
          </label>
          <label>
            <span>Detail words</span>
            <input type="number" min="15" max="80" value="${config.detail_word_limit}" data-config-field="detail_word_limit" />
          </label>
        </div>
        <div class="config-preview">
          <strong>Inputs</strong>
          <div class="source-tags">${config.input_objects.map((item) => `<span class="source-tag">${item}</span>`).join("")}</div>
          <strong>Eval checks</strong>
          <div class="source-tags">${config.eval_checks.map((item) => `<span class="source-tag">${item}</span>`).join("")}</div>
        </div>
        <div class="config-actions">
          <button type="button" class="secondary-button" data-config-action="save">Save local config</button>
          <button type="button" class="secondary-button" data-config-action="reset">Reset</button>
        </div>
        <p class="table-hint">${unsafe ? "Review this config: it may be granting too much ownership." : "Config keeps the agent inside the non-authoritative reasoning layer."}</p>
      </div>
    `;
  }).join("");
}

function scenarioDelta(plan, baseline, channel) {
  const row = plan.channel_totals.find((item) => item.channel === channel);
  const baseRow = baseline.channel_totals.find((item) => item.channel === channel);
  return (row?.budget_gbp || 0) - (baseRow?.budget_gbp || 0);
}

async function generateStoredScenario(scenarioId, label) {
  if (!state.baselineVersionId) return;
  state.scenarioGenerateStatus = `Generating ${label}…`;
  renderScenarioComparison();
  try {
    const response = await fetch(`${LIVE_API_BASE}/api/scenario/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version_id: state.baselineVersionId, label, stored_scenario_id: scenarioId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || `${response.status} ${response.statusText}`);
    addGeneratedScenario({ plan: data.plan, stored: data.stored });
    state.scenarioGenerateStatus = null;
  } catch (error) {
    state.scenarioGenerateStatus = `Could not generate ${label}: ${error.message}`;
  }
  renderScenarioComparison();
}

async function proposeScenarioFromText() {
  const text = document.querySelector("#scenarioFreeText")?.value.trim();
  if (!text) return;
  state.scenarioGenerateStatus = "Preparing proposed scenario… this can take a few seconds.";
  renderScenarioComparison();
  try {
    const response = await fetch(`${LIVE_API_BASE}/api/scenario/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freeform_prompt: text }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || `${response.status} ${response.statusText}`);
    state.scenarioProposal = { label: "Custom scenario", config: data.scenario_config, rationale: data.rationale };
    state.scenarioGenerateStatus = null;
  } catch (error) {
    state.scenarioGenerateStatus = `Could not propose a scenario: ${error.message}`;
  }
  renderScenarioComparison();
}

async function generateProposedScenario() {
  if (!state.scenarioProposal || !state.baselineVersionId) return;
  const label = document.querySelector("#proposalLabel")?.value.trim() || state.scenarioProposal.label;
  const weights = {
    regional_audience: Number(document.querySelector("#proposalRegional")?.value),
    urban_growth_audience: Number(document.querySelector("#proposalGrowth")?.value),
    reach_channels: Number(document.querySelector("#proposalReach")?.value),
    performance_channels: Number(document.querySelector("#proposalPerformance")?.value),
    test_budget: Number(document.querySelector("#proposalTest")?.value),
  };
  const forecastCpaFactor = Number(document.querySelector("#proposalCpaFactor")?.value) || 1.0;

  // Same "only send what differs from neutral" filtering as Step 2's own
  // guardrail table (renderChannelGuardrails) - keeps the scenario config
  // free of redundant entries for channels the planner didn't touch.
  const channelFloors = {};
  const channelCaps = {};
  const channelIndex = {};
  const channelMultipliers = {};
  document.querySelectorAll("#scenarioProposalReview [data-proposal-channel]").forEach((input) => {
    const channel = input.dataset.proposalChannel;
    const field = input.dataset.proposalField;
    const value = Number(input.value);
    const rule = state.evidenceRules.channel_rules.find((item) => item.channel === channel);
    if (field === "min_pct" && value !== rule.strategic_floor_pct) channelFloors[channel] = value;
    if (field === "max_pct" && value !== 100) channelCaps[channel] = value;
    if (field === "strategic_index" && value !== 50) channelIndex[channel] = value;
    if (field === "multiplier" && value !== 1) channelMultipliers[channel] = value;
  });

  const scenario_config = {
    ...state.scenarioProposal.config,
    weights,
    forecast_cost_per_policy_factor: forecastCpaFactor,
    channel_floors: channelFloors,
    channel_caps: channelCaps,
    channel_index: channelIndex,
    channel_multipliers: channelMultipliers,
  };
  const rationale = state.scenarioProposal.rationale;
  state.scenarioGenerateStatus = `Generating ${label}…`;
  renderScenarioComparison();
  try {
    const response = await fetch(`${LIVE_API_BASE}/api/scenario/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version_id: state.baselineVersionId, label, scenario_config }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || `${response.status} ${response.statusText}`);
    addGeneratedScenario({ plan: data.plan, stored: data.stored, rationale });
    state.scenarioProposal = null;
    state.scenarioGenerateStatus = null;
  } catch (error) {
    state.scenarioGenerateStatus = `Could not generate this scenario: ${error.message}`;
  }
  renderScenarioComparison();
}

function renderScenarioProposalReview() {
  const { label, config, rationale } = state.scenarioProposal;
  // Show the EFFECTIVE floors/caps/index (baseline's Step 2 guardrails plus
  // whatever this proposal explicitly adds), not just this proposal's own
  // - otherwise a blank row here reads as "no constraint", when the
  // baseline's guardrails actually still carry forward and apply.
  const baselineScenario = state.baselinePlan?.scenario || {};
  const channelFloors = { ...baselineScenario.channel_floors, ...config.channel_floors };
  const channelCaps = { ...baselineScenario.channel_caps, ...config.channel_caps };
  const channelIndex = { ...baselineScenario.channel_index, ...config.channel_index };
  const channelMultipliers = { ...config.channel_multipliers };
  const channels = state.evidenceRules.channel_rules;

  return `
    <div class="assumption-box" id="scenarioProposalReview">
      <strong>Proposed scenario, review before generating</strong>
      <p class="table-hint">${rationale || "No specific rationale returned."}</p>
      <label class="field-label" for="proposalLabel">Scenario name</label>
      <input id="proposalLabel" type="text" value="${label}" />
      <div class="builder-panel weights-grid">
        <label><span>Regional</span><input id="proposalRegional" type="number" step="0.05" value="${config.weights.regional_audience}" /></label>
        <label><span>Urban growth</span><input id="proposalGrowth" type="number" step="0.05" value="${config.weights.urban_growth_audience}" /></label>
        <label><span>Reach</span><input id="proposalReach" type="number" step="0.05" value="${config.weights.reach_channels}" /></label>
        <label><span>Performance</span><input id="proposalPerformance" type="number" step="0.05" value="${config.weights.performance_channels}" /></label>
        <label><span>Test budget</span><input id="proposalTest" type="number" step="0.05" value="${config.weights.test_budget}" /></label>
      </div>
      <label class="field-label" for="proposalCpaFactor">Forecast cost-per-policy factor (1.0 = neutral, lower = more efficient)</label>
      <input id="proposalCpaFactor" type="number" step="0.01" class="short-input" value="${config.forecast_cost_per_policy_factor ?? 1.0}" />
      <label class="field-label">Channel guardrails (already include the baseline's own Step 2 settings, carried forward - change any value to override it for this scenario)</label>
      <div class="source-table-wrap">
        <table class="source-table guardrail-table">
          <thead><tr><th>Channel</th><th>Min %</th><th>Max %</th><th>Strategic Index</th><th>Multiplier</th></tr></thead>
          <tbody>
            ${channels.map((rule) => {
              const minPct = channelFloors[rule.channel] ?? rule.strategic_floor_pct;
              const maxPct = channelCaps[rule.channel] ?? 100;
              const strategicIndex = channelIndex[rule.channel] ?? 50;
              const multiplier = channelMultipliers[rule.channel] ?? 1;
              return `
                <tr>
                  <td><strong>${rule.channel}</strong></td>
                  <td><input type="number" min="0" max="100" step="0.5" value="${minPct}" data-proposal-channel="${rule.channel}" data-proposal-field="min_pct" /></td>
                  <td><input type="number" min="0" max="100" step="0.5" value="${maxPct}" data-proposal-channel="${rule.channel}" data-proposal-field="max_pct" /></td>
                  <td><input type="number" min="0" max="100" step="1" value="${strategicIndex}" data-proposal-channel="${rule.channel}" data-proposal-field="strategic_index" /></td>
                  <td><input type="number" step="0.05" value="${multiplier}" data-proposal-channel="${rule.channel}" data-proposal-field="multiplier" /></td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
      <div class="config-actions">
        <button class="secondary-button" type="button" id="cancelScenarioProposal">Discard</button>
        <button class="primary-button" type="button" id="confirmScenarioProposal">Generate this scenario</button>
      </div>
    </div>
  `;
}

function renderScenarioBuilder() {
  const storedScenarios = SCENARIOS.map((scenarioId) => ({
    scenario_id: scenarioId,
    label: state.plans[scenarioId]?.scenario?.label || scenarioId,
  }));
  const disabled = state.baselineVersionId ? "" : "disabled";
  // Error messages ("Could not...") keep the amber warning style; every
  // other status here is a loading/in-progress message (Preparing,
  // Generating...) and gets a neutral, non-alarming style instead so it
  // doesn't read as something having gone wrong.
  const isError = state.scenarioGenerateStatus?.startsWith("Could not");
  document.querySelector("#scenarioBuilder").innerHTML = `
    ${!state.baselineVersionId ? `<p class="table-hint warning-text">Select or load a base plan above before creating a scenario.</p>` : ""}
    <div class="builder-panel scenario-builder-panel">
      <div>
        <label class="field-label">Stored scenarios</label>
        <div class="stored-scenario-buttons">
          ${storedScenarios.map((s) => `<button class="secondary-button" type="button" data-generate-stored="${s.scenario_id}" data-generate-label="${s.label}" ${disabled}>${s.label}</button>`).join("")}
        </div>
      </div>
      <div>
        <label class="field-label" for="scenarioFreeText">Additional scenario (free text)</label>
        <textarea id="scenarioFreeText" rows="3" placeholder="e.g. Grow EV and telematics quote demand hard this year, protect brand-search share, cap OOH at 8%."></textarea>
        <button class="secondary-button" type="button" id="proposeScenario" ${disabled}>Propose scenario</button>
      </div>
    </div>
    ${state.scenarioGenerateStatus ? `<p class="table-hint ${isError ? "warning-text" : "status-loading"}">${isError ? "" : "⏳ "}${state.scenarioGenerateStatus}</p>` : ""}
    ${state.scenarioProposal ? renderScenarioProposalReview() : ""}
  `;
}

function scenarioCard({ key, label, plan, pass, body, isBaseline }) {
  const preferred = state.preferredScenario?.scenario_id === key;
  // The 6 stored Admiral scenarios (brief section 5) carry a qualitative
  // facts block - objective, changed constraints, affected channels,
  // expected direction of brand/sales outcomes, key risk. Free-text/chat
  // proposed scenarios don't have a matching entry, so this is skipped for
  // those rather than showing something misleading.
  const meta = SCENARIO_META[plan.scenario?.scenario_id];
  const factsBlock = meta ? `
    <dl class="scenario-facts">
      <div><dt>Objective</dt><dd>${meta.objective}</dd></div>
      <div><dt>Changed constraints</dt><dd>${meta.changed_constraints}</dd></div>
      <div><dt>Affected channels</dt><dd>${meta.affected_channels}</dd></div>
      <div><dt>Expected direction - brand</dt><dd>${meta.expected_brand_direction}</dd></div>
      <div><dt>Expected direction - sales</dt><dd>${meta.expected_sales_direction}</dd></div>
      <div><dt>Key risk</dt><dd>${meta.key_risk}</dd></div>
    </dl>
  ` : "";
  return `
    <div class="scenario-card ${preferred ? "preferred" : ""}">
      <div class="scenario-card-head">
        <strong>${label}</strong>
        <span class="status-pill ${pass ? "good" : "warning"}">${preferred ? "Preferred" : isBaseline ? "Baseline" : pass ? "Pass" : "Needs work"}</span>
      </div>
      <div class="scenario-metrics">
        <div><span>Forecast</span><strong>${number.format(plan.forecast_new_policy_sales)}</strong></div>
        <div><span>Cost per Policy</span><strong>${costPerPolicyMoney.format(plan.forecast_cost_per_policy_gbp)}</strong></div>
        <div><span>Gap</span><strong>${number.format(Math.max(0, plan.brief_test.policy_sales_target - plan.forecast_new_policy_sales))}</strong></div>
      </div>
      <div class="scenario-body">${body}</div>
      ${factsBlock}
      <div class="config-actions">
        <button class="secondary-button" type="button" data-view-scenario="${key}">View full plan</button>
        ${isBaseline ? "" : `<button class="secondary-button" type="button" data-prefer-scenario="${key}" data-prefer-label="${label}">Mark preferred</button>`}
        ${isBaseline ? "" : `<button class="secondary-button" type="button" data-remove-scenario="${key}">Remove</button>`}
      </div>
    </div>
  `;
}

function renderScenarioComparison() {
  renderScenarioBuilder();
  const preferredStrip = state.preferredScenario ? `
    <div class="preferred-strip">
      <strong>Preferred scenario</strong>
      <span>${state.preferredScenario.label}</span>
      <button class="secondary-button" type="button" id="clearPreferredScenario">Clear</button>
    </div>
  ` : `
    <div class="preferred-strip muted">No preferred scenario selected yet.</div>
  `;
  const scenarioCountNote = `<p class="table-hint scenario-count-note">${state.generatedScenarios.length} of ${MAX_STORED_SCENARIOS} stored scenarios${state.generatedScenarios.length >= MAX_STORED_SCENARIOS ? " - saving another will remove the oldest non-preferred one" : ""}.</p>`;
  document.querySelector("#preferredScenarioPanel").innerHTML = preferredStrip + scenarioCountNote;

  document.querySelector("#scenarioBaselineNotice").innerHTML = `
    <div class="builder-panel scenario-builder-panel">
      <div>
        <label class="field-label">Base plan</label>
        <p class="table-hint">${state.baselinePlan ? `Using: ${state.baselinePlan.plan_id}` : "Generate a base plan in Annual Planning, load the last one created, or upload a previously downloaded plan."}</p>
        <button class="secondary-button" type="button" id="useLastCreatedPlan">Use last created plan</button>
      </div>
      <div>
        <label class="field-label" for="uploadBasePlanInput">Upload base plan (.xlsx)</label>
        <input type="file" id="uploadBasePlanInput" accept=".xlsx" />
      </div>
    </div>
  `;

  if (!state.baselinePlan) {
    document.querySelector("#scenarioComparison").innerHTML = "";
    return;
  }

  const baseline = state.baselinePlan;
  const baselineCard = scenarioCard({
    key: "baseline",
    label: "Baseline (stored)",
    plan: baseline,
    pass: baseline.brief_test.clears_policy_sales_target && baseline.brief_test.clears_brief_cost_per_policy,
    body: baseline.scenario.scenario_assumption || baseline.scenario.freeform_prompt,
    isBaseline: true,
  });

  const scenarioCards = state.generatedScenarios.map((entry) => {
    const deltas = CHANNEL_ORDER.map((channel) => ({
      channel,
      delta: scenarioDelta(entry.plan, baseline, channel),
    })).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 3);
    // A free-text scenario's specific Gemini rationale ("increased weight for
    // urban growth...") is more useful here than the generic templated
    // scenario_assumption every generated scenario otherwise gets - show it
    // when we have it, falling back to the generic sentence for the 6 stored
    // Admiral scenario templates (Balanced Growth/Brand Trust Build/...),
    // which don't have one.
    const assumption = entry.rationale || entry.plan.scenario.scenario_assumption || entry.plan.scenario.freeform_prompt;
    const body = `${assumption}
        <div class="delta-list">
          ${deltas.map((item) => `
            <div>
              <span>${item.channel}</span>
              <strong>${item.delta >= 0 ? "+" : ""}${money.format(item.delta)}</strong>
            </div>
          `).join("")}
        </div>`;
    return scenarioCard({
      key: entry.stored.version_id,
      label: entry.plan.scenario.label,
      plan: entry.plan,
      pass: entry.plan.brief_test.clears_policy_sales_target && entry.plan.brief_test.clears_brief_cost_per_policy,
      body,
      isBaseline: false,
    });
  });

  document.querySelector("#scenarioComparison").innerHTML = [baselineCard, ...scenarioCards].join("");
}

function renderScenarioDrilldown() {
  const panel = document.querySelector("#scenarioDrilldownPanel");
  if (!state.scenarioDrilldown) {
    panel.style.display = "none";
    panel.innerHTML = "";
    return;
  }
  const { label, plan } = state.scenarioDrilldown;
  panel.style.display = "";
  const channelTotalMap = Object.fromEntries(plan.channel_totals.map((row) => [row.channel, row]));
  const selected = state.scenarioDrilldownSelected;
  const rows = tableChannelGroups().map((group) => {
    const channelRows = group.rows.map((leafRow) => {
      const channel = leafRow.engineChannel;
      const share = leafRow.share;
      const cells = MONTHS.map((month) => {
        const row = plan.monthly_allocations.find((item) => item.month === month && item.channel === channel);
        const isSelected = selected?.month === month && selected?.channel === channel;
        return `<td class="${isSelected ? "selected" : ""}">
          <button type="button" data-scenario-month="${month}" data-scenario-channel="${channel}">
            ${row ? money.format(row.budget_gbp * share) : "n/a"}
          </button>
        </td>`;
      }).join("");
      const total = channelTotalMap[channel];
      const rowLabel = share < 1 ? `${leafRow.label} <span class="table-hint">(50% of ${channel})</span>` : leafRow.label;
      return `<tr class="sub-category-row"><td title="${channel}">${rowLabel}</td>${cells}<td class="total-cell">${money.format(total.budget_gbp * share)}</td></tr>`;
    }).join("");
    const groupTotal = group.rows.reduce((sum, leafRow) => sum + channelTotalMap[leafRow.engineChannel].budget_gbp * leafRow.share, 0);
    return `<tr class="category-row"><td colspan="${MONTHS.length + 1}">${group.parent}</td><td class="total-cell category-total">${money.format(groupTotal)}</td></tr>${channelRows}`;
  }).join("");

  panel.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Scenario Detail</p>
        <h2>${label}</h2>
      </div>
      <button class="secondary-button" type="button" id="closeScenarioDrilldown">Close</button>
    </div>
    <div class="table-wrap">
      <table class="plan-table">
        <thead><tr><th>Category / Channel</th>${MONTHS.map((month) => `<th>${formatMonth(month)}</th>`).join("")}<th>Total</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="table-hint">${plan.scenario.scenario_assumption || plan.scenario.freeform_prompt}</p>
    <div class="section-heading compact">
      <h2>Evidence Inspector</h2>
      <span id="scenarioSelectedCellLabel" class="muted">${selected ? `${formatMonth(selected.month)} / ${selected.channel}` : "No cell selected"}</span>
    </div>
    <div id="scenarioEvidenceInspector" class="empty-state">Select a month/channel cell to see the rationale.</div>
  `;
  renderScenarioDrilldownEvidence();
}

function renderScenarioDrilldownEvidence() {
  const inspector = document.querySelector("#scenarioEvidenceInspector");
  if (!inspector) return;
  const target = state.scenarioDrilldownSelected;
  if (!target) {
    inspector.className = "empty-state";
    inspector.textContent = "Select a month/channel cell to see the rationale.";
    return;
  }
  const plan = state.scenarioDrilldown.plan;
  const row = plan.monthly_allocations.find((item) => item.month === target.month && item.channel === target.channel);
  const channelTotal = plan.channel_totals.find((item) => item.channel === target.channel);
  if (!row) {
    inspector.className = "empty-state";
    inspector.textContent = "No allocation for this cell.";
    return;
  }
  inspector.className = "evidence-block";
  inspector.innerHTML = `
    ${splitChannelNoteHtml(target.channel)}
    <div class="evidence-metrics">
      <div class="metric"><span>Monthly Budget</span><strong>${money.format(row.budget_gbp)}</strong></div>
      <div class="metric"><span>Annual Channel Budget</span><strong>${channelTotal ? money.format(channelTotal.budget_gbp) : "Not available"}</strong></div>
      <div class="metric"><span>% of Monthly Spend</span><strong>${row.budget_share_pct}%</strong></div>
      <div class="metric"><span>Forecast Cost per Policy</span><strong>${costPerPolicyMoney.format(row.forecast_cost_per_policy_gbp)}</strong></div>
      <div class="metric"><span>Confidence</span><strong class="confidence-${row.confidence.replace(" ", "-")}">${row.confidence}</strong></div>
    </div>
    <div>
      <strong>Rationale</strong>
      <p class="table-hint">${row.rationale}</p>
    </div>
    <div>
      <strong>Brief hooks</strong>
      <div class="source-tags">${(row.brief_hooks || []).map((hook) => `<span class="source-tag">${hook}</span>`).join("")}</div>
    </div>
    <div>
      <strong>Sources</strong>
      <div class="source-tags">${row.source_ids.map((id) => `<span class="source-tag" title="${sourceLabel(id)}">${id}</span>`).join("")}</div>
    </div>
  `;
}

function sourceReadiness(sourceId) {
  const source = state.sources?.sources?.find((item) => item.source_id === sourceId);
  const override = state.sourceOverrides[sourceId] || {};
  if (!source) return { source_id: sourceId, name: sourceId, status: "missing", strength: "missing" };
  return { ...source, ...override };
}

function sourceReadinessTags(sourceIds = []) {
  return sourceIds.map((id) => {
    const source = sourceReadiness(id);
    return `<span class="source-tag" title="${source.name}">${id}: ${source.status}</span>`;
  }).join("");
}

// A month can only be revised once the month before it has fully closed -
// "prior month actuals vs plan" isn't meaningful for a month still in
// progress (see conversation: on 13 July, the earliest revisable month is
// August, not July itself).
function isRevisionMonthEligible(month) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  return month > currentMonth;
}

// "Weather for next month" and "any new events" both come from the exact
// same real data the Events Calendar uses, split into the two groupings
// Monthly Revision cares about - not a separate hand-written fixture
// sentence per month.
function monthlyRevisionCalendarContext(month) {
  const items = calendarItemsForMonth(month, CALENDAR_ALL_FILTERS_ON);
  // "draw" is the legacy lottery draw/deadline category from the calendar
  // data source this demo was cloned from - it has no place in a car
  // insurance media revision (see brief master acceptance criteria: no
  // draw/lottery references visible anywhere), so it's excluded here
  // regardless of what the Events Calendar page itself does with that
  // category/data source.
  const eligible = items.filter((item) => item.category !== "draw");
  return {
    weather: eligible.filter((item) => item.category === "weather"),
    events: eligible.filter((item) => item.category !== "weather"),
  };
}

function revisionFixture() {
  const fixtures = state.monthlyRevisionData?.revision_months || [];
  return fixtures.find((item) => item.month === state.selectedRevisionMonth) || fixtures[0];
}

function rowFor(plan, month, channel) {
  return plan.monthly_allocations.find((item) => item.month === month && item.channel === channel);
}

function channelTotalFromRows(rows, channel) {
  return rows.filter((item) => item.channel === channel).reduce((sum, item) => sum + item.budget_gbp, 0);
}

function allocateRevisionMonth(month, baselineRows, fixture, plan) {
  const performance = Object.fromEntries(fixture.channel_performance.map((item) => [item.channel, item]));
  // Structured climate data (same source the Events Calendar uses) rather
  // than fuzzy-matching the fixture's own free-text weather sentence - see
  // conversation: the reallocation logic should read real data, not prose.
  const monthlyClimate = (state.weather?.monthly_averages || []).find((entry) => entry.month === month);
  const rawScores = {};
  CHANNEL_ORDER.forEach((channel) => {
    const baseRow = baselineRows.find((item) => item.channel === channel);
    const perf = performance[channel] || { sales_index: 1, delivery_index: 1 };
    const curve = baseRow.response_curve || {};
    const evidencePenalty = ["brief_required_gap", "test_required"].includes(baseRow.evidence_strength) ? 0.94 : 1;
    const confidencePenalty = ["low", "low-medium"].includes(baseRow.confidence) ? 0.97 : 1;
    let multiplier = (0.72 + (Number(perf.sales_index) * 0.2) + (Number(perf.delivery_index) * 0.08)) * evidencePenalty * confidencePenalty;
    if (channel === "Direct Mail" && Number(perf.sales_index) > 1.05) multiplier += 0.04;
    if (channel === "Paid Search" && Number(perf.sales_index) > 1.03) multiplier += 0.025;
    if (channel === "AV" && monthlyClimate?.rainfall_band === "wet") multiplier += 0.025;
    if (["OOH", "CTV/YouTube"].includes(channel) && Number(perf.sales_index) < 0.95) multiplier -= 0.05;
    rawScores[channel] = Math.max(0.01, baseRow.budget_gbp * multiplier);
  });

  const monthBudget = baselineRows.reduce((sum, item) => sum + item.budget_gbp, 0);
  const scoreTotal = Object.values(rawScores).reduce((sum, value) => sum + value, 0);
  const raw = Object.fromEntries(CHANNEL_ORDER.map((channel) => [channel, (rawScores[channel] / scoreTotal) * monthBudget]));
  const rounded = Object.fromEntries(CHANNEL_ORDER.map((channel) => [channel, Math.round(raw[channel])]));
  const drift = monthBudget - Object.values(rounded).reduce((sum, value) => sum + value, 0);
  if (drift) {
    const ranked = [...CHANNEL_ORDER].sort((a, b) => (raw[b] - rounded[b]) - (raw[a] - rounded[a]));
    ranked.slice(0, Math.abs(drift)).forEach((channel) => {
      rounded[channel] += drift > 0 ? 1 : -1;
    });
  }

  return CHANNEL_ORDER.map((channel) => {
    const baseRow = baselineRows.find((item) => item.channel === channel);
    const perf = performance[channel] || {};
    const budget = Math.max(0, rounded[channel]);
    const cpaAdjustment = Math.max(0.88, Math.min(1.18, 1 / (Number(perf.sales_index || 1) || 1)));
    const forecastCpa = Number((baseRow.forecast_cost_per_policy_gbp * cpaAdjustment).toFixed(2));
    return {
      ...baseRow,
      budget_gbp: budget,
      budget_share_pct: Number(((budget / monthBudget) * 100).toFixed(2)),
      forecast_cost_per_policy_gbp: forecastCpa,
      forecast_new_policy_sales: Math.round(budget / forecastCpa),
      source_ids: Array.from(new Set([...(baseRow.source_ids || []), state.monthlyRevisionData.source_id])),
      revision_reason: `${perf.context || "No channel-specific actuals."} Prior-month sales index ${perf.sales_index || 1}; delivery index ${perf.delivery_index || 1}.`,
      rationale: `${baseRow.rationale} Monthly revision overlay: ${perf.context || "No channel-specific actuals."} This is a deterministic candidate and requires approval before becoming plan truth.`,
    };
  });
}

function buildMonthlyRevisionCandidate() {
  const baseline = currentPlan();
  const fixture = revisionFixture();
  const selectedIndex = MONTHS.indexOf(fixture.month);
  const revisedRows = [];
  MONTHS.forEach((month, index) => {
    const baselineRows = CHANNEL_ORDER.map((channel) => rowFor(baseline, month, channel));
    if (index < selectedIndex) {
      revisedRows.push(...baselineRows.map((row) => ({ ...row, frozen: true, revision_reason: "Frozen past month from approved annual plan." })));
    } else {
      revisedRows.push(...allocateRevisionMonth(month, baselineRows, fixture, baseline).map((row) => ({ ...row, frozen: false })));
    }
  });

  const channelTotals = CHANNEL_ORDER.map((channel) => {
    const baseBudget = channelTotalFromRows(baseline.monthly_allocations, channel);
    const budget = channelTotalFromRows(revisedRows, channel);
    const rows = revisedRows.filter((item) => item.channel === channel);
    const policySales = rows.reduce((sum, item) => sum + item.forecast_new_policy_sales, 0);
    const baseTotal = baseline.channel_totals.find((item) => item.channel === channel);
    return {
      ...baseTotal,
      budget_gbp: budget,
      share_pct: Number(((budget / baseline.total_budget_gbp) * 100).toFixed(2)),
      forecast_new_policy_sales: policySales,
      delta_gbp: budget - baseBudget,
      delta_pct: baseBudget ? Number((((budget - baseBudget) / baseBudget) * 100).toFixed(2)) : 0,
    };
  });
  const totalPolicySales = revisedRows.reduce((sum, item) => sum + item.forecast_new_policy_sales, 0);
  const versionId = `local_revision_${fixture.month}_${baseline.scenario.scenario_id}`;
  return {
    plan_id: `${baseline.plan_id}_${fixture.month}_revision_candidate`,
    version_id: versionId,
    version_label: `${formatMonth(fixture.month)} revision candidate`,
    baseline_plan_id: baseline.plan_id,
    scenario: baseline.scenario,
    revision_month: fixture.month,
    prior_month: fixture.prior_month,
    total_budget_gbp: baseline.total_budget_gbp,
    forecast_new_policy_sales: totalPolicySales,
    forecast_cost_per_policy_gbp: Number((baseline.total_budget_gbp / totalPolicySales).toFixed(2)),
    monthly_allocations: revisedRows,
    channel_totals: channelTotals,
    fixture,
    approval_status: "draft_revision",
    source_status: state.monthlyRevisionData.status,
    qa: {
      frozen_past_months: MONTHS.slice(0, MONTHS.indexOf(fixture.month)),
      changed_months: MONTHS.slice(MONTHS.indexOf(fixture.month)),
      budget_balanced: baseline.total_budget_gbp === revisedRows.reduce((sum, item) => sum + item.budget_gbp, 0),
      // Same qa shape every other plan type uses (see planSummary/Approval's
      // Active Warnings panel) - a revision candidate is just another
      // "stored plan" now, so it needs the fields those consumers expect
      // rather than a bespoke shape that crashes them.
      months_balanced: MONTHS.every((month) => {
        const revisedTotal = revisedRows.filter((row) => row.month === month).reduce((sum, row) => sum + row.budget_gbp, 0);
        const baselineTotal = CHANNEL_ORDER.reduce((sum, channel) => sum + rowFor(baseline, month, channel).budget_gbp, 0);
        return revisedTotal === baselineTotal;
      }),
      all_allocations_have_sources: revisedRows.every((row) => (row.source_ids || []).length > 0),
      warnings: [
        "Prior-month actuals are a synthetic fixture in this prototype - production would link the real internal sales and delivery feed.",
        `Deterministic reallocation applies from ${formatMonth(fixture.month)} onward; ${MONTHS.indexOf(fixture.month)} prior month(s) stay frozen from the approved annual plan.`,
      ],
      actuals_are_synthetic: true,
      numeric_owner: "deterministic monthly revision reallocator using existing plan rows and curve evidence",
      llm_authoritative_state: false,
    },
  };
}

function renderMonthlyRevision() {
  const fixture = revisionFixture();
  const candidate = state.revisionDraft?.revision_month === fixture.month ? state.revisionDraft : null;
  const calendarContext = monthlyRevisionCalendarContext(fixture.month);
  const planName = state.revisionPlanNames[fixture.month] || `${formatMonth(fixture.month)} Revised`;

  // Output only appears once "Run revision" has actually been clicked for
  // this month (see conversation: picking a month shouldn't pre-empt the
  // button by showing output that hasn't been "run" yet).
  const outputSection = candidate ? (() => {
    const sortedDeltas = [...candidate.channel_totals].sort((a, b) => Math.abs(b.delta_gbp) - Math.abs(a.delta_gbp));
    return `
    <div class="revision-card">
      <div class="scenario-card-head">
        <strong>Delta to approved annual baseline</strong>
        <span class="status-pill ${candidate.qa.budget_balanced ? "good" : "warning"}">${candidate.qa.budget_balanced ? "balanced" : "needs review"}</span>
      </div>
      <div class="revision-delta-grid">
        ${sortedDeltas.map((row) => `
          <div class="revision-delta ${row.delta_gbp > 0 ? "up" : row.delta_gbp < 0 ? "down" : ""}">
            <span>${row.channel}</span>
            <strong>${row.delta_gbp >= 0 ? "+" : ""}${money.format(row.delta_gbp)}</strong>
            <p>${row.delta_pct >= 0 ? "+" : ""}${row.delta_pct}% vs baseline</p>
          </div>
        `).join("")}
      </div>
    </div>
    <div class="revision-table-wrap">
      <table class="revision-table">
        <thead><tr><th>Channel</th><th>Baseline ${formatMonth(fixture.month)}</th><th>Revised ${formatMonth(fixture.month)}</th><th>Delta</th><th>Why</th></tr></thead>
        <tbody>
          ${CHANNEL_ORDER.map((channel) => {
            const base = rowFor(currentPlan(), fixture.month, channel);
            const revised = candidate.monthly_allocations.find((item) => item.month === fixture.month && item.channel === channel);
            const delta = revised.budget_gbp - base.budget_gbp;
            return `<tr>
              <td><strong>${channel}</strong></td>
              <td>${money.format(base.budget_gbp)}</td>
              <td>${money.format(revised.budget_gbp)}</td>
              <td>${delta >= 0 ? "+" : ""}${money.format(delta)}</td>
              <td>${revised.revision_reason}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
    <div class="revision-card">
      <div class="scenario-card-head">
        <strong>Next steps</strong>
      </div>
      <p class="table-hint">This revision is a new plan version candidate. It does not mutate the approved annual plan until it is approved.</p>
      <label class="field-label" for="revisionPlanName">Plan name</label>
      <input type="text" id="revisionPlanName" value="${planName}" maxlength="80" />
      <div class="config-actions">
        <button class="secondary-button" type="button" id="approveRevisionCandidate">Send to approval</button>
        <button class="secondary-button" type="button" id="downloadRevisionExcel">Download plan (Excel)</button>
      </div>
    </div>
  `;
  })() : `
    <div class="revision-card empty-state">
      Click "Run revision" to reallocate ${formatMonth(fixture.month)} onward against the approved annual plan, using the prior-month actuals and monthly context above.
    </div>
  `;

  document.querySelector("#monthlyRevision").innerHTML = `
    <div class="revision-grid">
      <div class="revision-card">
        <div class="scenario-card-head">
          <strong>Revision control</strong>
          <span class="status-pill warning">real behaviour / synthetic feed</span>
        </div>
        <label class="field-label" for="revisionMonth">Revision month</label>
        <select id="revisionMonth">
          ${MONTHS.map((month) => {
            const entry = (state.monthlyRevisionData?.revision_months || []).find((item) => item.month === month);
            const eligible = isRevisionMonthEligible(month);
            const selectable = eligible && Boolean(entry);
            const label = entry
              ? `${formatMonth(month)} from ${formatMonth(entry.prior_month)} actuals${eligible ? "" : " (frozen)"}`
              : `${formatMonth(month)} (frozen)`;
            return `<option value="${month}" ${month === fixture.month ? "selected" : ""} ${selectable ? "" : "disabled"}>${label}</option>`;
          }).join("")}
        </select>
        <p class="table-hint">A month can only be revised once the month before it has fully closed - the current month in progress is never eligible.</p>
        <div class="config-actions">
          <button class="secondary-button" type="button" id="runRevision">Run revision</button>
        </div>
      </div>
      <div class="revision-card">
        <strong>Prior-month rolling performance</strong>
        <dl class="revision-dl">
          <div><dt>New policy sales (actual)</dt><dd>${number.format(fixture.sales_actuals.new_policy_sales)} vs ${number.format(fixture.sales_actuals.target_new_policy_sales)}</dd></div>
          <div><dt>Actual Cost per Policy</dt><dd>${costPerPolicyMoney.format(fixture.sales_actuals.cost_per_policy_gbp)} vs ${costPerPolicyMoney.format(fixture.sales_actuals.target_cost_per_policy_gbp)}</dd></div>
          <div><dt>Delivery index</dt><dd>${fixture.sales_actuals.delivery_index}</dd></div>
          ${fixture.sales_actuals.quote_starts ? `<div><dt>Quote starts</dt><dd>${number.format(fixture.sales_actuals.quote_starts)}</dd></div>` : ""}
          ${fixture.sales_actuals.quote_to_policy_conversion_pct ? `<div><dt>Quote-to-policy conversion</dt><dd>${fixture.sales_actuals.quote_to_policy_conversion_pct}%</dd></div>` : ""}
          ${fixture.sales_actuals.pcw_visibility_index ? `<div><dt>PCW visibility index (context only)</dt><dd>${fixture.sales_actuals.pcw_visibility_index}</dd></div>` : ""}
          ${fixture.sales_actuals.brand_search_index ? `<div><dt>Brand search index (context only)</dt><dd>${fixture.sales_actuals.brand_search_index}</dd></div>` : ""}
        </dl>
        <p class="table-hint">Quote starts, conversion, PCW visibility and brand-search index are context signals for planner judgement here - they do not feed the revision calculation itself unless a source/rule is explicitly configured.</p>
      </div>
      <div class="revision-card">
        <strong>Monthly context</strong>
        <p><b>Weather:</b> ${calendarContext.weather.length ? calendarContext.weather.map((item) => item.title).join("; ") : "No notable heat/wet risk or active warning this month."}</p>
        <p><b>Events:</b> ${calendarContext.events.length ? calendarContext.events.map((item) => item.title).join("; ") : "Nothing flagged this month."}</p>
        <label class="field-label" for="monthlyRevisionFreeText">Additional context (free text)</label>
        <textarea id="monthlyRevisionFreeText" placeholder="e.g. Rings of Power launching, increase S1 spend">${state.monthlyRevisionContext[fixture.month] || ""}</textarea>
        <p class="table-hint">Qualitative signals like this are for planner judgement alongside the automated events above - they are not yet fed into the revision calculation itself.</p>
      </div>
    </div>
    ${outputSection}
  `;
}

// Every selectable plan to interrogate: the live baseline/generated
// scenarios from the Scenario Centre (real, if the planner has been
// working there) plus the 6 stored demo scenarios (always available, for
// exploring the tool without a live session). "live" options carry a real
// version_id, so chat's proposed scenarios can actually be run against
// them; "fixture" options can only be explained/proposed against, not run.
function chatInterrogationOptions() {
  const options = [];
  if (state.baselinePlan) {
    options.push({ key: "live:baseline", label: `${state.baselinePlan.scenario.label} (baseline)`, kind: "live", plan: state.baselinePlan, versionId: state.baselineVersionId });
  }
  state.generatedScenarios.forEach((entry) => {
    options.push({ key: `live:${entry.stored.version_id}`, label: entry.plan.scenario.label, kind: "live", plan: entry.plan, versionId: entry.stored.version_id });
  });
  state.monthlyRevisionSubmissions.forEach((revisionCandidate) => {
    options.push({ key: `live:${revisionCandidate.version_id}`, label: revisionCandidate.version_label, kind: "live", plan: revisionCandidate, versionId: revisionCandidate.version_id });
  });
  SCENARIOS.forEach((scenarioId) => {
    const plan = state.plans[scenarioId];
    if (plan) options.push({ key: `fixture:${scenarioId}`, label: `${plan.scenario.label} (demo)`, kind: "fixture", plan, versionId: null });
  });
  return options;
}

function currentChatOption() {
  const options = chatInterrogationOptions();
  const found = options.find((option) => option.key === state.chatInterrogationKey);
  if (found) return found;
  // Default to the live baseline if one's loaded, otherwise the first demo scenario.
  return options.find((option) => option.kind === "live") || options[0];
}

function selectChatInterrogation(key) {
  if (key === state.chatInterrogationKey) return;
  state.chatInterrogationKey = key;
  saveLocalJson("admiral_chat_interrogation_key", key);
  // A different plan means prior answers no longer apply - start fresh
  // rather than mixing context across plans.
  state.chatMessages = [];
  saveLocalJson("admiral_plan_chat_messages_v2", state.chatMessages);
  renderPlanChat();
}

function chatMessageHtml(message, index) {
  const proposal = message.proposal;
  let proposalHtml = "";
  if (proposal) {
    if (message.discarded) {
      proposalHtml = `<div class="assumption-box chat-proposal"><strong>Proposed scenario config</strong><p class="table-hint">Discarded.</p></div>`;
    } else if (message.runResult) {
      const plan = message.runResult.plan;
      const baseline = currentChatOption().plan;
      proposalHtml = `
        <div class="assumption-box chat-proposal">
          <strong>Proposed scenario config</strong>
          <p class="table-hint">${proposal.rationale || ""}</p>
          <div class="scenario-metrics">
            <div><span>Forecast</span><strong>${number.format(plan.forecast_new_policy_sales)}</strong></div>
            <div><span>Cost per Policy</span><strong>${costPerPolicyMoney.format(plan.forecast_cost_per_policy_gbp)}</strong></div>
            <div><span>vs baseline forecast</span><strong>${plan.forecast_new_policy_sales >= baseline.forecast_new_policy_sales ? "+" : ""}${number.format(plan.forecast_new_policy_sales - baseline.forecast_new_policy_sales)}</strong></div>
          </div>
          ${message.stored
            ? `<p class="table-hint">Stored as "${plan.scenario.label}" - view it in Scenario Centre.</p>`
            : `<div class="config-actions">
                <button class="primary-button" type="button" data-store-chat-scenario="${index}">Store as scenario</button>
                <button class="secondary-button" type="button" data-discard-chat-scenario="${index}">Discard</button>
              </div>`}
        </div>
      `;
    } else {
      const canRun = currentChatOption().kind === "live";
      proposalHtml = `
        <div class="assumption-box chat-proposal">
          <strong>Proposed scenario config</strong>
          <p class="table-hint">${proposal.rationale || ""}</p>
          ${canRun
            ? `<div class="config-actions">
                <button class="primary-button" type="button" data-run-chat-scenario="${index}" ${message.runningScenario ? "disabled" : ""}>${message.runningScenario ? "Running…" : "Run this scenario"}</button>
              </div>`
            : `<p class="table-hint warning-text">This is a demo scenario, not a live stored plan, so it can't be run or stored directly - load or generate a real base plan in Annual Planning or Scenarios first.</p>`}
          ${message.runError ? `<p class="table-hint warning-text">Could not run this scenario: ${message.runError}</p>` : ""}
        </div>
      `;
    }
  }
  return `
    <div class="chat-message ${message.role}">
      <span>${message.type || message.role}</span>
      <p>${message.role === "user" ? message.question : `${message.question ? `<strong>Q:</strong> ${message.question}<br>` : ""}${message.answer}`}</p>
      <div class="source-tags">${(message.source_readiness || []).map((source) => `<span class="source-tag" title="${source.name || source.source_id}">${source.source_id}: ${source.status}</span>`).join("")}</div>
      ${proposalHtml}
    </div>
  `;
}

function chatEmptyStateHtml() {
  return `
    <div class="chat-empty-state">
      <img src="./assets/admiral-logo.svg" alt="" class="chat-empty-logo" aria-hidden="true" />
      <h2>How can I help you today?</h2>
      <p class="table-hint">Ask about the plan shown on the left, or try one of the suggested questions there.</p>
    </div>
  `;
}

function renderPlanChat() {
  const options = chatInterrogationOptions();
  const current = currentChatOption();
  if (current && state.chatInterrogationKey !== current.key) state.chatInterrogationKey = current.key;

  document.querySelector("#planChat").innerHTML = `
    <div class="chat-page">
      <div class="chat-overview-panel">
        <div class="chat-overview-row">
          <div>
            <strong>Select scenario to interrogate</strong>
            <div class="stored-scenario-buttons">
              ${options.map((option) => `
                <button class="secondary-button chat-scenario-btn ${option.key === state.chatInterrogationKey ? "active" : ""}" type="button" data-chat-select="${option.key}">${option.label}</button>
              `).join("")}
            </div>
          </div>
          <div>
            <strong>Plan Overview</strong>
            ${current ? `
              <div class="scenario-metrics">
                <div><span>Forecast</span><strong>${number.format(current.plan.forecast_new_policy_sales)}</strong></div>
                <div><span>Cost per Policy</span><strong>${costPerPolicyMoney.format(current.plan.forecast_cost_per_policy_gbp)}</strong></div>
                <div><span>Total Budget</span><strong>${money.format(current.plan.total_budget_gbp)}</strong></div>
                ${current.plan.forecast_quote_starts ? `<div><span>Quote Starts</span><strong>${number.format(current.plan.forecast_quote_starts)}</strong></div>` : ""}
                ${current.plan.quote_to_policy_conversion_pct ? `<div><span>Quote-to-Policy Conversion</span><strong>${current.plan.quote_to_policy_conversion_pct}%</strong></div>` : ""}
              </div>
              <p class="table-hint">${current.label} - ${current.plan.scenario.scenario_assumption || current.plan.scenario.freeform_prompt || ""}</p>
            ` : `<p class="table-hint warning-text">No plan available yet - generate a base plan in Annual Planning first.</p>`}
          </div>
        </div>
        <div class="chat-overview-row chat-overview-row-secondary">
          <div>
            <strong>Suggested questions</strong>
            <div class="stored-scenario-buttons">
              ${PLAN_INTERROGATION_SEED_QUESTIONS.map((question) => `<button class="secondary-button" type="button" data-seed-question="${question.replace(/"/g, "&quot;")}" ${current ? "" : "disabled"}>${question}</button>`).join("")}
            </div>
          </div>
          <div>
            <strong>What this assistant will and won't do</strong>
            <p class="table-hint">${PLAN_INTERROGATION_BOUNDARY_COPY}</p>
          </div>
        </div>
      </div>
      <div class="chat-main">
        ${state.chatMessages.length ? `
          <div class="chat-main-header">
            <button class="secondary-button" type="button" id="newChatConversation">New chat</button>
          </div>
        ` : ""}
        <div class="chat-transcript" id="chatTranscript">
          ${state.chatMessages.length
            ? state.chatMessages.map((message, index) => chatMessageHtml(message, index)).join("")
            : chatEmptyStateHtml()}
        </div>
        <div class="chat-input-row">
          <input id="chatQuestion" type="text" placeholder="e.g. Why have you spent so much on AV in January?" ${current ? "" : "disabled"} />
          <button class="primary-button" type="button" id="askPlanChat" ${current ? "" : "disabled"}>Ask</button>
        </div>
      </div>
    </div>
  `;
}

async function askPlanChat() {
  const input = document.querySelector("#chatQuestion");
  const question = input?.value.trim();
  const current = currentChatOption();
  if (!question || !current) return;
  input.value = "";

  const conversation = state.chatMessages
    .filter((message) => message.question || message.role === "assistant")
    .flatMap((message) => message.question
      ? [{ role: "user", content: message.question }, { role: "assistant", content: message.answer }]
      : []);

  const userMessage = { role: "user", type: "question", created_at: nowStamp(), question, answer: question, source_ids: [], source_readiness: [] };
  const pending = {
    role: "assistant",
    type: "plan_interrogation",
    created_at: nowStamp(),
    question,
    answer: "Thinking…",
    source_ids: [],
    source_readiness: [],
  };
  state.chatMessages = [...state.chatMessages, userMessage, pending].slice(-16);
  renderPlanChat();
  document.querySelector("#chatTranscript")?.scrollTo({ top: 99999 });

  try {
    const response = await fetch(`${LIVE_API_BASE}/api/chat/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, plan: current.plan, conversation }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || `${response.status} ${response.statusText}`);
    const sourceIds = data.source_ids || [];
    const answerMessage = {
      role: "assistant",
      type: "plan_interrogation",
      created_at: nowStamp(),
      question,
      answer: data.answer,
      source_ids: sourceIds,
      source_readiness: sourceIds.map(sourceReadiness),
      proposal: data.wants_scenario_proposal && data.proposed_scenario_config
        ? { config: data.proposed_scenario_config, rationale: data.proposal_rationale, label: `Plan Interrogation: ${question}`.slice(0, 60) }
        : null,
    };
    state.chatMessages = state.chatMessages.slice(0, -1).concat(answerMessage);
  } catch (error) {
    state.chatMessages = state.chatMessages.slice(0, -1).concat({
      role: "assistant",
      type: "plan_interrogation_error",
      created_at: nowStamp(),
      question,
      answer: `Could not reach the plan chat API (${error.message}). Is it running at ${LIVE_API_BASE}?`,
      source_ids: [],
      source_readiness: [],
    });
  }
  saveLocalJson("admiral_plan_chat_messages_v2", state.chatMessages);
  renderPlanChat();
  document.querySelector("#chatTranscript")?.scrollTo({ top: 99999 });
}

async function runChatScenario(index) {
  const message = state.chatMessages[index];
  const current = currentChatOption();
  if (!message?.proposal || !current || current.kind !== "live") return;
  message.runningScenario = true;
  renderPlanChat();
  try {
    const response = await fetch(`${LIVE_API_BASE}/api/scenario/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version_id: current.versionId, label: message.proposal.label, scenario_config: message.proposal.config }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || `${response.status} ${response.statusText}`);
    message.runResult = { plan: data.plan, stored: data.stored };
    message.runningScenario = false;
  } catch (error) {
    message.runError = error.message;
    message.runningScenario = false;
  }
  saveLocalJson("admiral_plan_chat_messages_v2", state.chatMessages);
  renderPlanChat();
}

function storeChatScenario(index) {
  const message = state.chatMessages[index];
  if (!message?.runResult) return;
  addGeneratedScenario({ plan: message.runResult.plan, stored: message.runResult.stored, rationale: message.proposal.rationale });
  message.stored = true;
  saveLocalJson("admiral_plan_chat_messages_v2", state.chatMessages);
  renderPlanChat();
  // Scenario Centre isn't the active tab right now, but its DOM should
  // still be current the moment the planner switches to it - tab-switching
  // only toggles CSS visibility, it doesn't re-render (see attachEvents).
  renderScenarioComparison();
}

function discardChatScenario(index) {
  const message = state.chatMessages[index];
  if (!message) return;
  message.discarded = true;
  saveLocalJson("admiral_plan_chat_messages_v2", state.chatMessages);
  renderPlanChat();
}

async function generateCalendarAiOverview() {
  const monthStr = state.calendarMonth;
  const monthLabel = new Date(`${monthStr}-01T00:00:00`).toLocaleString("en-GB", { month: "long", year: "numeric" });
  const items = calendarItemsForMonth(monthStr);
  state.calendarGenerateStatus = "Generating AI overview…";
  renderEventsCalendar();

  try {
    const response = await fetch(`${LIVE_API_BASE}/api/calendar/monthly-overview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month: monthStr, month_label: monthLabel, items }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || `${response.status} ${response.statusText}`);
    state.calendarOverviewAi[monthStr] = {
      narrative: data.narrative,
      source_ids: data.source_ids || [],
      confidence: data.confidence,
      confidence_reason: data.confidence_reason,
      validated: data.validated,
      generated_at: nowStamp(),
    };
    saveLocalJson("admiral_calendar_overview_ai", state.calendarOverviewAi);
    state.calendarGenerateStatus = null;
  } catch (error) {
    state.calendarGenerateStatus = `Could not generate AI overview (${error.message}).`;
  }
  renderEventsCalendar();
}

// Planner-added calendar context: unlike every other event source on this
// calendar (draws, holidays, sport, weather, competitor signals), these have
// no automated feed - a planner types them in directly when they spot
// something the tool wouldn't otherwise know about (a streaming launch, a
// rate-card change), same spirit as the Monthly Revision free-text field
// but as a first-class calendar entry with its own date range.
function renderManualCalendarEvents() {
  const sortedEvents = [...(state.manualCalendarEvents || [])].sort((a, b) => a.date_start.localeCompare(b.date_start));
  return `
    <div class="calendar-manual-events">
      <div class="calendar-manual-form">
        <strong>Add context event</strong>
        <p class="table-hint">For events the automated feeds above don't cover - e.g. a streaming launch or rate-card change. Impact is captured as a note for planner judgement, not fed into any calculation.</p>
        <div class="calendar-manual-form-grid">
          <div>
            <label class="field-label" for="manualEventName">Event name</label>
            <input type="text" id="manualEventName" placeholder="e.g. Rings of Power S1 launch" />
          </div>
          <div>
            <label class="field-label" for="manualEventStart">Start date</label>
            <input type="date" id="manualEventStart" min="2026-01-01" max="2026-12-31" />
          </div>
          <div>
            <label class="field-label" for="manualEventEnd">End date</label>
            <input type="date" id="manualEventEnd" min="2026-01-01" max="2026-12-31" />
          </div>
        </div>
        <label class="field-label" for="manualEventImpact">Proposed impact</label>
        <textarea id="manualEventImpact" rows="2" placeholder="e.g. Expect increased competition for attention - consider raising S1 spend"></textarea>
        ${state.manualEventFormError ? `<p class="table-hint warning-text">${state.manualEventFormError}</p>` : ""}
        <div class="config-actions">
          <button class="secondary-button" type="button" id="addManualCalendarEvent">Add event</button>
        </div>
      </div>
      ${sortedEvents.length ? `
        <div class="calendar-manual-list">
          ${sortedEvents.map((event) => `
            <div class="calendar-manual-item">
              <div>
                <strong>${event.name}</strong>
                <span>${formatDateShort(event.date_start)}${event.date_start !== event.date_end ? ` – ${formatDateShort(event.date_end)}` : ""}</span>
                <p>${event.impact}</p>
              </div>
              <button class="icon-button" type="button" data-remove-manual-event="${event.id}" title="Remove"><i data-lucide="x"></i></button>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function renderEventsCalendar() {
  // state.enrichedCalendar.calendar_principles is intentionally not rendered
  // here anymore (see conversation) - it's kept loaded in state rather than
  // stripped from the data, since it still documents how this calendar is
  // meant to be reasoned about (e.g. by a future LLM overview panel), just
  // not as visible cards on this page.
  const monthStr = state.calendarMonth;
  const monthIndex = MONTHS.indexOf(monthStr);
  const monthItems = calendarItemsForMonth(monthStr);
  const cells = buildCalendarDays(monthStr, monthItems);
  const monthLabel = new Date(`${monthStr}-01T00:00:00`).toLocaleString("en-GB", { month: "long", year: "numeric" });

  document.querySelector("#eventsCalendar").innerHTML = `
    <div class="calendar-page">
      <div class="calendar-filters">
        ${CALENDAR_FILTER_DEFS.map((filterDef) => `
          <button class="calendar-filter-btn ${state.calendarFilters[filterDef.key] ? "active" : ""}" type="button" data-calendar-filter="${filterDef.key}" style="--filter-color:${filterDef.color}">
            <span class="calendar-filter-dot"></span>${filterDef.label}
          </button>
        `).join("")}
      </div>
      ${state.liveWeatherWarnings?.stale ? `
        <div class="calendar-feed-notice">
          <i data-lucide="triangle-alert"></i>
          <span>The live Met Office weather warnings feed hasn't updated since ${formatDateShort(state.liveWeatherWarnings.feed_published_at?.slice(0, 10) || "")} - it may not reflect current conditions. Treat an empty weather warning list as "unknown", not "confirmed clear".</span>
        </div>
      ` : ""}
      <div class="calendar-layout">
        <div class="calendar-grid-wrap">
          <div class="calendar-nav">
            <button class="secondary-button" type="button" data-calendar-nav="-1" ${monthIndex <= 0 ? "disabled" : ""}>‹ Prev</button>
            <strong>${monthLabel}</strong>
            <button class="secondary-button" type="button" data-calendar-nav="1" ${monthIndex >= MONTHS.length - 1 ? "disabled" : ""}>Next ›</button>
          </div>
          <div class="calendar-weekdays">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => `<span>${day}</span>`).join("")}</div>
          <div class="calendar-days">
            ${cells.map((cell) => {
              if (!cell) return `<div class="calendar-day empty"></div>`;
              const seenTitles = new Set();
              const uniqueItems = cell.items.filter((item) => {
                if (seenTitles.has(item.title)) return false;
                seenTitles.add(item.title);
                return true;
              });
              const tagHtml = (item) => `<span class="calendar-day-tag" style="background:${categoryColor(item.category)}" title="${item.title}">${item.title}</span>`;
              return `
              <div class="calendar-day ${cell.isToday ? "today" : ""}">
                <span class="calendar-day-number">${cell.day}</span>
                <div class="calendar-day-tags">
                  ${uniqueItems.slice(0, 4).map(tagHtml).join("")}
                  ${uniqueItems.length > 4 ? `<span class="calendar-day-tag calendar-day-more">+${uniqueItems.length - 4} more</span>` : ""}
                </div>
                ${uniqueItems.length ? `
                  <div class="calendar-day-popover">
                    <span class="calendar-day-number">${cell.day}</span>
                    <div class="calendar-day-tags-full">${uniqueItems.map(tagHtml).join("")}</div>
                  </div>
                ` : ""}
              </div>
            `;
            }).join("")}
          </div>
        </div>
        <div class="calendar-overview-panel">
          <div class="calendar-overview-header">
            <strong>Monthly overview: ${monthLabel}</strong>
            <button class="secondary-button" type="button" id="generateCalendarOverview">${state.calendarOverviewAi[monthStr] ? "Regenerate" : "Generate"} AI overview</button>
          </div>
          <p class="table-hint">Deterministic summary of scheduled motoring moments, holidays and context for this month, filtered to the categories selected above.</p>
          ${renderCalendarAiOverview(monthStr)}
          ${renderCalendarOverviewGroups(monthItems)}
        </div>
      </div>
      ${renderManualCalendarEvents()}
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function renderCalendarAiOverview(monthStr) {
  if (state.calendarGenerateStatus === "Generating AI overview…") {
    return `<p class="status-loading">⏳ Generating AI overview…</p>`;
  }
  if (state.calendarGenerateStatus) {
    return `<p class="warning-text">${state.calendarGenerateStatus}</p>`;
  }

  const cached = state.calendarOverviewAi[monthStr];
  if (!cached) return "";

  return `
    <div class="calendar-ai-overview">
      <div class="source-tags">
        <span class="source-tag">${cached.confidence || "unknown"} confidence</span>
        ${cached.source_ids.map((id) => `<span class="source-tag" title="${sourceLabel(id)}">${id}</span>`).join("")}
      </div>
      <p>${cached.narrative}</p>
      ${cached.confidence_reason ? `<p class="table-hint">${cached.confidence_reason}</p>` : ""}
    </div>
  `;
}

function renderBriefingForms() {
  const plan = currentPlan();
  const featured = ["AV", "OOH", "Direct Mail", "Paid Search", "Paid Social", "Display/Programmatic"];
  const isMonthly = state.briefingFormMode === "monthly";
  if (isMonthly && !state.briefingFormMonth) state.briefingFormMonth = MONTHS[0];
  const month = state.briefingFormMonth;

  const modeToggle = `
    <div class="briefing-controls">
      <div class="view-toggle" id="briefingFormModeToggle" aria-label="Brief period">
        <button class="toggle ${!isMonthly ? "active" : ""}" type="button" data-briefing-form-mode="annual">Annual</button>
        <button class="toggle ${isMonthly ? "active" : ""}" type="button" data-briefing-form-mode="monthly">Monthly</button>
      </div>
      ${isMonthly ? `
        <select id="briefingFormMonth">
          ${MONTHS.map((m) => `<option value="${m}" ${m === month ? "selected" : ""}>${formatMonth(m)}</option>`).join("")}
        </select>
      ` : ""}
    </div>
  `;

  const cards = featured.map((channel) => {
    const total = plan.channel_totals.find((item) => item.channel === channel);
    const draftStore = isMonthly ? (state.briefingDraftsMonthly[month] || {}) : state.briefingDrafts;
    const draft = draftStore[channel] || {};
    const peak = plan.monthly_allocations
      .filter((item) => item.channel === channel)
      .sort((a, b) => b.budget_gbp - a.budget_gbp)[0];
    const monthRow = isMonthly ? plan.monthly_allocations.find((item) => item.month === month && item.channel === channel) : null;

    const metricsHtml = isMonthly ? `
      <div><dt>${formatMonth(month)} budget</dt><dd>${money.format(monthRow.budget_gbp)}</dd></div>
      <div><dt>Share of month</dt><dd>${monthRow.budget_share_pct}%</dd></div>
      <div><dt>Evidence</dt><dd>${total.evidence_strength}</dd></div>
      <div><dt>Next data needed</dt><dd>${total.evidence_strength === "brief_required_gap" ? "Measurement design and geo test readout" : "Ratecard, delivery and response curve validation"}</dd></div>
    ` : `
      <div><dt>Annual budget</dt><dd>${money.format(total.budget_gbp)}</dd></div>
      <div><dt>Peak month</dt><dd>${formatMonth(peak.month)} / ${money.format(peak.budget_gbp)}</dd></div>
      <div><dt>Evidence</dt><dd>${total.evidence_strength}</dd></div>
      <div><dt>Next data needed</dt><dd>${total.evidence_strength === "brief_required_gap" ? "Measurement design and geo test readout" : "Ratecard, delivery and response curve validation"}</dd></div>
    `;

    return `
      <div class="briefing-card">
        <div class="scenario-card-head">
          <strong>${channel}</strong>
          <span class="status-pill ${draft.status === "validated" ? "good" : "warning"}">${draft.status || "draft"}</span>
        </div>
        <dl>${metricsHtml}</dl>
        <label class="field-label" for="owner-${channel}">Owner</label>
        <input id="owner-${channel}" data-brief-channel="${channel}" data-brief-field="owner" value="${draft.owner || ""}" placeholder="Channel owner" />
        <label class="field-label" for="task-${channel}">Validation task</label>
        <textarea id="task-${channel}" rows="3" data-brief-channel="${channel}" data-brief-field="validation_task">${draft.validation_task || (isMonthly ? `Confirm any in-month bookings, rate changes or context signals for ${formatMonth(month)}.` : "Confirm ratecard, delivery constraints, measurement caveats and response expectations.")}</textarea>
        <div class="config-actions">
          <button class="secondary-button" type="button" data-brief-action="save" data-brief-channel="${channel}">Save brief</button>
          <button class="secondary-button" type="button" data-brief-action="validate" data-brief-channel="${channel}">Validate</button>
        </div>
      </div>
    `;
  }).join("");

  document.querySelector("#briefingForms").innerHTML = `${modeToggle}<div class="briefing-grid">${cards}</div>`;
}

function channelGuardrailsFeasible() {
  const channels = state.evidenceRules.channel_rules;
  const totalMaxPct = channels.reduce(
    (sum, rule) => sum + ((state.channelGuardrailOverrides[rule.channel] || {}).max_pct ?? 100),
    0
  );
  return totalMaxPct >= 100;
}

function renderChannelGuardrails() {
  const channels = state.evidenceRules.channel_rules;
  const maxPcts = channels.map((rule) => (state.channelGuardrailOverrides[rule.channel] || {}).max_pct ?? 100);
  const totalMaxPct = maxPcts.reduce((sum, value) => sum + value, 0);
  const warning = totalMaxPct < 100
    ? `<div class="guardrail-warning">
        <strong>Ceilings sum to ${totalMaxPct.toFixed(1)}%, below 100%.</strong>
        <p>The full budget can't be allocated without breaching at least one channel's ceiling. Raise one or more Max % values so they sum to at least 100%.</p>
      </div>`
    : "";

  // Two-level hierarchy per the confirmed channel breakdown: a group row
  // (the parent channel, e.g. AV) with its leaf channels beneath. Real
  // min/max/strategic-index inputs only exist for leaves the engine
  // actually allocates budget to (row.engineChannel) - the enforced
  // guardrail today is still at that old-channel granularity, so a leaf
  // with no engineChannel (e.g. Print) is shown disabled at 0%, not as a
  // working control, since there's no budget line behind it to constrain.
  // A true top-line "cap the group's combined %" control (e.g. capping
  // Performance Digital's Search+Display total together) isn't built yet -
  // that needs the allocator to support group-level constraints, not just
  // per-channel ones; each leaf below still enforces independently.
  const groupRowsHtml = CHANNEL_GROUPS.map((group) => {
    const leafRow = (row) => {
      if (!row.engineChannel) {
        return `
          <tr class="guardrail-row-disabled">
            <td>${row.label}</td>
            <td colspan="3"><span class="table-hint">No engine budget line yet - shown as £0, not independently configurable.</span></td>
          </tr>
        `;
      }
      const rule = channels.find((r) => r.channel === row.engineChannel);
      const override = state.channelGuardrailOverrides[row.engineChannel] || {};
      const minPct = override.min_pct ?? rule.strategic_floor_pct;
      const maxPct = override.max_pct ?? 100;
      const strategicIndex = override.strategic_index ?? 50;
      return `
        <tr>
          <td>${row.label}</td>
          <td><input type="number" min="0" max="100" step="0.5" value="${minPct}" data-guardrail-channel="${row.engineChannel}" data-guardrail-field="min_pct" /></td>
          <td><input type="number" min="0" max="100" step="0.5" value="${maxPct}" data-guardrail-channel="${row.engineChannel}" data-guardrail-field="max_pct" /></td>
          <td><input type="number" min="0" max="100" step="1" value="${strategicIndex}" data-guardrail-channel="${row.engineChannel}" data-guardrail-field="strategic_index" /></td>
        </tr>
      `;
    };

    if (group.rows.length === 1) {
      const singleRow = group.rows[0];
      if (!singleRow.engineChannel) {
        return `
          <tr class="category-row guardrail-row-disabled">
            <td><strong>${group.parent}</strong></td>
            <td colspan="3"><span class="table-hint">No engine budget line yet - shown as £0, not independently configurable.</span></td>
          </tr>
        `;
      }
      const rule = channels.find((r) => r.channel === singleRow.engineChannel);
      const override = state.channelGuardrailOverrides[singleRow.engineChannel] || {};
      const minPct = override.min_pct ?? rule.strategic_floor_pct;
      const maxPct = override.max_pct ?? 100;
      const strategicIndex = override.strategic_index ?? 50;
      return `
        <tr class="category-row">
          <td><strong>${group.parent}</strong></td>
          <td><input type="number" min="0" max="100" step="0.5" value="${minPct}" data-guardrail-channel="${singleRow.engineChannel}" data-guardrail-field="min_pct" /></td>
          <td><input type="number" min="0" max="100" step="0.5" value="${maxPct}" data-guardrail-channel="${singleRow.engineChannel}" data-guardrail-field="max_pct" /></td>
          <td><input type="number" min="0" max="100" step="1" value="${strategicIndex}" data-guardrail-channel="${singleRow.engineChannel}" data-guardrail-field="strategic_index" /></td>
        </tr>
      `;
    }

    return `
      <tr class="category-row"><td colspan="4"><strong>${group.parent}</strong></td></tr>
      ${group.rows.map(leafRow).join("")}
    `;
  }).join("");

  document.querySelector("#channelGuardrails").innerHTML = `
    ${warning}
    <div class="source-table-wrap">
      <table class="source-table guardrail-table">
        <thead><tr><th>Channel</th><th>Min %</th><th>Max %</th><th>Strategic Index</th></tr></thead>
        <tbody>${groupRowsHtml}</tbody>
      </table>
    </div>
    <p class="table-hint">Strategic Index (0-100, 50 = neutral) is a qualitative channel-value score - e.g. a halo effect or brand-confidence signal - that cost-per-policy and reach evidence don't capture. It tilts the model's own weighting rather than forcing an outcome, unlike Min/Max %. This is entered by a media agency strategist, drawing on the agency's own institutional planning experience and client history for this account - it is deliberately not derived from MMM or cost-per-policy data. Defaults to 50 (neutral) until a strategist overrides it.</p>
  `;
  renderGenerateGate();
}

// Generation is blocked until Step 1 (budget AND strategy provided) and
// Step 2 (channel guardrails feasible) are both satisfied. Step 3, Data
// Readiness, is deliberately not a gate - it's a review/awareness step,
// not a requirement.
function renderGenerateGate() {
  const button = document.querySelector("#generateAnnualPlan");
  const gateMessage = document.querySelector("#generateGateMessage");
  if (!button || !gateMessage) return;

  const { hasBudget, hasStrategy } = briefInputsStatus();
  const guardrailsOk = channelGuardrailsFeasible();
  const blockers = [];
  if (!hasBudget) blockers.push("Step 1: choose a budget file.");
  if (!hasStrategy) blockers.push("Step 1: add a strategy (brief file or typed context).");
  if (!guardrailsOk) blockers.push("Step 2: channel ceilings must sum to at least 100%.");

  button.disabled = blockers.length > 0;
  gateMessage.textContent = blockers.length ? `Complete before generating - ${blockers.join(" ")}` : "";
  gateMessage.className = blockers.length ? "table-hint warning-text" : "table-hint";
}

function sourceStatusClass(status) {
  if (status.includes("client") || status.includes("derived")) return "good";
  if (status.includes("synthetic") || status.includes("placeholder")) return "warning";
  return "";
}

function renderAdminUsersSection() {
  return `
    <div class="approval-card wide">
      <strong>Users &amp; Permissions</strong>
      <p class="table-hint">Controls what each named person can do in this prototype (see currentRole()/canGeneratePlans()) - real authentication would replace "viewing as" with an actual login.</p>
      <div class="source-table-wrap">
        <table class="source-table">
          <thead><tr><th>Name</th><th>Email</th><th>Org</th><th>Role</th><th></th></tr></thead>
          <tbody>
            ${state.rolePeople.map((person) => `
              <tr>
                <td><strong>${person.name}</strong></td>
                <td>${person.email || "-"}</td>
                <td>${person.org}</td>
                <td>
                  <select data-role-person="${person.name}">
                    ${Object.keys(ROLE_LABELS).map((role) => `<option value="${role}" ${role === person.role ? "selected" : ""}>${ROLE_LABELS[role]}</option>`).join("")}
                  </select>
                </td>
                <td><button class="secondary-button" type="button" data-remove-person="${person.name}">Remove</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="config-actions" style="margin-top:12px;">
        <input type="text" id="newPersonName" placeholder="Name" />
        <input type="email" id="newPersonEmail" placeholder="Email address" />
        <input type="text" id="newPersonOrg" placeholder="Org (e.g. Admiral, Media Agency)" />
        <select id="newPersonRole">
          ${Object.keys(ROLE_LABELS).map((role) => `<option value="${role}">${ROLE_LABELS[role]}</option>`).join("")}
        </select>
        <button class="secondary-button" type="button" id="addPerson">Add person</button>
      </div>
    </div>
  `;
}

function renderAdminSourcesSection() {
  const sources = state.sources.sources.map((source) => ({ ...source, ...(state.sourceOverrides[source.source_id] || {}) }));
  const statusOptions = Array.from(new Set([
    ...state.sources.sources.map((source) => source.status),
    "client_supplied",
    "client_supplied_extract",
    "derived_from_client_source",
    "external_proxy_reference",
    "official_external_reference",
    "synthetic_assumption",
    "demo_configuration",
    "needs_replacement",
  ]));
  const strengthOptions = Array.from(new Set([
    ...state.sources.sources.map((source) => source.strength),
    "primary",
    "supporting",
    "supporting_proxy",
    "placeholder",
    "non_authoritative",
  ]));
  const counts = sources.reduce((acc, source) => {
    acc[source.status] = (acc[source.status] || 0) + 1;
    return acc;
  }, {});
  return `
    <div class="approval-card wide">
      <div class="config-actions" style="justify-content:space-between; align-items:center;">
        <strong>Data Sources</strong>
        <button class="secondary-button" type="button" id="resetAdminReadiness">Reset overrides</button>
      </div>
      <div class="admin-readiness">
        <div class="readiness-summary">
          ${Object.entries(counts).map(([status, count]) => `
            <div>
              <span>${status}</span>
              <strong>${count}</strong>
            </div>
          `).join("")}
        </div>
        <div class="source-table-wrap">
          <table class="source-table">
            <thead><tr><th>Source</th><th>Path</th><th>Status</th><th>Strength</th><th>Used for</th></tr></thead>
            <tbody>
              ${sources.map((source) => `
                <tr>
                  <td>
                    <input type="text" data-source-id="${source.source_id}" data-source-field="name" value="${source.name}" />
                    <span>${source.source_id}</span>
                  </td>
                  <td><input type="text" data-source-id="${source.source_id}" data-source-field="path" value="${source.path || ""}" /></td>
                  <td>
                    <select data-source-id="${source.source_id}" data-source-field="status">
                      ${statusOptions.map((status) => `<option value="${status}" ${status === source.status ? "selected" : ""}>${status}</option>`).join("")}
                    </select>
                  </td>
                  <td>
                    <select data-source-id="${source.source_id}" data-source-field="strength">
                      ${strengthOptions.map((strength) => `<option value="${strength}" ${strength === source.strength ? "selected" : ""}>${strength}</option>`).join("")}
                    </select>
                  </td>
                  <td>${source.used_for.join(", ")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderAdminPlansSection() {
  const rows = [];
  if (state.baselinePlan) {
    rows.push({ key: "baseline", label: `${state.baselinePlan.scenario.label} (baseline)`, plan: state.baselinePlan });
  }
  state.generatedScenarios.forEach((entry) => {
    rows.push({ key: entry.stored.version_id, label: entry.plan.scenario.label, plan: entry.plan });
  });
  state.monthlyRevisionSubmissions.forEach((candidate) => {
    rows.push({ key: candidate.version_id, label: candidate.version_label, plan: candidate });
  });
  return `
    <div class="approval-card wide">
      <strong>Stored Plans</strong>
      <p class="table-hint">The 6 demo fixture scenarios are permanent reference plans and aren't removable here - only the live baseline, generated scenarios and submitted monthly revisions are.</p>
      ${rows.length ? `
        <div class="source-table-wrap">
          <table class="source-table">
            <thead><tr><th>Plan</th><th>Forecast</th><th>Cost per Policy</th><th></th></tr></thead>
            <tbody>
              ${rows.map((row) => `
                <tr>
                  <td><strong>${row.label}</strong></td>
                  <td>${number.format(row.plan.forecast_new_policy_sales)}</td>
                  <td>${costPerPolicyMoney.format(row.plan.forecast_cost_per_policy_gbp)}</td>
                  <td><button class="secondary-button" type="button" data-remove-plan="${row.key}">Remove</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      ` : `<p class="table-hint warning-text">No live stored plans yet - generate or upload one in Annual Planning, or create one in Scenarios.</p>`}
    </div>
  `;
}

function renderAdminWarningsSection() {
  const options = chatInterrogationOptions();
  const current = options.find((option) => option.key === state.adminWarningsSelectedKey) || options[0];
  if (!current) {
    return `<div class="approval-card wide"><strong>Active Warnings</strong><p class="table-hint warning-text">No stored plans available yet.</p></div>`;
  }
  const warnings = effectiveWarnings(current);
  return `
    <div class="approval-card wide">
      <strong>Active Warnings</strong>
      <p class="table-hint">These are the same warnings shown in Approval's "Active warnings" panel for each plan - edits here are what an approver sees there.</p>
      <div class="stored-scenario-buttons" style="margin: 10px 0;">
        ${options.map((option) => `
          <button class="secondary-button chat-scenario-btn ${option.key === current.key ? "active" : ""}" type="button" data-admin-warning-select="${option.key}">${option.label}</button>
        `).join("")}
      </div>
      ${warnings.length ? `
        <ul class="approval-warning-list">
          ${warnings.map((warning, index) => `
            <li>
              <div class="config-actions">
                <input type="text" data-warning-edit-key="${current.key}" data-warning-index="${index}" value="${warning.replaceAll("\"", "&quot;")}" style="flex:1;" />
                <button class="secondary-button" type="button" data-remove-warning-key="${current.key}" data-warning-index="${index}">Remove</button>
              </div>
            </li>
          `).join("")}
        </ul>
      ` : `<p class="table-hint">No warnings configured for this plan.</p>`}
      <div class="config-actions" style="margin-top:10px;">
        <input type="text" id="newWarningText" placeholder="Add a new warning for this plan" style="flex:1;" />
        <button class="secondary-button" type="button" data-add-warning-key="${current.key}">Add warning</button>
      </div>
    </div>
  `;
}

function renderAdmin() {
  const container = document.querySelector("#adminPage");
  if (currentRole() !== "admin") {
    container.innerHTML = `
      <div class="approval-card wide">
        <strong>Admins only</strong>
        <p class="table-hint warning-text">Tool configuration is restricted to Admins. You're currently viewing as ${state.viewingAs} (${ROLE_LABELS[currentRole()] || currentRole()}) and can't access this page.</p>
      </div>
    `;
    return;
  }
  container.innerHTML = [
    renderAdminUsersSection(),
    renderAdminSourcesSection(),
    renderAdminPlansSection(),
    renderAdminWarningsSection(),
  ].join("");
  if (window.lucide) window.lucide.createIcons();
}

// Same option shape/pool as Chat's plan picker (live baseline, generated
// scenarios, the 6 fixture demo plans) - approving a plan is fundamentally
// "pick which stored plan we're talking about", so this deliberately reuses
// chatInterrogationOptions() rather than maintaining a second list.
function currentApprovalOption() {
  const options = chatInterrogationOptions();
  if (!options.length) return null;
  const selected = options.find((option) => option.key === state.approvalSelectedKey);
  if (selected) return selected;
  // A scenario marked "preferred" on the Scenario tab is the planner's
  // explicit signal to move it into approval next - land here on it
  // automatically rather than making them re-find it in the button list.
  if (state.preferredScenario) {
    const preferred = options.find((option) => option.key === state.preferredScenario.scenario_id);
    if (preferred) return preferred;
  }
  const currentApproved = options.find((option) => approvalVersionId(option) === state.currentApprovedVersionId);
  return currentApproved || options.find((option) => option.kind === "live") || options[0];
}

// Unlike currentApprovalOption() (which falls back to a live/first plan so
// the Approval page always has something to show), the Current Plan page
// should only ever show a plan that has actually been approved - no
// fallback, so an unapproved draft never gets mistaken for "the plan".
function approvedPlanOption() {
  if (!state.currentApprovedVersionId) return null;
  return chatInterrogationOptions().find((option) => approvalVersionId(option) === state.currentApprovedVersionId) || null;
}

function currentPlanTableCellValue(row, mode, share = 1) {
  if (mode === "cost_per_policy") return costPerPolicyMoney.format(row.forecast_cost_per_policy_gbp);
  if (mode === "confidence") return "";
  return money.format(row.budget_gbp * share);
}

function renderCurrentPlanTableRows(plan, mode, selected) {
  const channelTotalMap = Object.fromEntries(plan.channel_totals.map((row) => [row.channel, row]));
  return tableChannelGroups().map((group) => {
    const channelRows = group.rows.map((leafRow) => {
      const channel = leafRow.engineChannel;
      const share = leafRow.share;
      const cells = MONTHS.map((month) => {
        const row = plan.monthly_allocations.find((item) => item.month === month && item.channel === channel);
        const isSelected = selected?.month === month && selected?.channel === channel;
        const confidenceClass = mode === "confidence" ? `confidence-${row.confidence.replace(" ", "-")}` : "";
        const confidenceTitle = mode === "confidence" ? ` title="Confidence: ${row.confidence}"` : "";
        return `<td class="${isSelected ? "selected" : ""}">
          <button class="${confidenceClass}" type="button" data-current-plan-month="${month}" data-current-plan-channel="${channel}"${confidenceTitle}>
            ${currentPlanTableCellValue(row, mode, share)}
          </button>
        </td>`;
      }).join("");
      const channelTotal = channelTotalMap[channel];
      const rowLabel = share < 1 ? `${leafRow.label} <span class="table-hint">(50% of ${channel})</span>` : leafRow.label;
      return `<tr class="sub-category-row"><td title="${channel}">${rowLabel}</td>${cells}<td class="total-cell">${money.format(channelTotal.budget_gbp * share)}</td></tr>`;
    }).join("");
    const groupTotal = group.rows.reduce((sum, leafRow) => sum + channelTotalMap[leafRow.engineChannel].budget_gbp * leafRow.share, 0);
    return `<tr class="category-row"><td colspan="${MONTHS.length + 1}">${group.parent}</td><td class="total-cell category-total">${money.format(groupTotal)}</td></tr>${channelRows}`;
  }).join("");
}

function renderCurrentPlanEvidence(plan, selected) {
  if (!selected) {
    return `
      <div class="section-heading compact">
        <h2>Evidence Inspector</h2>
        <span class="muted">No cell selected</span>
      </div>
      <div class="empty-state">Select a month/channel cell to see the rationale.</div>
    `;
  }
  const row = plan.monthly_allocations.find((item) => item.month === selected.month && item.channel === selected.channel);
  const channelTotal = plan.channel_totals.find((item) => item.channel === selected.channel);
  const curve = row.response_curve;
  return `
    <div class="section-heading compact">
      <h2>Evidence Inspector</h2>
      <span class="muted">${formatMonth(selected.month)} / ${selected.channel}</span>
    </div>
    <div class="evidence-block">
      ${splitChannelNoteHtml(selected.channel)}
      <div class="evidence-metrics">
        <div class="metric"><span>Monthly Budget</span><strong>${money.format(row.budget_gbp)}</strong></div>
        <div class="metric"><span>Annual Channel Budget</span><strong>${channelTotal ? money.format(channelTotal.budget_gbp) : "Not available"}</strong></div>
        <div class="metric"><span>% of Monthly Spend</span><strong>${row.budget_share_pct}%</strong></div>
        <div class="metric"><span>Forecast Cost per Policy</span><strong>${costPerPolicyMoney.format(row.forecast_cost_per_policy_gbp)}</strong></div>
        <div class="metric"><span>Confidence</span><strong class="confidence-${row.confidence.replace(" ", "-")}">${row.confidence}</strong></div>
      </div>
      <div>
        <strong>Rationale</strong>
        <p class="table-hint">${row.rationale}</p>
      </div>
      ${curve ? `
        <div class="curve-provenance">
          <div class="curve-heading">
            <strong>Response curve provenance</strong>
            <span class="source-tag">${curve.confidence}</span>
          </div>
          <dl>
            <div><dt>Type</dt><dd>${curve.curve_type}</dd></div>
            <div><dt>Anchor</dt><dd>${curve.classification}</dd></div>
            <div><dt>MMM point</dt><dd>${curve.mmm_anchor}</dd></div>
            <div><dt>External shape</dt><dd>${curve.external_shape_prior}</dd></div>
            <div><dt>Conflict status</dt><dd>${curve.agree_conflict}: ${curve.conflict_note}</dd></div>
            <div><dt>Soft saturation</dt><dd>${money.format(curve.soft_saturation_threshold_monthly_gbp)} monthly</dd></div>
            <div><dt>Carryover prior</dt><dd>${curve.adstock_half_life_weeks}</dd></div>
          </dl>
        </div>
      ` : ""}
      <div>
        <strong>Brief hooks</strong>
        <div class="source-tags">${(row.brief_hooks || []).map((hook) => `<span class="source-tag">${hook}</span>`).join("")}</div>
      </div>
      <div>
        <strong>Sources</strong>
        <div class="source-tags">${row.source_ids.map((id) => `<span class="source-tag" title="${sourceLabel(id)}">${id}</span>`).join("")}</div>
      </div>
    </div>
  `;
}

function exportCurrentPlanCsv(plan) {
  const rows = [["Channel", ...MONTHS.map(formatMonth), "Total"]];
  CHANNEL_ORDER.forEach((channel) => {
    const values = MONTHS.map((month) => {
      const row = plan.monthly_allocations.find((item) => item.month === month && item.channel === channel);
      return row ? row.budget_gbp : 0;
    });
    rows.push([channel, ...values, values.reduce((a, b) => a + b, 0)]);
  });
  const csv = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${plan.plan_id}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadCurrentPlanExcel(plan) {
  const wb = XLSX.utils.book_new();
  const summaryRows = [
    ["Plan ID", plan.plan_id],
    ["Scenario", plan.scenario.label],
    ["Total Budget (GBP)", plan.total_budget_gbp],
    ["Forecast New Policy Sales", plan.forecast_new_policy_sales],
    ["Forecast Cost per Policy (GBP)", plan.forecast_cost_per_policy_gbp],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryRows), "Summary");
  const budgetRows = [["Channel", ...MONTHS.map(formatMonth), "Total"]];
  CHANNEL_ORDER.forEach((channel) => {
    const values = MONTHS.map((month) => {
      const row = plan.monthly_allocations.find((item) => item.month === month && item.channel === channel);
      return row ? row.budget_gbp : 0;
    });
    budgetRows.push([channel, ...values, values.reduce((a, b) => a + b, 0)]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(budgetRows), "Budget by Channel-Month");
  XLSX.writeFile(wb, `${plan.plan_id}.xlsx`);
}

function renderCurrentPlan() {
  const container = document.querySelector("#currentPlanView");
  const option = approvedPlanOption();

  if (!option) {
    container.innerHTML = `
      <div class="approval-card wide">
        <strong>No plan has been approved yet</strong>
        <p class="table-hint">Approve a scenario to see its budget, policy-sales forecast, cost per new policy sale, evidence and audit trail here.</p>
      </div>
    `;
    return;
  }

  const plan = option.plan;
  const versionId = approvalVersionId(option);
  const events = approvalEventsForVersion(versionId);
  const approvedEvent = events.find((event) => event.event_type === "approved");
  const policySales = plan.channel_totals.reduce((sum, row) => sum + row.forecast_new_policy_sales, 0);
  const briefPassed = plan.brief_test?.clears_policy_sales_target && plan.brief_test?.clears_brief_cost_per_policy;
  const mode = state.currentPlanTableMode;
  const selected = state.currentPlanSelected;
  const dist = plan.distribution_summary;

  container.innerHTML = `
    <div class="approval-card wide ready">
      <strong>${plan.scenario.label}${option.kind === "fixture" ? " (demo fixture)" : ""}</strong>
      <p class="table-hint">${approvedEvent
        ? `Approved by ${approvedEvent.actor} (${approvedEvent.role}) on ${new Date(approvedEvent.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`
        : "No approval event recorded for this version yet."}</p>
    </div>

    <section class="status-strip" aria-label="Current plan status">
      <div><span>Total Budget</span><strong>${money.format(plan.total_budget_gbp)}</strong></div>
      <div><span>Forecast New Policy Sales</span><strong>${number.format(policySales)}</strong></div>
      <div><span>Forecast Cost per Policy</span><strong>${costPerPolicyMoney.format(plan.forecast_cost_per_policy_gbp)}</strong></div>
      ${plan.forecast_quote_starts ? `<div><span>Forecast Quote Starts</span><strong>${number.format(plan.forecast_quote_starts)}</strong></div>` : ""}
      ${plan.quote_to_policy_conversion_pct ? `<div><span>Quote-to-Policy Conversion</span><strong>${plan.quote_to_policy_conversion_pct}%</strong></div>` : ""}
      <div><span>Budget Check</span><strong>${plan.qa.budget_balanced && plan.qa.months_balanced ? "Balanced" : "Needs review"}</strong></div>
      <div><span>Brief &amp; Compliance Check</span><strong>${briefPassed ? "Pass" : "Needs work"}</strong></div>
    </section>
    ${dist ? `
    <div class="approval-card wide">
      <strong>Distribution (PCW) - reported separately from media</strong>
      <p class="table-hint">${dist.note} <em>${dist.generated_data_banner}</em></p>
      <section class="status-strip" aria-label="PCW distribution status">
        <div><span>PCW Visibility Index</span><strong>${dist.pcw_visibility_index}</strong></div>
        <div><span>PCW Quote Share</span><strong>${dist.quote_share_pct}%</strong></div>
        <div><span>PCW-to-Sale Conversion</span><strong>${dist.pcw_to_sale_conversion_pct}%</strong></div>
      </section>
    </div>` : ""}

    <div class="approval-card wide">
      <strong>Approval audit trail</strong>
      <div class="timeline-list">
        ${events.length ? events.map((event) => `
          <div><span>${event.event_type} / ${new Date(event.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span><p>${event.actor} (${event.role}): ${event.comment || "No comment"}</p></div>
        `).join("") : `<div><span>No events</span><p>No approval events recorded for this version yet.</p></div>`}
      </div>
    </div>

    <div class="section-heading">
      <div>
        <h2>Base Plan - Budget By Channel By Month</h2>
      </div>
      <div class="view-toggle" aria-label="Table display">
        <button class="toggle ${mode === "budget" ? "active" : ""}" type="button" data-current-plan-mode="budget">Budget</button>
        <button class="toggle ${mode === "cost_per_policy" ? "active" : ""}" type="button" data-current-plan-mode="cost_per_policy">Cost per Policy</button>
        <button class="toggle ${mode === "confidence" ? "active" : ""}" type="button" data-current-plan-mode="confidence">Confidence</button>
      </div>
      <button class="secondary-button" type="button" id="exportCurrentPlan">Export plan (CSV)</button>
      <button class="secondary-button" type="button" id="downloadCurrentPlanExcel">Download plan (Excel)</button>
    </div>
    <div class="table-wrap">
      <table class="plan-table">
        <thead>
          <tr>
            <th>Category / Channel</th>
            ${MONTHS.map((month) => `<th>${formatMonth(month)}</th>`).join("")}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${renderCurrentPlanTableRows(plan, mode, selected)}</tbody>
      </table>
    </div>
    <p class="table-hint">Select a cell to inspect evidence, rationale and questions raised. Rows are still shown per the underlying planning channel; grouped totals are in the summary below.</p>

    <div class="evidence-panel">
      ${renderCurrentPlanEvidence(plan, selected)}
    </div>
  `;
}

function selectApprovalPlan(key) {
  state.approvalSelectedKey = key;
  saveLocalJson("admiral_approval_selected_key", key);
  renderApproval();
}

// Approving is admin-only (see conversation): non-admins never see the
// comment box or this control, and this check is a defence-in-depth
// backstop in case it's ever called some other way.
function approvePlan(comment) {
  if (currentRole() !== "admin") return;
  const option = currentApprovalOption();
  if (!option) return;
  ensurePlanVersion(option);
  const versionId = approvalVersionId(option);
  recordApprovalEvent(versionId, "approved", comment);
  state.currentApprovedVersionId = versionId;
  saveLocalJson("admiral_current_approved_version_id", versionId);
  renderApproval();
  renderCurrentPlan();
}

// Shared by the Scenario Centre's own remove button and the Admin page's
// "Stored Plans" section, so there's one definition of what "removing a
// generated scenario" means rather than two copies that could drift.
function removeGeneratedScenario(versionId) {
  state.generatedScenarios = state.generatedScenarios.filter((entry) => entry.stored.version_id !== versionId);
  saveGeneratedScenarios();
  if (state.preferredScenario?.scenario_id === versionId) {
    state.preferredScenario = null;
    saveLocalJson("admiral_preferred_scenario", null);
  }
  if (state.scenarioDrilldown && state.scenarioDrilldownKey === versionId) {
    state.scenarioDrilldown = null;
    renderScenarioDrilldown();
  }
}

// Admin-only "Remove stored plans": covers the live baseline plan and any
// generated scenarios. The 6 demo fixtures are permanent reference content,
// not something a real admin could delete, so they're deliberately excluded.
function removeStoredPlan(key) {
  if (currentRole() !== "admin") return;
  if (key === "baseline") {
    state.baselinePlanId = null;
    state.baselineVersionId = null;
    state.baselinePlan = null;
    saveLocalJson("admiral_baseline_plan_id", null);
    saveLocalJson("admiral_baseline_version_id", null);
    saveLocalJson("admiral_baseline_plan", null);
  } else if (state.monthlyRevisionSubmissions.some((item) => item.version_id === key)) {
    state.monthlyRevisionSubmissions = state.monthlyRevisionSubmissions.filter((item) => item.version_id !== key);
    saveLocalJson("admiral_monthly_revision_submissions", state.monthlyRevisionSubmissions);
  } else {
    removeGeneratedScenario(key);
  }
  renderAdmin();
  renderScenarioComparison();
  renderApproval();
  renderPlanChat();
}

function addRolePerson(name, email, org, role) {
  const trimmedName = name.trim();
  if (!trimmedName || state.rolePeople.some((person) => person.name === trimmedName)) return;
  state.rolePeople = [...state.rolePeople, { name: trimmedName, email: email.trim(), org: org.trim() || "Admiral", role }];
  saveLocalJson("admiral_role_people", state.rolePeople);
  renderAdmin();
}

function removeRolePerson(name) {
  state.rolePeople = state.rolePeople.filter((person) => person.name !== name);
  saveLocalJson("admiral_role_people", state.rolePeople);
  renderAdmin();
}

function updateRolePersonRole(name, role) {
  state.rolePeople = state.rolePeople.map((person) => (person.name === name ? { ...person, role } : person));
  saveLocalJson("admiral_role_people", state.rolePeople);
  renderAdmin();
}

// "Active warnings" for a plan default to whatever qa.warnings shipped with
// it, but an admin-edited list overrides that - keyed by the same version id
// the Approval page uses, so an edit here is what Approval sees too.
function effectiveWarnings(option) {
  const versionId = approvalVersionId(option);
  return state.qaWarningOverrides[versionId] || option.plan.qa?.warnings || [];
}

function setWarningOverride(key, warnings) {
  const option = chatInterrogationOptions().find((item) => item.key === key);
  if (!option) return;
  state.qaWarningOverrides[approvalVersionId(option)] = warnings;
  saveLocalJson("admiral_qa_warning_overrides", state.qaWarningOverrides);
}

function selectAdminWarningsPlan(key) {
  state.adminWarningsSelectedKey = key;
  saveLocalJson("admiral_admin_warnings_selected_key", key);
  renderAdmin();
}

function updateWarningText(key, index, text) {
  const option = chatInterrogationOptions().find((item) => item.key === key);
  if (!option) return;
  const warnings = [...effectiveWarnings(option)];
  warnings[index] = text;
  setWarningOverride(key, warnings);
  // Approval isn't necessarily the active tab right now - switching tabs
  // only toggles CSS visibility, it never re-renders (see attachEvents) - so
  // its DOM needs an explicit refresh to pick up this edit.
  renderApproval();
}

function removeWarning(key, index) {
  const option = chatInterrogationOptions().find((item) => item.key === key);
  if (!option) return;
  const warnings = effectiveWarnings(option).filter((_, itemIndex) => itemIndex !== index);
  setWarningOverride(key, warnings);
  renderAdmin();
  renderApproval();
}

function addWarning(key, text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const option = chatInterrogationOptions().find((item) => item.key === key);
  if (!option) return;
  setWarningOverride(key, [...effectiveWarnings(option), trimmed]);
  renderAdmin();
  renderApproval();
}

function renderApproval() {
  const options = chatInterrogationOptions();
  const current = currentApprovalOption();

  if (!current) {
    document.querySelector("#approvalState").innerHTML = `<p class="table-hint warning-text">No stored plans available yet - generate or upload a plan first.</p>`;
    return;
  }

  ensurePlanVersion(current);
  const versionId = approvalVersionId(current);
  const version = state.planVersions.find((item) => item.version_id === versionId);
  const plan = current.plan;
  const isCurrentApproved = versionId === state.currentApprovedVersionId;
  const approvalStatus = version?.approval_status || "draft";
  const statusLabels = { draft: "Draft plan", review: "Ready for Admiral review", approved: "Approved version" };
  const events = approvalEventsForVersion(versionId);
  const isAdmin = currentRole() === "admin";
  const clearsPolicySalesTarget = Boolean(plan.brief_test?.clears_policy_sales_target);
  const clearsBriefCostPerPolicy = Boolean(plan.brief_test?.clears_brief_cost_per_policy);

  const isPreferred = state.preferredScenario?.scenario_id === current.key;

  document.querySelector("#approvalState").innerHTML = `
    ${isPreferred ? `
      <div class="approval-card wide preferred">
        <strong>Showing the planner's preferred scenario</strong>
        <p>${current.label} was marked "Preferred" on the Scenario tab, so it's shown here ready for review.</p>
      </div>
    ` : ""}
    <div class="approval-card wide">
      <strong>Select a stored plan to approve</strong>
      <div class="stored-scenario-buttons">
        ${options.map((option) => {
          const optionVersionId = approvalVersionId(option);
          const isApproved = optionVersionId === state.currentApprovedVersionId;
          const isOptionPreferred = state.preferredScenario?.scenario_id === option.key;
          return `
            <button class="secondary-button chat-scenario-btn ${option.key === current.key ? "active" : ""}" type="button" data-approval-select="${option.key}">
              ${option.label}${isApproved ? " · current plan" : ""}${isOptionPreferred ? " · preferred" : ""}
            </button>
          `;
        }).join("")}
      </div>
    </div>

    <div class="approval-card ${isCurrentApproved ? "ready" : ""}">
      <strong>${statusLabels[approvalStatus] || approvalStatus}${isCurrentApproved ? " · This is the current approved plan" : ""}</strong>
      <p>${plan.scenario.label} (${current.kind === "fixture" ? "demo fixture" : "live"}) · ${number.format(plan.forecast_new_policy_sales)} forecast new policy sales · ${costPerPolicyMoney.format(plan.forecast_cost_per_policy_gbp)} cost per policy · ${money.format(plan.total_budget_gbp)} budget.</p>
    </div>

    <div class="approval-card">
      <strong>QA checks</strong>
      <p>Budget balanced: ${plan.qa.budget_balanced ? "yes" : "no"}. Months balanced: ${plan.qa.months_balanced ? "yes" : "no"}. Sources on every allocation: ${plan.qa.all_allocations_have_sources ? "yes" : "no"}.</p>
    </div>

    <div class="approval-card wide">
      <strong>Active warnings</strong>
      <div class="config-actions" style="margin-bottom:10px;">
        <span class="status-pill ${clearsPolicySalesTarget ? "good" : "warning"}">${clearsPolicySalesTarget ? "Clears" : "Does not clear"} policy sales target</span>
        <span class="status-pill ${clearsBriefCostPerPolicy ? "good" : "warning"}">${clearsBriefCostPerPolicy ? "Clears" : "Does not clear"} brief cost per policy</span>
        <span class="status-pill ${plan.state_model?.status === "warning" ? "warning" : "good"}">${plan.state_model?.status || "unknown"} readiness</span>
      </div>
      ${effectiveWarnings(current).length ? `
        <ul class="approval-warning-list">
          ${effectiveWarnings(current).map((warning) => `<li>${warning}</li>`).join("")}
        </ul>
      ` : `<p class="table-hint">No open QA warnings on this plan.</p>`}
    </div>

    <div class="approval-card wide">
      ${isAdmin ? `
        <strong>Approval comments</strong>
        <textarea id="approvalComment" rows="4" placeholder="Capture Admiral, finance or media agency review comments for this plan version."></textarea>
        <div class="config-actions">
          <button class="primary-button" type="button" id="submitApproval">Approve plan</button>
        </div>
      ` : `
        <strong>Approval</strong>
        <p class="table-hint warning-text">Only Admins can approve a plan. ${ROLE_LABELS[currentRole()] || currentRole()}s can review the warnings and history below but cannot approve.</p>
      `}
    </div>

    <div class="approval-card wide">
      <strong>Approval history for this plan</strong>
      <div class="timeline-list">
        ${events.length ? events.map((event) => `
          <div><span>${event.event_type} / ${new Date(event.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span><p>${event.actor} (${event.role}): ${event.comment || "No comment"}</p></div>
        `).join("") : `<div><span>Generated</span><p>${plan.scenario.label} scenario generated. No human approval events recorded yet.</p></div>`}
      </div>
    </div>
  `;
}

function activateView(view) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === view);
  });
  const devNav = document.querySelector(".dev-nav");
  if (devNav) {
    devNav.open = ["logic", "architecture"].includes(view);
  }
  document.querySelectorAll(".view").forEach((item) => {
    item.classList.toggle("active", item.id === `view-${view}`);
  });
}

function applyInitialRoute() {
  const params = new URLSearchParams(window.location.search);
  const scenario = params.get("scenario");
  const tableMode = params.get("mode");
  const selected = params.get("select");
  const view = params.get("view") || "current-plan";

  if (scenario && state.plans[scenario]) state.scenario = scenario;
  if (["budget", "cost_per_policy", "share", "confidence"].includes(tableMode)) state.tableMode = tableMode;
  if (selected && selected.includes("|")) {
    const [month, channel] = selected.split("|");
    if (MONTHS.includes(month) && CHANNEL_ORDER.includes(channel)) {
      state.selected = { month, channel };
    }
  }
  if (params.get("demo") === "agent") state.demoMode = "agent";
  activateView(view);
}

function renderAll() {
  renderStatus();
  renderBrief();
  renderDataReadiness();
  renderTable();
  renderSummary();
  renderEvidence();
  renderLogicChallenges();
  renderArchitecture();
  renderScenarioComparison();
  renderScenarioDrilldown();
  renderMonthlyRevision();
  renderPlanChat();
  renderEventsCalendar();
  renderBriefingForms();
  renderAdmin();
  renderChannelGuardrails();
  renderApproval();
  renderCurrentPlan();
  document.querySelectorAll("#view-annual .toggle").forEach((button) => {
    button.classList.toggle("active", button.dataset.tableMode === state.tableMode);
  });
  if (window.lucide) window.lucide.createIcons();
}

function attachEvents() {
  document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".view").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const devNav = document.querySelector(".dev-nav");
      if (devNav && ["logic", "architecture"].includes(button.dataset.view)) devNav.open = true;
      document.querySelector(`#view-${button.dataset.view}`).classList.add("active");
      if (window.lucide) window.lucide.createIcons();
    });
  });

  document.querySelector("#scenarioComparison")?.addEventListener("click", (event) => {
    const preferButton = event.target.closest("[data-prefer-scenario]");
    if (preferButton) {
      state.preferredScenario = { scenario_id: preferButton.dataset.preferScenario, label: preferButton.dataset.preferLabel, selected_at: nowStamp() };
      saveLocalJson("admiral_preferred_scenario", state.preferredScenario);
      renderScenarioComparison();
      return;
    }
    const removeButton = event.target.closest("[data-remove-scenario]");
    if (removeButton) {
      removeGeneratedScenario(removeButton.dataset.removeScenario);
      renderScenarioComparison();
      return;
    }
    const viewButton = event.target.closest("[data-view-scenario]");
    if (viewButton) {
      const key = viewButton.dataset.viewScenario;
      state.scenarioDrilldownSelected = null;
      if (key === "baseline") {
        state.scenarioDrilldown = { label: "Baseline (stored)", plan: state.baselinePlan };
        state.scenarioDrilldownKey = "baseline";
      } else {
        const entry = state.generatedScenarios.find((item) => item.stored.version_id === key);
        if (entry) {
          state.scenarioDrilldown = { label: entry.plan.scenario.label, plan: entry.plan };
          state.scenarioDrilldownKey = key;
        }
      }
      renderScenarioDrilldown();
    }
  });

  document.querySelector("#scenarioBuilder")?.addEventListener("click", (event) => {
    const storedButton = event.target.closest("[data-generate-stored]");
    if (storedButton) {
      generateStoredScenario(storedButton.dataset.generateStored, storedButton.dataset.generateLabel);
      return;
    }
    if (event.target.closest("#proposeScenario")) {
      proposeScenarioFromText();
      return;
    }
    if (event.target.closest("#cancelScenarioProposal")) {
      state.scenarioProposal = null;
      renderScenarioComparison();
      return;
    }
    if (event.target.closest("#confirmScenarioProposal")) {
      generateProposedScenario();
    }
  });

  document.querySelector("#scenarioDrilldownPanel")?.addEventListener("click", (event) => {
    if (event.target.closest("#closeScenarioDrilldown")) {
      state.scenarioDrilldown = null;
      state.scenarioDrilldownKey = null;
      state.scenarioDrilldownSelected = null;
      renderScenarioDrilldown();
      return;
    }
    const cellButton = event.target.closest("button[data-scenario-month]");
    if (cellButton) {
      state.scenarioDrilldownSelected = { month: cellButton.dataset.scenarioMonth, channel: cellButton.dataset.scenarioChannel };
      renderScenarioDrilldown();
    }
  });

  document.querySelector("#scenarioBaselineNotice")?.addEventListener("click", (event) => {
    if (!event.target.closest("#useLastCreatedPlan")) return;
    useLastCreatedPlan();
  });

  document.querySelector("#scenarioBaselineNotice")?.addEventListener("change", (event) => {
    const input = event.target.closest("#uploadBasePlanInput");
    if (!input || !input.files.length) return;
    uploadBasePlanFile(input.files[0]);
  });

  document.querySelector("#preferredScenarioPanel")?.addEventListener("click", (event) => {
    if (!event.target.closest("#clearPreferredScenario")) return;
    state.preferredScenario = null;
    saveLocalJson("admiral_preferred_scenario", null);
    renderScenarioComparison();
  });

  document.querySelector("#monthlyRevision")?.addEventListener("change", (event) => {
    const select = event.target.closest("#revisionMonth");
    if (!select) return;
    state.selectedRevisionMonth = select.value;
    state.revisionDraft = null;
    saveLocalJson("admiral_selected_revision_month", state.selectedRevisionMonth);
    saveLocalJson("admiral_revision_draft", state.revisionDraft);
    renderMonthlyRevision();
  });

  document.querySelector("#monthlyRevision")?.addEventListener("input", (event) => {
    const fixture = revisionFixture();
    const nameInput = event.target.closest("#revisionPlanName");
    if (nameInput) {
      state.revisionPlanNames[fixture.month] = nameInput.value;
      saveLocalJson("admiral_revision_plan_names", state.revisionPlanNames);
      return;
    }
    const contextInput = event.target.closest("#monthlyRevisionFreeText");
    if (contextInput) {
      state.monthlyRevisionContext[fixture.month] = contextInput.value;
      saveLocalJson("admiral_monthly_revision_context", state.monthlyRevisionContext);
    }
  });

  document.querySelector("#monthlyRevision")?.addEventListener("click", (event) => {
    if (event.target.closest("#runRevision")) {
      state.revisionDraft = buildMonthlyRevisionCandidate();
      saveLocalJson("admiral_revision_draft", state.revisionDraft);
      renderMonthlyRevision();
      return;
    }
    if (event.target.closest("#approveRevisionCandidate")) {
      const candidate = state.revisionDraft || buildMonthlyRevisionCandidate();
      const nameInput = document.querySelector("#revisionPlanName");
      candidate.version_label = nameInput?.value?.trim() || `${formatMonth(candidate.revision_month)} Revised`;
      state.revisionPlanNames[candidate.revision_month] = candidate.version_label;
      saveLocalJson("admiral_revision_plan_names", state.revisionPlanNames);
      state.revisionDraft = candidate;
      saveLocalJson("admiral_revision_draft", state.revisionDraft);

      // Submitting makes this a first-class "stored plan" - selectable on
      // Approval/Chat/Admin like any other, via the same pool
      // chatInterrogationOptions() already builds for every other plan kind.
      state.monthlyRevisionSubmissions = [
        candidate,
        ...state.monthlyRevisionSubmissions.filter((item) => item.version_id !== candidate.version_id),
      ];
      saveLocalJson("admiral_monthly_revision_submissions", state.monthlyRevisionSubmissions);

      const version = {
        version_id: candidate.version_id,
        version_number: state.planVersions.length + 1,
        plan_id: candidate.plan_id,
        scenario_id: candidate.scenario.scenario_id,
        label: candidate.version_label,
        created_at: nowStamp(),
        created_by: "monthly_revision_engine",
        approval_status: "review",
        change_summary: `${candidate.version_label}: frozen past months, synthetic prior-month actuals, deterministic reallocation over remaining months.`,
        summary: planSummary(candidate),
      };
      state.planVersions = [version, ...state.planVersions.filter((item) => item.version_id !== version.version_id)];
      persistPlanVersions();

      // Uses the same actor/role-aware event recording as the Approval page,
      // rather than a hand-rolled event hardcoding "demo_user"/"planner".
      recordApprovalEvent(candidate.version_id, "review", `${candidate.version_label} routed for approval. Synthetic actuals fixture; production would link the real internal sales feed.`);

      renderMonthlyRevision();
      renderApproval();
      return;
    }
    if (event.target.closest("#downloadRevisionExcel")) {
      downloadRevisionExcel(state.revisionDraft || buildMonthlyRevisionCandidate());
    }
  });

  document.querySelector("#planChat")?.addEventListener("click", (event) => {
    if (event.target.closest("#newChatConversation")) {
      state.chatMessages = [];
      saveLocalJson("admiral_plan_chat_messages_v2", state.chatMessages);
      renderPlanChat();
      return;
    }
    const selectButton = event.target.closest("[data-chat-select]");
    if (selectButton) {
      selectChatInterrogation(selectButton.dataset.chatSelect);
      return;
    }
    const seedButton = event.target.closest("[data-seed-question]");
    if (seedButton) {
      const input = document.querySelector("#chatQuestion");
      if (input) input.value = seedButton.dataset.seedQuestion;
      askPlanChat();
      return;
    }
    const runButton = event.target.closest("[data-run-chat-scenario]");
    if (runButton) {
      runChatScenario(Number(runButton.dataset.runChatScenario));
      return;
    }
    const storeButton = event.target.closest("[data-store-chat-scenario]");
    if (storeButton) {
      storeChatScenario(Number(storeButton.dataset.storeChatScenario));
      return;
    }
    const discardButton = event.target.closest("[data-discard-chat-scenario]");
    if (discardButton) {
      discardChatScenario(Number(discardButton.dataset.discardChatScenario));
      return;
    }
    if (!event.target.closest("#askPlanChat")) return;
    askPlanChat();
  });

  document.querySelector("#eventsCalendar")?.addEventListener("click", (event) => {
    const navButton = event.target.closest("[data-calendar-nav]");
    if (navButton) {
      const currentIndex = MONTHS.indexOf(state.calendarMonth);
      const nextIndex = Math.min(Math.max(currentIndex + Number(navButton.dataset.calendarNav), 0), MONTHS.length - 1);
      state.calendarMonth = MONTHS[nextIndex];
      state.calendarGenerateStatus = null;
      saveLocalJson("admiral_calendar_month", state.calendarMonth);
      renderEventsCalendar();
      return;
    }
    const filterButton = event.target.closest("[data-calendar-filter]");
    if (filterButton) {
      const key = filterButton.dataset.calendarFilter;
      state.calendarFilters[key] = !state.calendarFilters[key];
      saveLocalJson("admiral_calendar_filters", state.calendarFilters);
      renderEventsCalendar();
      return;
    }
    if (event.target.closest("#generateCalendarOverview")) {
      generateCalendarAiOverview();
      return;
    }
    if (event.target.closest("#addManualCalendarEvent")) {
      const nameInput = document.querySelector("#manualEventName");
      const startInput = document.querySelector("#manualEventStart");
      const endInput = document.querySelector("#manualEventEnd");
      const impactInput = document.querySelector("#manualEventImpact");
      const name = nameInput.value.trim();
      const dateStart = startInput.value;
      const dateEnd = endInput.value || dateStart;
      const impact = impactInput.value.trim();
      if (!name || !dateStart || !impact) {
        state.manualEventFormError = "Event name, start date and proposed impact are all required.";
        renderEventsCalendar();
        return;
      }
      if (dateEnd < dateStart) {
        state.manualEventFormError = "End date can't be before the start date.";
        renderEventsCalendar();
        return;
      }
      state.manualEventFormError = null;
      state.manualCalendarEvents = [
        ...state.manualCalendarEvents,
        { id: `manual-${nowStamp()}-${Math.round(Math.random() * 1e6)}`, name, date_start: dateStart, date_end: dateEnd, impact, created_at: nowStamp() },
      ];
      saveLocalJson("admiral_manual_calendar_events", state.manualCalendarEvents);
      renderEventsCalendar();
      return;
    }
    const removeButton = event.target.closest("[data-remove-manual-event]");
    if (removeButton) {
      const eventId = removeButton.dataset.removeManualEvent;
      state.manualCalendarEvents = state.manualCalendarEvents.filter((item) => item.id !== eventId);
      saveLocalJson("admiral_manual_calendar_events", state.manualCalendarEvents);
      renderEventsCalendar();
    }
  });

  document.querySelectorAll(".toggle[data-table-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".toggle[data-table-mode]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.tableMode = button.dataset.tableMode;
      renderTable();
      renderEvidence();
    });
  });

  document.querySelectorAll(".toggle[data-summary-chart-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.summaryChartMode = button.dataset.summaryChartMode;
      renderSummary();
    });
  });

  document.querySelector("#agentLogicConfigurator")?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-config-action]");
    if (!action) return;
    const card = action.closest("[data-agent-config]");
    const agentId = card.dataset.agentConfig;
    if (action.dataset.configAction === "reset") {
      delete state.agentConfigOverrides[agentId];
    } else {
      const override = {};
      card.querySelectorAll("[data-config-field]").forEach((field) => {
        override[field.dataset.configField] = field.type === "number" ? Number(field.value) : field.value;
      });
      state.agentConfigOverrides[agentId] = override;
    }
    saveLocalJson("admiral_agent_config_overrides", state.agentConfigOverrides);
    renderAgentConfigurator();
    if (window.lucide) window.lucide.createIcons();
  });

  document.querySelector("#logicHarness")?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-logic-feedback]");
    if (!action) return;
    const card = action.closest("[data-logic-option]");
    if (!card) return;
    const logicId = card.dataset.logicOption;
    const current = state.logicFeedback[logicId] || { useful: 0, risky: 0 };
    if (action.dataset.logicFeedback === "reset") {
      delete state.logicFeedback[logicId];
    } else {
      current[action.dataset.logicFeedback] = (current[action.dataset.logicFeedback] || 0) + 1;
      state.logicFeedback[logicId] = current;
    }
    saveLocalJson("admiral_logic_feedback", state.logicFeedback);
    renderLogicChallenges();
  });

  document.querySelector("#briefingForms")?.addEventListener("click", (event) => {
    const modeButton = event.target.closest("[data-briefing-form-mode]");
    if (modeButton) {
      state.briefingFormMode = modeButton.dataset.briefingFormMode;
      renderBriefingForms();
      return;
    }
    const button = event.target.closest("[data-brief-action]");
    if (!button) return;
    const isMonthly = state.briefingFormMode === "monthly";
    const month = state.briefingFormMonth;
    const channel = button.dataset.briefChannel;
    const fields = [...document.querySelectorAll(`[data-brief-channel="${CSS.escape(channel)}"][data-brief-field]`)];
    const draftStore = isMonthly ? (state.briefingDraftsMonthly[month] = state.briefingDraftsMonthly[month] || {}) : state.briefingDrafts;
    const draft = { ...(draftStore[channel] || {}), updated_at: nowStamp(), status: button.dataset.briefAction === "validate" ? "validated" : "draft" };
    fields.forEach((field) => {
      draft[field.dataset.briefField] = field.value;
    });
    draftStore[channel] = draft;
    saveLocalJson(isMonthly ? "admiral_briefing_drafts_monthly" : "admiral_briefing_drafts", isMonthly ? state.briefingDraftsMonthly : state.briefingDrafts);
    renderBriefingForms();
  });

  document.querySelector("#briefingForms")?.addEventListener("change", (event) => {
    const monthSelect = event.target.closest("#briefingFormMonth");
    if (!monthSelect) return;
    state.briefingFormMonth = monthSelect.value;
    renderBriefingForms();
  });

  document.querySelector("#exportBriefs")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ exported_at: nowStamp(), scenario_id: state.scenario, annual_drafts: state.briefingDrafts, monthly_drafts: state.briefingDraftsMonthly }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admiral-channel-briefs-${state.scenario}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  document.querySelector("#adminPage")?.addEventListener("change", (event) => {
    const sourceField = event.target.closest("[data-source-id]");
    if (sourceField) {
      const sourceId = sourceField.dataset.sourceId;
      state.sourceOverrides[sourceId] = { ...(state.sourceOverrides[sourceId] || {}), [sourceField.dataset.sourceField]: sourceField.value };
      saveLocalJson("admiral_source_overrides", state.sourceOverrides);
      renderAdmin();
      return;
    }
    const roleField = event.target.closest("[data-role-person]");
    if (roleField) {
      updateRolePersonRole(roleField.dataset.rolePerson, roleField.value);
      return;
    }
    const warningField = event.target.closest("[data-warning-edit-key]");
    if (warningField) {
      updateWarningText(warningField.dataset.warningEditKey, Number(warningField.dataset.warningIndex), warningField.value);
    }
  });

  document.querySelector("#adminPage")?.addEventListener("click", (event) => {
    if (event.target.closest("#resetAdminReadiness")) {
      state.sourceOverrides = {};
      saveLocalJson("admiral_source_overrides", state.sourceOverrides);
      renderAdmin();
      return;
    }
    if (event.target.closest("#addPerson")) {
      const name = document.querySelector("#newPersonName")?.value || "";
      const email = document.querySelector("#newPersonEmail")?.value || "";
      const org = document.querySelector("#newPersonOrg")?.value || "";
      const role = document.querySelector("#newPersonRole")?.value || "user";
      addRolePerson(name, email, org, role);
      return;
    }
    const removePersonButton = event.target.closest("[data-remove-person]");
    if (removePersonButton) {
      removeRolePerson(removePersonButton.dataset.removePerson);
      return;
    }
    const removePlanButton = event.target.closest("[data-remove-plan]");
    if (removePlanButton) {
      removeStoredPlan(removePlanButton.dataset.removePlan);
      return;
    }
    const warningSelectButton = event.target.closest("[data-admin-warning-select]");
    if (warningSelectButton) {
      selectAdminWarningsPlan(warningSelectButton.dataset.adminWarningSelect);
      return;
    }
    const removeWarningButton = event.target.closest("[data-remove-warning-key]");
    if (removeWarningButton) {
      removeWarning(removeWarningButton.dataset.removeWarningKey, Number(removeWarningButton.dataset.warningIndex));
      return;
    }
    const addWarningButton = event.target.closest("[data-add-warning-key]");
    if (addWarningButton) {
      const input = document.querySelector("#newWarningText");
      addWarning(addWarningButton.dataset.addWarningKey, input?.value || "");
      if (input) input.value = "";
    }
  });

  document.querySelector("#channelGuardrails")?.addEventListener("change", (event) => {
    const field = event.target.closest("[data-guardrail-channel]");
    if (!field) return;
    const channel = field.dataset.guardrailChannel;
    state.channelGuardrailOverrides[channel] = {
      ...(state.channelGuardrailOverrides[channel] || {}),
      [field.dataset.guardrailField]: Number(field.value),
    };
    saveLocalJson("admiral_channel_guardrail_overrides", state.channelGuardrailOverrides);
    renderChannelGuardrails();
  });

  document.querySelector("#resetChannelGuardrails")?.addEventListener("click", () => {
    state.channelGuardrailOverrides = {};
    saveLocalJson("admiral_channel_guardrail_overrides", state.channelGuardrailOverrides);
    renderChannelGuardrails();
  });

  document.querySelector("#approvalState")?.addEventListener("click", (event) => {
    const selectButton = event.target.closest("[data-approval-select]");
    if (selectButton) {
      selectApprovalPlan(selectButton.dataset.approvalSelect);
      return;
    }
    if (event.target.closest("#submitApproval")) {
      const comment = document.querySelector("#approvalComment")?.value || "";
      approvePlan(comment);
      renderStatus();
    }
  });

  document.querySelector("#planTable").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-month]");
    if (!button) return;
    state.selected = { month: button.dataset.month, channel: button.dataset.channel };
    renderTable();
    renderEvidence();
  });

  document.querySelector("#currentPlanView")?.addEventListener("click", (event) => {
    const modeButton = event.target.closest("[data-current-plan-mode]");
    if (modeButton) {
      state.currentPlanTableMode = modeButton.dataset.currentPlanMode;
      renderCurrentPlan();
      return;
    }
    const cellButton = event.target.closest("button[data-current-plan-month]");
    if (cellButton) {
      state.currentPlanSelected = { month: cellButton.dataset.currentPlanMonth, channel: cellButton.dataset.currentPlanChannel };
      renderCurrentPlan();
      return;
    }
    const option = approvedPlanOption();
    if (!option) return;
    if (event.target.closest("#exportCurrentPlan")) exportCurrentPlanCsv(option.plan);
    if (event.target.closest("#downloadCurrentPlanExcel")) downloadCurrentPlanExcel(option.plan);
  });

  document.querySelector("#generateAnnualPlan")?.addEventListener("click", generateAnnualPlanFromUpload);
  document.querySelector("#budgetFileInput")?.addEventListener("change", () => {
    renderGenerateGate();
    renderBrief();
  });
  document.querySelector("#briefFileInput")?.addEventListener("change", () => {
    renderBrief();
    renderGenerateGate();
  });
  document.querySelector("#briefTextContext")?.addEventListener("input", () => {
    renderBrief();
    renderGenerateGate();
  });
  document.querySelector("#exportAnnualPlan")?.addEventListener("click", exportAnnualPlanCsv);
  document.querySelector("#downloadPlanExcel")?.addEventListener("click", downloadPlanExcel);
  document.querySelector("#refreshDataReadiness")?.addEventListener("click", fetchLiveSources);
  document.querySelector("#dataReadinessTableWrap")?.addEventListener("click", (event) => {
    const sourceButton = event.target.closest("[data-toggle-source]");
    if (sourceButton) {
      const sourceKey = sourceButton.dataset.toggleSource;
      state.dataReadinessSourceExpanded[sourceKey] = !state.dataReadinessSourceExpanded[sourceKey];
      renderDataReadiness();
      return;
    }
    const button = event.target.closest("[data-toggle-category]");
    if (!button) return;
    const categoryId = button.dataset.toggleCategory;
    state.dataReadinessExpanded[categoryId] = !state.dataReadinessExpanded[categoryId];
    renderDataReadiness();
  });
}

// Shared by all three ways of establishing a base plan: generating one from
// an upload, loading the last created one, or importing a downloaded one -
// each returns the same {plan, stored, [budget_targets]} shape.
function saveGeneratedScenarios() {
  saveLocalJson("admiral_generated_scenarios", state.generatedScenarios);
}

// One-in-one-out cap on stored scenarios (~5-10 requested, 8 chosen as the
// midpoint) so the Scenario Centre doesn't grow unbounded. The scenario
// marked "preferred" is protected from eviction; otherwise the oldest
// generated scenario is dropped first.
const MAX_STORED_SCENARIOS = 8;

function addGeneratedScenario(entry) {
  state.generatedScenarios = [...state.generatedScenarios, entry];
  while (state.generatedScenarios.length > MAX_STORED_SCENARIOS) {
    const evictIndex = state.generatedScenarios.findIndex(
      (item) => item.stored.version_id !== state.preferredScenario?.scenario_id
    );
    state.generatedScenarios.splice(evictIndex === -1 ? 0 : evictIndex, 1);
  }
  saveGeneratedScenarios();
}

function applyBaselineResponse(data) {
  state.baselinePlanId = data.stored?.plan_id ?? null;
  state.baselineVersionId = data.stored?.version_id ?? null;
  state.baselinePlan = data.plan;
  state.baselineBudgetTargets = data.budget_targets ?? state.baselineBudgetTargets ?? null;
  // A new baseline invalidates any scenarios generated from the previous
  // one (they're built on that old version_id), so the comparison list
  // resets alongside it - same reasoning as clearing scenarioDrilldown/
  // scenarioProposal below.
  state.generatedScenarios = [];
  state.scenarioProposal = null;
  state.scenarioDrilldown = null;
  state.scenarioDrilldownKey = null;
  saveLocalJson("admiral_baseline_plan_id", state.baselinePlanId);
  saveLocalJson("admiral_baseline_version_id", state.baselineVersionId);
  saveLocalJson("admiral_baseline_plan", state.baselinePlan);
  saveLocalJson("admiral_baseline_budget_targets", state.baselineBudgetTargets);
  saveGeneratedScenarios();
}

async function useLastCreatedPlan() {
  state.scenarioGenerateStatus = "Loading the last created plan…";
  renderScenarioComparison();
  try {
    const response = await fetch(`${LIVE_API_BASE}/api/plans/latest`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || `${response.status} ${response.statusText}`);
    applyBaselineResponse(data);
    state.scenarioGenerateStatus = null;
  } catch (error) {
    state.scenarioGenerateStatus = `Could not load the last created plan: ${error.message}`;
  }
  renderScenarioComparison();
}

async function uploadBasePlanFile(file) {
  if (!file) return;
  state.scenarioGenerateStatus = `Importing ${file.name}…`;
  renderScenarioComparison();
  const formData = new FormData();
  formData.append("plan_file", file);
  try {
    const response = await fetch(`${LIVE_API_BASE}/api/plans/import`, { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || `${response.status} ${response.statusText}`);
    applyBaselineResponse(data);
    state.scenarioGenerateStatus = null;
  } catch (error) {
    state.scenarioGenerateStatus = `Could not import ${file.name}: ${error.message}`;
  }
  renderScenarioComparison();
}

// Planners never need to see or edit JSON/code - the visible sheets below
// are plain Excel tables. A hidden "_PlanData" sheet carries the full plan
// losslessly (chunked across rows, since a single Excel cell is capped at
// ~32,767 characters) purely so re-uploading this exact file on the
// Scenarios page restores the exact plan, not a re-derived approximation.
function downloadPlanExcel() {
  if (!state.baselinePlan || !state.baselineBudgetTargets) return;
  const plan = state.baselinePlan;
  const wb = XLSX.utils.book_new();

  const summaryRows = [
    ["Plan ID", plan.plan_id],
    ["Scenario", plan.scenario.label],
    ["Total Budget (GBP)", plan.total_budget_gbp],
    ["Forecast New Policy Sales", plan.forecast_new_policy_sales],
    ["Forecast Cost per Policy (GBP)", plan.forecast_cost_per_policy_gbp],
    [],
    ["Policy Sales Target", plan.brief_test.policy_sales_target],
    ["Brief Cost per Policy Target (GBP)", plan.brief_test.brief_cost_per_policy_gbp],
    ["Clears Policy Sales Target", plan.brief_test.clears_policy_sales_target ? "Yes" : "No"],
    ["Clears Brief Cost per Policy", plan.brief_test.clears_brief_cost_per_policy ? "Yes" : "No"],
    [],
    ["Scenario Assumption", plan.scenario.scenario_assumption || plan.scenario.freeform_prompt || ""],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryRows), "Summary");

  const budgetRows = [["Channel", ...MONTHS.map(formatMonth), "Total"]];
  CHANNEL_ORDER.forEach((channel) => {
    const values = MONTHS.map((month) => {
      const row = plan.monthly_allocations.find((item) => item.month === month && item.channel === channel);
      return row ? row.budget_gbp : 0;
    });
    budgetRows.push([channel, ...values, values.reduce((a, b) => a + b, 0)]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(budgetRows), "Budget by Channel-Month");

  const acquisitionRows = [["Channel", ...MONTHS.map(formatMonth), "Total"]];
  CHANNEL_ORDER.forEach((channel) => {
    const values = MONTHS.map((month) => {
      const row = plan.monthly_allocations.find((item) => item.month === month && item.channel === channel);
      return row ? row.forecast_new_policy_sales : 0;
    });
    acquisitionRows.push([channel, ...values, values.reduce((a, b) => a + b, 0)]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(acquisitionRows), "New Policy Sales by Channel-Month");

  const evidenceRows = [["Month", "Channel", "Budget (GBP)", "Confidence", "Rationale", "Brief Hooks", "Sources"]];
  plan.monthly_allocations.forEach((row) => {
    evidenceRows.push([
      formatMonth(row.month),
      row.channel,
      row.budget_gbp,
      row.confidence,
      row.rationale,
      (row.brief_hooks || []).join(", "),
      (row.source_ids || []).join(", "),
    ]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(evidenceRows), "Rationale & Evidence");

  const payload = JSON.stringify({ plan, budget_targets: state.baselineBudgetTargets });
  const chunkSize = 30000;
  const chunks = [];
  for (let i = 0; i < payload.length; i += chunkSize) chunks.push([payload.slice(i, i + chunkSize)]);
  const dataSheet = XLSX.utils.aoa_to_sheet([["ADMIRAL_PLAN_EXPORT_V1"], ...chunks]);
  XLSX.utils.book_append_sheet(wb, dataSheet, "_PlanData");
  const dataSheetIndex = wb.SheetNames.indexOf("_PlanData");
  wb.Workbook = wb.Workbook || {};
  wb.Workbook.Sheets = wb.Workbook.Sheets || [];
  wb.Workbook.Sheets[dataSheetIndex] = { Hidden: 1 };

  XLSX.writeFile(wb, `${plan.plan_id}.xlsx`);
}

// A revision candidate isn't a full plan object (no brief_test, no
// media_owner_allocations) and isn't meant to be re-uploaded as a base plan,
// so this is a smaller, human-readable-only export rather than reusing
// downloadPlanExcel()'s hidden round-trip data sheet.
function downloadRevisionExcel(candidate) {
  const wb = XLSX.utils.book_new();

  const summaryRows = [
    ["Plan ID", candidate.plan_id],
    ["Scenario", candidate.scenario.label],
    ["Revision Month", formatMonth(candidate.revision_month)],
    ["Prior Month (actuals basis)", formatMonth(candidate.prior_month)],
    ["Total Budget (GBP)", candidate.total_budget_gbp],
    ["Forecast New Policy Sales", candidate.forecast_new_policy_sales],
    ["Forecast Cost per Policy (GBP)", candidate.forecast_cost_per_policy_gbp],
    [],
    ["Status", "Draft revision candidate - requires approval before becoming plan truth."],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryRows), "Summary");

  const budgetRows = [["Channel", ...MONTHS.map(formatMonth), "Total"]];
  CHANNEL_ORDER.forEach((channel) => {
    const values = MONTHS.map((month) => {
      const row = candidate.monthly_allocations.find((item) => item.month === month && item.channel === channel);
      return row ? row.budget_gbp : 0;
    });
    budgetRows.push([channel, ...values, values.reduce((a, b) => a + b, 0)]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(budgetRows), "Budget by Channel-Month");

  const evidenceRows = [["Month", "Channel", "Frozen", "Budget (GBP)", "Reason"]];
  candidate.monthly_allocations.forEach((row) => {
    evidenceRows.push([
      formatMonth(row.month),
      row.channel,
      row.frozen ? "Yes" : "No",
      row.budget_gbp,
      row.revision_reason || "",
    ]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(evidenceRows), "Revision Reasons");

  XLSX.writeFile(wb, `${candidate.plan_id}.xlsx`);
}

async function generateAnnualPlanFromUpload() {
  if (!canGeneratePlans()) return; // defense-in-depth; the control is already hidden for viewers

  const budgetInput = document.querySelector("#budgetFileInput");
  const briefInput = document.querySelector("#briefFileInput");
  const briefTextInput = document.querySelector("#briefTextContext");
  const statusEl = document.querySelector("#generateStatus");
  const button = document.querySelector("#generateAnnualPlan");

  const { hasBudget, hasStrategy } = briefInputsStatus();
  if (!hasBudget || !hasStrategy) {
    statusEl.textContent = "Add a budget file and a strategy (brief file or typed context) first.";
    statusEl.className = "table-hint warning-text";
    return;
  }

  const formData = new FormData();
  formData.append("budget_file", budgetInput.files[0]);
  if (briefInput.files.length) {
    formData.append("brief_file", briefInput.files[0]);
  }
  if (briefTextInput.value.trim()) {
    formData.append("brief_text", briefTextInput.value.trim());
  }

  // Channel guardrails are a per-run scenario setting (Step 2), not a
  // silent default - only sent when this run's Min/Max % differ from the
  // no-constraint baseline (min = fixture floor, max = 100).
  const channelFloors = {};
  const channelCaps = {};
  const channelIndex = {};
  state.evidenceRules.channel_rules.forEach((rule) => {
    const override = state.channelGuardrailOverrides[rule.channel] || {};
    const minPct = override.min_pct ?? rule.strategic_floor_pct;
    const maxPct = override.max_pct ?? 100;
    const strategicIndex = override.strategic_index ?? 50;
    if (minPct !== rule.strategic_floor_pct) channelFloors[rule.channel] = minPct;
    if (maxPct !== 100) channelCaps[rule.channel] = maxPct;
    if (strategicIndex !== 50) channelIndex[rule.channel] = strategicIndex;
  });
  if (Object.keys(channelFloors).length) formData.append("channel_floors", JSON.stringify(channelFloors));
  if (Object.keys(channelCaps).length) formData.append("channel_caps", JSON.stringify(channelCaps));
  if (Object.keys(channelIndex).length) formData.append("channel_index", JSON.stringify(channelIndex));

  button.disabled = true;
  statusEl.textContent = "Generating base plan…";
  statusEl.className = "table-hint";

  try {
    const response = await fetch(`${LIVE_API_BASE}/api/annual-plan/generate`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || `${response.status} ${response.statusText}`);
    }

    state.annualUploadedPlan = data.plan;
    state.annualCompleteness = data.completeness;
    state.annualBriefPreview = data.brief_text_preview;
    state.annualBriefFilename = data.brief_filename;
    state.selected = null;

    applyBaselineResponse(data);

    const briefNote = data.brief_filename
      ? ` + ${data.brief_filename}`
      : (data.brief_text_preview ? " + typed context" : "");
    statusEl.textContent = `Generated from ${budgetInput.files[0].name}${briefNote}.`;
    statusEl.className = "table-hint";
    renderAll();
  } catch (error) {
    statusEl.textContent = `Could not generate a plan: ${error.message}`;
    statusEl.className = "table-hint warning-text";
  } finally {
    button.disabled = false;
  }
}

function exportAnnualPlanCsv() {
  const plan = currentPlan();
  const rows = [["Channel", ...MONTHS.map(formatMonth), "Total"]];
  CHANNEL_ORDER.forEach((channel) => {
    const values = MONTHS.map((month) => {
      const row = plan.monthly_allocations.find((item) => item.month === month && item.channel === channel);
      return row ? row.budget_gbp : 0;
    });
    rows.push([channel, ...values, values.reduce((a, b) => a + b, 0)]);
  });
  const csv = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${plan.plan_id}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

loadData()
  .then(() => {
    applyInitialRoute();
    renderAll();
    attachEvents();
    fetchLiveSources(); // fire-and-forget: Data Readiness fills in once the API responds
  })
  .catch((error) => {
    document.body.innerHTML = `<main style="font-family: system-ui, sans-serif; padding: 32px; max-width: 760px;">
      <h1>Prototype failed to load</h1>
      <p><strong>${error.message}</strong></p>
      <p>This usually means the page was opened directly as a file instead of served over <code>http://</code> - the demo fetches its data files (<code>../data/*.json</code>) and needs a local web server, not a <code>file://</code> URL.</p>
      <p>Try the local URL provided for this demo, then hard refresh if needed.</p>
    </main>`;
  });
