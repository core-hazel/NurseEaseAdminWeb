import React, { createContext, useContext, useState } from "react";

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Define the shape of the User object
interface User {
  id: string;
  role: string;
  hospitalId: string;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to safely access localStorage
const getStoredUser = (): User | null => {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  }
  return null;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser);

  // Login function
  const login = (userData: User) => {
    setUser(userData); // Set the user data
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("authUser", JSON.stringify(userData)); // Save user to localStorage
    }
  };

  // Logout function
  const logout = () => {
    setUser(null); // Clear the user data
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("authUser"); // Remove user from localStorage
    }
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