import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import API from "../services/api";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    users: 0,
    recruiters: 0,
    jobs: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/analytics/overview");

        setDashboardData({
          users: data.totalUsers || 0,
          recruiters: data.totalRecruiters || 0,
          jobs: data.totalJobs || 0,
          applications: data.totalApplications || 0,
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 justify-between items-start mb-8 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <Link
          to="/admin/analytics"
          className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
        >
          View Analytics
        </Link>
      </div>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-10">
            <Card title="Users" value={dashboardData.users} />
            <Card title="Recruiters" value={dashboardData.recruiters} />
            <Card title="Jobs" value={dashboardData.jobs} />
            <Card title="Applications" value={dashboardData.applications} />
          </div>

          {/* Recent Activity Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Platform Overview</h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="border-b pb-3">
                Total users on platform: {dashboardData.users}
              </div>

              <div className="border-b pb-3">
                Active recruiters: {dashboardData.recruiters}
              </div>

              <div className="border-b pb-3">
                Job postings: {dashboardData.jobs}
              </div>

              <div>Total applications: {dashboardData.applications}</div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;
