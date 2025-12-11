import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router";
import ContactForm from "./ContactForm"; // Make sure this path is correct

const HomePage = () => {
  const [scholarships, setScholarships] = useState([]);
  const navigate = useNavigate();

  // Fetch top scholarships
  useEffect(() => {
    fetch("http://localhost:3000/scholarships")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.applicationFees - b.applicationFees);
        setScholarships(sorted.slice(0, 6));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Hero Banner */}
      <motion.section
        className="bg-blue-600 text-white rounded-lg p-10 mb-12 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Scholarship</h1>
        <p className="mb-6 text-lg">
          Explore scholarships worldwide to fund your studies and achieve your dreams.
        </p>
        <NavLink to="/scholarships"><button
          onClick={() => navigate("/all-scholarships")}
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition"
        >
          Search Scholarship
        </button></NavLink>
      </motion.section>

      {/* Top Scholarships */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Top Scholarships</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((sch) => (
            <motion.div
              key={sch._id}
              className="border rounded shadow hover:shadow-lg p-4 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img
                src={sch.universityImage || "/default-university.png"}
                alt={sch.universityName}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold">{sch.universityName}</h3>
              <p className="text-gray-600">{sch.scholarshipCategory}</p>
              <p className="text-gray-600">{sch.universityCity}, {sch.universityCountry}</p>
              <p className="text-gray-600 font-semibold">Tuition Fees: ${sch.tuitionFees}</p>
              {sch.applicationFees > 0 && (
                <p className="text-red-500 font-semibold">Application Fees: ${sch.applicationFees}</p>
              )}
              <button
                className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => navigate(`/scholarship/${sch._id}`)}
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Success Stories / Testimonials */}
      <section className="mb-12 p-6 bg-gray-100 rounded">
        <h2 className="text-3xl font-bold mb-6 text-center">Success Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Jane Doe", "John Smith", "Clark Adams"].map((name, idx) => (
            <motion.div
              key={idx}
              className="border p-4 rounded shadow"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-gray-700">
                {idx === 0 && `"Thanks to the Global Excellence Scholarship, I completed my Masters at Harvard!"`}
                {idx === 1 && `"This scholarship helped me achieve my dream in Computer Science."`}
                {idx === 2 && `"These scholarships open doors to world-class education and life-changing opportunities."`}
              </p>
              <p className="mt-2 font-semibold">— {name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Us */}
      <section className="mb-12 p-6 bg-blue-50 rounded">
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
        <ContactForm />
      </section>
    </div>
  );
};

export default HomePage;



