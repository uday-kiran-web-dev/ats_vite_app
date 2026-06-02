import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";
import { FaTrashCan, FaPowerOff } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    department: "",
    location: "",
    jobType: "full-time",
    salaryMin: "",
    salaryMax: "",
    status: "active",
  });

  const [editingJob, setEditingJob] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    department: "",
    location: "",
    jobType: "full-time",
    salaryMin: "",
    salaryMax: "",
    status: "active",
  });

  const editorInit = {
    height: 500,
    menubar: "file edit view insert format tools table help",
    plugins:
      "advlist autolink lists link image charmap print preview anchor " +
      "searchreplace visualblocks code fullscreen insertdatetime media table " +
      "paste code help wordcount",
    toolbar:
      "undo redo | formatselect | bold italic underline | " +
      "alignleft aligncenter alignright alignjustify | " +
      "bullist numlist outdent indent | removeformat | help",
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const { data } = await API.get("/jobs/my-jobs");
      // Sort by newest first
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setJobs(sorted);
    } catch (error) {}
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

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const startEdit = (job) => {
    setEditingJob(job);
    setShowAddForm(false);
    setEditFormData({
      title: job.title ?? "",
      description: job.description ?? "",
      requirements: (job.requirements ?? []).join(","),
      department: job.department ?? "",
      location: job.location ?? "",
      jobType: job.jobType ?? "full-time",
      salaryMin: job.salary?.min ?? "",
      salaryMax: job.salary?.max ?? "",
      status: job.status ?? "active",
    });
  };

  const cancelEdit = () => {
    setEditingJob(null);
    setEditFormData({
      title: "",
      description: "",
      requirements: "",
      department: "",
      location: "",
      jobType: "full-time",
      salaryMin: "",
      salaryMax: "",
      status: "active",
    });
  };

  const toggleAddForm = () => {
    setShowAddForm((prev) => !prev);
    cancelEdit();
  };

  // Create job
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.description ||
      !formData.description.replace(/<(.|\n)*?>/g, "").trim()
    ) {
      toast.error("Job description is required.");
      return;
    }

    try {
      await API.post("/jobs/create-job", {
        ...formData,
        salary: {
          min: Number(formData.salaryMin) || 0,
          max: Number(formData.salaryMax) || 0,
        },
        requirements: formData.requirements.split(","),
      });

      toast.success("Job Created");
      fetchJobs();
      setShowAddForm(false);
      setFormData({
        title: "",
        description: "",
        requirements: "",
        department: "",
        location: "",
        jobType: "full-time",
        salaryMin: "",
        salaryMax: "",
        status: "active",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Job creation failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingJob) return;

    if (
      !editFormData.description ||
      !editFormData.description.replace(/<(.|\n)*?>/g, "").trim()
    ) {
      toast.error("Job description is required.");
      return;
    }

    try {
      await API.put(`/jobs/update-job/${editingJob._id}`, {
        ...editFormData,
        salary: {
          min: Number(editFormData.salaryMin) || 0,
          max: Number(editFormData.salaryMax) || 0,
        },
        requirements: editFormData.requirements.split(","),
      });

      toast.success("Job Updated");
      fetchJobs();
      cancelEdit();
    } catch (error) {
      toast.error(error.response?.data?.message || "Job update failed");
    }
  };

  // Delete job
  const deleteJob = async (id) => {
    try {
      await API.delete(`/jobs/delete-job/${id}`);
      fetchJobs();
    } catch (error) {}
  };

  const toggleJobStatus = async (job) => {
    try {
      const newStatus = job.status === "active" ? "closed" : "active";
      await API.put(`/jobs/update-job/${job._id}`, {
        status: newStatus,
      });
      toast.success(
        `Job ${newStatus === "active" ? "activated" : "deactivated"}`,
      );
      fetchJobs();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update job status",
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Manage Jobs</h1>
          <button
            type="button"
            onClick={toggleAddForm}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            {showAddForm ? "Hide Add Job" : "Add Job"}
          </button>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-2xl font-bold mb-4">Add New Job</h2>

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
                name="department"
                placeholder="Department"
                className="border p-3 rounded"
                value={formData.department}
                onChange={handleChange}
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
                name="status"
                className="border p-3 rounded"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>

              <input
                type="number"
                name="salaryMin"
                placeholder="Salary min"
                className="border p-3 rounded"
                value={formData.salaryMin}
                onChange={handleChange}
                min="0"
              />

              <input
                type="number"
                name="salaryMax"
                placeholder="Salary max"
                className="border p-3 rounded"
                value={formData.salaryMax}
                onChange={handleChange}
                min="0"
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
                className="border p-3 rounded md:col-span-2"
                value={formData.requirements}
                onChange={handleChange}
              />
            </div>

            {/* <div className="mt-4">
              <label className="block mb-2 font-medium">Job Description</label>
              <textarea
                name="description"
                rows="6"
                className="w-full border p-3 rounded"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div> */}
            <div className="mt-4">
              <label className="block mb-2 font-medium">Job Description</label>
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                value={formData.description}
                init={editorInit}
                onEditorChange={(content) =>
                  setFormData((prev) => ({ ...prev, description: content }))
                }
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded mt-4 hover:bg-blue-700"
            >
              Create Job
            </button>
          </form>
        )}

        {editingJob && (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold">Edit Job</h2>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Job Title"
                className="border p-3 rounded"
                value={editFormData.title}
                onChange={handleEditChange}
                required
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                className="border p-3 rounded"
                value={editFormData.department}
                onChange={handleEditChange}
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                className="border p-3 rounded"
                value={editFormData.location}
                onChange={handleEditChange}
              />

              <select
                name="status"
                className="border p-3 rounded"
                value={editFormData.status}
                onChange={handleEditChange}
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>

              <input
                type="number"
                name="salaryMin"
                placeholder="Salary min"
                className="border p-3 rounded"
                value={editFormData.salaryMin}
                onChange={handleEditChange}
                min="0"
              />

              <input
                type="number"
                name="salaryMax"
                placeholder="Salary max"
                className="border p-3 rounded"
                value={editFormData.salaryMax}
                onChange={handleEditChange}
                min="0"
              />

              <select
                name="jobType"
                className="border p-3 rounded"
                value={editFormData.jobType}
                onChange={handleEditChange}
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
              </select>

              <input
                type="text"
                name="requirements"
                placeholder="Requirements comma separated"
                className="border p-3 rounded md:col-span-2"
                value={editFormData.requirements}
                onChange={handleEditChange}
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2 font-medium">Job Description</label>
              <Editor
                apiKey="bfm6ejrkogrl8t2p5zz8hnouuzrpjv7mtu3804lx8h09sgta"
                value={editFormData.description}
                init={editorInit}
                onEditorChange={(content) =>
                  setEditFormData((prev) => ({ ...prev, description: content }))
                }
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded mt-4 hover:bg-green-700"
            >
              Save Changes
            </button>
          </form>
        )}

        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow">
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Location
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Department
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Salary
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {job.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {job.location}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {job.department || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {job.salary && (job.salary.min || job.salary.max)
                      ? `$${job.salary.min || 0} - $${job.salary.max || 0}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                    {job.jobType || job.jobTpye}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                    {job.status || "active"}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700 space-x-2">
                    <button
                      type="button"
                      onClick={() => startEdit(job)}
                      title="Edit Job"
                      className="bg-yellow-500 text-white p-3 rounded hover:bg-yellow-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleJobStatus(job)}
                      title={
                        job.status === "active"
                          ? "Deactivate Job"
                          : "Activate Job"
                      }
                      className="bg-slate-600 text-white p-3 rounded hover:bg-slate-700"
                    >
                      <FaPowerOff />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteJob(job._id)}
                      title="Delete Job"
                      className="bg-red-500 text-white p-3 rounded hover:bg-red-600"
                    >
                      <FaTrashCan />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {jobs.length === 0 && (
            <p className="mt-4 text-gray-600">No jobs found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default RecruiterJobs;
