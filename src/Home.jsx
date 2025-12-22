import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import ContactForm from "./ContactForm";
//homepage
const HomePage = () => {
  const [scholarships, setScholarships] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://my-scholarship-server.vercel.app/scholarships")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => (a.applicationFees || 0) - (b.applicationFees || 0)
        );
        setScholarships(sorted.slice(0, 6));
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ================= HERO ================= */}
        <section className="relative mt-20 mb-24 rounded-3xl bg-gradient-to-br from-indigo-700 via-blue-700 to-purple-700 text-white overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),transparent_60%)]" />

          <div className="relative z-10 text-center py-24 px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
                Your Future
              </span>{" "}
              Starts With a Scholarship
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-blue-100 mb-10">
              Discover top universities worldwide and unlock opportunities
              that shape your academic journey.
            </p>

            <NavLink to="/scholarships">
              <button className="px-10 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 text-gray-900 font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition">
                Explore Scholarships
              </button>
            </NavLink>
          </div>
        </section>

        {/* ================= FEATURED SCHOLARSHIPS ================= */}
        <section className="mb-24 bg-white rounded-3xl py-16 px-6 shadow-sm">
          <h2 className="text-4xl font-extrabold text-center mb-14">
            Featured Scholarships
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {scholarships.map((sch) => (
              <div
                key={sch._id}
                className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:-translate-y-3 hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={sch.universityImage || "/default-university.png"}
                    alt={sch.universityName}
                    className="h-52 w-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-tr from-white/0 via-white/30 to-white/0" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {sch.universityName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {sch.universityCity}, {sch.universityCountry}
                  </p>

                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                    {sch.scholarshipCategory}
                  </span>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700">
                      Tuition: ${sch.tuitionFees || 0}
                    </span>

                    {sch.applicationFees > 0 && (
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-600">
                        App Fee: ${sch.applicationFees}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/scholarship/${sch._id}`)}
                    className="w-full mt-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 transition"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SUCCESS STORIES ================= */}
        <section className="mb-24 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-16">
          <h2 className="text-4xl font-extrabold text-center mb-14">
            Student Success Stories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                name: "Jane Doe",
                text: "This scholarship completely changed my life and career path.",
              },
              {
                name: "John Smith",
                text: "I studied abroad without financial stress. Incredible experience.",
              },
              {
                name: "Clark Adams",
                text: "The platform made finding scholarships simple and fast.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
              >
                <p className="text-gray-700 italic leading-relaxed">
                  “{item.text}”
                </p>
                <div className="mt-6 font-bold text-indigo-600">
                  — {item.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section className="mb-10 rounded-3xl bg-gradient-to-r from-sky-50 to-indigo-100 p-16 shadow-inner">
          <h2 className="text-4xl font-extrabold text-center mb-10">
            Get in Touch
          </h2>
          <ContactForm />
        </section>

      </div>
    </div>
  );
};

export default HomePage;






