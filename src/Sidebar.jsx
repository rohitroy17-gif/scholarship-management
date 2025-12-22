import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Sidebar = ({ role }) => {
  const { user, logout } = useAuth();

  const DEFAULT_AVATAR =
    "https://i.ibb.co/2K2QLw5/default-university.png";

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
     ${
       isActive
         ? "bg-blue-600 text-white shadow"
         : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
     }`;

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      {/* ===== USER INFO ===== */}
      <div className="p-6 border-b text-center">
        <img
          src={user?.photoURL || DEFAULT_AVATAR}
          alt="User"
          className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border"
        />

        <h3 className="font-semibold text-gray-800">
          {user?.displayName || user?.name || "User"}
        </h3>

        <p className="text-xs text-gray-500 break-all">{user?.email}</p>

        <span
          className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-semibold
            ${
              role === "admin"
                ? "bg-red-100 text-red-600"
                : role === "moderator"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-600"
            }`}
        >
          {role?.toUpperCase()}
        </span>
      </div>

      {/* ===== NAV LINKS ===== */}
      <nav className="p-4 space-y-1 flex-1">
        <NavLink to="/dashboard/profile" className={linkClass}>
          👤 My Profile
        </NavLink>

        {/* ===== ADMIN ===== */}
        {role === "admin" && (
          <>
            <NavLink to="/dashboard/add-scholarship" className={linkClass}>
              ➕ Add Scholarship
            </NavLink>
            <NavLink to="/dashboard/manage-scholarships" className={linkClass}>
              📚 Manage Scholarships
            </NavLink>
            <NavLink to="/dashboard/manage-users" className={linkClass}>
              👥 Manage Users
            </NavLink>
            <NavLink to="/dashboard/analytics" className={linkClass}>
              📊 Analytics
            </NavLink>
          </>
        )}

        {/* ===== MODERATOR ===== */}
        {role === "moderator" && (
          <>
            <NavLink
              to="/dashboard/moderator/applications"
              className={linkClass}
            >
              📝 Review Applications
            </NavLink>
            <NavLink to="/dashboard/moderator/reviews" className={linkClass}>
              ⭐ All Reviews
            </NavLink>
          </>
        )}

        {/* ===== USER ===== */}
        {role === "user" && (
          <>
            <NavLink
              to="/dashboard/user/application-details"
              className={linkClass}
            >
              📄 Application Details
            </NavLink>
            <NavLink to="/dashboard/user/add-reviews" className={linkClass}>
              ✍️ Add Review
            </NavLink>
            <NavLink to="/dashboard/user/edit-reviews" className={linkClass}>
              ✏️ Edit Review
            </NavLink>
          </>
        )}
      </nav>

      {/* ===== LOGOUT ===== */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                     text-red-600 font-semibold hover:bg-red-50 transition"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;




