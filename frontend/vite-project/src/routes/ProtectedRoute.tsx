import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/hooks/useAuth";
import { LoadingScreen } from "../ui-components";

type Props = {
  allowedRoles?: Array<"ADMIN" | "EMPLOYEE">;
};
export default function ProtectedRoute({ allowedRoles }: Props) {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
if (allowedRoles && user && !allowedRoles.includes(user.role)) {
  return <Navigate to="/unauthorized" replace />;
}
  return <Outlet />;
}