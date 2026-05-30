import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
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

  const { user, setUser } = useContext(AuthContext);

  // Fetch profile or account info
  const fetchProfile = async () => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
    }));

    if (user.role !== "Candidate") {
      setProfile(user);
      return;
    }
    try {
      const { data } = await API.get("/profiles/me");

      setProfile(data);

      setFormData((prev) => ({
        ...prev,
        firstName: data.userId?.firstName ?? "",
        lastName: data.userId?.lastName ?? "",
        email: data.userId?.email ?? "",
        phone: data.userId?.phone ?? "",
        skills: data.skills?.join(", ") ?? "",
        experience: data.experience ?? "",
        education: data.education ?? "",
        bio: data.bio ?? "",
        linkedin: data.linkedin ?? "",
        portfolio: data.portfolio ?? "",
      }));
    } catch (error) {
      if (error.response?.status === 404) {
        setProfile(user);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

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

      if (user.role !== "Candidate") {
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          ...(formData.password ? { password: formData.password } : {}),
        };

        const { data } = await API.put("/users/me", updateData);
        localStorage.setItem("userInfo", JSON.stringify(data));
        setProfile(data);
        setUser(data);
        setFormData((prev) => ({ ...prev, password: "" }));
        toast.success("Profile Updated");
        return;
      }

      const dataPayload = new FormData();

      Object.keys(formData).forEach((key) => {
        dataPayload.append(key, formData[key]);
      });

      if (resume) {
        dataPayload.append("resume", resume);
      }

      const { data } = await API.post("/profiles", dataPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data?.userId) {
        const updatedUser = {
          ...user,
          ...data.userId,
        };
        setUser(updatedUser);
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      }

      setFormData((prev) => ({ ...prev, password: "" }));
      toast.success("Profile Updated");

      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {user?.role !== "Candidate" ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                className="w-full border p-3 rounded"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="w-full border p-3 rounded"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full border p-3 rounded"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                className="w-full border p-3 rounded"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            {/* Password */}
            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                name="password"
                className="w-full border p-3 rounded"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
              <p className="mt-2 text-sm text-slate-500">
                Leave blank to keep your existing password.
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-slate-500">Role</p>
              <p className="mt-1 text-lg font-medium text-slate-900">
                {user?.role}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded mt-6 hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                className="w-full border p-3 rounded"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="w-full border p-3 rounded"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full border p-3 rounded"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                className="w-full border p-3 rounded"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

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
              <label className="block mb-2 font-medium">
                Experience (Years)
              </label>

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

            {/* Password */}
            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                name="password"
                className="w-full border p-3 rounded"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
              <p className="mt-2 text-sm text-slate-500">
                Leave blank to keep your existing password.
              </p>
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
                href={`${import.meta.env.VITE_SERVER_PATH}/${profile.resume}`}
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
      )}
    </DashboardLayout>
  );
}

export default Profile;
