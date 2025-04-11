import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, login } = useAuth(); // Use login instead of setUser
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for user data
        const storedUser = localStorage.getItem("authUser");
        if (storedUser && !user) {
            login(JSON.parse(storedUser)); // Use login to restore user from localStorage
        }
        setIsLoading(false); // Mark loading as complete
    }, [user, login]);

    if (isLoading) {
        // Show a loading spinner or placeholder while checking localStorage
        return <div>Loading...</div>;
    }

    return user ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
