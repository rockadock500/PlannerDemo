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
  "CTV & Streaming",
  "Programmatic Display",
  "Online Video",
  "Meta",
];

// bp scenario library. Each id has a matching
// data/generated_plan_<id>.json fixture with the full month x channel plan
// for that scenario.
const SCENARIOS = ["balanced_growth", "brand_trust_build", "pcw_conversion_defence", "multicar_household_growth", "young_driver_telematics", "ev_growth"];

// bp planning taxonomy. This groups each engine channel by MEDIA ROLE -
// reach vs consideration vs demand capture, etc - which is a different axis
// from the display-hierarchy CHANNEL_GROUPS further down (parent/child
// labelling like "Google Search" -> "Search"). Affiliates is its own engine
// channel with real budget (channel_totals etc.), same as every other
// channel here - plan.distribution_summary is a separate, additional
// performance metric (visibility/conversion), not a substitute for it.
const CHANNEL_ROLE_GROUP_LABELS = {
  brand_reach: "Premium reach",
  video_consideration: "Video and consideration",
  precision_targeting: "GBE precision targeting",
  social_amplification: "Social amplification",
};
const CHANNEL_ROLE_GROUP = {
  "CTV & Streaming": "brand_reach",
  "Online Video": "video_consideration",
  "Programmatic Display": "precision_targeting",
  "Meta": "social_amplification",
};

// Data-readiness groups (research brief section 4) - used to classify
// data/source_registry.json entries via each source's `readiness_group`
// field. Admin/registry-driven counts should read source_registry.json
// directly rather than hard-coding totals here.
const DATA_READINESS_GROUP_LABELS = {
  effectiveness_modelling: "Effectiveness & Modelling",
  quote_policy_renewal: "Engagement & Delivery Performance",
  pcw_distribution: "Financial Market & Signal Data",
  customer_vehicle_audience: "GBE Audience Data",
  pricing_risk_guardrails: "Brand Safety & Compliance Guardrails",
  plans_budgets_creative_approvals: "Plans, Budgets, Creative & Approvals",
  digital_crm_platform: "Platform & Pipeline Data",
  market_competitor_context: "Market, Calendar & Context Signals",
  media_owner_channel: "Media Owner & Channel Data",
};

const CALENDAR_FILTER_DEFS = [
  { key: "bank_holiday", label: "Bank holidays", color: "var(--blue)" },
  { key: "school_holiday", label: "School holidays", color: "var(--gold)" },
  { key: "sport", label: "Sport", color: "var(--green)" },
  { key: "campaign", label: "Competitor campaigns", color: "var(--red-dark)" },
  { key: "manual", label: "Planner-added context", color: "var(--purple)" },
  { key: "other", label: "Other context", color: "var(--muted)" },
];

const logicChallenges = [
  {
    area: "Objective Function",
    title: "What is the plan really optimising?",
    body: "V1 balances GBE engagements, cost per engagement and strategic audience weight. bp needs to confirm whether final optimisation is GBE engagements, view-through, verified GBE reach or a blended score.",
    status: "big",
  },
  {
    area: "Scenario Logic",
    title: "Are Blended, Brand Awareness, GBE Precision Reach and the other stored scenarios templates or freeform strategies?",
    body: "The prototype treats them as strategy weights. The final planner may need locked scenario templates, freeform prompts, or both with approval controls.",
    status: "big",
  },
  {
    area: "Evidence Standard",
    title: "What evidence is enough for sign-off?",
    body: "Every cell has named sources and rationale, but real confidence depends on the7stars BigQuery history, IPSOS IGI, BP Signal and media-owner ratecard quality.",
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
    body: "Loads scoped budget, financial calendar, IPSOS IGI, BP Signal, benchmark and source context.",
  },
  {
    name: "Scenario Interpreter",
    type: "LLM",
    body: "Turns freeform strategy into weights and constraints.",
  },
  {
    name: "Deterministic Planner",
    type: "code",
    body: "Allocates budget, rescales totals, forecasts cost-per-engagement ranges and validates arithmetic.",
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
    body: "Tracks bp Corporate Comms sign-off now, with the7stars planning and compliance review alongside.",
  },
  {
    name: "Future Channel Agents",
    type: "expandable",
    body: "CTV, display, video, social and audience agents can be added when data depth justifies them.",
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
  viewingAs: "bp Planner",
  liveSources: null,
  dataSourceDictionary: null,
  syntheticFixture: null,
  dataReadinessExpanded: {},
  dataReadinessSourceExpanded: {},
  rolePeople: null,
  qaWarningOverrides: {},
  adminWarningsSelectedKey: null,
};

// Display hierarchy: one parent group per engine channel (CHANNEL_ORDER
// above). Every channel here is a single, whole line - no 50/50 splitting
// needed, unlike the previous 8-channel model where a few display leaves had
// to share one engine number.
const CHANNEL_GROUPS = [
  { parent: "CTV & Streaming", rows: [{ label: "CTV & Streaming", engineChannel: "CTV & Streaming", share: 1 }], note: null },
  { parent: "Programmatic Display", rows: [{ label: "Programmatic Display", engineChannel: "Programmatic Display", share: 1 }], note: null },
  { parent: "Online Video", rows: [{ label: "Online Video", engineChannel: "Online Video", share: 1 }], note: null },
  { parent: "Meta", rows: [{ label: "Meta (Facebook/Instagram)", engineChannel: "Meta", share: 1 }], note: null },
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
  { name: "bp Planner", org: "bp", role: "user" },
  { name: "bp Approver", org: "bp", role: "admin" },
  { name: "Media Agency Strategist", org: "Media Agency", role: "user" },
  { name: "Data Steward", org: "bp", role: "admin" },
  { name: "Read-only Viewer", org: "bp", role: "viewer" },
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
    forecast_clicks: plan.forecast_clicks,
    target_visitors: plan.target_visitors,
    cost_per_click_gbp: plan.cost_per_click,
    total_budget_gbp: plan.total_budget_gbp,
  };
}

