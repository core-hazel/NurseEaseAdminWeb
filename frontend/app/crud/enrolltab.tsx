import React from "react";
import NurseEnroll from "~/crud/nurseenroll";
import Upload from "~/crud/upload";

const EnrollTab: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col h-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Nurse Enroll Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-center items-center h-full">
          <div className="w-full max-w-lg">
            <NurseEnroll />
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-center items-center h-full">
          <div className="w-full max-w-lg">
            <Upload />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollTab;
