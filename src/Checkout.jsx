// src/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Checkout = () => {
  const { id } = useParams(); // scholarship ID
  const { user } = useAuth();

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load scholarship data
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/scholarships/${id}`);
        const data = await res.json();
        setScholarship(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!scholarship) return <p>Scholarship not found!</p>;

  const handlePayment = async () => {
    try {
      // 1️⃣ Create application first
      const appRes = await fetch("http://localhost:3000/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarshipId: scholarship._id,
          scholarshipName: scholarship.scholarshipName,
          universityName: scholarship.universityName,
          userEmail: user.email,
          userName: user.name,
          amount: scholarship.applicationFees,
          applicationStatus: "pending",
          paymentStatus: "unpaid",
          date: new Date(),
        }),
      });

      const newApp = await appRes.json();

      if (!newApp?._id) {
        alert("Application creation failed!");
        return;
      }

      // 2️⃣ Create Stripe Checkout session (Stripe 2025)
      const sessionRes = await fetch("http://localhost:3000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: newApp._id,
          amount: scholarship.applicationFees * 100, // cents
        }),
      });

      const session = await sessionRes.json();

      if (!session?.url) {
        alert("Stripe session failed!");
        return;
      }

      // 3️⃣ Redirect to Stripe hosted page
      // Stripe will redirect to application-details with appId query param
      window.location.href = session.url;

    } catch (err) {
      console.error(err);
      alert("Payment failed, please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <p><b>Scholarship:</b> {scholarship.scholarshipName}</p>
      <p><b>University:</b> {scholarship.universityName}</p>
      <p><b>Application Fee:</b> ${scholarship.applicationFees}</p>

      <button
        onClick={handlePayment}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;


