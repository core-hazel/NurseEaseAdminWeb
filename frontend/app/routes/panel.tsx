import { Outlet } from "react-router-dom";
import Sidebar from "~/panel/sidebar";
import { UserCircle } from "lucide-react";
import ProtectedRoute from "~/components/ProtectedRoute";

function Panel() {
    return (
        <ProtectedRoute>
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex flex-col flex-1 bg-gray-900">
                    {/* Header */}
                    <Header />

                    {/* Outlet for Nested Routes */}
                    <div className="flex-1 overflow-y-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

const Header = () => {
    return (
        <div className="bg-gray-900 text-white flex justify-between items-center p-4 shadow-md">
            {/* Left - App Name */}
            <h1 className="text-xl font-semibold">NurseEase Admin</h1>

            {/* Right - Profile Icon */}
            <button className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg transition">
                <UserCircle size={28} />
            </button>
        </div>
    );
};

export default Panel;
