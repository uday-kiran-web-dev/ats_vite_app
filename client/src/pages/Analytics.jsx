import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import Card from "../components/Card";

import API from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Analytics() {
  const [overview, setOverview] = useState(null);

  const [pipeline, setPipeline] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const overviewRes = await API.get("/analytics/overview");

      const pipelineRes = await API.get("/analytics/pipeline");

      setOverview(overviewRes.data);

      setPipeline(pipelineRes.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Users", overview.totalUsers],
      ["Total Jobs", overview.totalJobs],
      ["Applications", overview.totalApplications],
      ["Hired", overview.hiredCandidates],
      ["Total Candidates", overview.totalCandidates],
      ["Total Recruiters", overview.totalRecruiters],
      ["Active Jobs", overview.activeJobs],
      [],
      ["Pipeline Stage", "Count"],
      ["Applied", pipeline.applied],
      ["Screened", pipeline.screened],
      ["Interviewed", pipeline.interviewed],
      ["Offered", pipeline.offered],
      ["Hired", pipeline.hired],
      ["Rejected", pipeline.rejected],
    ];

    const csvContent = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\r\n");

    downloadCSV(csvContent, "analytics-report.csv");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading analytics...</p>
      </DashboardLayout>
    );
  }

  // Bar chart data
  const barData = [
    {
      name: "Users",
      value: overview.totalUsers,
    },
    {
      name: "Jobs",
      value: overview.totalJobs,
    },
    {
      name: "Applications",
      value: overview.totalApplications,
    },
    {
      name: "Hired",
      value: overview.hiredCandidates,
    },
  ];

  // Pipeline chart data
  const pieData = [
    {
      name: "Applied",
      value: pipeline.applied,
    },
    {
      name: "Screened",
      value: pipeline.screened,
    },
    {
      name: "Interviewed",
      value: pipeline.interviewed,
    },
    {
      name: "Offered",
      value: pipeline.offered,
    },
    {
      name: "Hired",
      value: pipeline.hired,
    },
    {
      name: "Rejected",
      value: pipeline.rejected,
    },
  ];

  const COLORS = [
    "#3B82F6",
    "#8B5CF6",
    "#F59E0B",
    "#10B981",
    "#22C55E",
    "#EF4444",
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <button
          type="button"
          onClick={handleExportCSV}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card title="Total Users" value={overview.totalUsers} />

        <Card title="Total Jobs" value={overview.totalJobs} />

        <Card title="Applications" value={overview.totalApplications} />

        <Card title="Hired" value={overview.hiredCandidates} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Platform Overview</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Hiring Pipeline</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Candidates</h3>

          <p className="text-4xl font-bold text-blue-600">
            {overview.totalCandidates}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Recruiters</h3>

          <p className="text-4xl font-bold text-purple-600">
            {overview.totalRecruiters}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Active Jobs</h3>

          <p className="text-4xl font-bold text-green-600">
            {overview.activeJobs}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Analytics;
