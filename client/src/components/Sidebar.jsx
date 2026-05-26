import { Link } from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import {
  FaBriefcase,
  FaUsers,
  FaChartBar,
  FaFileAlt,
  FaUserCircle,
} from "react-icons/fa";

function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen p-5">
      <h1 className="text-2xl font-bold text-blue-600 mb-10">ATS System</h1>

      <nav className="flex flex-col gap-4">
        {/* Candidate */}
        {user?.role === "Candidate" && (
          <>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-100"
            >
              <FaChartBar />
              Dashboard
            </Link>

            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-100"
            >
              <FaBriefcase />
              Jobs
            </Link>

            <Link
              to="/applications"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-100"
            >
              <FaFileAlt />
              Applications
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-100"
            >
              <FaUserCircle />
              Profile
            </Link>
          </>
        )}

        {/* Recruiter */}
        {user?.role === "Recruiter" && (
          <>
            <Link
              to="/recruiter"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-100"
            >
              <FaChartBar />
              Dashboard
            </Link>

            <Link
              to="/recruiter/jobs"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-100"
            >
              <FaBriefcase />
              Manage Jobs
            </Link>

            <Link
              to="/recruiter/applications"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-100"
            >
              <FaFileAlt />
              Applications
            </Link>
          </>
        )}

        {/* Admin */}
        {user?.role === "Admin" && (
          <>
            <Link
              to="/admin"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-100"
            >
              <FaChartBar />
              Dashboard
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-100"
            >
              <FaUsers />
              Users
            </Link>

            <Link
              to="/admin/jobs"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-100"
            >
              <FaBriefcase />
              Jobs
            </Link>

            <Link
              to="/admin/applications"
              className="flex items-center gap-3 p-3 rounded hover:bg-blue-100"
            >
              <FaFileAlt />
              Applications
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
