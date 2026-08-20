const AppError = require("../utils/AppError");
const { hasPermission } = require("@packages/shared");

const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }
    const allowed = requiredPermissions.some((p) =>
      hasPermission(req.user.role, p),
    );
    if (!allowed) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
};

module.exports = authorize;
