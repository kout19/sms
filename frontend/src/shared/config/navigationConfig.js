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

export const navigationConfig = {
  /**
   * ADMIN NAVIGATION
   * Full system access with all management features
   */
  admin: {
    label: "Administrator",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "layout-dashboard",
        path: "/admin",
        permission: "view:all_data",
      },
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

  /**
   * TEACHER NAVIGATION
   * Class and student management features
   */
  teacher: {
    label: "Teacher",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "layout-dashboard",
        path: "/teacher",
        permission: "view:classes",
      },
      {
        id: "classes",
        label: "My Classes",
        icon: "book-open",
        path: "/teacher/classes",
        permission: "view:classes",
        children: [
          {
            id: "classes-list",
            label: "All Classes",
            icon: "list",
            path: "/teacher/classes",
          },
          {
            id: "class-schedule",
            label: "Schedule",
            icon: "clock",
            path: "/teacher/classes/schedule",
          },
        ],
      },
      {
        id: "students",
        label: "Students",
        icon: "graduation-cap",
        path: "/teacher/students",
        permission: "view:students",
        children: [
          {
            id: "students-list",
            label: "Student List",
            icon: "list",
            path: "/teacher/students",
          },
          {
            id: "students-search",
            label: "Search Student",
            icon: "search",
            path: "/teacher/students/search",
          },
        ],
      },
      {
        id: "grades",
        label: "Grades",
        icon: "layout-dashboard",
        path: "/teacher/grades",
        permission: "edit:grades",
        children: [
          {
            id: "grades-enter",
            label: "Enter Grades",
            icon: "pencil",
            path: "/teacher/grades/enter",
          },
          {
            id: "grades-view",
            label: "View Grades",
            icon: "eye",
            path: "/teacher/grades/view",
          },
        ],
      },
      {
        id: "attendance",
        label: "Attendance",
        icon: "calendar-check",
        path: "/teacher/attendance",
        permission: "mark:attendance",
        children: [
          {
            id: "attendance-mark",
            label: "Mark Attendance",
            icon: "map-pin",
            path: "/teacher/attendance/mark",
          },
          {
            id: "attendance-report",
            label: "Attendance Report",
            icon: "layout-dashboard",
            path: "/teacher/attendance/report",
          },
        ],
      },
      {
        id: "announcements",
        label: "Announcements",
        icon: "megaphone",
        path: "/teacher/announcements",
        permission: "post:announcements",
        children: [
          {
            id: "announcements-list",
            label: "All Announcements",
            icon: "list",
            path: "/teacher/announcements",
          },
          {
            id: "announcements-create",
            label: "Create New",
            icon: "plus",
            path: "/teacher/announcements/create",
          },
        ],
      },
      {
        id: "messages",
        label: "Messages",
        icon: "message-square",
        path: "/teacher/messages",
      },
    ],
  },

  /**
   * STUDENT NAVIGATION
   * Academic data and notifications
   */
  student: {
    label: "Student",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "layout-dashboard",
        path: "/student",
        permission: "view:own_schedule",
      },
      {
        id: "grades",
        label: "My Grades",
        icon: "trending-up",
        path: "/student/grades",
        permission: "view:own_grades",
        children: [
          {
            id: "grades-current",
            label: "Current Grades",
            icon: "layout-dashboard",
            path: "/student/grades",
          },
          {
            id: "grades-history",
            label: "Grade History",
            icon: "book-open",
            path: "/student/grades/history",
          },
        ],
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
        children: [
          {
            id: "assignments-pending",
            label: "Pending",
            icon: "clock",
            path: "/student/assignments",
          },
          {
            id: "assignments-submitted",
            label: "Submitted",
            icon: "check",
            path: "/student/assignments/submitted",
          },
        ],
      },
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

  /**
   * PARENT NAVIGATION
   * Child's academic information
   */
  parent: {
    label: "Parent",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "layout-dashboard",
        path: "/parent",
        permission: "view:child_schedule",
      },
      {
        id: "child-progress",
        label: "Child Progress",
        icon: "book-open",
        path: "/parent/progress",
        permission: "view:child_grades",
        children: [
          {
            id: "child-grades",
            label: "Grades",
            icon: "trending-up",
            path: "/parent/progress/grades",
          },
          {
            id: "child-attendance",
            label: "Attendance",
            icon: "calendar-check",
            path: "/parent/progress/attendance",
          },
          {
            id: "child-schedule",
            label: "Schedule",
            icon: "clock",
            path: "/parent/progress/schedule",
          },
        ],
      },
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
      {
        id: "fees",
        label: "Fees & Payments",
        icon: "dollar-sign",
        path: "/parent/fees",
      },
      {
        id: "documents",
        label: "Documents",
        icon: "file-text",
        path: "/parent/documents",
      },
    ],
  },
};

/**
 * Get navigation items for a specific role
 * @param {string} role - User role (admin, teacher, student, parent)
 * @returns {object} - Navigation config for the role
 */
export const getNavigationForRole = (role) => {
  return navigationConfig[role] || { label: "User", items: [] };
};

/**
 * Get flat list of all navigation items for a role (including nested)
 * @param {string} role - User role
 * @returns {array} - Flat array of all menu items
 */
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

  flattenItems(config.items);
  return items;
};

/**
 * Find a menu item by ID (searches all levels)
 * @param {string} role - User role
 * @param {string} itemId - Menu item ID
 * @returns {object|null} - Menu item or null
 */
export const findMenuItemById = (role, itemId) => {
  const allItems = getAllMenuItemsForRole(role);
  return allItems.find((item) => item.id === itemId) || null;
};

export default navigationConfig;
