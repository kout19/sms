require("./load-env");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be provided by backend/.env or the container environment.");
}

let parsedUrl;
try {
  parsedUrl = new URL(connectionString);
} catch {
  throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL.");
}

if (
  !["postgres:", "postgresql:"].includes(parsedUrl.protocol) ||
  !parsedUrl.hostname
) {
  throw new Error("DATABASE_URL must target a PostgreSQL host.");
}

module.exports = Object.freeze({
  connectionString,
  hostname: parsedUrl.hostname,
});
