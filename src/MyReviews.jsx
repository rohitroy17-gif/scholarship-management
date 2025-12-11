// src/pages/MyReviews.jsx
import { useState, useEffect } from "react";
import EditReviewModal from "../components/EditReviewModal";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setReviews(reviews.filter((r) => r._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-semibold">My Reviews</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Scholarship</th>
            <th className="p-2">University</th>
            <th className="p-2">Comment</th>
            <th className="p-2">Date</th>
            <th className="p-2">Rating</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map((r) => (
            <tr key={r._id} className="border-b">
              <td className="p-2">{r.scholarshipName}</td>
              <td className="p-2">{r.universityName}</td>
              <td className="p-2">{r.comment}</td>
              <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
              <td className="p-2">{r.rating}</td>

              <td className="p-2 space-x-2">
                <button
                  onClick={() => {
                    setSelectedReview(r);
                    setEditModalOpen(true);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(r._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editModalOpen && (
        <EditReviewModal
          review={selectedReview}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyReviews;

