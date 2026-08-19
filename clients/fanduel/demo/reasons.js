(function () {
  const STATUS = {
    working: "working source",
    synthetic: "synthetic demo",
    modelled: "modelled-working",
    governance: "FanDuel-owned source",
    review: "legal review"
  };

  const CHANNEL_ROLE = {
    "Paid Search": "demand capture",
    "Organic Search": "owned demand",
    "Paid Social": "prospecting and retargeting",
    Affiliate: "comparison and offer intent",
    Display: "programmatic support",
    YouTube: "sports video reach",
    CTV: "sports-viewing household reach",
    "Linear TV": "tentpole reach",
    "Radio/Audio": "local sports context",
    CRM: "owned audience activation",
    "App Store": "app-intent capture",
    "Influencer/Creator": "creator trust"
  };

  function fmtNumber(value) {
    const number = Number(value || 0);
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(number);
  }

  function fmtCurrency(value) {
    const number = Number(value || 0);
    if (number >= 1000000000) return `$${(number / 1000000000).toFixed(2)}B`;
    if (number >= 1000000) return `$${(number / 1000000).toFixed(1)}M`;
    if (number >= 1000) return `$${(number / 1000).toFixed(0)}K`;
    return `$${Math.round(number)}`;
  }

  function formatStatus(status) {
    return String(status || "unknown")
      .split(/[-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  function productLabel(productKey) {
    return {
      sportsbook: "Sportsbook",
      casino: "Casino",
      predicts: "Predicts",
      dfs: "DFS"
    }[productKey] || productKey || "Product";
  }

  function findStateRow(data, stateCode) {
    return data?.governance?.state_rows?.find((row) => row.state_code === stateCode);
  }

  function findProductRule(stateRow, productKey) {
    return stateRow?.rules?.find((rule) => rule.product_key === productKey);
  }

  function findPersona(data, stateCode) {
    return data?.personas?.personas?.find((persona) => persona.state_codes?.includes(stateCode));
  }

  function findActualRow(data, month, channel) {
    return data?.actualsMonthly?.rows?.find((row) => row.month === month && row.channel === channel);
  }

  function findCalendarDraw(data, month) {
    return data?.calendar?.draws?.find((draw) => draw.month === month);
  }

  function findMonthHeat(data, month) {
    const rows = (data?.fixtureDailyHeat?.rows || []).filter((row) => row.month === month);
    if (!rows.length) return null;
    const peak = [...rows].sort((a, b) => Number(b.heat_score || 0) - Number(a.heat_score || 0) || a.date.localeCompare(b.date))[0];
    const fixtureCount = rows.reduce((sum, row) => sum + Number(row.fixture_count || 0), 0);
    const periodStart = `${month}-01`;
    const [year, monthNumber] = String(month).split("-").map(Number);
    const periodEnd = new Date(Date.UTC(year, monthNumber, 0)).toISOString().slice(0, 10);
    const periods = (data?.fixtureKeyPeriods?.periods || [])
      .filter((period) => period.start_date <= periodEnd && period.end_date >= periodStart)
      .sort((a, b) => Number(b.peak_heat_score || 0) - Number(a.peak_heat_score || 0));
    return { peak, fixtureCount, periods };
  }

  function modifierApplies(rule, month, channel) {
    const suffix = String(month || "").slice(4);
    const when = rule.when || {};
    const monthMatches = when.month_suffix === suffix
      || (Array.isArray(when.month_suffix_in) && when.month_suffix_in.includes(suffix));
    const channelMatches = !channel || (rule.channels || []).includes(channel);
    return monthMatches && channelMatches;
  }

  function findCalendarModifier(data, month, channel) {
    return (data?.calendarModifiers?.rules || []).find((rule) => modifierApplies(rule, month, channel));
  }

  function findOwners(data, channel) {
    return (data?.mediaOwners?.owners || []).filter((owner) => owner.channel === channel);
  }

  function buildGovernanceReason(data, context) {
    if (context.stateCode === "US") {
      return {
        type: "governance",
        text: `National ${productLabel(context.productKey)} planning uses the loaded product-state matrix first, then routes state-specific claims to legal review.`,
        source_id: "us_state_governance_working_research_2026_07_03",
        status: STATUS.working
      };
    }
    const row = findStateRow(data, context.stateCode);
    if (!row) {
      return {
        type: "governance",
        text: `${context.stateCode || "Selected state"} has no loaded governance row, so activation should pause until a receipt exists.`,
        source_id: "us_state_governance_working_research_2026_07_03",
        status: STATUS.working
      };
    }
    const rule = findProductRule(row, context.productKey);
    const status = row[`${context.productKey}_status`] || rule?.planning_status || "unknown";
    const action = rule?.planning_action || row.planning_action || "Route state/product claims to review.";
    return {
      type: "governance",
      text: `${row.state} ${productLabel(context.productKey)} status is ${formatStatus(status)}. ${action}`,
      source_id: rule?.source_id || "us_state_governance_working_research_2026_07_03",
      status: rule?.review_status || STATUS.governance
    };
  }

  function buildPersonaReason(data, context) {
    if (context.stateCode === "US") {
      return {
        type: "persona",
        text: "National planning uses persona seeds as directional audience evidence only; drill into a state before making a state-specific audience claim.",
        source_id: "predict_persona_seeds_working_2026_07_03",
        status: STATUS.working
      };
    }
    const persona = findPersona(data, context.stateCode);
    if (!persona) {
      return {
        type: "persona",
        text: `${context.stateCode || "The selected state"} has no wired persona seed yet; use the state-budget model and receipts only.`,
        source_id: "predict_persona_seeds_working_2026_07_03",
        status: STATUS.working
      };
    }
    const recommended = persona.recommended_demo_channels || [];
    const suppressed = persona.suppressed_demo_channels || [];
    const segment = persona.segment_size_proxy || {};
    const prefix = `${persona.primary_state} ${persona.label}`;
    if (recommended.includes(context.channel)) {
      return {
        type: "persona",
        text: `${prefix} includes ${context.channel} as a recommended demo channel for ${persona.market_role}; segment proxy ${fmtNumber(segment.value)} (${segment.status || "working"}).`,
        source_id: "predict_persona_seeds_working_2026_07_03",
        status: segment.status || STATUS.working
      };
    }
    if (suppressed.includes(context.channel)) {
      return {
        type: "persona",
        text: `${prefix} suppresses ${context.channel}; use watchlist or owned routes unless compliance signs off.`,
        source_id: "predict_persona_seeds_working_2026_07_03",
        status: STATUS.review
      };
    }
    return {
      type: "persona",
      text: `${prefix} is wired for ${recommended.join(", ") || "no selected demo channels"}; ${context.channel} is a neutral support line, not a persona-led over-index.`,
      source_id: "predict_persona_seeds_working_2026_07_03",
      status: segment.status || STATUS.working
    };
  }

  function buildOwnerReason(data, context) {
    const owners = findOwners(data, context.channel);
    if (!owners.length) {
      return {
        type: "owner",
        text: `${context.channel} has no loaded media-owner split yet; keep this as an execution gap.`,
        source_id: "fanduel_demo_media_owner_priors_2026",
        status: STATUS.synthetic
      };
    }
    const ownerCopy = owners
      .slice(0, 3)
      .map((owner) => `${owner.owner} ${owner.default_split_pct}% (${owner.role})`)
      .join("; ");
    return {
      type: "owner",
      text: `${context.channel} owner mix: ${ownerCopy}. Confidence is ${owners[0].confidence || "low"}.`,
      source_id: "fanduel_demo_media_owner_priors_2026",
      status: STATUS.synthetic
    };
  }

  function buildCalendarReason(data, context) {
    const heat = findMonthHeat(data, context.month);
    if (heat) {
      const modifier = findCalendarModifier(data, context.month, context.channel);
      const periodText = heat.periods.length
        ? heat.periods.slice(0, 2).map((period) => period.label).join(" + ")
        : `${heat.peak.heat_band || "fixture"} month`;
      const liftText = modifier
        ? ` The generated calendar modifier adds +${Math.round(Number(modifier.add || 0) * 100)}% to ${context.channel} for this window.`
        : "";
      return {
        type: "calendar",
        text: `${periodText}: fixture heat peaks at ${Math.round(Number(heat.peak.heat_score || 0))} on ${heat.peak.date}, with ${fmtNumber(heat.fixtureCount)} fixture objects in the month.${liftText}`,
        source_id: modifier ? "fanduel_calendar_modifiers_v1" : "fanduel_fixture_heat_model_v1",
        status: STATUS.modelled
      };
    }
    const draw = findCalendarDraw(data, context.month);
    if (!draw) {
      return {
        type: "calendar",
        text: `${context.month || "Selected month"} has no loaded sports-calendar modifier.`,
        source_id: "fanduel_draw_calendar_2026",
        status: STATUS.working
      };
    }
    const role = CHANNEL_ROLE[context.channel] || "planning";
    const lift = draw.weight >= 1 ? `+${Math.round((draw.weight - 1) * 100)}%` : `${Math.round((draw.weight - 1) * 100)}%`;
    return {
      type: "calendar",
      text: `${draw.event_note} sets the ${context.month} planning weight to ${draw.weight} (${lift} vs baseline); ${context.channel} is used for ${role}.`,
      source_id: "fanduel_draw_calendar_2026",
      status: STATUS.working
    };
  }

  function buildBenchmarkReason(data, context) {
    const row = findActualRow(data, context.month, context.channel);
    if (!row) {
      return {
        type: "benchmark",
        text: `${context.channel} ${context.month} is not in the compact SDE bridge; use plan-store receipts only.`,
        source_id: "fanduel_plan_store_manifest_v1",
        status: STATUS.working
      };
    }
    if (row.line_type === "non_buyable_demand" || row.buyable === false) {
      return {
        type: "benchmark",
        text: `${context.channel} is a non-buyable demand line: ${fmtNumber(row.planned_conversions)} FTD proxy with ${fmtCurrency(row.planned_spend)} media spend.`,
        source_id: "fanduel_sde_actuals_manifest_v1",
        status: row.display_flag || STATUS.synthetic
      };
    }
    const hasActual = Number(row.actual_spend || 0) > 0;
    return {
      type: "benchmark",
      text: hasActual
        ? `SDE actual row: ${fmtCurrency(row.actual_spend)} actual vs ${fmtCurrency(row.planned_spend)} plan; delivery index ${Number(row.delivery_index || 0).toFixed(2)}, sales index ${Number(row.sales_index || 0).toFixed(2)}.`
        : `SDE forward plan row: ${fmtCurrency(row.planned_spend)} planned media and ${fmtNumber(row.planned_conversions)} FTD proxy.`,
      source_id: "fanduel_sde_actuals_manifest_v1",
      status: row.display_flag || STATUS.synthetic
    };
  }

  function buildReasons(input) {
    const data = input.appData || {};
    const context = {
      month: input.month,
      channel: input.channel || "Paid Search",
      stateCode: input.stateCode || "US",
      productKey: input.productKey || "sportsbook"
    };
    return [
      buildCalendarReason(data, context),
      buildPersonaReason(data, context),
      buildOwnerReason(data, context),
      buildGovernanceReason(data, context),
      buildBenchmarkReason(data, context)
    ].filter(Boolean);
  }

  window.FanDuelReasons = { buildReasons };
}());
