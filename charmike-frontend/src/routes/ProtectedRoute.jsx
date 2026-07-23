import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const { authenticated, user, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}