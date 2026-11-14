const env = require("./env");

const cookieOptions = {
  httpOnly: env.cookie.httpOnly,
  secure: env.cookie.secure,
  sameSite: env.cookie.sameSite || "lax",
  maxAge: env.cookie.maxAge,
  path: "/",
};

module.exports = {
  cookieOptions,
};
