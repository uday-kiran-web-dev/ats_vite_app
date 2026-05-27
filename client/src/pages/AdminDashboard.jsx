import DashboardLayout from "../layouts/DashboardLayout";

import Card from "../components/Card";

import { Link } from "react-router-dom";

function AdminDashboard() {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <Card title="Users" value="120" />

        <Card title="Recruiters" value="18" />

        <Card title="Jobs" value="45" />

        <Card title="Applications" value="350" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>

        <div className="space-y-4">
          <div className="border-b pb-3">New recruiter registered</div>

          <div className="border-b pb-3">Frontend Developer job posted</div>

          <div className="border-b pb-3">Candidate hired for Backend role</div>

          <div>Analytics report generated</div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
