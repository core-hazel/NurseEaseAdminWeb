import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth(); // ✅ Check if user is authenticated
    return user ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
