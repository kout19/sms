const userRepository = require("../users/user.repository");
const { toSafeUser } = require("@packages/shared");

const { comparePassword } = require("../users/user.helpers");
const env = require("../../config/env");
const AppError = require("../../utils/AppError");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../config/jwt");
const { cookieOptions } = require("../../config/cookies");
const { school } = require("../../config/prisma");

const login = async ({ email, password }) => {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const user = await userRepository.findByEmailWithPassword(normalizedEmail);
  console.log("LOGIN FETCHED USER:", JSON.stringify(user, null, 2));

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("User account is inactive", 403);
  }

  const accessToken = generateAccessToken({
    sub: user.id,
    role: user.role,
    schoolId: user.schoolId,
  });

  const refreshToken = generateRefreshToken({
    sub: user.id,
    role: user.role,
  });

  const updatedUser = await userRepository.updateLastLogin(user.id);

  return {
    accessToken,
    refreshToken,
    user: toSafeUser(updatedUser),
  };
  console.log("LOGIN USER:", JSON.stringify(user, null, 2));
};


const refreshToken = async (refreshTokenValue) => {
  if (!refreshTokenValue) {
    throw new AppError("Refresh token is required", 401);
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshTokenValue);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await userRepository.findById(payload.sub);

  if (!user || !user.isActive) {
    throw new AppError("User is not authorized", 401);
  }

  const accessToken = generateAccessToken({
    sub: user.id,
    role: user.role,
    schoolId: user.schoolId,
  });

  return {
    accessToken,
    user: toSafeUser(user),
  };
};

const logout = async (res) => {
  res.clearCookie(env.cookie.name, cookieOptions);
};

module.exports = {
  login,
  refreshToken,
  logout,
};
