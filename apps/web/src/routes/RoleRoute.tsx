import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/auth";

type RoleRouteProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
};

const getDashboardPath = (role: UserRole) => {
  switch (role) {
    case "STAFF":
      return "/staff/dashboard";

    case "MANAGER":
      return "/manager/dashboard";

    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin/dashboard";

    case "STUDENT":
    default:
      return "/dashboard";
  }
};

export const RoleRoute = ({ allowedRoles, children }: RoleRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};
