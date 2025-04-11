import { useState } from "react";
import GeneralTab from "../crud/generaltab";
import EnrollTab from "../crud/enrolltab";

function Crud() {
  const [activeTab, setActiveTab] = useState("General");

  const tabs = [
    { key: "General", label: "General" },
    { key: "Enroll", label: "Enroll" },
  ];

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      {/* Fixed Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-900 px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-md ${
              activeTab === tab.key
                ? "border-b-2 border-blue-500 font-bold text-blue-500"
                : "hover:text-blue-400"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-grow px-4 pt-2 flex"> {/* Use flex-grow and flex */}
        {activeTab === "General" ? (
          <div className="flex-grow overflow-auto"> {/* Use flex-grow here */}
            <GeneralTab />
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center"> {/* Use flex-grow here */}
            <EnrollTab />
          </div>
        )}
      </div>
    </div>
  );
}

export default Crud;
