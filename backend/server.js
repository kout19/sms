require("dotenv").config();
const app = require("./app");
const prisma = require("./config/prisma");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await prisma.$connect();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    server.close(() => {
      console.log("Server closed, DB connection ended");
      process.exit(0);
    });
  });
};

startServer();
