import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "@/app/contexts/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("customer" | "staff" | "admin")[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, modalOpen, openModal } = useApp();
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!user) {
      openModal("login");
      setAttempted(true);
    }
  }, [user]);

  if (!user) {
    // Dismissed the login modal without signing in -- bounce home instead of
    // leaving a blank protected page behind it.
    if (attempted && !modalOpen) return <Navigate to="/" replace />;
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
