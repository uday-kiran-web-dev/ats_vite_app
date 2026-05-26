import DashboardLayout from "../layouts/DashboardLayout";

import Card from "../components/Card";

function RecruiterDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Recruiter Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card title="Active Jobs" value="8" />

        <Card title="Applications" value="24" />

        <Card title="Interviews" value="5" />

        <Card title="Hired" value="2" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Hiring Pipeline</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Applied</span>
            <span>20</span>
          </div>

          <div className="flex justify-between">
            <span>Interviewed</span>
            <span>6</span>
          </div>

          <div className="flex justify-between">
            <span>Offered</span>
            <span>3</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default RecruiterDashboard;
