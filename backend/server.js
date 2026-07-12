require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // graceful shutdown
  process.on('SIGINT', async () => {
    await require('mongoose').connection.close();
    server.close(() => {
      console.log('Server closed, DB connection ended');
      process.exit(0);
    });
  });
};

startServer();