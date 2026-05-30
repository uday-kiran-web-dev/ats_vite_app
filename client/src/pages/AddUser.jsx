import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

function AddUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/users/add-user", formData);
      toast.success("User added successfully.");
      navigate("/admin/users");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user.");
      toast.error(err.response?.data?.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Add User</h1>
            <p className="text-sm text-gray-500">
              Create a new user account with profile details.
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
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border p-3 rounded"
              >
                <option value="Admin">Admin</option>
                <option value="Recruiter">Recruiter</option>
                <option value="Candidate">Candidate</option>
              </select>
              <select
                name="isActive"
                value={formData.isActive ? "active" : "inactive"}
                onChange={handleChange}
                className="border p-3 rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Saving..." : "Create User"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
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

export default AddUser;
