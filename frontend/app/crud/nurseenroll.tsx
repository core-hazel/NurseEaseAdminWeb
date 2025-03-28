import React, { useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const NurseEnroll: React.FC = () => {
    const { user } = useAuth(); // ✅ Check if user is authenticated
    const hospitalId = user?.hospitalId;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [loading, setLoading] = useState(false);

    const enrollNurse = async () => {
        if (!hospitalId) {
            alert("Hospital ID or code is missing!");
            return;
        }

        const nurseId =
            role === "nurse"
                ? `nu${hospitalId}${Math.floor(100 + Math.random() * 900)}`
                : `hd${hospitalId}${Math.floor(100 + Math.random() * 900)}`;

        const password = (hospitalId.slice(0, 3) || "tem") + Math.floor(1000 + Math.random() * 9000);

        const nurseData = {
            nurseId,
            name,
            email,
            phone,
            role,
            specialty,
            password,
            hospitalId,
        };

        try {
            setLoading(true);

            // Correctly interpolate the hospitalId in the URL
            const response = await fetch(`http://localhost:8000/enroll_nurse`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nurseData),
            });

            if (!response.ok) {
                throw new Error("Failed to enroll nurse");
            }

            const data = await response.json();
            alert("Nurse enrolled successfully!");
            console.log("Response:", data);
        } catch (error) {
            console.error("Error enrolling nurse:", error);
            alert("Failed to enroll nurse.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-md w-96 mx-auto">
            <h2 className="text-xl font-bold mb-4 text-white">Enroll Nurse</h2>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded mb-2 bg-gray-700 text-white placeholder-gray-400"
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded mb-2 bg-gray-700 text-white placeholder-gray-400"
            />

            <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded mb-2 bg-gray-700 text-white placeholder-gray-400"
            />

            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded mb-2 bg-gray-700 text-white"
            >
                <option value="" className="text-gray-400">
                    Select Role
                </option>
                <option value="nurse" className="text-black">
                    Nurse
                </option>
                <option value="headNurse" className="text-black">
                    Head Nurse
                </option>
            </select>

            <input
                type="text"
                placeholder="Specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full p-2 border rounded mb-2 bg-gray-700 text-white placeholder-gray-400"
            />

            <button
                onClick={enrollNurse}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? "Enrolling..." : "Enroll Nurse"}
            </button>
        </div>
    );
};

export default NurseEnroll;
