import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
    baseURL: 'http://localhost:8000', // Replace with your FastAPI backend URL
});

// Define TypeScript types for the API responses
interface Hospital {
    id: string;
    name: string;
}

interface Admin {
    username: string;
    password: string;
    role: string;
}

// Fetch the list of hospitals
export const fetchHospitals = async (): Promise<Hospital[]> => {
    try {
        const response = await api.get<{ hospitals: Hospital[] }>('/hospitals');
        return response.data.hospitals;
    } catch (error) {
        console.error('Fetch Hospitals Error:', error);
        throw error;
    }
};

// Fetch the nurse schedule
export const fetchNurseSchedule = async (): Promise<any> => {
    try {
        const response = await api.get('/schedule');
        return response.data;
    } catch (error) {
        console.error('Fetch Schedule Error:', error);
        throw error;
    }
};

// Generate a new nurse schedule
export const generateNurseSchedule = async (): Promise<any> => {
    try {
        const response = await api.post('/generate_schedule');
        return response.data;
    } catch (error) {
        console.error('Generate Schedule Error:', error);
        throw error;
    }
};

// Create a new admin
export const createAdmin = async (admin: Admin): Promise<any> => {
    try {
        const response = await api.post('/register_admin', admin);
        return response.data;
    } catch (error) {
        console.error('Create Admin Error:', error);
        throw error;
    }
};

// Export the Axios instance for custom requests
export default api;

