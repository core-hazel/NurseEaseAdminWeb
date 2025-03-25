import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores the authenticated user's details
    const [loading, setLoading] = useState(true); // Tracks whether the app is loading user data

    // Base URL for the FastAPI backend
    const API_BASE_URL = "http://localhost:8000/api/auth";

    // Check if the user is already logged in (on app load)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get(`${API_BASE_URL}/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    setUser(res.data); // Set the user data from the backend
                })
                .catch(() => {
                    console.error("Invalid token, logging out...");
                    localStorage.removeItem("token");
                    setUser(null);
                })
                .finally(() => setLoading(false)); // Stop loading after the request
        } else {
            setLoading(false); // No token, stop loading
        }
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
            localStorage.setItem("token", res.data.token); // Save the JWT token
            setUser(res.data.user); // Set the user data
        } catch (error) {
            console.error("Login failed:", error.response?.data?.detail || error.message);
            throw error; // Rethrow to be caught in the login form
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token"); // Remove the token
        setUser(null); // Clear the user data
    };

    // Provide the user, login, and logout functions to the app
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);