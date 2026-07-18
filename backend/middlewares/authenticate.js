const jwt = require("jsonwebtoken");
const User = require("../modules/users/user.model");
const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../config/jwt");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return next(new AppError("Authentication token is required", 401));
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new AppError("Access token expired", 401));
      }

      return next(new AppError("Invalid access token", 401));
    }

    const user = await User.findById(payload.sub).select("-password");

    if (!user) {
      return next(new AppError("Authenticated user not found", 401));
    }

    if (!user.isActive) {
      return next(new AppError("User account is inactive", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
