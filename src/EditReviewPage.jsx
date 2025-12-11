// src/EditReviewPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const EditReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [review, setReview] = useState(null);
  const [reviewText, setReviewText] = useState("");

  // Get reviewId from query params
  const queryParams = new URLSearchParams(location.search);
  const reviewId = queryParams.get("reviewId");

  useEffect(() => {
    const fetchReview = async () => {
      try {
        let url;

        if (reviewId) {
          // Fetch specific review
          url = `http://localhost:3000/reviews/${reviewId}`;
          const res = await fetch(url);
          const data = await res.json();
          setReview(data);
          setReviewText(data.review);
        } else {
          // Fetch latest review of the user's latest application
          const appsRes = await fetch(`http://localhost:3000/applications?userEmail=${encodeURIComponent(user.email)}`);
          const appsData = await appsRes.json();

          if (Array.isArray(appsData) && appsData.length > 0) {
            const latestApp = appsData[appsData.length - 1];

            // fetch latest review for this application
            const reviewsRes = await fetch(`http://localhost:3000/reviews?applicationId=${latestApp._id}&userId=${encodeURIComponent(user.email)}`);
            const reviewsData = await reviewsRes.json();

            if (Array.isArray(reviewsData) && reviewsData.length > 0) {
              const latestReview = reviewsData[reviewsData.length - 1];
              setReview(latestReview);
              setReviewText(latestReview.review);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch review:", err);
      }
    };

    if (user?.email) fetchReview();
  }, [reviewId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review) return alert("❌ No review selected");

    try {
      await fetch(`http://localhost:3000/reviews/${review._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: reviewText }),
      });

      alert("✅ Review updated!");
      navigate("/dashboard/user/application-details"); // redirect after edit
    } catch (err) {
      console.error("Failed to update review:", err);
      alert("❌ Failed to update review");
    }
  };

  if (!review) return <p>❌ No review selected</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Review</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full p-2 border rounded"
          rows={5}
          required
        />
        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Update Review
        </button>
      </form>
    </div>
  );
};

export default EditReviewPage;

