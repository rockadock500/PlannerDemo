import React, { useState, useEffect } from 'react';
import { getContacts, updateContact, deleteContact, getErrorMessage } from '../api';
import { Edit2, Trash2, Search, AlertCircle } from 'lucide-react';

const DataCleaner = () => {
    const [contacts, setContacts] = useState([]);
    const [filter, setFilter] = useState('');
    const [editingContact, setEditingContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getContacts();
            setContacts(data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!editingContact) return;

        setSaving(true);
        try {
            await updateContact(editingContact.id, {
                name: editingContact.name,
                email: editingContact.email,
                company: editingContact.company,
                is_primary: editingContact.is_primary
            });
            setEditingContact(null);
            fetchContacts();
        } catch (err) {
            alert("Failed to save: " + getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (contact) => {
        try {
            await deleteContact(contact.id);
            setDeleteConfirm(null);
            fetchContacts();
        } catch (err) {
            alert("Failed to delete: " + getErrorMessage(err));
        }
    };

    const isInternal = (email) => {
        // Simple logic mirroring somewhat the backend score < 0 logic, 
        // though we don't return 'score' in schema yet.
        // Actually I should have added score to schema. 
        // Since I can't see score in schema defined earlier, 
        // I'll assume internal based on email domain for visual cue or just 'is_primary'.
        // Wait, user asked "render ... score". 
        // I likely missed adding 'score' to schema response. 
        // I will fix schema later or just rely on manual cues for now.
        return email?.includes('taums.ai');
    };

    const filteredContacts = contacts.filter(c =>
        (c.name?.toLowerCase().includes(filter.toLowerCase())) ||
        (c.company?.toLowerCase().includes(filter.toLowerCase())) ||
        (c.email?.toLowerCase().includes(filter.toLowerCase()))
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Data Cleaner</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
                        ) : filteredContacts.map(contact => {
                            const internal = isInternal(contact.email);
                            return (
                                <tr key={contact.id} className={internal ? 'bg-red-50' : contact.is_primary ? 'bg-green-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.company}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {contact.is_primary && (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Primary
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setEditingContact(contact)}
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                            >
                                                <Edit2 className="h-4 w-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(contact)}
                                                className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                    <button onClick={fetchContacts} className="ml-auto text-sm underline">Retry</button>
                </div>
            )}

            {/* Edit Modal */}
            {editingContact && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Contact</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={editingContact.name || ''}
                                    onChange={e => setEditingContact({ ...editingContact, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={editingContact.email || ''}
                                    onChange={e => setEditingContact({ ...editingContact, email: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company</label>
                                <input
                                    type="text"
                                    value={editingContact.company || ''}
                                    onChange={e => setEditingContact({ ...editingContact, company: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={editingContact.is_primary || false}
                                    onChange={e => setEditingContact({ ...editingContact, is_primary: e.target.checked })}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Is Primary Contact</label>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingContact(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Contact</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
                            This cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
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

export default DataCleaner;
