/**
 * Protected Route Component
 * Handles role-based and permission-based access control for routes
 * Supports multiple authorization strategies
 */

import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { hasRole, hasPermission, isSessionValid } from "../utils/rbacUtils";

/**
 * ProtectedRoute - Guards routes based on authentication and authorization
 *
 * @param {object} props - Component props
 * @param {React.Component} props.element - Component to render if authorized
 * @param {array} props.allowedRoles - Array of roles that can access this route
 * @param {string} props.requiredPermission - Single permission required (optional)
 * @param {array} props.requiredPermissions - Multiple permissions required (optional)
 * @param {string} props.fallbackPath - Path to redirect if not authorized (default: "/")
 * @returns {React.Component} - Element or redirect
 *
 * Usage Examples:
 * 1. Role-based: <ProtectedRoute allowedRoles={["admin"]} element={<AdminDashboard />} />
 * 2. Permission-based: <ProtectedRoute allowedRoles={["teacher", "admin"]} requiredPermission="view:students" element={<Students />} />
 * 3. Multiple permissions: <ProtectedRoute requiredPermissions={["view:grades", "edit:grades"]} element={<Grades />} />
 */
const ProtectedRoute = ({
  element,
  allowedRoles = [],
  requiredPermission = null,
  requiredPermissions = [],
  fallbackPath = "/",
}) => {
  const { user, isAuthenticated, sessionExpiry } = useSelector(
    (state) => state.auth,
  );

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    console.warn("Access denied: User not authenticated");
    return <Navigate to={fallbackPath} replace />;
  }

  // Check session validity
  if (!isSessionValid(sessionExpiry)) {
    console.warn("Access denied: Session expired");
    return <Navigate to={fallbackPath} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !hasRole(user.role, allowedRoles)) {
    console.warn(
      `Access denied: User role '${user.role}' not in allowed roles`,
      allowedRoles,
    );
    return <Navigate to={fallbackPath} replace />;
  }

  // Check single permission
  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    console.warn(
      `Access denied: User lacks permission '${requiredPermission}'`,
    );
    return <Navigate to={fallbackPath} replace />;
  }

  // Check multiple permissions (all required)
  if (
    requiredPermissions.length > 0 &&
    !requiredPermissions.every((perm) => hasPermission(user.role, perm))
  ) {
    console.warn(
      `Access denied: User lacks some required permissions`,
      requiredPermissions,
    );
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authorized
  return element;
};

export default ProtectedRoute;
