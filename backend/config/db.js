const { connectDB, disconnectDB } = require("../config/database");

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.disconnectDB = disconnectDB;
