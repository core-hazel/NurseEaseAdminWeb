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
export const fetchNursesSchedule = async (hospitalId: string): Promise<any> => {
    console.log("Fetching schedule for:", hospitalId);  // ✅ Debugging log
    try {
        const response = await api.get(`/fetch_schedule/${hospitalId}`);
        return response.data;
    } catch (error) {
        console.error('Fetch Schedule Error:', error);
        throw new Error('Failed to fetch the nurse schedule. Please try again.');
    }
};



// Generate a new nurse schedule
export const generateNurseSchedule = async (hospitalId: string, absentNurses: string[]): Promise<any> => {
    try {
        const response = await api.post('/generate_schedule', {
            hospital_id: hospitalId,
            absent_nurses: absentNurses,
        });
        return response.data;
    } catch (error) {
        console.error('Generate Schedule Error:', error);
        throw new Error('Failed to generate the nurse schedule. Please try again.');
    }
};
// Create a new admin
export const register = async (admin: Admin): Promise<any> => {
    try {
        const response = await api.post('/auth/register', admin);
        return response.data;
    } catch (error) {
        console.error('Create Hospital Error', error);
        throw error;
    }
};

// Create a new admin
export const login = async (admin: Admin): Promise<any> => {
    try {
        const response = await api.post('/auth/login', admin);
        return response.data;
    } catch (error) {
        console.error('login Error', error);
        throw error;
    }
};

// ✅ Automatically attach auth token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Logout function (optional)
export const logout = () => {
    localStorage.removeItem('token');
};

// Export the Axios instance for custom requests
export default api;

