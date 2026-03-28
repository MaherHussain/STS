import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/hooks/useAuth";
import { LoadingSpinner } from "../ui-components";

type Props = {
  allowedRoles?: Array<"ADMIN" | "EMPLOYEE">;
};
export default function ProtectedRoute({ allowedRoles }: Props) {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><LoadingSpinner size={80} /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
if (allowedRoles && user && !allowedRoles.includes(user.role)) {
  return <Navigate to="/unauthorized" replace />;
}
  return <Outlet />;
}