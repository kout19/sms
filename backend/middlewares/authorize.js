const AppError = require("../utils/AppError");

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(
        new AppError("You are not authorized to access this resource", 403),
      );
    }

    next();
  };
};

module.exports = authorize;
