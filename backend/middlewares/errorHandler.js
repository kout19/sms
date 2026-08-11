const AppError = require("../utils/AppError");

const PRISMA_ERROR_CODES = {
  UNIQUE_VIOLATION: "P2002",
  RECORD_NOT_FOUND: "P2025",
  FOREIGN_KEY_VIOLATION: "P2003",
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  const errors = err.errors || null;

  if (err instanceof AppError) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(err.errors).map((item) => item.message),
    });
  }

  if (err.code === PRISMA_ERROR_CODES.UNIQUE_VIOLATION) {
    const target = err.meta?.target;

    return res.status(409).json({
      success: false,
      message: "Duplicate field value entered",
      errors: Array.isArray(target)
        ? target.map((field) => `Duplicate value for ${field}`)
        : ["Duplicate field value entered"],
    });
  }

  if (err.code === PRISMA_ERROR_CODES.RECORD_NOT_FOUND) {
    return res.status(404).json({
      success: false,
      message: "Record not found",
      errors: null,
    });
  }

  if (err.code === PRISMA_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
    return res.status(400).json({
      success: false,
      message: "Related record not found",
      errors: null,
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = errorHandler;
