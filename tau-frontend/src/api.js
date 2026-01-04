import axios from 'axios';

// Ensure this matches your backend URL/Port
const API_URL = 'http://localhost:8000/api';
// NOTE: User mentioned 5001 ("http://localhost:5001"), but FastAPI default is 8000. 
// I will stick to 8000 unless I change the backend run command. 
// I'll create a variable.

const api = axios.create({
    baseURL: API_URL,
});

export const getContacts = async () => {
    const response = await api.get('/contacts');
    return response.data;
};

export const updateContact = async (id, data) => {
    const response = await api.put(`/contacts/${id}`, data);
    return response.data;
};

export const getOpportunities = async () => {
    const response = await api.get('/opportunities');
    return response.data;
};

export const updateOpportunity = async (id, data) => {
    const response = await api.put(`/opportunities/${id}`, data);
    return response.data;
};
