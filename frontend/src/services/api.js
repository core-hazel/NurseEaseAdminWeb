// src/services/api.js
const API_URL = 'http://localhost:8000'; // Change to your backend URL

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

export const getSchedules = async () => {
    const response = await fetch(`${API_URL}/schedules`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you store the token
        },
    });
    return response.json();
};
