import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import Modal from "react-modal";
import db from "../public/db.json"; // Your local data

Modal.setAppElement("#root");

const ModeratorDashboard = () => {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");
  const [activeTab, setActiveTab] = useState("applications"); // new tab state

  useEffect(() => {
    setApplications(db.applications);
    setReviews(db.reviews);
  }, []);

  // ---------------- MODAL ----------------
  const openModal = (app) => {
    setSelectedApp(app);
    setFeedbackText(app.feedback || "");
    setStatusUpdate(app.applicationStatus || "pending");
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApp(null);
    setModalOpen(false);
  };

  const handleFeedbackSave = () => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === selectedApp.id
          ? { ...a, feedback: feedbackText, applicationStatus: statusUpdate }
          : a
      )
    );
    closeModal();
  };

  const handleCancelApplication = (id) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, applicationStatus: "rejected" } : a))
    );
  };

  const handleDeleteReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Moderator Dashboard</h1>

      {/* My Profile */}
      <div className="mb-6 p-4 border rounded bg-white shadow">
        <h2 className="font-bold text-xl mb-2">My Profile</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === "applications" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "reviews" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("reviews")}
        >
          All Reviews
        </button>
      </div>

      {/* ---------------- APPLICATIONS TABLE ---------------- */}
      {activeTab === "applications" && (
        <div className="mb-8 p-4 border rounded bg-white shadow">
          <h2 className="font-bold text-xl mb-4">Manage Applications</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Applicant Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">University</th>
                <th className="border p-2">Feedback</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Payment</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="border p-2">{app.applicantName}</td>
                  <td className="border p-2">{app.applicantEmail}</td>
                  <td className="border p-2">{app.universityName}</td>
                  <td className="border p-2">{app.feedback || "-"}</td>
                  <td className="border p-2">{app.applicationStatus}</td>
                  <td className="border p-2">{app.paymentStatus}</td>
                  <td className="border p-2 flex gap-2">
                    <button
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                      onClick={() => openModal(app)}
                    >
                      Details / Feedback
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleCancelApplication(app.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------- REVIEWS TABLE ---------------- */}
      {activeTab === "reviews" && (
        <div className="p-4 border rounded bg-white shadow">
          <h2 className="font-bold text-xl mb-4">All Reviews</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">User</th>
                <th className="border p-2">Review</th>
                <th className="border p-2">Rating</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((rev) => (
                <tr key={rev.id}>
                  <td className="border p-2">{rev.userName || "Unknown"}</td>
                  <td className="border p-2">{rev.reviewComment}</td>
                  <td className="border p-2">{rev.ratingPoint}</td>
                  <td className="border p-2">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDeleteReview(rev.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------- MODAL ---------------- */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        className="p-6 bg-white max-w-lg mx-auto mt-20 rounded shadow"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
      >
        <h2 className="font-bold text-xl mb-4">Application Details</h2>
        {selectedApp && (
          <>
            <p><strong>Name:</strong> {selectedApp.applicantName}</p>
            <p><strong>Email:</strong> {selectedApp.applicantEmail}</p>
            <p><strong>University:</strong> {selectedApp.universityName}</p>
            <p><strong>Payment Status:</strong> {selectedApp.paymentStatus}</p>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full border p-2 mt-2 rounded"
              placeholder="Write feedback"
            ></textarea>

            <select
              value={statusUpdate}
              onChange={(e) => setStatusUpdate(e.target.value)}
              className="w-full border p-2 mt-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleFeedbackSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ModeratorDashboard;


