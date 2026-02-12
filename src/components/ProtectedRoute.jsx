import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const userRole = (localStorage.getItem("userRole") || "")
  .trim()
  .toLowerCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
