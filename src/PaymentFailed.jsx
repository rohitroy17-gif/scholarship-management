import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const PaymentFailed = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(`https://my-scholarship-server.vercel.app/applications/${id}`);
      const data = await res.json();
      setApplication(data);
    };
    loadData();
  }, [id]);

  if (!application) return <p>Loading...</p>;

  return (
    <div className="text-center mt-20">
      <h1 className="text-red-600 text-4xl font-bold">Payment Failed ❌</h1>

      <p className="mt-4 text-xl">{application.scholarshipName}</p>
      <p className="text-gray-500">Please try again.</p>

      <Link
        to="/dashboard/user/applications"
        className="mt-6 inline-block bg-gray-700 text-white px-6 py-3 rounded"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default PaymentFailed;
