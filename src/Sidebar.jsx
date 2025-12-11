import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Sidebar = ({ role }) => {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    "block px-4 py-2 rounded hover:bg-blue-600 hover:text-white " +
    (isActive ? "bg-blue-600 text-white" : "text-blue-700");

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-4 border-b">
        <img src={user?.photoURL} className="w-14 h-14 rounded-full mb-2" />
        <div className="font-semibold">{user?.name}</div>
        <div className="text-sm text-gray-500">{user?.email}</div>
        <div className="mt-2 text-xs text-gray-600">
          Role: {user?.role}
        </div>
      </div>

      <nav className="p-4 space-y-1">
        <NavLink to="/dashboard/profile" className={linkClass}>
          My Profile
        </NavLink>

        {role === "admin" && (
          <>
            <NavLink to="/dashboard/add-scholarship" className={linkClass}>
              Add Scholarship
            </NavLink>
            <NavLink to="/dashboard/manage-scholarships" className={linkClass}>
              Manage Scholarships
            </NavLink>
            <NavLink to="/dashboard/manage-users" className={linkClass}>
              Manage Users
            </NavLink>
            <NavLink to="/dashboard/analytics" className={linkClass}>
              Analytics
            </NavLink>
          </>
        )}

        {role === "moderator" && (
          <>
            <NavLink to="/dashboard/moderator/applications" className={linkClass}>
              Review Applications
            </NavLink>
            <NavLink to="/dashboard/moderator/reviews" className={linkClass}>
              All Reviews
            </NavLink>
          </>
        )}

        {role === "user" && (
          <>
            <NavLink to="/dashboard/user/application-details" className={linkClass}>
              Application Details
            </NavLink>
            <NavLink to="/dashboard/user/add-reviews" className={linkClass}>
              Add Review
            </NavLink>
            <NavLink to="/dashboard/user/edit-reviews" className={linkClass}>
              Edit Review
            </NavLink>
          </>
        )}

        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 mt-4 rounded text-red-600 hover:bg-red-100"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;



