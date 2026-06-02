import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FaDownload } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("applied");
  const [feedbackText, setFeedbackText] = useState("");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
    type: "",
    notes: "",
  });
  const [statusSaving, setStatusSaving] = useState(false);
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [scheduleSaving, setScheduleSaving] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data } = await API.get(`/applications/${id}`);
        setApplication(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load application details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const getRoleBasePath = () => {
    if (user?.role === "Recruiter") return "/recruiter/applications";
    if (user?.role === "Admin") return "/admin/applications";
    return "/applications";
  };

  const userCanEdit = ["Admin", "Recruiter"].includes(user?.role);

  useEffect(() => {
    if (!application) return;

    setStatus(application.status || "applied");
    setFeedbackText(application.feedback || "");
    setScheduleData({
      date: application.interviewSchedule?.date || "",
      time: application.interviewSchedule?.time || "",
      type: application.interviewSchedule?.type || "",
      notes: application.interviewSchedule?.notes || "",
    });
  }, [application]);

  const handleStatusSave = async () => {
    if (!userCanEdit) return;
    setStatusSaving(true);
    try {
      const { data } = await API.put(`/applications/${id}/status`, { status });
      setApplication(data);
      toast.success("Application status updated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusSaving(false);
    }
  };

  const handleFeedbackSave = async () => {
    if (!userCanEdit) return;
    setFeedbackSaving(true);
    try {
      const { data } = await API.put(`/applications/${id}/status`, {
        feedback: feedbackText,
      });
      setApplication(data);
      toast.success("Feedback saved.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save feedback.");
    } finally {
      setFeedbackSaving(false);
    }
  };

  const openScheduleModal = () => {
    setScheduleData({
      date: application.interviewSchedule?.date || "",
      time: application.interviewSchedule?.time || "",
      type: application.interviewSchedule?.type || "",
      notes: application.interviewSchedule?.notes || "",
    });
    setScheduleModalOpen(true);
  };

  const closeScheduleModal = () => {
    setScheduleModalOpen(false);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!userCanEdit) return;
    setScheduleSaving(true);
    try {
      const { data } = await API.put(
        `/applications/${id}/schedule`,
        scheduleData,
      );
      setApplication(data);
      toast.success("Interview schedule updated.");
      closeScheduleModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save schedule.");
    } finally {
      setScheduleSaving(false);
    }
  };

  const matchChartData = application
    ? [
        { name: "Match", value: application.matchScore || 0 },
        { name: "Remaining", value: 100 - (application.matchScore || 0) },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Application Details</h1>
            <p className="text-sm text-gray-500">ID: {id}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => navigate(getRoleBasePath())}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Applications List
            </button>
          </div>
        </div>

        {loading && <p>Loading application details...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {application && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {application.jobId?.title}
                  </h2>
                  <p className="text-gray-600">
                    {application.jobId?.location || "Location not specified"}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${
                    application.status === "hired"
                      ? "bg-green-100 text-green-700"
                      : application.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : application.status === "interviewed"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {application.status}
                </span>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Job Details</h3>
                    <div className="mt-2 text-sm text-gray-700 space-y-2">
                      <div
                        className="mt-2 text-gray-700 dark:text-gray-300 prose prose-slate dark:prose-invert max-w-none rich-text-content"
                        dangerouslySetInnerHTML={{
                          __html: application.jobId?.description || "",
                        }}
                      />
                      <p>
                        <span className="font-semibold">Department:</span>{" "}
                        {application.jobId?.department || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Job Type:</span>{" "}
                        {application.jobId?.jobType ||
                          application.jobId?.jobTpye ||
                          "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span>{" "}
                        {application.jobId?.status || "N/A"}
                      </p>
                      {application.jobId?.requirements?.length > 0 && (
                        <div className="mt-2">
                          <span className="font-semibold">Requirements:</span>
                          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
                            {application.jobId.requirements.map(
                              (req, index) => (
                                <li key={index}>{req}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Candidate</h3>
                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {application.candidateId?.firstName}{" "}
                        {application.candidateId?.lastName}
                      </p>
                      {userCanEdit && (
                        <p>
                          <button
                            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            onClick={() =>
                              navigate(
                                `/recruiter/candidates/${application.profileId}`,
                              )
                            }
                          >
                            View Profile
                          </button>
                        </p>
                      )}

                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {application.candidateId?.email}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {application.candidateId?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Submitted</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      {new Date(application.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {userCanEdit && (
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <h3 className="text-lg font-semibold mb-4">Match Score</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={matchChartData}
                              innerRadius={32}
                              outerRadius={48}
                              startAngle={90}
                              endAngle={-270}
                              dataKey="value"
                            >
                              <Cell fill="#34d399" />
                              <Cell fill="#e5e7eb" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-slate-900">
                          {application.matchScore ?? 0}%
                        </div>
                        <div className="text-sm text-gray-500">Overall fit</div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold">Recommendation:</span>{" "}
                        {application.matchReport?.overallFit || "Not available"}
                      </p>
                      <p>
                        <span className="font-semibold">Experience Match:</span>{" "}
                        {application.matchReport?.experienceMatch || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {userCanEdit ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Match Report</h3>
                  <div className="grid gap-4">
                    <div>
                      <h4 className="text-sm font-semibold">Matched Skills</h4>
                      {application.matchReport?.skillsMatch?.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {application.matchReport.skillsMatch.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                              >
                                {skill}
                              </span>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">None</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold">Missing Skills</h4>
                      {application.matchReport?.missingSkills?.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {application.matchReport.missingSkills.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700"
                              >
                                {skill}
                              </span>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">None</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Application Actions
                      </h3>
                      {userCanEdit && (
                        <button
                          type="button"
                          onClick={openScheduleModal}
                          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          {application.interviewSchedule?.date
                            ? "Edit Interview"
                            : "Schedule Interview"}
                        </button>
                      )}
                    </div>

                    <div className="mt-4 space-y-4 text-sm text-gray-700">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Current Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          disabled={!userCanEdit}
                          className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2"
                        >
                          <option value="applied">Applied</option>
                          <option value="screening">Screening</option>
                          <option value="interviewed">Interviewed</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        {userCanEdit && (
                          <button
                            type="button"
                            onClick={handleStatusSave}
                            disabled={statusSaving}
                            className="mt-3 inline-flex items-center rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {statusSaving ? "Saving..." : "Update Status"}
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Feedback / Remarks
                        </label>
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          rows={4}
                          disabled={!userCanEdit}
                          className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-800"
                          placeholder="Enter feedback for the candidate"
                        />
                        {userCanEdit && (
                          <button
                            type="button"
                            onClick={handleFeedbackSave}
                            disabled={feedbackSaving}
                            className="mt-3 inline-flex items-center rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {feedbackSaving ? "Saving..." : "Save Feedback"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Interview Schedule
                    </h3>
                    {application.interviewSchedule?.date ? (
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>
                          <span className="font-semibold">Date:</span>{" "}
                          {new Date(
                            application.interviewSchedule.date,
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-semibold">Time:</span>{" "}
                          {application.interviewSchedule.time}
                        </p>
                        <p>
                          <span className="font-semibold">Type:</span>{" "}
                          {application.interviewSchedule.type}
                        </p>
                        {application.interviewSchedule.notes && (
                          <p>
                            <span className="font-semibold">Notes:</span>{" "}
                            {application.interviewSchedule.notes}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No interview scheduled yet.
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Resume & Cover Letter
                    </h3>
                    <p className="mt-5 text-sm text-gray-700">
                      <span className="font-semibold">Resume:</span>
                      <a
                        href={
                          application.resume?.startsWith("http")
                            ? application.resume
                            : `${import.meta.env.VITE_SERVER_PATH}/${application.resume}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-white bg-green-600 px-3 py-2 rounded "
                      >
                        Download Resume
                      </a>
                    </p>
                    {/* <p className="mt-5 text-sm text-gray-700">
                      <span className="font-semibold">Cover Letter:</span>
                      <a
                        href={
                          application.coverLetter?.startsWith("http")
                            ? application.coverLetter
                            : `${import.meta.env.VITE_SERVER_PATH}/${application.coverLetter}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-white bg-green-600 px-3 py-2 rounded"
                      >
                        Download Cover Letter
                      </a>
                    </p> */}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  Application Summary
                </h3>
                <div className="space-y-4 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold">Current Status</p>
                    <p>{application.status}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Feedback</p>
                    <p>{application.feedback || "No feedback yet."}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Interview Schedule</p>
                    {application.interviewSchedule?.date ? (
                      <div className="space-y-2">
                        <p>
                          <span className="font-semibold">Date:</span>{" "}
                          {new Date(
                            application.interviewSchedule.date,
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-semibold">Time:</span>{" "}
                          {application.interviewSchedule.time}
                        </p>
                        <p>
                          <span className="font-semibold">Type:</span>{" "}
                          {application.interviewSchedule.type}
                        </p>
                        {application.interviewSchedule.notes && (
                          <p>
                            <span className="font-semibold">Notes:</span>{" "}
                            {application.interviewSchedule.notes}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No interview scheduled yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {scheduleModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
                <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      {application.interviewSchedule?.date
                        ? "Edit Interview Schedule"
                        : "Schedule Interview"}
                    </h2>
                    <button
                      type="button"
                      onClick={closeScheduleModal}
                      className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleScheduleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        value={scheduleData.date}
                        onChange={(e) =>
                          setScheduleData({
                            ...scheduleData,
                            date: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Time
                      </label>
                      <input
                        type="time"
                        value={scheduleData.time}
                        onChange={(e) =>
                          setScheduleData({
                            ...scheduleData,
                            time: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Interview Type
                      </label>
                      <input
                        type="text"
                        value={scheduleData.type}
                        onChange={(e) =>
                          setScheduleData({
                            ...scheduleData,
                            type: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                        placeholder="e.g. Phone, Onsite, Video"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <textarea
                        value={scheduleData.notes}
                        onChange={(e) =>
                          setScheduleData({
                            ...scheduleData,
                            notes: e.target.value,
                          })
                        }
                        rows={3}
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-800"
                        placeholder="Optional notes"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={closeScheduleModal}
                        className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={scheduleSaving}
                        className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {scheduleSaving ? "Saving..." : "Save Schedule"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ApplicationDetails;
