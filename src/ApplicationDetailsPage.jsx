// src/ApplicationDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ApplicationDetailsPage = () => {
  const location = useLocation();
  const { user } = useAuth(); // get logged-in user
  const [application, setApplication] = useState(null);

  // Get appId from query string
  const queryParams = new URLSearchParams(location.search);
  const appId = queryParams.get("appId");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        let url;
        if (appId) {
          // Fetch by appId if present
          url = `http://localhost:3000/applications/${appId}`;
        } else {
          // Fetch latest application for current user
          url = `http://localhost:3000/applications?userEmail=${encodeURIComponent(user.email)}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (!appId) {
          // If fetching by userEmail, get the latest application
          if (Array.isArray(data) && data.length > 0) {
            setApplication(data[data.length - 1]); // latest application
          }
        } else {
          setApplication(data);
        }
      } catch (err) {
        console.error("Failed to fetch application:", err);
      }
    };

    if (user?.email) {
      fetchApplication();
    }
  }, [appId, user]);

  if (!application) return <p>No application data found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Application Details</h2>
      <p><b>Scholarship:</b> {application.scholarshipName}</p>
      <p><b>University:</b> {application.universityName}</p>
      <p><b>Amount:</b> ${application.amount}</p>
      <p><b>Status:</b> {application.applicationStatus}</p>
      <p><b>Payment Status:</b> {application.paymentStatus}</p>
      <p><b>Date:</b> {new Date(application.date).toLocaleString()}</p>
    </div>
  );
};

export default ApplicationDetailsPage;



