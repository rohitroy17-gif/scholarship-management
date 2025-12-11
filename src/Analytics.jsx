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

  useEffect(() => {
    fetch("http://localhost:3000/scholarships")
      .then((r) => r.json())
      .then(setScholarships)
      .catch(console.error);

    fetch("http://localhost:3000/applications")
      .then((r) => r.json())
      .then(setApplications)
      .catch(console.error);
  }, []);

  const totalUsers = 0; // replace with actual /users fetch if needed
  const totalScholarships = scholarships.length;
  const totalFeesCollected = applications.reduce(
    (acc, a) =>
      acc +
      (a.paymentStatus === "paid" ? (a.applicationFees || 0) + (a.serviceCharge || 0) : 0),
    0
  );

  // compute application counts per university
  const countsMap = {};
  applications.forEach((a) => {
    countsMap[a.universityName] = (countsMap[a.universityName] || 0) + 1;
  });
  const chartData = Object.entries(countsMap).map(([name, count]) => ({ name, count }));

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 border rounded shadow-sm">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-xl font-bold">{totalUsers}</div>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <div className="text-sm text-gray-500">Total Scholarships</div>
          <div className="text-xl font-bold">{totalScholarships}</div>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <div className="text-sm text-gray-500">Total Fees Collected</div>
          <div className="text-xl font-bold">${totalFeesCollected}</div>
        </div>
      </div>

      <div className="w-full h-[400px] md:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={60} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3182ce" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
