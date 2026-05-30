import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";
import Card from "../components/Card";

function CandidateDashboard() {
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profileRes = await API.get("/profiles/me");
        const isComplete = [
          profileRes.data.skills,
          profileRes.data.experience,
          profileRes.data.education,
          profileRes.data.bio,
          profileRes.data.linkedin,
          profileRes.data.portfolio,
        ].every((value) => value && value.toString().trim().length > 0);
        setProfileComplete(isComplete);

        // Fetch applications
        const appRes = await API.get("/applications");
        setApplications(appRes.data);

        // Calculate dashboard stats
        const totalApplications = appRes.data.length;
        const interviews = appRes.data.filter(
          (app) => app.status === "interviewed",
        ).length;
        const offers = appRes.data.filter(
          (app) => app.status === "offered",
        ).length;

        setDashboardData({
          applications: totalApplications,
          interviews: interviews,
          offers: offers,
        });
      } catch (error) {
      } finally {
        setProfileLoading(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentActivities = applications
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((app) => `Applied for ${app.jobId?.title || "a job"}`);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Candidate Dashboard</h1>

      {!profileLoading && !profileComplete && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 p-5 rounded-lg mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Complete Your Profile</h2>
              <p className="mt-2 text-sm text-yellow-800">
                Please finish your profile to get the best experience and unlock
                your candidate dashboard features.
              </p>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center bg-yellow-600 text-white px-5 py-3 rounded hover:bg-yellow-700"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
            <Card title="Applications" value={dashboardData.applications} />
            <Card title="Interviews" value={dashboardData.interviews} />
            <Card title="Offers" value={dashboardData.offers} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Recent Applications</h2>
            <ul className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, idx) => (
                  <li key={idx} className="border-b pb-2 text-sm text-gray-700">
                    {activity}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No applications yet</li>
              )}
            </ul>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default CandidateDashboard;
