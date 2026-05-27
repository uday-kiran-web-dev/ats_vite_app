import { useContext, useState } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

function Navbar({ onMenuClick }) {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardPath = user
    ? user.role === "Recruiter"
      ? "/recruiter"
      : user.role === "Admin"
        ? "/admin"
        : "/dashboard"
    : "/";

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md text-blue-600 hover:bg-blue-100"
          aria-label="Open sidebar"
        >
          <FaBars />
        </button>

        <div>
          <h2 className="text-xl font-semibold">Welcome, {user?.firstName}</h2>
          <p className="text-sm text-slate-500">{user?.role}</p>
        </div>
      </div>

      <div className="relative flex items-center gap-4">
        <button
          type="button"
          onClick={() => setDropdownOpen((open) => !open)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <FaUserCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Account</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-16 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <Link
              to={dashboardPath}
              className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setDropdownOpen(false)}
            >
              Dashboard
            </Link>
            {user?.role === "Candidate" && (
              <Link
                to="/profile"
                className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
