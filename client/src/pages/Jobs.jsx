import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import API from "../services/api";

import JobCard from "../components/JobCard";
import Hero from "../components/Hero";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredJobs = jobs.filter((job) => {
    if (job.status !== "active") return false;
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const title = job.title?.toLowerCase() || "";
    const company = job.company?.toLowerCase() || "";
    const location = job.location?.toLowerCase() || "";
    const description = job.description?.toLowerCase() || "";

    return (
      title.includes(query) ||
      company.includes(query) ||
      location.includes(query) ||
      description.includes(query)
    );
  });

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

          <div className="mb-6">
            <label htmlFor="job-search" className="sr-only">
              Search jobs
            </label>
            <input
              id="job-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, company, or location"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.length === 0 ? (
              <p className="col-span-full text-center text-slate-600 dark:text-slate-300">
                No matching jobs found.
              </p>
            ) : (
              filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} onApply={applyToJob} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Jobs;
