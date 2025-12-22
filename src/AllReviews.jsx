import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
//allreview
const API_BASE = "http://localhost:3000";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [applications, setApplications] = useState([]);

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

  const loadReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      const data = await res.json();
      const userReviews = data.filter((rev) => rev.reviewerName !== "Moderator");
      setReviews(userReviews);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      toast.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    loadApplications();
    loadReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await fetch(`${API_BASE}/reviews/${id}`, { method: "DELETE" });
      toast.success("Review deleted successfully");
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-6xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">All Reviews</h2>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Applicant</th>
            <th className="border px-4 py-2">Reviewer</th>
            <th className="border px-4 py-2">Comment</th>
            <th className="border px-4 py-2">Rating</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No reviews found
              </td>
            </tr>
          ) : (
            reviews.map((review) => {
              const app = applications.find(
                (a) => String(a._id) === String(review.applicationId)
              );
              return (
                <tr key={review._id}>
                  <td className="border px-4 py-2">{app?.userName || "Unknown"}</td>
                  <td className="border px-4 py-2">{review.reviewerName}</td>
                  <td className="border px-4 py-2">{review.comment}</td>
                  <td className="border px-4 py-2">{review.rating ?? "N/A"}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllReviews;



