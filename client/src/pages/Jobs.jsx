import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import API from "../services/api";

import JobCard from "../components/JobCard";
import Hero from "../components/Hero";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const response = await API.get("/jobs");
      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data.jobs || [];

      setJobs(jobsData);
    } catch (error) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Apply to job
  const applyToJob = async (jobId) => {
    try {
      await API.post("/applications/apply", {
        jobId,
        skills: ["React", "JavaScript"],
      });

      toast.success("Applied Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Hero />
      <main
        id="available-jobs"
        className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10"
      >
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-white/10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Available Jobs
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Browse the latest roles and open job details for a smooth
              application experience.
            </p>
          </div>

          {loading && (
            <p className="text-center text-slate-700 dark:text-slate-300">
              Loading jobs...
            </p>
          )}

          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Jobs;
