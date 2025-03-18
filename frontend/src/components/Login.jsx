import React, { useState } from "react";

const hospitals = ["Hospital A", "Hospital B", "Hospital C"]; // This should be fetched from OpenXL
const roles = {
  c123: "Chief Admin",
  a123: "Admin",
  h123: "Head Nurse",
  n123: "Nurse",
};

export default function Login() {
  const [hospital, setHospital] = useState("");
  const [nurseID, setNurseID] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null);

  const handleLogin = () => {
    if (roles[password]) {
      setRole(roles[password]);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {!role ? (
          <>
            <h2 className="text-2xl font-bold text-center text-blue-600">Nurse Ease Login</h2>
            <div className="mt-4">
              <label className="block text-gray-700">Select Hospital:</label>
              <select
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="">-- Choose Hospital --</option>
                {hospitals.map((hosp) => (
                  <option key={hosp} value={hosp}>{hosp}</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Nurse ID:</label>
              <input
                type="text"
                value={nurseID}
                onChange={(e) => setNurseID(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
            >
              Login
            </button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-600">Welcome, {role}!</h2>
            <p className="text-gray-700 mt-2">Select an option below:</p>
            <select className="w-full p-2 border rounded mt-4">
              <option>Schedule</option>
              <option>Data</option>
              <option>Leave Request</option>
              <option>Attendance</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
