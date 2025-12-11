// src/MyApplications.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import AddReviewModal from "./AddReviewModal";
import AppDetailsModal from "./ApplicationDetailsModal";

const API_BASE = "http://localhost:3000/api";

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedApp, setSelectedApp] = useState(null); // for AddReviewModal
  const [detailsApp, setDetailsApp] = useState(null); // for ApplicationDetailsModal

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_BASE}/applications?userId=${user?.id}`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  if (loading) return <p>Loading applications...</p>;
  if (!applications.length) return <p>No applications found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Applications</h2>
      <table className="table-auto border w-full">
        <thead>
          <tr>
            <th className="border px-2 py-1">University</th>
            <th className="border px-2 py-1">Address</th>
            <th className="border px-2 py-1">Feedback</th>
            <th className="border px-2 py-1">Subject</th>
            <th className="border px-2 py-1">Fees</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td className="border px-2 py-1">{app.universityName}</td>
              <td className="border px-2 py-1">{app.universityAddress}</td>
              <td className="border px-2 py-1">{app.feedback || "-"}</td>
              <td className="border px-2 py-1">{app.subjectCategory}</td>
              <td className="border px-2 py-1">{app.applicationFees}</td>
              <td className="border px-2 py-1">{app.applicationStatus}</td>
              <td className="border px-2 py-1 space-x-1">
                <button
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                  onClick={() => setDetailsApp(app)}
                >
                  Details
                </button>
                {app.applicationStatus === "pending" && (
                  <>
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded">
                      Edit
                    </button>
                    {app.paymentStatus === "unpaid" && (
                      <button className="bg-green-500 text-white px-2 py-1 rounded">
                        Pay
                      </button>
                    )}
                    <button className="bg-red-500 text-white px-2 py-1 rounded">
                      Delete
                    </button>
                  </>
                )}
                {app.applicationStatus === "completed" && (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => setSelectedApp(app)}
                  >
                    Add Review
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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




