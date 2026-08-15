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
            permission: "view:all_data",
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
            permission: "manage:schools",
          },
          {
            id: "subscriptions",
            label: "Subscriptions",
            icon: "wallet",
            path: "/super-admin/subscriptions",
            permission: "manage:subscriptions",
          },
          {
            id: "plans",
            label: "Plans",
            icon: "layers",
            path: "/super-admin/plans",
            permission: "manage:plans",
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
            permission: "manage:users",
          },
          {
            id: "roles",
            label: "Roles & Permissions",
            icon: "shield-check",
            path: "/super-admin/roles-permissions",
            permission: "manage:roles",
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
            permission: "manage:logs",
          },
          {
            id: "security",
            label: "Security",
            icon: "shield",
            path: "/super-admin/security",
            permission: "manage:security",
          },
          {
            id: "integrations",
            label: "Integrations",
            icon: "blocks",
            path: "/super-admin/integrations",
            permission: "manage:integrations",
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
            permission: "manage:tasks",
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
            permission: "manage:analytics",
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
            permission: "manage:tickets",
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
            permission: "view:all_data",
          },
        ],
      },
    ],
  },
  accountant:{
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
            permission: "view:all_data",
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
            permission: "view:all_data",
          },
        ],
      },
      {
        id: "academic-management",
        label: "Academic Management",
        items: [
          {
            id: "students",
            label: "Students",
            icon: "graduation-cap",
            path: "/admin/students",
            permission: "manage:users",
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
            permission: "manage:users",
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
            id: "classes",
            label: "Classes",
            icon: "book-open",
            path: "/admin/classes",
            permission: "manage:classes",
            children: [
              {
                id: "classes-list",
                label: "All Classes",
                icon: "list",
                path: "/admin/classes",
              },
              {
                id: "classes-add",
                label: "Create Class",
                icon: "plus",
                path: "/admin/classes/add",
              },
              {
                id: "class-schedule",
                label: "Schedule",
                icon: "clock",
                path: "/admin/classes/schedule",
              },
            ],
          },
          {
            id: "attendance",
            label: "Attendance",
            icon: "calendar-check",
            path: "/admin/attendance",
            permission: "manage:attendance",
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
            permission: "view:reports",
            children: [
              {
                id: "attendance-reports",
                label: "Attendance Reports",
                icon: "layout-dashboard",
                path: "/admin/reports/attendance",
              },
              {
                id: "academic-reports",
                label: "Academic Reports",
                icon: "book-open",
                path: "/admin/reports/academic",
              },
              {
                id: "financial-reports",
                label: "Financial Reports",
                icon: "dollar-sign",
                path: "/admin/reports/financial",
              },
            ],
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
            permission: "manage:settings",
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
            permission: "view:classes",
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
            permission: "view:students",
          },
          {
            id: "grades",
            label: "Grades",
            icon: "trending-up",
            path: "/teacher/grades",
            permission: "edit:grades",
          },
          {
            id: "attendance",
            label: "Attendance",
            icon: "calendar-check",
            path: "/teacher/attendance",
            permission: "mark:attendance",
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
            permission: "post:announcements",
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
            permission: "view:own_schedule",
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
            permission: "view:own_grades",
          },
          {
            id: "attendance",
            label: "Attendance",
            icon: "calendar-check",
            path: "/student/attendance",
            permission: "view:own_attendance",
          },
          {
            id: "schedule",
            label: "Schedule",
            icon: "clock",
            path: "/student/schedule",
            permission: "view:own_schedule",
          },
          {
            id: "assignments",
            label: "Assignments",
            icon: "clipboard-list",
            path: "/student/assignments",
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
            permission: "view:announcements",
          },
          {
            id: "messages",
            label: "Messages",
            icon: "message-square",
            path: "/student/messages",
            permission: "view:messages",
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
            permission: "view:child_schedule",
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
            permission: "view:child_grades",
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
            permission: "view:announcements",
          },
          {
            id: "messages",
            label: "Messages",
            icon: "message-square",
            path: "/parent/messages",
            permission: "view:messages",
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
