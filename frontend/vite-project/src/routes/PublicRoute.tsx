import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/hooks/useAuth";
import { LoadingScreen } from "../ui-components";

export default function PublicRoute() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated && user) {
    return (
      <Navigate to={user.role === "ADMIN" ? "/admin-dashboard" : "/"} replace />
    );
  }

  return <Outlet />;
}
