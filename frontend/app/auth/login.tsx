import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown"; // Ensure this path is correct
import Register from "./register"; // Import the Register component

const Login = () => {
    const [hospitals, setHospitals] = useState([]); // State to store hospital list
    const [selectedHospital, setSelectedHospital] = useState(""); // State for selected hospital
    const [adminId, setAdminId] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false); // State to toggle between login and register
    const navigate = useNavigate();

    // Fetch hospitals from the backend
    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await fetch("http://localhost:8000/hospitals");
                if (!response.ok) {
                    throw new Error("Failed to fetch hospitals");
                }
                const data = await response.json();
                setHospitals(data);
            } catch (error) {
                console.error("Error fetching hospitals:", error);
            }
        };

        fetchHospitals();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedHospital) {
            alert("Please select a hospital.");
            return;
        }

        const loginData = {
            hospitalId: selectedHospital,
            adminId,
            password,
        };

        try {
            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const result = await response.json();
            alert(`Login successful! Role: ${result.role}`);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            {isRegister ? (
                // Pass a callback to switch back to login mode
                <Register 
                    onSwitchToLogin={() => {
                        console.log("Switching to login");
                        setIsRegister(false)}
                    }
                />
            ) : (
                <form
                    onSubmit={handleLogin}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-80"
                >
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Login</h2>
                    <label className="block mb-2 text-gray-700 dark:text-gray-200">
                        Select Hospital:
                        <Dropdown
                            hospitals={hospitals}
                            onHospitalSelect={(hospital) => setSelectedHospital(hospital.id)}
                        />
                    </label>
                    <br />
                    <label className="block mb-2 text-gray-700 dark:text-gray-200">
                        Admin ID:
                        <input
                            type="text"
                            value={adminId}
                            onChange={(e) => setAdminId(e.target.value)}
                            required
                            className="w-full p-2 mb-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        />
                    </label>
                    <br />
                    <label className="block mb-2 text-gray-700 dark:text-gray-200">
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 mb-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        />
                    </label>
                    <br />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-all"
                    >
                        Login
                    </button>
                    <p className="mt-4 text-gray-700 dark:text-gray-200">
                        New to NurseEase?{" "}
                        <button
                            type="button"
                            onClick={() => setIsRegister(true)}
                            className="text-blue-500 dark:text-blue-400 hover:underline"
                        >
                            Register
                        </button>
                    </p>
                </form>
            )}
        </div>
    );
};

export default Login;