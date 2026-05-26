import { useEffect, useState } from "react";

import API from "../services/api";

import JobCard from "../components/JobCard";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const { data } = await API.get("/jobs");

      setJobs(data);
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

      alert("Applied Successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Application failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-center mb-10">Available Jobs</h1>

      {loading && <p className="text-center">Loading jobs...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} onApply={applyToJob} />
        ))}
      </div>
    </div>
  );
}

export default Jobs;
