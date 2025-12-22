import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const { appId } = useParams();
  const [application, setApplication] = useState(null);

  useEffect(() => {
  if (!appId) return;

  const fetchApp = async () => {
    try {
      const res = await fetch(`https://my-scholarship-server.vercel.app/applications/${appId}`);
      const data = await res.json();
      setApplication(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchApp();
}, [appId]);


  if (!application) return <p>Loading...</p>;

  return (
    <div className="text-center mt-20">
      <h1 className="text-green-600 text-4xl font-bold">Payment Successful 🎉</h1>

      <p className="mt-4 text-xl">{application.scholarshipName}</p>
      <p className="text-gray-500">University: {application.universityName}</p>
      <p className="text-xl font-semibold mt-2">Amount: ${application.amount}</p>

      <Link
        to="/dashboard/user/applications"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded"
      >
        Go to My Applications
      </Link>
    </div>
  );
};

export default PaymentSuccess;
