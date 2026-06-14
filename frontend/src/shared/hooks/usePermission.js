/**
 * usePermission Hook - For granular permission checking in components
 * Makes it easy to show/hide UI elements based on permissions
 */

import { useSelector } from "react-redux";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
} from "../utils/rbacUtils";

/**
 * usePermission - Hook for permission-based UI rendering
 * @returns {object} - Permission checking methods
 *
 * Usage:
 * const { can, canAny, canAll } = usePermission();
 *
 * {can('view:students') && <StudentList />}
 * {canAny(['edit:grades', 'edit:attendance']) && <EditButton />}
 * {canAll(['view:students', 'edit:grades']) && <FullAccess />}
 */
export const usePermission = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return {
      can: () => false,
      canAny: () => false,
      canAll: () => false,
      permissions: [],
    };
  }

  return {
    /**
     * Check if user has specific permission
     */
    can: (permission) => hasPermission(user.role, permission),

    /**
     * Check if user has any of the specified permissions
     */
    canAny: (permissions) => hasAnyPermission(user.role, permissions),

    /**
     * Check if user has all specified permissions
     */
    canAll: (permissions) => hasAllPermissions(user.role, permissions),

    /**
     * Get all permissions for user's role
     */
    permissions: getRolePermissions(user.role),

    /**
     * Get user's role
     */
    role: user.role,
  };
};
