/**
 * Authentication Service
 * Placeholder async functions ready for Express + JWT + MongoDB backend integration.
 */

const NOT_CONNECTED_MESSAGE =
  "Authentication service is not connected yet. Configure the backend API integration.";

export const login = async (_credentials) => {
  return Promise.reject(new Error(NOT_CONNECTED_MESSAGE));
};

export const logout = async () => {
  return Promise.resolve({
    success: true,
    message: "Logged out successfully.",
  });
};

export const forgotPassword = async (_email) => {
  return Promise.resolve({
    success: true,
    message: "Password reset request prepared for backend integration.",
  });
};

export const resetPassword = async (_payload) => {
  return Promise.resolve({
    success: true,
    message: "Password reset request prepared for backend integration.",
  });
};

export const refreshToken = async (_token) => {
  return Promise.reject(new Error(NOT_CONNECTED_MESSAGE));
};
