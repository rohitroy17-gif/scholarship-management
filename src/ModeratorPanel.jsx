import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:3000";

const ModeratorPanel = () => {
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Load all applications
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

  // Load all reviews
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
    loadApplications();
    loadReviews();
  }, []);

  // Update application status
  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationStatus: status })
      });
      toast.success("Status updated");
      loadApplications();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Submit feedback
  const submitFeedback = async (id) => {
    try {
      await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id, reviewerName: "Moderator", comment: feedback, rating: 0 })
      });
      toast.success("Feedback added");
      setFeedback("");
      loadReviews();
    } catch (err) {
      toast.error("Failed to add feedback");
    }
  };

  // Delete review
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

      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Applicant Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">University</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td className="border p-2">{app.applicantName}</td>
              <td className="border p-2">{app.applicantEmail}</td>
              <td className="border p-2">{app.universityName}</td>
              <td className="border p-2">{app.applicationStatus}</td>
              <td className="border p-2 flex gap-2">
                <button onClick={() => setSelectedApp(app)} className="bg-blue-500 text-white px-2 py-1 rounded">Details</button>
                <button onClick={() => updateStatus(app._id, "Processing")} className="bg-yellow-400 px-2 py-1 rounded">Processing</button>
                <button onClick={() => updateStatus(app._id, "Completed")} className="bg-green-500 px-2 py-1 rounded">Completed</button>
                <button onClick={() => updateStatus(app._id, "Rejected")} className="bg-red-500 px-2 py-1 rounded">Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedApp && (
        <div className="p-4 border rounded mb-4 bg-gray-50">
          <h3 className="font-bold mb-2">Application Details</h3>
          <p><strong>Name:</strong> {selectedApp.applicantName}</p>
          <p><strong>Email:</strong> {selectedApp.applicantEmail}</p>
          <p><strong>University:</strong> {selectedApp.universityName}</p>
          <p><strong>Application Status:</strong> {selectedApp.applicationStatus}</p>
          <textarea
            className="w-full p-2 border rounded my-2"
            placeholder="Write feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button onClick={() => submitFeedback(selectedApp._id)} className="bg-blue-600 text-white px-4 py-2 rounded">Submit Feedback</button>
          <button onClick={() => setSelectedApp(null)} className="ml-2 px-4 py-2 rounded border">Close</button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Reviewer</th>
            <th className="border p-2">Comment</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((rev) => (
            <tr key={rev._id}>
              <td className="border p-2">{rev.reviewerName}</td>
              <td className="border p-2">{rev.comment}</td>
              <td className="border p-2">
                <button onClick={() => deleteReview(rev._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModeratorPanel;

