// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("accessToken");

  // Not logged in
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Get stored user
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  // If no user data exists, force login again
  if (!user) {
    localStorage.removeItem("accessToken");
    return <Navigate to="/signin" replace />;
  }

  // Role-based access check
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
