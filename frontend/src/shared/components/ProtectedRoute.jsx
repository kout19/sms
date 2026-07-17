import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = role || user?.role;

  if (
    allowedRoles.length > 0 &&
    currentRole !== "super-admin" &&
    !allowedRoles.includes(currentRole)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute;
