import React from "react";
import { useAuth } from "./AuthContext";

const AdminMyProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="flex items-center gap-6">
        <img src={user.photoURL} alt={user.name} className="w-20 h-20 rounded-full" />
        <div>
          <div className="text-xl font-semibold">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="mt-2">Role: <strong>{user.role}</strong></div>
          <div className="text-sm text-gray-400">Member since: {new Date(user.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminMyProfile;
