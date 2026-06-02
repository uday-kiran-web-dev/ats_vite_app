import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaToggleOn, FaToggleOff } from "react-icons/fa";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

function Candidates() {
  const [profiles, setProfiles] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch candidates
  const fetchCandidates = async () => {
    try {
      const { data } = await API.get("/profiles");
      // Sort by newest first
      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setProfiles(sorted);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (profileId, isActive) => {
    try {
      const { data } = await API.put(`/profiles/${profileId}/active`, {
        isActive,
      });

      setProfiles((prev) =>
        prev.map((profile) =>
          profile._id === profileId
            ? { ...profile, userId: data.userId }
            : profile,
        ),
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Candidates</h1>
          <Link
            to="/recruiter/candidates/add"
            className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add Candidate
          </Link>
        </div>

        {loading && <p>Loading candidates...</p>}

        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow">
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Candidate
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Experience
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Education
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Links
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profiles.map((profile) => (
                <tr key={profile._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 align-top">
                    <div className="font-semibold text-gray-900">
                      {profile.userId?.firstName} {profile.userId?.lastName}
                    </div>
                    {profile.bio && (
                      <div className="text-sm text-gray-500 mt-1">
                        {profile.bio}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 align-top">
                    {profile.userId?.email || "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 align-top">
                    {profile.experience != null
                      ? `${profile.experience} yrs`
                      : "-"}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-700 align-top">
                    {profile.education != null
                      ? `${profile.education} yrs`
                      : "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 align-top">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        profile.userId?.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {profile.userId?.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2 text-sm">
                      {profile.resume ? (
                        <a
                          href={
                            profile.resume.startsWith("http")
                              ? profile.resume
                              : `${import.meta.env.VITE_SERVER_PATH}/${profile.resume}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600 underline"
                        >
                          Resume
                        </a>
                      ) : null}
                      {!profile.linkedin &&
                        !profile.portfolio &&
                        !profile.resume && (
                          <span className="text-gray-500">No links</span>
                        )}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/recruiter/candidates/${profile._id}`}
                        title="View Details"
                        className="inline-flex items-center justify-center rounded bg-blue-600 p-3 text-white hover:bg-blue-700"
                      >
                        <FaEye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          toggleActive(profile._id, !profile.userId?.isActive)
                        }
                        title={
                          profile.userId?.isActive ? "Deactivate" : "Activate"
                        }
                        className={`inline-flex items-center justify-center rounded p-3 text-white ${
                          profile.userId?.isActive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {profile.userId?.isActive ? (
                          <FaToggleOff className="h-4 w-4" />
                        ) : (
                          <FaToggleOn className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!profiles.length && !loading && (
            <p className="mt-4 text-gray-600">No candidates found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Candidates;
