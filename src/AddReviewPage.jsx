// src/AddReviewPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AddReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [reviewText, setReviewText] = useState("");

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
      }
    };

    if (user?.email) {
      fetchApplication();
    }
  }, [appId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!application) return alert("No application selected!");

    try {
      const res = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: application._id,
          scholarshipId: application.scholarshipId,
          userId: user.email,
          review: reviewText,
          date: new Date(),
        }),
      });

      const data = await res.json();
      alert("✅ Review added!");
      navigate("/dashboard/user/application-details"); // redirect to application details
    } catch (err) {
      console.error("Failed to add review:", err);
      alert("❌ Failed to add review");
    }
  };

  if (!application) return <p>❌ No application selected</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Review</h2>
      <p><b>Scholarship:</b> {application.scholarshipName}</p>
      <p><b>University:</b> {application.universityName}</p>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-2 border rounded"
          rows={5}
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

