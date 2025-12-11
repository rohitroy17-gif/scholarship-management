// src/EditReviewPage.jsx
import { useLocation } from "react-router-dom";
import EditReviewModal from "./EditReviewModal";

export default function EditReviewPage() {
  const { state } = useLocation();
  const review = state?.review;

  if (!review) return <h2 className="p-10 text-red-500">❌ No review selected</h2>;

  return <EditReviewModal review={review} onClose={() => {}} />;
}
