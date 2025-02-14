import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React from "react";
import { Loading } from "@carbon/react";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading active description="loading"/>; // Show loading state while checking auth

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
