/**
 * Authentication Service
 * Placeholder async functions ready for Express + JWT + MongoDB backend integration.
 */

const NOT_CONNECTED_MESSAGE =
  "Authentication service is not connected. Configure the backend API integration.";

export const login = async (_credentials) => {
  return Promise.reject(new Error(NOT_CONNECTED_MESSAGE));
};

export const logout = async () => {
  return Promise.resolve({ success: true });
};

export const forgotPassword = async (_email) => {
  return Promise.reject(new Error(NOT_CONNECTED_MESSAGE));
};

export const resetPassword = async (_payload) => {
  return Promise.reject(new Error(NOT_CONNECTED_MESSAGE));
};

export const refreshToken = async (_token) => {
  return Promise.reject(new Error(NOT_CONNECTED_MESSAGE));
};
