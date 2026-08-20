// backend/middleware/tenantScope.js
const AppError = require("../utils/AppError");

// Must run AFTER authenticate (needs req.user to already be set).
// Sets req.tenant.schoolId - the ONLY source every module's service/repository
// layer should use for scoping queries. Never read schoolId from req.body,
// req.params, or req.query for authorization purposes - a client could put
// anything there.
const tenantScope = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  // super_admin is a platform-level role, not tied to one school - see note
  // below before using this on any route that also needs a real schoolId.
  if (req.user.role === "super_admin") {
    req.tenant = { schoolId: null, isPlatformAdmin: true };
    return next();
  }

  if (!req.user.schoolId) {
    return next(
      new AppError("User account is not associated with a school", 403),
    );
  }

  req.tenant = { schoolId: req.user.schoolId, isPlatformAdmin: false };
  next();
};

module.exports = tenantScope;
