import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import defaultAdmin from "./assets/default-admin.png";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbUsers, setDbUsers] = useState([]);

  // ------------------- LOAD USERS & LOCAL STORAGE -------------------
  useEffect(() => {
    fetch("/db.json")
      .then((res) => res.json())
      .then((data) => setDbUsers(data.users || []))
      .catch(console.error);

    const stored = localStorage.getItem("scholar_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (!parsed.photoURL) parsed.photoURL = defaultAdmin;
      setUser(parsed);
    }
    setLoading(false);
  }, []);

  // ------------------- SYNC USER TO BACKEND -------------------
  const saveUserToBackend = async (userObj) => {
    try {
      await axios.post("http://localhost:3000/register", {
        name: userObj.name || userObj.displayName || "Unknown",
        email: userObj.email,
        photo: userObj.photoURL || defaultAdmin,
      });
    } catch (err) {
      // Duplicate user - ignore
    }
  };

  // ------------------- LOGIN (EMAIL/PASSWORD OR GOOGLE) -------------------
  const login = async (email, password) => {
    let userObj = null;

    // Email/password login
    if (email && password) {
      const matched = dbUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!matched) throw new Error("Invalid email or password");

      if (!matched.photoURL) matched.photoURL = defaultAdmin;

      userObj = matched;
    }
    // Google login (we receive full object)
    else if (typeof email === "object" && email !== null) {
      userObj = email;
      if (!userObj.photoURL) userObj.photoURL = defaultAdmin;
    } else {
      throw new Error("Login failed");
    }

    // Save to state + localStorage
    setUser(userObj);
    localStorage.setItem("scholar_user", JSON.stringify(userObj));

    // ⭐ Sync user to backend database
    await saveUserToBackend(userObj);

    return userObj;
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
};









