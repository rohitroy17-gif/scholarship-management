import React, { useEffect, useState } from "react";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    fetch("https://my-scholarship-server.vercel.app/applications")
      .then(res => res.json())
      .then(setApplications)
      .catch(console.error);
  }, []);

  // Update status (processing / completed / rejected)
  const updateStatus = async (id, newStatus) => {
    const res = await fetch(`https://my-scholarship-server.vercel.app/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationStatus: newStatus }),
    });

    if (res.ok) {
      setApplications(applications.map(app =>
        app.id === id ? { ...app, applicationStatus: newStatus } : app
      ));
    }
  };

  // Save feedback
  const saveFeedback = async (id) => {
    const res = await fetch(`https://my-scholarship-server.vercel.app/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback: feedbackText }),
    });

    if (res.ok) {
      setApplications(applications.map(app =>
        app.id === id ? { ...app, feedback: feedbackText } : app
      ));
      setSelected(null);
      setFeedbackText("");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Applied Applications</h2>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Applicant Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">University</th>
              <th className="p-2 border">Feedback</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Payment</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td className="p-2 border">{app.applicantName}</td>
                <td className="p-2 border">{app.applicantEmail}</td>
                <td className="p-2 border">{app.universityName}</td>
                <td className="p-2 border text-sm">{app.feedback || "—"}</td>

                <td className="p-2 border">{app.applicationStatus}</td>
                <td className="p-2 border">{app.paymentStatus}</td>

                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => setSelected(app)}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => setSelected({ ...app, mode: "feedback" })}
                    className="px-2 py-1 bg-green-600 text-white rounded"
                  >
                    Feedback
                  </button>

                  <select
                    className="border p-1"
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    defaultValue={app.applicationStatus}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    onClick={() => updateStatus(app.id, "rejected")}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAILS MODAL */}
      {selected && !selected.mode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-3">Application Details</h3>

            <p><strong>Name:</strong> {selected.applicantName}</p>
            <p><strong>Email:</strong> {selected.applicantEmail}</p>
            <p><strong>University:</strong> {selected.universityName}</p>
            <p><strong>Status:</strong> {selected.applicationStatus}</p>
            <p><strong>Payment:</strong> {selected.paymentStatus}</p>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 px-4 py-1 bg-gray-700 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {selected?.mode === "feedback" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-3">Write Feedback</h3>

            <textarea
              className="w-full border p-2 h-28"
              placeholder="Write feedback..."
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => saveFeedback(selected.id)}
                className="px-4 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
