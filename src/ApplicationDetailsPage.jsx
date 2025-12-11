// src/ApplicationDetailsPage.jsx
import { useLocation } from "react-router-dom";
import ApplicationDetailsModal from "./ApplicationDetailsModal";

export default function ApplicationDetailsPage() {
  const { state } = useLocation();
  const app = state?.app;

  if (!app) return <h2 className="p-10 text-red-500">❌ No application data</h2>;

  return <ApplicationDetailsModal app={app} onClose={() => {}} />;
}
