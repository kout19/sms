// packages/shared/permissions/index.js
// Single source of truth for RBAC. Imported by BOTH backend and frontend.
// CommonJS throughout - matches backend's require(). The ESM side
// (index.mjs) is a thin wrapper around this file, not a separate copy -
// see index.mjs before editing that file.

const PERMISSIONS_RAW = {
  ALL: "all",

  MANAGE_USERS: "manage:users",
  VIEW_USERS: "view:users",

  VIEW_ATTENDANCE: "view:attendance",
  MANAGE_ATTENDANCE: "manage:attendance",
  VIEW_DASHBOARD: "view:dashboard",
  MANAGE_STUDENTS: "manage:students",
  MANAGE_SETTINGS: "manage:settings",
  MANAGE_ANNOUNCEMENTS: "manage:anouncements",
  MANAGE_INVOICES: "manage:invoices",
  MANAGE_PARENTS:"manage:parents",

  VIEW_EXAMS: "view:exams",
  MANAGE_EXAMS: "manage:exams",

  MANAGE_PLANS: "manage:plans",
  MANGE_LOGS: "manage:logs",

  MANAGE_SECURITY: "manage:security",
  MANGE_INTEGRATIONS: "manage:integrations",
  MANAGE_TASKS: "manage:tasks",
  MANAGE_ANALYTICS: "manage:analytics",
  MANAGE_TICKETS: "manage:tickets",

  MANAGE_STUDENTS_PAYMENT: "manage:students_payment",
  MANAGE_FEES: "manage:fees",
  MANAGE_FINANCIAL_STATEMENTS: "manage:financial_statements",

  VIEW_ASSIGNMENTS: "view:assignments",
  MANAGE_ASSIGNMENTS: "manage:assignments",

  VIEW_PERFORMANCE: "view:performance",
  MANAGE_PERFORMANCE: "manage:performance",

  VIEW_GRADES: "view:grades",
  MANAGE_GRADES: "manage:grades",
  MANAGE_MESSAGES: "manage:messages",

  VIEW_LOGS: "view:logs",
  MANAGE_LOGS: "manage:logs",

  VIEW_SCHOOLS: "view:schools",
  MANAGE_SCHOOLS: "manage:schools",

  VIEW_SUBSCRIPTIONS: "view:subscriptions",
  MANAGE_SUBSCRIPTIONS: "manage:subscriptions",

  VIEW_TENANTS: "view:tenants",
  MANAGE_TENANTS: "manage:tenants",

  VIEW_ROLES: "view:roles",
  MANAGE_ROLES: "manage:roles",

  VIEW_STUDENTS: "view:students",
  VIEW_CLASSES: "view:classes",
  MANAGE_CLASSES: "manage:classes",
  EDIT_GRADES: "edit:grades",
  VIEW_OWN_GRADES: "view:own_grades",
  VIEW_CHILD_GRADES: "view:child_grades",
  VIEW_PROGRESS: "view:progress",
  VIEW_DOCUMENTS: "view:documents",

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

  MANAGE_SUBJECTS: "manage:subjects",
  VIEW_SUBJECTS: "view:subjects",

  VIEW_OWN_REPORTS: "view:own_reports",
  VIEW_CHILD_REPORTS: "view:child_reports",

  VIEW_PARENTS: "view:parents",

  VIEW_OWN_PARENTS: "view:own_parents",
  VIEW_CHILD_PARENTS: "view:child_parents",

  MANAGE_OUTSTANDING_BALANCES: "manage:outstanding_balances",
  VIEW_OUTSTANDING_BALANCES: "view:outstanding_balances",
  MANAGE_REVENUE_REPORTS: "manage:revenue_reports",
  VIEW_REVENUE_REPORTS: "view:revenue_reports",

  // accountant
  MANAGE_EXPENSES: "manage:expenses",
  VIEW_EXPENSES: "view:expenses",
  MANAGE_PAYMENT_REMINDERS: "manage:payment_reminders",
  VIEW_BALANACES: "view:balances",
  MANAGE_REPORTS: "manage:reports",
  MANAGE_PAYROLL: "manage:payroll",
};

const PERMISSIONS = new Proxy(PERMISSIONS_RAW, {
  get(target, prop) {
    if (!(prop in target)) {
      throw new Error(
        `PERMISSIONS.${String(prop)} does not exist. Check for a typo or add it to permissions/index.js.`,
      );
    }
    return target[prop];
  },
});


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
      PERMISSIONS.MANAGE_TEACHERS,
      PERMISSIONS.MANAGE_CLASSES,
      PERMISSIONS.EDIT_GRADES,
      PERMISSIONS.VIEW_ATTENDANCE,
      PERMISSIONS.MARK_ATTENDANCE,
      PERMISSIONS.VIEW_SCHEDULE,
      PERMISSIONS.VIEW_DEPARTMENT_REPORTS,
      PERMISSIONS.VIEW_ANNOUNCEMENTS,
      PERMISSIONS.POST_ANNOUNCEMENTS,
      PERMISSIONS.VIEW_MESSAGES,
      PERMISSIONS.MANAGE_SUBJECTS,
      PERMISSIONS.VIEW_SUBJECTS,
      PERMISSIONS.VIEW_ANNOUNCEMENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.MANAGE_STUDENTS,
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
      PERMISSIONS.MANAGE_FEES,
      PERMISSIONS.MANAGE_INVOICES,

      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_ANNOUNCEMENTS,
      PERMISSIONS.VIEW_MESSAGES,
      PERMISSIONS.MANAGE_EXPENSES,
      PERMISSIONS.VIEW_EXPENSES,
      PERMISSIONS.MANAGE_PAYMENT_REMINDERS,
      PERMISSIONS.VIEW_BALANACES,
      PERMISSIONS.MANAGE_PAYROLL,
      PERMISSIONS.MANAGE_REPORTS,
      PERMISSIONS.MANAGE_REVENUE_REPORTS,
      PERMISSIONS.VIEW_REVENUE_REPORTS,
      PERMISSIONS.MANAGE_OUTSTANDING_BALANCES,
      PERMISSIONS.VIEW_OUTSTANDING_BALANCES,
      PERMISSIONS.MANAGE_STUDENTS_PAYMENT,
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.MANAGE_PAYROLL,
      PERMISSIONS.MANAGE_TASKS,
      PERMISSIONS.MANAGE_FINANCIAL_STATEMENTS,
   
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
      PERMISSIONS.VIEW_DASHBOARD,
      
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
