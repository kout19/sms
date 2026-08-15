// packages/shared/permissions/index.js
// Single source of truth for RBAC. Imported by BOTH backend and frontend.
// CommonJS throughout - matches backend's require(). The ESM side
// (index.mjs) is a thin wrapper around this file, not a separate copy -
// see index.mjs before editing that file.

const PERMISSIONS = {
  ALL: "all",

  MANAGE_USERS: "manage:users",
  VIEW_USERS: "view:users",

  VIEW_STUDENTS: "view:students",
  VIEW_CLASSES: "view:classes",
  MANAGE_CLASSES: "manage:classes",
  EDIT_GRADES: "edit:grades",
  VIEW_OWN_GRADES: "view:own_grades",
  VIEW_CHILD_GRADES: "view:child_grades",

  VIEW_ATTENDANCE: "view:attendance",
  MARK_ATTENDANCE: "mark:attendance",
  VIEW_OWN_ATTENDANCE: "view:own_attendance",
  VIEW_CHILD_ATTENDANCE: "view:child_attendance",

  VIEW_SCHEDULE: "view:schedule",
  VIEW_OWN_SCHEDULE: "view:own_schedule",
  VIEW_CHILD_SCHEDULE: "view:child_schedule",

  VIEW_FEES: "view:fees",
  MANAGE_PAYMENTS: "manage:payments",
  VIEW_INVOICES: "view:invoices",
  ISSUE_INVOICES: "issue:invoices",

  MANAGE_TEACHERS: "manage:teachers",
  VIEW_DEPARTMENT_REPORTS: "view:department_reports",

  VIEW_ANNOUNCEMENTS: "view:announcements",
  POST_ANNOUNCEMENTS: "post:announcements",
  VIEW_MESSAGES: "view:messages",

  MANAGE_SCHOOL_SETTINGS: "manage:school_settings",
  VIEW_REPORTS: "view:reports",
};

const rolePermissions = {
  super_admin: {
    displayName: "Super Admin",
    description: "Full platform access across all tenants",
    accessLevel: "platform",
    permissions: [PERMISSIONS.ALL],
  },
  admin: {
    displayName: "School Admin",
    description: "Full access within their school (tenant-scoped)",
    accessLevel: "tenant",
    permissions: [PERMISSIONS.ALL],
  },
  department_head: {
    displayName: "Department Head",
    description: "Manage teachers, classes, and department-level reporting",
    accessLevel: "department",
    permissions: [
      PERMISSIONS.VIEW_STUDENTS,
      PERMISSIONS.VIEW_CLASSES,
      PERMISSIONS.MANAGE_CLASSES,
      PERMISSIONS.EDIT_GRADES,
      PERMISSIONS.VIEW_ATTENDANCE,
      PERMISSIONS.MARK_ATTENDANCE,
      PERMISSIONS.VIEW_SCHEDULE,
      PERMISSIONS.MANAGE_TEACHERS,
      PERMISSIONS.VIEW_DEPARTMENT_REPORTS,
      PERMISSIONS.VIEW_ANNOUNCEMENTS,
      PERMISSIONS.POST_ANNOUNCEMENTS,
    ],
  },
  teacher: {
    displayName: "Teacher",
    description: "Manage own classes and student progress",
    accessLevel: "own",
    permissions: [
      PERMISSIONS.VIEW_STUDENTS,
      PERMISSIONS.VIEW_CLASSES,
      PERMISSIONS.EDIT_GRADES,
      PERMISSIONS.VIEW_ATTENDANCE,
      PERMISSIONS.MARK_ATTENDANCE,
      PERMISSIONS.VIEW_SCHEDULE,
      PERMISSIONS.VIEW_ANNOUNCEMENTS,
      PERMISSIONS.POST_ANNOUNCEMENTS,
      PERMISSIONS.VIEW_MESSAGES,
    ],
  },
  accountant: {
    displayName: "Accountant",
    description: "Manage fees, payments, and invoices",
    accessLevel: "finance",
    permissions: [
      PERMISSIONS.VIEW_FEES,
      PERMISSIONS.MANAGE_PAYMENTS,
      PERMISSIONS.VIEW_INVOICES,
      PERMISSIONS.ISSUE_INVOICES,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_ANNOUNCEMENTS,
      PERMISSIONS.VIEW_MESSAGES,
    ],
  },
  student: {
    displayName: "Student",
    description: "View own academic information",
    accessLevel: "own",
    permissions: [
      PERMISSIONS.VIEW_OWN_GRADES,
      PERMISSIONS.VIEW_OWN_ATTENDANCE,
      PERMISSIONS.VIEW_OWN_SCHEDULE,
      PERMISSIONS.VIEW_ANNOUNCEMENTS,
      PERMISSIONS.VIEW_MESSAGES,
    ],
  },
  parent: {
    displayName: "Parent",
    description: "View child's academic information",
    accessLevel: "child",
    permissions: [
      PERMISSIONS.VIEW_CHILD_GRADES,
      PERMISSIONS.VIEW_CHILD_ATTENDANCE,
      PERMISSIONS.VIEW_CHILD_SCHEDULE,
      PERMISSIONS.VIEW_ANNOUNCEMENTS,
      PERMISSIONS.VIEW_MESSAGES,
    ],
  },
};

/**
 * Does `role` have `permission`?
 * Checks the role's own permission list for a wildcard "all" first -
 * this is what makes school_admin (tenant-wide "all") and super_admin
 * (platform-wide "all") both work correctly.
 */
function hasPermission(role, permission) {
  if (!role || !permission) return false;
  const config = rolePermissions[role];
  if (!config) return false;
  return (
    config.permissions.includes(PERMISSIONS.ALL) ||
    config.permissions.includes(permission)
  );
}

function hasAnyPermission(role, permissions = []) {
  if (!Array.isArray(permissions)) return false;
  return permissions.some((p) => hasPermission(role, p));
}

function hasAllPermissions(role, permissions = []) {
  if (!Array.isArray(permissions)) return false;
  return permissions.every((p) => hasPermission(role, p));
}

function getRolePermissions(role) {
  const config = rolePermissions[role];
  return config ? config.permissions : [];
}

function getRoleInfo(role) {
  return (
    rolePermissions[role] || {
      displayName: "Unknown",
      description: "",
      accessLevel: "none",
    }
  );
}

module.exports = {
  PERMISSIONS,
  rolePermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  getRoleInfo,
};
