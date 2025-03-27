import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RegisterProps {
    onSwitchToLogin: () => void; // Callback to switch back to login
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        hospitalName: "",
        address: "",
        specialities: "",
        state: "",
        contactNumber: "",
        email: "",
        noofbeds: "",
        city: "",
    });

    const [error, setError] = useState<string | null>(null); // State for error messages

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (
            !formData.hospitalName ||
            !formData.address ||
            !formData.specialities ||
            !formData.state ||
            !formData.contactNumber ||
            !formData.email ||
            !formData.city
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        setError(null); 
        const registerData = {
            hospitalName: formData.hospitalName,
            address: formData.address,
            specialities: formData.specialities.split(",").map((speciality) => speciality.trim()),
            state: formData.state,
            contactNumber: formData.contactNumber,
            email: formData.email,
            noofbeds: formData.noofbeds,
            city: formData.city,
        };

        try {
            const response = await fetch("http://localhost:8000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            const result = await response.json();
            alert(`Registration successful! Hospital ID: ${result.hospitalId}\nAdmin ID: ${result.adminId}\nAdmin Password: ${result.adminPassword}`);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error during registration:", error);
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-3xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-3xl font-semibold text-center text-blue-500 dark:text-blue-400">
                    NurseEase
                </h1>
                <h2 className="text-xl font-medium text-center text-gray-700 dark:text-gray-200 mt-2">
                    Hospital Registration
                </h2>
                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-red-500 text-center mb-4">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Hospital Name
                            </label>
                            <input
                                type="text"
                                name="hospitalName"
                                value={formData.hospitalName}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter hospital name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter address"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Specialities
                            </label>
                            <input
                                type="text"
                                name="specialities"
                                value={formData.specialities}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter Specialities , separated"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                State
                            </label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500 focus:outline-none"
                                required
                            >
                                <option value="">Select State</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Telangana">Telangana</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter contact number"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Number of Beds
                            </label>
                            <input
                                type="text"
                                name="noofbeds"
                                value={formData.noofbeds}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter number of beds"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter city"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 text-white bg-blue-500 dark:bg-blue-600 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-500"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-blue-500 dark:text-blue-400 hover:underline"
                    >
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;