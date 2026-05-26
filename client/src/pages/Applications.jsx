import { useEffect, useState, useContext } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

import { AuthContext } from "../context/AuthContext";

function Applications() {
  const { user } = useContext(AuthContext);

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

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

  // Update application status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/applications/${id}/status`, { status });

      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };

  // Schedule interview
  const scheduleInterview = async (id) => {
    const date = prompt("Enter interview date (YYYY-MM-DD)");

    const time = prompt("Enter interview time");

    const type = prompt("Interview type");

    try {
      await API.put(`/applications/${id}/schedule`, {
        date,
        time,
        type,
      });

      alert("Interview Scheduled");

      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        {user?.role === "Candidate"
          ? "My Applications"
          : "Applications Management"}
      </h1>

      {loading && <p>Loading applications...</p>}

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-6">
        {applications.map((app) => (
          <div key={app._id} className="bg-white p-6 rounded-lg shadow">
            {/* Job Info */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{app.jobId?.title}</h2>

                <p className="text-gray-600">{app.jobId?.location}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full capitalize text-sm font-medium
                    ${
                      app.status === "hired"
                        ? "bg-green-100 text-green-600"
                        : app.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : app.status === "interviewed"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-blue-100 text-blue-600"
                    }
                    `}
              >
                {app.status}
              </span>
            </div>

            {/* Candidate Info */}
            {user?.role !== "Candidate" && (
              <div className="mb-4">
                <h3 className="font-semibold">Candidate</h3>

                <p>
                  {app.candidateId?.firstName} {app.candidateId?.lastName}
                </p>

                <p className="text-gray-600">{app.candidateId?.email}</p>
              </div>
            )}

            {/* Match Score */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Match Score</h3>

              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{
                    width: `${app.matchScore}%`,
                  }}
                ></div>
              </div>

              <p className="mt-1 text-sm">{app.matchScore}% Match</p>
            </div>

            {/* Skills Match */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Matched Skills</h3>

              <div className="flex flex-wrap gap-2">
                {app.matchReport?.skillsMatch?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Missing Skills</h3>

              <div className="flex flex-wrap gap-2">
                {app.matchReport?.missingSkills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Interview Schedule */}
            {app.interviewSchedule?.date && (
              <div className="mb-4 bg-blue-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Interview Scheduled</h3>

                <p>
                  Date:{" "}
                  {new Date(app.interviewSchedule.date).toLocaleDateString()}
                </p>

                <p>Time: {app.interviewSchedule.time}</p>

                <p>Type: {app.interviewSchedule.type}</p>
              </div>
            )}

            {/* Recruiter Actions */}
            {user?.role == "Recruiter" ||
              ("Admin" && (
                <div className="flex flex-wrap gap-4 mt-6">
                  <select
                    className="border p-2 rounded"
                    defaultValue={app.status}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                  >
                    <option value="applied">Applied</option>

                    <option value="screened">Screened</option>

                    <option value="interviewed">Interviewed</option>

                    <option value="offered">Offered</option>

                    <option value="hired">Hired</option>

                    <option value="rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => scheduleInterview(app._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Schedule Interview
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Applications;
