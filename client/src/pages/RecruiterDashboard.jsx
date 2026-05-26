import DashboardLayout from "../layouts/DashboardLayout";

import Card from "../components/Card";

function RecruiterDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Active Jobs" value="8" />

        <Card title="Applications" value="24" />

        <Card title="Interviews" value="5" />
      </div>
    </DashboardLayout>
  );
}

export default RecruiterDashboard;
