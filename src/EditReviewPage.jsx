import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
//editreview
const EditReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [review, setReview] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);

  // Get reviewId from query params
  const queryParams = new URLSearchParams(location.search);
  const reviewId = queryParams.get("reviewId");

  useEffect(() => {
    const fetchReview = async () => {
      try {
        let url;

        if (reviewId) {
          url = `https://my-scholarship-server.vercel.app/reviews/${reviewId}`;
          const res = await fetch(url);
          const data = await res.json();
          setReview(data);
          setReviewText(data.comment || "");
        } else {
          // Fetch latest review from latest application
          const appsRes = await fetch(
            `https://my-scholarship-server.vercel.app/applications?userEmail=${encodeURIComponent(
              user.email
            )}`
          );
          const appsData = await appsRes.json();

          if (Array.isArray(appsData) && appsData.length > 0) {
            const latestApp = appsData[appsData.length - 1];

            const reviewsRes = await fetch(
              `https://my-scholarship-server.vercel.app/reviews?applicationId=${latestApp._id}&userId=${encodeURIComponent(
                user.email
              )}`
            );
            const reviewsData = await reviewsRes.json();

            if (Array.isArray(reviewsData) && reviewsData.length > 0) {
              const latestReview = reviewsData[reviewsData.length - 1];
              setReview(latestReview);
              setReviewText(latestReview.comment || "");
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch review:", err);
        toast.error("❌ Failed to fetch review");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchReview();
  }, [reviewId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review) return toast.error("❌ No review selected");

    try {
      const res = await fetch(`https://my-scholarship-server.vercel.app/reviews/${review._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: reviewText }),
      });

      const data = await res.json();
      if (data?._id || data?.id) {
        toast.success("✅ Review updated successfully!");
        navigate("/dashboard/user/application-details");
      } else {
        toast.error("❌ Failed to update review");
      }
    } catch (err) {
      console.error("Failed to update review:", err);
      toast.error("❌ Failed to update review");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!review)
    return (
      <p className="text-center mt-10 text-red-500">
        ❌ No review selected
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Edit Review</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold">Your Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          Update Review
        </button>
      </form>
    </div>
  );
};

export default EditReviewPage;


