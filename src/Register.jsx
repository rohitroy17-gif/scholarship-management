// src/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext"; // ✅ Correct hook

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState(""); // New photo URL field
  const [password, setPassword] = useState(""); // New password field
  const navigate = useNavigate();

  const { login } = useAuth(); // Use login from AuthContext

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Create a new user object
      const newUser = {
        id: Date.now().toString(), // Unique ID
        name,
        email,
        password, // Store password for demo (not secure for production)
        role: "user", // Default role
        photoURL: photoURL || "https://i.ibb.co/album/default-user.png", // Fallback image
      };

      login(newUser); // Log in immediately after registration
      toast.success("Registered successfully!");
      navigate("/dashboard"); // Redirect after registration
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Photo URL (optional)"
          className="border p-2 rounded"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

