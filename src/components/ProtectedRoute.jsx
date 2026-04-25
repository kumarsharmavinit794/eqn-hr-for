import { Navigate } from "react-router-dom";
import { getStoredRole, getStoredToken } from "@/lib/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = getStoredToken();
  const role = getStoredRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
