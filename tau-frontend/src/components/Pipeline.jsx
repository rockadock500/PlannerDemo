import React, { useState, useEffect } from 'react';
import { getOpportunities, updateOpportunity, createOpportunity, deleteOpportunity, archiveOpportunity, getUsers, getContacts, createContact, updateContact, getErrorMessage } from '../api';
import { Edit2, Plus, User as UserIcon, Building, Mail, Trash2, AlertCircle, Calendar, Archive } from 'lucide-react';

const STAGES = ['Initial', 'Engaged', 'Proposal', 'Verbal', 'Signed'];

const STAGE_PROBABILITIES = {
    'Initial': 0,
    'Engaged': 25,
    'Proposal': 50,
    'Verbal': 80,
    'Signed': 100
};

const PROCUREMENT_DELAYS = [
    { value: 'low', label: 'Low', description: 'Standard process' },
    { value: 'medium', label: 'Medium', description: '+1 month buffer' },
    { value: 'high', label: 'High', description: '+3 months buffer' }
];

// Subtle owner color coding - pastel backgrounds
const OWNER_COLORS = {
    1: 'bg-blue-50 border-l-blue-300',      // Rob
    2: 'bg-emerald-50 border-l-emerald-300', // User 2
    3: 'bg-amber-50 border-l-amber-300',     // Jill
    4: 'bg-rose-50 border-l-rose-300',       // David
    5: 'bg-violet-50 border-l-violet-300',   // Zuzanna
    6: 'bg-cyan-50 border-l-cyan-300',       // Ruarri
    7: 'bg-orange-50 border-l-orange-300',   // Andy
};

const getOwnerColor = (ownerId) => {
    return OWNER_COLORS[ownerId] || 'bg-white border-l-slate-300';
};

