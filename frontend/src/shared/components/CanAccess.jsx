/**
 * CanAccess Component - Conditional Rendering Based on Permissions
 * Provides a declarative way to show/hide UI elements based on permissions
 */

import React from "react";
import {usePermission} from "../hooks/usePermission";

/**
 * CanAccess - Conditionally renders children based on permissions
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {string} props.permission - Single permission to check
 * @param {array} props.permissions - Multiple permissions (all required)
 * @param {array} props.anyPermission - Multiple permissions (any required)
 * @param {React.ReactNode} props.fallback - Content to render if not authorized
 * @returns {React.ReactNode} - Rendered content
 *
 * Usage Examples:
 * 1. Single permission:
 *    <CanAccess permission="view:students">
 *      <StudentList />
 *    </CanAccess>
 *
 * 2. Multiple permissions (all required):
 *    <CanAccess permissions={["view:students", "edit:grades"]}>
 *      <EditStudentGrades />
 *    </CanAccess>
 *
 * 3. Multiple permissions (any required):
 *    <CanAccess anyPermission={["manage:users", "manage:roles"]}>
 *      <ManagementPanel />
 *    </CanAccess>
 *
 * 4. With fallback:
 *    <CanAccess permission="admin:access" fallback={<Unauthorized />}>
 *      <AdminPanel />
 *    </CanAccess>
 */
const CanAccess = ({
  children,
  permission,
  permissions,
  anyPermission,
  fallback = null,
}) => {
  const { can, canAll, canAny } = usePermission();

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = canAll(permissions);
  } else if (anyPermission && anyPermission.length > 0) {
    hasAccess = canAny(anyPermission);
  }

  return hasAccess ? children : fallback;
};

export default CanAccess;
