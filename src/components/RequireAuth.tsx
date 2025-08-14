import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) {
    const redirect = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/auth?redirect=${redirect}`} replace />;
  }
  return <>{children}</>;
};
