import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

// Define the shape of the AuthContext
interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

// Define the shape of the User object
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

// Create the AuthContext with a default value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component props
interface AuthProviderProps {
    children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); // State to hold the authenticated user

    // Login function
    const login = (userData: User) => {
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

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};