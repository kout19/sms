import { createSlice } from "@reduxjs/toolkit";
import { mockUsers, formatAuthResponse } from "./mockUsers";

/**
 * Auth Slice - Manages authentication state and actions
 * Professional structure ready for backend integration
 */

const initialState = {
  // User and authentication state
  user: mockUsers.admin, // Default to admin for development
  token: `mock_token_admin_${Date.now()}`,
  refreshToken: `mock_refresh_admin_${Date.now()}`,
  isAuthenticated: true,

  // Loading and error states
  loading: false,
  error: null,

  // Session management
  lastLoginTime: new Date().toISOString(),
  sessionExpiry: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    /**
     * Login action - Simulates login with mock user
     * In production: replace with actual API call
     */
    loginAs(state, action) {
      const user = action.payload;
      const authResponse = formatAuthResponse(user);

      state.user = user;
      state.token = authResponse.data.token;
      state.refreshToken = authResponse.data.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      state.lastLoginTime = new Date().toISOString();
      state.sessionExpiry = new Date(
        Date.now() + authResponse.data.expiresIn * 1000,
      ).toISOString();
      state.loading = false;
    },

    /**
     * Logout action - Clears authentication state
     */
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      state.sessionExpiry = null;
    },

    /**
     * Set error - For error state management
     */
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    /**
     * Clear error - Clears error messages
     */
    clearError(state) {
      state.error = null;
    },

    /**
     * Set loading - For loading state management
     */
    setLoading(state, action) {
      state.loading = action.payload;
    },

    /**
     * Update user profile - For profile updates
     */
    updateUserProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    /**
     * Refresh session - Simulates token refresh
     * In production: would call refresh token endpoint
     */
    refreshSession(state) {
      if (state.user) {
        const authResponse = formatAuthResponse(state.user);
        state.token = authResponse.data.token;
        state.refreshToken = authResponse.data.refreshToken;
        state.sessionExpiry = new Date(
          Date.now() + authResponse.data.expiresIn * 1000,
        ).toISOString();
        state.error = null;
      }
    },

    /**
     * Initialize auth - Called on app startup to restore session
     */
    initializeAuth(state, action) {
      const savedAuth = action.payload;
      if (savedAuth && savedAuth.user) {
        state.user = savedAuth.user;
        state.token = savedAuth.token;
        state.isAuthenticated = true;
      }
    },
  },
});

export const {
  loginAs,
  logout,
  setError,
  clearError,
  setLoading,
  updateUserProfile,
  refreshSession,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
