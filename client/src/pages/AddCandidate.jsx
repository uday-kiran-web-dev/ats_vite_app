import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

function AddCandidate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    experience: "",
    education: "",
    bio: "",
    linkedin: "",
    portfolio: "",
    skills: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setResumeFile(files[0]);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
      if (resumeFile) {
        payload.append("resume", resumeFile);
      }

      await API.post("/profiles/create-candidate", payload);
      toast.success("Candidate added successfully.");
      navigate("/recruiter/candidates");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create candidate.");
      toast.error(err.response?.data?.message || "Failed to create candidate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Add Candidate</h1>
            <p className="text-sm text-gray-500">
              Create a new candidate account with profile details.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded border border-gray-300 p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded border border-gray-300 p-3"
                />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded border border-gray-300 p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded border border-gray-300 p-3"
                />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded border border-gray-300 p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Experience
                </label>
                <input
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="mt-2 w-full rounded border border-gray-300 p-3"
                />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Education
                </label>
                <input
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="mt-2 w-full rounded border border-gray-300 p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  LinkedIn
                </label>
                <input
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="mt-2 w-full rounded border border-gray-300 p-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Portfolio
              </label>
              <input
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                className="mt-2 w-full rounded border border-gray-300 p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skills
              </label>
              <input
                name="skills"
                placeholder="Comma separated"
                value={formData.skills}
                onChange={handleChange}
                className="mt-2 w-full rounded border border-gray-300 p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="mt-2 w-full rounded border border-gray-300 p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resume
              </label>
              <input
                type="file"
                name="resume"
                accept="application/pdf"
                onChange={handleChange}
                className="mt-2 w-full text-sm text-gray-700"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Saving..." : "Create Candidate"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/recruiter/candidates")}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddCandidate;