// Versions are created when a planner plan is first looked at on Approval (ensurePlanVersion).
function seedPlanVersions() {
  return loadLocalJson("bp_plan_versions", []);
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

function persistPlanVersions() {
  saveLocalJson("bp_plan_versions", state.planVersions);
}

// Every option storedPlanOptions() surfaces needs a stable version_id to
// record approval events against. Revisions carry their own; fixtures fall
// back to the same synthetic id seedPlanVersions() gave them.
function approvalVersionId(option) {
  return option.versionId;
}

// Submitted revisions don't automatically get a planVersions entry the way
// the 6 fixtures do at bootstrap - this lazily
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
    created_by: option.kind === "base" ? "campaign_planning" : "scenario_centre",
    approval_status: "draft",
    change_summary: option.kind === "base" ? "Generated in Campaign Planning." : `${option.label} built from the base plan.`,
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
  saveLocalJson("bp_approval_events", state.approvalEvents);
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

  const [plans, brief, sources, briefPriorities, enrichedCalendar, bankHolidays, curatedSportsEvents, compositeSchoolHolidays, competitorCampaignSignals, liveWeatherWarnings, weather, monthlyRevisionData, agentConfig, agentTraces, logicEval, evidenceRules, dataSourceDictionary, syntheticFixture] = await Promise.all([
    Promise.all(SCENARIOS.map((scenario) => load(`./data/generated_plan_${scenario}.json`))),
    load("./data/annual_brief_2026.json"),
    load("./data/source_registry.json"),
    load("./data/brief_priorities_2026.json"),
    load("./data/bp_enriched_calendar_2026.json"),
    load("./data/uk_bank_holidays_2026.json"),
    load("./data/uk_sports_events_2026.json"),
    load("./data/uk_school_holidays_2026.json"),
    loadOptional("./data/competitor_campaign_signals_2026.json", null),
    Promise.resolve(null), // weather is not a bp Investment Comms planning input
    load("./data/bp_weather_intelligence_2026.json"),
    load("./data/monthly_revision_fixture_2026.json"),
    load("./data/agent_logic_config.json"),
    loadOptional("./data/agent_demo_traces.json", null),
    Promise.resolve(null) /* no eval output in the static demo */,
    load("./data/planning_evidence_rules_2026.json"),
    load("./data/data_source_dictionary.json"),
    load("./data/bp_synthetic_fixture_2026.json"),
  ]);

  state.plans = Object.fromEntries(SCENARIOS.map((scenario, index) => [scenario, plans[index]]));
  state.brief = brief;
  state.sources = sources;
  state.evidenceRules = evidenceRules;
  state.dataSourceDictionary = dataSourceDictionary;
  state.syntheticFixture = syntheticFixture;
  state.channelGuardrailOverrides = loadLocalJson("bp_channel_guardrail_overrides", {});
  state.briefPriorities = briefPriorities;
  state.enrichedCalendar = enrichedCalendar;
  state.bankHolidays = bankHolidays;
  state.curatedSportsEvents = curatedSportsEvents;
  state.compositeSchoolHolidays = compositeSchoolHolidays;
  state.competitorCampaignSignals = competitorCampaignSignals;
  state.liveWeatherWarnings = liveWeatherWarnings;
  state.calendarMonth = loadLocalJson("bp_calendar_month", null) || currentOrDefaultCalendarMonth();
  state.calendarFilters = { ...state.calendarFilters, ...loadLocalJson("bp_calendar_filters", {}) };
  state.calendarOverviewAi = loadLocalJson("bp_calendar_overview_ai", {});
  state.manualCalendarEvents = loadLocalJson("bp_manual_calendar_events", []);
  state.weather = weather;
  state.monthlyRevisionData = monthlyRevisionData;
  state.agentConfig = agentConfig;
  state.agentConfigOverrides = loadLocalJson("bp_agent_config_overrides", {});
  state.agentTraces = agentTraces;
  state.logicEval = logicEval;
  state.planVersions = seedPlanVersions();
  state.approvalEvents = loadLocalJson("bp_approval_events", []);
  applyApprovalStatusToVersions();
  state.approvalSelectedKey = loadLocalJson("bp_approval_selected_key", null);
  state.currentApprovedVersionId = loadLocalJson("bp_current_approved_version_id", null);
  state.briefingDrafts = loadLocalJson("bp_briefing_drafts", {});
  state.briefingDraftsMonthly = loadLocalJson("bp_briefing_drafts_monthly", {});
  state.sourceOverrides = loadLocalJson("bp_source_overrides", {});
  state.rolePeople = loadLocalJson("bp_role_people", ROLE_PEOPLE_DEFAULT);
  state.qaWarningOverrides = loadLocalJson("bp_qa_warning_overrides", {});
  state.adminWarningsSelectedKey = loadLocalJson("bp_admin_warnings_selected_key", null);
  state.logicFeedback = loadLocalJson("bp_logic_feedback", {});
  state.selectedRevisionMonth = loadLocalJson("bp_selected_revision_month", "2026-07");
  // A persisted/default selection can point at a month that's no longer
  // eligible (e.g. it was current when last selected, but time has since
  // moved on) - fall back to the first eligible fixture month instead of
  // silently showing a revision the UI would no longer let you submit.
  if (!isRevisionMonthEligible(state.selectedRevisionMonth)) {
    const firstEligible = (state.monthlyRevisionData?.revision_months || []).find((item) => isRevisionMonthEligible(item.month));
    if (firstEligible) state.selectedRevisionMonth = firstEligible.month;
  }
  state.revisionDraft = loadLocalJson("bp_revision_draft", null);
  state.revisionPlanNames = loadLocalJson("bp_revision_plan_names", {});
  state.monthlyRevisionContext = loadLocalJson("bp_monthly_revision_context", {});
  state.monthlyRevisionSubmissions = loadLocalJson("bp_monthly_revision_submissions", []);
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
}

