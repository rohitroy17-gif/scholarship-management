import React from "react";
import { useAuthContext } from "./AuthProvider";
import { useNavigate } from "react-router";

const MyProfile = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  if (!user)
    return (
      <p className="text-center mt-20 text-red-500">
        ⚠️ Please login to see your profile.
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <img
          src={user.photoURL || "/default-profile.png"}
          alt={user.displayName || "Profile"}
          className="w-28 h-28 rounded-full border-2 border-blue-600 object-cover"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold">{user.displayName || "No Name"}</h2>
          <p className="text-gray-600">{user.email}</p>
          {user.role && (
            <span className="mt-2 inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              Role: {user.role}
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition font-semibold"
          onClick={() => navigate("/update-profile")}
        >
          Update Information
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
