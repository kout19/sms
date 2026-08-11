const { Pool } = require("pg");

const getConnectionConfig = () => {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    return {
      connectionString,
      ssl:
        process.env.DB_SSL === "true" ||
        connectionString.includes("sslmode=require")
          ? { rejectUnauthorized: false }
          : false,
    };
  }

  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "sms",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  };
};

const pool = new Pool(getConnectionConfig());

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error", error);
});

const connectDB = async () => {
  const client = await pool.connect();
  client.release();
  console.log("PostgreSQL connected");
};

const disconnectDB = async () => {
  await pool.end();
};

const query = (text, params) => pool.query(text, params);

const initDatabase = async () => {
await query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
  await query(`
    CREATE TABLE IF NOT EXISTS schools (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "schoolId" UUID REFERENCES schools(id) ON DELETE SET NULL,
      "firstName" VARCHAR(100) NOT NULL,
      "lastName" VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      "passwordHash" TEXT NOT NULL,
      role VARCHAR(50) NOT NULL,
      phone VARCHAR(50),
      "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
      "isEmailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
      "lastLogin" TIMESTAMPTZ,
      "passwordChangedAt" TIMESTAMPTZ,
      "refreshTokenVersion" INT NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_users_school_id ON users("schoolId");
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `);
};

module.exports = {
  pool,
  query,
  connectDB,
  disconnectDB,
  initDatabase,
};
