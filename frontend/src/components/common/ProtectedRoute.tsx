import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "./Loading";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
