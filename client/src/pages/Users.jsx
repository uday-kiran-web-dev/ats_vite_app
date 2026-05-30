import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import { FaEye, FaTrashCan } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Candidate",
    phone: "",
    isActive: true,
  });

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      // Sort by newest first
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setUsers(sorted);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      role: user.role ?? "Candidate",
      phone: user.phone ?? "",
      isActive: user.isActive ?? true,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "Candidate",
      phone: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "isActive" ? value === "active" : value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await API.put(`/users/${editingUser._id}`, formData);
      toast.success("User updated successfully.");
      cancelEdit();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await API.delete(`/users/${id}`);
      toast.success("User deleted successfully.");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Link
            to="/admin/users/add"
            className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add User
          </Link>
        </div>

        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {editingUser && (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold">Edit User</h2>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border p-3 rounded"
                placeholder="First Name"
                required
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border p-3 rounded"
                placeholder="Last Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-3 rounded"
                placeholder="Email"
                required
              />
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
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border p-3 rounded"
                placeholder="Phone"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded mt-4 hover:bg-blue-700"
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
                  Name
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Phone
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
              {users.map((user) => {
                if (user.role === "Candidate") {
                  return null; // Skip candidate users
                }
                return (
                  <tr key={user._id}>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {user.role}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {user.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                      {user.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 flex flex-wrap gap-2">
                      <Link
                        to={`/admin/users/${user._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                      >
                        <FaEye />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded"
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                      >
                        <FaTrashCan />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!users.length && !loading && (
            <p className="mt-4 text-gray-600">No users found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Users;
