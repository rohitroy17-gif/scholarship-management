import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState(""); // admin/moderator/student

  const fetchUsers = async () => {
    try {
      const url = filter ? `http://localhost:3000/users?role=${filter}` : "http://localhost:3000/users";
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const changeRole = async (id, newRole) => {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Role updated");
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Error");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete user?")) return;
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Error");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="flex items-center gap-3 mb-4">
        <label>Filter by role:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All</option>
          <option value="student">Student</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2 space-x-2">
                {u.role !== "moderator" && <button onClick={() => changeRole(u._id, "moderator")} className="px-3 py-1 bg-green-500 text-white rounded">Promote to Moderator</button>}
                {u.role !== "admin" && <button onClick={() => changeRole(u._id, "admin")} className="px-3 py-1 bg-indigo-600 text-white rounded">Promote to Admin</button>}
                <button onClick={() => deleteUser(u._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
