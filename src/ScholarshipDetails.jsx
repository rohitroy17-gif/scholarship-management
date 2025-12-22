import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scholarship, setScholarship] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const DEFAULT_UNIVERSITY_IMG =
    "https://via.placeholder.com/1200x500?text=University+Campus";
  const DEFAULT_USER_IMG =
    "https://via.placeholder.com/50?text=User";

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const resScholar = await fetch(
          `https://my-scholarship-server.vercel.app/scholarships/${id}`
        );
        const scholarshipData = await resScholar.json();
        if (!scholarshipData.success) throw new Error("Not found");

        setScholarship(scholarshipData.scholarship);

        const resReviews = await fetch(
          `https://my-scholarship-server.vercel.app/reviews?scholarshipId=${id}`
        );
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

  if (loading)
    return (
      <div className="flex justify-center mt-24">
        <motion.div
          className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    );

  if (!scholarship)
    return (
      <p className="text-center mt-20 text-red-500 font-semibold">
        Scholarship not found
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ================= HERO IMAGE ================= */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden shadow-2xl mb-12"
      >
        <img
          src={scholarship.universityImage || DEFAULT_UNIVERSITY_IMG}
          alt={scholarship.universityName}
          className="w-full h-[420px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl font-extrabold mb-2">
            {scholarship.scholarshipName}
          </h1>
          <p className="text-lg">
            🎓 {scholarship.universityName}
          </p>
        </div>
      </motion.div>

      {/* ================= DETAILS ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-8 mb-14"
      >
        {/* Left Info */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-8 space-y-4">
          <h2 className="text-2xl font-bold mb-4">
            Scholarship Details
          </h2>

          <p>
            <strong>University:</strong> {scholarship.universityName}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            {scholarship.universityCity},{" "}
            {scholarship.universityCountry}
          </p>
          <p>
            <strong>Category:</strong>{" "}
            <span className="inline-block ml-2 px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700">
              {scholarship.scholarshipCategory}
            </span>
          </p>

          {scholarship.tuitionFees > 0 && (
            <p className="text-green-600 font-semibold">
              💰 Tuition Fee: ${scholarship.tuitionFees}
            </p>
          )}

          {scholarship.applicationFees > 0 && (
            <p className="text-red-500 font-semibold">
              📝 Application Fee: ${scholarship.applicationFees}
            </p>
          )}
        </div>

        {/* Apply Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Ready to Apply?
            </h3>
            <p className="text-blue-100">
              Start your application now and take the next step toward
              your future.
            </p>
          </div>

          <button
            onClick={() =>
              navigate(`/checkout/${scholarship._id}`)
            }
            className="mt-8 py-3 rounded-xl font-semibold bg-white text-blue-600 hover:scale-105 transition"
          >
            Apply for Scholarship →
          </button>
        </div>
      </motion.div>

      {/* ================= REVIEWS ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8">
          ⭐ Student Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">
            No reviews yet.
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white rounded-xl shadow p-6"
              >
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={rev.userPhoto || DEFAULT_USER_IMG}
                    alt={rev.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">
                      {rev.userName}
                    </p>
                    <p className="text-yellow-400">
                      {"⭐".repeat(rev.rating || 0)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ScholarshipDetails;








