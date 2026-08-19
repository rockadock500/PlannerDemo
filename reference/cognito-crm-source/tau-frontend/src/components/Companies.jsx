import React, { useState, useEffect } from 'react';
import { getCompanies, createCompany, updateCompany, deleteCompany, getCompanyContacts, getCompanyOpportunities, getErrorMessage } from '../api';
import { Building2, Plus, Search, Edit2, Trash2, Users, Briefcase, Globe, AlertCircle, X, ChevronRight } from 'lucide-react';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyDetails, setCompanyDetails] = useState({ contacts: [], opportunities: [] });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        website: '',
        notes: ''
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (selectedCompany) {
            fetchCompanyDetails(selectedCompany.id);
        }
    }, [selectedCompany]);

    const fetchCompanies = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCompanies({ search: searchTerm });
            setCompanies(data);
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanyDetails = async (companyId) => {
        try {
            const [contacts, opportunities] = await Promise.all([
                getCompanyContacts(companyId),
                getCompanyOpportunities(companyId)
            ]);
            setCompanyDetails({ contacts, opportunities });
        } catch (e) {
            console.error('Failed to fetch company details:', e);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCompanies();
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await createCompany(formData);
            setIsAddModalOpen(false);
            setFormData({ name: '', industry: '', website: '', notes: '' });
            fetchCompanies();
        } catch (e) {
            alert('Failed to create company: ' + getErrorMessage(e));
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingCompany) return;
        setSaving(true);
        try {
            await updateCompany(editingCompany.id, formData);
            setEditingCompany(null);
            setFormData({ name: '', industry: '', website: '', notes: '' });
            fetchCompanies();
            if (selectedCompany?.id === editingCompany.id) {
                setSelectedCompany({ ...selectedCompany, ...formData });
            }
        } catch (e) {
            alert('Failed to update company: ' + getErrorMessage(e));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (company) => {
        try {
            await deleteCompany(company.id);
            setDeleteConfirm(null);
            if (selectedCompany?.id === company.id) {
                setSelectedCompany(null);
            }
            fetchCompanies();
        } catch (e) {
            alert('Failed to delete company: ' + getErrorMessage(e));
        }
    };

    const openEditModal = (company) => {
        setFormData({
            name: company.name || '',
            industry: company.industry || '',
            website: company.website || '',
            notes: company.notes || ''
        });
        setEditingCompany(company);
    };

    if (loading && companies.length === 0) {
        return (
            <div className="p-6 flex items-center justify-center h-full">
                <div className="animate-pulse text-slate-400">Loading companies...</div>
            </div>
        );
    }

    return (
        <div className="h-full flex overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Left Panel - Company List */}
            <div className="w-1/3 border-r border-slate-200 bg-white flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Building2 className="text-indigo-600" size={20} />
                            Companies
                        </h2>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                            <Plus size={16} />
                            Add
                        </button>
                    </div>
                    <form onSubmit={handleSearch} className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                {/* Company List */}
                <div className="flex-1 overflow-y-auto">
                    {error && (
                        <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}
                    {companies.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            No companies found. Create your first company.
                        </div>
                    ) : (
                        companies.map(company => (
                            <div
                                key={company.id}
                                onClick={() => setSelectedCompany(company)}
                                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors flex items-center justify-between ${selectedCompany?.id === company.id
                                        ? 'bg-indigo-50 border-l-4 border-l-indigo-500'
                                        : 'hover:bg-slate-50'
                                    }`}
                            >
                                <div>
                                    <div className="font-semibold text-slate-800">{company.name}</div>
                                    {company.industry && (
                                        <div className="text-xs text-slate-400 mt-0.5">{company.industry}</div>
                                    )}
                                </div>
                                <ChevronRight size={16} className="text-slate-300" />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel - Company Details */}
            <div className="flex-1 flex flex-col">
                {selectedCompany ? (
                    <>
                        {/* Company Header */}
                        <div className="p-6 bg-white border-b border-slate-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">{selectedCompany.name}</h2>
                                    {selectedCompany.industry && (
                                        <div className="text-sm text-slate-500 mt-1">{selectedCompany.industry}</div>
                                    )}
                                    {selectedCompany.website && (
                                        <a
                                            href={selectedCompany.website.startsWith('http') ? selectedCompany.website : `https://${selectedCompany.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-indigo-600 hover:underline flex items-center gap-1 mt-1"
                                        >
                                            <Globe size={12} />
                                            {selectedCompany.website}
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(selectedCompany)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(selectedCompany)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            {selectedCompany.notes && (
                                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                                    {selectedCompany.notes}
                                </div>
                            )}
                        </div>

                        {/* Company Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Contacts Section */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <Users size={18} className="text-indigo-500" />
                                    Contacts ({companyDetails.contacts.length})
                                </h3>
                                {companyDetails.contacts.length === 0 ? (
                                    <div className="text-sm text-slate-400 py-4 text-center">
                                        No contacts linked to this company.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {companyDetails.contacts.map(contact => (
                                            <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-slate-700">{contact.name}</div>
                                                    <div className="text-xs text-slate-400">{contact.email}</div>
                                                </div>
                                                {contact.is_primary && (
                                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                                                        Primary
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Opportunities Section */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <Briefcase size={18} className="text-indigo-500" />
                                    Opportunities ({companyDetails.opportunities.length})
                                </h3>
                                {companyDetails.opportunities.length === 0 ? (
                                    <div className="text-sm text-slate-400 py-4 text-center">
                                        No opportunities linked to this company.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {companyDetails.opportunities.map(opp => (
                                            <div key={opp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-slate-700">{opp.name}</div>
                                                    <div className="text-xs text-slate-400">{opp.stage}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-slate-700">
                                                        £{(opp.value || 0).toLocaleString()}
                                                    </div>
                                                    {opp.weighted_value && (
                                                        <div className="text-xs text-indigo-500">
                                                            W: £{opp.weighted_value.toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <Building2 size={48} className="mx-auto mb-4 opacity-30" />
                            <div>Select a company to view details</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {(isAddModalOpen || editingCompany) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg">
                                {editingCompany ? 'Edit Company' : 'Add Company'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    setEditingCompany(null);
                                    setFormData({ name: '', industry: '', website: '', notes: '' });
                                }}
                                className="text-indigo-100 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={editingCompany ? handleUpdate : handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    Company Name *
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2.5"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    Industry
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Technology, Healthcare"
                                    className="w-full border border-gray-300 rounded-lg p-2.5"
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    Website
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. www.example.com"
                                    className="w-full border border-gray-300 rounded-lg p-2.5"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    Notes
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg p-2.5"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 border-t flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setEditingCompany(null);
                                        setFormData({ name: '', industry: '', website: '', notes: '' });
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : (editingCompany ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Company</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
                            This cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
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

export default Companies;
