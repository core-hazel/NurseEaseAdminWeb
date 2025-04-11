import React from "react";
import NurseEnroll from "~/crud/nurseenroll";
import Upload from "~/crud/upload";

const EnrollTab: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-center items-center h-full">
          <div className="w-full max-w-lg">
            <NurseEnroll />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-center items-center h-full">
          <div className="w-full max-w-lg">
            <Upload />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollTab;
