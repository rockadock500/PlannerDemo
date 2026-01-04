import React, { useState, useEffect } from 'react';
import { getOpportunities, updateOpportunity } from '../api';

const STAGES = ['Initial', 'Engaged', 'Proposal', 'Verbal', 'Signed'];

const Pipeline = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOpps();
    }, []);

    const fetchOpps = async () => {
        setLoading(true);
        try {
            const data = await getOpportunities();
            setOpportunities(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const moveStage = async (opp, direction) => {
        const currentIndex = STAGES.indexOf(opp.stage);
        if (currentIndex === -1) return; // Unknown stage

        let newIndex = currentIndex + direction;
        if (newIndex < 0 || newIndex >= STAGES.length) return;

        const newStage = STAGES[newIndex];

        try {
            // Optimistic update
            const updatedOpp = { ...opp, stage: newStage };
            setOpportunities(prev => prev.map(o => o.id === opp.id ? updatedOpp : o));

            await updateOpportunity(opp.id, { stage: newStage });
        } catch (e) {
            console.error("Failed to move stage", e);
            fetchOpps(); // Revert
        }
    };

    if (loading) return <div className="p-6">Loading pipeline...</div>;

    return (
        <div className="p-6 h-full overflow-x-auto">
            <div className="flex gap-4 min-w-max h-[calc(100vh-100px)]">
                {STAGES.map(stage => {
                    const stageOpps = opportunities.filter(o => o.stage === stage);
                    return (
                        <div key={stage} className="w-80 bg-gray-100 rounded-lg p-4 flex flex-col">
                            <h3 className="font-bold text-gray-700 mb-4 flex justify-between items-center">
                                {stage}
                                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">{stageOpps.length}</span>
                            </h3>

                            <div className="flex-1 overflow-y-auto space-y-3">
                                {stageOpps.map(opp => (
                                    <div key={opp.id} className="bg-white p-3 rounded shadow hover:shadow-md transition-shadow">
                                        <div className="text-sm font-medium text-gray-800">{opp.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {opp.contact?.company || "Unknown Company"}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {opp.contact?.name || "No Contact"}
                                        </div>

                                        <div className="mt-3 flex justify-between gap-2">
                                            {/* Move Back */}
                                            <button
                                                onClick={() => moveStage(opp, -1)}
                                                disabled={stage === 'Initial'}
                                                className={`text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                &larr;
                                            </button>

                                            {/* Move Next */}
                                            <button
                                                onClick={() => moveStage(opp, 1)}
                                                disabled={stage === 'Signed'}
                                                className={`text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                Next &rarr;
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Pipeline;
