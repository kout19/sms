/**
 * RBAC Utilities - Role-Based Access Control Helper Functions
 * Professional utilities for permission checking and role validation
 * Designed for easy transition to backend-driven permissions
 */

import { rolePermissions } from "../../features/auth/mockUsers";

/**
 * Check if user has specific permission
 * @param {string} userRole - User's role (admin, teacher, student, parent)
 * @param {string} permission - Permission to check (e.g., 'view:students')
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;

  // Admin has all permissions
  if (userRole === "admin") return true;

  const roleConfig = rolePermissions[userRole];
  if (!roleConfig) return false;

  return roleConfig.permissions.includes(permission);
};

/**
 * Check if user has any of multiple permissions
 * @param {string} userRole - User's role
 * @param {array} permissions - Array of permissions to check
 * @returns {boolean} - True if user has at least one permission
 */
export const hasAnyPermission = (userRole, permissions = []) => {
  if (!Array.isArray(permissions)) return false;
  return permissions.some((permission) => hasPermission(userRole, permission));
};

/**
 * Check if user has all specified permissions
 * @param {string} userRole - User's role
 * @param {array} permissions - Array of permissions to check
 * @returns {boolean} - True if user has all permissions
 */
export const hasAllPermissions = (userRole, permissions = []) => {
  if (!Array.isArray(permissions)) return false;
  return permissions.every((permission) => hasPermission(userRole, permission));
};

/**
 * Check if user's role matches allowed roles
 * @param {string} userRole - User's current role
 * @param {array} allowedRoles - Array of allowed roles
 * @returns {boolean} - True if user's role is in allowed list
 */
export const hasRole = (userRole, allowedRoles = []) => {
  if (!Array.isArray(allowedRoles)) return false;
  return allowedRoles.includes(userRole);
};

/**
 * Get all permissions for a role
 * @param {string} role - User's role
 * @returns {array} - Array of permissions
 */
export const getRolePermissions = (role) => {
  if (role === "admin") return ["all"];
  const roleConfig = rolePermissions[role];
  return roleConfig ? roleConfig.permissions : [];
};

/**
 * Get role display name and description
 * @param {string} role - User's role
 * @returns {object} - Role info with displayName and description
 */
export const getRoleInfo = (role) => {
  return rolePermissions[role] || { displayName: "Unknown", description: "" };
};

/**
 * Check if user is authenticated and authorized for resource
 * @param {object} user - Current user object
 * @param {array} allowedRoles - Allowed roles for resource
 * @returns {boolean} - True if user is authorized
 */
export const isAuthorized = (user, allowedRoles = []) => {
  if (!user || !user.role) return false;
  return hasRole(user.role, allowedRoles);
};

/**
 * Get resource access level for user
 * Useful for determining what data to fetch or display
 * @param {string} userRole - User's role
 * @returns {string} - Access level: 'all', 'own', 'department', 'none'
 */
export const getAccessLevel = (userRole) => {
  const accessLevels = {
    admin: "all",
    teacher: "own",
    student: "own",
    parent: "own",
  };
  return accessLevels[userRole] || "none";
};

/**
 * Check if user can access resource based on ownership
 * @param {string} userRole - User's role
 * @param {string} resourceOwnerId - Owner ID of resource
 * @param {string} userId - Current user ID
 * @returns {boolean} - True if user can access
 */
export const canAccessResource = (userRole, resourceOwnerId, userId) => {
  if (userRole === "admin") return true;
  if (
    userRole === "student" ||
    userRole === "parent" ||
    userRole === "teacher"
  ) {
    return resourceOwnerId === userId;
  }
  return false;
};

/**
 * Validate user session expiry
 * @param {string} sessionExpiry - Session expiry timestamp
 * @returns {boolean} - True if session is still valid
 */
export const isSessionValid = (sessionExpiry) => {
  // If no session expiry is set, consider it valid (for development/fallback)
  if (!sessionExpiry) return true;
  // Check if current time is before expiry time
  return new Date() < new Date(sessionExpiry);
};

/**
 * Get remaining session time in seconds
 * @param {string} sessionExpiry - Session expiry timestamp
 * @returns {number} - Seconds remaining
 */
export const getSessionTimeRemaining = (sessionExpiry) => {
  if (!sessionExpiry) return 0;
  const remaining = new Date(sessionExpiry) - new Date();
  return Math.max(0, Math.floor(remaining / 1000));
};
