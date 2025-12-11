// src/Navbar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "./AuthContext";
import logo from "./assets/images.jpg";
import defaultAdmin from "./assets/default-admin.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
    setDropdown(false);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropdown(false);
    setOpen(false);
  };

  return (
    <nav className="flex justify-between items-center px-4 md:px-10 py-4 bg-white shadow relative">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2">
        <img src={logo} className="w-[40px] h-[40px]" alt="ScholarStream Logo" />
        <p className="text-blue-600 font-extrabold text-2xl">ScholarStream</p>
      </NavLink>

      {/* Mobile Menu Toggle */}
      <span className="md:hidden cursor-pointer z-50" onClick={() => setOpen(!open)}>
        {open ? <X size={28} /> : <Menu size={28} />}
      </span>

      {/* Mobile Menu */}
      <ul
        className={`md:hidden absolute left-0 w-full bg-blue-700 text-white text-center transition-all duration-500 ${
          open ? "top-[64px]" : "-top-[500px]"
        } py-4 z-40`}
      >
        <li className="py-3 border-b border-blue-300">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
        </li>

        <li className="py-3 border-b border-blue-300">
          <NavLink to="/scholarships" onClick={() => setOpen(false)}>All Scholarships</NavLink>
        </li>

        {!user && (
          <>
            <li className="py-3 border-b border-blue-300">
              <NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink>
            </li>
            <li className="py-3 border-b border-blue-300">
              <NavLink to="/register" onClick={() => setOpen(false)}>Register</NavLink>
            </li>
          </>
        )}

        {user && (
          <>
            <li className="py-3 flex justify-center border-b border-blue-300">
              <img
                src={user.photoURL && user.photoURL.includes("http") ? user.photoURL : defaultAdmin}
                className="w-10 h-10 rounded-full cursor-pointer border"
                onClick={() => setDropdown(!dropdown)}
              />
            </li>
            {dropdown && (
              <div className="flex flex-col bg-blue-600 text-white w-full py-2">
                <button onClick={handleDashboard} className="py-2 hover:bg-blue-500">
                  Dashboard
                </button>
                <button onClick={handleLogout} className="py-2 hover:bg-red-500">
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </ul>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-8 items-center">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-blue-500 font-semibold"
            }
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/scholarships"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-blue-500 font-semibold"
            }
          >
            All Scholarships
          </NavLink>
        </li>

        {!user && (
          <>
            <li>
              <NavLink to="/login">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Login
                </button>
              </NavLink>
            </li>
            <li>
              <NavLink to="/register">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Register
                </button>
              </NavLink>
            </li>
          </>
        )}

        {user && (
          <li className="relative">
            <img
              src={user.photoURL || defaultAdmin}
              className="w-10 h-10 rounded-full cursor-pointer border"
              onClick={() => setDropdown(!dropdown)}
            />

            {dropdown && (
              <ul className="absolute right-0 mt-2 bg-white shadow-lg rounded w-40 text-gray-700 py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleDashboard}
                >
                  Dashboard
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;





