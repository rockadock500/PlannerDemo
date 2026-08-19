const DATA_PATHS = {
  planSearch: "../output/generated_plan_search_poc.json",
  planGrowth: "../output/generated_plan_sportsbook_growth.json",
  planHold: "../output/generated_plan_compliance_hold.json",
  planManifest: "../plans/manifest.json?v=23",
  actualsManifest: "../actuals/manifest.json?v=23",
  actualsMonthly: "../actuals/monthly_summary.json?v=23",
  search: "../data/search_poc_status.json",
  paidSerp: "../data/paid_serp_evidence_2026.json?v=1",
  searchAdsLive: "../data/search_ads_dataforseo_live.json?v=2",
  signalSearch: "../data/signal_search_intelligence_2026.json?v=2",
  momentum: "../data/competitor_momentum_seed.json",
  personas: "../data/predict_persona_seeds_working.json",
  mediaOwners: "../data/media_owner_benchmarks.json",
  curves: "../data/response_curve_priors_2026.json",
  stateBudgets: "../data/state_budget_model_2026.json",
  calendar: "../data/draw_calendar_2026.json",
  fixtureCalendar: "../data/fixture_calendar/fixtures_2025_2027.json?v=1",
  fixtureHeatModel: "../data/fixture_calendar/heat_model.json?v=1",
  fixtureDailyHeat: "../data/fixture_calendar/daily_heat.json?v=1",
  fixtureTimeslotHeat: "../data/fixture_calendar/timeslot_heat.json?v=1",
  fixtureStateHeat: "../data/fixture_calendar/state_heat.json?v=1",
  fixtureHeatValidation: "../data/fixture_calendar/heat_validation.json?v=1",
  fixtureKeyPeriods: "../data/fixture_calendar/key_periods.json?v=1",
  calendarModifiers: "../config/calendar_modifiers.json?v=1",
  demoReset: "../data/demo_reset_manifest.json?v=1",
  spendBaseline: "../data/fanduel_marketing_spend_baseline_2026.json",
  engineCapabilities: "../config/engine_capabilities.json?v=2",
  reportingDrill: "../data/reporting_line_items_2026.json?v=29",
  reportingConnectors: "../config/reporting_connector_manifest.json?v=1",
  recommendations: "../data/recommendations_2026.json?v=1",
  recommendationActions: "../config/recommendation_action_manifest.json?v=1",
  referenceProvenance: "../config/reference_provenance.json?v=1",
  ideasLab: "../data/ideas_lab_data.json?v=1",
  creativeLibrary: "../data/competitor_creative_library_2026.json?v=2",
  predictionOperators: "../data/prediction_operator_layer.json?v=1",
  zip3Map: "../data/us_zip3_signal_map_working.json",
  zip3ProductMedia: "../data/zip3_product_media_estimates_2026.json",
  governance: "../../../universal/us/seeds/fanduel_state_product_matrix_research.json",
  regulationSubstance: "../../../universal/us/regulation_substance.json?v=2",
  publisherPolicies: "../../../universal/us/publisher_gambling_policies.json?v=1",
  mediaMinimums: "../../../universal/media_minimums.json?v=1",
  stateValueIndex: "../../../universal/us/state_value_index.json?v=29",
  taxonomy: "../../../universal/us/status_taxonomy.json"
};

const MODE_CONFIG_PATHS = [
  "../config/modes/free.json?v=38",
  "../config/modes/year.json?v=38",
  "../config/modes/month.json?v=38",
  "../config/modes/launch.json?v=1",
  "../config/modes/one_off.json?v=38"
];

const TEAM_TESTER_ID = normaliseTeamTesterId(new URLSearchParams(window.location.search).get("tester"));
const CHAT_SESSION_WORKSPACE_ID = TEAM_TESTER_ID ? `fanduel-demo-${TEAM_TESTER_ID}` : "fanduel-demo";
const CHAT_SESSION_STORAGE_KEY = TEAM_TESTER_ID
  ? `fanduel_planning_chat_sessions_v7_${TEAM_TESTER_ID}`
  : "fanduel_planning_chat_sessions_v7";
const CHAT_SESSION_SCHEMA = "signal_sessions_file_v1";
const CHAT_SESSION_API_PATH = `/api/sessions/${encodeURIComponent(CHAT_SESSION_WORKSPACE_ID)}`;
const CUSTOM_PRODUCTS_STORAGE_KEY = "fanduel_custom_products_v1";
const RECOMMENDATION_ACTION_STORAGE_KEY = TEAM_TESTER_ID
  ? `fanduel_recommendation_actions_v1_${TEAM_TESTER_ID}`
  : "fanduel_recommendation_actions_v1";
const ZIP3_VIEW_STORAGE_KEY = "fanduel_zip3_map_view_v2";
const ZIP3_VIEW_FRAME_VERSION = 3;
const DEMO_RESET_STORAGE_KEY = "fanduel_demo_reset_seen_v1";
const ZIP3_DEFAULT_VIEW = {
  zoom: 1,
  panX: 0,
  panY: 0
};
const ZIP3_US_VIEW = {
  viewBox: "155 250 210 140",
  centerX: 260,
  centerY: 320
};
const AUDIENCE_AGE_BANDS = [
  { value: "18_24", label: "18–24", factor: 0.15 },
  { value: "25_40", label: "25–40", factor: 0.29 },
  { value: "41_54", label: "41–54", factor: 0.21 },
  { value: "55_plus", label: "55+", factor: 0.22 },
  { value: "all_adults", label: "All adults", factor: 0.87 }
];
const AUDIENCE_INCOME_BANDS = [
  { value: "all", label: "All income levels", factor: 1 },
  { value: "under_50k", label: "Under $50K", factor: 0.32 },
  { value: "50k_75k", label: "$50K–$75K", factor: 0.24 },
  { value: "75k_plus", label: "$75K+", factor: 0.34 }
];
const FREE_SKILL_FRAMES = {
  ritson: "Separate broad brand investment from activation, test ESOV only when SOV and SOM are both loaded, and structure the decision as setup, conflict and resolution.",
  sutherland: "Define the target behaviour and blocker, compare a small number of ethical reframings, then recommend a measurable test without inventing performance evidence.",
  strategy: "Shortlist evidence-supported options, compare impact, effort, cost, speed to signal and fit, then make one recommendation with trade-offs and a next test.",
  evidence: "Classify verified, working, synthetic and missing evidence; state the validation rule, owner and remediation for material gaps."
};
const CAMPAIGN_STORE_STORAGE_KEY = "fanduel_campaign_store_v1";
const LLM_SERVICE_FLAG_KEY = "fanduel_llm_enabled";
const ANTHROPIC_CHAT_MODEL = "claude-sonnet-4-6";

const SOURCE_REGISTRY = {
  tau_skills_snapshot_2026_06_14: {
    label: "Pinned TAU skills snapshot",
    status: "SHA-256 pinned working reference",
    note: "Consumed skill files and applied principles are declared in reference_provenance.json."
  },
  intermedia_reporting_reference_2d01b655: {
    label: "Pinned Intermedia reporting reference",
    status: "commit and blob pinned",
    note: "Reporting hierarchy and source-of-truth patterns are pinned to Intermedia commit 2d01b655."
  },
  sig_scan_fanduel_us_2026_07_03: {
    label: "Signal v2 FanDuel US scan",
    status: "client-safe signal",
    note: "Completed 2026-07-03. Deep research narrative remains excluded."
  },
  signal_seo_100_organic_0_paid_2026_07_03: {
    label: "Signal SEO search evidence",
    status: "client-safe signal",
    note: "100 organic keywords captured; no paid keywords captured."
  },
  dataforseo_paid_serp_fanduel_2026_07_09: {
    label: "DataForSEO paid SERP domain cut",
    status: "working provider evidence",
    note: "15 weekly paid-SERP observations across the corrected set. FanDuel rows point to FDTVx streaming; two DraftKings rows are sportsbook ads. This is not spend, budget, targeting or efficiency evidence."
  },
  missing_paid_serp_pass: {
    label: "Paid SERP capture",
    status: "captured with scope caveat",
    note: "A provider-domain cut is loaded. Priority-query live SERPs and client account data are still required before paid-search efficiency claims."
  },
  fanduel_demo_media_priors_2026: {
    label: "FanDuel demo media priors",
    status: "synthetic demo",
    note: "Working USD-equivalent priors, not Admiral client performance data."
  },
  fanduel_reach_curve_synthetic_demo_2026: {
    label: "Synthetic reach curves",
    status: "synthetic demo",
    note: "Demo response curves to be replaced by MMM, platform and client data."
  },
  fanduel_demo_media_owner_priors_2026: {
    label: "Media owner priors",
    status: "synthetic demo",
    note: "Owner splits are placeholders for the planning demo."
  },
  predict_persona_seeds_working_2026_07_03: {
    label: "Predict US persona seeds",
    status: "working source",
    note: "Demo persona seeds from the ZIP3 bridge, state attention data and product governance rows. Not final audience research."
  },
  us_state_governance_working_research_2026_07_03: {
    label: "US state product availability research",
    status: "FanDuel-owned source",
    note: "All-state FanDuel-owned product availability plus Census population. Regulator verification still required."
  },
  us_census_nst_est2025_population: {
    label: "US Census Vintage 2025 population estimates",
    status: "official source",
    note: "Annual state resident population estimate for July 1, 2025."
  },
  fanduel_sportsbook_predicts_map: {
    label: "FanDuel Sportsbook and Predicts availability",
    status: "FanDuel-owned source",
    note: "State-by-state product availability table parsed from FanDuel's legal sports betting map."
  },
  fanduel_casino_states: {
    label: "FanDuel Casino state availability",
    status: "FanDuel-owned source",
    note: "FanDuel Casino page lists CT, MI, NJ, PA and WV as real-money online casino states."
  },
  fanduel_fantasy_rules: {
    label: "FanDuel fantasy rules and eligibility",
    status: "FanDuel-owned source",
    note: "DFS eligibility, age thresholds, free-contest-only states and Texas caveat parsed from FanDuel rules."
  },
  fanduel_predicts_nationwide: {
    label: "FanDuel Predicts availability",
    status: "FanDuel-owned source",
    note: "FanDuel says Predicts is available nationwide; markets vary by state."
  },
  signal_us_zip3_map_working_2026_07_03: {
    label: "Signal v2 ZIP3 map",
    status: "working source",
    note: "896 ZIP3 shape projection from Signal v2 with working ZIP3-to-state bridge."
  },
  fanduel_stage1_demo_evidence_rules_2026: {
    label: "Stage 1 demo evidence rules",
    status: "working source",
    note: "QA criteria for demo use and caveat handling."
  },
  fanduel_trends_comparative_index_2026_07_03: {
    label: "Comparative Trends index",
    status: "working source",
    note: "Built from the single-request 12-month comparative Google Trends series, with the leading brand scaled to 100."
  },
  fanduel_state_budget_model_2026: {
    label: "State budget allocation model",
    status: "synthetic-working allocation model",
    note: "Demo-only state allocation by opportunity score, population weight and governance status. True state dimensioning remains Stage 3."
  },
  fanduel_draw_calendar_2026: {
    label: "2026 sports calendar proxy",
    status: "synthetic-working planning source",
    note: "Month-level sports intensity moments used for demo phasing. Fixture-level verification is not loaded."
  },
  fanduel_fixture_calendar_manifest_v1: {
    label: "Fixture calendar source",
    status: "authored-working",
    note: "Structural sports fixtures and fixed-date anchors. Specific matchups remain schedule-feed pending."
  },
  dataforseo_google_trends_fanduel_series: {
    label: "FanDuel Google Trends series",
    status: "working source",
    note: "Weekly FanDuel values from the comparative DataForSEO/Google Trends series used as calendar seasonality input."
  },
  fanduel_fixture_heat_model_v1: {
    label: "Fixture heat model",
    status: "modelled-working",
    note: "Daily, timeslot and state heat generated from the fixture source plus real Trends seasonality."
  },
  fanduel_fixture_key_periods_v1: {
    label: "Fixture key periods",
    status: "modelled-working",
    note: "Named planning windows derived from the fixture heat model for Calendar, Reporting and one-off handoff."
  },
  fanduel_calendar_modifiers_v1: {
    label: "Calendar modifiers",
    status: "modelled-working",
    note: "Generated from the fixture key-period file so planning modifiers and the visible Calendar use the same source."
  },
  fanduel_marketing_spend_baseline_2026: {
    label: "FanDuel US marketing spend baseline",
    status: "inferred public-source baseline",
    note: "Best-guess 2026 annual and monthly channel spend model built from Flutter disclosures and public ad-spend evidence. Not FanDuel internal data."
  },
  fanduel_zip3_product_media_estimates_2026: {
    label: "FanDuel ZIP3 product media estimates",
    status: "working ZIP3 media estimate",
    note: "ZIP3-level product on/off status and expected media-spend proxy. Uses Signal v2 ZIP3 data, state product rules and inferred media pools."
  },
  fanduel_plan_store_manifest_v1: {
    label: "FanDuel plan store",
    status: "working plan store",
    note: "File-based annual plan versions and active-plan pointer for the Planning Time Machine."
  },
  fanduel_sde_actuals_manifest_v1: {
    label: "Synthetic Data Engine actuals",
    status: "synthetic-simulated",
    note: "Reusable SDE output: GA4, Google Ads, Meta, plans, ATL, creative and sales splits. Coherence report required before demo use."
  },
  fanduel_sde_history_plan_v1: {
    label: "SDE 18-month planning history",
    status: "synthetic-simulated",
    note: "File-store record created from the SDE compact monthly bridge so past months can be inspected alongside annual plans."
  },
  fanduel_revision_engine_v1: {
    label: "Monthly revision engine",
    status: "synthetic demo",
    note: "Deterministic freeze, replan, diff and activate workflow ported to engine/revision.py and mirrored in the browser demo."
  },
  fanduel_planning_engine_capabilities_v1: {
    label: "Planning engine capability contract",
    status: "working contract",
    note: "Declares which deterministic planning paths are wired, which save paths are demo-only, and which paths remain unavailable."
  },
  fanduel_campaign_overlay_object_v1: {
    label: "Planning OS campaign overlay object",
    status: "working demo object",
    note: "Saved one-off campaigns with product, basis, months, state scope, channel allocation and Flightpath overlay rows."
  },
  fanduel_reporting_line_items_2026: {
    label: "SDE reporting drill dataset",
    status: "synthetic-simulated",
    note: "Compact Google Ads and Meta line-item rollup for channel, month and Brand/DR reporting."
  },
  fanduel_reporting_connector_manifest_v1: {
    label: "Reporting connector manifest",
    status: "connector slots declared",
    note: "Declares synthetic SDE bridge sources and the real export/API slots that should replace them."
  },
  fanduel_recommendations_v1: {
    label: "Recommendations decision set",
    status: "synthetic-working demo",
    note: "Channel, alert and strategic recommendation examples. They demonstrate the workflow shape and are not Admiral account findings."
  },
  fanduel_recommendation_action_manifest_v1: {
    label: "Recommendation action contract",
    status: "preview only",
    note: "Human approval, fresh platform reads, allow-listed accounts, audit receipts and rollback values are required before any live Google Ads or Meta write."
  },
  fanduel_sde_promo_cost_model_2026: {
    label: "SDE promo and all-in CAC model",
    status: "synthetic-simulated",
    note: "Demo promo-cost-per-FTD assumptions by product. Replaces media CPA with all-in CAC when selected."
  },
  fanduel_sde_responsible_gambling_share_2026: {
    label: "Responsible-gambling share line",
    status: "synthetic-simulated",
    note: "1.5% working share of media-covered messaging added as a visible planning line."
  },
  caspr_state_gambling_tax_scorecard_2026: {
    label: "CASPR online gambling tax scorecard",
    status: "public working source",
    note: "Used as broad working state tax support where official state source has not yet been individually checked."
  },
  nj_dge_specific_taxes_2025: {
    label: "New Jersey DGE gaming specific taxes and fees",
    status: "official source",
    note: "NJ DGE notes online sports wagering moved from 13% to 19.75% effective July 1, 2025."
  },
  michigan_mgcb_wagering_tax_2026: {
    label: "Michigan Gaming Control Board wagering tax information",
    status: "official source",
    note: "MGCB states an 8.4% tax rate on adjusted gross sports betting receipts."
  },
  publisher_gambling_policies_v1: {
    label: "Publisher gambling-ad policy receipts",
    status: "research-support verified primary",
    note: "Eleven platform rows checked 2026-07-10. Eight have primary policy receipts, one is partial and two remain not publicly verified."
  },
  custom_product_working_default: {
    label: "Demo custom product default",
    status: "working source",
    note: "New demo products default to not_listed in every state until a verified product/state source is added."
  }
};

const PRODUCT_LABELS = {
  sportsbook: "Sportsbook",
  casino: "Casino",
  predicts: "Predicts",
  dfs: "DFS",
  racing: "FanDuel Racing"
};

const BASE_PRODUCT_KEYS = new Set(Object.keys(PRODUCT_LABELS));

const PROMO_COST_PER_FTD = {
  sportsbook: 115,
  casino: 75,
  dfs: 20,
  predicts: 12,
  racing: 45
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const FALLBACK_PLANNING_CHAT_MODES = [
  {
    key: "year",
    label: "Year",
    group: "Annual plans",
    description: "Create and interrogate the annual plan with deterministic numbers.",
    prompt: "Describe the annual plan",
    deterministic_handler: "annualPlanAnswer",
    output_panel: "year_plan_materialising",
    engine: {
      default: "llm",
      toggle: ["deterministic", "both"],
      rule: "Deterministic planner owns all annual plan numbers."
    },
    cold_load: { title: "Active annual plan is ready" },
    cold_load_prompts: []
  },
  {
    key: "month",
    label: "Month",
    group: "Monthly replans",
    description: "Replan one month inside the active year, with old-vs-new comparison.",
    prompt: "Replan September",
    deterministic_handler: "revisionPreview",
    output_panel: "month_old_vs_new",
    engine: {
      default: "deterministic",
      toggle: ["deterministic", "both"],
      rule: "Revision preview freezes earlier months and records the year-fit impact."
    },
    cold_load: { title: "Monthly replan mode is ready" },
    cold_load_prompts: ["Replan September", "Which month is furthest off plan?", "Show the year-fit impact"]
  },
  {
    key: "launch", label: "Launch", group: "Launch planning", description: "Plan a new-product launch or layer new money around existing activity.", prompt: "Describe the launch", deterministic_handler: "launchGate", output_panel: "launch_gate", engine: { default: "deterministic", toggle: ["deterministic", "both"], rule: "Launch asks new-product versus layered before planning." }, cold_load: { title: "Launch mode is ready" }, cold_load_prompts: []
  },
  {
    key: "oneoff",
    label: "One-off",
    group: "Campaigns",
    description: "Plan one campaign after incrementality and governance checks.",
    prompt: "Describe the campaign",
    deterministic_handler: "oneOffGate",
    output_panel: "one_off_gate",
    engine: {
      default: "deterministic",
      toggle: ["deterministic", "both"],
      rule: "One-off planning must pass the incrementality gate before output is accepted."
    },
    cold_load: { title: "One-off campaign mode is ready" },
    cold_load_prompts: []
  },
  {
    key: "free",
    label: "Free chat",
    group: "Questions",
    description: "Ask grounded questions and capture ideas without changing the plan.",
    prompt: "What data is simulated?",
    deterministic_handler: "freeQuestion",
    output_panel: "ideas_canvas",
    engine: {
      default: "deterministic",
      toggle: ["deterministic", "llm", "both"],
      rule: "Free mode is LLM-first when enabled; deterministic facts remain the safety floor."
    },
    cold_load: { title: "Ask mode is ready" },
    cold_load_prompts: ["What data is simulated?", "What does the paid SERP cut prove?", "Explain the state value index"]
  }
];

const CHAT_MODE_DISPLAY_ORDER = ["free", "year", "month", "launch", "oneoff"];

const DINK_DEFINITIONS = {
  period: { label: "Period", primary: true },
  budget: { label: "Budget", primary: true },
  geo: { label: "Geo" },
  audience: { label: "Audience" },
  channels: { label: "Channels" },
  goal: { label: "Goal" },
  kpi: { label: "KPI" }
};

const CHANNEL_SCOPE_OPTIONS = [
  { value: "all", label: "All channels", match: () => true },
  { value: "search", label: "Search only", match: (channel) => /\bsearch\b|app store|asa/i.test(channel) },
  { value: "ctv", label: "CTV only", match: (channel) => /\bctv\b|streaming|youtube|online video/i.test(channel) },
  { value: "tv_video", label: "TV / video", match: (channel) => /\btv\b|linear|ctv|streaming|youtube|video/i.test(channel) },
  { value: "social", label: "Social only", match: (channel) => /social|influencer|creator/i.test(channel) }
];

const PRODUCT_TERMS = {
  sportsbook: /\b(sportsbook|sports book|sports betting|betting|nfl|super bowl|march madness)\b/i,
  casino: /\b(casino|igaming|i-gaming|slots|blackjack|roulette)\b/i,
  predicts: /\b(predicts|prediction market|prediction markets|markets)\b/i,
  dfs: /\b(dfs|daily fantasy|fantasy)\b/i,
  racing: /\b(racing|horse racing|fanduel racing|horses|racetrack|kentucky derby)\b/i
};

const PRODUCT_EXCLUSION_TERMS = {
  sportsbook: /\b(no|exclude|excluding|suppress|avoid|without|keep)\b.{0,28}\b(sportsbook|sports book|sports betting|betting)\b|\b(sportsbook|sports book|sports betting|betting)\b.{0,18}\b(out|off|excluded|suppressed)\b/i,
  casino: /\b(no|exclude|excluding|suppress|avoid|without|keep)\b.{0,28}\b(casino|igaming|i-gaming|slots)\b|\b(casino|igaming|i-gaming|slots)\b.{0,18}\b(out|off|excluded|suppressed)\b/i,
  predicts: /\b(no|exclude|excluding|suppress|avoid|without|keep)\b.{0,28}\b(predicts|prediction market|prediction markets|markets)\b|\b(predicts|prediction market|prediction markets|markets)\b.{0,18}\b(out|off|excluded|suppressed)\b/i,
  dfs: /\b(no|exclude|excluding|suppress|avoid|without|keep)\b.{0,28}\b(dfs|daily fantasy|fantasy)\b|\b(dfs|daily fantasy|fantasy)\b.{0,18}\b(out|off|excluded|suppressed)\b/i,
  racing: /\b(no|exclude|excluding|suppress|avoid|without|keep)\b.{0,28}\b(racing|horse racing|fanduel racing)\b|\b(racing|horse racing|fanduel racing)\b.{0,18}\b(out|off|excluded|suppressed)\b/i
};

const REPORTING_CONNECTORS = [
  "Google Analytics",
  "Google Ads",
  "Meta",
  "TTD",
  "Media plans"
];

const REPORTING_VIEWS = {
  paid_search: {
    label: "Paid Search",
    channels: ["Paid Search", "App Store", "App Store / ASA"],
    metricLabel: "Clicks",
    evidence: "15-row paid-SERP provider cut; no spend or efficiency evidence",
    kpi: { cpc: 3.1, ctr: 0.052, conversionRate: 0.18 },
    sources: [
      { label: "Google brand search", share: 0.34, cpc: 2.2, ctr: 0.18, conversionRate: 0.28 },
      { label: "Google non-brand search", share: 0.36, cpc: 4.8, ctr: 0.042, conversionRate: 0.14 },
      { label: "Microsoft Ads", share: 0.13, cpc: 2.7, ctr: 0.05, conversionRate: 0.17 },
      { label: "App-intent search", share: 0.17, cpc: 2.9, ctr: 0.065, conversionRate: 0.2 }
    ]
  },
  social: {
    label: "Paid Social",
    channels: ["Paid Social", "Influencer / Creator"],
    metricLabel: "Clicks",
    evidence: "Walled-garden estimate",
    kpi: { cpm: 13.5, ctr: 0.008, conversionRate: 0.055 },
    sources: [
      { label: "Meta paid social", share: 0.48, cpm: 12.5, ctr: 0.009, conversionRate: 0.06 },
      { label: "TikTok / short-form video", share: 0.22, cpm: 10.8, ctr: 0.007, conversionRate: 0.045 },
      { label: "X / Reddit / communities", share: 0.12, cpm: 9.8, ctr: 0.006, conversionRate: 0.04 },
      { label: "Creator amplification", share: 0.18, cpm: 18.5, ctr: 0.01, conversionRate: 0.05 }
    ]
  },
  tv_video: {
    label: "TV / Video",
    channels: ["Linear TV", "CTV", "CTV / Streaming", "YouTube", "YouTube / Online Video"],
    metricLabel: "Response visits",
    evidence: "TV/CTV/video inference",
    kpi: { cpm: 28, ctr: 0.0016, conversionRate: 0.09 },
    sources: [
      { label: "Linear TV", share: 0.58, cpm: 32, ctr: 0.0011, conversionRate: 0.08 },
      { label: "CTV / streaming", share: 0.26, cpm: 25, ctr: 0.0018, conversionRate: 0.09 },
      { label: "YouTube video", share: 0.16, cpm: 17, ctr: 0.0045, conversionRate: 0.075 }
    ]
  },
  total: {
    label: "All Channels",
    channels: [],
    metricLabel: "Responses",
    evidence: "Full inferred envelope",
    kpi: { cpm: 22, ctr: 0.004, conversionRate: 0.09 },
    sources: []
  }
};

const ATTRIBUTION_TESTS = [
  {
    id: 1,
    title: "Anomaly & Change-point Monitor",
    status: "now",
    group: "Monitor",
    question: "What changed unexpectedly, where, and what explains it?",
    method: "Robust time-series baselines, change-point detection and contribution decomposition.",
    available: ["Daily SDE delivery", "Channel and month dimensions", "Plan-versus-actual variance"],
    needs: ["8+ weeks of stable history", "Business alert thresholds"],
    decision: "Catch delivery breaks before they become a reporting surprise."
  },
  {
    id: 2,
    title: "Creative Wear-out",
    status: "now",
    group: "Monitor",
    question: "Which creative is fatiguing and when should it rotate?",
    method: "Change points and expected-versus-actual response controlling for placement, geo and daypart.",
    available: ["Creative taxonomy", "Daily delivery structure", "Synthetic response signals"],
    needs: ["Creative-level real outcomes", "Stable creative IDs", "Rotation rules"],
    decision: "Turn creative reporting into an evidence-led rotation decision."
  },
  {
    id: 3,
    title: "Geo Incrementality Lab",
    status: "next",
    group: "Measure",
    question: "Did advertising create incremental FTDs in exposed markets?",
    method: "Matched markets, synthetic controls or time-based regression with power and contamination checks.",
    available: ["896 ZIP3 shapes", "State/product governance", "Channel-month plan and synthetic actuals"],
    needs: ["Real ZIP/DMA outcomes", "Stable pre-period", "Approved exposed and holdout cells"],
    decision: "Calibrate attributed conversions and response curves with causal evidence."
  },
  {
    id: 4,
    title: "Campaign Causal Impact",
    status: "next",
    group: "Measure",
    question: "What changed because a campaign launched without a planned holdout?",
    method: "Bayesian structural time series or interrupted time series with unaffected controls.",
    available: ["Campaign dates", "Fixture and seasonality controls", "Daily heat model"],
    needs: ["Real business outcome series", "Credible unaffected control", "Long pre-period"],
    decision: "Estimate a counterfactual while labelling the result quasi-experimental."
  },
  {
    id: 5,
    title: "Time to Buy",
    status: "later",
    group: "Predict",
    question: "How long after first exposure do customers convert?",
    method: "Survival analysis, Kaplan–Meier curves and hazard models with right-censoring.",
    available: ["Campaign timing", "Product conversion definitions"],
    needs: ["Privacy-safe exposure IDs", "Conversion timestamps", "Censoring rules"],
    decision: "Set defensible attribution and cooldown windows."
  },
  {
    id: 6,
    title: "Frequency & Saturation",
    status: "next",
    group: "Predict",
    question: "Where does another exposure stop adding useful response?",
    method: "Dose-response curves, splines and hierarchical marginal-response estimates.",
    available: ["Response-curve framework", "Channel planning priors"],
    needs: ["Reach/frequency cohorts", "Outcome by cohort", "Cost"],
    decision: "Replace arbitrary frequency caps with an evidence-based range."
  },
  {
    id: 7,
    title: "Market Opportunity Clusters",
    status: "next",
    group: "Explore",
    question: "Which markets behave similarly and where is delivery underweight?",
    method: "Standardised clustering, opportunity scoring and optional spatial smoothing.",
    available: ["State value index", "ZIP3 working estimates", "Governance and population"],
    needs: ["Real sales and delivery by geo", "Approved opportunity variables"],
    decision: "Prioritise markets where incremental investment has room to work."
  },
  {
    id: 8,
    title: "Journey & Sequence Analysis",
    status: "later",
    group: "Explore",
    question: "Which channel and creative sequences assist conversion?",
    method: "Path mining, Markov removal effects and sequence models checked against simple attribution.",
    available: ["Cross-channel taxonomy", "Reporting line-item structure"],
    needs: ["Ordered event-level touchpoints", "Privacy-safe identity", "Conversion events"],
    decision: "Explain assisting roles without pretending correlation is incrementality."
  },
  {
    id: 9,
    title: "Marketing Mix & Budget Simulator",
    status: "later",
    group: "Optimise",
    question: "What is each channel's incremental contribution and where should the next dollar go?",
    method: "Bayesian or regularised MMM with adstock, saturation, seasonality and experiment calibration.",
    available: ["Planning engine", "Experiment calibration path", "Calendar controls"],
    needs: ["Preferably 2+ years weekly outcomes", "Spend and external drivers", "Lift-study results"],
    decision: "Turn causal evidence into a defensible budget recommendation."
  },
  {
    id: 10,
    title: "Build Your Own Test",
    status: "next",
    group: "Design",
    question: "Can an analyst turn a commercial question into a governed test specification?",
    method: "Guardrailed A/B, geo, cohort, time-series, regression and clustering templates.",
    available: ["Approved test catalogue", "Known FanDuel data shapes", "Evidence gates"],
    needs: ["Saved test specs", "Backend job runner", "Approval and audit trail"],
    decision: "Enable new questions without unrestricted production-data analysis."
  }
];

const ATTRIBUTION_CHANNEL_PROFILES = {
  "Paid Search": { lift: 8.6, low: 3.1, high: 14.2, spend: 520000, incremental: 1160, attributed: 1840, value: 1320000 },
  "Paid Social": { lift: 12.4, low: 7.2, high: 17.6, spend: 420000, incremental: 1060, attributed: 1980, value: 848000 },
  CTV: { lift: 15.8, low: 8.9, high: 22.7, spend: 680000, incremental: 1420, attributed: 2130, value: 1510000 },
  "All measured channels": { lift: 11.7, low: 6.8, high: 16.5, spend: 1620000, incremental: 3640, attributed: 5950, value: 3710000 }
};

const ATTRIBUTION_PLATFORM_STUDIES = {
  google: {
    name: "Google Ads",
    study: "Conversion Lift",
    status: "setup-ready",
    colour: "#4285f4",
    summary: "Use user-based or geography-based holdouts to separate incremental conversions from standard attributed conversions.",
    requirements: ["Eligible campaign and conversion action", "Feasibility / study-power check", "Treatment and control split", "Wait for final study results"],
    resultFields: ["Incremental conversions", "Relative lift", "iCPA", "iROAS", "Confidence interval"],
    sourceUrl: "https://support.google.com/google-ads/answer/12003020?hl=en"
  },
  meta: {
    name: "Meta",
    study: "Conversion Lift",
    status: "recommended",
    colour: "#0866ff",
    summary: "Use randomised test and control groups; strengthen web, app and offline outcomes with Conversions API before reading lift.",
    requirements: ["Conversions API / pixel event quality", "Eligible campaigns and outcome", "Randomised holdout", "Marketing Science feasibility review"],
    resultFields: ["Incremental conversions", "Conversion lift", "Cost per incremental conversion", "Confidence", "Cross-channel search impact"],
    sourceUrl: "https://www.facebook.com/business/help/AboutConversionsAPI"
  }
};

const INSIGHT_BRAND_COLORS = {
  fanduel: "#1493ff",
  draftkings: "#2fd08c",
  bet365: "#d0a900",
  betmgm: "#8b63d7",
  "fanatics sportsbook": "#1596a8"
};

const INSIGHT_BRAND_LABELS = {
  fanduel: "FanDuel",
  draftkings: "DraftKings",
  bet365: "bet365",
  betmgm: "BetMGM",
  "fanatics sportsbook": "Fanatics Sportsbook"
};

const INSIGHT_STATE_TILE_COORDS = {
  AK: [0, 0], ME: [11, 0],
  VT: [10, 1], NH: [11, 1],
  WA: [1, 2], ID: [2, 2], MT: [3, 2], ND: [4, 2], MN: [5, 2], WI: [6, 2], MI: [8, 2], NY: [9, 2], MA: [10, 2], RI: [11, 2],
  OR: [1, 3], NV: [2, 3], WY: [3, 3], SD: [4, 3], IA: [5, 3], IL: [6, 3], IN: [7, 3], OH: [8, 3], PA: [9, 3], NJ: [10, 3], CT: [11, 3],
  CA: [1, 4], UT: [2, 4], CO: [3, 4], NE: [4, 4], MO: [5, 4], KY: [6, 4], WV: [7, 4], VA: [8, 4], MD: [9, 4], DE: [10, 4],
  AZ: [2, 5], NM: [3, 5], KS: [4, 5], AR: [5, 5], TN: [6, 5], NC: [7, 5], SC: [8, 5], DC: [9, 5],
  OK: [4, 6], LA: [5, 6], MS: [6, 6], AL: [7, 6], GA: [8, 6],
  HI: [0, 7], TX: [4, 7], FL: [9, 7]
};

const INSIGHT_HEAT_METRICS = {
  fd_strength: {
    name: "FanDuel search index",
    status: "client-safe signal",
    note: "FanDuel's within-brand Google Trends state index. It ranks FanDuel states against FanDuel's own footprint."
  },
  fd_share: {
    name: "FanDuel state share of search",
    status: "client-safe signal",
    note: "Observed average share from one FanDuel-anchored five-brand Trends request per state. Raw index levels are not compared across states."
  },
  dk_pressure: {
    name: "DraftKings pressure",
    status: "client-safe signal",
    note: "DraftKings within-brand state index. It is a pressure lens, not an exact cross-brand share."
  },
  availability: {
    name: "Product availability",
    status: "working research",
    note: "FanDuel-owned availability sources. Regulator verification remains a gate before client claims."
  },
  restrictions: {
    name: "Restriction load",
    status: "working research",
    note: "Fantasy age thresholds, college restrictions and paid-contest limits used as a compliance load proxy."
  }
};

const INSIGHT_OWNER_TYPE_LABELS = {
  all: "All",
  national_tv: "National TV",
  local_tv: "Local TV",
  streamer: "Streamers",
  ctv_platform: "CTV platforms",
  video_social: "Video",
  social: "Social",
  publisher: "Publishers",
  audio: "Audio",
  adtech_data: "AdTech and data"
};

const INSIGHT_STANCE_LABELS = {
  accepts_with_restrictions: "accepts with restrictions",
  prohibits: "prohibits",
  prohibits_with_exceptions: "prohibits with exceptions",
  unknown: "unknown"
};

const SENSITIVE_CHANNELS = new Set([
  "Paid Search",
  "Paid Social",
  "Affiliate",
  "Influencer/Creator"
]);

const WATCHLIST_CHANNELS = new Set(["Organic Search", "CRM", "App Store"]);

const app = {
  data: null,
  modeConfigs: [],
  selectedState: "NC",
  selectedProduct: "sportsbook",
  selectedScenario: "search",
  selectedPlanningMode: "year",
  selectedChannel: "Paid Search",
  selectedSurface: "planning",
  selectedCalendarView: "quarter",
  selectedCalendarMonth: "2026-09",
  selectedCalendarDate: "2026-09-10",
  selectedCalendarSport: "all",
  selectedCalendarState: "US",
  selectedCalendarProduct: "all",
  customCalendarEntries: [],
  calendarCustomNotice: "",
  flightpathStartMonth: "2026-01",
  flightpathEndMonth: "2026-12",
  selectedReportingView: "paid_search",
  selectedReportingMonth: "2026-02",
  reportingStartMonth: "2026-02",
  reportingEndMonth: "2026-02",
  selectedReportingChannels: [],
  selectedReportingMapLayer: "zip3",
  selectedReportingProduct: "predicts",
  selectedRecommendationKind: "all",
  selectedRecommendationChannel: "all",
  selectedRecommendationCategory: "all",
  selectedRecommendationPriority: "all",
  selectedRecommendationId: "",
  recommendationActionStates: {},
  recommendationNotice: "",
  selectedAttributionTest: 3,
  attributionTestFilter: "all",
  attributionOutcome: "ftd",
  attributionChannel: "Paid Social",
  attributionDuration: "6",
  attributionPlatformFocus: "google",
  selectedInsightRaceState: "US",
  selectedInsightRaceMode: "share",
  selectedInsightHeatMetric: "fd_strength",
  selectedInsightHeatState: "NJ",
  selectedPredictionOperator: "fanduel_predicts",
  selectedPredictionLens: "sports",
  selectedPredictionState: "TX",
  selectedComparePlanA: "baseline",
  selectedComparePlanB: "efficiency_v2",
  stressRequestText: "",
  stressResult: null,
  stressError: "",
  selectedInsightZipState: "NJ",
  selectedInsightOwnerType: "all",
  selectedInsightQueryBrand: "draftkings",
  creativeChannel: "meta",
  creativeStartDate: "2026-03-01",
  creativeEndDate: "2026-07-25",
  creativeAdvertiser: "all",
  creativeProduct: "all",
  creativeState: "all",
  creativeQuery: "",
  selectedCreativeId: "",
  creativeBriefFinding: "",
  creativeBriefVariable: "offer",
  creativeBriefState: "NJ",
  creativeBriefKpi: "Incremental FTD",
  creativeGeneratedBrief: null,
  selectedAudiencePersona: "",
  audienceBuilder: null,
  audienceAssistStatus: "",
  customAudiences: [],
  selectedMapLayer: "zip3",
  curveStateLens: "live",
  planningScope: "national",
  manualStateOverrides: {},
  budgetOptimisation: "volume",
  reportingDrillSegment: "all",
  reportingCpaMode: "media",
  firewallState: "TX",
  firewallApprovalNotice: "",
  texasLaunchStaged: false,
  zip3Zoom: ZIP3_DEFAULT_VIEW.zoom,
  zip3PanX: ZIP3_DEFAULT_VIEW.panX,
  zip3PanY: ZIP3_DEFAULT_VIEW.panY,
  collapsedRows: new Set(),
  oneOffCampaigns: [],
  oneOffIncrementalityBasis: "",
  oneOffProduct: "sportsbook",
  oneOffDraft: null,
  customProducts: [],
  addProductOpen: false,
  addProductWarning: "",
  chatDinks: {
    period: "",
    budget: null,
    geo: "",
    audience: "",
    channels: "all",
    goal: "",
    kpi: ""
  },
  activeDinkPicker: "",
  modeQuestion: "",
  chatConversations: {},
  briefLibrary: [],
  activeChatOverlay: null,
  chatInput: "",
  chatSubmitting: false,
  chatFormat: "narrative",
  chatEngine: "deterministic",
  planningBasis: "data_led",
  chatRailOpen: false,
  chatUploadWarning: "",
  ideasCanvasNotice: "",
  llmLastStatus: "",
  sessionStoreStatus: "",
  freePageContext: null,
  planBarOverlayOpen: false,
  selectedZip3: null,
  selectedEvidenceContext: null,
  evidenceFocusSourceId: "",
  revisionDraft: null,
  revisionAudit: [],
  monthlyPlanningNote: null,
  commandPaletteOpen: false,
  commandPaletteQuery: "",
  spend: 900000
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.json();
}

async function loadModeConfigs() {
  const loaded = await Promise.all(MODE_CONFIG_PATHS.map((path) => loadJson(path)));
  const fallbackByKey = new Map(FALLBACK_PLANNING_CHAT_MODES.map((mode) => [mode.key, mode]));
  return FALLBACK_PLANNING_CHAT_MODES.map((fallback, index) => {
    const mode = loaded.find((item) => item.key === fallback.key) || loaded[index] || {};
    return {
      ...fallback,
      ...mode,
      engine: {
        ...(fallback.engine || {}),
        ...(mode.engine || {})
      },
      cold_load: {
        ...(fallback.cold_load || {}),
        ...(mode.cold_load || {})
      },
      cold_load_prompts: mode.cold_load_prompts || fallback.cold_load_prompts || [],
      aliases: [...new Set([fallback.key, mode.key, ...(mode.aliases || [])].filter(Boolean))]
    };
  }).concat(
    loaded
      .filter((mode) => mode?.key && !fallbackByKey.has(mode.key))
      .map((mode) => ({
        ...mode,
        aliases: [...new Set([mode.key, ...(mode.aliases || [])].filter(Boolean))]
      }))
  );
}

async function loadPlanStore(manifest) {
  const entries = await Promise.all(
    (manifest.plans || []).map(async (planMeta) => {
      const [plan, meta] = await Promise.all([
        loadJson(`../plans/${planMeta.plan_path}`),
        loadJson(`../plans/${planMeta.meta_path}`)
      ]);
      return {
        meta: { ...planMeta, ...meta },
        plan
      };
    })
  );
  const byId = Object.fromEntries(entries.map((entry) => [entry.meta.plan_id, entry]));
  const byScenario = Object.fromEntries(entries.map((entry) => [entry.meta.scenario_key, entry]));
  return {
    manifest,
    entries,
    byId,
    byScenario,
    active: byId[manifest.active_annual] || entries[0] || null
  };
}

async function init() {
  try {
    renderTeamTestBadge();
    const [entries, modeConfigs] = await Promise.all([
      Promise.all(Object.entries(DATA_PATHS).map(async ([key, path]) => [key, await loadJson(path)])),
      loadModeConfigs()
    ]);
    app.modeConfigs = modeConfigs;
    app.data = Object.fromEntries(entries);
    app.data.planStore = await loadPlanStore(app.data.planManifest);
    app.selectedScenario = app.data.planStore.active?.meta.scenario_key || app.selectedScenario;
    applyDemoResetManifest();
    loadCustomProducts();
    loadZip3ViewPreference();
    loadCampaignStore();
    loadRecommendationActionStates();
    await hydrateChatSessions();
    applyUrlModeOverride();
    syncChatEngineWithMode(true);
    app.selectedChannel = getLargestSpendChannel(getPlan()) || app.selectedChannel;
    populateControls();
    bindEvents();
    render();
  } catch (error) {
    document.body.innerHTML = `
      <main class="app-shell">
        <section class="empty-state">
          <h1>Admiral demo data did not load</h1>
          <p>${escapeHtml(error.message)}</p>
          <p>Serve this folder from the planner-template-v2 root so the dashboard can read the local JSON files.</p>
        </section>
      </main>
    `;
  }
}

function applyDemoResetManifest() {
  const manifest = app.data?.demoReset;
  if (!manifest?.enabled || !manifest.reset_id) return;
  if (localStorage.getItem(DEMO_RESET_STORAGE_KEY) === manifest.reset_id) return;
  [...new Set([...(manifest.clear_local_storage_keys || []), CHAT_SESSION_STORAGE_KEY])].forEach((key) => {
    localStorage.removeItem(key);
  });
  localStorage.setItem(DEMO_RESET_STORAGE_KEY, manifest.reset_id);
  app.customProducts = [];
  app.oneOffCampaigns = [];
  app.briefLibrary = [];
  app.customAudiences = [];
  app.customCalendarEntries = [];
  app.recommendationActionStates = {};
  app.recommendationNotice = "";
  localStorage.removeItem(RECOMMENDATION_ACTION_STORAGE_KEY);
  app.chatConversations = {};
  app.freePageContext = null;
  app.zip3Zoom = ZIP3_DEFAULT_VIEW.zoom;
  app.zip3PanX = ZIP3_DEFAULT_VIEW.panX;
  app.zip3PanY = ZIP3_DEFAULT_VIEW.panY;
  const params = new URLSearchParams(window.location.search);
  let changed = false;
  (manifest.clear_query_flags || []).forEach((key) => {
    if (params.has(key)) {
      params.delete(key);
      changed = true;
    }
  });
  if (changed) {
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
  }
}

function normaliseTeamTesterId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

function renderTeamTestBadge() {
  const badge = $("#teamTestBadge");
  if (!badge || !TEAM_TESTER_ID) return;
  badge.classList.remove("is-hidden");
  badge.innerHTML = `<strong>Team test: ${escapeHtml(TEAM_TESTER_ID)}</strong><span>isolated session namespace</span>`;
}

function applyUrlModeOverride() {
  const params = new URLSearchParams(window.location.search);
  const surface = params.get("surface");
  if (["planning", "flightpath", "calendar", "reporting", "recommendations", "attribution", "insights", "creative", "audience", "regulation"].includes(surface)) {
    app.selectedSurface = surface;
  }
  const mode = params.get("mode");
  const resolved = normalizeChatModeKey(mode);
  if (resolved) {
    app.selectedPlanningMode = resolved;
  }
  const state = String(params.get("state") || "").toUpperCase();
  if (/^[A-Z]{2}$/.test(state)) app.selectedState = state;
  const product = String(params.get("product") || "").toLowerCase();
  if (PRODUCT_LABELS[product]) app.selectedProduct = product;
}

function planningChatModes() {
  return orderPlanningModes(app.modeConfigs?.length ? app.modeConfigs : FALLBACK_PLANNING_CHAT_MODES);
}

function orderPlanningModes(modes = []) {
  const order = new Map(CHAT_MODE_DISPLAY_ORDER.map((key, index) => [key, index]));
  return [...modes].sort((a, b) => {
    const aOrder = order.has(a.key) ? order.get(a.key) : 99;
    const bOrder = order.has(b.key) ? order.get(b.key) : 99;
    return aOrder - bOrder;
  });
}

function normalizeChatModeKey(value) {
  if (!value) return "";
  const target = String(value).toLowerCase().replace(/-/g, "_");
  const mode = planningChatModes().find((item) => {
    const keys = [item.key, ...(item.aliases || [])].filter(Boolean);
    return keys.some((key) => String(key).toLowerCase().replace(/-/g, "_") === target);
  });
  return mode?.key || "";
}

function activateChatMode(modeKey) {
  const previousMode = app.selectedPlanningMode;
  const resolved = normalizeChatModeKey(modeKey) || planningChatModes()[0]?.key || "year";
  app.selectedPlanningMode = resolved;
  if (previousMode !== resolved) {
    app.activeDinkPicker = "";
    if (resolved === "oneoff") {
      app.chatDinks.budget = null;
    }
  }
  syncChatEngineWithMode(previousMode !== resolved);
}

function syncChatEngineWithMode(resetToModeDefault = false) {
  const mode = currentChatMode();
  if (mode.key !== "free") {
    app.chatEngine = "deterministic";
    return;
  }
  if (!isUnderstudyEnabled() && app.chatEngine === "deterministic") {
    app.chatEngine = "llm";
    return;
  }
  const allowed = mode.engine?.toggle || ["deterministic"];
  if (resetToModeDefault || !allowed.includes(app.chatEngine)) {
    app.chatEngine = mode.engine?.default || allowed[0] || "deterministic";
  }
}

function getLlmServiceConfig() {
  const params = new URLSearchParams(window.location.search);
  const runtime = window.FANDUEL_LLM_CONFIG || {};
  const enabledFlag = runtime.enabled === true
    || params.get("llm") === "on"
    || localStorage.getItem(LLM_SERVICE_FLAG_KEY) === "1";
  return {
    enabled: Boolean(enabledFlag),
    endpoint: runtime.endpoint || params.get("llmEndpoint") || "",
    model: runtime.model || params.get("llmModel") || "env-configured",
    timeoutMs: Number(runtime.timeoutMs || params.get("llmTimeoutMs") || 8000)
  };
}

function isUnderstudyEnabled() {
  return new URLSearchParams(window.location.search).get("understudy") === "on";
}

function llmServiceStatus() {
  const config = getLlmServiceConfig();
  if (config.enabled && config.endpoint) {
    return { label: `LLM service ${config.model}`, className: "status-working" };
  }
  if (config.enabled) {
    return { label: "LLM flag on; local narration", className: "status-review" };
  }
  if (isUnderstudyEnabled()) {
    return { label: "understudy=on fallback", className: "status-review" };
  }
  return { label: "LLM required", className: "status-missing" };
}

const chatSessionAdapter = {
  async load() {
    let apiPayload = null;
    try {
      const response = await fetch(CHAT_SESSION_API_PATH, { cache: "no-store" });
      if (response.ok) {
        apiPayload = await response.json();
        app.sessionStoreStatus = "file-api";
        if (hasStoredConversations(apiPayload)) {
          return apiPayload;
        }
      }
    } catch (error) {
      console.warn("Chat session API load failed", error);
    }
    const legacyPayload = loadLegacyChatSessions();
    if (legacyPayload && legacyPayload.workspaceId === CHAT_SESSION_WORKSPACE_ID) {
      app.sessionStoreStatus = apiPayload ? "file-api-migrated" : "browser-storage-migration";
      this.save(legacyPayload);
      return legacyPayload;
    }
    return apiPayload;
  },
  save(payload) {
    const nextPayload = {
      schema: CHAT_SESSION_SCHEMA,
      storage: "file-api",
      ...payload,
      sessions: payload.conversations || payload.sessions || []
    };
    try {
      fetch(CHAT_SESSION_API_PATH, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextPayload)
      }).catch((error) => {
        console.warn("Chat session API save failed", error);
        saveLegacyChatSessions(nextPayload);
      });
    } catch (error) {
      console.warn("Chat session save failed", error);
      saveLegacyChatSessions(nextPayload);
    }
  }
};

function hasStoredConversations(payload) {
  return Array.isArray(payload?.conversations) && payload.conversations.length > 0
    || Array.isArray(payload?.sessions) && payload.sessions.length > 0;
}

function loadLegacyChatSessions() {
  try {
    return JSON.parse(localStorage.getItem(CHAT_SESSION_STORAGE_KEY) || "null");
  } catch (error) {
    console.warn("Legacy chat session load failed", error);
    return null;
  }
}

function saveLegacyChatSessions(payload) {
  try {
    localStorage.setItem(CHAT_SESSION_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Legacy chat session save failed", error);
  }
}

async function hydrateChatSessions() {
  const payload = await chatSessionAdapter.load();
  if (!payload || payload.workspaceId !== CHAT_SESSION_WORKSPACE_ID) return;
  const conversations = Array.isArray(payload.conversations) ? payload.conversations : Array.isArray(payload.sessions) ? payload.sessions : [];
  app.briefLibrary = Array.isArray(payload.briefLibrary) ? payload.briefLibrary : [];
  app.customAudiences = Array.isArray(payload.customAudiences) ? payload.customAudiences : [];
  app.customCalendarEntries = Array.isArray(payload.customCalendarEntries) ? payload.customCalendarEntries : [];
  app.chatConversations = Object.fromEntries(
    conversations
      .filter((conversation) => conversation?.mode && Array.isArray(conversation.messages))
      .map((conversation) => [
        conversation.mode,
        {
          ...conversation,
          attachments: Array.isArray(conversation.attachments) ? conversation.attachments : [],
          ideasCanvas: normaliseIdeasCanvas(conversation.ideasCanvas, conversation.mode),
          pendingYearBrief: conversation.pendingYearBrief || null,
          lastComputedYearPlan: conversation.lastComputedYearPlan || null,
          lastMonthRevision: conversation.lastMonthRevision || null,
          lastOneOffDraft: conversation.lastOneOffDraft || null
        }
      ])
  );
}

function persistChatSessions() {
  const conversations = Object.values(app.chatConversations).map((conversation) => ({
    id: conversation.id,
    workspaceId: CHAT_SESSION_WORKSPACE_ID,
    title: conversation.title,
    mode: conversation.mode,
    messages: conversation.messages || [],
    attachments: conversation.attachments || [],
    ideasCanvas: normaliseIdeasCanvas(conversation.ideasCanvas, conversation.mode),
    pendingYearBrief: conversation.pendingYearBrief || null,
    lastComputedYearPlan: conversation.lastComputedYearPlan || null,
    lastMonthRevision: conversation.lastMonthRevision || null,
    lastOneOffDraft: conversation.lastOneOffDraft || null,
    updatedAt: conversation.updatedAt || getDemoToday()
  }));
  chatSessionAdapter.save({
    schema: CHAT_SESSION_SCHEMA,
    workspaceId: CHAT_SESSION_WORKSPACE_ID,
    storage: "file-api",
    updatedAt: getDemoToday(),
    index: conversations.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      mode: conversation.mode,
      messageCount: conversation.messages.length,
      attachmentCount: conversation.attachments.length,
      updatedAt: conversation.updatedAt
    })),
    briefLibrary: app.briefLibrary || [],
    customAudiences: app.customAudiences || [],
    customCalendarEntries: app.customCalendarEntries || [],
    conversations,
    sessions: conversations
  });
}

function normaliseIdeasCanvas(canvas, modeKey = app.selectedPlanningMode) {
  const fallback = getDefaultIdeasCanvas(modeKey);
  if (!canvas || typeof canvas !== "object") return fallback;
  return {
    text: String(canvas.text ?? fallback.text),
    updatedAt: canvas.updatedAt || fallback.updatedAt,
    status: canvas.status || fallback.status,
    source: canvas.source || fallback.source
  };
}

function getDefaultIdeasCanvas(modeKey = app.selectedPlanningMode) {
  return {
    text: modeKey === "free"
      ? [
          "# Ideas canvas",
          "",
          "- Capture hypotheses, risks and follow-ups here.",
          "- Keep numbers tied to deterministic plan outputs.",
          "- Mark anything that needs Rob, Jack or legal review."
        ].join("\n")
      : "",
    updatedAt: getDemoToday(),
    status: "saved",
    source: "default"
  };
}

function populateControls() {
  refreshProductSelectOptions();
  const stateSelect = $("#stateSelect");
  const budgetStateRows = app.data.stateBudgets.scenarios[0]?.states || [];
  const stateRows = budgetStateRows
    .map((row) => ({ state: row.state, state_code: row.state_code }))
    .sort((a, b) => a.state.localeCompare(b.state));
  stateSelect.innerHTML = `<option value="US">National product-live map</option>` + stateRows
    .map((row) => `<option value="${escapeHtml(row.state_code)}">${escapeHtml(row.state)} (${escapeHtml(row.state_code)})</option>`)
    .join("");
  stateSelect.value = app.planningScope === "national" ? "US" : app.selectedState;

  const channelSelect = $("#channelSelect");
  if (!app.data.curves.channels.some((channel) => channel.channel === app.selectedChannel)) {
    app.selectedChannel = getLargestSpendChannel(getPlan()) || app.data.curves.channels[0]?.channel || app.selectedChannel;
  }
  channelSelect.innerHTML = app.data.curves.channels
    .map((channel) => `<option value="${escapeHtml(channel.channel)}">${escapeHtml(channel.channel)}</option>`)
    .join("");
  channelSelect.value = app.selectedChannel;
  populateCurveStateSelect("#curveStateSelect");

  const calendarMonthSelect = $("#calendarMonthSelect");
  if (calendarMonthSelect) {
    calendarMonthSelect.innerHTML = getCalendarMonths()
      .map((month) => `<option value="${escapeHtml(month)}">${escapeHtml(formatMonth(month))}</option>`)
      .join("");
    calendarMonthSelect.value = app.selectedCalendarMonth;
  }

  const calendarViewSelect = $("#calendarViewSelect");
  if (calendarViewSelect) {
    app.selectedCalendarView = normaliseCalendarView(app.selectedCalendarView);
    calendarViewSelect.value = app.selectedCalendarView;
  }

  const calendarStateSelect = $("#calendarStateSelect");
  if (calendarStateSelect) {
    const states = getCalendarStateOptions();
    calendarStateSelect.innerHTML = states
      .map((row) => `<option value="${escapeHtml(row.state_code)}">${escapeHtml(row.state)} (${escapeHtml(row.state_code)})</option>`)
      .join("");
    if (!states.some((row) => row.state_code === app.selectedCalendarState)) {
      app.selectedCalendarState = "US";
    }
    calendarStateSelect.value = app.selectedCalendarState;
  }

  const mapLayerSelect = $("#mapLayerSelect");
  if (mapLayerSelect) {
    mapLayerSelect.value = app.selectedMapLayer;
  }
  const budgetOptimisationSelect = $("#budgetOptimisationSelect");
  if (budgetOptimisationSelect) {
    budgetOptimisationSelect.value = app.budgetOptimisation;
  }
  populateFirewallStateSelect();
}

function bindEvents() {
  $("#stateSelect").addEventListener("change", (event) => {
    if (event.target.value === "US") {
      app.planningScope = "national";
      app.selectedZip3 = null;
    } else {
      app.planningScope = "state";
      app.selectedState = event.target.value;
      app.selectedZip3 = null;
    }
    render();
  });

  $("#productSelect").addEventListener("change", (event) => {
    syncProductSelection(event.target.value);
    app.manualStateOverrides = {};
    render();
  });

  $("#regulationProductSelect")?.addEventListener("change", (event) => {
    syncProductSelection(event.target.value);
    render();
  });

  $("#scenarioSelect").addEventListener("change", (event) => {
    app.selectedScenario = event.target.value;
    render();
  });

  $("#channelSelect").addEventListener("change", (event) => {
    app.selectedChannel = event.target.value;
    renderCurve();
    renderFlightpathCurve();
  });

  $("#curveStateSelect")?.addEventListener("change", (event) => {
    app.curveStateLens = event.target.value;
    const flightpathCurveStateSelect = $("#flightpathCurveStateSelect");
    if (flightpathCurveStateSelect) flightpathCurveStateSelect.value = app.curveStateLens;
    renderCurve();
    renderFlightpathCurve();
  });

  $("#flightpathPlanSelect")?.addEventListener("change", (event) => {
    app.selectedScenario = event.target.value;
    $("#scenarioSelect").value = app.selectedScenario;
    render();
  });

  $("#flightpathStartMonth")?.addEventListener("change", (event) => {
    app.flightpathStartMonth = event.target.value;
    if (app.flightpathEndMonth < app.flightpathStartMonth) app.flightpathEndMonth = app.flightpathStartMonth;
    render();
  });

  $("#flightpathEndMonth")?.addEventListener("change", (event) => {
    app.flightpathEndMonth = event.target.value;
    if (app.flightpathStartMonth > app.flightpathEndMonth) app.flightpathStartMonth = app.flightpathEndMonth;
    render();
  });

  $("#flightpathChannelSelect")?.addEventListener("change", (event) => {
    app.selectedChannel = event.target.value;
    $("#channelSelect").value = app.selectedChannel;
    renderCurve();
    renderFlightpathCurve();
  });

  $("#flightpathCurveStateSelect")?.addEventListener("change", (event) => {
    app.curveStateLens = event.target.value;
    const curveStateSelect = $("#curveStateSelect");
    if (curveStateSelect) curveStateSelect.value = app.curveStateLens;
    renderCurve();
    renderFlightpathCurve();
  });

  $("#flightpathSpendRange")?.addEventListener("input", (event) => {
    app.spend = Number(event.target.value);
    $("#spendRange").value = String(app.spend);
    renderCurve();
    renderFlightpathCurve();
  });

  $("#spendRange").addEventListener("input", (event) => {
    app.spend = Number(event.target.value);
    renderCurve();
  });

  $("#mapLayerSelect").addEventListener("change", (event) => {
    app.selectedMapLayer = event.target.value;
    renderPlanningExtensions();
  });

  $("#briefInput")?.addEventListener("input", () => {
    renderBriefOutput();
    renderModeWorkspace();
  });

  $("#budgetOptimisationSelect")?.addEventListener("change", (event) => {
    app.budgetOptimisation = event.target.value;
    renderPlanningExtensions();
  });

  $("#firewallStateSelect")?.addEventListener("change", (event) => {
    app.firewallState = event.target.value;
    app.firewallApprovalNotice = "";
    render();
  });

  $("#calendarViewSelect")?.addEventListener("change", (event) => {
    app.selectedCalendarView = normaliseCalendarView(event.target.value);
    renderCalendar();
  });

  $("#calendarMonthSelect")?.addEventListener("change", (event) => {
    app.selectedCalendarMonth = event.target.value;
    renderCalendar();
  });

  $("#calendarProductSelect")?.addEventListener("change", (event) => {
    app.selectedCalendarProduct = event.target.value;
    if (event.target.value !== "all") {
      syncProductSelection(event.target.value);
    }
    renderCalendar();
  });

  $("#calendarStateSelect")?.addEventListener("change", (event) => {
    app.selectedCalendarState = event.target.value;
    renderCalendar();
  });

  $$(".surface-tab").forEach((button) => {
    button.addEventListener("click", () => {
      app.selectedSurface = button.dataset.surface;
      renderSurface();
    });
  });

  $("#closeEvidenceButton").addEventListener("click", closeEvidenceDrawer);
  $("#evidenceDrawer").addEventListener("click", (event) => {
    if (event.target.id === "evidenceDrawer") {
      closeEvidenceDrawer();
    }
  });
  document.addEventListener("click", (event) => {
    const recommendationSelect = event.target.closest("[data-recommendation-id]");
    if (recommendationSelect) {
      app.selectedRecommendationId = recommendationSelect.dataset.recommendationId;
      app.recommendationNotice = "";
      renderRecommendations();
      return;
    }
    const recommendationReview = event.target.closest("[data-recommendation-review]");
    if (recommendationReview) {
      setRecommendationActionState(recommendationReview.dataset.recommendationReview, "reviewing");
      app.recommendationNotice = "Review the before/after change and every safety check before queuing it.";
      renderRecommendations();
      return;
    }
    const recommendationQueue = event.target.closest("[data-recommendation-queue]");
    if (recommendationQueue) {
      setRecommendationActionState(recommendationQueue.dataset.recommendationQueue, "queued_for_approval");
      app.recommendationNotice = "Queued for human approval. No Google Ads or Meta setting has been changed.";
      renderRecommendations();
      return;
    }
    const recommendationCancel = event.target.closest("[data-recommendation-cancel]");
    if (recommendationCancel) {
      setRecommendationActionState(recommendationCancel.dataset.recommendationCancel, "suggested");
      app.recommendationNotice = "Review cancelled. The recommendation remains open.";
      renderRecommendations();
      return;
    }
    const recommendationReset = event.target.closest("[data-recommendation-reset]");
    if (recommendationReset) {
      setRecommendationActionState(recommendationReset.dataset.recommendationReset, "suggested");
      app.recommendationNotice = "Returned to the recommendation queue. No external change was made.";
      renderRecommendations();
      return;
    }
    const recommendationWorkflow = event.target.closest("[data-recommendation-workflow]");
    if (recommendationWorkflow) {
      setRecommendationActionState(recommendationWorkflow.dataset.recommendationWorkflow, "queued_for_approval");
      app.recommendationNotice = "Added to the internal work queue. No external task or platform change was created.";
      renderRecommendations();
      return;
    }
    const recommendationPlanning = event.target.closest("[data-recommendation-planning]");
    if (recommendationPlanning) {
      openRecommendationInPlanning(recommendationPlanning.dataset.recommendationPlanning);
      return;
    }
    if (event.target.matches("[data-command-palette-close]")) {
      closeCommandPalette();
      return;
    }
    const commandButton = event.target.closest("[data-command-id]");
    if (commandButton) {
      executePaletteCommand(commandButton.dataset.commandId);
      return;
    }
    const downloadButton = event.target.closest("[data-download]");
    if (downloadButton) {
      handleDownload(downloadButton.dataset.download);
      return;
    }
    const collapseButton = event.target.closest("[data-collapse-target]");
    if (collapseButton) {
      toggleCollapsedRow(collapseButton.dataset.collapseTarget, collapseButton);
      return;
    }
    const stateTile = event.target.closest("[data-state-scope-code]");
    if (stateTile) {
      toggleStateOverride(stateTile.dataset.stateScopeCode);
      return;
    }
    const zip3Control = event.target.closest("[data-zip3-control]");
    if (zip3Control) {
      applyZip3Control(zip3Control.dataset.zip3Control);
      return;
    }
    if (event.target.closest("[data-rule-update]")) {
      app.firewallApprovalNotice = "Mock rule change captured. Real-data stage would route this to Rob or Jack for approval before any planning rule changes.";
      renderFirewall(getFirewallStateRow());
      return;
    }
    if (event.target.closest("[data-save-oneoff]")) {
      const campaign = saveOneOffCampaign();
      if (campaign) {
        app.selectedSurface = "flightpath";
        render();
      } else {
        renderModeWorkspace();
        renderPlanningChatShell();
      }
      return;
    }
    const chatModeButton = event.target.closest("[data-chat-mode]");
    if (chatModeButton) {
      if (app.chatSubmitting) return;
      activateChatMode(chatModeButton.dataset.chatMode);
      app.selectedSurface = "planning";
      render();
      return;
    }
    const triggerUpload = event.target.closest("[data-trigger-upload]");
    if (triggerUpload) {
      $("#chatAttachmentInput")?.click();
      return;
    }
    const calendarNav = event.target.closest("[data-calendar-nav]");
    if (calendarNav) {
      navigateCalendarPeriod(calendarNav.dataset.calendarNav);
      return;
    }
    const calendarDate = event.target.closest("[data-calendar-date]");
    if (calendarDate) {
      app.selectedCalendarDate = clampCalendarDate(calendarDate.dataset.calendarDate);
      app.selectedCalendarMonth = app.selectedCalendarDate.slice(0, 7);
      app.selectedCalendarView = "day";
      renderCalendar();
      return;
    }
    const triggerCalendarUpload = event.target.closest("[data-trigger-calendar-upload]");
    if (triggerCalendarUpload) {
      $("#calendarCustomUploadInput")?.click();
      return;
    }
    const customCalendarFocus = event.target.closest("[data-calendar-custom-focus]");
    if (customCalendarFocus) {
      focusCustomCalendarEntry(customCalendarFocus.dataset.calendarCustomFocus);
      return;
    }
    const customCalendarRemove = event.target.closest("[data-calendar-custom-remove]");
    if (customCalendarRemove) {
      removeCustomCalendarEntry(customCalendarRemove.dataset.calendarCustomRemove);
      return;
    }
    const clearAttachment = event.target.closest("[data-clear-attachment]");
    if (clearAttachment) {
      removeChatAttachment(clearAttachment.dataset.clearAttachment);
      return;
    }
    const chatDownload = event.target.closest("[data-chat-download]");
    if (chatDownload) {
      downloadChatMessage(chatDownload.dataset.chatDownload);
      return;
    }
    if (event.target.closest("[data-save-year-plan]")) {
      saveLastYearPlanToFlightpath();
      return;
    }
    if (event.target.closest("[data-save-ideas-canvas]")) {
      saveIdeasCanvas();
      return;
    }
    if (event.target.closest("[data-export-ideas-canvas]")) {
      exportIdeasCanvas();
      return;
    }
    if (event.target.closest("[data-draft-ideas-canvas]")) {
      draftIdeasCanvasFromThread();
      return;
    }
    if (event.target.closest("[data-ask-grid]")) {
      askAboutFlightpathGrid();
      return;
    }
    const flightpathPlanOption = event.target.closest("[data-flightpath-plan-option]");
    if (flightpathPlanOption) {
      app.selectedScenario = flightpathPlanOption.dataset.flightpathPlanOption;
      $("#scenarioSelect").value = app.selectedScenario;
      render();
      return;
    }
    if (event.target.closest("[data-ask-reporting]")) {
      askAboutReportingPage();
      return;
    }
    if (event.target.closest("[data-ask-insights]")) {
      askAboutInsightsPage();
      return;
    }
    if (event.target.closest("[data-ask-regulation]")) {
      askAboutRegulationPage();
      return;
    }
    if (event.target.closest("[data-stage-texas-launch]")) {
      // This is intentionally a local rehearsal only. It must never alter the
      // active plan or imply a real regulatory change.
      app.texasLaunchStaged = true;
      app.selectedState = "TX";
      app.selectedProduct = "sportsbook";
      render();
      return;
    }
    if (event.target.closest("[data-open-texas-launch]")) {
      app.selectedState = "TX";
      app.selectedProduct = "sportsbook";
      app.planningScope = "state";
      app.chatDinks = { ...app.chatDinks, period: "Sep 2026", budget: 5000000, geo: "state:TX", audience: "tx_holdout_predicts_watchlist" };
      activateChatMode("launch");
      app.selectedSurface = "planning";
      render();
      return;
    }
    if (event.target.closest("[data-plan-bar-overlay]")) {
      app.planBarOverlayOpen = true;
      renderOutputPlanBars();
      return;
    }
    if (event.target.closest("[data-plan-bar-close]")) {
      app.planBarOverlayOpen = false;
      renderOutputPlanBars();
      return;
    }
    if (event.target.closest("[data-open-flightpath]")) {
      app.planBarOverlayOpen = false;
      app.selectedSurface = "flightpath";
      render();
      return;
    }
    const dinkOption = event.target.closest("[data-dink-option]");
    if (dinkOption) {
      setDinkValue(dinkOption.dataset.dinkOption, dinkOption.dataset.dinkValue);
      app.activeDinkPicker = "";
      render();
      return;
    }
    const dinkChip = event.target.closest("[data-dink-key]");
    if (dinkChip) {
      app.activeDinkPicker = app.activeDinkPicker === dinkChip.dataset.dinkKey ? "" : dinkChip.dataset.dinkKey;
      renderPlanningChatShell();
      return;
    }
    if (event.target.closest("[data-clear-page-context]")) {
      app.freePageContext = null;
      app.activeDinkPicker = "";
      renderPlanningChatShell();
      return;
    }
    const chatSubmit = event.target.closest("[data-chat-submit]");
    if (chatSubmit) {
      submitPlanningChat();
      return;
    }
    const oneOffBasis = event.target.closest("[data-oneoff-basis]");
    if (oneOffBasis) {
      app.oneOffIncrementalityBasis = oneOffBasis.dataset.oneoffBasis;
      renderPlanningChatShell();
      return;
    }
    if (event.target.closest("[data-add-product]")) {
      addCustomProductFromForm();
      return;
    }
    if (event.target.closest("[data-cancel-add-product]")) {
      app.addProductOpen = false;
      app.addProductWarning = "";
      renderPlanningChatShell();
      return;
    }
    const suggestedPrompt = event.target.closest("[data-suggested-prompt]");
    if (suggestedPrompt) {
      const input = $("#planningChatInput");
      if (input) {
        input.value = suggestedPrompt.dataset.suggestedPrompt;
        input.focus();
      }
      return;
    }
    const rerunBrief = event.target.closest("[data-rerun-brief]");
    if (rerunBrief) {
      rerunBriefFromLibrary(rerunBrief.dataset.rerunBrief);
      return;
    }
    const overlayTrigger = event.target.closest("[data-chat-overlay]");
    if (overlayTrigger) {
      app.activeChatOverlay = overlayTrigger.dataset.chatOverlay;
      renderPlanningChatShell();
      return;
    }
    if (event.target.closest("[data-chat-overlay-close]")) {
      app.activeChatOverlay = null;
      renderPlanningChatShell();
      return;
    }
    const openSurface = event.target.closest("[data-open-surface]");
    if (openSurface) {
      app.selectedSurface = openSurface.dataset.openSurface;
      app.activeChatOverlay = null;
      renderSurface();
      renderPlanningChatShell();
      return;
    }
    if (event.target.closest("[data-new-plan-chat]")) {
      resetModeConversation(app.selectedPlanningMode);
      if (app.selectedPlanningMode === "oneoff") {
        app.oneOffDraft = null;
        app.oneOffIncrementalityBasis = "";
        app.chatDinks.budget = null;
      }
      renderPlanningChatShell();
      return;
    }
    if (event.target.closest("[data-chat-rail-toggle]")) {
      app.chatRailOpen = !app.chatRailOpen;
      renderPlanningChatShell();
    }
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openCommandPalette();
      return;
    }
    if (app.commandPaletteOpen && event.key === "Escape") {
      event.preventDefault();
      closeCommandPalette();
      return;
    }
    if (app.commandPaletteOpen && event.target?.id === "commandPaletteInput" && event.key === "Enter") {
      event.preventDefault();
      const first = getFilteredPaletteCommands()[0];
      if (first) executePaletteCommand(first.id);
      return;
    }
    if (event.target?.id !== "planningChatInput") return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitPlanningChat();
    }
  });
  document.addEventListener("input", (event) => {
    if (event.target?.id === "commandPaletteInput") {
      app.commandPaletteQuery = event.target.value;
      renderCommandPalette();
      $("#commandPaletteInput")?.focus();
      return;
    }
    if (event.target?.matches("[data-ideas-canvas]")) {
      updateIdeasCanvas(event.target.value);
    }
  });
  document.addEventListener("submit", (event) => {
    if (event.target?.matches("#calendarCustomForm")) {
      event.preventDefault();
      saveManualCalendarEntry();
    }
  });
  document.addEventListener("change", async (event) => {
    if (event.target?.id === "recommendationKindSelect") {
      app.selectedRecommendationKind = event.target.value;
      app.selectedRecommendationId = "";
      renderRecommendations();
      return;
    }
    if (event.target?.id === "recommendationChannelSelect") {
      app.selectedRecommendationChannel = event.target.value;
      app.selectedRecommendationId = "";
      renderRecommendations();
      return;
    }
    if (event.target?.id === "recommendationCategorySelect") {
      app.selectedRecommendationCategory = event.target.value;
      app.selectedRecommendationId = "";
      renderRecommendations();
      return;
    }
    if (event.target?.id === "recommendationPrioritySelect") {
      app.selectedRecommendationPriority = event.target.value;
      app.selectedRecommendationId = "";
      renderRecommendations();
      return;
    }
    if (event.target?.matches("[data-oneoff-product]")) {
      const value = event.target.value;
      if (value === "new") {
        app.addProductOpen = true;
        app.addProductWarning = "";
      } else {
        app.addProductOpen = false;
        app.addProductWarning = "";
        app.oneOffProduct = value;
        syncProductSelection(value);
      }
      renderPlanningChatShell();
      return;
    }
    if (event.target?.id === "chatAttachmentInput") {
      const file = event.target.files?.[0];
      if (file) {
        await handleChatAttachmentUpload(file);
      }
      event.target.value = "";
    }
    if (event.target?.id === "calendarCustomUploadInput") {
      const file = event.target.files?.[0];
      if (file) {
        await handleCalendarCustomUpload(file);
      }
      event.target.value = "";
    }
  });
}

function render() {
  syncComputedPlansToPlanStore();
  const plan = getPlan();
  const row = getSelectedStateRow();
  const planView = buildPlanView(plan, row);
  renderPlanStoreBar(plan);
  renderStateScopeControl();
  renderBriefOutput();
  renderModeWorkspace();
  renderMetrics(planView);
  renderReallocationDelta(planView);
  renderTimeMachineGrid(plan);
  renderFirewall(getFirewallStateRow());
  renderPlanBars(planView, row);
  populateCurveStateSelect("#curveStateSelect");
  populateCurveStateSelect("#flightpathCurveStateSelect");
  renderCurve();
  renderPlanningExtensions();
  renderStatePlanningSummary();
  renderFlightpath(plan);
  renderCalendar();
  renderInsights();
  renderCreativeIntelligence();
  renderAudienceSurface();
  renderReporting();
  renderRecommendations();
  renderAttribution();
  renderReportingPlanBar();
  renderRegulation();
  renderEvidenceDrawer();
  renderPlanningChatShell();
  renderSurface();
  renderCommandPalette();
  applyCollapsedRows();
}

function getCommandPaletteCommands() {
  if (!app.data) return [];
  const pages = [
    ["planning", "Planning OS"],
    ["flightpath", "Flightpath"],
    ["calendar", "Calendar"],
    ["reporting", "Reporting"],
    ["recommendations", "Recommendations"],
    ["attribution", "Attribution & Incrementality"],
    ["insights", "Insights"],
    ["creative", "Creative Intelligence"],
    ["audience", "Audience"],
    ["regulation", "Regulation"]
  ].map(([key, label]) => ({ id: `page:${key}`, group: "Page", label, detail: "Jump to surface", search: `${label} page surface` }));
  const plans = getFlightpathPlanCards().map((entry) => ({
    id: `plan:${entry.meta.scenario_key}`,
    group: "Plan",
    label: entry.meta.label || entry.meta.plan_id,
    detail: `${formatStatus(entry.meta.status || "stored")} · ${entry.meta.plan_id}`,
    search: `${entry.meta.label} ${entry.meta.plan_id} ${entry.meta.scenario_key}`
  }));
  const states = getStateRows().map((row) => ({
    id: `state:${row.state_code}`,
    group: "State",
    label: `${row.state} (${row.state_code})`,
    detail: "Open regulation receipt view",
    search: `${row.state} ${row.state_code} state regulation`
  }));
  const personas = (app.data.personas?.personas || []).map((persona, index) => ({
    id: `persona:${persona.persona_id || persona.id || index}`,
    group: "Persona",
    label: persona.label,
    detail: `${persona.primary_state || "US"} · working persona`,
    search: `${persona.label} ${persona.primary_state} ${(persona.state_codes || []).join(" ")} persona`
  }));
  return [...pages, ...plans, ...states, ...personas];
}

function getFilteredPaletteCommands() {
  const query = String(app.commandPaletteQuery || "").trim().toLowerCase();
  const commands = getCommandPaletteCommands();
  if (!query) return commands.slice(0, 12);
  const tokens = query.split(/\s+/).filter(Boolean);
  return commands.filter((command) => tokens.every((token) => String(command.search || command.label).toLowerCase().includes(token))).slice(0, 12);
}

function renderCommandPalette() {
  const root = $("#commandPaletteRoot");
  if (!root) return;
  if (!app.commandPaletteOpen) {
    root.innerHTML = "";
    return;
  }
  const commands = getFilteredPaletteCommands();
  root.innerHTML = `
    <div class="command-palette-backdrop" data-command-palette-close>
      <section class="command-palette" role="dialog" aria-modal="true" aria-label="Jump command palette">
        <div class="command-palette-search">
          <span>Jump to</span>
          <input id="commandPaletteInput" type="search" value="${escapeHtml(app.commandPaletteQuery)}" placeholder="Page, plan, state or persona" autocomplete="off">
          <kbd>Esc</kbd>
        </div>
        <div class="command-palette-results" role="listbox">
          ${commands.length ? commands.map((command, index) => `
            <button type="button" role="option" aria-selected="${index === 0 ? "true" : "false"}" data-command-id="${escapeHtml(command.id)}">
              <span>${escapeHtml(command.group)}</span>
              <strong>${escapeHtml(command.label)}</strong>
              <small>${escapeHtml(command.detail)}</small>
            </button>
          `).join("") : `<div class="command-palette-empty">No matching page, plan, state or persona.</div>`}
        </div>
        <footer><span>Enter opens the first result</span><span>Ctrl+K toggles</span></footer>
      </section>
    </div>
  `;
}

function openCommandPalette() {
  app.commandPaletteOpen = true;
  app.commandPaletteQuery = "";
  renderCommandPalette();
  window.setTimeout(() => $("#commandPaletteInput")?.focus(), 0);
}

function closeCommandPalette() {
  app.commandPaletteOpen = false;
  app.commandPaletteQuery = "";
  renderCommandPalette();
}

function executePaletteCommand(commandId) {
  const [kind, key] = String(commandId || "").split(":");
  if (kind === "page") {
    app.selectedSurface = key;
  } else if (kind === "plan") {
    app.selectedScenario = key;
    app.selectedSurface = "flightpath";
  } else if (kind === "state") {
    app.selectedState = key;
    app.firewallState = key;
    app.selectedReportingState = key;
    app.selectedInsightHeatState = key;
    app.planningScope = "state";
    app.selectedSurface = "regulation";
  } else if (kind === "persona") {
    const personas = app.data.personas?.personas || [];
    const persona = personas.find((row, index) => String(row.persona_id || row.id || index) === key);
    app.selectedAudiencePersona = key;
    if (persona?.primary_state) app.selectedState = persona.primary_state;
    app.selectedSurface = "audience";
  }
  app.commandPaletteOpen = false;
  app.commandPaletteQuery = "";
  render();
}

function syncComputedPlansToPlanStore() {
  if (!app.data?.planStore) return;
  Object.values(app.chatConversations || {}).forEach((conversation) => {
    const summary = conversation?.lastComputedYearPlan;
    if (!summary?.saved_plan_id || app.data.planStore.byId?.[summary.saved_plan_id]) return;
    const entry = buildPlanStoreEntryFromYearSummary(summary, { status: "draft", activate: false });
    upsertPlanStoreEntry(entry, { activate: false });
  });
}

function getPlan() {
  const storedPlan = getStoredPlanEntry()?.plan;
  if (storedPlan) {
    return storedPlan;
  }
  if (app.selectedScenario === "hold") {
    return app.data.planHold;
  }
  if (app.selectedScenario === "growth") {
    return app.data.planGrowth;
  }
  return app.data.planSearch;
}

function getStoredPlanEntry(scenarioKey = app.selectedScenario) {
  return app.data?.planStore?.byScenario?.[scenarioKey] || null;
}

function getPlanMeta(scenarioKey = app.selectedScenario) {
  return getStoredPlanEntry(scenarioKey)?.meta || null;
}

function getActivePlanEntry() {
  return app.data?.planStore?.active || null;
}

function getScenarioId() {
  const storedMeta = getPlanMeta();
  if (storedMeta?.scenario_id) {
    return storedMeta.scenario_id;
  }
  if (app.selectedScenario === "hold") {
    return "compliance_hold";
  }
  if (app.selectedScenario === "growth") {
    return "sportsbook_growth";
  }
  return "search_poc";
}

function getStateBudgetScenario() {
  return getStateBudgetScenarioFor(app.selectedProduct);
}

function getStateBudgetScenarioFor(productKey) {
  return app.data.stateBudgets.scenarios.find((scenario) => scenario.scenario_id === getScenarioId() && scenario.product_key === productKey)
    || app.data.stateBudgets.scenarios.find((scenario) => scenario.scenario_id === getScenarioId())
    || app.data.stateBudgets.scenarios[0];
}

function getSelectedStateRow() {
  return app.data.governance.state_rows.find((row) => row.state_code === app.selectedState);
}

function getSelectedBudgetRow() {
  return getStateBudgetScenario()?.states.find((state) => state.state_code === app.selectedState);
}

function getSelectedStateName() {
  return getSelectedStateRow()?.state || getSelectedBudgetRow()?.state || app.selectedState;
}

function getStateRows() {
  return [...(app.data?.governance?.state_rows || [])].sort((a, b) => a.state.localeCompare(b.state));
}

function getLargestSpendChannel(plan) {
  const channel = [...(plan?.channel_totals || [])]
    .filter((row) => app.data?.curves?.channels?.some((curve) => curve.channel === row.channel))
    .sort((a, b) => Number(b.budget_gbp || 0) - Number(a.budget_gbp || 0))[0];
  return channel?.channel || "";
}

function populateFirewallStateSelect() {
  const select = $("#firewallStateSelect");
  if (!select || !app.data?.governance) return;
  select.innerHTML = getStateRows()
    .map((row) => `<option value="${escapeHtml(row.state_code)}">${escapeHtml(row.state)} (${escapeHtml(row.state_code)})</option>`)
    .join("");
  if (!getStateRows().some((row) => row.state_code === app.firewallState)) {
    app.firewallState = app.selectedState;
  }
  select.value = app.firewallState;
}

function getFirewallStateRow() {
  return app.data.governance.state_rows.find((row) => row.state_code === (app.firewallState || app.selectedState));
}

function getProductLiveStateCodes(productKey = app.selectedProduct) {
  return buildProductStateFit(productKey).live.map((row) => row.state_code);
}

function getSelectedPlanningStateCodes(productKey = app.selectedProduct) {
  const allCodes = getStateRows().map((row) => row.state_code);
  const base = app.planningScope === "state"
    ? new Set([app.selectedState])
    : new Set(getProductLiveStateCodes(productKey));
  Object.entries(app.manualStateOverrides || {}).forEach(([stateCode, action]) => {
    if (action === "include") base.add(stateCode);
    if (action === "exclude") base.delete(stateCode);
  });
  return allCodes.filter((stateCode) => base.has(stateCode));
}

function getStateSelectionClass(stateCode, productKey = app.selectedProduct) {
  const liveCodes = new Set(getProductLiveStateCodes(productKey));
  const selectedCodes = new Set(getSelectedPlanningStateCodes(productKey));
  const override = app.manualStateOverrides?.[stateCode];
  if (override === "include") return "override-in";
  if (override === "exclude") return "override-out";
  if (selectedCodes.has(stateCode) && liveCodes.has(stateCode)) return "auto-selected";
  if (selectedCodes.has(stateCode)) return "manual-selected";
  return "excluded";
}

function toggleStateOverride(stateCode) {
  if (!stateCode) return;
  const current = app.manualStateOverrides?.[stateCode];
  const liveCodes = new Set(getProductLiveStateCodes(app.selectedProduct));
  const next = { ...(app.manualStateOverrides || {}) };
  if (current) {
    delete next[stateCode];
  } else {
    next[stateCode] = liveCodes.has(stateCode) ? "exclude" : "include";
  }
  app.manualStateOverrides = next;
  app.selectedState = stateCode;
  app.planningScope = "national";
  app.selectedZip3 = null;
  render();
}

function renderStateScopeControl() {
  const container = $("#stateScopeControl");
  if (!container || !app.data?.governance) return;
  const selectedCodes = getSelectedPlanningStateCodes(app.selectedProduct);
  const liveCodes = getProductLiveStateCodes(app.selectedProduct);
  const overrides = Object.entries(app.manualStateOverrides || {});
  const stateSelect = $("#stateSelect");
  if (stateSelect) stateSelect.value = app.planningScope === "national" ? "US" : app.selectedState;
  container.innerHTML = `
    <div class="state-scope-header">
      <div>
        <span>Planning states</span>
        <strong>${formatNumber(selectedCodes.length)} selected for ${escapeHtml(productLabel(app.selectedProduct))}</strong>
      </div>
      <div class="pill-row">
        <span class="pill status-working">${formatNumber(liveCodes.length)} product-live</span>
        <span class="pill ${overrides.length ? "status-review" : "status-synthetic"}">${formatNumber(overrides.length)} manual overrides</span>
      </div>
    </div>
    <div class="state-scope-map" aria-label="State planning selection">
      ${getStateRows().map((row) => {
        const klass = getStateSelectionClass(row.state_code, app.selectedProduct);
        return `
          <button class="state-scope-tile ${escapeHtml(klass)} ${row.state_code === app.selectedState ? "is-detail" : ""}" type="button" data-state-scope-code="${escapeHtml(row.state_code)}" title="${escapeHtml(row.state)}">
            <span>${escapeHtml(row.state_code)}</span>
          </button>
        `;
      }).join("")}
    </div>
    <div class="map-legend scope-legend">
      ${[
        ["#dff6e9", "auto-selected live state"],
        ["#e8f4fc", "manually included"],
        ["#fff4df", "manually excluded"],
        ["#edf2f6", "not in this product plan"]
      ].map(renderLegendItem).join("")}
    </div>
  `;
}

function syncProductSelection(productKey) {
  app.selectedProduct = productKey;
  app.selectedCalendarProduct = productKey;
  app.oneOffProduct = productKey;
  refreshProductSelectOptions();
  app.planningScope = "national";
}

function formatMonth(month) {
  const monthIndex = Number(String(month).slice(5, 7)) - 1;
  const year = String(month).slice(0, 4);
  return `${MONTH_LABELS[monthIndex] || month} ${year}`;
}

function formatPeriodLabel(period) {
  if (!period?.start || !period?.end) return "Period not set";
  return `${formatMonth(period.start)} to ${formatMonth(period.end)}`;
}

function parsePeriodDink(value) {
  const [start, end] = String(value || "").split(":");
  const startMonth = normaliseMonthCode(start);
  const endMonth = normaliseMonthCode(end);
  if (!startMonth || !endMonth || endMonth < startMonth) return null;
  return { start: startMonth, end: endMonth };
}

function monthCodeFromParts(year, monthNumber) {
  return `${year}-${String(monthNumber).padStart(2, "0")}`;
}

function addMonths(month, offset) {
  const [year, monthNumber] = String(month).split("-").map(Number);
  const zeroBased = (year * 12) + (monthNumber - 1) + offset;
  const nextYear = Math.floor(zeroBased / 12);
  const nextMonth = (zeroBased % 12) + 1;
  return monthCodeFromParts(nextYear, nextMonth);
}

function normaliseCalendarView(view) {
  return ["quarter", "month", "week", "day"].includes(view) ? view : "quarter";
}

function getQuarterStartMonth(month) {
  const year = String(month || app.selectedCalendarMonth || "2026-09").slice(0, 4);
  const monthNumber = Number(String(month || "2026-09").slice(5, 7)) || 9;
  const quarterStart = Math.floor((monthNumber - 1) / 3) * 3 + 1;
  return monthCodeFromParts(Number(year), quarterStart);
}

function getCalendarQuarterMonths(month = app.selectedCalendarMonth) {
  const available = new Set(getCalendarMonths());
  const start = getQuarterStartMonth(month);
  return [0, 1, 2].map((offset) => addMonths(start, offset)).filter((item) => available.has(item));
}

function listMonthsBetween(start, end) {
  const months = [];
  if (!start || !end || end < start) return months;
  let cursor = start;
  while (cursor <= end && months.length < 36) {
    months.push(cursor);
    cursor = addMonths(cursor, 1);
  }
  return months;
}

function extractPeriodFromText(text) {
  const raw = String(text || "");
  const yearMatch = raw.match(/\b(20\d{2})\b/);
  const monthRange = raw.match(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(20\d{2})?\s*(?:-|to|through|thru|until)\s*(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(20\d{2})?\b/i);
  if (monthRange) {
    const startMonth = monthNumberFromText(monthRange[1]);
    const startYear = Number(monthRange[2] || yearMatch?.[1] || 2026);
    const endMonth = monthNumberFromText(monthRange[3]);
    let endYear = Number(monthRange[4] || startYear);
    if (endMonth < startMonth && !monthRange[4]) endYear += 1;
    return { start: monthCodeFromParts(startYear, startMonth), end: monthCodeFromParts(endYear, endMonth) };
  }
  const duration = raw.match(/\b(1[0-8]|[2-9])\s*months?\s*(?:from|starting)\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(20\d{2})\b/i);
  if (duration) {
    const start = monthCodeFromParts(Number(duration[3]), monthNumberFromText(duration[2]));
    return { start, end: addMonths(start, Number(duration[1]) - 1) };
  }
  if (yearMatch) {
    return { start: `${yearMatch[1]}-01`, end: `${yearMatch[1]}-12` };
  }
  return null;
}

function renderSurface() {
  $$(".surface-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.surface === app.selectedSurface);
  });
  $$("[data-surface-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.surfacePanel === app.selectedSurface);
  });
}

function renderPlanStoreBar(plan) {
  const container = $("#planStoreBar");
  if (!container) return;
  const meta = getPlanMeta();
  const activeMeta = getActivePlanEntry()?.meta;
  const manifest = app.data.planStore?.manifest;
  const selectedMode = app.selectedPlanningMode;
  const modeLabels = planningChatModes().map((mode) => [mode.key, mode.label]);
  const modeDetail = {
    year: ["Annual working-media baseline", "12 months x channels from the active plan store."],
    month: [formatMonth(app.selectedCalendarMonth), `${escapeHtml(getMonthStatusLabel(app.selectedCalendarMonth))} month view.`],
    oneoff: ["Campaign draft", "Brief parser and governance gate are ready; engine subset is next."],
    free: ["Ask mode", "Deterministic facts first; narration layer remains behind the next gate."]
  };
  const selectedModeConfig = planningChatModes().find((mode) => mode.key === selectedMode);
  const [detailTitle, detailCopy] = modeDetail[selectedMode] || [selectedModeConfig?.label || "Planning mode", selectedModeConfig?.description || "Configured chat mode."];
  const statusClassName = meta?.status === "active" ? "status-working" : "status-synthetic";
  container.innerHTML = `
    <div class="plan-store-main">
      <div>
        <p class="eyebrow">Planning Time Machine</p>
        <h2>${escapeHtml(meta?.label || plan.plan_id)}</h2>
        <div class="pill-row">
          <span class="pill ${escapeHtml(statusClassName)}">${escapeHtml(formatStatus(meta?.status || "working"))}</span>
          <span class="pill">v${escapeHtml(meta?.version || 1)}</span>
          <span class="pill">${escapeHtml(formatStatus(meta?.horizon || "annual"))}</span>
          <span class="pill">demo date ${escapeHtml(manifest?.demo_today || "2026-07-03")}</span>
        </div>
      </div>
      <div class="mode-switcher" role="group" aria-label="Planning mode">
        ${modeLabels.map(([key, label]) => `
          <button class="mode-button ${key === selectedMode ? "is-active" : ""}" type="button" data-planning-mode="${escapeHtml(key)}">${escapeHtml(label)}</button>
        `).join("")}
      </div>
      <div class="mode-readout">
        <span>${escapeHtml(detailTitle)}</span>
        <strong>${escapeHtml(detailCopy)}</strong>
      </div>
    </div>
    <div class="plan-store-meta">
      <span>Active annual: <strong>${escapeHtml(activeMeta?.label || "Not set")}</strong></span>
      <span>Basis: <strong>${escapeHtml(plan.baseline_label || "user-entered budget")}</strong></span>
      <span>Scenario: <strong>${escapeHtml(plan.scenario?.label || meta?.scenario_id || "Working")}</strong></span>
      <span>Store: <strong>${formatNumber(app.data.planStore?.entries?.length || 0)} plan records</strong></span>
      <button class="small-action" type="button" data-download="board-pack">Board pack PPTX</button>
    </div>
  `;
  container.querySelectorAll("[data-planning-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      activateChatMode(button.dataset.planningMode);
      if (app.selectedPlanningMode === "year") {
        app.selectedCalendarView = "quarter";
      }
      if (app.selectedPlanningMode === "month") {
        app.selectedCalendarView = "month";
      }
      render();
    });
  });
}

function currentChatMode() {
  return planningChatModes().find((mode) => mode.key === app.selectedPlanningMode) || planningChatModes()[0] || FALLBACK_PLANNING_CHAT_MODES[0];
}

function ensureChatConversation(modeKey = app.selectedPlanningMode) {
  if (!app.chatConversations[modeKey]) {
    const mode = planningChatModes().find((item) => item.key === modeKey) || planningChatModes()[0] || FALLBACK_PLANNING_CHAT_MODES[0];
    app.chatConversations[modeKey] = {
      id: `fd-${modeKey}-default`,
      workspaceId: CHAT_SESSION_WORKSPACE_ID,
      title: getModeConversationTitle(mode),
      mode: modeKey,
      messages: getDefaultChatMessages(modeKey),
      attachments: [],
      ideasCanvas: getDefaultIdeasCanvas(modeKey),
      updatedAt: getDemoToday()
    };
  } else if (!Array.isArray(app.chatConversations[modeKey].attachments)) {
    app.chatConversations[modeKey].attachments = [];
  }
  const mode = planningChatModes().find((item) => item.key === modeKey) || planningChatModes()[0] || FALLBACK_PLANNING_CHAT_MODES[0];
  app.chatConversations[modeKey].title = getModeConversationTitle(mode);
  app.chatConversations[modeKey].ideasCanvas = normaliseIdeasCanvas(app.chatConversations[modeKey].ideasCanvas, modeKey);
  return app.chatConversations[modeKey];
}

function resetModeConversation(modeKey = app.selectedPlanningMode) {
  delete app.chatConversations[modeKey];
  ensureChatConversation(modeKey);
  persistChatSessions();
}

function getDefaultChatMessages(modeKey) {
  return [];
}

function getModeConversationTitle(mode) {
  const titles = {
    free: "Free chat",
    year: "Year plan",
    month: "Monthly replan",
    oneoff: "One-off campaign"
  };
  return titles[mode?.key] || `${mode?.label || "Planning"} chat`;
}

function getModeStarterPrompts(mode) {
  const defaults = {
    free: ["What data is simulated?", "What does the paid SERP cut prove?", "Explain the state value index"],
    year: [],
    month: [],
    oneoff: []
  };
  return Array.isArray(mode?.cold_load_prompts) ? mode.cold_load_prompts : defaults[mode?.key] || [];
}

function renderPlanningChatShell() {
  const shell = $("#planningChatShell");
  if (!shell || !app.data) return;
  const mode = currentChatMode();
  const conversation = ensureChatConversation(mode.key);
  const hasPendingMessage = (conversation.messages || []).some((message) => message.pending);
  if (mode.key === "year" && conversation.lastComputedYearPlan && !hasPendingMessage) {
    syncYearDinksFromSummary(conversation.lastComputedYearPlan);
  }
  const modePanelOpen = mode.key === "year" && conversation.lastComputedYearPlan ? "open" : "";
  shell.innerHTML = `
    <div class="planning-chat-interface">
    <aside class="chat-rail ${app.chatRailOpen ? "is-open" : ""}" aria-label="Saved planning conversations">
      <div class="chat-rail-head">
        <p class="eyebrow">Chat mode</p>
      </div>
      ${renderConversationRail()}
    </aside>
    <section class="chat-shell-main planning-chat-main">
      <div class="chat-header-bar">
        <div>
          <p class="eyebrow">Planning OS</p>
          <h2>${escapeHtml(conversation.title || `${mode.label} planning chat`)}</h2>
          <p><strong>${escapeHtml(mode.label)} mode</strong> · ${escapeHtml(modeDescription(mode.key))}</p>
        </div>
        <div class="chat-header-actions">
          <button class="small-action chat-rail-toggle" type="button" data-chat-rail-toggle>${app.chatRailOpen ? "Hide chats" : "Chats"}</button>
        </div>
      </div>
      <div class="chat-thread-shell">
        <div id="planningChatThread" class="chat-thread" aria-live="polite">
          ${conversation.messages.map(renderChatMessage).join("")}
        </div>
      </div>
      <div class="chat-input-row pinned">
            ${renderOneOffInputGate(mode)}
            ${renderDinksRow(mode)}
            ${renderAttachmentChips(conversation)}
            ${app.chatUploadWarning ? `<div class="chat-warning">${escapeHtml(app.chatUploadWarning)}</div>` : ""}
            ${app.addProductOpen && mode.key !== "oneoff" ? renderAddProductForm() : ""}
            <textarea id="planningChatInput" rows="3" placeholder="${escapeHtml(mode.prompt)}" ${app.chatSubmitting ? "disabled" : ""}></textarea>
            <div class="chat-input-toolbar">
              <div class="chat-tool-group">
                ${renderChatProductControl()}
                ${renderPlanningBasisControl(mode)}
                <button class="chat-upload-action" type="button" data-trigger-upload><span aria-hidden="true">↑</span> Upload brief</button>
                <input id="chatAttachmentInput" class="sr-only" type="file" accept=".txt,.md,.markdown,.pdf,.docx">
                <label class="chat-format-control">
              <span>Reply format</span>
              <select id="chatFormatSelect">
                <option value="narrative" ${app.chatFormat === "narrative" ? "selected" : ""}>Narrative</option>
                <option value="table" ${app.chatFormat === "table" ? "selected" : ""}>Table</option>
                <option value="csv" ${app.chatFormat === "csv" ? "selected" : ""}>CSV</option>
              </select>
            </label>
            ${renderFreeAnswerControl(mode)}
          </div>
          <button class="drawer-button chat-submit-button ${app.chatSubmitting ? "is-loading" : ""}" type="button" data-chat-submit ${app.chatSubmitting ? "disabled" : ""}>${app.chatSubmitting ? "Sending..." : "Send"}</button>
        </div>
      </div>
      <details class="chat-mode-panel" data-mode-output-panel ${modePanelOpen}>
        <summary>${renderChatModePanelSummary(mode.key)}</summary>
        <div class="chat-mode-panel-body">
          ${renderChatModePanel(mode.key)}
        </div>
      </details>
    </section>
    </div>
    ${["year", "month", "launch"].includes(mode.key) ? renderPlanningFlightpathContext(mode) : ""}
    ${mode.key === "year" ? '<div data-year-plan-material="empty" hidden aria-hidden="true"></div>' : ""}
    ${renderChatOverlay()}
  `;
  $("#chatFormatSelect")?.addEventListener("change", (event) => {
    app.chatFormat = event.target.value;
  });
  $("#chatProductSelect")?.addEventListener("change", (event) => {
    applyChatProductSelection(event.target.value);
  });
  $("#planningBasisSelect")?.addEventListener("change", (event) => {
    app.planningBasis = event.target.value === "insight_led" ? "insight_led" : "data_led";
    renderPlanningChatShell();
  });
  $("#freeAnswerModeSelect")?.addEventListener("change", (event) => {
    app.chatEngine = event.target.value;
    renderPlanningChatShell();
  });
  $("#planningValueModeSelect")?.addEventListener("change", (event) => {
    app.budgetOptimisation = event.target.value === "value" ? "value" : "volume";
    renderPlanningChatShell();
    renderPlanningExtensions();
  });
  renderPlanningChatGridIfNeeded(mode);
}

function renderPlanningFlightpathContext(mode) {
  return `
    <div id="planningStatusQuoGrid" class="planning-status-quo-grid" data-flightpath-component="shared" aria-label="Active plan monthly channel breakdown"></div>
  `;
}

function renderChatProductControl() {
  return `
    <label class="inline-select chat-product-control">
      <span>Product</span>
      <select id="chatProductSelect">
        ${productOptionsHtml(app.selectedProduct)}
        <option value="new">+ New product</option>
      </select>
    </label>
  `;
}

function renderPlanningBasisControl(mode) {
  if (mode.key === "free") return "";
  return `
    <label class="inline-select planning-basis-control">
      <span>Basis</span>
      <select id="planningBasisSelect">
        <option value="data_led" ${app.planningBasis === "data_led" ? "selected" : ""}>Data-led</option>
        <option value="insight_led" ${app.planningBasis === "insight_led" ? "selected" : ""}>LLM insight-led</option>
      </select>
    </label>
  `;
}

function applyChatProductSelection(value) {
  if (value === "new") {
    app.addProductOpen = true;
    app.addProductWarning = "Add the product in the One-off gate below, then it will appear in every selector.";
    renderPlanningChatShell();
    return;
  }
  if (!PRODUCT_LABELS[value]) return;
  app.addProductOpen = false;
  app.addProductWarning = "";
  syncProductSelection(value);
  app.oneOffProduct = value;
  app.selectedReportingProduct = value;
  render();
}

function syncYearDinksFromSummary(summary) {
  if (!summary) return;
  if (summary.period?.start && summary.period?.end) {
    app.chatDinks.period = `${summary.period.start}:${summary.period.end}`;
  }
  if (summary.budget_usd) {
    app.chatDinks.budget = Number(summary.budget_usd);
  }
  if (summary.channel_scope?.value) {
    app.chatDinks.channels = summary.channel_scope.value;
  }
}

function renderChatHeaderStatusStrip() {
  const selectedCodes = getSelectedPlanningStateCodes(app.selectedProduct);
  const firewall = getFirewallSummary(selectedCodes, app.selectedProduct);
  const meta = getPlanMeta();
  const scopeLabel = app.planningScope === "national" ? "National" : getSelectedStateName();
  return `
    <button class="context-chip header-chip" type="button" data-chat-overlay="scope">
      <span>Scope</span>
      <strong>${escapeHtml(scopeLabel)} · ${formatNumber(selectedCodes.length)} live</strong>
    </button>
    <button class="context-chip header-chip" type="button" data-chat-overlay="plan">
      <span>Plan</span>
      <strong>${escapeHtml(meta?.label || getPlan().plan_id)} v${escapeHtml(meta?.version || 1)}</strong>
    </button>
    ${firewall.className === "is-clear" ? "" : `
      <button class="context-chip header-chip ${escapeHtml(firewall.className)}" type="button" data-chat-overlay="firewall">
        <span>Firewall</span>
        <strong>${escapeHtml(firewall.label)}</strong>
      </button>
    `}
  `;
}

function renderFreeAnswerControl(mode) {
  if (mode.key !== "free") return "";
  const understudy = isUnderstudyEnabled();
  if (!understudy && app.chatEngine === "deterministic") {
    app.chatEngine = "llm";
  }
  const value = app.chatEngine === "deterministic" ? "deterministic" : "llm";
  return `
    <label class="inline-select free-answer-control">
      <span>Answer</span>
      <select id="freeAnswerModeSelect">
        <option value="llm" ${value === "llm" ? "selected" : ""}>LLM</option>
        ${understudy ? `<option value="deterministic" ${value === "deterministic" ? "selected" : ""}>Understudy</option>` : ""}
      </select>
    </label>
  `;
}

function modeDescription(modeKey) {
  const mode = planningChatModes().find((item) => item.key === modeKey);
  return mode?.description || "Ask and plan with deterministic facts and visible source chips.";
}

function renderEngineOptions(mode) {
  const labels = {
    deterministic: "Deterministic",
    both: "Both",
    llm: "LLM"
  };
  const allowed = mode.engine?.toggle || ["deterministic"];
  return allowed
    .map((value) => `<option value="${escapeHtml(value)}" ${app.chatEngine === value ? "selected" : ""}>${escapeHtml(labels[value] || formatStatus(value))}</option>`)
    .join("");
}

function engineStatusLabel(mode = currentChatMode()) {
  if (app.chatEngine === "llm") return llmServiceStatus().label;
  if (app.chatEngine === "both") return `Both: ${llmServiceStatus().label}`;
  if ((mode.engine?.toggle || []).includes("llm")) return "LLM off safe";
  return "Deterministic mode";
}

function engineStatusPill(mode = currentChatMode()) {
  if (app.chatEngine === "deterministic") {
    return {
      label: engineStatusLabel(mode),
      className: "status-working"
    };
  }
  const status = llmServiceStatus();
  return {
    label: engineStatusLabel(mode),
    className: status.className
  };
}

function getModeCapability(modeKey = app.selectedPlanningMode) {
  return app.data?.engineCapabilities?.modes?.[modeKey] || {
    label: modeDescription(modeKey),
    status: "unknown",
    visible_chips: [{ label: "Capability: not declared", className: "status-review" }],
    available_paths: [],
    blocked_paths: [],
    llm_guardrails: ["Do not claim undeclared engine capabilities."]
  };
}

function getModeCapabilityChips(modeKey = app.selectedPlanningMode) {
  const capability = getModeCapability(modeKey);
  return (capability.visible_chips || []).map((chip) => ({
    label: chip.label,
    className: chip.className || "status-working"
  }));
}

function getCapabilitySystemLines(modeKey = app.selectedPlanningMode) {
  const capability = getModeCapability(modeKey);
  const available = (capability.available_paths || [])
    .map((path) => `${path.id}: ${path.claim}`)
    .join(" ");
  const blocked = (capability.blocked_paths || [])
    .map((path) => `${path.id}: ${path.claim}`)
    .join(" ");
  return [
    `Engine capability contract for ${capability.label || modeKey}: status=${capability.status}.`,
    available ? `Available deterministic paths: ${available}` : "",
    blocked ? `Unavailable paths: ${blocked}` : "",
    ...(capability.llm_guardrails || [])
  ].filter(Boolean);
}

function renderConversationRail() {
  const modeRows = planningChatModes().map((mode) => {
    const conversation = ensureChatConversation(mode.key);
    return `
      <button class="conversation-row ${mode.key === app.selectedPlanningMode ? "is-active" : ""}" type="button" data-chat-mode="${escapeHtml(mode.key)}">
        <strong>${escapeHtml(getModeConversationTitle(mode))}</strong>
        <small>${escapeHtml(mode.description || `${formatNumber(conversation.messages.length)} messages`)}</small>
      </button>
    `;
  }).join("");
  return `
    <div class="conversation-list">${modeRows}</div>
    ${renderAvailableChatStarters(currentChatMode())}
    ${renderBriefLibraryRail(currentChatMode())}
    <button class="small-action full-width-action" type="button" data-new-plan-chat>New chat</button>
  `;
}

function renderBriefLibraryRail(mode) {
  const briefs = (app.briefLibrary || [])
    .filter((brief) => !mode?.key || brief.mode === mode.key)
    .slice(-5)
    .reverse();
  if (!briefs.length) return "";
  return `
    <div class="brief-library-list" aria-label="Saved briefs">
      <span>Brief library</span>
      ${briefs.map((brief) => `
        <button class="brief-library-row" type="button" data-rerun-brief="${escapeHtml(brief.id)}">
          <strong>${escapeHtml(brief.title)}</strong>
          <small>${escapeHtml(formatStatus(brief.mode))} / ${escapeHtml(brief.periodLabel || "period open")} / ${escapeHtml(brief.channelLabel || "all channels")}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function saveBriefToLibrary({ text, modeKey, requestContext = null, source = "typed", attachment = null }) {
  if (!modeKey || modeKey === "free") return null;
  const clean = String(text || attachment?.text || "").trim();
  if (clean.length < 12) return null;
  const parsed = interpretPlanningDocument(clean, "brief library") || {};
  const budget = parsed.budget || Number((requestContext?.dinks || []).find((dink) => dink.key === "budget")?.raw || 0);
  const period = extractPeriodFromText(clean) || parsePeriodDink((requestContext?.dinks || []).find((dink) => dink.key === "period")?.raw);
  const inlineChannel = inferChannelScopeFromText(clean);
  const channelValue = inlineChannel !== "all" ? inlineChannel : ((requestContext?.dinks || []).find((dink) => dink.key === "channels")?.raw || "all");
  const channel = getChannelScopeOption(channelValue);
  const title = attachment?.name
    ? attachment.name.replace(/\.[^.]+$/, "")
    : clean.slice(0, 58);
  const existing = (app.briefLibrary || []).find((brief) => brief.mode === modeKey && brief.text === clean);
  const entry = {
    id: existing?.id || `brief-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    mode: modeKey,
    source,
    text: clean,
    productKey: requestContext?.productKey || app.selectedProduct,
    productLabel: requestContext?.productLabel || productLabel(app.selectedProduct),
    budget_usd: budget || null,
    period,
    periodLabel: period ? formatPeriodLabel(period) : "",
    channelScope: channel.value,
    channelLabel: channel.label,
    attachmentName: attachment?.name || "",
    createdAt: existing?.createdAt || getDemoToday(),
    updatedAt: getDemoToday(),
    lastRunAt: source === "typed" ? getDemoToday() : existing?.lastRunAt || ""
  };
  app.briefLibrary = [
    ...(app.briefLibrary || []).filter((brief) => brief.id !== entry.id),
    entry
  ].slice(-24);
  return entry;
}

function applyInlineDinkHints(mode, text) {
  if (!mode || mode.key === "free") return;
  const allowed = new Set(mode.allowed_dinks || []);
  if (allowed.has("budget")) {
    const budget = extractBudget(text);
    if (budget) app.chatDinks.budget = budget;
  }
  if (allowed.has("period")) {
    const period = extractPeriodFromText(text);
    if (period) app.chatDinks.period = `${period.start}:${period.end}`;
  }
  if (allowed.has("channels")) {
    const channelScope = inferChannelScopeFromText(text);
    if (channelScope !== "all") app.chatDinks.channels = channelScope;
  }
}

function rerunBriefFromLibrary(briefId) {
  const brief = (app.briefLibrary || []).find((item) => item.id === briefId);
  if (!brief) return;
  activateChatMode(brief.mode);
  app.selectedSurface = "planning";
  if (brief.productKey && PRODUCT_LABELS[brief.productKey]) {
    syncProductSelection(brief.productKey);
  }
  if (brief.period?.start && brief.period?.end) {
    app.chatDinks.period = `${brief.period.start}:${brief.period.end}`;
  }
  if (brief.budget_usd) {
    app.chatDinks.budget = Number(brief.budget_usd);
  }
  app.chatDinks.channels = brief.channelScope || "all";
  brief.lastRunAt = getDemoToday();
  persistChatSessions();
  render();
  const input = $("#planningChatInput");
  if (input) {
    input.value = brief.text;
    input.focus();
  }
}

function renderAvailableChatStarters(mode) {
  const starters = getModeStarterPrompts(mode);
  if (!starters.length) return "";
  return `
    <div class="available-chat-list" aria-label="Available chats">
      <span>Available chats</span>
      ${starters.map((prompt) => `
        <button class="available-chat-row" type="button" data-suggested-prompt="${escapeHtml(prompt)}">
          ${escapeHtml(prompt)}
        </button>
      `).join("")}
    </div>
  `;
}

function renderDinksRow(mode) {
  const allowed = mode.allowed_dinks || [];
  if (!allowed.length) {
    const contextDinks = renderFreeContextDinks();
    return contextDinks ? `<div class="dinks-row is-collapsed">${contextDinks}</div>` : "";
  }
  return `
    <div class="dinks-row">
      ${allowed.map((key) => {
        const definition = DINK_DEFINITIONS[key] || { label: formatStatus(key) };
        const value = getDinkDisplay(key);
        return `
          <button class="dink-chip ${definition.primary ? "primary" : ""} ${value.isDefault ? "is-default" : ""}" type="button" data-dink-key="${escapeHtml(key)}">
            ${escapeHtml(definition.label)} <strong>${escapeHtml(value.label)}</strong>
          </button>
        `;
      }).join("")}
    </div>
    ${allowed.includes(app.activeDinkPicker) ? renderDinkPicker(app.activeDinkPicker) : ""}
  `;
}

function renderOneOffInputGate(mode) {
  if (mode?.key !== "oneoff") return "";
  const basis = app.oneOffIncrementalityBasis;
  return `
    <div class="oneoff-input-gate" role="group" aria-label="One-off incrementality gate">
      <span>Incrementality</span>
      <button class="gate-option ${basis === "incremental" ? "is-selected" : ""}" type="button" data-oneoff-basis="incremental">Incremental</button>
      <button class="gate-option ${basis === "standalone" ? "is-selected" : ""}" type="button" data-oneoff-basis="standalone">Standalone</button>
      <strong>${basis ? "Set" : "Not set"}</strong>
    </div>
  `;
}

function renderFreeContextDinks() {
  const context = app.freePageContext;
  if (!context) {
    return "";
  }
  const chips = (context.chips || []).slice(0, 4).map((chip) => `
    <span class="dink-chip page-context-chip">${escapeHtml(chip)}</span>
  `).join("");
  return `
    <button class="dink-chip primary" type="button" data-clear-page-context title="Clear page context">
      Context <strong>${escapeHtml(context.label || "Page")}</strong>
    </button>
    ${chips}
    <button class="dink-chip" type="button" data-clear-page-context>clear</button>
  `;
}

function renderDinkPicker(key) {
  const definition = DINK_DEFINITIONS[key] || { label: formatStatus(key) };
  const options = getDinkOptions(key);
  return `
    <div class="dink-picker" role="group" aria-label="${escapeHtml(definition.label)} options">
      <span>${escapeHtml(definition.label)}</span>
      ${options.map((option) => `
        <button class="small-action ${getDinkDisplay(key).raw === option.value ? "is-selected" : ""}" type="button" data-dink-option="${escapeHtml(key)}" data-dink-value="${escapeHtml(option.value)}">
          ${escapeHtml(option.label)}
        </button>
      `).join("")}
    </div>
  `;
}

function getPersonaAudienceOptions() {
  return (app.data?.personas?.personas || []).map((persona) => ({
    value: `persona:${persona.persona_id}`,
    label: persona.label
  }));
}

function defaultAudienceBuilder() {
  return {
    id: "",
    name: "",
    definition: "",
    personaId: "",
    ageBand: "25_40",
    gender: "all",
    incomeBand: "75k_plus",
    stateCodes: [app.selectedState || "NJ"],
    productKey: app.selectedProduct || "sportsbook",
    channelScope: app.chatDinks.channels || "all"
  };
}

function getAudienceBuilder() {
  if (!app.audienceBuilder) {
    app.audienceBuilder = defaultAudienceBuilder();
  }
  app.audienceBuilder.stateCodes = Array.isArray(app.audienceBuilder.stateCodes) && app.audienceBuilder.stateCodes.length
    ? [...new Set(app.audienceBuilder.stateCodes)]
    : [app.selectedState || "NJ"];
  app.audienceBuilder.productKey = app.audienceBuilder.productKey || app.selectedProduct || "sportsbook";
  app.audienceBuilder.channelScope = app.audienceBuilder.channelScope || "all";
  return app.audienceBuilder;
}

function initialiseAudienceBuilder(options = {}) {
  const builder = getAudienceBuilder();
  if (options.reset) {
    app.audienceBuilder = defaultAudienceBuilder();
  } else if (!builder.name && !builder.definition && !builder.personaId) {
    app.audienceBuilder = {
      ...builder,
      productKey: app.selectedProduct || builder.productKey,
      channelScope: app.chatDinks.channels || builder.channelScope,
      stateCodes: app.planningScope === "state" ? [app.selectedState] : builder.stateCodes
    };
  }
  return getAudienceBuilder();
}

function getPersonaById(personaId) {
  return (app.data?.personas?.personas || []).find((persona) => persona.persona_id === personaId);
}

function selectAudiencePersona(personaId) {
  const persona = getPersonaById(personaId);
  const builder = getAudienceBuilder();
  if (!persona) return;
  app.selectedAudiencePersona = personaId;
  app.audienceBuilder = {
    ...builder,
    personaId,
    name: builder.name || persona.label,
    definition: builder.definition || (persona.planning_use || []).join(" "),
    stateCodes: (persona.state_codes || []).length ? persona.state_codes : builder.stateCodes,
    productKey: builder.productKey || app.selectedProduct
  };
}

function getAudienceStateOptions(productKey = getAudienceBuilder().productKey) {
  const governanceRows = app.data?.governance?.state_rows || [];
  const liveCodes = new Set(getProductLiveStateCodes(productKey));
  const priority = new Set([app.selectedState, "NJ", "NC", "MI", "PA", "TX", ...getAudienceBuilder().stateCodes].filter(Boolean));
  return governanceRows
    .map((row) => ({
      code: row.state_code,
      label: row.state,
      live: liveCodes.has(row.state_code),
      priority: priority.has(row.state_code)
    }))
    .sort((a, b) => Number(b.priority) - Number(a.priority) || Number(b.live) - Number(a.live) || a.code.localeCompare(b.code));
}

function toggleAudienceBuilderState(stateCode) {
  const builder = getAudienceBuilder();
  const set = new Set(builder.stateCodes || []);
  if (set.has(stateCode) && set.size > 1) {
    set.delete(stateCode);
  } else {
    set.add(stateCode);
  }
  app.audienceBuilder = {
    ...builder,
    stateCodes: [...set]
  };
}

function updateAudienceBuilderField(field, value) {
  const builder = getAudienceBuilder();
  if (field === "productKey" && PRODUCT_LABELS[value]) {
    app.audienceBuilder = { ...builder, productKey: value };
    syncProductSelection(value);
    return;
  }
  if (field === "channelScope") {
    app.audienceBuilder = { ...builder, channelScope: CHANNEL_SCOPE_OPTIONS.some((option) => option.value === value) ? value : "all" };
    return;
  }
  app.audienceBuilder = {
    ...builder,
    [field]: value
  };
}

function calculateAudienceSizing(builder = getAudienceBuilder()) {
  const states = new Set(builder.stateCodes || []);
  const personas = app.data?.personas?.personas || [];
  const matchedPersonas = personas.filter((persona) => (persona.state_codes || []).some((code) => states.has(code)));
  const selectedPersona = builder.personaId ? getPersonaById(builder.personaId) : null;
  const personaRows = selectedPersona ? [selectedPersona] : matchedPersonas;
  const personaProxy = personaRows.reduce((sum, persona) => sum + Number(persona.segment_size_proxy?.value || 0), 0);
  const zipRows = (app.data?.zip3ProductMedia?.zip3_rows || []).filter((row) =>
    row.product_key === builder.productKey
    && states.has(row.state_code)
    && row.planning_status === "active"
  );
  const zipFeatures = (app.data?.zip3Map?.features || []).filter((feature) => states.has(feature.state_code));
  const population = zipFeatures.reduce((sum, feature) => sum + Number(feature.population || 0), 0);
  const activeMedia = zipRows.reduce((sum, row) => sum + Number(row.annual_media_spend_usd || 0), 0);
  const ageFactor = (AUDIENCE_AGE_BANDS.find((band) => band.value === builder.ageBand) || AUDIENCE_AGE_BANDS[1]).factor;
  const incomeFactor = (AUDIENCE_INCOME_BANDS.find((band) => band.value === builder.incomeBand) || AUDIENCE_INCOME_BANDS[0]).factor;
  const genderFactor = builder.gender === "all" ? 1 : 0.5;
  const attributeFactor = ageFactor * incomeFactor * genderFactor;
  const sourceProxy = personaProxy || Math.round(population * 0.12);
  const sizeProxy = Math.round(sourceProxy * attributeFactor);
  return {
    states: [...states],
    personaRows,
    personaProxy,
    zip3Count: zipRows.length,
    population,
    activeMedia,
    sizeProxy,
    sourceProxy,
    attributeFactor
  };
}

function audienceAttributeLabel(builder = getAudienceBuilder()) {
  const age = (AUDIENCE_AGE_BANDS.find((band) => band.value === builder.ageBand) || AUDIENCE_AGE_BANDS[1]).label;
  const income = (AUDIENCE_INCOME_BANDS.find((band) => band.value === builder.incomeBand) || AUDIENCE_INCOME_BANDS[0]).label;
  const gender = builder.gender === "all" ? "All genders" : builder.gender === "female" ? "Female" : "Male";
  return `${age} / ${gender} / ${income}`;
}

function channelScopeLabel(value) {
  return (CHANNEL_SCOPE_OPTIONS.find((option) => option.value === value) || CHANNEL_SCOPE_OPTIONS[0]).label;
}

function saveAudienceFromBuilder() {
  const builder = getAudienceBuilder();
  const sizing = calculateAudienceSizing(builder);
  const cleanName = String(builder.name || "").trim();
  const label = cleanName || `${builder.stateCodes.join("+")} ${productLabel(builder.productKey)} audience`;
  const id = builder.id || `aud-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const audience = {
    id,
    label,
    definition: String(builder.definition || "").trim() || "Working audience built from persona, state and ZIP3 media proxies.",
    productKey: builder.productKey,
    productLabel: productLabel(builder.productKey),
    channelScope: builder.channelScope,
    channelScopeLabel: channelScopeLabel(builder.channelScope),
    personaId: builder.personaId,
    personaLabel: getPersonaById(builder.personaId)?.label || "",
    ageBand: builder.ageBand,
    gender: builder.gender,
    incomeBand: builder.incomeBand,
    attributeLabel: audienceAttributeLabel(builder),
    stateCodes: sizing.states,
    sizeProxy: sizing.sizeProxy,
    zip3Count: sizing.zip3Count,
    annualMediaProxy: sizing.activeMedia,
    status: "working audience proxy",
    display_flag: "WORKING_PROXY",
    source_ids: [
      "predict_persona_seeds_working_2026_07_03",
      "signal_us_zip3_map_working_2026_07_03",
      "fanduel_zip3_product_media_estimates_2026"
    ],
    createdAt: getDemoToday(),
    updatedAt: getDemoToday()
  };
  app.customAudiences = [
    ...(app.customAudiences || []).filter((item) => item.id !== id),
    audience
  ].slice(-20);
  app.audienceBuilder = { ...builder, id };
  app.chatDinks.audience = `custom:${id}`;
  persistChatSessions();
  return audience;
}

function applyAudienceToPlanning(audienceId) {
  const audience = (app.customAudiences || []).find((item) => item.id === audienceId);
  if (!audience) return;
  app.chatDinks.audience = `custom:${audience.id}`;
  app.chatDinks.channels = audience.channelScope || app.chatDinks.channels || "all";
  if (audience.productKey && PRODUCT_LABELS[audience.productKey]) {
    syncProductSelection(audience.productKey);
  }
  if ((audience.stateCodes || []).length === 1) {
    app.selectedState = audience.stateCodes[0];
    app.planningScope = "state";
  }
  app.selectedSurface = "planning";
  persistChatSessions();
  render();
}

function getDinkOptions(key) {
  const selectedProductLabel = productLabel(app.selectedProduct);
  const liveCount = getProductLiveStateCodes(app.selectedProduct).length;
  const stateLabel = getSelectedStateName();
  const options = {
    period: [
      { value: "2027-01:2027-12", label: "Calendar 2027" },
      { value: "2026-09:2027-06", label: "Sep 2026 to Jun 2027" },
      { value: "2026-10:2027-12", label: "Oct 2026 to Dec 2027" }
    ],
    budget: [],
    geo: [
      { value: "national", label: `National - ${formatNumber(liveCount)} ${selectedProductLabel} states` },
      { value: `state:${app.selectedState}`, label: `${stateLabel} only` },
      { value: "product_live", label: `${selectedProductLabel} live-state set` }
    ],
    audience: [
      { value: "working", label: "Working audience" },
      { value: "high_intent", label: "High-intent bettors" },
      { value: "predict_curious", label: "Predicts-curious audiences" },
      ...getPersonaAudienceOptions(),
      ...(app.customAudiences || []).map((audience) => ({
        value: `custom:${audience.id}`,
        label: audience.label
      })),
      { value: "new_audience", label: "Build new audience" }
    ],
    channels: CHANNEL_SCOPE_OPTIONS.map((option) => ({
      value: option.value,
      label: option.label
    })),
    channel_scope: CHANNEL_SCOPE_OPTIONS.map((option) => ({
      value: option.value,
      label: option.label
    })),
    goal: [
      { value: "ftd", label: "FTD growth" },
      { value: "revenue", label: "Revenue growth" },
      { value: "reach", label: "Reach / awareness" }
    ],
    kpi: [
      { value: "cpa", label: "CPA" },
      { value: "cac", label: "All-in CAC" },
      { value: "roas", label: "ROAS" }
    ]
  };
  return options[key] || [];
}

function getDinkDisplay(key) {
  if (key === "period") {
    const raw = app.chatDinks.period || "";
    const period = parsePeriodDink(raw);
    return {
      raw,
      label: period ? `${formatMonth(period.start)} to ${formatMonth(period.end)}` : "Not set",
      isDefault: !raw
    };
  }
  if (key === "budget") {
    const raw = app.chatDinks.budget ? String(app.chatDinks.budget) : "";
    return { raw, label: raw ? formatCurrency(Number(raw)) : "Not set", isDefault: !app.chatDinks.budget };
  }
  if (key === "geo") {
    const raw = app.chatDinks.geo || (app.planningScope === "state" ? `state:${app.selectedState}` : "national");
    if (raw === "product_live") {
      return { raw, label: `${productLabel(app.selectedProduct)} live`, isDefault: !app.chatDinks.geo };
    }
    if (raw.startsWith("state:")) {
      return { raw, label: raw.slice(6), isDefault: !app.chatDinks.geo };
    }
    return { raw, label: "National", isDefault: !app.chatDinks.geo };
  }
  if (key === "channels" || key === "channel_scope") {
    const raw = app.chatDinks.channels || "all";
    const option = CHANNEL_SCOPE_OPTIONS.find((item) => item.value === raw) || CHANNEL_SCOPE_OPTIONS[0];
    return { raw, label: option.label, isDefault: raw === "all" };
  }
  const lookup = Object.fromEntries(getDinkOptions(key).map((option) => [option.value, option.label]));
  const raw = app.chatDinks[key] || "";
  return { raw, label: lookup[raw] || "Not set", isDefault: !raw };
}

function setDinkValue(key, value) {
  if (key === "period") {
    app.chatDinks.period = value;
    return;
  }
  if (key === "budget") {
    app.chatDinks.budget = Number(value) || null;
    return;
  }
  if (key === "geo") {
    app.chatDinks.geo = value;
    if (value === "national" || value === "product_live") {
      app.planningScope = "national";
    } else if (value.startsWith("state:")) {
      app.selectedState = value.slice(6);
      app.planningScope = "state";
    }
    return;
  }
  if (key === "channels" || key === "channel_scope") {
    app.chatDinks.channels = CHANNEL_SCOPE_OPTIONS.some((option) => option.value === value) ? value : "all";
    return;
  }
  if (key === "audience" && value === "new_audience") {
    app.chatDinks.audience = value;
    app.selectedSurface = "audience";
    initialiseAudienceBuilder();
    return;
  }
  app.chatDinks[key] = value;
}

function buildChatRequestContext(mode, text = "") {
  const conversation = ensureChatConversation(mode.key);
  const parsedBudget = interpretPlanningDocument(text, "chat")?.budget;
  const dinks = (mode.allowed_dinks || []).map((key) => {
    const definition = DINK_DEFINITIONS[key] || { label: formatStatus(key) };
    const value = key === "budget" && parsedBudget
      ? { raw: String(parsedBudget), label: formatCurrency(parsedBudget), isDefault: false }
      : key === "budget" && mode.key === "oneoff"
        ? { raw: "", label: "Not set", isDefault: true }
        : getDinkDisplay(key);
    return {
      key,
      label: definition.label,
      value: value.label,
      raw: value.raw,
      isDefault: value.isDefault
    };
  });
  return {
    mode: mode.key,
    format: app.chatFormat,
    engine: app.chatEngine,
    planningBasis: app.planningBasis,
    engineCapability: getModeCapability(mode.key),
    productKey: app.selectedProduct,
    productLabel: productLabel(app.selectedProduct),
    dinks,
    attachments: (conversation.attachments || []).map((attachment) => ({
      id: attachment.id,
      name: attachment.name,
      kind: attachment.kind,
      wordCount: attachment.wordCount,
      charCount: attachment.charCount,
      excerpt: String(attachment.text || "").slice(0, 6000)
    }))
  };
}

function attachmentPromptText(requestContext) {
  const attachments = requestContext?.attachments || [];
  if (!attachments.length) return "";
  return attachments.map((attachment) => [
    `Attachment: ${attachment.name} (${attachment.kind}, ${formatNumber(attachment.wordCount)} words)`,
    String(attachment.excerpt || "").slice(0, 6000)
  ].join("\n")).join("\n\n");
}

function renderRequestDinkChips(dinks = []) {
  const visibleDinks = dinks.filter((dink) => !dink.isDefault);
  if (!visibleDinks.length) return "";
  return `
    <div class="request-dink-row">
      ${visibleDinks.map((dink) => `<span class="pill status-working">${escapeHtml(dink.label)}: ${escapeHtml(dink.value)}</span>`).join("")}
    </div>
  `;
}

function renderAttachmentChips(conversation) {
  const attachments = conversation.attachments || [];
  if (!attachments.length) return "";
  return `
    <div class="attachment-row">
      ${attachments.map((attachment) => `
        <span class="pill status-working">
          ${escapeHtml(attachment.name)} - ${formatNumber(attachment.wordCount)} words
          <button type="button" aria-label="Remove ${escapeHtml(attachment.name)}" data-clear-attachment="${escapeHtml(attachment.id)}">x</button>
        </span>
      `).join("")}
    </div>
  `;
}

async function handleChatAttachmentUpload(file) {
  const conversation = ensureChatConversation(app.selectedPlanningMode);
  app.chatUploadWarning = "";
  try {
    if (!window.extractText) {
      throw new Error("Upload extractor is not available in this build.");
    }
    const extracted = await window.extractText(file);
    conversation.attachments.push({
      id: `att-${Date.now()}`,
      ...extracted,
      createdAt: getDemoToday()
    });
    saveBriefToLibrary({
      text: extracted.text,
      modeKey: app.selectedPlanningMode,
      source: "upload",
      attachment: extracted
    });
    conversation.updatedAt = getDemoToday();
    persistChatSessions();
  } catch (error) {
    app.chatUploadWarning = error.message;
  }
  renderPlanningChatShell();
}

function removeChatAttachment(attachmentId) {
  const conversation = ensureChatConversation(app.selectedPlanningMode);
  conversation.attachments = (conversation.attachments || []).filter((attachment) => attachment.id !== attachmentId);
  conversation.updatedAt = getDemoToday();
  persistChatSessions();
  renderPlanningChatShell();
}

function downloadChatMessage(messageId) {
  const conversations = Object.values(app.chatConversations);
  const message = conversations
    .flatMap((conversation) => conversation.messages || [])
    .find((item) => item.id === messageId);
  if (!message?.download) return;
  downloadFile(message.download.filename, message.download.text, message.download.mime || "text/plain");
}

function renderMarkdown(markdown) {
  if (window.marked?.parse) {
    return window.marked.parse(markdown);
  }
  return `<p>${escapeHtml(markdown)}</p>`;
}

function renderChatMessage(message) {
  if (message.role === "user") {
    return `
      <article class="chat-bubble user">
        <p>${escapeHtml(message.body)}</p>
        ${renderRequestDinkChips(message.dinks)}
      </article>
    `;
  }
  const skillFrames = Array.isArray(message.skillFrames)
    ? message.skillFrames
    : Array.isArray(message.llm?.skillFrames)
      ? message.llm.skillFrames
      : [];
  const skillReceipts = Array.isArray(message.llm?.skillReceipts) ? message.llm.skillReceipts : [];
  const grounding = message.llm?.dossier?.free_research || null;
  return `
    <article class="chat-bubble assistant ${message.documentType === "plan_table" ? "plan-document" : ""} ${message.pending ? "is-pending" : ""}" data-skill-frames="${escapeHtml(skillFrames.join(","))}" data-skill-receipts="${escapeHtml(JSON.stringify(skillReceipts))}" data-grounding-json="${escapeHtml(grounding ? JSON.stringify(grounding) : "")}">
      <div>
        <h3>${escapeHtml(message.title || "Answer")}</h3>
        <div class="chat-markdown">${renderMarkdown(message.body)}</div>
      </div>
      ${renderChatProvenanceChips(message.chips)}
      ${message.download ? `<button class="small-action" type="button" data-chat-download="${escapeHtml(message.id || "")}">Download ${escapeHtml(message.download.label || "CSV")}</button>` : ""}
      ${message.actions?.length ? `
        <div class="chat-action-row">
          ${message.actions.map((action) => `<button class="small-action" type="button" data-${escapeHtml(action.key)}>${escapeHtml(action.label)}</button>`).join("")}
        </div>
      ` : ""}
      ${message.prompts?.length ? `
        <div class="suggested-prompts">
          ${message.prompts.map((prompt) => `<button class="suggested-prompt" type="button" data-suggested-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`).join("")}
        </div>
      ` : ""}
    </article>
  `;
}

function renderChatProvenanceChips(chips = []) {
  const safeChips = chips.length ? chips : [{ label: "deterministic", className: "status-working" }];
  return `
    <div class="provenance-chip-row">
      ${safeChips.map((chip) => `<span class="pill ${escapeHtml(chip.className || "status-working")}">${escapeHtml(chip.label)}</span>`).join("")}
    </div>
  `;
}

function renderChatContextChips() {
  const selectedCodes = getSelectedPlanningStateCodes(app.selectedProduct);
  const firewall = getFirewallSummary(selectedCodes, app.selectedProduct);
  const meta = getPlanMeta();
  return `
    <button class="context-chip" type="button" data-chat-overlay="scope">
      <span>Scope</span>
      <strong>${escapeHtml(app.planningScope === "national" ? "National" : getSelectedStateName())} - ${formatNumber(selectedCodes.length)} live</strong>
    </button>
    <button class="context-chip ${escapeHtml(firewall.className)}" type="button" data-chat-overlay="firewall">
      <span>Firewall live</span>
      <strong>${escapeHtml(firewall.label)}</strong>
    </button>
    <button class="context-chip" type="button" data-chat-overlay="plan">
      <span>Plan</span>
      <strong>${escapeHtml(meta?.label || getPlan().plan_id)} v${escapeHtml(meta?.version || 1)}</strong>
    </button>
  `;
}

function getFirewallSummary(stateCodes, productKey) {
  const rows = stateCodes
    .map((code) => app.data.governance.state_rows.find((row) => row.state_code === code))
    .filter(Boolean);
  const blocked = rows.filter((row) => isActivationSuppressed(getProductStatus(row, productKey)));
  const watch = rows.filter((row) => ["restricted", "legal-review"].includes(getProductStatus(row, productKey)));
  if (blocked.length) {
    return { label: `${blocked.length} blocked`, className: "is-blocked", blockedCount: blocked.length, watchCount: watch.length };
  }
  if (watch.length) {
    return { label: `${watch.length} watch`, className: "is-watch", blockedCount: 0, watchCount: watch.length };
  }
  return { label: "clear", className: "is-clear", blockedCount: 0, watchCount: 0 };
}

function renderChatModePanelSummary(modeKey) {
  const plan = getPlan();
  const mode = planningChatModes().find((item) => item.key === modeKey) || currentChatMode();
  if (modeKey === "month") {
    const draft = app.revisionDraft;
    return `
      <span>${escapeHtml(formatMonth(app.selectedCalendarMonth))}</span>
      <strong>${draft ? `${formatNumber(draft.selectedDiff.length)} channel deltas ready` : "Monthly diff panel"}</strong>
    `;
  }
  if (modeKey === "oneoff") {
    const basisLabel = app.oneOffIncrementalityBasis
      ? (app.oneOffIncrementalityBasis === "incremental" ? "Incremental basis" : "Standalone basis")
      : "Basis needed";
    return `
      <span>One-off gate</span>
      <strong>${escapeHtml(basisLabel)} · ${escapeHtml(productLabel(app.oneOffProduct || app.selectedProduct))}</strong>
    `;
  }
  if (modeKey === "free") {
    const conversation = ensureChatConversation("free");
    const canvas = normaliseIdeasCanvas(conversation.ideasCanvas, "free");
    return `
      <span>Ideas canvas</span>
      <strong>${formatNumber(countWords(canvas.text))} words · ${escapeHtml(canvas.status || "saved")}</strong>
    `;
  }
  if (modeKey === "year") {
    const summary = ensureChatConversation("year").lastComputedYearPlan;
    return `
    <span>${summary ? "Year plan output" : "Year output"}</span>
    <strong>${summary ? `${formatCurrency(summary.budget_usd)} - ${formatPeriodLabel(summary.period)}` : "Blank until this chat creates a plan"}</strong>
  `;
  }
  return `
    <span>${escapeHtml(mode.label)} output</span>
    <strong>${formatCurrency(plan.total_allocated_gbp)} · ${formatNumber(plan.forecast_acquisitions)} FTD proxy</strong>
  `;
}

function renderChatModePanel(modeKey) {
  const mode = planningChatModes().find((item) => item.key === modeKey) || currentChatMode();
  const panel = mode.output_panel || "year_plan_materialising";
  if (panel === "month_old_vs_new") return renderChatMonthPanel();
  if (panel === "one_off_gate") return renderChatOneOffPanel();
  if (panel === "ideas_canvas") return renderChatFreePanel();
  return renderChatYearPanel();
}

function renderChatYearPanel() {
  const conversation = ensureChatConversation("year");
  const summary = conversation.lastComputedYearPlan;
  if (!summary) {
    return `
    <div class="chat-panel-heading">
      <div>
        <p class="eyebrow">Year output</p>
        <h3>Ready for your planning brief</h3>
      </div>
      <span class="status status-review">no plan from this chat yet</span>
    </div>
    <div class="empty-output-panel">
      <p>Send a budget and planning period, then the deterministic planner will create the plan here. The signed-off baseline stays in Flightpath rather than pretending to be a fresh answer.</p>
    </div>
  `;
  }
  const entry = getYearChatPlanEntry(summary);
  const plan = entry?.plan || getPlan();
  const period = summary.period || entry?.meta?.period;
  return `
    <div class="chat-panel-heading">
      <div>
        <p class="eyebrow">Year output</p>
        <h3>${escapeHtml(entry?.meta?.label || "Draft plan ready")}</h3>
      </div>
      <span class="status status-working">${escapeHtml(formatStatus(entry?.meta?.status || "draft"))}</span>
    </div>
    ${renderPlanValueLensControl("planningValueModeSelect")}
    <div class="planning-readout chat-output-readout">
      <article class="readout-item"><span>Period</span><strong>${escapeHtml(formatPeriodLabel(period))}</strong></article>
      <article class="readout-item"><span>Budget</span><strong>${formatCurrency(plan.total_allocated_gbp)}</strong></article>
      <article class="readout-item"><span>${escapeHtml(planFtdLensLabel())}</span><strong>${formatNumber(displayPlanFtd(plan.forecast_acquisitions))}</strong></article>
      <article class="readout-item"><span>${app.budgetOptimisation === "value" ? "Media / value proxy" : "CPA"}</span><strong>${formatMoney(displayPlanCpa(plan.total_allocated_gbp, plan.forecast_acquisitions), 2)}</strong></article>
    </div>
    <div class="pill-row">
      <span class="pill status-working">${escapeHtml(summary.channel_scope?.label || "All channels")}</span>
      <span class="pill status-synthetic">SYNTHETIC plan economics</span>
      <span class="pill status-working">saved plan object</span>
    </div>
    <div id="yearChatGrid" class="year-chat-grid"></div>
  `;
}

function getYearChatPlanEntry(summary = ensureChatConversation("year").lastComputedYearPlan) {
  if (!summary?.saved_plan_id) return null;
  const existing = app.data?.planStore?.byId?.[summary.saved_plan_id];
  if (existing) return existing;
  const rebuilt = buildPlanStoreEntryFromYearSummary(summary, { status: "draft", activate: false });
  upsertPlanStoreEntry(rebuilt, { activate: false });
  return rebuilt;
}

function renderPlanningChatGridIfNeeded(mode = currentChatMode()) {
  if (!["year", "month", "launch"].includes(mode.key)) return;
  const activeEntry = getActivePlanEntry() || getStoredPlanEntry();
  if (activeEntry?.plan && $("#planningStatusQuoGrid")) {
    renderTimeMachineGrid(activeEntry.plan, "planningStatusQuoGrid", {
      startMonth: mode.key === "month" ? app.selectedCalendarMonth : activeEntry.meta?.period?.start,
      endMonth: mode.key === "month" ? app.selectedCalendarMonth : activeEntry.meta?.period?.end,
      gridOnly: true
    });
  }
  if (mode.key !== "year") return;
  const summary = ensureChatConversation("year").lastComputedYearPlan;
  const entry = getYearChatPlanEntry(summary);
  if (!summary || !entry || !$("#yearChatGrid")) return;
  renderTimeMachineGrid(entry.plan, "yearChatGrid", {
    startMonth: summary.period?.start,
    endMonth: summary.period?.end
  });
}

function renderPlannerAudienceSizing() {
  const personas = app.data.personas?.personas || [];
  if (!personas.length) return "";
  const selected = new Set(getSelectedPlanningStateCodes(app.selectedProduct));
  const matched = personas.filter((persona) => (persona.state_codes || []).some((code) => selected.has(code)));
  const visiblePersonas = (matched.length ? matched : personas).slice(0, 3);
  const totalProxy = (matched.length ? matched : personas).reduce((sum, persona) => sum + Number(persona.segment_size_proxy?.value || 0), 0);
  const hiddenCount = Math.max(0, (matched.length ? matched : personas).length - visiblePersonas.length);
  return `
    <div class="planner-audience-strip">
      <div>
        <span>Audience sizing</span>
        <strong>${formatNumber(totalProxy)} working proxy</strong>
        <small>${matched.length ? `${formatNumber(matched.length)} matched persona${matched.length === 1 ? "" : "s"}` : "loaded persona proxies"} / not Admiral audience data</small>
      </div>
      <div class="planner-audience-list">
        ${visiblePersonas.map((persona) => `
          <span>${escapeHtml(persona.primary_state)} ${formatNumber(persona.segment_size_proxy?.value || 0)}</span>
        `).join("")}
        ${hiddenCount ? `<span>+${formatNumber(hiddenCount)} more</span>` : ""}
      </div>
    </div>
  `;
}

function renderChatMonthPanel() {
  const draft = app.revisionDraft;
  const monthRows = (app.data.actualsMonthly?.rows || []).filter((row) => row.month === app.selectedCalendarMonth && row.buyable !== false).slice(0, 5);
  return `
    <div class="chat-panel-heading">
      <div>
        <p class="eyebrow">Month output</p>
        <h3>${escapeHtml(formatMonth(app.selectedCalendarMonth))} old vs new</h3>
      </div>
      <span class="status ${draft ? "status-working" : "status-synthetic"}">${draft ? "diff ready" : "new plan blank"}</span>
    </div>
    <div class="old-new-grid" data-month-replan-material="${draft ? "draft" : "empty"}">
      <article>
        <span>Old monthly plan</span>
        ${monthRows.map((row) => `<p><strong>${escapeHtml(row.channel)}</strong> ${formatCurrency(row.planned_spend || 0)}</p>`).join("")}
      </article>
      <article>
        <span>New monthly plan</span>
        ${
          draft
            ? draft.selectedDiff.slice(0, 5).map((row) => `<p><strong>${escapeHtml(row.channel)}</strong> ${formatCurrency(row.revised_spend)} <small>${formatSignedCurrency(row.delta_spend)}</small></p>`).join("")
            : `<p class="muted-copy">Ask "Replan ${escapeHtml(formatMonth(app.selectedCalendarMonth).split(" ")[0])}" to fill the deterministic revision.</p>`
        }
      </article>
    </div>
    <div class="year-fit-strip">${MONTH_LABELS.map((month, index) => `<i class="${index + 1 === Number(app.selectedCalendarMonth.slice(5, 7)) ? "is-selected" : ""}"></i>`).join("")}</div>
    ${renderMonthlyPlanningNote()}
  `;
}

function renderChatOneOffPanel() {
  const basis = app.oneOffIncrementalityBasis;
  const productKey = app.oneOffProduct || app.selectedProduct;
  const basisLabel = basis === "incremental" ? "Incremental on existing activity" : basis === "standalone" ? "Standalone" : "Basis required";
  const productWarning = app.addProductWarning
    ? `<div class="notice-line ${app.addProductOpen ? "" : "status-working"}">${escapeHtml(app.addProductWarning)}</div>`
    : "";
  return `
    <div class="chat-panel-heading">
      <div>
        <p class="eyebrow">One-off output</p>
        <h3>Incrementality gate</h3>
      </div>
      <span class="status ${basis ? "status-working" : "status-review"}">${escapeHtml(basisLabel)}</span>
    </div>
    <div class="gate-card">
      <button class="gate-option ${basis === "incremental" ? "is-selected" : ""}" type="button" data-oneoff-basis="incremental">Incremental on existing activity</button>
      <button class="gate-option ${basis === "standalone" ? "is-selected" : ""}" type="button" data-oneoff-basis="standalone">Standalone</button>
      <label class="compact-select">
        <span>Product</span>
        <select data-oneoff-product>
          ${productOptionsHtml(productKey)}
          <option value="new" ${app.addProductOpen ? "selected" : ""}>+ New product</option>
        </select>
      </label>
      ${app.addProductOpen ? renderAddProductForm() : ""}
      ${productWarning}
    </div>
  `;
}

function renderAddProductForm() {
  return `
    <div class="new-product-form" aria-label="Add working demo product">
      <label>
        <span>Name</span>
        <input type="text" data-new-product-name placeholder="FanDuel Racing">
      </label>
      <label>
        <span>Product key</span>
        <input type="text" data-new-product-key placeholder="racing">
      </label>
      <div class="new-product-actions">
        <button class="gate-option" type="button" data-add-product>Add product</button>
        <button class="small-action" type="button" data-cancel-add-product>Cancel</button>
      </div>
      <p>Default governance: not listed in every state, working source, no activation until evidence is added.</p>
    </div>
  `;
}

function renderChatFreePanel() {
  const conversation = ensureChatConversation("free");
  const canvas = conversation.ideasCanvas;
  const wordCount = countWords(canvas.text);
  const canDraft = app.chatEngine === "llm" || app.chatEngine === "both";
  return `
    <div class="chat-panel-heading">
      <div>
        <p class="eyebrow">Free output</p>
        <h3>Ideas canvas</h3>
      </div>
      <span class="status ${canvas.status === "draft" ? "status-review" : "status-working"}">${escapeHtml(canvas.status || "saved")}</span>
    </div>
    <div class="ideas-canvas">
      <div class="ideas-canvas-toolbar">
        <div>
          <strong>Scratch space attached to this conversation</strong>
          <span>${formatNumber(wordCount)} words / updated ${escapeHtml(canvas.updatedAt || getDemoToday())}</span>
        </div>
        <div class="panel-actions">
          <button class="small-action" type="button" data-save-ideas-canvas>Save</button>
          <button class="small-action" type="button" data-export-ideas-canvas>Export</button>
          <button class="small-action" type="button" data-draft-ideas-canvas ${canDraft ? "" : "disabled"}>${canDraft ? "Draft from thread" : "LLM mode required"}</button>
        </div>
      </div>
      <textarea data-ideas-canvas rows="9" aria-label="Ideas canvas">${escapeHtml(canvas.text)}</textarea>
      <div class="pill-row">
        <span class="pill status-working">saved with chat</span>
        <span class="pill status-synthetic">SYNTHETIC-safe notes only</span>
        <span class="pill ${canDraft ? "status-working" : "status-review"}">${canDraft ? `${escapeHtml(app.chatEngine)} writable` : "switch engine to llm/both to draft"}</span>
      </div>
      ${app.ideasCanvasNotice ? `<div class="notice-line">${escapeHtml(app.ideasCanvasNotice)}</div>` : ""}
    </div>
  `;
}

function countWords(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean).length;
}

function updateIdeasCanvas(text, options = {}) {
  const conversation = ensureChatConversation("free");
  conversation.ideasCanvas = {
    ...normaliseIdeasCanvas(conversation.ideasCanvas, "free"),
    text: String(text || ""),
    updatedAt: getDemoToday(),
    status: options.status || "draft",
    source: options.source || "user"
  };
  conversation.updatedAt = getDemoToday();
  app.ideasCanvasNotice = options.notice || (options.status === "saved" ? "Canvas saved with this conversation." : "");
  if (options.persist) {
    persistChatSessions();
  }
}

function saveIdeasCanvas(options = {}) {
  const textarea = $("[data-ideas-canvas]");
  updateIdeasCanvas(textarea?.value || ensureChatConversation("free").ideasCanvas.text, {
    persist: true,
    status: "saved",
    source: "user",
    notice: "Canvas saved with this Free-mode conversation."
  });
  if (options.render !== false) {
    renderPlanningChatShell();
  }
}

function exportIdeasCanvas() {
  saveIdeasCanvas({ render: false });
  const conversation = ensureChatConversation("free");
  downloadFile(`fanduel_ideas_canvas_${getDemoToday()}.md`, buildIdeasCanvasExport(conversation), "text/markdown");
  app.ideasCanvasNotice = "Canvas exported as Markdown and remains saved with this conversation.";
  renderPlanningChatShell();
}

function draftIdeasCanvasFromThread() {
  if (app.chatEngine !== "llm" && app.chatEngine !== "both") {
    app.ideasCanvasNotice = "Switch the engine to LLM or Both before letting the canvas write from the thread.";
    renderPlanningChatShell();
    return;
  }
  const conversation = ensureChatConversation("free");
  const userMessages = (conversation.messages || [])
    .filter((message) => message.role === "user")
    .slice(-3)
    .map((message) => message.body);
  const plan = getPlan();
  const stateCodes = getSelectedPlanningStateCodes(app.selectedProduct);
  const draft = [
    "# Ideas canvas",
    "",
    "## Drafted from thread",
    "",
    `- Engine lane: ${app.chatEngine}. If an env-configured endpoint is present, the LLM service narrates; otherwise this uses the local deterministic dossier narrator.`,
    `- Active plan: ${plan.scenario?.label || app.selectedScenario}, ${formatCurrency(plan.total_allocated_gbp)}, ${formatNumber(plan.forecast_acquisitions)} FTD proxy.`,
    `- Current product/state scope: ${productLabel(app.selectedProduct)} across ${formatNumber(stateCodes.length)} selected states.`,
    "- Keep paid-SERP scope, regulator verification and real client data as review gates before rehearsal.",
    "- SYNTHETIC economics remain labelled in every answer/export.",
    "",
    "## Recent prompts",
    userMessages.length ? userMessages.map((item) => `- ${item}`).join("\n") : "- No user prompts in this Free-mode thread yet.",
    "",
    "## Open questions",
    "",
    "- Which assumptions should Rob sign off before Karl?",
    "- Which outputs need a clean slide/export treatment?",
    "- Which state/product claims need legal or source-owner review?"
  ].join("\n");
  updateIdeasCanvas(draft, {
    persist: true,
    status: "draft",
    source: `${app.chatEngine}_thread_draft`,
    notice: "Canvas drafted from the thread and deterministic dossier. Review and save when ready."
  });
  renderPlanningChatShell();
}

function buildIdeasCanvasExport(conversation = ensureChatConversation("free")) {
  const canvas = normaliseIdeasCanvas(conversation.ideasCanvas, "free");
  return [
    `# FanDuel Free-Mode Ideas Canvas`,
    "",
    `Updated: ${canvas.updatedAt || getDemoToday()}`,
    `Status: ${canvas.status}`,
    `Source: ${canvas.source}`,
    `Conversation: ${conversation.title || "Free planning chat"}`,
    "",
    canvas.text,
    "",
    "---",
    "SYNTHETIC demo flags remain active. Treat this canvas as planning notes, not client performance data."
  ].join("\n");
}

async function submitPlanningChat() {
  if (app.chatSubmitting) return;
  const input = $("#planningChatInput");
  const mode = currentChatMode();
  const conversation = ensureChatConversation(mode.key);
  const hasAttachments = (conversation.attachments || []).length > 0;
  const text = String(input?.value || "").trim() || (hasAttachments ? "Interpret the attached planning document for this mode." : "");
  if (!text) return;
  applyInlineDinkHints(mode, text);
  const requestContext = buildChatRequestContext(mode, text);
  saveBriefToLibrary({
    text,
    modeKey: mode.key,
    requestContext,
    source: hasAttachments ? "typed_with_attachment" : "typed"
  });
  const requiresBudget = mode.key !== "free" && (mode.allowed_dinks || []).includes("budget");
  const budgetDink = requestContext.dinks.find((dink) => dink.key === "budget");
  const hasBudgetForMode = Boolean(budgetDink?.raw || (mode.key === "oneoff" && app.oneOffDraft?.budget));
  const pendingId = `pending-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  conversation.messages.push({ role: "user", body: text, dinks: requestContext.dinks, createdAt: getDemoToday() });
  conversation.messages.push({
    id: pendingId,
    role: "assistant",
    title: "Sending",
    body: "Working on it...",
    pending: true,
    chips: [
      { label: "submitted", className: "status-working" },
      { label: mode.key === "free" ? "free question" : "planner running", className: "status-review" }
    ],
    createdAt: getDemoToday()
  });
  conversation.title = conversation.messages.find((message) => message.role === "user")?.body.slice(0, 38) || conversation.title;
  conversation.updatedAt = getDemoToday();
  app.chatSubmitting = true;
  persistChatSessions();
  if (input) input.value = "";
  renderPlanningChatShell();
  scrollPlanningChatToLatest();
  try {
    const answer = !["year", "month", "launch", "oneoff"].includes(mode.key) && requiresBudget && !hasBudgetForMode
      ? {
          role: "assistant",
          title: "Budget needed",
          body: "Budget is mandatory before this plan mode runs. Add a Budget dink, then send again.",
          chips: [
            { label: "dinks gate", className: "status-review" },
            { label: "no plan accepted yet", className: "status-missing" }
          ],
          createdAt: getDemoToday()
        }
      : await buildPlanningChatAnswer(text, mode.key, requestContext);
    replacePendingChatMessage(conversation, pendingId, answer);
  } catch (error) {
    replacePendingChatMessage(conversation, pendingId, {
      role: "assistant",
      title: "Could not answer",
      body: "The request did not complete, so I have not accepted a plan or changed any numbers. Please try again.",
      chips: [
        { label: "request failed", className: "status-missing" },
        { label: "no plan accepted yet", className: "status-review" }
      ],
      createdAt: getDemoToday()
    });
  } finally {
    app.chatSubmitting = false;
    conversation.updatedAt = getDemoToday();
    persistChatSessions();
    renderPlanningChatShell();
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    scrollPlanningChatToLatest(lastMessage);
  }
}

function replacePendingChatMessage(conversation, pendingId, answer) {
  const index = conversation.messages.findIndex((message) => message.id === pendingId);
  if (index >= 0) {
    conversation.messages.splice(index, 1, answer);
  } else {
    conversation.messages.push(answer);
  }
}

function scrollPlanningChatToLatest(lastMessage = null) {
  const thread = $("#planningChatThread");
  if (!thread) return;
  if (lastMessage?.documentType === "plan_table") {
    const planMessages = thread.querySelectorAll(".chat-bubble.assistant.plan-document");
    const latestPlanMessage = planMessages[planMessages.length - 1];
    thread.scrollTop = Math.max(0, (latestPlanMessage?.offsetTop || 0) - thread.offsetTop - 8);
  } else {
    thread.scrollTop = thread.scrollHeight;
  }
}

async function buildPlanningChatAnswer(text, modeKey, requestContext = null) {
  let answer;
  if (modeKey === "year") {
    answer = await buildYearLlmChatAnswer(text, requestContext);
  } else if (modeKey === "month") {
    answer = await buildMonthLlmChatAnswer(text, requestContext);
  } else if (modeKey === "oneoff") {
    answer = await buildOneOffLlmChatAnswer(text, requestContext);
  } else if (modeKey === "launch") {
    answer = await buildLaunchLlmChatAnswer(text, requestContext);
  } else {
    const deterministicAnswer = buildDeterministicChatAnswer(text, modeKey, requestContext);
    if (modeKey !== "free" || app.chatEngine === "deterministic") {
      app.llmLastStatus = "";
      if (modeKey === "free" && app.chatEngine === "deterministic") {
        answer = {
          ...deterministicAnswer,
          title: "Understudy grounded answer",
          body: `Understudy fallback is explicitly enabled for this URL. This is the local deterministic safety floor, not the live Free chat model.\n\n${deterministicAnswer.body}`,
          chips: [
            { label: "understudy=on", className: "status-review" },
            { label: "local deterministic safety floor", className: "status-review" },
            ...(deterministicAnswer.chips || [])
          ]
        };
      } else {
        answer = deterministicAnswer;
      }
    } else {
      const mode = planningChatModes().find((item) => item.key === modeKey) || currentChatMode();
      const llmResult = await runPlanningLlmService({
        text,
        mode,
        requestContext,
        deterministicAnswer
      });
      answer = applyLlmNarration(deterministicAnswer, llmResult, mode);
    }
  }
  return attachPlanningReasoningFrames(answer, modeKey, text);
}

function attachPlanningReasoningFrames(answer, modeKey, text) {
  const clean = lowerCaseText(text);
  const frames = new Set(answer?.skillFrames || []);
  if (modeKey === "year") frames.add("annual_planning");
  if (modeKey === "month") frames.add("plan_revision");
  if (modeKey === "oneoff") frames.add("incrementality");
  if (modeKey === "launch") frames.add("launch_path");
  if (/brand|awareness|response|direct.response|dr\b/.test(clean)) frames.add("brand_response");
  if (/state|texas|new jersey|pennsylvania|michigan|where sportsbook/.test(clean)) frames.add("governance");
  if (/performance|delivery|sales index|rebalance/.test(clean)) frames.add("performance_rebalance");
  if (/incremental|extra|more|less|cut|layer/.test(clean)) frames.add("incrementality");
  return { ...answer, skillFrames: [...frames] };
}

const YEAR_PLAN_BRIEF_TOOL = {
  name: "extract_year_plan_brief",
  description: "Extract the structured fields for a FanDuel US annual planning request without inventing missing values.",
  input_schema: {
    type: "object",
    properties: {
      intent: {
        type: "string",
        enum: ["create_plan", "answer_question", "unclear"],
        description: "create_plan when the user is asking for an annual plan; answer_question when they are asking about the existing plan/thread."
      },
      budget_usd: {
        type: "number",
        description: "User-provided annual planning budget in USD. Omit when the user has not provided a budget."
      },
      year: {
        type: "integer",
        description: "User-provided plan year if stated. Omit when absent."
      },
      start_date: {
        type: "string",
        description: "User-provided planning start month/date as YYYY-MM or YYYY-MM-DD. Omit when absent."
      },
      end_date: {
        type: "string",
        description: "User-provided planning end month/date as YYYY-MM or YYYY-MM-DD. Omit when absent."
      },
      channel_scope: {
        type: "string",
        enum: ["all", "search", "ctv", "tv_video", "social"],
        description: "Channel restriction when the user asks for all channels, search-only, pure CTV, TV/video or social-only."
      },
      states: {
        type: "array",
        items: { type: "string" },
        description: "Two-letter US state codes explicitly requested by the user."
      },
      product_keys: {
        type: "array",
        items: { type: "string", enum: ["sportsbook", "casino", "predicts", "dfs", "racing"] },
        description: "FanDuel product keys explicitly requested by the user."
      },
      audience: {
        type: "string",
        description: "Audience wording from the user. Omit when absent."
      },
      goal: {
        type: "string",
        description: "Goal wording from the user. Omit when absent."
      },
      kpi: {
        type: "string",
        description: "KPI wording from the user. Omit when absent."
      },
      missing_fields: {
        type: "array",
        items: { type: "string" },
        description: "Missing fields that block the annual plan. Include budget_usd when the budget is missing and period when start/end/year is missing."
      },
      clarifying_question: {
        type: "string",
        description: "A concise question to ask the user when a blocking field is missing. Empty string if no question is needed."
      },
      notes: {
        type: "array",
        items: { type: "string" },
        description: "Trace notes about nearest interpretation or unsupported wording."
      }
    },
    required: ["intent", "missing_fields", "clarifying_question"]
  }
};

const ONE_OFF_BRIEF_TOOL = {
  name: "extract_one_off_campaign_brief",
  description: "Extract the structured fields for a FanDuel US one-off campaign request without inventing budget, product, timing or incrementality.",
  input_schema: {
    type: "object",
    properties: {
      intent: {
        type: "string",
        enum: ["create_campaign", "answer_question", "unclear"],
        description: "create_campaign when the user wants a governed one-off plan; answer_question when they are only asking about the active context."
      },
      budget_usd: {
        type: "number",
        description: "User-provided one-off campaign budget in USD. Omit when absent."
      },
      product_keys: {
        type: "array",
        items: { type: "string", enum: ["sportsbook", "casino", "predicts", "dfs", "racing"] },
        description: "FanDuel product keys explicitly requested by the user."
      },
      state_codes: {
        type: "array",
        items: { type: "string" },
        description: "Two-letter US state codes explicitly requested by the user. Leave empty for national/product-live scope."
      },
      months: {
        type: "array",
        items: { type: "string" },
        description: "Campaign months as YYYY-MM values when the user states or strongly implies timing."
      },
      objective: {
        type: "string",
        description: "User objective in their words, such as awareness, FTD acquisition, CPA efficiency or retention."
      },
      incrementality_basis: {
        type: "string",
        enum: ["incremental", "standalone", "missing"],
        description: "incremental when the user says extra/on-top/on-existing; standalone when separate; missing when not stated."
      },
      missing_fields: {
        type: "array",
        items: { type: "string" },
        description: "Missing fields that block accepting the campaign. Include budget_usd and/or incrementality_basis when absent."
      },
      clarifying_question: {
        type: "string",
        description: "One concise question when a blocking field is missing. Empty string if no question is needed."
      },
      notes: {
        type: "array",
        items: { type: "string" },
        description: "Trace notes about any UI-derived field, nearest interpretation or unsupported wording."
      }
    },
    required: ["intent", "incrementality_basis", "missing_fields", "clarifying_question"]
  }
};

const MONTH_REPLAN_BRIEF_TOOL = {
  name: "extract_month_replan_brief",
  description: "Extract the target month and question intent for a FanDuel US monthly replan request.",
  input_schema: {
    type: "object",
    properties: {
      intent: {
        type: "string",
        enum: ["create_revision", "answer_question", "unclear"],
        description: "create_revision when the user asks to replan a month; answer_question when they ask about monthly performance or year-fit."
      },
      month: {
        type: "string",
        description: "Target month as YYYY-MM when stated or strongly implied. Omit when absent."
      },
      product_keys: {
        type: "array",
        items: { type: "string", enum: ["sportsbook", "casino", "predicts", "dfs", "racing"] },
        description: "FanDuel product keys explicitly requested by the user."
      },
      reason: {
        type: "string",
        description: "Why the month is being replanned, in the user's words."
      },
      budget_delta_usd: {
        type: "number",
        description: "Explicit extra working-media budget to add (positive) or remove (negative) in the selected month. Omit when none was requested."
      },
      use_current_performance: {
        type: "boolean",
        description: "True only when the user asks to replan, rebalance or revise using current delivery, sales or channel performance."
      },
      missing_fields: {
        type: "array",
        items: { type: "string" },
        description: "Missing fields that block a revision. Include month when no month is available."
      },
      clarifying_question: {
        type: "string",
        description: "One concise question when a blocking field is missing. Empty string if no question is needed."
      },
      notes: {
        type: "array",
        items: { type: "string" },
        description: "Trace notes about any UI-derived field, nearest interpretation or unsupported wording."
      }
    },
    required: ["intent", "missing_fields", "clarifying_question"]
  }
};

async function buildYearLlmChatAnswer(text, requestContext = null) {
  const mode = planningChatModes().find((item) => item.key === "year") || currentChatMode();
  const conversation = ensureChatConversation("year");
  const pending = conversation.pendingYearBrief || null;
  const dossier = buildLlmDossier(mode, text, requestContext, {
    title: "Year-mode intake",
    body: "No plan has been accepted until a user-provided budget is extracted."
  });
  let extraction;
  try {
    extraction = await extractYearPlanDinks({ text, mode, dossier, pending });
    extraction = applyRequestDinksToYearExtraction(extraction, requestContext, text);
    if (!extraction.productKeys.length && requestContext?.productKey) {
      extraction.productKeys = [requestContext.productKey];
      extraction.notes = [...(extraction.notes || []), `Product came from UI selector: ${requestContext.productLabel || requestContext.productKey}`];
    }
  } catch (error) {
    app.llmLastStatus = `Year LLM unavailable: ${error.message}`;
    extraction = applyRequestDinksToYearExtraction(buildLocalYearExtraction(text), requestContext, text);
    extraction.notes = [...(extraction.notes || []), `Understudy extraction used because LLM extraction failed: ${error.message}`];
  }

  if (extraction.intent === "answer_question") {
    return answerYearPlanQuestion({ text, mode, requestContext, dossier, extraction, conversation });
  }

  if (extraction.missingFields.includes("budget_usd") || extraction.missingFields.includes("period")) {
    const originalText = pending?.originalText || text;
    conversation.pendingYearBrief = {
      originalText,
      lastUserText: text,
      extraction,
      createdAt: getDemoToday()
    };
    app.llmLastStatus = `LLM structured extraction: ${ANTHROPIC_CHAT_MODEL}`;
    const question = extraction.clarifyingQuestion
      || (extraction.missingFields.includes("budget_usd")
        ? "What budget should I plan against?"
        : "What planning period should I use? For example: calendar 2027, Sep 2026 to Jun 2027, or 15 months from Oct 2026.");
    const heldContext = [
      extraction.productKeys.length ? extraction.productKeys.map(productLabel).join(", ") : requestContext?.productLabel || "the selected product",
      extraction.period ? formatPeriodLabel(extraction.period) : "period still missing",
      extraction.states.length ? extraction.states.join(", ") : "the currently loaded live-state footprint",
      extraction.channelScope ? getChannelScopeOption(extraction.channelScope).label : "all channels"
    ].join("; ");
    const gateReason = extraction.missingFields.includes("budget_usd")
      ? "The working-media budget is the only blocking input: it determines every channel dollar allocation and the derived FTD/CPA proxies, so I will not substitute the inferred public envelope."
      : "The planning period is the only blocking input: it determines the calendar cells and seasonality weights, so I will not choose one by assumption.";
    return decorateChatAnswerWithMode({
      role: "assistant",
      title: extraction.missingFields.includes("budget_usd") ? "Budget needed" : "Period needed",
      body: `${gateReason}\n\nAlready held: ${heldContext}.\n\n${question} Once supplied, I can run the deterministic allocation, governance checks and evidence-bounded scenario without re-asking for the held fields.`,
      chips: [
        { label: `LLM: ${ANTHROPIC_CHAT_MODEL}`, className: "status-working" },
        { label: "structured dinks", className: "status-working" },
        { label: extraction.missingFields.includes("budget_usd") ? "budget missing" : "period missing", className: "status-review" },
        { label: "no plan accepted yet", className: "status-missing" }
      ],
      createdAt: getDemoToday()
    }, mode, "yearLlmPlan", requestContext);
  }

  const governanceConflict = findYearGovernanceConflict(extraction, requestContext);
  if (governanceConflict) {
    conversation.pendingYearBrief = {
      originalText: pending?.originalText || text,
      lastUserText: text,
      extraction,
      createdAt: getDemoToday(),
      governanceConflict
    };
    app.llmLastStatus = `LLM structured extraction + governance challenge: ${ANTHROPIC_CHAT_MODEL}`;
    return decorateChatAnswerWithMode({
      role: "assistant",
      title: "Governance challenge",
      body: `${governanceConflict.productLabel} is not available for activation in ${governanceConflict.stateNames}. I have not run the plan. Remove those states, switch product, or provide a verified rule update before planning. Rule receipt: ${governanceConflict.receipts.join(", ")}.`,
      chips: [
        { label: `LLM: ${ANTHROPIC_CHAT_MODEL}`, className: "status-working" },
        { label: "governance challenge", className: "status-review" },
        { label: "no plan accepted yet", className: "status-missing" }
      ],
      createdAt: getDemoToday()
    }, mode, "yearLlmPlan", requestContext);
  }

  const planResult = computeYearPlanFromExtraction(extraction);
  planResult.brandResponse = buildBrandResponsePlanLayers(planResult.rows, extraction, text);
  planResult.scenarioLabel = extractYearScenarioLabel(text, extraction.period);
  const narration = await narrateYearPlanResult({ text, mode, dossier, extraction, planResult });
  const allocationRationale = buildYearAllocationRationale(planResult);
  conversation.pendingYearBrief = null;
  const summary = summariseYearPlanResult(planResult);
  const draftEntry = buildPlanStoreEntryFromYearSummary(summary, { status: "draft", activate: false });
  summary.saved_plan_id = draftEntry.meta.plan_id;
  summary.saved_scenario_key = draftEntry.meta.scenario_key;
  upsertPlanStoreEntry(draftEntry, { activate: false });
  conversation.lastComputedYearPlan = summary;
  app.chatDinks.budget = planResult.budget;
  app.chatDinks.period = `${planResult.period.start}:${planResult.period.end}`;
  app.chatDinks.channels = planResult.channelScope.value;
  app.llmLastStatus = `LLM structured extraction + narration: ${ANTHROPIC_CHAT_MODEL}`;
  return decorateChatAnswerWithMode({
    role: "assistant",
    title: `${formatCurrency(planResult.budget)} annual plan`,
    body: [
      narration,
      "",
      allocationRationale,
      "",
      "| Channel | Budget | Share | FTD proxy | Media CPA |",
      "| --- | ---: | ---: | ---: | ---: |",
      ...planResult.rows.map((row) => `| ${escapeMarkdownCell(row.channel)} | ${formatCurrency(row.budget)} | ${row.share.toFixed(1)}% | ${formatNumber(row.ftds)} | ${row.buyable === false ? "non-buyable" : formatMoney(row.cpa, 2)} |`),
      `| **Total** | **${formatCurrency(planResult.budget)}** | **100.0%** | **${formatNumber(planResult.ftds)}** | **${formatMoney(planResult.cpa, 2)}** |`,
      ...(planResult.scenarioModifier ? ["", `Scenario modifier: Linear TV and CTV are each weighted +${planResult.scenarioModifier.tv_uplift_pct}% versus their base-plan budgets. The non-TV channels are reduced proportionally so the ${formatCurrency(planResult.budget)} working-media envelope stays fixed. This named draft sits alongside the active base plan; it does not overwrite or activate it.`] : []),
      ...(planResult.brandResponse ? ["", "| Plan lane | Audience | Budget | Measurement |", "| --- | --- | ---: | --- |", `| Brand plan | ${planResult.brandResponse.brand.audience} | ${formatCurrency(planResult.brandResponse.brand.budget)} | Awareness / reach |`, `| Response plan | ${planResult.brandResponse.response.audience} | ${formatCurrency(planResult.brandResponse.response.budget)} | FTD / media CPA |`, `Named scenario: ${planResult.scenarioLabel}. Flutter-shape placeholder: investment strategy defines the two lanes; deterministic media planning executes them.`] : [])
    ].join("\n"),
    chips: [
      { label: `LLM: ${ANTHROPIC_CHAT_MODEL}`, className: "status-working" },
      { label: "deterministic plan numbers", className: "status-working" },
      { label: "T111 guardrails", className: "status-working" },
      { label: "SYNTHETIC economics", className: "status-synthetic" }
    ],
    actions: [
      { key: "save-year-plan", label: "Save to Flightpath" }
    ],
    documentType: "plan_table",
    createdAt: getDemoToday()
  }, mode, "yearLlmPlan", requestContext);
}

async function extractYearPlanDinks({ text, mode, dossier, pending }) {
  const messages = [
    {
      role: "user",
      content: [
        "Extract the Year-mode planning dinks from the user's words.",
        "Never infer a budget. If no user-provided budget is present, mark budget_usd missing and ask for it.",
        pending?.originalText ? `Original brief still pending: ${pending.originalText}` : "",
        pending?.originalText ? `Latest user reply: ${text}` : `User brief: ${text}`,
        `Grounding dossier: ${JSON.stringify(compactYearDossier(dossier))}`
      ].filter(Boolean).join("\n\n")
    }
  ];
  const result = await postAnthropicMessages({
    system: [
      mode.custom_instructions || "",
      ...getCapabilitySystemLines(mode.key),
      "Country is fixed to the United States. Extract structured JSON via the provided tool only.",
      "Budget, planning period, states, products, channel scope, audience, goals and KPIs must come from the user's text or visible UI dinks. Do not use active-plan values as defaults.",
      "If the user says 2027, return start_date=2027-01 and end_date=2027-12. If they specify 10 or 15 months, return the actual start and end months.",
      "If a user is asking about the existing plan rather than asking you to create a new plan, set intent to answer_question and do not require budget_usd."
    ].join("\n"),
    messages,
    tools: [YEAR_PLAN_BRIEF_TOOL],
    tool_choice: { type: "tool", name: YEAR_PLAN_BRIEF_TOOL.name },
    max_tokens: 1200,
    temperature: 0
  });
  const input = getAnthropicToolInput(result, YEAR_PLAN_BRIEF_TOOL.name);
  if (!input) {
    throw new Error("structured extraction missing");
  }
  return normaliseYearExtraction(input);
}

function normaliseYearExtraction(input) {
  const validStates = new Set(getStateRows().map((row) => row.state_code));
  const states = Array.isArray(input.states)
    ? input.states.map((code) => String(code || "").trim().toUpperCase()).filter((code) => validStates.has(code))
    : [];
  const productKeys = Array.isArray(input.product_keys)
    ? input.product_keys.filter((key) => BASE_PRODUCT_KEYS.has(key))
    : [];
  const intent = ["create_plan", "answer_question", "unclear"].includes(input.intent) ? input.intent : "unclear";
  const budget = Number(input.budget_usd || 0);
  const start = normaliseMonthCode(input.start_date);
  const end = normaliseMonthCode(input.end_date);
  const yearPeriod = Number.isFinite(Number(input.year)) ? { start: `${Number(input.year)}-01`, end: `${Number(input.year)}-12` } : null;
  const period = start && end && end >= start ? { start, end } : yearPeriod;
  const channelScope = CHANNEL_SCOPE_OPTIONS.some((option) => option.value === input.channel_scope)
    ? input.channel_scope
    : "all";
  const missingFields = new Set(Array.isArray(input.missing_fields) ? input.missing_fields : []);
  if (intent !== "answer_question" && (!Number.isFinite(budget) || budget <= 0)) {
    missingFields.add("budget_usd");
  }
  if (intent !== "answer_question" && !period) {
    missingFields.add("period");
  }
  return {
    intent: intent === "unclear" ? "create_plan" : intent,
    budgetUsd: Number.isFinite(budget) && budget > 0 ? budget : null,
    year: Number.isFinite(Number(input.year)) ? Number(input.year) : null,
    period,
    channelScope,
    states,
    productKeys,
    audience: String(input.audience || "").trim(),
    goal: String(input.goal || "").trim(),
    kpi: String(input.kpi || "").trim(),
    missingFields: [...missingFields],
    clarifyingQuestion: String(input.clarifying_question || "").trim(),
    notes: Array.isArray(input.notes) ? input.notes.map((note) => String(note)).filter(Boolean) : []
  };
}

function applyRequestDinksToYearExtraction(extraction, requestContext, text = "") {
  const dinks = Object.fromEntries((requestContext?.dinks || []).map((dink) => [dink.key, dink]));
  const next = {
    ...extraction,
    notes: [...(extraction.notes || [])],
    missingFields: [...(extraction.missingFields || [])]
  };
  if (!next.budgetUsd && Number(dinks.budget?.raw || 0) > 0) {
    next.budgetUsd = Number(dinks.budget.raw);
    next.notes.push("Budget came from the visible Budget control.");
  }
  const dinkPeriod = parsePeriodDink(dinks.period?.raw);
  const textPeriod = extractPeriodFromText(text);
  if (!next.period && (dinkPeriod || textPeriod)) {
    next.period = dinkPeriod || textPeriod;
    next.year = Number(String(next.period.start).slice(0, 4));
    next.notes.push(dinkPeriod ? "Planning period came from the visible Period control." : "Planning period came from the user's text.");
  }
  if (dinks.channels?.raw && dinks.channels.raw !== "all") {
    next.channelScope = dinks.channels.raw;
    next.notes.push("Channel scope came from the visible Channels control.");
  }
  if (!next.channelScope) {
    next.channelScope = inferChannelScopeFromText(text);
  }
  const scenarioUplift = String(text || "").match(/\b(\d+(?:\.\d+)?)\s*%\s+(?:more|increase|uplift)\s+(?:linear\s+)?tv\b/i);
  if (scenarioUplift && /\b(?:scenario|variant|alongside)\b/i.test(text)) {
    next.tvUpliftPct = Number(scenarioUplift[1]);
    next.channelScope = "all";
    next.notes.push(`Scenario modifier came from the user's words: +${next.tvUpliftPct}% Linear TV and CTV versus the baseline mix.`);
  }
  if (next.budgetUsd && next.period && /\b(?:plan|scenario|variant)\b/i.test(text)) {
    next.intent = "create_plan";
  }
  if (!next.period && next.budgetUsd && /\b(?:current|active|existing)\s+annual plan\b/i.test(text)) {
    const activePeriod = getPlanMeta()?.period;
    const activeMonths = (getPlan().monthly_allocations || []).map((row) => row.month).filter(Boolean).sort();
    next.period = activePeriod?.start && activePeriod?.end
      ? { start: activePeriod.start, end: activePeriod.end }
      : activeMonths.length ? { start: activeMonths[0], end: activeMonths[activeMonths.length - 1] } : null;
    if (next.period) {
      next.year = Number(String(next.period.start).slice(0, 4));
      next.intent = "create_plan";
      next.notes.push("Planning period was held from the active saved annual plan because the user explicitly requested a budget re-run of that plan.");
    }
  }
  const missing = new Set(next.missingFields);
  if (next.budgetUsd) missing.delete("budget_usd");
  if (next.period) missing.delete("period");
  next.missingFields = [...missing];
  return next;
}

function buildLocalYearExtraction(text) {
  const products = extractProducts(text).products;
  const states = extractStates(text, products[0] || app.selectedProduct).map((row) => row.state_code);
  const period = extractPeriodFromText(text);
  const budget = extractBudget(text);
  const channelScope = inferChannelScopeFromText(text);
  const intent = /\b(explain|show|why|what|how)\b/i.test(text) && !/\b(plan|build|create|allocate|budget)\b/i.test(text)
    ? "answer_question"
    : "create_plan";
  const missingFields = [];
  if (intent !== "answer_question" && !budget) missingFields.push("budget_usd");
  if (intent !== "answer_question" && !period) missingFields.push("period");
  return {
    intent,
    budgetUsd: budget || null,
    year: period ? Number(period.start.slice(0, 4)) : null,
    period,
    channelScope,
    states,
    productKeys: products,
    audience: "",
    goal: extractObjective(text),
    kpi: /\bcac\b/i.test(text) ? "All-in CAC" : /\bcpa\b/i.test(text) ? "CPA" : "",
    missingFields,
    clarifyingQuestion: "",
    notes: ["Local deterministic understudy extraction; use LLM extraction when available."]
  };
}

function inferChannelScopeFromText(text) {
  const clean = String(text || "").toLowerCase();
  if (/\b(search[-\s]?only|pure search|paid search[-\s]?only|sem[-\s]?only)\b/.test(clean)) return "search";
  if (/\b(pure ctv|ctv[-\s]?only|streaming[-\s]?only)\b/.test(clean)) return "ctv";
  if (/\b(tv only|video only|tv\/video|tv and video|linear tv|youtube)\b/.test(clean)) return "tv_video";
  if (/\b(social only|paid social only)\b/.test(clean)) return "social";
  return "all";
}

function buildYearStateChannelShape(extraction, sourceRows) {
  const requestedStates = [...new Set(extraction.states || [])];
  if (!requestedStates.length) return null;
  const productKey = extraction.productKeys?.[0] || app.selectedProduct;
  const scenario = getStateBudgetScenarioFor(productKey);
  const sourceChannels = new Set(sourceRows.filter((row) => row.buyable !== false).map((row) => row.channel));
  const matchedStates = (scenario?.states || []).filter((row) => requestedStates.includes(row.state_code) && Array.isArray(row.channel_split));
  if (!matchedStates.length) return null;
  const weightedShares = new Map();
  let totalStateWeight = 0;
  matchedStates.forEach((state) => {
    const stateWeight = Math.max(1, Number(state.budget_usd_equivalent || state.activation_weight || 1));
    totalStateWeight += stateWeight;
    state.channel_split.forEach((channel) => {
      if (!sourceChannels.has(channel.channel)) return;
      const share = Number(channel.budget_share_pct || 0);
      if (share <= 0) return;
      weightedShares.set(channel.channel, Number(weightedShares.get(channel.channel) || 0) + (share * stateWeight));
    });
  });
  const rawTotal = [...weightedShares.values()].reduce((sum, value) => sum + value, 0);
  if (!rawTotal || !totalStateWeight) return null;
  return {
    source_id: "fanduel_state_budget_model_2026",
    status: "synthetic-working state/channel reweight",
    requested_states: requestedStates,
    matched_states: matchedStates.map((state) => state.state_code),
    missing_states: requestedStates.filter((code) => !matchedStates.some((state) => state.state_code === code)),
    shares: new Map([...weightedShares.entries()].map(([channel, value]) => [channel, value / rawTotal]))
  };
}

function computeYearPlanFromExtraction(extraction) {
  if (!extraction.budgetUsd) {
    throw new Error("Cannot compute a Year plan without a user-provided budget.");
  }
  if (!extraction.period?.start || !extraction.period?.end) {
    throw new Error("Cannot compute a Year plan without a user-provided planning period.");
  }
  const activePlan = getPlan();
  const channelScope = getChannelScopeOption(extraction.channelScope || "all");
  const sourceRows = (activePlan.channel_totals || [])
    .filter((row) => Number(row.budget_gbp || 0) > 0 || Number(row.forecast_acquisitions || 0) > 0)
    .filter((row) => row.channel !== "RG Messaging Share")
    .filter((row) => channelScope.value === "all" || channelScope.match(row.channel));
  const safeSourceRows = sourceRows.length ? sourceRows : (activePlan.channel_totals || [])
    .filter((row) => Number(row.budget_gbp || 0) > 0 || Number(row.forecast_acquisitions || 0) > 0)
    .filter((row) => row.channel !== "RG Messaging Share");
  const paidSourceTotal = safeSourceRows
    .filter((row) => row.buyable !== false && Number(row.budget_gbp || 0) > 0)
    .reduce((sum, row) => sum + Number(row.budget_gbp || 0), 0) || 1;
  const scale = extraction.budgetUsd / paidSourceTotal;
  const stateMix = buildYearStateChannelShape(extraction, safeSourceRows);
  const baseBudgets = new Map(safeSourceRows.map((row) => {
    const buyable = row.buyable !== false && Number(row.budget_gbp || 0) > 0;
    const inheritedBudget = buyable ? Number(row.budget_gbp || 0) * scale : 0;
    const budget = stateMix && buyable
      ? extraction.budgetUsd * Number(stateMix.shares.get(row.channel) || 0)
      : inheritedBudget;
    return [row.channel, budget];
  }));
  const tvChannels = new Set(["Linear TV", "CTV"]);
  const tvUpliftPct = Math.max(0, Number(extraction.tvUpliftPct || 0));
  const tvBaseBudget = safeSourceRows
    .filter((row) => tvChannels.has(row.channel))
    .reduce((sum, row) => sum + Number(baseBudgets.get(row.channel) || 0), 0);
  const nonTvBaseBudget = extraction.budgetUsd - tvBaseBudget;
  const targetTvBudget = tvUpliftPct && tvBaseBudget > 0
    ? Math.min(extraction.budgetUsd * 0.95, tvBaseBudget * (1 + (tvUpliftPct / 100)))
    : tvBaseBudget;
  const tvScale = tvBaseBudget > 0 ? targetTvBudget / tvBaseBudget : 1;
  const nonTvScale = nonTvBaseBudget > 0 ? (extraction.budgetUsd - targetTvBudget) / nonTvBaseBudget : 1;
  const rows = safeSourceRows.map((row) => {
    const buyable = row.buyable !== false && Number(row.budget_gbp || 0) > 0;
    const baseBudget = Number(baseBudgets.get(row.channel) || 0);
    const budget = tvUpliftPct && buyable
      ? baseBudget * (tvChannels.has(row.channel) ? tvScale : nonTvScale)
      : baseBudget;
    const sourceCpa = Number(row.forecast_acquisitions || 0) > 0
      ? Number(row.budget_gbp || 0) / Number(row.forecast_acquisitions || 1)
      : 0;
    const ftds = buyable && sourceCpa > 0 ? budget / sourceCpa : 0;
    return {
      channel: row.channel,
      budget: round2(budget),
      share: extraction.budgetUsd > 0 ? (budget / extraction.budgetUsd) * 100 : 0,
      ftds: Math.round(ftds),
      cpa: buyable && ftds > 0 ? budget / ftds : 0,
      buyable
    };
  });
  const runningBudget = rows.reduce((sum, row) => sum + row.budget, 0);
  const lastBuyable = [...rows].reverse().find((row) => row.buyable);
  if (lastBuyable && Math.abs(runningBudget - extraction.budgetUsd) >= 0.01) {
    lastBuyable.budget = round2(lastBuyable.budget + (extraction.budgetUsd - runningBudget));
    lastBuyable.share = extraction.budgetUsd > 0 ? (lastBuyable.budget / extraction.budgetUsd) * 100 : 0;
    lastBuyable.cpa = lastBuyable.ftds > 0 ? lastBuyable.budget / lastBuyable.ftds : 0;
  }
  const totalFtds = rows.reduce((sum, row) => sum + row.ftds, 0);
  return {
    budget: round2(extraction.budgetUsd),
    ftds: totalFtds,
    cpa: totalFtds > 0 ? extraction.budgetUsd / totalFtds : 0,
    paidMediaCpa: activePlan.paid_media_cpa_gbp || activePlan.forecast_cpa_gbp,
    extraction,
    period: extraction.period,
    channelScope,
    rows,
    sourcePlanId: getPlanMeta()?.plan_id || activePlan.plan_id,
    sourcePlanLabel: getPlanMeta()?.label || activePlan.scenario?.label || "active annual plan",
    stateMix,
    scenarioModifier: tvUpliftPct ? {
      tv_uplift_pct: tvUpliftPct,
      channels: [...tvChannels],
      base_tv_budget_usd: round2(tvBaseBudget),
      scenario_tv_budget_usd: round2(targetTvBudget)
    } : null,
    scopeNote: stateMix
      ? `${formatPeriodLabel(extraction.period)}. Channel scope: ${channelScope.label}. Channel shares are reweighted for ${stateMix.matched_states.join(", ")} using the synthetic-working state budget model; this is a deterministic demo allocation, not observed state performance.${stateMix.missing_states.length ? ` No state-model row was available for ${stateMix.missing_states.join(", ")}.` : ""}`
      : `${formatPeriodLabel(extraction.period)}. Channel scope: ${channelScope.label}. Channel totals are scaled from the active annual baseline; no usable state/channel model was available for this request.`
  };
}

function extractYearScenarioLabel(text, period) {
  const value = String(text || "");
  const match = value.match(/\b(?:scenario|variant)\s+(?:called|named)\s+["']?([^"'\n.]{4,80})/i)
    || value.match(/\b(?:call|called|name|named)\s+(?:the\s+)?(?:scenario|variant)?\s*["']?([^"'\n.]{4,80})/i);
  const uplift = value.match(/\b(\d+(?:\.\d+)?)\s*%\s+(?:more|increase|uplift)\s+(?:linear\s+)?tv\b/i);
  return match?.[1]?.trim()
    || (uplift ? `${String(period?.start || "2027").slice(0, 4)} TV +${uplift[1]}% scenario` : `${String(period?.start || "2027").slice(0, 4)} Plan — working`);
}

function buildBrandResponsePlanLayers(rows, extraction, text) {
  if (!/\bbrand\b|\bawareness\b|\bdirect[-\s]?response\b|\bresponse\b/i.test(String(text || ""))) return null;
  const brandChannels = new Set(["Linear TV", "CTV", "YouTube", "Radio/Audio", "Influencer/Creator", "Display"]);
  const brandBudget = rows.filter((row) => brandChannels.has(row.channel)).reduce((sum, row) => sum + Number(row.budget || 0), 0);
  const total = rows.reduce((sum, row) => sum + Number(row.budget || 0), 0);
  const personaLabels = (app.data?.personas?.personas || []).filter((persona) => persona.product_governance?.[extraction.productKeys?.[0] || app.selectedProduct] === "allowed-working-source").slice(0, 2).map((persona) => persona.label);
  return {
    brand: { budget: round2(brandBudget), audience: personaLabels.length ? `Chosen segments: ${personaLabels.join("; ")}` : "Chosen priority segments" },
    response: { budget: round2(total - brandBudget), audience: "In-market users seeking the product" }
  };
}

function getChannelScopeOption(value = "all") {
  return CHANNEL_SCOPE_OPTIONS.find((option) => option.value === value) || CHANNEL_SCOPE_OPTIONS[0];
}

function findYearGovernanceConflict(extraction, requestContext = null) {
  const stateCodes = extraction.states || [];
  if (!stateCodes.length) return null;
  const products = extraction.productKeys?.length
    ? extraction.productKeys
    : requestContext?.productKey
      ? [requestContext.productKey]
      : [app.selectedProduct];
  const conflicts = [];
  products.forEach((productKey) => {
    stateCodes.forEach((stateCode) => {
      const row = app.data.governance.state_rows.find((item) => item.state_code === stateCode);
      if (!row) return;
      if (!isActivationSuppressed(getProductStatus(row, productKey))) return;
      const rule = getProductRule(row, productKey);
      conflicts.push({
        productKey,
        productLabel: productLabel(productKey),
        stateCode,
        stateName: row.state || stateCode,
        receipt: `${stateCode}:${rule?.source_id || "us_state_governance_working_research_2026_07_03"}`
      });
    });
  });
  if (!conflicts.length) return null;
  const productLabelText = [...new Set(conflicts.map((item) => item.productLabel))].join(", ");
  return {
    productLabel: productLabelText,
    stateNames: conflicts.map((item) => `${item.stateName} (${item.stateCode})`).join(", "),
    receipts: conflicts.map((item) => item.receipt),
    conflicts
  };
}

async function narrateYearPlanResult({ text, mode, dossier, extraction, planResult }) {
  try {
    const result = await postAnthropicMessages({
      system: [
        mode.custom_instructions || "",
        ...getCapabilitySystemLines(mode.key),
        "You narrate only after the deterministic engine has computed the plan.",
        "Do not calculate, alter, round differently or introduce any plan numbers beyond the engine_result JSON.",
        "Keep the answer CMO-friendly, concise and explicit that the figures are synthetic working estimates.",
        "Return prose only. Do not output a table, markdown table, bullet list or horizontal rule.",
        "Do not use emoji or decorative symbols.",
        planResult.stateMix
          ? "Describe the channel weights as deterministically reweighted by the synthetic-working state budget model for the matched requested states. Do not call this observed performance or a proven optimum."
          : "Describe channel weights as inherited from the active baseline shape. Do not claim channels are proven, causal or state/product-reweighted."
      ].join("\n"),
      messages: [
        {
          role: "user",
          content: [
            `User brief: ${text}`,
            `Extracted dinks: ${JSON.stringify(extraction)}`,
            `Grounding dossier: ${JSON.stringify(compactYearDossier(dossier))}`,
            `Engine result: ${JSON.stringify(summariseYearPlanResult(planResult))}`,
            "Write one short paragraph before the table. Mention the user-provided budget, the planning period, the channel scope, and the source of the channel shape."
          ].join("\n\n")
        }
      ],
      max_tokens: 700,
      temperature: 0.2
    });
    return cleanYearNarration(getAnthropicText(result)) || defaultYearNarration(planResult);
  } catch (error) {
    app.llmLastStatus = `Year narration fallback: ${error.message}`;
    return defaultYearNarration(planResult);
  }
}

function defaultYearNarration(planResult) {
  const shape = planResult.stateMix
    ? `the synthetic-working state/channel shape for ${planResult.stateMix.matched_states.join(", ")}`
    : `the ${planResult.channelScope.label.toLowerCase()} slice of the active T111 baseline channel shape`;
  return `The deterministic engine has built the ${formatPeriodLabel(planResult.period)} plan from the user-provided budget and ${shape}. Figures remain synthetic working estimates with governance and source receipts attached.`;
}

function buildYearAllocationRationale(planResult) {
  const shares = Object.fromEntries(planResult.rows.map((row) => [row.channel, row.share]));
  const linear = Number(shares["Linear TV"] || 0).toFixed(1);
  const ctv = Number(shares.CTV || 0).toFixed(1);
  const crm = Number(shares.CRM || 0).toFixed(1);
  const shapeReason = planResult.stateMix
    ? `The channel shares have been operationally reweighted for ${planResult.stateMix.matched_states.join(", ")} from the synthetic-working state budget model (${planResult.stateMix.source_id}) rather than merely displaying the state scope.`
    : "The channel shares retain the active baseline mix because no usable state/channel model was available for this request.";
  return `Allocation logic: this is a reach–response portfolio, not a claim of observed channel causality. ${shapeReason} Linear TV (${linear}%) and CTV (${ctv}%) retain broad reach and event-scale salience; paid search, affiliate and paid social capture declared or high-intent demand; CRM (${crm}%) activates known consented audiences efficiently. The trade-off remains reviewable against the T111 guardrails and the plan's FTD/CPA table. No client delivery, MMM or causal incrementality data is loaded, so these shares remain a synthetic working hypothesis rather than a proven optimum.`;
}

async function answerYearPlanQuestion({ text, mode, requestContext, dossier, extraction, conversation }) {
  const activePlan = getPlan();
  const activeEntry = getActivePlanEntry();
  const activeMonthCells = activeEntry ? buildMonthlySummaries(activePlan) : [];
  const lastPlan = conversation.lastComputedYearPlan || (activeEntry ? {
    source: "active saved plan store",
    source_plan_id: activeEntry.meta?.plan_id || activePlan.plan_id,
    source_plan_label: activeEntry.meta?.label || activePlan.scenario?.label,
    period: activeEntry.meta?.period || null,
    budget_usd: Number(activePlan.total_allocated_gbp || 0),
    forecast_ftd_proxy: Number(activePlan.forecast_acquisitions || 0),
    blended_media_cpa_usd: Number(activePlan.forecast_cpa_gbp || 0),
    channels: (activePlan.channel_totals || []).map((row) => ({
      channel: row.channel,
      budget_usd: Number(row.budget_gbp || 0),
      forecast_ftd_proxy: Number(row.forecast_acquisitions || 0)
    })),
    calendar_cells: activeMonthCells.map((row) => ({
      month: row.month,
      budget_usd: Number(row.budget || 0),
      calendar_weight: Number(row.weight || 0),
      event_note: row.event_note || ""
    }))
  } : null);
  if (!lastPlan) {
    return decorateChatAnswerWithMode({
      role: "assistant",
      title: "Plan context needed",
      body: "I do not have a Year plan in this thread yet, so I have not answered as if one exists. Send the annual brief first; I will ask for budget if it is missing.",
      chips: [
        { label: "no plan accepted yet", className: "status-review" },
        { label: `LLM: ${ANTHROPIC_CHAT_MODEL}`, className: "status-working" }
      ],
      createdAt: getDemoToday()
    }, mode, "yearLlmQuestion", requestContext);
  }
  const result = await postAnthropicMessages({
    system: [
      mode.custom_instructions || "",
      ...getCapabilitySystemLines(mode.key),
      "Answer questions about the last deterministic Year plan. Do not invent or change numbers.",
      "If the asked detail is not in the dossier or last plan summary, say what evidence is missing.",
      "Do not use emoji, decorative symbols or horizontal rules.",
      "When discussing month-level values after a newly created Year plan, use talk_state.selected_month because it is scaled to the latest Year chat plan."
    ].join("\n"),
    messages: [
      {
        role: "user",
        content: [
          `Question: ${text}`,
          `Extraction: ${JSON.stringify(extraction)}`,
          `Grounding dossier: ${JSON.stringify(compactYearDossier(dossier))}`,
          `Last Year plan: ${JSON.stringify(lastPlan)}`
        ].join("\n\n")
      }
    ],
    max_tokens: 900,
    temperature: 0.2
  });
  return decorateChatAnswerWithMode({
    role: "assistant",
    title: "Year plan answer",
    body: cleanLlmAnswerText(getAnthropicText(result)) || "I could not get a narrated answer from the model, so I have not added unsupported interpretation.",
    chips: [
      { label: `LLM: ${ANTHROPIC_CHAT_MODEL}`, className: "status-working" },
      { label: "last plan dossier", className: "status-working" },
      { label: "no new plan numbers", className: "status-working" }
    ],
    createdAt: getDemoToday()
  }, mode, "yearLlmQuestion", requestContext);
}

async function buildMonthLlmChatAnswer(text, requestContext = null) {
  const mode = planningChatModes().find((item) => item.key === "month") || currentChatMode();
  const conversation = ensureChatConversation("month");
  const dossier = buildLlmDossier(mode, text, requestContext, {
    title: "Month-mode intake",
    body: "No monthly revision is accepted until a target month is identified."
  });
  if (isStandaloneMonthPlanningRequest(text)) {
    return decorateChatAnswerWithMode({
      role: "assistant",
      title: "Standalone month not available",
      body: "Month mode can replan a month inside the active annual plan. It cannot create a standalone month-from-scratch plan yet, so I have not created a revision or changed any numbers. Create or save the annual plan first, then I can replan the selected month inside it.",
      chips: [
        { label: "capability guardrail", className: "status-review" },
        { label: "standalone month not built", className: "status-review" },
        { label: "no revision accepted", className: "status-missing" }
      ],
      createdAt: getDemoToday()
    }, mode, "monthCapabilityGuard", requestContext);
  }
  let extraction;
  try {
    extraction = extractExplicitMonthReplanBrief(text, requestContext)
      || await extractMonthReplanBrief({ text, mode, dossier, requestContext });
    if (!extraction.productKeys.length && requestContext?.productKey) {
      extraction.productKeys = [requestContext.productKey];
      extraction.notes = [...(extraction.notes || []), `Product came from UI selector: ${requestContext.productLabel || requestContext.productKey}`];
    }
  } catch (error) {
    app.llmLastStatus = `Month LLM unavailable: ${error.message}`;
    return decorateChatAnswerWithMode({
      role: "assistant",
      title: "Month chat is not connected",
      body: "The Claude proxy did not return a structured month brief, so I have not created a revision draft or changed the active plan. Check the local server and API key, then send the month request again.",
      chips: [
        { label: "LLM unavailable", className: "status-missing" },
        { label: "no revision accepted", className: "status-review" }
      ],
      createdAt: getDemoToday()
    }, mode, "monthLlmPlan", requestContext);
  }

  if (extraction.intent === "answer_question") {
    return answerMonthQuestion({ text, mode, requestContext, dossier, extraction, conversation });
  }

  if (!extraction.month) {
    return decorateChatAnswerWithMode({
      role: "assistant",
      title: "Month needed",
      body: extraction.clarifyingQuestion || "Which month should I replan inside the active year?",
      chips: [
        { label: `LLM: ${ANTHROPIC_CHAT_MODEL}`, className: "status-working" },
        { label: "structured month dinks", className: "status-working" },
        { label: "month missing", className: "status-review" },
        { label: "no revision accepted", className: "status-missing" }
      ],
      createdAt: getDemoToday()
    }, mode, "monthLlmPlan", requestContext);
  }

  app.selectedCalendarMonth = extraction.month;
  app.chatDinks.period = `${extraction.month}:${extraction.month}`;
  if (extraction.productKeys.length) {
    syncProductSelection(extraction.productKeys[0]);
  }
  const moves = mergeMonthReplanMoves(extraction, text);
  const draft = buildRevisionDraft(getPlan(), extraction.month, moves);
  app.revisionDraft = draft;
  conversation.lastMonthRevision = summariseMonthRevisionDraft(draft, extraction);
  app.llmLastStatus = `Month LLM structured extraction + deterministic revision: ${ANTHROPIC_CHAT_MODEL}`;
  const totalDelta = draft.selectedDiff.reduce((sum, row) => sum + row.delta_spend, 0);
  const incrementalLayerRows = draft.selectedDiff.filter((row) => Math.abs(Number(row.incremental_spend || 0)) >= 0.01);
  const stateShiftText = draft.moves.stateShift
    ? ` State direction is ${draft.moves.stateShift.from.state_code} → ${draft.moves.stateShift.to.state_code}: a proposed ${formatCurrency(draft.moves.stateShift.proposedMove)} moves from ${draft.moves.stateShift.from.state} to ${draft.moves.stateShift.to.state}, using the synthetic-working state allocation model and ${draft.moves.stateShift.from.value.value_index.toFixed(1)} → ${draft.moves.stateShift.to.value.value_index.toFixed(1)} working value indices. ${draft.moves.stateShift.caveat}`
    : "";
  const journeyText = draft.moves.journeyContext
    ? ` ${draft.moves.journeyContext.caveat} The replan uses ${draft.moves.journeyContext.personas.map((persona) => persona.label).join(", ")} as the planning proxy; their recommended handoffs (${draft.moves.journeyContext.channels.join(", ")}) receive a small, explicitly working reweight alongside the performance indices.`
    : "";
  const brandText = draft.moves.protectBrandLines
    ? " Brand lines remain protected at their active-plan levels; performance normalisation and any cuts are taken from the response channels."
    : "";
  return decorateChatAnswerWithMode({
    role: "assistant",
    title: `${formatMonth(extraction.month)} revision preview`,
    body: [
      `${formatMonth(extraction.month)} is a monthly replan draft based on the active plan; it is not active yet. The deterministic revision freezes ${formatNumber(draft.frozenMonths.length)} earlier months${draft.moves.useCurrentPerformance ? ", rebalances the selected month from synthetic delivery/sales indices" : ""}${draft.moves.budgetDeltaUsd ? `, then ${draft.moves.budgetDeltaUsd > 0 ? "layers" : "removes"} ${formatCurrency(Math.abs(draft.moves.budgetDeltaUsd))} as a separate explicit working-media move ranked by the current delivery × sales score` : ""}. ${draft.moves.budgetDeltaUsd ? "The annual envelope changes only by that explicit incremental layer; it is not silently absorbed by performance normalisation." : "The annual envelope remains reconciled."}${brandText}${stateShiftText}${journeyText} The visible combined delta across material ${formatMonth(extraction.month)} rows is ${totalDelta >= 0 ? "+" : ""}${formatCurrency(totalDelta)}. Review the diff, then explicitly choose Save v2 and activate before the active plan changes.`,
      ...(draft.moves.useCurrentPerformance ? ["", "Decision rule: raw spend factor = clamp(1 + 45% × (sales index − 1) + 18% × (delivery index − 1), 0.88, 1.14); the engine then normalises flexible channels back to the fixed monthly envelope. The Reason column shows why every displayed channel gains or loses."] : []),
      "",
      "| Channel | Old plan | New plan | Delta | Delivery index | Sales index | Reason |",
      "| --- | ---: | ---: | ---: | ---: | ---: | --- |",
      ...draft.selectedDiff.slice(0, 8).map((row) => `| ${escapeMarkdownCell(row.channel)} | ${formatCurrency(row.baseline_spend)} | ${formatCurrency(row.revised_spend)} | ${formatSignedCurrency(row.delta_spend)} | ${row.delivery_index.toFixed(2)} | ${row.sales_index.toFixed(2)} | ${escapeMarkdownCell(explainRevisionDelta(row))} |`)
      ,...(incrementalLayerRows.length ? ["", `| Incremental working-media layer (${formatSignedCurrency(draft.moves.budgetDeltaUsd)}) | Performance-only plan | Explicit layer | Combined new plan | Why this channel |`, "| --- | ---: | ---: | ---: | --- |", ...incrementalLayerRows.map((row) => `| ${escapeMarkdownCell(row.channel)} | ${formatCurrency(row.performance_revised_spend)} | ${formatSignedCurrency(row.incremental_spend)} | ${formatCurrency(row.revised_spend)} | Ranked by delivery × sales score ${Number(row.delivery_index * row.sales_index).toFixed(3)}; this layer is separate from the fixed-envelope performance rebalance. |`)] : [])
      ,...(draft.moves.stateShift ? ["", "| State direction | Modelled baseline | Proposed reallocation | Value index |", "| --- | ---: | ---: | ---: |", `| ${draft.moves.stateShift.from.state} | ${formatCurrency(draft.moves.stateShift.from.budget_usd_equivalent)} | -${formatCurrency(draft.moves.stateShift.proposedMove)} | ${draft.moves.stateShift.from.value.value_index.toFixed(1)} |`, `| ${draft.moves.stateShift.to.state} | ${formatCurrency(draft.moves.stateShift.to.budget_usd_equivalent)} | +${formatCurrency(draft.moves.stateShift.proposedMove)} | ${draft.moves.stateShift.to.value.value_index.toFixed(1)} |`, "Synthetic-working allocation model with working value-index receipts; reviewer approval required."] : [])
    ].join("\n"),
    chips: [
      { label: `LLM: ${ANTHROPIC_CHAT_MODEL}`, className: "status-working" },
      { label: "engine/revision.py", className: "status-working" },
      { label: "SYNTHETIC actuals", className: "status-synthetic" },
      ...(draft.moves.budgetDeltaUsd ? [{ label: `${draft.moves.budgetDeltaUsd > 0 ? "+" : ""}${formatCurrency(draft.moves.budgetDeltaUsd)} explicit envelope move`, className: "status-working" }] : []),
      { label: "diff visible", className: "status-working" }
    ],
    documentType: "plan_table",
    createdAt: getDemoToday()
  }, mode, "monthLlmPlan", requestContext);
}

function extractExplicitMonthReplanBrief(text, requestContext = null) {
  const clean = String(text || "").toLowerCase();
  if (!/\b(replan|revise|rebalance|adjust|refresh|update|rework|redo)\b/.test(clean)) return null;
  const monthPatterns = [
    /\bjan(?:uary)?\b/i, /\bfeb(?:ruary)?\b/i, /\bmar(?:ch)?\b/i, /\bapr(?:il)?\b/i,
    /(?:\bmay\b(?=\s+(?:20\d{2}|plan|replan|month|campaign|budget|spend|performance))|\b(?:replan|plan|month|campaign|for|in|during)\s+may\b)/i,
    /\bjun(?:e)?\b/i, /\bjul(?:y)?\b/i, /\baug(?:ust)?\b/i,
    /\bsep(?:tember)?\b/i, /\boct(?:ober)?\b/i, /\bnov(?:ember)?\b/i, /\bdec(?:ember)?\b/i
  ];
  const monthIndex = monthPatterns.findIndex((pattern) => pattern.test(clean));
  if (monthIndex < 0) return null;
  const yearMatch = clean.match(/\b(20\d{2})\b/);
  const year = yearMatch ? Number(yearMatch[1]) : Number((app.selectedCalendarMonth || "2026-09").slice(0, 4));
  const productKey = requestContext?.productKey && BASE_PRODUCT_KEYS.has(requestContext.productKey)
    ? requestContext.productKey
    : Object.keys(PRODUCT_TERMS).find((key) => PRODUCT_TERMS[key].test(clean)) || app.selectedProduct;
  return {
    intent: "create_revision",
    month: `${year}-${String(monthIndex + 1).padStart(2, "0")}`,
    productKeys: productKey ? [productKey] : [],
    reason: "Explicit month and replan verb parsed locally; LLM extraction is reserved for ambiguous month briefs.",
    budgetDeltaUsd: 0,
    useCurrentPerformance: /\b(current performance|performance|delivery|sales|rebalance|results)\b/.test(clean),
    missingFields: [],
    clarifyingQuestion: "",
    notes: ["deterministic explicit-month extraction"]
  };
}

function isStandaloneMonthPlanningRequest(text) {
  const value = String(text || "").toLowerCase();
  const standaloneIntent = /\b(standalone|from scratch|fresh|new)\b/.test(value);
  const monthIntent = /\b(month|monthly|january|february|march|april|may|june|july|august|september|october|november|december|q1|q2|q3|q4)\b/.test(value);
  const replanIntent = /\b(replan|revise|adjust|refresh|update|rework|redo|rebalance|performance|delivery|sales|inside|active year|existing year|frozen|freeze)\b|\bold[-\s]+(?:vs|versus)[-\s]+new\b/.test(value);
  return standaloneIntent && monthIntent && !replanIntent;
}

async function extractMonthReplanBrief({ text, mode, dossier, requestContext }) {
  const messages = [
    {
      role: "user",
      content: [
        "Extract the Month-mode replan fields from the user's words.",
        "Do not invent a target month. If absent, mark month missing and ask for it.",
        "If the user asks a monthly performance question rather than requesting a revision, set intent to answer_question.",
        requestContext?.productLabel ? `UI selected product: ${requestContext.productLabel}` : "",
        `Current selected month: ${app.selectedCalendarMonth}`,
        `User request: ${text}`,
        `Grounding dossier: ${JSON.stringify(compactYearDossier(dossier))}`
      ].filter(Boolean).join("\n\n")
    }
  ];
  const result = await postAnthropicMessages({
    system: [
      mode.custom_instructions || "",
      ...getCapabilitySystemLines(mode.key),
      "Country is fixed to the United States. Extract structured JSON via the provided tool only.",
      "Use YYYY-MM month codes. NFL kickoff usually means 2026-09, Super Bowl usually means 2026-02, March Madness usually means 2026-03."
    ].join("\n"),
    messages,
    tools: [MONTH_REPLAN_BRIEF_TOOL],
    tool_choice: { type: "tool", name: MONTH_REPLAN_BRIEF_TOOL.name },
    max_tokens: 1000,
    temperature: 0
  });
  const input = getAnthropicToolInput(result, MONTH_REPLAN_BRIEF_TOOL.name);
  if (!input) {
    throw new Error("structured extraction missing");
  }
  return normaliseMonthExtraction(input);
}

function normaliseMonthExtraction(input) {
  const month = normaliseMonthCode(input.month);
  const productKeys = Array.isArray(input.product_keys)
    ? input.product_keys.filter((key) => BASE_PRODUCT_KEYS.has(key))
    : [];
  const missingFields = new Set(Array.isArray(input.missing_fields) ? input.missing_fields : []);
  if (!month) missingFields.add("month");
  const intent = ["create_revision", "answer_question", "unclear"].includes(input.intent) ? input.intent : "unclear";
  return {
    intent: intent === "unclear" ? "create_revision" : intent,
    month,
    productKeys,
    reason: String(input.reason || "").trim(),
    budgetDeltaUsd: Number.isFinite(Number(input.budget_delta_usd)) ? Number(input.budget_delta_usd) : 0,
    useCurrentPerformance: input.use_current_performance === true,
    missingFields: [...missingFields],
    clarifyingQuestion: String(input.clarifying_question || "").trim(),
    notes: Array.isArray(input.notes) ? input.notes.map((note) => String(note)).filter(Boolean) : []
  };
}

function mergeMonthReplanMoves(extraction, text) {
  const clean = String(text || "").toLowerCase();
  const match = clean.match(/(?:\$\s*)?(\d+(?:\.\d+)?)\s*(m|million|k|thousand)\b/);
  const wordMillion = /\b(?:another|one)\s+million(?:\s+dollars?)?\b/.test(clean);
  const amount = match ? Number(match[1]) * (/m|million/.test(match[2]) ? 1000000 : 1000) : wordMillion ? 1000000 : 0;
  const isReduction = /\b(less|reduce|cut|remove|pull back|decrease)\b/.test(clean);
  const explicitMove = /\b(extra|additional|another|add|adding|increase|more|layer|less|reduce|cut|remove|pull back|decrease)\b/.test(clean) && amount;
  const stateShift = extractDirectionalStateShift(clean);
  return {
    budgetDeltaUsd: explicitMove ? (isReduction ? -amount : amount) : Number(extraction.budgetDeltaUsd || 0),
    useCurrentPerformance: extraction.useCurrentPerformance || /\b(current performance|performance|delivery|sales|rebalance|results)\b/.test(clean),
    protectBrandLines: /\b(protect|hold|keep|preserve|do not cut)\b.{0,64}\bbrand\b|\bbrand\b.{0,48}\b(protect|hold|keep|preserve|do not cut)\b/.test(clean),
    stateShift,
    journeyInformed: /\bjourney|journeys|underfed|persona handoff\b/.test(clean)
  };
}

const MONTH_REPLAN_BRAND_CHANNELS = new Set(["Linear TV", "CTV", "YouTube", "Radio/Audio", "Influencer/Creator", "Display"]);

function extractDirectionalStateShift(clean) {
  const states = getStateRows();
  const stateReferencePattern = (row) => row.state_code === "IN"
    ? `(?:${row.state.toLowerCase().replace(/\\s+/g, "\\s+")})`
    : `(?:${row.state_code.toLowerCase()}|${row.state.toLowerCase().replace(/\\s+/g, "\\s+")})`;
  const mentioned = states.filter((row) => new RegExp(`\\b${stateReferencePattern(row)}\\b`, "i").test(clean));
  if (mentioned.length < 2) return null;
  const namePattern = (row) => row.state_code === "IN"
    ? `(?:${row.state.replace(/\\s+/g, "\\s+")})`
    : `(?:${row.state_code}|${row.state.replace(/\\s+/g, "\\s+")})`;
  const markedSource = mentioned.find((row) => new RegExp(`\\b(?:pull\\s+back|reduce|cut|remove|decrease)(?:\\s+(?:in|from))?\\s+${namePattern(row)}\\b`, "i").test(clean));
  const markedDestination = mentioned.find((row) => new RegExp(`\\b(?:push|increase|add|grow|invest)(?:\\s+(?:in|to))?\\s+${namePattern(row)}\\b`, "i").test(clean));
  if (markedSource && markedDestination && markedSource.state_code !== markedDestination.state_code) {
    return { from: markedSource.state_code, to: markedDestination.state_code };
  }
  for (const from of mentioned) {
    for (const to of mentioned) {
      if (from.state_code === to.state_code) continue;
      if (new RegExp(`(?:from|out of)\\s+${namePattern(from)}.{0,48}(?:to|into)\\s+${namePattern(to)}`, "i").test(clean)) {
        return { from: from.state_code, to: to.state_code };
      }
    }
  }
  const source = mentioned.find((row) => new RegExp(`(?:pull back|reduce|cut|remove|decrease).{0,32}\\b(?:${row.state_code}|${row.state.replace(/\\s+/g, "\\s+")})\\b|\\b(?:${row.state_code}|${row.state.replace(/\\s+/g, "\\s+")})\\b.{0,32}(?:pull back|reduce|cut|remove|decrease)`, "i").test(clean));
  const destination = mentioned.find((row) => new RegExp(`(?:push|increase|add|grow|invest).{0,32}\\b(?:${row.state_code}|${row.state.replace(/\\s+/g, "\\s+")})\\b|\\b(?:${row.state_code}|${row.state.replace(/\\s+/g, "\\s+")})\\b.{0,32}(?:push|increase|add|grow|invest)`, "i").test(clean));
  return source && destination && source.state_code !== destination.state_code
    ? { from: source.state_code, to: destination.state_code }
    : null;
}

function getMonthReplanJourneyContext(productKey) {
  const personas = (app.data?.personas?.personas || [])
    .filter((persona) => persona.product_governance?.[productKey] === "allowed-working-source")
    .slice(0, 3);
  const channels = [...new Set(personas.flatMap((persona) => persona.recommended_demo_channels || []))];
  return {
    personas,
    channels,
    sourceIds: ["predict_persona_seeds_working"],
    caveat: "Working persona journey proxy only; no observed journey performance is loaded."
  };
}

function buildMonthStateShift(fromCode, toCode, productKey) {
  const scenario = getStateBudgetScenarioFor(productKey);
  const rows = scenario?.states || [];
  const governanceRows = getStateRows();
  const from = rows.find((row) => row.state_code === fromCode) || governanceRows.find((row) => row.state_code === fromCode);
  const to = rows.find((row) => row.state_code === toCode) || governanceRows.find((row) => row.state_code === toCode);
  const fromValue = getStateValueRow(fromCode) || { value_index: 100, source_id: "state_value_index_neutral_fallback" };
  const toValue = getStateValueRow(toCode) || { value_index: 100, source_id: "state_value_index_neutral_fallback" };
  if (!from || !to) return null;
  const sourceBaseline = Number(from.budget_usd_equivalent || 0);
  const moveShare = 0.1;
  const proposedMove = Math.min(sourceBaseline * moveShare, sourceBaseline);
  const valueRatio = Number(fromValue.value_index) > 0
    ? Number(toValue.value_index) / Number(fromValue.value_index)
    : null;
  return {
    from: { ...from, value: fromValue },
    to: { ...to, value: toValue },
    proposedMove: round2(proposedMove),
    sourceIds: ["fanduel_state_budget_model_2026", fromValue.source_id, toValue.source_id],
    caveat: `Synthetic-working state allocation move: ${formatNumber(moveShare * 100)}% of the source state's modelled monthly equivalent, proposed for approval; not Admiral delivery data. ${to.state}'s working value index is ${valueRatio ? `${valueRatio.toFixed(1)}×` : "not comparable to"} ${from.state}'s, so the move follows the higher post-tax-value proxy rather than a market-size claim. The ${formatNumber((1 - moveShare) * 100)}% retained in ${from.state} is a deliberate guardrail until observed delivery validates the proxy.`
  };
}

function summariseMonthRevisionDraft(draft, extraction) {
  return {
    month: draft.month,
    reason: extraction.reason,
    decision_rule: "spend_factor=clamp(1+(sales_index-1)*0.45+(delivery_index-1)*0.18,0.88,1.14); flexible channels are normalised to the monthly envelope",
    frozen_months: draft.frozenMonths,
    selected_delta_spend_usd: round2(draft.selectedDiff.reduce((sum, row) => sum + row.delta_spend, 0)),
    source_ids: draft.source_ids,
    rows: draft.selectedDiff.map((row) => ({
      channel: row.channel,
      old_spend_usd: row.baseline_spend,
      new_spend_usd: row.revised_spend,
      delta_spend_usd: row.delta_spend,
      delivery_index: row.delivery_index,
      sales_index: row.sales_index,
      spend_factor: row.spend_factor,
      decision_reason: explainRevisionDelta(row)
    }))
  };
}

async function answerMonthQuestion({ text, mode, requestContext, dossier, extraction, conversation }) {
  const monthRows = (app.data.actualsMonthly?.rows || []).filter((row) => row.month === (extraction.month || app.selectedCalendarMonth));
  const compactMonth = {
    selected_month: extraction.month || app.selectedCalendarMonth,
    actual_rows: monthRows.slice(0, 12).map((row) => ({
      channel: row.channel,
      planned_spend: row.planned_spend,
      actual_spend: row.actual_spend,
      planned_conversions: row.planned_conversions,
      actual_conversions: row.conversions
    })),
    last_revision: conversation.lastMonthRevision || null
  };
  const result = await postAnthropicMessages({
    system: [
      mode.custom_instructions || "",
      ...getCapabilitySystemLines(mode.key),
      "Answer monthly replan questions using only the dossier, synthetic actual rows and last revision summary.",
      "Do not create or accept a revision unless the user asks to replan a specific month.",
      "Do not use emoji, decorative symbols or horizontal rules."
    ].join("\n"),
    messages: [
      {
        role: "user",
        content: [
          `Question: ${text}`,
          `Extraction: ${JSON.stringify(extraction)}`,
          `Grounding dossier: ${JSON.stringify(compactYearDossier(dossier))}`,
          `Month facts: ${JSON.stringify(compactMonth)}`
        ].join("\n\n")
      }
    ],
    max_tokens: 900,
    temperature: 0.2
  });
  return decorateChatAnswerWithMode({
    role: "assistant",
    title: "Monthly replan answer",
    body: cleanLlmAnswerText(getAnthropicText(result)) || "I could not get a narrated month answer from the model, so I have not added unsupported interpretation.",
    chips: [
      { label: `LLM: ${ANTHROPIC_CHAT_MODEL}`, className: "status-working" },
      { label: "SYNTHETIC actuals", className: "status-synthetic" },
      { label: "no revision accepted", className: "status-working" }
    ],
    createdAt: getDemoToday()
  }, mode, "monthLlmQuestion", requestContext);
}

function holdExplicitLaunchFields(text, requestContext = null, explicitProductKey = "") {
  const parsed = interpretPlanningDocument(text, "launch conversation") || {};
  const explicitProducts = explicitProductKey ? [explicitProductKey] : extractProducts(text).products;
  const explicitBudget = extractBudget(text);
  const explicitMonths = extractMonths(text);
  const held = mergeOneOffDraft({
    products: explicitProducts,
    excludedProducts: parsed.excludedProducts || [],
    months: explicitMonths,
    states: parsed.states || [],
    budget: explicitBudget,
    objective: parsed.objective || "",
    periodType: explicitMonths.length > 1 ? "multi-month" : explicitMonths.length === 1 ? "month" : parsed.periodType || "year"
  });
  const productKey = explicitProducts[0] || held.products?.[0] || requestContext?.productKey || app.selectedProduct;
  if (productKey) {
    app.oneOffProduct = productKey;
    syncProductSelection(productKey);
  }
  if (held.budget) app.chatDinks.budget = Number(held.budget);
  if (held.months?.length) {
    const ordered = [...held.months].sort();
    app.chatDinks.period = `${ordered[0]}:${ordered[ordered.length - 1]}`;
  }
  return { held, productKey };
}

function extractCustomLaunchProductName(text) {
  const value = String(text || "").trim();
  const called = value.match(/\b(?:new product|product)\s+(?:called|named)\s+["']?([^"'.,\n]{2,60})/i)?.[1];
  const launched = value.match(/\b(?:launch|introduce)\s+(.{2,60}?)(?=\s+(?:in|for|with|as|from|across|during)\b|[,.]|$)/i)?.[1];
  const candidate = String(called || launched || "")
    .replace(/^\s*(?:a|an|the)\s+/i, "")
    .replace(/\s+(?:as\s+)?a\s+new\s+product\s*$/i, "")
    .trim();
  if (!candidate || /^(?:new product|product|launch plan)$/i.test(candidate)) return "";
  if (extractProducts(candidate).products.length) return "";
  return candidate;
}

function buildPredictsAsymmetryAnswer(mode, requestContext = null) {
  const candidates = getStateRows().filter((row) => (
    productPlanningBucket(row, "predicts").bucket === "live"
    && productPlanningBucket(row, "sportsbook").bucket !== "live"
  ));
  const rows = candidates.slice(0, 20).map((row) => `| ${escapeMarkdownCell(row.state)} | ${escapeMarkdownCell(productPlanningBucket(row, "predicts").label)} | ${escapeMarkdownCell(productPlanningBucket(row, "sportsbook").label)} |`);
  const body = candidates.length
    ? [
      `The working governance source identifies ${formatNumber(candidates.length)} state${candidates.length === 1 ? "" : "s"} where Predicts is marked available/review while online Sportsbook is not marked live. That is a genuine product-distribution asymmetry to investigate, but it is not launch permission: each state still needs current legal, platform and product review before activation. No budget is needed to answer this scope question, and no launch plan has been accepted.`,
      "",
      "| State | Predicts working posture | Sportsbook working posture |",
      "| --- | --- | --- |",
      ...rows,
      ...(candidates.length > rows.length ? [`| … | ${formatNumber(candidates.length - rows.length)} additional working candidates | Review in Regulation |`] : []),
      "",
      "Strategic opportunity: use Predicts as a separately governed acquisition and engagement proposition where the working source shows a broader footprint, then measure whether it creates qualified demand without implying a Sportsbook route or cross-product legal permission."
    ].join("\n")
    : "The current working governance source does not identify a state where Predicts is available while online Sportsbook is not live. I will not invent an asymmetry; the next step is a dated regulator/product-source review.";
  return decorateChatAnswerWithMode({
    role: "assistant",
    title: "Predicts governance asymmetry",
    body,
    chips: [
      { label: "working governance source", className: "status-working" },
      { label: "not activation permission", className: "status-review" },
      { label: "no launch accepted", className: "status-missing" }
    ],
    createdAt: getDemoToday()
  }, mode, "launchGovernanceAnswer", {
    ...requestContext,
    productKey: "predicts",
    productLabel: productLabel("predicts")
  });
}

async function buildLaunchLlmChatAnswer(text, requestContext = null) {
  const mode = planningChatModes().find((item) => item.key === "launch") || currentChatMode();
  const clean = String(text || "").toLowerCase();
  if (/\bpredicts\b/.test(clean) && /\bsportsbook\b/.test(clean) && /\b(?:not live|isn't live|is not live|without sportsbook|strategic opportunity|governance)\b/.test(clean)) {
    return buildPredictsAsymmetryAnswer(mode, requestContext);
  }
  const requestsPathQuestion = /\b(?:ask|clarify|confirm|check)\s+(?:me\s+)?(?:whether|if)\b/.test(clean)
    || /\bask\s+(?:whether|if)\s+(?:this|it)\s+is\b/.test(clean);
  const layeredPath = /\b(layered|existing activity|additional money|on top of|incremental)\b/.test(clean)
    && !/\bnot\s+(?:a\s+)?(?:layered|incremental)\b/.test(clean);
  const newProductPath = /\b(new product|brand new|from scratch)\b/.test(clean)
    && !/\bnot\s+(?:a\s+)?new product\b/.test(clean);
  const path = requestsPathQuestion ? ""
    : layeredPath ? "layered"
      : newProductPath ? "new_product" : "";
  const customName = path === "new_product" && !extractProducts(text).products.length
    ? extractCustomLaunchProductName(text)
    : "";
  const customRegistration = customName ? registerCustomProduct(customName) : null;
  const launchFields = holdExplicitLaunchFields(text, requestContext, customRegistration?.item?.key || "");
  if (!path) {
    const heldLabels = [
      launchFields.held.products?.length ? launchFields.held.products.map(productLabel).join(", ") : "",
      launchFields.held.months?.length ? launchFields.held.months.map(formatMonth).join(", ") : "",
      launchFields.held.budget ? formatCurrency(launchFields.held.budget) : ""
    ].filter(Boolean).join("; ");
    return decorateChatAnswerWithMode({ role: "assistant", title: "Launch path needed", body: `Is this a new product launch, or additional working-media money layered around existing activity?${heldLabels ? ` I have already held ${heldLabels}; I will not ask for those fields again.` : ""}\n\nThe choice is load-bearing: a new product uses a standalone baseline plus not-listed governance defaults until product/state evidence is verified; a layered launch measures an explicit increment against the active plan and applies diminishing-return checks. I have not generated or activated a plan until you choose the path, and I will not treat launch as a monthly-replan variant.`, chips: [{ label: "launch gate", className: "status-review" }, { label: "no launch accepted", className: "status-missing" }], createdAt: getDemoToday() }, mode, "launchGate", { ...requestContext, productKey: launchFields.productKey, productLabel: productLabel(launchFields.productKey) });
  }
  if (path === "new_product" && /\b(new product|brand new)\b/.test(clean) && !launchFields.held.products?.length) {
    return decorateChatAnswerWithMode({ role: "assistant", title: "New product needed", body: "Name the new product first. I will add it with not-listed governance defaults, then build the standalone launch plan without implying it is live anywhere.", chips: [{ label: "new-product path", className: "status-review" }], createdAt: getDemoToday() }, mode, "launchGate", requestContext);
  }
  app.oneOffIncrementalityBasis = path === "layered" ? "incremental" : "standalone";
  app.oneOffDraft = { ...(app.oneOffDraft || {}), launchPath: path };
  const launchContext = { ...requestContext, productKey: launchFields.productKey, productLabel: productLabel(launchFields.productKey) };
  const result = await buildOneOffLlmChatAnswer(text, launchContext, mode);
  const title = result.title === "One-off gate passed"
    ? `${path === "layered" ? "Layered" : "New-product"} launch plan`
    : result.title === "One-off refused by governance"
      ? `${path === "layered" ? "Layered" : "New-product"} launch held by governance`
      : result.title;
  return { ...result, title, body: `${path === "layered" ? "Layered launch: incremental activity is calculated against the existing plan. " : "New-product launch: standalone governance defaults apply until a verified product/state source is loaded. "}${result.body || ""}` };
}

async function buildOneOffLlmChatAnswer(text, requestContext = null, modeOverride = null) {
  const mode = modeOverride || planningChatModes().find((item) => item.key === "oneoff") || currentChatMode();
  const conversation = ensureChatConversation(mode.key);
  const dossier = buildLlmDossier(mode, text, requestContext, {
    title: "One-off intake",
    body: "No one-off campaign has been accepted until budget and incrementality are explicit."
  });
  let extraction;
  try {
    extraction = await extractOneOffCampaignBrief({ text, mode, dossier, draft: app.oneOffDraft, requestContext });
    const explicitProducts = extractProducts(text).products;
    const explicitBudget = extractBudget(text);
    const explicitMonths = extractMonths(text);
    if (explicitProducts.length) {
      extraction.productKeys = explicitProducts;
      extraction.notes = [...(extraction.notes || []), "Explicit product words overrode the UI default."];
    }
    if (explicitBudget) {
      extraction.budgetUsd = explicitBudget;
      extraction.missingFields = extraction.missingFields.filter((field) => field !== "budget_usd");
      extraction.notes = [...(extraction.notes || []), "Explicit budget was held from the user's words."];
    }
    if (explicitMonths.length) {
      extraction.months = explicitMonths;
      extraction.notes = [...(extraction.notes || []), "Explicit timing was held from the user's words."];
    }
    const localBasis = inferOneOffIncrementalityBasis(text);
    if (!extraction.incrementalityBasis && localBasis) {
      extraction.incrementalityBasis = localBasis;
      extraction.missingFields = extraction.missingFields.filter((field) => field !== "incrementality_basis");
      extraction.notes = [...(extraction.notes || []), `Incrementality basis came from phrase guard: ${localBasis}`];
    }
    if (!extraction.productKeys.length && requestContext?.productKey) {
      extraction.productKeys = [requestContext.productKey];
      extraction.notes = [...(extraction.notes || []), `Product came from UI selector: ${requestContext.productLabel || requestContext.productKey}`];
    }
  } catch (error) {
    app.llmLastStatus = `One-off LLM unavailable: ${error.message}`;
    return decorateChatAnswerWithMode({
      role: "assistant",
      title: "One-off chat is not connected",
      body: "The Claude proxy did not return a structured campaign brief, so I have not accepted a one-off plan or changed any campaign numbers. Check the local server and API key, then send the brief again.",
      chips: [
        { label: "LLM unavailable", className: "status-missing" },
        { label: "no campaign accepted", className: "status-review" }
      ],
      createdAt: getDemoToday()
    }, mode, "oneOffLlmPlan", requestContext);
  }

  if (extraction.intent === "answer_question") {
    return answerOneOffQuestion({ text, mode, requestContext, dossier, extraction, conversation });
  }

  const parsed = oneOffExtractionToParsed(extraction);
  const draft = mergeOneOffDraft(parsed);
  if (draft.months?.length) {
    const orderedMonths = [...draft.months].sort();
    app.chatDinks.period = `${orderedMonths[0]}:${orderedMonths[orderedMonths.length - 1]}`;
  }
  if (extraction.productKeys.length) {
    app.oneOffProduct = extraction.productKeys[0];
    syncProductSelection(extraction.productKeys[0]);
  }
  if (extraction.incrementalityBasis) {
    app.oneOffIncrementalityBasis = extraction.incrementalityBasis;
  }

  const blockingOneOffFields = new Set(["budget_usd", "incrementality_basis", "incrementality basis"]);
  const missingFields = new Set((extraction.missingFields || []).filter((field) => blockingOneOffFields.has(field)));
  if (draft.budget) missingFields.delete("budget_usd");
  if (app.oneOffIncrementalityBasis) {
    missingFields.delete("incrementality_basis");
    missingFields.delete("incrementality basis");
  }
  if (!draft.budget) missingFields.add("budget_usd");
  if (!app.oneOffIncrementalityBasis) missingFields.add("incrementality_basis");

  if (missingFields.size) {
    const question = extraction.clarifyingQuestion
      || (missingFields.has("budget_usd")
        ? "What one-off budget should I plan against?"
        : "Should this be incremental on existing activity, or standalone?");
    app.llmLastStatus = `One-off LLM structured extraction: ${ANTHROPIC_CHAT_MODEL}`;
    return decorateChatAnswerWithMode({
      role: "assistant",
      title: "One-off detail needed",
      body: [
        question,
        "",
        `I have held the draft context as ${draft.products?.length ? draft.products.map(productLabel).join(", ") : productLabel(app.oneOffProduct || app.selectedProduct)}${draft.months?.length ? ` in ${draft.months.map(formatMonth).join(", ")}` : ""}. No campaign has been accepted yet.`
      ].join("\n"),
      chips: [
        { label: `LLM: ${ANTHROPIC_CHAT_MODEL}`, className: "status-working" },
        { label: "structured campaign dinks", className: "status-working" },
        { label: [...missingFields].join(", "), className: "status-review" },
        { label: "no campaign accepted", className: "status-missing" }
      ],
      createdAt: getDemoToday()
    }, mode, "oneOffLlmPlan", requestContext);
  }

  const planDoc = buildOneOffPlan(draft);
  const basisLabel = app.oneOffIncrementalityBasis === "incremental" ? "Incremental on existing activity" : "Standalone";
  const hasGuardrails = planDoc.governance !== "clear in working source";
  const narration = defaultOneOffNarration(planDoc, basisLabel);
  conversation.lastOneOffDraft = summariseOneOffPlanResult(planDoc, extraction, basisLabel);
  app.llmLastStatus = `One-off LLM structured extraction + deterministic narration: ${ANTHROPIC_CHAT_MODEL}`;
  const scopeLabel = planDoc.scopeLabel || planDoc.states.map((row) => row.state_code).join(", ") || "product-live states";
  const requestedSave = explicitCampaignSaveIntent(text);
  const campaign = !hasGuardrails && requestedSave ? saveCampaignPlanDoc(planDoc, draft) : null;
  return decorateChatAnswerWithMode({
    role: "assistant",
    title: hasGuardrails ? "One-off refused by governance" : campaign ? "Campaign created and saved" : "One-off gate passed",
    body: [
      narration,
      "",
      "| Field | Value |",
      "| --- | --- |",
      `| Budget | ${formatCurrency(planDoc.budget)} |`,
      `| Product | ${escapeMarkdownCell(productLabel(draft.products?.[0] || app.oneOffProduct || app.selectedProduct))} |`,
      `| Basis | ${escapeMarkdownCell(basisLabel)} |`,
      `| Timing | ${escapeMarkdownCell(draft.months?.length ? draft.months.map(formatMonth).join(", ") : "Annual baseline")} |`,
      `| Scope | ${escapeMarkdownCell(scopeLabel)} |`,
      `| Governance | ${escapeMarkdownCell(planDoc.governance)} |`,
      "",
      "| Channel | Budget | Share | FTD proxy | Media CPA |",
      "| --- | ---: | ---: | ---: | ---: |",
      ...planDoc.channelAllocations.map((row) => `| ${escapeMarkdownCell(row.channel)} | ${formatCurrency(row.budget_usd)} | ${row.share_pct.toFixed(1)}% | ${formatNumber(row.ftd_proxy)} | ${formatMoney(row.cpa_usd, 2)} |`),
      ...planDoc.excludedChannels.map((row) => `| ${escapeMarkdownCell(row.channel)} | Excluded | Excluded | — | ${escapeMarkdownCell(row.reason)} |`),
      `| **Total** | **${formatCurrency(planDoc.budget)}** | **100.0%** | **${formatNumber(planDoc.forecastFtd)}** | **${formatMoney(planDoc.blendedCpa, 2)}** |`,
      "",
      "| Plan Layer | Note |",
      "| --- | --- |",
      ...planDoc.layers.map((layer) => `| ${escapeMarkdownCell(layer.label)} | ${escapeMarkdownCell(layer.body)} |`)
    ].join("\n"),
    chips: [
      { label: `LLM: ${ANTHROPIC_CHAT_MODEL}`, className: "status-working" },
      { label: `basis: ${basisLabel}`, className: "status-working" },
      { label: hasGuardrails ? planDoc.governance : "governance checked", className: hasGuardrails ? "status-review" : "status-working" },
      { label: "deterministic campaign numbers", className: "status-working" },
      ...(campaign ? [{ label: `saved ${campaign.id}`, className: "status-working" }] : []),
      { label: "SYNTHETIC economics", className: "status-synthetic" }
    ],
    actions: hasGuardrails || campaign ? [] : [{ key: "save-oneoff", label: "Save campaign" }],
    documentType: "plan_table",
    createdAt: getDemoToday()
  }, mode, "oneOffLlmPlan", requestContext);
}

function explicitCampaignSaveIntent(text) {
  return /\b(save|create|book|launch)\b[^.\n]{0,32}\b(campaign|it|plan)\b|\bcampaign please\b|\bgo ahead\b/i.test(String(text || ""));
}

async function extractOneOffCampaignBrief({ text, mode, dossier, draft, requestContext }) {
  const messages = [
    {
      role: "user",
      content: [
        "Extract the One-off campaign dinks from the user's words.",
        "Never invent a budget or incrementality basis. If either is missing, mark it missing and ask one concise question.",
        "Use product/state/timing only when stated or strongly implied. NFL kickoff usually means September; Super Bowl usually means February; March Madness usually means March.",
        draft ? `Existing one-off draft: ${JSON.stringify(draft)}` : "",
        requestContext?.productLabel ? `UI selected product: ${requestContext.productLabel}` : "",
        `User brief: ${text}`,
        `Grounding dossier: ${JSON.stringify(compactYearDossier(dossier))}`
      ].filter(Boolean).join("\n\n")
    }
  ];
  const result = await postAnthropicMessages({
    system: [
      mode.custom_instructions || "",
      ...getCapabilitySystemLines(mode.key),
      "Country is fixed to the United States. Extract structured JSON via the provided tool only.",
      "A one-off campaign cannot be accepted without budget_usd and incrementality_basis.",
      "Use state_codes only for states explicitly requested. National/product-live scope is represented by an empty state_codes array."
    ].join("\n"),
    messages,
    tools: [ONE_OFF_BRIEF_TOOL],
    tool_choice: { type: "tool", name: ONE_OFF_BRIEF_TOOL.name },
    max_tokens: 1200,
    temperature: 0
  });
  const input = getAnthropicToolInput(result, ONE_OFF_BRIEF_TOOL.name);
  if (!input) {
    throw new Error("structured extraction missing");
  }
  return normaliseOneOffExtraction(input);
}

function normaliseOneOffExtraction(input) {
  const validStates = new Set(getStateRows().map((row) => row.state_code));
  const stateCodes = Array.isArray(input.state_codes)
    ? input.state_codes.map((code) => String(code || "").trim().toUpperCase()).filter((code) => validStates.has(code))
    : [];
  const productKeys = Array.isArray(input.product_keys)
    ? input.product_keys.filter((key) => BASE_PRODUCT_KEYS.has(key))
    : [];
  const budget = Number(input.budget_usd || 0);
  const basis = input.incrementality_basis === "incremental" || input.incrementality_basis === "standalone"
    ? input.incrementality_basis
    : "";
  const missingFields = new Set(Array.isArray(input.missing_fields) ? input.missing_fields : []);
  if (!Number.isFinite(budget) || budget <= 0) missingFields.add("budget_usd");
  if (!basis) missingFields.add("incrementality_basis");
  const intent = ["create_campaign", "answer_question", "unclear"].includes(input.intent) ? input.intent : "unclear";
  return {
    intent: intent === "unclear" ? "create_campaign" : intent,
    budgetUsd: Number.isFinite(budget) && budget > 0 ? budget : null,
    productKeys,
    stateCodes,
    months: normaliseMonthList(input.months),
    objective: String(input.objective || "").trim(),
    incrementalityBasis: basis,
    missingFields: [...missingFields],
    clarifyingQuestion: String(input.clarifying_question || "").trim(),
    notes: Array.isArray(input.notes) ? input.notes.map((note) => String(note)).filter(Boolean) : []
  };
}

function normaliseMonthList(months) {
  if (!Array.isArray(months)) return [];
  const monthCodes = months
    .map((value) => normaliseMonthCode(value))
    .filter(Boolean);
  return [...new Set(monthCodes)].sort();
}

function normaliseMonthCode(value) {
  const raw = String(value || "").trim();
  const iso = raw.match(/\b(20\d{2})-(0[1-9]|1[0-2])\b/);
  if (iso) return `${iso[1]}-${iso[2]}`;
  const year = raw.match(/\b(20\d{2})\b/)?.[1] || "2026";
  const monthNumber = monthNumberFromText(raw);
  return monthNumber ? `${year}-${String(monthNumber).padStart(2, "0")}` : "";
}

function oneOffExtractionToParsed(extraction) {
  const states = extraction.stateCodes
    .map((code) => app.data.governance.state_rows.find((row) => row.state_code === code))
    .filter(Boolean);
  return {
    sourceName: "one-off LLM structured intake",
    products: extraction.productKeys,
    excludedProducts: [],
    months: extraction.months,
    states,
    budget: extraction.budgetUsd,
    objective: extraction.objective,
    periodType: extraction.months.length > 1 ? "multi-month" : extraction.months.length === 1 ? "month" : "year",
    warnings: extraction.missingFields,
    confidence: [extraction.budgetUsd, extraction.productKeys.length, extraction.months.length, extraction.incrementalityBasis].filter(Boolean).length >= 3 ? "high" : "medium"
  };
}

async function narrateOneOffPlanResult({ text, mode, dossier, extraction, planDoc, basisLabel }) {
  try {
    const result = await postAnthropicMessages({
      system: [
        mode.custom_instructions || "",
        ...getCapabilitySystemLines(mode.key),
        "You narrate only after deterministic one-off campaign logic has produced the plan document.",
        "Do not calculate, alter, round differently or introduce any numbers beyond campaign_result JSON.",
        "Keep the answer CMO-friendly, concise and explicit that figures are synthetic working estimates.",
        "Return prose only. Do not output a table, markdown table, bullet list or horizontal rule.",
        "Do not use emoji or decorative symbols."
      ].join("\n"),
      messages: [
        {
          role: "user",
          content: [
            `User brief: ${text}`,
            `Extracted dinks: ${JSON.stringify(extraction)}`,
            `Grounding dossier: ${JSON.stringify(compactYearDossier(dossier))}`,
            `Basis: ${basisLabel}`,
            `Campaign result: ${JSON.stringify(summariseOneOffPlanResult(planDoc, extraction, basisLabel))}`,
            "Write one short paragraph before the table. Mention if governance refuses activation."
          ].join("\n\n")
        }
      ],
      max_tokens: 700,
      temperature: 0.2
    });
    return cleanYearNarration(getAnthropicText(result)) || defaultOneOffNarration(planDoc, basisLabel);
  } catch (error) {
    app.llmLastStatus = `One-off narration fallback: ${error.message}`;
    return defaultOneOffNarration(planDoc, basisLabel);
  }
}

function defaultOneOffNarration(planDoc, basisLabel) {
  const blocked = planDoc.blockedStates.length;
  if (blocked) {
    if (planDoc.isNewProductLaunch) {
      return `${basisLabel} is the correct path because the brief declares a new product and there is no existing product activity against which to claim incrementality. The new-product governance rule defaults all ${formatNumber(blocked)} jurisdictions to not listed, so activation is held until verified product/state receipts are loaded. The ${formatCurrency(planDoc.budget)} channel table is a baseline-shaped rehearsal only: no ${planDoc.productName}-specific audience response, publisher/rights availability or channel performance is loaded, and no channel is presented as a proven optimum. ${planDoc.measurementLabel} is ${formatMoney(planDoc.blendedCpa, 2)}; it carries no incremental penalty or comparison. Figures remain synthetic working estimates.`;
    }
    return `${basisLabel} is stamped, but the deterministic governance check refuses activation for ${formatNumber(blocked)} blocked/not-listed state${blocked === 1 ? "" : "s"}. No campaign should be saved until those receipts clear.`;
  }
  const scope = planDoc.scopeLabel || planDoc.states.map((row) => row.state_code).join(", ") || "product-live states";
  const leadingChannel = planDoc.layers.find((layer) => layer.label.includes("Channel allocation"))?.body || "channel mix follows the active annual baseline";
  const comparison = planDoc.basis === "incremental" && planDoc.baselineCpa
    ? ` versus ${formatMoney(planDoc.baselineCpa, 2)} before diminishing-returns penalties`
    : "";
  const basisReason = planDoc.isNewProductLaunch
    ? "Standalone is the correct path because the brief declares a new product and there is no existing product activity against which to claim incrementality."
    : "The selected basis controls whether active-month carryover and diminishing returns are applied.";
  return `${basisLabel} is stamped, and the deterministic campaign check drafts this ${formatCurrency(planDoc.budget)} rehearsal across ${scope}. ${basisReason} ${planDoc.measurementLabel} is ${formatMoney(planDoc.blendedCpa, 2)}${comparison}. ${planDoc.incrementalMath} ${leadingChannel} Figures remain synthetic working estimates with governance receipts attached.`;
}

function summariseOneOffPlanResult(planDoc, extraction, basisLabel) {
  return {
    budget_usd: planDoc.budget,
    product: productLabel(extraction.productKeys?.[0] || app.oneOffProduct || app.selectedProduct),
    basis: basisLabel,
    months: extraction.months || [],
    states: planDoc.states.map((row) => row.state_code),
    governance: planDoc.governance,
    blocked_states: planDoc.blockedStates,
    receipts: planDoc.guardrailReceipts,
    layers: planDoc.layers
  };
}

async function answerOneOffQuestion({ text, mode, requestContext, dossier, extraction, conversation }) {
  const draft = app.oneOffDraft || conversation.lastOneOffDraft || null;
  const result = await postAnthropicMessages({
    system: [
      mode.custom_instructions || "",
      ...getCapabilitySystemLines(mode.key),
      "Answer questions about the current one-off campaign draft and active deterministic dossier.",
      "Do not invent or accept campaign numbers. If a field is missing, say what is missing.",
      "Do not use emoji, decorative symbols or horizontal rules."
    ].join("\n"),
    messages: [
      {
        role: "user",
        content: [
          `Question: ${text}`,
          `Extraction: ${JSON.stringify(extraction)}`,
          `Grounding dossier: ${JSON.stringify(compactYearDossier(dossier))}`,
          `Current one-off draft: ${JSON.stringify(draft)}`
        ].join("\n\n")
      }
    ],
    max_tokens: 900,
    temperature: 0.2
  });
  return decorateChatAnswerWithMode({
    role: "assistant",
    title: "One-off campaign answer",
    body: cleanLlmAnswerText(getAnthropicText(result)) || "I could not get a narrated one-off answer from the model, so I have not added unsupported interpretation.",
    chips: [
      { label: `LLM: ${ANTHROPIC_CHAT_MODEL}`, className: "status-working" },
      { label: "no campaign accepted", className: "status-working" }
    ],
    createdAt: getDemoToday()
  }, mode, "oneOffLlmQuestion", requestContext);
}

function summariseYearPlanResult(planResult) {
  return {
    budget_usd: planResult.budget,
    forecast_ftd_proxy: planResult.ftds,
    blended_media_cpa_usd: round2(planResult.cpa),
    source_plan_id: planResult.sourcePlanId,
    source_plan_label: planResult.sourcePlanLabel,
    scope_note: planResult.scopeNote,
    state_channel_reweight: planResult.stateMix ? {
      source_id: planResult.stateMix.source_id,
      status: planResult.stateMix.status,
      requested_states: planResult.stateMix.requested_states,
      matched_states: planResult.stateMix.matched_states,
      missing_states: planResult.stateMix.missing_states
    } : null,
    scenario_label: planResult.scenarioLabel,
    scenario_modifier: planResult.scenarioModifier,
    brand_response: planResult.brandResponse,
    period: planResult.period,
    channel_scope: {
      value: planResult.channelScope.value,
      label: planResult.channelScope.label
    },
    fields: {
      year: planResult.extraction.year,
      states: planResult.extraction.states,
      products: planResult.extraction.productKeys,
      audience: planResult.extraction.audience,
      goal: planResult.extraction.goal,
      kpi: planResult.extraction.kpi
    },
    channels: planResult.rows.map((row) => ({
      channel: row.channel,
      budget_usd: row.budget,
      share_pct: round2(row.share),
      forecast_ftd_proxy: row.ftds,
      media_cpa_usd: row.buyable === false ? null : round2(row.cpa),
      buyable: row.buyable
    }))
  };
}

function saveLastYearPlanToFlightpath() {
  const conversation = ensureChatConversation("year");
  const summary = conversation.lastComputedYearPlan;
  if (!summary) {
    conversation.messages.push({
      role: "assistant",
      title: "Nothing to save yet",
      body: "Create a Year plan first, then save it into Flightpath.",
      chips: [
        { label: "no plan accepted yet", className: "status-review" }
      ],
      createdAt: getDemoToday()
    });
    persistChatSessions();
    renderPlanningChatShell();
    return;
  }
  const existing = getYearChatPlanEntry(summary);
  const entry = existing || buildPlanStoreEntryFromYearSummary(summary, { status: "active", activate: true });
  entry.meta.status = "active";
  entry.plan.plan_store_status = "active";
  entry.meta.notes = `${entry.meta.notes || ""} Promoted from Planning OS Year chat.`;
  upsertPlanStoreEntry(entry, { activate: true });
  summary.saved_plan_id = entry.meta.plan_id;
  summary.saved_scenario_key = entry.meta.scenario_key;
  conversation.messages.push({
    role: "assistant",
    title: "Saved to Flightpath",
    body: `${entry.meta.label} is now available as a Flightpath plan version.`,
    chips: [
      { label: "plan saved", className: "status-working" },
      { label: "Flightpath version", className: "status-working" }
    ],
    createdAt: getDemoToday()
  });
  persistChatSessions();
  app.selectedSurface = "flightpath";
  render();
}

function buildPlanStoreEntryFromYearSummary(summary, options = {}) {
  const baseEntry = app.data.planStore?.byId?.[summary.source_plan_id] || getActivePlanEntry() || getStoredPlanEntry();
  const basePlan = baseEntry?.plan || getPlan();
  const savedIndex = (app.data.planStore?.entries || []).filter((entry) => entry.in_memory).length + 1;
  const period = summary.period || baseEntry?.meta?.period || { start: "2026-01", end: "2026-12" };
  const planYear = String(period.start || "2026-01").slice(0, 4);
  const planId = summary.saved_plan_id || `FD_US_${planYear}_CHAT_YEAR_${String(savedIndex).padStart(2, "0")}`;
  const scenarioKey = summary.saved_scenario_key || `chat_year_${String(savedIndex).padStart(2, "0")}`;
  const channelByName = new Map((summary.channels || []).map((row) => [row.channel, row]));
  const baseChannelByName = new Map((basePlan.channel_totals || []).map((row) => [row.channel, row]));
  const monthlyAllocations = buildMonthlyAllocationsForSavedYearPlan(basePlan, summary, period, channelByName, baseChannelByName);
  const channelTotals = (summary.channels || []).map((row) => {
    const baseChannel = baseChannelByName.get(row.channel) || {};
    return {
      ...baseChannel,
      channel: row.channel,
      budget_gbp: round2(Number(row.budget_usd || 0)),
      forecast_acquisitions: round2(Number(row.forecast_ftd_proxy || 0)),
      forecast_cpa_gbp: row.media_cpa_usd,
      share_pct: Number(row.share_pct || 0),
      buyable: row.buyable,
      confidence: baseChannel.confidence || "synthetic",
      evidence_strength: baseChannel.evidence_strength || "synthetic-demo"
    };
  });
  const budget = Number(summary.budget_usd || 0);
  const ftds = Number(summary.forecast_ftd_proxy || 0);
  const meta = {
    ...(baseEntry?.meta || {}),
    plan_id: planId,
    label: summary.scenario_label || `${formatPeriodLabel(period)} ${summary.channel_scope?.label || "All channels"} plan`,
    version: savedIndex,
    parent_plan_id: summary.source_plan_id || basePlan.plan_id,
    status: options.status || "draft",
    horizon: period.start?.slice(0, 4) === period.end?.slice(0, 4) && period.start.endsWith("-01") && period.end.endsWith("-12") ? "annual" : "custom_period",
    period,
    scenario_key: scenarioKey,
    scenario_id: "chat_year_plan",
    created_at: getDemoToday(),
    approved_by: "demo operator",
    notes: `Saved from the Planning OS Year chat into Flightpath. Period ${formatPeriodLabel(period)}. Channel scope ${summary.channel_scope?.label || "All channels"}.`,
    source_ids: ["chat_year_plan_save_v1", ...(baseEntry?.meta?.source_ids || [])],
    plan_path: null,
    meta_path: null
  };
  const plan = {
    ...basePlan,
    plan_id: planId,
    plan_store_id: planId,
    plan_store_status: options.status || "draft",
    scenario: {
      ...(basePlan.scenario || {}),
      key: scenarioKey,
      label: meta.label
    },
    total_budget_gbp: round2(budget),
    total_allocated_gbp: round2(budget),
    forecast_acquisitions: round2(ftds),
    forecast_cpa_gbp: ftds > 0 ? round2(budget / ftds) : 0,
    paid_media_cpa_gbp: Number(summary.blended_media_cpa_usd || 0),
    channel_totals: channelTotals,
    monthly_allocations: monthlyAllocations,
    saved_from_chat: summary
  };
  return { meta, plan, in_memory: true };
}

function buildMonthlyAllocationsForSavedYearPlan(basePlan, summary, period, channelByName, baseChannelByName) {
  const targetMonths = listMonthsBetween(period.start, period.end);
  const baseRows = basePlan.monthly_allocations || [];
  const baseRowsByMonthNumber = baseRows.reduce((map, row) => {
    const monthNumber = String(row.month || "").slice(5, 7);
    if (!map.has(monthNumber)) map.set(monthNumber, []);
    map.get(monthNumber).push(row);
    return map;
  }, new Map());
  const allocations = [];
  targetMonths.forEach((targetMonth) => {
    const monthNumber = targetMonth.slice(5, 7);
    const templateRows = baseRowsByMonthNumber.get(monthNumber) || [];
    templateRows.forEach((row) => {
      const target = channelByName.get(row.channel);
      if (!target) return;
      const baseChannel = baseChannelByName.get(row.channel) || {};
      const baseBudget = Number(baseChannel.budget_gbp || 0);
      const baseFtd = Number(baseChannel.forecast_acquisitions || 0);
      const budgetScale = baseBudget > 0 ? Number(target.budget_usd || 0) / baseBudget : 0;
      const ftdScale = baseFtd > 0 ? Number(target.forecast_ftd_proxy || 0) / baseFtd : budgetScale;
      allocations.push({
        ...row,
        month: targetMonth,
        budget_gbp: round2(Number(row.budget_gbp || 0) * budgetScale),
        forecast_acquisitions: round2(Number(row.forecast_acquisitions || 0) * ftdScale),
        source_ids: ["chat_year_plan_save_v1", ...(row.source_ids || [])]
      });
    });
  });
  const rawBudget = allocations.reduce((sum, row) => sum + Number(row.budget_gbp || 0), 0);
  const rawFtds = allocations.reduce((sum, row) => sum + Number(row.forecast_acquisitions || 0), 0);
  const budgetScale = rawBudget > 0 ? Number(summary.budget_usd || 0) / rawBudget : 1;
  const ftdScale = rawFtds > 0 ? Number(summary.forecast_ftd_proxy || 0) / rawFtds : budgetScale;
  allocations.forEach((row) => {
    row.budget_gbp = round2(Number(row.budget_gbp || 0) * budgetScale);
    row.forecast_acquisitions = round2(Number(row.forecast_acquisitions || 0) * ftdScale);
  });
  const totalBudget = allocations.reduce((sum, row) => sum + Number(row.budget_gbp || 0), 0);
  const correction = round2(Number(summary.budget_usd || 0) - totalBudget);
  const lastBuyable = [...allocations].reverse().find((row) => Number(row.budget_gbp || 0) > 0);
  if (lastBuyable && Math.abs(correction) >= 0.01) {
    lastBuyable.budget_gbp = round2(Number(lastBuyable.budget_gbp || 0) + correction);
  }
  return allocations;
}

function upsertPlanStoreEntry(entry, options = {}) {
  if (!app.data?.planStore || !entry?.meta?.plan_id) return;
  app.data.planStore.byId[entry.meta.plan_id] = entry;
  app.data.planStore.byScenario[entry.meta.scenario_key] = entry;
  app.data.planStore.entries = [
    ...app.data.planStore.entries.filter((item) => item.meta.plan_id !== entry.meta.plan_id),
    entry
  ];
  if (options.activate) {
    app.data.planStore.active = entry;
    app.data.planStore.manifest.active_annual = entry.meta.plan_id;
    app.selectedScenario = entry.meta.scenario_key;
  }
}

function compactYearDossier(dossier) {
  return {
    mode: dossier.mode,
    system_prompt: dossier.system_prompt,
    active_plan: dossier.plan,
    scope: dossier.scope,
    engine_capability: dossier.engine_capability,
    guardrails: dossier.guardrails,
    talk_state: dossier.talk_state,
    actuals: dossier.actuals,
    flightpath: dossier.flightpath,
    reporting: dossier.reporting,
    free_research: dossier.free_research,
    page_context: dossier.page_context,
    knowledge_gaps: dossier.knowledge_gaps,
    meta_question: dossier.meta_question,
    attachments: (dossier.attachments || []).map((attachment) => ({
      name: attachment.name,
      kind: attachment.kind,
      wordCount: attachment.wordCount,
      excerpt: String(attachment.excerpt || "").slice(0, 4000)
    })),
    spend_baseline: dossier.spend_baseline,
    sources: dossier.sources
  };
}

async function postAnthropicMessages({ system, messages, tools = null, tool_choice = null, max_tokens = 1000, temperature = 0 }) {
  const payload = {
    model: ANTHROPIC_CHAT_MODEL,
    max_tokens,
    temperature,
    system,
    messages
  };
  if (tools) payload.tools = tools;
  if (tool_choice) payload.tool_choice = tool_choice;
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude proxy returned ${response.status}: ${errorText.slice(0, 180)}`);
  }
  return response.json();
}

function getAnthropicToolInput(result, toolName) {
  return (result.content || []).find((block) => block.type === "tool_use" && block.name === toolName)?.input || null;
}

function getAnthropicText(result) {
  return (result.content || [])
    .filter((block) => block.type === "text" && block.text)
    .map((block) => block.text.trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function cleanYearNarration(text) {
  const lines = String(text || "")
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      if (trimmed.startsWith("|")) return false;
      if (/^-{3,}$/.test(trimmed)) return false;
      if (/^(?:engine(?: status)?|save|source)\s*:/i.test(trimmed)) return false;
      if (/^channel\s*\|/i.test(trimmed)) return false;
      if (/^(linear tv|crm|ctv|paid search|affiliate|paid social|youtube|radio\/audio|app store|display|organic search)\s*\|/i.test(trimmed)) return false;
      return true;
    });
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function cleanLlmAnswerText(text) {
  return String(text || "")
    .replace(/^\s*-{3,}\s*$/gm, "")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeMarkdownCell(value) {
  return String(value ?? "").replaceAll("|", "/");
}

async function runPlanningLlmService({ text, mode, requestContext, deterministicAnswer }) {
  if (mode.key === "free") {
    return runFreeQuestionLlmService({ text, mode, requestContext, deterministicAnswer });
  }
  const config = getLlmServiceConfig();
  const dossier = buildLlmDossier(mode, text, requestContext, deterministicAnswer);
  const payload = {
    system: mode.custom_instructions || "Use deterministic FanDuel planning facts. Do not replace computed numbers.",
    user: text,
    mode: mode.key,
    engine: app.chatEngine,
    planning_basis: requestContext?.planningBasis || app.planningBasis,
    engine_capability: getModeCapability(mode.key),
    product: requestContext?.productLabel || productLabel(app.selectedProduct),
    output_contract: "Data-led mode follows current synthetic/working evidence. LLM insight-led mode may suggest strategic shape, but never replaces deterministic plan, actuals, governance or budget numbers.",
    deterministic_answer: {
      title: deterministicAnswer.title,
      body: deterministicAnswer.body,
      chips: deterministicAnswer.chips
    },
    dossier
  };
  if (config.enabled && config.endpoint) {
    let timeout;
    try {
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), config.timeoutMs);
      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(`LLM service returned ${response.status}`);
      }
      const result = await response.json();
      app.llmLastStatus = `LLM endpoint ${config.model}`;
      return {
        title: result.title || deterministicAnswer.title,
        body: String(result.body || result.narration || ""),
        status: "endpoint",
        model: result.model || config.model,
        dossier
      };
    } catch (error) {
      app.llmLastStatus = `LLM fallback: ${error.message}`;
      return buildLocalLlmNarration(text, mode, deterministicAnswer, dossier, `endpoint fallback: ${error.message}`);
    } finally {
      clearTimeout(timeout);
    }
  }
  app.llmLastStatus = config.enabled ? "LLM flag on; local narration" : "LLM env off; local narration";
  return buildLocalLlmNarration(text, mode, deterministicAnswer, dossier, app.llmLastStatus);
}

async function runFreeQuestionLlmService({ text, mode, requestContext, deterministicAnswer }) {
  const dossier = buildLlmDossier(mode, text, requestContext, deterministicAnswer);
  const skillFrames = getFreeSkillFrames(text);
  const skillReceipts = getFreeSkillReceipts(skillFrames);
  try {
    const result = await postAnthropicMessages({
      system: [
        mode.custom_instructions || "Answer FanDuel planning questions using the grounded dossier.",
        ...getCapabilitySystemLines(mode.key),
        ...skillFrames.map(getFreeSkillFramePrompt),
        "You are in Free question mode. Answer the user's question directly using the dossier.",
        "Do not generate or accept a plan. Do not invent or adjust plan numbers.",
        "For reporting questions, use dossier.reporting and its line_items rollups.",
        "For month, Flightpath or saved-campaign questions, use dossier.flightpath and talk_state.",
        "For Free-chat research questions, use dossier.free_research: it carries SDE, Predict personas, Signal, regulation, spend baseline, calendar fixtures and saved-plan context. Name the specific absent source when a requested fact is not loaded.",
        "Treat the grounding dossier as the complete and exclusive evidence for factual claims. Do not use general category knowledge to fill a gap.",
        "Search-interest rows are not market share, brand equity, spend or proof of competitor strategy. Do not generalise a selected-state sample to most or all states.",
        "Paid-SERP rows prove only the observed domain, keyword, copy and date in this scoped cut. They do not prove spend, targeting, performance, campaign intent or absence outside the cut.",
        "Every SDE, reporting, plan-CPA and channel-economics number is synthetic or inferred unless the dossier explicitly says otherwise.",
        "When dossier.page_context is present, use it for questions about this page, this grid, this report, this period or this state.",
        "For meta questions about unknowns, sources, caveats or simulated data, start with dossier.knowledge_gaps and dossier.sources.",
        "If the answer needs evidence not in the dossier, say what is missing and keep the caveat visible.",
        "Keep it concise and CMO-friendly.",
        "Do not use emoji, decorative symbols or horizontal rules."
      ].join("\n"),
      messages: [
        {
          role: "user",
          content: [
            `Question: ${text}`,
            `Grounding dossier: ${JSON.stringify(compactYearDossier(dossier))}`
          ].join("\n\n")
        }
      ],
      max_tokens: 900,
      temperature: 0.2
    });
    app.llmLastStatus = `Free LLM: ${ANTHROPIC_CHAT_MODEL}`;
    return {
      title: "Free question answer",
      body: getAnthropicText(result) || deterministicAnswer.body,
      status: "endpoint",
      model: ANTHROPIC_CHAT_MODEL,
      skillFrames,
      skillReceipts,
      dossier
    };
  } catch (error) {
    app.llmLastStatus = `Free LLM fallback: ${error.message}`;
    if (!isUnderstudyEnabled()) {
      return {
        title: "Free chat is not connected",
        body: "The live LLM route did not answer, so I have not used the local deterministic understudy. Add `understudy=on` to the URL only for labelled fallback testing, or check the local server/API key and ask again.",
        status: "LLM unavailable",
        model: "none",
        hardUnavailable: true,
        dossier
      };
    }
    return buildLocalLlmNarration(text, mode, deterministicAnswer, dossier, `understudy=on fallback: ${error.message}`);
  }
}

function getFreeSkillFrames(text) {
  const clean = lowerCaseText(text);
  const frames = new Set();
  if (/ritson|brand.*activation|esov|share of voice/.test(clean)) frames.add("ritson");
  if (/sutherland|behavio|perception|feel bigger|friction/.test(clean)) frames.add("sutherland");
  if (/beat|competitor|opportunity|strategy|should we/.test(clean)) frames.add("strategy");
  if (/synthetic|real|source|what don.t you know|unknown|gap/.test(clean)) frames.add("evidence");
  return [...frames];
}

function getFreeSkillFramePrompt(frame) {
  return app.data?.referenceProvenance?.tau_skills?.frame_map?.[frame]?.prompt || FREE_SKILL_FRAMES[frame] || "";
}

function getFreeSkillReceipts(frames = []) {
  const tauSkills = app.data?.referenceProvenance?.tau_skills;
  return frames.flatMap((frame) => {
    const mapped = tauSkills?.frame_map?.[frame];
    return (mapped?.source_skill_ids || []).map((skillId) => ({
      frame,
      source_id: tauSkills.source_id,
      skill_id: skillId,
      source_path: tauSkills.skills?.[skillId]?.source_path || "",
      sha256: tauSkills.skills?.[skillId]?.sha256 || ""
    }));
  });
}

function lowerCaseText(value) {
  return String(value || "").toLowerCase();
}

function buildLocalLlmNarration(text, mode, deterministicAnswer, dossier, status) {
  const isFree = mode.key === "free";
  const guardrailLine = dossier.guardrails.blocked_states || dossier.guardrails.watch_states
    ? `Governance note: ${formatNumber(dossier.guardrails.blocked_states)} blocked/not-listed states and ${formatNumber(dossier.guardrails.watch_states)} watch states are in scope.`
    : "Governance note: current selected scope is clear in the working source.";
  const reportingLine = dossier.reporting
    ? `Reporting context: ${dossier.reporting.month.label} ${dossier.reporting.view.label}, ${dossier.reporting.kpis.spend} spend, ${dossier.reporting.line_items.row_count} compact line-item rows, ${dossier.reporting.kpis.cpa} CPA.`
    : "";
  const flightpathLine = dossier.flightpath?.selected_month
    ? `Flightpath context: ${dossier.flightpath.selected_month.label}, ${dossier.flightpath.selected_month.budget}, ${dossier.flightpath.selected_month.event_note}.`
    : "";
  const pageContextLine = dossier.page_context
    ? `Page context: ${dossier.page_context.label} (${(dossier.page_context.chips || []).join(", ")}). ${dossier.page_context.body || ""}`
    : "";
  const gapLine = (dossier.knowledge_gaps || []).length
    ? `Known gaps: ${(dossier.knowledge_gaps || []).slice(0, 3).map((gap) => `${gap.label} (${gap.status})`).join("; ")}.`
    : "";
  const body = isFree
    ? [
        `Here is the grounded read, using the deterministic dossier as the source of truth.`,
        "",
        `- Active plan: ${dossier.plan.label}, ${dossier.plan.budget}, ${dossier.plan.ftd_proxy} FTD proxy, ${dossier.plan.cpa} media CPA.`,
        `- Product/scope: ${dossier.scope.product}, ${dossier.scope.state_count} selected states.`,
        reportingLine ? `- ${reportingLine}` : "",
        flightpathLine ? `- ${flightpathLine}` : "",
        pageContextLine ? `- ${pageContextLine}` : "",
        `- ${guardrailLine}`,
        gapLine ? `- ${gapLine}` : "",
        `- Data posture: ${dossier.sources.join("; ")}.`,
        "",
        `Question: ${text || "free-mode prompt"}`
      ].filter(Boolean).join("\n")
    : [
        `Narration layer: ${mode.custom_instructions || "Use deterministic facts and client-safe caveats."}`,
        `${guardrailLine}`,
        `Do not alter the computed answer above; use this as CMO-facing framing only.`
      ].join("\n");
  return {
    title: isFree ? "LLM-grounded planning answer" : "LLM narration",
    body,
    status,
    model: "local-dossier-narrator",
    dossier
  };
}

function applyLlmNarration(answer, llmResult, mode) {
  const statusChip = {
    label: llmResult.status === "endpoint" ? `LLM: ${llmResult.model}` : llmResult.status,
    className: llmResult.status === "endpoint" ? "status-working" : "status-review"
  };
  const instructionChip = {
    label: "mode instructions applied",
    className: "status-working"
  };
  if (mode.key === "free") {
    if (llmResult.hardUnavailable) {
      return {
        ...answer,
        title: llmResult.title || answer.title,
        body: llmResult.body || "The live LLM route did not answer.",
        chips: [{ label: "answer unavailable", className: "status-missing" }, ...(answer.chips || [])],
        llm: {
          status: llmResult.status,
          model: llmResult.model,
          customInstructions: mode.custom_instructions,
          dossier: llmResult.dossier
        }
      };
    }
    if (llmResult.status !== "endpoint") {
      return {
        ...answer,
        body: `Understudy fallback is explicitly enabled for this URL, so this answer uses the grounded deterministic understudy.\n\n${answer.body}`,
        chips: [{ label: "labelled fallback", className: "status-review" }, ...(answer.chips || [])],
        llm: {
          status: llmResult.status,
          model: llmResult.model,
          customInstructions: mode.custom_instructions,
          dossier: llmResult.dossier
        }
      };
    }
    return {
      ...answer,
      title: llmResult.title || answer.title,
      body: llmResult.body || answer.body,
      chips: [...(answer.chips || [])],
      skillFrames: llmResult.skillFrames || [],
      llm: {
        status: llmResult.status,
        model: llmResult.model,
        customInstructions: mode.custom_instructions,
        dossier: llmResult.dossier,
        skillFrames: llmResult.skillFrames || [],
        skillReceipts: llmResult.skillReceipts || []
      }
    };
  }
  if (app.chatEngine === "both") {
    return {
      ...answer,
      body: `${answer.body}\n\n**LLM narration**\n${llmResult.body}`,
      chips: [statusChip, instructionChip, ...(answer.chips || [])],
      llm: {
        status: llmResult.status,
        model: llmResult.model,
        customInstructions: mode.custom_instructions,
        dossier: llmResult.dossier
      }
    };
  }
  return {
    ...answer,
    chips: [statusChip, instructionChip, ...(answer.chips || [])],
    llm: {
      status: llmResult.status,
      model: llmResult.model,
      customInstructions: mode.custom_instructions,
      dossier: llmResult.dossier
    }
  };
}

function buildLlmDossier(mode, text, requestContext, deterministicAnswer) {
  const plan = getPlan();
  const productKey = requestContext?.productKey || app.selectedProduct;
  const selectedCodes = getSelectedPlanningStateCodes(productKey);
  const firewall = getFirewallSummary(selectedCodes, productKey);
  const q1Rows = (app.data.actualsMonthly?.rows || []).filter((row) => row.month >= "2026-01" && row.month <= "2026-03");
  const q1Planned = q1Rows.reduce((sum, row) => sum + Number(row.planned_spend || 0), 0);
  const q1Actual = q1Rows.reduce((sum, row) => sum + Number(row.actual_spend || 0), 0);
  const spendBaseline = app.data.spendBaseline;
  const mediaEnvelope = spendBaseline?.annual_total_usd || spendBaseline?.annual_media_spend_usd || plan.total_allocated_gbp;
  const monthlySummaries = app.data?.calendar?.draws ? buildMonthlySummaries(plan) : [];
  return {
    mode: mode.key,
    system_prompt: mode.custom_instructions || "",
    user_prompt: text,
    answer_title: deterministicAnswer.title,
    plan: {
      id: plan.plan_id,
      label: plan.scenario?.label || app.selectedScenario,
      budget: formatCurrency(plan.total_allocated_gbp),
      ftd_proxy: formatNumber(plan.forecast_acquisitions),
      cpa: formatCurrency(plan.forecast_cpa_gbp),
      source_ids: getPlanMeta()?.source_ids || []
    },
    scope: {
      product: productLabel(productKey),
      planning_basis: requestContext?.planningBasis === "insight_led" ? "LLM insight-led strategy; deterministic tools own accepted numbers" : "data-led deterministic plan from current synthetic/working evidence",
      state_count: formatNumber(selectedCodes.length),
      states: selectedCodes.slice(0, 12)
    },
    engine_capability: getModeCapability(mode.key),
    guardrails: {
      label: firewall.label,
      blocked_states: firewall.blockedCount || 0,
      watch_states: firewall.watchCount || 0,
      status_class: firewall.className
    },
    talk_state: buildTalkToPlanState(),
    actuals: {
      q1_planned: formatCurrency(q1Planned),
      q1_actual: formatCurrency(q1Actual),
      status: app.data.actualsManifest?.status || "synthetic-simulated"
    },
    flightpath: buildFlightpathDossier(plan, monthlySummaries),
    reporting: buildReportingDossier(),
    free_research: buildFreeResearchDossier(productKey, selectedCodes, text),
    page_context: app.freePageContext,
    knowledge_gaps: buildKnowledgeGapDossier(),
    meta_question: detectFreeMetaQuestion(text),
    spend_baseline: {
      annual_envelope: formatCurrency(mediaEnvelope),
      status: spendBaseline?.status || "inferred public-source baseline",
      source_id: spendBaseline?.source_id || "fanduel_marketing_spend_baseline_2026"
    },
    attachments: requestContext?.attachments || [],
    dinks: requestContext?.dinks || [],
    sources: [
      "SDE actuals are synthetic-simulated",
      "state governance is working research pending regulator verification",
      "a scoped DataForSEO paid-SERP provider cut is loaded; it is not spend, targeting or efficiency evidence",
      "FanDuel marketing spend baseline is inferred public-source",
      "planning engine capabilities are declared in fanduel_planning_engine_capabilities_v1"
    ]
  };
}

function buildFreeResearchDossier(productKey, selectedCodes = [], question = "") {
  const queryStateCodes = getFreeQueryStateCodes(question, selectedCodes);
  const queryMonth = getFreeQueryMonth(question, app.selectedCalendarMonth || "2026-09");
  const governanceRows = app.data?.governance?.state_rows || [];
  const regulationRows = app.data?.regulationSubstance?.rows || [];
  const personaRows = app.data?.personas?.personas || [];
  const actualRows = app.data?.actualsMonthly?.rows || [];
  const actualMonthTotals = app.data?.actualsMonthly?.month_totals || [];
  const policyRows = app.data?.publisherPolicies?.rows || [];
  const valueRows = app.data?.stateValueIndex?.rows || [];
  const fixtureRows = getCalendarFixtureRows().filter((row) => row.date?.slice(0, 7) === queryMonth);
  const shareRows = app.data?.ideasLab?.shareSeries || [];
  const brands = app.data?.ideasLab?.brands5 || app.data?.momentum?.national_trend_comparative_method?.included_brands || [];
  const paidTargets = app.data?.paidSerp?.targets || [];
  const signalSearch = app.data?.signalSearch || {};
  const creativeLibrary = app.data?.creativeLibrary || {};
  const plan = getPlan();
  const stateComparisons = (app.data?.ideasLab?.stateComparativeRows || [])
    .filter((row) => queryStateCodes.includes(row.state_code))
    .map((row) => ({
      state_code: row.state_code,
      state_name: row.state_name,
      average_share_pct: row.average_share_pct,
      trend_strengths: row.trend_strengths,
      data_points: row.data_points?.length || 0,
      method: row.method,
      normalisation: row.normalisation,
      source_ids: row.source_ids
    }));
  const nationalAverageShare = Object.fromEntries(brands.map((brand, index) => [
    brand,
    round2(shareRows.reduce((sum, row) => sum + Number(row.values?.[index] || 0), 0) / Math.max(shareRows.length, 1))
  ]));
  const productKeys = ["sportsbook", "casino", "predicts", "dfs"];
  const governanceProducts = Object.fromEntries(productKeys.map((key) => {
    const statuses = governanceRows.map((row) => ({ state_code: row.state_code, status: getProductStatus(row, key) }));
    return [key, {
      allowed_states: statuses.filter((row) => row.status === "allowed").map((row) => row.state_code),
      review_states: statuses.filter((row) => ["restricted", "legal-review"].includes(row.status)).map((row) => row.state_code),
      not_listed_or_blocked_states: statuses.filter((row) => ["not_listed", "blocked"].includes(row.status)).map((row) => row.state_code)
    }];
  }));
  const governanceQueryStates = governanceRows
    .filter((row) => queryStateCodes.includes(row.state_code))
    .map((row) => ({
      state: row.state,
      state_code: row.state_code,
      statuses: Object.fromEntries(productKeys.map((key) => [key, getProductStatus(row, key)])),
      operating_statuses: Object.fromEntries(productKeys.map((key) => [key, row[`${key}_operating_status`] || "unknown"])),
      notable_restrictions: row.notable_restrictions,
      planning_action: row.planning_action,
      market_posture: row.market_posture
    }));
  const regulation = regulationRows
    .filter((row) => queryStateCodes.includes(row.state_code))
    .map((row) => ({
      state: row.state,
      state_code: row.state_code,
      product: row.product,
      product_key: row.product_key,
      planning_status: row.planning_status,
      operating_status: row.operating_status,
      legal_position_summary: row.legal_position_summary,
      why_suppressed: row.why_suppressed,
      planning_implication: row.planning_implication,
      regulator: row.regulator,
      instrument_name: row.instrument_name,
      advertising_rules_summary: row.advertising_rules_summary,
      responsible_gaming_summary: row.responsible_gaming_summary,
      age_threshold: row.age_threshold,
      source_id: row.source_id,
      source_url: row.source_url,
      confidence: row.confidence,
      review_status: row.review_status,
      last_checked: row.last_checked
    }));
  const personas = personaRows.map((persona) => ({
    id: persona.persona_id,
    label: persona.label,
    primary_state: persona.primary_state,
    states: persona.state_codes,
    market_role: persona.market_role,
    fan_interest_signal: persona.fan_interest_signal,
    product_governance: persona.product_governance,
    planning_use: persona.planning_use,
    recommended_demo_channels: persona.recommended_demo_channels,
    size_proxy: persona.segment_size_proxy
  }));
  const selectedActualRows = actualRows.filter((row) => row.month === queryMonth);
  const selectedValueRows = valueRows
    .filter((row) => queryStateCodes.includes(row.state_code))
    .map((row) => ({ ...row }));
  const topValueRows = valueRows
    .filter((row) => row.sportsbook_status === "allowed")
    .slice()
    .sort((a, b) => Number(b.value_index || 0) - Number(a.value_index || 0))
    .slice(0, 10);
  const paidSerp = {
    source_id: "dataforseo_paid_serp_fanduel_2026_07_09",
    status: "scoped provider evidence",
    evidence_boundary: app.data?.paidSerp?.evidence_boundary,
    total_observations: paidTargets.reduce((sum, target) => sum + Number(target.retrieval?.returned_rows || 0), 0),
    targets: paidTargets.map((target) => ({
      brand: target.brand,
      domain: target.domain,
      returned_rows: target.retrieval?.returned_rows || 0,
      paid_keyword_count: target.overview?.paid_keyword_count || 0,
      observed_keywords: (target.paid_keywords || []).slice(0, 5).map((row) => ({ keyword: row.keyword, title: row.title, observed_domain: row.observed_domain, last_updated_time: row.last_updated_time }))
    })),
    missing_for_efficiency_claims: ["client account spend", "targeting settings", "conversion outcomes", "priority-query live SERPs"]
  };
  const dossier = {
    sde: {
      source_id: "fanduel_sde_actuals_manifest_v1",
      status: app.data.actualsManifest?.status || "synthetic-simulated",
      display_flag: app.data.actualsMonthly?.display_flag || "SYNTHETIC",
      month: queryMonth,
      month_total: actualMonthTotals.find((row) => row.month === queryMonth) || null,
      channel_rows: selectedActualRows.slice(0, 20).map((row) => ({ channel: row.channel, planned_spend: row.planned_spend, actual_spend: row.actual_spend, spend_variance: row.spend_variance, delivery_index: row.delivery_index, conversions: row.conversions, sales_index: row.sales_index, data_status: row.data_status }))
    },
    predict_personas: { source_id: "predict_persona_seeds_working", status: app.data?.personas?.status || "working persona scaffolds", personas },
    signal: {
      source_id: "sig_scan_fanduel_us_2026_07_03",
      status: app.data?.momentum?.status || "client-safe signal",
      brands,
      national_trend_strength_index: app.data?.momentum?.national_trend_strength_index || {},
      national_average_share_pct: nationalAverageShare,
      latest_week_share_pct: Object.fromEntries(brands.map((brand, index) => [brand, shareRows.at(-1)?.values?.[index] ?? null])),
      comparative_method: app.data?.momentum?.national_trend_comparative_method,
      state_comparisons: stateComparisons,
      top_fanduel_state_interest: app.data?.momentum?.top_fanduel_state_interest || [],
      sourced_news_signals: app.data?.momentum?.sourced_news_signals || [],
      caveats: app.data?.momentum?.demo_caveats || [],
      boundary: "Comparative search-interest indices are observable demand signals, not market share, spend, CAC or proof of competitor strategy."
    },
    paid_serp: paidSerp,
    search_intelligence: {
      source_id: "dataforseo_signal_search_intelligence_2026_07_25",
      status: signalSearch.provenance?.layer || "observed provider snapshot",
      summary: signalSearch.summary || {},
      top_opportunities: (signalSearch.seo_opportunities || []).slice(0, 15),
      priority_serps: Object.fromEntries(Object.entries(signalSearch.priority_serps || {}).slice(0, 12).map(([keyword, rows]) => [
        keyword,
        (rows || []).slice(0, 8)
      ])),
      keyword_economics: (signalSearch.keyword_metrics || []).slice(0, 30),
      boundary: signalSearch.provenance?.caveat || "Provider rankings and volumes are snapshots, not traffic, revenue or market share."
    },
    creative_intelligence: {
      source_id: creativeLibrary.snapshot_id || "meta_ad_library_public_sample",
      status: creativeLibrary.status || "public-evidence sample",
      captured_at: creativeLibrary.captured_at,
      competitor_scope: creativeLibrary.competitor_scope || [],
      evidence_gaps: creativeLibrary.evidence_gaps || [],
      boundary: creativeLibrary.boundary,
      records: (creativeLibrary.records || []).slice(0, 20).map((row) => ({
        advertiser: row.advertiser,
        product: row.product,
        title: row.title,
        copy: row.copy,
        message: row.message,
        strategy: row.strategy,
        offer: row.offer,
        states: row.states,
        start_date: row.start_date,
        end_date: row.end_date
      }))
    },
    governance: {
      source_id: "us_state_governance_working_research_2026_07_03",
      status: app.data?.governance?.status || "working research",
      source_scope: app.data?.governance?.source_scope,
      source_date: app.data?.governance?.source_date,
      product_state_lists: governanceProducts,
      query_states: governanceQueryStates,
      boundary: "FanDuel-owned availability evidence, not regulator verification or legal advice."
    },
    regulation: {
      source_id: "regulation_substance",
      status: app.data?.regulationSubstance?.status || "research support",
      last_checked: app.data?.regulationSubstance?.last_checked,
      rows: regulation,
      boundary: "Research support only; named regulator/legal review remains required before client-facing activation."
    },
    publisher_policies: {
      source_id: "publisher_gambling_policies_v1",
      as_of: app.data?.publisherPolicies?.as_of,
      research_boundary: app.data?.publisherPolicies?.research_boundary,
      rows: policyRows.map((row) => ({ platform: row.platform, verification_status: row.verification_status, planning_status: row.planning_status, acceptance: row.acceptance, certification_requirements: row.certification_requirements, geo_restrictions: row.geo_restrictions, age_targeting: row.age_targeting, responsible_gambling: row.responsible_gambling, product_rules: row.product_rules, policy_url: row.policy_url, last_checked: row.last_checked }))
    },
    state_value_index: {
      source_id: "state_value_index_aggregate_working",
      status: app.data?.stateValueIndex?.status || "working-public-source",
      method: app.data?.stateValueIndex?.method,
      top_sportsbook_rows: topValueRows,
      query_state_rows: selectedValueRows,
      boundary: "Working public-source post-tax proxy, not Admiral internal unit economics."
    },
    evidence_rules: {
      source_id: "fanduel_stage1_demo_evidence_rules_2026",
      status: "working demo evidence rules",
      rules: ["Label SDE, response curves and demo economics as synthetic.", "Label governance, personas and public-source indices as working research.", "Do not infer spend, targeting, CAC, market share or competitor intent from search-interest or paid-SERP observations.", "Name missing client inputs and regulator verification explicitly."]
    },
    tau_skills: app.data?.referenceProvenance?.tau_skills || null,
    spend_baseline: { source_id: app.data.spendBaseline?.source_id || "fanduel_marketing_spend_baseline_2026", status: app.data.spendBaseline?.status || "inferred public-source baseline", annual_envelope: formatCurrency(app.data.spendBaseline?.annual_total_usd || 0), category: app.data.spendBaseline?.category || "envelope", boundary: "Public-source planning envelope, not a FanDuel working-media budget or client actual." },
    calendar: { source_id: "fanduel_fixture_calendar_2025_2027", status: app.data?.fixtureCalendar?.status || "authored/working fixtures", month: queryMonth, events: fixtureRows.slice(0, 20).map((row) => ({ label: row.label, date: row.date, sport: row.sport, status: row.status, source_id: row.source_id })) },
    plan_store: { source_id: "fanduel_plan_store_manifest_v1", active_plan: getActivePlanEntry()?.meta?.label || "No active saved plan", version_count: app.data.planStore?.entries?.length || 0, status: "working plan store", channel_mix: (plan.channel_totals || []).map((row) => ({ channel: row.channel, budget: row.budget_gbp, share_pct: row.share_pct, evidence_strength: row.evidence_strength })) }
  };
  dossier.runtime_evidence = [
    { source_id: "sig_scan_fanduel_us_2026_07_03", record_count: shareRows.length, data_path: "signal.national_average_share_pct" },
    { source_id: "us_state_governance_working_research_2026_07_03", record_count: governanceRows.length, data_path: "governance.product_state_lists" },
    { source_id: "regulation_substance", record_count: regulation.length, data_path: "regulation.rows" },
    { source_id: "predict_persona_seeds_working", record_count: personas.length, data_path: "predict_personas.personas" },
    { source_id: "fanduel_sde_actuals_manifest_v1", record_count: actualRows.length, data_path: "sde.month_total/channel_rows" },
    { source_id: "fanduel_plan_store_manifest_v1", record_count: app.data.planStore?.entries?.length || 0, data_path: "plan_store.channel_mix" },
    { source_id: "fanduel_marketing_spend_baseline_2026", record_count: app.data?.spendBaseline ? 1 : 0, data_path: "spend_baseline" },
    { source_id: "fanduel_fixture_calendar_2025_2027", record_count: fixtureRows.length, data_path: "calendar.events" },
    { source_id: "publisher_gambling_policies_v1", record_count: policyRows.length, data_path: "publisher_policies.rows" },
    { source_id: "state_value_index_aggregate_working", record_count: valueRows.length, data_path: "state_value_index.top_sportsbook_rows" },
    { source_id: "fanduel_stage1_demo_evidence_rules_2026", record_count: dossier.evidence_rules.rules.length, data_path: "evidence_rules.rules" },
    { source_id: "tau_skills_snapshot_2026_06_14", record_count: Object.keys(dossier.tau_skills?.skills || {}).length, data_path: "tau_skills.skills/frame_map" },
    { source_id: "dataforseo_paid_serp_fanduel_2026_07_09", record_count: paidSerp.total_observations, data_path: "paid_serp.targets" },
    { source_id: "dataforseo_signal_search_intelligence_2026_07_25", record_count: signalSearch.summary?.total_organic_rows || 0, data_path: "search_intelligence" },
    { source_id: creativeLibrary.snapshot_id || "meta_ad_library_public_sample", record_count: creativeLibrary.records?.length || 0, data_path: "creative_intelligence.records" }
  ];
  return dossier;
}

function getFreeQueryStateCodes(question, selectedCodes = []) {
  const text = String(question || "").toLowerCase();
  const mentioned = (app.data?.governance?.state_rows || [])
    .filter((row) => new RegExp(`\\b${escapeRegExp(String(row.state || "").toLowerCase())}\\b`).test(text)
      || new RegExp(`\\b${escapeRegExp(String(row.state_code || "").toLowerCase())}\\b`).test(text))
    .map((row) => row.state_code);
  const scopedState = app.planningScope === "state" ? selectedCodes.slice(0, 1) : [];
  return [...new Set([...mentioned, ...scopedState, app.selectedState || "NJ"])].filter(Boolean);
}

function getFreeQueryMonth(question, fallback = "2026-09") {
  const text = String(question || "").toLowerCase();
  const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const index = monthNames.findIndex((name) => text.includes(name) || text.includes(name.slice(0, 3)));
  if (index < 0) return fallback;
  const year = text.match(/\b20\d{2}\b/)?.[0] || fallback.slice(0, 4) || "2026";
  return `${year}-${String(index + 1).padStart(2, "0")}`;
}

function buildFlightpathDossier(plan, monthlySummaries = []) {
  const months = monthlySummaries.length ? monthlySummaries : buildMonthlySummaries(plan);
  const selectedMonth = app.selectedCalendarMonth || app.selectedReportingMonth || "2026-09";
  const selectedMonthSummary = months.find((month) => month.month === selectedMonth)
    || months.find((month) => month.month === "2026-09")
    || months[0]
    || null;
  const selectedActualRows = (app.data.actualsMonthly?.rows || [])
    .filter((row) => row.month === selectedMonth)
    .sort((a, b) => Math.abs(Number(b.spend_variance || 0)) - Math.abs(Number(a.spend_variance || 0)));
  const actualSpend = selectedActualRows.reduce((sum, row) => sum + Number(row.actual_spend || 0), 0);
  const plannedSpend = selectedActualRows.reduce((sum, row) => sum + Number(row.planned_spend || 0), 0);
  const peakMonths = months
    .slice()
    .sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0))
    .slice(0, 4)
    .map((month) => ({
      month: month.month,
      label: formatMonth(month.month),
      budget: formatCurrency(month.budget),
      event_note: month.event_note || getMonthStatusLabel(month.month),
      calendar_weight: month.weight
    }));
  return {
    selected_month: selectedMonthSummary ? {
      month: selectedMonthSummary.month,
      label: formatMonth(selectedMonthSummary.month),
      budget: formatCurrency(selectedMonthSummary.budget),
      event_note: selectedMonthSummary.event_note || getMonthStatusLabel(selectedMonthSummary.month),
      top_channels: (selectedMonthSummary.topChannels || []).slice(0, 6).map((row) => ({
        channel: row.channel,
        budget: formatCurrency(row.budget),
        share_pct: selectedMonthSummary.budget > 0 ? round2((row.budget / selectedMonthSummary.budget) * 100) : 0
      }))
    } : null,
    selected_actuals: {
      month: selectedMonth,
      planned_spend: formatCurrency(plannedSpend),
      actual_spend: formatCurrency(actualSpend),
      variance: formatSignedCurrency(actualSpend - plannedSpend),
      status: app.data.actualsManifest?.status || "synthetic-simulated",
      largest_variances: selectedActualRows.slice(0, 6).map((row) => ({
        channel: row.channel,
        actual_spend: formatCurrency(row.actual_spend || 0),
        planned_spend: formatCurrency(row.planned_spend || 0),
        variance: formatSignedCurrency(row.spend_variance || 0),
        delivery_index: Number(row.delivery_index || 0).toFixed(2),
        sales_index: Number(row.sales_index || 0).toFixed(2)
      }))
    },
    peak_months: peakMonths,
    saved_campaigns: (app.oneOffCampaigns || []).slice(0, 5).map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      budget: formatCurrency(campaign.budget_usd || 0),
      product: campaign.product_label,
      basis: campaign.basis,
      months: campaign.month_labels || [],
      status: campaign.status
    }))
  };
}

function buildReportingDossier() {
  const view = REPORTING_VIEWS[app.selectedReportingView] || REPORTING_VIEWS.paid_search;
  const month = getReportingMonth(app.selectedReportingMonth);
  const rows = getReportingDrillRows(app.selectedReportingView, app.selectedReportingMonth);
  const totals = rows.reduce((memo, row) => {
    memo.cost += Number(row.cost || 0);
    memo.clicks += Number(row.clicks || 0);
    memo.impressions += Number(row.impressions || 0);
    memo.conversions += Number(row.conversions || 0);
    return memo;
  }, { cost: 0, clicks: 0, impressions: 0, conversions: 0 });
  const compactCount = rows.filter((row) => row.display_flag !== "MODELLED").length;
  const modelledCount = rows.filter((row) => row.display_flag === "MODELLED").length;
  const drillStatus = modelledCount && compactCount
    ? "SYNTHETIC + MODELLED"
    : modelledCount
      ? "MODELLED_FROM_BASELINE"
      : (app.data.reportingDrill?.display_flag || "SYNTHETIC");
  const currentKpis = getReportingKpis(app.selectedReportingView, app.selectedReportingMonth);
  return {
    design_reference: app.data?.referenceProvenance?.intermedia || null,
    view: {
      key: app.selectedReportingView,
      label: view.label,
      evidence: view.evidence,
      segment: app.reportingDrillSegment,
      cpa_mode: app.reportingCpaMode
    },
    month: {
      key: app.selectedReportingMonth,
      label: formatMonth(app.selectedReportingMonth),
      spend_baseline: formatCurrency(month?.spend_usd || currentKpis.spend || 0)
    },
    kpis: {
      spend: formatCurrency(currentKpis.spend || totals.cost),
      impressions: formatCompactNumber(currentKpis.impressions || totals.impressions),
      clicks: formatCompactNumber(currentKpis.clicks || totals.clicks),
      conversions: formatCompactNumber(currentKpis.conversions || totals.conversions),
      cpa: formatMoney(currentKpis.cpa || (totals.conversions ? totals.cost / totals.conversions : 0), 2)
    },
    line_items: {
      row_count: rows.length,
      display_flag: drillStatus,
      compact_count: compactCount,
      modelled_count: modelledCount,
      total_cost: formatCurrency(totals.cost),
      total_conversions: formatCompactNumber(totals.conversions),
      top_rows: rows.slice(0, 8).map((row) => ({
        platform: row.source_platform,
        campaign: row.campaign,
        line_item: row.line_item,
        segment: row.segment,
        cost: formatCurrency(row.cost || 0),
        conversions: formatCompactNumber(row.conversions || 0),
        cpa: formatMoney(row.cpa || 0, 2),
        status: row.data_status || row.display_flag || "synthetic-simulated"
      })),
      by_segment: summariseReportingRows(rows, "segment"),
      by_platform: summariseReportingRows(rows, "source_platform")
    }
  };
}

function summariseReportingRows(rows, key) {
  const grouped = rows.reduce((memo, row) => {
    const label = row[key] || "unknown";
    if (!memo[label]) memo[label] = { cost: 0, conversions: 0, rows: 0 };
    memo[label].cost += Number(row.cost || 0);
    memo[label].conversions += Number(row.conversions || 0);
    memo[label].rows += 1;
    return memo;
  }, {});
  return Object.entries(grouped)
    .sort(([, a], [, b]) => b.cost - a.cost)
    .slice(0, 6)
    .map(([label, value]) => ({
      label,
      rows: value.rows,
      cost: formatCurrency(value.cost),
      conversions: formatCompactNumber(value.conversions),
      cpa: formatMoney(value.conversions ? value.cost / value.conversions : 0, 2)
    }));
}

function buildKnowledgeGapDossier() {
  return [
    {
      label: "Paid SERP capture",
      status: "scoped provider cut loaded",
      next_step: "Use the 15 observed provider rows only as ad-presence/copy evidence; add priority-query live SERPs and client account data before spend, targeting or efficiency claims."
    },
    {
      label: "State-level comparative Trends",
      status: "loaded 2026-07-09",
      next_step: "51 same-request state comparisons are loaded for Karl's exact sportsbook set; never compare raw index levels across states."
    },
    {
      label: "Regulator verification",
      status: "pending Q003",
      next_step: "A named owner must verify state compliance claims before client use."
    },
    {
      label: "Admiral internal economics",
      status: "not available",
      next_step: "Replace spend, sales, MMM and platform estimates with client data when supplied."
    },
    {
      label: "Media owner policy rows",
      status: "authored working research",
      next_step: "Verify partner category rules, conflicts and sports inventory before recommendations."
    },
    {
      label: "ZIP3 and Census hardening",
      status: "working bridge",
      next_step: "Keep the Signal ZIP3 bridge labelled until Census/API-backed geography replaces it."
    }
  ];
}

function detectFreeMetaQuestion(text) {
  const clean = String(text || "").toLowerCase();
  if (/\b(what.*(not know|unknown|missing)|unknowns?|gaps?|caveats?|assumptions?|limitations?|what.*simulated|synthetic|real data|evidence|sources?)\b/i.test(clean)) {
    return {
      type: "evidence_boundary",
      matched: true,
      instruction: "Answer from knowledge_gaps, sources and data status first."
    };
  }
  if (/\b(can you|could you|do we|will this|what can)\b.*\b(plan|save|change|generate|replan|activate)\b/i.test(clean)) {
    return {
      type: "capability_boundary",
      matched: true,
      instruction: "Use engine_capability and explain which mode owns the action."
    };
  }
  return {
    type: "ordinary_question",
    matched: false,
    instruction: "Answer from the grounded dossier without changing the plan."
  };
}

function buildTalkToPlanState() {
  const plan = getPlan();
  const selectedMonth = app.selectedCalendarMonth;
  const monthlySummaries = app.data?.calendar?.draws ? buildMonthlySummaries(plan) : [];
  const selectedMonthSummary = monthlySummaries.find((month) => month.month === selectedMonth) || monthlySummaries.find((month) => month.month === "2026-09") || monthlySummaries[0] || null;
  const yearConversation = ensureChatConversation("year");
  const monthConversation = ensureChatConversation("month");
  const oneOffConversation = ensureChatConversation("oneoff");
  const latestYearPlan = yearConversation.lastComputedYearPlan || null;
  const latestBudget = Number(latestYearPlan?.budget_usd || 0);
  const activeBudget = Number(plan.total_allocated_gbp || 0);
  const monthScale = latestBudget > 0 && activeBudget > 0 ? latestBudget / activeBudget : 1;
  return {
    latest_year_plan: latestYearPlan,
    latest_month_revision: monthConversation.lastMonthRevision || (app.revisionDraft ? summariseMonthRevisionDraft(app.revisionDraft, { reason: "active in-session revision" }) : null),
    latest_one_off: oneOffConversation.lastOneOffDraft || (app.oneOffDraft ? summariseOneOffDraftOnly(app.oneOffDraft) : null),
    saved_campaigns: (app.oneOffCampaigns || []).slice(0, 5).map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      budget: formatCurrency(campaign.budget_usd || 0),
      product: campaign.product_label,
      basis: campaign.basis,
      months: campaign.month_labels || [],
      status: campaign.status
    })),
    selected_month: selectedMonthSummary ? {
      month: selectedMonthSummary.month,
      label: formatMonth(selectedMonthSummary.month),
      calendar_weight: selectedMonthSummary.weight,
      event_note: selectedMonthSummary.event_note,
      budget: formatCurrency(selectedMonthSummary.budget * monthScale),
      source_note: latestYearPlan
        ? "Scaled from the active monthly baseline shape to the latest Year chat plan budget."
        : "Active baseline monthly plan shape.",
      top_channels: selectedMonthSummary.topChannels.slice(0, 6).map((row) => ({
        channel: row.channel,
        budget: formatCurrency(row.budget * monthScale),
        share_pct: selectedMonthSummary.budget > 0 ? round2((row.budget / selectedMonthSummary.budget) * 100) : 0
      }))
    } : null,
    calendar_peaks: monthlySummaries
      .slice()
      .sort((a, b) => Number(b.weight || 0) - Number(a.weight || 0))
      .slice(0, 4)
      .map((month) => ({
        month: month.month,
        label: formatMonth(month.month),
        event_note: month.event_note,
        calendar_weight: month.weight,
        budget: formatCurrency(month.budget)
      }))
  };
}

function summariseOneOffDraftOnly(draft) {
  return {
    budget_usd: draft?.budget || null,
    products: (draft?.products || []).map(productLabel),
    months: draft?.months || [],
    states: (draft?.states || []).map((row) => row.state_code || row),
    objective: draft?.objective || "",
    basis: app.oneOffIncrementalityBasis || "",
    confidence: draft?.confidence || "draft"
  };
}

function buildDeterministicChatAnswer(text, modeKey, requestContext = null) {
  const mode = planningChatModes().find((item) => item.key === modeKey) || currentChatMode();
  const handler = mode.deterministic_handler || "annualPlanAnswer";
  let answer;
  if (handler === "freeQuestion") {
    const result = answerFreeQuestion(text, interpretPlanningDocument(text, "chat"));
    answer = {
      role: "assistant",
      title: result.title,
      body: result.body,
      chips: result.chips,
      createdAt: getDemoToday()
    };
  } else if (handler === "revisionPreview") {
    app.revisionDraft = buildRevisionDraft(getPlan(), app.selectedCalendarMonth);
    answer = {
      role: "assistant",
      title: `${formatMonth(app.selectedCalendarMonth)} revision preview`,
      body: `I froze ${formatNumber(app.revisionDraft.frozenMonths.length)} earlier months and produced ${formatNumber(app.revisionDraft.selectedDiff.length)} material channel deltas. The old-vs-new panel below now shows the deterministic diff.`,
      chips: [
        { label: "engine/revision.py", className: "status-working" },
        { label: "SYNTHETIC actuals", className: "status-synthetic" },
        { label: "diff visible", className: "status-working" }
      ],
      createdAt: getDemoToday()
    };
  } else if (handler === "oneOffGate") {
    const basisFromText = inferOneOffIncrementalityBasis(text);
    if (basisFromText) {
      app.oneOffIncrementalityBasis = basisFromText;
    }
    const parsed = mergeOneOffDraft(interpretPlanningDocument(text, "chat"));
    if (parsed.products?.length) {
      app.oneOffProduct = parsed.products[0];
      syncProductSelection(parsed.products[0]);
    } else if (app.oneOffProduct) {
      parsed.products = [app.oneOffProduct];
    }
    if (!app.oneOffIncrementalityBasis) {
      answer = {
        role: "assistant",
        title: "Incrementality basis needed",
        body: `Before I accept a one-off plan, say whether it is incremental on existing activity or standalone. Product is currently ${productLabel(app.oneOffProduct || app.selectedProduct)}.`,
        chips: [
          { label: "gate blocked", className: "status-review" },
          { label: "no plan accepted yet", className: "status-missing" },
          { label: "governance will run after basis", className: "status-working" }
        ],
        createdAt: getDemoToday()
      };
    } else {
      const planDoc = buildOneOffPlan(parsed);
      const basisLabel = app.oneOffIncrementalityBasis === "incremental" ? "Incremental on existing activity" : "Standalone";
      const hasGuardrails = planDoc.governance !== "clear in working source";
      const scopeLabel = planDoc.states.map((row) => row.state_code).join(", ") || "product-live states";
      const governanceLine = hasGuardrails
        ? `${planDoc.governance}; ${planDoc.blockedStates.join(", ")} cannot be activated from this demo plan until product/state evidence clears.`
        : "The selected product/state scope clears the working source.";
      answer = {
        role: "assistant",
        title: hasGuardrails ? "One-off refused by governance" : "One-off gate passed",
        body: hasGuardrails
          ? `Basis stamped as ${basisLabel}. I cannot activate or save ${planDoc.title} for ${scopeLabel}; ${governanceLine} Firewall receipt: ${planDoc.guardrailReceipts.join(", ")}.`
          : `Basis stamped as ${basisLabel}. I can draft ${planDoc.title} for ${scopeLabel}; ${governanceLine} The product/state firewall receipts remain attached before any plan is saved.`,
        chips: [
          { label: `basis: ${basisLabel}`, className: "status-working" },
          { label: hasGuardrails ? planDoc.governance : "governance checked", className: hasGuardrails ? "status-review" : "status-working" },
          { label: "SYNTHETIC economics", className: "status-synthetic" }
        ],
        createdAt: getDemoToday()
      };
    }
  } else {
    answer = buildAnnualPlanChatAnswer(text, requestContext);
  }
  return decorateChatAnswerWithMode(answer, mode, handler, requestContext);
}

function buildAnnualPlanChatAnswer(text, requestContext = null) {
  const plan = getPlan();
  const targetBudget = resolveAnnualPlanBudget(text, requestContext, plan);
  const rows = buildScaledAnnualChannelRows(plan, targetBudget);
  const totalBudget = rows.reduce((sum, row) => sum + row.budget, 0);
  const totalFtds = rows.reduce((sum, row) => sum + row.ftds, 0);
  const scopeCodes = getSelectedPlanningStateCodes(app.selectedProduct);
  const parsed = interpretPlanningDocument(text, "chat") || {};
  const products = parsed.products?.length ? parsed.products.map(productLabel).join(", ") : productLabel(app.selectedProduct);
  const scopeLabel = app.planningScope === "state"
    ? getSelectedStateName()
    : `${formatNumber(scopeCodes.length)} product-live states`;
  const tableRows = rows.map((row) => [
    row.channel,
    formatCurrency(row.budget),
    `${row.share.toFixed(1)}%`,
    formatNumber(row.ftds),
    formatMoney(row.cpa, 2)
  ]);
  tableRows.push([
    "**Total**",
    `**${formatCurrency(totalBudget)}**`,
    "**100.0%**",
    `**${formatNumber(totalFtds)}**`,
    `**${formatMoney(totalFtds > 0 ? totalBudget / totalFtds : 0, 2)}**`
  ]);
  return {
    role: "assistant",
    title: `${formatCurrency(targetBudget)} annual plan`,
    body: [
      `Annual plan for ${products}, scoped to ${scopeLabel}. The allocation uses the active plan-store channel shape and scales it to the briefed annual envelope.`,
      "",
      "| Channel | Budget | Share | FTD proxy | Media CPA |",
      "| --- | ---: | ---: | ---: | ---: |",
      ...tableRows.map((row) => `| ${row.join(" | ")} |`)
    ].join("\n"),
    chips: [
      { label: "plan store", className: "status-working" },
      { label: "SYNTHETIC economics", className: "status-synthetic" },
      { label: "governance receipts", className: "status-working" }
    ],
    actions: [
      { key: "save-year-plan", label: "Save to Flightpath" }
    ],
    documentType: "plan_table",
    createdAt: getDemoToday()
  };
}

function resolveAnnualPlanBudget(text, requestContext, plan) {
  const parsedBudget = interpretPlanningDocument(text, "chat")?.budget;
  if (parsedBudget) return parsedBudget;
  const dinkBudget = Number((requestContext?.dinks || []).find((dink) => dink.key === "budget")?.raw || 0);
  return dinkBudget || Number(plan.total_allocated_gbp || 0);
}

function buildScaledAnnualChannelRows(plan, targetBudget) {
  const sourceRows = (plan.channel_totals || []).filter((row) => Number(row.budget_gbp || 0) > 0);
  const sourceTotal = sourceRows.reduce((sum, row) => sum + Number(row.budget_gbp || 0), 0) || 1;
  const safeTarget = Number(targetBudget || plan.total_allocated_gbp || 0);
  let runningBudget = 0;
  let runningFtds = 0;
  return sourceRows.map((row, index) => {
    const sourceShare = Number(row.budget_gbp || 0) / sourceTotal;
    const isLast = index === sourceRows.length - 1;
    const budget = isLast ? round2(safeTarget - runningBudget) : round2(safeTarget * sourceShare);
    const ftdShare = Number(plan.forecast_acquisitions || 0) > 0
      ? Number(row.forecast_acquisitions || 0) / Number(plan.forecast_acquisitions || 1)
      : sourceShare;
    const totalFtds = Number(plan.forecast_acquisitions || 0) * (safeTarget / Math.max(Number(plan.total_allocated_gbp || 0), 1));
    const ftds = isLast ? Math.max(0, Math.round(totalFtds - runningFtds)) : Math.round(totalFtds * ftdShare);
    runningBudget += budget;
    runningFtds += ftds;
    return {
      channel: row.channel,
      budget,
      share: safeTarget > 0 ? (budget / safeTarget) * 100 : 0,
      ftds,
      cpa: ftds > 0 ? budget / ftds : 0
    };
  });
}

function decorateChatAnswerWithMode(answer, mode, handler, requestContext = null) {
  const productChip = requestContext?.productLabel
    ? [{ label: `Product: ${requestContext.productLabel}`, className: "status-working" }]
    : [];
  const basisChip = requestContext?.planningBasis
    ? [{ label: requestContext.planningBasis === "insight_led" ? "Basis: LLM insight-led" : "Basis: data-led", className: requestContext.planningBasis === "insight_led" ? "status-review" : "status-working" }]
    : [];
  const contextChips = (requestContext?.dinks || []).filter((dink) => !dink.isDefault).slice(0, 5).map((dink) => ({
    label: `${dink.label}: ${dink.value}`,
    className: "status-working"
  }));
  const attachmentChips = (requestContext?.attachments || []).slice(0, 2).map((attachment) => ({
    label: `attachment: ${attachment.name}`,
    className: "status-working"
  }));
  const capabilityChips = mode.key === "free" ? [] : getModeCapabilityChips(mode.key);
  const formatted = formatChatAnswer(answer.body, requestContext, mode, handler);
  const userFacingChips = [...productChip, ...basisChip, ...capabilityChips, ...contextChips, ...attachmentChips, ...(answer.chips || [])]
    .filter((chip) => !/^(?:llm:|engine:|engine\/revision\.py$|save:\s*flightpath|structured\b.*\bdinks\b)/i.test(String(chip.label || "")));
  return {
    ...answer,
    id: answer.id || `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    body: formatted.body,
    chips: userFacingChips,
    download: formatted.download,
    modeKey: mode.key,
    outputPanel: mode.output_panel,
    customInstructions: mode.custom_instructions
  };
}

function formatChatAnswer(body, requestContext, mode, handler) {
  const format = requestContext?.format || app.chatFormat;
  if (format === "table") {
    const rows = [
      ["Mode", mode.label],
      ["Engine capability", getModeCapability(mode.key).status],
      ...((requestContext?.dinks || []).filter((dink) => !dink.isDefault).map((dink) => [dink.label, dink.value])),
      ...((requestContext?.attachments || []).map((attachment) => ["Attachment", `${attachment.name} (${formatNumber(attachment.wordCount)} words)`]))
    ];
    return {
      body: `${body}\n\n| Field | Value |\n| --- | --- |\n${rows.map(([field, value]) => `| ${field} | ${String(value).replace(/\|/g, "/")} |`).join("\n")}`
    };
  }
  if (format === "csv") {
    const rows = [
      ["field", "value"],
      ["mode", mode.label],
      ["handler", handler],
      ["engine", requestContext?.engine || app.chatEngine],
      ["engine_capability", getModeCapability(mode.key).status],
      ["data_status", "synthetic demo economics / working research where governance is cited"],
      ["display_flag", "SYNTHETIC"],
      ["source_ids", "fanduel_plan_store_manifest_v1|fanduel_t111_benchmark_review_v1|us_state_governance_working_research_2026_07_03"],
      ...((requestContext?.dinks || []).map((dink) => [dink.label, dink.value])),
      ...((requestContext?.attachments || []).map((attachment) => ["attachment", `${attachment.name} (${attachment.wordCount} words)`]))
    ];
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    return {
      body: `CSV response prepared.\n\n\`\`\`csv\n${csv}\n\`\`\``,
      download: {
        label: "CSV",
        filename: `fanduel_chat_${mode.key}_${Date.now()}.csv`,
        mime: "text/csv",
        text: csv
      }
    };
  }
  return { body };
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function renderChatOverlay() {
  if (!app.activeChatOverlay) return "";
  const overlay = {
    scope: ["Scope", renderScopeOverlayBody()],
    firewall: ["Firewall quick view", renderFirewallOverlayBody()],
    plan: ["Plan versions", renderPlanOverlayBody()]
  }[app.activeChatOverlay] || ["Context", ""];
  return `
    <div class="tile-overlay" role="dialog" aria-modal="true">
      <article class="tile-overlay-panel">
        <div class="tile-overlay-head">
          <div>
            <span class="tile-overlay-eyebrow">Planning context</span>
            <h3>${escapeHtml(overlay[0])}</h3>
          </div>
          <button class="tile-overlay-close" type="button" data-chat-overlay-close aria-label="Close">x</button>
        </div>
        <div class="tile-overlay-body">${overlay[1]}</div>
      </article>
    </div>
  `;
}

function renderScopeOverlayBody() {
  const selected = new Set(getSelectedPlanningStateCodes(app.selectedProduct));
  return `
    <p>The chat scope follows the selected product first, then manual state overrides.</p>
    <div class="state-scope-map overlay-state-map">
      ${getStateRows().map((row) => `
        <button class="state-scope-tile ${selected.has(row.state_code) ? "auto-selected" : "excluded"} ${row.state_code === app.selectedState ? "is-detail" : ""}" type="button" data-state-scope-code="${escapeHtml(row.state_code)}">
          <span>${escapeHtml(row.state_code)}</span>
        </button>
      `).join("")}
    </div>
    ${renderScopeAudienceSizing(selected)}
  `;
}

function renderScopeAudienceSizing(selectedStates) {
  const personas = app.data.personas?.personas || [];
  const selected = selectedStates instanceof Set ? selectedStates : new Set(selectedStates || []);
  const matched = personas.filter((persona) => (persona.state_codes || []).some((code) => selected.has(code)));
  const visiblePersonas = matched.length ? matched : personas.slice(0, 4);
  const totalProxy = visiblePersonas.reduce((sum, persona) => sum + Number(persona.segment_size_proxy?.value || 0), 0);
  const scopeLabel = matched.length
    ? `${formatNumber(matched.length)} matched persona proxy${matched.length === 1 ? "" : "ies"}`
    : "No exact persona match; showing loaded proxies";
  return `
    <div class="scope-audience-panel">
      <div class="scope-audience-head">
        <div>
          <span>Audience sizing</span>
          <strong>${formatNumber(totalProxy)} proxy audience</strong>
        </div>
        <span class="pill watermark">working persona proxy</span>
      </div>
      <p>${escapeHtml(scopeLabel)} for ${escapeHtml(productLabel(app.selectedProduct))}. These are ZIP3/demographic working estimates, not Admiral audience data.</p>
      <div class="connector-grid scope-audience-grid">
        ${visiblePersonas.map((persona) => `
          <div class="connector-row">
            <strong>${escapeHtml(persona.label)}</strong>
            <span>${escapeHtml((persona.state_codes || []).join(", ") || persona.primary_state)} / ${formatNumber(persona.segment_size_proxy?.value || 0)} / ${escapeHtml(persona.segment_size_proxy?.status || "working")}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderFirewallOverlayBody() {
  const row = getFirewallStateRow() || getSelectedStateRow();
  const status = getProductStatus(row, app.selectedProduct);
  const rule = getProductRule(row, app.selectedProduct);
  return `
    <div class="tile-overlay-decision">${escapeHtml(row?.state || "Selected state")} ${escapeHtml(productLabel(app.selectedProduct))}: ${escapeHtml(formatStatus(status))}</div>
    <p>${escapeHtml(rule?.planning_action || row?.planning_action || "Route state/product claims to review.")}</p>
    <div class="pill-row">
      <span class="pill status-working">${escapeHtml(rule?.source_id || "us_state_governance_working_research_2026_07_03")}</span>
      <span class="pill status-review">${escapeHtml(rule?.review_status || "working source")}</span>
    </div>
    <button class="drawer-button overlay-link-button" type="button" data-open-surface="regulation">Open in Regulation</button>
  `;
}

function renderPlanOverlayBody() {
  return `
    <div class="connector-grid">
      ${(app.data.planStore?.entries || []).map((entry) => `
        <div class="connector-row">
          <strong>${escapeHtml(entry.meta.label || entry.meta.plan_id)}</strong>
          <span>v${escapeHtml(entry.meta.version || 1)} - ${escapeHtml(formatStatus(entry.meta.status || "stored"))}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function getLiveBriefText() {
  return $("#briefInput")?.value || "";
}

function getLiveBriefInterpretation() {
  return interpretPlanningDocument(getLiveBriefText(), "live brief");
}

function renderBriefOutput() {
  const container = $("#planningBriefOutput");
  if (!container) return;
  const result = getLiveBriefInterpretation();
  if (!result) {
    container.innerHTML = "";
    container.classList.add("is-hidden");
    return;
  }
  container.classList.remove("is-hidden");
  const stateNames = result.states.length
    ? result.states.map((row) => `${row.state_code} ${row.state}`).join(", ")
    : "No states detected";
  const products = result.products.map(productLabel).join(", ") || productLabel(app.selectedProduct);
  const months = result.months.length ? result.months.map(formatMonth).join(", ") : "Full year / not specified";
  const budget = result.budget ? formatCurrency(result.budget) : "Budget not found";
  container.innerHTML = `
    <div class="brief-output-grid">
      <article class="content-card">
        <p class="eyebrow">Brief readout</p>
        <h3>${escapeHtml(products)} / ${escapeHtml(result.periodType)}</h3>
        <p>${escapeHtml(budget)}. ${escapeHtml(months)}. ${escapeHtml(result.objective || "Objective not specified yet.")}</p>
        <div class="pill-row">
          <span class="pill status-working">deterministic parser</span>
          <span class="pill status-synthetic">no LLM in this pass</span>
          ${result.warnings.map((warning) => `<span class="pill status-review">${escapeHtml(warning)}</span>`).join("")}
        </div>
      </article>
      <article class="content-card">
        <p class="eyebrow">States detected</p>
        <h3>${escapeHtml(stateNames)}</h3>
        <p>Planning scope remains visible in the state selector; manual inclusions and exclusions are tagged in the map.</p>
        <div class="pill-row">
          <span class="pill status-working">governance matrix</span>
          <span class="pill status-review">legal review before claims</span>
        </div>
      </article>
    </div>
  `;
}

function renderModeWorkspace() {
  const container = $("#modeWorkspace");
  if (!container) return;
  const result = getLiveBriefInterpretation();
  if (!["free", "oneoff"].includes(app.selectedPlanningMode)) {
    container.classList.add("is-hidden");
    container.innerHTML = "";
    return;
  }
  container.classList.remove("is-hidden");
  if (app.selectedPlanningMode === "free") {
    container.innerHTML = renderFreeMode(result);
    return;
  }
  container.innerHTML = renderOneOffMode(result);
}

function renderFreeMode(result) {
  if (!isUnderstudyEnabled()) {
    const gaps = buildKnowledgeGapDossier().slice(0, 3);
    const reporting = buildReportingDossier();
    return `
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Free mode</p>
          <h2>Ask against the active plan</h2>
        </div>
        <span class="status ${escapeHtml(llmServiceStatus().className)}">${escapeHtml(llmServiceStatus().label)}</span>
      </div>
      <div class="content-grid two">
        <article class="content-card">
          <h3>Grounding loaded</h3>
          <p>${escapeHtml(getPlanMeta()?.label || getPlan().plan_id)} is active. Reporting context is ${escapeHtml(reporting.view.label)} for ${escapeHtml(reporting.month.label)} with ${formatNumber(reporting.line_items.row_count)} compact line-item rows.</p>
          <div class="pill-row">
            <span class="pill status-working">lookup-only</span>
            <span class="pill status-review">no plan generation</span>
          </div>
        </article>
        <article class="content-card">
          <h3>Known gaps</h3>
          <div class="note-list compact-notes">
            ${gaps.map((gap) => `<div class="note-item">${escapeHtml(gap.label)}: ${escapeHtml(gap.status)} - ${escapeHtml(gap.next_step)}</div>`).join("")}
          </div>
        </article>
      </div>
    `;
  }
  const answer = answerFreeQuestion(getLiveBriefText(), result);
  return `
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Free mode</p>
        <h2>Understudy answer surface</h2>
      </div>
      <span class="status status-review">scripted replay</span>
    </div>
    <div class="content-grid two">
      <article class="content-card">
        <h3>${escapeHtml(answer.title)}</h3>
        <p>${escapeHtml(answer.body)}</p>
        <div class="pill-row">
          ${answer.chips.map((chip) => `<span class="pill ${escapeHtml(chip.className)}">${escapeHtml(chip.label)}</span>`).join("")}
        </div>
      </article>
      <article class="content-card">
        <h3>Critique current plan</h3>
        <div class="note-list compact-notes">
          ${buildPlanCritique().map((note) => `<div class="note-item">${escapeHtml(note)}</div>`).join("")}
        </div>
      </article>
    </div>
  `;
}

function answerFreeQuestion(text, result) {
  const clean = String(text || "").toLowerCase();
  if (/simulated|synthetic|real data|what data/i.test(clean)) {
    return {
      title: "What is simulated",
      body: "The SDE actuals, promo-cost model, ZIP3 media spend and response curves are synthetic or working estimates. Governance rows, FanDuel-owned availability receipts, Census population and the search scan are source-backed working evidence.",
      chips: [
        { label: "SYNTHETIC actuals", className: "status-synthetic" },
        { label: "source-backed governance", className: "status-working" },
        { label: "paid SERP scoped", className: "status-review" }
      ]
    };
  }
  if (detectFreeMetaQuestion(text).type === "evidence_boundary") {
    const gaps = buildKnowledgeGapDossier();
    return {
      title: "What we still do not know",
      body: [
        "The demo is useful now, but these are the boundaries I would keep visible before Karl or a client room:",
        ...gaps.map((gap) => `${gap.label}: ${gap.status}. ${gap.next_step}`)
      ].join("\n"),
      chips: [
        { label: "evidence boundaries", className: "status-review" },
        { label: "no hidden assumptions", className: "status-working" },
        { label: "paid SERP scoped", className: "status-review" }
      ]
    };
  }
  if (app.freePageContext && /\b(this|page|context|grid|report|period|calendar|flightpath|insights?|regulation|state)\b/i.test(clean)) {
    const context = app.freePageContext;
    return {
      title: `${context.label || "Page"} context`,
      body: [
        context.body || "This page context was carried in from the output page.",
        context.question ? `Prompt carried into Free chat: ${context.question}` : "",
        context.source_ids?.length ? `Attached receipts: ${context.source_ids.join(", ")}.` : ""
      ].filter(Boolean).join("\n"),
      chips: [
        { label: "page context", className: "status-working" },
        ...(context.chips || []).slice(0, 2).map((chip) => ({ label: chip, className: "status-working" }))
      ]
    };
  }
  if (/reporting|paid search|paid social|social|tv|video|line item|line-item|brand\/dr|brand dr|cpa|cac/i.test(clean)) {
    const reporting = buildReportingDossier();
    const topRows = reporting.line_items.top_rows.slice(0, 5).map((row) => `${row.platform} / ${row.line_item}: ${row.cost}, ${row.conversions} conversions, ${row.cpa} CPA`);
    return {
      title: "Reporting detail available",
      body: [
        `${reporting.month.label} ${reporting.view.label} has ${reporting.kpis.spend} spend, ${reporting.kpis.conversions} conversions and ${reporting.kpis.cpa} ${reporting.view.cpa_mode === "all_in" ? "all-in CAC" : "media CPA"}.`,
        `${formatNumber(reporting.line_items.row_count)} line-item rows are loaded (${formatNumber(reporting.line_items.compact_count || 0)} compact, ${formatNumber(reporting.line_items.modelled_count || 0)} modelled) with ${reporting.line_items.display_flag} status.`,
        topRows.length ? `Top rows: ${topRows.join("; ")}.` : "No compact line-item rows are loaded for this reporting view/month."
      ].join("\n"),
      chips: [
        { label: "Reporting grounded", className: "status-working" },
        { label: reporting.line_items.display_flag, className: "status-synthetic" },
        { label: `Brand/DR: ${formatStatus(reporting.view.segment)}`, className: "status-working" }
      ]
    };
  }
  if (/flightpath|month|monthly|calendar|campaign|saved|overlay|one-off|one off|what.*plan/i.test(clean)) {
    const flightpath = buildFlightpathDossier(getPlan());
    const selected = flightpath.selected_month;
    const campaigns = flightpath.saved_campaigns || [];
    const variance = flightpath.selected_actuals?.variance || "$0";
    return {
      title: "Flightpath context",
      body: [
        selected
          ? `${selected.label} is the selected Flightpath month: ${selected.budget} planned, ${selected.event_note}. Top channels are ${selected.top_channels.map((row) => `${row.channel} ${row.budget}`).join("; ")}.`
          : "No selected Flightpath month is loaded.",
        `Synthetic actuals for the selected month show ${flightpath.selected_actuals?.actual_spend || "$0"} actual vs ${flightpath.selected_actuals?.planned_spend || "$0"} planned (${variance}).`,
        campaigns.length
          ? `Saved campaign overlays: ${campaigns.map((campaign) => `${campaign.id} ${campaign.budget} ${campaign.product}`).join("; ")}.`
          : "No saved one-off campaign overlays are currently in the local Flightpath store."
      ].join("\n"),
      chips: [
        { label: "Flightpath grounded", className: "status-working" },
        { label: "SYNTHETIC actuals", className: "status-synthetic" },
        { label: campaigns.length ? "campaign overlays loaded" : "no saved overlays", className: campaigns.length ? "status-working" : "status-review" }
      ]
    };
  }
  if (detectFreeMetaQuestion(text).type === "capability_boundary") {
    const capability = getModeCapability("free");
    return {
      title: "Free mode boundary",
      body: `${capability?.label || "Free chat"} is ${formatStatus(capability?.status || "lookup_only")}. It can answer grounded questions and draft ideas-canvas notes, but it cannot generate or accept a plan. Use Year, Month or One-off when you want the deterministic tools to change the plan.`,
      chips: [
        { label: "Free: lookup only", className: "status-working" },
        { label: "no plan generation", className: "status-review" }
      ]
    };
  }
  if (/overspend|pacing|q1|actual/i.test(clean)) {
    const q1Rows = (app.data.actualsMonthly?.rows || []).filter((row) => row.month >= "2026-01" && row.month <= "2026-03");
    const planned = q1Rows.reduce((sum, row) => sum + Number(row.planned_spend || 0), 0);
    const actual = q1Rows.reduce((sum, row) => sum + Number(row.actual_spend || 0), 0);
    const delta = planned ? ((actual - planned) / planned) * 100 : 0;
    return {
      title: "Q1 pacing read",
      body: `SDE synthetic actuals put Q1 at ${formatCurrency(actual)} vs ${formatCurrency(planned)} planned, a ${delta >= 0 ? "+" : ""}${delta.toFixed(1)}% spend variance. Use the monthly revision flow before moving budget forward.`,
      chips: [
        { label: "SDE actuals", className: "status-synthetic" },
        { label: "monthly revision", className: "status-working" }
      ]
    };
  }
  return {
    title: "Planning answer",
    body: `The deterministic parser reads ${result?.budget ? formatCurrency(result.budget) : "the loaded brief"} as a ${result?.periodType || "year"} plan for ${result?.products?.map(productLabel).join(", ") || productLabel(app.selectedProduct)}. It will use product-live states first, then show manual state overrides visibly.`,
    chips: [
      { label: "deterministic answer", className: "status-working" },
      { label: "no dead end", className: "status-synthetic" }
    ]
  };
}

function buildPlanCritique() {
  const selectedCodes = getSelectedPlanningStateCodes(app.selectedProduct);
  const warnings = [
    "The 15-row paid-SERP provider cut shows limited ad presence and copy only, so paid-search efficiency remains a modelled planning view.",
    "State availability is FanDuel-owned working research; regulator verification remains the client-facing gate.",
    "CRM remains parked as acquisition for now and should be reviewed once real first-party data is available."
  ];
  if (!selectedCodes.length) {
    warnings.unshift("No states are currently selected for the product plan.");
  }
  if (app.selectedProduct === "casino") {
    warnings.unshift("Casino should stay restricted to CT, MI, NJ, PA and WV until another source is verified.");
  }
  return warnings;
}

function inferOneOffIncrementalityBasis(text) {
  const clean = String(text || "").toLowerCase();
  if (/\b(standalone|stand-alone|separate|new campaign from scratch)\b/.test(clean)) {
    return "standalone";
  }
  if (/\b(incremental|incrementality|on top|extra|additional|add(?:ing)?|existing activity|incremental on existing)\b/.test(clean)) {
    return "incremental";
  }
  return "";
}

function mergeOneOffDraft(parsed) {
  const previous = app.oneOffDraft || {};
  const next = {
    sourceName: "one-off chat",
    products: parsed?.products?.length ? parsed.products : previous.products || [],
    excludedProducts: parsed?.excludedProducts?.length ? parsed.excludedProducts : previous.excludedProducts || [],
    months: parsed?.months?.length ? parsed.months : previous.months || [],
    states: parsed?.states?.length ? parsed.states : previous.states || [],
    budget: parsed?.budget || previous.budget || null,
    objective: parsed?.objective || previous.objective || "",
    launchPath: parsed?.launchPath || previous.launchPath || "",
    periodType: parsed?.periodType && (parsed.months?.length || parsed?.periodType !== "year")
      ? parsed.periodType
      : previous.periodType || parsed?.periodType || "year",
    warnings: [],
    confidence: "medium"
  };
  if (!next.budget) next.warnings.push("budget missing");
  if (!next.products.length) next.warnings.push("product missing");
  if (!next.states.length) next.warnings.push("states missing");
  if (!next.months.length && next.periodType !== "year") next.warnings.push("timing missing");
  next.confidence = [next.budget, next.products.length, next.states.length, next.months.length || next.periodType === "year"].filter(Boolean).length >= 3
    ? "high"
    : "medium";
  app.oneOffDraft = next;
  return next;
}

function renderOneOffMode(result) {
  const parsed = result || app.oneOffDraft || getLiveBriefInterpretation();
  const planDoc = buildOneOffPlan(parsed);
  const isBlocked = planDoc.blockedStates.length > 0;
  const savedCampaign = app.oneOffDraft?.savedCampaignId
    ? (app.oneOffCampaigns || []).find((campaign) => campaign.id === app.oneOffDraft.savedCampaignId)
    : null;
  return `
    <div class="panel-heading">
      <div>
        <p class="eyebrow">One-off mode</p>
        <h2>Brief to governed campaign plan</h2>
      </div>
      <div class="panel-actions">
        ${savedCampaign
          ? `<span class="status status-working">Saved ${escapeHtml(savedCampaign.id)}</span>`
          : `<button class="small-action" type="button" data-save-oneoff ${isBlocked ? "disabled" : ""}>${isBlocked ? "Blocked by governance" : "Save campaign"}</button>`}
        <span class="status status-synthetic">deterministic allocation</span>
      </div>
    </div>
    <div class="content-grid two">
      <article class="content-card">
        <h3>${escapeHtml(planDoc.title)}</h3>
        <p>${escapeHtml(planDoc.summary)}</p>
        <div class="planning-readout">
          <article class="readout-item"><span>Budget</span><strong>${formatCurrency(planDoc.budget)}</strong></article>
          <article class="readout-item"><span>States</span><strong>${formatNumber(planDoc.states.length)}</strong></article>
          <article class="readout-item"><span>Guardrail</span><strong>${escapeHtml(planDoc.governance)}</strong></article>
        </div>
        <div class="pill-row">
          ${planDoc.chips.map((chip) => `<span class="pill ${escapeHtml(chip.className)}">${escapeHtml(chip.label)}</span>`).join("")}
        </div>
      </article>
      <article class="content-card">
        <h3>Seven-layer plan document</h3>
        <div class="note-list compact-notes">
          ${planDoc.layers.map((layer) => `<div class="note-item"><strong>${escapeHtml(layer.label)}:</strong> ${escapeHtml(layer.body)}</div>`).join("")}
        </div>
      </article>
    </div>
    ${app.oneOffCampaigns.length ? `
      <div class="pill-row">
        ${app.oneOffCampaigns.slice(0, 4).map((campaign) => `<span class="pill status-working">saved ${escapeHtml(campaign.id)}</span>`).join("")}
      </div>
    ` : ""}
  `;
}

const CAMPAIGN_MINIMUM_CHANNEL_MAP = {
  "Linear TV": "AV",
  "CTV": "CTV/YouTube",
  "YouTube": "CTV/YouTube",
  "Paid Search": "Paid Search",
  "Paid Social": "Paid Social",
  "Radio/Audio": "Audio",
  "Display": "Display/Programmatic"
};

const SMALL_ENVELOPE_CORE_CHANNELS = new Set(["Paid Search", "Paid Social", "CTV", "Display", "Affiliate"]);

function campaignActiveSpendByChannel(month) {
  return new Map((app.data.actualsMonthly?.rows || [])
    .filter((row) => row.month === month && row.buyable !== false)
    .map((row) => [row.channel, Number(row.planned_spend || row.actual_spend || 0)]));
}

function buildCampaignChannelAllocations(planView, campaignBudget, options = {}) {
  const rows = [...(planView.channel_totals || [])]
    .filter((row) => Number(row.budget_gbp || 0) > 0)
    .sort((a, b) => Number(b.budget_gbp || 0) - Number(a.budget_gbp || 0));
  const isSmallEnvelope = Number(campaignBudget || 0) <= 1000000;
  const month = options.month || "";
  const activeSpend = campaignActiveSpendByChannel(month);
  const minimums = app.data.mediaMinimums?.min_monthly_spend_gbp || {};
  const excludedChannels = [];
  const eligibleRows = isSmallEnvelope
    ? rows.filter((row) => {
      if (SMALL_ENVELOPE_CORE_CHANNELS.has(row.channel)) return true;
      const minimumType = CAMPAIGN_MINIMUM_CHANNEL_MAP[row.channel];
      const proportionalBudget = Number(campaignBudget || 0) * (Number(row.share_pct || 0) / 100);
      if (minimumType && Number(minimums[minimumType] || 0) > proportionalBudget) {
        excludedChannels.push({
          channel: row.channel,
          reason: `${row.channel} excluded: below minimum viable buy (${formatCurrency(minimums[minimumType])} working channel floor; proportional buy ${formatCurrency(proportionalBudget)}).`,
          source_ids: ["universal_media_minimums_v1"]
        });
        return false;
      }
      excludedChannels.push({
        channel: row.channel,
        reason: `${row.channel} excluded: no approved small-envelope activation floor is loaded for this campaign subset.`,
        source_ids: ["universal_media_minimums_v1"]
      });
      return false;
    })
    : rows;
  const coreRows = eligibleRows.length ? eligibleRows : rows;
  const floorFor = (row) => isSmallEnvelope
    ? Number(minimums[CAMPAIGN_MINIMUM_CHANNEL_MAP[row.channel]] || 0)
    : 0;
  const totalFloors = coreRows.reduce((sum, row) => sum + floorFor(row), 0);
  const availableBudget = Math.max(0, Number(campaignBudget || 0) - totalFloors);
  const scoreFor = (row) => {
    const cpa = Number(row.forecast_cpa_gbp || row.paid_media_cpa_gbp || 1);
    const currentSpend = Number(activeSpend.get(row.channel) || 0);
    return (1 / Math.max(1, cpa)) * (1 / (1 + (currentSpend / Math.max(1, Number(campaignBudget || 1)))));
  };
  const totalScore = coreRows.reduce((sum, row) => sum + scoreFor(row), 0) || 1;
  let runningBudget = 0;
  const allocations = coreRows.map((row, index) => {
    const baseFloor = floorFor(row);
    const extra = index === coreRows.length - 1
      ? Math.max(0, Number(campaignBudget || 0) - runningBudget - baseFloor)
      : round2(availableBudget * (scoreFor(row) / totalScore));
    const budget = round2(baseFloor + extra);
    runningBudget += budget;
    const baseCpa = Number(row.forecast_cpa_gbp || row.paid_media_cpa_gbp || 0);
    const currentSpend = Number(activeSpend.get(row.channel) || 0);
    const incrementalPenalty = options.incremental
      ? Math.min(0.18, 0.04 + (currentSpend / Math.max(1, Number(campaignBudget || 1))) * 0.04)
      : 0;
    const cpa = baseCpa > 0 ? round2(baseCpa * (1 + incrementalPenalty)) : 0;
    return {
      channel: row.channel,
      share_pct: Number(campaignBudget || 0) > 0 ? round2((budget / Number(campaignBudget || 1)) * 100) : 0,
      budget_usd: budget,
      ftd_proxy: cpa > 0 ? Math.round(budget / cpa) : 0,
      cpa_usd: cpa || null,
      baseline_cpa_usd: baseCpa || null,
      active_month_spend_usd: currentSpend,
      source_ids: [...new Set([...(row.source_ids || []), "universal_media_minimums_v1"])]
    };
  });
  return { allocations, excludedChannels };
}

function legacyCampaignChannelAllocations(planView, campaignBudget) {
  const rows = [...(planView.channel_totals || [])]
    .filter((row) => Number(row.budget_gbp || 0) > 0)
    .sort((a, b) => Number(b.budget_gbp || 0) - Number(a.budget_gbp || 0));
  const totalShare = rows.reduce((sum, row) => sum + Number(row.share_pct || 0), 0) || 100;
  let runningBudget = 0;
  return rows.map((row, index) => {
    const share = totalShare > 0 ? (Number(row.share_pct || 0) / totalShare) * 100 : 0;
    const budget = index === rows.length - 1
      ? round2(Number(campaignBudget || 0) - runningBudget)
      : round2(Number(campaignBudget || 0) * (share / 100));
    runningBudget += budget;
    const cpa = Number(row.forecast_cpa_gbp || row.paid_media_cpa_gbp || 0);
    return {
      channel: row.channel,
      share_pct: round2(share),
      budget_usd: budget,
      ftd_proxy: cpa > 0 ? Math.round(budget / cpa) : 0,
      cpa_usd: cpa > 0 ? round2(cpa) : null,
      source_ids: row.source_ids || ["fanduel_plan_store_manifest_v1"]
    };
  });
}

function buildCampaignOverlayRows(channelAllocations, months, basis) {
  if (!months.length) return [];
  return channelAllocations.flatMap((channel) => {
    const monthlyBudget = round2(Number(channel.budget_usd || 0) / months.length);
    const monthlyFtd = Math.round(Number(channel.ftd_proxy || 0) / months.length);
    return months.map((month) => ({
      month,
      channel: channel.channel,
      budget_usd: monthlyBudget,
      ftd_proxy: monthlyFtd,
      basis,
      source_id: "fanduel_campaign_overlay_object_v1"
    }));
  });
}

function buildOneOffPlan(result) {
  const productKey = result?.products?.[0] || app.selectedProduct;
  const productName = productLabel(productKey);
  const budget = result?.budget || getPlan().total_allocated_gbp / 12;
  const rawMonths = result?.months?.length ? [...new Set(result.months)].sort() : [];
  const basis = app.oneOffIncrementalityBasis || "missing";
  const launchPath = result?.launchPath || app.oneOffDraft?.launchPath || "";
  const isNewProductLaunch = launchPath === "new_product";
  const productLiveStates = getSelectedPlanningStateCodes(productKey).map((code) => app.data.governance.state_rows.find((row) => row.state_code === code)).filter(Boolean);
  const states = result?.states?.length
    ? result.states
    : isNewProductLaunch
      ? getStateRows()
      : productLiveStates.length
      ? productLiveStates
      : basis === "standalone"
        ? getStateRows()
        : [];
  const blockedStates = isNewProductLaunch
    ? states
    : states.filter((row) => isActivationSuppressed(getProductStatus(row, productKey)));
  const guardrailReceipts = blockedStates.map((row) => {
    if (isNewProductLaunch) return `${row.state_code}:custom_product_working_default`;
    const rule = getProductRule(row, productKey);
    return `${row.state_code}:${rule?.source_id || "us_state_governance_working_research_2026_07_03"}`;
  });
  const planView = buildPlanView(getPlan(), states[0] || getSelectedStateRow());
  const allocationResult = buildCampaignChannelAllocations(planView, budget, {
    month: rawMonths[0] || app.selectedCalendarMonth,
    incremental: basis === "incremental"
  });
  const channelAllocations = allocationResult.allocations;
  const excludedChannels = allocationResult.excludedChannels;
  const topChannels = channelAllocations.slice(0, 4);
  const months = rawMonths.length ? rawMonths.map(formatMonth).join(", ") : "Annual baseline";
  const governance = isNewProductLaunch
    ? `${blockedStates.length} jurisdiction not-listed defaults; activation held`
    : blockedStates.length ? `${blockedStates.length} state guardrails` : "clear in working source";
  const forecastFtd = channelAllocations.reduce((sum, row) => sum + Number(row.ftd_proxy || 0), 0);
  const blendedCpa = forecastFtd > 0 ? round2(budget / forecastFtd) : null;
  const baselineFtd = channelAllocations.reduce((sum, row) => sum + (row.baseline_cpa_usd ? Number(row.budget_usd || 0) / row.baseline_cpa_usd : 0), 0);
  const baselineCpa = baselineFtd > 0 ? round2(budget / baselineFtd) : null;
  const selectedStateCodes = new Set(states.map((row) => row.state_code));
  const personas = (isNewProductLaunch ? [] : app.data.personas?.personas || [])
    .filter((persona) => (persona.state_codes || []).some((code) => selectedStateCodes.has(code)))
    .filter((persona) => persona.product_governance?.[productKey] !== "blocked-working-source")
    .map((persona) => ({
      label: persona.label,
      sizeProxy: Number(persona.segment_size_proxy?.value || 0),
      states: persona.state_codes || [],
      fit: (persona.planning_use || [])[0] || "Working persona fit from the loaded research seed."
    }));
  const activeChannel = [...channelAllocations]
    .filter((row) => Number(row.active_month_spend_usd || 0) > 0)
    .sort((a, b) => Number(b.active_month_spend_usd || 0) - Number(a.active_month_spend_usd || 0))[0] || null;
  const incrementalMath = basis === "incremental" && activeChannel
    ? `${formatMonth(rawMonths[0] || app.selectedCalendarMonth)} already carries ${formatCurrency(activeChannel.active_month_spend_usd)} in ${activeChannel.channel}; incremental dollars shift to the eligible small-envelope channels after diminishing-returns penalties.`
    : basis === "incremental"
      ? "Incremental basis is stamped, but no active-month channel carryover was found; the plan applies only the bounded incremental penalty available in the deterministic channel model."
      : "Standalone basis is stamped; no diminishing-returns penalty is applied and no incremental comparison is claimed.";
  const measurementLabel = basis === "incremental" ? "Recommended incremental media CPA" : "Recommended standalone media CPA";
  const scopeLabel = isNewProductLaunch
    ? `National working default (${states.length} jurisdictions; no activation)`
    : states.map((row) => row.state_code).join(", ") || "product-live states";
  const channelRationale = isNewProductLaunch
    ? "The allocation is a baseline-shaped rehearsal across currently modelled channels only. No Racing-specific audience response, publisher/rights availability or channel performance is loaded, so no channel is presented as a proven Racing optimum."
    : "The allocation uses the deterministic campaign subset and its minimum-buy, active-spend and CPA proxy rules.";
  return {
    title: `${productName} one-off campaign`,
    budget,
    productKey,
    productName,
    basis,
    launchPath,
    isNewProductLaunch,
    months: rawMonths,
    periodLabel: months,
    scopeLabel,
    states,
    governance,
    blockedStates: blockedStates.map((row) => row.state_code),
    guardrailReceipts,
    channelAllocations,
    excludedChannels,
    personas,
    forecastFtd,
    blendedCpa,
    baselineCpa,
    measurementLabel,
    incrementalMath,
    overlayRows: buildCampaignOverlayRows(channelAllocations, rawMonths, basis),
    summary: `${months}; ${scopeLabel}; ${topChannels.map((row) => row.channel).join(", ")} lead the rehearsal media shape.`,
    chips: [
      { label: "governance gate applied", className: blockedStates.length ? "status-review" : "status-working" },
      { label: "SYNTHETIC economics", className: "status-synthetic" },
      { label: blockedStates.length ? "activation blocked" : "can save as campaign", className: blockedStates.length ? "status-missing" : "status-working" }
    ],
    layers: [
      { label: "1. Brief", body: result?.objective || "Objective not specified; default to FTD acquisition planning." },
      { label: "2. Governance", body: isNewProductLaunch ? `New-product rule applied: not listed in all ${states.length} jurisdictions until a verified product/state source is loaded; activation is held. Receipt: custom_product_working_default.` : blockedStates.length ? `${blockedStates.map((row) => row.state_code).join(", ")} require suppression or watchlist treatment.` : "Selected states clear the working product-availability source." },
      { label: "3. State scope", body: scopeLabel },
      { label: "4. Audience", body: personas.length ? personas.map((persona) => `${persona.label} (${formatNumber(persona.sizeProxy)} working proxy; ${persona.states.join(", ")})`).join("; ") : isNewProductLaunch ? `No verified ${productName}-specific persona or response evidence is loaded; generic Sportsbook personas are deliberately not substituted.` : "No matching working persona seed is loaded for this scope." },
      { label: "5. Calendar", body: months },
      { label: "6. Channel allocation", body: `${channelRationale} ${topChannels.map((row) => `${row.channel} ${row.share_pct.toFixed(1)}%`).join("; ")}. ${excludedChannels.map((row) => row.reason).join(" ")}`.trim() },
      { label: "7. Measurement", body: basis === "incremental"
        ? `${measurementLabel}: ${formatMoney(blendedCpa, 2)}${baselineCpa ? ` versus ${formatMoney(baselineCpa, 2)} before the incremental penalty` : ""}; the target is higher only where the active-month baseline is already carrying spend and diminishing returns are applied. ${incrementalMath}`
        : `${measurementLabel}: ${formatMoney(blendedCpa, 2)}. This standalone result does not include or claim an incremental penalty. ${incrementalMath}` },
      { label: "8. Evidence", body: "Attach governance, spend baseline, SDE manifest, minimum-buy and persona receipts before rehearsal." }
    ]
  };
}

function buildCampaignObject(planDoc, draft = app.oneOffDraft || {}) {
  const savedIndex = (app.oneOffCampaigns || []).length + 1;
  const id = `FD_CAMPAIGN_${String(savedIndex).padStart(3, "0")}`;
  const stateCodes = (planDoc.states || []).map((row) => row.state_code).filter(Boolean);
  const monthLabels = (planDoc.months || []).map(formatMonth);
  return {
    id,
    object_type: "campaign_overlay",
    status: "draft_saved",
    created_at: getDemoToday(),
    title: planDoc.title,
    product_key: planDoc.productKey,
    product_label: planDoc.productName,
    basis: planDoc.basis,
    budget_usd: round2(planDoc.budget),
    months: planDoc.months || [],
    month_labels: monthLabels,
    period_label: planDoc.periodLabel,
    state_codes: stateCodes,
    state_count: stateCodes.length,
    objective: draft.objective || planDoc.layers?.[0]?.body || "",
    governance: planDoc.governance,
    blocked_states: planDoc.blockedStates || [],
    guardrail_receipts: planDoc.guardrailReceipts || [],
    channel_allocations: planDoc.channelAllocations || [],
    overlay_rows: planDoc.overlayRows || [],
    display_flag: "SYNTHETIC campaign economics",
    source_ids: [
      "fanduel_campaign_overlay_object_v1",
      "fanduel_planning_engine_capabilities_v1",
      "us_state_governance_working_research_2026_07_03",
      "fanduel_plan_store_manifest_v1"
    ],
    planDoc
  };
}

function saveCampaignPlanDoc(planDoc, draft = app.oneOffDraft || {}) {
  if (planDoc.blockedStates.length) {
    return null;
  }
  const existingId = draft.savedCampaignId;
  const existing = existingId ? (app.oneOffCampaigns || []).find((item) => item.id === existingId) : null;
  if (existing) return existing;
  const campaign = buildCampaignObject(planDoc, draft);
  app.oneOffCampaigns.unshift(campaign);
  persistCampaignStore();
  app.oneOffDraft = { ...draft, savedCampaignId: campaign.id };
  const conversation = ensureChatConversation("oneoff");
  conversation.messages = conversation.messages.map((message) =>
    Array.isArray(message.actions) && message.actions.some((action) => action.key === "save-oneoff")
      ? { ...message, actions: [] }
      : message
  );
  conversation.messages.push({
    role: "assistant",
    title: "Campaign saved to Flightpath",
    body: `${campaign.title} is saved as ${campaign.id}. It overlays ${campaign.month_labels.length ? campaign.month_labels.join(", ") : "the active annual plan"} in Flightpath as a ${campaign.basis === "incremental" ? "incremental" : "standalone"} campaign object.`,
    chips: [
      { label: "campaign object", className: "status-working" },
      { label: campaign.basis === "incremental" ? "incremental overlay" : "standalone overlay", className: "status-working" },
      { label: "SYNTHETIC economics", className: "status-synthetic" }
    ],
    createdAt: getDemoToday()
  });
  conversation.updatedAt = getDemoToday();
  persistChatSessions();
  return campaign;
}

function saveOneOffCampaign() {
  return saveCampaignPlanDoc(buildOneOffPlan(app.oneOffDraft || getLiveBriefInterpretation()), app.oneOffDraft || {});
}

function toggleCollapsedRow(targetId, button) {
  const target = document.getElementById(targetId);
  if (!target) return;
  if (app.collapsedRows.has(targetId)) {
    app.collapsedRows.delete(targetId);
    target.classList.remove("is-collapsed");
    button.textContent = "-";
    button.setAttribute("aria-expanded", "true");
  } else {
    app.collapsedRows.add(targetId);
    target.classList.add("is-collapsed");
    button.textContent = "+";
    button.setAttribute("aria-expanded", "false");
  }
}

function applyCollapsedRows() {
  (app.collapsedRows || new Set()).forEach((targetId) => {
    const target = document.getElementById(targetId);
    const button = document.querySelector(`[data-collapse-target="${targetId}"]`);
    target?.classList.add("is-collapsed");
    if (button) {
      button.textContent = "+";
      button.setAttribute("aria-expanded", "false");
    }
  });
}

function applyZip3Control(action) {
  const panStep = 42 / app.zip3Zoom;
  if (action === "zoom-in") app.zip3Zoom = clampNumber(app.zip3Zoom + 0.25, 1, 3);
  if (action === "zoom-out") app.zip3Zoom = clampNumber(app.zip3Zoom - 0.25, 1, 3);
  if (action === "left") app.zip3PanX += panStep;
  if (action === "right") app.zip3PanX -= panStep;
  if (action === "up") app.zip3PanY += panStep;
  if (action === "down") app.zip3PanY -= panStep;
  if (action === "reset") {
    app.zip3Zoom = ZIP3_DEFAULT_VIEW.zoom;
    app.zip3PanX = ZIP3_DEFAULT_VIEW.panX;
    app.zip3PanY = ZIP3_DEFAULT_VIEW.panY;
  }
  persistZip3ViewPreference();
  renderPlanningExtensions();
  if (app.selectedSurface === "reporting") renderReporting();
  if (app.selectedSurface === "audience") renderAudienceSurface();
}

function handleDownload(kind) {
  if (kind === "planning-note") {
    downloadFile("fanduel_planning_note.txt", buildPlanningNote(), "text/plain");
    return;
  }
  if (kind === "flightpath-note") {
    downloadFile("fanduel_flightpath_note.txt", buildFlightpathNote(), "text/plain");
    return;
  }
  if (kind === "reporting-note") {
    downloadFile("fanduel_reporting_note.txt", buildReportingNote(), "text/plain");
    return;
  }
  if (kind === "board-pack") {
    downloadStaticFile("../output/FanDuel_Board_Pack_T178.pptx", "FanDuel_Board_Pack_T178.pptx");
    return;
  }
  if (kind === "calendar-ics") {
    downloadFile(`fanduel_fixture_calendar_${app.selectedCalendarMonth}.ics`, buildCalendarIcsExport(), "text/calendar");
    return;
  }
  const rows = {
    "planning-grid": exportPlanningGridRows,
    "flightpath-grid": exportFlightpathGridRows,
    allocation: exportAllocationRows,
    "state-budget": exportStateBudgetRows,
    firewall: exportFirewallRows,
    reporting: exportReportingRows,
    "calendar-heat": exportCalendarHeatRows
  }[kind]?.() || [];
  downloadFile(`fanduel_${kind}_${getDemoToday()}.csv`, toCsv(rows), "text/csv");
}

function exportPlanningGridRows() {
  return (app.data.actualsMonthly?.rows || [])
    .filter((row) => row.month >= "2026-01" && row.month <= "2026-12")
    .map((row) => ({
      month: row.month,
      channel: row.channel,
      line_type: row.line_type || "",
      planned_spend: row.planned_spend || 0,
      actual_spend: row.actual_spend || 0,
      planned_conversions: row.planned_conversions || 0,
      conversions: row.conversions || 0,
      cpa: row.cpa || "",
      all_in_cac: row.all_in_cac || "",
      rg_message_share_pct: row.rg_message_share_pct || "",
      status: row.status || app.data.actualsManifest?.status || "synthetic-simulated",
      display_flag: row.display_flag || app.data.actualsManifest?.display_flag || "SYNTHETIC",
      source_ids: (row.source_ids || ["fanduel_sde_actuals_manifest_v1"]).join("|")
    }));
}

function exportFlightpathGridRows() {
  const overlayByCell = buildCampaignOverlayCellMap();
  return exportPlanningGridRows()
    .filter((row) => row.month >= app.flightpathStartMonth && row.month <= app.flightpathEndMonth)
    .map((row) => {
      const overlays = overlayByCell.get(`${row.channel}::${row.month}`) || [];
      return {
        ...row,
        plan_version: getPlanMeta()?.label || app.selectedScenario,
        date_range: `${app.flightpathStartMonth}..${app.flightpathEndMonth}`,
        campaign_overlay_budget: overlays.reduce((sum, item) => sum + Number(item.budget_usd || 0), 0),
        campaign_overlay_ftd_proxy: overlays.reduce((sum, item) => sum + Number(item.ftd_proxy || 0), 0),
        campaign_overlay_ids: overlays.map((item) => item.campaign_id).join("|"),
        campaign_overlay_basis: overlays.map((item) => item.basis).filter(Boolean).join("|")
      };
    });
}

function exportAllocationRows() {
  const planView = buildPlanView(getPlan(), getSelectedStateRow());
  return planView.channel_totals.map((row) => ({
    scenario: planView.scenario?.label || app.selectedScenario,
    product: productLabel(app.selectedProduct),
    planning_scope: app.planningScope,
    selected_states: getSelectedPlanningStateCodes(app.selectedProduct).join("|"),
    channel: row.channel,
    budget: row.budget_gbp,
    share_pct: row.share_pct,
    forecast_ftds: row.forecast_acquisitions,
    cpa: row.forecast_acquisitions > 0 ? row.budget_gbp / row.forecast_acquisitions : "",
    evidence_strength: row.evidence_strength || "",
    state_adjustment: row.state_adjustment || "",
    display_flag: "SYNTHETIC",
    source_ids: (row.response_curve?.source_ids || row.source_ids || ["fanduel_plan_store_manifest_v1"]).join("|")
  }));
}

function exportStateBudgetRows() {
  const scenario = getStateBudgetScenario();
  return (scenario.states || []).map((row) => {
    const valueRow = getStateValueRow(row.state_code);
    return {
      scenario_id: scenario.scenario_id,
      product: productLabel(scenario.product_key),
      state_code: row.state_code,
      state: row.state,
      budget_usd_equivalent: row.budget_usd_equivalent,
      forecast_ftds: row.forecast_ftds,
      governance_status: row.governance_status,
      evidence_status: row.evidence_status,
      value_index: valueRow?.value_index || "",
      value_weighted_ftds: valueRow ? Number(row.forecast_ftds || 0) * (Number(valueRow.value_index || 100) / 100) : "",
      ggr_tax_rate: valueRow?.ggr_tax_rate || "",
      source_id: valueRow?.source_id || "fanduel_state_budget_model_2026",
      status: valueRow?.status || "synthetic-working",
      display_flag: "SYNTHETIC"
    };
  });
}

function productLabel(productKey) {
  return PRODUCT_LABELS[productKey] || formatStatus(productKey);
}

function productOptionsHtml(selectedKey = "") {
  const seenLabels = new Set();
  return Object.entries(PRODUCT_LABELS)
    .filter(([key, label]) => {
      const signature = String(label || key).trim().toLowerCase();
      if (seenLabels.has(signature) && key !== selectedKey) return false;
      seenLabels.add(signature);
      return true;
    })
    .map(([key, label]) => `<option value="${escapeHtml(key)}" ${key === selectedKey ? "selected" : ""}>${escapeHtml(label)}</option>`)
    .join("");
}

function calendarProductOptionsHtml(selectedKey = "all") {
  return `<option value="all" ${selectedKey === "all" ? "selected" : ""}>All products</option>${productOptionsHtml(selectedKey)}`;
}

function refreshProductSelectOptions() {
  const productSelect = $("#productSelect");
  const regulationProductSelect = $("#regulationProductSelect");
  const calendarProductSelect = $("#calendarProductSelect");
  const reportingProductSelect = $("#reportingProductSelect");
  if (productSelect) {
    productSelect.innerHTML = productOptionsHtml(app.selectedProduct);
    productSelect.value = app.selectedProduct;
  }
  if (regulationProductSelect) {
    regulationProductSelect.innerHTML = productOptionsHtml(app.selectedProduct);
    regulationProductSelect.value = app.selectedProduct;
  }
  if (calendarProductSelect) {
    calendarProductSelect.innerHTML = calendarProductOptionsHtml(app.selectedCalendarProduct);
    calendarProductSelect.value = app.selectedCalendarProduct;
  }
  if (reportingProductSelect) {
    reportingProductSelect.innerHTML = productOptionsHtml(app.selectedReportingProduct);
    reportingProductSelect.value = app.selectedReportingProduct;
  }
}

function loadCustomProducts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_STORAGE_KEY) || "[]");
    const baseLabels = new Set(Object.values(PRODUCT_LABELS).map((label) => String(label).trim().toLowerCase()));
    app.customProducts = Array.isArray(parsed)
      ? parsed.filter((item) => item?.key && item?.label && !BASE_PRODUCT_KEYS.has(item.key) && !baseLabels.has(String(item.label).trim().toLowerCase()))
      : [];
  } catch {
    app.customProducts = [];
  }
  app.customProducts.forEach((item) => {
    PRODUCT_LABELS[item.key] = item.label;
  });
}

function persistCustomProducts() {
  localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(app.customProducts));
}

function loadZip3ViewPreference() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ZIP3_VIEW_STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object" || parsed.frameVersion !== ZIP3_VIEW_FRAME_VERSION) return;
    app.zip3Zoom = clampNumber(Number(parsed.zoom || ZIP3_DEFAULT_VIEW.zoom), 1, 3);
    app.zip3PanX = Number.isFinite(Number(parsed.panX)) ? Number(parsed.panX) : ZIP3_DEFAULT_VIEW.panX;
    app.zip3PanY = Number.isFinite(Number(parsed.panY)) ? Number(parsed.panY) : ZIP3_DEFAULT_VIEW.panY;
  } catch {
    app.zip3Zoom = ZIP3_DEFAULT_VIEW.zoom;
    app.zip3PanX = ZIP3_DEFAULT_VIEW.panX;
    app.zip3PanY = ZIP3_DEFAULT_VIEW.panY;
  }
}

function persistZip3ViewPreference() {
  localStorage.setItem(ZIP3_VIEW_STORAGE_KEY, JSON.stringify({
    frameVersion: ZIP3_VIEW_FRAME_VERSION,
    zoom: app.zip3Zoom,
    panX: app.zip3PanX,
    panY: app.zip3PanY
  }));
}

function loadCampaignStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CAMPAIGN_STORE_STORAGE_KEY) || "[]");
    app.oneOffCampaigns = Array.isArray(parsed)
      ? parsed.filter((campaign) => campaign?.id && campaign?.planDoc)
      : [];
  } catch {
    app.oneOffCampaigns = [];
  }
}

function persistCampaignStore() {
  localStorage.setItem(CAMPAIGN_STORE_STORAGE_KEY, JSON.stringify(app.oneOffCampaigns || []));
}

function loadRecommendationActionStates() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECOMMENDATION_ACTION_STORAGE_KEY) || "{}");
    app.recommendationActionStates = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    app.recommendationActionStates = {};
  }
}

function persistRecommendationActionStates() {
  localStorage.setItem(RECOMMENDATION_ACTION_STORAGE_KEY, JSON.stringify(app.recommendationActionStates || {}));
}

function isCustomProduct(productKey) {
  return app.customProducts.some((item) => item.key === productKey);
}

function normaliseProductKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

function getCustomProductRule(productKey, row = getSelectedStateRow()) {
  return {
    product_key: productKey,
    planning_status: "not_listed",
    planning_action: `${productLabel(productKey)} is excluded from activation in ${row?.state || "this state"} until a verified product/state source is added.`,
    source_id: "custom_product_working_default",
    source_label: "Demo custom product default",
    source_url: "#",
    source_date: getDemoToday(),
    confidence: "working demo default",
    regulator: "Rob or Jack verification gate",
    review_status: "working source"
  };
}

function registerCustomProduct(labelValue, keyValue = "") {
  const label = String(labelValue || "").trim();
  const key = normaliseProductKey(keyValue || label);
  if (!label) return { error: "Add a product name first." };
  if (!key) return { error: "Use letters or numbers in the product key." };
  if (PRODUCT_LABELS[key]) {
    const existingCustom = app.customProducts.find((item) => item.key === key);
    return existingCustom
      ? { item: existingCustom, existing: true }
      : { error: `${productLabel(key)} already exists. Choose a different key.` };
  }
  const duplicateLabel = app.customProducts.find((item) => item.label.toLowerCase() === label.toLowerCase());
  if (duplicateLabel) return { item: duplicateLabel, existing: true };
  const item = {
    key,
    label,
    default_governance_status: "not_listed",
    source_id: "custom_product_working_default",
    created_at: getDemoToday()
  };
  app.customProducts.push(item);
  PRODUCT_LABELS[key] = label;
  persistCustomProducts();
  return { item, existing: false };
}

function addCustomProductFromForm() {
  const nameInput = $("[data-new-product-name]");
  const keyInput = $("[data-new-product-key]");
  const label = String(nameInput?.value || "").trim();
  const registration = registerCustomProduct(label, keyInput?.value || label);
  if (registration.error) {
    app.addProductWarning = registration.error;
    renderPlanningChatShell();
    return;
  }
  const item = registration.item;
  app.addProductOpen = false;
  app.addProductWarning = `${item.label} ${registration.existing ? "is already" : "was added"} as a working demo product. It is not listed in every state until evidence is added.`;
  app.oneOffProduct = item.key;
  app.selectedReportingProduct = item.key;
  app.manualStateOverrides = {};
  syncProductSelection(item.key);
  render();
}

function exportFirewallRows() {
  const row = getFirewallStateRow();
  if (!row) return [];
  return Object.keys(PRODUCT_LABELS).map((productKey) => {
    const rule = getProductRule(row, productKey);
    return {
      state_code: row.state_code,
      state: row.state,
      product: productLabel(productKey),
      planning_status: getProductStatus(row, productKey) || rule?.planning_status || "",
      operating_status: row[`${productKey}_operating_status`] || "",
      source_date: rule?.source_date || app.data.governance.source_date,
      source_id: rule?.source_id || "us_state_governance_working_research_2026_07_03",
      source_url: rule?.source_url || "",
      regulator: rule?.regulator || "",
      review_status: rule?.review_status || "working source",
      display_flag: "WORKING_RESEARCH"
    };
  });
}

function exportReportingRows() {
  const rows = getReportingDrillRows(app.selectedReportingView, getReportingRangeMonths());
  return rows.map((row) => ({
    month: row.month,
    view: REPORTING_VIEWS[app.selectedReportingView]?.label || app.selectedReportingView,
    source_platform: row.source_platform,
    channel: row.channel,
    campaign: row.campaign,
    line_item: row.line_item,
    segment: row.segment,
    impressions: row.impressions,
    clicks: row.clicks,
    cost: row.cost,
    conversions: row.conversions,
    cpa: row.cpa,
    data_status: row.data_status,
    display_flag: row.display_flag,
    source_ids: (row.source_ids || []).join("|")
  }));
}

function exportCalendarHeatRows() {
  return getCalendarDailyRows()
    .filter((row) => row.month === app.selectedCalendarMonth)
    .map((row) => {
      const state = getStateHeat(row.date, app.selectedCalendarState);
      const fixtures = getVisibleCalendarFixtures(row.date);
      return {
        date: row.date,
        month: row.month,
        state_code: app.selectedCalendarState,
        sport_filter: app.selectedCalendarSport,
        demand_heat_score: state?.demand_heat_score ?? row.heat_score,
        activation_heat_score: state?.activation_heat_score ?? row.heat_score,
        heat_band: state?.heat_band || row.heat_band,
        fixture_count: fixtures.length,
        fixture_ids: fixtures.map((fixture) => fixture.fixture_id).join("|"),
        governance_badge: state?.governance_badge || "",
        data_status: row.data_status || "modelled-working",
        display_flag: row.display_flag || "MODELLED_HEAT",
        source_ids: (row.source_ids || ["fanduel_fixture_heat_model_v1"]).join("|")
      };
    });
}

function buildCalendarIcsExport() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TAU//FanDuel Fixture Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:FanDuel Fixture Calendar Working Source"
  ];
  getCalendarFixtureRows()
    .filter((fixture) => fixture.date.startsWith(app.selectedCalendarMonth))
    .filter((fixture) => app.selectedCalendarSport === "all" || fixture.sport === app.selectedCalendarSport)
    .slice(0, 200)
    .forEach((fixture) => {
      const date = fixture.date.replaceAll("-", "");
      const summary = `${fixture.sport}: ${fixture.label}`;
      const description = [
        `Status: ${fixture.status_chip || fixture.status}`,
        `Display flag: ${fixture.display_flag || "WORKING_FIXTURE"}`,
        `Source IDs: ${(fixture.source_ids || []).join("|")}`,
        "No specific matchup is asserted until a real schedule feed is connected."
      ].join("\\n");
      lines.push(
        "BEGIN:VEVENT",
        `UID:${fixture.fixture_id}@fanduel-demo.local`,
        `DTSTAMP:${getDemoToday().replaceAll("-", "")}T000000Z`,
        `DTSTART;VALUE=DATE:${date}`,
        `SUMMARY:${escapeIcs(summary)}`,
        `DESCRIPTION:${escapeIcs(description)}`,
        "END:VEVENT"
      );
    });
  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

function escapeIcs(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function buildPlanningNote() {
  const selectedCodes = getSelectedPlanningStateCodes(app.selectedProduct);
  return [
    `FanDuel planning note (${getDemoToday()})`,
    `Product: ${productLabel(app.selectedProduct)}`,
    `Scenario: ${getPlan().scenario?.label || app.selectedScenario}`,
    `States: ${selectedCodes.join(", ")}`,
    `Budget lens: ${app.budgetOptimisation === "value" ? "post-tax value" : "volume"}`,
    "Data flags: SDE actuals and response curves are SYNTHETIC; state availability is working research and needs regulator verification."
  ].join("\n");
}

function buildFlightpathNote() {
  return [
    `FanDuel Flightpath note (${getDemoToday()})`,
    `Plan version: ${getPlanMeta()?.label || app.selectedScenario}`,
    `Date range: ${formatMonth(app.flightpathStartMonth)} to ${formatMonth(app.flightpathEndMonth)}`,
    `Reach-curve channel: ${app.selectedChannel}`,
    "One point: plan vs actual across time. Past values are SYNTHETIC SDE actuals, current month is pacing, future months are plan-store values.",
    "Use the evidence drawer on grid cells before making client-facing claims."
  ].join("\n");
}

function buildReportingNote() {
  const months = getReportingRangeMonths();
  const kpis = getReportingRangeKpis(app.selectedReportingView, months);
  const start = months[0] || app.selectedReportingMonth;
  const end = months[months.length - 1] || app.selectedReportingMonth;
  const periodLabel = start === end ? formatMonth(start) : `${formatMonth(start)} to ${formatMonth(end)}`;
  return [
    `FanDuel reporting note (${periodLabel})`,
    `View: ${REPORTING_VIEWS[app.selectedReportingView]?.label || app.selectedReportingView}`,
    `Channels: ${getReportingChannelFilterLabel()}`,
    `Efficiency: ${app.reportingCpaMode === "all_in" ? "all-in CAC" : "media CPA"} ${formatMoney(kpis.cpa, 2)}`,
    `Working-media spend: ${formatCurrency(kpis.spend)}`,
    `Conversions: ${formatCompactNumber(kpis.conversions)}`,
    "Data flags: reporting line items and actuals are SYNTHETIC SDE output; paid SERP is a scoped 15-row provider cut, not spend or efficiency evidence."
  ].join("\n");
}

function buildBoardPack() {
  const plan = getPlan();
  const selectedCodes = getSelectedPlanningStateCodes(app.selectedProduct);
  const kpis = getReportingKpis(app.selectedReportingView, app.selectedReportingMonth);
  const topChannels = [...(plan.channel_totals || [])].sort((a, b) => b.budget_gbp - a.budget_gbp).slice(0, 5);
  const valueRows = selectedCodes
    .map((code) => getStateValueRow(code))
    .filter(Boolean)
    .sort((a, b) => b.value_index - a.value_index)
    .slice(0, 5);
  return [
    `FanDuel board pack (${getDemoToday()})`,
    "",
    "1. Executive read",
    `${plan.scenario?.label || app.selectedScenario}: ${formatCurrency(plan.total_allocated_gbp)} / ${formatNumber(plan.forecast_acquisitions)} FTD proxy / ${formatCurrency(plan.forecast_cpa_gbp)} media CPA.`,
    "",
    "2. Planning states",
    `${productLabel(app.selectedProduct)} selected states: ${selectedCodes.join(", ") || "none"}.`,
    "",
    "3. Highest value states",
    valueRows.map((row) => `${row.state_code} ${row.value_index.toFixed(1)} value index, tax ${row.ggr_tax_rate}%`).join("\n") || "No state value rows selected.",
    "",
    "4. Channel allocation",
    topChannels.map((row) => `${row.channel}: ${formatCurrency(row.budget_gbp)} (${row.share_pct.toFixed(1)}%)`).join("\n"),
    "",
    "5. Reporting snapshot",
    `${formatMonth(app.selectedReportingMonth)} ${REPORTING_VIEWS[app.selectedReportingView]?.label || app.selectedReportingView}: ${formatCurrency(kpis.spend)} spend, ${formatCompactNumber(kpis.conversions)} conversions, ${formatMoney(kpis.cpa, 2)} ${app.reportingCpaMode === "all_in" ? "all-in CAC" : "media CPA"}.`,
    "",
    "6. Caveats",
    "SDE actuals, ZIP3 media, promo costs, response curves and owner splits are SYNTHETIC or working estimates. State availability is working research and needs regulator/legal review before client claims. The DataForSEO paid-SERP cut is scoped provider evidence only, not spend or efficiency evidence."
  ].join("\n");
}

function toCsv(rows) {
  if (!rows.length) return "no_rows\n";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => csvValue(row[header])).join(","));
  });
  return `${lines.join("\n")}\n`;
}

function csvValue(value) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadStaticFile(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function getDemoToday() {
  return app.data.planStore?.manifest?.demo_today || "2026-07-03";
}

function getDemoCurrentMonth() {
  return getDemoToday().slice(0, 7);
}

function getMonthStatus(month) {
  const currentMonth = getDemoCurrentMonth();
  if (month < currentMonth) return "past";
  if (month === currentMonth) return "current";
  return "future";
}

function getMonthStatusLabel(month) {
  const status = getMonthStatus(month);
  if (status === "past") return hasSyntheticActualsForMonth(month) ? "SYNTHETIC actuals" : "actuals pending";
  if (status === "current") return "pacing shell";
  return "plan";
}

function hasSyntheticActualsForMonth(month) {
  return Boolean(app.data.actualsMonthly?.rows?.some((row) => row.month === month));
}

function actualsByChannelMonth() {
  return new Map((app.data.actualsMonthly?.rows || []).map((row) => [`${row.channel}::${row.month}`, row]));
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round2(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function getPlanningYearRows() {
  return (app.data.actualsMonthly?.rows || []).filter((row) => row.month >= "2026-01" && row.month <= "2026-12");
}

function buildRevisionFactors() {
  const historyRows = getPlanningYearRows().filter((row) => (
    row.month < getDemoCurrentMonth()
    && row.buyable !== false
    && Number(row.actual_spend || 0) > 0
  ));
  const grouped = historyRows.reduce((groups, row) => {
    groups[row.channel] ||= [];
    groups[row.channel].push(row);
    return groups;
  }, {});
  return new Map(Object.entries(grouped).map(([channel, rows]) => {
    const avg = (key, fallback = 1) => {
      const values = rows.map((row) => Number(row[key] || 0)).filter((value) => value > 0);
      return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : fallback;
    };
    const deliveryIndex = avg("delivery_index");
    const salesIndex = avg("sales_index");
    const spendFactor = clampNumber(1 + ((salesIndex - 1) * 0.45) + ((deliveryIndex - 1) * 0.18), 0.88, 1.14);
    const conversionFactor = clampNumber(1 + ((salesIndex - 1) * 0.72), 0.85, 1.18);
    return [channel, { deliveryIndex, salesIndex, spendFactor, conversionFactor }];
  }));
}

function explainRevisionDelta(row) {
  const salesContribution = (Number(row.sales_index || 1) - 1) * 0.45;
  const deliveryContribution = (Number(row.delivery_index || 1) - 1) * 0.18;
  const rawFactor = clampNumber(1 + salesContribution + deliveryContribution, 0.88, 1.14);
  const performanceDelta = Number(row.performance_delta_spend ?? row.delta_spend ?? 0);
  const incrementalSpend = Number(row.incremental_spend || 0);
  const direction = Number(row.delta_spend || 0) > 0 ? "gain" : Number(row.delta_spend || 0) < 0 ? "cut" : "hold";
  const incrementalReason = incrementalSpend
    ? ` The separate explicit working-media layer adds ${formatSignedCurrency(incrementalSpend)}; combined delta ${formatSignedCurrency(row.delta_spend)}.`
    : "";
  return `${direction}: 45% sales signal (${Number(row.sales_index || 1).toFixed(2)}) + 18% delivery signal (${Number(row.delivery_index || 1).toFixed(2)}) = ${rawFactor.toFixed(3)} raw factor; fixed-envelope performance normalisation yields ${formatSignedCurrency(performanceDelta)}.${incrementalReason}`;
}

function buildRevisionDraft(plan, month = app.selectedCalendarMonth, moves = {}) {
  const replanMoves = {
    budgetDeltaUsd: Number(moves.budgetDeltaUsd || 0),
    useCurrentPerformance: Boolean(moves.useCurrentPerformance),
    protectBrandLines: Boolean(moves.protectBrandLines),
    journeyContext: moves.journeyInformed ? getMonthReplanJourneyContext(app.selectedProduct) : null,
    stateShift: moves.stateShift ? buildMonthStateShift(moves.stateShift.from, moves.stateShift.to, app.selectedProduct) : null
  };
  const sourceRows = getPlanningYearRows();
  const factors = buildRevisionFactors();
  const rows = sourceRows.map((row) => {
    const baselineSpend = Number(row.planned_spend || 0);
    const baselineConversions = Number(row.planned_conversions || 0);
    const factor = factors.get(row.channel) || {
      deliveryIndex: 1,
      salesIndex: 1,
      spendFactor: 1,
      conversionFactor: 1
    };
    return {
      ...row,
      baseline_spend: baselineSpend,
      baseline_conversions: baselineConversions,
      revised_spend: row.month < month || row.buyable === false ? baselineSpend : replanMoves.useCurrentPerformance ? baselineSpend * factor.spendFactor : baselineSpend,
      revised_conversions: row.month < month ? Number(row.conversions || baselineConversions) : replanMoves.useCurrentPerformance ? baselineConversions * factor.conversionFactor : baselineConversions,
      frozen: row.month < month,
      revision_factor: factor
    };
  });

  const months = [...new Set(rows.map((row) => row.month))].filter((item) => item >= month);
  months.forEach((revisionMonth) => {
    const monthRows = rows.filter((row) => row.month === revisionMonth && row.buyable !== false);
    const baselineTotal = monthRows.reduce((sum, row) => sum + row.baseline_spend, 0);
    const protectedRows = replanMoves.protectBrandLines ? monthRows.filter((row) => MONTH_REPLAN_BRAND_CHANNELS.has(row.channel)) : [];
    const flexibleRows = replanMoves.protectBrandLines ? monthRows.filter((row) => !MONTH_REPLAN_BRAND_CHANNELS.has(row.channel)) : monthRows;
    protectedRows.forEach((row) => {
      row.revised_spend = row.baseline_spend;
      row.revised_conversions = row.baseline_conversions;
    });
    if (replanMoves.journeyContext?.channels?.length) {
      flexibleRows.forEach((row) => {
        if (replanMoves.journeyContext.channels.includes(row.channel)) {
          row.revised_spend *= 1.04;
          row.revised_conversions *= 1.04;
        }
      });
    }
    const flexibleBaseline = flexibleRows.reduce((sum, row) => sum + row.baseline_spend, 0);
    const flexibleRevised = flexibleRows.reduce((sum, row) => sum + row.revised_spend, 0);
    const normalizer = flexibleRevised > 0 ? flexibleBaseline / flexibleRevised : 1;
    flexibleRows.forEach((row) => {
      row.revised_spend = row.revised_spend * normalizer;
      row.revised_conversions = row.revised_conversions * normalizer;
    });
  });

  rows.forEach((row) => {
    row.performance_revised_spend = row.revised_spend;
    row.incremental_spend = 0;
  });

  if (replanMoves.budgetDeltaUsd) {
    const targetRows = rows.filter((row) => row.month === month && row.buyable !== false && (!replanMoves.protectBrandLines || !MONTH_REPLAN_BRAND_CHANNELS.has(row.channel)));
    const ranked = [...targetRows].sort((a, b) => {
      const aScore = Number(a.revision_factor.salesIndex || 1) * Number(a.revision_factor.deliveryIndex || 1);
      const bScore = Number(b.revision_factor.salesIndex || 1) * Number(b.revision_factor.deliveryIndex || 1);
      return replanMoves.budgetDeltaUsd > 0 ? bScore - aScore : aScore - bScore;
    });
    let remaining = Math.abs(replanMoves.budgetDeltaUsd);
    const totalWeight = ranked.reduce((sum, row, index) => sum + Math.max(1, ranked.length - index), 0);
    ranked.forEach((row, index) => {
      if (!remaining) return;
      const requested = index === ranked.length - 1 ? remaining : Math.min(remaining, Math.round(Math.abs(replanMoves.budgetDeltaUsd) * ((ranked.length - index) / totalWeight)));
      const delta = replanMoves.budgetDeltaUsd > 0 ? requested : -Math.min(requested, Math.max(0, row.revised_spend * 0.8));
      row.revised_spend += delta;
      row.incremental_spend += delta;
      row.revised_conversions += row.baseline_conversions * (delta / Math.max(1, row.baseline_spend)) * row.revision_factor.conversionFactor;
      remaining -= Math.abs(delta);
    });
  }

  const selectedDiff = rows
    .filter((row) => row.month === month && row.buyable !== false)
    .map((row) => ({
      channel: row.channel,
      baseline_spend: round2(row.baseline_spend),
      revised_spend: round2(row.revised_spend),
      delta_spend: round2(row.revised_spend - row.baseline_spend),
      performance_revised_spend: round2(row.performance_revised_spend),
      performance_delta_spend: round2(row.performance_revised_spend - row.baseline_spend),
      incremental_spend: round2(row.incremental_spend),
      baseline_conversions: round2(row.baseline_conversions),
      revised_conversions: round2(row.revised_conversions),
      delivery_index: round2(row.revision_factor.deliveryIndex),
      sales_index: round2(row.revision_factor.salesIndex),
      spend_factor: round2(row.revision_factor.spendFactor)
    }))
    .filter((row) => Math.abs(row.delta_spend) >= 500)
    .sort((a, b) => Math.abs(b.delta_spend) - Math.abs(a.delta_spend));

  const frozenMonths = [...new Set(rows.filter((row) => row.frozen).map((row) => row.month))].sort();
  return {
    revision_id: `${getPlanMeta()?.plan_id || plan.plan_id}_v2`,
    parent_plan_id: getPlanMeta()?.plan_id || plan.plan_id,
    scenario_key: getPlanMeta()?.scenario_key || app.selectedScenario,
    scenario_id: getScenarioId(),
    month,
    created_at: "2026-07-04",
    rows,
    selectedDiff,
    frozenMonths,
    moves: replanMoves,
    source_ids: ["fanduel_sde_actuals_manifest_v1", "fanduel_revision_engine_v1"]
  };
}

function buildPlanFromRevision(draft, basePlan) {
  const baseChannelMeta = new Map((basePlan.channel_totals || []).map((channel) => [channel.channel, channel]));
  const monthlyAllocations = draft.rows.map((row) => {
    const meta = baseChannelMeta.get(row.channel) || {};
    return {
      month: row.month,
      channel: row.channel,
      budget_gbp: round2(row.revised_spend),
      forecast_acquisitions: round2(row.revised_conversions),
      confidence: meta.confidence || "synthetic",
      planning_role: meta.planning_role || row.line_type || "SDE revision row",
      evidence_strength: meta.evidence_strength || "synthetic-demo",
      line_type: row.line_type,
      buyable: row.buyable,
      frozen: row.frozen,
      source_ids: draft.source_ids
    };
  });
  const channelTotals = Object.values(monthlyAllocations.reduce((groups, row) => {
    groups[row.channel] ||= {
      channel: row.channel,
      budget_gbp: 0,
      forecast_acquisitions: 0,
      confidence: row.confidence,
      planning_role: row.planning_role,
      evidence_strength: row.evidence_strength,
      response_curve: baseChannelMeta.get(row.channel)?.response_curve || {
        source_ids: draft.source_ids,
        conflict_note: "Revision row from SDE compact bridge."
      }
    };
    groups[row.channel].budget_gbp += Number(row.budget_gbp || 0);
    groups[row.channel].forecast_acquisitions += Number(row.forecast_acquisitions || 0);
    return groups;
  }, {}));
  const totalAllocated = channelTotals.reduce((sum, channel) => sum + channel.budget_gbp, 0);
  const forecastAcquisitions = channelTotals.reduce((sum, channel) => sum + channel.forecast_acquisitions, 0);
  channelTotals.forEach((channel) => {
    channel.budget_gbp = round2(channel.budget_gbp);
    channel.forecast_acquisitions = round2(channel.forecast_acquisitions);
    channel.share_pct = totalAllocated > 0 ? (channel.budget_gbp / totalAllocated) * 100 : 0;
  });
  return {
    ...basePlan,
    plan_id: draft.revision_id,
    plan_store_id: draft.revision_id,
    plan_store_status: "active",
    scenario: {
      ...basePlan.scenario,
      label: `${basePlan.scenario?.label || "Annual plan"} v2`
    },
    total_budget_gbp: round2(totalAllocated),
    total_allocated_gbp: round2(totalAllocated),
    forecast_acquisitions: round2(forecastAcquisitions),
    forecast_cpa_gbp: forecastAcquisitions > 0 ? round2(totalAllocated / forecastAcquisitions) : 0,
    channel_totals: channelTotals,
    monthly_allocations: monthlyAllocations,
    revision: {
      parent_plan_id: draft.parent_plan_id,
      revised_from_month: draft.month,
      frozen_months: draft.frozenMonths,
      source_ids: draft.source_ids
    }
  };
}

function buildMonthlyPlanningNote(draft, revisedPlan, meta) {
  const topChanges = [...(draft.selectedDiff || [])]
    .sort((a, b) => Math.abs(Number(b.delta_spend || 0)) - Math.abs(Number(a.delta_spend || 0)))
    .slice(0, 5)
    .map((row) => ({
      channel: row.channel,
      spend_delta: Number(row.delta_spend || 0),
      delivery_index: Number(row.delivery_index || 0),
      sales_index: Number(row.sales_index || 0)
    }));
  return {
    note_id: `${meta.plan_id}_monthly_note`,
    plan_id: meta.plan_id,
    parent_plan_id: draft.parent_plan_id,
    month: draft.month,
    generated_at: getDemoToday(),
    category_label: "working_media",
    frozen_months: [...draft.frozenMonths],
    working_media: Number(revisedPlan.total_allocated_gbp || 0),
    ftd_proxy: Number(revisedPlan.forecast_acquisitions || 0),
    media_cpa: Number(revisedPlan.forecast_cpa_gbp || 0),
    top_changes: topChanges,
    source_ids: [...new Set([...(draft.source_ids || []), "fanduel_monthly_note_skeleton_v1"])],
    narrative: "",
    narrative_status: "LLM narration pending"
  };
}

async function narrateMonthlyPlanningNote(note) {
  try {
    const result = await postAnthropicMessages({
      system: [
        "Write a concise CMO monthly planning note from the supplied deterministic skeleton.",
        "Do not add, remove, round differently or reinterpret any number.",
        "Do not invent a cause. Describe delivery and sales indices as SYNTHETIC demo signals.",
        "Use working_media as the exact spend-category label.",
        "Return two short paragraphs with no heading and no markdown table."
      ].join("\n"),
      messages: [{ role: "user", content: JSON.stringify(note) }],
      max_tokens: 360,
      temperature: 0.1
    });
    note.narrative = cleanLlmAnswerText(getAnthropicText(result));
    note.narrative_status = note.narrative ? `LLM prose · ${ANTHROPIC_CHAT_MODEL}` : "LLM returned no prose; skeleton remains authoritative";
  } catch (error) {
    note.narrative = "";
    note.narrative_status = `LLM unavailable; deterministic skeleton retained (${error.message})`;
  }
  return note;
}

function renderMonthlyPlanningNote() {
  const note = app.monthlyPlanningNote;
  if (!note) return "";
  return `
    <section class="monthly-planning-note">
      <div class="revision-header">
        <div>
          <p class="eyebrow">Auto monthly planning note</p>
          <h3>${escapeHtml(formatMonth(note.month))} · ${escapeHtml(note.plan_id)}</h3>
        </div>
        <div class="pill-row">
          <span class="pill status-synthetic">SYNTHETIC signals</span>
          <span class="pill status-working">${escapeHtml(note.category_label)}</span>
        </div>
      </div>
      <div class="planning-readout mini-readout">
        <article class="readout-item"><span>Annual working media</span><strong>${formatCurrency(note.working_media)}</strong></article>
        <article class="readout-item"><span>FTD proxy</span><strong>${formatNumber(note.ftd_proxy)}</strong></article>
        <article class="readout-item"><span>Media CPA</span><strong>${formatMoney(note.media_cpa, 2)}</strong></article>
        <article class="readout-item"><span>Frozen months</span><strong>${formatNumber(note.frozen_months.length)}</strong></article>
      </div>
      <div class="monthly-note-changes">
        ${note.top_changes.map((row) => `
          <article><strong>${escapeHtml(row.channel)}</strong><span>${formatSignedCurrency(row.spend_delta)}</span><small>delivery ${row.delivery_index.toFixed(2)} · sales ${row.sales_index.toFixed(2)}</small></article>
        `).join("")}
      </div>
      <div class="monthly-note-prose ${note.narrative ? "" : "is-pending"}">
        <span>${escapeHtml(note.narrative_status)}</span>
        ${note.narrative ? `<p>${escapeHtml(note.narrative).replaceAll("\n", "<br>")}</p>` : `<p>The deterministic skeleton is available now; no fallback prose is being presented as LLM output.</p>`}
      </div>
      <div class="method-note"><strong>Ownership:</strong> the revision engine supplies all figures and source IDs; the LLM writes prose only.</div>
    </section>
  `;
}

async function activateRevisionDraft() {
  if (!app.revisionDraft) return;
  const draft = app.revisionDraft;
  const baseEntry = getStoredPlanEntry(draft.scenario_key) || getActivePlanEntry();
  const revisedPlan = buildPlanFromRevision(draft, baseEntry?.plan || getPlan());
  const meta = {
    ...(baseEntry?.meta || {}),
    plan_id: draft.revision_id,
    label: `${baseEntry?.meta?.label || "2026 annual plan"} v2`,
    version: Number(baseEntry?.meta?.version || 1) + 1,
    parent_version: baseEntry?.meta?.version || 1,
    parent_plan_id: draft.parent_plan_id,
    status: "active",
    horizon: "annual",
    scenario_key: draft.scenario_key,
    scenario_id: draft.scenario_id,
    created_at: draft.created_at,
    approved_by: "demo operator",
    notes: `Saved in-session revision from ${formatMonth(draft.month)} actuals/pacing.`,
    source_ids: draft.source_ids,
    plan_path: null,
    meta_path: null
  };
  const entry = { meta, plan: revisedPlan, in_memory: true };
  app.data.planStore.byId[meta.plan_id] = entry;
  app.data.planStore.byScenario[meta.scenario_key] = entry;
  app.data.planStore.active = entry;
  app.data.planStore.entries = [
    ...app.data.planStore.entries.filter((item) => item.meta.plan_id !== meta.plan_id),
    entry
  ];
  app.data.planStore.manifest.active_annual = meta.plan_id;
  app.selectedScenario = meta.scenario_key;
  app.revisionAudit.unshift({
    action: "Saved v2 and activated",
    plan_id: meta.plan_id,
    parent_plan_id: draft.parent_plan_id,
    month: draft.month,
    frozen_count: draft.frozenMonths.length,
    created_at: draft.created_at
  });
  app.monthlyPlanningNote = buildMonthlyPlanningNote(draft, revisedPlan, meta);
  app.revisionDraft = null;
  render();
  await narrateMonthlyPlanningNote(app.monthlyPlanningNote);
}

function renderRevisionPanel() {
  const draft = app.revisionDraft;
  const auditRows = app.revisionAudit || [];
  return `
    <section class="revision-panel" aria-label="Monthly revision flow">
      <div class="revision-header">
        <div>
          <p class="eyebrow">Monthly revision flow</p>
          <h3>${draft ? `Draft v2 from ${escapeHtml(formatMonth(draft.month))}` : `Revise ${escapeHtml(formatMonth(app.selectedCalendarMonth))} from actuals`}</h3>
        </div>
        <div class="pill-row">
          <span class="pill status-synthetic">deterministic demo</span>
          <span class="pill">engine/revision.py</span>
        </div>
      </div>
      <p class="revision-copy">Freeze earlier months, replan the selected month onward from observed delivery and sales indices, review the diff, then save and activate v2.</p>
      ${draft ? renderRevisionDraft(draft) : `<button class="revision-action" type="button" data-revision-start>Revise ${escapeHtml(formatMonth(app.selectedCalendarMonth))}</button>`}
      ${renderMonthlyPlanningNote()}
      ${auditRows.length ? `
        <div class="revision-audit">
          <h4>Audit trail</h4>
          ${auditRows.map((row) => `
            <div class="audit-row">
              <span>${escapeHtml(row.action)}</span>
              <strong>${escapeHtml(row.plan_id)}</strong>
              <small>${escapeHtml(formatMonth(row.month))}; ${formatNumber(row.frozen_count)} frozen months; parent ${escapeHtml(row.parent_plan_id)}</small>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </section>
  `;
}

function renderRevisionDraft(draft) {
  return `
    <div class="revision-freeze">
      <span>Frozen months</span>
      <strong>${formatNumber(draft.frozenMonths.length)}</strong>
      <small>${draft.frozenMonths.map((month) => formatMonth(month).split(" ")[0]).join(", ") || "None"}</small>
    </div>
    <div class="revision-diff">
      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th>Baseline</th>
            <th>Revised</th>
            <th>Delta</th>
            <th>Sales</th>
          </tr>
        </thead>
        <tbody>
          ${draft.selectedDiff.slice(0, 8).map((row) => `
            <tr>
              <td>${escapeHtml(row.channel)}</td>
              <td>${formatCurrency(row.baseline_spend)}</td>
              <td>${formatCurrency(row.revised_spend)}</td>
              <td class="${row.delta_spend >= 0 ? "delta-up" : "delta-down"}">${formatSignedCurrency(row.delta_spend)}</td>
              <td>${Number(row.sales_index || 0).toFixed(2)}</td>
            </tr>
          `).join("") || `<tr><td colspan="5">No material channel deltas for this month.</td></tr>`}
        </tbody>
      </table>
    </div>
    <div class="revision-actions">
      <button class="revision-action" type="button" data-revision-save>Save v2 and activate</button>
      <button class="revision-action secondary" type="button" data-revision-cancel>Cancel draft</button>
    </div>
  `;
}

function renderFlightpath(plan) {
  const header = $("#flightpathHeader");
  if (!header) return;
  populateFlightpathControls(plan);
  header.innerHTML = renderFlightpathHeader(plan);
  header.insertAdjacentHTML("beforeend", renderPlanCompare());
  header.insertAdjacentHTML("beforeend", renderStressTest(plan));
  header.insertAdjacentHTML("beforeend", renderPublisherLayer(plan));
  bindPlanCompareControls();
  bindStressTestControls(plan);
  bindPlanValueLensControl();
  renderFlightpathCampaignOverlay();
  renderTimeMachineGrid(plan, "flightpathGrid", {
    startMonth: app.flightpathStartMonth,
    endMonth: app.flightpathEndMonth
  });
  renderFlightpathCurve();
}

function populateFlightpathControls(plan) {
  const months = getFlightpathMonths(plan);
  const planSelect = $("#flightpathPlanSelect");
  if (planSelect) {
    planSelect.innerHTML = getFlightpathPlanCards()
      .map((entry) => `<option value="${escapeHtml(entry.meta.scenario_key)}" ${entry.meta.scenario_key === app.selectedScenario ? "selected" : ""}>${escapeHtml(entry.meta.label || entry.meta.plan_id)}</option>`)
      .join("");
  }
  const startSelect = $("#flightpathStartMonth");
  const endSelect = $("#flightpathEndMonth");
  const monthOptions = months.map((month) => `<option value="${escapeHtml(month)}">${escapeHtml(formatMonth(month))}</option>`).join("");
  if (startSelect) {
    startSelect.innerHTML = monthOptions;
    startSelect.value = months.includes(app.flightpathStartMonth) ? app.flightpathStartMonth : months[0];
    app.flightpathStartMonth = startSelect.value;
  }
  if (endSelect) {
    endSelect.innerHTML = monthOptions;
    endSelect.value = months.includes(app.flightpathEndMonth) ? app.flightpathEndMonth : months[months.length - 1];
    app.flightpathEndMonth = endSelect.value;
  }
  const channelSelect = $("#flightpathChannelSelect");
  if (channelSelect) {
    channelSelect.innerHTML = app.data.curves.channels
      .map((channel) => `<option value="${escapeHtml(channel.channel)}">${escapeHtml(channel.channel)}</option>`)
      .join("");
    channelSelect.value = app.selectedChannel;
  }
  const stateLensSelect = $("#flightpathCurveStateSelect");
  if (stateLensSelect) populateCurveStateSelect("#flightpathCurveStateSelect");
  const spendRange = $("#flightpathSpendRange");
  if (spendRange) spendRange.value = String(app.spend);
}

function getFlightpathMonths(plan) {
  return [...new Set([
    ...app.data.calendar.draws.map((draw) => draw.month),
    ...(plan.monthly_allocations || []).map((row) => row.month),
    ...(app.data.actualsMonthly?.rows || []).map((row) => row.month)
  ])].filter((month) => month >= "2026-01" && month <= "2026-12").sort();
}

function renderFlightpathHeader(plan) {
  const active = getActivePlanEntry();
  const activePlan = active?.plan || plan;
  const selectedMeta = getPlanMeta();
  const budgetDelta = Number(plan.total_allocated_gbp || 0) - Number(activePlan.total_allocated_gbp || 0);
  const ftdDelta = displayPlanFtd(plan.forecast_acquisitions) - displayPlanFtd(activePlan.forecast_acquisitions);
  const selectedRows = (app.data.actualsMonthly?.rows || []).filter((row) => row.month >= app.flightpathStartMonth && row.month <= app.flightpathEndMonth);
  const actualSpend = selectedRows.reduce((sum, row) => sum + Number(row.actual_spend || 0), 0);
  const plannedSpend = selectedRows.reduce((sum, row) => sum + Number(row.planned_spend || 0), 0);
  const entries = getFlightpathPlanCards();
  const historyEntries = [...(app.data.planStore?.entries || [])].sort((a, b) => String(b.meta.created_at || "").localeCompare(String(a.meta.created_at || "")));
  const selectedEntry = entries.find((entry) => entry.meta.scenario_key === app.selectedScenario) || getStoredPlanEntry();
  const activeEntry = active || selectedEntry;
  return `
    <div class="flightpath-value-lens">
      ${renderPlanValueLensControl("flightpathValueModeSelect")}
      <p>${escapeHtml(getPlanValueLens().method)}</p>
    </div>
    <section class="flightpath-selector">
      <article class="flightpath-primary-plan">
        <div>
          <p class="eyebrow">Current signed-off plan</p>
          <h3>${escapeHtml(activeEntry?.meta?.label || activePlan.plan_id)}</h3>
          <span>${escapeHtml(activeEntry?.meta?.notes || "Active annual baseline shown first for rehearsal.")}</span>
        </div>
        <div class="planning-readout mini-readout">
          <article class="readout-item"><span>Working media</span><strong>${formatCurrency(activePlan.total_allocated_gbp || 0)}</strong></article>
          <article class="readout-item"><span>${escapeHtml(planFtdLensLabel())}</span><strong>${formatNumber(displayPlanFtd(activePlan.forecast_acquisitions))}</strong></article>
          <article class="readout-item"><span>${app.budgetOptimisation === "value" ? "Media / value proxy" : "CPA"}</span><strong>${formatMoney(displayPlanCpa(activePlan.total_allocated_gbp, activePlan.forecast_acquisitions), 2)}</strong></article>
        </div>
        <div class="pill-row">
          <span class="pill status-working">${escapeHtml(formatStatus(activeEntry?.meta?.status || "active"))}</span>
          <span class="pill status-review">${escapeHtml(activePlan.baseline_label || "user-entered budget")}</span>
          <span class="pill">${escapeHtml(formatMonth(activeEntry?.meta?.period?.start || "2026-01"))} to ${escapeHtml(formatMonth(activeEntry?.meta?.period?.end || "2026-12"))}</span>
        </div>
      </article>
      <div class="flightpath-option-grid">
        ${entries.slice(0, 6).map((entry) => renderFlightpathPlanCard(entry, activeEntry)).join("")}
      </div>
    </section>
    <section class="flightpath-quick-strip">
      <article class="readout-item"><span>Selected version</span><strong>${escapeHtml(selectedMeta?.label || plan.plan_id)}</strong></article>
      <article class="readout-item"><span>Budget delta vs active</span><strong>${budgetDelta >= 0 ? "+" : ""}${formatCurrency(budgetDelta)}</strong></article>
      <article class="readout-item"><span>${app.budgetOptimisation === "value" ? "Value-proxy delta" : "FTD delta vs active"}</span><strong>${ftdDelta >= 0 ? "+" : ""}${formatNumber(ftdDelta)}</strong></article>
      <article class="readout-item"><span>Range actual vs plan</span><strong>${formatCurrency(actualSpend)} / ${formatCurrency(plannedSpend)}</strong></article>
    </section>
    <details class="flightpath-history-popout">
      <summary>Version history (${formatNumber(historyEntries.length)})</summary>
      <div class="connector-grid">
        ${historyEntries.map((entry) => `
          <div class="connector-row ${entry.meta.scenario_key === app.selectedScenario ? "is-selected" : ""}">
            <strong>${escapeHtml(entry.meta.label || entry.meta.plan_id)}</strong>
            <span>${escapeHtml(formatStatus(entry.meta.status || "stored"))} / v${escapeHtml(entry.meta.version || 1)} / ${escapeHtml(formatMonth(entry.meta.period?.start || "2026-01"))}-${escapeHtml(formatMonth(entry.meta.period?.end || "2026-12"))}</span>
          </div>
        `).join("")}
      </div>
    </details>
    <div class="pill-row">
      <span class="pill status-synthetic">SYNTHETIC actuals visible</span>
      <span class="pill status-working">plan store ${formatNumber(app.data.planStore?.entries?.length || 0)} versions</span>
      <span class="pill">range ${escapeHtml(formatMonth(app.flightpathStartMonth))} to ${escapeHtml(formatMonth(app.flightpathEndMonth))}</span>
    </div>
  `;
}

function getFlightpathPlanCards() {
  const statusOrder = { active: 0, signed_off: 1, draft: 2, archived: 3 };
  return [...(app.data.planStore?.entries || [])]
    .filter((entry) => String(entry.meta.status || "").toLowerCase() !== "archived")
    .sort((a, b) => {
    const aStatus = statusOrder[String(a.meta.status || "").toLowerCase()] ?? 4;
    const bStatus = statusOrder[String(b.meta.status || "").toLowerCase()] ?? 4;
    return aStatus - bStatus || String(a.meta.label || a.meta.plan_id).localeCompare(String(b.meta.label || b.meta.plan_id));
  });
}

function getPlanCompareEntries() {
  return getFlightpathPlanCards().filter((entry) => entry.meta.horizon === "annual");
}

function compareCell(plan, month, channel) {
  return (plan.monthly_allocations || []).find((row) => row.month === month && row.channel === channel)
    || { budget_gbp: 0, forecast_acquisitions: 0 };
}

function renderPlanCompare() {
  const entries = getPlanCompareEntries();
  if (entries.length < 2) return "";
  if (!entries.some((entry) => entry.meta.scenario_key === app.selectedComparePlanA)) app.selectedComparePlanA = entries[0].meta.scenario_key;
  if (!entries.some((entry) => entry.meta.scenario_key === app.selectedComparePlanB)) app.selectedComparePlanB = entries[1].meta.scenario_key;
  if (app.selectedComparePlanA === app.selectedComparePlanB) app.selectedComparePlanB = entries.find((entry) => entry.meta.scenario_key !== app.selectedComparePlanA)?.meta.scenario_key || app.selectedComparePlanB;
  const a = entries.find((entry) => entry.meta.scenario_key === app.selectedComparePlanA) || entries[0];
  const b = entries.find((entry) => entry.meta.scenario_key === app.selectedComparePlanB) || entries[1];
  const months = getFlightpathMonths(a.plan);
  const channels = [...new Set([...(a.plan.channel_totals || []), ...(b.plan.channel_totals || [])]
    .filter((row) => row.buyable !== false)
    .map((row) => row.channel))]
    .sort((left, right) => {
      const spend = (entry, channel) => Number(entry.plan.channel_totals?.find((row) => row.channel === channel)?.budget_gbp || 0);
      return Math.max(spend(b, right), spend(a, right)) - Math.max(spend(b, left), spend(a, left));
    });
  const budgetDelta = Number(b.plan.total_allocated_gbp || 0) - Number(a.plan.total_allocated_gbp || 0);
  const ftdDelta = displayPlanFtd(b.plan.forecast_acquisitions) - displayPlanFtd(a.plan.forecast_acquisitions);
  const cpaDelta = displayPlanCpa(b.plan.total_allocated_gbp, b.plan.forecast_acquisitions) - displayPlanCpa(a.plan.total_allocated_gbp, a.plan.forecast_acquisitions);
  const options = entries.map((entry) => `<option value="${escapeHtml(entry.meta.scenario_key)}">${escapeHtml(entry.meta.label)}</option>`).join("");
  return `
    <details class="plan-compare-panel">
      <summary>Choose two named plans and see the channel-by-month differences</summary>
      <div class="plan-compare-controls">
        <label><span>Plan A</span><select id="comparePlanA">${options}</select></label>
        <label><span>Plan B</span><select id="comparePlanB">${options}</select></label>
        <span class="pill status-synthetic">SYNTHETIC options</span>
      </div>
      <div class="planning-readout mini-readout">
        <article class="readout-item"><span>Working-media delta</span><strong>${budgetDelta >= 0 ? "+" : ""}${formatCurrency(budgetDelta)}</strong></article>
        <article class="readout-item"><span>${app.budgetOptimisation === "value" ? "Value-weighted FTD delta" : "FTD proxy delta"}</span><strong>${ftdDelta >= 0 ? "+" : ""}${formatNumber(ftdDelta)}</strong></article>
        <article class="readout-item"><span>${app.budgetOptimisation === "value" ? "Media/value delta" : "Media CPA delta"}</span><strong>${cpaDelta >= 0 ? "+" : ""}${formatMoney(cpaDelta, 2)}</strong></article>
      </div>
      <div class="plan-compare-table-wrap">
        <table class="plan-compare-table">
          <thead><tr><th>Channel</th>${months.map((month) => `<th>${escapeHtml(formatMonth(month).split(" ")[0])}</th>`).join("")}</tr></thead>
          <tbody>
            ${channels.map((channel) => `
              <tr><th>${escapeHtml(channel)}</th>${months.map((month) => {
                const aCell = compareCell(a.plan, month, channel);
                const bCell = compareCell(b.plan, month, channel);
                const spendDelta = Number(bCell.budget_gbp || 0) - Number(aCell.budget_gbp || 0);
                const conversionDelta = displayPlanFtd(bCell.forecast_acquisitions) - displayPlanFtd(aCell.forecast_acquisitions);
                const tone = spendDelta > 1 ? "is-up" : spendDelta < -1 ? "is-down" : "is-flat";
                return `<td class="${tone}"><strong>${spendDelta >= 0 ? "+" : ""}${formatCurrency(spendDelta)}</strong><small>${conversionDelta >= 0 ? "+" : ""}${formatCompactNumber(conversionDelta)} FTD</small></td>`;
              }).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="method-note"><strong>Math owner:</strong> deterministic option engine. The LLM may author an innovation brief but never changes a delta.</div>
    </details>`;
}

function bindPlanCompareControls() {
  const planA = $("#comparePlanA");
  const planB = $("#comparePlanB");
  if (planA) {
    planA.value = app.selectedComparePlanA;
    planA.addEventListener("change", (event) => {
      app.selectedComparePlanA = event.target.value;
      renderFlightpath(getPlan());
    });
  }
  if (planB) {
    planB.value = app.selectedComparePlanB;
    planB.addEventListener("change", (event) => {
      app.selectedComparePlanB = event.target.value;
      renderFlightpath(getPlan());
    });
  }
}

function getPlanValueLens() {
  const scenario = getStateBudgetScenario();
  const rows = (scenario?.states || []).filter((row) => Number(row.forecast_ftds || 0) > 0 && Number(row.budget_usd_equivalent || 0) > 0);
  const volume = rows.reduce((sum, row) => sum + Number(row.forecast_ftds || 0), 0);
  const valueWeighted = rows.reduce((sum, row) => {
    const valueIndex = Number(getStateValueRow(row.state_code)?.value_index || 100);
    return sum + Number(row.forecast_ftds || 0) * valueIndex / 100;
  }, 0);
  const factor = volume > 0 ? valueWeighted / volume : 1;
  return {
    factor,
    stateCount: rows.length,
    method: `Post-tax value is a working index across ${rows.length} funded state rows (${factor.toFixed(3)}× volume); it is not Admiral internal economics.`
  };
}

function displayPlanFtd(value) {
  const amount = Number(value || 0);
  return app.budgetOptimisation === "value" ? amount * getPlanValueLens().factor : amount;
}

function displayPlanCpa(budget, ftd) {
  const denominator = displayPlanFtd(ftd);
  return denominator > 0 ? Number(budget || 0) / denominator : 0;
}

function planFtdLensLabel() {
  return app.budgetOptimisation === "value" ? "Value-weighted FTD proxy" : "FTD proxy";
}

function renderPlanValueLensControl(id) {
  return `
    <label class="compact-select plan-value-lens-control">
      <span>Plan lens</span>
      <select id="${escapeHtml(id)}">
        <option value="volume" ${app.budgetOptimisation === "volume" ? "selected" : ""}>Volume</option>
        <option value="value" ${app.budgetOptimisation === "value" ? "selected" : ""}>Post-tax value</option>
      </select>
    </label>
  `;
}

function bindPlanValueLensControl() {
  $("#flightpathValueModeSelect")?.addEventListener("change", (event) => {
    app.budgetOptimisation = event.target.value === "value" ? "value" : "volume";
    renderFlightpath(getPlan());
    renderPlanningExtensions();
  });
}

function parseStressRequest(raw) {
  const text = String(raw || "").trim();
  const match = text.match(/^(cpm|cpms|cpa)\s*\+\s*(\d+(?:\.\d+)?)%\s+(?:for\s+(.+?)\s+)?in\s+q([1-4])(?:\s+for\s+(.+))?$/i);
  if (!match) {
    return { error: "Use engine vocabulary: CPM +20% in Q4, or CPA +15% for Paid Search in Q1." };
  }
  const magnitude = Number(match[2]);
  if (!Number.isFinite(magnitude) || magnitude <= 0 || magnitude > 100) {
    return { error: "Shock magnitude must be greater than 0% and no more than 100%." };
  }
  const quarter = Number(match[4]);
  const scope = String(match[3] || match[5] || "all buyable channels").trim();
  return {
    metric: match[1].toUpperCase().replace("CPMS", "CPM"),
    magnitude,
    quarter,
    scope,
    label: `${match[1].toUpperCase().replace("CPMS", "CPM")} +${magnitude}% in Q${quarter} for ${scope}`
  };
}

function stressScopeMatches(channel, scope) {
  const clean = String(scope || "").trim().toLowerCase();
  if (["all", "all channels", "all buyable channels"].includes(clean)) return true;
  if (/^(tv\s*\/\s*video|tv|video)$/.test(clean)) return /linear tv|ctv|youtube|video|streaming/i.test(channel);
  if (/^(search|search only)$/.test(clean)) return /search|app store|asa/i.test(channel);
  if (/^(social|social only)$/.test(clean)) return /social|influencer|creator/i.test(channel);
  return String(channel).toLowerCase() === clean;
}

function runStressEngine(plan, request) {
  const startMonth = (request.quarter - 1) * 3 + 1;
  const months = new Set([0, 1, 2].map((offset) => `2026-${String(startMonth + offset).padStart(2, "0")}`));
  const impacted = (plan.monthly_allocations || [])
    .filter((row) => row.buyable !== false && months.has(row.month) && stressScopeMatches(row.channel, request.scope))
    .map((row) => {
      const baselineFtd = Number(row.forecast_acquisitions || 0);
      const stressedFtd = baselineFtd / (1 + request.magnitude / 100);
      return {
        month: row.month,
        channel: row.channel,
        spend: Number(row.budget_gbp || 0),
        baselineFtd,
        stressedFtd,
        ftdDelta: stressedFtd - baselineFtd
      };
    });
  if (!impacted.length) return { error: `No buyable plan rows matched “${request.scope}” in Q${request.quarter}.` };
  const ftdDelta = impacted.reduce((sum, row) => sum + row.ftdDelta, 0);
  const baselineFtd = Number(plan.forecast_acquisitions || 0);
  const stressedFtd = baselineFtd + ftdDelta;
  const stressedCpa = Number(plan.total_allocated_gbp || 0) / Math.max(stressedFtd, 1);
  return {
    request,
    planId: plan.plan_id,
    impacted,
    workingMediaDelta: 0,
    ftdDelta,
    stressedFtd,
    cpaDelta: stressedCpa - Number(plan.forecast_cpa_gbp || 0),
    stressedCpa
  };
}

function renderStressTest(plan) {
  const result = app.stressResult;
  return `
    <details class="stress-test-panel" ${result ? "open" : ""}>
      <summary>Re-run this plan with a cost shock and show what changes</summary>
      <form class="stress-test-form" id="stressTestForm">
        <label>
          <span>Engine-legal shock request</span>
          <input id="stressRequestInput" type="text" value="${escapeHtml(app.stressRequestText)}" placeholder="e.g. CPM +20% in Q4" autocomplete="off">
        </label>
        <button class="small-action" type="submit">Run shock</button>
      </form>
      <p class="method-note">Accepted grammar: <strong>CPM or CPA + percentage, optional channel scope, quarter</strong>. With fixed working media, the engine divides affected FTD proxy by the cost shock. No scenario is pre-filled.</p>
      ${app.stressError ? `<div class="stress-error">${escapeHtml(app.stressError)}</div>` : ""}
      ${result ? `
        <div class="pill-row">
          <span class="pill status-synthetic">SYNTHETIC shock</span>
          <span class="pill status-working">${escapeHtml(result.request.label)}</span>
          <span class="pill">${formatNumber(result.impacted.length)} affected cells</span>
        </div>
        <div class="planning-readout mini-readout">
          <article class="readout-item"><span>Working-media delta</span><strong>${formatCurrency(result.workingMediaDelta)}</strong></article>
          <article class="readout-item"><span>FTD proxy delta</span><strong>${formatNumber(result.ftdDelta)}</strong></article>
          <article class="readout-item"><span>Stressed media CPA</span><strong>${formatMoney(result.stressedCpa, 2)} <small>(${result.cpaDelta >= 0 ? "+" : ""}${formatMoney(result.cpaDelta, 2)})</small></strong></article>
        </div>
        <div class="stress-cell-grid">
          ${result.impacted.map((row) => `
            <article>
              <span>${escapeHtml(formatMonth(row.month))} · ${escapeHtml(row.channel)}</span>
              <strong>${formatNumber(row.ftdDelta)} FTD</strong>
              <small>${formatCurrency(row.spend)} working media unchanged</small>
            </article>
          `).join("")}
        </div>
        <div class="method-note"><strong>Math owner:</strong> deterministic stress engine. An LLM may explain this result, but cannot set the request or alter the re-run.</div>
      ` : ""}
    </details>
  `;
}

function bindStressTestControls(plan) {
  const form = $("#stressTestForm");
  const input = $("#stressRequestInput");
  if (!form || !input) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    app.stressRequestText = input.value;
    const request = parseStressRequest(input.value);
    if (request.error) {
      app.stressResult = null;
      app.stressError = request.error;
    } else {
      const result = runStressEngine(plan, request);
      app.stressResult = result.error ? null : result;
      app.stressError = result.error || "";
    }
    renderFlightpath(plan);
  });
}

function getVerifiedPublisherPlanRows(plan) {
  const policies = (app.data?.publisherPolicies?.rows || [])
    .filter((row) => row.verification_status === "verified_primary");
  const policyByAlias = new Map(policies.flatMap((policy) => (
    (policy.owner_aliases || []).map((alias) => [alias, policy])
  )));
  const channelBudgetByName = new Map((plan?.channel_totals || []).map((row) => [row.channel, Number(row.budget_gbp || 0)]));
  const productKey = publisherPolicyProductKey(app.selectedProduct);
  return (app.data?.mediaOwners?.owners || [])
    .map((owner) => {
      const policy = policyByAlias.get(owner.owner);
      const productRule = productKey === "not_covered" ? null : policy?.product_rules?.[productKey];
      const channelBudget = channelBudgetByName.get(owner.channel) || 0;
      if (!policy || !productRule || !["accepted_with_restrictions", "case_by_case"].includes(productRule.status) || channelBudget <= 0) return null;
      return {
        ...owner,
        policy,
        product_rule: productRule,
        working_media_usd_equivalent: round2(channelBudget * (Number(owner.default_split_pct || 0) / 100))
      };
    })
    .filter(Boolean);
}

function renderPublisherLayer(plan) {
  const dataset = app.data?.publisherPolicies;
  const rows = getVerifiedPublisherPlanRows(plan);
  const verifiedPolicies = (dataset?.rows || []).filter((row) => row.verification_status === "verified_primary");
  const channels = [...new Set(rows.map((row) => row.channel))];
  const productName = publisherPolicyProductKey(app.selectedProduct) === "prediction_markets"
    ? "Prediction markets"
    : productLabel(app.selectedProduct);
  return `
    <section class="publisher-layer" data-publisher-layer-unlocked>
      <div class="publisher-layer-heading">
        <div>
        <p class="eyebrow">Publisher layer</p>
          <h3>${escapeHtml(productName)} owner splits with primary receipts</h3>
          <p>Only exact owner aliases with a primary-verified T185 policy and a usable ${escapeHtml(productName)} rule are shown. Percentages are SYNTHETIC choreography priors, not buying instructions.</p>
        </div>
        <div class="pill-row">
          <span class="pill status-client-safe">${formatNumber(verifiedPolicies.length)} verified policy rows</span>
          <span class="pill status-working">${formatNumber(rows.length)} eligible owner rows</span>
          <span class="pill">checked ${escapeHtml(dataset?.as_of || "not set")}</span>
        </div>
      </div>
      <div class="table-wrap">
        <table class="publisher-summary-table">
          <thead><tr><th>Channel</th><th>Publisher</th><th>Role</th><th>Coverage split</th><th>Working media</th><th>Policy receipt</th></tr></thead>
          <tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.channel)}</td><td>${escapeHtml(row.owner)}</td><td>${escapeHtml(row.role)}</td><td>${formatNumber(row.default_split_pct)}% <small>SYNTHETIC prior</small></td><td>${formatCurrency(row.working_media_usd_equivalent)}</td><td><a class="source-link" href="${escapeHtml(row.policy.policy_url)}" target="_blank" rel="noreferrer">primary receipt</a></td></tr>`).join("") || `<tr><td colspan="6">No receipt-backed publisher row is available for this product.</td></tr>`}</tbody>
        </table>
      </div>
      <div class="publisher-channel-list">
        ${channels.map((channel) => {
          const channelRows = rows.filter((row) => row.channel === channel);
          const visibleShare = channelRows.reduce((sum, row) => sum + Number(row.default_split_pct || 0), 0);
          const hiddenShare = Math.max(0, 100 - visibleShare);
          return `
            <article class="publisher-channel-row">
              <div class="publisher-channel-title">
                <div><span>Channel</span><strong>${escapeHtml(channel)}</strong></div>
                <div><span>Receipt-backed coverage</span><strong>${formatNumber(visibleShare)}%</strong></div>
              </div>
              <div class="publisher-owner-grid">
                ${channelRows.map((row) => `
                  <article class="publisher-owner-row">
                    <div>
                      <strong>${escapeHtml(row.owner)}</strong>
                      <small>${escapeHtml(row.role)}</small>
                    </div>
                    <div class="publisher-owner-numbers">
                      <strong>${formatNumber(row.default_split_pct)}%</strong>
                      <span>${formatCurrency(row.working_media_usd_equivalent)} <small>working_media</small></span>
                    </div>
                    <div class="pill-row">
                      <span class="pill status-synthetic">SYNTHETIC split prior</span>
                      <span class="pill ${publisherPolicyStatusClass(row.product_rule.status)}">${escapeHtml(formatStatus(row.product_rule.status))}</span>
                      <span class="pill status-review">conflict check open</span>
                      <a class="source-link" href="${escapeHtml(row.policy.policy_url)}" target="_blank" rel="noreferrer">primary receipt</a>
                    </div>
                  </article>
                `).join("")}
                ${hiddenShare > 0 ? `
                  <article class="publisher-owner-row is-suppressed">
                    <div>
                      <strong>${formatNumber(hiddenShare)}% suppressed</strong>
                      <small>No exact primary-verified owner-policy alias is loaded for the remaining prior.</small>
                    </div>
                    <span class="pill status-missing">not promoted</span>
                  </article>
                ` : ""}
              </div>
            </article>
          `;
        }).join("") || `
          <article class="publisher-owner-row is-suppressed">
            <strong>No receipt-backed owner row for ${escapeHtml(productName)}</strong>
            <small>The verified policy set has no exact usable alias in the current synthetic owner prior.</small>
          </article>
        `}
      </div>
      <p class="publisher-layer-boundary">Policy receipts establish published category stance only. State legality, campaign approval, inventory availability and partner exclusivity remain separate checks; every visible row keeps its conflict check open.</p>
    </section>
  `;
}

function renderFlightpathPlanCard(entry, activeEntry) {
  const meta = entry.meta || {};
  const plan = entry.plan || {};
  const selected = meta.scenario_key === app.selectedScenario;
  const active = activeEntry?.meta?.plan_id === meta.plan_id;
  const budget = Number(plan.total_allocated_gbp || 0);
  const cpa = displayPlanCpa(budget, plan.forecast_acquisitions);
  const channels = [...(plan.channel_totals || [])].sort((a, b) => Number(b.budget_gbp || 0) - Number(a.budget_gbp || 0)).slice(0, 2);
  const persona = active
    ? "signed-off"
    : meta.scenario_key === "efficiency_v2"
      ? "data-driven alternative"
      : meta.scenario_key === "innovation_v2"
        ? "innovation / LLM brief"
        : meta.scenario_key === "search_only_v2"
          ? "search-only option"
    : meta.status === "draft"
      ? "draft option"
      : meta.scenario_key === "search_legacy"
        ? "search-only history"
        : meta.scenario_key === "growth"
          ? "data-driven alternative"
          : meta.scenario_key === "hold"
            ? "compliance-heavy option"
            : "plan option";
  return `
    <button class="flightpath-plan-card ${selected ? "is-selected" : ""} ${active ? "is-active-plan" : ""}" type="button" data-flightpath-plan-option="${escapeHtml(meta.scenario_key)}">
      <span>${escapeHtml(persona)}</span>
      <strong>${escapeHtml(meta.label || meta.plan_id)}</strong>
      <small>${escapeHtml(formatStatus(meta.status || "stored"))} / ${escapeHtml(formatMonth(meta.period?.start || "2026-01"))}-${escapeHtml(formatMonth(meta.period?.end || "2026-12"))}</small>
      <div class="flightpath-plan-card-metrics">
        <i>${formatCurrency(budget)}</i>
        <i>${formatNumber(displayPlanFtd(plan.forecast_acquisitions))} ${app.budgetOptimisation === "value" ? "value FTD" : "FTD"}</i>
        <i>${formatMoney(cpa, 2)} ${app.budgetOptimisation === "value" ? "media/value" : "CPA"}</i>
      </div>
      <small>${channels.map((channel) => `${channel.channel} ${formatCurrency(channel.budget_gbp || 0)}`).join(" / ") || "No channel totals"}</small>
    </button>
  `;
}

function getVisibleCampaignsForFlightpath() {
  const campaigns = app.oneOffCampaigns || [];
  return campaigns.filter((campaign) => {
    const months = campaign.months || [];
    if (!months.length) return true;
    return months.some((month) => month >= app.flightpathStartMonth && month <= app.flightpathEndMonth);
  });
}

function renderFlightpathCampaignOverlay() {
  const container = $("#flightpathCampaignOverlay");
  if (!container) return;
  const campaigns = getVisibleCampaignsForFlightpath();
  if (!campaigns.length) {
    container.innerHTML = `
      <div class="campaign-overlay-empty">
        <span>No saved campaign overlays yet</span>
        <button class="small-action" type="button" data-chat-mode="oneoff">Create one-off</button>
      </div>
    `;
    return;
  }
  const totalBudget = campaigns.reduce((sum, campaign) => sum + Number(campaign.budget_usd || 0), 0);
  const overlayRows = campaigns.flatMap((campaign) => campaign.overlay_rows || []);
  const overlayMonths = [...new Set(overlayRows.map((row) => row.month))].sort();
  container.innerHTML = `
    <section class="campaign-overlay-panel" aria-label="Saved campaign overlays">
      <div class="campaign-overlay-head">
        <div>
          <p class="eyebrow">Campaign overlays</p>
          <h3>${formatNumber(campaigns.length)} saved campaign${campaigns.length === 1 ? "" : "s"} / ${formatCurrency(totalBudget)}</h3>
        </div>
        <span class="pill status-synthetic">SYNTHETIC campaign economics</span>
      </div>
      <div class="campaign-overlay-list">
        ${campaigns.slice(0, 4).map(renderCampaignOverlayItem).join("")}
      </div>
      <div class="pill-row">
        <span class="pill status-working">${overlayMonths.length ? overlayMonths.map(formatMonth).join(", ") : "no month-specific overlay rows"}</span>
        <span class="pill">campaign object store: local demo</span>
      </div>
    </section>
  `;
}

function renderCampaignOverlayItem(campaign) {
  const topChannels = (campaign.channel_allocations || []).slice(0, 4);
  const basisLabel = campaign.basis === "incremental" ? "Incremental" : campaign.basis === "standalone" ? "Standalone" : "Basis missing";
  return `
    <article class="campaign-overlay-item">
      <div>
        <strong>${escapeHtml(campaign.title || campaign.id)}</strong>
        <span>${escapeHtml(campaign.id)} · ${escapeHtml(basisLabel)} · ${escapeHtml(campaign.period_label || "Annual baseline")}</span>
      </div>
      <div class="campaign-overlay-metrics">
        <span>${formatCurrency(campaign.budget_usd || 0)}</span>
        <span>${escapeHtml(campaign.product_label || "Product")}</span>
        <span>${formatNumber(campaign.state_count || 0)} states</span>
      </div>
      <div class="campaign-channel-bars">
        ${topChannels.map((channel) => `
          <span title="${escapeHtml(channel.channel)} ${formatCurrency(channel.budget_usd || 0)}">
            <i style="width:${Math.max(8, Math.min(100, Number(channel.share_pct || 0)))}%"></i>
            ${escapeHtml(channel.channel)}
          </span>
        `).join("")}
      </div>
    </article>
  `;
}

function buildCampaignOverlayCellMap(campaigns = getVisibleCampaignsForFlightpath()) {
  const map = new Map();
  campaigns.forEach((campaign) => {
    (campaign.overlay_rows || []).forEach((row) => {
      if (row.month < app.flightpathStartMonth || row.month > app.flightpathEndMonth) return;
      const key = `${row.channel}::${row.month}`;
      const items = map.get(key) || [];
      items.push({
        campaign_id: campaign.id,
        title: campaign.title,
        budget_usd: Number(row.budget_usd || 0),
        ftd_proxy: Number(row.ftd_proxy || 0),
        basis: campaign.basis
      });
      map.set(key, items);
    });
  });
  return map;
}

function renderCampaignOverlayCellBadge(items = []) {
  if (!items.length) return "";
  const budget = items.reduce((sum, item) => sum + Number(item.budget_usd || 0), 0);
  const basis = items.some((item) => item.basis === "incremental") ? "incremental" : "campaign";
  return `<em class="campaign-cell-badge">+${formatCurrency(budget)} ${escapeHtml(basis)}</em>`;
}

function askAboutFlightpathGrid() {
  const plan = getPlan();
  const monthlySummaries = buildMonthlySummaries(plan);
  const topMonths = monthlySummaries
    .slice()
    .sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0))
    .slice(0, 3)
    .map((month) => `${formatMonth(month.month)} ${formatCurrency(month.budget)}`);
  openFreeModeWithPageContext({
    surface: "flightpath",
    label: "Flightpath grid",
    question: `Explain the Flightpath grid from ${formatMonth(app.flightpathStartMonth)} to ${formatMonth(app.flightpathEndMonth)} and what a CMO should watch next.`,
    chips: [
      `${formatMonth(app.flightpathStartMonth)}-${formatMonth(app.flightpathEndMonth)}`,
      app.selectedChannel,
      "plan vs actual"
    ],
    body: [
      `Plan: ${getPlanMeta()?.label || plan.plan_id}.`,
      `Range: ${formatMonth(app.flightpathStartMonth)} to ${formatMonth(app.flightpathEndMonth)}.`,
      `Selected channel lens: ${app.selectedChannel}.`,
      topMonths.length ? `Largest planned months: ${topMonths.join("; ")}.` : "",
      "Synthetic actuals and plan-store versions are visible on the grid."
    ].filter(Boolean).join(" "),
    source_ids: ["fanduel_plan_store_v1", "fanduel_sde_monthly_actuals_v1"]
  });
}

function openFreeModeWithPageContext(context = {}) {
  const normalised = {
    id: context.id || `page-context-${context.surface || "output"}`,
    surface: context.surface || "output",
    label: context.label || "Output page",
    question: context.question || "What should I take from this page?",
    chips: Array.isArray(context.chips) ? context.chips.filter(Boolean).map(String) : [],
    body: context.body || "",
    source_ids: Array.isArray(context.source_ids) ? context.source_ids.filter(Boolean) : [],
    createdAt: getDemoToday()
  };
  app.freePageContext = normalised;
  activateChatMode("free");
  const conversation = ensureChatConversation("free");
  const attachmentText = buildFreePageContextAttachment(normalised);
  conversation.attachments = [
    ...(conversation.attachments || []).filter((attachment) => !["page-context", "flightpath-grid-context"].includes(attachment.id)),
    {
      id: "page-context",
      name: `${normalised.surface}-context.md`,
      kind: "md",
      text: attachmentText,
      charCount: attachmentText.length,
      wordCount: attachmentText.split(/\s+/).filter(Boolean).length,
      createdAt: getDemoToday()
    }
  ];
  conversation.updatedAt = getDemoToday();
  persistChatSessions();
  app.selectedSurface = "planning";
  render();
  const input = $("#planningChatInput");
  if (input) {
    input.value = normalised.question;
    input.focus();
  }
}

function buildFreePageContextAttachment(context) {
  return [
    `# ${context.label} context`,
    `Surface: ${context.surface}`,
    context.chips?.length ? `Chips: ${context.chips.join(", ")}` : "",
    context.body || "",
    context.source_ids?.length ? `Receipts: ${context.source_ids.join(", ")}` : "",
    "Use this page context when the user refers to this page, this grid, this report, this period or this state."
  ].filter(Boolean).join("\n");
}

function askAboutReportingPage() {
  const reporting = buildReportingDossier();
  const topRows = (reporting.line_items?.top_rows || [])
    .slice(0, 3)
    .map((row) => `${row.platform} / ${row.line_item}: ${row.cost}, ${row.conversions} conversions, ${row.cpa} CPA`);
  openFreeModeWithPageContext({
    surface: "reporting",
    label: "Reporting view",
    question: `What is the CMO read on ${reporting.month.label} ${reporting.view.label}, and what should we watch before changing the plan?`,
    chips: [
      reporting.view.label,
      reporting.month.label,
      reporting.kpis.spend,
      `${formatNumber(reporting.line_items.row_count)} rows`
    ],
    body: [
      `${reporting.month.label} ${reporting.view.label}: ${reporting.kpis.spend} spend, ${reporting.kpis.conversions} conversions, ${reporting.kpis.cpa} ${reporting.view.cpa_mode === "all_in" ? "all-in CAC" : "media CPA"}.`,
      `${formatNumber(reporting.line_items.row_count)} line-item rows are loaded (${formatNumber(reporting.line_items.compact_count || 0)} compact, ${formatNumber(reporting.line_items.modelled_count || 0)} modelled) with ${reporting.line_items.display_flag} status.`,
      topRows.length ? `Top rows: ${topRows.join("; ")}.` : "No compact line-item rows are loaded for this view/month."
    ].join(" "),
    source_ids: ["fanduel_reporting_line_items_2026", "fanduel_marketing_spend_baseline_2026", "fanduel_sde_monthly_actuals_v1"]
  });
}

function askAboutInsightsPage() {
  const lab = getIdeasLabData();
  const paidSerp = getPaidSerpSummary();
  const heatState = (lab.states || []).find((state) => state.code === app.selectedInsightHeatState) || (lab.states || [])[0] || {};
  const ownerRows = (lab.mediaOwners?.owners || []).filter((owner) => app.selectedInsightOwnerType === "all" || owner.type === app.selectedInsightOwnerType);
  openFreeModeWithPageContext({
    surface: "insights",
    label: "Insights board",
    question: `What are the useful planning takeaways from the current Insights board for ${productLabel(app.selectedProduct)}?`,
    chips: [
      `${formatNumber(lab.shareSeries?.length || 0)} search weeks`,
      heatState.code || "state heat",
      `${formatNumber(ownerRows.length)} owner rows`,
      insightBrandLabel(app.selectedInsightQueryBrand)
    ],
    body: [
      `Share-of-search race has ${formatNumber(lab.shareSeries?.length || 0)} real comparative weeks nationally and ${formatNumber(lab.stateComparativeRows?.length || 0)} same-request state rows.`,
      heatState.code ? `${heatState.state || heatState.code} is the selected heat tile: FanDuel index ${Math.round(heatState.fd_strength || 0)}, regulation load ${Math.round(heatState.restriction_load || 0)}, posture ${heatState.stance || heatState.posture || "working"}.` : "",
      `Media-owner rows are authored working research; ${formatNumber(ownerRows.length)} rows are visible for ${formatStatus(app.selectedInsightOwnerType)}.`,
      `Search ideas are filtered to ${insightBrandLabel(app.selectedInsightQueryBrand)}; the separate DataForSEO cut has ${formatNumber(paidSerp.totalRows)} paid observations, including ${formatNumber(paidSerp.sportsbookRows.length)} sportsbook-relevant rows.`
    ].filter(Boolean).join(" "),
    source_ids: ["fanduel_ideas_lab_t092", "dataforseo_paid_serp_fanduel_2026_07_09", "fanduel_media_owner_working_priors_v1"]
  });
}

function askAboutRegulationPage() {
  const row = getSelectedStateRow();
  const productKey = app.selectedProduct;
  const rule = row ? getProductRule(row, productKey) : null;
  const status = row ? getProductStatus(row, productKey) : "unknown";
  const posture = row?.market_posture || (row ? inferMarketPosture(row) : null);
  openFreeModeWithPageContext({
    surface: "regulation",
    label: "Regulation state",
    question: `What does Regulation say about ${getSelectedStateName()} ${productLabel(productKey)}, and how should marketing use it?`,
    chips: [
      getSelectedStateName(),
      productLabel(productKey),
      formatStatus(status),
      rule?.review_status || "legal review"
    ],
    body: [
      row ? `${getSelectedStateName()} has ${formatNumber(row.population_2025 || 0)} 2025 residents in the working matrix.` : `${getSelectedStateName()} is not in the priority matrix.`,
      posture?.recommended_use || row?.planning_action || "Route to state/legal review before activation.",
      rule ? `${rule.source_label}; source date ${rule.source_date}; confidence ${rule.confidence}; regulator ${rule.regulator}.` : "No product-specific source receipt is loaded for the current selection."
    ].filter(Boolean).join(" "),
    source_ids: rule?.source_id ? [rule.source_id] : ["fanduel_state_governance_working_matrix_v1"]
  });
}

function renderTimeMachineGrid(plan, containerId = "timeMachineGrid", options = {}) {
  const container = $(`#${containerId}`);
  if (!container) return;
  const rows = plan.monthly_allocations || [];
  const months = [...new Set([
    ...getCalendarMonths(),
    ...rows.map((row) => row.month)
  ])]
    .filter((month) => !options.startMonth || month >= options.startMonth)
    .filter((month) => !options.endMonth || month <= options.endMonth)
    .sort();
  const channelTotals = rows.reduce((totals, row) => {
    totals[row.channel] = (totals[row.channel] || 0) + Number(row.budget_gbp || 0);
    return totals;
  }, {});
  const channels = Object.keys(channelTotals).sort((a, b) => channelTotals[b] - channelTotals[a]);
  const rowByChannelMonth = new Map(rows.map((row) => [`${row.channel}::${row.month}`, row]));
  const actualByChannelMonth = actualsByChannelMonth();
  const campaignOverlayByCell = buildCampaignOverlayCellMap();
  const statusCounts = months.reduce((counts, month) => {
    const status = getMonthStatus(month);
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  const selectedMonthRows = rows.filter((row) => row.month === app.selectedCalendarMonth);
  const selectedActualRows = (app.data.actualsMonthly?.rows || []).filter((row) => row.month === app.selectedCalendarMonth);
  const selectedSdePlanRows = selectedActualRows.filter((row) => Number(row.planned_spend || 0) > 0 || row.line_type === "non_buyable_demand");
  const selectedMonthBudget = (selectedSdePlanRows.length ? selectedSdePlanRows : selectedMonthRows)
    .reduce((sum, row) => sum + Number(row.planned_spend ?? row.budget_gbp ?? 0), 0);
  const selectedMonthFtdsRaw = (selectedSdePlanRows.length ? selectedSdePlanRows : selectedMonthRows)
    .reduce((sum, row) => sum + Number(row.planned_conversions ?? row.forecast_acquisitions ?? 0), 0);
  const selectedMonthFtds = displayPlanFtd(selectedMonthFtdsRaw);
  const selectedActualSpend = selectedActualRows.reduce((sum, row) => sum + Number(row.actual_spend || 0), 0);
  const selectedActualFtds = selectedActualRows.reduce((sum, row) => sum + Number(row.conversions || 0), 0);
  const selectedHasActuals = selectedActualRows.length > 0 && getMonthStatus(app.selectedCalendarMonth) === "past";
  const sdeManifest = app.data.actualsManifest;
  const gridOnly = Boolean(options.gridOnly);
  container.innerHTML = `
    ${gridOnly ? "" : `<div class="planning-readout time-cursor-readout">
      <article class="readout-item">
        <span>Past months</span>
        <strong>${formatNumber(statusCounts.past || 0)} SYNTHETIC actuals</strong>
      </article>
      <article class="readout-item">
        <span>Current month</span>
        <strong>${escapeHtml(formatMonth(getDemoCurrentMonth()))} pacing</strong>
      </article>
      <article class="readout-item">
        <span>Future months</span>
        <strong>${formatNumber(statusCounts.future || 0)} plan</strong>
      </article>
      <article class="readout-item">
        <span>Selected month</span>
        <strong>${
          selectedHasActuals
            ? `${formatCurrency(selectedActualSpend)} actual / ${formatNumber(selectedActualFtds)} FTD`
            : `${formatCurrency(selectedMonthBudget)} plan / ${formatNumber(selectedMonthFtds)} ${app.budgetOptimisation === "value" ? "value-weighted proxy" : "FTD proxy"}`
        }</strong>
      </article>
    </div>
    <div class="pill-row time-machine-flags">
      <span class="pill status-synthetic">${escapeHtml(sdeManifest?.display_flag || "SYNTHETIC")}</span>
      <span class="pill status-working">coherence ${escapeHtml(sdeManifest?.coherence_report?.passed ? "passed" : "pending")}</span>
      <span class="pill">GA4 / Google Ads / Meta / Plans / ATL / Creative</span>
      <span class="pill ${app.budgetOptimisation === "value" ? "status-review" : "status-working"}">${escapeHtml(planFtdLensLabel())}</span>
    </div>`}
    <div class="time-grid-scroll" data-flightpath-grid="shared">
      <table class="time-machine-grid-table">
        <thead>
          <tr>
            <th scope="col">Channel</th>
            ${months.map((month) => {
              const summary = getMonthHeatSummary(month);
              return `<th scope="col" data-flightpath-month="${escapeHtml(month)}" class="${month === app.selectedCalendarMonth ? "is-selected" : ""}">${escapeHtml(formatMonth(month).split(" ")[0])}<span>${escapeHtml(getMonthStatusLabel(month))}</span>${renderGridMonthHeatMarker(summary)}</th>`;
            }).join("")}
          </tr>
        </thead>
        <tbody>
          ${channels.map((channel) => `
            <tr>
              <th scope="row">${escapeHtml(channel)}</th>
              ${months.map((month) => {
                const row = rowByChannelMonth.get(`${channel}::${month}`);
                const actual = actualByChannelMonth.get(`${channel}::${month}`);
                const heatSummary = getMonthHeatSummary(month);
                const status = getMonthStatus(month);
                const isSelected = month === app.selectedCalendarMonth;
                const showActual = status === "past" && actual;
                const plannedSpend = Number(actual?.planned_spend ?? row?.budget_gbp ?? 0);
                const plannedFtds = Number(actual?.planned_conversions ?? row?.forecast_acquisitions ?? 0);
                const displayedPlannedFtds = displayPlanFtd(plannedFtds);
                const isDemandLine = actual?.line_type === "non_buyable_demand" || actual?.buyable === false;
                const isRgLine = actual?.line_type === "responsible_gambling_share";
                const variancePct = actual && plannedSpend ? ((Number(actual.actual_spend || 0) - plannedSpend) / plannedSpend) * 100 : 0;
                const salesIndex = Number(actual?.sales_index || 0);
                const varianceClass = showActual ? salesIndex >= 1 ? "variance-good" : "variance-watch" : "";
                const campaignRows = campaignOverlayByCell.get(`${channel}::${month}`) || [];
                const title = isRgLine
                  ? `${channel} ${formatMonth(month)} responsible-gambling share ${Number(actual.rg_message_share_pct || 0).toFixed(1)}%`
                  : showActual
                  ? `${channel} ${formatMonth(month)} synthetic actual ${formatCurrency(actual.actual_spend)} vs plan ${formatCurrency(plannedSpend)}`
                  : isDemandLine
                    ? `${channel} ${formatMonth(month)} non-buyable demand line ${formatCompactNumber(displayedPlannedFtds)} ${planFtdLensLabel()}`
                    : `${channel} ${formatMonth(month)} plan ${formatCurrency(plannedSpend)}`;
                return `
                  <td>
                    <button class="time-cell time-${escapeHtml(status)} ${varianceClass} ${showActual ? "has-actual" : ""} ${isDemandLine ? "is-demand-line" : ""} ${isRgLine ? "is-rg-line" : ""} ${isSelected ? "is-selected" : ""}" type="button" data-time-month="${escapeHtml(month)}" data-time-channel="${escapeHtml(channel)}" title="${escapeHtml(title)}">
                      <strong>${isRgLine ? `RG ${Number(actual.rg_message_share_pct || 0).toFixed(1)}%` : isDemandLine ? "Demand" : formatCurrency(showActual ? actual.actual_spend : plannedSpend)}</strong>
                      <span>${
                        isRgLine
                          ? `${formatCurrency(actual.rg_covered_spend || 0)} covered spend`
                          : showActual
                          ? `${variancePct >= 0 ? "+" : ""}${variancePct.toFixed(0)}% spend / ${salesIndex.toFixed(2)} sales`
                          : isDemandLine
                            ? `0 media spend / ${formatCompactNumber(displayedPlannedFtds)} ${app.budgetOptimisation === "value" ? "value FTD" : "FTD"}`
                            : `${formatCompactNumber(displayedPlannedFtds)} ${app.budgetOptimisation === "value" ? "value FTD" : "FTD"}`
                      }</span>
                      ${renderTimeCellHeatNote(month, channel, heatSummary)}
                      ${renderCampaignOverlayCellBadge(campaignRows)}
                    </button>
                  </td>
                `;
              }).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ${gridOnly ? "" : `<div class="note-list compact-notes">
      <div class="note-item">Time cursor is pinned to ${escapeHtml(getDemoToday())}. Past-month values now come from the reusable Synthetic Data Engine and must display the SYNTHETIC flag until real connectors replace them.</div>
      ${app.budgetOptimisation === "value" ? `<div class="note-item">${escapeHtml(getPlanValueLens().method)} Past synthetic actuals remain volume actuals; the value lens applies to plan proxies.</div>` : ""}
    </div>
    ${renderRevisionPanel()}`}
  `;
  container.querySelectorAll("[data-time-month]").forEach((button) => {
    button.addEventListener("click", () => {
      app.selectedCalendarMonth = button.dataset.timeMonth;
      app.selectedReportingMonth = button.dataset.timeMonth;
      activateChatMode("month");
      app.selectedCalendarView = "month";
      app.selectedEvidenceContext = {
        surface: "time-grid",
        month: button.dataset.timeMonth,
        channel: button.dataset.timeChannel,
        stateCode: app.planningScope === "national" ? "US" : app.selectedState,
        productKey: app.selectedProduct
      };
      render();
      openEvidenceDrawer();
    });
  });
  container.querySelector("[data-revision-start]")?.addEventListener("click", () => {
    app.revisionDraft = buildRevisionDraft(plan, app.selectedCalendarMonth);
    activateChatMode("month");
    render();
  });
  container.querySelector("[data-revision-save]")?.addEventListener("click", async () => {
    await activateRevisionDraft();
    render();
  });
  container.querySelector("[data-revision-cancel]")?.addEventListener("click", () => {
    app.revisionDraft = null;
    render();
  });
}

function openEvidenceDrawer() {
  const drawer = $("#evidenceDrawer");
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  renderEvidenceDrawer();
}

function closeEvidenceDrawer() {
  const drawer = $("#evidenceDrawer");
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
}

function getProductStatus(row = getSelectedStateRow(), productKey = app.selectedProduct) {
  if (!row) {
    return "unknown";
  }
  if (isCustomProduct(productKey)) {
    return "not_listed";
  }
  return row[`${productKey}_status`] || "unknown";
}

function getProductRule(row = getSelectedStateRow(), productKey = app.selectedProduct) {
  if (row && isCustomProduct(productKey)) {
    return getCustomProductRule(productKey, row);
  }
  return row?.rules?.find((rule) => rule.product_key === productKey);
}

function isActivationSuppressed(status) {
  return status === "blocked" || status === "not_listed";
}

// Demo-only view-layer state adjustment. Engine-level state dimensioning is the Stage 3 build.
function buildPlanView(plan, row) {
  const productStatus = getProductStatus(row);
  const baseView = {
    basePlan: plan,
    scenario: plan.scenario,
    channel_totals: plan.channel_totals,
    totalAllocated: plan.total_allocated_gbp,
    forecastAcquisitions: plan.forecast_acquisitions,
    forecastCpa: plan.forecast_cpa_gbp,
    paidSerpLabel: app.data.search.paid_keywords_count === 0 ? "missing" : String(app.data.search.paid_keywords_count),
    adjustment: null
  };

  if (!isActivationSuppressed(productStatus)) {
    return baseView;
  }

  const adjustedChannels = plan.channel_totals.map((channel) => ({ ...channel }));
  const suppressedChannels = adjustedChannels.filter((channel) => SENSITIVE_CHANNELS.has(channel.channel));
  const watchlistChannels = adjustedChannels.filter((channel) => WATCHLIST_CHANNELS.has(channel.channel));
  const suppressedBudget = suppressedChannels.reduce((total, channel) => total + channel.budget_gbp, 0);
  const heldBudget = Math.round(suppressedBudget * 0.6);
  const reallocatedBudget = suppressedBudget - heldBudget;
  const watchlistBase = watchlistChannels.reduce((total, channel) => total + channel.budget_gbp, 0) || watchlistChannels.length || 1;

  adjustedChannels.forEach((channel) => {
    channel.original_budget_gbp = channel.budget_gbp;
    if (SENSITIVE_CHANNELS.has(channel.channel)) {
      channel.budget_gbp = 0;
      channel.state_adjustment = "suppressed";
    } else if (WATCHLIST_CHANNELS.has(channel.channel)) {
      const share = channel.original_budget_gbp / watchlistBase;
      channel.budget_gbp = Math.round(channel.original_budget_gbp + reallocatedBudget * share);
      channel.state_adjustment = "watchlist";
    }
    channel.forecast_acquisitions = forecastAnnualFtds(channel.channel, channel.budget_gbp, channel.forecast_acquisitions, channel.original_budget_gbp);
  });

  const totalAllocated = adjustedChannels.reduce((total, channel) => total + channel.budget_gbp, 0);
  const forecastAcquisitions = Math.round(adjustedChannels.reduce((total, channel) => total + channel.forecast_acquisitions, 0));
  const forecastCpa = forecastAcquisitions > 0 ? totalAllocated / forecastAcquisitions : 0;
  adjustedChannels.forEach((channel) => {
    channel.share_pct = totalAllocated > 0 ? (channel.budget_gbp / totalAllocated) * 100 : 0;
  });

  return {
    ...baseView,
    channel_totals: adjustedChannels,
    totalAllocated,
    forecastAcquisitions,
    forecastCpa,
    paidSerpLabel: "held",
    adjustment: {
      productStatus,
      suppressedBudget,
      reallocatedBudget,
      heldBudget,
      forecastImpact: plan.forecast_acquisitions - forecastAcquisitions
    }
  };
}

function forecastAnnualFtds(channelName, annualBudget, fallbackFtds, fallbackBudget) {
  if (annualBudget <= 0) {
    return 0;
  }
  const curve = app.data.curves.channels.find((item) => item.channel === channelName);
  if (!curve) {
    const ratio = fallbackBudget > 0 ? annualBudget / fallbackBudget : 1;
    return Math.round(fallbackFtds * ratio);
  }
  const monthlySpend = annualBudget / 12;
  const cpa = estimateCpa(curve, monthlySpend);
  return Math.round(annualBudget / cpa);
}

function renderMetrics(planView) {
  $("#budgetMetric").textContent = formatCurrency(planView.totalAllocated);
  $("#ftdMetric").textContent = formatNumber(planView.forecastAcquisitions);
  $("#cpaMetric").textContent = formatCurrency(planView.forecastCpa);
  $("#paidMetric").textContent = planView.paidSerpLabel;

  const metricNotes = Array.from(document.querySelectorAll(".metric-panel small"));
  if (planView.adjustment) {
    metricNotes.forEach((note) => {
      note.textContent = "synthetic demo model";
    });
  } else {
    const defaults = ["working USD-equivalent", "synthetic demo model", "USD-labelled economics", "show gap, not efficiency claim"];
    metricNotes.forEach((note, index) => {
      note.textContent = defaults[index] || "";
    });
  }
}

function renderReallocationDelta(planView) {
  const delta = $("#reallocationDelta");
  if (!planView.adjustment) {
    delta.classList.add("is-hidden");
    delta.innerHTML = "";
    return;
  }
  const deltaFtds = planView.forecastAcquisitions - planView.basePlan.forecast_acquisitions;
  const deltaSign = deltaFtds >= 0 ? "+" : "-";
  delta.classList.remove("is-hidden");
  delta.innerHTML = `
    <span>Reallocated ${formatCurrency(planView.adjustment.reallocatedBudget)} away from excluded activation. Held ${formatCurrency(planView.adjustment.heldBudget)} for compliance review.</span>
    <small>Forecast delta: ${deltaSign}${formatNumber(Math.abs(deltaFtds))} FTDs. View-layer demo model only.</small>
  `;
}

function renderFirewall(row) {
  populateFirewallStateSelect();
  if (!row) {
    $("#firewallVerdict").innerHTML = `<strong>Unknown state</strong><p>No governance row is loaded.</p>`;
    return;
  }

  const status = getProductStatus(row);
  const rule = getProductRule(row);
  const selectedProductLabel = productLabel(app.selectedProduct);
  const title = `${row.state} ${selectedProductLabel}`;
  $("#firewallTitle").textContent = title;

  const verdict = getVerdictCopy(status, row, rule);
  $("#firewallVerdict").className = `verdict ${statusClass(status)}`;
  $("#firewallVerdict").innerHTML = `
    <strong>${escapeHtml(verdict.heading)}</strong>
    <p>${escapeHtml(verdict.body)}</p>
  `;

  const products = Object.keys(PRODUCT_LABELS).map((key) => [key, getProductStatus(row, key)]);
  $("#productStatuses").innerHTML = products
    .map(([key, value]) => {
      const itemRule = getProductRule(row, key);
      return `
      <div class="product-status">
        <span>${escapeHtml(productLabel(key))}</span>
        <strong>${escapeHtml(formatStatus(value))}</strong>
        <small>${escapeHtml(itemRule ? `${itemRule.source_date} / ${itemRule.source_id}` : "state source")}</small>
      </div>
    `;
    })
    .join("");

  const restrictions = [
    ...row.notable_restrictions,
    row.planning_action,
    rule ? `${rule.source_label}. Source date: ${rule.source_date}.` : `${app.data.governance.source_scope}. Source date: ${app.data.governance.source_date}.`,
    rule ? `Receipt: ${rule.source_url}` : "",
    rule ? `Regulator verification: ${rule.regulator}. Review status: ${rule.review_status}.` : ""
  ];
  $("#restrictionList").innerHTML = restrictions
    .filter(Boolean)
    .map((note) => `<div class="note-item">${escapeHtml(note)}</div>`)
    .join("");
  const notice = $("#firewallApprovalNotice");
  if (notice) {
    notice.classList.toggle("is-hidden", !app.firewallApprovalNotice);
    notice.textContent = app.firewallApprovalNotice;
  }
}

function getVerdictCopy(status, row, rule) {
  const selectedProductLabel = productLabel(app.selectedProduct);
  if (status === "blocked") {
    return {
      heading: "Blocked for activation",
      body: `${selectedProductLabel} spend is suppressed in ${row.state}. The demo can keep education, organic or watchlist work visible only with caveats.`
    };
  }
  if (status === "not_listed") {
    return {
      heading: "Not listed by FanDuel source",
      body: `${selectedProductLabel} is not listed in ${rule?.source_label || "the current FanDuel-owned availability source"}, so activation is excluded pending verification.`
    };
  }
  if (status === "legal-review") {
    return {
      heading: "Legal review required",
      body: `${selectedProductLabel} needs compliance/legal sign-off before activation. This is a planning workflow flag, not legal advice.`
    };
  }
  if (status === "restricted") {
    return {
      heading: "Restricted working source",
      body: `${selectedProductLabel} can appear only with the listed restrictions and source receipts. Regulator verification remains open.`
    };
  }
  if (status === "allowed") {
    return {
      heading: "Allowed from working source",
      body: `${selectedProductLabel} is clear in the current FanDuel-owned source pass. Regulator verification is still required before client-facing claims.`
    };
  }
  return {
    heading: "Unknown",
    body: "No activation recommendation can be made from the loaded evidence."
  };
}

function renderPlanBars(planView, row) {
  $("#planTitle").textContent = planView.scenario.label;
  const maxBudget = Math.max(...planView.channel_totals.map((channel) => channel.budget_gbp));
  const productStatus = getProductStatus(row);
  const sortedChannels = [...planView.channel_totals].sort((a, b) => b.budget_gbp - a.budget_gbp);
  const suppressedChannels = sortedChannels.filter((channel) => channel.state_adjustment === "suppressed");
  const channels = planView.adjustment
    ? [...sortedChannels.filter((channel) => channel.state_adjustment !== "suppressed").slice(0, 8), ...suppressedChannels]
    : sortedChannels.slice(0, 10);

  $("#channelBars").innerHTML = channels
    .map((channel) => {
      const adjustment = channelAdjustment(channel.channel, productStatus, channel.state_adjustment);
      const fillClass = adjustment || evidenceClass(channel.evidence_strength);
      const width = channel.budget_gbp > 0 && maxBudget > 0 ? Math.max(3, Math.round((channel.budget_gbp / maxBudget) * 100)) : 0;
      const suffix = adjustment || channel.evidence_strength;
      const style = `width:${width}%;${width === 0 ? "min-width:0" : ""}`;
      const value = channel.state_adjustment === "suppressed" ? "held" : `${channel.share_pct.toFixed(1)}%`;
      return `
        <button class="bar-row channel-reason-row" type="button" data-allocation-channel="${escapeHtml(channel.channel)}" title="${escapeHtml(suffix)}">
          <div class="bar-label">${escapeHtml(channel.channel)}</div>
          <div class="bar-track">
            <div class="bar-fill ${escapeHtml(fillClass)}" style="${style}"></div>
          </div>
          <div class="bar-value">${escapeHtml(value)}</div>
        </button>
      `;
    })
    .join("");
  $$("#channelBars [data-allocation-channel]").forEach((button) => {
    button.addEventListener("click", () => {
      app.selectedEvidenceContext = {
        surface: "allocation-row",
        month: app.selectedCalendarMonth,
        channel: button.dataset.allocationChannel,
        stateCode: app.planningScope === "national" ? "US" : app.selectedState,
        productKey: app.selectedProduct
      };
      openEvidenceDrawer();
    });
  });
}

function channelAdjustment(channel, productStatus, stateAdjustment) {
  if (isActivationSuppressed(productStatus) && (SENSITIVE_CHANNELS.has(channel) || stateAdjustment === "suppressed")) {
    return "blocked";
  }
  if (isActivationSuppressed(productStatus) && (WATCHLIST_CHANNELS.has(channel) || stateAdjustment === "watchlist")) {
    return "watchlist";
  }
  return "";
}

function renderPlanningExtensions() {
  if (app.selectedMapLayer === "zip3") {
    renderZip3Map("planningMap", "mapLegend");
  } else {
    renderStateMap("planningMap", "mapLegend", app.selectedMapLayer);
  }
  renderStateBudgetTable();
}

function renderStateBudgetTable() {
  const scenario = getStateBudgetScenario();
  const enrichedRows = scenario.states
    .filter((state) => state.budget_usd_equivalent > 0)
    .map((state) => {
      const valueRow = getStateValueRow(state.state_code);
      const valueIndex = Number(valueRow?.value_index || 100);
      return {
        ...state,
        valueRow,
        value_index: valueIndex,
        value_weighted_ftds: Number(state.forecast_ftds || 0) * (valueIndex / 100)
      };
    });
  const rows = enrichedRows
    .sort((a, b) => {
      if (app.budgetOptimisation === "value") {
        return b.value_weighted_ftds - a.value_weighted_ftds;
      }
      return b.budget_usd_equivalent - a.budget_usd_equivalent;
    })
    .slice(0, 8);
  const selectedBudget = getSelectedBudgetRow();
  const selectedProductLabel = productLabel(scenario.product_key || app.selectedProduct);
  const budgetOptimisationSelect = $("#budgetOptimisationSelect");
  if (budgetOptimisationSelect) budgetOptimisationSelect.value = app.budgetOptimisation;
  if (!rows.length) {
    $("#stateBudgetTable").innerHTML = `
      <article class="note-item">
        No activation budget is allocated for ${escapeHtml(selectedProductLabel)} under the current governance mask. Keep activity in legal review or watchlist channels only.
      </article>
    `;
    return;
  }
  $("#stateBudgetTable").innerHTML = rows
    .map((state) => `
      <button class="state-budget-row" type="button" data-state-code="${escapeHtml(state.state_code)}">
        <span>${escapeHtml(state.state_code)}<small>${escapeHtml(state.state)}</small></span>
        <span>${formatCurrency(state.budget_usd_equivalent)}<small>${state.share_pct.toFixed(2)}% share</small></span>
        <span>${formatNumber(app.budgetOptimisation === "value" ? state.value_weighted_ftds : state.forecast_ftds)}<small>${app.budgetOptimisation === "value" ? "value-weighted FTDs" : "FTD proxy"}</small></span>
        <span>${escapeHtml(state.value_index.toFixed(1))}<small>value index</small></span>
        <span>${escapeHtml(formatStatus(state.governance_status))}<small>${escapeHtml(state.valueRow?.source_id || state.evidence_status)}</small></span>
      </button>
    `)
    .join("") + `
      <article class="note-item">
        ${escapeHtml(selectedProductLabel)} model for ${escapeHtml(scenario.scenario_label)}. Selected state:
        ${selectedBudget ? `${escapeHtml(selectedBudget.state_code)} ${formatCurrency(selectedBudget.budget_usd_equivalent)} / ${formatNumber(selectedBudget.forecast_ftds)} FTD proxy` : "unknown"}.
      </article>
      <article class="note-item">
        Value mode uses ${escapeHtml(app.data.stateValueIndex?.method || "post-tax working index")}. Working source, not Admiral internal economics.
      </article>
    `;
  $$("#stateBudgetTable .state-budget-row").forEach((button) => {
    button.addEventListener("click", () => {
      selectState(button.dataset.stateCode);
    });
  });
}

function getStateValueRow(stateCode) {
  return app.data.stateValueIndex?.rows?.find((row) => row.state_code === stateCode);
}

function renderStatePlanningSummary() {
  const container = $("#statePlanningSummary");
  if (!container) return;
  const scenario = getStateBudgetScenario();
  const rows = scenario.states
    .map((state) => {
      const governanceRow = app.data.governance.state_rows.find((row) => row.state_code === state.state_code);
      return { ...state, governanceRow, posture: governanceRow?.market_posture || inferMarketPosture(governanceRow || {}) };
    })
    .sort((a, b) => b.budget_usd_equivalent - a.budget_usd_equivalent);
  const activationRows = rows.filter((row) => row.budget_usd_equivalent > 0);
  const heldRows = rows.filter((row) => row.budget_usd_equivalent === 0);
  const byCategory = rows.reduce((groups, row) => {
    const category = row.posture?.category || "unknown";
    if (!groups[category]) groups[category] = [];
    groups[category].push(row);
    return groups;
  }, {});
  const categories = [
    ["multi_product_growth", "Multi-product"],
    ["sportsbook_growth", "Sportsbook growth"],
    ["predicts_only_watchlist", "Predicts watchlist"],
    ["retail_or_limited", "Retail / limited"],
    ["legal_review_heavy", "Legal-review heavy"]
  ];
  container.innerHTML = `
    <div class="planning-readout">
      <article class="readout-item">
        <span>Activation states</span>
        <strong>${formatNumber(activationRows.length)} states / ${formatCurrency(activationRows.reduce((sum, row) => sum + row.budget_usd_equivalent, 0))}</strong>
      </article>
      <article class="readout-item">
        <span>Held or watchlist</span>
        <strong>${formatNumber(heldRows.length)} states</strong>
      </article>
      <article class="readout-item">
        <span>Selected state</span>
        <strong>${escapeHtml(getSelectedStateName())}: ${escapeHtml(getSelectedBudgetRow()?.governance_status ? formatStatus(getSelectedBudgetRow().governance_status) : "Unknown")}</strong>
      </article>
    </div>
    <div class="state-category-grid">
      ${categories
        .map(([category, label]) => renderStateCategoryCard(label, byCategory[category] || []))
        .join("")}
    </div>
  `;
  $$("#statePlanningSummary .state-chip").forEach((button) => {
    button.addEventListener("click", () => selectState(button.dataset.stateCode));
  });
}

function renderStateCategoryCard(label, rows) {
  const topRows = rows.slice().sort((a, b) => b.budget_usd_equivalent - a.budget_usd_equivalent).slice(0, 6);
  return `
    <article class="state-category-card">
      <div>
        <span>${escapeHtml(label)}</span>
        <strong>${formatNumber(rows.length)}</strong>
      </div>
      <div class="state-chip-row">
        ${
          topRows.length
            ? topRows.map((row) => `
                <button class="state-chip" type="button" data-state-code="${escapeHtml(row.state_code)}">
                  ${escapeHtml(row.state_code)} <small>${row.budget_usd_equivalent > 0 ? formatCurrency(row.budget_usd_equivalent) : "held"}</small>
                </button>
              `).join("")
            : `<span class="pill">none</span>`
        }
      </div>
    </article>
  `;
}

function renderStateMap(containerId, legendId, layer) {
  const scenario = getStateBudgetScenario();
  const states = [...scenario.states].sort((a, b) => a.state_code.localeCompare(b.state_code));
  const maxBudget = Math.max(...states.map((state) => state.budget_usd_equivalent || 0), 1);
  const container = $(`#${containerId}`);
  const planningSelection = containerId === "planningMap" ? new Set(getSelectedPlanningStateCodes(app.selectedProduct)) : new Set();
  container.classList.remove("zip3-map-wrap");
  container.classList.add("state-map");
  container.innerHTML = states
    .map((state) => {
      const cell = mapCellData(state, layer, maxBudget);
      const selectedClass = state.state_code === app.selectedState ? "is-selected" : "";
      const planningClass = planningSelection.has(state.state_code) ? "is-planning-selected" : "";
      const overrideClass = containerId === "planningMap" ? getStateSelectionClass(state.state_code, app.selectedProduct) : "";
      return `
        <button class="state-cell ${selectedClass} ${planningClass} ${escapeHtml(overrideClass)}" type="button" data-state-code="${escapeHtml(state.state_code)}" style="background:${cell.color}">
          <span class="state-code">${escapeHtml(state.state_code)}</span>
          <span class="state-value">${escapeHtml(cell.label)}</span>
        </button>
      `;
    })
    .join("");
  $(`#${legendId}`).innerHTML = renderMapLegend(layer);
  container.querySelectorAll(".state-cell").forEach((button) => {
    button.addEventListener("click", () => {
      selectState(button.dataset.stateCode);
    });
  });
}

function renderZip3Map(containerId, legendId) {
  const container = $(`#${containerId}`);
  const zip3Map = app.data.zip3Map;
  const features = zip3Map.features;
  const maxPopulation = Math.max(...features.map((feature) => feature.population || 0), 1);
  const selectedFeature = app.selectedZip3 ? features.find((feature) => feature.zip3 === app.selectedZip3) : null;
  const isReportingMap = containerId === "reportingMap";
  const isAudienceMap = containerId === "audienceZip3Map";
  const selectedProductKey = isReportingMap ? app.selectedReportingProduct : isAudienceMap ? getAudienceBuilder().productKey : app.selectedProduct;
  const selectedProductSummary = getZip3ProductSummary(selectedProductKey);
  const selectedProductRow = selectedFeature ? getZip3ProductMediaRow(selectedFeature.zip3, selectedProductKey) : null;
  const activeCount = selectedProductSummary?.active_zip3_count || 0;
  const monthForSpend = isReportingMap ? app.selectedReportingMonth : app.selectedCalendarMonth;
  const transform = [
    `translate(${app.zip3PanX} ${app.zip3PanY})`,
    `translate(${ZIP3_US_VIEW.centerX} ${ZIP3_US_VIEW.centerY})`,
    `scale(${app.zip3Zoom})`,
    `translate(${-ZIP3_US_VIEW.centerX} ${-ZIP3_US_VIEW.centerY})`
  ].join(" ");
  container.classList.remove("state-map");
  container.classList.add("zip3-map-wrap");
  container.dataset.mapView = app.zip3Zoom === ZIP3_DEFAULT_VIEW.zoom
    && app.zip3PanX === ZIP3_DEFAULT_VIEW.panX
    && app.zip3PanY === ZIP3_DEFAULT_VIEW.panY
    ? "fitted-national"
    : "custom";
  container.innerHTML = `
    <div class="zip3-controls" aria-label="ZIP3 map controls">
      <span class="map-frame-note" aria-live="polite">${container.dataset.mapView === "fitted-national" ? "Fitted national view · continental US" : "Custom map view"}</span>
      <button class="icon-button" type="button" data-zip3-control="zoom-out" title="Zoom out" aria-label="Zoom out map">-</button>
      <button class="icon-button" type="button" data-zip3-control="zoom-in" title="Zoom in" aria-label="Zoom in map">+</button>
      <button class="icon-button" type="button" data-zip3-control="left" title="Pan left" aria-label="Pan map left">&lt;</button>
      <button class="icon-button" type="button" data-zip3-control="right" title="Pan right" aria-label="Pan map right">&gt;</button>
      <button class="icon-button" type="button" data-zip3-control="up" title="Pan up" aria-label="Pan map up">^</button>
      <button class="icon-button" type="button" data-zip3-control="down" title="Pan down" aria-label="Pan map down">v</button>
      <button class="small-action" type="button" data-zip3-control="reset" aria-label="Reset map to fitted national view">Reset view</button>
    </div>
    <svg class="zip3-map" viewBox="${escapeHtml(ZIP3_US_VIEW.viewBox)}" role="img" aria-label="Signal ZIP3 map centred on the continental United States">
      <g transform="${escapeHtml(transform)}">
      ${features
        .map((feature) => {
          const productRow = getZip3ProductMediaRow(feature.zip3, selectedProductKey);
          const fill = productRow ? zip3ProductColor(productRow, selectedProductSummary) : zip3Color(feature, maxPopulation);
          const isSelectedState = feature.state_code === app.selectedState;
          const isSelectedZip3 = feature.zip3 === app.selectedZip3;
          return `
            <path
              class="zip3-path ${productRow ? `zip3-${statusClass(productRow.planning_status)}` : ""} ${isSelectedState ? "is-selected-state" : ""} ${isSelectedZip3 ? "is-selected-zip3" : ""}"
              d="${feature.path}"
              fill="${fill}"
              data-zip3="${escapeHtml(feature.zip3)}"
              data-state-code="${escapeHtml(feature.state_code)}"
            >
              <title>${
                productRow
                  ? `ZIP3 ${escapeHtml(feature.zip3)} - ${escapeHtml(feature.state_name)} - ${escapeHtml(productLabel(selectedProductKey))} ${escapeHtml(formatStatus(productRow.planning_status))} - ${formatCurrency(productRow.annual_media_spend_usd)} annual media`
                  : `ZIP3 ${escapeHtml(feature.zip3)} - ${escapeHtml(feature.state_name)} - ${formatNumber(feature.population)} people`
              }</title>
            </path>
          `;
        })
        .join("")}
      </g>
    </svg>
    <div class="zip3-readout">
      <strong>${selectedFeature ? `ZIP3 ${escapeHtml(selectedFeature.zip3)}` : `${escapeHtml(productLabel(selectedProductKey))} ZIP3 media map`}</strong>
      <span>${
        selectedFeature
          ? selectedProductRow
            ? `${escapeHtml(selectedFeature.state_name)} / ${escapeHtml(formatStatus(selectedProductRow.planning_status))} / ${formatCurrency(selectedProductRow.annual_media_spend_usd)} annual media / ${formatCurrency(selectedProductRow.monthly_media_spend_usd?.[monthForSpend] || 0)} in ${escapeHtml(formatMonth(monthForSpend))}`
            : `${escapeHtml(selectedFeature.state_name)} / ${formatNumber(selectedFeature.population)} people / score ${escapeHtml(selectedFeature.score)}`
          : `${formatNumber(activeCount)} active ZIP3s from ${formatNumber(features.length)} shapes; click a ZIP3 for product status and media-spend estimate.`
      }</span>
    </div>
  `;
  container.querySelectorAll(".zip3-path").forEach((pathElement) => {
    pathElement.addEventListener("click", () => {
      app.selectedZip3 = pathElement.dataset.zip3;
      selectState(pathElement.dataset.stateCode, { preserveZip3: true });
    });
  });
  $(`#${legendId}`).innerHTML = renderMapLegend("zip3");
}

function zip3Color(feature, maxPopulation) {
  const populationIntensity = Math.min(1, (feature.population || 0) / maxPopulation);
  const scoreIntensity = Math.min(1, (feature.score || 0) / 100);
  const intensity = populationIntensity * 0.65 + scoreIntensity * 0.35;
  const lightness = Math.round(94 - intensity * 42);
  return `hsl(189 62% ${lightness}%)`;
}

function getZip3ProductMediaRow(zip3, productKey = app.selectedReportingProduct) {
  return app.data.zip3ProductMedia?.zip3_rows.find((row) => row.zip3 === zip3 && row.product_key === productKey);
}

function getZip3ProductSummary(productKey = app.selectedReportingProduct) {
  return app.data.zip3ProductMedia?.summary_by_product.find((row) => row.product_key === productKey);
}

function zip3ProductColor(row, summary) {
  if (row.planning_status === "active") {
    const maxSpend = Math.max(1, (summary?.annual_media_pool_usd || 1) / Math.max(1, summary?.active_zip3_count || 1) * 8);
    const intensity = Math.min(1, row.annual_media_spend_usd / maxSpend);
    const lightness = Math.round(92 - intensity * 42);
    return `hsl(151 48% ${lightness}%)`;
  }
  if (row.planning_status === "off_by_choice") {
    return "#fff4df";
  }
  if (row.planning_status === "off_data_gap" || row.planning_status === "off_unknown") {
    return "#edf2f6";
  }
  return "#fde7e3";
}

function mapCellData(state, layer, maxBudget) {
  if (layer === "legislation") {
    const governanceRow = app.data.governance.state_rows.find((row) => row.state_code === state.state_code);
    const status = governanceRow ? getProductStatus(governanceRow) : "unknown";
    const colorByStatus = {
      allowed: "#dff6e9",
      restricted: "#f3effc",
      not_listed: "#fff4df",
      blocked: "#fde7e3",
      "legal-review": "#f3effc",
      unknown: "#edf2f6"
    };
    return {
      color: colorByStatus[status] || colorByStatus.unknown,
      label: formatStatus(status)
    };
  }
  if (layer === "budget") {
    const intensity = Math.min(1, (state.budget_usd_equivalent || 0) / maxBudget);
    const lightness = Math.round(94 - intensity * 34);
    return {
      color: `hsl(211 78% ${lightness}%)`,
      label: state.budget_usd_equivalent > 0 ? formatCurrency(state.budget_usd_equivalent) : "held"
    };
  }
  const strength = state.fanDuel_strength_index;
  if (strength === null || strength === undefined) {
    return { color: "#edf2f6", label: "unknown" };
  }
  const lightness = Math.round(94 - (Math.min(100, strength) / 100) * 38);
  return {
    color: `hsl(151 48% ${lightness}%)`,
    label: `${strength}`
  };
}

function renderMapLegend(layer) {
  if (layer === "zip3") {
    return [
      ["hsl(151 48% 54%)", "active / higher expected media"],
      ["hsl(151 48% 90%)", "active / lower expected media"],
      ["#fff4df", "off by choice"],
      ["#fde7e3", "off by regulation or not listed"],
      ["#101820", "selected state outline"]
    ].map(renderLegendItem).join("") + `<span class="status status-working">working ZIP3 media estimate</span>`;
  }
  if (layer === "legislation") {
    return [
      ["#dff6e9", "allowed"],
      ["#f3effc", "restricted / review"],
      ["#fff4df", "not listed"],
      ["#edf2f6", "unknown"]
    ].map(renderLegendItem).join("");
  }
  if (layer === "budget") {
    return [
      ["hsl(211 78% 60%)", "higher synthetic budget"],
      ["hsl(211 78% 90%)", "lower synthetic budget"],
      ["#edf2f6", "held / unknown"]
    ].map(renderLegendItem).join("") + `<span class="status status-synthetic">synthetic-working allocation model</span>`;
  }
  return [
    ["hsl(151 48% 58%)", "higher FanDuel search index"],
    ["hsl(151 48% 90%)", "lower FanDuel search index"],
    ["#edf2f6", "unknown"]
  ].map(renderLegendItem).join("") + `<span class="status status-working">within-brand Trends index</span>`;
}

function renderLegendItem([color, label]) {
  return `<span class="legend-item"><span class="legend-swatch" style="background:${color}"></span>${escapeHtml(label)}</span>`;
}

function selectState(stateCode, options = {}) {
  if (!stateCode) return;
  app.selectedState = stateCode;
  app.planningScope = "state";
  if (!options.preserveZip3) {
    app.selectedZip3 = null;
  }
  const stateSelect = $("#stateSelect");
  if (stateSelect) stateSelect.value = stateCode;
  render();
}

function navigateCalendarPeriod(direction = "next") {
  const step = direction === "prev" ? -1 : 1;
  const months = getCalendarMonths();
  app.selectedCalendarView = normaliseCalendarView(app.selectedCalendarView);
  if (app.selectedCalendarView === "day") {
    app.selectedCalendarDate = clampCalendarDate(addCalendarDays(app.selectedCalendarDate, step));
    app.selectedCalendarMonth = app.selectedCalendarDate.slice(0, 7);
  } else if (app.selectedCalendarView === "week") {
    app.selectedCalendarDate = clampCalendarDate(addCalendarDays(app.selectedCalendarDate, step * 7));
    app.selectedCalendarMonth = app.selectedCalendarDate.slice(0, 7);
  } else {
    const offset = app.selectedCalendarView === "quarter" ? step * 3 : step;
    const nextMonth = addMonths(app.selectedCalendarMonth, offset);
    if (months.includes(nextMonth)) {
      app.selectedCalendarMonth = nextMonth;
      app.selectedCalendarDate = getPeakCalendarDate(nextMonth);
    }
  }
  renderCalendar();
}

function clampCalendarDate(date) {
  const months = getCalendarMonths();
  if (!months.length) return date;
  const first = `${months[0]}-01`;
  const lastMonth = months[months.length - 1];
  const [year, monthNumber] = lastMonth.split("-").map(Number);
  const last = `${lastMonth}-${String(new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()).padStart(2, "0")}`;
  if (date < first) return first;
  if (date > last) return last;
  return date;
}

function renderCalendar() {
  const timeline = $("#calendarTimeline");
  if (!timeline) return;

  const productKey = app.selectedCalendarProduct || app.selectedProduct;
  app.selectedCalendarView = normaliseCalendarView(app.selectedCalendarView);
  const months = getCalendarMonths();
  if (!months.includes(app.selectedCalendarMonth)) app.selectedCalendarMonth = months[0] || "2026-09";
  if (!app.selectedCalendarDate?.startsWith(app.selectedCalendarMonth)) {
    app.selectedCalendarDate = getPeakCalendarDate(app.selectedCalendarMonth);
  }
  const selectedDay = getCalendarDayModel(app.selectedCalendarDate);
  const visibleFixtures = getVisibleCalendarFixtures(app.selectedCalendarDate);
  const sportLabel = app.selectedCalendarSport === "all" ? "All sports" : app.selectedCalendarSport;
  const monthRows = getCalendarDailyRows().filter((row) => row.month === app.selectedCalendarMonth);
  const monthPeak = monthRows.slice().sort((a, b) => b.heat_score - a.heat_score || a.date.localeCompare(b.date))[0];

  $("#calendarViewSelect").value = app.selectedCalendarView;
  $("#calendarProductSelect").value = productKey;
  $("#calendarMonthSelect").value = app.selectedCalendarMonth;
  $("#calendarStateSelect").value = app.selectedCalendarState;
  $("#calendarBudgetMetric").textContent = String(Math.round(selectedDay.activationHeat));
  $("#calendarHeatNote").textContent = `${escapeHtml(selectedDay.band)} / ${escapeHtml(formatDateShort(selectedDay.date))}`;
  $("#calendarMonthMetric").textContent = String(visibleFixtures.length);
  $("#calendarMonthNote").textContent = `${escapeHtml(sportLabel)} on ${escapeHtml(formatDateShort(selectedDay.date))}`;
  $("#calendarStateMetric").textContent = String(Math.round(selectedDay.activationHeat));
  $("#calendarStateNote").textContent = `${escapeHtml(selectedDay.state?.state || app.selectedCalendarState)} activation heat`;
  $("#calendarSourceMetric").textContent = app.data.fixtureHeatValidation?.pass ? "validated" : "working";
  $("#calendarViewTitle").textContent = getCalendarViewTitle();
  $("#calendarStateTitle").textContent = `${escapeHtml(formatDateShort(app.selectedCalendarDate))} details`;

  $("#calendarSportTabs").innerHTML = renderCalendarSportTabs();
  if (app.selectedCalendarView === "day") {
    timeline.innerHTML = renderCalendarDayView(app.selectedCalendarDate);
  } else if (app.selectedCalendarView === "week") {
    timeline.innerHTML = renderCalendarWeekView(app.selectedCalendarDate);
  } else if (app.selectedCalendarView === "quarter") {
    timeline.innerHTML = renderCalendarQuarterView(app.selectedCalendarMonth);
  } else {
    timeline.innerHTML = renderCalendarMonthView(app.selectedCalendarMonth);
  }
  $("#calendarStateFit").innerHTML = renderCalendarDayDrawer(app.selectedCalendarDate, monthPeak);
  $("#calendarCustomNotice").textContent = app.calendarCustomNotice || "";
  $("#calendarCustomEntries").innerHTML = renderCalendarCustomEntries();
  $("#calendarKeyPeriods").innerHTML = renderCalendarKeyPeriods();
  renderCalendarPlanBar();

  $$("#calendarSportTabs [data-calendar-sport]").forEach((button) => {
    button.addEventListener("click", () => {
      app.selectedCalendarSport = button.dataset.calendarSport;
      renderCalendar();
    });
  });

  $$("#calendarStateFit [data-calendar-ask]").forEach((button) => {
    button.addEventListener("click", () => askAboutCalendarPeriod(button.dataset.calendarAsk));
  });

  $$("#calendarKeyPeriods [data-key-period-oneoff]").forEach((button) => {
    button.addEventListener("click", () => planKeyPeriodOneOff(button.dataset.keyPeriodOneoff));
  });
}

function getCalendarViewTitle() {
  if (app.selectedCalendarView === "quarter") {
    const quarterMonths = getCalendarQuarterMonths(app.selectedCalendarMonth);
    const [start, end] = [quarterMonths[0], quarterMonths[quarterMonths.length - 1]];
    if (start && end) return `${formatMonth(start)} to ${formatMonth(end)} fixture heat`;
  }
  if (app.selectedCalendarView === "week") return `Week of ${formatDateShort(app.selectedCalendarDate)} fixture heat`;
  if (app.selectedCalendarView === "day") return `${formatDateShort(app.selectedCalendarDate)} fixture heat`;
  return `${formatMonth(app.selectedCalendarMonth)} fixture heat`;
}

function calendarSlug(value) {
  return String(value || "date")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "date";
}

function mapCustomCalendarEntryToFixture(entry) {
  if (!entry?.date || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) return null;
  const source = entry.source === "upload" ? "AUTHORED_UPLOAD" : "AUTHORED";
  return {
    fixture_id: entry.id || `custom-${entry.date}-${calendarSlug(entry.name || "date")}`,
    date: entry.date,
    sport: String(entry.sport || "custom").trim() || "custom",
    label: String(entry.name || "Custom planning moment").trim() || "Custom planning moment",
    window: "custom",
    tier: 3,
    status: "authored-working",
    status_chip: source,
    display_flag: "AUTHORED_WORKING_DATE",
    data_status: "authored-working",
    timeslot: "all_day",
    note: String(entry.note || "").trim(),
    source_ids: entry.source_ids || ["calendar_custom_entry_local"],
    governance: {
      type: "authored",
      note: "User-authored working date; not schedule verified."
    }
  };
}

function getCalendarFixtureRows() {
  const baseFixtures = app.data.fixtureCalendar?.fixtures || [];
  const customFixtures = (app.customCalendarEntries || []).map(mapCustomCalendarEntryToFixture).filter(Boolean);
  return [...baseFixtures, ...customFixtures].sort((a, b) => (
    String(a.date || "").localeCompare(String(b.date || ""))
    || String(a.sport || "").localeCompare(String(b.sport || ""))
    || String(a.fixture_id || "").localeCompare(String(b.fixture_id || ""))
  ));
}

function getCalendarDailyRows() {
  return app.data.fixtureDailyHeat?.rows || [];
}

function getCalendarTimeslotRows() {
  return app.data.fixtureTimeslotHeat?.rows || [];
}

function getCalendarStateHeatRows() {
  return app.data.fixtureStateHeat?.rows || [];
}

function getCalendarMonths() {
  return [...new Set([
    ...getCalendarDailyRows().map((row) => row.month),
    ...(app.customCalendarEntries || []).map((entry) => String(entry.date || "").slice(0, 7))
  ])]
    .filter((month) => /^\d{4}-\d{2}$/.test(month))
    .filter((month) => month >= "2025-07" && month <= "2027-12")
    .sort();
}

function getCalendarStateOptions() {
  const states = (app.data.governance?.state_rows || [])
    .map((row) => ({ state: row.state, state_code: row.state_code }))
    .sort((a, b) => a.state.localeCompare(b.state));
  return [{ state: "All states", state_code: "US" }, ...states];
}

function getCalendarSports() {
  const sports = [...new Set(getCalendarFixtureRows().map((fixture) => fixture.sport))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  return ["all", ...sports];
}

function renderCalendarSportTabs() {
  return getCalendarSports().map((sport) => `
    <button class="calendar-sport-tab ${sport === app.selectedCalendarSport ? "is-active" : ""}" type="button" data-calendar-sport="${escapeHtml(sport)}">
      ${escapeHtml(sport === "all" ? "All" : sport)}
    </button>
  `).join("");
}

function getPeakCalendarDate(month) {
  return getCalendarDailyRows()
    .filter((row) => row.month === month)
    .sort((a, b) => b.heat_score - a.heat_score || a.date.localeCompare(b.date))[0]?.date || `${month}-01`;
}

function fixturesForDate(date) {
  return getCalendarFixtureRows().filter((fixture) => fixture.date === date);
}

function getVisibleCalendarFixtures(date) {
  const fixtures = fixturesForDate(date);
  if (app.selectedCalendarSport === "all") return fixtures;
  return fixtures.filter((fixture) => fixture.sport === app.selectedCalendarSport);
}

function getDailyHeat(date) {
  return getCalendarDailyRows().find((row) => row.date === date) || {
    date,
    month: date.slice(0, 7),
    heat_score: 0,
    heat_band: "cold",
    trend_index: 0,
    fixture_load: 0,
    fixture_count: 0,
    source_ids: ["fanduel_fixture_heat_model_v1"]
  };
}

function getStateHeat(date, stateCode = app.selectedCalendarState) {
  const rows = getCalendarStateHeatRows().filter((row) => row.date === date);
  if (stateCode === "US" || stateCode === "all") {
    if (!rows.length) return null;
    const average = (key) => rows.reduce((sum, row) => sum + Number(row[key] || 0), 0) / rows.length;
    const demand = average("demand_heat_score");
    const activation = average("activation_heat_score");
    const reviewCount = rows.filter((row) => row.governance_badge).length;
    return {
      date,
      state_code: "US",
      state: "All states",
      demand_heat_score: demand,
      activation_heat_score: activation,
      heat_band: heatBandFromScore(activation),
      governance_badge: reviewCount ? `${reviewCount} state review badge(s)` : "",
      data_status: "modelled-working-aggregate",
      display_flag: "MODELLED_HEAT_AGGREGATE",
      source_ids: ["fanduel_fixture_state_heat_v1"]
    };
  }
  return rows.find((row) => row.state_code === stateCode);
}

function getCalendarDayModel(date) {
  const daily = getDailyHeat(date);
  const state = getStateHeat(date);
  const fixtures = getVisibleCalendarFixtures(date);
  let demandHeat = state?.demand_heat_score ?? daily.heat_score;
  let activationHeat = state?.activation_heat_score ?? daily.heat_score;
  if (app.selectedCalendarSport !== "all") {
    if (fixtures.length) {
      demandHeat = clampNumber(demandHeat + Math.min(8, fixtures.length * 2), 0, 100);
      activationHeat = clampNumber(activationHeat + Math.min(8, fixtures.length * 2), 0, 100);
    } else {
      demandHeat = clampNumber(Number(daily.trend_index || 0) * 0.58, 0, 100);
      activationHeat = demandHeat;
    }
  }
  return {
    date,
    daily,
    state,
    fixtures,
    demandHeat,
    activationHeat,
    band: heatBandFromScore(activationHeat),
    governanceBadge: state?.governance_badge || ""
  };
}

function heatBandFromScore(score) {
  if (score >= 85) return "blazing";
  if (score >= 70) return "hot";
  if (score >= 50) return "warm";
  if (score >= 30) return "cool";
  return "cold";
}

function formatDateShort(date) {
  const parsed = dateFromIsoDate(date);
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function dateFromIsoDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function addCalendarDays(date, count) {
  const parsed = typeof date === "string" ? dateFromIsoDate(date) : new Date(date);
  parsed.setUTCDate(parsed.getUTCDate() + count);
  return parsed.toISOString().slice(0, 10);
}

function renderCalendarMonthView(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const first = new Date(Date.UTC(year, monthNumber - 1, 1));
  const last = new Date(Date.UTC(year, monthNumber, 0));
  const blanks = Array.from({ length: first.getUTCDay() }, (_, index) => `<div class="calendar-day is-empty" aria-hidden="true" data-empty="${index}"></div>`);
  const days = [];
  for (let day = 1; day <= last.getUTCDate(); day += 1) {
    days.push(renderCalendarDayCell(`${month}-${String(day).padStart(2, "0")}`));
  }
  return `
    <div class="calendar-month-shell">
      <div class="calendar-weekdays">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<span>${day}</span>`).join("")}</div>
      <div class="calendar-day-grid">${blanks.join("")}${days.join("")}</div>
    </div>
  `;
}

function renderCalendarQuarterView(month) {
  const months = getCalendarQuarterMonths(month);
  if (!months.length) return `<p class="muted-copy">No fixture heat is loaded for this quarter.</p>`;
  return `
    <div class="calendar-quarter-shell">
      ${months.map((quarterMonth) => {
        const rows = getCalendarDailyRows().filter((row) => row.month === quarterMonth);
        const average = rows.length ? rows.reduce((sum, row) => sum + Number(row.heat_score || 0), 0) / rows.length : 0;
        return `
          <article class="calendar-quarter-month">
            <header>
              <div>
                <span>${escapeHtml(formatMonth(quarterMonth))}</span>
                <strong>${Math.round(average)} avg heat</strong>
              </div>
              <small>${formatNumber(getCalendarFixtureRows().filter((fixture) => fixture.date.startsWith(quarterMonth)).length)} fixtures</small>
            </header>
            <div class="calendar-quarter-grid">
              ${renderCalendarQuarterDays(quarterMonth)}
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderCalendarQuarterDays(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const last = new Date(Date.UTC(year, monthNumber, 0));
  const cells = [];
  for (let day = 1; day <= last.getUTCDate(); day += 1) {
    const date = `${month}-${String(day).padStart(2, "0")}`;
    const model = getCalendarDayModel(date);
    cells.push(`
      <button class="calendar-quarter-day heat-${escapeHtml(model.band)} ${date === app.selectedCalendarDate ? "is-selected" : ""}" type="button" data-calendar-date="${escapeHtml(date)}">
        <span>${day}</span>
        <strong>${Math.round(model.activationHeat)}</strong>
        ${model.fixtures.length ? `<div class="calendar-fixture-stack">${model.fixtures.slice(0, 1).map(renderCalendarFixtureChip).join("")}${model.fixtures.length > 1 ? `<i>+${model.fixtures.length - 1}</i>` : ""}</div>` : ""}
      </button>
    `);
  }
  return cells.join("");
}

function renderCalendarDayCell(date) {
  const model = getCalendarDayModel(date);
  const fixtures = model.fixtures.slice(0, 3);
  return `
    <button class="calendar-day heat-${escapeHtml(model.band)} ${date === app.selectedCalendarDate ? "is-selected" : ""}" type="button" data-calendar-date="${escapeHtml(date)}">
      <span class="calendar-day-number">${Number(date.slice(8, 10))}</span>
      <strong>${Math.round(model.activationHeat)}</strong>
      <small>${escapeHtml(model.band)}</small>
      <div class="calendar-fixture-stack">
        ${fixtures.map(renderCalendarFixtureChip).join("")}
        ${model.fixtures.length > fixtures.length ? `<i>+${model.fixtures.length - fixtures.length}</i>` : ""}
      </div>
      ${model.governanceBadge ? `<em>college review</em>` : ""}
    </button>
  `;
}

function renderCalendarWeekView(date) {
  const parsed = dateFromIsoDate(date);
  const start = addCalendarDays(parsed, -parsed.getUTCDay());
  const days = Array.from({ length: 7 }, (_, index) => addCalendarDays(start, index));
  return `
    <div class="calendar-week-list">
      ${days.map((day) => {
        const model = getCalendarDayModel(day);
        return `
          <button class="calendar-week-row heat-${escapeHtml(model.band)} ${day === app.selectedCalendarDate ? "is-selected" : ""}" type="button" data-calendar-date="${escapeHtml(day)}">
            <span>${escapeHtml(formatDateShort(day))}</span>
            <strong>${Math.round(model.activationHeat)} ${escapeHtml(model.band)}</strong>
            <small>${formatNumber(model.fixtures.length)} fixtures</small>
            <div>${model.fixtures.slice(0, 4).map(renderCalendarFixtureChip).join("")}</div>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderCalendarDayView(date) {
  const model = getCalendarDayModel(date);
  const slots = getCalendarTimeslotRows().filter((row) => row.date === date);
  return `
    <div class="calendar-day-view">
      <div class="calendar-day-view-head heat-${escapeHtml(model.band)}">
        <span>${escapeHtml(formatDateLong(date))}</span>
        <strong>${Math.round(model.activationHeat)} ${escapeHtml(model.band)}</strong>
        <small>${formatNumber(model.fixtures.length)} visible event${model.fixtures.length === 1 ? "" : "s"}</small>
      </div>
      <div class="calendar-day-events">
        ${model.fixtures.length
          ? model.fixtures.map((fixture) => renderCalendarFixtureDetail(fixture, date)).join("")
          : `<p class="muted-copy">No visible events for this sport filter on ${escapeHtml(formatDateLong(date))}.</p>`}
      </div>
      <div class="calendar-timeslot-list">
        ${slots.map((slot) => {
          const fixtures = model.fixtures.filter((fixture) => String(fixture.timeslot || "").includes(slot.timeslot));
          return `
            <article class="calendar-timeslot heat-${escapeHtml(slot.heat_band)}">
              <span>${escapeHtml(formatStatus(slot.timeslot))}</span>
              <strong>${Math.round(slot.heat_score)}</strong>
              <div>${fixtures.length ? fixtures.map(renderCalendarFixtureChip).join("") : `<small>No visible fixtures in ${escapeHtml(app.selectedCalendarSport === "all" ? "this slot" : app.selectedCalendarSport)}</small>`}</div>
            </article>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function formatDateLong(date) {
  return dateFromIsoDate(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  });
}

function formatFixtureTime(fixture) {
  return fixture.start_local ? `${fixture.start_local} local` : "All day";
}

function formatFixtureLocation(fixture) {
  return fixture.location || "Location pending official schedule feed";
}

function getFixtureTribalContext(fixture) {
  if (fixture.tribal_context?.label && fixture.tribal_context?.note) return fixture.tribal_context;
  return {
    intensity: "working",
    label: `Tier ${fixture.tier || 4} working intensity`,
    basis: [`tier_${fixture.tier || 4}`],
    note: "Working intensity is derived from the fixture tier; no rivalry or matchup is inferred."
  };
}

function renderCalendarFixtureDetail(fixture, date) {
  const tribal = getFixtureTribalContext(fixture);
  const statusClass = fixture.governance?.type === "college" ? "status-review" : "status-working";
  return `
    <article class="calendar-event-card">
      <div class="calendar-event-heading">
        <div>
          <span>${escapeHtml(fixture.sport)} / tier ${escapeHtml(fixture.tier)}</span>
          <strong>${escapeHtml(fixture.label)}</strong>
        </div>
        <div class="pill-row">
          <span class="pill ${statusClass}">${escapeHtml(fixture.status_chip || "authored/working")}</span>
          <span class="pill status-synthetic">structural label</span>
        </div>
      </div>
      <dl class="calendar-event-facts">
        <div><dt>Time</dt><dd>${escapeHtml(formatFixtureTime(fixture))}</dd></div>
        <div><dt>Date</dt><dd>${escapeHtml(formatDateLong(date))}</dd></div>
        <div><dt>Location</dt><dd>${escapeHtml(formatFixtureLocation(fixture))}</dd></div>
      </dl>
      <div class="calendar-tribal-note">
        <span>Tribal intensity</span>
        <strong>${escapeHtml(tribal.label)}</strong>
        <p>${escapeHtml(tribal.note)}</p>
      </div>
    </article>
  `;
}

function renderCalendarFixtureChip(fixture) {
  const statusClass = fixture.governance?.type === "college" ? "status-review" : fixture.tier <= 2 ? "status-working" : "status-synthetic";
  return `<span class="calendar-fixture-chip ${statusClass}" title="${escapeHtml(fixture.label)}">${escapeHtml(fixture.sport)} T${escapeHtml(fixture.tier)}</span>`;
}

function renderCalendarDayDrawer(date, monthPeak) {
  const model = getCalendarDayModel(date);
  const fixtures = model.fixtures;
  const statusPills = [
    `<span class="pill status-synthetic">${escapeHtml(model.daily.display_flag || "MODELLED_HEAT")}</span>`,
    `<span class="pill status-working">fixtures authored/working</span>`,
    model.governanceBadge ? `<span class="pill status-review">${escapeHtml(model.governanceBadge)}</span>` : ""
  ].join("");
  return `
    <div class="calendar-drawer">
      <div class="planning-readout">
        <article class="readout-item"><span>Demand</span><strong>${Math.round(model.demandHeat)}</strong></article>
        <article class="readout-item"><span>Activation</span><strong>${Math.round(model.activationHeat)}</strong></article>
        <article class="readout-item"><span>Trend</span><strong>${Math.round(model.daily.trend_index || 0)}</strong></article>
      </div>
      <div class="pill-row">${statusPills}</div>
      <article class="content-card">
        <h3>${escapeHtml(formatDateShort(date))} fixtures</h3>
        ${fixtures.length ? fixtures.map((fixture) => `
          <div class="calendar-fixture-row">
            <div>
              <strong>${escapeHtml(fixture.label)}</strong>
              <small>${escapeHtml(fixture.sport)} / ${escapeHtml(formatFixtureTime(fixture))} / ${escapeHtml(formatDateLong(date))} / ${escapeHtml(formatFixtureLocation(fixture))}</small>
              <small>Tribal intensity: ${escapeHtml(getFixtureTribalContext(fixture).label)}</small>
            </div>
            <span class="pill ${fixture.governance?.type === "college" ? "status-review" : "status-working"}">${escapeHtml(fixture.status_chip || fixture.status)}</span>
          </div>
        `).join("") : `<p class="muted-copy">No visible fixtures for the current sport filter.</p>`}
      </article>
      <article class="content-card">
        <h3>Heat breakdown</h3>
        <div class="note-list compact-notes">
          <div class="note-item">Base Trends index: ${Math.round(model.daily.trend_index || 0)}.</div>
          <div class="note-item">Fixture load: ${Math.round(model.daily.fixture_load || 0)} from ${formatNumber(model.daily.fixture_count || 0)} fixture objects.</div>
          <div class="note-item">Month peak: ${escapeHtml(formatDateShort(monthPeak?.date || date))} at ${Math.round(monthPeak?.heat_score || model.daily.heat_score)}.</div>
        </div>
        <div class="panel-actions">
          <button class="drawer-button" type="button" data-calendar-ask="${escapeHtml(date)}">Ask about this period</button>
        </div>
      </article>
    </div>
  `;
}

function renderCalendarCustomEntries() {
  const entries = [...(app.customCalendarEntries || [])].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  if (!entries.length) {
    return `<p class="muted-copy">No custom dates added yet. Added dates enter the same fixture source and remain labelled authored working data.</p>`;
  }
  return entries.map((entry) => `
    <article class="calendar-custom-row">
      <div>
        <strong>${escapeHtml(entry.name || "Custom planning moment")}</strong>
        <small>${escapeHtml(formatDateShort(entry.date))} / ${escapeHtml(entry.sport || "custom")} / ${escapeHtml(entry.note || "No note")}</small>
      </div>
      <div class="pill-row">
        <span class="pill status-working">${escapeHtml(entry.source === "upload" ? "AUTHORED_UPLOAD" : "AUTHORED")}</span>
        <button class="small-action" type="button" data-calendar-custom-focus="${escapeHtml(entry.id)}">Open</button>
        <button class="small-action" type="button" data-calendar-custom-remove="${escapeHtml(entry.id)}">Remove</button>
      </div>
    </article>
  `).join("");
}

function normaliseCustomCalendarEntry(input = {}) {
  const date = String(input.date || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const name = String(input.name || "Custom planning moment").trim().slice(0, 96) || "Custom planning moment";
  const sport = String(input.sport || "custom").trim().slice(0, 32) || "custom";
  const note = String(input.note || "").trim().slice(0, 240);
  const source = input.source === "upload" ? "upload" : "manual";
  return {
    id: input.id || `custom-${date}-${calendarSlug(name)}-${Date.now().toString(36)}`,
    date,
    name,
    sport,
    note,
    source,
    status: "authored-working",
    display_flag: source === "upload" ? "AUTHORED_UPLOAD_WORKING_DATE" : "AUTHORED_WORKING_DATE",
    source_ids: input.source_ids || [source === "upload" ? "calendar_upload_authored_text" : "calendar_manual_authored_entry"],
    createdAt: input.createdAt || getDemoToday()
  };
}

function upsertCustomCalendarEntries(entries = []) {
  const validEntries = entries.map(normaliseCustomCalendarEntry).filter(Boolean);
  if (!validEntries.length) return 0;
  const byId = new Map((app.customCalendarEntries || []).map((entry) => [entry.id, entry]));
  validEntries.forEach((entry) => byId.set(entry.id, entry));
  app.customCalendarEntries = Array.from(byId.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  persistChatSessions();
  return validEntries.length;
}

function saveManualCalendarEntry() {
  const entry = normaliseCustomCalendarEntry({
    name: $("#calendarCustomName")?.value,
    date: $("#calendarCustomDate")?.value,
    sport: $("#calendarCustomSport")?.value,
    note: $("#calendarCustomNote")?.value,
    source: "manual"
  });
  if (!entry) {
    app.calendarCustomNotice = "Choose a valid date before adding a planning moment.";
    renderCalendar();
    return;
  }
  upsertCustomCalendarEntries([entry]);
  app.selectedCalendarDate = entry.date;
  app.selectedCalendarMonth = entry.date.slice(0, 7);
  app.calendarCustomNotice = `Added ${entry.name} as an authored working calendar date.`;
  ["#calendarCustomName", "#calendarCustomSport", "#calendarCustomNote"].forEach((selector) => {
    const field = $(selector);
    if (field) field.value = "";
  });
  renderCalendar();
}

async function handleCalendarCustomUpload(file) {
  app.calendarCustomNotice = "";
  try {
    if (!window.extractText) {
      throw new Error("Upload extractor is not available in this build.");
    }
    const extracted = await window.extractText(file);
    const entries = parseCalendarEntriesFromText(extracted.text, extracted.name);
    const count = upsertCustomCalendarEntries(entries);
    app.calendarCustomNotice = count
      ? `Added ${formatNumber(count)} uploaded authored date${count === 1 ? "" : "s"} from ${extracted.name}.`
      : `No dated rows found in ${extracted.name}. Use one date per line, for example "Sep 10 2026 - NFL launch window".`;
    if (count && entries[0]?.date) {
      app.selectedCalendarDate = entries[0].date;
      app.selectedCalendarMonth = entries[0].date.slice(0, 7);
    }
  } catch (error) {
    app.calendarCustomNotice = error.message;
  }
  renderCalendar();
}

function parseCalendarEntriesFromText(text = "", sourceName = "uploaded calendar notes") {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 40);
  return lines
    .map((line, index) => {
      const parsed = parseCalendarLineDate(line);
      if (!parsed) return null;
      const label = line
        .replace(parsed.raw, "")
        .replace(/^[-:;,.\s]+/, "")
        .trim();
      return normaliseCustomCalendarEntry({
        id: `upload-${parsed.date}-${calendarSlug(label || sourceName)}-${index}`,
        date: parsed.date,
        name: label || "Uploaded planning moment",
        sport: inferCalendarSport(line),
        note: `Uploaded from ${sourceName}; authored working date, not schedule verified.`,
        source: "upload",
        source_ids: ["calendar_upload_authored_text"]
      });
    })
    .filter(Boolean);
}

function parseCalendarLineDate(line) {
  const iso = String(line).match(/\b(202[5-7]-\d{2}-\d{2})\b/);
  if (iso) return { date: iso[1], raw: iso[1] };
  const monthName = String(line).match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,)?\s+(202[5-7])\b/i);
  if (monthName) {
    const monthNumber = monthNumberFromText(monthName[1]);
    const date = `${monthName[3]}-${String(monthNumber).padStart(2, "0")}-${String(Number(monthName[2])).padStart(2, "0")}`;
    return { date, raw: monthName[0] };
  }
  const ukDate = String(line).match(/\b(\d{1,2})[/-](\d{1,2})[/-](202[5-7])\b/);
  if (ukDate) {
    const [day, month, year] = [ukDate[1], ukDate[2], ukDate[3]];
    return { date: `${year}-${String(Number(month)).padStart(2, "0")}-${String(Number(day)).padStart(2, "0")}`, raw: ukDate[0] };
  }
  return null;
}

function inferCalendarSport(text) {
  const clean = String(text || "").toLowerCase();
  if (clean.includes("nfl") || clean.includes("football")) return "NFL";
  if (clean.includes("nba") || clean.includes("basketball")) return "NBA";
  if (clean.includes("mlb") || clean.includes("baseball")) return "MLB";
  if (clean.includes("nhl") || clean.includes("hockey")) return "NHL";
  if (clean.includes("college") || clean.includes("ncaa")) return "college";
  return "custom";
}

function removeCustomCalendarEntry(entryId) {
  app.customCalendarEntries = (app.customCalendarEntries || []).filter((entry) => entry.id !== entryId);
  app.calendarCustomNotice = "Removed authored working calendar date.";
  persistChatSessions();
  renderCalendar();
}

function focusCustomCalendarEntry(entryId) {
  const entry = (app.customCalendarEntries || []).find((item) => item.id === entryId);
  if (!entry) return;
  app.selectedCalendarDate = entry.date;
  app.selectedCalendarMonth = entry.date.slice(0, 7);
  renderCalendar();
}

function askAboutCalendarPeriod(date) {
  const model = getCalendarDayModel(date);
  const productName = app.selectedCalendarProduct === "all" ? "all products" : productLabel(app.selectedCalendarProduct || app.selectedProduct);
  const prompt = [
    `How should we plan around ${formatDateShort(date)} for ${productName} in ${model.state?.state || app.selectedCalendarState}?`,
    `Calendar context: ${Math.round(model.activationHeat)} ${model.band} activation heat, ${formatNumber(model.fixtures.length)} visible fixture(s), sport filter ${app.selectedCalendarSport}.`,
    model.governanceBadge ? `Governance: ${model.governanceBadge}.` : "Governance: no state-specific college badge on this day."
  ].join(" ");
  openFreeModeWithPageContext({
    surface: "calendar",
    label: "Calendar period",
    question: prompt,
    chips: [
      formatDateShort(date),
      `${Math.round(model.activationHeat)} ${model.band}`,
      model.state?.state_code || app.selectedCalendarState,
      app.selectedCalendarSport === "all" ? "all sports" : app.selectedCalendarSport
    ],
    body: [
      `${formatDateShort(date)} has ${Math.round(model.activationHeat)} ${model.band} activation heat for ${model.state?.state || app.selectedCalendarState}.`,
      `${formatNumber(model.fixtures.length)} visible fixture objects are loaded under the ${app.selectedCalendarSport} sport filter.`,
      model.governanceBadge ? `Governance badge: ${model.governanceBadge}.` : "No state-specific college badge on this day.",
      `Daily heat status: ${model.daily.display_flag || "MODELLED_HEAT"}.`
    ].join(" "),
    source_ids: model.daily.source_ids || ["fanduel_fixture_calendar_v1", "fanduel_fixture_heat_model_v1"]
  });
}

function getCalendarKeyPeriods() {
  return app.data.fixtureKeyPeriods?.periods || [];
}

function getCalendarModifierRules(month = app.selectedCalendarMonth, channel = "") {
  const suffix = String(month || "").slice(4);
  return (app.data.calendarModifiers?.rules || []).filter((rule) => {
    const when = rule.when || {};
    const monthMatches = when.month_suffix === suffix
      || (Array.isArray(when.month_suffix_in) && when.month_suffix_in.includes(suffix));
    const channelMatches = !channel || (rule.channels || []).includes(channel);
    return monthMatches && channelMatches;
  });
}

function getFixtureById(fixtureId) {
  return getCalendarFixtureRows().find((fixture) => fixture.fixture_id === fixtureId);
}

function getMonthEndDate(month) {
  const [year, monthNumber] = String(month).split("-").map(Number);
  return new Date(Date.UTC(year, monthNumber, 0)).toISOString().slice(0, 10);
}

function periodOverlapsMonth(period, month = app.selectedCalendarMonth) {
  const start = `${month}-01`;
  const end = getMonthEndDate(month);
  return period.start_date <= end && period.end_date >= start;
}

function getMonthHeatSummary(month = app.selectedCalendarMonth) {
  const heatRows = getCalendarDailyRows().filter((row) => row.month === month);
  const oldDraw = app.data.calendar?.draws?.find((draw) => draw.month === month);
  if (!heatRows.length) {
    return {
      month,
      eventNote: oldDraw?.event_note || "Planning month",
      peakDate: `${month}-01`,
      peakHeatScore: 0,
      averageHeatScore: 0,
      heatBand: "cold",
      fixtureCount: 0,
      trendIndex: 0,
      topFixtureIds: [],
      keyPeriods: [],
      modifierRules: [],
      sourceIds: ["fanduel_fixture_heat_model_v1"],
      weight: oldDraw?.weight || 1
    };
  }
  const peak = [...heatRows].sort((a, b) => Number(b.heat_score || 0) - Number(a.heat_score || 0) || a.date.localeCompare(b.date))[0];
  const averageHeatScore = heatRows.reduce((sum, row) => sum + Number(row.heat_score || 0), 0) / heatRows.length;
  const fixtureCount = heatRows.reduce((sum, row) => sum + Number(row.fixture_count || 0), 0);
  const keyPeriods = getCalendarKeyPeriods()
    .filter((period) => periodOverlapsMonth(period, month))
    .sort((a, b) => Number(b.peak_heat_score || 0) - Number(a.peak_heat_score || 0));
  const modifierRules = getCalendarModifierRules(month);
  const topFixtureIds = Array.from(new Set(heatRows.flatMap((row) => row.top_fixture_ids || []))).slice(0, 8);
  const sourceIds = Array.from(new Set([
    "fanduel_fixture_key_periods_v1",
    "fanduel_fixture_heat_model_v1",
    "fanduel_fixture_calendar_manifest_v1",
    ...heatRows.flatMap((row) => row.source_ids || []),
    ...keyPeriods.flatMap((period) => period.source_ids || []),
    ...modifierRules.flatMap((rule) => rule.source_ids || [])
  ]));
  const eventNote = keyPeriods.length
    ? keyPeriods.slice(0, 2).map((period) => period.label).join(" + ")
    : `Fixture heat ${Math.round(peak?.heat_score || averageHeatScore)} ${peak?.heat_band || heatBandFromScore(averageHeatScore)}`;
  return {
    month,
    eventNote,
    peakDate: peak?.date || `${month}-01`,
    peakHeatScore: Number(peak?.heat_score || averageHeatScore || 0),
    averageHeatScore,
    heatBand: peak?.heat_band || heatBandFromScore(averageHeatScore),
    fixtureCount,
    trendIndex: Number(peak?.trend_index || 0),
    topFixtureIds,
    keyPeriods,
    modifierRules,
    sourceIds,
    weight: Number((0.8 + Math.min(0.45, Math.max(0, averageHeatScore) / 220)).toFixed(2))
  };
}

function renderGridMonthHeatMarker(summary) {
  const score = Math.round(summary.peakHeatScore || summary.averageHeatScore || 0);
  const width = Math.max(8, Math.min(100, score));
  return `
    <div class="time-month-heat heat-${escapeHtml(summary.heatBand || "cold")}" title="${escapeHtml(summary.eventNote)} / peak ${score}">
      <i style="width:${width}%"></i>
      <small>${score ? `Heat ${score}` : "No heat"}</small>
    </div>
  `;
}

function renderTimeCellHeatNote(month, channel, summary = getMonthHeatSummary(month)) {
  const channelRules = getCalendarModifierRules(month, channel);
  if (channelRules.length) {
    const maxLift = Math.max(...channelRules.map((rule) => Number(rule.add || 0)));
    return `<span class="time-cell-heat">Fixture lift +${Math.round(maxLift * 100)}%</span>`;
  }
  if (Number(summary.peakHeatScore || 0) >= 70) {
    return `<span class="time-cell-heat">Fixture heat ${Math.round(summary.peakHeatScore)}</span>`;
  }
  return "";
}

function renderCalendarKeyPeriods() {
  const visible = getCalendarKeyPeriods()
    .filter((period) => periodOverlapsMonth(period))
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
  const periods = visible.length ? visible : getCalendarKeyPeriods().slice(0, 3);
  return `
    <div class="key-period-grid">
      ${periods.map(renderKeyPeriodCard).join("")}
    </div>
  `;
}

function renderKeyPeriodCard(period) {
  const governanceClass = /college|review|restricted/i.test((period.governance_notes || []).join(" ")) ? "status-review" : "status-working";
  return `
    <article class="key-period-card">
      <div class="key-period-head">
        <div>
          <span>${escapeHtml(formatDateShort(period.start_date))} - ${escapeHtml(formatDateShort(period.end_date))}</span>
          <h3>${escapeHtml(period.label)}</h3>
        </div>
        <strong>${Math.round(period.peak_heat_score)}</strong>
      </div>
      <p>${escapeHtml(period.insight)}</p>
      <div class="planning-readout compact-readout">
        <article class="readout-item"><span>Peak</span><strong>${escapeHtml(formatDateShort(period.peak_date))}</strong></article>
        <article class="readout-item"><span>Lift</span><strong>${period.expected_demand_lift_pct >= 0 ? "+" : ""}${escapeHtml(period.expected_demand_lift_pct)}%</strong></article>
        <article class="readout-item"><span>Fixtures</span><strong>${formatNumber(period.fixture_count)}</strong></article>
      </div>
      <div class="note-list compact-notes">
        ${(period.channel_actions || []).slice(0, 2).map((note) => `<div class="note-item">${escapeHtml(note)}</div>`).join("")}
        ${(period.governance_notes || []).slice(0, 1).map((note) => `<div class="note-item">${escapeHtml(note)}</div>`).join("")}
      </div>
      <div class="pill-row">
        <span class="pill status-synthetic">${escapeHtml(period.display_flag || "MODELLED_HEAT")}</span>
        <span class="pill ${governanceClass}">${escapeHtml((period.governance_notes || ["normal eligibility"])[0])}</span>
      </div>
      <div class="panel-actions">
        <button class="drawer-button" type="button" data-key-period-oneoff="${escapeHtml(period.period_id)}">Plan this period</button>
      </div>
    </article>
  `;
}

function planKeyPeriodOneOff(periodId) {
  const period = getCalendarKeyPeriods().find((item) => item.period_id === periodId);
  if (!period) return;
  const prompt = [
    period.one_off_brief,
    `Timing: ${period.start_date} to ${period.end_date}.`,
    `Heat: peak ${Math.round(period.peak_heat_score)} on ${period.peak_date}; expected lift ${period.expected_demand_lift_pct >= 0 ? "+" : ""}${period.expected_demand_lift_pct}%.`,
    `State lens: ${getStateHeat(period.peak_date, app.selectedCalendarState)?.state || app.selectedCalendarState}.`,
    "Basis: incremental on existing activity."
  ].join(" ");
  app.selectedSurface = "planning";
  activateChatMode("oneoff");
  app.oneOffIncrementalityBasis = "incremental";
  app.oneOffProduct = app.selectedProduct;
  render();
  const input = $("#planningChatInput");
  if (input) {
    input.value = prompt;
    input.focus();
  }
}

function buildMonthlySummaries(plan) {
  const monthMap = new Map();
  const fixtureMonths = getCalendarMonths();
  const fallbackMonths = app.data.calendar?.draws?.map((draw) => draw.month) || [];
  const sourceMonths = fixtureMonths.length ? fixtureMonths : fallbackMonths;
  sourceMonths.forEach((month) => {
    const heatSummary = getMonthHeatSummary(month);
    monthMap.set(month, {
      month,
      weight: heatSummary.weight,
      event_note: heatSummary.eventNote,
      heatSummary,
      budget: 0,
      ftds: 0,
      channels: new Map()
    });
  });

  (plan.monthly_allocations || []).forEach((row) => {
    if (!monthMap.has(row.month)) {
      const heatSummary = getMonthHeatSummary(row.month);
      monthMap.set(row.month, {
        month: row.month,
        weight: heatSummary.weight,
        event_note: heatSummary.eventNote,
        heatSummary,
        budget: 0,
        ftds: 0,
        channels: new Map()
      });
    }
    const month = monthMap.get(row.month);
    month.budget += Number(row.budget_gbp || 0);
    month.ftds += Number(row.forecast_acquisitions || 0);
    const channel = month.channels.get(row.channel) || {
      channel: row.channel,
      budget: 0,
      ftds: 0,
      confidence: row.confidence || "working"
    };
    channel.budget += Number(row.budget_gbp || 0);
    channel.ftds += Number(row.forecast_acquisitions || 0);
    month.channels.set(row.channel, channel);
  });

  return [...monthMap.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((month) => {
      const topChannels = [...month.channels.values()].sort((a, b) => b.budget - a.budget);
      return {
        ...month,
        cpa: month.ftds > 0 ? month.budget / month.ftds : 0,
        topChannels
      };
    });
}

function buildProductStateFit(productKey) {
  const scenario = getStateBudgetScenarioFor(productKey);
  const budgetByState = new Map((scenario.states || []).map((state) => [state.state_code, state]));
  const rows = app.data.governance.state_rows.map((row) => {
    const bucket = productPlanningBucket(row, productKey);
    const budgetRow = budgetByState.get(row.state_code);
    return {
      ...row,
      bucket: bucket.bucket,
      bucketLabel: bucket.label,
      budget_usd_equivalent: budgetRow?.budget_usd_equivalent || 0,
      forecast_ftds: budgetRow?.forecast_ftds || 0
    };
  });
  const sorter = (a, b) => (b.budget_usd_equivalent - a.budget_usd_equivalent) || ((b.population_2025 || 0) - (a.population_2025 || 0));
  return {
    live: rows.filter((row) => row.bucket === "live").sort(sorter),
    watch: rows.filter((row) => row.bucket === "watch").sort(sorter),
    suppress: rows.filter((row) => row.bucket === "suppress").sort(sorter)
  };
}

function productPlanningBucket(row, productKey) {
  const status = getProductStatus(row, productKey);
  const operatingStatus = row[`${productKey}_operating_status`];
  if (productKey === "sportsbook") {
    if (operatingStatus?.includes("online")) {
      return { bucket: "live", label: "Online live" };
    }
    if (operatingStatus === "retail_only" || status === "restricted" || status === "legal-review") {
      return { bucket: "watch", label: "Limited / review" };
    }
    return { bucket: "suppress", label: "Not listed" };
  }
  if (productKey === "casino") {
    return status === "allowed"
      ? { bucket: "live", label: "Live" }
      : { bucket: "suppress", label: "Not listed" };
  }
  if (productKey === "predicts") {
    return status === "allowed"
      ? { bucket: "live", label: "Available; market review" }
      : { bucket: "watch", label: "Review" };
  }
  if (status === "allowed") {
    return { bucket: "live", label: "Allowed" };
  }
  if (status === "restricted" || status === "legal-review") {
    return { bucket: "watch", label: "Restricted / review" };
  }
  return { bucket: "suppress", label: "Do not activate" };
}

function interpretPlanningDocument(text, sourceName) {
  const clean = String(text || "").trim();
  if (!clean) return null;

  const productInterpretation = extractProducts(clean);
  const products = productInterpretation.products;
  const excludedProducts = productInterpretation.excludedProducts;
  const months = extractMonths(clean);
  const states = extractStates(clean, products[0] || app.selectedCalendarProduct);
  const budget = extractBudget(clean);
  const objective = extractObjective(clean);
  const periodType = detectPeriodType(clean, months);
  const warnings = [];
  if (!budget) warnings.push("budget missing");
  if (!products.length) warnings.push("product missing");
  if (!states.length) warnings.push("states missing");
  if (!months.length && periodType !== "year") warnings.push("timing missing");
  if (products.includes("predicts")) warnings.push("market-level legal review");

  const evidenceCount = [budget, products.length, states.length, months.length || periodType === "year"].filter(Boolean).length;
  const confidence = evidenceCount >= 4 ? "high" : evidenceCount >= 2 ? "medium" : "low";
  return {
    sourceName,
    products,
    excludedProducts,
    months,
    states,
    budget,
    objective,
    periodType,
    warnings,
    confidence
  };
}

function extractProducts(text) {
  const matched = Object.entries(PRODUCT_TERMS)
    .filter(([, pattern]) => pattern.test(text))
    .map(([product]) => product);
  const excludedProducts = matched.filter((product) => PRODUCT_EXCLUSION_TERMS[product]?.test(text));
  const products = matched.filter((product) => !excludedProducts.includes(product));
  return { products, excludedProducts };
}

function extractBudget(text) {
  const match = text.match(/(?:\$|usd\s*)\s*([\d,.]+)\s*(b|bn|billion|m|mn|million|k|thousand)?/i)
    || text.match(/\b([\d,.]+)\s*(b|bn|billion|m|mn|million|k|thousand)\b/i);
  if (!match) return extractWordBudget(text);
  const value = Number(match[1].replaceAll(",", ""));
  const suffix = String(match[2] || "").toLowerCase();
  const multiplier = ["b", "bn", "billion"].includes(suffix)
    ? 1000000000
    : ["m", "mn", "million"].includes(suffix)
      ? 1000000
      : ["k", "thousand"].includes(suffix)
        ? 1000
        : 1;
  return Math.round(value * multiplier);
}

function extractWordBudget(text) {
  const numberWords = [
    "a", "an", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
    "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety", "hundred"
  ];
  const pattern = new RegExp(`\\b((?:${numberWords.join("|")})(?:[\\s-]+(?:and\\s+)?(?:${numberWords.join("|")}))*)\\s+(billion|million|thousand)\\b`, "i");
  const match = String(text || "").match(pattern);
  if (!match) return null;
  const value = parseNumberWords(match[1]);
  if (!value) return null;
  const suffix = match[2].toLowerCase();
  const multiplier = suffix === "billion" ? 1000000000 : suffix === "million" ? 1000000 : 1000;
  return Math.round(value * multiplier);
}

function parseNumberWords(text) {
  const values = {
    a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
    ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
    seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
    sixty: 60, seventy: 70, eighty: 80, ninety: 90
  };
  return String(text || "")
    .toLowerCase()
    .replace(/-/g, " ")
    .split(/\s+/)
    .filter((word) => word && word !== "and")
    .reduce((total, word) => {
      if (word === "hundred") return total * 100;
      return total + (values[word] || 0);
    }, 0);
}

function extractObjective(text) {
  if (/\b(ftd|first[-\s]?time deposit|acquisition|new customer)\b/i.test(text)) return "FTD acquisition";
  if (/\b(cpa|efficiency|cost per acquisition)\b/i.test(text)) return "CPA efficiency";
  if (/\b(retention|reactivation|crm)\b/i.test(text)) return "Retention / reactivation";
  if (/\b(brand|awareness|reach)\b/i.test(text)) return "Brand reach";
  return "";
}

function detectPeriodType(text, months) {
  if (/\b(annual|yearly|full year|year plan|2026 plan)\b/i.test(text)) return "year";
  if (months.length === 1) return "month";
  if (months.length > 1) return "multi-month";
  return "year";
}

function extractStates(text, productKey = app.selectedCalendarProduct) {
  const raw = String(text || "");
  const lower = raw.toLowerCase();
  return app.data.governance.state_rows
    .filter((row) => {
      const namePattern = new RegExp(`\\b${escapeRegExp(row.state.toLowerCase())}\\b`);
      const codePattern = new RegExp(`\\b${escapeRegExp(row.state_code)}\\b`);
      return namePattern.test(lower) || codePattern.test(raw);
    })
    .map((row) => ({
      ...row,
      bucketLabel: productPlanningBucket(row, productKey).label
    }));
}

function extractMonths(text) {
  const monthTerms = [
    ["jan(?:uary)?", 1],
    ["feb(?:ruary)?", 2],
    ["mar(?:ch)?", 3],
    ["apr(?:il)?", 4],
    ["may", 5],
    ["jun(?:e)?", 6],
    ["jul(?:y)?", 7],
    ["aug(?:ust)?", 8],
    ["sep(?:t|tember)?", 9],
    ["oct(?:ober)?", 10],
    ["nov(?:ember)?", 11],
    ["dec(?:ember)?", 12]
  ];
  const found = new Set();
  const addMonth = (number) => found.add(`2026-${String(number).padStart(2, "0")}`);
  const addRange = (start, end) => {
    const finalEnd = end < start ? end + 12 : end;
    for (let index = start; index <= finalEnd; index += 1) {
      addMonth(((index - 1) % 12) + 1);
    }
  };

  monthTerms.forEach(([term, number]) => {
    if (new RegExp(`\\b${term}\\b`, "i").test(text)) {
      addMonth(number);
    }
  });

  const rangePattern = new RegExp(`\\b(${monthTerms.map(([term]) => term).join("|")})\\b\\s*(?:-|to|through|thru|until)\\s*\\b(${monthTerms.map(([term]) => term).join("|")})\\b`, "gi");
  let rangeMatch = rangePattern.exec(text);
  while (rangeMatch) {
    const start = monthNumberFromText(rangeMatch[1]);
    const end = monthNumberFromText(rangeMatch[2]);
    if (start && end) addRange(start, end);
    rangeMatch = rangePattern.exec(text);
  }

  if (/\bq1\b/i.test(text)) addRange(1, 3);
  if (/\bq2\b/i.test(text)) addRange(4, 6);
  if (/\bq3\b/i.test(text)) addRange(7, 9);
  if (/\bq4\b/i.test(text)) addRange(10, 12);
  if (/\bnfl kickoff\b/i.test(text)) addMonth(9);
  if (/\b(super bowl|superbowl)\b/i.test(text)) addMonth(2);
  if (/\bmarch madness\b/i.test(text)) addMonth(3);
  if (/\bfootball season\b/i.test(text)) addRange(9, 12);
  if (/\bnba finals\b/i.test(text)) addMonth(6);
  if (/\bmlb postseason\b/i.test(text)) addMonth(10);

  return [...found].sort();
}

function monthNumberFromText(value) {
  const normalised = String(value || "").slice(0, 3).toLowerCase();
  return {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12
  }[normalised];
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderInsights() {
  const insights = $("#insightsContent");
  const lab = getIdeasLabData();
  if (!insights) return;
  insights.innerHTML = `
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Insights</p>
        <h2>Ideas lab evidence, ported into the planning system</h2>
      </div>
      <div class="panel-actions">
        <span class="status status-working">TAU ideas lab T092</span>
        <button class="small-action" type="button" data-ask-insights>Ask about this board</button>
      </div>
    </div>
    <div class="content-grid">
      <article class="content-card">
        <span class="big-number">${formatNumber(lab.shareSeries?.length || 0)}</span>
        <h3>Share-of-search weeks</h3>
        <p>Single-request comparative Trends series is loaded nationally and for all 50 states plus DC using Karl's exact sportsbook set.</p>
        <div class="pill-row">
          <span class="pill status-client-safe">real comparative series</span>
          <span class="pill status-client-safe">51 real state comparisons</span>
        </div>
      </article>
      <article class="content-card">
        <span class="big-number">${formatNumber(lab.states?.length || 0)}</span>
        <h3>State heat and battleground rows</h3>
        <p>State boxes, product availability, restriction load and defend/attack/waitlist classification are loaded from the lab seed.</p>
        <div class="pill-row"><span class="pill status-working">working state research</span></div>
      </article>
      <article class="content-card">
        <span class="big-number">${formatNumber(lab.mediaOwners?.owners?.length || 0)}</span>
        <h3>Media-owner rows</h3>
        <p>Authored owner directory is visible for planning choreography only; every partner-policy row still requires verification before client use.</p>
        <div class="pill-row"><span class="pill status-review">verify before showing</span></div>
      </article>
    </div>
    ${renderInsightsLabDisclosure()}
    ${renderInsightsModuleIndex()}
    <section class="insight-section">
      <div class="section-heading"><h3>Share of Search race</h3></div>
      ${renderShareOfSearchRace()}
    </section>
    <section class="insight-section">
      <div class="section-heading"><h3>State heatmap tiles</h3></div>
      ${renderStateHeatmapTiles()}
    </section>
    <section class="insight-section">
      <div class="section-heading"><h3>Battlegrounds</h3></div>
      ${renderBattlegroundsModule()}
    </section>
    <section class="insight-section">
      <div class="section-heading"><h3>Predictions operators — separate geographic layer</h3></div>
      ${renderPredictionOperatorModule()}
    </section>
    <section class="insight-section">
      <div class="section-heading"><h3>Personas and ZIP3 affinity</h3></div>
      ${renderPersonaAffinityModule()}
    </section>
    <section class="insight-section">
      <div class="section-heading"><h3>Media owner directory</h3></div>
      ${renderMediaOwnerDirectoryModule()}
    </section>
    <section class="insight-section">
      <div class="section-heading"><h3>Search ideas and conquest queries</h3></div>
      ${renderSearchIdeasModule()}
    </section>
    <section class="insight-section">
      <div class="section-heading"><h3>Planning OS evidence boards</h3></div>
      ${renderSearchTab()}
      ${renderCompetitionTab()}
      <div class="insight-board-stack">
        ${renderAudienceTab()}
        ${renderPersonaOwnerBoard()}
        ${renderRegulationOwnerBoard()}
      </div>
      ${renderMediaOwnerVerificationBoard()}
    </section>
  `;
  bindInsightsLabControls();
}

function renderAudienceSurface() {
  const container = $("#audienceContent");
  if (!container) return;
  const builder = initialiseAudienceBuilder();
  const sizing = calculateAudienceSizing(builder);
  const personaRows = app.data?.personas?.personas || [];
  const selectedPersona = getPersonaById(builder.personaId);
  const stateOptions = getAudienceStateOptions(builder.productKey);
  const savedAudiences = [...(app.customAudiences || [])].reverse();
  const selectedZip3Product = app.selectedZip3 ? getZip3ProductMediaRow(app.selectedZip3, builder.productKey) : null;
  container.innerHTML = `
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Audience</p>
        <h2>Build planning audiences from personas, states and ZIP3 media</h2>
      </div>
      <div class="panel-actions">
        <button class="small-action" type="button" data-audience-new>New audience</button>
        <span class="status status-working">working proxy</span>
        <span class="status status-synthetic">not Admiral audience data</span>
      </div>
    </div>

    <div class="audience-top-grid">
      <article class="panel audience-builder-panel">
        <div class="panel-heading compact-heading">
          <div>
            <p class="eyebrow">Builder</p>
            <h2>${escapeHtml(builder.id ? "Edit saved audience" : "Create audience")}</h2>
          </div>
          <button class="drawer-button" type="button" data-audience-save>Save audience</button>
        </div>
        <div class="audience-form-grid">
          <label>
            <span>Name</span>
            <input data-audience-field="name" value="${escapeHtml(builder.name || "")}" placeholder="e.g. Football launch switchers">
          </label>
          <label>
            <span>Product</span>
            <select data-audience-field="productKey">
              ${productOptionsHtml(builder.productKey)}
            </select>
          </label>
          <label>
            <span>Channel focus</span>
            <select data-audience-field="channelScope">
              ${CHANNEL_SCOPE_OPTIONS.map((option) => `<option value="${escapeHtml(option.value)}" ${builder.channelScope === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>Age</span>
            <select data-audience-field="ageBand">
              ${AUDIENCE_AGE_BANDS.map((band) => `<option value="${escapeHtml(band.value)}" ${builder.ageBand === band.value ? "selected" : ""}>${escapeHtml(band.label)}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>Gender</span>
            <select data-audience-field="gender">
              <option value="all" ${builder.gender === "all" ? "selected" : ""}>All genders</option>
              <option value="female" ${builder.gender === "female" ? "selected" : ""}>Female</option>
              <option value="male" ${builder.gender === "male" ? "selected" : ""}>Male</option>
            </select>
          </label>
          <label>
            <span>Income</span>
            <select data-audience-field="incomeBand">
              ${AUDIENCE_INCOME_BANDS.map((band) => `<option value="${escapeHtml(band.value)}" ${builder.incomeBand === band.value ? "selected" : ""}>${escapeHtml(band.label)}</option>`).join("")}
            </select>
          </label>
          <label class="audience-definition-field">
            <span>Audience definition</span>
            <textarea data-audience-field="definition" rows="4" placeholder="Describe the audience in normal language">${escapeHtml(builder.definition || "")}</textarea>
          </label>
        </div>
        <div class="panel-actions audience-assist-actions">
          <button class="small-action" type="button" data-audience-assist ${builder.definition ? "" : "disabled"}>Translate into builder fields</button>
          <span class="status ${app.audienceAssistStatus.includes("LLM") ? "status-working" : "status-review"}">${escapeHtml(app.audienceAssistStatus || "Assistant uses loaded persona and state options")}</span>
        </div>
        <div class="planning-readout compact-readout">
          <article class="readout-item"><span>Size proxy</span><strong>${formatNumber(sizing.sizeProxy)}</strong></article>
          <article class="readout-item"><span>Active ZIP3s</span><strong>${formatNumber(sizing.zip3Count)}</strong></article>
          <article class="readout-item"><span>Annual media proxy</span><strong>${formatCurrency(sizing.activeMedia)}</strong></article>
          <article class="readout-item"><span>State scope</span><strong>${escapeHtml(sizing.states.join(", "))}</strong></article>
        </div>
        <div class="note-list compact-notes">
          <div class="note-item">${selectedPersona ? `Seed: ${escapeHtml(selectedPersona.label)} / ${escapeHtml(selectedPersona.market_role || "working persona")}.` : "Choose a seed persona or write a new audience definition."} Attributes: ${escapeHtml(audienceAttributeLabel(builder))} (${Math.round(sizing.attributeFactor * 100)}% working filter factor).</div>
          <div class="note-item">Audience sizing uses persona seeds and ZIP3 working estimates only. Replace with client CRM, clean-room, platform and Census-backed data before client claims.</div>
        </div>
      </article>

      <article class="panel saved-audience-panel">
        <div class="panel-heading compact-heading">
          <div>
            <p class="eyebrow">Saved audiences</p>
            <h2>${formatNumber(savedAudiences.length)} reusable objects</h2>
          </div>
          <span class="status status-working">available in dinks</span>
        </div>
        <div class="saved-audience-list">
          ${savedAudiences.length ? savedAudiences.map((audience) => `
            <article class="saved-audience-card">
              <div>
                <strong>${escapeHtml(audience.label)}</strong>
                <span>${escapeHtml((audience.stateCodes || []).join(", "))} / ${escapeHtml(audience.productLabel || productLabel(audience.productKey))} / ${escapeHtml(audience.attributeLabel || "All adult attributes")} / ${escapeHtml(audience.channelScopeLabel || channelScopeLabel(audience.channelScope))}</span>
              </div>
              <div class="planning-readout mini-readout">
                <article class="readout-item"><span>Proxy</span><strong>${formatNumber(audience.sizeProxy || 0)}</strong></article>
                <article class="readout-item"><span>ZIP3</span><strong>${formatNumber(audience.zip3Count || 0)}</strong></article>
              </div>
              <div class="panel-actions">
                <button class="small-action" type="button" data-audience-edit="${escapeHtml(audience.id)}">Edit</button>
                <button class="drawer-button" type="button" data-audience-apply="${escapeHtml(audience.id)}">Use in plan</button>
              </div>
            </article>
          `).join("") : `<article class="note-item">No saved audiences yet. Build one from a seed persona or state set, then it will appear in the Planning OS Audience dink.</article>`}
        </div>
      </article>
    </div>

    <div class="audience-workbench-grid">
      <article class="panel">
        <div class="panel-heading compact-heading">
          <div>
            <p class="eyebrow">Seed personas</p>
            <h2>Starting points</h2>
          </div>
          <span class="status status-working">working seeds</span>
        </div>
        <div class="audience-persona-grid">
          ${personaRows.map((persona) => `
            <button class="audience-persona-card ${persona.persona_id === builder.personaId ? "is-selected" : ""}" type="button" data-audience-persona="${escapeHtml(persona.persona_id)}">
              <strong>${escapeHtml(persona.label)}</strong>
              <span>${escapeHtml((persona.state_codes || []).join(", ") || persona.primary_state)} / ${formatNumber(persona.segment_size_proxy?.value || 0)} proxy</span>
              <small>${escapeHtml(persona.market_role || "")}</small>
            </button>
          `).join("")}
        </div>
      </article>

      <article class="panel">
        <div class="panel-heading compact-heading">
          <div>
            <p class="eyebrow">States</p>
            <h2>Audience geography</h2>
          </div>
          <span class="status status-working">${formatNumber(builder.stateCodes.length)} selected</span>
        </div>
        <div class="audience-state-grid">
          ${stateOptions.map((state) => `
            <button class="state-chip ${builder.stateCodes.includes(state.code) ? "is-selected" : ""} ${state.live ? "is-live" : ""}" type="button" data-audience-state="${escapeHtml(state.code)}">
              ${escapeHtml(state.code)} <small>${state.live ? "live" : "review"}</small>
            </button>
          `).join("")}
        </div>
      </article>
    </div>

    <div class="audience-map-grid">
      <article class="panel map-panel">
        <div class="panel-heading compact-heading">
          <div>
            <p class="eyebrow">ZIP3 map</p>
            <h2>${escapeHtml(productLabel(builder.productKey))} audience media proxy</h2>
          </div>
          <span class="status status-working">Signal ZIP3 bridge</span>
        </div>
        <div id="audienceZip3Map" class="state-map" aria-label="Audience ZIP3 map"></div>
        <div id="audienceMapLegend" class="map-legend"></div>
      </article>
      <article class="panel">
        <div class="panel-heading compact-heading">
          <div>
            <p class="eyebrow">Selected ZIP3</p>
            <h2>${escapeHtml(app.selectedZip3 ? `ZIP3 ${app.selectedZip3}` : "Click the map")}</h2>
          </div>
          <span class="status status-working">working estimate</span>
        </div>
        <div class="note-list">
          <div class="note-item">${
            selectedZip3Product
              ? `${escapeHtml(selectedZip3Product.state_code)} / ${escapeHtml(formatStatus(selectedZip3Product.planning_status))} / ${formatCurrency(selectedZip3Product.annual_media_spend_usd)} annual ${escapeHtml(productLabel(builder.productKey))} media proxy.`
              : "Select a ZIP3 to inspect product status, estimated media proxy and state fit."
          }</div>
          <div class="note-item">The map is useful for audience shape and planning discussion, not final reach or CRM sizing.</div>
        </div>
      </article>
    </div>
  `;
  bindAudienceControls(container);
  renderZip3Map("audienceZip3Map", "audienceMapLegend");
}

function bindAudienceControls(container) {
  container.querySelectorAll("[data-audience-field]").forEach((field) => {
    const handler = () => {
      updateAudienceBuilderField(field.dataset.audienceField, field.value);
      if (field.tagName === "SELECT" || field.dataset.audienceField === "definition") renderAudienceSurface();
    };
    field.addEventListener("input", handler);
    field.addEventListener("change", handler);
  });
  container.querySelectorAll("[data-audience-persona]").forEach((button) => {
    button.addEventListener("click", () => {
      selectAudiencePersona(button.dataset.audiencePersona);
      renderAudienceSurface();
    });
  });
  container.querySelectorAll("[data-audience-state]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleAudienceBuilderState(button.dataset.audienceState);
      renderAudienceSurface();
    });
  });
  container.querySelector("[data-audience-new]")?.addEventListener("click", () => {
    initialiseAudienceBuilder({ reset: true });
    renderAudienceSurface();
  });
  container.querySelector("[data-audience-save]")?.addEventListener("click", () => {
    saveAudienceFromBuilder();
    render();
  });
  container.querySelector("[data-audience-assist]")?.addEventListener("click", () => {
    assistAudienceFromDefinition();
  });
  container.querySelectorAll("[data-audience-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const audience = (app.customAudiences || []).find((item) => item.id === button.dataset.audienceEdit);
      if (!audience) return;
      app.audienceBuilder = {
        id: audience.id,
        name: audience.label,
        definition: audience.definition,
        personaId: audience.personaId || "",
        ageBand: audience.ageBand || "25_40",
        gender: audience.gender || "all",
        incomeBand: audience.incomeBand || "all",
        stateCodes: audience.stateCodes || [app.selectedState],
        productKey: audience.productKey || app.selectedProduct,
        channelScope: audience.channelScope || "all"
      };
      renderAudienceSurface();
    });
  });
  container.querySelectorAll("[data-audience-apply]").forEach((button) => {
    button.addEventListener("click", () => applyAudienceToPlanning(button.dataset.audienceApply));
  });
}

function localAudienceDefinitionFallback(definition) {
  const clean = String(definition || "").toLowerCase();
  const stateCodes = /midwest|mid-west/.test(clean)
    ? ["IL", "IN", "IA", "KS", "MI", "MN", "MO", "NE", "ND", "OH", "SD", "WI"]
    : getAudienceBuilder().stateCodes;
  return {
    ageBand: /(?:25\s*(?:-|to|–)\s*40|young)/.test(clean) ? "25_40" : getAudienceBuilder().ageBand,
    gender: /\bmen|\bmale/.test(clean) ? "male" : /\bwomen|\bfemale/.test(clean) ? "female" : getAudienceBuilder().gender,
    incomeBand: /(?:75k|\$75|affluent|high income)/.test(clean) ? "75k_plus" : getAudienceBuilder().incomeBand,
    stateCodes,
    personaId: /lapsed|holdout/.test(clean) ? "tx_holdout_predicts_watchlist" : getAudienceBuilder().personaId
  };
}

async function assistAudienceFromDefinition() {
  const builder = getAudienceBuilder();
  const definition = String(builder.definition || "").trim();
  if (!definition) return;
  const fallback = localAudienceDefinitionFallback(definition);
  const allowedStates = new Set(getStateRows().map((row) => row.state_code));
  // Populate immediately with a conservative parser draft so the audience
  // flow remains usable if the optional LLM request is slow or unavailable.
  app.audienceBuilder = {
    ...builder,
    ageBand: AUDIENCE_AGE_BANDS.some((item) => item.value === fallback.ageBand) ? fallback.ageBand : builder.ageBand,
    gender: ["all", "male", "female"].includes(fallback.gender) ? fallback.gender : builder.gender,
    incomeBand: AUDIENCE_INCOME_BANDS.some((item) => item.value === fallback.incomeBand) ? fallback.incomeBand : builder.incomeBand,
    stateCodes: (fallback.stateCodes || []).filter((code) => allowedStates.has(code)),
    personaId: getPersonaById(fallback.personaId) ? fallback.personaId : builder.personaId
  };
  app.audienceAssistStatus = "Working parser draft; checking LLM translation";
  renderAudienceSurface();
  let translated = null;
  try {
    const states = getStateRows().map((row) => row.state_code).join(", ");
    const result = await postAnthropicMessages({
      system: `Translate an audience description into JSON only. Allowed ageBand: ${AUDIENCE_AGE_BANDS.map((item) => item.value).join(", ")}. Allowed gender: all, male, female. Allowed incomeBand: ${AUDIENCE_INCOME_BANDS.map((item) => item.value).join(", ")}. stateCodes must be a subset of: ${states}. Return {"ageBand":"...","gender":"...","incomeBand":"...","stateCodes":[".."]}. Do not invent audience size or data.`,
      messages: [{ role: "user", content: definition }],
      max_tokens: 180,
      temperature: 0
    });
    const text = getAnthropicText(result);
    const match = text.match(/\{[\s\S]*\}/);
    const candidate = match ? JSON.parse(match[0]) : null;
    if (candidate && Array.isArray(candidate.stateCodes)) {
      translated = candidate;
      app.audienceAssistStatus = "LLM translation; working sizing proxy";
    }
  } catch (error) {
    app.audienceAssistStatus = "Working parser fallback; LLM translation unavailable";
  }
  const next = translated || fallback;
  app.audienceBuilder = {
    ...builder,
    ageBand: AUDIENCE_AGE_BANDS.some((item) => item.value === next.ageBand) ? next.ageBand : builder.ageBand,
    gender: ["all", "male", "female"].includes(next.gender) ? next.gender : builder.gender,
    incomeBand: AUDIENCE_INCOME_BANDS.some((item) => item.value === next.incomeBand) ? next.incomeBand : builder.incomeBand,
    stateCodes: (next.stateCodes || []).filter((code) => allowedStates.has(code)),
    personaId: getPersonaById(next.personaId) ? next.personaId : builder.personaId
  };
  renderAudienceSurface();
}

function getIdeasLabData() {
  return app.data?.ideasLab || {};
}

function insightBrandLabel(brand) {
  return INSIGHT_BRAND_LABELS[brand] || brand || "Unknown";
}

function insightBrandColor(brand) {
  return INSIGHT_BRAND_COLORS[brand] || "#5f6f7c";
}

function insightPillClass(status) {
  const text = String(status || "").toLowerCase();
  if (text.includes("client") || text.includes("real")) return "status-client-safe";
  if (text.includes("model") || text.includes("synthetic")) return "status-synthetic";
  if (text.includes("authored") || text.includes("review") || text.includes("verify")) return "status-review";
  if (text.includes("missing") || text.includes("flag") || text.includes("not")) return "status-missing";
  return "status-working";
}

function renderInsightsLabDisclosure() {
  const lab = getIdeasLabData();
  const groups = [
    ["Real inputs", lab.disclosure?.real || [], "client-safe signal"],
    ["Modelled layers", lab.disclosure?.modelled || [], "modelled"],
    ["Authored working rows", lab.disclosure?.authored || [], "authored verify"]
  ];
  return `
    <section class="insights-disclosure">
      <div>
        <p class="eyebrow">Data disclosure</p>
        <h3>Every lab module keeps its status visible</h3>
      </div>
      <div class="insights-disclosure-grid">
        ${groups.map(([label, items, status]) => `
          <article>
            <span class="pill ${insightPillClass(status)}">${escapeHtml(status)}</span>
            <strong>${escapeHtml(label)}</strong>
            ${items.slice(0, 2).map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderInsightsModuleIndex() {
  const lab = getIdeasLabData();
  const modules = [
    ["1", "Share of Search", `${formatNumber(lab.shareSeries?.length || 0)} weeks`, "CMO race view with a real same-request comparison nationally and in every state.", "Question: where is FanDuel gaining or losing search attention? Indexed against the same five-brand request; 13-week window.", "real"],
    ["2", "State Heatmap", `${formatNumber(lab.states?.length || 0)} states`, "State boxes for observed share, rival pressure, availability and restriction load.", "Question: which states combine FanDuel demand, rival pressure and usable product availability? Indexed within each brand/state request; current 13-week window.", "working"],
    ["3", "Battlegrounds", "defend / attack / waitlist", "Ranks states from same-request competitor share without comparing raw levels across states.", "Question: where should FanDuel defend, attack or wait? Indexed to state-level relative pressure, not cross-state market share; current window.", "real + working"],
    ["4", "Personas + ZIP3", `${formatNumber(lab.zip3?.length || 0)} ZIP3 areas`, "Persona affinity and neighbourhood drill from the Signal ZIP3 spine, visibly modelled.", "Question: which neighbourhood/persona patterns are addressable? Indexed to working demographic bridge attributes; current loaded spine.", "modelled"],
    ["5", "Media Owners", `${formatNumber(lab.mediaOwners?.owners?.length || 0)} owners`, "US owner directory with partner-policy stance, conflict flags and measurement currencies.", "Question: which owners can be considered subject to policy verification? Indexed to owner-policy receipts; current policy check date.", "verify"],
    ["6", "Search Ideas", `${formatNumber(Object.keys(lab.relatedQueries || {}).length)} brands`, "Related-query language and conquest angles for the Stage 1 search POC.", "Question: what language signals demand or conquest opportunity? Indexed to related-query returns, not paid SERP volume; current pull.", "real"],
    ["7", "Predictions operators", "3 separate operators", "Kalshi, Polymarket US and FanDuel Predicts use a separate map because their geographic index is not sportsbook market share.", "Question: where are predictions operators distinct from sportsbook competition? Indexed to separate operator research; current receipt window.", "research-support"]
  ];
  return `
    <section class="insight-lab-index">
      ${modules.map(([number, title, stat, body, method, status]) => `
        <article class="insight-module-card">
          <span class="insight-module-number">${escapeHtml(number)}</span>
          <div>
            <h3>${escapeHtml(title)}</h3>
            <strong>${escapeHtml(stat)}</strong>
            <p>${escapeHtml(body)}</p>
            ${method ? `<p class="insight-index-method">${escapeHtml(method)}</p>` : ""}
            <span class="pill ${insightPillClass(status)}">${escapeHtml(status)}</span>
          </div>
        </article>
      `).join("")}
    </section>
  `;
}

function getInsightRaceSeries() {
  const lab = getIdeasLabData();
  const base = app.selectedInsightRaceMode === "share" ? lab.shareSeries : lab.series;
  if (!base?.length) return { points: [], modelled: false };
  if (app.selectedInsightRaceState === "US") return { points: base, modelled: false };
  const stateRow = (lab.stateComparativeRows || []).find((row) => row.state_code === app.selectedInsightRaceState);
  if (!stateRow?.data_points?.length) return { points: [], modelled: false };
  if (app.selectedInsightRaceMode === "raw") return { points: stateRow.data_points, modelled: false };
  return {
    points: stateRow.data_points.map((point) => {
      const total = point.values.reduce((sum, value) => sum + value, 0) || 1;
      return { date: point.date, values: point.values.map((value) => (value / total) * 100) };
    }),
    modelled: false
  };
}

function getInsightRaceKpis(points) {
  const lab = getIdeasLabData();
  const brands = lab.brands5 || [];
  const fdIndex = brands.indexOf("fanduel");
  const dkIndex = brands.indexOf("draftkings");
  if (!points.length || fdIndex === -1 || dkIndex === -1) {
    return { fdNow: 0, fdDelta: 0, dkNow: 0, leaderWeeks: 0, weeks: 0 };
  }
  const first = points.slice(0, 13);
  const last = points.slice(-13);
  const avg = (rows, index) => rows.reduce((sum, point) => sum + Number(point.values[index] || 0), 0) / Math.max(1, rows.length);
  const fdNow = avg(last, fdIndex);
  const fdThen = avg(first, fdIndex);
  const dkNow = avg(last, dkIndex);
  const leaderWeeks = points.filter((point) => Math.max(...point.values) === point.values[fdIndex]).length;
  return { fdNow, fdDelta: fdNow - fdThen, dkNow, leaderWeeks, weeks: points.length };
}

function renderShareOfSearchRace() {
  const lab = getIdeasLabData();
  const brands = lab.brands5 || [];
  const { points, modelled } = getInsightRaceSeries();
  const kpis = getInsightRaceKpis(points);
  const valueSuffix = app.selectedInsightRaceMode === "share" ? "%" : "";
  const selectedState = app.selectedInsightRaceState === "US"
    ? "United States"
    : (lab.states || []).find((state) => state.code === app.selectedInsightRaceState)?.state || app.selectedInsightRaceState;
  return `
    <div class="insight-lab-panel">
      <div class="insight-lab-controls">
        <label>
          <span>Geography</span>
          <select id="insightRaceState">
            <option value="US">United States - real comparative series</option>
            ${(lab.states || []).map((state) => `<option value="${escapeHtml(state.code)}">${escapeHtml(state.state)} - real comparative series</option>`).join("")}
          </select>
        </label>
        <label>
          <span>Metric</span>
          <select id="insightRaceMode">
            <option value="share">Share %</option>
            <option value="raw">Interest index</option>
          </select>
        </label>
      </div>
      <div class="content-grid">
        <article class="content-card">
          <span class="big-number">${kpis.fdNow.toFixed(1)}${valueSuffix}</span>
          <h3>FanDuel last 13 weeks</h3>
          <p>${escapeHtml(selectedState)} ${app.selectedInsightRaceMode === "share" ? "share-of-search" : "search index"} average.</p>
          <div class="pill-row"><span class="pill ${kpis.fdDelta >= 0 ? "status-client-safe" : "status-review"}">${kpis.fdDelta >= 0 ? "+" : ""}${kpis.fdDelta.toFixed(1)} pts vs first 13 weeks</span></div>
        </article>
        <article class="content-card">
          <span class="big-number">${kpis.dkNow.toFixed(1)}${valueSuffix}</span>
          <h3>DraftKings last 13 weeks</h3>
          <p>Comparison row uses the same five-brand request for the selected geography.</p>
          <div class="pill-row"><span class="pill status-working">gap ${(kpis.fdNow - kpis.dkNow).toFixed(1)} pts</span></div>
        </article>
        <article class="content-card">
          <span class="big-number">${formatNumber(kpis.leaderWeeks)}/${formatNumber(kpis.weeks)}</span>
          <h3>Weeks FanDuel led</h3>
          <p>Leadership count across the loaded observed year. Useful for the CMO narrative, not a media-mix proof.</p>
          <div class="pill-row"><span class="pill status-client-safe">real same-request series</span></div>
        </article>
      </div>
      ${renderInsightRaceChart(points, brands)}
      <div class="method-note">
        <strong>Method:</strong>
        Single-request comparative Google Trends series for the selected geography. Raw index levels are never compared across states.
      </div>
    </div>
  `;
}

function renderInsightRaceChart(points, brands) {
  if (!points.length || !brands.length) return `<div class="note-item">No share-of-search series loaded.</div>`;
  const width = 860;
  const height = 250;
  const pad = { left: 40, right: 16, top: 18, bottom: 28 };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const maxY = Math.max(10, Math.ceil(Math.max(...points.flatMap((point) => point.values)) / 10) * 10);
  const x = (index) => pad.left + (index / Math.max(1, points.length - 1)) * innerWidth;
  const y = (value) => pad.top + innerHeight - (value / maxY) * innerHeight;
  const grid = [0, 0.25, 0.5, 0.75, 1].map((factor) => {
    const yPos = pad.top + innerHeight - factor * innerHeight;
    return `<line x1="${pad.left}" y1="${yPos}" x2="${width - pad.right}" y2="${yPos}" stroke="#dce3ea" stroke-dasharray="2 5"></line>
      <text x="${pad.left - 8}" y="${yPos + 4}" text-anchor="end">${Math.round(factor * maxY)}</text>`;
  }).join("");
  const paths = brands.map((brand, brandIndex) => {
    const d = points.map((point, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(1)},${y(point.values[brandIndex] || 0).toFixed(1)}`).join(" ");
    return `<path d="${d}" fill="none" stroke="${insightBrandColor(brand)}" stroke-width="${brand === "fanduel" ? 3.5 : 2}" opacity="${brand === "fanduel" ? 1 : 0.82}"></path>`;
  }).join("");
  const annotations = [
    ["2025-09-07", "NFL kickoff"],
    ["2026-02-08", "Super Bowl"],
    ["2026-03-15", "March Madness"]
  ].map(([date, label]) => {
    const index = Math.max(0, points.findIndex((point) => point.date === date));
    const xPos = x(index);
    return `<g><line x1="${xPos}" y1="${pad.top}" x2="${xPos}" y2="${height - pad.bottom}" stroke="#b35a00" stroke-dasharray="4 4"></line>
      <text x="${xPos + 4}" y="${pad.top + 12}">${escapeHtml(label)}</text></g>`;
  }).join("");
  return `
    <div class="insight-race-chart">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Share of Search line chart">
        <rect x="0" y="0" width="${width}" height="${height}" rx="8" fill="#fff"></rect>
        ${grid}
        ${annotations}
        ${paths}
      </svg>
      <div class="insight-chart-legend">
        ${brands.map((brand) => `<span><i style="background:${insightBrandColor(brand)}"></i>${escapeHtml(insightBrandLabel(brand))}</span>`).join("")}
      </div>
    </div>
  `;
}

function insightMapValue(state, metric) {
  const lab = getIdeasLabData();
  if (metric === "fd_strength") return state.trend?.fanduel ?? null;
  if (metric === "dk_pressure") return state.trend?.draftkings ?? null;
  if (metric === "fd_share") return lab.stateSplit?.[state.code]?.find((row) => row.brand === "fanduel")?.pct ?? null;
  if (metric === "availability") {
    if (state.sportsbook === "online_and_retail") return 100;
    if (state.sportsbook === "online") return 75;
    if (state.sportsbook === "retail_only") return 40;
    return 10;
  }
  if (metric === "restrictions") {
    let load = 0;
    if (state.collegeRestricted) load += 40;
    if (Number(state.fantasyAge || 18) > 18) load += 25;
    if (String(state.fantasyStatus || "").includes("free_only")) load += 35;
    if (String(state.fantasyStatus || "").includes("legal_review")) load += 35;
    return load;
  }
  return null;
}

function insightHeatColor(value, max, metric) {
  if (value === null || value === undefined) return "#edf2f6";
  const intensity = Math.max(0, Math.min(1, Number(value) / Math.max(1, max)));
  if (metric === "restrictions") {
    return `hsl(12 78% ${Math.round(94 - intensity * 40)}%)`;
  }
  if (metric === "availability") {
    return `hsl(151 48% ${Math.round(92 - intensity * 38)}%)`;
  }
  if (metric === "dk_pressure") {
    return `hsl(211 70% ${Math.round(94 - intensity * 38)}%)`;
  }
  return `hsl(189 62% ${Math.round(94 - intensity * 40)}%)`;
}

function renderStateHeatmapTiles() {
  const lab = getIdeasLabData();
  const metric = INSIGHT_HEAT_METRICS[app.selectedInsightHeatMetric] ? app.selectedInsightHeatMetric : "fd_strength";
  const config = INSIGHT_HEAT_METRICS[metric];
  const values = (lab.states || []).map((state) => insightMapValue(state, metric)).filter((value) => value !== null && value !== undefined);
  const max = Math.max(...values, 1);
  const size = 64;
  const gap = 6;
  const width = 12 * (size + gap);
  const height = 8 * (size + gap);
  const tiles = (lab.states || []).filter((state) => INSIGHT_STATE_TILE_COORDS[state.code]).map((state) => {
    const [col, row] = INSIGHT_STATE_TILE_COORDS[state.code];
    const value = insightMapValue(state, metric);
    const selected = app.selectedInsightHeatState === state.code;
    return `
      <g>
        <rect class="insight-state-tile ${selected ? "is-selected" : ""}" data-state-code="${escapeHtml(state.code)}"
          x="${col * (size + gap)}" y="${row * (size + gap)}" width="${size}" height="${size}" rx="6"
          fill="${insightHeatColor(value, max, metric)}">
          <title>${escapeHtml(state.state)}: ${value === null || value === undefined ? "no data" : Math.round(value)}</title>
        </rect>
        <text x="${col * (size + gap) + size / 2}" y="${row * (size + gap) + 30}" text-anchor="middle">${escapeHtml(state.code)}</text>
        <text x="${col * (size + gap) + size / 2}" y="${row * (size + gap) + 47}" text-anchor="middle">${value === null || value === undefined ? "-" : Math.round(value)}</text>
      </g>
    `;
  }).join("");
  return `
    <div class="content-grid two insight-heatmap-grid">
      <article class="content-card">
        <div class="insight-lab-controls">
          <label>
            <span>Heat metric</span>
            <select id="insightHeatMetric">
              ${Object.entries(INSIGHT_HEAT_METRICS).map(([key, item]) => `<option value="${escapeHtml(key)}">${escapeHtml(item.name)}</option>`).join("")}
            </select>
          </label>
          <span class="pill ${insightPillClass(config.status)}">${escapeHtml(config.status)}</span>
        </div>
        <p>${escapeHtml(config.note)}</p>
        <div class="insight-state-tile-wrap">
          <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="State heatmap tiles">${tiles}</svg>
        </div>
        <div class="insight-chart-legend">
          <span><i style="background:${insightHeatColor(max * 0.2, max, metric)}"></i>low</span>
          <span><i style="background:${insightHeatColor(max * 0.6, max, metric)}"></i>mid</span>
          <span><i style="background:${insightHeatColor(max, max, metric)}"></i>high</span>
          <span><i style="background:#edf2f6"></i>no data</span>
        </div>
      </article>
      ${renderInsightStatePanel(app.selectedInsightHeatState)}
    </div>
  `;
}

function renderInsightStatePanel(stateCode) {
  const lab = getIdeasLabData();
  const state = (lab.states || []).find((item) => item.code === stateCode) || (lab.states || [])[0];
  if (!state) return `<article class="content-card"><h3>Select a state</h3></article>`;
  const split = (lab.stateSplit?.[state.code] || []).filter((row) => row.pct !== null && row.pct !== undefined).sort((a, b) => b.pct - a.pct);
  const maxPct = Math.max(...split.map((row) => row.pct), 1);
  const rule = (lab.govRules || []).find((item) => item.code === state.code);
  const regulator = (lab.regStates || []).find((item) => item.state === state.state);
  return `
    <article class="content-card insight-state-detail">
      <div class="posture-score">
        <span>${escapeHtml(state.code)}</span>
        <small>${escapeHtml(state.priority ? "priority" : "state")}</small>
      </div>
      <div>
        <p class="eyebrow">State readout</p>
        <h3>${escapeHtml(state.state)}</h3>
        <p>${escapeHtml(formatStatus(state.sportsbook || "unknown"))}. Casino ${escapeHtml(formatStatus(state.casino || "unknown"))}. Fantasy ${escapeHtml(formatStatus(state.fantasyStatus || "unknown"))}.</p>
      </div>
      <div class="keyword-list">
        ${split.slice(0, 6).map((row) => `
          <div class="trend-row">
            <span>${escapeHtml(insightBrandLabel(row.brand))}</span>
            <div class="bar-track"><div class="trend-fill" style="width:${Math.max(2, (row.pct / maxPct) * 100)}%;background:${insightBrandColor(row.brand)}"></div></div>
            <span>${Number(row.pct).toFixed(1)}%</span>
          </div>
        `).join("")}
      </div>
      <div class="note-list compact-notes">
        ${rule ? `<div class="note-item"><strong>Planning action:</strong> ${escapeHtml(rule.action)}</div>` : `<div class="note-item">No planning action row loaded for this state; do not infer one.</div>`}
        ${regulator ? `<div class="note-item"><strong>Regulator pack:</strong> ${formatNumber(regulator.sources?.length || 0)} working source links loaded.</div>` : `<div class="note-item">No regulator pack loaded for this state yet.</div>`}
        <div class="note-item">Observed share uses one FanDuel-anchored five-brand Trends request for this state; raw levels are not compared across states.</div>
      </div>
    </article>
  `;
}

function renderBattlegroundsModule() {
  const lab = getIdeasLabData();
  const rows = lab.battlegrounds || [];
  const live = rows.filter((row) => String(row.sportsbook || "").includes("online"));
  const future = rows.filter((row) => !String(row.sportsbook || "").includes("online"));
  const defend = [...live].sort((a, b) => Number(b.gap || 0) - Number(a.gap || 0)).slice(0, 7);
  const attack = [...live].sort((a, b) => Number(a.gap || 0) - Number(b.gap || 0)).slice(0, 7);
  const waitlist = [...future].sort((a, b) => Number(b.fd || 0) - Number(a.fd || 0)).slice(0, 7);
  return `
    <div class="content-grid three insight-battle-grid">
      ${renderBattlegroundColumn("Fortresses - defend", "FanDuel leads Karl's sportsbook set in the same state request.", defend, "client-safe signal")}
      ${renderBattlegroundColumn("Battlegrounds - attack", "A Karl-set rival leads FanDuel in the same state request.", attack, "client-safe signal")}
      ${renderBattlegroundColumn("Waitlist - future markets", "Search demand exists, but online sportsbook is not live in the FanDuel-owned source. Brand/watchlist only.", waitlist, "not live")}
    </div>
    <div class="method-note"><strong>Honesty rule:</strong> cross-brand share is valid within each five-brand state request; raw index levels are not compared across states.</div>
  `;
}

function renderBattlegroundColumn(title, body, rows, status) {
  return `
    <article class="content-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body)}</p>
      <div class="pill-row"><span class="pill ${insightPillClass(status)}">${escapeHtml(status)}</span></div>
      <div class="insight-rank-list">
        ${rows.map((row) => `
          <div class="insight-rank-row">
            <strong>${escapeHtml(row.code)}</strong>
            <span>${escapeHtml(row.state)}<small>FD share ${escapeHtml(row.fdSplitPct)}% / best rival ${escapeHtml(row.maxComp)}% / gap ${Number(row.gap || 0) >= 0 ? "+" : ""}${escapeHtml(row.gap)} pts</small></span>
            <em>${row.fdSplitPct === null || row.fdSplitPct === undefined ? "-" : `${Number(row.fdSplitPct).toFixed(1)}%`}</em>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function renderPersonaAffinityModule() {
  const lab = getIdeasLabData();
  const zipStates = [...new Set((lab.zip3 || []).map((row) => row.state))].sort();
  const selectedZipState = zipStates.includes(app.selectedInsightZipState) ? app.selectedInsightZipState : zipStates[0];
  const zipRows = (lab.zip3 || [])
    .filter((row) => row.state === selectedZipState)
    .sort((a, b) => Number(b.pop || 0) - Number(a.pop || 0))
    .slice(0, 8);
  return `
    <div class="content-grid two">
      <article class="content-card">
        <h3>Persona affinity</h3>
        <p>Predict US working personas with M2 modelled affinity built from the observed corrected-set state share. Calibration is still pending.</p>
        <div class="insight-persona-grid">
          ${(lab.personas || []).map((persona) => {
            const affinity = (lab.personaAffinities || []).find((row) => row.persona_id === persona.persona_id)?.affinity;
            const geo = persona.geo_signals || {};
            return `
              <div class="persona-row">
                <p class="eyebrow">${escapeHtml(persona.primary_state)} / ${escapeHtml(persona.market_role)}</p>
                <h3>${escapeHtml(persona.label)}</h3>
                <span class="big-number">${formatNumber(persona.segment_size_proxy?.value || 0)}</span>
                <p>${escapeHtml(persona.segment_size_proxy?.method || "working proxy")}</p>
                ${renderInsightAffinityStack(affinity || [])}
                <div class="pill-row">
                  <span class="pill status-synthetic">M2 illustrative</span>
                  <span class="pill">${escapeHtml((persona.recommended_demo_channels || []).slice(0, 2).join(", "))}</span>
                  <span class="pill">${formatNumber(geo.population || geo.combined_population || 0)} people</span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </article>
      <article class="content-card">
        <div class="insight-lab-controls">
          <label>
            <span>ZIP3 state</span>
            <select id="insightZipState">
              ${zipStates.map((state) => `<option value="${escapeHtml(state)}">${escapeHtml(state)}</option>`).join("")}
            </select>
          </label>
          <span class="pill status-synthetic">ZIP3 modelled affinity</span>
        </div>
        <p>Largest ZIP3 rows for the selected state, with the same demographic tilt model used for the persona cards.</p>
        <div class="insight-zip-list">
          ${zipRows.map((zip) => `
            <div class="insight-zip-row">
              <strong>ZIP3 ${escapeHtml(zip.zip3)}</strong>
              <span>${formatNumber(zip.pop || 0)} people / ${escapeHtml(zip.inc_100p)}% $100k+ / ${escapeHtml(zip.age_25_44)}% aged 25-44</span>
              ${renderInsightAffinityStack(insightAffinityFor(zip.state, {
                income_100k_plus_pct: zip.inc_100p,
                income_under_50k_pct: zip.inc_u50,
                age_25_44_pct: zip.age_25_44,
                age_45_64_pct: zip.age_45_64,
                age_65_plus_pct: zip.age_65p
              }) || [])}
            </div>
          `).join("")}
        </div>
      </article>
    </div>
    <div class="method-note"><strong>M2 method:</strong> observed same-request state share adjusted by disclosed demographic tilts against national medians from the ZIP3 spine.</div>
  `;
}

function insightAffinityFor(stateCode, demo) {
  const lab = getIdeasLabData();
  const base = lab.stateSplit?.[stateCode];
  if (!base) return null;
  const adjusted = base.map(({ brand, pct }) => {
    if (pct === null || pct === undefined) return { brand, raw: null };
    let multiplier = 1;
    const tilts = lab.tilts?.[brand] || {};
    Object.entries(tilts).forEach(([field, per10]) => {
      const value = Number(demo[field]);
      const median = Number(lab.natlMedians?.[field]);
      if (Number.isFinite(value) && Number.isFinite(median)) {
        multiplier += ((value - median) / 10) * Number(per10) * 10;
      }
    });
    return { brand, raw: Math.max(0, Number(pct) * multiplier) };
  });
  const total = adjusted.reduce((sum, row) => sum + (row.raw || 0), 0) || 1;
  return adjusted.map((row) => ({ brand: row.brand, pct: row.raw === null ? null : (row.raw / total) * 100 }));
}

function renderInsightAffinityStack(affinity) {
  const rows = (affinity || []).filter((row) => row.pct !== null && row.pct !== undefined && row.pct >= 0.5);
  if (!rows.length) return `<p class="muted">No affinity model for this row.</p>`;
  return `
    <div class="insight-affinity-stack">
      ${rows.map((row) => `<i style="width:${Math.max(1, row.pct)}%;background:${insightBrandColor(row.brand)}" title="${escapeHtml(insightBrandLabel(row.brand))} ${Number(row.pct).toFixed(1)}%"></i>`).join("")}
    </div>
    <div class="insight-chart-legend compact">
      ${rows.filter((row) => row.pct >= 4).map((row) => `<span><i style="background:${insightBrandColor(row.brand)}"></i>${escapeHtml(insightBrandLabel(row.brand))} ${Number(row.pct).toFixed(0)}%</span>`).join("")}
    </div>
  `;
}

function renderMediaOwnerDirectoryModule() {
  const lab = getIdeasLabData();
  const owners = lab.mediaOwners?.owners || [];
  const types = ["all", ...new Set(owners.map((owner) => owner.type))];
  const selectedType = types.includes(app.selectedInsightOwnerType) ? app.selectedInsightOwnerType : "all";
  const rows = owners.filter((owner) => selectedType === "all" || owner.type === selectedType);
  const counts = owners.reduce((memo, owner) => {
    memo[owner.gambling_stance] = (memo[owner.gambling_stance] || 0) + 1;
    return memo;
  }, {});
  const conflicts = owners.filter((owner) => /CONFLICT|COMPETITOR/i.test(owner.fanduel_notes || "")).length;
  return `
    <div class="content-grid two">
      <article class="content-card">
        <div class="insight-lab-controls">
          <label>
            <span>Owner type</span>
            <select id="insightOwnerType">
              ${types.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(INSIGHT_OWNER_TYPE_LABELS[type] || type)}</option>`).join("")}
            </select>
          </label>
          <span class="pill status-review">authored - verify</span>
        </div>
        <div class="planning-readout compact">
          <article class="readout-item"><span>Owners</span><strong>${formatNumber(owners.length)}</strong></article>
          <article class="readout-item"><span>Accept restricted</span><strong>${formatNumber(counts.accepts_with_restrictions || 0)}</strong></article>
          <article class="readout-item"><span>Prohibit / exceptions</span><strong>${formatNumber((counts.prohibits || 0) + (counts.prohibits_with_exceptions || 0))}</strong></article>
          <article class="readout-item"><span>Conflict flags</span><strong>${formatNumber(conflicts)}</strong></article>
        </div>
        <div class="insight-owner-list">
          ${rows.slice(0, 12).map((owner) => `
            <div class="insight-owner-row">
              <strong>${escapeHtml(owner.name)}</strong>
              <span>${escapeHtml(INSIGHT_OWNER_TYPE_LABELS[owner.type] || owner.type)}</span>
              <em>${escapeHtml(INSIGHT_STANCE_LABELS[owner.gambling_stance] || owner.gambling_stance)}</em>
              ${/CONFLICT|COMPETITOR/i.test(owner.fanduel_notes || "") ? `<small>conflict flag</small>` : ""}
            </div>
          `).join("")}
        </div>
      </article>
      <article class="content-card">
        <h3>Measurement currencies</h3>
        <p>${escapeHtml(lab.mediaOwners?.status || "Working media-owner directory; verify before use.")}</p>
        <div class="insight-owner-list compact">
          ${(lab.mediaOwners?.measurement || []).map((row) => `
            <div class="insight-owner-row">
              <strong>${escapeHtml(row.name)}</strong>
              <span>${escapeHtml(row.role)}</span>
              <em>UK equivalent: ${escapeHtml(row.uk_equivalent)}</em>
            </div>
          `).join("")}
        </div>
        <div class="method-note"><strong>Use:</strong> planning choreography and research prioritisation only until partner-policy verification is complete.</div>
      </article>
    </div>
  `;
}

function insightTagQuery(query) {
  const text = String(query || "").toLowerCase();
  if (text.includes("promo") || text.includes("bonus") || text.includes("code")) return "offer intent";
  if (text.includes(" vs ") || text.includes("versus")) return "comparison";
  if (text.includes("app")) return "app intent";
  if (/(login|account)/.test(text)) return "existing user";
  if (/(nfl|nba|mlb|ncaa|super bowl|march)/.test(text)) return "sports moment";
  return "demand signal";
}

function renderInsightQueryRow(query) {
  const text = typeof query === "string" ? query : (query?.query || query?.title || JSON.stringify(query));
  return `<div class="insight-query-row"><span>${escapeHtml(text)}</span><em>${escapeHtml(insightTagQuery(text))}</em></div>`;
}

function getPaidSerpSummary() {
  const live = app.data?.searchAdsLive;
  if (live?.ad_records?.length) {
    const rows = live.ad_records
      .filter((row) => row.copy_status === "observed" && row.title && row.description)
      .map((row) => ({
        ...row,
        last_updated_time: row.retrieved_at,
        rank_group: row.rank_group ?? row.rank_absolute,
        requested_domain: row.target_domain
      }));
    const targets = (live.route_yield?.labs_paid_index?.per_target || []).map((target) => ({
      brand: target.brand,
      domain: target.domain,
      returned_rows: target.rows_returned,
      rows_with_copy: target.rows_with_copy
    }));
    return {
      targets,
      rows,
      sportsbookRows: rows.filter((row) => row.product === "Sportsbook"),
      fanDuelRows: rows.filter((row) => row.brand === "FanDuel"),
      totalRows: rows.length,
      latestObservedAt: live.provenance?.completed_at || "",
      economics: live.keyword_economics || [],
      provenance: live.provenance || {},
      zeroRowTargets: targets.filter((target) => !target.returned_rows)
    };
  }
  const targets = app.data?.paidSerp?.targets || [];
  const rows = targets.flatMap((target) => (target.paid_keywords || []).map((row) => ({
    ...row,
    brand: target.brand,
    requested_domain: target.domain
  })));
  const sportsbookRows = rows.filter((row) => {
    const text = `${row.keyword || ""} ${row.title || ""} ${row.description || ""} ${row.destination_url || ""}`.toLowerCase();
    return /(sportsbook|sports betting|place a bet|live betting|bet soccer|bonus bet|odds)/.test(text);
  });
  const fanDuelRows = rows.filter((row) => row.brand === "FanDuel");
  return {
    targets,
    rows,
    sportsbookRows,
    fanDuelRows,
    totalRows: rows.length,
    latestObservedAt: rows
      .map((row) => row.last_updated_time)
      .filter(Boolean)
      .sort()
      .at(-1) || app.data?.paidSerp?.generated_at || "",
    economics: [],
    provenance: {},
    zeroRowTargets: targets.filter((target) => !Number(target.retrieval?.returned_rows || 0))
  };
}

function renderPaidSerpObservation(row) {
  return `
    <div class="insight-query-row">
      <span><strong>${escapeHtml(row.brand || row.requested_domain || "Observed advertiser")}</strong> · ${escapeHtml(row.keyword || "keyword unavailable")}<small>${escapeHtml(row.title || "Paid result title unavailable")}</small></span>
      <em>rank ${escapeHtml(row.rank_group ?? "-")}</em>
    </div>
  `;
}

function renderSearchIdeasModule() {
  const lab = getIdeasLabData();
  const paidSerp = getPaidSerpSummary();
  const brands = Object.keys(lab.relatedQueries || {});
  const competitorOptions = brands.filter((brand) => brand !== "fanduel");
  const selectedBrand = competitorOptions.includes(app.selectedInsightQueryBrand) ? app.selectedInsightQueryBrand : competitorOptions[0];
  const ownQueries = lab.relatedQueries?.fanduel || [];
  const competitorQueries = lab.relatedQueries?.[selectedBrand] || [];
  return `
    <div class="content-grid three">
      <article class="content-card">
        <h3>FanDuel own demand</h3>
        <p>Real related-query language from the Trends pull. This is demand-side evidence only.</p>
        <div class="insight-query-list">${ownQueries.slice(0, 12).map(renderInsightQueryRow).join("")}</div>
      </article>
      <article class="content-card">
        <div class="insight-lab-controls">
          <label>
            <span>Conquest brand</span>
            <select id="insightQueryBrand">
              ${competitorOptions.map((brand) => `<option value="${escapeHtml(brand)}">${escapeHtml(insightBrandLabel(brand))}</option>`).join("")}
            </select>
          </label>
          <span class="pill status-client-safe">real related queries</span>
        </div>
        <div class="insight-query-list">${competitorQueries.slice(0, 12).map(renderInsightQueryRow).join("")}</div>
      </article>
      <article class="content-card">
        <h3>Paid SERP observations</h3>
        <p>${formatNumber(paidSerp.totalRows)} weekly provider observations are loaded; ${formatNumber(paidSerp.sportsbookRows.length)} are sportsbook-relevant in this cut.</p>
        <div class="insight-query-list">${paidSerp.sportsbookRows.slice(0, 6).map(renderPaidSerpObservation).join("") || `<div class="note-item">No sportsbook-relevant paid rows were observed in this provider snapshot.</div>`}</div>
        <div class="note-list compact-notes">
          <div class="note-item"><strong>Observed:</strong> the two sportsbook rows are DraftKings ads; FanDuel's 13 rows route to FDTVx streaming and are kept out of sportsbook conclusions.</div>
          <div class="note-item"><strong>Boundary:</strong> no rows were observed for BetMGM, Bet365 or Fanatics in this weekly domain snapshot. That is not proof of no activity.</div>
          <div class="note-item">This is ad-copy and ranking evidence only. It does not establish spend, targeting, campaign intent or efficiency.</div>
        </div>
      </article>
    </div>
  `;
}

function getSelectedPredictionOperator() {
  const data = app.data.predictionOperators;
  return (data?.operators || []).find((operator) => operator.operator_id === app.selectedPredictionOperator)
    || (data?.operators || [])[0]
    || null;
}

function predictionStateStatus(state, operator = getSelectedPredictionOperator()) {
  if (!state || !operator) return "state_matrix_missing";
  if (state.code === "DC") return "district_not_enumerated";
  if (operator.operator_id === "kalshi") return "nationwide_operator_claim";
  if (operator.operator_id === "polymarket_us") return "state_matrix_missing";
  if (app.selectedPredictionLens === "non_sports") return "all_50_reported";
  if ((operator.verified_sports_state_examples || []).includes(state.code)) return "verified_sports_example";
  if (["online", "online_and_retail"].includes(state.sportsbook)) return "sports_contracts_switch_off";
  return "reported_set_not_enumerated";
}

function predictionStatusMeta(status) {
  const rows = {
    nationwide_operator_claim: { color: "#dff6e9", short: "50", label: "operator claims nationwide access" },
    all_50_reported: { color: "#dff6e9", short: "50", label: "all 50 states reported" },
    verified_sports_example: { color: "#bde5cf", short: "LIVE", label: "explicitly named sports-contract example" },
    sports_contracts_switch_off: { color: "#fde7e3", short: "OFF", label: "sports contracts switch off where online sportsbook is legal" },
    reported_set_not_enumerated: { color: "#fff4df", short: "REP", label: "within reported non-sportsbook universe; not publicly enumerated" },
    state_matrix_missing: { color: "#edf2f6", short: "—", label: "public state matrix missing" },
    district_not_enumerated: { color: "#edf2f6", short: "D.C.", label: "50-state statement does not enumerate DC" }
  };
  return rows[status] || rows.state_matrix_missing;
}

function predictionStateExplanation(state, operator, status) {
  if (operator.operator_id === "polymarket_us") {
    return `${state.state}: CFTC DCM status is verified, but no current product-by-state Polymarket US matrix was found. This cell stays unenumerated.`;
  }
  if (operator.operator_id === "kalshi") {
    return `${state.state}: Kalshi's own statement says all 50 states. Treat that as an operator claim layered over federal DCM status; state disputes and contract-level restrictions still require review.`;
  }
  if (app.selectedPredictionLens === "non_sports") {
    return `${state.state}: Flutter reported financial, economic and commodities contracts in all 50 states. This is a product-reach statement, not sports availability or activation permission.`;
  }
  if (status === "verified_sports_example") {
    return `${state.state}: Flutter explicitly named ${state.state} among the 18 non-sportsbook states with sports contracts in Q1 2026.`;
  }
  if (status === "sports_contracts_switch_off") {
    return `${state.state}: the working state matrix marks online sportsbook live, and FanDuel says Predicts sports contracts cease where online sports betting becomes legal.`;
  }
  return `${state.state}: it fits the non-sportsbook indexing logic, but Flutter did not publish the full 18-state list. Do not mark this state live from inference.`;
}

function renderPredictionOperatorModule() {
  const data = app.data.predictionOperators;
  const lab = getIdeasLabData();
  const operator = getSelectedPredictionOperator();
  if (!data || !operator) return `<div class="note-item">Prediction-operator research layer is not loaded.</div>`;
  const states = (lab.states || []).filter((state) => INSIGHT_STATE_TILE_COORDS[state.code]);
  const size = 64;
  const gap = 6;
  const width = 12 * (size + gap);
  const height = 8 * (size + gap);
  const counts = {};
  const tiles = states.map((state) => {
    const [col, row] = INSIGHT_STATE_TILE_COORDS[state.code];
    const status = predictionStateStatus(state, operator);
    const meta = predictionStatusMeta(status);
    counts[status] = (counts[status] || 0) + 1;
    return `
      <g>
        <rect class="prediction-state-tile ${app.selectedPredictionState === state.code ? "is-selected" : ""}" data-prediction-state="${escapeHtml(state.code)}"
          x="${col * (size + gap)}" y="${row * (size + gap)}" width="${size}" height="${size}" rx="6" fill="${meta.color}">
          <title>${escapeHtml(state.state)}: ${escapeHtml(meta.label)}</title>
        </rect>
        <text x="${col * (size + gap) + size / 2}" y="${row * (size + gap) + 28}" text-anchor="middle">${escapeHtml(state.code)}</text>
        <text x="${col * (size + gap) + size / 2}" y="${row * (size + gap) + 47}" text-anchor="middle">${escapeHtml(meta.short)}</text>
      </g>`;
  }).join("");
  const selectedState = states.find((state) => state.code === app.selectedPredictionState) || states[0];
  const selectedStatus = predictionStateStatus(selectedState, operator);
  const selectedMeta = predictionStatusMeta(selectedStatus);
  const sources = (data.sources || []).filter((source) => (operator.source_ids || []).includes(source.source_id));
  return `
    <div class="insight-lab-panel prediction-operator-panel">
      <div class="insight-lab-controls">
        <label>
          <span>Predictions operator</span>
          <select id="predictionOperatorSelect">
            ${(data.operators || []).map((row) => `<option value="${escapeHtml(row.operator_id)}">${escapeHtml(row.label)}</option>`).join("")}
          </select>
        </label>
        ${operator.operator_id === "fanduel_predicts" ? `
          <label>
            <span>Contract lens</span>
            <select id="predictionLensSelect">
              <option value="sports">Sports contracts</option>
              <option value="non_sports">Financial / economic / commodities</option>
            </select>
          </label>` : ""}
        <span class="pill status-review">Predictions operators — separate set</span>
        <span class="pill status-working">WORKING RESEARCH</span>
      </div>
      <div class="note-item"><strong>Separation rule:</strong> ${escapeHtml(data.separation_rule)}</div>
      <div class="content-grid three">
        ${(data.operators || []).map((row) => `
          <article class="content-card ${row.operator_id === operator.operator_id ? "is-selected" : ""}">
            <h3>${escapeHtml(row.label)}</h3>
            <p>${escapeHtml(row.geographic_summary)}</p>
            <div class="pill-row"><span class="pill">${escapeHtml(row.indexing_model)}</span></div>
          </article>`).join("")}
      </div>
      <div class="content-grid two insight-heatmap-grid">
        <article class="content-card">
          <h3>${escapeHtml(operator.label)} geographic index</h3>
          <p>${escapeHtml(operator.regulatory_index)}</p>
          <div class="insight-state-tile-wrap">
            <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(operator.label)} state indexing map">${tiles}</svg>
            <div class="insight-chart-legend">
              <span><i style="background:#dff6e9"></i>nationwide/reporting claim</span>
              <span><i style="background:#bde5cf"></i>explicit sports example</span>
              <span><i style="background:#fff4df"></i>reported set, not enumerated</span>
              <span><i style="background:#fde7e3"></i>sportsbook-state switch-off</span>
              <span><i style="background:#edf2f6"></i>state matrix missing</span>
            </div>
          </div>
        </article>
        <article class="content-card">
          <span class="big-number">${escapeHtml(selectedState?.code || "-")}</span>
          <h3>${escapeHtml(selectedState?.state || "Select a state")}</h3>
          <p>${escapeHtml(predictionStateExplanation(selectedState, operator, selectedStatus))}</p>
          <div class="pill-row">
            <span class="pill status-review">${escapeHtml(selectedMeta.label)}</span>
            <span class="pill">${formatNumber(Object.values(counts).reduce((sum, value) => sum + value, 0))} mapped cells</span>
          </div>
          <div class="note-list compact-notes">
            ${sources.map((source) => `<div class="note-item"><strong>${escapeHtml(source.name)}</strong> — ${escapeHtml(source.supporting_excerpt)}. <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">Receipt</a></div>`).join("")}
            ${operator.optional_future_feed ? `<div class="note-item">${escapeHtml(operator.optional_future_feed)}</div>` : ""}
            <div class="note-item">${escapeHtml(data.legal_note)}</div>
          </div>
        </article>
      </div>
    </div>`;
}

function bindInsightsLabControls() {
  const predictionOperator = $("#predictionOperatorSelect");
  if (predictionOperator) {
    predictionOperator.value = app.selectedPredictionOperator;
    predictionOperator.addEventListener("change", (event) => {
      app.selectedPredictionOperator = event.target.value;
      renderInsights();
    });
  }
  const predictionLens = $("#predictionLensSelect");
  if (predictionLens) {
    predictionLens.value = app.selectedPredictionLens;
    predictionLens.addEventListener("change", (event) => {
      app.selectedPredictionLens = event.target.value;
      renderInsights();
    });
  }
  $$(".prediction-state-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      app.selectedPredictionState = tile.dataset.predictionState;
      renderInsights();
    });
  });
  const raceState = $("#insightRaceState");
  if (raceState) {
    raceState.value = app.selectedInsightRaceState;
    raceState.addEventListener("change", (event) => {
      app.selectedInsightRaceState = event.target.value;
      renderInsights();
    });
  }
  const raceMode = $("#insightRaceMode");
  if (raceMode) {
    raceMode.value = app.selectedInsightRaceMode;
    raceMode.addEventListener("change", (event) => {
      app.selectedInsightRaceMode = event.target.value;
      renderInsights();
    });
  }
  const heatMetric = $("#insightHeatMetric");
  if (heatMetric) {
    heatMetric.value = app.selectedInsightHeatMetric;
    heatMetric.addEventListener("change", (event) => {
      app.selectedInsightHeatMetric = event.target.value;
      renderInsights();
    });
  }
  $$(".insight-state-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      app.selectedInsightHeatState = tile.dataset.stateCode;
      app.selectedState = tile.dataset.stateCode;
      renderInsights();
    });
  });
  const zipState = $("#insightZipState");
  if (zipState) {
    if ([...zipState.options].some((option) => option.value === app.selectedInsightZipState)) {
      zipState.value = app.selectedInsightZipState;
    } else if (zipState.options.length) {
      app.selectedInsightZipState = zipState.options[0].value;
      zipState.value = app.selectedInsightZipState;
    }
    zipState.addEventListener("change", (event) => {
      app.selectedInsightZipState = event.target.value;
      renderInsights();
    });
  }
  const ownerType = $("#insightOwnerType");
  if (ownerType) {
    ownerType.value = app.selectedInsightOwnerType;
    ownerType.addEventListener("change", (event) => {
      app.selectedInsightOwnerType = event.target.value;
      renderInsights();
    });
  }
  const queryBrand = $("#insightQueryBrand");
  if (queryBrand) {
    if ([...queryBrand.options].some((option) => option.value === app.selectedInsightQueryBrand)) {
      queryBrand.value = app.selectedInsightQueryBrand;
    }
    queryBrand.addEventListener("change", (event) => {
      app.selectedInsightQueryBrand = event.target.value;
      renderInsights();
    });
  }
}

function getCreativeRecords() {
  return Array.isArray(app.data?.creativeLibrary?.records) ? app.data.creativeLibrary.records : [];
}

function getFilteredCreativeRecords() {
  const query = String(app.creativeQuery || "").trim().toLowerCase();
  const rangeStart = app.creativeStartDate || "1900-01-01";
  const rangeEnd = app.creativeEndDate || "2999-12-31";
  return getCreativeRecords().filter((record) => {
    const overlapsRange = String(record.start_date || "") <= rangeEnd && String(record.end_date || "2999-12-31") >= rangeStart;
    const matchesAdvertiser = app.creativeAdvertiser === "all" || record.advertiser === app.creativeAdvertiser;
    const matchesProduct = app.creativeProduct === "all" || record.product === app.creativeProduct;
    const matchesState = app.creativeState === "all"
      || (record.states || []).includes(app.creativeState)
      || (app.creativeState === "National" && (record.states || []).includes("National"));
    const haystack = `${record.advertiser} ${record.product} ${record.title} ${record.copy} ${record.message} ${record.strategy} ${(record.states || []).join(" ")}`.toLowerCase();
    return overlapsRange && matchesAdvertiser && matchesProduct && matchesState && (!query || haystack.includes(query));
  });
}

function creativeDaysLive(record) {
  const start = new Date(`${record.start_date}T00:00:00Z`).getTime();
  const end = new Date(`${record.end_date}T00:00:00Z`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
}

function creativeAdvertiserStats(records) {
  const advertisers = [...new Set(records.map((record) => record.advertiser))];
  return advertisers.map((advertiser) => {
    const rows = records.filter((record) => record.advertiser === advertiser);
    const executions = rows.reduce((sum, record) => sum + Number(record.variants || 1), 0);
    const products = [...new Set(rows.map((record) => record.product))];
    const messages = [...new Set(rows.map((record) => record.message))];
    const stateSpecific = rows.filter((record) => !(record.states || []).includes("National")).length;
    const averageClarity = rows.reduce((sum, record) => sum + Number(record.clarity || 0), 0) / Math.max(1, rows.length);
    const averageDistinctiveness = rows.reduce((sum, record) => sum + Number(record.distinctiveness || 0), 0) / Math.max(1, rows.length);
    const averageDays = rows.reduce((sum, record) => sum + creativeDaysLive(record), 0) / Math.max(1, rows.length);
    const offerShare = rows.filter((record) => record.offer).length / Math.max(1, rows.length);
    const rawScore = (
      averageClarity * 6
      + averageDistinctiveness * 5
      + Math.min(15, products.length * 7.5)
      + Math.min(15, executions / Math.max(1, rows.length) * 6)
      + Math.min(10, averageDays / 12)
      + Math.min(5, stateSpecific * 5)
    );
    const sampleConfidence = Math.min(1, executions / 4);
    const score = Math.round(rawScore * (0.65 + 0.35 * sampleConfidence));
    const topMessage = Object.entries(rows.reduce((memo, record) => {
      memo[record.message] = (memo[record.message] || 0) + Number(record.variants || 1);
      return memo;
    }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || "No dominant message";
    return {
      advertiser,
      rows,
      families: rows.length,
      executions,
      products,
      messages,
      stateSpecific,
      averageDays,
      offerShare,
      sampleConfidence,
      score: Math.min(100, score),
      topMessage
    };
  }).sort((a, b) => b.score - a.score || b.executions - a.executions);
}

function creativeStrategyTake(advertiser, stats) {
  const takes = {
    FanDuel: "Builds repeat behaviour around owned product mechanics: Home for Home Runs, Daily Dinger and Predicts product proof.",
    DraftKings: "Pairs very hard acquisition offers with celebrity reach and fast national creative refresh.",
    BetMGM: "Has the broadest role mix in this retained cut: acquisition, sport-specific utility, premium brand and loyalty.",
    "Fanatics Sportsbook": "Makes FanCash the connective tissue across sportsbook and casino, with unusually strong time-phased offers."
  };
  return takes[advertiser] || `${stats.topMessage} is the most repeated coded message in the selected evidence.`;
}

function creativeDateLabel(date) {
  if (!date) return "â€”";
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

function creativeChannelToggle() {
  return `
    <div class="creative-channel-toggle" role="group" aria-label="Creative channel">
      <span>Channel</span>
      <button type="button" data-creative-channel="meta" class="${app.creativeChannel === "meta" ? "is-active" : ""}" aria-pressed="${app.creativeChannel === "meta"}">Meta</button>
      <button type="button" data-creative-channel="search" class="${app.creativeChannel === "search" ? "is-active" : ""}" aria-pressed="${app.creativeChannel === "search"}">Search copy</button>
    </div>`;
}

function bindCreativeChannelToggle() {
  $$("[data-creative-channel]").forEach((button) => button.addEventListener("click", () => {
    app.creativeChannel = button.dataset.creativeChannel;
    app.creativeAdvertiser = "all";
    app.creativeProduct = "all";
    app.creativeState = "all";
    app.creativeQuery = "";
    app.selectedCreativeId = "";
    renderCreativeIntelligence();
  }));
}

function extractMonetaryOffers(text) {
  return [...new Set(String(text || "").match(/\$\s?\d[\d,]*(?:\.\d{1,2})?[Kk]?/g) || [])]
    .sort((a, b) => {
      const value = (amount) => Number(amount.replace(/[$,\sKk]/g, "")) * (/k/i.test(amount) ? 1000 : 1);
      return value(a) - value(b);
    });
}

function creativeThemeTags(record) {
  const text = `${record.title || ""} ${record.copy || ""} ${record.message || ""} ${record.strategy || ""}`.toLowerCase();
  const rules = [
    ["Roulette", /\broulette\b/],
    ["Slots", /\bslots?\b|\bspins?\b/],
    ["Cards / table games", /\bblackjack\b|\bpoker\b|\bcard games?\b|\btable games?\b/],
    ["Baseball", /\bbaseball\b|\bmlb\b|\bhome runs?\b|\bdinger\b/],
    ["Basketball", /\bbasketball\b|\bnba\b|\beuroleague\b/],
    ["Football", /\bfootball\b|\bnfl\b/],
    ["Soccer", /\bsoccer\b|\bgoals?\b/],
    ["Racing / motorsport", /\bracing\b|\bnascar\b|\bhorse\b/],
    ["Acquisition offer", /\bnew (?:customer|player)\b|\bsign-up\b|\bbonus\b|\bget \$|\bspend \$|\bbet \$/],
    ["Loyalty / rewards", /\bloyalty\b|\brewards?\b|\bfancash\b/],
    ["Product utility", /\bboost\b|\breset\b|\bpredicts\b|\blive betting\b|\bcash out\b/],
    ["Talent / creator", /\bcelebrity\b|\bcreator\b|\btalent\b|\bkevin hart\b/]
  ];
  const matches = rules.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
  return matches.length ? matches : ["General brand"];
}

function aggregateCreativeLabels(records, getter) {
  return Object.entries(records.reduce((memo, record) => {
    for (const label of getter(record)) memo[label] = (memo[label] || 0) + Number(record.variants || 1);
    return memo;
  }, {})).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function creativeExecutionText(record) {
  return `${record.title || ""} ${record.copy || record.description || ""}`;
}

function normaliseMetaCreativeForAnalysis(record) {
  return {
    ...record,
    channel: "Meta",
    body: record.copy || "",
    observed_date: record.end_date,
    source_label: `Meta library ${record.library_id || ""}`.trim()
  };
}

function normaliseSearchCreativeForAnalysis(row, index = 0) {
  const text = `${row.keyword || ""} ${row.title || ""} ${row.description || ""} ${row.destination_url || ""}`;
  const observedDate = String(row.last_updated_time || "").slice(0, 10);
  return {
    ...row,
    id: `search-${String(row.brand || "brand").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    advertiser: row.brand,
    channel: "Search",
    product: row.product || (/(sportsbook|sports betting|place a bet|live betting|bet soccer|bonus bet|odds)/i.test(text) ? "Sportsbook" : "Streaming"),
    body: row.description || "",
    copy: row.description || "",
    format: "Responsive search ad",
    offer: /\$|\bfree\b|\bbonus\b/i.test(`${row.title || ""} ${row.description || ""}`),
    variants: 1,
    start_date: observedDate,
    end_date: observedDate,
    observed_date: observedDate,
    source_label: `DataForSEO Â· ${row.keyword || "query unavailable"}`
  };
}

function monetaryValue(amount) {
  if (!amount) return null;
  const numeric = Number(String(amount).replace(/[$,\sKk]/g, ""));
  return Number.isFinite(numeric) ? numeric * (/k/i.test(amount) ? 1000 : 1) : null;
}

function creativeOfferEconomics(record) {
  const text = creativeExecutionText(record);
  const amounts = extractMonetaryOffers(text);
  if (!amounts.length && !/\bfree\b|\bbonuses?\b|\bmatch\b|\bspins?\b/i.test(text)) return null;
  const entryMatch = text.match(/\b(?:bet|spend|wager|deposit|play)\s*(\$\s?\d[\d,]*(?:\.\d{1,2})?[Kk]?)/i);
  const entry = entryMatch?.[1]?.replace(/\s/g, "") || "";
  const rewardCandidates = amounts.filter((amount) => amount.replace(/\s/g, "") !== entry);
  const reward = rewardCandidates.sort((a, b) => (monetaryValue(b) || 0) - (monetaryValue(a) || 0))[0] || (entry ? "" : amounts.at(-1)) || "";
  const entryValue = monetaryValue(entry);
  const rewardValue = monetaryValue(reward);
  const ratio = entryValue && rewardValue ? rewardValue / entryValue : null;
  let mechanic = "Promotional proposition";
  if (/bonus bets?/i.test(text)) mechanic = "Bonus bets";
  else if (/\bbonuses?\b/i.test(text)) mechanic = "Instant bonuses";
  else if (/bet resets?/i.test(text)) mechanic = "Bet resets";
  else if (/fancash.*match|match.*fancash/i.test(text)) mechanic = "Matched FanCash";
  else if (/casino credits?/i.test(text)) mechanic = "Casino credits";
  else if (/spins?/i.test(text)) mechanic = "Free spins";
  else if (/jackpot/i.test(text)) mechanic = "Jackpot";
  else if (/sign-?up bonus/i.test(text)) mechanic = "Sign-up bonus";
  else if (/\bfree\b/i.test(text) && !amounts.length) mechanic = "Free access / play";
  const eligibility = [
    /new customers? only/i.test(text) ? "New customers only" : "",
    /\bdaily\b/i.test(text) ? "Daily action required" : "",
    /\bten[- ]day\b/i.test(text) ? "Ten-day window" : "",
    /\barkansas\b|\bhey ar\b/i.test(text) ? "Arkansas-specific" : "",
    /\ball 50 states\b/i.test(text) ? "50-state claim" : ""
  ].filter(Boolean);
  return {
    entry: entry || "â€”",
    reward: reward || (/\bfree\b/i.test(text) ? "Free" : "Not stated"),
    ratio,
    mechanic,
    eligibility: eligibility.join(" Â· ") || "Not stated in retained copy",
    amounts
  };
}

function creativeClaimPressure(record) {
  const text = creativeExecutionText(record);
  const flags = [];
  const add = (points, label, evidence) => flags.push({ points, label, evidence });
  if (/#1|\bbest\b/i.test(text)) add(18, "Superiority claim", "Needs current, relevant substantiation.");
  if (/\binstant(?:ly)?\b/i.test(text)) add(14, "Immediacy", "Timing and fulfilment conditions must be unambiguous.");
  if (/\bfree\b/i.test(text)) add(11, "Free claim", "Any material cost or eligibility condition must remain prominent.");
  if (/\ball 50 states\b|\bnational\b/i.test(text)) add(17, "Broad geography", "Product availability can differ materially by state.");
  if (/\$\s?\d/i.test(text)) add(10, "Hard value claim", "Stake, reward form and withdrawal limitations need clear terms.");
  if (/\bjackpot\b|\$\s?\d[\d,]*[Kk]\b/i.test(text)) add(13, "Large-prize salience", "Probability, qualification and prize conditions need scrutiny.");
  if (/\bnew (?:customers?|players?)\b/i.test(text)) add(7, "Acquisition eligibility", "The retained copy must keep who qualifies clear.");
  if (/\bbonuses?\b|\bboost\b|\bmatch\b|\bcredits?\b|\bspins?\b/i.test(text)) add(8, "Promotional mechanic", "Mechanic value may differ from cash value.");
  if (/\burgent\b|\btoday\b|\bnow\b|\blast chance\b/i.test(text)) add(7, "Urgency", "Avoid pressure that could undermine safer-gambling expectations.");
  if ((record.states || []).some((state) => state !== "National") || /\barkansas\b|\bhey ar\b/i.test(text)) add(8, "Local activation", "State licence, product and disclaimer treatment must align.");
  if (!/\b21\+\b|\bresponsible\b|\bgambler\b|\bterms apply\b/i.test(text) && /sportsbook|casino|bet |bonus|spins?|jackpot/i.test(text)) {
    add(8, "Safeguards not visible", "The retained card or snippet may omit supers or landing-page terms; verify the complete execution.");
  }
  const qualifyingClarity = /new customers? only|terms apply|bet \$|spend \$|deposit \$/i.test(text) ? 6 : 0;
  const score = Math.max(0, Math.min(100, flags.reduce((sum, flag) => sum + flag.points, 0) - qualifyingClarity));
  const status = score >= 50 ? "Close to the wire" : score >= 36 ? "Needs substantiation" : "Lower claim pressure";
  return { score, status, flags: flags.sort((a, b) => b.points - a.points) };
}

function creativeSyntheticOutcomes(record) {
  const seedText = `${record.channel}|${record.id}|${record.advertiser}|${record.title}`;
  let seed = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    seed ^= seedText.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  const fraction = (offset) => {
    const value = Math.sin((seed >>> 0) + offset * 99991) * 10000;
    return value - Math.floor(value);
  };
  const isSearch = record.channel === "Search";
  const impressions = Math.round((isSearch ? 50000 : 900000) + fraction(1) * (isSearch ? 420000 : 5700000));
  const ctr = (isSearch ? 3.8 : 0.65) + fraction(2) * (isSearch ? 7.4 : 1.45);
  const conversionRate = (isSearch ? 5.5 : 1.8) + fraction(3) * (isSearch ? 9 : 5.2);
  const cpa = (isSearch ? 24 : 39) + fraction(4) * (isSearch ? 58 : 86);
  const lift = -2 + fraction(5) * 16;
  const days = record.channel === "Meta" ? creativeDaysLive(record) : 1;
  const fatigue = Math.min(92, Math.round(12 + days * 0.72 + fraction(6) * 28));
  const incrementalFtd = Math.max(0, Math.round(impressions * (ctr / 100) * (conversionRate / 100) * Math.max(0, lift) / 100));
  return { impressions, ctr, conversionRate, cpa, lift, fatigue, incrementalFtd };
}

function creativeTimelineRows(records) {
  const startMs = new Date(`${app.creativeStartDate}T00:00:00Z`).getTime();
  const endMs = new Date(`${app.creativeEndDate}T00:00:00Z`).getTime();
  const span = Math.max(86400000, endMs - startMs);
  return [...records].sort((a, b) => String(b.start_date).localeCompare(String(a.start_date))).slice(0, 14).map((record) => {
    const recordStart = new Date(`${record.start_date}T00:00:00Z`).getTime();
    const recordEnd = new Date(`${record.end_date}T00:00:00Z`).getTime();
    const left = Math.max(0, Math.min(100, (recordStart - startMs) / span * 100));
    const width = record.channel === "Search"
      ? 1.2
      : Math.max(1.2, Math.min(100 - left, (recordEnd - recordStart + 86400000) / span * 100));
    return { record, left, width };
  });
}

function creativeBriefFindingOptions(records) {
  return [...records]
    .sort((a, b) => creativeClaimPressure(b).score - creativeClaimPressure(a).score)
    .slice(0, 12)
    .map((record) => ({
      value: record.id,
      label: `${record.advertiser}: ${record.title}`,
      record
    }));
}

function buildCreativeTestBrief(record, channel) {
  const economics = creativeOfferEconomics(record);
  const pressure = creativeClaimPressure(record);
  const outcomes = creativeSyntheticOutcomes(record);
  const variable = app.creativeBriefVariable;
  const state = app.creativeBriefState;
  const kpi = app.creativeBriefKpi;
  const variablePlans = {
    offer: economics
      ? `Hold the visual and audience constant; test a transparent ${economics.mechanic.toLowerCase()} against a no-offer product-utility control.`
      : "Hold the visual and audience constant; test a clearly bounded introductory offer against a no-offer product-utility control.",
    hook: `Hold offer, format and CTA constant; test a direct ${record.product || "product"} utility hook against an event- or emotion-led hook.`,
    format: channel === "Meta"
      ? "Hold hook, offer and CTA constant; compare 9:16 creator video with a 4:5 product-proof execution."
      : "Hold intent, offer and landing page constant; compare three genuinely distinct RSA headline systems without over-pinning.",
    proof: "Hold hook, offer and format constant; compare specific product proof with broad brand language.",
    cta: "Hold hook, offer and format constant; compare a direct action CTA with a lower-friction learn/explore CTA."
  };
  const measurement = channel === "Meta"
    ? "Prospecting-only conversion-lift or matched-state holdout; keep retargeting out of the read."
    : "Separate brand, generic and competitor intent; use a matched-state or on/off incrementality test and total business conversions.";
  return {
    id: `CTB-${String(Date.now()).slice(-6)}`,
    createdAt: getDemoToday(),
    channel,
    sourceRecord: record.id,
    sourceTitle: `${record.advertiser}: ${record.title}`,
    hypothesis: `${record.advertiser}'s observed execution suggests that ${variable} may change response. FanDuel will test the variable without assuming the competitor execution works.`,
    design: variablePlans[variable],
    audience: `${state} eligible ${record.product || "product"} prospects; suppress existing high-value customers and ineligible audiences.`,
    kpi,
    measurement,
    variants: channel === "Meta" ? 3 : 3,
    decisionRule: `Run through the pre-set learning window; do not stop before minimum sample. Scale only if ${kpi} improves without higher claim pressure or weaker downstream value.`,
    guardrails: `${pressure.status} (${pressure.score}/100) on the source copy. Legal review, state availability, 21+ treatment, responsible-gaming language and full offer terms are launch gates.`,
    syntheticContext: `Demo-only model suggests ${outcomes.lift.toFixed(1)}% incremental lift, ${formatCurrency(outcomes.cpa)} CPA and ${outcomes.fatigue}/100 fatigue. These values illustrate the workflow and cannot justify spend.`
  };
}

function renderCreativeAdvancedModules(records, channel) {
  const timeline = creativeTimelineRows(records);
  const offerGroups = new Map();
  for (const record of records) {
    const economics = creativeOfferEconomics(record);
    if (!economics) continue;
    const key = [record.advertiser, economics.entry, economics.reward, economics.mechanic, economics.eligibility].join("|");
    const existing = offerGroups.get(key);
    if (existing) {
      existing.observations += Number(record.variants || 1);
    } else {
      offerGroups.set(key, { record, economics, observations: Number(record.variants || 1) });
    }
  }
  const offers = [...offerGroups.values()];
  const claims = records.map((record) => ({ record, pressure: creativeClaimPressure(record) }))
    .sort((a, b) => b.pressure.score - a.pressure.score).slice(0, 8);
  const outcomes = records.map((record) => ({ record, outcomes: creativeSyntheticOutcomes(record) }))
    .sort((a, b) => b.outcomes.lift - a.outcomes.lift).slice(0, 8);
  const findingOptions = creativeBriefFindingOptions(records);
  if (!findingOptions.some((option) => option.value === app.creativeBriefFinding)) {
    app.creativeBriefFinding = findingOptions[0]?.value || "";
  }
  const generated = app.creativeGeneratedBrief?.channel === channel ? app.creativeGeneratedBrief : null;
  return `
    <section class="content-band creative-timeline-panel">
      <div class="panel-heading"><div><p class="eyebrow">Launch and persistence timeline</p><h2>${channel === "Meta" ? "When creative entered, refreshed and stayed visible" : "When paid-search copy was observed"}</h2></div><span class="status status-client-safe">${channel === "Meta" ? "public visibility" : "provider observations"}</span></div>
      <p class="creative-section-intro">${channel === "Meta" ? "Bars show retained first-to-last visibility, not continuous delivery. Short repeat executions can indicate refresh; long bars can indicate persistence." : "Markers show the latest weekly observation retained by DataForSEO. They do not establish campaign start or end dates."}</p>
      <div class="creative-timeline-axis"><span>${escapeHtml(creativeDateLabel(app.creativeStartDate))}</span><i></i><span>${escapeHtml(creativeDateLabel(app.creativeEndDate))}</span></div>
      <div class="creative-timeline-list">
        ${timeline.map(({ record, left, width }) => `
          <div class="creative-timeline-row">
            <div><strong>${escapeHtml(record.advertiser)}</strong><span>${escapeHtml(record.title)}</span></div>
            <i><b class="${record.channel === "Search" ? "is-observation" : ""}" style="left:${left.toFixed(2)}%;width:${width.toFixed(2)}%"></b></i>
            <small>${record.channel === "Search" ? "observed" : `${creativeDaysLive(record)}d`}</small>
          </div>`).join("") || `<div class="empty-state">No timeline evidence matches this filter.</div>`}
      </div>
    </section>

    <section class="content-band creative-economics-panel">
      <div class="panel-heading"><div><p class="eyebrow">Offer economics</p><h2>Entry, stated reward and qualification mechanics</h2></div><span class="status status-working">copy-derived</span></div>
      <p class="creative-section-intro">Ratios compare stated headline value with stated entry value. They are not expected value: wagering, withdrawal, expiry and qualification terms can materially change the economics.</p>
      <div class="creative-economics-table">
        <div class="creative-economics-head"><span>Firm / proposition</span><span>Entry</span><span>Stated reward</span><span>Headline multiple</span><span>Mechanic</span><span>Eligibility visible</span></div>
        ${offers.map(({ record, economics, observations }) => `
          <div class="creative-economics-row">
            <span><strong>${escapeHtml(record.advertiser)}</strong><small>${escapeHtml(record.title)}${observations > 1 ? ` Â· ${formatNumber(observations)} observations` : ""}</small></span>
            <b>${escapeHtml(economics.entry)}</b>
            <b>${escapeHtml(economics.reward)}</b>
            <em>${economics.ratio ? `${economics.ratio.toFixed(economics.ratio >= 10 ? 0 : 1)}Ã—` : "â€”"}</em>
            <span>${escapeHtml(economics.mechanic)}</span>
            <span>${escapeHtml(economics.eligibility)}</span>
          </div>`).join("") || `<div class="empty-state">No offer economics match this filter.</div>`}
      </div>
    </section>

    <section class="content-band creative-claims-panel">
      <div class="panel-heading"><div><p class="eyebrow">Claims-pressure review</p><h2>How close to the wire does the retained copy go?</h2></div><span class="status status-working">not a legal verdict</span></div>
      <p class="creative-section-intro">This triage highlights language likely to attract legal, platform or responsible-gaming scrutiny. A high score means â€œreview the complete execution closely,â€ not â€œthe ad is non-compliant.â€ Public cards and search snippets may omit supers and landing-page terms.</p>
      <div class="creative-claims-list">
        ${claims.map(({ record, pressure }) => `
          <button type="button" data-creative-claim-id="${escapeHtml(record.id)}">
            <span class="creative-claim-score ${pressure.score >= 50 ? "is-high" : pressure.score >= 36 ? "is-medium" : "is-low"}">${pressure.score}</span>
            <div><strong>${escapeHtml(record.advertiser)} Â· ${escapeHtml(record.title)}</strong><small>${escapeHtml(pressure.flags.slice(0, 3).map((flag) => flag.label).join(" Â· ") || "No material trigger in retained copy")}</small></div>
            <em>${escapeHtml(pressure.status)}</em>
          </button>`).join("") || `<div class="empty-state">No claims are available for this filter.</div>`}
      </div>
      <div id="creativeClaimDetail" class="creative-claim-detail" aria-live="polite"><p>Select an execution to inspect why it drew scrutiny.</p></div>
    </section>

    <section class="content-band creative-synthetic-panel">
      <div class="panel-heading"><div><p class="eyebrow">Synthetic performance connection</p><h2>What this workflow looks like with outcome data attached</h2></div><span class="status status-synthetic">demo data only</span></div>
      <p class="creative-section-intro"><strong>None of these performance values are observed.</strong> They are deterministic synthetic values designed to demonstrate lift, CPA, fatigue and incremental-FTD decisions without implying competitor effectiveness.</p>
      <div class="creative-outcome-grid">
        ${outcomes.map(({ record, outcomes: result }) => `
          <article>
            <header><span>${escapeHtml(record.advertiser)}</span><em>${escapeHtml(record.channel)}</em></header>
            <h3>${escapeHtml(record.title)}</h3>
            <div><span>Incremental lift</span><strong>${result.lift >= 0 ? "+" : ""}${result.lift.toFixed(1)}%</strong></div>
            <div><span>CPA</span><strong>${formatCurrency(result.cpa)}</strong></div>
            <div><span>Fatigue</span><strong>${result.fatigue}/100</strong></div>
            <div><span>Incremental FTD</span><strong>${formatNumber(result.incrementalFtd)}</strong></div>
            <i><b style="width:${Math.max(2, Math.min(100, result.fatigue))}%"></b></i>
          </article>`).join("") || `<div class="empty-state">No synthetic outcome rows match this filter.</div>`}
      </div>
    </section>

    <section class="content-band creative-brief-builder">
      <div class="panel-heading"><div><p class="eyebrow">Governed test-brief generator</p><h2>Turn an observed pattern into a testâ€”not an assumption</h2></div><span class="status status-working">canon unchanged</span></div>
      <div class="creative-brief-controls">
        <label><span>Source finding</span><select id="creativeBriefFinding">${findingOptions.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join("")}</select></label>
        <label><span>Variable</span><select id="creativeBriefVariable"><option value="offer">Offer</option><option value="hook">Hook</option><option value="format">Format / RSA system</option><option value="proof">Product proof</option><option value="cta">CTA</option></select></label>
        <label><span>Test state</span><select id="creativeBriefState">${["NJ", "PA", "MI", "NC", "AZ", "CO"].map((state) => `<option value="${state}">${state}</option>`).join("")}</select></label>
        <label><span>Primary KPI</span><select id="creativeBriefKpi">${["Incremental FTD", "Incremental NGR", "Qualified registration", "Conversion lift"].map((kpi) => `<option value="${escapeHtml(kpi)}">${escapeHtml(kpi)}</option>`).join("")}</select></label>
        <button type="button" class="primary-action" data-creative-generate-brief>Generate test brief</button>
      </div>
      <div id="creativeBriefOutput" class="creative-brief-output">
        ${generated ? renderCreativeBriefOutput(generated) : `<div class="empty-state"><h3>No brief generated yet</h3><p>Choose an observed execution and isolate one variable. Synthetic outcomes may illustrate the workflow but cannot approve the test.</p></div>`}
      </div>
    </section>`;
}

function renderCreativeDeepDive(records, channel) {
  return `
    <details class="creative-deep-dive">
      <summary>
        <span><strong>Open deeper analysis</strong><small>Timeline, offer economics, claim pressure, synthetic workflow and governed test brief</small></span>
        <em>${channel === "Meta" ? "5 analytical modules" : "5 analytical modules Â· includes clearly marked demo outcomes"}</em>
      </summary>
      <div class="creative-deep-dive-body">${renderCreativeAdvancedModules(records, channel)}</div>
    </details>`;
}

function renderMetaCreativeLibrary(records) {
  return `
    <section class="content-band creative-library-panel creative-meta-moneyshot">
      <div class="panel-heading">
        <div><p class="eyebrow">Public creative library</p><h2>${formatNumber(records.length)} retained creative families</h2></div>
        <span class="status status-client-safe">public evidence</span>
      </div>
      <p class="creative-section-intro">The executions come first. Open a card for the retained copy, public identifier, visibility period and coded strategic read.</p>
      <div class="creative-library-grid">
        ${records.map((record) => `
          <button type="button" class="creative-library-card" data-creative-id="${escapeHtml(record.id)}">
            <div class="creative-card-visual"><img src="${escapeHtml(record.image)}" loading="lazy" alt="${escapeHtml(`${record.advertiser}: ${record.title}`)}"><span>${escapeHtml(record.advertiser)}</span><small>${escapeHtml(record.format)}</small></div>
            <div class="creative-card-body">
              <p>${escapeHtml(record.product)} Â· ${escapeHtml((record.states || []).join(", "))}</p>
              <h3>${escapeHtml(record.title)}</h3>
              <span>${escapeHtml(record.message)}</span>
              <footer><small>Started ${escapeHtml(creativeDateLabel(record.start_date))}</small><b>${formatNumber(record.variants || 1)} ${Number(record.variants || 1) === 1 ? "execution" : "executions"}</b></footer>
            </div>
          </button>`).join("") || `<div class="empty-state creative-library-empty"><h3>No retained creative matches</h3><p>Widen the period or remove a product, firm or state filter.</p></div>`}
      </div>
    </section>`;
}

function renderCreativeBriefOutput(brief) {
  return `
    <article>
      <header><div><span>${escapeHtml(brief.id)} Â· ${escapeHtml(brief.channel)}</span><h3>${escapeHtml(brief.sourceTitle)}</h3></div><span class="status status-review">draft Â· approval required</span></header>
      <div class="creative-brief-grid">
        <div><span>Hypothesis</span><p>${escapeHtml(brief.hypothesis)}</p></div>
        <div><span>Single-variable design</span><p>${escapeHtml(brief.design)}</p></div>
        <div><span>Audience</span><p>${escapeHtml(brief.audience)}</p></div>
        <div><span>Measurement</span><p>${escapeHtml(brief.measurement)}</p></div>
        <div><span>Decision rule</span><p>${escapeHtml(brief.decisionRule)}</p></div>
        <div><span>Launch guardrails</span><p>${escapeHtml(brief.guardrails)}</p></div>
      </div>
      <div class="creative-brief-synthetic"><strong>Synthetic contextâ€”not approval evidence</strong><span>${escapeHtml(brief.syntheticContext)}</span></div>
      <footer><span>${formatNumber(brief.variants)} variants Â· primary KPI: ${escapeHtml(brief.kpi)}</span><button type="button" class="small-action" data-creative-copy-brief>Copy brief</button></footer>
    </article>`;
}

function bindCreativeAdvancedModules(records, channel) {
  const findingOptions = creativeBriefFindingOptions(records);
  const setSelectValue = (selector, value) => {
    const element = $(selector);
    if (element && [...element.options].some((option) => option.value === value)) element.value = value;
  };
  setSelectValue("#creativeBriefFinding", app.creativeBriefFinding);
  setSelectValue("#creativeBriefVariable", app.creativeBriefVariable);
  setSelectValue("#creativeBriefState", app.creativeBriefState);
  setSelectValue("#creativeBriefKpi", app.creativeBriefKpi);
  $("#creativeBriefFinding")?.addEventListener("change", (event) => { app.creativeBriefFinding = event.target.value; });
  $("#creativeBriefVariable")?.addEventListener("change", (event) => { app.creativeBriefVariable = event.target.value; });
  $("#creativeBriefState")?.addEventListener("change", (event) => { app.creativeBriefState = event.target.value; });
  $("#creativeBriefKpi")?.addEventListener("change", (event) => { app.creativeBriefKpi = event.target.value; });
  $$("[data-creative-claim-id]").forEach((button) => button.addEventListener("click", () => {
    const record = records.find((row) => row.id === button.dataset.creativeClaimId);
    const pressure = record ? creativeClaimPressure(record) : null;
    const detail = $("#creativeClaimDetail");
    if (!record || !pressure || !detail) return;
    detail.innerHTML = `
      <div><span class="creative-claim-score ${pressure.score >= 50 ? "is-high" : pressure.score >= 36 ? "is-medium" : "is-low"}">${pressure.score}</span><div><strong>${escapeHtml(record.advertiser)} Â· ${escapeHtml(record.title)}</strong><small>${escapeHtml(pressure.status)} Â· triage only</small></div></div>
      <blockquote>${escapeHtml(record.body || record.copy || "")}</blockquote>
      <ul>${pressure.flags.map((flag) => `<li><strong>${escapeHtml(flag.label)}</strong><span>${escapeHtml(flag.evidence)}</span></li>`).join("") || "<li>No material triggers found in the retained copy.</li>"}</ul>`;
  }));
  $("[data-creative-generate-brief]")?.addEventListener("click", () => {
    const selectedId = $("#creativeBriefFinding")?.value || app.creativeBriefFinding;
    app.creativeBriefFinding = selectedId;
    const record = findingOptions.find((option) => option.value === selectedId)?.record;
    if (!record) return;
    app.creativeGeneratedBrief = buildCreativeTestBrief(record, channel);
    const output = $("#creativeBriefOutput");
    if (output) output.innerHTML = renderCreativeBriefOutput(app.creativeGeneratedBrief);
    bindCreativeBriefCopy();
  });
  bindCreativeBriefCopy();
}

function bindCreativeBriefCopy() {
  $("[data-creative-copy-brief]")?.addEventListener("click", async (event) => {
    const brief = app.creativeGeneratedBrief;
    if (!brief) return;
    const text = [
      `${brief.id} â€” ${brief.sourceTitle}`,
      `Hypothesis: ${brief.hypothesis}`,
      `Design: ${brief.design}`,
      `Audience: ${brief.audience}`,
      `KPI: ${brief.kpi}`,
      `Measurement: ${brief.measurement}`,
      `Decision rule: ${brief.decisionRule}`,
      `Guardrails: ${brief.guardrails}`,
      `Synthetic context: ${brief.syntheticContext}`
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      event.currentTarget.textContent = "Copied";
    } catch {
      event.currentTarget.textContent = "Copy unavailable";
    }
  });
}

function getFilteredPaidSerpRows() {
  const query = String(app.creativeQuery || "").trim().toLowerCase();
  const rangeStart = app.creativeStartDate || "1900-01-01";
  const rangeEnd = app.creativeEndDate || "2999-12-31";
  return getPaidSerpSummary().rows.filter((row) => {
    const observedDate = String(row.last_updated_time || "").slice(0, 10);
    const text = `${row.brand} ${row.keyword} ${row.title} ${row.description} ${row.destination_url}`.toLowerCase();
    const product = row.product || (/(sportsbook|sports betting|place a bet|live betting|bet soccer|bonus bet|odds)/.test(text) ? "Sportsbook" : "Streaming");
    return observedDate >= rangeStart
      && observedDate <= rangeEnd
      && (app.creativeAdvertiser === "all" || row.brand === app.creativeAdvertiser)
      && (app.creativeProduct === "all" || product === app.creativeProduct)
      && (!query || text.includes(query));
  });
}

function renderSearchCreativeIntelligence(container) {
  const paidSerp = getPaidSerpSummary();
  const signalSearch = app.data?.signalSearch;
  const rows = getFilteredPaidSerpRows();
  const brands = [...new Set(paidSerp.targets.map((target) => target.brand))];
  const products = [...new Set(paidSerp.rows.map((row) => row.product).filter(Boolean))].sort();
  const observedBrands = [...new Set(rows.map((row) => row.brand))];
  const sportsbookRows = rows.filter((row) => row.product === "Sportsbook" || /(sportsbook|sports betting|place a bet|live betting|bet soccer|bonus bet|odds)/i.test(`${row.title} ${row.description} ${row.destination_url}`));
  const moneyRows = rows.map((row) => ({
    ...row,
    amounts: extractMonetaryOffers(`${row.title} ${row.description}`)
  })).filter((row) => row.amounts.length);
  const analysisRecords = rows.map(normaliseSearchCreativeForAnalysis);
  const uniqueCopy = [...new Map(rows.map((row) => [`${row.title}|${row.description}`, row])).values()];
  const freeRows = rows.filter((row) => /\bfree\b/i.test(`${row.title} ${row.description}`));
  const economicsByKeyword = new Map((paidSerp.economics || []).map((row) => [String(row.keyword || "").toLowerCase(), row]));
  const intentGroups = Object.entries(rows.reduce((memo, row) => {
    const query = String(row.keyword || "").toLowerCase();
    const label = /\b(fanduel|draftkings|betmgm|fanatics|bet365)\b/.test(query)
      ? "Brand / conquest"
      : /\b(nfl|nba|mlb|football|basketball|soccer|league)\b/.test(query)
        ? "Sport / event"
        : /\bpromo|bonus|offer|code\b/.test(query)
          ? "Offer"
          : "Generic category";
    memo[label] = (memo[label] || 0) + 1;
    return memo;
  }, {})).sort((a, b) => b[1] - a[1]);
  const themes = aggregateCreativeLabels(analysisRecords, creativeThemeTags).slice(0, 8);
  const destinationGroups = Object.entries(rows.reduce((memo, row) => {
    let label = "Other landing page";
    if (/watch\/video|fdtvx/i.test(row.destination_url || "")) label = "FDTVx streaming";
    else if (/sportsbook/i.test(row.destination_url || "")) label = "Sportsbook";
    memo[label] = (memo[label] || 0) + 1;
    return memo;
  }, {})).sort((a, b) => b[1] - a[1]);

  container.innerHTML = `
    <section class="creative-hero">
      <div>
        <p class="eyebrow">Creative intelligence Â· DataForSEO paid SERP</p>
        <h2>Compare the copy competitors use when demand becomes explicit.</h2>
        <p>Observed paid-search titles, descriptions, queries, rankings and destinations from TAU Signal. Use this view to inspect offers, intent matching and landing-page strategyâ€”not to infer spend or effectiveness.</p>
        ${creativeChannelToggle()}
      </div>
      <div class="creative-hero-proof">
        <strong>${formatNumber(paidSerp.totalRows)}</strong>
        <span>observed rows</span>
        <small>latest ${escapeHtml(creativeDateLabel(String(paidSerp.latestObservedAt).slice(0, 10)))}</small>
      </div>
    </section>

    <section class="creative-filter-panel content-band">
      <div class="creative-filter-grid creative-filter-grid-search">
        <label><span>From</span><input id="creativeStartDate" type="date" value="${escapeHtml(app.creativeStartDate)}" max="${escapeHtml(app.creativeEndDate)}"></label>
        <label><span>To</span><input id="creativeEndDate" type="date" value="${escapeHtml(app.creativeEndDate)}" min="${escapeHtml(app.creativeStartDate)}"></label>
        <label><span>Firm</span><select id="creativeAdvertiser"><option value="all">All firms</option>${brands.map((brand) => `<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`).join("")}</select></label>
        <label><span>Product / role</span><select id="creativeProduct"><option value="all">All roles</option>${products.map((product) => `<option value="${escapeHtml(product)}">${escapeHtml(product)}</option>`).join("")}</select></label>
        <label class="creative-search"><span>Search copy or query</span><input id="creativeSearch" type="search" value="${escapeHtml(app.creativeQuery)}" placeholder="Bonus, free, soccer, Arkansasâ€¦"></label>
        <button class="small-action" type="button" data-creative-reset>Reset</button>
      </div>
      <p class="creative-filter-boundary"><strong>Observed copy is not campaign performance.</strong> This US DataForSEO pull establishes wording, query, destination and ranking only. ${formatNumber(paidSerp.zeroRowTargets.length)} checked firms returned zero paid-index rows; that does not prove inactivity.</p>
    </section>

    <section class="content-band creative-library-panel creative-search-moneyshot">
      <div class="panel-heading"><div><p class="eyebrow">Observed search copy</p><h2>${formatNumber(rows.length)} native paid-search observations</h2></div><span class="status status-client-safe">DataForSEO Â· observed</span></div>
      <p class="creative-section-intro">The ad itself comes first. Each card keeps query, product, rank and keyword economics attached so copy can be judged against the intent it answered.</p>
      <div class="search-copy-grid">
        ${rows.map((row) => {
          const economics = economicsByKeyword.get(String(row.keyword || "").toLowerCase());
          const hostname = (() => { try { return new URL(row.destination_url).hostname; } catch { return row.display_url || row.target_domain || "Destination unavailable"; } })();
          return `
          <article class="search-copy-card">
            <header><span>${escapeHtml(row.brand)}</span><em>Observed Â· rank ${escapeHtml(row.rank_group ?? "â€”")}</em></header>
            <div class="search-copy-display"><b>Ad</b><span>${escapeHtml(row.display_url || hostname)}</span></div>
            <h3>${escapeHtml(row.title)}</h3>
            <p>${escapeHtml(row.description)}</p>
            <div class="search-copy-chips">
              <span>Query Â· ${escapeHtml(row.keyword || "unavailable")}</span>
              <span>${escapeHtml(row.product || "Unclassified")}</span>
              ${row.search_volume != null ? `<span>${formatNumber(row.search_volume)} searches</span>` : ""}
              ${row.cpc_usd != null ? `<span>$${Number(row.cpc_usd).toFixed(2)} CPC</span>` : ""}
              ${economics?.competition ? `<span>${escapeHtml(economics.competition)} competition</span>` : ""}
            </div>
            <footer><span>${escapeHtml(hostname)}</span>${row.destination_url ? `<a href="${escapeHtml(row.destination_url)}" target="_blank" rel="noreferrer">Landing page â†—</a>` : ""}</footer>
          </article>`;
        }).join("") || `<div class="empty-state creative-library-empty"><h3>No observed search copy matches</h3><p>Widen the date range or remove a firm, role or text filter.</p></div>`}
      </div>
    </section>

    <section class="creative-decision-callout" aria-label="Search creative decision">
      <span>TEST</span>
      <div><strong>Put sportsbook acquisition copy against the intent FanDuel is not visibly answering in this paid-index cut.</strong><small>Keep brand, generic and competitor campaigns separate; use the ${formatNumber(signalSearch?.summary?.keyword_metric_rows || 0)}-query economics panel to choose the test, then judge total incremental FTDâ€”not the competitor's apparent activity.</small></div>
    </section>

    <section class="creative-scoreboard">
      <article><span>Observed rows</span><strong>${formatNumber(rows.length)}</strong><small>weekly provider observations</small></article>
      <article><span>Unique copy sets</span><strong>${formatNumber(uniqueCopy.length)}</strong><small>deduplicated title + description</small></article>
      <article><span>Firms visible</span><strong>${formatNumber(observedBrands.length)}</strong><small>of ${formatNumber(brands.length)} firms checked</small></article>
      <article><span>Sportsbook rows</span><strong>${formatNumber(sportsbookRows.length)}</strong><small>excluding streaming results</small></article>
    </section>

    <section class="content-band creative-theme-panel">
        <div class="panel-heading"><div><p class="eyebrow">Message architecture</p><h2>What the copy is trying to do</h2></div></div>
        <div class="panel-heading"><div><p class="eyebrow">Message architecture</p><h2>What the copy is trying to do</h2></div></div>
        <div class="creative-label-list">
          <div><span>Free-access language</span><strong>${formatNumber(freeRows.length)}</strong><small>largely FDTVx streaming acquisition</small></div>
          <div><span>Hard monetary offers</span><strong>${formatNumber(moneyRows.length)}</strong><small>stated dollar value in title or description</small></div>
          <div><span>Sportsbook intent</span><strong>${formatNumber(sportsbookRows.length)}</strong><small>betting or bonus language</small></div>
          ${intentGroups.map(([label, count]) => `<div><span>${escapeHtml(label)}</span><strong>${formatNumber(count)}</strong><small>query-intent observations</small></div>`).join("")}
          ${themes.map(([label, count]) => `<div><span>${escapeHtml(label)}</span><strong>${formatNumber(count)}</strong><small>copy-theme observations</small></div>`).join("")}
          ${destinationGroups.map(([label, count]) => `<div><span>${escapeHtml(label)}</span><strong>${formatNumber(count)}</strong><small>destination pattern</small></div>`).join("")}
        </div>
    </section>

    ${renderCreativeDeepDive(analysisRecords, "Search")}

    <section class="creative-evidence-boundary content-band">
      <div><p class="eyebrow">Evidence boundary</p><h2>Copy and destination are observable. Investment and impact are not.</h2></div>
      <p>${escapeHtml(app.data.paidSerp.evidence_boundary)}</p>
      <span class="status status-working">human sign-off required for tuning</span>
    </section>`;

  const setSelectValue = (selector, value) => {
    const element = $(selector);
    if (element && [...element.options].some((option) => option.value === value)) element.value = value;
  };
  setSelectValue("#creativeAdvertiser", app.creativeAdvertiser);
  setSelectValue("#creativeProduct", app.creativeProduct);
  $("#creativeStartDate")?.addEventListener("change", (event) => {
    app.creativeStartDate = event.target.value;
    if (app.creativeEndDate < app.creativeStartDate) app.creativeEndDate = app.creativeStartDate;
    renderCreativeIntelligence();
  });
  $("#creativeEndDate")?.addEventListener("change", (event) => {
    app.creativeEndDate = event.target.value;
    if (app.creativeStartDate > app.creativeEndDate) app.creativeStartDate = app.creativeEndDate;
    renderCreativeIntelligence();
  });
  $("#creativeAdvertiser")?.addEventListener("change", (event) => {
    app.creativeAdvertiser = event.target.value;
    renderCreativeIntelligence();
  });
  $("#creativeProduct")?.addEventListener("change", (event) => {
    app.creativeProduct = event.target.value;
    renderCreativeIntelligence();
  });
  $("#creativeSearch")?.addEventListener("input", (event) => {
    app.creativeQuery = event.target.value;
    renderCreativeIntelligence();
    window.setTimeout(() => {
      const input = $("#creativeSearch");
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    }, 0);
  });
  $("[data-creative-reset]")?.addEventListener("click", () => {
    app.creativeStartDate = "2026-03-01";
    app.creativeEndDate = "2026-07-25";
    app.creativeAdvertiser = "all";
    app.creativeProduct = "all";
    app.creativeQuery = "";
    renderCreativeIntelligence();
  });
  bindCreativeChannelToggle();
  bindCreativeAdvancedModules(analysisRecords, "Search");
}

function renderCreativeIntelligence() {
  const container = $("#creativeIntelligenceContent");
  if (!container || !app.data?.creativeLibrary) return;
  if (app.creativeChannel === "search") {
    renderSearchCreativeIntelligence(container);
    return;
  }
  const library = app.data.creativeLibrary;
  const records = getFilteredCreativeRecords();
  const stats = creativeAdvertiserStats(records);
  const allAdvertisers = [...new Set(getCreativeRecords().map((record) => record.advertiser))].sort();
  const allProducts = library.product_categories || [];
  const allStates = library.state_options || [];
  const executions = records.reduce((sum, record) => sum + Number(record.variants || 1), 0);
  const stateSpecific = records.filter((record) => !(record.states || []).includes("National")).length;
  const analysisRecords = records.map(normaliseMetaCreativeForAnalysis);
  const themes = aggregateCreativeLabels(records, creativeThemeTags).slice(0, 10);
  const formats = aggregateCreativeLabels(records, (record) => [record.format || "Unknown format"]).slice(0, 8);
  const selected = getCreativeRecords().find((record) => record.id === app.selectedCreativeId);
  const coverage = allProducts.map((product) => ({
    product,
    count: records.filter((record) => record.product === product).reduce((sum, record) => sum + Number(record.variants || 1), 0)
  }));
  const visibleStates = allStates.map((state) => ({
    state,
    count: records.filter((record) => (record.states || []).includes(state)).reduce((sum, record) => sum + Number(record.variants || 1), 0)
  })).filter((row) => row.count > 0 || row.state === "National");
  const leader = stats[0];
  const fanDuel = stats.find((row) => row.advertiser === "FanDuel");
  const leaderText = leader
    ? `${leader.advertiser} leads the descriptive strength proxy at ${leader.score}/100 in the selected retained sample.`
    : "No creative records match this filter.";
  const opportunityText = app.creativeProduct === "Predicts"
    ? "The retained Predicts cut is FanDuel-only. Add Kalshi, Polymarket and prediction-market advertiser captures before making a competitive claim."
    : app.creativeProduct === "Racing"
      ? "Racing is a capture gap in Snapshot 01. Add FanDuel Racing, DK Horse and state racing operators before interpreting the category."
      : app.creativeProduct === "DFS"
        ? "DFS is a capture gap in Snapshot 01. Add FanDuel Fantasy and DraftKings Fantasy advertiser-level captures."
        : "FanDuel can defend its product-utility advantage, while testing whether Fanatics-style phased rewards or BetMGM-style loyalty stories improve incremental response.";

  container.innerHTML = `
    <section class="creative-hero">
      <div>
        <p class="eyebrow">Creative intelligence Â· ${escapeHtml(library.snapshot_id)}</p>
        <h2>See what competitors are saying, where it matters, and how their strategy is changing.</h2>
        <p>Real public Meta creative retained for FanDuel, DraftKings, BetMGM and Fanatics Sportsbook, coded against FanDuel's product architecture. Bet365 remains in the corrected comparison scope but has no retained card in this cut. Compare creative pressure, product roles, local relevance and strategic patterns without confusing presence with performance.</p>
        ${creativeChannelToggle()}
      </div>
      <div class="creative-hero-proof">
        <strong>${formatNumber(getCreativeRecords().length)}</strong>
        <span>retained families</span>
        <small>captured ${escapeHtml(creativeDateLabel(library.captured_at))}</small>
      </div>
    </section>

    <section class="creative-filter-panel content-band">
      <div class="creative-filter-grid">
        <label><span>From</span><input id="creativeStartDate" type="date" value="${escapeHtml(app.creativeStartDate)}" max="${escapeHtml(app.creativeEndDate)}"></label>
        <label><span>To</span><input id="creativeEndDate" type="date" value="${escapeHtml(app.creativeEndDate)}" min="${escapeHtml(app.creativeStartDate)}"></label>
        <label><span>Firm</span><select id="creativeAdvertiser"><option value="all">All firms</option>${allAdvertisers.map((advertiser) => `<option value="${escapeHtml(advertiser)}">${escapeHtml(advertiser)}</option>`).join("")}</select></label>
        <label><span>Product</span><select id="creativeProduct"><option value="all">All products</option>${allProducts.map((product) => `<option value="${escapeHtml(product)}">${escapeHtml(product)}</option>`).join("")}</select></label>
        <label><span>State relevance</span><select id="creativeState"><option value="all">All evidence</option>${allStates.map((state) => `<option value="${escapeHtml(state)}">${escapeHtml(state)}</option>`).join("")}</select></label>
        <label class="creative-search"><span>Search creative</span><input id="creativeSearch" type="search" value="${escapeHtml(app.creativeQuery)}" placeholder="Offer, sport, message or strategy"></label>
        <button class="small-action" type="button" data-creative-reset>Reset</button>
      </div>
      <p class="creative-filter-boundary"><strong>State relevance is not targeting.</strong> A state appears only when the advertiser, copy or destination provides a receipt. Public Meta evidence does not expose spend, delivery, audience or outcomes. ${escapeHtml((library.evidence_gaps || []).join(" "))}</p>
    </section>

    ${renderMetaCreativeLibrary(records)}

    <section class="creative-scoreboard">
      <article><span>Creative families</span><strong>${formatNumber(records.length)}</strong><small>unique retained library cards</small></article>
      <article><span>Executions</span><strong>${formatNumber(executions)}</strong><small>explicit public variants only</small></article>
      <article><span>Firms visible</span><strong>${formatNumber(stats.length)}</strong><small>including FanDuel benchmark</small></article>
      <article><span>State-specific</span><strong>${formatNumber(stateSpecific)}</strong><small>coded relevance receipts</small></article>
    </section>

    ${renderCreativeDeepDive(analysisRecords, "Meta")}

    <section class="creative-decision-grid">
      <article class="content-band creative-ranking-panel">
        <div class="panel-heading">
          <div><p class="eyebrow">Strategic strength proxy</p><h2>Who is using creative most strongly?</h2></div>
          <span class="status status-working">not effectiveness</span>
        </div>
        <p class="creative-section-intro">The proxy rewards clarity, distinctiveness, product breadth, explicit variant depth, longevity and local specificity, then applies a sample-depth confidence penalty. It does not use spend or outcomes.</p>
        <div class="creative-rank-list">
          ${stats.map((row, index) => `
            <button type="button" data-creative-firm="${escapeHtml(row.advertiser)}" class="${row.advertiser === "FanDuel" ? "is-fanduel" : ""}">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <div><strong>${escapeHtml(row.advertiser)}</strong><small>${formatNumber(row.executions)} executions Â· ${formatNumber(row.families)} families Â· ${formatNumber(row.products.length)} products</small></div>
              <i><b style="width:${row.score}%"></b></i>
              <em>${row.score}</em>
            </button>`).join("") || `<div class="empty-state">No creative evidence matches these filters.</div>`}
        </div>
      </article>
      <article class="content-band creative-answer-panel">
        <div class="creative-answer-kicker"><p class="eyebrow">Decision readout</p><span>TEST</span></div>
        <h2>${escapeHtml(leaderText)}</h2>
        <p>${escapeHtml(leader ? creativeStrategyTake(leader.advertiser, leader) : opportunityText)}</p>
        ${fanDuel ? `<div class="creative-fanduel-position"><span>FanDuel position</span><strong>${fanDuel.score}/100 Â· ${formatNumber(fanDuel.executions)} executions</strong><small>${escapeHtml(creativeStrategyTake("FanDuel", fanDuel))}</small></div>` : ""}
        <div class="creative-next-test"><span>What FanDuel should test</span><strong>${escapeHtml(opportunityText)}</strong></div>
      </article>
    </section>

    <section class="content-band creative-strategy-panel">
      <div class="panel-heading"><div><p class="eyebrow">Strategy decoder</p><h2>How each firm's creative system appears to work</h2></div><span class="status status-working">coded sample</span></div>
      <div class="creative-strategy-grid">
        ${stats.map((row) => `
          <article>
            <span>${escapeHtml(row.advertiser)}</span>
            <h3>${escapeHtml(row.topMessage)}</h3>
            <p>${escapeHtml(creativeStrategyTake(row.advertiser, row))}</p>
            <footer><b>${Math.round(row.offerShare * 100)}% offer-led</b><small>${Math.round(row.averageDays)} average days visible</small></footer>
          </article>`).join("") || `<div class="empty-state">No strategy cards are available for this filter.</div>`}
      </div>
    </section>

    <section class="creative-coverage-grid">
      <article class="content-band">
        <div class="panel-heading"><div><p class="eyebrow">Product coverage</p><h2>Creative executions by FanDuel category</h2></div></div>
        <div class="creative-coverage-list">
          ${coverage.map((row) => `<button type="button" data-creative-product-shortcut="${escapeHtml(row.product)}" class="${row.count === 0 ? "is-gap" : ""}"><span>${escapeHtml(row.product)}</span><i><b style="width:${executions ? Math.max(2, row.count / executions * 100) : 0}%"></b></i><strong>${row.count || "gap"}</strong></button>`).join("")}
        </div>
      </article>
      <article class="content-band">
        <div class="panel-heading"><div><p class="eyebrow">Geographic evidence</p><h2>Where creative has an explicit location receipt</h2></div></div>
        <div class="creative-state-list">
          ${visibleStates.map((row) => `<button type="button" data-creative-state-shortcut="${escapeHtml(row.state)}"><strong>${escapeHtml(row.state)}</strong><span>${formatNumber(row.count)} executions</span></button>`).join("")}
        </div>
        <p class="method-note"><strong>Interpretation:</strong> National means no state-specific receipt was retained. NJ and NC are relevance signals from advertiser or destination evidence, not observed targeting.</p>
      </article>
    </section>

    <section class="content-band creative-theme-panel">
        <div class="panel-heading"><div><p class="eyebrow">Theme and style decoder</p><h2>What firms showâ€”and how they show it</h2></div><span class="status status-working">human-coded</span></div>
        <div class="creative-theme-columns">
          <div><h3>Content themes</h3><div class="creative-label-list">${themes.map(([label, count]) => `<div><span>${escapeHtml(label)}</span><strong>${formatNumber(count)}</strong><small>executions</small></div>`).join("")}</div></div>
          <div><h3>Creative styles</h3><div class="creative-label-list">${formats.map(([label, count]) => `<div><span>${escapeHtml(label)}</span><strong>${formatNumber(count)}</strong><small>executions</small></div>`).join("")}</div></div>
        </div>
    </section>

    <section class="creative-evidence-boundary content-band">
      <div><p class="eyebrow">Evidence boundary</p><h2>Presence is observable. Success needs connected outcome data.</h2></div>
      <p>${escapeHtml(library.boundary)}</p>
      <a href="https://www.facebook.com/ads/library/" target="_blank" rel="noreferrer">Open Meta Ad Library â†—</a>
    </section>

    ${selected ? `
      <div class="creative-detail-backdrop" data-creative-close>
        <article class="creative-detail-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(selected.title)}">
          <button class="creative-modal-close" type="button" data-creative-close aria-label="Close creative detail">Ã—</button>
          <div class="creative-detail-visual"><img src="${escapeHtml(selected.image)}" alt="${escapeHtml(`${selected.advertiser}: ${selected.title}`)}"></div>
          <div class="creative-detail-body">
            <p class="eyebrow">${escapeHtml(selected.advertiser)} Â· Meta Â· ${escapeHtml(selected.product)}</p>
            <h2>${escapeHtml(selected.title)}</h2>
            <blockquote>${escapeHtml(selected.copy)}</blockquote>
            <dl>
              <dt>Strategy read</dt><dd>${escapeHtml(selected.strategy)}</dd>
              <dt>Message</dt><dd>${escapeHtml(selected.message)}</dd>
              <dt>Period</dt><dd>${escapeHtml(creativeDateLabel(selected.start_date))} â€“ ${escapeHtml(creativeDateLabel(selected.end_date))}</dd>
              <dt>State relevance</dt><dd>${escapeHtml((selected.states || []).join(", "))} Â· ${escapeHtml(selected.state_evidence)}</dd>
              <dt>Public variants</dt><dd>${formatNumber(selected.variants || 1)}</dd>
              <dt>Library ID</dt><dd>${escapeHtml(selected.library_id)}</dd>
            </dl>
            <a href="${escapeHtml(selected.source)}" target="_blank" rel="noreferrer">Open public source search â†—</a>
          </div>
        </article>
      </div>` : ""}
  `;

  const setSelectValue = (selector, value) => {
    const element = $(selector);
    if (element && [...element.options].some((option) => option.value === value)) element.value = value;
  };
  setSelectValue("#creativeAdvertiser", app.creativeAdvertiser);
  setSelectValue("#creativeProduct", app.creativeProduct);
  setSelectValue("#creativeState", app.creativeState);
  $("#creativeStartDate")?.addEventListener("change", (event) => {
    app.creativeStartDate = event.target.value;
    if (app.creativeEndDate < app.creativeStartDate) app.creativeEndDate = app.creativeStartDate;
    app.selectedCreativeId = "";
    renderCreativeIntelligence();
  });
  $("#creativeEndDate")?.addEventListener("change", (event) => {
    app.creativeEndDate = event.target.value;
    if (app.creativeStartDate > app.creativeEndDate) app.creativeStartDate = app.creativeEndDate;
    app.selectedCreativeId = "";
    renderCreativeIntelligence();
  });
  $("#creativeAdvertiser")?.addEventListener("change", (event) => {
    app.creativeAdvertiser = event.target.value;
    app.selectedCreativeId = "";
    renderCreativeIntelligence();
  });
  $("#creativeProduct")?.addEventListener("change", (event) => {
    app.creativeProduct = event.target.value;
    app.selectedCreativeId = "";
    renderCreativeIntelligence();
  });
  $("#creativeState")?.addEventListener("change", (event) => {
    app.creativeState = event.target.value;
    app.selectedCreativeId = "";
    renderCreativeIntelligence();
  });
  $("#creativeSearch")?.addEventListener("input", (event) => {
    app.creativeQuery = event.target.value;
    app.selectedCreativeId = "";
    renderCreativeIntelligence();
    window.setTimeout(() => {
      const input = $("#creativeSearch");
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    }, 0);
  });
  $$("[data-creative-id]").forEach((button) => button.addEventListener("click", () => {
    app.selectedCreativeId = button.dataset.creativeId;
    renderCreativeIntelligence();
  }));
  $$("[data-creative-close]").forEach((element) => element.addEventListener("click", (event) => {
    if (event.target.closest(".creative-detail-modal") && !event.target.matches("[data-creative-close]")) return;
    app.selectedCreativeId = "";
    renderCreativeIntelligence();
  }));
  $$("[data-creative-firm]").forEach((button) => button.addEventListener("click", () => {
    app.creativeAdvertiser = button.dataset.creativeFirm;
    app.selectedCreativeId = "";
    renderCreativeIntelligence();
  }));
  $$("[data-creative-product-shortcut]").forEach((button) => button.addEventListener("click", () => {
    app.creativeProduct = button.dataset.creativeProductShortcut;
    app.selectedCreativeId = "";
    renderCreativeIntelligence();
  }));
  $$("[data-creative-state-shortcut]").forEach((button) => button.addEventListener("click", () => {
    app.creativeState = button.dataset.creativeStateShortcut;
    app.selectedCreativeId = "";
    renderCreativeIntelligence();
  }));
  $("[data-creative-reset]")?.addEventListener("click", () => {
    app.creativeStartDate = "2026-03-01";
    app.creativeEndDate = library.captured_at || "2026-07-24";
    app.creativeAdvertiser = "all";
    app.creativeProduct = "all";
    app.creativeState = "all";
    app.creativeQuery = "";
    app.selectedCreativeId = "";
    renderCreativeIntelligence();
  });
  bindCreativeChannelToggle();
  bindCreativeAdvancedModules(analysisRecords, "Meta");
}

function getAttributionOutcomeProjection(profile, outcome = app.attributionOutcome) {
  if (outcome === "ngr") {
    const rate = profile.incremental / Math.max(1, profile.attributed);
    return {
      incremental: profile.value,
      attributed: profile.value / Math.max(0.01, rate),
      incrementalLabel: "Incremental NGR",
      efficiencyLabel: "Incremental ROAS",
      efficiencyValue: `${(profile.value / Math.max(1, profile.spend)).toFixed(2)}x`,
      format: (value) => formatCurrency(value)
    };
  }
  const scale = outcome === "registrations" ? 2.2 : 1;
  const incremental = Math.round(profile.incremental * scale);
  const attributed = Math.round(profile.attributed * (outcome === "registrations" ? 2.08 : 1));
  return {
    incremental,
    attributed,
    incrementalLabel: outcome === "registrations" ? "Incremental registrations" : "Incremental FTDs",
    efficiencyLabel: outcome === "registrations" ? "Cost / incremental registration" : "Incremental CPA",
    efficiencyValue: formatMoney(profile.spend / Math.max(1, incremental), 0),
    format: (value) => formatNumber(value)
  };
}

function renderAttribution() {
  const container = $("#attributionContent");
  if (!container) return;
  const profile = ATTRIBUTION_CHANNEL_PROFILES[app.attributionChannel] || ATTRIBUTION_CHANNEL_PROFILES["Paid Social"];
  const selectedTest = ATTRIBUTION_TESTS.find((test) => test.id === app.selectedAttributionTest) || ATTRIBUTION_TESTS[2];
  const visibleTests = ATTRIBUTION_TESTS.filter((test) => app.attributionTestFilter === "all" || test.status === app.attributionTestFilter);
  const outcomeProjection = getAttributionOutcomeProjection(profile, app.attributionOutcome);
  const incrementalRate = outcomeProjection.attributed > 0 ? (outcomeProjection.incremental / outcomeProjection.attributed) * 100 : 0;
  const iRoas = profile.spend > 0 ? profile.value / profile.spend : 0;
  const outcomeLabel = {
    ftd: "First-time depositors",
    ngr: "Net gaming revenue",
    registrations: "Registrations"
  }[app.attributionOutcome] || "First-time depositors";
  container.innerHTML = `
    <section class="attribution-hero">
      <div>
        <p class="eyebrow">TAU measurement system</p>
        <h2>Attribution &amp; Incrementality</h2>
        <p>Triangulate attribution, controlled experiments and MMM. Attribution assigns credit; incrementality asks what would not have happened without the media.</p>
        <div class="pill-row">
          <span class="pill status-working">maturity level 3 · test &amp; learn</span>
          <span class="pill status-synthetic">illustrative results</span>
          <span class="pill">privacy-first</span>
        </div>
      </div>
      <div class="attribution-orb" aria-label="Evidence readiness 68 out of 100">
        <strong>68</strong>
        <span>evidence readiness</span>
        <small>outcomes + holdouts are the unlock</small>
      </div>
    </section>

    <section class="attribution-triangulation" aria-label="Unified measurement framework">
      <article><span>01</span><strong>Attribution</strong><p>Who touched the journey? Useful for diagnostics, not causal proof.</p></article>
      <article><span>02</span><strong>Incrementality</strong><p>What changed because media ran? Controlled experiments are the truth set.</p></article>
      <article><span>03</span><strong>MMM</strong><p>How did channels contribute over time? Calibrate curves with experiment results.</p></article>
      <div class="triangulation-decision"><span>Decision layer</span><strong>Feed causal evidence back into planning and budget allocation</strong></div>
    </section>

    <section class="attribution-readiness-grid">
      <article class="panel attribution-readiness-panel">
        <div class="panel-heading">
          <div><p class="eyebrow">Evidence geometry</p><h2>Ready to diagnose. Not yet causal.</h2></div>
          <span class="status status-review">outcome join required</span>
        </div>
        ${renderAttributionReadinessRows()}
        <p class="attribution-boundary">Readiness is a workflow diagnostic, not statistical confidence. Real lift needs a defensible control, sufficient power and geographically usable outcomes.</p>
      </article>
      <article class="panel attribution-maturity-panel">
        <div class="panel-heading"><div><p class="eyebrow">Measurement maturity</p><h2>From reporting to optimisation</h2></div></div>
        ${[
          [1, "Report", "Last click and siloed platform totals"],
          [2, "Attribute", "Cross-channel journey diagnostics"],
          [3, "Test", "Holdouts, lift and uncertainty"],
          [4, "Unify", "MMM calibrated with experiments"],
          [5, "Optimise", "Predictive next-dollar decisions"]
        ].map(([level, label, detail]) => `<div class="maturity-step ${level === 3 ? "is-current" : ""}"><span>${level}</span><div><strong>${label}</strong><small>${detail}</small></div>${level === 3 ? `<em>current target</em>` : ""}</div>`).join("")}
      </article>
    </section>

    <section class="panel geo-lift-studio">
      <div class="panel-heading geo-lift-heading">
        <div>
          <p class="eyebrow">Geo Lift Studio</p>
          <h2>See how a causal test changes the result</h2>
          <p>Match comparable markets, establish the counterfactual, then replace attributed conversions with measured incremental outcomes.</p>
        </div>
        <span class="status status-synthetic">SYNTHETIC result preview</span>
      </div>
      <div class="geo-lift-controls">
        <label><span>Channel</span><select id="attributionChannelSelect">${Object.keys(ATTRIBUTION_CHANNEL_PROFILES).map((channel) => `<option value="${escapeHtml(channel)}">${escapeHtml(channel)}</option>`).join("")}</select></label>
        <label><span>Outcome</span><select id="attributionOutcomeSelect"><option value="ftd">First-time depositors</option><option value="ngr">Net gaming revenue</option><option value="registrations">Registrations</option></select></label>
        <label><span>Test duration</span><select id="attributionDurationSelect"><option value="4">4 weeks</option><option value="6">6 weeks</option><option value="8">8 weeks</option><option value="12">12 weeks</option></select></label>
      </div>
      <div class="geo-lift-result-grid">
        <div class="geo-lift-chart-panel">
          <div class="geo-lift-chart-head"><div><span>${escapeHtml(app.attributionChannel)}</span><strong>${escapeHtml(outcomeLabel)} trend</strong></div><span>Matched-market counterfactual</span></div>
          ${renderAttributionLiftChart(profile, Number(app.attributionDuration))}
          <div class="chart-legend"><span><i class="attribution-observed"></i>Exposed observed</span><span><i class="attribution-counterfactual"></i>Estimated counterfactual</span></div>
        </div>
        <div class="geo-lift-kpis">
          <article><span>Relative lift</span><strong>+${profile.lift.toFixed(1)}%</strong><small>95% interval +${profile.low.toFixed(1)}% to +${profile.high.toFixed(1)}%</small></article>
          <article><span>${escapeHtml(outcomeProjection.incrementalLabel)}</span><strong>${escapeHtml(outcomeProjection.format(outcomeProjection.incremental))}</strong><small>estimated above counterfactual</small></article>
          <article><span>${escapeHtml(outcomeProjection.efficiencyLabel)}</span><strong>${escapeHtml(outcomeProjection.efficiencyValue)}</strong><small>${formatCurrency(profile.spend)} measured spend</small></article>
          <article><span>${app.attributionOutcome === "ngr" ? "Incremental value" : "Incremental ROAS"}</span><strong>${app.attributionOutcome === "ngr" ? formatCurrency(profile.value) : `${iRoas.toFixed(2)}x`}</strong><small>${app.attributionOutcome === "ngr" ? `${iRoas.toFixed(2)}x iROAS` : `${formatCurrency(profile.value)} incremental value`}</small></article>
        </div>
      </div>
      <div class="geo-match-grid">
        ${[
          ["NJ north cluster", "PA east cluster", "0.94", "Exposed"],
          ["MI metro cluster", "OH north cluster", "0.91", "Exposed"],
          ["AZ central cluster", "CO front range", "0.89", "Holdout"],
          ["NC piedmont cluster", "VA central cluster", "0.87", "Holdout"]
        ].map(([market, match, score, role]) => `<article><span class="geo-role ${role.toLowerCase()}">${role}</span><strong>${market}</strong><small>matched with ${match}</small><em>${score} pre-fit</em></article>`).join("")}
      </div>
      <div class="attribution-reconciliation">
        <div><span>Platform-attributed outcomes</span><strong>${escapeHtml(outcomeProjection.format(outcomeProjection.attributed))}</strong><small>credit assignment</small></div>
        <div class="reconciliation-arrow">→</div>
        <div><span>Experiment-measured incremental</span><strong>${escapeHtml(outcomeProjection.format(outcomeProjection.incremental))}</strong><small>${incrementalRate.toFixed(1)}% incrementality rate</small></div>
        <div class="reconciliation-arrow">→</div>
        <div><span>Planning calibration</span><strong>${incrementalRate.toFixed(0)}% credit</strong><small>apply to response prior, then retest</small></div>
      </div>
      <p class="attribution-boundary"><strong>How results influence planning:</strong> the experiment does not simply add another dashboard metric. It calibrates the channel response curve, replaces platform-attributed CPA with incremental CPA, and changes the next budget decision. No live FanDuel outcome or experiment data is loaded here.</p>
    </section>

    <section class="attribution-test-lab">
      <div class="section-heading-row">
        <div><p class="eyebrow">Advanced Test Lab</p><h2>10 governed ML and causal tests</h2><p>Choose an approved question, check feasibility, then run with explicit evidence and claim boundaries.</p></div>
        <div class="test-filter-row" role="group" aria-label="Filter advanced tests">
          ${[["all", "All 10"], ["now", "Explore now"], ["next", "Next data join"], ["later", "Mature data"]].map(([key, label]) => `<button type="button" class="small-action ${app.attributionTestFilter === key ? "is-active" : ""}" data-attribution-filter="${key}">${label}</button>`).join("")}
        </div>
      </div>
      <div class="attribution-test-layout">
        <div class="attribution-test-grid">
          ${visibleTests.map((test) => renderAttributionTestCard(test)).join("")}
        </div>
        ${renderAttributionTestDetail(selectedTest)}
      </div>
    </section>

    <section class="platform-experiment-section">
      <div class="section-heading-row">
        <div><p class="eyebrow">Platform experiment hub</p><h2>Use Google and Meta lift studies—then bring the results back</h2></div>
        <span class="status status-working">platform evidence + independent triangulation</span>
      </div>
      <div class="platform-study-grid">
        ${Object.entries(ATTRIBUTION_PLATFORM_STUDIES).map(([key, study]) => renderPlatformStudyCard(key, study)).join("")}
      </div>
      ${renderPlatformResultBridge(ATTRIBUTION_PLATFORM_STUDIES[app.attributionPlatformFocus] || ATTRIBUTION_PLATFORM_STUDIES.google)}
    </section>

    <section class="attribution-principles">
      <article><strong>Pre-register the decision</strong><p>Define the budget or channel decision before choosing the method.</p></article>
      <article><strong>Protect the holdout</strong><p>Track spillover, promotions, regulatory changes and overlapping campaigns.</p></article>
      <article><strong>Report uncertainty</strong><p>Show the estimate, confidence interval, power and “no significant lift” honestly.</p></article>
      <article><strong>Close the loop</strong><p>Write approved results back to MMM priors and planning response curves.</p></article>
    </section>
  `;
  $("#attributionChannelSelect").value = app.attributionChannel;
  $("#attributionOutcomeSelect").value = app.attributionOutcome;
  $("#attributionDurationSelect").value = app.attributionDuration;
  bindAttributionControls();
}

function renderAttributionReadinessRows() {
  const rows = [
    ["Delivery", 92, "SDE and plan-store structure"],
    ["Creative", 64, "taxonomy present; real outcomes missing"],
    ["Time", 78, "daily fixture and monthly actual shapes"],
    ["Cost", 88, "channel spend bridge available"],
    ["Geography", 82, "ZIP3 and state framework loaded"],
    ["Business outcome", 36, "real FTD / NGR join required"]
  ];
  return `<div class="readiness-matrix">${rows.map(([label, score, note]) => `<div class="readiness-row"><div><strong>${label}</strong><small>${note}</small></div><div class="readiness-track"><i style="width:${score}%"></i></div><span>${score}</span></div>`).join("")}</div>`;
}

function renderAttributionLiftChart(profile, duration = 6) {
  const safeDuration = [4, 6, 8, 12].includes(duration) ? duration : 6;
  const counterfactual = [68, 70, 72, 73, 75, 77, 79, 81, 82, 84, 85, 87].slice(0, safeDuration);
  const liftScale = profile.lift / 12.4;
  const observed = counterfactual.map((value, index) => value + Math.max(0, index - 1) * 2.1 * liftScale);
  return `<div class="attribution-lift-chart" style="grid-template-columns:repeat(${safeDuration},minmax(0,1fr))" role="img" aria-label="Illustrative exposed outcomes rising above a matched-market counterfactual across ${safeDuration} weeks">
    ${counterfactual.map((value, index) => `<div class="lift-week"><div class="lift-bars"><i class="counterfactual" style="height:${value}%" title="Week ${index + 1} counterfactual ${value.toFixed(1)} index"></i><i class="observed" style="height:${Math.min(100, observed[index])}%" title="Week ${index + 1} observed ${observed[index].toFixed(1)} index"></i></div><span>W${index + 1}</span></div>`).join("")}
  </div>`;
}

function renderAttributionTestCard(test) {
  const statusLabel = { now: "Can explore now", next: "Next data join", later: "Mature dataset" }[test.status];
  return `<button type="button" class="attribution-test-card ${test.id === app.selectedAttributionTest ? "is-selected" : ""}" data-attribution-test="${test.id}">
    <span>TEST ${String(test.id).padStart(2, "0")} · ${escapeHtml(test.group)}</span>
    <strong>${escapeHtml(test.title)}</strong>
    <p>${escapeHtml(test.question)}</p>
    <small class="test-status test-${test.status}">${escapeHtml(statusLabel)}</small>
  </button>`;
}

function renderAttributionTestDetail(test) {
  return `<aside class="attribution-test-detail" aria-label="Selected test detail">
    <p class="eyebrow">Selected test ${String(test.id).padStart(2, "0")}</p>
    <h3>${escapeHtml(test.title)}</h3>
    <p>${escapeHtml(test.method)}</p>
    <div class="test-detail-block"><span>Available now</span>${test.available.map((item) => `<small>✓ ${escapeHtml(item)}</small>`).join("")}</div>
    <div class="test-detail-block"><span>Evidence unlocks</span>${test.needs.map((item) => `<small>○ ${escapeHtml(item)}</small>`).join("")}</div>
    <div class="test-decision"><span>Decision value</span><strong>${escapeHtml(test.decision)}</strong></div>
    <button class="drawer-button" type="button" data-attribution-use-test="${test.id}">Use as next test</button>
  </aside>`;
}

function renderPlatformStudyCard(key, study) {
  return `<article class="platform-study-card ${app.attributionPlatformFocus === key ? "is-selected" : ""}" style="--platform-colour:${escapeHtml(study.colour)}">
    <div class="platform-study-head"><div><span>${escapeHtml(study.name)}</span><strong>${escapeHtml(study.study)}</strong></div><em>${escapeHtml(study.status)}</em></div>
    <p>${escapeHtml(study.summary)}</p>
    <div class="platform-checklist">${study.requirements.map((item) => `<small>○ ${escapeHtml(item)}</small>`).join("")}</div>
    <div class="panel-actions"><button type="button" class="small-action" data-attribution-platform="${key}">View result bridge</button><a href="${escapeHtml(study.sourceUrl)}" target="_blank" rel="noreferrer">Official guidance ↗</a></div>
  </article>`;
}

function renderPlatformResultBridge(study) {
  const profile = ATTRIBUTION_CHANNEL_PROFILES[app.attributionChannel] || ATTRIBUTION_CHANNEL_PROFILES["Paid Social"];
  const outcomeProjection = getAttributionOutcomeProjection(profile, app.attributionOutcome);
  const incrementalRate = outcomeProjection.attributed > 0 ? (outcomeProjection.incremental / outcomeProjection.attributed) * 100 : 0;
  return `<div class="platform-result-bridge">
    <div><p class="eyebrow">Results contract · ${escapeHtml(study.name)}</p><h3>Import the lift result, not another attributed total</h3><p>Store the study ID, dates, treatment, holdout, outcome definition, estimate, uncertainty and feasibility status. Keep platform-reported attributed conversions alongside—not mixed into—the causal result.</p></div>
    <div class="result-field-grid">${study.resultFields.map((field) => `<span>${escapeHtml(field)}</span>`).join("")}</div>
    <div class="result-activation"><span>When approved</span><strong>Calibrate ${escapeHtml(app.attributionChannel)} to ${incrementalRate.toFixed(0)}% incremental credit</strong><small>Illustrative only · real study result required</small></div>
  </div>`;
}

function bindAttributionControls() {
  $("#attributionChannelSelect")?.addEventListener("change", (event) => {
    app.attributionChannel = event.target.value;
    renderAttribution();
  });
  $("#attributionOutcomeSelect")?.addEventListener("change", (event) => {
    app.attributionOutcome = event.target.value;
    renderAttribution();
  });
  $("#attributionDurationSelect")?.addEventListener("change", (event) => {
    app.attributionDuration = event.target.value;
    renderAttribution();
  });
  containerAttributionButtons();
}

function containerAttributionButtons() {
  $("#attributionContent")?.querySelectorAll("[data-attribution-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      app.attributionTestFilter = button.dataset.attributionFilter;
      renderAttribution();
    });
  });
  $("#attributionContent")?.querySelectorAll("[data-attribution-test]").forEach((button) => {
    button.addEventListener("click", () => {
      app.selectedAttributionTest = Number(button.dataset.attributionTest);
      renderAttribution();
    });
  });
  $("#attributionContent")?.querySelectorAll("[data-attribution-use-test]").forEach((button) => {
    button.addEventListener("click", () => {
      app.selectedAttributionTest = Number(button.dataset.attributionUseTest);
      app.attributionTestFilter = "all";
      renderAttribution();
      $(".geo-lift-studio")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  $("#attributionContent")?.querySelectorAll("[data-attribution-platform]").forEach((button) => {
    button.addEventListener("click", () => {
      app.attributionPlatformFocus = button.dataset.attributionPlatform;
      renderAttribution();
    });
  });
}

function getRecommendationRows() {
  return Array.isArray(app.data?.recommendations?.recommendations)
    ? app.data.recommendations.recommendations
    : [];
}

function getRecommendationActionState(recommendationId) {
  return app.recommendationActionStates?.[recommendationId] || "suggested";
}

function setRecommendationActionState(recommendationId, state) {
  const allowed = new Set(app.data?.recommendationActions?.workflow_states || []);
  if (!recommendationId || !allowed.has(state)) return;
  app.recommendationActionStates = {
    ...(app.recommendationActionStates || {}),
    [recommendationId]: state
  };
  persistRecommendationActionStates();
}

function getFilteredRecommendationRows() {
  const priorityRank = { critical: 0, high: 1, medium: 2, low: 3 };
  return getRecommendationRows()
    .filter((row) => app.selectedRecommendationKind === "all" || row.kind === app.selectedRecommendationKind)
    .filter((row) => app.selectedRecommendationChannel === "all" || row.channel === app.selectedRecommendationChannel)
    .filter((row) => app.selectedRecommendationCategory === "all" || row.category === app.selectedRecommendationCategory)
    .filter((row) => app.selectedRecommendationPriority === "all" || row.priority === app.selectedRecommendationPriority)
    .sort((a, b) => {
      const stateA = getRecommendationActionState(a.id) === "queued_for_approval" ? 1 : 0;
      const stateB = getRecommendationActionState(b.id) === "queued_for_approval" ? 1 : 0;
      return stateA - stateB || (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9) || a.channel.localeCompare(b.channel);
    });
}

function recommendationKindLabel(kind) {
  return {
    alert: "Alert",
    opportunity: "Opportunity",
    strategic: "Strategic"
  }[kind] || formatStatus(kind);
}

function recommendationActionLabel(actionability) {
  return {
    platform_preview: "Platform-action candidate",
    planning_workflow: "Planning workflow",
    manual_workflow: "Team workflow"
  }[actionability] || "Review";
}

function recommendationConnector(row) {
  return (app.data?.recommendationActions?.connectors || []).find((connector) => connector.connector_id === row.connector_id) || null;
}

function renderRecommendationFilterOptions(values, selected, allLabel) {
  return [
    `<option value="all"${selected === "all" ? " selected" : ""}>${escapeHtml(allLabel)}</option>`,
    ...values.map((value) => `<option value="${escapeHtml(value)}"${selected === value ? " selected" : ""}>${escapeHtml(formatStatus(value))}</option>`)
  ].join("");
}

function renderRecommendations() {
  const container = $("#recommendationsContent");
  if (!container || !app.data?.recommendations || !app.data?.recommendationActions) return;
  const rows = getRecommendationRows();
  const filtered = getFilteredRecommendationRows();
  if (!filtered.some((row) => row.id === app.selectedRecommendationId)) {
    app.selectedRecommendationId = filtered[0]?.id || "";
  }
  const selected = filtered.find((row) => row.id === app.selectedRecommendationId) || null;
  const channels = [...new Set(rows.map((row) => row.channel))].sort();
  const categories = [...new Set(rows.map((row) => row.category))].sort();
  const alerts = rows.filter((row) => row.kind === "alert").length;
  const actionCandidates = rows.filter((row) => row.actionability === "platform_preview").length;
  const strategic = rows.filter((row) => row.kind === "strategic").length;
  const queued = rows.filter((row) => getRecommendationActionState(row.id) === "queued_for_approval").length;
  const connectors = app.data.recommendationActions.connectors || [];

  container.innerHTML = `
    <section class="recommendations-hero">
      <div class="recommendations-hero-copy">
        <p class="eyebrow">Recommendations</p>
        <h2>Know the next best move—and what is safe to action</h2>
        <p>Channel opportunities, execution alerts and strategic realignment in one governed queue. Every card keeps its evidence boundary and action path visible.</p>
        <div class="recommendation-hero-pills">
          <span class="pill status-synthetic">${escapeHtml(app.data.recommendations.display_flag)}</span>
          <span class="pill status-working">${escapeHtml(app.data.recommendationActions.display_flag)}</span>
        </div>
      </div>
      <div class="recommendations-hero-rule">
        <span>Control rule</span>
        <strong>Suggest → review diff → approve → connect → apply</strong>
        <small>There is no direct jump from recommendation to live platform write.</small>
      </div>
    </section>

    <section class="recommendation-kpi-grid" aria-label="Recommendation summary">
      <article><span>Open recommendations</span><strong>${formatNumber(rows.length)}</strong><small>Across ${formatNumber(channels.filter((channel) => channel !== "Cross-channel").length)} plan channels</small></article>
      <article class="is-alert"><span>Alerts</span><strong>${formatNumber(alerts)}</strong><small>Country, budget and compliance checks</small></article>
      <article class="is-action"><span>Action candidates</span><strong>${formatNumber(actionCandidates)}</strong><small>Google Ads or Meta preview paths</small></article>
      <article><span>Strategic moves</span><strong>${formatNumber(strategic)}</strong><small>Route through Planning OS</small></article>
      <article class="${queued ? "is-queued" : ""}"><span>Queued for approval</span><strong>${formatNumber(queued)}</strong><small>No live writes in this demo</small></article>
    </section>

    <section class="recommendation-connector-strip" aria-label="Recommendation connector status">
      ${connectors.map((connector) => `
        <article>
          <span>${escapeHtml(connector.label)}</span>
          <strong>${connector.connector_id === "planning_os" ? "Workflow ready" : "Preview ready"}</strong>
          <small>${escapeHtml(connector.status === "available_in_demo" ? "Opens a governed planning workflow" : "Live write connector not connected")}</small>
        </article>
      `).join("")}
    </section>

    ${app.recommendationNotice ? `<div class="recommendation-notice" role="status">${escapeHtml(app.recommendationNotice)}</div>` : ""}

    <section class="recommendation-filter-bar" aria-label="Recommendation filters">
      <label><span>Type</span><select id="recommendationKindSelect">${renderRecommendationFilterOptions(["alert", "opportunity", "strategic"], app.selectedRecommendationKind, "All types")}</select></label>
      <label><span>Channel</span><select id="recommendationChannelSelect">${renderRecommendationFilterOptions(channels, app.selectedRecommendationChannel, "All channels")}</select></label>
      <label><span>Category</span><select id="recommendationCategorySelect">${renderRecommendationFilterOptions(categories, app.selectedRecommendationCategory, "All categories")}</select></label>
      <label><span>Priority</span><select id="recommendationPrioritySelect">${renderRecommendationFilterOptions(["critical", "high", "medium", "low"], app.selectedRecommendationPriority, "All priorities")}</select></label>
      <div class="recommendation-result-count"><strong>${formatNumber(filtered.length)}</strong><span>shown</span></div>
    </section>

    <section class="recommendation-workbench">
      <div class="recommendation-feed" aria-label="Recommendation queue">
        ${filtered.length ? filtered.map((row) => renderRecommendationCard(row, row.id === app.selectedRecommendationId)).join("") : `
          <div class="empty-state"><strong>No recommendations match these filters.</strong><p>Broaden the channel, category or priority selection.</p></div>
        `}
      </div>
      <div class="recommendation-detail-shell">
        ${selected ? renderRecommendationDetail(selected) : `<div class="recommendation-detail-empty">Select a recommendation to inspect its evidence and action path.</div>`}
      </div>
    </section>
  `;
}

function renderRecommendationCard(row, selected) {
  const state = getRecommendationActionState(row.id);
  return `
    <button class="recommendation-feed-card kind-${escapeHtml(row.kind)} priority-${escapeHtml(row.priority)} ${selected ? "is-selected" : ""}" type="button" data-recommendation-id="${escapeHtml(row.id)}" aria-pressed="${selected ? "true" : "false"}">
      <span class="recommendation-priority-dot" aria-hidden="true"></span>
      <span class="recommendation-feed-main">
        <span class="recommendation-card-meta">
          <em>${escapeHtml(recommendationKindLabel(row.kind))}</em>
          <i>${escapeHtml(row.channel)}</i>
          <i>${escapeHtml(formatStatus(row.category))}</i>
        </span>
        <strong>${escapeHtml(row.title)}</strong>
        <small>${escapeHtml(row.summary)}</small>
        <span class="recommendation-card-foot">
          <b>${escapeHtml(row.impact_label)}</b>
          <i>${escapeHtml(recommendationActionLabel(row.actionability))}</i>
          ${state === "queued_for_approval" ? `<em class="is-queued">Queued</em>` : ""}
        </span>
      </span>
    </button>
  `;
}

function renderRecommendationDetail(row) {
  const sources = row.source_ids || [];
  const actionState = getRecommendationActionState(row.id);
  return `
    <article class="recommendation-detail" data-selected-recommendation="${escapeHtml(row.id)}">
      <header>
        <div class="recommendation-detail-meta">
          <span class="recommendation-kind kind-${escapeHtml(row.kind)}">${escapeHtml(recommendationKindLabel(row.kind))}</span>
          <span class="recommendation-priority priority-${escapeHtml(row.priority)}">${escapeHtml(formatStatus(row.priority))} priority</span>
          <span>${escapeHtml(row.channel)}</span>
          <span>${escapeHtml(formatStatus(row.category))}</span>
        </div>
        <h2>${escapeHtml(row.title)}</h2>
        <p>${escapeHtml(row.summary)}</p>
      </header>

      <div class="recommendation-detail-grid">
        <section>
          <span>Why this is here</span>
          <p>${escapeHtml(row.rationale)}</p>
        </section>
        <section>
          <span>Intended outcome</span>
          <p>${escapeHtml(row.impact_label)}</p>
        </section>
      </div>

      <section class="recommendation-evidence-block">
        <div><span>Evidence status</span><strong>${escapeHtml(formatStatus(row.evidence_status))}</strong></div>
        <div class="recommendation-source-list">
          ${sources.map((source) => `<span class="source-chip">${escapeHtml(source)}</span>`).join("")}
        </div>
        <p>This recommendation is illustrative until the named working/synthetic sources are replaced or validated with current FanDuel and platform evidence.</p>
      </section>

      <section class="recommendation-action-block state-${escapeHtml(actionState)}">
        <div class="recommendation-action-heading">
          <div>
            <span>Action path</span>
            <strong>${escapeHtml(recommendationActionLabel(row.actionability))}</strong>
          </div>
          <span class="recommendation-platform">${escapeHtml(row.platform || "Workflow")}</span>
        </div>
        ${renderRecommendationActionPanel(row, actionState)}
      </section>
    </article>
  `;
}

function renderRecommendationActionPanel(row, actionState) {
  if (row.actionability === "platform_preview") {
    const connector = recommendationConnector(row);
    const action = row.proposed_action || {};
    if (actionState === "queued_for_approval") {
      return `
        <div class="recommendation-queued-state">
          <span>Queued for human approval</span>
          <strong>No live ${escapeHtml(row.platform)} change has been made.</strong>
          <p>The connector is ${escapeHtml(formatStatus(connector?.status || "not connected"))}. A fresh platform read, all safety checks and explicit approval remain required.</p>
          <button class="small-action" type="button" data-recommendation-reset="${escapeHtml(row.id)}">Return to open queue</button>
        </div>
      `;
    }
    if (actionState === "reviewing") {
      return `
        <div class="recommendation-change-review" data-recommendation-change-review>
          <div class="recommendation-change-diff">
            <article><span>Current</span><strong>${escapeHtml(action.current || "Current value required")}</strong></article>
            <div aria-hidden="true">→</div>
            <article><span>Proposed</span><strong>${escapeHtml(action.proposed || "Proposed value required")}</strong></article>
          </div>
          <div class="recommendation-safety-list">
            <span>Required before queueing</span>
            ${(action.safety_checks || []).map((check) => `<label><input type="checkbox" disabled><span>${escapeHtml(check)}</span></label>`).join("")}
          </div>
          <p class="recommendation-preview-warning"><strong>Preview only.</strong> These checks describe the gate; they have not been executed against a live account.</p>
          <div class="panel-actions">
            <button class="small-action" type="button" data-recommendation-cancel="${escapeHtml(row.id)}">Cancel</button>
            <button class="drawer-button" type="button" data-recommendation-queue="${escapeHtml(row.id)}">Queue for approval</button>
          </div>
        </div>
      `;
    }
    return `
      <div class="recommendation-action-summary">
        <div>
          <span>${escapeHtml(action.type || "platform change")}</span>
          <strong>${escapeHtml(action.object || row.title)}</strong>
          <small>${escapeHtml(connector?.label || row.platform)} · ${escapeHtml(formatStatus(connector?.status || "not connected"))}</small>
        </div>
        <button class="drawer-button" type="button" data-recommendation-review="${escapeHtml(row.id)}">Review platform change</button>
      </div>
      <p class="recommendation-action-boundary">The demo can prepare a governed diff and approval packet. It cannot write to a live account.</p>
    `;
  }
  if (row.actionability === "planning_workflow") {
    return `
      <div class="recommendation-action-summary">
        <div>
          <span>${escapeHtml(formatStatus(row.planning_mode || "planning"))} planning prompt</span>
          <strong>Open with this recommendation in context</strong>
          <small>The active plan remains unchanged until a reviewer saves and activates a version.</small>
        </div>
        <button class="drawer-button" type="button" data-recommendation-planning="${escapeHtml(row.id)}">Open in Planning OS</button>
      </div>
    `;
  }
  if (actionState === "queued_for_approval") {
    return `
      <div class="recommendation-queued-state">
        <span>Added to internal work queue</span>
        <strong>No external task or platform change was created.</strong>
        <button class="small-action" type="button" data-recommendation-reset="${escapeHtml(row.id)}">Return to open queue</button>
      </div>
    `;
  }
  return `
    <div class="recommendation-action-summary">
      <div>
        <span>Team workflow</span>
        <strong>Create a reviewed brief or delivery task</strong>
        <small>Ownership, due date and evidence must be set in the operational system.</small>
      </div>
      <button class="drawer-button" type="button" data-recommendation-workflow="${escapeHtml(row.id)}">Add to work queue</button>
    </div>
  `;
}

function openRecommendationInPlanning(recommendationId) {
  const row = getRecommendationRows().find((item) => item.id === recommendationId);
  if (!row?.planning_prompt) return;
  app.selectedSurface = "planning";
  activateChatMode(row.planning_mode || "month");
  app.chatDinks = {
    ...app.chatDinks,
    channels: row.channel === "Cross-channel" ? "all" : row.channel
  };
  render();
  const input = $("#planningChatInput");
  if (input) {
    input.value = row.planning_prompt;
    input.focus();
  }
}

function renderReporting() {
  const baseline = app.data.spendBaseline;
  const view = REPORTING_VIEWS[app.selectedReportingView] || REPORTING_VIEWS.paid_search;
  const rangeMonths = getReportingRangeMonths();
  const rangeStart = rangeMonths[0] || app.selectedReportingMonth;
  const rangeEnd = rangeMonths[rangeMonths.length - 1] || app.selectedReportingMonth;
  const currentKpis = getReportingRangeKpis(app.selectedReportingView, rangeMonths);
  const previousKpis = getReportingRangeKpis(app.selectedReportingView, getPreviousReportingRange(rangeMonths));
  const selectedBudget = getSelectedBudgetRow();
  const productSummary = getZip3ProductSummary(app.selectedReportingProduct);
  const reportingModeLabel = currentKpis.mode === "synthetic_actuals" ? "SDE synthetic actuals" : currentKpis.mode === "mixed_range" ? "actuals + planned model" : "planned KPI model";
  const periodLabel = rangeStart === rangeEnd
    ? formatMonth(rangeStart)
    : `${formatMonth(rangeStart)} – ${formatMonth(rangeEnd)}`;
  const comparisonLabel = rangeMonths.length > 1 ? "vs prior period" : "vs prior month";
  const reportingChannels = getReportingChannelOptions();
  $("#reportingContent").innerHTML = `
    <section class="reporting-dashboard">
      <div class="reporting-control-bar">
        <div>
          <p class="eyebrow">Campaign KPI dashboard</p>
          <h2>${escapeHtml(view.label)} reporting view</h2>
          <p class="reporting-filter-summary">${escapeHtml(periodLabel)} · ${escapeHtml(getReportingChannelFilterLabel())}</p>
          <div class="panel-actions">
            <button class="small-action" type="button" data-ask-reporting>Ask about this report</button>
          </div>
        </div>
        <div class="reporting-controls">
          <label>
            <span>Channel group</span>
            <select id="reportingViewSelect">
              ${Object.entries(REPORTING_VIEWS).map(([key, item]) => `<option value="${escapeHtml(key)}">${escapeHtml(item.label)}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>Start month</span>
            <select id="reportingStartMonthSelect">
              ${baseline.monthly_totals.map((item) => `<option value="${escapeHtml(item.month)}">${escapeHtml(formatMonth(item.month))}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>End month</span>
            <select id="reportingEndMonthSelect">
              ${baseline.monthly_totals.map((item) => `<option value="${escapeHtml(item.month)}">${escapeHtml(formatMonth(item.month))}</option>`).join("")}
            </select>
          </label>
          <label class="reporting-channel-filter">
            <span>Channels <small>⌘/Ctrl-click for multiple</small></span>
            <select id="reportingChannelSelect" multiple size="4" aria-label="Select reporting channels">
              ${reportingChannels.map((channel) => `<option value="${escapeHtml(channel)}" ${app.selectedReportingChannels.includes(channel) ? "selected" : ""}>${escapeHtml(channel)}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>Product</span>
            <select id="reportingProductSelect">
              ${productOptionsHtml(app.selectedReportingProduct)}
            </select>
          </label>
          <label>
            <span>Brand / DR</span>
            <select id="reportingSegmentSelect">
              <option value="all">All</option>
              <option value="brand">Brand</option>
              <option value="dr">DR / acquisition</option>
            </select>
          </label>
          <label>
            <span>Efficiency</span>
            <select id="reportingCpaModeSelect">
              <option value="media">Media CPA</option>
              <option value="all_in">All-in CAC</option>
            </select>
          </label>
          <label>
            <span>Map analysis</span>
            <select id="reportingMapLayerSelect">
              <option value="zip3">Product ZIP3 media</option>
              <option value="budget">Media budget</option>
              <option value="strength">Google Trends size</option>
              <option value="legislation">Regulation status</option>
            </select>
          </label>
        </div>
      </div>

      <div class="kpi-card-grid">
        ${renderKpiCard("Impressions", currentKpis.impressions, previousKpis.impressions, "number", app.selectedReportingView, false, comparisonLabel)}
        ${renderKpiCard(view.metricLabel, currentKpis.clicks, previousKpis.clicks, "number", app.selectedReportingView, false, comparisonLabel)}
        ${renderKpiCard("Conversions", currentKpis.conversions, previousKpis.conversions, "number", app.selectedReportingView, false, comparisonLabel)}
        ${renderKpiCard("Cost", currentKpis.spend, previousKpis.spend, "currency", app.selectedReportingView, false, comparisonLabel)}
        ${renderKpiCard(view.kpi.cpm ? "CPM" : "CPC", view.kpi.cpm ? currentKpis.cpm : currentKpis.cpc, view.kpi.cpm ? previousKpis.cpm : previousKpis.cpc, "currency2", app.selectedReportingView, false, comparisonLabel)}
        ${renderKpiCard(app.reportingCpaMode === "all_in" ? "All-in CAC" : "Media CPA", currentKpis.cpa, previousKpis.cpa, "currency2", app.selectedReportingView, true, comparisonLabel)}
      </div>
      ${renderReportingRecommendations(app.selectedReportingView, rangeEnd, currentKpis, productSummary)}
      ${renderReportingPacingAlerts(app.selectedReportingView, rangeEnd)}

      <div class="reporting-main-grid">
        <article class="panel reporting-chart-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">${escapeHtml(periodLabel)}</p>
              <h2>Cost and response trend</h2>
            </div>
            <span class="status status-synthetic">${escapeHtml(reportingModeLabel)}</span>
          </div>
          ${renderReportingTrendChart(app.selectedReportingView, rangeMonths)}
          ${renderReportingFixtureOverlay(app.selectedReportingView, rangeEnd)}
          ${renderReportingPacingStrip(app.selectedReportingView, rangeEnd)}
          ${renderReportingSourceTable(view, currentKpis)}
          ${renderReportingLineItemDrill(app.selectedReportingView, rangeMonths)}
        </article>

        <article class="panel map-panel reporting-map-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">ZIP3 and state map</p>
              <h2>Click a ZIP3 or state for planning intelligence</h2>
            </div>
            <span class="status status-working">state-aware</span>
          </div>
          <div id="reportingMap" class="state-map" aria-label="Reporting state map"></div>
          <div id="reportingLegend" class="map-legend"></div>
        </article>
      </div>

      <div class="reporting-state-grid">
        ${renderReportingStateIntel(app.selectedReportingView, rangeEnd, selectedBudget)}
        ${renderReportingAnalysisOptions(productSummary)}
      </div>

      ${renderMarketingSpendBaseline(baseline)}
    </section>
  `;
  $("#reportingViewSelect").value = app.selectedReportingView;
  $("#reportingStartMonthSelect").value = rangeStart;
  $("#reportingEndMonthSelect").value = rangeEnd;
  $("#reportingProductSelect").value = app.selectedReportingProduct;
  $("#reportingSegmentSelect").value = app.reportingDrillSegment;
  $("#reportingCpaModeSelect").value = app.reportingCpaMode;
  $("#reportingMapLayerSelect").value = app.selectedReportingMapLayer;
  bindReportingControls();
  if (app.selectedReportingMapLayer === "zip3") {
    renderZip3Map("reportingMap", "reportingLegend");
  } else {
    renderStateMap("reportingMap", "reportingLegend", app.selectedReportingMapLayer);
  }
}

function renderReportingRecommendations(viewKey, month, kpis, productSummary) {
  const view = REPORTING_VIEWS[viewKey] || REPORTING_VIEWS.paid_search;
  const keyPeriods = getMonthHeatSummary(month).keyPeriods || [];
  const connectorSlots = app.data.reportingConnectors?.connector_slots || [];
  const slotLabels = connectorSlots.slice(0, 3).map((slot) => slot.label).join(", ");
  const activeZip3s = Number(productSummary?.active_zip3_count || 0);
  const recommendations = [];

  if (viewKey === "paid_search") {
    recommendations.push({
      label: "Paid search evidence",
      body: app.data.search.paid_keywords_count === 0
        ? "Keep paid search as a missing-evidence gap until the DataForSEO cut lands; do not present zero paid activity as a finding."
        : "Use paid keyword/ad-copy rows to split brand defence from generic demand capture."
    });
  } else if (viewKey === "tv_video") {
    recommendations.push({
      label: "Sports window",
      body: keyPeriods.length
        ? `${keyPeriods.map((period) => period.label).join(", ")} is loaded for ${formatMonth(month)}; pressure-test TV, CTV and YouTube around the fixture overlay.`
        : "No named tentpole is loaded this month; treat TV/video pressure as baseline until a fixture or media-plan source says otherwise."
    });
  } else if (viewKey === "social") {
    recommendations.push({
      label: "Creative read",
      body: "Use social rows for creative and audience diagnosis, but keep walled-garden spend and conversion claims synthetic until platform exports replace them."
    });
  } else {
    recommendations.push({
      label: "Portfolio read",
      body: "Use All Channels for budget shape, then drill into Paid Search, Social or TV / Video before making a channel action."
    });
  }

  recommendations.push({
    label: "Product lens",
    body: `${productLabel(app.selectedReportingProduct)} has ${formatNumber(activeZip3s)} active ZIP3 rows in the working product-media model. Check state/product status before using this as an activation list.`
  });

  recommendations.push({
    label: "Connector slot",
    body: `${app.data.reportingConnectors?.display_flag || "Synthetic connector bridge"} is active. Replacement slots include ${slotLabels || "platform and finance exports"}.`
  });

  if (app.reportingCpaMode !== "all_in") {
    recommendations.push({
      label: "Economics check",
      body: "Toggle All-in CAC before reallocating spend; media CPA excludes the promo-cost assumption."
    });
  } else {
    recommendations.push({
      label: "Economics check",
      body: `All-in CAC mode is active at ${formatMoney(kpis.cpa, 2)}; keep promo assumptions visible in client discussion.`
    });
  }

  return `
    <div class="reporting-recommendation-strip" aria-label="Reporting recommendations">
      ${recommendations.slice(0, 4).map((item) => `
        <article class="recommendation-card">
          <span>${escapeHtml(item.label)}</span>
          <p>${escapeHtml(item.body)}</p>
        </article>
      `).join("")}
      <div class="pill-row">
        <span class="pill status-synthetic">${escapeHtml(app.data.reportingConnectors?.display_flag || "SYNTHETIC connector bridge")}</span>
        <span class="pill status-working">fanduel_reporting_connector_manifest_v1</span>
      </div>
    </div>
  `;
}

function getReportingPacingAlerts(viewKey, month) {
  if (getMonthStatus(month) !== "past") return [];
  const rows = getReportingActualRows(viewKey, month).filter((row) => row.buyable !== false);
  const alerts = [];
  rows.forEach((row) => {
    const planned = Number(row.planned_spend || 0);
    const actual = Number(row.actual_spend || 0);
    const variance = planned > 0 ? ((actual - planned) / planned) * 100 : 0;
    const delivery = Number(row.delivery_index || 1);
    const sales = Number(row.sales_index || 1);
    if (Math.abs(variance) >= 5) {
      alerts.push({
        severity: Math.abs(variance) >= 10 ? "high" : "attention",
        score: Math.abs(variance),
        channel: row.channel,
        label: variance > 0 ? "Spend ahead of plan" : "Spend behind plan",
        value: `${variance >= 0 ? "+" : ""}${variance.toFixed(1)}%`,
        action: variance > 0 ? "Confirm the over-delivery is intentional before the next key window." : "Check supply and trafficking before moving budget."
      });
    }
    if (Math.abs(delivery - 1) >= 0.05) {
      alerts.push({
        severity: Math.abs(delivery - 1) >= 0.1 ? "high" : "attention",
        score: Math.abs(delivery - 1) * 100,
        channel: row.channel,
        label: delivery > 1 ? "Delivery above pace" : "Delivery below pace",
        value: `${delivery.toFixed(2)} index`,
        action: delivery > 1 ? "Check remaining monthly headroom." : "Resolve delivery before reallocating."
      });
    }
    if (Math.abs(sales - 1) >= 0.1) {
      alerts.push({
        severity: Math.abs(sales - 1) >= 0.2 ? "high" : "attention",
        score: Math.abs(sales - 1) * 100,
        channel: row.channel,
        label: sales > 1 ? "Sales signal above plan" : "Sales signal below plan",
        value: `${sales.toFixed(2)} index`,
        action: sales > 1 ? "Validate the synthetic lift before proposing a reallocation." : "Review audience and creative before the next window."
      });
    }
  });
  const heat = getMonthHeatSummary(month);
  const deliveryRows = rows.map((row) => Number(row.delivery_index || 0)).filter(Boolean);
  const avgDelivery = deliveryRows.length ? deliveryRows.reduce((sum, value) => sum + value, 0) / deliveryRows.length : 1;
  if (Number(heat.peakHeatScore || 0) >= 70 && avgDelivery < 0.98) {
    alerts.push({
      severity: "high",
      score: Number(heat.peakHeatScore || 0),
      channel: "Key window",
      label: "High heat with delivery risk",
      value: `heat ${Math.round(heat.peakHeatScore)}`,
      action: `Close the ${((1 - avgDelivery) * 100).toFixed(1)}% delivery gap before ${formatDateShort(heat.peakDate)}.`
    });
  }
  const unique = new Map();
  alerts.forEach((alert) => {
    const key = `${alert.channel}::${alert.label}`;
    if (!unique.has(key) || unique.get(key).score < alert.score) unique.set(key, alert);
  });
  return [...unique.values()].sort((a, b) => {
    const rank = { high: 0, attention: 1 };
    return (rank[a.severity] ?? 2) - (rank[b.severity] ?? 2) || b.score - a.score;
  }).slice(0, 6);
}

function renderReportingPacingAlerts(viewKey, month) {
  const alerts = getReportingPacingAlerts(viewKey, month);
  if (!alerts.length) {
    return `
      <section class="pacing-alerts is-clear" aria-label="Pacing alerts">
        <div><span>By-exception pacing</span><strong>No threshold breach for this view/month</strong></div>
        <small>5% spend/delivery and 10% sales-index thresholds · SYNTHETIC SDE</small>
      </section>
    `;
  }
  return `
    <section class="pacing-alerts" aria-label="Pacing alerts">
      <div class="pacing-alert-head">
        <div><span>By-exception pacing</span><strong>${formatNumber(alerts.length)} alert${alerts.length === 1 ? "" : "s"} need a check</strong></div>
        <span class="pill status-synthetic">SYNTHETIC SDE</span>
      </div>
      <div class="pacing-alert-grid">
        ${alerts.map((alert) => `
          <article class="pacing-alert is-${escapeHtml(alert.severity)}">
            <div><span>${escapeHtml(alert.channel)}</span><strong>${escapeHtml(alert.label)}</strong></div>
            <em>${escapeHtml(alert.value)}</em>
            <small>${escapeHtml(alert.action)}</small>
          </article>
        `).join("")}
      </div>
      <small>Thresholds: spend variance ±5%; delivery index ±0.05; sales index ±0.10; key-window risk requires heat ≥70 plus delivery below 0.98.</small>
    </section>
  `;
}

function renderReportingPlanBar() {
  const container = $("#reportingPlanBar");
  if (!container) return;
  renderOutputPlanBar(container);
}

function renderCalendarPlanBar() {
  const container = $("#calendarPlanBar");
  if (!container) return;
  renderOutputPlanBar(container);
}

function renderOutputPlanBars() {
  renderReportingPlanBar();
  renderCalendarPlanBar();
}

function renderOutputPlanBar(container) {
  const plan = getPlan();
  const meta = getPlanMeta();
  const months = buildMonthlySummaries(plan);
  const peak = [...months].sort((a, b) => b.budget - a.budget)[0];
  container.innerHTML = `
    <div class="output-plan-bar-main">
      <button class="output-plan-summary" type="button" data-plan-bar-overlay>
        <span>Active plan</span>
        <strong>${escapeHtml(meta?.label || plan.plan_id)} v${escapeHtml(meta?.version || 1)}</strong>
      </button>
      <div class="output-mini-bars" aria-label="12-month plan shape">
        ${months.map((month) => {
          const height = peak?.budget ? Math.max(8, (month.budget / peak.budget) * 32) : 8;
          return `<i style="height:${height}px" title="${escapeHtml(formatMonth(month.month))}: ${formatCurrency(month.budget)}"></i>`;
        }).join("")}
      </div>
      <span class="output-peak-note">Peak ${escapeHtml(formatMonth(peak?.month || app.selectedReportingMonth))}: ${formatCurrency(peak?.budget || 0)}</span>
      <button class="small-action" type="button" data-open-flightpath>Open in Flightpath</button>
    </div>
    ${app.planBarOverlayOpen ? renderPlanBarOverlay(plan, meta, months, peak) : ""}
  `;
}

function renderPlanBarOverlay(plan, meta, months, peak) {
  const topChannels = [...(plan.channel_totals || [])].sort((a, b) => b.budget_gbp - a.budget_gbp).slice(0, 5);
  return `
    <div class="tile-overlay output-plan-overlay" role="dialog" aria-modal="true" aria-label="Active plan quick view">
      <div class="tile-overlay-panel">
        <div class="tile-overlay-head">
          <div>
            <p class="eyebrow">Active plan quick view</p>
            <h2>${escapeHtml(meta?.label || plan.plan_id)} v${escapeHtml(meta?.version || 1)}</h2>
          </div>
          <button class="drawer-button" type="button" data-plan-bar-close>Close</button>
        </div>
        <div class="planning-readout">
          <article class="readout-item"><span>Working media</span><strong>${formatCurrency(plan.total_allocated_gbp)}</strong></article>
          <article class="readout-item"><span>FTD proxy</span><strong>${formatNumber(plan.forecast_acquisitions)}</strong></article>
          <article class="readout-item"><span>CPA</span><strong>${formatCurrency(plan.forecast_cpa_gbp)}</strong></article>
          <article class="readout-item"><span>Peak month</span><strong>${escapeHtml(formatMonth(peak?.month || app.selectedReportingMonth))}</strong></article>
        </div>
        <div class="old-new-grid">
          <article>
            <span>Top channels</span>
            ${topChannels.map((channel) => `<p><strong>${escapeHtml(channel.channel)}</strong> ${formatCurrency(channel.budget_gbp)} <small>${channel.share_pct.toFixed(1)}%</small></p>`).join("")}
          </article>
          <article>
            <span>12-month heartbeat</span>
            ${months.map((month) => `<p><strong>${escapeHtml(formatMonth(month.month).split(" ")[0])}</strong> ${formatCurrency(month.budget)} <small>${escapeHtml(month.event_note || getMonthStatusLabel(month.month))}</small></p>`).join("")}
          </article>
        </div>
        <div class="panel-actions">
          <button class="drawer-button" type="button" data-open-flightpath>Open in Flightpath</button>
        </div>
      </div>
    </div>
  `;
}

function bindReportingControls() {
  $("#reportingViewSelect")?.addEventListener("change", (event) => {
    app.selectedReportingView = event.target.value;
    app.selectedReportingChannels = [];
    renderReporting();
  });
  $("#reportingStartMonthSelect")?.addEventListener("change", (event) => {
    app.reportingStartMonth = event.target.value;
    if (getReportingMonthIndex(app.reportingStartMonth) > getReportingMonthIndex(app.reportingEndMonth)) {
      app.reportingEndMonth = app.reportingStartMonth;
    }
    app.selectedReportingMonth = app.reportingEndMonth;
    app.selectedCalendarMonth = app.reportingEndMonth;
    renderReporting();
  });
  $("#reportingEndMonthSelect")?.addEventListener("change", (event) => {
    app.reportingEndMonth = event.target.value;
    if (getReportingMonthIndex(app.reportingEndMonth) < getReportingMonthIndex(app.reportingStartMonth)) {
      app.reportingStartMonth = app.reportingEndMonth;
    }
    app.selectedReportingMonth = app.reportingEndMonth;
    app.selectedCalendarMonth = app.reportingEndMonth;
    renderReporting();
  });
  $("#reportingChannelSelect")?.addEventListener("change", (event) => {
    app.selectedReportingChannels = [...event.target.selectedOptions].map((option) => option.value);
    renderReporting();
  });
  $("#reportingProductSelect")?.addEventListener("change", (event) => {
    app.selectedReportingProduct = event.target.value;
    renderReporting();
  });
  $("#reportingSegmentSelect")?.addEventListener("change", (event) => {
    app.reportingDrillSegment = event.target.value;
    renderReporting();
  });
  $("#reportingCpaModeSelect")?.addEventListener("change", (event) => {
    app.reportingCpaMode = event.target.value;
    renderReporting();
  });
  $("#reportingMapLayerSelect")?.addEventListener("change", (event) => {
    app.selectedReportingMapLayer = event.target.value;
    renderReporting();
  });
}

function getReportingMonthKeys() {
  return app.data.spendBaseline.monthly_totals.map((item) => item.month);
}

function getReportingMonthIndex(month) {
  const index = getReportingMonthKeys().indexOf(month);
  return index >= 0 ? index : 0;
}

function getReportingRangeMonths() {
  const months = getReportingMonthKeys();
  const startIndex = getReportingMonthIndex(app.reportingStartMonth || app.selectedReportingMonth);
  const endIndex = getReportingMonthIndex(app.reportingEndMonth || app.selectedReportingMonth);
  return months.slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1);
}

function getPreviousReportingRange(months) {
  const keys = getReportingMonthKeys();
  const range = normaliseReportingMonths(months);
  if (!range.length) return [];
  const startIndex = getReportingMonthIndex(range[0]);
  const length = range.length;
  if (startIndex < length) return [];
  return keys.slice(startIndex - length, startIndex);
}

function normaliseReportingMonths(monthOrMonths) {
  if (Array.isArray(monthOrMonths)) return monthOrMonths;
  return monthOrMonths ? [monthOrMonths] : getReportingRangeMonths();
}

function getReportingChannelOptions() {
  const view = REPORTING_VIEWS[app.selectedReportingView] || REPORTING_VIEWS.paid_search;
  const allChannels = [...new Set(app.data.spendBaseline.monthly_by_channel.map((row) => row.channel))].sort();
  return view.channels.length ? allChannels.filter((channel) => view.channels.includes(channel)) : allChannels;
}

function getReportingChannelFilterLabel() {
  if (!app.selectedReportingChannels.length) return "All channels in group";
  if (app.selectedReportingChannels.length <= 2) return app.selectedReportingChannels.join(" + ");
  return `${app.selectedReportingChannels.length} selected channels`;
}

function getReportingMonth(month = app.selectedReportingMonth) {
  return app.data.spendBaseline.monthly_totals.find((item) => item.month === month)
    || app.data.spendBaseline.monthly_totals[0];
}

function getPreviousReportingMonth(month) {
  const months = app.data.spendBaseline.monthly_totals.map((item) => item.month);
  const index = Math.max(0, months.indexOf(month));
  return months[Math.max(0, index - 1)] || month;
}

function getReportingRows(viewKey, monthOrMonths) {
  const view = REPORTING_VIEWS[viewKey] || REPORTING_VIEWS.paid_search;
  const months = new Set(normaliseReportingMonths(monthOrMonths));
  let rows = app.data.spendBaseline.monthly_by_channel.filter((row) => months.has(row.month));
  if (view.channels.length) rows = rows.filter((row) => view.channels.includes(row.channel));
  if (app.selectedReportingChannels.length) rows = rows.filter((row) => app.selectedReportingChannels.includes(row.channel));
  return rows;
}

function getReportingActualRows(viewKey, monthOrMonths) {
  const view = REPORTING_VIEWS[viewKey] || REPORTING_VIEWS.paid_search;
  const months = new Set(normaliseReportingMonths(monthOrMonths));
  let rows = (app.data.actualsMonthly?.rows || []).filter((row) => months.has(row.month));
  if (view.channels.length) rows = rows.filter((row) => view.channels.includes(row.channel));
  if (app.selectedReportingChannels.length) rows = rows.filter((row) => app.selectedReportingChannels.includes(row.channel));
  return rows;
}

function sumSpend(rows) {
  return rows.reduce((sum, row) => sum + Number(row.spend_usd || 0), 0);
}

function getReportingKpis(viewKey, month) {
  const view = REPORTING_VIEWS[viewKey] || REPORTING_VIEWS.paid_search;
  const actualRows = getReportingActualRows(viewKey, month);
  const useActuals = getMonthStatus(month) === "past" && actualRows.length > 0;
  if (!useActuals) {
    const estimated = estimateReportingMetrics(sumSpend(getReportingRows(viewKey, month)), view.kpi);
    const allInCac = estimated.cpa + (PROMO_COST_PER_FTD[app.selectedReportingProduct] || 0);
    return {
      ...estimated,
      mediaCpa: estimated.cpa,
      allInCac,
      promoCost: estimated.conversions * (PROMO_COST_PER_FTD[app.selectedReportingProduct] || 0),
      cpa: app.reportingCpaMode === "all_in" ? allInCac : estimated.cpa,
      mode: "planned_model",
      dataLabel: "planned KPI model"
    };
  }
  const spend = actualRows.reduce((sum, row) => sum + Number(row.actual_spend || 0), 0);
  const conversions = actualRows.reduce((sum, row) => sum + Number(row.conversions || 0), 0);
  const sessions = actualRows.reduce((sum, row) => sum + Number(row.sessions || 0), 0);
  const promoCost = actualRows.reduce((sum, row) => sum + Number(row.promo_cost || 0), 0);
  const estimated = estimateReportingMetrics(spend, view.kpi);
  const mediaCpa = conversions > 0 ? spend / conversions : 0;
  const allInCac = conversions > 0 ? (spend + promoCost) / conversions : mediaCpa;
  return {
    ...estimated,
    conversions,
    sessions,
    mediaCpa,
    allInCac,
    promoCost,
    cpa: app.reportingCpaMode === "all_in" ? allInCac : mediaCpa,
    mode: "synthetic_actuals",
    dataLabel: "SYNTHETIC actuals"
  };
}

function getReportingRangeKpis(viewKey, monthOrMonths) {
  const months = normaliseReportingMonths(monthOrMonths);
  const monthly = months.map((month) => getReportingKpis(viewKey, month));
  const totals = monthly.reduce((sum, item) => ({
    spend: sum.spend + Number(item.spend || 0),
    impressions: sum.impressions + Number(item.impressions || 0),
    clicks: sum.clicks + Number(item.clicks || 0),
    conversions: sum.conversions + Number(item.conversions || 0),
    sessions: sum.sessions + Number(item.sessions || 0),
    promoCost: sum.promoCost + Number(item.promoCost || 0)
  }), { spend: 0, impressions: 0, clicks: 0, conversions: 0, sessions: 0, promoCost: 0 });
  const modes = new Set(monthly.map((item) => item.mode));
  const mediaCpa = totals.conversions > 0 ? totals.spend / totals.conversions : 0;
  const allInCac = totals.conversions > 0 ? (totals.spend + totals.promoCost) / totals.conversions : mediaCpa;
  return {
    ...totals,
    cpc: totals.clicks > 0 ? totals.spend / totals.clicks : 0,
    cpm: totals.impressions > 0 ? (totals.spend / totals.impressions) * 1000 : 0,
    conversionRate: totals.clicks > 0 ? totals.conversions / totals.clicks : 0,
    mediaCpa,
    allInCac,
    cpa: app.reportingCpaMode === "all_in" ? allInCac : mediaCpa,
    mode: modes.size > 1 ? "mixed_range" : (monthly[0]?.mode || "planned_model"),
    dataLabel: modes.size > 1 ? "SYNTHETIC actuals + planned KPI model" : (monthly[0]?.dataLabel || "planned KPI model")
  };
}

function estimateReportingMetrics(spend, config) {
  const safeSpend = Math.max(0, Number(spend || 0));
  const ctr = Number(config.ctr || 0.005);
  const conversionRate = Number(config.conversionRate || 0.08);
  const cpm = config.cpm ? Number(config.cpm) : null;
  const cpc = config.cpc ? Number(config.cpc) : cpm && ctr > 0 ? cpm / 1000 / ctr : 3;
  const impressions = cpm ? (safeSpend / cpm) * 1000 : cpc > 0 && ctr > 0 ? (safeSpend / cpc) / ctr : 0;
  const clicks = impressions * ctr;
  const conversions = clicks * conversionRate;
  return {
    spend: safeSpend,
    impressions,
    clicks,
    conversions,
    cpc: clicks > 0 ? safeSpend / clicks : 0,
    cpm: impressions > 0 ? (safeSpend / impressions) * 1000 : 0,
    cpa: conversions > 0 ? safeSpend / conversions : 0,
    conversionRate
  };
}

function renderKpiCard(label, value, previousValue, format, viewKey, lowerIsBetter = false, comparisonLabel = "vs prior month") {
  const delta = previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0;
  const isGood = lowerIsBetter ? delta <= 0 : delta >= 0;
  const sparkValues = buildSparkValues(viewKey, label);
  const formattedValue = format === "currency"
    ? formatCurrency(value)
    : format === "currency2"
      ? formatMoney(value, 2)
      : formatCompactNumber(value);
  return `
    <article class="reporting-kpi-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(formattedValue)}</strong>
      <small class="${isGood ? "positive" : "negative"}">${previousValue > 0 ? `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}% ${escapeHtml(comparisonLabel)}` : "No prior comparison"}</small>
      <div class="spark-bars" aria-hidden="true">
        ${sparkValues.map((point) => `<i style="height:${Math.max(8, Math.round(point * 100))}%"></i>`).join("")}
      </div>
    </article>
  `;
}

function buildSparkValues(viewKey, label) {
  const values = app.data.spendBaseline.monthly_totals.map((month) => {
    const kpis = getReportingKpis(viewKey, month.month);
    if (label === "Impressions") return kpis.impressions;
    if (label === "Conversions") return kpis.conversions;
    if (label === "Cost") return kpis.spend;
    if (label === "Cost per conversion" || label === "All-in CAC" || label === "Media CPA") return kpis.cpa;
    if (label === "CPM") return kpis.cpm;
    if (label === "CPC") return kpis.cpc;
    return kpis.clicks;
  });
  const max = Math.max(...values, 1);
  return values.map((value) => value / max);
}

function renderReportingTrendChart(viewKey, monthOrMonths = getReportingRangeMonths()) {
  const view = REPORTING_VIEWS[viewKey] || REPORTING_VIEWS.paid_search;
  const selectedMonths = new Set(normaliseReportingMonths(monthOrMonths));
  const months = app.data.spendBaseline.monthly_totals.filter((month) => selectedMonths.has(month.month));
  const points = months.map((month) => {
    const kpis = getReportingKpis(viewKey, month.month);
    return { month: month.month, spend: kpis.spend, response: kpis.conversions };
  });
  const spendPath = buildSvgPath(points.map((point) => point.spend), 620, 190);
  const responsePath = buildSvgPath(points.map((point) => point.response), 620, 190);
  return `
    <div class="reporting-line-chart">
      <svg viewBox="0 0 620 220" role="img" aria-label="${escapeHtml(view.label)} cost and response trend">
        <line x1="38" y1="20" x2="38" y2="190"></line>
        <line x1="38" y1="190" x2="596" y2="190"></line>
        <path class="cost-line" d="${escapeHtml(spendPath)}"></path>
        <path class="response-line" d="${escapeHtml(responsePath)}"></path>
        ${points.map((point, index) => {
          const x = 38 + (index * (558 / Math.max(1, points.length - 1)));
          return `<text x="${x}" y="210">${escapeHtml(formatMonth(point.month).split(" ")[0])}</text>`;
        }).join("")}
      </svg>
      <div class="chart-legend">
        <span><i class="cost"></i>Cost</span>
        <span><i class="response"></i>Conversions</span>
      </div>
    </div>
  `;
}

function renderReportingFixtureOverlay(viewKey, month) {
  const view = REPORTING_VIEWS[viewKey] || REPORTING_VIEWS.paid_search;
  const summary = getMonthHeatSummary(month);
  const viewRules = getCalendarModifierRules(month)
    .filter((rule) => !view.channels.length || (rule.channels || []).some((channel) => view.channels.includes(channel)));
  const keyPeriods = summary.keyPeriods.slice(0, 3);
  const topFixtures = summary.topFixtureIds
    .map((fixtureId) => getFixtureById(fixtureId))
    .filter(Boolean)
    .slice(0, 3);
  const channelLift = viewRules.length
    ? viewRules.map((rule) => `${rule.channels.filter((channel) => !view.channels.length || view.channels.includes(channel)).slice(0, 3).join(", ")} +${Math.round(Number(rule.add || 0) * 100)}%`).join("; ")
    : "No view-specific lift rule";
  const topSportsLabel = topFixtures.map((fixture) => fixture.sport).filter(Boolean).slice(0, 3).join(", ") || "structural feed";
  return `
    <div class="reporting-fixture-overlay heat-${escapeHtml(summary.heatBand || "cold")}" data-reporting-fixture-overlay>
      <div>
        <p class="eyebrow">Calendar overlay</p>
        <h3>${escapeHtml(summary.eventNote)} / ${escapeHtml(formatMonth(month))}</h3>
      </div>
      <div class="fixture-overlay-grid">
        <article>
          <span>Peak heat</span>
          <strong>${Math.round(summary.peakHeatScore || 0)}</strong>
          <small>${escapeHtml(formatDateShort(summary.peakDate))} / ${escapeHtml(summary.heatBand || "cold")}</small>
        </article>
        <article>
          <span>Fixture load</span>
          <strong>${formatNumber(summary.fixtureCount)}</strong>
          <small>${escapeHtml(topSportsLabel)}</small>
        </article>
        <article>
          <span>Channel action</span>
          <strong>${escapeHtml(channelLift)}</strong>
          <small>${viewRules.length ? "generated calendar_modifiers" : "watch only"}</small>
        </article>
      </div>
      <div class="note-list compact-notes">
        ${keyPeriods.length ? keyPeriods.map((period) => `<div class="note-item"><strong>${escapeHtml(period.label)}</strong> ${escapeHtml(period.insight)}</div>`).join("") : `<div class="note-item">No named key period is loaded for this month; Reporting uses the daily heat model only.</div>`}
        ${topFixtures.length ? `<div class="note-item">Top fixture labels: ${topFixtures.map((fixture) => escapeHtml(fixture.label)).join("; ")}</div>` : ""}
      </div>
      <div class="pill-row">
        <span class="pill status-synthetic">${escapeHtml(app.data.fixtureKeyPeriods?.display_flag || "MODELLED_HEAT")}</span>
        <span class="pill status-working">source: fixture calendar</span>
        <span class="pill status-working">source: calendar_modifiers</span>
      </div>
    </div>
  `;
}

function buildSvgPath(values, width, height) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(1, max - min);
  const left = 38;
  const top = 20;
  const chartWidth = width - 62;
  const chartHeight = height - 20;
  return values.map((value, index) => {
    const x = left + (index * (chartWidth / Math.max(1, values.length - 1)));
    const y = top + chartHeight - (((value - min) / range) * chartHeight);
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

function renderReportingSourceTable(view, currentKpis) {
  const rows = view.sources.length
    ? view.sources
    : app.data.spendBaseline.annual_channels
      .sort((a, b) => b.total - a.total)
      .slice(0, 8)
      .map((channel) => ({
        label: channel.channel,
        share: channel.share_pct / 100,
        ...view.kpi
      }));
  const totalSpend = currentKpis.spend;
  return `
    <div class="reporting-source-table">
      <div class="reporting-source-header">
        <span>Source</span>
        <span>Impressions</span>
        <span>Cost</span>
        <span>${escapeHtml(view.metricLabel)}</span>
        <span>Conv.</span>
        <span>CPC/CPM</span>
        <span>${app.reportingCpaMode === "all_in" ? "All-in CAC" : "Media CPA"}</span>
      </div>
      ${rows.map((row) => {
        const spend = totalSpend * row.share;
        const kpis = estimateReportingMetrics(spend, row);
        const conversions = currentKpis.mode === "synthetic_actuals" ? currentKpis.conversions * row.share : kpis.conversions;
        const costMetric = row.cpm ? formatMoney(kpis.cpm, 2) : formatMoney(kpis.cpc, 2);
        const promoPerFtd = conversions > 0 ? (currentKpis.promoCost || 0) * row.share / conversions : (PROMO_COST_PER_FTD[app.selectedReportingProduct] || 0);
        const displayedCpa = conversions > 0 ? (spend / conversions) + (app.reportingCpaMode === "all_in" ? promoPerFtd : 0) : 0;
        return `
          <div class="reporting-source-row">
            <span>${escapeHtml(row.label)}</span>
            <span>${formatCompactNumber(kpis.impressions)}</span>
            <span>${formatCurrency(kpis.spend)}</span>
            <span>${formatCompactNumber(kpis.clicks)}</span>
            <span>${formatCompactNumber(conversions)}</span>
            <span>${escapeHtml(costMetric)}</span>
            <span>${formatMoney(displayedCpa, 2)}</span>
          </div>
        `;
      }).join("")}
    </div>
    <div class="pill-row">
      <span class="pill status-review">${escapeHtml(view.evidence)}</span>
      <span class="pill status-synthetic">${escapeHtml(currentKpis.dataLabel || "modelled KPI rates")}</span>
      <span class="pill ${app.reportingCpaMode === "all_in" ? "status-synthetic" : "status-working"}">${app.reportingCpaMode === "all_in" ? "includes promo cost" : "media only"}</span>
      <span class="pill">source: SDE manifest</span>
    </div>
  `;
}

function renderReportingPacingStrip(viewKey, month) {
  const rows = getReportingActualRows(viewKey, month);
  const planned = rows.reduce((sum, row) => sum + Number(row.planned_spend || 0), 0);
  const actual = rows.reduce((sum, row) => sum + Number(row.actual_spend || 0), 0);
  const conversions = rows.reduce((sum, row) => sum + Number(row.conversions || 0), 0);
  const deliveryValues = rows.map((row) => Number(row.delivery_index || 0)).filter(Boolean);
  const salesValues = rows.map((row) => Number(row.sales_index || 0)).filter(Boolean);
  const delivery = deliveryValues.length ? deliveryValues.reduce((sum, value) => sum + value, 0) / deliveryValues.length : 1;
  const sales = salesValues.length ? salesValues.reduce((sum, value) => sum + value, 0) / salesValues.length : 1;
  const status = getMonthStatus(month);
  const variance = planned > 0 ? ((actual - planned) / planned) * 100 : 0;
  return `
    <div class="pacing-strip">
      <article class="readout-item">
        <span>${escapeHtml(formatStatus(status))} month</span>
        <strong>${status === "past" ? `${variance >= 0 ? "+" : ""}${variance.toFixed(1)}% spend` : "planned pacing"}</strong>
      </article>
      <article class="readout-item">
        <span>Planned spend</span>
        <strong>${formatCurrency(planned || getReportingKpis(viewKey, month).spend)}</strong>
      </article>
      <article class="readout-item">
        <span>Synthetic actual</span>
        <strong>${actual ? formatCurrency(actual) : "pending"}</strong>
      </article>
      <article class="readout-item">
        <span>Delivery / sales</span>
        <strong>${delivery.toFixed(2)} / ${sales.toFixed(2)}</strong>
      </article>
      <article class="readout-item">
        <span>Conversions</span>
        <strong>${formatCompactNumber(conversions || getReportingKpis(viewKey, month).conversions)}</strong>
      </article>
    </div>
  `;
}

function getReportingSegmentBucket(row) {
  const explicit = String(row.brand_dr || "").toLowerCase();
  if (explicit === "brand" || explicit === "dr") return explicit;
  const segment = String(row.segment || "").toLowerCase();
  return /brand|awareness|upper|reach|tentpole|national/.test(segment) ? "brand" : "dr";
}

function getReportingCompactDrillRows(viewKey, monthOrMonths) {
  const view = REPORTING_VIEWS[viewKey] || REPORTING_VIEWS.paid_search;
  const months = new Set(normaliseReportingMonths(monthOrMonths));
  const rows = (app.data.reportingDrill?.rows || []).filter((row) => months.has(row.month));
  let viewRows = view.channels.length
    ? rows.filter((row) => view.channels.includes(row.channel))
    : rows;
  if (app.selectedReportingChannels.length) {
    viewRows = viewRows.filter((row) => app.selectedReportingChannels.includes(row.channel));
  }
  const segmentRows = viewRows.filter((row) => {
    const bucket = getReportingSegmentBucket(row);
    if (app.reportingDrillSegment === "brand") return bucket === "brand";
    if (app.reportingDrillSegment === "dr") return bucket === "dr";
    return true;
  });
  return segmentRows.sort((a, b) => Number(b.cost || 0) - Number(a.cost || 0));
}

function getReportingDerivedPresets(channel) {
  const key = String(channel || "").toLowerCase();
  if (key.includes("linear tv")) {
    return [
      { platform: "TV buying file", campaignType: "Linear TV", lineItem: "NFL tentpole spots", segment: "brand", brandDr: "brand", share: 0.46, cpm: 32, ctr: 0.001, conversionRate: 0.075 },
      { platform: "TV buying file", campaignType: "Linear TV", lineItem: "State rotation", segment: "awareness", brandDr: "brand", share: 0.34, cpm: 30, ctr: 0.0011, conversionRate: 0.08 },
      { platform: "TV buying file", campaignType: "Linear TV", lineItem: "Offer response spots", segment: "dr", brandDr: "dr", share: 0.2, cpm: 34, ctr: 0.0014, conversionRate: 0.095 }
    ];
  }
  if (key.includes("ctv")) {
    return [
      { platform: "Programmatic CTV", campaignType: "CTV", lineItem: "Sports audience CTV", segment: "sports_intent", brandDr: "dr", share: 0.42, cpm: 25, ctr: 0.0019, conversionRate: 0.09 },
      { platform: "Programmatic CTV", campaignType: "CTV", lineItem: "State-level CTV rotation", segment: "awareness", brandDr: "brand", share: 0.34, cpm: 27, ctr: 0.0015, conversionRate: 0.08 },
      { platform: "Programmatic CTV", campaignType: "CTV", lineItem: "App retargeting CTV", segment: "remarketing", brandDr: "dr", share: 0.24, cpm: 23, ctr: 0.0022, conversionRate: 0.11 }
    ];
  }
  if (key.includes("youtube")) {
    return [
      { platform: "Google Ads", campaignType: "Video", lineItem: "Sports intent in-stream", segment: "sports_intent", brandDr: "dr", share: 0.38, cpm: 14, ctr: 0.0032, conversionRate: 0.078 },
      { platform: "Google Ads", campaignType: "Video", lineItem: "Odds and picks shorts", segment: "odds_content", brandDr: "dr", share: 0.33, cpm: 12, ctr: 0.0038, conversionRate: 0.074 },
      { platform: "Google Ads", campaignType: "Video", lineItem: "National brand video", segment: "brand", brandDr: "brand", share: 0.29, cpm: 17, ctr: 0.002, conversionRate: 0.065 }
    ];
  }
  if (key.includes("paid social")) {
    return [
      { platform: "Meta", campaignType: "Paid Social", lineItem: "Sportsbook prospecting", segment: "prospecting", brandDr: "dr", share: 0.42, cpm: 12.5, ctr: 0.009, conversionRate: 0.06 },
      { platform: "TikTok", campaignType: "Paid Social", lineItem: "Short-form odds content", segment: "odds_content", brandDr: "dr", share: 0.24, cpm: 10.8, ctr: 0.007, conversionRate: 0.045 },
      { platform: "Meta", campaignType: "Paid Social", lineItem: "Brand lift bursts", segment: "awareness", brandDr: "brand", share: 0.19, cpm: 13.5, ctr: 0.006, conversionRate: 0.04 },
      { platform: "Creator amplification", campaignType: "Paid Social", lineItem: "Creator whitelisting", segment: "creator", brandDr: "dr", share: 0.15, cpm: 18.5, ctr: 0.01, conversionRate: 0.05 }
    ];
  }
  if (key.includes("influencer") || key.includes("creator")) {
    return [
      { platform: "Creator roster", campaignType: "Influencer", lineItem: "Sports creator integrations", segment: "creator", brandDr: "dr", share: 0.42, cpm: 18.5, ctr: 0.01, conversionRate: 0.05 },
      { platform: "Creator roster", campaignType: "Influencer", lineItem: "Talent whitelisting", segment: "creator", brandDr: "dr", share: 0.34, cpm: 21, ctr: 0.009, conversionRate: 0.052 },
      { platform: "Creator roster", campaignType: "Influencer", lineItem: "Brand moment creators", segment: "awareness", brandDr: "brand", share: 0.24, cpm: 24, ctr: 0.006, conversionRate: 0.036 }
    ];
  }
  if (key.includes("paid search")) {
    return [
      { platform: "Google Ads", campaignType: "Search", lineItem: "Brand core", segment: "brand", brandDr: "brand", share: 0.34, cpc: 2.2, ctr: 0.18, conversionRate: 0.28 },
      { platform: "Google Ads", campaignType: "Search", lineItem: "Generic sportsbook terms", segment: "generic", brandDr: "dr", share: 0.36, cpc: 4.8, ctr: 0.042, conversionRate: 0.14 },
      { platform: "Microsoft Ads", campaignType: "Search", lineItem: "Bing intent terms", segment: "generic", brandDr: "dr", share: 0.13, cpc: 2.7, ctr: 0.05, conversionRate: 0.17 },
      { platform: "Apple Search Ads", campaignType: "App Store", lineItem: "App intent search", segment: "app_intent", brandDr: "dr", share: 0.17, cpc: 2.9, ctr: 0.065, conversionRate: 0.2 }
    ];
  }
  if (key.includes("app store") || key.includes("asa")) {
    return [
      { platform: "Apple Search Ads", campaignType: "App Store", lineItem: "Brand app terms", segment: "brand", brandDr: "brand", share: 0.32, cpc: 2.4, ctr: 0.09, conversionRate: 0.24 },
      { platform: "Apple Search Ads", campaignType: "App Store", lineItem: "Sportsbook category terms", segment: "category", brandDr: "dr", share: 0.44, cpc: 3.2, ctr: 0.062, conversionRate: 0.18 },
      { platform: "Apple Search Ads", campaignType: "App Store", lineItem: "Competitor app terms", segment: "conquest", brandDr: "dr", share: 0.24, cpc: 3.8, ctr: 0.048, conversionRate: 0.13 }
    ];
  }
  return [
    { platform: "SDE baseline model", campaignType: channel || "Channel", lineItem: "Modelled line item", segment: "baseline", brandDr: "dr", share: 1 }
  ];
}

function getReportingDerivedDrillRows(viewKey, monthOrMonths, compactRows = []) {
  const view = REPORTING_VIEWS[viewKey] || REPORTING_VIEWS.paid_search;
  const compactChannelMonths = new Set(compactRows.map((row) => `${row.month}::${row.channel}`));
  const monthlyRows = getReportingRows(viewKey, monthOrMonths)
    .filter((row) => Number(row.spend_usd || 0) > 0)
    .filter((row) => !compactChannelMonths.has(`${row.month}::${row.channel}`));
  return monthlyRows.flatMap((channelRow) => {
    const presets = getReportingDerivedPresets(channelRow.channel);
    const sourceIds = ["fanduel_marketing_spend_baseline_2026", ...(channelRow.source_ids || [])];
    return presets.map((preset, index) => {
      const spend = Number(channelRow.spend_usd || 0) * Number(preset.share || 0);
      const kpis = estimateReportingMetrics(spend, { ...view.kpi, ...preset });
      const lineItemId = `FD_US_${String(channelRow.channel || "channel").toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_${channelRow.month}_${index + 1}`;
      return {
        source_platform: preset.platform,
        month: channelRow.month,
        channel: channelRow.channel,
        campaign_type: preset.campaignType,
        campaign: `FD_US_${preset.campaignType}_${channelRow.month}`,
        line_item_id: lineItemId,
        line_item: preset.lineItem,
        segment: preset.segment,
        brand_dr: preset.brandDr,
        impressions: kpis.impressions,
        clicks: kpis.clicks,
        cost: spend,
        conversions: kpis.conversions,
        data_status: "modelled-from-baseline",
        display_flag: "MODELLED",
        source_ids: [...new Set(sourceIds)],
        ctr: kpis.impressions > 0 ? kpis.clicks / kpis.impressions : 0,
        cpc: kpis.cpc,
        cpm: kpis.cpm,
        cpa: kpis.cpa,
        confidence: channelRow.confidence || "working model",
        derivation_note: "Derived from the T111 spend baseline channel-month row because compact platform line items are not loaded for this channel/month."
      };
    });
  }).filter((row) => {
    const bucket = getReportingSegmentBucket(row);
    if (app.reportingDrillSegment === "brand") return bucket === "brand";
    if (app.reportingDrillSegment === "dr") return bucket === "dr";
    return true;
  });
}

function getReportingDrillRows(viewKey, monthOrMonths) {
  const compactRows = getReportingCompactDrillRows(viewKey, monthOrMonths);
  const derivedRows = getReportingDerivedDrillRows(viewKey, monthOrMonths, compactRows);
  return [...compactRows, ...derivedRows].sort((a, b) => Number(b.cost || 0) - Number(a.cost || 0));
}

function renderReportingLineItemDrill(viewKey, month) {
  const rows = getReportingDrillRows(viewKey, month);
  const totalCost = rows.reduce((sum, row) => sum + Number(row.cost || 0), 0);
  const totalConversions = rows.reduce((sum, row) => sum + Number(row.conversions || 0), 0);
  const compactCount = rows.filter((row) => row.display_flag !== "MODELLED").length;
  const modelledCount = rows.filter((row) => row.display_flag === "MODELLED").length;
  const drillStatus = modelledCount && compactCount
    ? "SYNTHETIC + MODELLED"
    : modelledCount
      ? "MODELLED_FROM_BASELINE"
      : (app.data.reportingDrill.display_flag || "SYNTHETIC");
  if (!rows.length) {
    return `
      <article class="note-item">
        No compact line-item rows are loaded for this view/month. The dashboard falls back to channel-level SDE actuals and the public-source spend baseline.
      </article>
    `;
  }
  return `
    <div class="reporting-drill-header">
      <div>
        <p class="eyebrow">Line item drill</p>
        <h3>${formatCurrency(totalCost)} / ${formatCompactNumber(totalConversions)} conversions</h3>
      </div>
      <div class="pill-row">
        <span class="pill ${modelledCount && !compactCount ? "status-working" : "status-synthetic"}">${escapeHtml(drillStatus)}</span>
        <span class="pill">rows ${formatNumber(rows.length)}</span>
        <span class="pill">compact ${formatNumber(compactCount)} / modelled ${formatNumber(modelledCount)}</span>
        <span class="pill">Brand/DR: ${escapeHtml(formatStatus(app.reportingDrillSegment))}</span>
      </div>
    </div>
    <div class="reporting-source-table line-item-table">
      <div class="reporting-source-header">
        <span>Platform</span>
        <span>Campaign</span>
        <span>Line item</span>
        <span>Segment</span>
        <span>Cost</span>
        <span>Clicks</span>
        <span>Conv.</span>
        <span>CPA</span>
        <span>Status</span>
      </div>
      ${rows.slice(0, 16).map((row) => `
        <div class="reporting-source-row">
          <span>${escapeHtml(row.source_platform)}</span>
          <span>${escapeHtml(row.campaign)}</span>
          <span>${escapeHtml(row.line_item)}</span>
          <span>${escapeHtml(formatStatus(row.segment))}</span>
          <span>${formatCurrency(row.cost)}</span>
          <span>${formatCompactNumber(row.clicks)}</span>
          <span>${formatCompactNumber(row.conversions)}</span>
          <span>${formatMoney(row.cpa, 2)}</span>
          <span>${escapeHtml(row.display_flag || row.data_status || "SYNTHETIC")}</span>
        </div>
      `).join("")}
    </div>
    <div class="note-list compact-notes">
      <div class="note-item">Compact rows come from SDE ad-group/ad-set output. MODELLED rows are deterministic splits from the T111 channel-month spend baseline where no platform line-item feed is loaded yet.</div>
    </div>
  `;
}

function renderReportingStateIntel(viewKey, month, selectedBudget) {
  const row = getSelectedStateRow();
  const view = REPORTING_VIEWS[viewKey] || REPORTING_VIEWS.paid_search;
  const productKey = app.selectedReportingProduct;
  const posture = row?.market_posture || inferMarketPosture(row || {});
  const zip3Feature = app.selectedZip3
    ? app.data.zip3Map.features.find((feature) => feature.zip3 === app.selectedZip3)
    : null;
  const selectedZip3Product = zip3Feature ? getZip3ProductMediaRow(zip3Feature.zip3, productKey) : null;
  const stateZip3ProductRows = app.data.zip3ProductMedia.zip3_rows.filter((zipRow) => zipRow.product_key === productKey && zipRow.state_code === app.selectedState);
  const activeStateZip3Rows = stateZip3ProductRows.filter((zipRow) => zipRow.planning_status === "active");
  const stateProductAnnualSpend = activeStateZip3Rows.reduce((sum, zipRow) => sum + zipRow.annual_media_spend_usd, 0);
  const stateProductMonthlySpend = activeStateZip3Rows.reduce((sum, zipRow) => sum + (zipRow.monthly_media_spend_usd?.[month] || 0), 0);
  const stateShare = selectedBudget?.share_pct || 0;
  const nationalSpend = getReportingKpis(viewKey, month).spend;
  const stateSpend = nationalSpend * (stateShare / 100);
  const stateKpis = estimateReportingMetrics(stateSpend, view.kpi);
  const trendIndex = selectedBudget?.fanDuel_strength_index ?? stateTrendIndex(app.selectedState);
  const products = row ? Object.keys(PRODUCT_LABELS).map((itemProductKey) => {
    const status = productPlanningBucket(row, itemProductKey);
    return `<span class="pill ${status.bucket === "live" ? "status-working" : status.bucket === "watch" ? "status-review" : "status-missing"}">${escapeHtml(productLabel(itemProductKey))}: ${escapeHtml(status.label)}</span>`;
  }).join("") : "";
  return `
    <article class="panel reporting-state-panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Selected state</p>
          <h2>${escapeHtml(getSelectedStateName())}</h2>
        </div>
        <span class="status status-working">click map to change</span>
      </div>
      <div class="planning-readout">
        <article class="readout-item">
          <span>Google Trends size</span>
          <strong>${trendIndex === null || trendIndex === undefined ? "Unknown" : `${escapeHtml(trendIndex)} index`}</strong>
        </article>
        <article class="readout-item">
          <span>Population</span>
          <strong>${formatNumber(row?.population_2025 || selectedBudget?.population || 0)}</strong>
        </article>
        <article class="readout-item">
          <span>${escapeHtml(view.label)} state spend</span>
          <strong>${formatCurrency(stateSpend)}</strong>
        </article>
        <article class="readout-item">
          <span>${escapeHtml(productLabel(productKey))} ZIP3 media</span>
          <strong>${
            selectedZip3Product
              ? `${formatCurrency(selectedZip3Product.annual_media_spend_usd)} annual / ${formatCurrency(selectedZip3Product.monthly_media_spend_usd?.[month] || 0)} month`
              : `${formatNumber(activeStateZip3Rows.length)} active ZIP3s / ${formatCurrency(stateProductAnnualSpend)} annual`
          }</strong>
        </article>
      </div>
      <div class="content-grid two state-intel-grid">
        <article class="content-card">
          <h3>Regulation and products</h3>
          <p>${escapeHtml(posture.cmo_summary || "No state posture loaded.")}</p>
          <div class="pill-row">${products || `<span class="pill status-missing">no product matrix row</span>`}</div>
        </article>
        <article class="content-card">
          <h3>${zip3Feature ? `ZIP3 ${escapeHtml(zip3Feature.zip3)} ${escapeHtml(productLabel(productKey))}` : `${escapeHtml(productLabel(productKey))} ZIP3 plan`}</h3>
          <div class="connector-grid">
            ${
              zip3Feature && selectedZip3Product
                ? `
                  <div class="connector-row"><strong>State</strong><span>${escapeHtml(zip3Feature.state_name)}</span></div>
                  <div class="connector-row"><strong>Status</strong><span>${escapeHtml(formatStatus(selectedZip3Product.planning_status))}</span></div>
                  <div class="connector-row"><strong>Annual media</strong><span>${formatCurrency(selectedZip3Product.annual_media_spend_usd)}</span></div>
                  <div class="connector-row"><strong>${escapeHtml(formatMonth(month))}</strong><span>${formatCurrency(selectedZip3Product.monthly_media_spend_usd?.[month] || 0)}</span></div>
                  <div class="connector-row"><strong>Population</strong><span>${formatNumber(zip3Feature.population || 0)}</span></div>
                  <div class="connector-row"><strong>Households</strong><span>${formatNumber(zip3Feature.households || 0)}</span></div>
                  <div class="connector-row"><strong>Signal score</strong><span>${escapeHtml(zip3Feature.score ?? "n/a")}</span></div>
                  <div class="connector-row"><strong>Reason</strong><span>${escapeHtml(selectedZip3Product.off_reason)}</span></div>
                `
                : `
                  <div class="connector-row"><strong>Active ZIP3s</strong><span>${formatNumber(activeStateZip3Rows.length)} / ${formatNumber(stateZip3ProductRows.length)}</span></div>
                  <div class="connector-row"><strong>Annual media</strong><span>${formatCurrency(stateProductAnnualSpend)}</span></div>
                  <div class="connector-row"><strong>${escapeHtml(formatMonth(month))}</strong><span>${formatCurrency(stateProductMonthlySpend)}</span></div>
                  <div class="connector-row"><strong>State KPI proxy</strong><span>${formatCompactNumber(stateKpis.conversions)} conversions</span></div>
                `
            }
          </div>
        </article>
      </div>
      <div class="note-list compact-notes">
        <div class="note-item">ZIP3 footprint is from Signal v2 working shapes and demographic bridge. Trend size is a Google Trends-style relative index, not market share. State KPI values are inferred from the public-source spend baseline and the synthetic state allocation model.</div>
      </div>
    </article>
  `;
}

function renderReportingAnalysisOptions(productSummary) {
  const mediaAnswer = app.data.zip3ProductMedia.media_spend_answer.answer;
  const offRegulationCount = productSummary
    ? (productSummary.status_counts.off_regulation_or_not_listed || 0) + (productSummary.status_counts.off_regulation_review || 0)
    : 0;
  const options = [
    ["Demand map", "Use Google Trends size to find where FanDuel has relative search heat."],
    ["Regulation map", "Separate live states from watchlist and suppress states before activation."],
    ["Product matrix", "Show Sportsbook, Casino, Predicts and DFS readiness state by state."],
    ["Channel economics", "Compare Paid Search, Paid Social and TV/Video KPIs by month."]
  ];
  return `
    <article class="panel reporting-options-panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Analysis options</p>
          <h2>Ways to read the market</h2>
        </div>
      </div>
      ${
        productSummary
          ? `<div class="planning-readout zip3-product-summary">
              <article class="readout-item">
                <span>${escapeHtml(productSummary.product_label)} media pool</span>
                <strong>${formatCurrency(productSummary.annual_media_pool_usd)}</strong>
              </article>
              <article class="readout-item">
                <span>Active ZIP3s</span>
                <strong>${formatNumber(productSummary.active_zip3_count)} / 896</strong>
              </article>
              <article class="readout-item">
                <span>Off: regulation or not listed</span>
                <strong>${formatNumber(offRegulationCount)}</strong>
              </article>
              <article class="readout-item">
                <span>Off by choice</span>
                <strong>${formatNumber(productSummary.status_counts.off_by_choice || 0)}</strong>
              </article>
            </div>
            <div class="note-item zip3-media-answer">${escapeHtml(mediaAnswer)}</div>`
          : ""
      }
      <div class="analysis-option-grid">
        ${options.map(([label, body]) => `
          <article class="analysis-option">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(body)}</span>
          </article>
        `).join("")}
      </div>
    </article>
  `;
}

function stateTrendIndex(stateCode) {
  const top = app.data.momentum.top_fanduel_state_interest.find((state) => state.state_code === stateCode);
  return top?.index ?? null;
}

function renderMarketingSpendBaseline(baseline) {
  if (!baseline) return "";
  const annualChannels = [...baseline.annual_channels].sort((a, b) => b.total - a.total);
  const peakMonths = [...baseline.monthly_totals].sort((a, b) => b.spend_usd - a.spend_usd).slice(0, 3);
  const selectedMonth = baseline.monthly_totals.find((month) => month.month === app.selectedCalendarMonth) || peakMonths[0];
  const selectedMonthChannels = baseline.monthly_by_channel
    .filter((row) => row.month === selectedMonth.month)
    .sort((a, b) => b.spend_usd - a.spend_usd)
    .slice(0, 8);
  const maxMonthlyChannel = Math.max(...selectedMonthChannels.map((row) => row.spend_usd), 1);
  return `
    <section class="spend-baseline-section">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Public-source spend baseline</p>
          <h2>Inferred FanDuel US working-media envelope</h2>
        </div>
        <span class="status status-review">inferred public-source envelope</span>
      </div>
      <div class="planning-readout">
        <article class="readout-item">
          <span>Annual working media</span>
          <strong>${formatCurrency(baseline.headline.annual_estimate_usd)}</strong>
        </article>
        <article class="readout-item">
          <span>Working-media range</span>
          <strong>${formatCurrency(baseline.headline.low_estimate_usd)} - ${formatCurrency(baseline.headline.high_estimate_usd)}</strong>
        </article>
        <article class="readout-item">
          <span>Peak months</span>
          <strong>${peakMonths.map((month) => `${formatMonth(month.month).split(" ")[0]} ${formatCurrency(month.spend_usd)}`).join(" / ")}</strong>
        </article>
      </div>
      <div class="content-grid two spend-baseline-grid">
        <article class="content-card">
          <h3>Annual channel mix</h3>
          <div class="spend-baseline-table">
            ${annualChannels.slice(0, 10).map((channel) => `
              <div class="spend-baseline-row">
                <span>${escapeHtml(channel.channel)}</span>
                <strong>${formatCurrency(channel.total)}</strong>
                <small>${escapeHtml(channel.share_pct.toFixed(1))}% / ${escapeHtml(channel.confidence)} / working_media</small>
              </div>
            `).join("")}
          </div>
        </article>
        <article class="content-card">
          <h3>${escapeHtml(formatMonth(selectedMonth.month))} working split</h3>
          <div class="keyword-list">
            ${selectedMonthChannels.map((channel) => `
              <div class="trend-row">
                <span>${escapeHtml(channel.channel)}</span>
                <div class="bar-track"><div class="trend-fill" style="width:${Math.max(2, Math.round((channel.spend_usd / maxMonthlyChannel) * 100))}%"></div></div>
                <span>${formatCurrency(channel.spend_usd)}</span>
              </div>
            `).join("")}
          </div>
          <div class="pill-row">
            <span class="pill status-synthetic">SYNTHETIC monthly prior</span>
            <span class="pill status-review">working_media</span>
            <span class="pill">${escapeHtml(selectedMonth.event_note)}</span>
          </div>
        </article>
      </div>
      <div class="note-list compact-notes">
        ${baseline.caveats.slice(0, 3).map((note) => `<div class="note-item">${escapeHtml(note)}</div>`).join("")}
      </div>
    </section>
  `;
}

function renderRegulation() {
  const productSelect = $("#regulationProductSelect");
  if (productSelect) {
    productSelect.value = app.selectedProduct;
  }
  renderStateMap("regulationMap", "regulationLegend", "legislation");

  const row = getSelectedStateRow();
  const budget = getSelectedBudgetRow();
  const selectedProductLabel = productLabel(app.selectedProduct);
  $("#regulationTitle").textContent = `${getSelectedStateName()} ${selectedProductLabel}`;

  if (!row) {
    $("#regulationContent").innerHTML = `
      <article class="content-card">
        <h3>Unknown in priority matrix</h3>
        <p>${escapeHtml(getSelectedStateName())} is not in the current FanDuel priority-state governance seed. No activation claim is made.</p>
        <div class="pill-row">
          <span class="pill status-review">unknown -> route to legal review</span>
          <span class="pill status-working">non-priority state</span>
        </div>
      </article>
    `;
    return;
  }

  const status = getProductStatus(row);
  const rule = getProductRule(row);
  const substance = getRegulationSubstance(row.state_code, app.selectedProduct);
  const verdict = getVerdictCopy(status, row, rule);
  const basePosture = row.market_posture || inferMarketPosture(row);
  let posture = isActivationSuppressed(status)
    ? {
        ...basePosture,
        category: "legal_review_heavy",
        label: `${selectedProductLabel}: ${verdict.heading}`,
        regulatory_friendliness: status === "not_listed" ? "not listed" : "review",
        cmo_summary: verdict.body,
        recommended_use: rule?.planning_action || verdict.body,
        avoid_products: [...(basePosture.avoid_products || []), `${selectedProductLabel} activation`]
      }
    : basePosture;
  const pendingChanges = substance?.pending_changes || [];
  if (pendingChanges.length) {
    posture = {
      ...posture,
      watch_products: [...new Set([...(posture.watch_products || []), selectedProductLabel])],
      recommended_use: `${posture.recommended_use || row.planning_action} Keep ${selectedProductLabel} on Watch while ${formatNumber(pendingChanges.length)} verified change item${pendingChanges.length === 1 ? "" : "s"} remains unresolved; this does not change activation permission.`
    };
  }
  const productCards = Object.keys(PRODUCT_LABELS)
    .map((key) => renderProductReadiness(row, key))
    .join("");
  const liveProducts = posture.live_products?.length ? posture.live_products.join(", ") : "None from loaded source";
  const watchProducts = posture.watch_products?.length ? posture.watch_products.join(", ") : "None";
  const avoidProducts = posture.avoid_products?.length ? posture.avoid_products.join(", ") : "None";
  const notes = [
    budget ? `Selected ${selectedProductLabel} scenario budget: ${formatCurrency(budget.budget_usd_equivalent)}; ${formatNumber(budget.forecast_ftds)} FTD proxy.` : "",
    rule ? `${rule.source_label}. Source date: ${rule.source_date}.` : "",
    "Working research only; regulator verification remains pending under Q003."
  ].filter(Boolean);

  $("#regulationContent").innerHTML = `
    <article class="content-card market-posture-card">
      <div class="posture-score">
        <span>${escapeHtml(posture.score ?? "-")}</span>
        <small>regulatory ease</small>
      </div>
      <div>
        <p class="eyebrow">CMO takeaway</p>
        <h3>${escapeHtml(posture.label || "Planning posture")}</h3>
        <p>${escapeHtml(posture.cmo_summary || verdict.body)}</p>
      </div>
      <div class="pill-row">
        <span class="pill ${posturePillClass(posture.category)}">${escapeHtml(posture.regulatory_friendliness || "working")}</span>
        <span class="pill status-working">FanDuel-owned source</span>
        <span class="pill">${escapeHtml(formatNumber(row.population_2025 || 0))} people</span>
      </div>
      <div class="panel-actions">
        <button class="small-action" type="button" data-ask-regulation>Ask about this state</button>
      </div>
    </article>

    <div class="planning-readout">
      <article class="readout-item">
        <span>Live in source</span>
        <strong>${escapeHtml(liveProducts)}</strong>
      </article>
      <article class="readout-item">
        <span>Watch / review</span>
        <strong>${escapeHtml(watchProducts)}</strong>
      </article>
      <article class="readout-item">
        <span>Suppress for now</span>
        <strong>${escapeHtml(avoidProducts)}</strong>
      </article>
    </div>

    ${renderRegulationWatchStrip(substance)}

    ${renderTexasPressGoCard(row, selectedProductLabel)}

    <article class="content-card regulation-plan-impact">
      <h3>How to plan this state</h3>
      <p>${escapeHtml(posture.recommended_use || row.planning_action)}</p>
      <div class="product-readiness-grid">${productCards}</div>
    </article>

    ${renderRegulationSubstanceCard(row, rule, substance)}

    ${renderRegulationAnalysisViews(row, posture)}

    ${renderPublisherPolicyBoard(app.selectedProduct)}

    <div class="note-list compact-notes">
      ${notes.map((note) => `<div class="note-item">${escapeHtml(note)}</div>`).join("")}
    </div>
    ${
      rule
        ? `<article class="ledger-row" style="margin-top:12px">
            <h3>Source receipt</h3>
            <p>${escapeHtml(rule.source_label)}. Source date: ${escapeHtml(rule.source_date)}. Confidence: ${escapeHtml(rule.confidence)}.</p>
            <div class="pill-row">
              <span class="pill status-working">${escapeHtml(rule.review_status)}</span>
              <span class="pill">${escapeHtml(rule.regulator)}</span>
              <a class="source-link" href="${escapeHtml(rule.source_url)}" target="_blank" rel="noreferrer">${escapeHtml(rule.source_id)}</a>
            </div>
          </article>`
        : ""
    }
  `;
}

function renderTexasPressGoCard(row, selectedProductLabel) {
  if (row.state_code !== "TX" || app.selectedProduct !== "sportsbook") return "";
  const persona = (app.data?.personas?.personas || []).find((item) => item.persona_id === "tx_holdout_predicts_watchlist");
  const zipRows = (app.data?.zip3ProductMedia?.zip3_rows || []).filter((item) => item.state_code === "TX");
  const verifiedPublishers = (app.data?.publisherPolicies?.rows || []).filter((item) => item.verification_status === "verified_primary").length;
  const staged = app.texasLaunchStaged;
  const channelRows = [
    ["CTV / Streaming", 30], ["Paid Search", 25], ["Paid Social", 20], ["Affiliate", 15], ["CRM / App", 10]
  ];
  return `
    <section class="content-card texas-press-go-card" data-texas-launch-readiness>
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Texas press-go rehearsal</p>
          <h3>The day verified clearance arrives, this draft stages itself</h3>
          <p>This is a working, synthetic launch rehearsal — not evidence that Texas is legalising, live, or approved for ${escapeHtml(selectedProductLabel)}.</p>
        </div>
        <div class="pill-row">
          <span class="pill status-review">watch only</span>
          <span class="pill status-synthetic">$5.0M working_media</span>
          <span class="pill">not in signed-off year</span>
        </div>
      </div>
      <div class="texas-press-go-grid">
        <article>
          <span>Audience ready</span>
          <strong>${escapeHtml(persona?.label || "Holdout Watchlist Bettor")}</strong>
          <p>${formatNumber(persona?.segment_size_proxy?.value || 0)} working size proxy; ${formatNumber(persona?.geo_signals?.zip3_count || zipRows.length)} TX ZIP3s in the loaded bridge.</p>
        </article>
        <article>
          <span>Demand posture</span>
          <strong>College-football window, review-led</strong>
          <p>Texas calendar weighting is structural only; no matchup is invented. College-sports claims and offers remain legal/publisher review items.</p>
        </article>
        <article>
          <span>Publisher pre-flight</span>
          <strong>${formatNumber(verifiedPublishers)} primary receipts</strong>
          <p>Policy receipts support research only. State clearance, platform approval and inventory remain separate gates.</p>
        </article>
      </div>
      <div class="texas-launch-allocation" aria-label="Texas working launch channel plan">
        ${channelRows.map(([channel, share]) => `<span><b>${escapeHtml(channel)}</b><em>${share}%</em></span>`).join("")}
      </div>
      <div class="texas-launch-diff" data-texas-launch-diff>
        <strong>${staged ? "Simulation staged: draft overlay only" : "Ready but held"}</strong>
        <span>${staged ? "+$5.0M working_media appears as a Texas launch overlay for review; the active annual plan remains unchanged." : "The signed-off plan remains the status quo. No Texas activation, spend or flight-path change exists until the simulated clearance is explicitly staged."}</span>
      </div>
      <div class="panel-actions">
        <button class="small-action" type="button" data-open-texas-launch>Open as a Launch draft</button>
        <button class="small-action primary-action" type="button" data-stage-texas-launch ${staged ? "disabled" : ""}>${staged ? "Staged in simulation" : "Simulate clearance and stage draft"}</button>
      </div>
    </section>
  `;
}

function renderRegulationWatchStrip(substance) {
  const changes = substance?.pending_changes || [];
  if (!changes.length) return `<section class="regulation-watch-strip" aria-label="Regulation watch items"><div class="regulation-watch-heading"><div><p class="eyebrow">Watch</p><h3>No verified change item for this state/product</h3></div><span class="pill status-working">keep current posture</span></div></section>`;
  return `
    <section class="regulation-watch-strip" aria-label="Verified regulation watch items">
      <div class="regulation-watch-heading">
        <div>
          <p class="eyebrow">Watch</p>
          <h3>${formatNumber(changes.length)} verified change item${changes.length === 1 ? "" : "s"}</h3>
        </div>
        <div class="pill-row">
          <span class="pill status-working">official sources</span>
          <span class="pill status-review">research support</span>
          <span class="pill">not activation permission</span>
        </div>
      </div>
      <div class="regulation-watch-list">
        ${changes.map((change) => `
          <article class="regulation-watch-item direction-${escapeHtml(change.direction)}">
            <div class="regulation-watch-item-head">
              <div>
                <span>${escapeHtml(formatStatus(change.type))} / ${escapeHtml(formatStatus(change.direction))}</span>
                <strong>${escapeHtml(change.name)}</strong>
              </div>
              <a class="source-link" href="${escapeHtml(change.source_url)}" target="_blank" rel="noreferrer">official receipt</a>
            </div>
            <p>${escapeHtml(change.stage)}</p>
            <dl>
              <div><dt>Expected window</dt><dd>${escapeHtml(change.expected_window)}</dd></div>
              <div><dt>Products</dt><dd>${escapeHtml((change.products || []).map(productLabel).join(", "))}</dd></div>
            </dl>
            <blockquote>${escapeHtml(change.supporting_excerpt)}</blockquote>
            <div class="pill-row">
              <span class="pill">checked ${escapeHtml(change.last_checked)}</span>
              <span class="pill">${escapeHtml(change.confidence)} confidence</span>
              <span class="pill status-review">${escapeHtml(change.review_status)}</span>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function getRegulationSubstance(stateCode, productKey = app.selectedProduct) {
  return (app.data?.regulationSubstance?.rows || []).find((row) => (
    row.state_code === stateCode && row.product_key === productKey
  )) || null;
}

function publisherPolicyProductKey(productKey = app.selectedProduct) {
  if (productKey === "predicts") return "prediction_markets";
  return ["sportsbook", "casino", "dfs"].includes(productKey) ? productKey : "not_covered";
}

function publisherPolicyStatusClass(status) {
  if (["accepted_with_restrictions", "case_by_case"].includes(status)) return "status-working";
  if (status === "observed_commercial_use_not_policy") return "status-review";
  return "status-missing";
}

function publisherVerificationStatusClass(status) {
  if (status === "verified_primary") return "status-client-safe";
  if (status === "partial_primary") return "status-review";
  return "status-missing";
}

function renderPublisherPolicyBoard(productKey = app.selectedProduct) {
  const dataset = app.data?.publisherPolicies;
  const rows = dataset?.rows || [];
  if (!rows.length) return "";
  const policyProductKey = publisherPolicyProductKey(productKey);
  const productName = policyProductKey === "prediction_markets"
    ? "Prediction markets"
    : policyProductKey === "not_covered"
      ? productLabel(productKey)
      : productLabel(policyProductKey);
  const verifiedCount = rows.filter((row) => row.verification_status === "verified_primary").length;
  const partialCount = rows.filter((row) => row.verification_status === "partial_primary").length;
  const unknownCount = rows.filter((row) => row.verification_status === "not_publicly_verified").length;
  return `
    <section class="content-card publisher-policy-board regulation-publisher-band" data-publisher-policy-board>
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Publisher policy receipts</p>
          <h3>${escapeHtml(productName)} platform rules</h3>
          <p>Primary-source acceptance support only. A published rule does not approve a campaign, establish state legality or confirm inventory.</p>
        </div>
        <div class="pill-row">
          <span class="pill status-client-safe">${formatNumber(verifiedCount)} primary</span>
          <span class="pill status-review">${formatNumber(partialCount)} partial</span>
          <span class="pill status-missing">${formatNumber(unknownCount)} not public</span>
          <span class="pill">checked ${escapeHtml(dataset.as_of)}</span>
        </div>
      </div>
      <div class="publisher-policy-list">
        ${rows.map((row, index) => {
          const rule = policyProductKey === "not_covered"
            ? { status: "not_stated", note: `${productName} is outside the four-product T185 verification scope.` }
            : row.product_rules?.[policyProductKey] || { status: "not_stated", note: "No product-specific public rule is loaded." };
          return `
            <details class="publisher-policy-row" ${index === 0 ? "open" : ""}>
              <summary>
                <span>
                  <strong>${escapeHtml(row.platform)}</strong>
                  <small>${escapeHtml(rule.note)}</small>
                </span>
                <span class="pill-row">
                  <i class="status ${publisherPolicyStatusClass(rule.status)}">${escapeHtml(formatStatus(rule.status))}</i>
                  <i class="status ${publisherVerificationStatusClass(row.verification_status)}">${escapeHtml(formatStatus(row.verification_status))}</i>
                </span>
              </summary>
              <div class="publisher-policy-detail">
                <dl>
                  <div><dt>Approval</dt><dd>${escapeHtml(row.certification_requirements)}</dd></div>
                  <div><dt>Geo</dt><dd>${escapeHtml(row.geo_restrictions)}</dd></div>
                  <div><dt>Age</dt><dd>${escapeHtml(row.age_targeting)}</dd></div>
                  <div><dt>Creative / RG</dt><dd>${escapeHtml(`${row.creative_rules} ${row.responsible_gambling}`)}</dd></div>
                </dl>
                <blockquote>${escapeHtml(row.supporting_excerpt)}</blockquote>
                <div class="pill-row">
                  <span class="pill status-review">research support</span>
                  <span class="pill">checked ${escapeHtml(row.last_checked)}</span>
                  <a class="source-link" href="${escapeHtml(row.policy_url)}" target="_blank" rel="noreferrer">primary receipt</a>
                </div>
              </div>
            </details>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderRegulationSubstanceCard(row, rule, substance) {
  if (!substance) {
    return `
      <article class="content-card regulation-substance-card regulation-rules">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Rule substance</p>
            <h3>Substance row not loaded</h3>
          </div>
          <span class="status status-review">legal review</span>
        </div>
        <p>No regulation substance row is loaded for ${escapeHtml(row.state)} / ${escapeHtml(productLabel(app.selectedProduct))}. Keep the source receipt and route to legal review.</p>
      </article>
    `;
  }
  const receiptLinks = (substance.receipts || []).map((receipt) => `
    <a class="source-link" href="${escapeHtml(receipt.url || "#")}" target="_blank" rel="noreferrer">${escapeHtml(receipt.source_id)}</a>
  `).join("");
  const suppressed = substance.why_suppressed || rule?.planning_action || "";
  return `
    <article class="content-card regulation-substance-card regulation-rules">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Rule substance</p>
          <h3>${escapeHtml(substance.instrument_name)}</h3>
        </div>
        <span class="status ${statusPillClass(substance.evidence_status)}">${escapeHtml(formatStatus(substance.evidence_status))}</span>
      </div>
      <p class="regulation-plain-language">${escapeHtml(substance.legal_position_summary)}</p>
      <div class="regulation-rule-grid">
        <article>
          <span>Why this matters</span>
          <strong>${escapeHtml(suppressed || substance.planning_implication || "Activation allowed in working source; still review creative and claims.")}</strong>
        </article>
        <article>
          <span>Regulator / owner</span>
          <strong>${escapeHtml(substance.regulator)}</strong>
        </article>
        <article>
          <span>Advertising implication</span>
          <strong>${escapeHtml(substance.advertising_rules_summary)}</strong>
        </article>
        <article>
          <span>Review gate</span>
          <strong>${escapeHtml(substance.required_review || substance.review_status)}</strong>
        </article>
      </div>
      <div class="pill-row">
        <span class="pill status-review">${escapeHtml(substance.review_status)}</span>
        <span class="pill">${escapeHtml(substance.last_checked)} checked</span>
        <span class="pill">${escapeHtml(substance.confidence)} confidence</span>
        ${receiptLinks}
      </div>
    </article>
  `;
}

function renderRegulationAnalysisViews(row, posture) {
  const liveCount = posture.live_products?.length || 0;
  const watchCount = posture.watch_products?.length || 0;
  const avoidCount = posture.avoid_products?.length || 0;
  const views = [
    ["CMO posture", `${posture.label || "Planning posture"} with regulatory ease score ${posture.score ?? "n/a"}.`],
    ["Activation matrix", `${liveCount} live, ${watchCount} watch/review and ${avoidCount} suppress products from the working source.`],
    ["State action", posture.recommended_use || row.planning_action || "Route to state/legal review."],
    ["Receipt trail", "Show source date, source page, confidence and regulator-review owner before client use."]
  ];
  return `
    <article class="content-card">
      <h3>Regulation analysis views</h3>
      <div class="analysis-option-grid">
        ${views.map(([label, body]) => `
          <article class="analysis-option">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(body)}</span>
          </article>
        `).join("")}
      </div>
    </article>
  `;
}

function inferMarketPosture(row) {
  const sportsbookLive = row.sportsbook_operating_status?.includes("online");
  const casinoLive = row.casino_status === "allowed";
  if (sportsbookLive && casinoLive) {
    return {
      category: "multi_product_growth",
      label: "Multi-product growth state",
      regulatory_friendliness: "high",
      score: 90,
      live_products: ["Sportsbook", "Casino", "Predicts"],
      watch_products: [],
      avoid_products: [],
      cmo_summary: "FanDuel-owned sources show multiple products live.",
      recommended_use: "Prioritise integrated activation after state/regulator review."
    };
  }
  if (sportsbookLive) {
    return {
      category: "sportsbook_growth",
      label: "Sportsbook growth state",
      regulatory_friendliness: "high",
      score: 76,
      live_products: ["Sportsbook", "Predicts"],
      watch_products: [],
      avoid_products: ["Casino activation"],
      cmo_summary: "Sportsbook and Predicts are live in FanDuel-owned sources.",
      recommended_use: "Plan sportsbook-led acquisition; keep casino out unless verified."
    };
  }
  return {
    category: "predicts_only_watchlist",
    label: "Predicts-only watchlist",
    regulatory_friendliness: "medium-low",
    score: 42,
    live_products: ["Predicts"],
    watch_products: [],
    avoid_products: ["Sportsbook activation", "Casino activation"],
    cmo_summary: "Predicts appears available while Sportsbook/Casino are not listed.",
    recommended_use: "Use Predicts, education and demand tracking; suppress Sportsbook/Casino activation."
  };
}

function renderProductReadiness(row, productKey) {
  const status = getProductStatus(row, productKey);
  const operatingStatus = row[`${productKey}_operating_status`];
  const label = productLabel(productKey);
  const copy = productReadinessCopy(productKey, status, operatingStatus);
  return `
    <div class="product-readiness ${statusClass(status)}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(copy.label)}</strong>
      <small>${escapeHtml(copy.body)}</small>
    </div>
  `;
}

function productReadinessCopy(productKey, status, operatingStatus) {
  if (isCustomProduct(productKey)) {
    return { label: "Do not activate", body: "New demo product defaults to not listed until state evidence is added." };
  }
  if (productKey === "sportsbook") {
    if (operatingStatus?.includes("online")) {
      return { label: "Plan activation", body: "Online Sportsbook live in FanDuel-owned source." };
    }
    if (operatingStatus === "retail_only") {
      return { label: "Retail-only", body: "Avoid online sportsbook claims." };
    }
    return { label: "Do not activate", body: "Not listed for Sportsbook in FanDuel-owned source." };
  }
  if (productKey === "casino") {
    return status === "allowed"
      ? { label: "Plan activation", body: "Casino live in FanDuel-owned source." }
      : { label: "Do not activate", body: "Casino not listed in FanDuel-owned source." };
  }
  if (productKey === "predicts") {
    return { label: "Available, review markets", body: "Predicts appears nationwide; markets vary by state." };
  }
  if (status === "legal-review") {
    return { label: "Legal review", body: "Do not use paid DFS claims without sign-off." };
  }
  if (status === "restricted") {
    return { label: "Restricted", body: "Use only within listed DFS limits." };
  }
  return { label: "Plan with review", body: "DFS available in FanDuel-owned source." };
}

function posturePillClass(category) {
  if (category === "multi_product_growth" || category === "sportsbook_growth") {
    return "status-working";
  }
  if (category === "legal_review_heavy") {
    return "status-review";
  }
  if (category === "retail_or_limited") {
    return "status-missing";
  }
  return "status-synthetic";
}

function getEvidenceContext() {
  return app.selectedEvidenceContext || {
    surface: "current-selection",
    month: app.selectedCalendarMonth,
    channel: app.selectedChannel,
    stateCode: app.planningScope === "national" ? "US" : app.selectedState,
    productKey: app.selectedProduct
  };
}

function getEvidenceReasons(context = getEvidenceContext()) {
  if (!window.FanDuelReasons?.buildReasons) {
    return [];
  }
  return window.FanDuelReasons.buildReasons({
    ...context,
    appData: app.data,
    scenarioId: getScenarioId()
  });
}

function renderEvidenceReasonPanel(context = getEvidenceContext()) {
  const reasons = getEvidenceReasons(context);
  const stateName = context.stateCode === "US"
    ? "National plan"
    : app.data.governance.state_rows.find((row) => row.state_code === context.stateCode)?.state || context.stateCode;
  return `
    <article class="content-card evidence-reasons-card">
      <div class="reason-context">
        <div>
          <p class="eyebrow">Why this plan cell</p>
          <h3>${escapeHtml(formatMonth(context.month))} / ${escapeHtml(context.channel)} / ${escapeHtml(stateName)}</h3>
        </div>
        <span class="pill ${statusPillClass("working source")}">${escapeHtml(productLabel(context.productKey))}</span>
      </div>
      <div class="reason-list">
        ${reasons.map((reason) => `
          <article class="reason-row reason-${escapeHtml(statusClass(reason.type))}">
            <div>
              <span class="reason-type">${escapeHtml(formatStatus(reason.type))}</span>
              <p>${escapeHtml(reason.text)}</p>
            </div>
            <div class="reason-actions">
              <span class="pill ${statusPillClass(reason.status)}">${escapeHtml(reason.status)}</span>
              <button class="source-chip" type="button" data-evidence-source="${escapeHtml(reason.source_id)}">${escapeHtml(reason.source_id)}</button>
            </div>
          </article>
        `).join("")}
      </div>
    </article>
  `;
}

function bindEvidenceDrawerLinks(body) {
  body.querySelectorAll("[data-evidence-source]").forEach((button) => {
    button.addEventListener("click", () => {
      app.evidenceFocusSourceId = button.dataset.evidenceSource;
      renderEvidenceDrawer();
      const updatedBody = $("#evidenceDrawerBody");
      const row = Array.from(updatedBody.querySelectorAll("[data-ledger-source-id]"))
        .find((item) => item.dataset.ledgerSourceId === app.evidenceFocusSourceId);
      row?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  });
}

function renderEvidenceDrawer() {
  const body = $("#evidenceDrawerBody");
  if (!body) return;
  const scenario = getStateBudgetScenario();
  body.innerHTML = `
    ${renderEvidenceReasonPanel()}
    <article class="content-card evidence-summary">
      <h3>Loaded demo methods</h3>
      <p>${escapeHtml(app.data.stateBudgets.status)}. ${escapeHtml(scenario.method)}</p>
      <div class="pill-row">
        <span class="pill status-synthetic">synthetic-working allocation model</span>
        <span class="pill status-working">FanDuel-owned governance source pass</span>
        <span class="pill status-review">paid SERP scoped</span>
      </div>
    </article>
    <div class="note-list">
      ${app.data.stateBudgets.caveats.map((note) => `<div class="note-item">${escapeHtml(note)}</div>`).join("")}
    </div>
    ${renderLedgerTab()}
  `;
  bindEvidenceDrawerLinks(body);
}

function renderCurve() {
  renderCurveSurface({
    titleSelector: "#curveTitle",
    readoutSelector: "#curveReadout",
    canvasSelector: "#curveCanvas",
    rangeSelector: "#spendRange",
    detailSelector: "#curveDetail"
  });
}

function renderFlightpathCurve() {
  renderCurveSurface({
    titleSelector: "#flightpathCurveTitle",
    readoutSelector: "#flightpathCurveReadout",
    canvasSelector: "#flightpathCurveCanvas",
    rangeSelector: "#flightpathSpendRange",
    detailSelector: "#flightpathCurveDetail"
  });
}

function renderCurveSurface({ titleSelector, readoutSelector, canvasSelector, rangeSelector, detailSelector }) {
  const title = $(titleSelector);
  const readout = $(readoutSelector);
  const range = $(rangeSelector);
  const canvas = $(canvasSelector);
  const detail = $(detailSelector);
  if (!title || !readout || !range || !canvas || !detail) return;
  const channel = app.data.curves.channels.find((item) => item.channel === app.selectedChannel);
  if (!channel) return;
  title.textContent = app.selectedChannel;
  range.value = String(app.spend);
  const stateLens = getCurveStateLens(app.curveStateLens);
  const maxSpend = Number(range.max || 2000000);
  const selectedPoint = getCurveResponsePoint(channel, app.spend);
  const maxPoint = getCurveResponsePoint(channel, maxSpend);
  const responseIndex = maxPoint.response > 0 ? (selectedPoint.response / maxPoint.response) * 100 : 0;
  const valueWeightedFtds = selectedPoint.ftds === null
    ? null
    : Math.round(selectedPoint.ftds * stateLens.valueMultiplier);
  const threshold = channel.external_shape_prior.soft_saturation_threshold_monthly_gbp;
  const categoryLabel = channel.external_shape_prior.category_label || "working_media";
  const confidence = channel.confidence || "not rated";
  const sourceIds = channel.source_ids || [];
  const currentInterpretation = channel.buyable === false
    ? "$0 planned; the control is an operational capacity what-if, not a media buy."
    : `${formatCurrency(app.spend)} monthly input; ${app.spend > threshold ? "beyond" : "before"} the ${formatCurrency(threshold)} soft-saturation point.`;
  readout.innerHTML = `
    <div class="curve-stat"><span>Monthly input</span><strong>${channel.buyable === false ? "$0 planned" : formatCurrency(app.spend)}</strong></div>
    <div class="curve-stat"><span>Response index</span><strong>${responseIndex.toFixed(1)}</strong><small>Relative to this displayed range; not incremental reach.</small></div>
    <div class="curve-stat"><span>${channel.buyable === false ? "Buyability" : "Marginal CPA proxy"}</span><strong>${channel.buyable === false ? "Non-buyable" : formatCurrency(selectedPoint.cpa)}</strong></div>
    <div class="curve-stat"><span>FTD proxy</span><strong>${selectedPoint.ftds === null ? "Not modelled" : formatNumber(Math.round(selectedPoint.ftds))}</strong></div>
    <div class="curve-stat state-lens-stat">
      <span>${escapeHtml(stateLens.stateCode)} value lens</span>
      <strong>${valueWeightedFtds === null ? "Not modelled" : formatNumber(valueWeightedFtds)}</strong>
      <small>${escapeHtml(stateLens.label)}</small>
    </div>
  `;
  detail.innerHTML = `
    <div class="curve-method-grid">
      <article class="curve-method-item">
        <span>Provenance</span>
        <strong>${escapeHtml(channel.classification || "synthetic-working prior")}</strong>
        <p>${escapeHtml(confidence)} confidence · ${escapeHtml(categoryLabel)} · FanDuel MMM/platform reach not loaded.</p>
      </article>
      <article class="curve-method-item">
        <span>Curve</span>
        <strong>${escapeHtml(channel.curve.curve_type || "concave response prior")}</strong>
        <p>Uncertainty band ±${formatNumber(Number(channel.curve.confidence_band_pct || 0))}% around the working response shape.</p>
      </article>
      <article class="curve-method-item">
        <span>Current input</span>
        <strong>${escapeHtml(currentInterpretation)}</strong>
        <p>Soft saturation is a planning flag, not an exact optimal-spend claim.</p>
      </article>
      <article class="curve-method-item">
        <span>MMM / data anchor</span>
        <strong>${escapeHtml(channel.mmm_anchor?.summary || "No FanDuel MMM loaded.")}</strong>
        <p>Replace this prior with client MMM, platform delivery and incrementality evidence.</p>
      </article>
      <article class="curve-method-item">
        <span>External shape</span>
        <strong>${formatNumber(Number(channel.external_shape_prior.adstock_half_life_weeks || 0))} week carryover prior</strong>
        <p>${escapeHtml(cleanCurveNarrative(channel.external_shape_prior.summary || "No external-shape note loaded."))}</p>
      </article>
      <article class="curve-method-item">
        <span>Agree / conflict</span>
        <strong>${escapeHtml(channel.agree_conflict?.status || "working")}</strong>
        <p>${escapeHtml(channel.agree_conflict?.note || "No agreement/conflict note loaded.")}</p>
      </article>
    </div>
    <div class="curve-source-row" aria-label="Reach-curve source receipts">
      ${sourceIds.map((sourceId) => `<span class="curve-source-chip">${escapeHtml(sourceId)}</span>`).join("")}
    </div>
  `;
  drawCurve(channel, threshold, canvasSelector, rangeSelector);
}

function populateCurveStateSelect(selector) {
  const select = $(selector);
  if (!select) return;
  select.innerHTML = getCurveStateOptions()
    .map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`)
    .join("");
  if (![...select.options].some((option) => option.value === app.curveStateLens)) {
    app.curveStateLens = "live";
  }
  select.value = app.curveStateLens;
}

function getCurveStateOptions() {
  return [
    { value: "live", label: `All live ${productLabel(app.selectedProduct)} states` },
    { value: "all", label: "All states" },
    ...getStateRows().map((row) => ({ value: row.state_code, label: `${row.state_code} - ${row.state}` }))
  ];
}

function averageStateValueLens(stateCodes, fallbackLabel) {
  const rows = stateCodes
    .map((code) => getStateValueRow(code))
    .filter(Boolean);
  const valueIndex = rows.length
    ? rows.reduce((sum, row) => sum + Number(row.value_index || 100), 0) / rows.length
    : 100;
  return {
    stateCode: fallbackLabel,
    stateName: fallbackLabel,
    valueIndex,
    valueMultiplier: valueIndex / 100,
    label: `${fallbackLabel} average value index ${valueIndex.toFixed(1)} / ${formatNumber(rows.length)} working rows`,
    sourceId: "state_value_index_aggregate_working"
  };
}

function getCurveStateLens(stateCode) {
  if (stateCode === "live") {
    const liveCodes = getProductLiveStateCodes(app.selectedProduct);
    return averageStateValueLens(liveCodes, `All live ${productLabel(app.selectedProduct)}`);
  }
  if (stateCode === "all") {
    const allCodes = getStateRows().map((row) => row.state_code);
    return averageStateValueLens(allCodes, "All states");
  }
  const stateRow = getStateValueRow(stateCode);
  const stateName = stateRow?.state || getStateRows().find((row) => row.state_code === stateCode)?.state || stateCode || "Selected state";
  const valueIndex = Number(stateRow?.value_index || 100);
  return {
    stateCode: stateCode || "US",
    stateName,
    valueIndex,
    valueMultiplier: valueIndex / 100,
    label: stateRow
      ? `${stateName} value index ${valueIndex.toFixed(1)} / ${stateRow.status || "working-public-source"}`
      : `${stateName} uses neutral 100.0 value index / working fallback`,
    sourceId: stateRow?.source_id || "state_value_index_neutral_fallback"
  };
}

function estimateCpa(channel, spend) {
  const curve = channel.curve;
  const threshold = channel.external_shape_prior.soft_saturation_threshold_monthly_gbp;
  if (!threshold || spend <= threshold) {
    return curve.base_cpa_gbp;
  }
  const over = Math.min(spend / threshold, 2);
  const penalty = 1 + ((over - 1) * (curve.cpa_penalty_at_2x_threshold - 1));
  return Math.min(curve.base_cpa_gbp * penalty, curve.base_cpa_gbp * curve.cpa_penalty_cap);
}

function cleanCurveNarrative(value) {
  const sentences = String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/);
  const seen = new Set();
  return sentences
    .filter((sentence) => {
      const key = sentence.toLowerCase();
      if (!sentence || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(" ");
}

function getCurveResponsePoint(channel, spend) {
  const threshold = Number(channel.external_shape_prior?.soft_saturation_threshold_monthly_gbp || 1);
  if (channel.buyable === false || Number(channel.curve?.base_cpa_gbp || 0) <= 0) {
    return {
      spend,
      cpa: null,
      ftds: null,
      response: 1 - Math.exp(-Math.max(0, spend) / threshold)
    };
  }
  const cpa = estimateCpa(channel, spend);
  const ftds = cpa > 0 ? spend / cpa : 0;
  return { spend, cpa, ftds, response: ftds };
}

function drawCurve(channel, threshold, canvasSelector = "#curveCanvas", rangeSelector = "#spendRange") {
  const canvas = $(canvasSelector);
  if (!canvas) return;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const plot = { left: 58, right: width - 24, top: 34, bottom: height - 46 };
  const range = $(rangeSelector);
  const minSpend = Number(range?.min || 50000);
  const maxSpend = Number(range?.max || 2000000);
  const confidenceBand = Math.max(0, Number(channel.curve?.confidence_band_pct || 0)) / 100;
  const points = Array.from({ length: 65 }, (_, index) => {
    const spend = minSpend + ((maxSpend - minSpend) * index) / 64;
    return getCurveResponsePoint(channel, spend);
  });
  const maxResponse = Math.max(...points.map((point) => point.response), 1);
  const xForSpend = (spend) => plot.left + ((spend - minSpend) / (maxSpend - minSpend)) * (plot.right - plot.left);
  const yForResponse = (response) => plot.bottom - (Math.max(0, response) / maxResponse) * (plot.bottom - plot.top);

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#dce3ea";
  context.lineWidth = 1;

  for (let i = 0; i <= 4; i += 1) {
    const y = plot.top + ((plot.bottom - plot.top) * i) / 4;
    context.beginPath();
    context.moveTo(plot.left, y);
    context.lineTo(plot.right, y);
    context.stroke();
  }

  context.fillStyle = "rgba(18, 101, 230, 0.12)";
  context.beginPath();
  points.forEach((point, index) => {
    const uncertainty = maxResponse * confidenceBand * (0.22 + (index / (points.length - 1)) * 0.28);
    const x = xForSpend(point.spend);
    const y = yForResponse(Math.min(maxResponse, point.response + uncertainty));
    if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
  });
  [...points].reverse().forEach((point, reverseIndex) => {
    const index = points.length - reverseIndex - 1;
    const uncertainty = maxResponse * confidenceBand * (0.22 + (index / (points.length - 1)) * 0.28);
    context.lineTo(xForSpend(point.spend), yForResponse(Math.max(0, point.response - uncertainty)));
  });
  context.closePath();
  context.fill();

  context.strokeStyle = "#1265e6";
  context.lineWidth = 3;
  context.beginPath();
  points.forEach((point, index) => {
    const x = xForSpend(point.spend);
    const y = yForResponse(point.response);
    if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
  });
  context.stroke();

  if (threshold) {
    const clampedThreshold = Math.max(minSpend, Math.min(maxSpend, threshold));
    const thresholdX = xForSpend(clampedThreshold);
    context.strokeStyle = "#b35a00";
    context.setLineDash([5, 5]);
    context.beginPath();
    context.moveTo(thresholdX, plot.top);
    context.lineTo(thresholdX, plot.bottom);
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = "#8b4a00";
    context.font = "11px Inter, Arial, sans-serif";
    context.fillText("soft saturation", Math.min(plot.right - 90, thresholdX + 7), plot.top + 13);
    context.fillText(formatCurrency(threshold), Math.max(plot.left, thresholdX - 34), plot.bottom + 18);
  }

  const selectedSpend = Math.max(minSpend, Math.min(maxSpend, app.spend));
  const selectedPoint = getCurveResponsePoint(channel, selectedSpend);
  const selectedX = xForSpend(selectedSpend);
  const selectedY = yForResponse(selectedPoint.response);
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#1265e6";
  context.lineWidth = 3;
  context.beginPath();
  context.arc(selectedX, selectedY, 5, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.fillStyle = "#1265e6";
  context.font = "700 11px Inter, Arial, sans-serif";
  context.fillText("selected", Math.min(plot.right - 48, selectedX + 8), Math.max(plot.top + 12, selectedY - 8));

  context.fillStyle = "#53606b";
  context.font = "600 10px Inter, Arial, sans-serif";
  context.fillText("Response index", 12, 18);
  context.fillText("100", 28, plot.top + 3);
  context.fillText("0", 42, plot.bottom + 3);
  context.fillText(formatCurrency(minSpend), plot.left, height - 13);
  context.fillText(formatCurrency(maxSpend), plot.right - 46, height - 13);
  context.fillText("Monthly input", plot.right - 66, height - 29);
}

function renderSearchTab() {
  const search = app.data.search;
  const paidSerp = getPaidSerpSummary();
  const plan = getPlan();
  const paid = plan.channel_totals.find((channel) => channel.channel === "Paid Search");
  const organic = plan.channel_totals.find((channel) => channel.channel === "Organic Search");
  return `
    <div class="content-grid">
      <article class="content-card">
        <span class="big-number">${formatNumber(search.organic_keywords_count)}</span>
        <h3>Organic keywords</h3>
        <p>${escapeHtml(organic.response_curve.conflict_note)}</p>
        <div class="pill-row"><span class="pill status-client-safe">client-safe signal</span></div>
      </article>
      <article class="content-card">
        <span class="big-number">${formatNumber(paidSerp.totalRows || search.paid_keywords_count)}</span>
        <h3>Paid keywords captured</h3>
        <p>${escapeHtml(search.paid_serp_summary || paid.response_curve.conflict_note)}</p>
        <div class="pill-row"><span class="pill status-working">DataForSEO observed</span><span class="pill status-review">not efficiency evidence</span></div>
      </article>
      <article class="content-card">
        <span class="big-number">${escapeHtml(search.brand_coverage_signal)}</span>
        <h3>Brand coverage signal</h3>
        <p>Used as an evidence gap for the Stage 1 search POC, not as a final investment finding.</p>
        <div class="pill-row"><span class="pill watermark">working interpretation</span></div>
      </article>
    </div>
    <div class="content-grid two" style="margin-top:12px">
      <article class="content-card">
        <h3>Keyword universe</h3>
        <div class="keyword-wrap">
          ${search.keyword_seed_clusters.map((keyword) => `<span class="keyword">${escapeHtml(keyword)}</span>`).join("")}
        </div>
      </article>
      <article class="content-card">
        <h3>POC evidence protocol</h3>
        <div class="note-list">
          ${search.demo_use.map((item) => `<div class="note-item">${escapeHtml(item)}</div>`).join("")}
          ${search.next_data_needed.map((item) => `<div class="note-item">${escapeHtml(item)}</div>`).join("")}
        </div>
      </article>
    </div>
    <div class="content-grid two" style="margin-top:12px">
      <article class="content-card">
        <h3>Observed sportsbook ads</h3>
        <div class="insight-query-list">${paidSerp.sportsbookRows.slice(0, 8).map(renderPaidSerpObservation).join("") || `<div class="note-item">No sportsbook-relevant paid rows were observed.</div>`}</div>
      </article>
      <article class="content-card">
        <h3>Provider boundary</h3>
        <div class="note-list">
          <div class="note-item">Latest observed row: ${escapeHtml(paidSerp.latestObservedAt || "not supplied")}.</div>
          <div class="note-item">FanDuel's observed rows promote FDTVx streaming, not sportsbook acquisition. They are visible evidence but excluded from sportsbook conclusions.</div>
          <div class="note-item">Zero rows for a domain means none were returned by this DataForSEO snapshot; it does not prove the advertiser was inactive.</div>
        </div>
      </article>
    </div>
  `;
}

function renderCompetitionTab() {
  const momentum = app.data.momentum;
  const trends = Object.entries(momentum.national_trend_strength_index).sort((a, b) => b[1] - a[1]);
  const ownBaseline = Object.entries(momentum.own_baseline_momentum_index || {}).sort((a, b) => b[1] - a[1]);
  const method = momentum.national_trend_comparative_method;
  return `
    <div class="content-grid two">
      <article class="content-card">
        <h3>${escapeHtml(method?.label || "Search interest comparative index")}</h3>
        <div class="keyword-list">
          ${trends
            .map(([brand, value]) => `
              <div class="trend-row">
                <span>${escapeHtml(brand)}</span>
                <div class="bar-track"><div class="trend-fill" style="width:${value}%"></div></div>
                <span>${value}</span>
              </div>
            `)
            .join("")}
        </div>
        <div class="pill-row">
          <span class="pill status-working">${escapeHtml(method?.calculation || "Comparative Google Trends method")}</span>
        </div>
      </article>
      <article class="content-card">
        <h3>Top FanDuel state interest</h3>
        <div class="state-list">
          ${momentum.top_fanduel_state_interest
            .map((state) => `
              <div class="state-row">
                <span>${escapeHtml(state.state_code)}</span>
                <div class="bar-track"><div class="state-fill" style="width:${state.index}%"></div></div>
                <span>${state.index}</span>
              </div>
            `)
            .join("")}
        </div>
      </article>
    </div>
    <div class="content-grid" style="margin-top:12px">
      ${
        ownBaseline.length
          ? `<article class="content-card">
              <h3>Own-baseline momentum</h3>
              <p>Kept separate because these values came from individual keyword pulls and are not cross-brand comparable.</p>
              <div class="pill-row">
                ${ownBaseline.map(([brand, value]) => `<span class="pill">${escapeHtml(brand)} ${escapeHtml(value)}</span>`).join("")}
              </div>
            </article>`
          : ""
      }
      ${momentum.sourced_news_signals
        .map((news) => `
          <article class="news-row">
            <h3>${escapeHtml(news.title)}</h3>
            <p>${escapeHtml(news.source_label)}</p>
            <div class="pill-row"><span class="pill status-client-safe">${escapeHtml(news.demo_use)}</span></div>
          </article>
        `)
        .join("")}
    </div>
  `;
}

function renderAudienceTab() {
  const personas = app.data.personas.personas;
  return `
    <div class="content-grid">
      ${personas
        .map((persona) => {
          const isSelected = persona.state_codes.includes(app.selectedState);
          const size = persona.segment_size_proxy.value;
          const status = persona.segment_size_proxy.status;
          return `
            <article class="persona-row" style="${isSelected ? "border-color:#1265e6" : ""}">
              <p class="eyebrow">${escapeHtml(persona.primary_state)}</p>
              <h3>${escapeHtml(persona.label)}</h3>
              <span class="big-number">${formatNumber(size)}</span>
              <p>${escapeHtml(persona.market_role)}</p>
              <div class="pill-row">
                <span class="pill watermark">${escapeHtml(status)} segment proxy</span>
                ${persona.recommended_demo_channels.slice(0, 4).map((channel) => `<span class="pill">${escapeHtml(channel)}</span>`).join("")}
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderPersonaOwnerBoard() {
  const personas = app.data.personas.personas || [];
  return `
    <div class="insight-board">
      <div class="insight-board-row insight-board-header">
        <span>Persona</span>
        <span>State lens</span>
        <span>Recommended channels</span>
        <span>Likely owners</span>
      </div>
      ${personas.map((persona) => {
        const channels = (persona.recommended_demo_channels || []).slice(0, 3);
        const owners = channels.flatMap((channel) => getOwnersForChannel(channel).slice(0, 2).map((owner) => `${owner.owner} (${owner.default_split_pct}%)`));
        return `
          <div class="insight-board-row">
            <span><strong>${escapeHtml(persona.label)}</strong><small>${escapeHtml(persona.market_role)}</small></span>
            <span>${escapeHtml(persona.state_codes?.join(", ") || persona.primary_state)}</span>
            <span>${escapeHtml(channels.join(", ") || "not wired")}</span>
            <span>${escapeHtml(owners.join("; ") || "owner split pending")}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderRegulationOwnerBoard() {
  const scenario = getStateBudgetScenario();
  const topStates = [...(scenario.states || [])]
    .filter((row) => Number(row.budget_usd_equivalent || 0) > 0)
    .sort((a, b) => b.budget_usd_equivalent - a.budget_usd_equivalent)
    .slice(0, 10);
  const topChannels = [...(getPlan().channel_totals || [])].sort((a, b) => b.budget_gbp - a.budget_gbp).slice(0, 3);
  return `
    <div class="insight-board">
      <div class="insight-board-row insight-board-header">
        <span>State</span>
        <span>Regulation</span>
        <span>Value index</span>
        <span>Owner push</span>
      </div>
      ${topStates.map((state) => {
        const governanceRow = app.data.governance.state_rows.find((row) => row.state_code === state.state_code);
        const status = governanceRow ? getProductStatus(governanceRow, app.selectedProduct) : state.governance_status;
        const valueRow = getStateValueRow(state.state_code);
        const owners = topChannels.flatMap((channel) => getOwnersForChannel(channel.channel).slice(0, 1).map((owner) => owner.owner));
        return `
          <div class="insight-board-row">
            <span><strong>${escapeHtml(state.state_code)}</strong><small>${escapeHtml(state.state)}</small></span>
            <span>${escapeHtml(formatStatus(status))}</span>
            <span>${escapeHtml(valueRow?.value_index?.toFixed ? valueRow.value_index.toFixed(1) : "n/a")}</span>
            <span>${escapeHtml([...new Set(owners)].join(", ") || "owner pending")}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function getOwnersForChannel(channel) {
  return (app.data.mediaOwners?.owners || []).filter((owner) => owner.channel === channel);
}

function renderMediaOwnerVerificationBoard() {
  const channels = [...new Set((app.data.mediaOwners.owners || []).map((owner) => owner.channel))].sort();
  return `
    <div class="content-grid two">
      <article class="content-card">
        <span class="big-number">${formatNumber(app.data.mediaOwners.owners.length)}</span>
        <h3>Owner rows loaded</h3>
        <p>Current owner splits are demo priors. T185 primary policy receipts are still missing, so no row is eligible for a client-visible partner recommendation or plan allocation.</p>
        <div class="pill-row">
          <span class="pill status-synthetic">synthetic owner priors</span>
          <span class="pill status-review">T093 gate result: 0 verified</span>
          <span class="pill status-review">T185 required</span>
        </div>
      </article>
      <article class="content-card">
        <h3>Channels covered</h3>
        <div class="keyword-wrap">
          ${channels.map((channel) => `<span class="keyword">${escapeHtml(channel)}</span>`).join("")}
        </div>
      </article>
    </div>
  `;
}

function renderLedgerTab() {
  const plan = getPlan();
  const row = getSelectedStateRow();
  const selectedRule = getProductRule(row);
  const sources = new Set();
  plan.channel_totals.forEach((channel) => {
    [
      ...(channel.response_curve?.source_ids || []),
      ...(channel.source_ids || [])
    ].forEach((sourceId) => sources.add(sourceId));
  });
  (getPlanMeta()?.source_ids || []).forEach((sourceId) => sources.add(sourceId));
  getEvidenceReasons().forEach((reason) => sources.add(reason.source_id));
  sources.add("sig_scan_fanduel_us_2026_07_03");
  sources.add("fanduel_trends_comparative_index_2026_07_03");
  sources.add("predict_persona_seeds_working_2026_07_03");
  sources.add("us_state_governance_working_research_2026_07_03");
  sources.add("fanduel_sportsbook_predicts_map");
  sources.add("fanduel_casino_states");
  sources.add("fanduel_fantasy_rules");
  sources.add("fanduel_predicts_nationwide");
  sources.add("us_census_nst_est2025_population");
  sources.add("signal_us_zip3_map_working_2026_07_03");
  sources.add("fanduel_draw_calendar_2026");
  sources.add("fanduel_marketing_spend_baseline_2026");
  sources.add("fanduel_zip3_product_media_estimates_2026");
  sources.add("fanduel_plan_store_manifest_v1");
  sources.add("fanduel_sde_actuals_manifest_v1");
  sources.add("fanduel_sde_history_plan_v1");
  sources.add("fanduel_reporting_line_items_2026");
  sources.add("fanduel_sde_promo_cost_model_2026");
  sources.add("fanduel_sde_responsible_gambling_share_2026");
  sources.add("caspr_state_gambling_tax_scorecard_2026");
  sources.add("nj_dge_specific_taxes_2025");
  sources.add("michigan_mgcb_wagering_tax_2026");

  const sourceRows = [...sources].map((sourceId) => {
    const source = SOURCE_REGISTRY[sourceId] || {
      label: sourceId,
      status: "working source",
      note: "Loaded from planner output."
    };
    return renderLedgerRow(sourceId, source);
  });

  const selectedReceipt = selectedRule
    ? `
      <article class="ledger-row ${app.evidenceFocusSourceId === selectedRule.source_id ? "is-highlighted" : ""}" data-ledger-source-id="${escapeHtml(selectedRule.source_id)}">
        <h3>${escapeHtml(row.state)} ${escapeHtml(productLabel(app.selectedProduct))} receipt</h3>
        <p>${escapeHtml(selectedRule.source_label)}. ${escapeHtml(formatStatus(selectedRule.planning_status))}. Source date: ${escapeHtml(selectedRule.source_date)}.</p>
        <div class="pill-row">
          <span class="pill status-working">${escapeHtml(selectedRule.review_status)}</span>
          <span class="pill">${escapeHtml(selectedRule.regulator)}</span>
          <a class="source-link" href="${escapeHtml(selectedRule.source_url)}" target="_blank" rel="noreferrer">${escapeHtml(selectedRule.source_id)}</a>
        </div>
      </article>
    `
    : "";

  const governanceLinks = `${selectedReceipt}${app.data.governance.sources
    .map((source) => `
      <article class="ledger-row ${app.evidenceFocusSourceId === source.source_id ? "is-highlighted" : ""}" data-ledger-source-id="${escapeHtml(source.source_id)}">
        <h3>${escapeHtml(source.label)}</h3>
        <p>${escapeHtml(app.data.governance.source_scope)}. Source date: ${escapeHtml(app.data.governance.source_date)}.</p>
        <div class="pill-row">
          <span class="pill status-working">working source</span>
          <a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.source_id)}</a>
        </div>
      </article>
    `)
    .join("")}`;

  return `
    <div class="content-grid two">
      <article class="content-card">
        <h3>Plan source ledger</h3>
        <div class="ledger-list">${sourceRows.join("")}</div>
      </article>
      <article class="content-card">
        <h3>FanDuel-owned governance receipts</h3>
        <div class="ledger-list">${governanceLinks}</div>
      </article>
    </div>
  `;
}

function renderLedgerRow(sourceId, source) {
  return `
    <article class="ledger-row ${app.evidenceFocusSourceId === sourceId ? "is-highlighted" : ""}" data-ledger-source-id="${escapeHtml(sourceId)}">
      <h3>${escapeHtml(source.label)}</h3>
      <p>${escapeHtml(source.note)}</p>
      <div class="pill-row">
        <span class="pill ${statusPillClass(source.status)}">${escapeHtml(source.status)}</span>
        <span class="pill">${escapeHtml(sourceId)}</span>
      </div>
    </article>
  `;
}

function evidenceClass(evidenceStrength) {
  if (evidenceStrength === "client-safe-signal") {
    return "client-safe";
  }
  if (evidenceStrength === "missing-paid-serp") {
    return "missing";
  }
  if (evidenceStrength === "synthetic-demo") {
    return "synthetic";
  }
  return "";
}

function statusPillClass(status) {
  const value = String(status || "").toLowerCase();
  if (value.includes("client-safe")) {
    return "status-client-safe";
  }
  if (value.includes("synthetic")) {
    return "status-synthetic";
  }
  if (value.includes("missing")) {
    return "status-missing";
  }
  if (value.includes("legal")) {
    return "status-review";
  }
  return "status-working";
}

function statusClass(status) {
  return String(status || "unknown").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

function formatStatus(status) {
  return String(status || "unknown")
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatCurrency(value) {
  const number = Number(value || 0);
  if (number >= 1000000000) {
    const decimals = number % 1000000000 === 0 ? 0 : number % 100000000 === 0 ? 1 : 2;
    return `$${(number / 1000000000).toFixed(decimals)}B`;
  }
  if (number >= 1000000) {
    return `$${(number / 1000000).toFixed(number % 1000000 === 0 ? 0 : 1)}M`;
  }
  if (number >= 1000) {
    return `$${Math.round(number / 1000)}K`;
  }
  return `$${Math.round(number)}`;
}

function formatSignedCurrency(value) {
  const number = Number(value || 0);
  if (number > 0) return `+${formatCurrency(number)}`;
  if (number < 0) return `-${formatCurrency(Math.abs(number))}`;
  return "$0";
}

function formatMoney(value, decimals = 2) {
  return `$${Number(value || 0).toFixed(decimals)}`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(Number(value || 0)));
}

function formatCompactNumber(value) {
  const number = Number(value || 0);
  if (number >= 1000000000) {
    return `${(number / 1000000000).toFixed(1)}B`;
  }
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return formatNumber(number);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
