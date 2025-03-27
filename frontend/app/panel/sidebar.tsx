import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Calendar, FileText, Clipboard } from "lucide-react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    const toggleSidebar = () => setIsOpen(!isOpen);

    // Move "Schedule" to the top
    const menuItems = [
        { name: "Schedule", path: "/dashboard",icon: <Calendar size={24} /> },
        { name: "Leave Request", path: "/dashboard/leaverequest", icon: <FileText size={24} /> },
        { name: "CRUD", path: "/dashboard/crud", icon: <Clipboard size={24} /> },
    ];

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className={`bg-gray-900 text-white h-screen p-4 ${isOpen ? "w-64" : "w-16"} transition-all duration-300`}>
                <button onClick={toggleSidebar} className="mb-4 focus:outline-none">
                    {isOpen ? <X size={28} /> : <Menu size={26} />}
                </button>
                <nav className="space-y-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block p-2 rounded transition duration-300 ${location.pathname === item.path ? "bg-gray-700" : "hover:bg-gray-800"}`}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                 {item.icon}
                                 {isOpen && <span style={{ marginLeft: '8px' }}>{item.name}</span>}
                            </div>

                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