const Pipeline = () => {
    // Data State
    const [opportunities, setOpportunities] = useState([]);
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI State
    const [editingOpp, setEditingOpp] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [filterOwner, setFilterOwner] = useState('all');

    // Form State (Add New)
    const [newOppData, setNewOppData] = useState({
        name: '', value: 0, stage: 'Initial', owner_id: '', contact_mode: 'existing', contact_id: '',
        new_contact_name: '', new_contact_email: '', new_contact_company: '',
        expected_start_date: '', duration_months: 1, procurement_delay: 'low'
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setError(null);
        try {
            const [oppsData, usersData, contactsData] = await Promise.all([
                getOpportunities(),
                getUsers(),
                getContacts()
            ]);
            setOpportunities(oppsData);
            setUsers(usersData);
            setContacts(contactsData);

            // Set default owner to "Rob" or first user if available
            const defaultOwner = usersData.find(u => u.name === 'Rob') || usersData[0];
            if (defaultOwner) {
                setNewOppData(prev => ({ ...prev, owner_id: defaultOwner.id }));
            }
        } catch (e) {
            console.error(e);
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---

    const moveStage = async (opp, direction, e) => {
        e.stopPropagation();
        const currentIndex = STAGES.indexOf(opp.stage);
        if (currentIndex === -1) return;

        let newIndex = currentIndex + direction;
        if (newIndex < 0 || newIndex >= STAGES.length) return;

        const newStage = STAGES[newIndex];

        try {
            // Optimistic
            const updatedOpp = { ...opp, stage: newStage };
            setOpportunities(prev => prev.map(o => o.id === opp.id ? updatedOpp : o));
            await updateOpportunity(opp.id, { stage: newStage });
        } catch (e) {
            console.error("Failed to move stage", e);
            fetchAllData(); // Revert
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let finalContactId = newOppData.contact_id;

            // Create Contact if New
            if (newOppData.contact_mode === 'new') {
                const newContact = await createContact({
                    name: newOppData.new_contact_name,
                    email: newOppData.new_contact_email,
                    company: newOppData.new_contact_company,
                    is_primary: true
                });
                finalContactId = newContact.id;
                setContacts(prev => [...prev, newContact]);
            }

            // Create Opportunity
            await createOpportunity({
                name: newOppData.name,
                value: parseInt(newOppData.value || 0),
                stage: newOppData.stage,
                owner_id: newOppData.owner_id ? parseInt(newOppData.owner_id) : null,
                contact_id: finalContactId ? parseInt(finalContactId) : null,
                expected_start_date: newOppData.expected_start_date || null,
                duration_months: parseInt(newOppData.duration_months) || 1,
                procurement_delay: newOppData.procurement_delay || 'low'
            });

            setIsAddModalOpen(false);
            setNewOppData({
                name: '', value: 0, stage: 'Initial', owner_id: newOppData.owner_id, contact_mode: 'existing', contact_id: '',
                new_contact_name: '', new_contact_email: '', new_contact_company: '',
                expected_start_date: '', duration_months: 1, procurement_delay: 'low'
            });
            fetchAllData();
        } catch (err) {
            alert("Failed to create opportunity: " + getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (opp) => {
        try {
            await deleteOpportunity(opp.id);
            setDeleteConfirm(null);
            setOpportunities(prev => prev.filter(o => o.id !== opp.id));
        } catch (err) {
            alert("Failed to delete: " + getErrorMessage(err));
        }
    };

    const handleArchive = async (opp) => {
        try {
            await archiveOpportunity(opp.id);
            setEditingOpp(null);
            setOpportunities(prev => prev.filter(o => o.id !== opp.id));
        } catch (err) {
            alert("Failed to archive: " + getErrorMessage(err));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingOpp) return;

        setSaving(true);
        try {
            // Update Opportunity Fields
            await updateOpportunity(editingOpp.id, {
                name: editingOpp.name,
                value: parseInt(editingOpp.value || 0),
                stage: editingOpp.stage,
                owner_id: editingOpp.owner_id ? parseInt(editingOpp.owner_id) : null,
                expected_start_date: editingOpp.expected_start_date || null,
                duration_months: parseInt(editingOpp.duration_months) || 1,
                procurement_delay: editingOpp.procurement_delay || 'low'
            });

            // Update Linked Contact Fields (if changed)
            if (editingOpp.contact && editingOpp.contact.id) {
                await updateContact(editingOpp.contact.id, {
                    name: editingOpp.contact.name,
                    email: editingOpp.contact.email,
                    company: editingOpp.contact.company
                });
            }

            setEditingOpp(null);
            fetchAllData();
        } catch (err) {
            alert("Failed to save: " + getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    // --- Render Helpers ---

    if (loading) return <div className="p-6 text-gray-500">Loading pipeline...</div>;

    if (error) return (
        <div className="p-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
                <button onClick={fetchAllData} className="ml-auto px-3 py-1 bg-red-100 rounded hover:bg-red-200">Retry</button>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header / Actions */}
            <div className="px-6 py-4 flex justify-between items-center bg-white/40 backdrop-blur-sm border-b border-white/50 z-10 sticky top-0 md:px-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Pipeline Overview</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage your deals and track AI insights</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Owner Filter */}
                    <div className="flex items-center gap-2">
                        <UserIcon size={16} className="text-slate-400" />
                        <select
                            value={filterOwner}
                            onChange={(e) => setFilterOwner(e.target.value)}
                            className="bg-white/70 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Owners</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        New Lead
                    </button>
                </div>
            </div>

            {/* Kanban Board - Full Screen Fluid Optimized */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 scrollbar-hide">
                <div className="flex gap-4 h-full min-w-full">
                    {STAGES.map(stage => {
                        const filteredOpps = filterOwner === 'all'
                            ? opportunities
                            : opportunities.filter(o => o.owner_id === parseInt(filterOwner));
                        const stageOpps = filteredOpps.filter(o => o.stage === stage);
                        const totalValue = stageOpps.reduce((sum, o) => sum + (o.value || 0), 0);
                        const probability = STAGE_PROBABILITIES[stage];
                        const weightedValue = Math.round(totalValue * probability / 100);

                        return (
                            <div key={stage} className="w-[19%] min-w-[220px] flex flex-col h-full bg-white/30 rounded-xl border border-white/40 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/40">
                                {/* Column Header */}
                                <div className="p-3 mb-1 flex items-end justify-between bg-white/40 rounded-t-xl border-b border-white/50">
                                    <div className="flex flex-col">
                                        <h3 className="font-extrabold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
                                            {stage}
                                            <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md text-xs font-bold">{stageOpps.length}</span>
                                            <span className="bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md text-xs font-bold">{probability}%</span>
                                        </h3>
                                        <div className="text-sm font-semibold text-slate-400 mt-1 flex gap-2">
                                            <span>£{totalValue.toLocaleString()}</span>
                                            <span className="text-indigo-500">W: £{weightedValue.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {/* Visual Indicator Line - Compact */}
                                    <div className={`w-12 h-1 rounded-full opacity-60 ${stage === 'Initial' ? 'bg-blue-400' :
                                        stage === 'Engaged' ? 'bg-indigo-400' :
                                            stage === 'Proposal' ? 'bg-purple-400' :
                                                stage === 'Verbal' ? 'bg-fuchsia-400' :
                                                    'bg-green-400'
                                        }`}></div>
                                </div>

                                {/* Column Body */}
                                <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2 custom-scrollbar">
                                    {stageOpps.map(opp => {
                                        // Mock Score for "Intelligence" aspect
                                        const score = Math.floor(Math.random() * (99 - 70 + 1) + 70);

                                        return (
                                            <div
                                                key={opp.id}
                                                onClick={() => setEditingOpp(JSON.parse(JSON.stringify(opp)))}
                                                className={`${getOwnerColor(opp.owner_id).split(' ')[0]} p-3.5 rounded-lg shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group relative overflow-hidden`}
                                            >
                                                {/* Left Accent - Owner Color */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${getOwnerColor(opp.owner_id).split(' ')[1]?.replace('border-l-', 'bg-') || (stage === 'Signed' ? 'bg-green-500' : 'bg-indigo-500')}`}></div>

                                                {/* Card Content */}
                                                <div className="pl-2">
                                                    <div className="flex justify-between items-start mb-1">
                                                        {opp.contact?.company ? (
                                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 truncate max-w-[70%]">
                                                                <Building size={10} /> {opp.contact.company}
                                                            </span>
                                                        ) : <span className="w-1"></span>}

                                                        {/* AI Score Badge */}
                                                        <div className={`px-1.5 rounded text-xs font-bold flex items-center gap-0.5 ${score > 90 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`} title="Cognito Score">
                                                            ⚡{score}
                                                        </div>
                                                    </div>

                                                    <h4 className="text-base font-bold text-slate-800 leading-tight mb-2 truncate">
                                                        {opp.name}
                                                    </h4>

                                                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                                        <div className="flex items-center gap-2">
                                                            {opp.owner ? (
                                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 border border-white ring-1 ring-slate-100" title={opp.owner.name}>
                                                                    {opp.owner.name.charAt(0)}
                                                                </div>
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-dashed border-slate-300"></div>
                                                            )}
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-slate-700">£{opp.value?.toLocaleString()}</span>
                                                                <span className="text-xs text-indigo-500">W: £{Math.round((opp.value || 0) * STAGE_PROBABILITIES[stage] / 100).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                        {opp.expected_start_date && (
                                                            <div className="text-xs text-slate-400 flex items-center gap-0.5">
                                                                <Calendar size={11} />
                                                                {new Date(opp.expected_start_date).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Quick Actions Overlay (Glass) - appearing on hover */}
                                                <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                                                    <button
                                                        onClick={(e) => moveStage(opp, -1, e)}
                                                        disabled={stage === 'Initial'}
                                                        className="p-2 rounded-full bg-slate-100 hover:bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-indigo-600 disabled:opacity-50 transition-all hover:scale-110"
                                                        title="Previous Stage"
                                                    >
                                                        &larr;
                                                    </button>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest mb-1">ACTION</span>
                                                        <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">View</span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => moveStage(opp, 1, e)}
                                                        disabled={stage === 'Signed'}
                                                        className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-600 border border-indigo-100 shadow-sm text-indigo-600 hover:text-white disabled:opacity-50 transition-all hover:scale-110"
                                                        title="Next Stage"
                                                    >
                                                        &rarr;
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- Modals --- */}

            {/* CREATE MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg">New Opportunity</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-blue-100 hover:text-white">&times;</button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            {/* Opp Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Deal Name</label>
                                    <input required type="text" className="w-full mt-1 border rounded p-2 text-sm"
                                        placeholder="e.g. Website Redesign"
                                        value={newOppData.name} onChange={e => setNewOppData({ ...newOppData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Value (£)</label>
                                    <input type="number" className="w-full mt-1 border rounded p-2 text-sm"
                                        value={newOppData.value} onChange={e => setNewOppData({ ...newOppData, value: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">Stage</label>
                                <select className="w-full mt-1 border rounded p-2 text-sm"
                                    value={newOppData.stage} onChange={e => setNewOppData({ ...newOppData, stage: e.target.value })}>
                                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">Owner</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <UserIcon size={16} className="text-gray-400" />
                                    <select className="flex-1 border rounded p-2 text-sm"
                                        value={newOppData.owner_id} onChange={e => setNewOppData({ ...newOppData, owner_id: e.target.value })}>
                                        <option value="">Select Owner...</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <hr className="border-gray-100 my-2" />

                            {/* Forecast Fields */}
                            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                <h4 className="text-xs font-bold text-indigo-700 uppercase mb-3 flex items-center gap-1">
                                    <Calendar size={12} /> Forecast Details
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Expected Start</label>
                                        <input type="date" className="w-full mt-1 border rounded p-2 text-sm"
                                            value={newOppData.expected_start_date} onChange={e => setNewOppData({ ...newOppData, expected_start_date: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Duration (mo)</label>
                                        <input type="number" min="1" className="w-full mt-1 border rounded p-2 text-sm"
                                            value={newOppData.duration_months} onChange={e => setNewOppData({ ...newOppData, duration_months: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Procurement</label>
                                        <select className="w-full mt-1 border rounded p-2 text-sm"
                                            value={newOppData.procurement_delay} onChange={e => setNewOppData({ ...newOppData, procurement_delay: e.target.value })}>
                                            {PROCUREMENT_DELAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100 my-2" />

                            {/* Contact Section */}
                            <div>
                                <div className="flex gap-4 mb-2">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="radio" name="contactMode" checked={newOppData.contact_mode === 'existing'}
                                            onChange={() => setNewOppData({ ...newOppData, contact_mode: 'existing' })} />
                                        Existing Contact
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="radio" name="contactMode" checked={newOppData.contact_mode === 'new'}
                                            onChange={() => setNewOppData({ ...newOppData, contact_mode: 'new' })} />
                                        New Contact
                                    </label>
                                </div>

                                {newOppData.contact_mode === 'existing' ? (
                                    <select className="w-full border rounded p-2 text-sm"
                                        value={newOppData.contact_id} onChange={e => setNewOppData({ ...newOppData, contact_id: e.target.value })}>
                                        <option value="">-- Search Contacts --</option>
                                        {contacts.map(c => <option key={c.id} value={c.id}>{c.company} - {c.name}</option>)}
                                    </select>
                                ) : (
                                    <div className="space-y-3 bg-gray-50 p-3 rounded border border-gray-200">
                                        <input required type="text" placeholder="Company Name" className="w-full border rounded p-2 text-sm"
                                            value={newOppData.new_contact_company} onChange={e => setNewOppData({ ...newOppData, new_contact_company: e.target.value })} />
                                        <input required type="text" placeholder="Contact Name" className="w-full border rounded p-2 text-sm"
                                            value={newOppData.new_contact_name} onChange={e => setNewOppData({ ...newOppData, new_contact_name: e.target.value })} />
                                        <input type="email" placeholder="Email" className="w-full border rounded p-2 text-sm"
                                            value={newOppData.new_contact_email} onChange={e => setNewOppData({ ...newOppData, new_contact_email: e.target.value })} />
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t flex justify-end gap-2">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {saving ? 'Creating...' : 'Create Deal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editingOpp && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
                                <Edit2 size={18} className="text-gray-400" />
                                Edit Deal
                            </h3>
                            <button onClick={() => setEditingOpp(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>

                        <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Left Column: Deal Info */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 border-b pb-2 mb-4">Deal Information</h4>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Name</label>
                                    <input type="text" className="w-full mt-1 border border-gray-300 rounded p-2"
                                        value={editingOpp.name} onChange={e => setEditingOpp({ ...editingOpp, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Value (£)</label>
                                        <input type="number" className="w-full mt-1 border border-gray-300 rounded p-2"
                                            value={editingOpp.value} onChange={e => setEditingOpp({ ...editingOpp, value: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Stage</label>
                                        <select className="w-full mt-1 border border-gray-300 rounded p-2"
                                            value={editingOpp.stage} onChange={e => setEditingOpp({ ...editingOpp, stage: e.target.value })}>
                                            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assigned Owner</label>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                            {users.find(u => u.id === editingOpp.owner_id)?.name.charAt(0) || "?"}
                                        </div>
                                        <select className="flex-1 border border-gray-300 rounded p-2 bg-white"
                                            value={editingOpp.owner_id || ''} onChange={e => setEditingOpp({ ...editingOpp, owner_id: e.target.value })}>
                                            <option value="">Unassigned</option>
                                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Forecast Fields */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h4 className="font-bold text-indigo-700 text-sm mb-3 flex items-center gap-2">
                                        <Calendar size={14} /> Forecast
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase">Expected Start Date</label>
                                            <input type="date" className="w-full mt-1 border border-gray-300 rounded p-2"
                                                value={editingOpp.expected_start_date ? editingOpp.expected_start_date.split('T')[0] : ''}
                                                onChange={e => setEditingOpp({ ...editingOpp, expected_start_date: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase">Duration (months)</label>
                                                <input type="number" min="1" className="w-full mt-1 border border-gray-300 rounded p-2"
                                                    value={editingOpp.duration_months || 1}
                                                    onChange={e => setEditingOpp({ ...editingOpp, duration_months: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase">Procurement Delay</label>
                                                <select className="w-full mt-1 border border-gray-300 rounded p-2"
                                                    value={editingOpp.procurement_delay || 'low'}
                                                    onChange={e => setEditingOpp({ ...editingOpp, procurement_delay: e.target.value })}>
                                                    {PROCUREMENT_DELAYS.map(d => (
                                                        <option key={d.value} value={d.value}>{d.label} - {d.description}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {editingOpp.value && editingOpp.duration_months > 0 && (
                                            <div className="bg-indigo-50 p-2 rounded text-xs text-indigo-700">
                                                <span className="font-bold">Monthly: </span>
                                                £{Math.round((editingOpp.value || 0) / (editingOpp.duration_months || 1)).toLocaleString()}
                                                <span className="ml-2 font-bold">Weighted: </span>
                                                £{Math.round((editingOpp.value || 0) * STAGE_PROBABILITIES[editingOpp.stage] / 100).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Contact Info */}
                            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="font-bold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                    <UserIcon size={16} />
                                    Contact Details
                                </h4>

                                {editingOpp.contact ? (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase">Company</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Building size={14} className="text-gray-400" />
                                                <input type="text" className="bg-transparent border-b border-gray-300 focus:border-blue-500 w-full outline-none py-1"
                                                    value={editingOpp.contact.company || ''}
                                                    onChange={e => setEditingOpp({ ...editingOpp, contact: { ...editingOpp.contact, company: e.target.value } })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase">Name</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <UserIcon size={14} className="text-gray-400" />
                                                <input type="text" className="bg-transparent border-b border-gray-300 focus:border-blue-500 w-full outline-none py-1"
                                                    value={editingOpp.contact.name || ''}
                                                    onChange={e => setEditingOpp({ ...editingOpp, contact: { ...editingOpp.contact, name: e.target.value } })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase">Email</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Mail size={14} className="text-gray-400" />
                                                <input type="email" className="bg-transparent border-b border-gray-300 focus:border-blue-500 w-full outline-none py-1"
                                                    value={editingOpp.contact.email || ''}
                                                    onChange={e => setEditingOpp({ ...editingOpp, contact: { ...editingOpp.contact, email: e.target.value } })} />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 text-sm">
                                        No contact linked.
                                        {/* Future: Add 'Link Contact' btn here */}
                                    </div>
                                )}
                            </div>

                        </form>

                        <div className="p-4 border-t bg-gray-50 flex justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setDeleteConfirm(editingOpp)}
                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded font-medium flex items-center gap-1"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                                {editingOpp.stage === 'Signed' && (
                                    <button
                                        onClick={() => handleArchive(editingOpp)}
                                        className="px-4 py-2 text-amber-600 hover:bg-amber-50 rounded font-medium flex items-center gap-1"
                                        title="Archive this completed deal"
                                    >
                                        <Archive size={16} /> Archive
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setEditingOpp(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium">Cancel</button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 shadow shadow-green-200 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Opportunity</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
                            This cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(deleteConfirm);
                                    setEditingOpp(null);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Pipeline;
