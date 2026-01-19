import React, { useState, useEffect } from 'react';
import { getArchivedOpportunities, unarchiveOpportunity, getErrorMessage } from '../api';
import { Archive as ArchiveIcon, RotateCcw, AlertCircle, Building, Calendar, TrendingUp } from 'lucide-react';

const Archive = () => {
    const [archivedDeals, setArchivedDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArchivedDeals();
    }, []);

    const fetchArchivedDeals = async () => {
        setError(null);
        try {
            const data = await getArchivedOpportunities();
            setArchivedDeals(data);
        } catch (e) {
            console.error(e);
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    const handleUnarchive = async (opp) => {
        try {
            await unarchiveOpportunity(opp.id);
            setArchivedDeals(prev => prev.filter(o => o.id !== opp.id));
        } catch (err) {
            alert("Failed to restore: " + getErrorMessage(err));
        }
    };

    const totalValue = archivedDeals.reduce((sum, o) => sum + (o.value || 0), 0);

    if (loading) return <div className="p-6 text-gray-500">Loading archived deals...</div>;

    if (error) return (
        <div className="p-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
                <button onClick={fetchArchivedDeals} className="ml-auto px-3 py-1 bg-red-100 rounded hover:bg-red-200">Retry</button>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center bg-white/40 backdrop-blur-sm border-b border-white/50 z-10 sticky top-0 md:px-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <ArchiveIcon className="text-amber-500" size={24} />
                        Archived Deals
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Completed and closed opportunities</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white/70 px-4 py-2 rounded-xl border border-white/50 shadow-sm">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Won</span>
                        <div className="text-xl font-bold text-green-600">£{totalValue.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/70 px-4 py-2 rounded-xl border border-white/50 shadow-sm">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Count</span>
                        <div className="text-xl font-bold text-slate-700">{archivedDeals.length}</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                {archivedDeals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <ArchiveIcon size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium">No archived deals yet</p>
                        <p className="text-sm">Completed deals will appear here when archived from the Pipeline</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Deal Name</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Value</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Archived</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {archivedDeals.map(opp => (
                                    <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Building size={14} className="text-slate-400" />
                                                <span className="text-sm font-medium text-slate-700">
                                                    {opp.contact?.company || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-semibold text-slate-800">{opp.name}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-sm font-bold text-green-600">£{opp.value?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {opp.owner ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                                        {opp.owner.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm text-slate-600">{opp.owner.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                                <Calendar size={12} />
                                                {opp.archived_at ? new Date(opp.archived_at).toLocaleDateString('en-GB', {
                                                    month: 'short',
                                                    year: 'numeric'
                                                }) : '-'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleUnarchive(opp)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Restore to Pipeline"
                                            >
                                                <RotateCcw size={14} />
                                                Restore
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Summary Stats */}
                {archivedDeals.length > 0 && (
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">
                                <TrendingUp size={14} />
                                Average Deal Size
                            </div>
                            <div className="text-2xl font-bold text-slate-800">
                                £{Math.round(totalValue / archivedDeals.length).toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">
                                <ArchiveIcon size={14} />
                                Largest Deal
                            </div>
                            <div className="text-2xl font-bold text-slate-800">
                                £{Math.max(...archivedDeals.map(o => o.value || 0)).toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">
                                <Calendar size={14} />
                                Most Recent
                            </div>
                            <div className="text-2xl font-bold text-slate-800">
                                {archivedDeals.length > 0 && archivedDeals[0].archived_at
                                    ? new Date(archivedDeals[0].archived_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
                                    : '-'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Archive;
