import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  bootstrapping: false,
  bootstrapped: false,
  error: null,
};

 const normalizeUser = (user = null) => 
  {
  if (!user) {
    return null;
  }

  return {
    id: user._id || user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    role: user.role,
    isActive: user.isActive ?? true,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: user.lastLogin,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

    beginAuthBootstrap(state) {
      state.bootstrapping = true;
      state.error = null;
    },

    completeAuthBootstrap(state) {
      state.bootstrapping = false;
      state.bootstrapped = true;
    },

    loginSuccess(state, action) {
      const { user, accessToken } = action.payload;

      state.user = normalizeUser(user);
      state.accessToken = accessToken;
      state.role = user?.role || state.role;
      state.isAuthenticated = Boolean(accessToken && state.user);
      state.loading = false;
      state.error = null;
      state.bootstrapped = true;
    },

    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.role = null;
      state.bootstrapped = true;
    },

    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.bootstrapping = false;
      state.bootstrapped = true;
      state.refreshToken = null;
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
  beginAuthBootstrap,
  completeAuthBootstrap,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
