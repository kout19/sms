/**
 * Navigation Configuration
 * =======================
 *
 * Centralized configuration for all navigation items across all roles.
 * This is a single source of truth for menu items, making it easy to:
 * - Add/remove menu items
 * - Add new roles
 * - Manage permissions
 * - Update UI structure
 *
 * Structure:
 * {
 *   [roleKey]: {
 *     label: "Role Display Name",
 *     items: [
 *       {
 *         id: "unique-id",
 *         label: "Menu Item",
 *         icon: "icon-name",
 *         path: "/route",
 *         permission: "permission:required", // optional
 *         children: [] // optional for nested menus
 *       }
 *     ]
 *   }
 * }
 */

import { configureStore } from "@reduxjs/toolkit";
import { PERMISSIONS } from "@packages/shared";

export const navigationConfig = {
  super_admin: {
    label: "Super Admin",
    groups: [
      {
        id: "overview",
        label: "Overview",
        items: [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: "layout-dashboard",
            path: "/super-admin",
            permission: PERMISSIONS.VIEW_DASHBOARD,
          },
        ],
      },
      {
        id: "platform-management",
        label: "Platform Management",
        items: [
          {
            id: "schools",
            label: "Schools",
            icon: "school",
            path: "/super-admin/schools",
            permission: PERMISSIONS.MANAGE_SCHOOLS,
          },
          {
            id: "subscriptions",
            label: "Subscriptions",
            icon: "wallet",
            path: "/super-admin/subscriptions",
            permission: PERMISSIONS.MANAGE_SUBSCRIPTIONS,
          },
          {
            id: "plans",
            label: "Plans",
            icon: "layers",
            path: "/super-admin/plans",
            permission: PERMISSIONS.MANAGE_PLANS,
          },
        ],
      },
      {
        id: "user",
        Label: "users",
        items: [
          {
            id: "users",
            label: "Users",
            icon: "users",
            path: "/super-admin/users",
            permission: PERMISSIONS.MANAGE_USERS,
          },
          {
            id: "roles",
            label: "Roles & Permissions",
            icon: "shield-check",
            path: "/super-admin/roles-permissions",
            permission: PERMISSIONS.MANAGE_ROLES,
          },
        ],
      },
      {
        id: "system",
        label: "System",
        items: [
          {
            id: "logs",
            label: "Audit Logs",
            icon: "file-text",
            path: "/super-admin/audit-logs",
            permission: PERMISSIONS.MANGE_LOGS,
          },
          {
            id: "security",
            label: "Security",
            icon: "shield",
            path: "/super-admin/security",
            permission: PERMISSIONS.MANAGE_SECURITY,
          },
          {
            id: "integrations",
            label: "Integrations",
            icon: "blocks",
            path: "/super-admin/integrations",
            permission: PERMISSIONS.MANGE_INTEGRATIONS,
          },
        ],
      },
      {
        id: "tasks",
        label: "Tasks",
        items: [
          {
            id: "tasks",
            label: "Task Organizer",
            icon: "check-square",
            path: "/super-admin/tasks",
            permission: PERMISSIONS.MANAGE_TASKS,
          },
        ],
      },
      {
        id: "report",
        label: "Report",
        items: [
          {
            id: "analytics",
            label: "Analytics",
            icon: "bar-chart",
            path: "/super-admin/analytics",
            permission: PERMISSIONS.MANAGE_ANALYTICS,
          },
        ],
      },
      {
        id: "support",
        label: "Support",
        items: [
          {
            id: "tickets",
            label: "Tickets",
            icon: "ticket",
            path: "/super-admin/tickets",
            permission: PERMISSIONS.MANAGE_TICKETS,
          },
        ],
      },
    ],
  },
  department_head: {
    label: "Department Head",
    groups: [
      {
        id: "overview",
        label: "Overview",
        items: [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: "layout-dashboard",
            path: "/department-head",
            permission: PERMISSIONS.VIEW_DASHBOARD,
          },
        ],
      },
      {
        id: "department",
        label: "Department",
        items: [
          {
            id: "teachers",
            label: "Teachers",
            icon: "users",
            path: "/department-head/teachers",
            permission: PERMISSIONS.MANAGE_TEACHERS,
          },
          {
            id: "subjects",
            label: "Subjects",
            icon: "book",
            path: "/department-head/subjects",
            permission: PERMISSIONS.MANAGE_SUBJECTS,
          },
          {
            id: "classes",
            label: "Classes",
            icon: "book-open",
            path: "/department-head/classes",
            permission: PERMISSIONS.MANAGE_CLASSES,
          },
          {
            id: "students",
            label: "Students",
            icon: "graduation-cap",
            path: "/department-head/students",
            permission: PERMISSIONS.MANAGE_STUDENTS,
          },
        ],
      },
      {
        id: "academic",
        label: "Academic",
        items: [
          {
            id: "attendance",
            label: "Attendance",
            icon: "calendar-check",
            path: "/department-head/attendance",
            permission: PERMISSIONS.MANAGE_ATTENDANCE,
          },
          {
            id: "assignments",
            label: "Assignments",
            icon: "file-text",
            path: "/department-head/assignments",
            permission: PERMISSIONS.MANAGE_ASSIGNMENTS,
          },
          {
            id: "exams",
            label: "Exams",
            icon: "file-text",
            path: "/department-head/exams",
            permission: PERMISSIONS.MANAGE_EXAMS,
          },
          {
            id: "performance",
            label: "Performance",
            icon: "file-text",
            path: "/department-head/performance",
            permission: PERMISSIONS.MANAGE_PERFORMANCE,
          },
        ],
      },
      {
        id: "task",
        label: "Task",
        items: [
          {
            id: "tasks",
            label: "Task Organizer",
            icon: "check-square",
            path: "/department-head/tasks",
            permission: PERMISSIONS.MANAGE_TASKS,
          },
        ],
      },
      {
        id: "reports",
        label: "Reports",
        items: [
          {
            id: "Reports",
            label: "Reports",
            icon: "layout-dashboard",
            path: "/department-head/reports/attendance",
          },
        ],
      },
      {
        id: "communicaiton",
        label: "Communication",
        items: [
          {
            id: "messages",
            label: "Messages",
            icon: "message-square",
            path: "/department-head/messages",
          },
          {
            id: "announcements",
            label: "Announcements",
            icon: "megaphone",
            path: "/department-head/announcements",
          },
        ],
      },
    ],
  },
  accountant: {
    label: "Accountant",
    groups: [
      {
        id: "overview",
        label: "Overview",
        items: [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: "layout-dashboard",
            path: "/accountant",
            permission: PERMISSIONS.VIEW_DASHBOARD,
          },
        ],
      },
      {
        id: "finance",
        label: "Finance",
        items: [
          {
            id: "students-payment",
            label: "Students Payment",
            icon: "credit-card",
            path: "/accountant/finance",
            permission: PERMISSIONS.MANAGE_STUDENTS_PAYMENT,
          },
          {
            id: "fees",
            label: "Fees",
            icon: "dollar-sign",
            path: "/accountant/fees",
            permission: PERMISSIONS.MANAGE_FEES,
          },
          {
            id: "expenses",
            label: "Expenses",
            icon: "dollar-sign",
            path: "/accountant/expenses",
            permission: PERMISSIONS.MANAGE_EXPENSES,
          },
          {
            id: "payroll",
            label: "Payroll",
            icon: "dollar-sign",
            path: "/accountant/payroll",
            permission: PERMISSIONS.MANAGE_PAYROLL,
          },
        ],
      },
      {
        id: "task",
        label: "Task",
        items: [
          {
            id: "tasks",
            label: "Task Organizer",
            icon: "check-square",
            path: "/accountant/tasks",
            permission: PERMISSIONS.MANAGE_TASKS,
          },
        ],
      },
      {
        id: "reports",
        label: "Reports",
        items: [
          {
            id: "revenu-reports",
            label: "Revenue Reports",
            icon: "layout-dashboard",
            path: "/accountant/reports/revenue",
            permission: PERMISSIONS.MANAGE_REVENUE_REPORTS,
          },
          {
            id: "outstanding-balance",
            label: "Outstanding Balances",
            icon: "dollar-sign",
            path: "/accountant/reports/outstanding-balance",
            permission: PERMISSIONS.MANAGE_OUTSTANDING_BALANCES,
          },
          {
            id: "financial-statements",
            label: "Financial Statements",
            icon: "dollar-sign",
            path: "/accountant/reports/financial-statements",
            permission: PERMISSIONS.MANAGE_FINANCIAL_STATEMENTS,
          },
        ],
      },
      {
        id: "commounication",
        label: "Communication",
        items: [
          {
            id: "payment-reminders",
            label: "Payment Reminders",
            icon: "message-square",
            path: "/accountant/messages",
            permission: PERMISSIONS.MANAGE_PAYMENT_REMINDERS,
          },
        ],
      },
    ],
  },
  admin: {
    label: "Administrator",
    groups: [
      {
        id: "overview",
        label: "Overview",
        items: [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: "layout-dashboard",
            path: "/admin",
            permission: PERMISSIONS.VIEW_DASHBOARD,
          },
        ],
      },
      {
        id: "users",
        label: "Users",
        items: [
          {
            id: "students",
            label: "Students",
            icon: "graduation-cap",
            path: "/admin/students",
            permission: PERMISSIONS.MANAGE_STUDENTS,
            children: [
              {
                id: "students-list",
                label: "All Students",
                icon: "list",
                path: "/admin/students",
              },
              {
                id: "students-add",
                label: "Add Student",
                icon: "plus",
                path: "/admin/students/add",
              },
              {
                id: "students-import",
                label: "Import Students",
                icon: "download",
                path: "/admin/students/import",
              },
            ],
          },
          {
            id: "teachers",
            label: "Teachers",
            icon: "users",
            path: "/admin/teachers",
            permission: PERMISSIONS.MANAGE_TEACHERS,
            children: [
              {
                id: "teachers-list",
                label: "All Teachers",
                icon: "list",
                path: "/admin/teachers",
              },
              {
                id: "teachers-add",
                label: "Add Teacher",
                icon: "plus",
                path: "/admin/teachers/add",
              },
              {
                id: "teachers-attendance",
                label: "Attendance",
                icon: "map-pin",
                path: "/admin/teachers/attendance",
              },
            ],
          },
          {
            id: "department",
            label: "Departments",
            icon: "building",
            path: "/admin/departments",
            permission: PERMISSIONS.MANAGE_DEPARTMENTS,
            children: [
              {
                id: "department-list",
                label: "All Departments",
                icon: "building",
                path: "/admin/departments",
              },
              {
                id: "department-add",
                label: "Create Department",
                icon: "plus",
                path: "/admin/departments/add",
              },
            ],
          },
          {
            id: "accountant",
            label: "Accountant",
            icon: "dollar-sign",
            path: "/admin/accountants",
            permission: PERMISSIONS.MANAGE_ATTENDANCE,
            children: [
              {
                id: "accountant-list",
                label: "All Accountants",
                icon: "list",
                path: "/admin/accountants",
              },
              {
                id: "accountant-add",
                label: "Add Accountant",
                icon: "plus",
                path: "/admin/accountants/add",
              },
            ],
          },
          {
            id: "parent",
            label: "Parents",
            icon: "users",
            path: "/admin/parents",
            permission: PERMISSIONS.MANAGE_PARENTS,
            children: [
              {
                id: "parent-list",
                label: "All Parents",
                icon: "list",
                path: "/admin/parents",
              },
              {
                id: "parent-add",
                label: "Add Parent",
                icon: "plus",
                path: "/admin/parents/add",
              },
            ],
          },
        ],
      },
      {
        id: "academic-management",
        label: "Academic Management",
        items: [
          {
            id: "subjects",
            label: "Subjects",
            icon: "book-open",
            path: "/admin/subjects",
            permission: PERMISSIONS.MANAGE_SUBJECTS,
          },
          {
            id: "exams",
            label: "Exams",
            icon: "file-text",
            path: "/admin/exams",
            permission: PERMISSIONS.MANAGE_EXAMS,
          },
          {
            id: "classes",
            label: "Classes",
            icon: "book-open",
            path: "/admin/classes",
            permission: PERMISSIONS.MANAGE_CLASSES,
          },
          {
            id: "attendance",
            label: "Attendance",
            icon: "calendar-check",
            path: "/admin/attendance",
            permission: PERMISSIONS.MANAGE_ATTENDANCE,
          },
        ],
      },

      {
        id: "reports",
        label: "Reports",
        items: [
          {
            id: "reports",
            label: "Reports",
            icon: "trending-up",
            path: "/admin/reports",
            permission: PERMISSIONS.MANAGE_REPORTS,
            children: [
              {
                id: "attendance-reports",
                label: "Attendance Reports",
                icon: "layout-dashboard",
                path: "/admin/reports/attendance-reports",
              },
              {
                id: "academic-reports",
                label: "Academic Reports",
                icon: "book-open",
                path: "/admin/reports/academic-reports",
              },
              {
                id: "financial-reports",
                label: "Financial Reports",
                icon: "dollar-sign",
                path: "/admin/reports/financial-reports",
              },
            ],
          },
        ],
      },
      {
        id: "messages",
        label: "Messages",
        items: [
          {
            id: "messages",
            label: "Messages",
            icon: "message-square",
            path: "/admin/messages",
            permission: PERMISSIONS.MANAGE_MESSAGES,
          },
          {
            id: "announcements",
            label: "Announcements",
            icon: "megaphone",
            path: "/admin/announcements",
            permission: PERMISSIONS.MANAGE_ANNOUNCEMENTS,
          },
        ],
      },
      {
        id: "settings",
        label: "Settings",
        items: [
          {
            id: "settings",
            label: "Settings",
            icon: "settings",
            path: "/admin/settings",
            permission: PERMISSIONS.MANAGE_SETTINGS,
            children: [
              {
                id: "general-settings",
                label: "General",
                icon: "wrench",
                path: "/admin/settings/general",
              },
              {
                id: "roles-permissions",
                label: "Roles & Permissions",
                icon: "shield",
                path: "/admin/settings/roles",
              },
              {
                id: "user-management",
                label: "User Management",
                icon: "users",
                path: "/admin/settings/users",
              },
            ],
          },
        ],
      },
    ],
  },

  teacher: {
    label: "Teacher",
    groups: [
      {
        id: "overview",
        label: "Overview",
        items: [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: "layout-dashboard",
            path: "/teacher",
            permission: PERMISSIONS.VIEW_DASHBOARD,
          },
        ],
      },
      {
        id: "teaching",
        label: "Teaching",
        items: [
          {
            id: "classes",
            label: "My Classes",
            icon: "book-open",
            path: "/teacher/classes",
            permission: "view:classes",
          },
          {
            id: "students",
            label: "Students",
            icon: "graduation-cap",
            path: "/teacher/students",
            permission: PERMISSIONS.VIEW_STUDENTS,
          },
          {
            id: "grades",
            label: "Grades",
            icon: "trending-up",
            path: "/teacher/grades",
            permission: PERMISSIONS.MANAGE_GRADES,
          },
          {
            id: "attendance",
            label: "Attendance",
            icon: "calendar-check",
            path: "/teacher/attendance",
            permission: PERMISSIONS.MANAGE_ATTENDANCE,
          },
        ],
      },
      {
        id: "communication",
        label: "Communication",
        items: [
          {
            id: "announcements",
            label: "Announcements",
            icon: "megaphone",
            path: "/teacher/announcements",
            permission: PERMISSIONS.MANAGE_ANNOUNCEMENTS,
          },
          {
            id: "messages",
            label: "Messages",
            icon: "message-square",
            path: "/teacher/messages",
          },
        ],
      },
    ],
  },

  student: {
    label: "Student",
    groups: [
      {
        id: "overview",
        label: "Overview",
        items: [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: "layout-dashboard",
            path: "/student",
            permission: PERMISSIONS.VIEW_DASHBOARD,
          },
        ],
      },
      {
        id: "academic",
        label: "Academic",
        items: [
          {
            id: "grades",
            label: "My Grades",
            icon: "trending-up",
            path: "/student/grades",
            permission: PERMISSIONS.VIEW_OWN_GRADES,
          },
          {
            id: "attendance",
            label: "Attendance",
            icon: "calendar-check",
            path: "/student/attendance",
            permission: PERMISSIONS.VIEW_ATTENDANCE,
          },
          {
            id: "schedule",
            label: "Schedule",
            icon: "clock",
            path: "/student/schedule",
            permission: PERMISSIONS.VIEW_SCHEDULE,
          },
          {
            id: "assignments",
            label: "Assignments",
            icon: "clipboard-list",
            path: "/student/assignments",
            permission: PERMISSIONS.VIEW_ASSIGNMENTS,
          },
        ],
      },
      {
        id: "communication",
        label: "Communication",
        items: [
          {
            id: "announcements",
            label: "Announcements",
            icon: "megaphone",
            path: "/student/announcements",
            permission: PERMISSIONS.VIEW_ANNOUNCEMENTS,
          },
          {
            id: "messages",
            label: "Messages",
            icon: "message-square",
            path: "/student/messages",
            permission: PERMISSIONS.VIEW_MESSAGES,
          },
        ],
      },
    ],
  },

  parent: {
    label: "Parent",
    groups: [
      {
        id: "overview",
        label: "Overview",
        items: [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: "layout-dashboard",
            path: "/parent",
            permission: PERMISSIONS.VIEW_DASHBOARD,
          },
        ],
      },
      {
        id: "academic",
        label: "Academic",
        items: [
          {
            id: "child-progress",
            label: "Child Progress",
            icon: "book-open",
            path: "/parent/progress",
            permission: PERMISSIONS.VIEW_PROGRESS,
          },
        ],
      },
      {
        id: "communication",
        label: "Communication",
        items: [
          {
            id: "announcements",
            label: "School Announcements",
            icon: "megaphone",
            path: "/parent/announcements",
            permission: PERMISSIONS.VIEW_ANNOUNCEMENTS,
          },
          {
            id: "messages",
            label: "Messages",
            icon: "message-square",
            path: "/parent/messages",
            permission: PERMISSIONS.VIEW_MESSAGES,
          },
        ],
      },
      {
        id: "finance",
        label: "Finance",
        items: [
          {
            id: "fees",
            label: "Fees & Payments",
            icon: "dollar-sign",
            path: "/parent/fees",
            permission: PERMISSIONS.VIEW_FEES,
          },
        ],
      },
      {
        id: "documents",
        label: "Documents",
        items: [
          {
            id: "documents",
            label: "Documents",
            icon: "file-text",
            path: "/parent/documents",
            permission: PERMISSIONS.VIEW_DOCUMENTS,
          },
        ],
      },
    ],
  },
};

export const getNavigationForRole = (role) => {
  return navigationConfig[role] || { label: "Menu", groups: [] };
};

export const getAllMenuItemsForRole = (role) => {
  const config = getNavigationForRole(role);
  const items = [];

  const flattenItems = (itemList) => {
    itemList.forEach((item) => {
      items.push(item);
      if (item.children) {
        flattenItems(item.children);
      }
    });
  };

  if (config?.groups) {
    config.groups.forEach((group) => {
      flattenItems(group.items);
    });
  } else {
    flattenItems(config?.items || []);
  }

  return items;
};

export const findMenuItemById = (role, itemId) => {
  const allItems = getAllMenuItemsForRole(role);
  return allItems.find((item) => item.id === itemId) || null;
};

// export default navigationConfig;
