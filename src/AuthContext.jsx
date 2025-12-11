// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import defaultAdmin from "./assets/default-admin.png";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbUsers, setDbUsers] = useState([]);

  // ------------------- LOAD USERS & LOCAL STORAGE -------------------
  useEffect(() => {
    // Load users from db.json (frontend JSON)
    fetch("/db.json")
      .then((res) => res.json())
      .then((data) => setDbUsers(data.users || []))
      .catch(console.error);

    // Check localStorage for logged-in user
    const stored = localStorage.getItem("scholar_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (!parsed.photoURL) parsed.photoURL = defaultAdmin;
      setUser(parsed);
    }
    setLoading(false);
  }, []);

  // ------------------- LOGIN (EMAIL/PASSWORD) -------------------
  const login = (email, password) => {
    // If email/password passed, check db.json
    if (email && password) {
      const matched = dbUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!matched) throw new Error("Invalid email or password");

      if (!matched.photoURL) matched.photoURL = defaultAdmin;
      setUser(matched);
      localStorage.setItem("scholar_user", JSON.stringify(matched));
      return matched;
    }
    // Otherwise, login can accept a full user object (for Google login)
    if (typeof email === "object" && email !== null) {
      const userObj = email;
      if (!userObj.photoURL) userObj.photoURL = defaultAdmin;
      setUser(userObj);
      localStorage.setItem("scholar_user", JSON.stringify(userObj));
      return userObj;
    }

    throw new Error("Login failed");
  };

  // ------------------- LOGOUT -------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("scholar_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ------------------- CUSTOM HOOK -------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
};








