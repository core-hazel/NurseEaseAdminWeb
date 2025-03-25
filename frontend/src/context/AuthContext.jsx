import { createContext, useState } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State to hold the authenticated user

    // Login function
    const login = (userData) => {
        setUser(userData); // Set the user data
    };

    // Logout function
    const logout = () => {
        setUser(null); // Clear the user data
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};