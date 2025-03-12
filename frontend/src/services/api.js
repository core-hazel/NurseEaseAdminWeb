import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // Replace with your FastAPI backend URL
});

export const loginUser = async (username, password) => {
    try {
        const response = await api.post('/login', { username, password });
        return response.data;
    } catch (error) {
        console.error('Login Error:', error);
        throw error;
    }
};

export const fetchNurseSchedule = async () => {
    try {
        const response = await api.get('/schedule');
        return response.data;
    } catch (error) {
        console.error('Fetch Schedule Error:', error);
        throw error;
    }
};

export const generateNurseSchedule = async () => {
    try {
        const response = await api.post('/generate_schedule');
        return response.data;
    } catch (error) {
        console.error('Generate Schedule Error:', error);
        throw error;
    }
};

export const createAdmin = async (username, password, role) => {
    try {
        const response = await api.post('/register_admin', { username, password, role });
        return response.data;
    } catch (error) {
        console.error('Create Admin Error:', error);
        throw error;
    }
};

export default api;

