import axios from 'axios';

// Production API URL - fallback to localhost for local dev
const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://tau-crm-production.up.railway.app'
    : 'http://localhost:8000';
const API_URL = `${BASE_URL}/api`;

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Error logging interceptor - captures all API errors with context
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            method: error.config?.method?.toUpperCase(),
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            detail: error.response?.data?.detail,
            requestData: error.config?.data ? JSON.parse(error.config.data) : undefined,
        };
        console.error('[TAU CRM API Error]', logEntry);

        // Store recent errors for debugging (keep last 50)
        const stored = JSON.parse(localStorage.getItem('tau_crm_error_log') || '[]');
        stored.push(logEntry);
        if (stored.length > 50) stored.splice(0, stored.length - 50);
        localStorage.setItem('tau_crm_error_log', JSON.stringify(stored));

        return Promise.reject(error);
    }
);

// Helper to extract error message
const getErrorMessage = (error) => {
    if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        // Handle Pydantic validation error arrays (422 responses)
        if (Array.isArray(detail)) {
            return detail.map(d => {
                const field = d.loc ? d.loc[d.loc.length - 1] : 'unknown';
                return `${field}: ${d.msg || 'invalid'}`;
            }).join('; ');
        }
        // Handle structured error objects (e.g. 409 conflict with existing_contact)
        if (typeof detail === 'object' && detail.message) {
            return detail.message;
        }
        return typeof detail === 'string' ? detail : JSON.stringify(detail);
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

// -----------------
// CONTACTS
// -----------------

export const getContacts = async (params = {}) => {
    const response = await api.get('/contacts', { params });
    return response.data;
};

export const getContact = async (id) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
};

export const createContact = async (data) => {
    const response = await api.post('/contacts', data);
    return response.data;
};

export const updateContact = async (id, data) => {
    const response = await api.put(`/contacts/${id}`, data);
    return response.data;
};

export const deleteContact = async (id) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
};

export const searchContactsByEmail = async (email) => {
    const response = await api.get('/contacts/search-email', { params: { email } });
    return response.data;
};

// -----------------
// OPPORTUNITIES
// -----------------

export const getOpportunities = async (params = {}) => {
    const response = await api.get('/opportunities', { params });
    return response.data;
};

export const getOpportunity = async (id) => {
    const response = await api.get(`/opportunities/${id}`);
    return response.data;
};

export const createOpportunity = async (data) => {
    const response = await api.post('/opportunities', data);
    return response.data;
};

export const updateOpportunity = async (id, data) => {
    const response = await api.put(`/opportunities/${id}`, data);
    return response.data;
};

export const deleteOpportunity = async (id) => {
    const response = await api.delete(`/opportunities/${id}`);
    return response.data;
};

export const getArchivedOpportunities = async (params = {}) => {
    const response = await api.get('/opportunities/archived', { params });
    return response.data;
};

export const archiveOpportunity = async (id) => {
    const response = await api.post(`/opportunities/${id}/archive`);
    return response.data;
};

export const unarchiveOpportunity = async (id) => {
    const response = await api.post(`/opportunities/${id}/unarchive`);
    return response.data;
};

// -----------------
// USERS
// -----------------

export const getUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const getUser = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const createUser = async (data) => {
    const response = await api.post('/users', data);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

// -----------------
// ACTIVITIES
// -----------------

export const getActivities = async (params = {}) => {
    const response = await api.get('/activities', { params });
    return response.data;
};

export const getActivity = async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
};

export const createActivity = async (data) => {
    const response = await api.post('/activities', data);
    return response.data;
};

export const updateActivity = async (id, data) => {
    const response = await api.put(`/activities/${id}`, data);
    return response.data;
};

export const deleteActivity = async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
};

// -----------------
// COMPANIES
// -----------------

export const getCompanies = async (params = {}) => {
    const response = await api.get('/companies', { params });
    return response.data;
};

export const getCompany = async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
};

export const createCompany = async (data) => {
    const response = await api.post('/companies', data);
    return response.data;
};

export const updateCompany = async (id, data) => {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
};

export const deleteCompany = async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
};

export const getCompanyContacts = async (id) => {
    const response = await api.get(`/companies/${id}/contacts`);
    return response.data;
};

export const getCompanyOpportunities = async (id) => {
    const response = await api.get(`/companies/${id}/opportunities`);
    return response.data;
};

// -----------------
// FORECAST
// -----------------

export const getForecastSummary = async () => {
    const response = await api.get('/forecast/summary');
    return response.data;
};

export const getForecastTimeline = async (monthsAhead = 12) => {
    const response = await api.get('/forecast/timeline', { params: { months_ahead: monthsAhead } });
    return response.data;
};

export const getForecastQuarterly = async (year = null) => {
    const params = year ? { year } : {};
    const response = await api.get('/forecast/quarterly', { params });
    return response.data;
};

// -----------------
// COGNITO AI AGENT
// -----------------

export const sendCognitoMessage = async (message, sessionId = null) => {
    const response = await api.post('/cognito/chat', {
        message,
        session_id: sessionId,
        require_confirmation: true
    });
    return response.data;
};

export const confirmCognitoAction = async (confirmationToken, sessionId) => {
    const response = await api.post('/cognito/confirm', {
        confirmation_token: confirmationToken,
        session_id: sessionId
    });
    return response.data;
};

// Export error helper for components
export { getErrorMessage };
