import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";
import Card from "../components/Card";

function CandidateDashboard() {
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/profiles/me");

        const isComplete = [
          data.skills,
          data.experience,
          data.education,
          data.bio,
          data.linkedin,
          data.portfolio,
        ].every((value) => value && value.toString().trim().length > 0);

        setProfileComplete(isComplete);
      } catch (error) {
        setProfileComplete(false);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
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
