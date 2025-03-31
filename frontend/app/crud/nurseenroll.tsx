import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const NurseEnroll: React.FC = () => {
    const { user } = useAuth(); // ✅ Check if user is authenticated

    const [formData, setFormData] = useState({
        hospitalId: "",
        nurseId: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        speciality: "",
    });

    const hospitalId = user?.hospitalId;
   
    const [loading, setLoading] = useState(false);

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const enrollNurse = async () => {
        if (!hospitalId) {
            alert("Hospital ID or code is missing!");
            return;
        }
   
        if(
            !formData.name ||
            !formData.email ||
            !formData.phone ||
            !formData.role ||
            !formData.speciality
        ) {
            alert("Please fill in all fields!");
            return;
        }

        const nurseId =
            formData.role === "nurse"
                ? `nu${hospitalId.slice(0,3)}${Math.floor(100 + Math.random() * 90)}`
                : `hd${hospitalId.slice(0,3)}${Math.floor(100 + Math.random() * 90)}`;

        const password = (hospitalId.slice(0, 3) || "tem") + Math.floor(1000 + Math.random() * 9000);
        const nurseData = {
            hospitalId: hospitalId,
            nurseId:nurseId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: password,
            role: formData.role,
            speciality: formData.speciality.split(",").map((s) => s.trim()),
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
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2 bg-gray-700 text-white placeholder-gray-400"
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2 bg-gray-700 text-white placeholder-gray-400"
            />

            <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2 bg-gray-700 text-white placeholder-gray-400"
            />

            <select
                value={formData.role}
                name="role"
                onChange={handleChange}
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
                name="speciality"
                placeholder="Speciality"
                value={formData.speciality}
                onChange={handleChange}
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
