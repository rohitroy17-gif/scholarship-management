// src/pages/DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router";  // FIXED
import { useAuth } from "./AuthContext";   // FIX PATH if needed
import Sidebar from "./Sidebar"; // FIX PATH if needed

const DashboardLayout = () => {
  const { user, loading } = useAuth();

  // Loading state while Firebase/AuthContext checks login state
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl">
        Loading Dashboard...
      </div>
    );
  }

  // If user is STILL missing after loading → unauthorized
  if (!user) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl text-red-500">
        Access Denied — User Not Logged In
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar with correct user role */}
      <Sidebar role={user.role} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;



