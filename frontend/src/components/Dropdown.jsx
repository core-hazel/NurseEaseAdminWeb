import React, { useState, useEffect } from 'react';
import { fetchHospitals } from '../services/api';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Dropdown = ({ onHospitalSelect }) => {
    const [hospitals, setHospitals] = useState([]);
    const [filteredHospitals, setFilteredHospitals] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const getHospitals = async () => {
            try {
                const data = await fetchHospitals();
                setHospitals(data);
                setFilteredHospitals(data);
            } catch (error) {
                console.error('Failed to fetch hospitals:', error);
            }
        };
        getHospitals();
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setFilteredHospitals(hospitals.filter(hospital => hospital.name.toLowerCase().includes(query.toLowerCase())));
        setExpanded(query.length > 0);
    };

    const handleSelect = (hospital) => {
        setSearchQuery(hospital.name);
        setExpanded(false);
        if (onHospitalSelect) onHospitalSelect(hospital);
    };

    return (
        <div className="w-full max-w-md mx-auto mt-4">
            <Input 
                value={searchQuery} 
                onChange={handleSearchChange} 
                placeholder="Search Hospital" 
                className="mb-2" 
            />

            {expanded && filteredHospitals.length > 0 && (
                <div className="border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
                    {filteredHospitals.map(hospital => (
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
        </div>
    );
};

export default Dropdown;

