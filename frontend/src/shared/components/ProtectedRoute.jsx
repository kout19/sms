import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { hasRole, hasPermission } from "../utils/rbacUtils";

const ProtectedRoute = ({
  element,
  allowedRoles = [],
  requiredPermission = null,
  requiredPermissions = [],
}) => {
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !hasRole(role || user.role, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    requiredPermission &&
    !hasPermission(role || user.role, requiredPermission)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    requiredPermissions.length > 0 &&
    !requiredPermissions.every((perm) =>
      hasPermission(role || user.role, perm),
    )
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute;
