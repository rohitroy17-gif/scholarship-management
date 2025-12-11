// src/AddReviewPage.jsx
import { useLocation } from "react-router-dom";
import AddReviewModal from "./AddReviewModal";

export default function AddReviewPage() {
  const { state } = useLocation();
  const application = state?.application;

  if (!application) return <h2 className="p-10 text-red-500">❌ No application selected</h2>;

  return <AddReviewModal application={application} onClose={() => {}} />;
}
