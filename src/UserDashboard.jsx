import React, { useEffect, useState } from "react";
import ApplicationDetailsModal from "./ApplicationDetailsModal";
import AddReviewModal from "./AddReviewModal";
import EditReviewModal from "./EditReviewModal";

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [isEditReviewOpen, setIsEditReviewOpen] = useState(false);

  useEffect(() => {
    // Fetch applications and reviews from backend
    const fetchData = async () => {
      const appsRes = await fetch("https://my-scholarship-server.vercel.app/applications");
      const appsData = await appsRes.json();
      setApplications(appsData);

      const revRes = await fetch("https://my-scholarship-server.vercel.app/reviews");
      const revData = await revRes.json();
      setReviews(revData);
    };
    fetchData();
  }, []);

  // Handlers
  const openAppDetails = (app) => {
    setSelectedApplication(app);
    setIsAppModalOpen(true);
  };

  const openAddReview = (app) => {
    setSelectedApplication(app);
    setIsAddReviewOpen(true);
  };

  const openEditReview = (review) => {
    setSelectedReview(review);
    setIsEditReviewOpen(true);
  };

  const handleAddReview = (reviewData) => {
    console.log("Add review:", reviewData);
    // Call API to save review
  };

  const handleEditReview = (reviewData) => {
    console.log("Edit review:", reviewData);
    // Call API to update review
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">University</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Feedback</th>
            <th className="border p-2">Subject Category</th>
            <th className="border p-2">Fees</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id} className="text-center">
              <td className="border p-2">{app.universityName}</td>
              <td className="border p-2">{app.universityAddress}</td>
              <td className="border p-2">{app.feedback || "N/A"}</td>
              <td className="border p-2">{app.subjectCategory}</td>
              <td className="border p-2">${app.applicationFees}</td>
              <td className="border p-2">{app.applicationStatus}</td>
              <td className="border p-2 flex flex-col gap-1 items-center justify-center">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => openAppDetails(app)}
                >
                  Details
                </button>

                {app.applicationStatus === "pending" && (
                  <>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    {app.paymentStatus === "unpaid" && (
                      <button className="bg-green-600 text-white px-3 py-1 rounded">Pay</button>
                    )}
                    <button className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                  </>
                )}

                {app.applicationStatus === "completed" && (
                  <button
                    className="bg-purple-600 text-white px-3 py-1 rounded"
                    onClick={() => openAddReview(app)}
                  >
                    Add Review
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 className="text-3xl font-bold my-6">My Reviews</h1>
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Scholarship</th>
            <th className="border p-2">University</th>
            <th className="border p-2">Comment</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((rev) => (
            <tr key={rev._id} className="text-center">
              <td className="border p-2">{rev.scholarshipName}</td>
              <td className="border p-2">{rev.universityName}</td>
              <td className="border p-2">{rev.comment}</td>
              <td className="border p-2">{new Date(rev.date).toLocaleDateString()}</td>
              <td className="border p-2">{rev.rating}</td>
              <td className="border p-2 flex gap-1 justify-center">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => openEditReview(rev)}
                >
                  Edit
                </button>
                <button className="bg-red-600 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      <ApplicationDetailsModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        application={selectedApplication}
      />

      <AddReviewModal
        isOpen={isAddReviewOpen}
        onClose={() => setIsAddReviewOpen(false)}
        onSubmit={handleAddReview}
      />

      <EditReviewModal
        isOpen={isEditReviewOpen}
        onClose={() => setIsEditReviewOpen(false)}
        review={selectedReview}
        onUpdate={handleEditReview}
      />
    </div>
  );
};

export default UserDashboard;
