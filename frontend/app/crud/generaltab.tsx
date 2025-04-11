import React from "react";

interface Nurse {
  id: number;
  name: string;
  department: string;
  ward: string;
  schedule: string;
}

interface Props {
  nurses: Nurse[];
  loading: boolean;
}


const GeneralTab: React.FC<Props> = ({ nurses, loading }) => {
  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden">
      <div className="flex-grow overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : (
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2">Nurse ID</th>
                <th className="border border-gray-700 p-2">Name</th>
                <th className="border border-gray-700 p-2">Department</th>
              </tr>
            </thead>
            <tbody>
              {nurses.map((nurse) => (
                <tr key={nurse.id} className="cursor-pointer hover:bg-gray-700">
                  <td className="border border-gray-700 p-2 text-center">{nurse.id}</td>
                  <td className="border border-gray-700 p-2 text-center">{nurse.name}</td>
                  <td className="border border-gray-700 p-2 text-center">{nurse.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GeneralTab;
