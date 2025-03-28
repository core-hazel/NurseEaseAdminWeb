import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Schedule = () => {
    const [schedule, setSchedule] = useState<{ [key: string]: { shift: string; dept: string }[] }>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { user } = useAuth();
    const hospitalId = user?.hospitalId; // Replace dynamically if needed
    console.log("User:", user);
    console.log("Hospital ID:", hospitalId);

    // Function to generate schedule using FastAPI
    const generateSchedule = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8000/generate_schedule", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    hospital_id: hospitalId,
                    absent_nurses: [], // Modify if needed
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate schedule");
            }

            console.log("Schedule generated successfully!");
            await fetchSchedule(); // Fetch the updated schedule after generating
        } catch (err) {
            setError("Error generating schedule. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch schedule from Firestore
    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/fetch_schedule/${hospitalId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch schedule");
            }
            const data = await response.json();
            console.log("Fetched schedule:", data);
            setSchedule(data);
        } catch (error) {
            setError("Error fetching schedule");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hospitalId) {
            fetchSchedule();
        }
    }, [hospitalId]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Overall Nurse Schedule</h1>

            {/* Generate Schedule Button */}
            <button 
                onClick={generateSchedule} 
                className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Schedule"}
            </button>

            {error && <p className="text-red-600">{error}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="px-4 py-2 text-left">Nurse</th>
                            <th className="px-4 py-2 text-left">Shift</th>
                            <th className="px-4 py-2 text-left">Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(schedule).map(([nurse, shifts]) =>
                            shifts.map((shiftDetail, index) => (
                                <tr key={`${nurse}-${index}`} className="border-t border-gray-300">
                                    <td className="px-4 py-2">{nurse}</td>
                                    <td className="px-4 py-2">{shiftDetail.shift}</td>
                                    <td className="px-4 py-2">{shiftDetail.dept}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Schedule;
