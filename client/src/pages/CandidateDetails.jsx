import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experience: "",
    education: "",
    bio: "",
    linkedin: "",
    portfolio: "",
    skills: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get(`/profiles/${id}`);
        setProfile(data);
        setFormData({
          firstName: data.userId?.firstName ?? "",
          lastName: data.userId?.lastName ?? "",
          email: data.userId?.email ?? "",
          phone: data.userId?.phone ?? "",
          experience: data.experience ?? "",
          education: data.education ?? "",
          bio: data.bio ?? "",
          linkedin: data.linkedin ?? "",
          portfolio: data.portfolio ?? "",
          skills: data.skills?.join(", ") ?? "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load candidate details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const getCandidateListPath = () => {
    return "/recruiter/candidates";
  };

  const handleToggleActive = async () => {
    if (!profile) return;

    try {
      const { data } = await API.put(`/profiles/${id}/active`, {
        isActive: !profile.userId?.isActive,
      });
      setProfile(data);
      toast.success(
        `Candidate has been ${data.userId?.isActive ? "activated" : "deactivated"}.`,
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update active status.",
      );
    }
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setResumeFile(files[0]);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
      if (resumeFile) {
        payload.append("resume", resumeFile);
      }

      const { data } = await API.put(`/profiles/${id}`, payload);
      setProfile(data);
      setEditMode(false);
      toast.success("Candidate details updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Candidate Details</h1>
            <p className="text-sm text-gray-500">Profile ID: {profile?._id}</p>
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
              onClick={() => navigate(getCandidateListPath())}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Candidate List
            </button>
          </div>
        </div>

        {loading && <p>Loading candidate details...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {profile && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.userId?.firstName} {profile.userId?.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {profile.userId?.email}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setEditMode((prev) => !prev)}
                    className="rounded bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
                  >
                    {editMode ? "Cancel Edit" : "Edit Candidate"}
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleActive}
                    className={`rounded px-4 py-2 text-sm font-semibold text-white ${
                      profile.userId?.isActive
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {profile.userId?.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    profile.userId?.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {profile.userId?.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {editMode ? (
                <form onSubmit={handleSave} className="mt-6 space-y-6">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleEditChange}
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
                        onChange={handleEditChange}
                        className="mt-2 w-full rounded border border-gray-300 p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleEditChange}
                        className="mt-2 w-full rounded border border-gray-300 p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleEditChange}
                        className="mt-2 w-full rounded border border-gray-300 p-3"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Experience (years)
                      </label>
                      <input
                        name="experience"
                        value={formData.experience}
                        onChange={handleEditChange}
                        className="mt-2 w-full rounded border border-gray-300 p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Education
                      </label>
                      <input
                        name="education"
                        value={formData.education}
                        onChange={handleEditChange}
                        className="mt-2 w-full rounded border border-gray-300 p-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleEditChange}
                      className="mt-2 w-full rounded border border-gray-300 p-3"
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        LinkedIn
                      </label>
                      <input
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleEditChange}
                        className="mt-2 w-full rounded border border-gray-300 p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Portfolio
                      </label>
                      <input
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleEditChange}
                        className="mt-2 w-full rounded border border-gray-300 p-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Skills
                    </label>
                    <input
                      name="skills"
                      value={formData.skills}
                      onChange={handleEditChange}
                      placeholder="Comma separated"
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
                      onChange={handleEditChange}
                      className="mt-2 w-full text-sm text-gray-700"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Overview</h3>
                      <p className="mt-2 text-sm text-gray-700">
                        {profile.bio || "No bio available."}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {profile.experience != null
                            ? `${profile.experience} years`
                            : "Not specified"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-sm text-gray-500">Education</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {profile.education || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-lg bg-slate-50 p-4">
                      <h3 className="text-lg font-semibold">Contact</h3>
                      <div className="mt-3 space-y-2 text-sm text-gray-700">
                        <p>
                          <span className="font-semibold">Role:</span>{" "}
                          {profile.userId?.role || "Candidate"}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {profile.userId?.email}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {profile.userId?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-4">
                      <h3 className="text-lg font-semibold">Links</h3>
                      <div className="mt-3 space-y-2 text-sm text-gray-700">
                        {profile.linkedin ? (
                          <p>
                            <a
                              href={profile.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 underline"
                            >
                              LinkedIn profile
                            </a>
                          </p>
                        ) : (
                          <p className="text-gray-500">LinkedIn not provided</p>
                        )}
                        {profile.portfolio ? (
                          <p>
                            <a
                              href={profile.portfolio}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 underline"
                            >
                              Portfolio link
                            </a>
                          </p>
                        ) : (
                          <p className="text-gray-500">
                            Portfolio not provided
                          </p>
                        )}
                        {profile.resume ? (
                          <p>
                            <a
                              href={`${import.meta.env.VITE_SERVER_PATH}/${profile.resume}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-green-600 underline"
                            >
                              Download resume
                            </a>
                          </p>
                        ) : (
                          <p className="text-gray-500">Resume not uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-semibold">Skills</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.skills?.length ? (
                    profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills listed.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CandidateDetails;
