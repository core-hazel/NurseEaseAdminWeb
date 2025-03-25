import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

const LoginPage = () => {
    const [hospitalId, setHospitalId] = useState('');
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        try {
            const data = await login(hospitalId, adminId, password);
            console.log(data); // Log the response (e.g., message, role)

            // Redirect to the dashboard on successful login
            navigate('/dashboard');
        } catch (err) {
            setError(err.message); // Display the error message
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded shadow-md w-full max-w-sm"
            >
                <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Hospital ID</label>
                    <input
                        type="text"
                        value={hospitalId}
                        onChange={(e) => setHospitalId(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Admin ID</label>
                    <input
                        type="text"
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;

