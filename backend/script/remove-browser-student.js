require("dotenv").config();
const prisma = require("../config/prisma");

prisma.user
  .deleteMany({ where: { email: "browser.check.student@example.com" } })
  .then((result) => {
    console.log("removed", result.count);
  })
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
