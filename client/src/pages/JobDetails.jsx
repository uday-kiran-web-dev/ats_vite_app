import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchJob = async () => {
    try {
      const { data } = await API.get(`/jobs/${id}`);
      setJob(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load Job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (!job?._id) return;

      try {
        const { data } = await API.get("/applications");
        if (!Array.isArray(data)) return;

        const applied = data.some((application) => {
          const applicationJobId = application.jobId?._id || application.jobId;
          return applicationJobId === job._id;
        });

        setHasApplied(applied);
      } catch (err) {
        console.error("Unable to verify application status", err);
      }
    };

    fetchApplicationStatus();
  }, [job]);

  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0 dark:bg-gray-900">
      {loading && <p>Loading application details...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {job && (
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-slate-50 p-8 shadow-sm dark:bg-gray-900/80">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">
                  Job details
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {job.title}
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  {job.location || "Location not specified"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  {job.department && (
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                      {job.department}
                    </span>
                  )}
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {job.jobType || job.jobTpye || "Job type not set"}
                  </span>
                  {/* <span
                    className={`rounded-full px-3 py-1 text-sm ${job.status === "closed" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200" : job.status === "draft" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200"}`}
                  >
                    {job.status || "active"}
                  </span> */}
                </div>
              </div>

              <div className="flex shrink-0 justify-end">
                <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-950 dark:ring-white/10">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Posted
                  </p>
                  <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                  {hasApplied ? (
                    <span className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-red-500 px-4 py-3 text-center text-sm font-semibold text-white">
                      Applied
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowConfirm(true)}
                      className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      disabled={job.status === "closed"}
                    >
                      {job.status === "closed" ? "Closed" : "Apply"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-8">
                <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-950 dark:ring-white/10">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    About this role
                  </h2>
                  <div
                    className="mt-4 text-gray-700 dark:text-gray-300 prose prose-slate dark:prose-invert max-w-none rich-text-content"
                    dangerouslySetInnerHTML={{ __html: job.description || "" }}
                  />
                </section>

                {job.requirements?.length > 0 && (
                  <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-950 dark:ring-white/10">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Requirements
                    </h2>
                    <ul className="mt-4 space-y-3 list-disc list-inside text-gray-700 dark:text-gray-300">
                      {job.requirements.map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              <div className="space-y-8">
                <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-950 dark:ring-white/10">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Quick facts
                  </h2>
                  <dl className="mt-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
                    {job.department && (
                      <div>
                        <dt className="font-semibold text-slate-900 dark:text-white">
                          Department
                        </dt>
                        <dd className="mt-1">{job.department}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-semibold text-slate-900 dark:text-white">
                        Job type
                      </dt>
                      <dd className="mt-1">
                        {job.jobType || job.jobTpye || "N/A"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900 dark:text-white">
                        Location
                      </dt>
                      <dd className="mt-1">{job.location || "N/A"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900 dark:text-white">
                        Salary range
                      </dt>
                      <dd className="mt-1 text-slate-700 dark:text-slate-300">
                        {job.salary?.min || job.salary?.max
                          ? `${job.salary?.min ? `$${job.salary.min.toLocaleString()}` : "N/A"} — ${job.salary?.max ? `$${job.salary.max.toLocaleString()}` : "N/A"}`
                          : "Not specified"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900 dark:text-white">
                        Status
                      </dt>
                      <dd className="mt-1 capitalize">
                        {job.status || "active"}
                      </dd>
                    </div>
                  </dl>
                </section>

                {job.recruiterId && (
                  <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-950 dark:ring-white/10">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Recruiter
                    </h2>
                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                      {typeof job.recruiterId === "string"
                        ? job.recruiterId
                        : job.recruiterId?.name ||
                          job.recruiterId?.email ||
                          "Recruiter info unavailable"}
                    </p>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-950">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Confirm application
            </h3>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to apply for{" "}
              <span className="font-semibold">{job.title}</span>?
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setSubmitting(true);
                  try {
                    await API.post("/applications/apply", {
                      jobId: job._id,
                      skills: job.requirements || [],
                    });
                    toast.success("Application submitted successfully.");
                    setHasApplied(true);
                    setShowConfirm(false);
                  } catch (err) {
                    toast.error(
                      err.response?.data?.message || "Application failed.",
                    );
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Applying..." : "Confirm apply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
