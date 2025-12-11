import { useState } from "react";
import AddReviewModal from "./AddReviewModal";

function Applications({ apps }) {
  const [selectedApp, setSelectedApp] = useState(null);

  return (
    <>
      {apps.map((app) => (
        <div key={app._id} className="app-card">
          <h3>{app.name}</h3>

          <button onClick={() => setSelectedApp(app)}>
            Add Review
          </button>
        </div>
      ))}

      {selectedApp && (
        <AddReviewModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </>
  );
}

export default Applications;
