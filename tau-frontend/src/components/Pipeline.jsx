import React, { useState, useEffect } from 'react';
import { getOpportunities, updateOpportunity, createOpportunity, getUsers, getContacts, createContact, updateContact } from '../api';
import { Edit2, Plus, User as UserIcon, Building, Mail, Phone, ExternalLink } from 'lucide-react';

const STAGES = ['Initial', 'Engaged', 'Proposal', 'Verbal', 'Signed'];

const Pipeline = () => {
    // Data State
    const [opportunities, setOpportunities] = useState([]);
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState([]); // For dropdowns
    const [loading, setLoading] = useState(true);

    // UI State
    const [editingOpp, setEditingOpp] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State (Add New)
    const [newOppData, setNewOppData] = useState({
        name: '', value: 0, stage: 'Initial', owner_id: '', contact_mode: 'existing', contact_id: '',
        new_contact_name: '', new_contact_email: '', new_contact_company: ''
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [oppsData, usersData, contactsData] = await Promise.all([
                getOpportunities(),
                getUsers(),
                getContacts()
            ]);
            setOpportunities(oppsData);
            setUsers(usersData);
            setContacts(contactsData);

            // Set default owner to "Rob" or first user if available logic needed
            const defaultOwner = usersData.find(u => u.name === 'Rob') || usersData[0];
            if (defaultOwner) {
                setNewOppData(prev => ({ ...prev, owner_id: defaultOwner.id }));
            }
        } catch (e) {
            console.error(e);
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
                // Add to local list
                setContacts(prev => [...prev, newContact]);
            }

            // Create Opportunity
            await createOpportunity({
                name: newOppData.name,
                value: parseInt(newOppData.value || 0),
                stage: newOppData.stage,
                owner_id: newOppData.owner_id ? parseInt(newOppData.owner_id) : null,
                contact_id: finalContactId ? parseInt(finalContactId) : null
            });

            setIsAddModalOpen(false);
            setNewOppData({ // Reset
                name: '', value: 0, stage: 'Initial', owner_id: newOppData.owner_id, contact_mode: 'existing', contact_id: '',
                new_contact_name: '', new_contact_email: '', new_contact_company: ''
            });
            fetchAllData(); // Refresh to catch all links
        } catch (err) {
            alert("Failed to create opportunity: " + (err.response?.data?.detail || err.message));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingOpp) return;

        try {
            // Update Opportunity Fields
            await updateOpportunity(editingOpp.id, {
                name: editingOpp.name,
                value: parseInt(editingOpp.value || 0),
                stage: editingOpp.stage,
                owner_id: editingOpp.owner_id ? parseInt(editingOpp.owner_id) : null
            });

            // Update Linked Contact Fields (if changed)
            if (editingOpp.contact && editingOpp.contact.id) {
                // Check if dirty? For now just send update is safer/easier
                await updateContact(editingOpp.contact.id, {
                    name: editingOpp.contact.name,
                    email: editingOpp.contact.email,
                    company: editingOpp.contact.company
                });
            }

            setEditingOpp(null);
            fetchAllData();
        } catch (err) {
            alert("Failed to save changes");
        }
    };

    // --- Render Helpers ---

    if (loading) return <div className="p-6 text-gray-500">Loading pipeline...</div>;

    return (
        <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header / Actions */}
            <div className="px-6 py-4 flex justify-between items-center bg-white/40 backdrop-blur-sm border-b border-white/50 z-10 sticky top-0 md:px-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Pipeline Overview</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage your deals and track AI insights</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    New Lead
                </button>
            </div>

            {/* Kanban Board - Full Screen Fluid */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 md:p-8">
                <div className="flex gap-6 h-full min-w-max">
                    {STAGES.map(stage => {
                        const stageOpps = opportunities.filter(o => o.stage === stage);
                        const totalValue = stageOpps.reduce((sum, o) => sum + (o.value || 0), 0);

                        return (
                            <div key={stage} className="w-[340px] flex flex-col h-full">
                                {/* Column Header */}
                                <div className="mb-4 flex items-end justify-between px-1">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-extrabold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
                                            {stage}
                                            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold">{stageOpps.length}</span>
                                        </h3>
                                        <div className="text-xs font-semibold text-slate-400">
                                            £{totalValue.toLocaleString()}
                                        </div>
                                    </div>
                                    {/* Visual Indicator Line */}
                                    <div className={`h-1 flex-1 ml-4 rounded-full bg-gradient-to-r opacity-50 ${stage === 'Initial' ? 'from-blue-400 to-transparent' :
                                            stage === 'Engaged' ? 'from-indigo-400 to-transparent' :
                                                stage === 'Proposal' ? 'from-purple-400 to-transparent' :
                                                    stage === 'Verbal' ? 'from-fuchsia-400 to-transparent' :
                                                        'from-green-400 to-transparent'
                                        }`}></div>
                                </div>

                                {/* Column Body */}
                                <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-4 custom-scrollbar">
                                    {stageOpps.map(opp => {
                                        // Mock Score for "Intelligence" aspect
                                        const score = Math.floor(Math.random() * (99 - 70 + 1) + 70);

                                        return (
                                            <div
                                                key={opp.id}
                                                onClick={() => setEditingOpp(JSON.parse(JSON.stringify(opp)))}
                                                className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                                            >
                                                {/* Left Accent */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${stage === 'Signed' ? 'bg-green-500' : 'bg-indigo-500'
                                                    }`}></div>

                                                {/* Card Content */}
                                                <div className="pl-2">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                            <Building size={10} /> {opp.contact?.company || "No Company"}
                                                        </span>

                                                        {/* AI Score Badge */}
                                                        <div className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[10px] font-bold flex items-center gap-1" title="Lead Score">
                                                            ⚡ {score}
                                                        </div>
                                                    </div>

                                                    <h4 className="text-sm font-bold text-slate-800 leading-snug mb-3">
                                                        {opp.name}
                                                    </h4>

                                                    <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                                                        <div className="flex items-center gap-2">
                                                            {opp.owner ? (
                                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-white ring-1 ring-slate-100" title={opp.owner.name}>
                                                                    {opp.owner.name.charAt(0)}
                                                                </div>
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-dashed border-slate-300"></div>
                                                            )}
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-slate-400 font-medium">Value</span>
                                                                <span className="text-xs font-bold text-slate-700">£{opp.value?.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quick Actions Overlay (Glass) */}
                                                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-white via-white/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center translate-y-2 group-hover:translate-y-0 duration-200">
                                                    <button
                                                        onClick={(e) => moveStage(opp, -1, e)}
                                                        disabled={stage === 'Initial'}
                                                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-0 transition-colors"
                                                    >
                                                        &larr;
                                                    </button>
                                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">View Details</span>
                                                    <button
                                                        onClick={(e) => moveStage(opp, 1, e)}
                                                        disabled={stage === 'Signed'}
                                                        className="p-1.5 rounded-lg hover:bg-slate-100 text-indigo-600 hover:text-indigo-800 disabled:opacity-0 transition-colors"
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
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">Create Deal</button>
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

                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setEditingOpp(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium">Cancel</button>
                            <button onClick={handleUpdate} className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 shadow shadow-green-200">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Pipeline;
