import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManageScholarships = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/scholarships");
      const data = await res.json();
      setList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this scholarship?")) return;
    try {
      const res = await fetch(`http://localhost:3000/scholarships/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Deleted");
      fetchList();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error");
    }
  };

  const handleUpdate = (id) => {
    // navigate to edit page or open modal — for brevity open prompt
    const newName = prompt("New scholarship name:");
    if (!newName) return;
    fetch(`http://localhost:3000/scholarships/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scholarshipName: newName })
    })
      .then(res => res.json())
      .then(() => {
        toast.success("Updated");
        fetchList();
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to update");
      });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-4 rounded shadow max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Scholarships</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">University</th>
            <th className="p-2">Category</th>
            <th className="p-2">Fees</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map(s => (
            <tr key={s._id}>
              <td className="p-2">{s.scholarshipName}</td>
              <td className="p-2">{s.universityName}</td>
              <td className="p-2">{s.scholarshipCategory}</td>
              <td className="p-2">${s.applicationFees || 0}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleUpdate(s._id)} className="px-3 py-1 bg-yellow-500 text-white rounded">Update</button>
                <button onClick={() => handleDelete(s._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageScholarships;
