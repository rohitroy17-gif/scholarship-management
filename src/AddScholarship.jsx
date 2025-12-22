import React, { useState } from "react";
import { toast } from "react-toastify";

const AddScholarship = () => {
  const [form, setForm] = useState({
    scholarshipName: "",
    universityName: "",
    universityImage: "",
    universityCountry: "",
    universityCity: "",
    universityWorldRank: "",
    subjectCategory: "",
    scholarshipCategory: "",
    degree: "",
    tuitionFees: "",
    applicationFees: "",
    serviceCharge: "",
    applicationDeadline: "",
    scholarshipPostDate: "",
    postedUserEmail: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://my-scholarship-server.vercel.app/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add scholarship");

      toast.success("Scholarship added successfully");

      setForm({
        scholarshipName: "",
        universityName: "",
        universityImage: "",
        universityCountry: "",
        universityCity: "",
        universityWorldRank: "",
        subjectCategory: "",
        scholarshipCategory: "",
        degree: "",
        tuitionFees: "",
        applicationFees: "",
        serviceCharge: "",
        applicationDeadline: "",
        scholarshipPostDate: "",
        postedUserEmail: "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to add scholarship");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Add Scholarship
        </h2>
        <p className="text-gray-500 mb-6">
          Provide accurate scholarship and university information
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            ["scholarshipName", "Scholarship Name"],
            ["universityName", "University Name"],
            ["universityImage", "University Image URL"],
            ["universityCountry", "Country"],
            ["universityCity", "City"],
            ["universityWorldRank", "World Rank"],
            ["subjectCategory", "Subject Category"],
            ["scholarshipCategory", "Scholarship Category"],
            ["degree", "Degree"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {label}
              </label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required={name === "scholarshipName" || name === "universityName"}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tuition Fees
            </label>
            <input
              type="number"
              name="tuitionFees"
              value={form.tuitionFees}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Application Fees
            </label>
            <input
              type="number"
              name="applicationFees"
              value={form.applicationFees}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Service Charge
            </label>
            <input
              type="number"
              name="serviceCharge"
              value={form.serviceCharge}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              name="applicationDeadline"
              value={form.applicationDeadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Post Date
            </label>
            <input
              type="date"
              name="scholarshipPostDate"
              value={form.scholarshipPostDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Posted User Email
            </label>
            <input
              type="email"
              name="postedUserEmail"
              value={form.postedUserEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Add Scholarship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScholarship;



