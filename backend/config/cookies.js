const env = require("./env");

const cookieOptions = {
  httpOnly: env.cookie.httpOnly,
  secure: env.cookie.secure,
  sameSite: env.cookie.sameSite,
  maxAge: env.cookie.maxAge,
};

module.exports = {
  cookieOptions,
};
