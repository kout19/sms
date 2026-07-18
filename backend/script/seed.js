// seed.js
const mongoose = require("mongoose");
const User = require("../modules/users/user.model") // Adjust this path to your actual User model file
const dotenv = require("dotenv");

dotenv.config();

const sampleUsers = [
  {
    firstName: "Sarah",
    lastName: "Admin",
    email: "admin@school.com",
    password: "Admin123!", // This will be automatically hashed by your pre-save hook
    role: "admin",
    phone: "+1234567890",
    isEmailVerified: true,
  },
  {
    firstName: "Alex",
    lastName: "Teacher",
    email: "teacher@school.com",
    password: "Teacher123!",
    role: "teacher",
    phone: "+1234567891",
    isEmailVerified: true,
  },
  {
    firstName: "Emma",
    lastName: "Student",
    email: "emma@school.com",
    password: "Student123!",
    role: "student",
    phone: null,
    isEmailVerified: true,
  },
  {
    firstName: "Robert",
    lastName: "Parent",
    email: "parent@school.com",
    password: "Parent123!",
    role: "parent",
    phone: "+1234567892",
    isEmailVerified: true,
  },
];

async function seedDatabase() {
  try {
    // 1. Connect to your MongoDB Atlas cluster using your environment variable
    const DB_URI =
      process.env.MONGO_URI ||
      "mongodb+srv://db_user:v7oWFDxxUcecjUjO@cluster0.wifga0j.mongodb.net/sms?retryWrites=true&w=majority"; // Fallback to local DB if env variable is not set
    await mongoose.connect(DB_URI);
    console.log("🔄 Connected to MongoDB Atlas...");

    // 2. Clear out existing users to prevent duplicate key errors (optional but clean for dev)
    await User.deleteMany({});
    console.log("🧹 Cleared existing users from the collection.");

    // 3. Insert the sample records
    // We use .create() loop or array so that Mongoose triggers the pre-save password hashing hooks
    await User.create(sampleUsers);
    console.log("✅ Sample data successfully inserted into MongoDB Atlas!");

    // 4. Disconnect safely
    await mongoose.disconnect();
    console.log("🔌 Disconnected safely from database.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
