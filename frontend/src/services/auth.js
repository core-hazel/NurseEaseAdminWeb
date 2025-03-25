import axios from 'axios';

const API_BASE_URL = "http://localhost:8000"; // Replace with your backend URL

export const login = async (hospitalId, adminId, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            hospitalId,
            adminId,
            password,
        });
        return response.data; // Return the response data (e.g., message, role)
    } catch (error) {
        if (error.response) {
            // Handle HTTP errors (e.g., 401, 404)
            throw new Error(error.response.data.detail || "Login failed");
        } else {
            // Handle network or other errors
            throw new Error("An error occurred while logging in");
        }
    }
};