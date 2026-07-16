import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

    loginSuccess(state, action) {
      const { id, firstName, lastName, email, role, accessToken, refreshToken } =
        action.payload;

      state.user = { id, firstName, lastName, email, role };
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.role = role;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
    },

    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    clearError(state) {
      state.error = null;
    },

    updateUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (action.payload.role) {
          state.role = action.payload.role;
        }
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
