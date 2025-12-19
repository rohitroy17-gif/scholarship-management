// src/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Checkout = () => {
  const { id } = useParams(); // scholarship ID
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid scholarship ID");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/scholarships/${id}`);
        const data = await res.json();
        if (!data.success || !data.scholarship) {
          setError("Scholarship not found");
          setLoading(false);
          return;
        }
        setScholarship(data.scholarship);
      } catch (err) {
        console.error(err);
        setError("Failed to load scholarship data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!scholarship) return null;

  const handlePayment = async () => {
    try {
      const fee = scholarship.applicationFees || 0;

      if (fee <= 0) {
        alert("This scholarship has no application fee. You can proceed without payment.");
        // Optionally create application without payment and navigate
        const appRes = await fetch("http://localhost:3000/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scholarshipId: scholarship._id,
            scholarshipName: scholarship.scholarshipName,
            universityName: scholarship.universityName,
            userEmail: user.email,
            userName: user.name,
            amount: fee,
            applicationStatus: "pending",
            paymentStatus: "unpaid",
            date: new Date(),
          }),
        });

        const newApp = await appRes.json();
        if (newApp?._id) navigate(`/dashboard/user/application-details?appId=${newApp._id}`);
        return;
      }

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
          amount: fee,
          applicationStatus: "pending",
          paymentStatus: "unpaid",
          date: new Date(),
        }),
      });

      const newApp = await appRes.json();
      if (!newApp?._id) {
        alert("Failed to create application. Please try again.");
        return;
      }

      // 2️⃣ Create Stripe Checkout session
      const sessionRes = await fetch("http://localhost:3000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: newApp._id,
          amount: fee * 100, // convert dollars to cents
        }),
      });

      const session = await sessionRes.json();
      if (!session?.url) {
        alert("Failed to create payment session. Please try again.");
        return;
      }

      // 3️⃣ Redirect to Stripe
      window.location.href = session.url;
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please check console for details.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <p><b>Scholarship:</b> {scholarship.scholarshipName}</p>
      <p><b>University:</b> {scholarship.universityName}</p>
      <p>
        <b>Application Fee:</b> ${scholarship.applicationFees || 0}{" "}
        {(!scholarship.applicationFees || scholarship.applicationFees <= 0) && "(Free)"}
      </p>

      <button
        onClick={handlePayment}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        {scholarship.applicationFees > 0 ? "Pay Now" : "Apply Now"}
      </button>
    </div>
  );
};

export default Checkout;



