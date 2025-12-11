import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);

  // Fetch all reviews for moderator panel
  useEffect(() => {
    fetch("http://localhost:3000/reviews/all")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Invalid response");
        setReviews(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch reviews");
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    fetch(`http://localhost:3000/reviews/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        toast.success("Review deleted successfully");
        setReviews(reviews.filter((r) => r._id !== id));
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete review");
      });
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-6xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">All Reviews</h2>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Reviewer</th>
            <th className="border px-4 py-2">Comment</th>
            <th className="border px-4 py-2">Rating</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No reviews found
              </td>
            </tr>
          ) : (
            reviews.map((review) => (
              <tr key={review._id}>
                <td className="border px-4 py-2">{review.reviewerName}</td>
                <td className="border px-4 py-2">{review.comment}</td>
                <td className="border px-4 py-2">{review.rating}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllReviews;


