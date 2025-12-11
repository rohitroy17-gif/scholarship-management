// src/AddReviewPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const AddReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [application, setApplication] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  // Get appId from query params
  const queryParams = new URLSearchParams(location.search);
  const appId = queryParams.get("appId");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        let url;
        if (appId) {
          // Fetch specific application
          url = `http://localhost:3000/applications/${appId}`;
          const res = await fetch(url);
          const data = await res.json();
          setApplication(data);
        } else {
          // Fetch latest application of the logged-in user
          url = `http://localhost:3000/applications?userEmail=${encodeURIComponent(user.email)}`;
          const res = await fetch(url);
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setApplication(data[data.length - 1]); // latest application
          }
        }
      } catch (err) {
        console.error("Failed to fetch application:", err);
        toast.error("Failed to fetch application");
      }
    };

    if (user?.email) {
      fetchApplication();
    }
  }, [appId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!application) return toast.error("❌ No application selected");

    try {
      const res = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: application._id,
          scholarshipId: application.scholarshipId,
          userId: user.email,
          reviewerName: user.name,
          comment, // <-- review text
          rating,  // <-- numeric rating
          date: new Date(),
        }),
      });

      const data = await res.json();
      if (data?.id || data?._id) {
        toast.success("✅ Review added successfully!");
        navigate("/dashboard/user/application-details");
      } else {
        toast.error("❌ Failed to add review");
      }
    } catch (err) {
      console.error("Failed to add review:", err);
      toast.error("❌ Failed to add review");
    }
  };

  if (!application) return <p className="text-red-500">❌ No application selected</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Review</h2>
      <p><b>Scholarship:</b> {application.scholarshipName}</p>
      <p><b>University:</b> {application.universityName}</p>

      <form onSubmit={handleSubmit} className="mt-4">
        <label className="block mb-2 font-semibold">Your Review:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-2 border rounded mb-4"
          rows={5}
          required
        />

        <label className="block mb-2 font-semibold">Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-20 p-2 border rounded mb-4"
          required
        />

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default AddReviewPage;


