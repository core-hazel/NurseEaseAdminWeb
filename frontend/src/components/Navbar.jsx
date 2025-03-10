import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const handleLogout = () => {
    // Implement logout logic here (e.g., clear tokens, redirect to login)
    console.log("User  logged out");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          NurseEase Admin
        </Link>
        <div className="space-x-4">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "text-gray-200" : "hover:text-gray-200")}>
            Dashboard
          </NavLink>
          <NavLink to="/schedule" className={({ isActive }) => (isActive ? "text-gray-200" : "hover:text-gray-200")}>
            Schedule
          </NavLink>
          <button onClick={handleLogout} className="hover:text-gray-200">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
