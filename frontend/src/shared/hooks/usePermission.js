
/**
 * usePermissions - permission-based UI rendering.
 * Takes `user` as a parameter (not pulled from a specific store) so it's
 * decoupled from Redux/Zustand/Context and trivially testable.
 *
 * Usage:
 *   const { can, canAny, canAll, roleInfo } = usePermissions(user);
 *   {can(PERMISSIONS.VIEW_STUDENTS) && <StudentList />}
 *   {canAny([PERMISSIONS.EDIT_GRADES, PERMISSIONS.MARK_ATTENDANCE]) && <EditButton />}
 */
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRoleInfo,
} from "@packages/shared";
import { useAuth } from "../../modules/auth/hooks/useAuth";

export function usePermissions(user) {
  return {
    can: (permission) => hasPermission(user?.role, permission),
    canAny: (permissions) => hasAnyPermission(user?.role, permissions),
    canAll: (permissions) => hasAllPermissions(user?.role, permissions),
    roleInfo: getRoleInfo(user?.role),
    role: user?.role,
  };
}

// Preserve the existing hook API for components that obtain the current user
// from the auth store, while also allowing `usePermissions(user)` to be used
// with an explicitly supplied user.
export function usePermission() {
  const { user } = useAuth();
  return usePermissions(user);
}




// import { useSelector } from "react-redux";
// import {
//   hasPermission,
//   hasAnyPermission,
//   hasAllPermissions,
//   getRolePermissions,
// } from "../utils/rbacUtils";

// /**
//  * usePermission - Hook for permission-based UI rendering
//  * @returns {object} - Permission checking methods
//  *
//  * Usage:
//  * const { can, canAny, canAll } = usePermission();
//  *
//  * {can('view:students') && <StudentList />}
//  * {canAny(['edit:grades', 'edit:attendance']) && <EditButton />}
//  * {canAll(['view:students', 'edit:grades']) && <FullAccess />}
//  */
// export const usePermission = () => {
//   const user = useSelector((state) => state.auth.user);

//   if (!user) {
//     return {
//       can: () => false,
//       canAny: () => false,
//       canAll: () => false,
//       permissions: [],
//     };
//   }

//   return {
//     /**
//      * Check if user has specific permission
//      */
//     can: (permission) => hasPermission(user.role, permission),

//     /**
//      * Check if user has any of the specified permissions
//      */
//     canAny: (permissions) => hasAnyPermission(user.role, permissions),

//     /**
//      * Check if user has all specified permissions
//      */
//     canAll: (permissions) => hasAllPermissions(user.role, permissions),

//     /**
//      * Get all permissions for user's role
//      */
//     permissions: getRolePermissions(user.role),

//     /**
//      * Get user's role
//      */
//     role: user.role,
//   };
// };
