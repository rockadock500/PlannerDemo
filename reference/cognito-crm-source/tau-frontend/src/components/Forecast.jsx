import React, { useState, useEffect } from 'react';
import { getForecastSummary, getForecastTimeline, getForecastQuarterly, getErrorMessage } from '../api';
import { TrendingUp, Calendar, BarChart3, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const STAGES = ['Initial', 'Engaged', 'Proposal', 'Verbal', 'Signed'];
const STAGE_COLORS = {
    'Initial': 'bg-blue-100 text-blue-700 border-blue-200',
    'Engaged': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Proposal': 'bg-purple-100 text-purple-700 border-purple-200',
    'Verbal': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
    'Signed': 'bg-green-100 text-green-700 border-green-200'
};

const Forecast = () => {
    const [summary, setSummary] = useState(null);
    const [timeline, setTimeline] = useState(null);
    const [quarterly, setQuarterly] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('quarterly'); // 'quarterly' or 'monthly'
    const [expandedPeriod, setExpandedPeriod] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [summaryData, timelineData, quarterlyData] = await Promise.all([
                getForecastSummary(),
                getForecastTimeline(12),
                getForecastQuarterly()
            ]);
            setSummary(summaryData);
            setTimeline(timelineData);
            setQuarterly(quarterlyData);
        } catch (e) {
            console.error(e);
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center h-full">
                <div className="animate-pulse text-slate-400">Loading forecast data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                    <button onClick={fetchData} className="ml-auto px-3 py-1 bg-red-100 rounded hover:bg-red-200">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const formatCurrency = (value) => `£${(value || 0).toLocaleString()}`;

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="px-6 py-4 bg-white/40 backdrop-blur-sm border-b border-white/50 sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            <TrendingUp className="text-indigo-600" size={24} />
                            Revenue Forecast
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Weighted pipeline projections and income timeline</p>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setView('quarterly')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'quarterly'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Quarterly
                        </button>
                        <button
                            onClick={() => setView('monthly')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'monthly'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Total Pipeline
                        </div>
                        <div className="text-3xl font-black text-slate-800">
                            {formatCurrency(summary?.total_pipeline_value)}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Across all stages</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 shadow-lg text-white">
                        <div className="text-xs font-bold text-indigo-100 uppercase tracking-wider mb-1">
                            Weighted Pipeline
                        </div>
                        <div className="text-3xl font-black">
                            {formatCurrency(summary?.total_weighted_value)}
                        </div>
                        <div className="text-xs text-indigo-200 mt-1">Probability-adjusted value</div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            12-Month Forecast
                        </div>
                        <div className="text-3xl font-black text-emerald-600">
                            {formatCurrency(timeline?.total_forecast)}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Expected weighted income</div>
                    </div>
                </div>

                {/* Stage Breakdown */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <BarChart3 size={18} className="text-indigo-500" />
                        Pipeline by Stage
                    </h3>
                    <div className="grid grid-cols-5 gap-3">
                        {STAGES.map(stage => {
                            const stageData = summary?.by_stage?.[stage] || { count: 0, value: 0, weighted_value: 0, probability: 0 };
                            const maxValue = Math.max(...Object.values(summary?.by_stage || {}).map(s => s.value || 0), 1);
                            const barWidth = (stageData.value / maxValue) * 100;

                            return (
                                <div key={stage} className={`p-3 rounded-lg border ${STAGE_COLORS[stage]}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-xs font-bold uppercase">{stage}</div>
                                        <div className="text-xs font-bold bg-white/50 px-1.5 py-0.5 rounded">
                                            {Math.round(stageData.probability * 100)}%
                                        </div>
                                    </div>
                                    <div className="text-lg font-black">{formatCurrency(stageData.value)}</div>
                                    <div className="text-xs opacity-75">W: {formatCurrency(stageData.weighted_value)}</div>
                                    <div className="text-xs mt-1">{stageData.count} deals</div>
                                    <div className="mt-2 h-1 bg-white/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-current opacity-50 rounded-full transition-all duration-500"
                                            style={{ width: `${barWidth}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Timeline View */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-indigo-500" />
                        {view === 'quarterly' ? 'Quarterly Forecast' : 'Monthly Timeline'}
                    </h3>

                    {view === 'quarterly' ? (
                        <div className="space-y-3">
                            {quarterly?.quarters?.map((quarter) => (
                                <div key={quarter.period} className="border border-slate-100 rounded-lg overflow-hidden">
                                    <div
                                        className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                                        onClick={() => setExpandedPeriod(expandedPeriod === quarter.period ? null : quarter.period)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-lg font-bold text-slate-700">{quarter.period}</div>
                                            <div className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">
                                                {quarter.opportunity_count} deals
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm text-slate-400">Total</div>
                                                <div className="text-lg font-bold text-slate-700">{formatCurrency(quarter.total_value)}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-slate-400">Weighted</div>
                                                <div className="text-lg font-bold text-indigo-600">{formatCurrency(quarter.weighted_value)}</div>
                                            </div>
                                            {expandedPeriod === quarter.period ? (
                                                <ChevronUp size={20} className="text-slate-400" />
                                            ) : (
                                                <ChevronDown size={20} className="text-slate-400" />
                                            )}
                                        </div>
                                    </div>
                                    {expandedPeriod === quarter.period && quarter.opportunities?.length > 0 && (
                                        <div className="border-t border-slate-100 p-4 space-y-2">
                                            {quarter.opportunities.map((opp, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${STAGE_COLORS[opp.stage]}`}>
                                                            {opp.stage}
                                                        </span>
                                                        <span className="font-medium text-slate-700">{opp.name}</span>
                                                        {opp.company && (
                                                            <span className="text-xs text-slate-400">{opp.company}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <span className="text-slate-500">{formatCurrency(opp.value)}</span>
                                                        <span className="font-bold text-indigo-600">{formatCurrency(opp.weighted_value)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {(!quarterly?.quarters || quarterly.quarters.length === 0) && (
                                <div className="text-center py-8 text-slate-400">
                                    No forecast data available. Add expected start dates to opportunities.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {timeline?.timeline?.map((month) => {
                                const maxWeighted = Math.max(...(timeline.timeline?.map(m => m.weighted_value) || [1]));
                                const barWidth = (month.weighted_value / maxWeighted) * 100;

                                return (
                                    <div key={month.period} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                        <div className="w-20 text-sm font-bold text-slate-600">{month.period}</div>
                                        <div className="flex-1">
                                            <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                                                    style={{ width: `${Math.max(barWidth, 10)}%` }}
                                                >
                                                    {barWidth > 30 && (
                                                        <span className="text-xs text-white font-bold">
                                                            {formatCurrency(month.weighted_value)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-32 text-right">
                                            <div className="text-sm font-bold text-indigo-600">{formatCurrency(month.weighted_value)}</div>
                                            <div className="text-xs text-slate-400">{month.opportunity_count} deals</div>
                                        </div>
                                    </div>
                                );
                            })}
                            {(!timeline?.timeline || timeline.timeline.length === 0) && (
                                <div className="text-center py-8 text-slate-400">
                                    No forecast data available. Add expected start dates to opportunities.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forecast;
