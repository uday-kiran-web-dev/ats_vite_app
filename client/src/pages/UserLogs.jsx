import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

function UserLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    try {
      const { data } = await API.get("/users/logs");
      setLogs(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load user logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Logs</h1>
            <p className="text-sm text-slate-500">
              Recent login events for all users.
            </p>
          </div>
        </div>

        {loading && <p>Loading logs...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white p-6 rounded-lg shadow">
            <table className="min-w-full text-left divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                    User
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                    IP
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                    User Agent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={`${log.userId}-${log.timestamp}`}>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {log.firstName} {log.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {log.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {log.ip || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 break-words max-w-[26rem]">
                      {log.userAgent || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!logs.length && (
              <p className="mt-4 text-slate-600">No user logs available.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default UserLogs;
