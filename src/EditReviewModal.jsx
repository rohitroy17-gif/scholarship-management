// src/components/EditReviewModal.jsx
import { useState, useEffect } from "react";

const EditReviewModal = ({ review, onClose }) => {
  // Prevent crash if review is still loading
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (review) {
      setRating(review.rating || 5);
      setComment(review.comment || "");
    }
  }, [review]);

  // If review is not loaded yet → don't render modal content
  if (!review) return null;

  const handleUpdate = async () => {
    await fetch(`/api/reviews/${review._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded">
        <h2 className="text-xl font-semibold mb-3">Edit Review</h2>

        <label className="block mb-2">Rating (1–5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border w-full p-2 rounded"
        />

        <label className="block mt-3 mb-2">Comment:</label>
        <textarea
          className="border w-full p-2 rounded"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <button
          onClick={handleUpdate}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>

        <button
          onClick={onClose}
          className="mt-4 ml-2 bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditReviewModal;





