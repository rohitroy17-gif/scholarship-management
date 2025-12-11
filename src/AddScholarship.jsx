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
    postedUserEmail: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add");
      toast.success("Scholarship added");
      // clear
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
        postedUserEmail: ""
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Scholarship</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
        <input name="scholarshipName" value={form.scholarshipName} onChange={handleChange} placeholder="Scholarship Name" required className="p-2 border rounded" />
        <input name="universityName" value={form.universityName} onChange={handleChange} placeholder="University Name" required className="p-2 border rounded" />
        <input name="universityImage" value={form.universityImage} onChange={handleChange} placeholder="Image URL" className="p-2 border rounded" />
        <input name="universityCountry" value={form.universityCountry} onChange={handleChange} placeholder="Country" className="p-2 border rounded" />
        <input name="universityCity" value={form.universityCity} onChange={handleChange} placeholder="City" className="p-2 border rounded" />
        <input name="universityWorldRank" value={form.universityWorldRank} onChange={handleChange} placeholder="World Rank" className="p-2 border rounded" />
        <input name="subjectCategory" value={form.subjectCategory} onChange={handleChange} placeholder="Subject Category" className="p-2 border rounded" />
        <input name="scholarshipCategory" value={form.scholarshipCategory} onChange={handleChange} placeholder="Scholarship Category" className="p-2 border rounded" />
        <input name="degree" value={form.degree} onChange={handleChange} placeholder="Degree" className="p-2 border rounded" />
        <input name="tuitionFees" value={form.tuitionFees} onChange={handleChange} placeholder="Tuition Fees" type="number" className="p-2 border rounded" />
        <input name="applicationFees" value={form.applicationFees} onChange={handleChange} placeholder="Application Fees" type="number" className="p-2 border rounded" />
        <input name="serviceCharge" value={form.serviceCharge} onChange={handleChange} placeholder="Service Charge" type="number" className="p-2 border rounded" />
        <input name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange} placeholder="Application Deadline (YYYY-MM-DD)" className="p-2 border rounded" />
        <input name="scholarshipPostDate" value={form.scholarshipPostDate} onChange={handleChange} placeholder="Post Date (YYYY-MM-DD)" className="p-2 border rounded" />
        <input name="postedUserEmail" value={form.postedUserEmail} onChange={handleChange} placeholder="Your email" className="p-2 border rounded" />
        <div className="md:col-span-2 text-right">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Add Scholarship</button>
        </div>
      </form>
    </div>
  );
};

export default AddScholarship;

