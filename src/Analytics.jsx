import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("https://my-scholarship-server.vercel.app/scholarships").then((r) => r.json()),
      fetch("https://my-scholarship-server.vercel.app/applications").then((r) => r.json()),
      fetch("https://my-scholarship-server.vercel.app/users").then((r) => r.json()),
    ])
      .then(([s, a, u]) => {
        setScholarships(s);
        setApplications(a);
        setUsers(u);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalUsers = users.length;
  const totalScholarships = scholarships.length;

  const totalFeesCollected = applications.reduce(
    (sum, a) => sum + ((a.amount || 0) + (a.serviceCharge || 0)),
    0
  );

  const universityMap = {};
  applications.forEach((a) => {
    if (a.universityName) {
      universityMap[a.universityName] =
        (universityMap[a.universityName] || 0) + 1;
    }
  });

  const chartData = Object.entries(universityMap).map(
    ([name, count]) => ({ name, count })
  );

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Analytics Dashboard
        </h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-3xl font-bold text-blue-600">
              {totalUsers}
            </p>
          </div>

          <div className="p-6 rounded-xl bg-green-50 border border-green-100">
            <p className="text-sm text-gray-500">
              Total Scholarships
            </p>
            <p className="text-3xl font-bold text-green-600">
              {totalScholarships}
            </p>
          </div>

          <div className="p-6 rounded-xl bg-purple-50 border border-purple-100">
            <p className="text-sm text-gray-500">
              Total Fees Collected
            </p>
            <p className="text-3xl font-bold text-purple-600">
              ${totalFeesCollected}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white border rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Applications per University
          </h3>

          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;






