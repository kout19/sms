const jwt = require("jsonwebtoken");
const env = require("./env");

const ACCESS_TOKEN_SECRET = env.accessTokenSecret;
const REFRESH_TOKEN_SECRET = env.refreshTokenSecret;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "JWT secrets are missing. Please define ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET in your environment.",
  );
}

const generateAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

const verifyAccessToken = (token) => jwt.verify(token, ACCESS_TOKEN_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_TOKEN_SECRET);

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
