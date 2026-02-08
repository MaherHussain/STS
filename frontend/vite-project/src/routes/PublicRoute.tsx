import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/hooks/useAuth";

export default function PublicRoute() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated && user) {
    return (
      <Navigate to={user.role === "ADMIN" ? "/admin-dashboard" : "/"} replace />
    );
  }

  return <Outlet />;
}
