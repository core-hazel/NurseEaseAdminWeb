import { Link } from "react-router-dom";
import logo from "../assets/logo.png";  // Importing the logo file

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <div className="flex items-center">
        <img src={logo} alt="NurseEase Logo" className="h-10 w-10 mr-2" />  
        <h1 className="text-xl font-bold">NurseEase</h1>
      </div>
      <div>
        <Link className="mx-2" to="/">Home</Link>
        <Link className="mx-2" to="/register">Register</Link>
        <Link className="mx-2" to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
