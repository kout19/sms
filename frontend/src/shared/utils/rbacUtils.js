/**
 * RBAC Utilities - Role-Based Access Control Helper Functions
 */

export const rolePermissions = {
  "super_admin": {
    displayName: "Super Admin",
    description: "Full platform access",
    permissions: ["all"],
  },

  admin: {
    displayName: "Administrator",
    description: "Full system access",
    permissions: [
      "manage:users",
      "manage:roles",
      "view:all_data",
      "edit:all_data",
      "manage:settings",
      "view:reports",
      "manage:classes",
      "manage:attendance",
    ],
  },

  teacher: {
    displayName: "Teacher",
    description: "Manage classes and student progress",
    permissions: [
      "view:students",
      "edit:grades",
      "view:classes",
      "view:attendance",
      "mark:attendance",
      "view:schedule",
      "view:announcements",
      "post:announcements",
    ],
  },

  student: {
    displayName: "Student",
    description: "View own academic information",
    permissions: [
      "view:own_grades",
      "view:own_attendance",
      "view:own_schedule",
      "view:announcements",
      "view:messages",
    ],
  },

  parent: {
    displayName: "Parent",
    description: "View child's academic information",
    permissions: [
      "view:child_grades",
      "view:child_attendance",
      "view:child_schedule",
      "view:messages",
      "view:announcements",
    ],
  },
};

export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;

  if (userRole === "super_admin" || userRole === "admin") return true;

  const roleConfig = rolePermissions[userRole];
  if (!roleConfig) return false;

  return roleConfig.permissions.includes(permission);
};

export const hasAnyPermission = (userRole, permissions = []) => {
  if (!Array.isArray(permissions)) return false;
  return permissions.some((permission) => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole, permissions = []) => {
  if (!Array.isArray(permissions)) return false;
  return permissions.every((permission) => hasPermission(userRole, permission));
};

export const hasRole = (userRole, allowedRoles = []) => {
  if (!Array.isArray(allowedRoles)) return false;
  return allowedRoles.includes(userRole);
};

export const getRolePermissions = (role) => {
  if (role === "super_admin" || role === "admin") return ["all"];
  const roleConfig = rolePermissions[role];
  return roleConfig ? roleConfig.permissions : [];
};

export const getRoleInfo = (role) => {
  return rolePermissions[role] || { displayName: "Unknown", description: "" };
};

export const isAuthorized = (user, allowedRoles = []) => {
  if (!user || !user.role) return false;
  return hasRole(user.role, allowedRoles);
};

export const getAccessLevel = (userRole) => {
  const accessLevels = {
    "super_admin": "all",
    admin: "all",
    teacher: "own",
    student: "own",
    parent: "own",
  };
  return accessLevels[userRole] || "none";
};

export const canAccessResource = (userRole, resourceOwnerId, userId) => {
  if (userRole === "super_admin" || userRole === "admin") return true;
  if (
    userRole === "student" ||
    userRole === "parent" ||
    userRole === "teacher"
  ) {
    return resourceOwnerId === userId;
  }
  return false;
};
