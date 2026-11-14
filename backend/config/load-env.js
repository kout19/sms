const path = require("node:path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "..", ".env");
const envResult = dotenv.config({ path: envPath, override: true });

if (envResult.error && envResult.error.code !== "ENOENT") {
  throw envResult.error;
}

if (process.platform === "win32" && envResult.error?.code === "ENOENT") {
  throw new Error("backend/.env is required when running the backend on Windows.");
}

module.exports = envPath;
