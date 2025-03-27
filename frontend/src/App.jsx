import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home"; // Ensure Home is imported
import { AuthProvider } from "./context/AuthContext.jsx"; // Change .js to .jsx
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
    return (
       
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <AuthProvider>
                            <DashboardPage />
                        </AuthProvider>
                    }
                />
            </Routes>
      
    );
};

export default App;

