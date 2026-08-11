require("dotenv").config();
const app = require("./app");
const { connectDB, disconnectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  process.on("SIGINT", async () => {
    await disconnectDB();
    server.close(() => {
      console.log("Server closed, DB connection ended");
      process.exit(0);
    });
  });
};

startServer();
