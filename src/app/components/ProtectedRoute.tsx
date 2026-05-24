import { Navigate } from "react-router-dom";
import { useApp } from "@/app/contexts/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("customer" | "staff" | "owner")[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, openModal } = useApp();

  if (!user) {
    openModal("login");
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
