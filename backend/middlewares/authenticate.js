const jwt = require("jsonwebtoken");
const userRepository = require("../modules/users/user.repository");
const { toSafeUser } = require("@packages/shared"); // was: "../modules/users/user.helpers"
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

    // Only the user id comes from the token. Everything else - schoolId,
    // role, isActive - is re-fetched fresh from the DB on every request,
    // so a stale or tampered JWT claim can never grant access it shouldn't.
    const user = await userRepository.findById(payload.sub);

    if (!user) {
      return next(new AppError("Authenticated user not found", 401));
    }

    if (!user.isActive) {
      return next(new AppError("User account is inactive", 403));
    }

    req.user = toSafeUser(user); // now guaranteed to include schoolId - tenantScope depends on this
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
