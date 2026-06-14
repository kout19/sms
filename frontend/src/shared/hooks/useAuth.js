/**
 * useAuth Hook - Custom React Hook for Authentication
 * Provides easy access to auth state and actions throughout the app
 * Designed for seamless integration with both mock and real backend
 */

import { useSelector, useDispatch } from "react-redux";
import {
  loginAs,
  logout,
  setError,
  clearError,
  updateUserProfile,
  refreshSession,
} from "../../features/auth/authSlice";
import {
  hasPermission,
  hasRole,
  isSessionValid,
  getSessionTimeRemaining,
  getRolePermissions,
  getRoleInfo,
} from "../utils/rbacUtils";

/**
 * useAuth - Hook to access authentication state and actions
 * @returns {object} - Auth state and action methods
 *
 * Usage:
 * const { user, isAuthenticated, login, logout, hasPermission } = useAuth();
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    sessionExpiry,
    lastLoginTime,
  } = authState;

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,
    sessionExpiry,
    lastLoginTime,

    // Utility checks
    isSessionValid: isSessionValid(sessionExpiry),
    sessionTimeRemaining: getSessionTimeRemaining(sessionExpiry),

    // Actions
    login: (mockUser) => {
      dispatch(loginAs(mockUser));
    },

    logout: () => {
      dispatch(logout());
    },

    setError: (errorMessage) => {
      dispatch(setError(errorMessage));
    },

    clearError: () => {
      dispatch(clearError());
    },

    updateProfile: (profileData) => {
      dispatch(updateUserProfile(profileData));
    },

    refreshSessionToken: () => {
      dispatch(refreshSession());
    },

    // Permission checks
    can: (permission) => {
      return user && hasPermission(user.role, permission);
    },

    hasRole: (roles) => {
      return user && hasRole(user.role, roles);
    },

    getRolePermissions: () => {
      return user ? getRolePermissions(user.role) : [];
    },

    getRoleInfo: () => {
      return user ? getRoleInfo(user.role) : null;
    },

    // User type checks
    isAdmin: () => user?.role === "admin",
    isTeacher: () => user?.role === "teacher",
    isStudent: () => user?.role === "student",
    isParent: () => user?.role === "parent",
  };
};

