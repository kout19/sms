const { login, refreshToken, logout } = require("./auth.service");
const { cookieOptions } = require("../../config/cookies");
const asyncHandler = require("../../utils/asyncHandler");
const { validateLoginRequest } = require("./auth.validation");
const env = require("../../config/env");

const loginController = asyncHandler(async (req, res) => {
  validateLoginRequest(req);

  const {
    accessToken,
    refreshToken: newRefreshToken,
    user,
  } = await login(req.body);
  // console.log(user);

  res.cookie(env.cookie.name, newRefreshToken, cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    user,
  });
});

const logoutController = asyncHandler(async (req, res) => {
  await logout(res);
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

const refreshTokenController = asyncHandler(async (req, res) => {
  const refreshTokenValue = req.cookies?.refreshToken;
  const { accessToken, user } = await refreshToken(refreshTokenValue);

  return res.status(200).json({
    success: true,
    accessToken,
    user,
  });
});

module.exports = {
  loginController,
  logoutController,
  refreshTokenController,
};
