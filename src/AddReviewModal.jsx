import { useState } from "react";

const AddReviewModal = ({ application, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!application) return null;

  const handleSubmit = async () => {
    await fetch("https://my-scholarship-server.vercel.app/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: application._id,
        scholarshipName: application.universityName,
        universityName: application.universityName,
        rating,
        comment,
      }),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-[400px] p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Review</h2>

        <label>Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border w-full p-2 mb-3"
        >
          <option>1</option><option>2</option>
          <option>3</option><option>4</option>
          <option>5</option>
        </select>

        <label>Comment</label>
        <textarea
          className="border w-full p-2 mb-3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>

        <button
          onClick={onClose}
          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddReviewModal;





