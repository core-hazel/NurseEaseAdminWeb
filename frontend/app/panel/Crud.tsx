import Upload from "~/crud/upload";
import NurseEnroll from "~/crud/nurseenroll";

function Crud() {
    return (
        <div className="bg-gray-900 text-white p-4 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {/* NurseEnroll Section */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-center items-center h-full">
                    <div className="w-full max-w-lg">
                        <NurseEnroll />
                    </div>
                </div>

                {/* Upload Section */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-center items-center h-full">
                    <div className="w-full max-w-lg">
                        <Upload />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Crud;
