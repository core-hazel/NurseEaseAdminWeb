import { Outlet, Link } from "react-router-dom";
import Sidenbar from "~/panel/sidebar";
import { UserCircle } from "lucide-react";
import ProtectedRoute from "~/components/ProtectedRoute";

function Panel() {
    return (
        <ProtectedRoute>
            <div className="flex h-screen">
                <Sidenbar />
                {/* Main Content */}
                <div className="flex-1">
                <Header />
                    <Outlet />
                </div>
            </div>
        </ProtectedRoute>
    );
}
const Header = () => {
    return (
        <div className="bg-gray-900 text-white flex justify-between items-center p-3 shadow-md">
            {/* Left - App Name */}
            <h1 className="text-xl font-semibold">NurseEase Admin</h1>

            {/* Right - Profile Icon */}
            <button className="flex items-center space-x-2 hover:bg-gray-800 p-2 rounded-lg transition">
                <UserCircle size={28} />
            </button>
        </div>
    );
};

export default Panel;
