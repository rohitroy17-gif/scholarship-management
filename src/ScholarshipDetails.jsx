import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scholarship, setScholarship] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const DEFAULT_UNIVERSITY_IMG = "https://via.placeholder.com/600x400?text=University";
  const DEFAULT_USER_IMG = "https://via.placeholder.com/50";

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const resScholar = await fetch(`http://localhost:3000/scholarships/${id}`);
        const scholarshipData = await resScholar.json();
        if (!scholarshipData.success) throw new Error("Scholarship not found");
        setScholarship(scholarshipData.scholarship); // ✅ unwrap

        const resReviews = await fetch(`http://localhost:3000/reviews?scholarshipId=${id}`);
        const reviewsData = await resReviews.json();
        setReviews(reviewsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!scholarship) return <p className="text-center mt-10 text-red-500">Scholarship not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <motion.div className="border rounded shadow p-6 mb-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <img
          src={scholarship.universityImage || DEFAULT_UNIVERSITY_IMG}
          alt={scholarship.universityName}
          className="w-full h-64 object-cover rounded mb-6"
        />

        <h1 className="text-3xl font-bold mb-2">{scholarship.scholarshipName}</h1>
        <p>University: {scholarship.universityName}</p>
        <p>Application Fee: ${scholarship.applicationFees}</p>

        <button
          className="bg-blue-600 text-white px-6 py-3 mt-4 rounded"
          onClick={() => navigate(`/checkout/${scholarship._id}`)} // ✅ _id now exists
        >
          Apply for Scholarship
        </button>
      </motion.div>

      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev._id} className="border p-4 mb-3">
            <p className="font-semibold">{rev.userName}</p>
            <p>{"⭐".repeat(rev.rating || 0)}</p>
            <p>{rev.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ScholarshipDetails;



