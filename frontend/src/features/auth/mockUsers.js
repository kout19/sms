/**
 * Mock Users Database
 * This structure mirrors what a real backend would return
 * Each user has complete profile data and role information
 * Role values: 'admin', 'teacher', 'student', 'parent'
 */

export const mockUsers = {
  admin: {
    id: "admin_001",
    firstName: "John",
    lastName: "Administrator",
    name: "John Administrator",
    email: "admin@sms.local",
    phone: "+1-234-567-8900",
    role: "admin",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    department: "Administration",
    joinDate: "2024-01-15",
    lastLogin: new Date().toISOString(),
    permissions: ["all"],
  },

  teacher: {
    id: "teacher_001",
    firstName: "Sarah",
    lastName: "Johnson",
    name: "Sarah Johnson",
    email: "sarah.johnson@sms.local",
    phone: "+1-234-567-8901",
    role: "teacher",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher",
    department: "Mathematics",
    joinDate: "2024-02-01",
    lastLogin: new Date().toISOString(),
    classesAssigned: ["Class 10-A", "Class 12-B"],
    qualifications: ["B.Tech", "M.Tech"],
    permissions: [
      "view:students",
      "edit:grades",
      "view:classes",
      "view:attendance",
    ],
  },

  student: {
    id: "student_001",
    firstName: "Michael",
    lastName: "Brown",
    name: "Michael Brown",
    email: "michael.brown@sms.local",
    phone: "+1-234-567-8902",
    role: "student",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Student",
    class: "10-A",
    rollNumber: "001",
    joinDate: "2023-06-15",
    lastLogin: new Date().toISOString(),
    parentId: "parent_001",
    permissions: ["view:grades", "view:attendance", "view:schedule"],
  },

  parent: {
    id: "parent_001",
    firstName: "Robert",
    lastName: "Brown",
    name: "Robert Brown",
    email: "robert.brown@sms.local",
    phone: "+1-234-567-8903",
    role: "parent",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Parent",
    linkedStudents: ["student_001"],
    joinDate: "2023-06-15",
    lastLogin: new Date().toISOString(),
    permissions: [
      "view:child_grades",
      "view:child_attendance",
      "view:messages",
    ],
  },
};

/**
 * Role Permissions Configuration
 * Maps each role to their allowed permissions
 * This can be extended with granular permissions as the system grows
 */
export const rolePermissions = {
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

/**
 * Authentication Response Formatter
 * Simulates what a real backend would return on successful login
 * Includes token simulation for future backend integration
 */
export const formatAuthResponse = (user) => {
  return {
    success: true,
    data: {
      user,
      token: `mock_token_${user.id}_${Date.now()}`,
      refreshToken: `mock_refresh_${user.id}_${Date.now()}`,
      expiresIn: 3600, // 1 hour
    },
    message: "Login successful",
  };
};
