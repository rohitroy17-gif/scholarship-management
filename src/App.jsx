// src/App.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import DashboardLayout from "./DashboardLayout";

/* --------------------------------------------------------
   PRIVATE ROUTE — Only logged-in users can access dashboard
-------------------------------------------------------- */
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

/* --------------------------------------------------------
   ADMIN ONLY ROUTE 
-------------------------------------------------------- */
export const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard/profile" replace />;
  }

  return children;
};

/* --------------------------------------------------------
   MODERATOR ONLY ROUTE 
-------------------------------------------------------- */
export const ModeratorRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== "moderator") {
    return <Navigate to="/dashboard/profile" replace />;
  }

  return children;
};

export const UserRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== "user") {
    return <Navigate to="/dashboard/profile" replace />;
  }

  return children;
};

/* --------------------------------------------------------
   MAIN APP — Protect entire dashboard with PrivateRoute
-------------------------------------------------------- */
const App = () => {
  return (
    <PrivateRoute>
      {/* DashboardLayout should include <Outlet /> for nested routes */}
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </PrivateRoute>
  );
};

export default App;