// The stored Blended demo plan; still read by the workshop-only monthly revision and briefing code.
function currentPlan() {
  return state.plans[state.scenario];
}




// Static demo: the source registry file stands in for the live ingestion API.
// Green only for client-supplied or official data; synthetic, vendor,
// methodology and derived stand-ins are amber; not-connected sources are red.
const GREEN_SOURCE_STATUSES = /^(client_supplied.*|official_external_reference|public_reference|hand_curated)$/;
function sourceRegistryRag(status) {
  if (status === "not_connected") return "red";
  return GREEN_SOURCE_STATUSES.test(status) ? "green" : "amber";
}

function fetchLiveSources() {
  state.liveSources = (state.sources?.sources || []).map((source) => ({
    name: source.name,
    filename: (source.path || source.name).split("/").pop(),
    status: source.status,
    rag: sourceRegistryRag(source.status),
    last_updated: null, // the registry records when it was compiled, not when each source last refreshed
  }));
  renderDataReadiness();
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

  if (!state.liveSources) {
    wrap.innerHTML = `<p class="table-hint">No sources ingested yet.</p>`;
    return;
  }

  // The canonical list (all 33 known data sources, grouped by type) is the
  // client's own data dictionary, not just whatever happens to be ingested -
  // most rows will show as not yet connected, which is the honest picture.
  const categories = state.dataSourceDictionary.categories.map((category) => {
    const sources = category.sources.map((source) => ({
      ...source,
      matches: matchLiveSources(source, state.liveSources),
    }));
    return {
      ...category,
      sources,
      connectedCount: sources.filter((s) => sourceEffectiveRag(s) === "green").length,
      standInCount: sources.filter((s) => sourceEffectiveRag(s) === "amber").length,
    };
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
      <strong>${ragCounts.green} of ${allSources.length} sources connected${ragCounts.amber ? `, ${ragCounts.amber} with a demo stand-in` : ""}</strong>
      <span class="data-readiness-overall-breakdown">${ragCounts.green} green &middot; ${ragCounts.amber} amber &middot; ${ragCounts.red} red</span>
    </div>
    <p class="table-hint">Green: client-supplied or official data. Amber: a synthetic, vendor or methodology stand-in for the demo. Red: not connected.</p>
  `;

  wrap.innerHTML = overallSummary + categories.map((category) => {
    const expanded = !!state.dataReadinessExpanded[category.category_id];
    return `
      <div class="source-category ${expanded ? "expanded" : ""}">
        <button class="source-category-head" type="button" data-toggle-category="${category.category_id}">
          <span class="source-category-chevron">${expanded ? "▾" : "▸"}</span>
          <strong>${category.label}</strong>
          <span class="source-category-count">${category.connectedCount} of ${category.sources.length} connected${category.standInCount ? ` · ${category.standInCount} stand-in` : ""}</span>
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
                  // A single canonical source (e.g. MMM) commonly matches
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





// Colour-per-group palette for the monthly stacked bar, reusing the brand
// palette from styles.css :root so this chart matches the rest of the app;
// a separate grey covers "Unmapped" (channels not yet placed in the v1
// channel granularity - currently always Display/Programmatic).
const SUMMARY_CHART_COLORS = ["#e30027", "#005fb8", "#49a300", "#f7941d", "#9e001b", "#6b5ca5", "#f9b000", "#1f8a8a"];
const SUMMARY_CHART_UNMAPPED_COLOR = "#8a94a6";




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
          <p>Gap: ${number.format(feasibility.policy_sales_gap)} GBE engagements and £${feasibility.cost_per_policy_gap_gbp} CPE.</p>
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
    status: ["results_season", "agm_strategy_update", "channel_role_clarity"].includes(priority.priority_id) ? "big" : "medium",
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
  // "draw" is a legacy category from an earlier version of this calendar
  // data source - it has no place in a retail media revision, so it's
  // excluded here regardless of what the Events Calendar page itself does
  // with that category/data source.
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
    if (channel === "CTV & Streaming" && Number(perf.sales_index) > 1.03) multiplier += 0.04;
    if (channel === "Programmatic Display" && Number(perf.sales_index) > 1.03) multiplier += 0.025;
    if (["Online Video", "Meta"].includes(channel) && Number(perf.sales_index) < 0.95) multiplier -= 0.05;
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
          <div><dt>GBE engagements (actual)</dt><dd>${number.format(fixture.sales_actuals.new_policy_sales)} vs ${number.format(fixture.sales_actuals.target_new_policy_sales)}</dd></div>
          <div><dt>Actual CPE</dt><dd>${costPerPolicyMoney.format(fixture.sales_actuals.cost_per_policy_gbp)} vs ${costPerPolicyMoney.format(fixture.sales_actuals.target_cost_per_policy_gbp)}</dd></div>
          <div><dt>Delivery index</dt><dd>${fixture.sales_actuals.delivery_index}</dd></div>
          ${fixture.sales_actuals.quote_starts ? `<div><dt>GBE impressions</dt><dd>${number.format(fixture.sales_actuals.quote_starts)}</dd></div>` : ""}
          ${fixture.sales_actuals.quote_to_policy_conversion_pct ? `<div><dt>Engagement rate</dt><dd>${fixture.sales_actuals.quote_to_policy_conversion_pct}%</dd></div>` : ""}
                    ${fixture.sales_actuals.brand_search_index ? `<div><dt>Brand search index (context only)</dt><dd>${fixture.sales_actuals.brand_search_index}</dd></div>` : ""}
        </dl>
        <p class="table-hint">GBE impressions, engagement rate and brand-search index are context signals for planner judgement here - they do not feed the revision calculation itself unless a source/rule is explicitly configured.</p>
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

// Every stored plan that can be approved or managed: submitted monthly
// revisions plus the 6 stored demo plans.
function storedPlanOptions() {
  return plannerPlans().map((plan) => ({
    key: plan.plan_id,
    label: plan.kind === "base" ? "Base plan" : plan.scenario.label,
    kind: plan.kind,
    plan,
    versionId: `plan_version_${plan.plan_id}`,
  }));
}

// Static demo: the overview is assembled from the month's calendar items
// rather than an AI call, and says so.
function generateCalendarAiOverview() {
  const monthStr = state.calendarMonth;
  const monthLabel = new Date(`${monthStr}-01T00:00:00`).toLocaleString("en-GB", { month: "long", year: "numeric" });
  const items = calendarItemsForMonth(monthStr);
  const byCategory = items.reduce((acc, item) => ({ ...acc, [item.category]: [...(acc[item.category] || []), item] }), {});
  const lead = items.filter((item) => item.detail).slice(0, 3);
  const counts = Object.entries(byCategory).map(([category, list]) => `${list.length} ${category.replace(/_/g, " ")}`).join(", ");
  state.calendarOverviewAi[monthStr] = {
    narrative: items.length
      ? `${monthLabel} has ${items.length} calendar items (${counts}). ${lead.map((item) => `${item.title}: ${item.detail}`).join(" ")}`
      : `Nothing is scheduled in ${monthLabel} with the current filters.`,
    source_ids: [...new Set(items.flatMap((item) => item.sourceIds || []))].slice(0, 6),
    static: true,
    confidence_reason: "Prototype: built from the calendar entries above, not by an AI model.",
    generated_at: nowStamp(),
  };
  saveLocalJson("bp_calendar_overview_ai", state.calendarOverviewAi);
  state.calendarGenerateStatus = null;
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
            <button class="secondary-button" type="button" id="generateCalendarOverview">${state.calendarOverviewAi[monthStr] ? "Refresh summary" : "Summarise this month"}</button>
          </div>
          <p class="table-hint">Deterministic summary of scheduled financial calendar moments, holidays and context for this month, filtered to the categories selected above.</p>
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
  if (state.calendarGenerateStatus) {
    return `<p class="warning-text">${state.calendarGenerateStatus}</p>`;
  }

  const cached = state.calendarOverviewAi[monthStr];
  if (!cached) return "";

  return `
    <div class="calendar-ai-overview">
      <div class="source-tags">
        <span class="source-tag">${cached.static ? "Built from the calendar" : `${cached.confidence || "unknown"} confidence`}</span>
        ${cached.source_ids.map((id) => `<span class="source-tag" title="${sourceLabel(id)}">${id}</span>`).join("")}
      </div>
      <p>${escapeHtml(cached.narrative)}</p>
      ${cached.confidence_reason ? `<p class="table-hint">${cached.confidence_reason}</p>` : ""}
    </div>
  `;
}

function renderBriefingForms() {
  const plan = currentPlan();
  const featured = CHANNEL_ORDER;
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
        <input type="text" id="newPersonOrg" placeholder="Org (e.g. bp, Media Agency)" />
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
  const plans = plannerPlans();
  return `
    <div class="approval-card wide">
      <strong>Stored plans</strong>
      <p class="table-hint">The base plan is replaced by regenerating it in Campaign Planning; scenarios can be removed here.</p>
      ${plans.length ? `
        <div class="source-table-wrap">
          <table class="source-table">
            <thead><tr><th>Plan</th><th>Budget</th><th>Forecast clicks</th><th>Cost per click</th><th></th></tr></thead>
            <tbody>
              ${plans.map((plan) => `
                <tr>
                  <td><strong>${plan.kind === "base" ? "Base plan" : escapeHtml(plan.scenario.label)}</strong></td>
                  <td>${money.format(plan.total_budget_gbp)}</td>
                  <td>${number.format(plan.forecast_clicks)}</td>
                  <td>${costPerPolicyMoney.format(plan.cost_per_click)}</td>
                  <td>${plan.kind === "base" ? "" : `<button class="secondary-button" type="button" data-remove-plan="${plan.plan_id}">Remove</button>`}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      ` : `<p class="table-hint warning-text">No plans yet. Generate a base plan in Campaign Planning.</p>`}
    </div>
  `;
}

function renderAdminWarningsSection() {
  const options = storedPlanOptions();
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

// Approving a plan is "pick which stored plan we're talking about", so this
// reuses storedPlanOptions() rather than maintaining a second list.
function currentApprovalOption() {
  const options = storedPlanOptions();
  if (!options.length) return null;
  const selected = options.find((option) => option.key === state.approvalSelectedKey);
  if (selected) return selected;
  const preferred = options.find((option) => option.key === plannerState.preferredScenarioId);
  const currentApproved = options.find((option) => approvalVersionId(option) === state.currentApprovedVersionId);
  return preferred || currentApproved || options[0];
}

// Unlike currentApprovalOption() (which falls back to a live/first plan so
// the Approval page always has something to show), the Current Plan page
// should only ever show a plan that has actually been approved - no
// fallback, so an unapproved draft never gets mistaken for "the plan".
function approvedPlanOption() {
  if (!state.currentApprovedVersionId) return null;
  return storedPlanOptions().find((option) => approvalVersionId(option) === state.currentApprovedVersionId) || null;
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
        <div class="metric"><span>Forecast CPE</span><strong>${costPerPolicyMoney.format(row.forecast_cost_per_policy_gbp)}</strong></div>
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
    ["Forecast GBE Engagements", plan.forecast_new_policy_sales],
    ["Forecast CPE (GBP)", plan.forecast_cost_per_policy_gbp],
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
        <p class="table-hint">Approve a scenario to see its budget, sales forecast, cost per engagement, evidence and audit trail here.</p>
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
      <div><span>Forecast GBE Engagements</span><strong>${number.format(policySales)}</strong></div>
      <div><span>Forecast CPE</span><strong>${costPerPolicyMoney.format(plan.forecast_cost_per_policy_gbp)}</strong></div>
      ${plan.forecast_quote_starts ? `<div><span>Forecast GBE Impressions</span><strong>${number.format(plan.forecast_quote_starts)}</strong></div>` : ""}
      ${plan.quote_to_policy_conversion_pct ? `<div><span>Engagement Rate</span><strong>${plan.quote_to_policy_conversion_pct}%</strong></div>` : ""}
      <div><span>Budget Check</span><strong>${plan.qa.budget_balanced && plan.qa.months_balanced ? "Balanced" : "Needs review"}</strong></div>
      <div><span>Brief &amp; Compliance Check</span><strong>${briefPassed ? "Pass" : "Needs work"}</strong></div>
    </section>
    ${dist ? `
    <div class="approval-card wide">
      <strong>Distribution - reported separately from media</strong>
      <p class="table-hint">${dist.note} <em>${dist.generated_data_banner}</em></p>
      <section class="status-strip" aria-label="Distribution status">
        <div><span>Visibility Index</span><strong>${dist.pcw_visibility_index}</strong></div>
        <div><span>Share</span><strong>${dist.quote_share_pct}%</strong></div>
        <div><span>Conversion</span><strong>${dist.pcw_to_sale_conversion_pct}%</strong></div>
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
        <button class="toggle ${mode === "cost_per_policy" ? "active" : ""}" type="button" data-current-plan-mode="cost_per_policy">CPE</button>
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
  saveLocalJson("bp_approval_selected_key", key);
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
  saveLocalJson("bp_current_approved_version_id", versionId);
  renderApproval();
}

// Admin-only "Remove stored plans": scenarios can be removed; the base plan is replaced by regenerating it.
function removeStoredPlan(key) {
  if (currentRole() !== "admin") return;
  plannerState.scenarios = plannerState.scenarios.filter((plan) => plan.plan_id !== key);
  if (plannerState.preferredScenarioId === key) plannerState.preferredScenarioId = null;
  plannerSave();
  renderAll();
}

function addRolePerson(name, email, org, role) {
  const trimmedName = name.trim();
  if (!trimmedName || state.rolePeople.some((person) => person.name === trimmedName)) return;
  state.rolePeople = [...state.rolePeople, { name: trimmedName, email: email.trim(), org: org.trim() || "bp", role }];
  saveLocalJson("bp_role_people", state.rolePeople);
  renderAdmin();
}

function removeRolePerson(name) {
  state.rolePeople = state.rolePeople.filter((person) => person.name !== name);
  saveLocalJson("bp_role_people", state.rolePeople);
  renderAdmin();
}

function updateRolePersonRole(name, role) {
  state.rolePeople = state.rolePeople.map((person) => (person.name === name ? { ...person, role } : person));
  saveLocalJson("bp_role_people", state.rolePeople);
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
  const option = storedPlanOptions().find((item) => item.key === key);
  if (!option) return;
  state.qaWarningOverrides[approvalVersionId(option)] = warnings;
  saveLocalJson("bp_qa_warning_overrides", state.qaWarningOverrides);
}

function selectAdminWarningsPlan(key) {
  state.adminWarningsSelectedKey = key;
  saveLocalJson("bp_admin_warnings_selected_key", key);
  renderAdmin();
}

function updateWarningText(key, index, text) {
  const option = storedPlanOptions().find((item) => item.key === key);
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
  const option = storedPlanOptions().find((item) => item.key === key);
  if (!option) return;
  const warnings = effectiveWarnings(option).filter((_, itemIndex) => itemIndex !== index);
  setWarningOverride(key, warnings);
  renderAdmin();
  renderApproval();
}

function addWarning(key, text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const option = storedPlanOptions().find((item) => item.key === key);
  if (!option) return;
  setWarningOverride(key, [...effectiveWarnings(option), trimmed]);
  renderAdmin();
  renderApproval();
}

function renderApproval() {
  const options = storedPlanOptions();
  const current = currentApprovalOption();

  if (!current) {
    document.querySelector("#approvalState").innerHTML = `<p class="table-hint warning-text">No plan yet. Generate a base plan in Campaign Planning first.</p>`;
    return;
  }

  ensurePlanVersion(current);
  const versionId = approvalVersionId(current);
  const version = state.planVersions.find((item) => item.version_id === versionId);
  const plan = current.plan;
  const isCurrentApproved = versionId === state.currentApprovedVersionId;
  const approvalStatus = version?.approval_status || "draft";
  const statusLabels = { draft: "Draft plan", review: "Ready for bp review", approved: "Approved version" };
  const events = approvalEventsForVersion(versionId);
  const isAdmin = currentRole() === "admin";
  const vsTarget = plan.target_visitors ? plan.forecast_clicks / plan.target_visitors - 1 : 0;
  const isPreferred = current.key === plannerState.preferredScenarioId;

  document.querySelector("#approvalState").innerHTML = `
    <div class="approval-card wide">
      <strong>Select a stored plan to approve</strong>
      <div class="stored-scenario-buttons">
        ${options.map((option) => {
          const optionVersionId = approvalVersionId(option);
          const isApproved = optionVersionId === state.currentApprovedVersionId;
          return `
            <button class="secondary-button chat-scenario-btn ${option.key === current.key ? "active" : ""}" type="button" data-approval-select="${option.key}">
              ${option.label}${isApproved ? " · current plan" : ""}${option.key === plannerState.preferredScenarioId ? " · preferred" : ""}
            </button>
          `;
        }).join("")}
      </div>
    </div>

    <div class="approval-card ${isCurrentApproved ? "ready" : ""}">
      <strong>${statusLabels[approvalStatus] || approvalStatus}${isCurrentApproved ? " · This is the current approved plan" : ""}</strong>
      <p>${current.label}${isPreferred ? " (preferred scenario)" : ""} · ${money.format(plan.total_budget_gbp)} budget, ${plDate(plan.inputs.start)} to ${plDate(plan.inputs.end)} · ${number.format(plan.forecast_clicks)} forecast clicks at ${costPerPolicyMoney.format(plan.cost_per_click)} per click · ${number.format(plan.target_visitors)} target visitors.</p>
    </div>

    <div class="approval-card">
      <strong>QA checks</strong>
      <p>Budget matches the brief: ${plan.qa.budget_matches_brief ? "yes" : "no"}. Guardrails respected: ${plan.qa.guardrails_respected ? "yes" : "no"}. Months on target: ${plan.months.length - plan.qa.months_short.length} of ${plan.months.length}.</p>
    </div>

    <div class="approval-card wide">
      <strong>Active warnings</strong>
      <div class="config-actions" style="margin-bottom:10px;">
        <span class="status-pill ${plan.qa.clears_visitor_target ? "good" : "warning"}">${plan.qa.clears_visitor_target ? "Clears" : "Short of"} the visitor target (${vsTarget >= 0 ? "+" : "−"}${Math.abs(vsTarget * 100).toFixed(1)}%)</span>
        <span class="status-pill ${plan.qa.budget_matches_brief ? "good" : "warning"}">Budget ${plan.qa.budget_matches_brief ? "matches" : "differs from"} the brief</span>
        <span class="status-pill ${plan.qa.guardrails_respected ? "good" : "warning"}">Guardrails ${plan.qa.guardrails_respected ? "respected" : "breached"}</span>
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
        <textarea id="approvalComment" rows="4" placeholder="Capture bp, finance or media agency review comments for this plan version."></textarea>
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
        `).join("") : `<div><span>Generated</span><p>${current.label} ${current.kind === "base" ? "generated in Campaign Planning" : "built from the base plan"}. No approval events recorded yet.</p></div>`}
      </div>
    </div>
  `;
}

const VIEW_META = {
  annual: ["Campaign Planning", "Set the dates, budget and brief, the channel guardrails and the Strategic Index, then generate and edit the base plan."],
  scenarios: ["Scenarios", "Reshape the base plan into the stored strategic options and compare them side by side."],
  curves: ["Curves", "Illustrative what-if: move a £200k budget between channels and see how diminishing returns change revenue, new customers, ROAS and CPA."],
  chat: ["Planner Chat", "Ask about the budget, channel and month choices in the base plan."],
  events: ["Events Calendar", "bp's financial calendar, holidays, sport and market context for each month."],
  approval: ["Approval", "Review the base plan or a scenario's checks and warnings, and approve it."],
  data: ["Data Readiness", "Which of the planner's data sources are connected, and which are demo stand-ins."],
  admin: ["Admin", "Users, sources, stored plans and warnings."],
  // Not in the menu; opened by URL (?view=logic, ?view=architecture) for workshops.
  logic: ["Logic workshop", "Questions this prototype is designed to lock down."],
  architecture: ["Agent traces", "Experimental mode: agent traces and logic guardrails."],
};

function activateView(view) {
  if (!VIEW_META[view]) view = "annual";
  document.querySelectorAll(".nav-item").forEach((item) => {
    const active = item.dataset.view === view;
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
  document.querySelectorAll(".view").forEach((item) => {
    item.classList.toggle("active", item.id === `view-${view}`);
  });
  const [title, headline] = VIEW_META[view];
  document.querySelector("#pageTitle").textContent = title;
  document.querySelector("#pageHeadline").textContent = headline;
  document.title = `${title} · BP Planner`;
}

function setMobileMenu(open, { returnFocus = false } = {}) {
  const button = document.querySelector("#openMenu");
  document.querySelector("#mobileNav").hidden = !open;
  button.setAttribute("aria-expanded", String(open));
  button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (returnFocus) button.focus();
}

function applyInitialRoute() {
  const params = new URLSearchParams(window.location.search);
  const scenario = params.get("scenario");
  const tableMode = params.get("mode");
  const selected = params.get("select");
  const view = params.get("view") || "annual";

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
  renderCampaignPlanning();
  renderScenarioCentre();
  renderDataReadiness();
  renderLogicChallenges();
  renderArchitecture();
  renderScenarioStudio();
  renderPlanChat();
  renderEventsCalendar();
  renderAdmin();
  renderApproval();
  if (window.lucide) window.lucide.createIcons();
}

function attachEvents() {
  document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      const fromMobileMenu = Boolean(button.closest("#mobileNav"));
      if (view !== "annual") renderAll(); // other pages read the base plan, which may have been edited
      activateView(view);
      setMobileMenu(false, { returnFocus: fromMobileMenu });
      const url = new URL(window.location.href);
      url.searchParams.set("view", view);
      window.history.replaceState(null, "", url);
      window.scrollTo(0, 0);
      if (window.lucide) window.lucide.createIcons();
    });
  });
  document.querySelector("#openMenu").addEventListener("click", () => {
    setMobileMenu(document.querySelector("#mobileNav").hidden);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !document.querySelector("#mobileNav").hidden) setMobileMenu(false, { returnFocus: true });
  });

  document.querySelector("#monthlyRevision")?.addEventListener("change", (event) => {
    const select = event.target.closest("#revisionMonth");
    if (!select) return;
    state.selectedRevisionMonth = select.value;
    state.revisionDraft = null;
    saveLocalJson("bp_selected_revision_month", state.selectedRevisionMonth);
    saveLocalJson("bp_revision_draft", state.revisionDraft);
    renderMonthlyRevision();
  });

  document.querySelector("#monthlyRevision")?.addEventListener("input", (event) => {
    const fixture = revisionFixture();
    const nameInput = event.target.closest("#revisionPlanName");
    if (nameInput) {
      state.revisionPlanNames[fixture.month] = nameInput.value;
      saveLocalJson("bp_revision_plan_names", state.revisionPlanNames);
      return;
    }
    const contextInput = event.target.closest("#monthlyRevisionFreeText");
    if (contextInput) {
      state.monthlyRevisionContext[fixture.month] = contextInput.value;
      saveLocalJson("bp_monthly_revision_context", state.monthlyRevisionContext);
    }
  });

  document.querySelector("#monthlyRevision")?.addEventListener("click", (event) => {
    if (event.target.closest("#runRevision")) {
      state.revisionDraft = buildMonthlyRevisionCandidate();
      saveLocalJson("bp_revision_draft", state.revisionDraft);
      renderMonthlyRevision();
      return;
    }
    if (event.target.closest("#approveRevisionCandidate")) {
      const candidate = state.revisionDraft || buildMonthlyRevisionCandidate();
      const nameInput = document.querySelector("#revisionPlanName");
      candidate.version_label = nameInput?.value?.trim() || `${formatMonth(candidate.revision_month)} Revised`;
      state.revisionPlanNames[candidate.revision_month] = candidate.version_label;
      saveLocalJson("bp_revision_plan_names", state.revisionPlanNames);
      state.revisionDraft = candidate;
      saveLocalJson("bp_revision_draft", state.revisionDraft);

      // Submitting makes this a first-class "stored plan" - selectable on
      // Approval/Chat/Admin like any other, via the same pool
      // storedPlanOptions() already builds for every other plan kind.
      state.monthlyRevisionSubmissions = [
        candidate,
        ...state.monthlyRevisionSubmissions.filter((item) => item.version_id !== candidate.version_id),
      ];
      saveLocalJson("bp_monthly_revision_submissions", state.monthlyRevisionSubmissions);

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

  document.querySelector("#eventsCalendar")?.addEventListener("click", (event) => {
    const navButton = event.target.closest("[data-calendar-nav]");
    if (navButton) {
      const currentIndex = MONTHS.indexOf(state.calendarMonth);
      const nextIndex = Math.min(Math.max(currentIndex + Number(navButton.dataset.calendarNav), 0), MONTHS.length - 1);
      state.calendarMonth = MONTHS[nextIndex];
      state.calendarGenerateStatus = null;
      saveLocalJson("bp_calendar_month", state.calendarMonth);
      renderEventsCalendar();
      return;
    }
    const filterButton = event.target.closest("[data-calendar-filter]");
    if (filterButton) {
      const key = filterButton.dataset.calendarFilter;
      state.calendarFilters[key] = !state.calendarFilters[key];
      saveLocalJson("bp_calendar_filters", state.calendarFilters);
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
      saveLocalJson("bp_manual_calendar_events", state.manualCalendarEvents);
      renderEventsCalendar();
      return;
    }
    const removeButton = event.target.closest("[data-remove-manual-event]");
    if (removeButton) {
      const eventId = removeButton.dataset.removeManualEvent;
      state.manualCalendarEvents = state.manualCalendarEvents.filter((item) => item.id !== eventId);
      saveLocalJson("bp_manual_calendar_events", state.manualCalendarEvents);
      renderEventsCalendar();
    }
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
    saveLocalJson("bp_agent_config_overrides", state.agentConfigOverrides);
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
    saveLocalJson("bp_logic_feedback", state.logicFeedback);
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
    saveLocalJson(isMonthly ? "bp_briefing_drafts_monthly" : "bp_briefing_drafts", isMonthly ? state.briefingDraftsMonthly : state.briefingDrafts);
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
    link.download = `bp-channel-briefs-${state.scenario}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  document.querySelector("#adminPage")?.addEventListener("change", (event) => {
    const sourceField = event.target.closest("[data-source-id]");
    if (sourceField) {
      const sourceId = sourceField.dataset.sourceId;
      state.sourceOverrides[sourceId] = { ...(state.sourceOverrides[sourceId] || {}), [sourceField.dataset.sourceField]: sourceField.value };
      saveLocalJson("bp_source_overrides", state.sourceOverrides);
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
      saveLocalJson("bp_source_overrides", state.sourceOverrides);
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

  document.querySelector("#approvalState")?.addEventListener("click", (event) => {
    const selectButton = event.target.closest("[data-approval-select]");
    if (selectButton) {
      selectApprovalPlan(selectButton.dataset.approvalSelect);
      return;
    }
    if (event.target.closest("#submitApproval")) {
      const comment = document.querySelector("#approvalComment")?.value || "";
      approvePlan(comment);
    }
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


// A revision candidate isn't a full plan object (no brief_test, no
// media_owner_allocations), so this is a smaller export than downloadPlanExcel().
function downloadRevisionExcel(candidate) {
  const wb = XLSX.utils.book_new();

  const summaryRows = [
    ["Plan ID", candidate.plan_id],
    ["Scenario", candidate.scenario.label],
    ["Revision Month", formatMonth(candidate.revision_month)],
    ["Prior Month (actuals basis)", formatMonth(candidate.prior_month)],
    ["Total Budget (GBP)", candidate.total_budget_gbp],
    ["Forecast GBE Engagements", candidate.forecast_new_policy_sales],
    ["Forecast CPE (GBP)", candidate.forecast_cost_per_policy_gbp],
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



loadData()
  .then(() => {
    plannerInit();
    applyInitialRoute();
    renderAll();
    attachEvents();
    plannerAttachEvents();
    scenarioCentreAttachEvents();
    fetchLiveSources();
  })
  .catch((error) => {
    document.body.innerHTML = `<main style="font-family: system-ui, sans-serif; padding: 32px; max-width: 760px;">
      <h1>Prototype failed to load</h1>
      <p><strong>${error.message}</strong></p>
      <p>This usually means the page was opened directly as a file instead of served over <code>http://</code> - the demo fetches its data files (<code>./data/*.json</code>) and needs a local web server, not a <code>file://</code> URL.</p>
      <p>Try the local URL provided for this demo, then hard refresh if needed.</p>
    </main>`;
  });
