// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";

import { AuthProvider } from "./AuthContext";

import Root from "./Root";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import AllScholarships from "./AllScholarships";
import ScholarshipDetails from "./ScholarshipDetails";

import App, { AdminRoute, ModeratorRoute, UserRoute } from "./App";

import AdminMyProfile from "./AdminMyProfile";
import AddScholarship from "./AddScholarship";
import ManageScholarships from "./ManageScholarships";
import ManageUsers from "./ManageUsers";
import Analytics from "./Analytics";

import ModeratorPanel from "./ModeratorPanel";
import AllReviews from "./AllReviews";

import ApplicationDetailsPage from "./ApplicationDetailsPage";
import AddReviewPage from "./AddReviewPage";
import EditReviewPage from "./EditReviewPage";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "scholarships", element: <AllScholarships /> },
      { path: "scholarship/:id", element: <ScholarshipDetails /> },

      {
        path: "dashboard",
        element: <App />,
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: "profile", element: <AdminMyProfile /> },

          // ADMIN
          {
            path: "add-scholarship",
            element: (
              <AdminRoute>
                <AddScholarship />
              </AdminRoute>
            ),
          },
          {
            path: "manage-scholarships",
            element: (
              <AdminRoute>
                <ManageScholarships />
              </AdminRoute>
            ),
          },
          {
            path: "manage-users",
            element: (
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            ),
          },
          {
            path: "analytics",
            element: (
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            ),
          },

          // MODERATOR
          {
            path: "moderator",
            element: (
              <ModeratorRoute>
                <Outlet />
              </ModeratorRoute>
            ),
            children: [
              { path: "applications", element: <ModeratorPanel /> },
              { path: "reviews", element: <AllReviews /> },
              { index: true, element: <Navigate to="applications" replace /> },
            ],
          },

          // USER ROUTES (FIXED)
          {
            path: "user",
            element: (
              <UserRoute>
                <Outlet />
              </UserRoute>
            ),
            children: [
              { path: "application-details", element: <ApplicationDetailsPage /> },
              { path: "add-reviews", element: <AddReviewPage /> },
              { path: "edit-reviews", element: <EditReviewPage /> },
              { index: true, element: <Navigate to="application-details" replace /> },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
















