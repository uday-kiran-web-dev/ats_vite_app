import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const dashboardPath = user
    ? user.role === "Recruiter"
      ? "/recruiter"
      : user.role === "Admin"
        ? "/admin"
        : "/dashboard"
    : "/";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-2xl font-bold text-slate-900">
          ATS
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Jobs
          </Link>
          {user && (
            <Link
              to={dashboardPath}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <FaUserCircle className="h-5 w-5 text-slate-700" />
                <span className="hidden sm:inline">
                  {user.firstName || "Account"}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <Link
                    to={dashboardPath}
                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.role === "Candidate" && (
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setProfileOpen(false)}
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
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Login
            </Link>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle mobile menu"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <Link
            to="/"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            onClick={() => setMobileOpen(false)}
          >
            Jobs
          </Link>
          {user && (
            <Link
              to={dashboardPath}
              className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {user ? (
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-slate-100"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
