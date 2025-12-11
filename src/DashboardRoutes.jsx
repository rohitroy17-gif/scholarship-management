// src/routes/DashboardRoutes.jsx
import MyApplications from "../pages/MyApplications";
import MyReviews from "../pages/MyReviews";

const DashboardRoutes = [
  {
    path: "/dashboard/my-applications",
    element: <MyApplications />,
  },
  {
    path: "/dashboard/my-reviews",
    element: <MyReviews />,
  },
];

export default DashboardRoutes;
