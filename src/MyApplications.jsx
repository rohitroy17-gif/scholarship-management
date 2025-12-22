import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import AddReviewModal from "./AddReviewModal";
import AppDetailsModal from "./ApplicationDetailsModal";

const API_BASE = "https://my-scholarship-server.vercel.app/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedApp, setSelectedApp] = useState(null);
  const [detailsApp, setDetailsApp] = useState(null);

  const fetchApplications = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/applications?userId=${user.id}`);
      const data = await res.json();
      setApplications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!applications.length)
    return (
      <p className="text-center mt-10 text-gray-500">
        No applications found.
      </p>
    );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Applications</h2>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="px-4 py-3 border">University</th>
              <th className="px-4 py-3 border">Address</th>
              <th className="px-4 py-3 border">Feedback</th>
              <th className="px-4 py-3 border">Subject</th>
              <th className="px-4 py-3 border">Fees</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border">{app.universityName}</td>
                <td className="px-4 py-2 border">{app.universityAddress}</td>
                <td className="px-4 py-2 border">{app.feedback || "-"}</td>
                <td className="px-4 py-2 border">{app.subjectCategory}</td>
                <td className="px-4 py-2 border">${app.applicationFees}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      statusColors[app.applicationStatus] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {app.applicationStatus.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-2 border space-x-1 flex flex-wrap gap-1">
                  <button
                    onClick={() => setDetailsApp(app)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                  >
                    Details
                  </button>

                  {app.applicationStatus === "pending" && (
                    <>
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs">
                        Edit
                      </button>
                      {app.paymentStatus === "unpaid" && (
                        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs">
                          Pay
                        </button>
                      )}
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">
                        Delete
                      </button>
                    </>
                  )}

                  {app.applicationStatus === "completed" && (
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-xs"
                    >
                      Add Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {selectedApp && (
        <AddReviewModal
          application={selectedApp}
          onClose={() => {
            setSelectedApp(null);
            fetchApplications();
          }}
        />
      )}

      {detailsApp && (
        <AppDetailsModal
          application={detailsApp}
          onClose={() => setDetailsApp(null)}
        />
      )}
    </div>
  );
};

export default MyApplications;





