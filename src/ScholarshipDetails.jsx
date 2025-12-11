import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔥 Replace these with your working URLs (ibb.co direct links)
  const DEFAULT_UNIVERSITY_IMG = "https://i.ibb.co/2K2QLw5/default-university.png";
  const DEFAULT_USER_IMG = "https://i.ibb.co/7Qp0w5S/default-user.png";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resScholar = await fetch(`http://localhost:3000/scholarships/${id}`);
        if (!resScholar.ok) throw new Error("Failed to fetch scholarship");
        const scholarshipData = await resScholar.json();
        setScholarship(scholarshipData);

        const resReviews = await fetch(`http://localhost:3000/reviews?scholarshipId=${id}`);
        if (!resReviews.ok) throw new Error("Failed to fetch reviews");
        const reviewsData = await resReviews.json();
        setReviews(reviewsData);

      } catch (err) {
        console.error("Error:", err);
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
      
      {/* Scholarship Info */}
      <motion.div
        className="border rounded shadow p-6 mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={scholarship.universityImage || DEFAULT_UNIVERSITY_IMG}
          alt={scholarship.universityName}
          className="w-full h-64 object-cover rounded mb-6"
        />

        <h1 className="text-3xl font-bold mb-2">{scholarship.scholarshipName}</h1>

        <p className="text-gray-600 mb-1">University: {scholarship.universityName}</p>

        <p className="text-gray-600 mb-1">
          World Rank: #{scholarship.universityWorldRank || "N/A"}
        </p>

        <p className="text-gray-600 mb-1">
          Location: {scholarship.universityCity}, {scholarship.universityCountry}
        </p>

        <p className="text-gray-600 mb-1">
          Application Deadline: {scholarship.applicationDeadline || "N/A"}
        </p>

        <p className="text-gray-600 mb-1">
          Tuition Fees: ${scholarship.tuitionFees || 0}
        </p>

        {scholarship.applicationFees > 0 && (
          <p className="text-red-500 font-semibold mb-1">
            Application Fees: ${scholarship.applicationFees}
          </p>
        )}

        <p className="text-gray-700 mb-4">
          {scholarship.description || "No description available."}
        </p>

        {scholarship.stipend && (
          <p className="text-green-600 font-semibold mb-4">
            Coverage/Stipend: {scholarship.stipend}
          </p>
        )}

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          onClick={() => navigate(`/checkout/${scholarship._id}`)}
        >
          Apply for Scholarship
        </button>
      </motion.div>

      {/* Reviews */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev._id} className="border rounded p-4 shadow">
                <div className="flex items-center mb-2">
                  <img
                    src={rev.userImage || DEFAULT_USER_IMG}
                    alt={rev.userName}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{rev.userName}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(rev.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-yellow-500 mb-2">
                  {"⭐".repeat(rev.rating || 0)}
                </p>

                <p className="text-gray-700">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ScholarshipDetails;


