import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

function Candidates() {
  const [profiles, setProfiles] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch candidates
  const fetchCandidates = async () => {
    try {
      const { data } = await API.get("/profiles");

      setProfiles(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Candidates</h1>

      {loading && <p>Loading candidates...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((profile) => (
          <div key={profile._id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-2">
              {profile.userId?.firstName} {profile.userId?.lastName}
            </h2>

            <p className="text-gray-600 mb-4">{profile.userId?.email}</p>

            <p className="mb-4">{profile.bio}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            <p className="mb-2">
              <strong>Experience:</strong> {profile.experience} years
            </p>

            <p className="mb-4">
              <strong>Education:</strong> {profile.education}
            </p>

            <div className="flex gap-4">
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  LinkedIn
                </a>
              )}

              {profile.portfolio && (
                <a
                  href={profile.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  Portfolio
                </a>
              )}

              {profile.resume && (
                <a
                  href={`http://localhost:5000/${profile.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600 underline"
                >
                  Resume
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Candidates;
