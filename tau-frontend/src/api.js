import axios from 'axios';

// Use Environment Variable or Default to Localhost
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_URL = `${BASE_URL}/api`;

export const getContacts = async () => {
    const response = await axios.get(`${API_URL}/contacts`);
    return response.data;
};

export const updateContact = async (id, data) => {
    const response = await axios.put(`${API_URL}/contacts/${id}`, data);
    return response.data;
};

export const createContact = async (data) => {
    const response = await axios.post(`${API_URL}/contacts`, data);
    return response.data;
};

export const getOpportunities = async () => {
    const response = await axios.get(`${API_URL}/opportunities`);
    return response.data;
};

export const updateOpportunity = async (id, data) => {
    const response = await axios.put(`${API_URL}/opportunities/${id}`, data);
    return response.data;
};

export const createOpportunity = async (data) => {
    const response = await axios.post(`${API_URL}/opportunities`, data);
    return response.data;
};

export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};
