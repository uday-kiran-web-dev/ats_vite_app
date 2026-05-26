import DashboardLayout from "../layouts/DashboardLayout";

import Card from "../components/Card";

function CandidateDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Candidate Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Applications" value="12" />

        <Card title="Interviews" value="3" />

        <Card title="Offers" value="1" />
      </div>
    </DashboardLayout>
  );
}

export default CandidateDashboard;
