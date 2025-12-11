const AppDetailsModal = ({ application, onClose }) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-[400px] p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Application Details</h2>

        <p><b>University:</b> {application.universityName}</p>
        <p><b>Address:</b> {application.universityAddress}</p>
        <p><b>Subject:</b> {application.subjectCategory}</p>
        <p><b>Fees:</b> {application.applicationFees}</p>
        <p><b>Status:</b> {application.applicationStatus}</p>
        <p><b>Payment:</b> {application.paymentStatus}</p>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AppDetailsModal;


