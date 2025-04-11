import React, { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext"; // Adjust the import path as needed

interface Nurse {
  nurseId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  speciality: string[]; // Ensure this is always an array
  password: string;
  hospitalId: string;
}

const GeneralTab: React.FC = () => {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [filteredNurses, setFilteredNurses] = useState<Nurse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const { user } = useAuth(); // Get the authenticated user from context
  const hospitalId = user?.hospitalId; // Get the hospital ID from the authenticated user

  // Fetch nurses data from API
  useEffect(() => {
    const fetchNurses = async () => {
      if (!hospitalId) {
        console.error("Hospital ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/nurses?hospitalId=${hospitalId}`);
        const data = await response.json();

        if (Array.isArray(data.nurses)) {
          // Ensure speciality is always an array
          const nursesWithSpeciality = data.nurses.map((nurse: Nurse) => ({
            ...nurse,
            speciality: nurse.speciality || [], // Default to an empty array if undefined
          }));
          setNurses(nursesWithSpeciality);
          setFilteredNurses(nursesWithSpeciality); // Initialize filtered data
        } else {
          console.error("Unexpected API response format:", data);
          setNurses([]);
          setFilteredNurses([]);
        }
      } catch (error) {
        console.error("Failed to fetch nurses data:", error);
        setNurses([]);
        setFilteredNurses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, [hospitalId]);

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter nurses based on the search term
    const filtered = nurses.filter(
      (nurse) =>
        nurse.name.toLowerCase().includes(value) ||
        nurse.speciality.some((speciality) => speciality.toLowerCase().includes(value))
    );
    setFilteredNurses(filtered);
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 bg-gray-800">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name or speciality..."
          className="w-full p-2 rounded-md border border-gray-700 bg-gray-900 text-white"
        />
      </div>

      {/* Table and Details */}
      <div className="flex-grow flex overflow-hidden">
        {/* Nurse Table */}
        <div className={`transition-all duration-300 ${selectedNurse ? "w-2/3" : "w-full"} overflow-auto`}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            </div>
          ) : (
            <table className="w-full border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 p-2">ID</th>
                  <th className="border border-gray-700 p-2">Name</th>
                  <th className="border border-gray-700 p-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredNurses.map((nurse) => (
                  <tr
                    key={nurse.nurseId}
                    className="cursor-pointer hover:bg-gray-700"
                    onClick={() => setSelectedNurse(nurse)}
                  >
                    <td className="border border-gray-700 p-2 text-center">{nurse.nurseId}</td>
                    <td className="border border-gray-700 p-2 text-center">{nurse.name}</td>
                    <td className="border border-gray-700 p-2 text-center">{nurse.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Nurse Details */}
        {selectedNurse && (
          <div className="w-1/3 p-4 border-l border-gray-700 bg-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">Nurse Details</h2>
            <p className="text-white"><strong>ID:</strong> {selectedNurse.nurseId}</p>
            <p className="text-white"><strong>Name:</strong> {selectedNurse.name}</p>
            <p className="text-white"><strong>Email:</strong> {selectedNurse.email}</p>
            <p className="text-white"><strong>Phone:</strong> {selectedNurse.phone}</p>
            <p className="text-white"><strong>Role:</strong> {selectedNurse.role}</p>
            <p className="text-white"><strong>Speciality:</strong> {selectedNurse.speciality?.join(", ") || "N/A"}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setSelectedNurse(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralTab;
