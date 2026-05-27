import { useEffect, useState, useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

import { AuthContext } from "../context/AuthContext";

function Applications() {
  const { user } = useContext(AuthContext);

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const getDetailsPath = (id) => {
    if (user?.role === "Recruiter") {
      return `/recruiter/applications/${id}`;
    }
    if (user?.role === "Admin") {
      return `/admin/applications/${id}`;
    }
    return `/applications/${id}`;
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const { data } = await API.get("/applications");

      setApplications(data);
    } catch (error) {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">
            {user?.role === "Candidate"
              ? "My Applications"
              : "Applications Management"}
          </h1>
        </div>

        {loading && <p>Loading applications...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow">
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Job
                </th>
                {user?.role !== "Candidate" && (
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Candidate
                  </th>
                )}
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Status
                </th>
                {user?.role !== "Candidate" && (
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Match
                  </th>
                )}
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Interview
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Feedback
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => (
                <Fragment key={app._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">
                        {app.jobId?.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {app.jobId?.location}
                      </div>
                    </td>
                    {user?.role !== "Candidate" && (
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {app.candidateId?.firstName} {app.candidateId?.lastName}
                        <div className="text-xs text-gray-500">
                          {app.candidateId?.email}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-4 text-sm text-gray-700 capitalize">
                      {app.status}
                    </td>
                    {user?.role !== "Candidate" && (
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {app.matchScore != null ? (
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-20">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: "Match", value: app.matchScore },
                                      {
                                        name: "Remaining",
                                        value: 100 - app.matchScore,
                                      },
                                    ]}
                                    innerRadius={24}
                                    outerRadius={32}
                                    paddingAngle={2}
                                    dataKey="value"
                                  >
                                    <Cell fill="#34d399" />
                                    <Cell fill="#e5e7eb" />
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {app.matchScore}%
                              </div>
                              <div className="text-xs text-gray-500">
                                Match Score
                              </div>
                            </div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    )}
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {app.interviewSchedule?.date
                        ? `${new Date(app.interviewSchedule.date).toLocaleDateString()} ${app.interviewSchedule.time || ""}`
                        : "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 whitespace-pre-line">
                      {app.feedback || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={getDetailsPath(app._id)}
                          className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
          {!applications.length && !loading && (
            <p className="mt-4 text-gray-600">No applications found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Applications;
