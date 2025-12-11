import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const AllScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const navigate = useNavigate();

  // Fetch scholarships from backend
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await fetch("http://localhost:3000/scholarships");
        if (!res.ok) throw new Error("Failed to fetch scholarships");
        const data = await res.json();
        setScholarships(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // Filter + Search
  const filteredScholarships = scholarships.filter((s) => {
    const matchesSearch =
      (s.scholarshipName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.universityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.degree?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filterCategory ? s.scholarshipCategory === filterCategory : true;
    const matchesSubject = filterSubject ? s.subjectCategory === filterSubject : true;
    const matchesLocation = filterLocation
      ? s.universityCity === filterLocation || s.universityCountry === filterLocation
      : true;

    return matchesSearch && matchesCategory && matchesSubject && matchesLocation;
  });

  if (loading) return <p className="text-center mt-10">Loading scholarships...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">All Scholarships</h1>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by Scholarship, University, or Degree"
          className="border p-2 rounded flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Full fund">Full fund</option>
          <option value="Partial fund">Partial fund</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
        >
          <option value="">All Subjects</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Business">Business</option>
          <option value="Engineering">Engineering</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Canada">Canada</option>
        </select>
      </div>

      {/* Scholarships Grid */}
      {filteredScholarships.length === 0 ? (
        <p className="text-center mt-6 text-gray-500">No scholarships found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((sch) => (
            <div
              key={sch._id}
              className="border rounded shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={sch.universityImage || "/default-university.png"}
                alt={sch.universityName}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold">{sch.universityName}</h2>
              <p className="text-gray-600">{sch.scholarshipCategory || "N/A"}</p>
              <p className="text-gray-600">
                {sch.universityCity || "Unknown"}, {sch.universityCountry || "Unknown"}
              </p>

              {/* Tuition Fees */}
              {sch.tuitionFees > 0 && (
                <p className="text-green-600 font-semibold">Tuition Fees: ${sch.tuitionFees}</p>
              )}

              {/* Application Fees */}
              {sch.applicationFees > 0 && (
                <p className="text-red-500 font-semibold">Application Fees: ${sch.applicationFees}</p>
              )}

              <button
                className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => navigate(`/scholarship/${sch._id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllScholarships;


