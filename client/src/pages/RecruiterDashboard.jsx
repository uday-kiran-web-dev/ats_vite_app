import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import API from "../services/api";

function RecruiterDashboard() {
  const [dashboardData, setDashboardData] = useState({
    activeJobs: 0,
    applications: 0,
    interviews: 0,
    hired: 0,
  });
  const [pipelineData, setPipelineData] = useState({
    applied: 0,
    interviewed: 0,
    offered: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch overview analytics
        const overviewRes = await API.get("/analytics/overview");
        const overview = overviewRes.data;

        // Fetch pipeline analytics
        const pipelineRes = await API.get("/analytics/pipeline");
        const pipeline = pipelineRes.data;

        setDashboardData({
          activeJobs: overview.activeJobs || 0,
          applications: overview.totalApplications || 0,
          interviews: pipeline.interviewed || 0,
          hired: pipeline.hired || 0,
        });

        setPipelineData({
          applied: pipeline.applied || 0,
          interviewed: pipeline.interviewed || 0,
          offered: pipeline.offered || 0,
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
      <h1 className="text-3xl font-bold mb-8">Recruiter Dashboard</h1>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-10">
            <Card title="Active Jobs" value={dashboardData.activeJobs} />
            <Card title="Applications" value={dashboardData.applications} />
            <Card title="Interviews" value={dashboardData.interviews} />
            <Card title="Hired" value={dashboardData.hired} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Hiring Pipeline</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Applied</span>
                <span className="font-semibold">{pipelineData.applied}</span>
              </div>
              <div className="flex justify-between">
                <span>Interviewed</span>
                <span className="font-semibold">
                  {pipelineData.interviewed}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Offered</span>
                <span className="font-semibold">{pipelineData.offered}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default RecruiterDashboard;
