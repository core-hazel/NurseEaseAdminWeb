import React, { useState, useEffect } from "react";
import { fetchHospitals } from "../services/api"; // Ensure this path is correct
import { Card } from "../ui/card"; // Replace with a valid component or use a div if Card is unavailable
import { Input } from "../ui/input"; // Ensure this component supports the 'value' prop or replace it with a standard input element

// Define TypeScript types for props and hospitals
interface Hospital {
    id: string;
    name: string;
}

interface DropdownProps {
    hospitals?: Hospital[]; // Make hospitals optional
    onHospitalSelect: (hospital: Hospital) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ hospitals = [], onHospitalSelect }) => {
    const [allHospitals, setAllHospitals] = useState<Hospital[]>(hospitals); // State for all hospitals
    const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>(hospitals); // State for filtered hospitals
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [expanded, setExpanded] = useState(false); // State to toggle dropdown visibility
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState<string | null>(null); // State for error handling

    // Fetch hospitals if not provided via props
    useEffect(() => {
        if (hospitals.length === 0) {
            setLoading(true);
            fetchHospitals()
                .then((data) => {
                    console.log("Fetched hospitals:", data); // Debugging
                    setAllHospitals(data);
                    setFilteredHospitals(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching hospitals:", err);
                    setError("Failed to fetch hospitals. Please try again.");
                    setLoading(false);
                });
        }
    }, [hospitals]);

    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = allHospitals.filter((hospital) =>
            hospital.name.toLowerCase().includes(query.toLowerCase())
        );

        console.log("Filtered hospitals:", filtered); // Debugging
        setFilteredHospitals(filtered);
        setExpanded(query.length > 0);
    };

    // Handle hospital selection
    const handleSelect = (hospital: Hospital) => {
        setSearchQuery(hospital.name);
        setExpanded(false);
        if (onHospitalSelect) onHospitalSelect(hospital);
    };

    return (
        <div className="w-full max-w-md mx-auto mt-4">
            {/* Search Input */}
            <Input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Hospital"
                className="mb-2 border border-gray-300 rounded-md p-2"
            />

            {/* Loading Indicator */}
            {loading && (
                <div className="text-gray-500 text-center mt-2">Loading hospitals...</div>
            )}

            {/* Error Message */}
            {error && (
                <div className="text-red-500 text-center mt-2">{error}</div>
            )}

            {/* Dropdown List */}
            {expanded && filteredHospitals.length > 0 && (
                <div className="border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
                    {filteredHospitals.map((hospital) => (
                        <Card
                            key={hospital.id}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSelect(hospital)}
                        >
                            {hospital.name}
                        </Card>
                    ))}
                </div>
            )}

            {/* No Results Message */}
            {expanded && filteredHospitals.length === 0 && !loading && (
                <div className="text-gray-500 text-center mt-2">
                    No hospitals found.
                </div>
            )}
        </div>
    );
};

export default Dropdown;

