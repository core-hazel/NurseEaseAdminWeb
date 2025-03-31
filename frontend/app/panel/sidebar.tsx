import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Calendar, FileText, Clipboard } from "lucide-react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const menuItems = [
        { name: "Schedule", path: "/dashboard", icon: <Calendar size={24} /> },
        { name: "Leave Request", path: "/dashboard/leaverequest", icon: <FileText size={24} /> },
        { name: "CRUD", path: "/dashboard/crud", icon: <Clipboard size={24} /> },
    ];

    return (
        <div className="bg-gray-800 text-white h-screen p-4 flex-shrink-0 transition-all duration-300">
            {/* Sidebar Header */}
            <div className="flex items-center mb-6 pl-1 pt-2 pb-4 border-b border-gray-700">
                <button
                    onClick={toggleSidebar}
                    className="flex items-center space-x-2 focus:outline-none"
                >
                    {isOpen ? <X size={28} /> : <Menu size={26} />}
                    {isOpen && <span className="text-lg font-semibold">Menu</span>}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`block p-2 rounded transition duration-300 ${
                            location.pathname === item.path ? "bg-gray-700" : "hover:bg-gray-800"
                        }`}
                    >
                        <div className="flex items-center">
                            {item.icon}
                            {isOpen && <span className="ml-2">{item.name}</span>}
                        </div>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
