// ManageUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext"; // ✅ adjust path

const ManageUsers = () => {
  const { user, loading: authLoading } = useAuth(); // Firebase user
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // Helper: get token safely
  const getToken = async () => {
    if (!user) throw new Error("User not authenticated");
    return await user.getIdToken();
  };

  // Fetch users from server
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await axios.get("https://my-scholarship-server.vercel.app/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Change user role
  const changeRole = async (id, role) => {
    try {
      const token = await getToken();

      const res = await axios.patch(
        `https://my-scholarship-server.vercel.app/users/${id}`,
        { role },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Role updated successfully!");
        fetchUsers(); // refresh
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      const token = await getToken();

      const res = await axios.delete(`https://my-scholarship-server.vercel.app/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(res.data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  // Only fetch after auth is ready
  useEffect(() => {
    if (!authLoading && user) {
      fetchUsers();
    }
  }, [authLoading, user]);

  const filteredUsers = filter ? users.filter((u) => u.role === filter) : users;

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <label className="font-medium">Filter by role:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All</option>
          <option value="student">Student</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users table */}
      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{u.name}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">{u.role}</td>
                  <td className="p-2 border flex flex-wrap gap-2">
                    {u.role !== "moderator" && (
                      <button
                        onClick={() => changeRole(u._id, "moderator")}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Promote to Moderator
                      </button>
                    )}
                    {u.role !== "admin" && (
                      <button
                        onClick={() => changeRole(u._id, "admin")}
                        className="bg-indigo-600 text-white px-3 py-1 rounded"
                      >
                        Promote to Admin
                      </button>
                    )}
                    {u.role !== "student" && (
                      <button
                        onClick={() => changeRole(u._id, "student")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Demote to Student
                      </button>
                    )}
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default ManageUsers;











