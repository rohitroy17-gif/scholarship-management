import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

/* ================= ANIMATIONS ================= */
//allscholarship
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const AllScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const navigate = useNavigate();

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch("https://my-scholarship-server.vercel.app/scholarships")
      .then((res) => res.json())
      .then(setScholarships)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ================= FILTER ================= */
  const filteredScholarships = scholarships.filter((s) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      s.scholarshipName?.toLowerCase().includes(search) ||
      s.universityName?.toLowerCase().includes(search) ||
      s.degree?.toLowerCase().includes(search);

    const matchesCategory = filterCategory
      ? s.scholarshipCategory === filterCategory
      : true;

    const matchesSubject = filterSubject
      ? s.subjectCategory === filterSubject
      : true;

    const matchesLocation = filterLocation
      ? s.universityCity === filterLocation ||
        s.universityCountry === filterLocation
      : true;

    return matchesSearch && matchesCategory && matchesSubject && matchesLocation;
  });

  /* ================= LOADER ================= */
  if (loading)
    return (
      <div className="flex justify-center mt-32">
        <motion.div
          className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 py-10 px-4 md:px-6">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-800">
          🎓 Explore Scholarships
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Search, filter and discover scholarships from top universities worldwide.
        </p>
      </motion.div>

      {/* ================= FILTERS ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-14 p-6 rounded-3xl bg-white/80 backdrop-blur-md shadow-lg"
      >
        <input
          type="text"
          placeholder="Search scholarship, university, degree"
          className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border rounded-xl px-4 py-2 shadow-sm"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Full fund">Full Fund</option>
          <option value="Partial fund">Partial Fund</option>
        </select>

        <select
          className="border rounded-xl px-4 py-2 shadow-sm"
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
        >
          <option value="">All Subjects</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Business">Business</option>
          <option value="Engineering">Engineering</option>
        </select>

        <select
          className="border rounded-xl px-4 py-2 shadow-sm"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Canada">Canada</option>
        </select>
      </motion.div>

      {/* ================= CARDS ================= */}
      {filteredScholarships.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No scholarships found.
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {filteredScholarships.map((sch) => (
            <motion.div
              key={sch._id}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.03 }}
              className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-t-3xl">
                <img
                  src={sch.universityImage || "/default-university.png"}
                  alt={sch.universityName}
                  className="h-48 w-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-60 transition" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-bold mb-1 text-gray-800">
                  {sch.universityName}
                </h2>

                <p className="text-sm text-gray-500 mb-2">
                  📍 {sch.universityCity}, {sch.universityCountry}
                </p>

                <span className="inline-block text-xs font-semibold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full w-fit mb-3">
                  {sch.scholarshipCategory}
                </span>

                <div className="space-y-1 mb-4">
                  {sch.tuitionFees > 0 && (
                    <p className="text-green-600 font-medium">
                      💰 Tuition: ${sch.tuitionFees}
                    </p>
                  )}
                  {sch.applicationFees > 0 && (
                    <p className="text-red-500 font-medium">
                      📝 Application: ${sch.applicationFees}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/scholarship/${sch._id}`)}
                  className="mt-auto py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 transition"
                >
                  View Details →
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AllScholarships;





