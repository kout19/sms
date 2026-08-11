const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

let prisma;

const createPrismaClient = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
};

const getPrisma = () => {
  if (!prisma) {
    prisma = createPrismaClient();
  }

  return prisma;
};

const connectDB = async () => {
  const client = getPrisma();
  await client.$connect();
  console.log("PostgreSQL connected via Prisma");
};

const disconnectDB = async () => {
  if (!prisma) {
    return;
  }

  await prisma.$disconnect();
  prisma = undefined;
};

module.exports = {
  getPrisma,
  connectDB,
  disconnectDB,
};
