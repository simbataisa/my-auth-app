import React, { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "../components/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, initialized, saveRequestedPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (initialized && !loading && !user) {
      saveRequestedPath();
      navigate("/login", {
        replace: true,
        state: { from: location },
      });
    }
  }, [initialized, loading, user, navigate, location, saveRequestedPath]);

  if (!initialized || loading) {
    return <LoadingSpinner />;
  }

  return user ? <div className="pt-16">{children}</div> : null;
};
