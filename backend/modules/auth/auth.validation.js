const AppError = require("../../utils/AppError");

const validateLoginRequest = (req) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !String(email).trim()) {
    errors.push("Email is required");
  }

  if (!password || !String(password).trim()) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }
};

module.exports = {
  validateLoginRequest,
};
