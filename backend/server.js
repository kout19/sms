const databaseConfig = require("./config/database-url");
const app = require("./app");
const prisma = require("./config/prisma");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`Database connected (${databaseConfig.hostname})`);
  } catch (error) {
    console.error(
      `Database connection failed for ${databaseConfig.hostname} (${error.code || error.name})`,
    );
    await prisma.$disconnect();
    process.exitCode = 1;
    return;
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = async () => {
    await prisma.$disconnect();
    server.close(() => {
      console.log("Server closed, DB connection ended");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer().catch((error) => {
  console.error(`Backend startup failed (${error.code || error.name})`);
  process.exitCode = 1;
});
