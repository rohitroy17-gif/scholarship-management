// src/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
//checkout
const Checkout = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid scholarship ID");
      setLoading(false);
      return;
    }

    const loadScholarship = async () => {
      try {
        const res = await fetch(`https://my-scholarship-server.vercel.app/scholarships/${id}`);
        const data = await res.json();

        if (!data.success || !data.scholarship) {
          setError("Scholarship not found");
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

    loadScholarship();
  }, [id]);

  const handlePayment = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    setProcessing(true);
    const fee = Number(scholarship.applicationFees) || 0;

    try {
      // ================= FREE SCHOLARSHIP =================
      if (fee <= 0) {
        const appRes = await fetch("https://my-scholarship-server.vercel.app/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scholarshipId: scholarship._id,
            scholarshipName: scholarship.scholarshipName,
            universityName: scholarship.universityName,
            userEmail: user.email,
            userName: user.displayName || user.name,
            amount: 0,
            applicationStatus: "pending",
            paymentStatus: "free",
            createdAt: new Date(),
          }),
        });

        const appData = await appRes.json();
        if (appData?._id) {
          navigate(
            `/dashboard/user/application-details?appId=${appData._id}`
          );
        } else {
          alert("Failed to submit application");
        }

        return;
      }

      // ================= PAID SCHOLARSHIP =================
      // 1️⃣ Create application
      const appRes = await fetch("https://my-scholarship-server.vercel.app/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarshipId: scholarship._id,
          scholarshipName: scholarship.scholarshipName,
          universityName: scholarship.universityName,
          userEmail: user.email,
          userName: user.displayName || user.name,
          amount: fee,
          applicationStatus: "pending",
          paymentStatus: "unpaid",
          createdAt: new Date(),
        }),
      });

      const appData = await appRes.json();
      if (!appData?._id) {
        alert("Failed to create application");
        return;
      }

      // 2️⃣ Create Stripe session
      const sessionRes = await fetch(
        "https://my-scholarship-server.vercel.app/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicationId: appData._id,
            amount: fee * 100, // cents
          }),
        }
      );

      const session = await sessionRes.json();
      if (!session?.url) {
        alert("Failed to create payment session");
        return;
      }

      // 3️⃣ Redirect to Stripe
      window.location.href = session.url;
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-red-500 font-semibold">
        {error}
      </p>
    );

  if (!scholarship) return null;

  const fee = Number(scholarship.applicationFees) || 0;

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-blue-100 mt-1">
            Review your scholarship application
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm">Scholarship</p>
              <p className="font-semibold text-lg">
                {scholarship.scholarshipName}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">University</p>
              <p className="font-semibold text-lg">
                {scholarship.universityName}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Applicant</p>
              <p className="font-semibold">
                {user.displayName || user.name}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
          </div>

          {/* Fee Card */}
          <div className="border rounded-xl p-6 flex justify-between items-center bg-gray-50">
            <div>
              <p className="text-gray-600">Application Fee</p>
              <p className="text-2xl font-bold">
                ${fee}
                {fee <= 0 && (
                  <span className="text-green-600 text-sm ml-2">
                    (Free)
                  </span>
                )}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                fee > 0
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {fee > 0 ? "Payment Required" : "No Payment Needed"}
            </span>
          </div>

          {/* Action */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
              processing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {processing
              ? "Processing..."
              : fee > 0
              ? "Proceed to Payment"
              : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;




