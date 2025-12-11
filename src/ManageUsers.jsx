import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState(""); // user/moderator/admin

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const url = filter
        ? `http://localhost:3000/users?role=${filter}`
        : "http://localhost:3000/users";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  // Change user role (promote/demote)
  const changeRole = async (id, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user to ${newRole}?`)) return;
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error updating role");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error deleting user");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-6xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="flex items-center gap-3 mb-4">
        <label className="font-semibold">Filter by role:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2 capitalize">{user.role}</td>
                <td className="border p-2 space-x-2">
                  {/* Role actions */}
                  {user.role === "user" && (
                    <>
                      <button
                        onClick={() => changeRole(user._id, "moderator")}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Promote to Moderator
                      </button>
                      <button
                        onClick={() => changeRole(user._id, "admin")}
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Promote to Admin
                      </button>
                    </>
                  )}
                  {user.role === "moderator" && (
                    <>
                      <button
                        onClick={() => changeRole(user._id, "user")}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Demote to User
                      </button>
                      <button
                        onClick={() => changeRole(user._id, "admin")}
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Promote to Admin
                      </button>
                    </>
                  )}
                  {user.role === "admin" && (
                    <>
                      <button
                        onClick={() => changeRole(user._id, "moderator")}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Demote to Moderator
                      </button>
                      <button
                        onClick={() => changeRole(user._id, "user")}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Demote to User
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;


