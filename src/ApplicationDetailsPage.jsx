import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const paymentColors = {
  unpaid: "bg-red-100 text-red-700",
  paid: "bg-green-100 text-green-700",
  free: "bg-blue-100 text-blue-700",
};

const ApplicationDetailsPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const appId = queryParams.get("appId");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        let url;
        if (appId) {
          url = `https://my-scholarship-server.vercel.app/applications/${appId}`;
        } else {
          url = `https://my-scholarship-server.vercel.app/applications?userEmail=${encodeURIComponent(
            user.email
          )}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (!appId) {
          if (Array.isArray(data) && data.length > 0) {
            setApplication(data[data.length - 1]); // latest application
          }
        } else {
          setApplication(data);
        }
      } catch (err) {
        console.error("Failed to fetch application:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchApplication();
  }, [appId, user]);

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!application)
    return (
      <p className="text-center mt-10 text-gray-500">
        No application data found.
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Application Details</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-semibold">Scholarship:</span>
          <span>{application.scholarshipName}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">University:</span>
          <span>{application.universityName}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Amount:</span>
          <span>${application.amount}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Application Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              statusColors[application.applicationStatus] ||
              "bg-gray-100 text-gray-700"
            }`}
          >
            {application.applicationStatus.toUpperCase()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Payment Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              paymentColors[application.paymentStatus] ||
              "bg-gray-100 text-gray-700"
            }`}
          >
            {application.paymentStatus.toUpperCase()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Date:</span>
          <span>{new Date(application.date).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;




