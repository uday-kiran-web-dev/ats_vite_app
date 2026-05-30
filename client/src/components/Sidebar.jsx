import { NavLink } from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import {
  FaBriefcase,
  FaUsers,
  FaChartBar,
  FaFileAlt,
  FaUserCircle,
  FaHistory,
  FaTimes,
} from "react-icons/fa";

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { user } = useContext(AuthContext);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg p-5 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-blue-600">ATS System</h1>
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          {/* Candidate */}
          {user?.role === "Candidate" && (
            <>
              <NavLink
                to="/dashboard"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaChartBar />
                Dashboard
              </NavLink>

              <NavLink
                to="/"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaBriefcase />
                Jobs
              </NavLink>

              <NavLink
                to="/applications"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaFileAlt />
                Applications
              </NavLink>

              <NavLink
                to="/profile"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaUserCircle />
                Profile
              </NavLink>
            </>
          )}

          {/* Recruiter */}
          {user?.role === "Recruiter" && (
            <>
              <NavLink
                to="/recruiter"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaChartBar />
                Dashboard
              </NavLink>

              <NavLink
                to="/recruiter/jobs"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaBriefcase />
                Manage Jobs
              </NavLink>

              <NavLink
                to="/recruiter/applications"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaFileAlt />
                Applications
              </NavLink>
              <NavLink
                to="/recruiter/candidates"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaUsers />
                Candidates
              </NavLink>

              <NavLink
                to="/profile"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaUserCircle />
                Profile
              </NavLink>

              <NavLink
                to="/admin/analytics"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaChartBar />
                Analytics
              </NavLink>
            </>
          )}

          {/* Admin */}
          {user?.role === "Admin" && (
            <>
              <NavLink
                to="/admin"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaChartBar />
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/users"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaUsers />
                Users
              </NavLink>

              <NavLink
                to="/admin/jobs"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaBriefcase />
                Jobs
              </NavLink>

              <NavLink
                to="/admin/applications"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaFileAlt />
                Applications
              </NavLink>
              <NavLink
                to="/admin/user-logs"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaHistory />
                User Logs
              </NavLink>
              <NavLink
                to="/recruiter/candidates"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaUsers />
                Candidates
              </NavLink>

              <NavLink
                to="/profile"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaUserCircle />
                Profile
              </NavLink>

              <NavLink
                to="/admin/analytics"
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100"
                  }`
                }
              >
                <FaChartBar />
                Analytics
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
