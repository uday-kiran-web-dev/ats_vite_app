import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

function Profile() {
  const [formData, setFormData] = useState({
    skills: "",
    experience: "",
    education: "",
    bio: "",
    linkedin: "",
    portfolio: "",
  });

  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState(null);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/profiles/me");

      setProfile(data);

      setFormData({
        skills: data.skills?.join(", "),
        experience: data.experience || "",
        education: data.education || "",
        bio: data.bio || "",
        linkedin: data.linkedin || "",
        portfolio: data.portfolio || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (resume) {
        data.append("resume", resume);
      }

      await API.post("/profiles", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile Updated");

      fetchProfile();
    } catch (error) {
      alert(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills */}
          <div>
            <label className="block mb-2 font-medium">Skills</label>

            <input
              type="text"
              name="skills"
              placeholder="React, Node.js, MongoDB"
              className="w-full border p-3 rounded"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block mb-2 font-medium">Experience (Years)</label>

            <input
              type="number"
              name="experience"
              className="w-full border p-3 rounded"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          {/* Education */}
          <div>
            <label className="block mb-2 font-medium">Education</label>

            <input
              type="text"
              name="education"
              className="w-full border p-3 rounded"
              value={formData.education}
              onChange={handleChange}
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block mb-2 font-medium">LinkedIn</label>

            <input
              type="text"
              name="linkedin"
              className="w-full border p-3 rounded"
              value={formData.linkedin}
              onChange={handleChange}
            />
          </div>

          {/* Portfolio */}
          <div>
            <label className="block mb-2 font-medium">Portfolio</label>

            <input
              type="text"
              name="portfolio"
              className="w-full border p-3 rounded"
              value={formData.portfolio}
              onChange={handleChange}
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block mb-2 font-medium">Upload Resume</label>

            <input
              type="file"
              className="w-full border p-3 rounded"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="block mb-2 font-medium">Bio</label>

          <textarea
            name="bio"
            rows="5"
            className="w-full border p-3 rounded"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        {/* Existing Resume */}
        {profile?.resume && (
          <div className="mt-6">
            <a
              href={`http://localhost:5000/${profile.resume}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View Uploaded Resume
            </a>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded mt-6 hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </DashboardLayout>
  );
}

export default Profile;
