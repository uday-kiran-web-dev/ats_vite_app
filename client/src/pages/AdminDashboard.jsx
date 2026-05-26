import DashboardLayout from "../layouts/DashboardLayout";

import Card from "../components/Card";

function AdminDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Users" value="120" />

        <Card title="Recruiters" value="18" />

        <Card title="Jobs" value="45" />

        <Card title="Applications" value="350" />
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
