// src/components/ApplicationDetailsModal.jsx
const ApplicationDetailsModal = ({ app, onClose }) => {
  if (!app) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Application Details</h2>

        <p><strong>University:</strong> {app.universityName}</p>
        <p><strong>Address:</strong> {app.universityAddress}</p>
        <p><strong>Subject:</strong> {app.subjectCategory}</p>
        <p><strong>Status:</strong> {app.status}</p>
        <p><strong>Fees:</strong> ${app.fees}</p>
        <p><strong>Feedback:</strong> {app.feedback}</p>

        <button
          onClick={onClose}
          className="mt-4 bg-gray-700 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;

