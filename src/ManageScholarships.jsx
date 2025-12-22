import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManageScholarships = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://my-scholarship-server.vercel.app/scholarships");
      const data = await res.json();
      setList(data);
    } catch (err) {
      toast.error("Failed to load scholarships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?"))
      return;

    try {
      const res = await fetch(
        `https://my-scholarship-server.vercel.app/scholarships/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");

      toast.success("Scholarship deleted");
      fetchList();
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const handleUpdate = async (id, oldName) => {
    const newName = prompt("Enter new scholarship name:", oldName);
    if (!newName || newName === oldName) return;

    try {
      const res = await fetch(
        `https://my-scholarship-server.vercel.app/scholarships/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scholarshipName: newName }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      toast.success("Scholarship updated");
      fetchList();
    } catch (err) {
      toast.error(err.message || "Failed to update");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading scholarships...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Manage Scholarships
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="p-3">Scholarship Name</th>
                <th className="p-3">University</th>
                <th className="p-3">Category</th>
                <th className="p-3">Application Fee</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {list.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500"
                  >
                    No scholarships found
                  </td>
                </tr>
              )}

              {list.map((s) => (
                <tr
                  key={s._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium text-gray-800">
                    {s.scholarshipName}
                  </td>
                  <td className="p-3 text-gray-600">
                    {s.universityName}
                  </td>
                  <td className="p-3 text-gray-600">
                    {s.scholarshipCategory || "—"}
                  </td>
                  <td className="p-3 text-gray-600">
                    ${s.applicationFees || 0}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdate(s._id, s.scholarshipName)
                      }
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageScholarships;

