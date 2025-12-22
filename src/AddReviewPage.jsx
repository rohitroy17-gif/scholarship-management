import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
//addreview 
const AddReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [application, setApplication] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);

  // Get appId from query params
  const queryParams = new URLSearchParams(location.search);
  const appId = queryParams.get("appId");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        let url;
        if (appId) {
          url = `https://my-scholarship-server.vercel.app/applications/${appId}`;
          const res = await fetch(url);
          const data = await res.json();
          setApplication(data);
        } else {
          url = `https://my-scholarship-server.vercel.app/applications?userEmail=${encodeURIComponent(
            user.email
          )}`;
          const res = await fetch(url);
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setApplication(data[data.length - 1]); // latest application
          }
        }
      } catch (err) {
        console.error("Failed to fetch application:", err);
        toast.error("❌ Failed to fetch application");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchApplication();
  }, [appId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!application) return toast.error("❌ No application selected");

    try {
      const res = await fetch("https://my-scholarship-server.vercel.app/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: application._id,
          scholarshipId: application.scholarshipId,
          userId: user.email,
          reviewerName: user.name,
          comment,
          rating,
          date: new Date(),
        }),
      });

      const data = await res.json();
      if (data?._id || data?.id) {
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

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!application)
    return (
      <p className="text-center mt-10 text-red-500">
        ❌ No application selected
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Add Review</h2>

      <div className="mb-6 space-y-1">
        <p>
          <span className="font-semibold">Scholarship:</span>{" "}
          {application.scholarshipName}
        </p>
        <p>
          <span className="font-semibold">University:</span>{" "}
          {application.universityName}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold">Your Review:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            rows={5}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Rating (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default AddReviewPage;



