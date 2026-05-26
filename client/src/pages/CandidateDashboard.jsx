import DashboardLayout from "../layouts/DashboardLayout";

import Card from "../components/Card";

function CandidateDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Candidate Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card title="Applications" value="12" />

        <Card title="Interviews" value="3" />

        <Card title="Offers" value="1" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>

        <ul className="space-y-4">
          <li className="border-b pb-3">Applied for Frontend Developer</li>

          <li className="border-b pb-3">Interview scheduled with ABC Corp</li>

          <li>Offer received from Tech Solutions</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}

export default CandidateDashboard;
