import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:3000";

const ModeratorPanel = () => {
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  // Load applications
  const loadApplications = async () => {
    try {
      const res = await fetch(`${API_BASE}/applications`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Failed to load applications:", err);
      toast.error("Failed to load applications");
    }
  };

  // Load reviews
  const loadReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      toast.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([loadApplications(), loadReviews()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading moderator data...</p>;

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationStatus: status }),
      });
      toast.success("Status updated");
      loadApplications();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const submitFeedback = async (id) => {
    if (!feedback) return toast.error("Please write feedback");
    try {
      await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: id,
          reviewerName: "Moderator",
          comment: feedback,
          date: new Date(),
        }),
      });
      toast.success("Feedback added");
      setFeedback("");
      loadReviews();
    } catch (err) {
      toast.error("Failed to add feedback");
    }
  };

  const deleteReview = async (id) => {
    try {
      await fetch(`${API_BASE}/reviews/${id}`, { method: "DELETE" });
      toast.success("Review deleted");
      loadReviews();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Moderator Panel - Applications</h2>

      {/* Applications Table */}
      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Applicant Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Scholarship</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td className="border p-2">{app.userName || "—"}</td>
              <td className="border p-2">{app.userEmail || "—"}</td>
              <td className="border p-2">{app.scholarshipName || "—"}</td>
              <td className="border p-2">{app.applicationStatus || "—"}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => setSelectedApp(app)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Details
                </button>
                <button
                  onClick={() => updateStatus(app._id, "Processing")}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Processing
                </button>
                <button
                  onClick={() => updateStatus(app._id, "Completed")}
                  className="bg-green-500 px-2 py-1 rounded"
                >
                  Completed
                </button>
                <button
                  onClick={() => updateStatus(app._id, "Rejected")}
                  className="bg-red-500 px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Selected Application Feedback */}
      {selectedApp && (
        <div className="p-4 border rounded mb-4 bg-gray-50">
          <h3 className="font-bold mb-2">Application Details & Feedback</h3>
          <p><strong>Name:</strong> {selectedApp.userName || "—"}</p>
          <p><strong>Email:</strong> {selectedApp.userEmail || "—"}</p>
          <p><strong>Scholarship:</strong> {selectedApp.scholarshipName || "—"}</p>
          <p><strong>Status:</strong> {selectedApp.applicationStatus || "—"}</p>

          <h4 className="font-semibold mt-4 mb-2">Add Moderator Feedback</h4>
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Write feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button
            onClick={() => submitFeedback(selectedApp._id)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Feedback
          </button>
          <button
            onClick={() => setSelectedApp(null)}
            className="ml-2 px-4 py-2 rounded border"
          >
            Close
          </button>
        </div>
      )}

      
    </div>
  );
};

export default ModeratorPanel;



