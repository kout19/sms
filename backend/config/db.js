const { connectDB, disconnectDB } = require("../infrastructure/prisma");

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.disconnectDB = disconnectDB;
