const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const databaseConfig = require("./database-url");

const adapter = new PrismaPg({
  connectionString: databaseConfig.connectionString,
});

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query"] : [],
});

if (typeof prisma.subject === "undefined") {
  throw new Error(
    "Generated Prisma Client is missing the Subject model. Run `npm run db:generate` in backend and restart the server.",
  );
}
if (
  typeof prisma.class === "undefined" ||
  typeof prisma.section === "undefined" ||
  typeof prisma.enrollment === "undefined"
) {
  throw new Error(
    "Generated Prisma Client is missing class management models. Run `npm run db:generate` in backend and restart the server.",
  );
}

module.exports = prisma;
