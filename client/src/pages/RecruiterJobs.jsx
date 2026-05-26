import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

import JobCard from "../components/JobCard";

function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "full-time",
  });

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const { data } = await API.get("/jobs");

      setJobs(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create job
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/jobs/create-job", {
        ...formData,
        requirements: formData.requirements.split(","),
      });

      alert("Job Created");

      fetchJobs();

      setFormData({
        title: "",
        description: "",
        requirements: "",
        location: "",
        jobType: "full-time",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Job creation failed");
    }
  };

  // Delete job
  const deleteJob = async (id) => {
    try {
      await API.delete(`/jobs/delete-job/${id}`);

      fetchJobs();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Manage Jobs</h1>

      {/* Create Job Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-10"
      >
        <h2 className="text-2xl font-bold mb-4">Create New Job</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            className="border p-3 rounded"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            className="border p-3 rounded"
            value={formData.location}
            onChange={handleChange}
          />

          <select
            name="jobType"
            className="border p-3 rounded"
            value={formData.jobType}
            onChange={handleChange}
          >
            <option value="full-time">Full Time</option>

            <option value="part-time">Part Time</option>

            <option value="contract">Contract</option>
          </select>

          <input
            type="text"
            name="requirements"
            placeholder="Requirements comma separated"
            className="border p-3 rounded"
            value={formData.requirements}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="description"
          placeholder="Job Description"
          className="border p-3 rounded w-full mt-4"
          rows="5"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded mt-4 hover:bg-blue-700"
        >
          Create Job
        </button>
      </form>

      {/* Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            showActions={true}
            onDelete={deleteJob}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}

export default RecruiterJobs;
