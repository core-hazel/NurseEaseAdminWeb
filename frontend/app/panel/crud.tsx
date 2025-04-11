import React, { useEffect, useState } from "react";
import GeneralTab from "../crud/generaltab";
import EnrollTab from "../crud/enrolltab";

// Define the Nurse type
interface Nurse {
  id: number;
  name: string;
  department: string;
  ward: string;
  schedule: string;
}

function Crud() {
  const [activeTab, setActiveTab] = useState("General");
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch nurses data from API
  useEffect(() => {
    const fetchNurses = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/nurses"); // Replace with your API endpoint
        const data = await response.json();

        if (Array.isArray(data)) {
          setNurses(data);
        } else {
          console.error("Unexpected API response format:", data);
          setNurses([]);
        }
      } catch (error) {
        console.error("Failed to fetch nurses data:", error);
        setNurses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, []);

  const tabs = [
    { key: "General", label: "General" },
    { key: "Enroll", label: "Enroll" },
  ];

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      {/* Fixed Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-900">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`p-2 ml-4 ${
              activeTab === tab.key ? "border-b-2 border-blue-500 font-bold" : ""
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-grow mt-12">
        {activeTab === "General" ? (
          <div className="h-full overflow-auto">
            <GeneralTab nurses={nurses} loading={loading} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <EnrollTab />
          </div>
        )}
      </div>
    </div>
  );
}

export default Crud;
