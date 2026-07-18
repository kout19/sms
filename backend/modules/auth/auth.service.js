const User = require("../users/user.model");
const AppError = require("../../utils/AppError");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../config/jwt");
const { cookieOptions } = require("../../config/cookies");

const login = async ({ email, password }) => {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("User account is inactive", 403);
  }

  const accessToken = generateAccessToken({
    sub: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    sub: user._id,
    role: user.role,
  });

  user.lastLogin = new Date();
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: user.toSafeObject(),
  };
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

  const user = await User.findById(payload.sub).select("-password");

  if (!user || !user.isActive) {
    throw new AppError("User is not authorized", 401);
  }

  const accessToken = generateAccessToken({
    sub: user._id,
    role: user.role,
  });

  return {
    accessToken,
    user: user.toSafeObject(),
  };
};

const logout = async (res) => {
  res.clearCookie("refreshToken", cookieOptions);
};

module.exports = {
  login,
  refreshToken,
  logout,
};
