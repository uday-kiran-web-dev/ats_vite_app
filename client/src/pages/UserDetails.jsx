import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchUser = async () => {
    try {
      const { data } = await API.get(`/users/${id}`);
      setUser(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const toggleActive = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { data } = await API.put(`/users/${id}`, {
        isActive: !user.isActive,
      });
      setUser(data);
      toast.success(
        `User ${data.isActive ? "activated" : "deactivated"} successfully.`,
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading user details...</p>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <p className="text-red-600">User not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Details</h1>
            <p className="text-sm text-slate-500">
              Review and update the user account status.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/users"
              className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300"
            >
              Back to Users
            </Link>
            <button
              type="button"
              onClick={toggleActive}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-slate-400"
            >
              {saving
                ? "Updating..."
                : user.isActive
                  ? "Deactivate User"
                  : "Activate User"}
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500">First Name</p>
              <p className="mt-1 text-lg font-medium text-slate-900">
                {user.firstName}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Last Name</p>
              <p className="mt-1 text-lg font-medium text-slate-900">
                {user.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-1 text-lg font-medium text-slate-900">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Role</p>
              <p className="mt-1 text-lg font-medium text-slate-900">
                {user.role}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Phone</p>
              <p className="mt-1 text-lg font-medium text-slate-900">
                {user.phone || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900">
                {user.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Created At</p>
              <p className="mt-1 text-lg font-medium text-slate-900">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Last Updated</p>
              <p className="mt-1 text-lg font-medium text-slate-900">
                {new Date(user.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserDetails;
